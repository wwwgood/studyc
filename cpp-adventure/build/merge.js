/*
 * 交付合并脚本：把多文件合并回单文件 index.html（离线可打开、零依赖）。
 * 用法：node build/merge.js
 * 产物：dist/index.html
 */
const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join(__dirname, "..", "src");
const DIST_DIR = path.join(__dirname, "..", "dist");
const html = fs.readFileSync(path.join(SRC_DIR, "index.html"), "utf8");

// 收集 <link rel="stylesheet" href="..."> 并内联为 <style>（外链 http(s) 资源保持原样）
const cssInline = html.replace(
  /<link rel="stylesheet" href="([^"]+)">/g,
  (_, href) => {
    if (/^https?:/i.test(href)) return _;
    const css = fs.readFileSync(path.join(SRC_DIR, href), "utf8");
    return `<style>\n${css}\n</style>`;
  }
);

// 英语重数据文件：构建时包进 engLazy(function(){...})，首次进入英语视图才执行（english-lazy.js）。
// ⚠️ src 数据文件保持原样（build/gen-english-extra.js 等生成器可正常重新生成），包装只发生在构建期。
const ENGLISH_LAZY_DATA = new Set([
  "scripts/data/english-grammar.js",
  "scripts/data/english-grammar-exboost.js",
  "scripts/data/english-grammar-extra.js",
  "scripts/data/english-vocab.js",
  "scripts/data/english-reading.js",
  "scripts/data/english-writing.js",
  "scripts/data/english-writing-zh.js",
  "scripts/data/english-exam.js",
  "scripts/data/english-topic-exam.js",
  "scripts/data/english-paper-1000.js"
]);

// 收集 <script src="..."></script> 并内联为 <script>...</script>（外链 http(s) 资源保持原样）
const jsInline = cssInline.replace(
  /<script src="([^"]+)"><\/script>/g,
  (_, src) => {
    if (/^https?:/i.test(src)) return _;
    let js = fs.readFileSync(path.join(SRC_DIR, src), "utf8");
    if (ENGLISH_LAZY_DATA.has(src.replace(/^\//, ""))){
      js = js.replace(/^\uFEFF/, "");                        // 去掉 BOM，保证 var 替换命中
      js = js.replace(/var\s+(\w+)\s*=/, "window.$1 =");     // 第一个顶层 var 挂到全局（无 /g，只替换第一处）
      js = `engLazy(function(){\n${js}\n});`;
    }
    return `<script>\n${js}\n</script>`;
  }
);

fs.mkdirSync(DIST_DIR, { recursive: true });
const out = path.join(DIST_DIR, "index.html");
fs.writeFileSync(out, jsInline, "utf8");
const kb = Math.round(fs.statSync(out).size / 1024);
console.log(`Merged → dist/index.html (${jsInline.split("\n").length} lines, ${kb} KB)`);

// 同步到 GitHub Pages 发布源：仓库根目录的 /docs/index.html。
// ⚠️ Pages 只认根 docs/，只更新本项目 docs/ 会导致线上永远跑旧版（2026-09-18 踩坑）。
const pagesTarget = path.join(__dirname, "..", "..", "docs", "index.html");
try {
  fs.mkdirSync(path.dirname(pagesTarget), { recursive: true });
  fs.copyFileSync(out, pagesTarget);
  console.log(`Synced → ../../docs/index.html (GitHub Pages 发布源)`);
} catch (e) {
  console.warn(`⚠️ 根 docs 同步失败（${e.message}）——线上不会更新，请手动复制 dist/index.html 到仓库根 docs/`);
}