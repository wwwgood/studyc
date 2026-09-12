/* 验证：专题章节下拉不再被重置 + 导入时按指定章节归并（含解析） + 刷新后可恢复
 * 用法：node build/check-topic-fix.js（独立验证，勿以 test- 开头命名，避免被 npm test 自动发现）
 */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require(path.join("C:/Users/zb/.workbuddy/binaries/node/workspace/node_modules/jsdom"));

const SRC = path.join(__dirname, "..", "src");
const bankCode = fs.readFileSync(path.join(SRC, "scripts", "modules", "bank-admin.js"), "utf8");

let pass = 0, fail = 0;
function ok(cond, name, extra){
  if (cond){ pass++; console.log("  ✅ " + name); }
  else { fail++; console.log("  ❌ " + name + (extra ? "  → " + extra : "")); }
}

function makeDom(storage){
  const dom = new JSDOM(
    `<!DOCTYPE html><body>
      <div id="baDialogMask"><div id="baDialog"></div></div>
      <div id="baPreview"></div>
      <div id="baToast"></div>
    </body>`,
    { url: "http://localhost/", runScripts: "dangerously" }
  );
  const w = dom.window;
  w.eval("var QB_DATA = { questions: [] };");
  if (storage){
    for (const k of Object.keys(storage)) w.localStorage.setItem(k, storage[k]);
  }
  w.eval(bankCode);
  return w;
}

/* ---------- 场景1：选章节后不会被重置 ---------- */
console.log("\n【场景1】专题章节下拉选中后是否保持");
const w1 = makeDom();
w1.baRender();
const topicSel = w1.document.getElementById("baModuleTopic");
const modSel = w1.document.getElementById("baModule");
ok(!!topicSel, "专题章节下拉存在");
ok(modSel.value === "grammar", "默认模块=语法", "实际 " + modSel.value);
ok(topicSel.options.length === 13, "语法→12章+不指定=13项", "实际 " + topicSel.options.length);

topicSel.value = "5";
topicSel.dispatchEvent(new w1.Event("change"));
ok(topicSel.value === "5", "选中第5章后仍为5（不被重置成0）", "实际 " + topicSel.value);
ok(w1.BA_TOPIC_MEM["grammar"] === "5", "选择已记忆", JSON.stringify(w1.BA_TOPIC_MEM));

/* 切到词汇再切回语法，应恢复记忆值 */
modSel.value = "vocab";
modSel.dispatchEvent(new w1.Event("change"));
ok(topicSel.options.length === 21, "词汇→20单元+不指定=21项", "实际 " + topicSel.options.length);
modSel.value = "grammar";
modSel.dispatchEvent(new w1.Event("change"));
ok(topicSel.value === "5", "切回语法后恢复上次选的第5章", "实际 " + topicSel.value);

/* ---------- 场景2：指定第5章后导入，题目与解析归入 grammar/5 ---------- */
console.log("\n【场景2】指定章节后导入，题目+解析是否归并正确");
const sample = [
  "1. Tom is ___ than his brother.",
  "A. tall   B. taller   C. tallest   D. the tallest",
  "答案：B",
  "解析：than前用比较级，tall的比较级是taller。",
  "",
  "2. There are some ___ on the table.",
  "A. tomato   B. tomatos   C. tomatoes   D. tomatoos",
  "答案：C",
  "解析：以辅音字母+o结尾的名词变复数加es。"
].join("\n");
w1.document.getElementById("baPasteText").value = sample;
topicSel.value = "5";                                  // 指定第5章 形容词
topicSel.dispatchEvent(new w1.Event("change"));
w1.document.getElementById("baSourceDetail").value = "2023年某地小升初真题";
w1.baParseAndPreview();
const assignTxt = w1.document.querySelector(".ba-preview-assign").textContent;
ok(/章节\s*形容词/.test(assignTxt) || assignTxt.indexOf("形容词") >= 0,
   "预览显示归入第5章（形容词）", assignTxt);

w1.baDoImport();
const imported = w1.QB_DATA.questions;
ok(imported.length > 0, "题目已写入题库", "实际 " + imported.length);
const allCh5 = imported.every(q => q.subject === "english" && q.module === "grammar" && q.topicId === 5);
ok(allCh5, "全部归入 english/grammar/第5章",
   JSON.stringify(imported.map(q => [q.module, q.topicId])));
