const { test } = require("node:test");
const assert = require("node:assert/strict");
const { loadScripts, createMockDOM } = require("./helpers");

const mock = createMockDOM();
const ctx = loadScripts(["data/levels.js"], mock);
const { LEVELS, LEVELS1, LEVELS2, LEVELS3, STAGE_INFO } = ctx;

test("关卡总数为 26", () => {
  assert.equal(LEVELS.length, 26);
  assert.equal(LEVELS1.length, 11);
  assert.equal(LEVELS2.length, 9);
  assert.equal(LEVELS3.length, 6);
});

test("关卡 ID 连续 1-26", () => {
  for (let i = 0; i < LEVELS.length; i++) {
    assert.equal(LEVELS[i].id, i + 1, `关卡 ${i + 1} id 应为 ${i + 1}`);
  }
});

test("每关必填字段完整", () => {
  const required = ["st", "zi", "nm", "bd", "goal", "exp", "code", "runOut", "quiz"];
  for (const lv of LEVELS) {
    for (const f of required) {
      assert.notEqual(lv[f], undefined, `关卡 ${lv.id}「${lv.nm}」缺少 ${f}`);
      assert.notEqual(lv[f], null, `关卡 ${lv.id}「${lv.nm}」${f} 为 null`);
    }
    assert.ok(Array.isArray(lv.code) && lv.code.length > 0, `关卡 ${lv.id} code 非空数组`);
    assert.ok(Array.isArray(lv.quiz) && lv.quiz.length > 0, `关卡 ${lv.id} quiz 非空数组`);
  }
});

test("quiz 答案索引不越界", () => {
  for (const lv of LEVELS) {
    for (let qi = 0; qi < lv.quiz.length; qi++) {
      const q = lv.quiz[qi];
      assert.ok(q.q, `关卡 ${lv.id} 题 ${qi + 1} 缺少题干`);
      assert.ok(Array.isArray(q.o), `关卡 ${lv.id} 题 ${qi + 1} 缺少选项`);
      assert.ok(typeof q.a === "number" && q.a >= 0 && q.a < q.o.length,
        `关卡 ${lv.id} 题 ${qi + 1} 答案索引越界 a=${q.a}`);
    }
  }
});

test("阶段归属正确", () => {
  assert.equal(LEVELS.filter(l => l.st === 1).length, 11);
  assert.equal(LEVELS.filter(l => l.st === 2).length, 9);
  assert.equal(LEVELS.filter(l => l.st === 3).length, 6);
});

test("STAGE_INFO 三阶段完整", () => {
  for (const s of [1, 2, 3]) {
    assert.ok(STAGE_INFO[s], `STAGE_INFO 缺少阶段 ${s}`);
    assert.ok(STAGE_INFO[s].nm, `STAGE_INFO[${s}] 缺少 nm`);
    assert.ok(STAGE_INFO[s].ds, `STAGE_INFO[${s}] 缺少 ds`);
  }
});