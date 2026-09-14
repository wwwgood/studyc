/*
 * 学校练习数据校验：node build/validate-school.js
 * 校验 SCHOOL_LESSONS（第一课 19 题 + 开课必读 + 考前速查卡）结构完整性，供构建前检查。
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const file = path.join(__dirname, "..", "src", "scripts", "data", "school-bank.js");
const code = fs.readFileSync(file, "utf8");
const sandbox = { window: {}, document: {}, localStorage: { getItem: () => null, setItem: () => {} } };
vm.createContext(sandbox);
vm.runInContext(code, sandbox, { filename: "school-bank.js" });

const { SCHOOL_LESSONS } = sandbox;
const errors = [];

if (!Array.isArray(SCHOOL_LESSONS) || SCHOOL_LESSONS.length === 0) {
  errors.push("SCHOOL_LESSONS 为空");
} else {
  SCHOOL_LESSONS.forEach((l, li) => {
    if (!l.id || !l.title) errors.push(`第 ${li + 1} 课缺 id/title`);
    if (!l.primer || !Array.isArray(l.primer.blocks) || !l.primer.blocks.length) errors.push(`第 ${li + 1} 课缺开课必读`);
    if (!l.sheet || !Array.isArray(l.sheet.blocks) || !l.sheet.blocks.length) errors.push(`第 ${li + 1} 课缺考前速查卡`);
    const probs = l.problems || [];
    if (!probs.length) errors.push(`第 ${li + 1} 课没有题目`);
    const ids = new Set();
    probs.forEach((p) => {
      if (!p.id) errors.push("有题目缺 id");
      if (ids.has(p.id)) errors.push(`重复 id：${p.id}`);
      ids.add(p.id);
      ["no", "name", "title", "grp", "desc", "input", "output", "sampleIn", "sampleOut"].forEach((k) => {
        if (p[k] === undefined || p[k] === "") errors.push(`${p.id} 缺字段 ${k}`);
      });
      if (!(p.diff >= 1 && p.diff <= 3)) errors.push(`${p.id} 难度越界（应为 1-3 星）`);
      if (!Array.isArray(p.points) || !p.points.length) errors.push(`${p.id} 缺考点`);
      if (!Array.isArray(p.code) || p.code.length < 4) errors.push(`${p.id} 参考代码不完整`);
      else {
        const c = p.code.join("\n");
        if (!/int main\(\)/.test(c)) errors.push(`${p.id} 代码缺 main 函数`);
        if (!/return 0;/.test(c)) errors.push(`${p.id} 代码缺 return 0;`);
        if ((c.match(/"/g) || []).length % 2 !== 0) errors.push(`${p.id} 代码引号不配对`);
      }
      if (p.codeAlt && (!Array.isArray(p.codeAlt) || !p.codeAlt.length)) errors.push(`${p.id} 另一种写法为空`);
      if (!Array.isArray(p.analysis) || p.analysis.length < 2) errors.push(`${p.id} 解析内容过少`);
    });
    (l.groups || []).forEach((g) => {
      if (!probs.some((p) => p.grp === g.id)) errors.push(`分组 ${g.id} 下没有题目`);
    });
    const grpIds = new Set((l.groups || []).map((g) => g.id));
    probs.forEach((p) => { if (!grpIds.has(p.grp)) errors.push(`${p.id} 所属分组 ${p.grp} 未定义`); });
  });
}

if (errors.length) {
  console.error("[validate-school] 校验失败：" + errors.join("；"));
  process.exit(1);
}
const total = SCHOOL_LESSONS.reduce((n, l) => n + l.problems.length, 0);
const alts = SCHOOL_LESSONS.reduce((n, l) => n + l.problems.filter((p) => p.codeAlt && p.codeAlt.length).length, 0);
console.log(`[validate-school] 通过：${SCHOOL_LESSONS.length} 课 / ${total} 题（含 ${alts} 题保留多写法）/ 开课必读 + 考前速查卡`);
