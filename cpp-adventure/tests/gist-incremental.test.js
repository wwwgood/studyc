/*
 * Gist 增量同步（v2 分段）测试：
 *  - 每个键一个分段文件 + studyc-meta.json 哈希清单
 *  - 首次同步自动迁移并删除旧整包 studyc-data.json
 *  - 无变化只写 meta；单键变化只传该段（一次 PATCH 批量）
 *  - 新设备从分段格式完整恢复
 *  - 本地 IndexedDB 增量快照：bkupDiffData 语义 + 防回归锚点
 */
const { test } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const SRC = path.join(__dirname, "..", "src", "scripts");
const FILES = ["core/state.js", "modules/cloud-sync.js", "modules/gist-sync.js"];

/* 可变 mock Gist：GET 返回当前 files；PATCH 按 GitHub 语义改写（null=删除） */
function makeCtx(cloudFiles, localStoreExtra) {
  const calls = { patchBodies: [], get: 0 };
  const files = Object.assign({}, cloudFiles);
  const store = Object.assign({
    sc_gist: JSON.stringify({ token: "t", gistId: "gid123", auto: true }),
  }, localStoreExtra || {});
  const sandbox = {
    console: { log(){}, warn(){}, error(){} },
    setTimeout(fn){ return 0; }, clearTimeout(){},
    confirm: () => true,
    location: { reload(){} },
    navigator: {},
    localStorage: {
      _s: store,
      getItem(k){ return this._s[k] == null ? null : this._s[k]; },
      setItem(k, v){ this._s[k] = String(v); },
      removeItem(k){ delete this._s[k]; },
      get length(){ return Object.keys(this._s).length; },
      key(i){ return Object.keys(this._s)[i] || null; }
    },
    document: { getElementById: () => null, createElement: () => ({ style: {}, select(){} }) },
    window: { addEventListener(){} },
    fetch: function (url, opts) {
      if (String(url).indexOf("api.github.com/gists") >= 0) {
        if (opts && opts.method === "PATCH") {
          const body = JSON.parse(opts.body);
          calls.patchBodies.push(body.files);
          Object.keys(body.files).forEach((name) => {
            if (body.files[name] === null) delete files[name];
            else files[name] = { content: body.files[name].content };
          });
          return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
        }
        calls.get++;
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ files }) });
      }
      return Promise.reject(new Error("unexpected url: " + url));
    }
  };
  vm.createContext(sandbox);
  for (const f of FILES) vm.runInContext(fs.readFileSync(path.join(SRC, f), "utf8"), sandbox, { filename: f });
  return { sandbox, calls, files };
}

function db(passedObj, coins, updatedAt) {
  return { users: { "小明": { passed: passedObj, logs: [], errors: [], coins: coins || 0 } }, current: "小明", schemaVersion: 3, updatedAt: updatedAt || 0 };
}

test("纯函数：分段命名稳定、哈希可判变化", () => {
  const { sandbox } = makeCtx({}, {});
  assert.strictEqual(sandbox.gsFileSafeKey("cppsAdventureV2"), "studyc-cppsAdventureV2.json");
  assert.strictEqual(sandbox.gsFileSafeKey("ba_backup_2026-09-12T06:11:26"), sandbox.gsFileSafeKey("ba_backup_2026-09-12T06:11:26"), "命名稳定");
  assert.notStrictEqual(sandbox.gsFileSafeKey("a:b"), sandbox.gsFileSafeKey("a_c"), "不同键不撞名");
  assert.strictEqual(sandbox.gsHashStr("abc"), sandbox.gsHashStr("abc"), "同内容同哈希");
  assert.notStrictEqual(sandbox.gsHashStr("abc"), sandbox.gsHashStr("abd"), "不同内容不同哈希");
  const seg = sandbox.gsSegmentFiles({ k1: "v1", k2: "v2" });
  assert.strictEqual(JSON.stringify(Object.keys(seg.files).sort()), JSON.stringify(["studyc-k1.json", "studyc-k2.json"]));
  assert.strictEqual(seg.keys["studyc-k1.json"].key, "k1");
});

test("首次同步：旧整包自动迁移为分段 + 删除旧文件（1 次 PATCH 批量）", async () => {
  const cloudDb = db({ "l1": 1, "l3": 1 }, 50, 9000);
  const localDb = db({ "l1": 1, "l2": 1 }, 10, 7000);
  const legacy = JSON.stringify({ app: "studyc-sync", updatedAt: new Date().toISOString(), data: { "cppsAdventureV2": JSON.stringify(cloudDb) } });
  const { sandbox, calls, files } = makeCtx({ "studyc-data.json": { content: legacy } }, { "cppsAdventureV2": JSON.stringify(localDb) });
  const r = await sandbox.gsSync(true);
  assert.strictEqual(r.action, "merge");
  assert.strictEqual(calls.patchBodies.length, 1, "迁移只发一次 PATCH");
  const body = calls.patchBodies[0];
  assert.strictEqual(body["studyc-data.json"], null, "旧整包文件被删除");
  assert.ok(body["studyc-meta.json"] && JSON.parse(body["studyc-meta.json"].content).version === 2, "meta 清单已写入");
  assert.ok(body["studyc-cppsAdventureV2.json"], "变更段已上传");
  assert.ok(!("studyc-data.json" in files) && files["studyc-meta.json"], "mock 云端已是分段格式");
});