const withWhy = imported.filter(q => q.why && q.why.trim()).length;
ok(withWhy === imported.length, "解析(why)全部保留", withWhy + "/" + imported.length);
ok(imported.every(q => q.imported === true), "标记为导入题（用于持久化）");
ok(imported.every(q => q.sourceDetail === "2023年某地小升初真题"), "来源详情已写入");

/* 该章节能否被专题真题训练检索到（真实消费路径） */
w1.eval(`
  var QB_USED = {};
  function qbQuery(module, topicId, subject){
    return QB_DATA.questions.filter(function(q){
      if (subject && q.subject !== subject) return false;
      if (module && q.module !== module) return false;
      if (topicId !== undefined && topicId !== null && q.topicId !== topicId) return false;
      return true;
    });
  }
`);
const hit = w1.eval("qbQuery('grammar', 5, 'english').length");
ok(hit === imported.length, "第5章专题训练能检索到这批题", "命中 " + hit);

/* ---------- 场景3：刷新后不丢（恢复） ---------- */
console.log("\n【场景3】刷新页面后导入题是否还在");
const stored = { ba_imported_questions: w1.localStorage.getItem("ba_imported_questions") };
ok(!!stored.ba_imported_questions && JSON.parse(stored.ba_imported_questions).length === imported.length,
   "已写入 localStorage", String(stored.ba_imported_questions || "").slice(0, 60));
const w2 = makeDom(stored);
const restored = w2.QB_DATA.questions.length;
ok(restored === imported.length, "重新加载后题目被恢复", "恢复 " + restored);
const restoredIds = w2.QB_DATA.questions.map(q => q.id);
ok(restoredIds.every(id => id), "恢复的题目ID完整");
/* 重复恢复不应产生重复 */
w2.baRestoreImported();
ok(w2.QB_DATA.questions.length === restored, "重复恢复不会产生重复题",
   "现在 " + w2.QB_DATA.questions.length);

/* ---------- 场景4：不指定时仍按自动考点归类 ---------- */
console.log("\n【场景4】不指定章节时，自动考点归类仍然生效");
const w3 = makeDom();
w3.baRender();
w3.document.getElementById("baModuleTopic").value = "0";
w3.document.getElementById("baModuleTopic").dispatchEvent(new w3.Event("change"));
w3.document.getElementById("baPasteText").value = sample;
w3.baParseAndPreview();
w3.baDoImport();
const auto = w3.QB_DATA.questions;
ok(auto.length > 0, "导入成功", "实际 " + auto.length);
ok(auto.every(q => q.module === "grammar"), "模块仍为语法", JSON.stringify(auto.map(q => q.module)));
ok(auto.some(q => q.topicId === 5), "含比较级的题自动归入第5章(形容词)",
   JSON.stringify(auto.map(q => q.topicId)));

console.log("\n【对照】用 git HEAD（修复前）的原始代码复现故障");
let oldCode = "";
try {
  oldCode = require("child_process").execSync(
    'git show HEAD:cpp-adventure/src/scripts/modules/bank-admin.js',
    { cwd: path.join(__dirname, "..", ".."), encoding: "utf8" }
  );
} catch(e){ oldCode = ""; }
if (!oldCode){
  console.log("  ⚠️ 取不到 HEAD 版本，跳过对照");
} else {
  const dom = new JSDOM(`<!DOCTYPE html><body><div id="baDialogMask"><div id="baDialog"></div></div><div id="baPreview"></div></body>`,
    { url: "http://localhost/", runScripts: "dangerously" });
  const w4 = dom.window;
  w4.eval("var QB_DATA = { questions: [] };");
  w4.eval(oldCode);
  w4.baRender();
  const t4 = w4.document.getElementById("baModuleTopic");
  t4.value = "5";
  t4.dispatchEvent(new w4.Event("change"));
  ok(t4.value === "0", "旧写法选中第5章后确实被重置为「不指定」（故障复现）", "实际 " + t4.value);
}

console.log("\n===== 结果：" + pass + " 通过 / " + fail + " 失败 =====");
process.exit(fail === 0 ? 0 : 1);
