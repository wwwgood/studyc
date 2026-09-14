/*
 * var → let 安全替换脚本。
 * 只替换 for 循环中的 var（绝对安全），不动全局 var（需暴露给 HTML onclick）。
 * 用法：node build/modernize-var.js
 */
const fs = require("fs");
const path = require("path");
const srcDir = path.join(__dirname, "..", "src", "scripts");

let total = 0;
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name.endsWith(".js")) {
      let code = fs.readFileSync(p, "utf8");
      const before = (code.match(/\bvar\b/g) || []).length;
      // 只替换 for (var → for (let
      code = code.replace(/for\s*\(\s*var\s+/g, "for (let ");
      const after = (code.match(/\bvar\b/g) || []).length;
      fs.writeFileSync(p, code, "utf8");
      const changes = before - after;
      if (changes > 0) console.log(`  ${path.relative(srcDir, p)}: ${changes} for-var→let`);
      total += changes;
    }
  }
}

console.log("Replacing for-loop var → let (safe only):");
walk(srcDir);
console.log(`Total: ${total} replacements`);
