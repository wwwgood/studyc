/* 试卷标题题型分类测试 */
const test = require("node:test");
const assert = require("assert");
const fs = require("fs");
const path = require("path");

global.window = { addEventListener: function(){} };
let src = fs.readFileSync(path.join(__dirname, "../src/scripts/modules/bank-admin.js"), "utf8");
eval(src);

test("标题识别：单词辩音", () => {
  assert.strictEqual(baGuessSectionType("一、单词辩音"), "phonics");
  assert.strictEqual(baGuessSectionType("二、语音选择"), "phonics");
});

test("标题识别：听力", () => {
  assert.strictEqual(baGuessSectionType("一、听力理解"), "listening");
  assert.strictEqual(baGuessSectionType("一、听对话选择"), "listening");
});

test("标题识别：英汉互译", () => {
  assert.strictEqual(baGuessSectionType("三、英汉互译"), "translation");
  assert.strictEqual(baGuessSectionType("四、翻译"), "translation");
});

test("标题识别：句型转换", () => {
  assert.strictEqual(baGuessSectionType("五、句型转换"), "sentransform");
});

test("标题识别：完成句子", () => {
  assert.strictEqual(baGuessSectionType("六、完成句子"), "complete");
});

test("标题识别：单项选择", () => {
  assert.strictEqual(baGuessSectionType("七、单项选择"), "single");
});

test("标题识别：无匹配返回null", () => {
  assert.strictEqual(baGuessSectionType("八、其他题型"), null);
  assert.strictEqual(baGuessSectionType(""), null);
  assert.strictEqual(baGuessSectionType(null), null);
});

test("智能解析：单词辩音题从标题分类", () => {
  var text = "一、单词辩音\n1. 找出划线部分发音不同的词\nA. apple B. bag C. cake D. map\n\n参考答案\n1.C";
  var result = baSmartParse(text);
  assert.ok(result.questions.length >= 1, "应解析到至少1道题");
  assert.strictEqual(result.questions[0].qType, "phonics", "题型应为phonics");
});

test("智能解析：英汉互译题从标题分类", () => {
  var text = "三、英汉互译\n1. 我有一个苹果\n2. 她喜欢读书\n\n参考答案\n1.I have an apple 2.She likes reading";
  var result = baSmartParse(text);
  assert.ok(result.questions.length >= 1, "应解析到至少1道题");
  assert.strictEqual(result.questions[0].qType, "translation", "题型应为translation");
});

test("智能解析：句型转换题从标题分类", () => {
  var text = "五、句型转换\n1. He is a student. (改为否定句)\n2. I like apples. (改为一般疑问句)\n\n参考答案\n1.He is not a student 2.Do you like apples";
  var result = baSmartParse(text);
  assert.ok(result.questions.length >= 1);
  assert.strictEqual(result.questions[0].qType, "sentransform");
});

test("智能解析：选择题标题仍用baGuessQType细分", () => {
  var text = "七、单项选择\n1. ___ apple a day keeps the doctor away.\nA.a B.an C.the D./\n\n参考答案\n1.B";
  var result = baSmartParse(text);
  assert.ok(result.questions.length >= 1);
  assert.strictEqual(result.questions[0].qType, "single");
});

test("智能解析：单词辩音有选项按选择题处理答案", () => {
  var text = "一、单词辩音\n1. 找出发音不同的词\nA. apple B. cake C. make D. name\n答案：A\n\n参考答案\n1.A";
  var result = baSmartParse(text);
  assert.ok(result.questions.length >= 1);
  assert.strictEqual(result.questions[0].a, 0, "答案应为A(0)");
  assert.strictEqual(result.questions[0].ansSource, "原卷行内");
});

test("智能解析：听力题有选项按选择题处理", () => {
  var text = "一、听力理解\n1. What does the boy like?\nA. Apples B. Bananas C. Oranges D. Pears\n\n参考答案\n1.B";
  var result = baSmartParse(text);
  assert.ok(result.questions.length >= 1);
  assert.strictEqual(result.questions[0].qType, "listening");
  assert.strictEqual(result.questions[0].a, 1, "答案应为B(1)");
});

test("智能解析：完成句子无选项按主观题处理", () => {
  var text = "六、完成句子\n1. I have ___ apples.\n2. She ___ to school every day.\n\n参考答案\n1.two 2.goes";
  var result = baSmartParse(text);
  assert.ok(result.questions.length >= 1);
  assert.strictEqual(result.questions[0].qType, "complete");
  assert.strictEqual(result.questions[0].ansSource, "主观题");
});

test("题型标签：新题型都有标签", () => {
  assert.ok(BA_QTYPE_LABELS.listening, "listening应有标签");
  assert.ok(BA_QTYPE_LABELS.phonics, "phonics应有标签");
  assert.ok(BA_QTYPE_LABELS.translation, "translation应有标签");
  assert.ok(BA_QTYPE_LABELS.sentransform, "sentransform应有标签");
  assert.ok(BA_QTYPE_LABELS.complete, "complete应有标签");
  assert.ok(BA_QTYPE_LABELS.match, "match应有标签");
  assert.ok(BA_QTYPE_LABELS.order, "order应有标签");
  assert.ok(BA_QTYPE_LABELS.dialogue, "dialogue应有标签");
});