/* 英语语法数据校验（含扩题） */
const test = require("node:test");
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const src1 = fs.readFileSync(
  path.join(__dirname, "..", "src", "scripts", "data", "english-grammar.js"),
  "utf8"
);
const src2 = fs.readFileSync(
  path.join(__dirname, "..", "src", "scripts", "data", "english-grammar-extra.js"),
  "utf8"
);
const ctx = {};
vm.createContext(ctx);
vm.runInContext(src1, ctx);
vm.runInContext(src2, ctx);
const EQ = ctx.EQ_DATA;

test("英语章节数量与覆盖（含第 13 章综合模拟）", () => {
  assert.strictEqual(EQ.chapters.length, 13);
  for (let i = 1; i <= 13; i++) {
    assert.ok(EQ.chapters.some((c) => c.id === i), `缺少第 ${i} 章`);
  }
  EQ.chapters.forEach((c) => {
    assert.ok(c.name && c.emoji && c.desc, `章节 ${c.id} 元数据不全`);
  });
});

test("英语关卡总数 103 例（100 原例 + 3 综合模拟）", () => {
  assert.strictEqual(EQ.lessons.length, 103);
});

test("每章例数分布符合设计", () => {
  const want = { 1: 9, 2: 8, 3: 11, 4: 6, 5: 10, 6: 8, 7: 10, 8: 6, 9: 12, 10: 6, 11: 8, 12: 6, 13: 3 };
  for (const [ch, n] of Object.entries(want)) {
    const got = EQ.lessons.filter((l) => l.ch === Number(ch)).length;
    assert.strictEqual(got, n, `第 ${ch} 章应为 ${n} 例，实际 ${got}`);
  }
});

test("每例字段完整且练习有效（每例至少 6 题）", () => {
  EQ.lessons.forEach((l) => {
    assert.ok(l.id && l.ch && l.t && l.tip && l.body && l.say, `例 ${l.id} 字段缺失`);
    assert.ok(Array.isArray(l.ex) && l.ex.length >= 2, `例 ${l.id} 例句不足`);
    l.ex.forEach((e) => {
      assert.ok(e.en && e.zh, `例 ${l.id} 例句缺中英对照`);
    });
    assert.ok(Array.isArray(l.q) && l.q.length >= 6, `例 ${l.id} 练习不足 6 题（实际 ${l.q.length}）`);
    l.q.forEach((q, i) => {
      assert.ok(q.q && Array.isArray(q.o) && q.o.length === 3, `例 ${l.id} 第 ${i} 题应为 3 选项`);
      assert.ok(Number.isInteger(q.a) && q.a >= 0 && q.a < q.o.length, `例 ${l.id} 第 ${i} 题答案越界`);
      assert.ok(q.why && q.why.length > 4, `例 ${l.id} 第 ${i} 题缺解析`);
      assert.ok(q.lv >= 1 && q.lv <= 3, `例 ${l.id} 第 ${i} 题 lv 越界`);
    });
  });
});

test("题目难度档分布合理（每例至少有 lv:1 和 lv:2 题）", () => {
  EQ.lessons.forEach((l) => {
    const lvs = new Set(l.q.map((q) => q.lv));
    assert.ok(lvs.has(1), `例 ${l.id} 缺 lv:1 基础题`);
    assert.ok(lvs.has(2), `例 ${l.id} 缺 lv:2 进阶题`);
  });
});

test("第 13 章综合模拟 30 题", () => {
  const ch13 = EQ.lessons.filter((l) => l.ch === 13);
  assert.strictEqual(ch13.length, 3, "第 13 章应有 3 套模拟卷");
  const totalQ = ch13.reduce((a, l) => a + l.q.length, 0);
  assert.strictEqual(totalQ, 30, `第 13 章应有 30 题，实际 ${totalQ}`);
});

test("例 id 无重复且挂在存在的章节", () => {
  const ids = new Set();
  EQ.lessons.forEach((l) => {
    assert.ok(!ids.has(l.id), `重复 id: ${l.id}`);
    ids.add(l.id);
    assert.ok(EQ.chapters.some((c) => c.id === l.ch), `例 ${l.id} 章节不存在`);
  });
});
