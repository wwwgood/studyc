/*
 * 实战特训加题功能测试：文本解析器 + 自定义题存取。
 */
const { test } = require("node:test");
const assert = require("node:assert");
const { createMockDOM, loadScripts } = require("./helpers");

function loadOj() {
  const mock = createMockDOM();
  mock.window = {};
  mock.confirm = () => true;
  return loadScripts(["data/oj-bank.js", "modules/oj.js"], mock);
}

test("ojParseText 解析带标记的真题文本", () => {
  const { ojParseText } = loadOj();
  const sample = [
    "第 12 题：回文数判断",
    "题目：输入一个正整数，判断它是否是回文数（正读反读一样）。",
    "输入：一个正整数 n。",
    "输出：YES 或 NO。",
    "核心考点：字符串反转、循环判断",
    "参考代码：",
    "#include <iostream>",
    "using namespace std;",
    "int main() { return 0; }",
    "参考解析：把数字转成字符串，比较首尾字符。",
    "变形训练：改成判断字符串回文。"
  ].join("\n");
  const r = ojParseText(sample);
  assert.strictEqual(r.title, "回文数判断");
  assert.ok(r.desc.includes("回文数"));
  assert.ok(r.io.includes("输入") && r.io.includes("输出"));
  assert.strictEqual(r.points.join("、"), "字符串反转、循环判断");
  assert.ok(r.code.some((l) => l.includes("iostream")));
  assert.ok(r.code.some((l) => l.includes("main")));
  assert.ok(r.explain.includes("首尾字符"));
  assert.ok(r.variant.includes("字符串回文"));
});

test("ojParseText 支持代码围栏与无标记整段兜底", () => {
  const { ojParseText } = loadOj();
  const fenced = [
    "第 13 题：两数之和",
    "题目：输入两个整数，输出它们的和。",
    "```cpp",
    "#include <iostream>",
    "int main(){ return 0; }",
    "```",
    "解析：直接相加。"
  ].join("\n");
  const r1 = ojParseText(fenced);
  assert.ok(r1.code.some((l) => l.includes("iostream")), "围栏代码应被提取");
  assert.ok(!r1.code.some((l) => l.includes("```")), "围栏标记应被剔除");
  assert.ok(r1.explain.includes("直接相加"));

  const plain = "随便一段没有标记的题目文本，用来做兜底测试。";
  const r2 = ojParseText(plain);
  assert.ok(r2.desc.includes("兜底测试"));
  assert.ok(r2.title.length > 0, "无标题时应生成兜底标题");
});

test("ojGuessCat 按关键词推断题型", () => {
  const { ojGuessCat } = loadOj();
  assert.strictEqual(ojGuessCat("迷宫最短路 BFS"), "图论");
  assert.strictEqual(ojGuessCat("连通块 DFS 岛屿"), "图论");
  assert.strictEqual(ojGuessCat("01背包 动态规划"), "动态规划");
  assert.strictEqual(ojGuessCat("埃氏筛 素数"), "数论");
  assert.strictEqual(ojGuessCat("括号匹配 栈"), "基础数据结构");
  assert.strictEqual(ojGuessCat("约瑟夫环 队列"), "基础数据结构");
  assert.strictEqual(ojGuessCat("结构体排序 sort"), "基础算法");
  assert.strictEqual(ojGuessCat("随便一个循环题"), "基础语法与模拟");
});

test("ojAll 合并内置与自定义题，ojNextId 递增", () => {
  const s = loadOj();
  const custom = [{ id: 12, title: "测试题", cat: "图论", stars: 2, band: "70-85", desc: "d", io: "i", points: ["p"], code: ["int main(){}"], explain: "e", variant: "v" }];
  s.ojCustomSave(custom);
  const all = s.ojAll();
  assert.strictEqual(all.length, 12, "内置 11 + 自定义 1");
  assert.strictEqual(all[11].id, 12);
  assert.strictEqual(s.ojNextId(), 13, "新题 id 应在最大 id 基础上 +1");
  assert.strictEqual(s.ojBandFor(4), "95-100");
});
