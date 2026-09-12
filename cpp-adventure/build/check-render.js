const fs = require("fs");
const vm = require("vm");
const ctx = {};
vm.createContext(ctx);
const code =
  fs.readFileSync("E:\\htdocs\\studyc\\cpp-adventure\\src\\scripts\\modules\\qtypes.js", "utf8") +
  '\n;globalThis.__out = qtRenderChoice({o:["woman teacher","women teachers","women teacher","woman teachers"]},"qt");';
vm.runInContext(code, ctx);
const out = ctx.__out;
console.log("内联布局:", out.indexOf('style="display:flex;align-items:center;gap:10px;width:100%"') >= 0);
console.log("key与文本空格:", out.indexOf("</span> <span class=\"qt-opt-text\">") >= 0);
console.log("按钮数:", (out.match(/class="qt-opt" /g) || []).length);
console.log("--- 渲染片段 ---");
console.log(out.slice(0, 260));
