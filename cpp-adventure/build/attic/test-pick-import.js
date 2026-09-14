/* 验证：逐题「采纳」（解析错的可以不导入）+ 导入后明确告知去向并可一键查看
 * 用法：node build/test-pick-import.js
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

const dom = new JSDOM(
  `<!DOCTYPE html><body>
    <div id="baDialogMask"><div id="baDialog"></div></div>
    <div id="baPreview"></div><div id="baToast"></div>
  </body>`,
  { url: "http://localhost/", runScripts: "dangerously" }
);
const w = dom.window;
w.eval("var QB_DATA = { questions: [] };");
w.eval(bankCode);
w.baRender();

const sample = [
  "1. Tom is ___ than his brother.",
  "A. tall   B. taller   C. tallest   D. the tallest",
  "答案：B",
  "解析：than前用比较级。",
  "",
  "2. She ___ to school every day.",
  "A. go   B. goes   C. going   D. gone",
  "答案：B",
  "解析：三单加es。",
  "",
  "3. 这是一道被解析错的题。",
  "A. 甲   B. 乙   C. 丙   D. 丁",
  "答案：A"
].join("\n");

console.log("\n【场景1】默认全部采纳，可逐题取消");
w.document.getElementById("baPasteText").value = sample;
w.baParseAndPreview();
const qs = w.document.getElementById("baPreview")._questions;
ok(qs.length === 3, "解析出3道题", "实际 " + qs.length);
ok(qs.every(q => q._pick === true), "默认全部采纳");
ok(w.document.getElementById("baPickCount").textContent === "3", "采纳计数=3",
   w.document.getElementById("baPickCount").textContent);
ok(!!w.document.querySelector(".ba-pick-bar"), "顶部有采纳控制条");

const cb3 = w.document.getElementById("ba-item-2").querySelector(".ba-item-pick input");
ok(!!cb3 && cb3.checked, "第3题默认勾选");
cb3.checked = false;
cb3.dispatchEvent(new w.Event("change"));
ok(qs[2]._pick === false, "取消后 _pick=false");
ok(w.document.getElementById("baPickCount").textContent === "2", "计数变2",
   w.document.getElementById("baPickCount").textContent);
ok(w.document.getElementById("ba-item-2").classList.contains("ba-item-skip"), "第3题置灰（虚线框）");

console.log("\n【场景2】全不选时不能导入（不会误存）");
w.baPickAll(false);
ok(w.document.getElementById("baPickCount").textContent === "0", "全不选后计数=0");
w.baDoImport();
ok(w.QB_DATA.questions.length === 0, "全不选时一道都没进题库", "实际 " + w.QB_DATA.questions.length);
ok(/没有勾选/.test(w.document.getElementById("baToast").textContent),
   "给出提示：没有勾选要导入的题目", w.document.getElementById("baToast").textContent);

console.log("\n【场景3】反选 / 全选");
w.baPickInvert();
ok(w.document.getElementById("baPickCount").textContent === "3", "反选后=3");
w.baPickAll(true);
ok(w.document.getElementById("baPickCount").textContent === "3", "全选后=3");
const cb3b = w.document.getElementById("ba-item-2").querySelector(".ba-item-pick input");
cb3b.checked = false;
cb3b.dispatchEvent(new w.Event("change"));

console.log("\n【场景4】只导入勾选的题，并明确告知去向");
const topicSel = w.document.getElementById("baModuleTopic");
topicSel.value = "5";
topicSel.dispatchEvent(new w.Event("change"));
w.document.getElementById("baSourceDetail").value = "2024年某校真题";
w.baDoImport();
const imported = w.QB_DATA.questions;
ok(imported.length === 2, "只导入2道（第3道被跳过）", "实际 " + imported.length);
ok(!imported.some(q => /被解析错的题/.test(q.q)), "被取消的那道确实没进题库");
const html = w.document.getElementById("baPreview").innerHTML;
ok(/跳过 1 道/.test(html), "结果页写明跳过1道");
ok(/题都放这儿了/.test(html), "结果页有「题都放这儿了」去向说明");
ok(/英语 .* 语法闯关 .* 第5章/.test(html.replace(/<[^>]+>/g, " ")),
   "去向写明 英语 → 语法闯关 → 第5章", html.replace(/<[^>]+>/g, " ").match(/📍.{0,60}/));
ok(/立刻查看这批题/.test(html), "有一键查看按钮");

console.log("\n【场景5】点「立刻查看这批题」→ 跳到浏览页并筛好");
w.baGoBrowse("english", "grammar");
ok(w.BA_CURRENT_TAB === "browse", "切到浏览页", w.BA_CURRENT_TAB);
ok(w.document.getElementById("baBrowseSubject").value === "english", "科目已选英语");
ok(w.document.getElementById("baBrowseModule").value === "grammar", "模块已选语法",
   w.document.getElementById("baBrowseModule").value);
ok(w.document.getElementById("baBrowseSource").value === "__imported__", "来源已选「我导入的题」");
const listTxt = w.document.getElementById("baBrowseList").textContent;
ok(/Tom is ___ than/.test(listTxt), "列表里能看到刚导入的题");
ok(!/被解析错的题/.test(listTxt), "被跳过的题不在列表里");
const meta = w.document.querySelector(".ba-browse-meta");
ok(!!meta && /grammar/.test(meta.textContent), "每题标注模块/章节归属", meta ? meta.textContent : "");

console.log("\n【场景6】浏览页切换来源不会丢模块选择");
const srcSel = w.document.getElementById("baBrowseSource");
srcSel.value = "";
srcSel.dispatchEvent(new w.Event("change"));
ok(w.document.getElementById("baBrowseModule").value === "grammar", "改来源后模块仍是语法",
   w.document.getElementById("baBrowseModule").value);

console.log("\n===== 结果：" + pass + " 通过 / " + fail + " 失败 =====");
process.exit(fail === 0 ? 0 : 1);
