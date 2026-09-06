/*
 * 关卡内容校验脚本：检查 levels.js 数据完整性。
 * 用法：node build/validate-levels.js
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const code = fs.readFileSync(path.join(__dirname, "..", "src", "scripts", "data", "levels.js"), "utf8");
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);

const { LEVELS, LEVELS1, LEVELS2, LEVELS3, STAGE_INFO } = sandbox;
let errors = 0, warnings = 0;

function fail(msg) { console.error("  FAIL:", msg); errors++; }
function warn(msg) { console.warn("  WARN:", msg); warnings++; }

console.log("=== 关卡内容校验 ===\n");

// 1. 数量检查
console.log(`阶段一: ${LEVELS1.length} 关 (期望 11)`);
console.log(`阶段二: ${LEVELS2.length} 关 (期望 9)`);
console.log(`阶段三: ${LEVELS3.length} 关 (期望 6)`);
console.log(`总计: ${LEVELS.length} 关 (期望 26)\n`);
if (LEVELS.length !== 26) fail(`关卡总数 ${LEVELS.length} ≠ 26`);

// 2. ID 连续性
for (let i = 0; i < LEVELS.length; i++) {
  if (LEVELS[i].id !== i + 1) fail(`关卡 ${i + 1} id=${LEVELS[i].id} 不连续`);
}

// 3. 必填字段
const required = ["st", "zi", "nm", "bd", "goal", "exp", "code", "runOut", "quiz"];
for (const lv of LEVELS) {
  for (const f of required) {
    if (lv[f] === undefined || lv[f] === null || lv[f] === "") {
      fail(`关卡 ${lv.id}「${lv.nm}」缺少字段: ${f}`);
    }
  }
  if (!Array.isArray(lv.code) || lv.code.length === 0) fail(`关卡 ${lv.id} code 非空数组`);
  if (!Array.isArray(lv.quiz) || lv.quiz.length === 0) fail(`关卡 ${lv.id} quiz 非空数组`);
}

// 4. quiz 答案索引越界
for (const lv of LEVELS) {
  for (let qi = 0; qi < lv.quiz.length; qi++) {
    const q = lv.quiz[qi];
    if (!q.q || !q.o || !Array.isArray(q.o)) fail(`关卡 ${lv.id} 题 ${qi + 1} 缺少 q/o`);
    if (typeof q.a !== "number" || q.a < 0 || q.a >= q.o.length) {
      fail(`关卡 ${lv.id} 题 ${qi + 1} 答案索引越界: a=${q.a}, options=${q.o.length}`);
    }
  }
}

// 5. 阶段归属
for (const lv of LEVELS) {
  if (![1, 2, 3].includes(lv.st)) fail(`关卡 ${lv.id} st=${lv.st} 非法阶段`);
}
const st1 = LEVELS.filter(l => l.st === 1).length;
const st2 = LEVELS.filter(l => l.st === 2).length;
const st3 = LEVELS.filter(l => l.st === 3).length;
if (st1 !== 11) fail(`阶段一 ${st1} ≠ 11 关`);
if (st2 !== 9) fail(`阶段二 ${st2} ≠ 9 关`);
if (st3 !== 6) fail(`阶段三 ${st3} ≠ 6 关`);

// 6. STAGE_INFO 完整性
for (const s of [1, 2, 3]) {
  if (!STAGE_INFO[s]) fail(`STAGE_INFO 缺少阶段 ${s}`);
  if (!STAGE_INFO[s].nm || !STAGE_INFO[s].ds) fail(`STAGE_INFO[${s}] 缺少 nm/ds`);
}

// 7. 教材引用检查（b1/b2 应非空）
for (const lv of LEVELS) {
  if (!lv.b1 && !lv.b2) warn(`关卡 ${lv.id}「${lv.nm}」缺少教材引用 b1/b2`);
}

console.log(`\n=== 结果: ${errors} 错误, ${warnings} 警告 ===`);
process.exit(errors > 0 ? 1 : 0);