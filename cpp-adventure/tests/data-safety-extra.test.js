/* 数据安全防线扩展校验：2026-09 新增。
 * 覆盖 DATA-SAFETY.md 补充铁律：gist 上传防呆、恢复前留底、每日自动备份文件。
 * 随 npm test 运行，违规即失败（防止防线被回退）。 */
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..", "src", "scripts");
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");

const state = read("core/state.js");
const gist = read("modules/gist-sync.js");
const cs = read("modules/cloud-sync.js");
const sync = read("modules/sync.js");
const user = read("modules/user.js");

test("补充铁律A：gist 上传必须有真实数据防呆", () => {
  assert.ok(gist.includes("function gsPayloadHasReal"), "gist-sync 缺少云端有效数据判定函数");
  assert.ok(gist.includes("if (!gsPayloadHasReal(payload))"), "gsPush 未做空数据上传拦截");
  assert.ok(gist.includes("dbHasReal"), "gist-sync 未用 dbHasReal 判定");
});

test("补充铁律B：gist 拉取覆盖本机前必须确认 + 留底", () => {
  const pull = gist.slice(gist.indexOf("function gsPull"), gist.indexOf("function gsDisconnect"));
  assert.ok(pull.includes("confirm("), "gsPull 无覆盖确认弹窗");
  assert.ok(pull.includes('bkupNow("pre-gist-pull", true)'), "gsPull 覆盖前未留底");
});

test("补充铁律C：云端恢复 csApplyCloud 覆盖前必须留底", () => {
  assert.ok(cs.includes('bkupNow("pre-restore", true)'), "csApplyCloud 覆盖本机前未留底");
});

test("补充铁律D：旧存档导入器 importSave 必须留底 + 空数据防呆", () => {
  const imp = user.slice(user.indexOf("function importSave"));
  assert.ok(imp.includes('bkupNow("pre-import", true)'), "importSave 覆盖前未留底");
  assert.ok(imp.includes("dbHasReal(data)"), "importSave 未校验导入文件是否为空库");
});

test("补充铁律E：快照恢复先确认后留底（取消不浪费快照额度）", () => {
  const fn = sync.slice(sync.indexOf("function bkupDoRestore"), sync.indexOf("function syncCalcSize"));
  const cPos = fn.indexOf("confirm(");
  const bPos = fn.indexOf('bkupNow("pre-restore"');
  assert.ok(cPos >= 0 && bPos > cPos, "bkupDoRestore 必须先 confirm 再 bkupNow 留底");
});

test("补充铁律F：主存档解析失败也必须置异常标记（与迁移失败同等待遇）", () => {
  const fn = state.slice(state.indexOf("function loadDB"), state.indexOf("function loadCurrentUser"));
  assert.ok(fn.includes("rawBroken"), "loadDB 缺少解析失败检测");
  assert.ok(fn.includes("__DB_LOAD_ERROR__ = true"), "loadDB 解析失败未置异常标记");
});

test("补充铁律G：每日自动备份文件引擎存在且只在真实数据时导出", () => {
  assert.ok(state.includes("function labExportDailyFile"), "缺少每日自动备份文件引擎");
  assert.ok(state.includes("labExportDailyFile(reason"), "bkupNow 未接通每日自动导出");
  /* 只挂在 bkupNow 快照成功路径（其前置已有 dbHasReal 防呆），强制留底不触发下载 */
  const bk = state.slice(state.indexOf("function bkupNow"), state.indexOf("function bkupList"));
  assert.ok(bk.includes("if (!force) labExportDailyFile"), "每日导出必须挂在非强制路径（force 留底不弹下载）");
  assert.ok(bk.indexOf("labExportDailyFile") > bk.indexOf("bkupWrite(snap)"), "每日导出必须在快照写入之后");
});
