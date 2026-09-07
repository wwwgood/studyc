/* 答案表提取 + 自动解析生成 测试 */
const test = require("node:test");
const assert = require("assert");
const fs = require("fs");
const path = require("path");

global.window = { addEventListener: function(){} };
let src = fs.readFileSync(path.join(__dirname, "../src/scripts/modules/bank-admin.js"), "utf8");
eval(src);

test("答案表提取：1-5 BCADA 格式", () => {
  var text = "一、选择题\n1.题一\nA.a B.b C.c D.d\n2.题二\nA.a B.b C.c D.d\n3.题三\nA.a B.b C.c D.d\n4.题四\nA.a B.b C.c D.d\n5.题五\nA.a B.b C.c D.d\n\n参考答案\n1-5 BCADA";
  var key = baExtractAnswerKey(text);
  assert.strictEqual(key[1], "B");
  assert.strictEqual(key[2], "C");
  assert.strictEqual(key[3], "A");
  assert.strictEqual(key[4], "D");
  assert.strictEqual(key[5], "A");
});

test("答案表提取：1.B 2.C 3.A 格式", () => {
  var text = "题目...\n答案\n1.B 2.C 3.A 4.D 5.B";
  var key = baExtractAnswerKey(text);
  assert.strictEqual(key[1], "B");
  assert.strictEqual(key[2], "C");
  assert.strictEqual(key[3], "A");
  assert.strictEqual(key[4], "D");
  assert.strictEqual(key[5], "B");
});

test("答案表提取：无答案表返回空对象", () => {
  var text = "一、选择题\n1.题目\nA.a B.b C.c D.d";
  var key = baExtractAnswerKey(text);
  assert.strictEqual(Object.keys(key).length, 0);
});

test("自动解析生成：已知考点", () => {
  var why = baGenWhy("a与an的区别", ["a", "an", "the"], 1, "single");
  assert.ok(why && why.length > 0, "应生成非空解析");
  assert.ok(why.indexOf("an") >= 0 || why.indexOf("元音") >= 0, "解析应提及an或元音，实际：" + why);
});

test("自动解析生成：未知考点返回空", () => {
  var why = baGenWhy("不存在的考点xxx", ["a", "b"], 0, "single");
  assert.ok(!why, "未知考点应返回空");
});

test("智能解析：答案表兜底", () => {
  var text = "一、选择题\n1. ___ apple a day keeps the doctor away.\nA.a B.an C.the D./\n2. ___ university is a place to study.\nA.a B.an C.the D./\n\n参考答案\n1-2 BA";
  var result = baSmartParse(text);
  assert.ok(result.questions.length >= 2, "应解析到至少2道题，实际：" + result.questions.length);
  assert.strictEqual(result.questions[0].a, 1, "第1题答案应为B(an)，实际：" + result.questions[0].a);
  assert.strictEqual(result.questions[0].ansSource, "答案表", "答案来源应为答案表");
  assert.strictEqual(result.questions[1].a, 0, "第2题答案应为A(a)，实际：" + result.questions[1].a);
});

test("智能解析：无解析时自动生成", () => {
  var text = "一、选择题\n1. ___ apple a day keeps the doctor away.\nA.a B.an C.the D./\n\n参考答案\n1.B";
  var result = baSmartParse(text);
  assert.ok(result.questions.length >= 1, "应解析到至少1道题");
  var q = result.questions[0];
  assert.ok(q.why && q.why.length > 0, "应自动生成解析");
  assert.ok(q.whyAuto, "应标记为自动解析");
});

test("智能解析：行内答案优先于答案表", () => {
  var text = "一、选择题\n1. ___ apple a day keeps the doctor away.\nA.a B.an C.the D./\n答案：B\n\n参考答案\n1-1 A";
  var result = baSmartParse(text);
  assert.ok(result.questions.length >= 1);
  assert.strictEqual(result.questions[0].a, 1, "应使用行内答案B(1)，而非答案表A(0)");
  assert.strictEqual(result.questions[0].ansSource, "原卷行内");
});

test("智能解析：hasAnswerKey 标记", () => {
  var textWithKey = "1.题目\nA.a B.b\n\n参考答案\n1-1 A";
  var r1 = baSmartParse(textWithKey);
  assert.strictEqual(r1.hasAnswerKey, true);

  var textNoKey = "1.题目\nA.a B.b\n答案：A";
  var r2 = baSmartParse(textNoKey);
  assert.strictEqual(r2.hasAnswerKey, false);
});