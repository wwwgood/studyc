/*
 * Gist 通道双向同步测试：gsSync 四分支——本机空恢复云端、两端都有按时间戳合并
 * （学习进度并集、金币取大，写回本机并上传），旧进度绝不冲掉新进度。
 */
const { test } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const SRC = path.join(__dirname, "..", "src", "scripts");
const FILES = ["core/state.js", "modules/cloud-sync.js", "modules/gist-sync.js"];

function makeCtx(cloudDataObj, localMainDb) {
  const calls = { get: 0, patch: 0 };
  const cloudContent = JSON.stringify({ app: "studyc-sync", updatedAt: new Date().toISOString(), data: cloudDataObj });
  const store = {
    sc_gist: JSON.stringify({ token: "t", gistId: "gid123", auto: true }),
  };
  if (localMainDb) store["cppsAdventureV2"] = JSON.stringify(localMainDb);
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
        if (opts && opts.method === "PATCH") { calls.patch++; return Promise.resolve({ ok: true, json: () => Promise.resolve({}) }); }
        calls.get++;
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ files: { "studyc-data.json": { content: cloudContent } } }) });
      }
      return Promise.reject(new Error("unexpected url: " + url));
    }
  };
  vm.createContext(sandbox);
  for (const f of FILES) vm.runInContext(fs.readFileSync(path.join(SRC, f), "utf8"), sandbox, { filename: f });
  return { sandbox, calls };
}

function db(passedObj, coins, updatedAt) {
  return { users: { "小明": { passed: passedObj, logs: [], errors: [], coins: coins || 0 } }, current: "小明", schemaVersion: 3, updatedAt: updatedAt || 0 };
}

test("gsSync：本机空、云端有 → 恢复云端最新", async () => {
  const cloudDb = db({ "l1": 1, "l2": 1 }, 30, 9000);
  const { sandbox, calls } = makeCtx({ "cppsAdventureV2": JSON.stringify(cloudDb) }, null);
  const r = await sandbox.gsSync(true);
  assert.strictEqual(r.action, "restore");
  assert.deepEqual(JSON.parse(sandbox.localStorage.getItem("cppsAdventureV2")).users["小明"].passed, { l1: 1, l2: 1 });
  assert.strictEqual(calls.patch, 0, "恢复不上传");
});

test("gsSync：两端都有 → 按时间戳合并（进度并集、金币取大、写回并上传）", async () => {
  const cloudDb = db({ "l1": 1, "l3": 1 }, 50, 9000);
  const localDb = db({ "l1": 1, "l2": 1 }, 10, 7000);
  const { sandbox, calls } = makeCtx({ "cppsAdventureV2": JSON.stringify(cloudDb) }, localDb);
  const r = await sandbox.gsSync(true);
  assert.strictEqual(r.action, "merge");
  const local = JSON.parse(sandbox.localStorage.getItem("cppsAdventureV2"));
  assert.deepEqual(local.users["小明"].passed, { l1: 1, l2: 1, l3: 1 }, "两端进度并集，旧的没被冲掉");
  assert.strictEqual(local.users["小明"].coins, 50, "金币取大");
  assert.ok(local.updatedAt >= 9000, "合并后时间取两端较新（旧档打开会补当前时间戳）");
  assert.strictEqual(calls.patch, 1, "合并结果已上传云端（PATCH 一次）");
});

test("gsSync：本机有、云端空 → 上传本机", async () => {
  const localDb = db({ "l1": 1 }, 5, 3000);
  const { sandbox, calls } = makeCtx({}, localDb);
  const r = await sandbox.gsSync(true);
  assert.strictEqual(r.action, "push");
  assert.strictEqual(calls.patch, 1);
});
