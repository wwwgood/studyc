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

// 收集 <script src="..."></script> 并内联为 <script>...</script>（外链 http(s) 资源保持原样）
const jsInline = cssInline.replace(
  /<script src="([^"]+)"><\/script>/g,
  (_, src) => {
    if (/^https?:/i.test(src)) return _;
    const js = fs.readFileSync(path.join(SRC_DIR, src), "utf8");
    return `<script>\n${js}\n</script>`;
  }
);

fs.mkdirSync(DIST_DIR, { recursive: true });
const out = path.join(DIST_DIR, "index.html");
fs.writeFileSync(out, jsInline, "utf8");
const kb = Math.round(fs.statSync(out).size / 1024);
console.log(`Merged → dist/index.html (${jsInline.split("\n").length} lines, ${kb} KB)`);