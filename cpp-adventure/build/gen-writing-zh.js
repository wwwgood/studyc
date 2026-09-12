/* 生成 src/scripts/data/english-writing-zh.js
 * 输入：build/_zh_all.json（由人工/校对过的句库 + 词库合并而成）
 * 输出：WRITE_ZH = { s: {英文句子: 中文}, w: {英文词: 中文} }
 * 用法：node build/gen-writing-zh.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const all = JSON.parse(fs.readFileSync(path.join(ROOT, "build/_zh_all.json"), "utf8"));
// 词库 key 统一小写，方便运行时按小写查询（保留原样短语内部空格）
const WLOW = {};
Object.keys(all.w).forEach(k => {
  const lk = k.toLowerCase().trim();
  if (lk && !WLOW[lk]) WLOW[lk] = all.w[k];
});
all.w = WLOW;

// 练习题翻译（题干 + 选项）
function rd(f){ return JSON.parse(fs.readFileSync(path.join(ROOT, f), "utf8")); }
const Q = Object.assign({}, rd("build/_zh_qa.json"), rd("build/_zh_qb.json"));
const O = Object.assign({}, rd("build/_zh_oa.json"), rd("build/_zh_ob.json"));
all.q = Q;
all.o = O;

function esc(s){
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function mapToJs(obj, indent){
  const keys = Object.keys(obj).sort();
  const pad = " ".repeat(indent);
  return keys.map(k => pad + '"' + esc(k) + '": "' + esc(obj[k]) + '"').join(",\n");
}

const out = [];
out.push('/* ---------------- 英语作文 中文翻译数据 ----------------');
out.push(' * 由 build/gen-writing-zh.js 生成，请勿手工编辑。');
out.push(' * s: 范文句子 → 中文   w: 单词/短语 → 中文   q: 练习题题干   o: 练习题选项');
out.push(' */');
out.push('var WRITE_ZH = {');
out.push('  "s": {');
out.push(mapToJs(all.s, 4));
out.push('  },');
out.push('  "w": {');
out.push(mapToJs(all.w, 4));
out.push('  },');
out.push('  "q": {');
out.push(mapToJs(all.q, 4));
out.push('  },');
out.push('  "o": {');
out.push(mapToJs(all.o, 4));
out.push('  }');
out.push('};');
out.push('if (typeof module !== "undefined") module.exports = WRITE_ZH;');

const target = path.join(ROOT, "src/scripts/data/english-writing-zh.js");
fs.writeFileSync(target, out.join("\n") + "\n", "utf8");

// 校验：能被解析
const code = fs.readFileSync(target, "utf8");
const sandbox = {};
new Function("module", code)(sandbox);
const ZH = sandbox.exports || require(target);
console.log("句库 " + Object.keys(ZH.s).length + " 条，词库 " + Object.keys(ZH.w).length + " 条，题干 " + Object.keys(ZH.q).length + " 条，选项 " + Object.keys(ZH.o).length + " 条");

// 覆盖率校验：所有范文句子都能查到
const src = fs.readFileSync(path.join(ROOT, "src/scripts/data/english-writing.js"), "utf8");
const WRITE_DATA = {};
new Function("WRITE_DATA", src + ";return WRITE_DATA;")({});
eval(src.replace("var WRITE_DATA", "var WRITE_DATA2"));
let total = 0, miss = 0;
WRITE_DATA2.passages.forEach(p => {
  (p.body.match(/[^.!?]+[.!?]+/g) || [p.body]).forEach(s => {
    const t = s.trim();
    if (!t) return;
    total++;
    if (!ZH.s[t]) { miss++; if (miss <= 5) console.log("缺句子翻译:", t); }
  });
});
console.log("范文句子 " + total + " 句，缺翻译 " + miss + " 句");
let bad = 0;
WRITE_DATA2.passages.forEach(p => {
  p.q.forEach(qq => {
    if (!ZH.q[qq.q]) { bad++; if (bad <= 5) console.log("缺题干翻译:", qq.q); }
    qq.o.forEach(opt => { if (!ZH.o[opt]) bad++; });
  });
});
console.log("练习题缺翻译: " + bad + " 处");
console.log("输出: " + target + "  (" + fs.statSync(target).size + " bytes)");