test("增量：无变化只写 meta；单键变化只传该段", async () => {
  const localDb = db({ "l1": 1 }, 5, 3000);
  const segFiles = {
    "studyc-cppsAdventureV2.json": { content: JSON.stringify(localDb) },
    "studyc-meta.json": { content: JSON.stringify({ app: "studyc-sync-meta", version: 2, updatedAt: "t0", keys: {
      "studyc-cppsAdventureV2.json": { key: "cppsAdventureV2", hash: null },
    } }) },
  };
  const { sandbox, calls } = makeCtx(segFiles, { "cppsAdventureV2": JSON.stringify(localDb) });
  /* 先算好正确的哈希（与实现一致的 FNV-1a 由实现自身提供） */
  segFiles["studyc-meta.json"].content = JSON.stringify({ app: "studyc-sync-meta", version: 2, updatedAt: "t0", keys: {
    "studyc-cppsAdventureV2.json": { key: "cppsAdventureV2", hash: sandbox.gsHashStr(JSON.stringify(localDb)) },
  } });

  /* 1) 第一次合并：主档被合并重算（时间戳取两端较新）→ 主档段会上传一次，
   *    同时 meta 哈希刷新为合并后的内容 */
  await sandbox.gsSync(true);
  assert.strictEqual(calls.patchBodies.length, 1);
  let body = calls.patchBodies[0];
  assert.ok(body["studyc-meta.json"], "meta 已刷新");

  /* 2) 本机云端已一致、无新变化 → 第二次同步 PATCH 里零数据段（增量生效） */
  await sandbox.gsSync(true);
  assert.strictEqual(calls.patchBodies.length, 2);
  body = calls.patchBodies[1];
  assert.strictEqual(Object.keys(body).filter((k) => k !== "studyc-meta.json").length, 0, "无变化不传任何段");

  /* 3) 本机学了一关 → 只传主档那一段 */
  const newDb = db({ "l1": 1, "l2": 1 }, 15, 5000);
  sandbox.localStorage.setItem("cppsAdventureV2", JSON.stringify(newDb));
  await sandbox.gsSync(true);
  assert.strictEqual(calls.patchBodies.length, 3);
  body = calls.patchBodies[2];
  assert.deepStrictEqual(Object.keys(body).filter((k) => k !== "studyc-meta.json"), ["studyc-cppsAdventureV2.json"], "只传变化的段");
  assert.ok(body["studyc-cppsAdventureV2.json"].content.indexOf('"l2"') >= 0, "段内容是新进度");
});

test("新设备：云端分段格式 → 本机空 → 完整恢复所有键", async () => {
  const cloudDb = db({ "l1": 1, "l2": 1 }, 30, 9000);
  const segFiles = {
    "studyc-cppsAdventureV2.json": { content: JSON.stringify(cloudDb) },
    "studyc-sc_books.json": { content: JSON.stringify({ books: [1, 2] }) },
    "studyc-meta.json": { content: JSON.stringify({ app: "studyc-sync-meta", version: 2, updatedAt: "t1", keys: {
      "studyc-cppsAdventureV2.json": { key: "cppsAdventureV2", hash: "x" },
      "studyc-sc_books.json": { key: "sc_books", hash: "y" },
    } }) },
  };
  const { sandbox, calls } = makeCtx(segFiles, null);
  const r = await sandbox.gsSync(true);
  assert.strictEqual(r.action, "restore");
  assert.strictEqual(JSON.parse(sandbox.localStorage.getItem("cppsAdventureV2")).users["小明"].coins, 30, "主档已恢复");
  assert.strictEqual(sandbox.localStorage.getItem("sc_books"), JSON.stringify({ books: [1, 2] }), "其他键也从分段恢复");
  assert.strictEqual(calls.patchBodies.length, 0, "恢复不上传");
});

test("本地快照：bkupDiffData 只保留变化键；快照代码带增量锚点", () => {
  const { sandbox } = makeCtx({}, {});
  const J = (x) => JSON.stringify(x);
  assert.strictEqual(sandbox.bkupDiffData({ a: "1" }, null), null, "cache 未知 → 返回 null（走全量）");
  assert.strictEqual(J(sandbox.bkupDiffData({ a: "1", b: "2" }, { a: "1" })), J({ b: "2" }), "只含新增键");
  assert.strictEqual(J(sandbox.bkupDiffData({ a: "9", b: "2" }, { a: "1", b: "2" })), J({ a: "9" }), "只含变化键");
  assert.strictEqual(J(sandbox.bkupDiffData({ a: "1" }, { a: "1", z: "9" })), J({}), "云端删键不进增量（全量锚点负责）");
  const state = fs.readFileSync(path.join(SRC, "core", "state.js"), "utf8");
  assert.ok(state.includes("full: full"), "快照记录全量/增量标记");
  assert.ok(state.includes("BKUP_SEQ % 6"), "每 6 份做一次全量锚点");
  assert.ok(state.includes("增量快照（"), "快照列表显示增量信息");
  assert.ok(state.includes("if (v == null) return;"), "恢复时空值防御");
});
