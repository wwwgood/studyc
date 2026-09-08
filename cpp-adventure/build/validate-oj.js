/*
 * 实战特训数据校验：node build/validate-oj.js
 * 校验 OJ_BANK / OJ_PLAN / OJ_HANDBOOK 结构完整性，供构建前检查。
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const file = path.join(__dirname, "..", "src", "scripts", "data", "oj-bank.js");
const code = fs.readFileSync(file, "utf8");
const sandbox = { window: {}, document: {}, localStorage: { getItem: () => null, setItem: () => {} } };
vm.createContext(sandbox);
vm.runInContext(code, sandbox, { filename: "oj-bank.js" });

const { OJ_BANK, OJ_PLAN, OJ_HANDBOOK, OJ_CATS, OJ_QUIZ, OJ_TASKS, OJ_STRATEGY } = sandbox;
const errors = [];

if (OJ_BANK.length !== 11) errors.push(`真题数量应为 11，实际 ${OJ_BANK.length}`);
const ids = OJ_BANK.map((t) => t.id);
if (new Set(ids).size !== OJ_BANK.length) errors.push("真题 id 不唯一");
OJ_BANK.forEach((t) => {
  ["title","cat","desc","io","explain","variant"].forEach((k) => {
    if (!t[k]) errors.push(`第 ${t.id} 题缺 ${k}`);
  });
  if (!(t.stars >= 1 && t.stars <= 4)) errors.push(`第 ${t.id} 题难度越界`);
  if (!Array.isArray(t.code) || t.code.length < 10) errors.push(`第 ${t.id} 题代码不完整`);
  if (!Array.isArray(t.points) || t.points.length === 0) errors.push(`第 ${t.id} 题缺考点`);
  if (!/int main\(\)/.test(t.code.join("\n"))) errors.push(`第 ${t.id} 题缺 main`);
});
if (OJ_PLAN.length !== 5) errors.push(`半年计划应为 5 阶段（第1-2月合并），实际 ${OJ_PLAN.length}`);
if (OJ_HANDBOOK.length !== 3) errors.push(`作战手册应为 3 主题，实际 ${OJ_HANDBOOK.length}`);
OJ_CATS.forEach((c) => {
  if (!OJ_BANK.some((t) => t.cat === c)) errors.push(`题型 ${c} 无题目`);
});
/* 互动教学数据校验 */
OJ_BANK.forEach((t) => {
  const quiz = OJ_QUIZ[t.id];
  if (!quiz || quiz.length !== 3) errors.push(`第 ${t.id} 题缺 3 道测验题`);
  else quiz.forEach((q, i) => {
    if (!q.q || !Array.isArray(q.opts) || q.opts.length < 2) errors.push(`第 ${t.id} 题测验 ${i} 结构不完整`);
    if (q.ans == null || q.ans < 0 || q.ans >= q.opts.length) errors.push(`第 ${t.id} 题测验 ${i} 答案越界`);
    if (!q.why) errors.push(`第 ${t.id} 题测验 ${i} 缺讲解`);
  });
});
let taskTotal = 0;
if (OJ_TASKS.length !== 5) errors.push(`半年任务应为 5 阶段，实际 ${OJ_TASKS.length}`);
OJ_TASKS.forEach((ph) => {
  ph.tasks.forEach((tk) => {
    taskTotal++;
    if (!tk.w || !tk.name || !tk.do || !tk.check) errors.push(`${ph.title} 任务 ${tk.name} 字段不完整`);
    if (tk.link != null && !OJ_BANK.some((t) => t.id === tk.link)) errors.push(`任务 ${tk.name} 关联真题不存在`);
  });
});
if (taskTotal !== 24) errors.push(`任务总数应为 24，实际 ${taskTotal}`);
if (OJ_STRATEGY.length !== 6) errors.push(`策略闯关应为 6 题，实际 ${OJ_STRATEGY.length}`);
OJ_STRATEGY.forEach((q, i) => {
  if (q.ans == null || q.ans < 0 || q.ans >= q.opts.length) errors.push(`策略题 ${i} 答案越界`);
});

if (errors.length) {
  console.error("[validate-oj] 校验失败：" + errors.join("；"));
  process.exit(1);
}
console.log("[validate-oj] 通过：11 道真题（含 33 道考点测验）/ 5 阶段 24 周任务 / 6 道策略情景题 / 3 主题手册");
