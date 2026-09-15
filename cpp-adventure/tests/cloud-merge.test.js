const fs = require("fs");
const path = require("path");
const vm = require("vm");
const test = require("node:test");
const assert = require("node:assert");
const srcDir = path.join(__dirname, "..", "src", "scripts");

function makeSandbox(store) {
  const sandbox = {
    console, Math, Date, JSON, Object, Array, String, Number, Boolean, RegExp, Error,
    parseInt, parseFloat, isNaN, setTimeout, clearTimeout, Promise,
    fetch: () => Promise.resolve({ json: () => Promise.resolve({}) }),
    confirm: () => true, location: { reload() {} }, indexedDB: null,
    Blob: function () {}, FileReader: function () {},
    URL: { createObjectURL: () => "", revokeObjectURL: () => {} },
    window: { addEventListener: () => {} },
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
      key: (i) => Object.keys(store)[i] || null,
      get length() { return Object.keys(store).length; }
    },
    document: { body: { style: {}, appendChild() {}, removeChild() {} }, getElementById: () => null, createElement: () => ({ style: {}, set textContent(v) {}, click() {} }) },
  };
  vm.createContext(sandbox);
  return sandbox;
}

function load(sb) {
  for (const f of ["core/state.js", "modules/cloud-sync.js"]) {
    vm.runInContext(fs.readFileSync(path.join(srcDir, f), "utf8"), sb, { filename: f });
  }
}

function db(users, updatedAt, current) {
  return { users, current: current || Object.keys(users)[0] || null, schemaVersion: 3, updatedAt };
}

test("csMergeDb：学习进度并集、错题去重、金币取大、时间取新", () => {
  const sb = makeSandbox({}); load(sb);
  const a = db({ "小指挥官": { passed: { l1: 1, l2: 1 }, errors: [{ q: "a", why: "x" }], coins: 10, fp: { ok: 1, err: 1 } } }, 1000);
  const b = db({ "小指挥官": { passed: { l2: 1, l3: 1 }, errors: [{ q: "a", why: "x" }, { q: "b", why: "y" }], coins: 5, fp: { ok: 0, err: 2 } } }, 2000);
  const m = sb.csMergeDb(a, b);
  assert.deepEqual(m.users["小指挥官"].passed, { l1: 1, l2: 1, l3: 1 });
  assert.strictEqual(m.users["小指挥官"].errors.length, 2, "错题按内容去重");
  assert.strictEqual(m.users["小指挥官"].coins, 10, "金币取大");
  assert.deepEqual(m.users["小指挥官"].fp, { ok: 1, err: 2 }, "fp 逐字段取大");
  assert.strictEqual(m.updatedAt, 2000, "更新时间取新");
});

test("csMergeDb：不同账号都保留、互不覆盖", () => {
  const sb = makeSandbox({}); load(sb);
  const a = db({ "小指挥官": { passed: { l1: 1 }, coins: 3 } }, 1000);
  const b = db({ "指挥官": { passed: { q1: 1 }, coins: 7 } }, 3000);
  const m = sb.csMergeDb(a, b);
  assert.deepEqual(Object.keys(m.users).sort(), ["指挥官", "小指挥官"].sort());
  assert.strictEqual(m.users["指挥官"].coins, 7);
  assert.strictEqual(m.users["小指挥官"].coins, 3);
});

test("csMergeSnapshot：主存档合并 + 其余键 JSON 并集 + 配置键排除", () => {
  const sb = makeSandbox({}); load(sb);
  const local = {
    "cppsAdventureV2": JSON.stringify(db({ "小指挥官": { passed: { l1: 1 }, eng: { done: { a: 1 }, coins: 2 } } }, 1000)),
    "sc_extra": JSON.stringify([1, 2]),
    "sc_cloud": "keep-local",
  };
  const cloud = {
    "cppsAdventureV2": JSON.stringify(db({ "小指挥官": { passed: { l2: 1 }, eng: { done: { b: 1 }, coins: 5 } } }, 2000)),
    "sc_extra": JSON.stringify([2, 3]),
  };
  const m = sb.csMergeSnapshot(local, cloud);
  const main = JSON.parse(m["cppsAdventureV2"]);
  assert.deepEqual(main.users["小指挥官"].passed, { l1: 1, l2: 1 });
  assert.deepEqual(main.users["小指挥官"].eng.done, { a: 1, b: 1 });
  assert.strictEqual(main.users["小指挥官"].eng.coins, 5, "eng 金币取大");
  assert.strictEqual(main.updatedAt, 2000);
  assert.deepEqual(JSON.parse(m["sc_extra"]), [1, 2, 3], "数组去重并集");
  assert.strictEqual(m["sc_cloud"], "keep-local", "本机配置键保留（合并时跳过云端配置）");
});

test("csMergeSnapshot：本机较新时字符串键取本机", () => {
  const sb = makeSandbox({}); load(sb);
  const local = {
    "cppsAdventureV2": JSON.stringify(db({ "小指挥官": { passed: { l1: 1 } } }, 5000)),
    "sc_note": "本机较新的备注",
  };
  const cloud = {
    "cppsAdventureV2": JSON.stringify(db({ "小指挥官": { passed: {} } }, 1000)),
    "sc_note": "云端旧备注",
  };
  const m = sb.csMergeSnapshot(local, cloud);
  assert.strictEqual(m["sc_note"], "本机较新的备注", "本机较新 → 字符串取本机");
});

test("csSync 四分支：本机空云端有 → 恢复；两端都有 → 合并写本机并上传", async () => {
  const cloudMain = db({ "平板用户": { passed: { x1: 1 }, coins: 20 } }, 9000, "平板用户");
  const store = { "sc_cloud": JSON.stringify({ url: "https://x.workers.dev", user: "u", token: "t" }) };
  const sb = makeSandbox(store);
  let uploads = [];
  sb.fetch = (url, opt) => {
    if (opt && opt.method === "POST") {
      const body = JSON.parse(opt.body);
      uploads.push(body.data);
      return Promise.resolve({ json: () => Promise.resolve({ ok: true, updatedAt: 99999 }) });
    }
    return Promise.resolve({ json: () => Promise.resolve({ ok: true, exists: true, updatedAt: 9000, data: { "cppsAdventureV2": JSON.stringify(cloudMain) } }) });
  };
  load(sb);

  /* 场景1：本机空 → 恢复云端 */
  let r = await sb.csSync({ reload: false });
  assert.strictEqual(r.action, "restore");
  assert.deepEqual(JSON.parse(store["cppsAdventureV2"]), cloudMain);

  /* 场景2：两端都有 → 合并（云端新增进度合入本机，本机旧进度不丢） */
  store["cppsAdventureV2"] = JSON.stringify(db({ "平板用户": { passed: { x1: 1, x2: 1 }, coins: 5 } }, 7000, "平板用户"));
  r = await sb.csSync({ reload: false });
  assert.strictEqual(r.action, "merge");
  const merged = JSON.parse(store["cppsAdventureV2"]);
  assert.deepEqual(merged.users["平板用户"].passed, { x1: 1, x2: 1 });
  assert.strictEqual(merged.users["平板用户"].coins, 20, "金币取大");
  assert.strictEqual(merged.updatedAt, 9000, "合并后时间取新");
  assert.ok(uploads.length >= 1, "合并结果已上传云端");
  assert.deepEqual(JSON.parse(uploads[0]["cppsAdventureV2"]), merged, "上传的就是合并结果，两边一致");
});
