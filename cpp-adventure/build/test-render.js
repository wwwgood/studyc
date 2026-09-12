/* 诊断：直接执行 baRenderImport() 检查生成的 HTML */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const code = fs.readFileSync(path.join(__dirname, "..", "src", "scripts", "modules", "bank-admin.js"), "utf8");

const sandbox = {
  console,
  document: {
    getElementById: () => null,
    createElement: () => ({ style: {} }),
    querySelectorAll: () => [],
  },
  localStorage: { getItem: () => null, setItem: () => {} },
  window: { addEventListener: () => {} },
  setTimeout, setInterval, clearTimeout,
  parseInt, parseFloat, isNaN, String, Number, Array, Object, RegExp, Math, Date, JSON, Boolean, Error,
  fetch: () => {},
  FileReader: function(){},
  alert: () => {}, confirm: () => {},
};
sandbox.window.addEventListener = function(){};
sandbox.self = sandbox.window;

vm.createContext(sandbox);
vm.runInContext(code, sandbox, { filename: "bank-admin.js" });

const html = vm.runInContext("baRenderImport()", sandbox);

console.log("=== baRenderImport 输出长度:", html.length);
console.log("包含 id=\"baSubject\" :", html.includes('id="baSubject"'));
console.log("包含 id=\"baModule\" :", html.includes('id="baModule"'));
console.log("包含 id=\"baModuleTopic\" :", html.includes('id="baModuleTopic"'));
console.log("包含 id=\"baPasteText\" :", html.includes('id="baPasteText"'));
console.log("包含 id=\"baPreview\" :", html.includes('id="baPreview"'));

/* 打印归属配置区域完整内容 */
const idx = html.indexOf("ba-import-config");
const end = html.indexOf("ba-preview");
console.log("\n=== 归属配置区域 HTML ===");
console.log(html.substring(idx - 10, end + 10));