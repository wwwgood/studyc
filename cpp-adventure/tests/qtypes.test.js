/*
 * 多题型引擎测试：qtypes.js
 * 覆盖：选择题/选词填空/填空(汉译英·改错·词性转换)/阅读理解/作文 的判题与答案文本。
 */
const { test } = require("node:test");
const assert = require("node:assert");
const { loadScripts } = require("./helpers");

function loadQt() {
  const mock = { localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} }, document: { getElementById: () => null }, window: {} };
  return loadScripts(["modules/qtypes.js"], mock);
}

test("默认题型是选择题（旧数据完全兼容）", () => {
  const { qtTypeOf } = loadQt();
  assert.strictEqual(qtTypeOf({ q: "x", o: ["a", "b"], a: 0 }), "choice");
  assert.strictEqual(qtTypeOf({}), "choice");
  assert.strictEqual(qtTypeOf({ type: "fill" }), "fill");
});

test("选择题判题：下标匹配", () => {
  const { qtGrade } = loadQt();
  const q = { type: "choice", o: ["tomato", "tomatoes"], a: 1 };
  assert.strictEqual(qtGrade(q, 1).ok, true);
  assert.strictEqual(qtGrade(q, 0).ok, false);
  assert.match(qtGrade(q, 0).show, /正确答案：B/);
});

test("填空判题：忽略大小写、首尾空格、全角标点", () => {
  const { qtGrade } = loadQt();
  const q = { type: "fill", ansText: "went" };
  assert.strictEqual(qtGrade(q, "  Went ").ok, true);
  assert.strictEqual(qtGrade(q, "went！").ok, true);
  assert.strictEqual(qtGrade(q, "go").ok, false);
});

test("填空判题：支持多答案（| 分隔）", () => {
  const { qtGrade } = loadQt();
  const q = { type: "fill", ansText: "am / is / are" };
  assert.strictEqual(qtGrade(q, "is").ok, true);
  assert.strictEqual(qtGrade(q, "AM").ok, true);
  assert.strictEqual(qtGrade(q, "was").ok, false);
  assert.match(qtGrade(q, "was").show, /am \/ is \/ are/);
});

test("选词填空判题：全对才通过，逐空反馈", () => {
  const { qtGrade } = loadQt();
  const q = { type: "cloze", words: ["apple", "banana", "orange"], blanks: ["banana", "apple"] };
  const ok = qtGrade(q, ["banana", "apple"]);
  assert.strictEqual(ok.ok, true);
  const partial = qtGrade(q, ["banana", "pear"]);
  assert.strictEqual(partial.ok, false);
  assert.strictEqual(partial.partial, 1);
  const empty = qtGrade(q, ["", ""]);
  assert.strictEqual(empty.ok, false);
  assert.strictEqual(empty.partial, 0);
});

test("阅读理解判题：选择题子题 + 填空子题", () => {
  const { qtGrade } = loadQt();
  const q = {
    type: "reading",
    passage: "Tom is a boy.",
    questions: [
      { q: "Tom is a ___.", o: ["girl", "boy"], a: 1 },
      { q: "He is ten.", o: ["T", "F"], a: 0 },
      { q: "What color?", ansText: "red" }
    ]
  };
  const ok = qtGrade(q, [1, 0, "Red"]);
  assert.strictEqual(ok.ok, true);
  const wrong = qtGrade(q, [0, 0, "red"]);
  assert.strictEqual(wrong.ok, false);
  assert.strictEqual(wrong.partial, 2);
});

test("作文判题：写足 20 字即完成，不自动评分", () => {
  const { qtGrade } = loadQt();
  const q = { type: "writing", q: "My Family", tips: ["家人", "爱好"], sample: "My family..." };
  assert.strictEqual(qtGrade(q, "My family has four people and we love each other very much.").ok, true);
  assert.strictEqual(qtGrade(q, "short").ok, false);
});

test("标准答案文本各题型正确", () => {
  const { qtAnswerText } = loadQt();
  assert.strictEqual(qtAnswerText({ type: "choice", o: ["a", "b"], a: 1 }), "B");
  assert.strictEqual(qtAnswerText({ type: "fill", ansText: "am|is" }), "am / is");
  assert.strictEqual(qtAnswerText({ type: "cloze", blanks: ["banana", "apple"] }), "1.banana 2.apple");
  assert.match(qtAnswerText({ type: "reading", questions: [{ o: ["a", "b"], a: 1 }] }), /1\.B/);
  assert.match(qtAnswerText({ type: "writing" }), /范文/);
});

test("题型渲染：五种题型各自产出对应交互结构", () => {
  const { qtRender } = loadQt();
  assert.match(qtRender({ type: "choice", o: ["a", "b"] }, "qt"), /qt-opt/);
  assert.match(qtRender({ type: "fill" }, "qt"), /qt-input/);
  assert.match(qtRender({ type: "cloze", words: ["a", "b"], blanks: ["a", "b"] }, "qt"), /qt-blank.*qt-word/);
  assert.match(qtRender({ type: "reading", passage: "p", questions: [{ q: "q", o: ["a", "b"], a: 0 }] }, "qt"), /qt-passage/);
  assert.match(qtRender({ type: "writing", tips: ["t"] }, "qt"), /qt-write.*qt-star/);
});

test("题型标签与映射", () => {
  const { qtLabel, QT_LABELS } = loadQt();
  assert.match(qtLabel("cloze"), /选词填空/);
  assert.match(qtLabel("fill"), /填空/);
  assert.match(qtLabel("reading"), /阅读/);
  assert.match(qtLabel("writing"), /作文/);
  assert.ok(QT_LABELS.choice && QT_LABELS.fill && QT_LABELS.cloze && QT_LABELS.reading && QT_LABELS.writing);
});
