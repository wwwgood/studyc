/*
 * 多设备保护测试：多台设备都自动上传时，进度旧的设备不得覆盖云端较新的数据。
 * 同时覆盖拉取确认框的规模对比提示。
 */
const { test } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const MOD = path.join(__dirname, "..", "src", "scripts", "modules", "gist-sync.js");

function makeCtx(cloudPayloadObj, localMainDb){
  const calls = { get: 0, patch: 0 };
  const cloudContent = JSON.stringify(cloudPayloadObj);
  const store = {
    sc_gist: JSON.stringify({ token: "t", gistId: "gid123", auto: true }),
    cppsAdventureV2: JSON.stringify(localMainDb)
  };
  const sandbox = {
    console: { log(){}, warn(){}, error(){} },
    setTimeout(fn){ return 0; }, clearTimeout(){},
    confirm: () => true,
    navigator: {},
    localStorage: {
      _s: store,
      getItem(k){ return this._s[k] == null ? null : this._s[k]; },
      setItem(k, v){ this._s[k] = String(v); },
      removeItem(k){ delete this._s[k]; },
      get length(){ return Object.keys(this._s).length; },
      key(i){ return Object.keys(this._s)[i] || null; }
    },
    document: { getElementById: () => null, createElement: () => ({ style: {}, select(){}, }) },
    fetch: function(url, opts){
      if (String(url).indexOf("api.github.com/gists") >= 0){
        if (opts && opts.method === "PATCH"){ calls.patch++; return Promise.resolve({ ok: true, json: () => Promise.resolve({}) }); }
        calls.get++;
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ files: { "studyc-data.json": { content: cloudContent } } }) });
      }
      return Promise.reject(new Error("unexpected url: " + url));
    }
  };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(MOD, "utf8"), sandbox, { filename: "gist-sync.js" });
  return { sandbox, calls };
}

function db(passedCount){
  const passed = {};
  for (let i = 1; i <= passedCount; i++) passed[String(i)] = true;
  return { users: { "小明": { passed: passed, logs: [], errors: [] } }, current: "小明", schemaVersion: 3 };
}

test("本机进度旧于云端时，自动上传必须被拦截（不发出 PATCH）", async () => {
  const { sandbox, calls } = makeCtx({ app: "studyc-sync", data: { "cppsAdventureV2": JSON.stringify(db(20)) } }, db(2));
  const r = await sandbox.gsPush(true); /* 静默自动上传 */
  assert.strictEqual(r, false, "旧数据自动上传应被拒绝");
  assert.strictEqual(calls.get, 1, "应先读取云端进行对比");
  assert.strictEqual(calls.patch, 0, "绝不能发出覆盖云端的 PATCH");
});

test("本机进度新于云端时，自动上传正常放行", async () => {
  const { sandbox, calls } = makeCtx({ app: "studyc-sync", data: { "cppsAdventureV2": JSON.stringify(db(1)) } }, db(9));
  const r = await sandbox.gsPush(true);
  assert.strictEqual(r, true, "新数据应正常上传");
  assert.strictEqual(calls.patch, 1, "应发出一次 PATCH");
});

test("云端为空/损坏时不受规模对比影响（按无数据处理，允许首次上传）", async () => {
  const { sandbox, calls } = makeCtx({ files: {} }, db(2));
  const r = await sandbox.gsPush(true);
  assert.strictEqual(r, true);
  assert.strictEqual(calls.patch, 1);
});

test("进度规模计算：闯关数占大头、日志错题计次、空数据为 0", () => {
  const { sandbox } = makeCtx({ app: "x", data: {} }, db(1));
  const s0 = sandbox.gsDataScore({});
  const s1 = sandbox.gsDataScore({ "cppsAdventureV2": JSON.stringify(db(1)) });
  const s5 = sandbox.gsDataScore({ "cppsAdventureV2": JSON.stringify(db(5)) });
  assert.strictEqual(s0, 0);
  assert.ok(s1 > 0, "有进度应大于 0");
  assert.ok(s5 > s1, "进度越多分越高");
});
