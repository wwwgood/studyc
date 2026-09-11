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
  return loadScripts(["data/question-bank.js", "modules/question-bank.js", "modules/qtypes.js", "modules/bank-admin.js"], mock);
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

/* 考点聚合：导入题按 kp 字段精确聚合，供「按考点练真题」面板使用 */
test("考点聚合：qbQuery 按 kp 精确过滤，混练不会串考点", () => {
  const { qbAdd, qbQuery } = loadBank();
  qbAdd({ id: "kpt-1", subject: "english", module: "grammar", topicId: 1, kp: ["专有名词"], q: "A1" });
  qbAdd({ id: "kpt-2", subject: "english", module: "grammar", topicId: 1, kp: ["名词复数-加s规则"], q: "B1" });
  qbAdd({ id: "kpt-3", subject: "english", module: "grammar", topicId: 1, kp: ["专有名词"], q: "A2" });
  const onlyKp = qbQuery("grammar", null, "english", "专有名词");
  const ids = onlyKp.map((q) => q.id);
  assert.ok(ids.indexOf("kpt-1") >= 0 && ids.indexOf("kpt-3") >= 0, "专有名词题应全部命中");
  assert.ok(ids.indexOf("kpt-2") < 0, "其它考点题不得混入");
  const miss = qbQuery("grammar", null, "english", "不存在的考点");
  assert.strictEqual(miss.length, 0);
});
/* 名词辨认类：无编号、题目行+独立答案行（答案行绝不单独成题、题干不丢、自动判题） */
test("名词辨认卷：独立答案行并入题目行，题干完整且自动判题", () => {
  const { baSmartParse } = loadBank();
  const text = "选出下列句子中的名词。\n答案：apple\n解析：apple 是可数名词，是物品名称。\n选出下列单词中的复数形式。\n答案：books\n解析：books 是 book 的复数。";
  const r = baSmartParse(text);
  assert.strictEqual(r.questions.length, 2, "应解析出 2 道题");
  assert.strictEqual(r.questions[0].q, "选出下列句子中的名词。", "题干必须完整，不得变成「答案：apple」");
  assert.strictEqual(r.questions[0].ansText, "apple", "答案文本应提取为判题依据");
  assert.strictEqual(r.questions[0].type, "fill", "主观填空应自动转 fill，不依赖人工评分");
  assert.match(r.questions[0].why, /可数名词/);
  assert.strictEqual(r.questions[1].ansText, "books");
});
/* 旧坏题自动清理：题干以「答案」开头 / 人工评分占位无内容 → 加载与导入时自动清除 */
test("旧坏题自动清理：答案开头的题和人工评分占位题被清除，好题保留", () => {
  const { baSmartParse, baCleanBadImported, QB_DATA } = loadBank();
  QB_DATA.questions.push(
    { id: "qb90001", imported: true, q: "答案: apple", o: ["（主观题，需人工评分）"], a: 0, ansText: "" },
    { id: "qb90002", imported: true, q: "选出下列单词中的名词。", o: ["（主观题，需人工评分）"], a: 0, ansText: "" },
    { id: "qb90003", imported: true, q: "pencil __________", ansText: "pencils", type: "fill", o: [], a: 0, why: "直接加 -s。" },
    { id: "qb90004", imported: false, q: "内置题不应被清", o: ["A", "B"], a: 0 }
  );
  const n = baCleanBadImported();
  assert.strictEqual(n, 2, "应清除 2 道坏题");
  const ids = QB_DATA.questions.map((q) => q.id);
  assert.ok(!ids.includes("qb90001") && !ids.includes("qb90002"), "坏题已清除");
  assert.ok(ids.includes("qb90003") && ids.includes("qb90004"), "好题与内置题保留");
});

/* 正确答案文本：选择题带选项文本，填空返回答案词 */
test("qtAnswerText：选择题显示选项文本、填空显示答案词", () => {
  const { qtAnswerText } = loadBank();
  const qChoice = { q: "选出名词", o: ["run", "apple", "happy"], a: 1 };
  assert.strictEqual(qtAnswerText(qChoice), "B apple");
  const qFill = { q: "pencil __________", ansText: "pencils", type: "fill" };
  assert.strictEqual(qtAnswerText(qFill), "pencils");
});
/* 原样解析器：用户整理好的格式直接入库，题面一字不改，不做二次辨析 */
test("原样解析：行内/分块/词库/多空/改错 各格式原样建题", () => {
  const { baSimpleParse } = loadBank();
  const text = "一、找出专有名词。\n题干词汇： Sally Green　Hong Kong\n答案：Sally Green（萨利·格林） 解析：人名属于专有名词。\n答案：Hong Kong（香港） 解析：地名属于专有名词。\n二、改正专有名词\nWhite Joe __________ 答案：Joe White 解析：人名应名在前。\n三、词形转换\npencil __________ 答案：pencils 解析：直接加 -s。\n—What are those ______ (man) doing? 答案：men；children 解析：those 后接复数 men。\n四、改错\nThere are(A) sixty minutes(B) in a hour©. 答案：C；a hour → an hour 解析：hour 用 an。";
  const r = baSimpleParse(text);
  assert.strictEqual(r.questions.length, 5, "应解析出 5 道题");
  const q0 = r.questions[0];
  assert.strictEqual(q0.type, "cloze", "词库多答案 → 选词填空");
  assert.strictEqual(q0.blanks.join(","), "Sally Green,Hong Kong", "词库与答案原样");
  const q1 = r.questions[1];
  assert.strictEqual(q1.q, "White Joe __________");
  assert.strictEqual(q1.ansText, "Joe White");
  assert.strictEqual(q1.why, "人名应名在前。");
  const q3 = r.questions[3];
  assert.strictEqual(q3.ansText, "men；children", "多空答案原样保留分隔符");
  const q4 = r.questions[4];
  assert.strictEqual(q4.q, "There are(A) sixty minutes(B) in a hour©.");
  assert.strictEqual(q4.ansText, "C；a hour → an hour");
  /* 绝不产出人工评分占位 */
  r.questions.forEach((q) => {
    assert.ok(!String(q.o && q.o[0] || "").includes("主观题，需人工评分"));
  });
});

test("原样解析：纯「答案：」行与字母小节标题不建题", () => {
  const { baSimpleParse } = loadBank();
  const text = "A. 写出复数形式。\n答案：pencils\nB. 填空。\nbook __________ 答案：books 解析：直接加 -s。";
  const r = baSimpleParse(text);
  assert.strictEqual(r.questions.length, 1, "A. 小节标题与孤立答案行不成题");
  assert.strictEqual(r.questions[0].q, "book __________");
  assert.strictEqual(r.questions[0].ansText, "books");
});

/* fill 多空判题：答案以「；」分隔 → 全部匹配才算对 */
test("fill 多空判题：全部空匹配才正确，任一匹配不正确", () => {
  const { qtGrade } = loadBank();
  const q = { q: "填空", ansText: "men；children", type: "fill" };
  assert.strictEqual(qtGrade(q, "men；children").ok, true, "全对正确");
  assert.strictEqual(qtGrade(q, "men").ok, false, "只填一空不正确");
  assert.strictEqual(qtGrade(q, "children；men").ok, false, "顺序错误不正确");
  assert.match(qtGrade(q, "men").show, /men \/ children/, "错时提示参考答案");
});
