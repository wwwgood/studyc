/*
 * 多题型导入解析测试：bank-admin.js baSmartParse
 * 覆盖：填空(汉译英/改错) / 选词填空 / 阅读理解 / 作文 / 选择题回归
 */
const { test } = require("node:test");
const assert = require("node:assert");
const { loadScripts } = require("./helpers");

function loadBank(baTypeSelectValue) {
  const store = {};
  const mock = {
    localStorage: { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } },
    document: {
      getElementById: (id) => id === "baTypeSelect" ? { value: baTypeSelectValue || "auto" } : null,
    },
    window: { addEventListener: () => {} },
  };
  return loadScripts(["data/question-bank.js", "modules/qtypes.js", "modules/bank-admin.js"], mock);
}

test("汉译英填空：自动识别为 fill 并提取文本答案", () => {
  const { baSmartParse } = loadBank();
  const text = "1. 汉译英：我喜欢苹果。\n答案：I like apples.\n解析：like 后接名词复数。";
  const r = baSmartParse(text);
  assert.strictEqual(r.questions.length, 1);
  const q = r.questions[0];
  assert.strictEqual(q.type, "fill");
  assert.strictEqual(q.qType, "fill");
  assert.strictEqual(q.ansText, "I like apples.");
  assert.match(q.why, /复数/);
});

test("词性转换填空：自动识别为 fill 提取答案", () => {
  const { baSmartParse } = loadBank();
  const text = "1. 用所给词的适当形式填空：I ___ (go) to school yesterday.\n答案：went\n解析：yesterday 用过去式。";
  const r = baSmartParse(text);
  const q = r.questions[0];
  assert.strictEqual(q.type, "fill");
  assert.strictEqual(q.ansText, "went");
});

test("单句改错：自动识别为 fill 提取改正答案", () => {
  const { baSmartParse } = loadBank();
  const text = "1. 单句改错：He go to school every day.\n改正：goes\n答案：goes\n解析：第三人称单数加 es。";
  const r = baSmartParse(text);
  const q = r.questions[0];
  assert.strictEqual(q.type, "fill");
  assert.strictEqual(q.ansText, "goes");
});

test("选词填空：整块一道题，提取词库与逐空答案", () => {
  const { baSmartParse } = loadBank();
  const text = "二、选词填空（用方框中的词填空）\n词库：tall taller tallest\n1. Tom is ___ than Jim.\n2. Lily is the ___ girl in class.\n答案：1. taller 2. tallest";
  const r = baSmartParse(text);
  assert.strictEqual(r.questions.length, 1);
  const q = r.questions[0];
  assert.strictEqual(q.type, "cloze");
  assert.strictEqual(q.words.join(","), "tall,taller,tallest");
  assert.strictEqual(q.blanks.join(","), "taller,tallest");
  assert.strictEqual(q.questions, undefined);
});

test("阅读理解：短文+子题整块一道题", () => {
  const { baSmartParse } = loadBank();
  const text = "三、阅读理解\nTom is a boy. He is ten years old.\nHe likes apples very much.\n1. Tom is a ___.\nA. girl  B. boy\n2. How old is Tom?\nA. nine  B. ten\n答案：1.B 2.B";
  const r = baSmartParse(text);
  assert.strictEqual(r.questions.length, 1);
  const q = r.questions[0];
  assert.strictEqual(q.type, "reading");
  assert.match(q.passage, /Tom is a boy/);
  assert.strictEqual(q.questions.length, 2);
  assert.strictEqual(q.questions[0].a, 1);
  assert.strictEqual(q.questions[1].a, 1);
});

test("作文：题目+要点+范文整块一道题", () => {
  const { baSmartParse } = loadBank();
  const text = "四、书面表达\n以 My Family 为题写一篇作文，不少于 40 词。\n要点：1. 家庭成员 2. 爱好\n范文：My family has four people. My father likes reading...";
  const r = baSmartParse(text);
  assert.strictEqual(r.questions.length, 1);
  const q = r.questions[0];
  assert.strictEqual(q.type, "writing");
  assert.strictEqual(q.tips.join(","), "家庭成员,爱好");
  assert.match(q.sample, /My family has four people/);
});

test("手动指定题型：强制按题型解析", () => {
  const { baSmartParse } = loadBank("fill");
  const text = "1. The ___ (child) are playing.\n答案：children";
  const r = baSmartParse(text);
  assert.strictEqual(r.questions[0].type, "fill");
  assert.strictEqual(r.questions[0].ansText, "children");
});

test("选择题回归：原有解析不受影响", () => {
  const { baSmartParse } = loadBank();
  const text = "1. There are some ___ on the table.\nA. tomato  B. tomatos  C. tomatoes  D. tomatoos\n答案：C\n解析：以辅音字母+o结尾加es。";
  const r = baSmartParse(text);
  assert.strictEqual(r.questions.length, 1);
  const q = r.questions[0];
  assert.strictEqual(q.qType, "single");
  assert.strictEqual(q.a, 2);
  assert.strictEqual(q.o.length, 4);
});

