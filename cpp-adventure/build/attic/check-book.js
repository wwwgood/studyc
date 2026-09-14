const fs = require("fs");
const vm = require("vm");
const path = require("path");
const srcDir = "E:\\htdocs\\studyc\\cpp-adventure\\src\\scripts";

let dialogHtml = "";
const mock = {
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  document: {
    body: { style: {} },
    getElementById: (id) => {
      if (id === "eqDialog") return { innerHTML: "", set innerHTML(v) { dialogHtml = v; }, get innerHTML() { return dialogHtml; } };
      if (id === "eqDialogMask") return { classList: { add: () => {}, remove: () => {} } };
      return null;
    },
  },
  window: { addEventListener: () => {}, speechSynthesis: null },
};
const sandbox = {
  S: { eng: { done: { pz: 3 }, coins: 10 }, examPass: {} },
  saveS: () => {},
  window: mock.window, document: mock.document, localStorage: mock.localStorage,
  console, Math, Date, JSON, Object, Array, String, Number, Boolean, RegExp, Error,
  parseInt, parseFloat, isNaN, setTimeout, clearTimeout,
  Blob: function () {}, URL: { createObjectURL: () => "mock://url", revokeObjectURL: () => {} }, FileReader: function () {},
};
vm.createContext(sandbox);
for (const f of ["data/english-grammar.js", "modules/english-quest.js"]) {
  vm.runInContext(fs.readFileSync(path.join(srcDir, f), "utf8"), sandbox, { filename: f });
}

/* 总览章节 pz：教材精讲区块 + 状态 */
sandbox.eqOpen("pz");
console.log("=== pz 代词总览 ===");
console.log("教材精讲标题: " + (dialogHtml.indexOf("📖 教材精讲") >= 0 ? "✅" : "❌"));
console.log("教材内容(什么是代词): " + (dialogHtml.indexOf("什么是代词") >= 0 ? "✅" : "❌"));
console.log("教材内容(6 大类): " + (dialogHtml.indexOf("代词家族 6 大类") >= 0 ? "✅" : "❌"));
console.log("口诀: " + (dialogHtml.indexOf("人称物主反身指") >= 0 ? "✅" : "❌"));
console.log("例句: " + (dialogHtml.indexOf("eq-ex-row") >= 0 ? "✅" : "❌"));
console.log("已通过状态: " + (dialogHtml.indexOf("练一练已通过") >= 0 ? "✅" : "❌"));

/* p1：教材精讲含核心表格/it 用法 */
sandbox.eqOpen("p1");
console.log("=== p1 人称代词主格 ===");
console.log("教材(核心表格): " + (dialogHtml.indexOf("人称代词核心表格") >= 0 ? "✅" : "❌"));
console.log("教材(it 七十二变): " + (dialogHtml.indexOf("七十二变") >= 0 ? "✅" : "❌"));
console.log("教材(排序礼貌): " + (dialogHtml.indexOf("主格排序") >= 0 ? "✅" : "❌"));

/* p7：不定代词精华 some/any */
sandbox.eqOpen("p7");
console.log("=== p7 some/any ===");
console.log("教材(考试特例): " + (dialogHtml.indexOf("考试特例") >= 0 ? "✅" : "❌"));
console.log("教材(复合不定代词): " + (dialogHtml.indexOf("复合不定代词") >= 0 ? "✅" : "❌"));

/* p10：no/none + another 家族 */
sandbox.eqOpen("p10");
console.log("=== p10 each/every ===");
console.log("教材(no/none): " + (dialogHtml.indexOf("No 与 None") >= 0 ? "✅" : "❌"));
console.log("教材(another 家族): " + (dialogHtml.indexOf("另一个") >= 0 ? "✅" : "❌"));
