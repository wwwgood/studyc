/*
 * 实战特训数据测试：校验 OJ_BANK（11 道真题）/ OJ_PLAN（6 阶段）/ OJ_HANDBOOK 完整性。
 */
const { test } = require("node:test");
const assert = require("node:assert");
const { loadScripts } = require("./helpers");

function loadOj() {
  const mock = { localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} }, document: { getElementById: () => null }, window: {} };
  const sandbox = loadScripts(["data/oj-bank.js"], mock);
  return sandbox;
}

test("OJ_BANK 应为 11 道真题", () => {
  const { OJ_BANK } = loadOj();
  assert.strictEqual(OJ_BANK.length, 11, "两校机考回忆版核心题型应为 11 题");
});

test("OJ_BANK 每题字段完整", () => {
  const { OJ_BANK } = loadOj();
  const required = ["id","title","cat","stars","band","desc","io","points","code","explain","variant"];
  OJ_BANK.forEach((t) => {
    required.forEach((k) => {
      assert.ok(t[k] !== undefined && t[k] !== "", `第 ${t.id} 题缺字段 ${k}`);
    });
    assert.ok(Array.isArray(t.points) && t.points.length > 0, `第 ${t.id} 题考点不能为空`);
    assert.ok(Array.isArray(t.code) && t.code.length >= 10, `第 ${t.id} 题参考代码不完整`);
  });
});

test("OJ_BANK id 唯一且难度在 1-4 星", () => {
  const { OJ_BANK } = loadOj();
  const ids = OJ_BANK.map((t) => t.id);
  assert.strictEqual(new Set(ids).size, OJ_BANK.length, "id 必须唯一");
  OJ_BANK.forEach((t) => {
    assert.ok(t.stars >= 1 && t.stars <= 4, `第 ${t.id} 题难度应为 1-4 星`);
  });
});

test("OJ_BANK 题型分组覆盖六大类且无遗漏", () => {
  const { OJ_BANK, OJ_CATS } = loadOj();
  const cats = new Set(OJ_BANK.map((t) => t.cat));
  OJ_CATS.forEach((c) => {
    assert.ok(cats.has(c), `题型分组 ${c} 应有题目`);
  });
  assert.strictEqual(cats.size, OJ_CATS.length, "不应出现分组外题型");
});

test("参考代码需包含关键头文件与 main 函数", () => {
  const { OJ_BANK } = loadOj();
  OJ_BANK.forEach((t) => {
    const code = t.code.join("\n");
    assert.ok(/int main\(\)/.test(code), `第 ${t.id} 题代码缺 main 函数`);
    assert.ok(/using namespace std;/.test(code), `第 ${t.id} 题代码缺命名空间声明`);
  });
});

test("OJ_PLAN 应为 5 个阶段且按顺序覆盖半年", () => {
  const { OJ_PLAN } = loadOj();
  assert.strictEqual(OJ_PLAN.length, 5, "半年计划应为 5 个阶段（第1-2月合并为一个月段）");
  OJ_PLAN.forEach((p) => {
    assert.ok(p.title && p.daily && p.content && p.goal && p.tips, `阶段 ${p.phase} 字段不完整`);
    assert.ok(/第/.test(p.span), `阶段 ${p.phase} 月份跨度格式错误`);
  });
});

test("OJ_HANDBOOK 应包含三大训练主题", () => {
  const { OJ_HANDBOOK } = loadOj();
  assert.strictEqual(OJ_HANDBOOK.length, 3, "作战手册应有 3 大主题");
  OJ_HANDBOOK.forEach((h) => {
    assert.ok(Array.isArray(h.items) && h.items.length >= 3, `${h.title} 要点过少`);
  });
});

test("OJ_QUIZ：每道内置真题应有 3 道考点选择题且答案合法", () => {
  const { OJ_BANK, OJ_QUIZ } = loadOj();
  OJ_BANK.forEach((t) => {
    const quiz = OJ_QUIZ[t.id];
    assert.ok(quiz && quiz.length === 3, `第 ${t.id} 题缺 3 道测验题`);
    quiz.forEach((q, i) => {
      assert.ok(q.q && Array.isArray(q.opts) && q.opts.length >= 2, `第 ${t.id} 题测验 ${i} 结构不完整`);
      assert.ok(q.why, `第 ${t.id} 题测验 ${i} 缺讲解`);
      assert.ok(q.ans >= 0 && q.ans < q.opts.length, `第 ${t.id} 题测验 ${i} 答案越界`);
    });
  });
  assert.strictEqual(Object.keys(OJ_QUIZ).length, 11, "应覆盖全部 11 道真题");
});

test("OJ_TASKS：5 阶段 24 周任务，含具体做法与过关标准", () => {
  const { OJ_TASKS, OJ_BANK } = loadOj();
  assert.strictEqual(OJ_TASKS.length, 5, "半年航线应为 5 个阶段");
  let total = 0;
  OJ_TASKS.forEach((ph) => {
    assert.ok(Array.isArray(ph.tasks) && ph.tasks.length >= 4, `${ph.title} 任务过少`);
    ph.tasks.forEach((tk) => {
      total++;
      assert.ok(tk.w && tk.name && tk.do && tk.check, `${ph.title} 任务 ${tk.name} 字段不完整`);
      if (tk.link != null){
        assert.ok(OJ_BANK.some((t) => t.id === tk.link), `任务 ${tk.name} 关联真题 ${tk.link} 不存在`);
      }
    });
  });
  assert.strictEqual(total, 24, "总任务数应为 24 周");
});

test("OJ_STRATEGY：6 道情景题且答案合法", () => {
  const { OJ_STRATEGY } = loadOj();
  assert.strictEqual(OJ_STRATEGY.length, 6, "策略闯关应有 6 道情景题");
  OJ_STRATEGY.forEach((q, i) => {
    assert.ok(q.q && Array.isArray(q.opts) && q.opts.length >= 3, `情景题 ${i} 结构不完整`);
    assert.ok(q.why, `情景题 ${i} 缺讲解`);
    assert.ok(q.ans >= 0 && q.ans < q.opts.length, `情景题 ${i} 答案越界`);
  });
});