test("名词真题整卷：题干词汇选词 + 无编号行级拆分 + 单句改错 →", () => {
  const { baSmartParse } = loadBank();
  const text = [
    "一、从所给的单词中找出五个专有名词，填写在下面的横线上，并写出它们的汉语意思。",
    "题干词汇： football　Sally Green　carrot　Hong Kong　jacket　the Yellow River　computer　May　snake　food　National Day　window",
    "答案：Sally Green（萨利·格林） 解析：人名属于专有名词。",
    "答案：Hong Kong（香港） 解析：地名属于专有名词。",
    "答案：the Yellow River（黄河） 解析：江河名称属于专有名词。",
    "答案：May（五月） 解析：月份名称首字母必须大写。",
    "答案：National Day（国庆节） 解析：节日名称属于专有名词。",
    "二、下面的专有名词，每个都有错误，你能迅速改正吗？",
    "White Joe __________ 答案：Joe White 解析：人名应名在前。",
    "australia __________ 答案：Australia 解析：国家名称首字母要大写。",
    "三、词形转换",
    "A. 写出下列名词的复数形式。",
    "pencil __________ 答案：pencils 解析：直接加 -s。",
    "foot __________ 答案：feet 解析：不规则变化。",
    "B. 用所给名词的适当形式填空。",
    "My grandmother bought two new ______ (watch). 答案：watches 解析：two 后接可数名词复数；watch 以 ch 结尾，复数加 -es。",
    "四、将下列短语翻译成英语。",
    "妹妹的房间 __________ 答案：the sister's room 解析：有生命名词所有格。",
    "五、单句改错：下列各句中均有一处错误，指出并改正。",
    "There are(A) sixty minutes(B) in a hour©. 答案：C；a hour → an hour 解析：hour 以元音音素开头，不定冠词用 an。",
    "He eats eggs,(A) breads(B) and drinks milk© in the morning. 答案：B；breads → bread 解析：bread（面包）是不可数名词，没有复数形式。"
  ].join("\n");
  const r = baSmartParse(text);
  assert.strictEqual(r.questions.length, 9, "应解析 9 道题（1 选词 + 8 填空）");
  const q0 = r.questions[0];
  assert.strictEqual(q0.type, "cloze");
  assert.strictEqual(q0.words.length, 12, "词库应保留整词（Sally Green 不拆）");
  assert.ok(q0.words.indexOf("Sally Green") >= 0 && q0.words.indexOf("the Yellow River") >= 0);
  assert.strictEqual(q0.blanks.join("|"), "Sally Green|Hong Kong|the Yellow River|May|National Day");
  const byQ = {};
  r.questions.forEach((q) => { byQ[q.q] = q; });
  assert.strictEqual(byQ["White Joe __________"].ansText, "Joe White");
  assert.strictEqual(byQ["australia __________"].ansText, "Australia");
  assert.strictEqual(byQ["pencil __________"].ansText, "pencils");
  assert.strictEqual(byQ["foot __________"].ansText, "feet");
  assert.strictEqual(byQ["My grandmother bought two new ______ (watch)."].ansText, "watches");
  assert.strictEqual(byQ["妹妹的房间 __________"].ansText, "the sister's room");
  const corr = r.questions.find((q) => q.q.indexOf("There are(A)") >= 0);
  assert.strictEqual(corr.ansText, "an hour", "单句改错应取 → 后内容为判题答案");
  const corr2 = r.questions.find((q) => q.q.indexOf("He eats eggs") >= 0);
  assert.strictEqual(corr2.ansText, "bread");
  r.questions.forEach((q) => assert.ok(q.type === "cloze" || q.type === "fill", "全卷题型应为 cloze/fill，实际 " + q.type));
  /* 考点自动归类：50 题样例实测 0 未识别，此处断言关键题归类（避免退回手工） */
  r.questions.forEach((q) => assert.ok(q.kp && q.kp[0], "每题应自动识别考点，未识别：" + String(q.q).slice(0, 16)));
  const kpOf = {};
  r.questions.forEach((q) => { kpOf[String(q.q)] = q.kp[0]; });
  function kp(re) {
    const hit = Object.keys(kpOf).find((k) => re.test(k));
    return hit ? kpOf[hit] : undefined;
  }
  assert.strictEqual(kp(/^题干词汇/), "专有名词");
  assert.strictEqual(kp(/^White Joe/), "专有名词");
  assert.strictEqual(kp(/^pencil/), "名词复数-加s规则");
  assert.strictEqual(kp(/^foot\b/), "不规则名词复数");
  assert.strictEqual(kp(/^My grandmother/), "名词复数-es规则");
  assert.strictEqual(kp(/^妹妹的房间/), "名词所有格");
  assert.strictEqual(kp(/^There are\(A\)/), "a与an的区别");
  assert.strictEqual(kp(/^He eats eggs/), "可数与不可数名词");
});
