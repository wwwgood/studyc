/*
 * 开发期拆分脚本：把单文件 index.html 切分成多文件。
 * 用法：node build/split.js
 * 切分后 src/index.html 引用外部 css/js，可直接用浏览器打开（file:// 协议可用）。
 */
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "src", "index.html");
const SRC_DIR = path.join(__dirname, "..", "src");
const lines = fs.readFileSync(SRC, "utf8").split(/\r?\n/);

// 按行号区间切分（1-indexed, 包含两端），去掉首尾空行
function slice(a, b) {
  let chunk = lines.slice(a - 1, b);
  while (chunk.length && chunk[0].trim() === "") chunk.shift();
  while (chunk.length && chunk[chunk.length - 1].trim() === "") chunk.pop();
  return chunk.join("\n") + "\n";
}

function write(rel, content) {
  const p = path.join(SRC_DIR, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, "utf8");
  console.log("  wrote", rel, `(${content.split("\n").length} lines)`);
}

// ---- CSS ----
write("styles/main.css", slice(9, 416));

// ---- JS 模块 ----
const modules = [
  ["scripts/data/levels.js",    751, 1204],
  ["scripts/core/state.js",     1206, 1228],
  ["scripts/modules/map.js",    1231, 1434],
  ["scripts/modules/keyboard.js", 1437, 1583],
  ["scripts/modules/focus.js",  1586, 1622],
  ["scripts/modules/user.js",   1624, 1710],
  ["scripts/modules/tabs.js",   1712, 1725],
  ["scripts/modules/errors.js", 1727, 1910],
  ["scripts/modules/english.js", 1912, 2060],
  ["scripts/modules/typing.js", 2062, 2122],
  ["scripts/modules/math.js",   2123, 2162],
  ["scripts/modules/plan.js",   2164, 2231],
  ["scripts/modules/road.js",   2233, 2260],
  ["scripts/modules/log.js",    2262, 2658],
  ["scripts/core/init.js",      2661, 2674],
];

console.log("Splitting JS modules:");
for (const [rel, a, b] of modules) write(rel, slice(a, b));

// ---- 生成新的 index.html ----
const head = lines.slice(0, 7).join("\n"); // 1-7: DOCTYPE..meta description
const bodyStart = lines.slice(418 - 1, 749).join("\n"); // 418-749: </head>..<script> 前
const tail = lines.slice(2676 - 1).join("\n"); // 2676-末尾: 浮层HTML..</html>（跳过原 </script>）

const cssLink = '<link rel="stylesheet" href="styles/main.css">';
const scriptTags = modules
  .map(([rel]) => `  <script src="${rel}"></script>`)
  .join("\n");

const newHtml = [
  head,
  cssLink,
  bodyStart,          // </head><body>...</body> 之前的内容，到 <script> 前
  scriptTags,
  tail,
].join("\n");

fs.writeFileSync(SRC, newHtml, "utf8");
console.log("\nRewrote src/index.html to reference external files.");
console.log(`  (${newHtml.split("\n").length} lines, was ${lines.length})`);