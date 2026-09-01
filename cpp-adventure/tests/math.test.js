const { test } = require("node:test");
const assert = require("node:assert/strict");
const { createMockDOM, loadScripts } = require("./helpers");

function setupMath(store) {
  const mock = createMockDOM();
  const el = mock.document.createElement("input");
  el.value = ""; el.focus = () => {}; el.blur = () => {};
  mock.document._elements.mathIn = el;
  mock.document._elements.mathStatus = mock.document.createElement("div");
  mock.document._elements.mathQ = mock.document.createElement("div");
  mock.document._elements.mathRestart = mock.document.createElement("button");
  if (store) Object.assign(mock.localStorage._store, store);
  const extra = {
    addError: () => {},
    updateTabs: () => {},
  };
  const ctx = loadScripts(["data/levels.js", "core/state.js", "modules/math.js"], mock, extra);
  return { mock, ctx };
}

test("mtNew 生成有效数学题", () => {
  const { ctx } = setupMath();
  ctx.mtNew();
  assert.ok(ctx.mt.a >= 2, "操作数 a 应 >= 2");
  assert.ok(ctx.mt.b >= 2, "操作数 b 应 >= 2");
  assert.ok(["+", "-", "×", "%"].includes(ctx.mt.op), "运算符应合法");
  assert.ok(typeof ctx.mt.ans === "number", "答案应为数字");
});

test("加法题答案正确", () => {
  const { ctx } = setupMath();
  ctx.mt.op = "+"; ctx.mt.a = 5; ctx.mt.b = 3; ctx.mt.ans = 8;
  mockCheck(ctx, "8", true);
});

test("减法题答案正确", () => {
  const { ctx } = setupMath();
  ctx.mt.op = "-"; ctx.mt.a = 10; ctx.mt.b = 4; ctx.mt.ans = 6;
  mockCheck(ctx, "6", true);
  mockCheck(ctx, "5", false);
});

test("乘法题答案正确", () => {
  const { ctx } = setupMath();
  ctx.mt.op = "×"; ctx.mt.a = 7; ctx.mt.b = 8; ctx.mt.ans = 56;
  mockCheck(ctx, "56", true);
  mockCheck(ctx, "42", false);
});

test("取模题答案正确", () => {
  const { ctx } = setupMath();
  ctx.mt.op = "%"; ctx.mt.a = 17; ctx.mt.b = 5; ctx.mt.ans = 2;
  mockCheck(ctx, "2", true);
  mockCheck(ctx, "3", false);
});

function mockCheck(ctx, inputValue, expectCorrect) {
  const mockIn = { value: inputValue, focus: () => {}, blur: () => {} };
  const mockStatus = { textContent: "", style: {} };
  const mockQ = { textContent: "" };
  const origGetById = ctx.document.getElementById;
  ctx.document.getElementById = (id) => {
    if (id === "mathIn") return mockIn;
    if (id === "mathStatus") return mockStatus;
    if (id === "mathQ") return mockQ;
    return origGetById.call(ctx.document, id);
  };
  ctx.S = { passed: {}, errors: [], mathScore: 0, math: 0 };
  ctx.mt.score = 0; ctx.mt.done = 0;
  ctx.mtCheck();
  ctx.document.getElementById = origGetById;
  if (expectCorrect) {
    assert.ok(mockStatus.textContent.includes("对") || ctx.mt.score > 0,
      `输入 ${inputValue} 应判对`);
  } else {
    assert.ok(ctx.mt.score === 0 || mockStatus.textContent.includes("答案"),
      `输入 ${inputValue} 应判错`);
  }
}