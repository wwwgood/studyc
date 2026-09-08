/* 预览界面手工编辑答案/解析 测试 */
const test = require("node:test");
const assert = require("assert");
const fs = require("fs");
const path = require("path");

global.window = { addEventListener: function(){} };
let src = fs.readFileSync(path.join(__dirname, "../src/scripts/modules/bank-admin.js"), "utf8");
eval(src);

/* mock DOM：baPreview 容器 + 预览题目项 */
var mockPreview = { _questions: [] };
var mockItems = {};
global.document = {
  getElementById: function(id){
    if (id === "baPreview") return mockPreview;
    if (mockItems[id]) return mockItems[id];
    return null;
  },
  querySelectorAll: function(){ return []; }
};

function makeItem(){
  return {
    querySelector: function(sel){
      if (sel === ".ba-preview-opts") return { innerHTML: "" };
      if (sel === ".ba-preview-badges") return { innerHTML: "" };
      return null;
    }
  };
}

test("baEsc：HTML转义", () => {
  assert.strictEqual(baEsc('<b "x">&'), "&lt;b &quot;x&quot;&gt;&amp;");
  assert.strictEqual(baEsc(null), "");
  assert.strictEqual(baEsc(undefined), "");
});

test("baHasRealOpts：主观题与选择题区分", () => {
  assert.strictEqual(baHasRealOpts({ o: ["（主观题，需人工评分）"] }), false);
  assert.strictEqual(baHasRealOpts({ o: ["a", "b"] }), true);
  assert.strictEqual(baHasRealOpts({ o: [] }), false);
});

test("baSetAnsSingle：单选手工录入", () => {
  mockPreview._questions = [{ q: "t", o: ["a", "b", "c"], a: 0, qType: "single", ansSource: "未找到" }];
  mockItems["ba-item-0"] = makeItem();
  baSetAnsSingle(0, "C");
  var q = mockPreview._questions[0];
  assert.strictEqual(q.a, 2);
  assert.strictEqual(q.ansSource, "手工录入");
});

test("baSetAnsJudge：判断手工录入", () => {
  mockPreview._questions = [{ q: "t", o: ["正确", "错误"], a: 1, qType: "judge", ansSource: "未找到" }];
  mockItems["ba-item-0"] = makeItem();
  baSetAnsJudge(0, "对");
  assert.strictEqual(mockPreview._questions[0].a, 0);
  assert.strictEqual(mockPreview._questions[0].ansSource, "手工录入");
});

test("baSetAnsMulti：多选手工录入去重", () => {
  mockPreview._questions = [{ q: "t", o: ["a", "b", "c", "d"], a: [], qType: "multi", ansSource: "未找到" }];
  mockItems["ba-item-0"] = makeItem();
  baSetAnsMulti(0, "a B a c");
  assert.deepStrictEqual(mockPreview._questions[0].a, [0, 1, 2]);
});

test("baSetAnsText：主观题标准答案录入", () => {
  mockPreview._questions = [{ q: "t", o: ["（主观题，需人工评分）"], a: 0, qType: "translation", ansSource: "主观题" }];
  mockItems["ba-item-0"] = makeItem();
  baSetAnsText(0, "I have an apple");
  assert.strictEqual(mockPreview._questions[0].ansText, "I have an apple");
  assert.strictEqual(mockPreview._questions[0].ansSource, "手工录入");
});

test("baSetWhy：解析录入清除自动标记", () => {
  mockPreview._questions = [{ q: "t", o: ["a", "b"], a: 0, why: "旧解析", whyAuto: true, qType: "single" }];
  mockItems["ba-item-0"] = makeItem();
  baSetWhy(0, "手工粘贴的新解析");
  assert.strictEqual(mockPreview._questions[0].why, "手工粘贴的新解析");
  assert.strictEqual(mockPreview._questions[0].whyAuto, false);
});

test("baAnsEditorFor：单选题生成字母下拉", () => {
  var html = baAnsEditorFor({ q: "t", o: ["a", "b", "c", "d"], a: 1, qType: "single" }, 0);
  assert.ok(html.indexOf('value="B" selected') >= 0, "应选中B");
  assert.ok(html.indexOf("baSetAnsSingle(0") >= 0);
});

test("baAnsEditorFor：判断题生成对错下拉", () => {
  var html = baAnsEditorFor({ q: "t", o: ["正确", "错误"], a: 0, qType: "judge" }, 3);
  assert.ok(html.indexOf("baSetAnsJudge(3") >= 0);
});

test("baAnsEditorFor：主观题生成答案文本框", () => {
  var html = baAnsEditorFor({ q: "t", o: ["（主观题，需人工评分）"], a: 0, qType: "translation", ansText: "已有答案" }, 2);
  assert.ok(html.indexOf('value="已有答案"') >= 0);
  assert.ok(html.indexOf("baSetAnsText(2") >= 0);
});

test("baAnsEditorFor：多选题生成字母输入框", () => {
  var html = baAnsEditorFor({ q: "t", o: ["a", "b", "c", "d"], a: [0, 2], qType: "multi" }, 1);
  assert.ok(html.indexOf('value="AC"') >= 0);
  assert.ok(html.indexOf("baSetAnsMulti(1") >= 0);
});