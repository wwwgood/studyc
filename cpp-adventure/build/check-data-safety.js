/* 数据安全功能实测（JSDOM 模拟浏览器）：验证空库写保护、dbHasReal 判定真实生效。
 * 用法：node build/check-data-safety.js */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require(path.join("C:/Users/zb/.workbuddy/binaries/node/workspace/node_modules/jsdom"));

const SRC = path.join(__dirname, "..", "src");
const stateCode = fs.readFileSync(path.join(SRC, "scripts", "core", "state.js"), "utf8");

let pass = 0, fail = 0;
function ok(cond, name, extra){
  if (cond){ pass++; console.log("  ✅ " + name); }
  else { fail++; console.log("  ❌ " + name + (extra ? "  → " + extra : "")); }
}

const dom = new JSDOM("<!DOCTYPE html><body></body>", { url: "http://localhost/", runScripts: "dangerously" });
const w = dom.window;
w.eval("var LEVELS = []; var csMarkDirty = function(){}; var baToast = function(){};");
w.eval(stateCode);

console.log("\n【场景1】浏览器有真实数据，内存被清成空库 → saveS 必须拒绝覆盖");
w.localStorage.setItem("cppsAdventureV2", JSON.stringify({
  users: { "小明": { passed: { "1": true, "2": true }, fp: { ok: 30 } }, "小红": { passed: { "1": true } } },
  current: "小明", schemaVersion: 3
}));
w.eval("SDB = {users:{}, current:null}; S = {passed:{}};");
w.eval("var r = saveS();");
const after1 = JSON.parse(w.localStorage.getItem("cppsAdventureV2"));
ok(after1.users["小明"].passed["2"] === true, "原数据未被覆盖（小明 2 关仍在）", JSON.stringify(after1.users["小明"]));
ok(after1.users["小红"] !== undefined, "其他账号未丢");
ok(w.eval("r") === false, "saveS 返回 false（拒绝写入）");
ok(w.__SAVE_BLOCKED__ === true, "拦截标记 __SAVE_BLOCKED__ 已置位");

console.log("\n【场景2】首次使用（浏览器无存档）→ 允许写入空库");
w.localStorage.removeItem("cppsAdventureV2");
w.eval("SDB = {users:{}, current:null}; S = {passed:{}};");
w.eval("var r2 = saveS();");
ok(w.localStorage.getItem("cppsAdventureV2") !== null, "已写入新存档");
ok(w.eval("r2") === true, "saveS 返回 true");

console.log("\n【场景3】dbHasReal 判定");
ok(w.eval("dbHasReal({users:{\"A\":{passed:{\"1\":true}}},current:\"A\"})") === true, "真实进度=true");
ok(w.eval("dbHasReal({users:{\"A\":{passed:{}}},current:\"A\"})") === false, "空壳账号=false");
ok(w.eval("dbHasReal({users:{},current:null})") === false, "空库=false");
ok(w.eval("dbHasReal(null)") === false, "null=false");
ok(w.eval("dbHasReal({users:{\"A\":{fp:{ok:5}}},current:\"A\"})") === true, "有学习字段（fp）=true");

console.log("\n【场景4】快照防呆：空库时 bkupNow 不写快照");
w.eval("var snapBefore = []; var __fakeList = function(){};");
w.eval("BKUP_LAST = 0; bkupNow('save');");
/* 验证 bkupNow 内部：空库（localStorage 无真实数据）时不会调用 bkupWrite */
const src = stateCode.slice(stateCode.indexOf("function bkupNow"), stateCode.indexOf("function bkupNow") + 1200);
ok(src.includes("if (!force)") && src.includes("dbHasReal(chk)"), "bkupNow 源码含非强制防呆检查");

console.log("\n【场景5】loadDB 异常保护：迁移抛错时置 __DB_LOAD_ERROR__ 且不写回");
w.eval("__DB_LOAD_ERROR__ = false;");
w.localStorage.setItem("cppsAdventureV2", JSON.stringify({ users: { "甲": { passed: {} } }, current: "甲", schemaVersion: 2 }));
/* 人为破坏 migrate：把 MIGRATIONS[2] 换成抛错版本，模拟未来升级 bug */
w.eval("var __origM2 = MIGRATIONS[2]; MIGRATIONS[2] = function(){ throw new Error('migrate bug'); };");
w.eval("var __db = loadDB();");
ok(w.eval("__DB_LOAD_ERROR__") === true, "迁移失败已置异常标记");
ok(w.eval("localStorage.getItem('cppsAdventureV2')") !== null, "loadDB 未触碰 localStorage 原始数据");
/* 异常状态下 loadCurrentUser 不得写回 */
w.eval("loadCurrentUser();");
ok(w.eval("__DB_LOAD_ERROR__") === true, "异常标记跨 loadCurrentUser 保留");
ok(w.eval("JSON.parse(localStorage.getItem('cppsAdventureV2')).users['甲'] !== undefined"), "原始存档未被空库覆盖");
/* 异常状态下 ensureDefaultUser 不应建空用户 */
w.eval("var __usersBefore = Object.keys(SDB.users||{}).length;");
w.eval("ensureDefaultUser();");
w.eval("var __usersAfter = Object.keys(SDB.users||{}).length;");
ok(w.eval("__usersAfter") === w.eval("__usersBefore"), "ensureDefaultUser 未新增空用户");
ok(w.eval("localStorage.getItem('cppsAdventureV2')") !== null, "localStorage 未被清");
w.eval("MIGRATIONS[2] = __origM2;");

console.log("\n===== 结果：" + pass + " 通过 / " + fail + " 失败 =====");
process.exit(fail === 0 ? 0 : 1);
