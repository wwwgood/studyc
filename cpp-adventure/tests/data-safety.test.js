/* 数据安全静态校验：任何改动不得破坏「数据不丢失」防线。
 * 随 npm test（node --test）自动运行，违规即测试失败。
 * 规则依据：项目根 DATA-SAFETY.md（改代码前必读）。 */
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..", "src", "scripts");
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");

const state = read("core/state.js");
const sync = read("modules/sync.js");
const cs = read("modules/cloud-sync.js");
const user = read("modules/user.js");
const init = read("core/init.js");

test("铁律1：saveS 必须含空库写保护", () => {
  assert.ok(state.includes("空库写保护"), "state.js saveS 缺少空库写保护");
  assert.ok(state.includes("dbHasReal(SDB)"), "saveS 未用 dbHasReal 判定空库");
  assert.ok(state.includes("__SAVE_BLOCKED__"), "saveS 缺少被拦截标记");
});

test("铁律2：loadDB 迁移/解析异常必须置 __DB_LOAD_ERROR__ 且不静默返回空", () => {
  assert.ok(state.includes("__DB_LOAD_ERROR__ = true"), "loadDB 未设置异常标记");
  assert.ok(state.includes("已保护原始数据不覆盖"), "loadDB 异常未保留原始数据说明");
  assert.ok(init.includes("ensureDefaultUser()"), "init 加载链仍在");
});

test("铁律3：ensureDefaultUser 在异常时不得建空用户写回", () => {
  assert.ok(state.includes("function ensureDefaultUser(){"), "ensureDefaultUser 存在");
  assert.ok(state.includes("if (__DB_LOAD_ERROR__)"), "ensureDefaultUser 未在异常时短路");
});

test("铁律4：主存档写入只能经 saveS，禁止裸写/删除/清空", () => {
  const bare = /localStorage\.setItem\(\s*KEY\s*,/g;
  const matches = state.match(bare) || [];
  assert.ok(matches.length <= 1, `state.js 存在绕过 saveS 的裸写（${matches.length} 处）`);
  assert.ok(!state.includes("localStorage.removeItem(KEY"), "禁止删除主存档");
  assert.ok(!state.includes("localStorage.clear()"), "禁止清空 localStorage");
});

test("铁律5：快照防呆——bkupNow 非强制模式必须做 dbHasReal 检查", () => {
  assert.ok(state.includes("function bkupNow(reason, force)"), "bkupNow 缺少 force 参数（无法区分强制留底）");
  assert.ok(state.includes("if (!force)"), "bkupNow 未在非强制时防空数据");
  assert.ok(state.includes("dbHasReal(chk)"), "bkupNow 未用 dbHasReal 防呆");
});

test("铁律5b：云端上传防呆——csPush 空数据不得上传", () => {
  assert.ok(cs.includes("!csHasLocalData()"), "cloud-sync csPush 未做空数据上传拦截");
  assert.ok(cs.includes("防止云端被空数据覆盖"), "cloud-sync 缺少防呆说明");
});

test("铁律7：空壳账号不算有数据——csHasLocalData 必须用 dbHasReal", () => {
  assert.ok(cs.includes('typeof dbHasReal === "function"'), "cloud-sync 未引用 dbHasReal");
});

test("铁律6：覆盖类操作（恢复/导入）前必须留底", () => {
  assert.ok(sync.includes('bkupNow("pre-restore", true)'), "快照恢复前未留底");
  assert.ok(sync.includes('bkupNow("pre-import", true)'), "文件导入前未留底");
});

test("铁律2b：doLogin 在存档异常时禁止新建账号", () => {
  assert.ok(user.includes("if (typeof __DB_LOAD_ERROR__ !== \"undefined\" && __DB_LOAD_ERROR__)"),
    "doLogin 未拦截存档异常状态");
});

test("dbHasReal 定义完整：空壳用户不算真实数据", () => {
  assert.ok(state.includes("function dbHasReal(db)"), "dbHasReal 未定义");
  assert.ok(state.includes("空壳"), "dbHasReal 缺少空壳判定");
  const f = state.slice(state.indexOf("function dbHasReal(db)"), state.indexOf("function dbHasReal(db)") + 600);
  assert.ok(f.includes("u.passed && Object.keys(u.passed).length > 0"), "passed 非空应算真实数据");
});

test("全仓扫描：无任何文件裸清 localStorage 或删主存档", () => {
  const files = [];
  const walk = (d) => {
    fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
      const fp = path.join(d, e.name);
      if (e.isDirectory()) walk(fp);
      else if (e.name.endsWith(".js")) files.push(fp);
    });
  };
  walk(ROOT);
  files.forEach((fp) => {
    const txt = fs.readFileSync(fp, "utf8");
    assert.ok(!txt.includes("localStorage.clear()"), `${fp} 出现 localStorage.clear()`);
    assert.ok(!txt.includes("localStorage.removeItem(KEY"), `${fp} 删除主存档`);
  });
});
