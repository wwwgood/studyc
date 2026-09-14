/*
 * 学校练习数据测试：校验 SCHOOL_LESSONS（第一课 · 19 题）与合并解答结构完整性。
 */
const { test } = require("node:test");
const assert = require("node:assert");
const { loadScripts } = require("./helpers");

function loadSchool() {
  const mock = { localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} }, document: { getElementById: () => null }, window: {} };
  return loadScripts(["data/school-bank.js"], mock);
}

test("学校练习第一课应为 19 道题", () => {
  const { SCHOOL_LESSONS } = loadSchool();
  assert.strictEqual(SCHOOL_LESSONS.length, 1, "目前应有 1 个课时");
  assert.strictEqual(SCHOOL_LESSONS[0].problems.length, 19, "第一课（启蒙 0201~0505）共 19 题");
});

test("每题字段完整（题面/用例/代码/解析）", () => {
  const { SCHOOL_LESSONS } = loadSchool();
  SCHOOL_LESSONS.forEach((l) => l.problems.forEach((p) => {
    ["no", "name", "title", "desc", "input", "output", "sampleIn", "sampleOut"].forEach((k) => {
      assert.ok(p[k] !== undefined && p[k] !== "", `${p.id} 缺字段 ${k}`);
    });
    assert.ok(Array.isArray(p.code) && p.code.join("\n").includes("int main()"), `${p.id} 代码缺 main`);
    assert.ok(Array.isArray(p.analysis) && p.analysis.length >= 2, `${p.id} 解析过少`);
  }));
});

test("id 唯一、难度 1-3 星、分组完整覆盖", () => {
  const { SCHOOL_LESSONS } = loadSchool();
  const probs = SCHOOL_LESSONS[0].problems;
  const ids = probs.map((p) => p.id);
  assert.strictEqual(new Set(ids).size, ids.length, "id 必须唯一");
  probs.forEach((p) => assert.ok(p.diff >= 1 && p.diff <= 3, `${p.id} 难度应为 1-3 星`));
  const grpIds = new Set(SCHOOL_LESSONS[0].groups.map((g) => g.id));
  probs.forEach((p) => assert.ok(grpIds.has(p.grp), `${p.id} 分组未定义`));
  grpIds.forEach((g) => assert.ok(probs.some((p) => p.grp === g), `分组 ${g} 不应为空`));
});

test("三份解答的合并结果：重复内容已合并、多写法保留", () => {
  const { SCHOOL_LESSONS } = loadSchool();
  const probs = SCHOOL_LESSONS[0].problems;
  probs.forEach((p) => {
    assert.ok(!Array.isArray(p.solution) && !Array.isArray(p.solutions), `${p.id} 不应保留多份重复解答`);
  });
  const altIds = probs.filter((p) => p.codeAlt && p.codeAlt.length).map((p) => p.id);
  /* 注意：数组来自 vm 沙箱领域，deepStrictEqual 会因原型不同误报，用字符串比较 */
  assert.strictEqual(altIds.slice().sort().join(","), "0302,0303", "0302/0303 应保留另一种写法");
});

test("开课必读与考前速查卡存在且非空", () => {
  const { SCHOOL_LESSONS } = loadSchool();
  const l = SCHOOL_LESSONS[0];
  assert.ok(l.primer.blocks.length >= 10, "开课必读块数过少");
  assert.ok(l.sheet.blocks.length >= 6, "考前速查卡块数过少");
});

test("代码题引号配对与关键行", () => {
  const { SCHOOL_LESSONS } = loadSchool();
  SCHOOL_LESSONS[0].problems.forEach((p) => {
    const c = p.code.join("\n");
    assert.strictEqual((c.match(/"/g) || []).length % 2, 0, `${p.id} 代码引号不配对`);
    assert.ok(c.includes("#include <iostream>"), `${p.id} 缺头文件`);
  });
});
