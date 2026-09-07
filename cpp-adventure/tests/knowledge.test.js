/* 考点识别引擎测试 */
const test = require("node:test");
const assert = require("assert");
const fs = require("fs");
const path = require("path");

global.window = { addEventListener: function(){} };
let src = fs.readFileSync(path.join(__dirname, "../src/scripts/modules/bank-admin.js"), "utf8");
eval(src);

test("解析文本证据：不可数名词", () => {
  const k = baDetectKnowledge("water 是不可数名词，不能用 How many", "How much ___ is there?", ["water", "waters"]);
  assert.ok(k && k.name === "可数与不可数名词", "应识别为可数与不可数名词，实际：" + JSON.stringify(k));
  assert.strictEqual(k.topicId, 1);
});

test("解析文本证据：名词复数es", () => {
  const k = baDetectKnowledge("box以x结尾，变复数要加es", "box的复数是？", ["boxs", "boxes"]);
  assert.ok(k && k.name === "名词复数-es规则", "实际：" + JSON.stringify(k));
  assert.strictEqual(k.topicId, 1);
});

test("解析文本证据：不规则复数", () => {
  const k = baDetectKnowledge("child的复数是不规则变化children", "child的复数？", ["childs", "children"]);
  assert.ok(k && k.name === "不规则名词复数", "实际：" + JSON.stringify(k));
  assert.strictEqual(k.topicId, 1);
});

test("解析文本证据：a与an", () => {
  const k = baDetectKnowledge("apple以元音开头，要用an", "___ apple", ["a", "an", "the"]);
  assert.ok(k && k.name === "a与an的区别", "实际：" + JSON.stringify(k));
  assert.strictEqual(k.topicId, 2);
});

test("解析文本证据：三单", () => {
  const k = baDetectKnowledge("主语是he，是第三人称单数，动词要加s", "He ___ TV every day.", ["watch", "watches", "watching"]);
  assert.ok(k && k.name === "动词第三人称单数", "实际：" + JSON.stringify(k));
  assert.strictEqual(k.topicId, 9);
});

test("题干证据：现在进行时", () => {
  const k = baDetectKnowledge("", "Look! The boys are playing football now.", ["play", "playing"]);
  assert.ok(k && (k.name === "现在进行时" || k.name === "动词ing形式"), "实际：" + JSON.stringify(k));
  assert.strictEqual(k.topicId, 10);
});

test("题干证据：一般过去时", () => {
  const k = baDetectKnowledge("", "I ___ to the zoo yesterday.", ["go", "went", "will go"]);
  assert.ok(k && k.name === "一般过去时", "实际：" + JSON.stringify(k));
  assert.strictEqual(k.topicId, 11);
});

test("题干证据：将来时", () => {
  const k = baDetectKnowledge("", "We will visit the Great Wall tomorrow.", []);
  assert.ok(k && k.name === "一般将来时", "实际：" + JSON.stringify(k));
  assert.strictEqual(k.topicId, 11);
});

test("题干证据：时间介词", () => {
  const k = baDetectKnowledge("", "We have classes ___ Monday morning.", ["in", "on", "at"]);
  assert.ok(k && k.topicId === 7, "应归入介词迷宫(第7章)，实际：" + JSON.stringify(k));
});

test("选项证据：比较级", () => {
  const k = baDetectKnowledge("", "Tom is ___ than Jim.", ["taller", "tallest"]);
  assert.ok(k && (k.name === "形容词比较级"), "实际：" + JSON.stringify(k));
  assert.strictEqual(k.topicId, 5);
});

test("选项证据：be动词", () => {
  const k = baDetectKnowledge("", "There ___ a book on the desk.", ["is", "are", "am"]);
  assert.ok(k && (k.name === "there be句型" || k.name === "be动词am/is/are"), "实际：" + JSON.stringify(k));
  assert.strictEqual(k.topicId, 9);
});

test("解析优先于题干", () => {
  const k = baDetectKnowledge("本题考查形容词比较级", "I went to Beijing yesterday.", ["bigger"]);
  assert.ok(k && k.name === "形容词比较级", "解析证据应优先，实际：" + JSON.stringify(k));
});

test("疑问词开头识别为特殊疑问句", () => {
  const k = baDetectKnowledge("", "What color is the sky?", ["blue", "red"]);
  assert.ok(k && k.name === "特殊疑问句", "实际：" + JSON.stringify(k));
  assert.strictEqual(k.topicId, 12);
});