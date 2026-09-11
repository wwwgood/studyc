/*
 * 章节学习页 + 跳过已做对真题 测试
 * 覆盖：eqKpOfLesson 章节→考点映射 / qbSelect skipPassed 过滤
 */
const { test } = require("node:test");
const assert = require("node:assert");
const { loadScripts } = require("./helpers");

function loadEnv(examPass) {
  const store = {};
  const mock = {
    localStorage: { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } },
    document: { getElementById: () => null, body: { style: {} } },
    window: { addEventListener: () => {}, speechSynthesis: null },
  };
  return loadScripts(
    ["data/english-grammar.js", "data/question-bank.js", "modules/question-bank.js", "modules/english-quest.js"],
    mock,
    { S: { eng: { done: {}, coins: 0 }, examPass: examPass || {} }, saveS: () => {} }
  );
}

test("章节→考点映射：名词岛 9 章全部命中对应考点", () => {
  const { EQ_DATA, eqKpOfLesson } = loadEnv();
  const map = {};
  EQ_DATA.lessons.forEach((l) => { map[l.t] = eqKpOfLesson(l); });
  assert.strictEqual(map["名词是什么"], "名词辨认");
  assert.strictEqual(map["可数名词"], "可数与不可数名词");
  assert.strictEqual(map["复数规则一：直接加 s"], "名词复数-加s规则");
  assert.strictEqual(map["复数规则二：s, x, ch, sh 加 es"], "名词复数-es规则");
  assert.strictEqual(map["复数规则三：辅音字母 + y 结尾"], "名词复数-ies规则");
  assert.strictEqual(map["复数规则四：f / fe 变 ves"], "名词复数-ves规则");
  assert.strictEqual(map["不规则复数"], "不规则名词复数");
  assert.strictEqual(map["不可数名词"], "可数与不可数名词");
  assert.strictEqual(map["名词所有格 's"], "名词所有格");
  /* 覆盖全部章节：除个别特殊章节外都应命中考点（保证学习页都有真题入口） */
  const miss = EQ_DATA.lessons.filter((l) => !map[l.t]);
  assert.ok(miss.length <= 3, "未映射章节应 ≤3，实际 " + miss.length + "：" + miss.map((l) => l.t).join("、"));
});

test("跳过已做对真题：S.examPass 标记的题不再出现", () => {
  const env = loadEnv({ "kpt-a": 1 });
  env.qbAdd({ id: "kpt-a", subject: "english", module: "grammar", topicId: 1, kp: ["专有名词"], q: "已做对" });
  env.qbAdd({ id: "kpt-b", subject: "english", module: "grammar", topicId: 1, kp: ["专有名词"], q: "未做" });
  const picked = env.qbSelect("grammar", null, 10, null, "english", "专有名词", true);
  assert.strictEqual(picked.length, 1);
  assert.strictEqual(picked[0].id, "kpt-b");
});

test("不跳过模式不受 examPass 影响（兼容旧行为）", () => {
  const env = loadEnv({ "kpt-a": 1 });
  env.qbAdd({ id: "kpt-a", subject: "english", module: "grammar", topicId: 1, kp: ["专有名词"], q: "A" });
  env.qbAdd({ id: "kpt-b", subject: "english", module: "grammar", topicId: 1, kp: ["专有名词"], q: "B" });
  const picked = env.qbSelect("grammar", null, 10, null, "english", "专有名词", false);
  assert.strictEqual(picked.length, 2);
});
