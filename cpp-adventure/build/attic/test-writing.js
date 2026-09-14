/* 作文训练改造测试：中英对照 + 点词查义 + 分步写作
 * 用法：node build/test-writing.js
 */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("C:/Users/zb/.workbuddy/binaries/node/workspace/node_modules/jsdom");

const ROOT = path.join(__dirname, "..");
function rd(p){ return fs.readFileSync(path.join(ROOT, p), "utf8"); }

let pass = 0, fail = 0;
function ok(cond, name, extra){
  if (cond){ pass++; console.log("  ✅ " + name); }
  else { fail++; console.log("  ❌ " + name + (extra ? "  → " + extra : "")); }
}

function boot(){
  const dom = new JSDOM(
    '<!DOCTYPE html><body>' +
    '<div id="wqTotalBar"></div><span id="wqTotalTxt"></span><span id="wqCoins"></span>' +
    '<div id="wqBooks"></div>' +
    '<div id="wqDialogMask"><div id="wqDialog"></div></div>' +
    '</body>', { url: "http://localhost/", runScripts: "dangerously" });
  const w = dom.window;
  w.eval("var S={}; function saveS(){} function portalRenderTopbar(){} function fireConfetti(){} function errBookAdd(){}");
  w.eval(rd("src/scripts/data/english-writing.js"));
  w.eval(rd("src/scripts/data/english-writing-zh.js"));
  w.eval(rd("src/scripts/modules/writing-quest.js"));
  return w;
}

console.log("\n【1】翻译数据完整性");
{
  const w = boot();
  const ZH = w.WRITE_ZH, P = w.WRITE_DATA.passages;
  ok(Object.keys(ZH.s).length >= 900, "句库 " + Object.keys(ZH.s).length + " 条");
  ok(Object.keys(ZH.w).length >= 1100, "词库 " + Object.keys(ZH.w).length + " 条");
  ok(Object.keys(ZH.q).length >= 270, "题干 " + Object.keys(ZH.q).length + " 条");
  ok(Object.keys(ZH.o).length >= 600, "选项 " + Object.keys(ZH.o).length + " 条");

  let missSent = 0, totalSent = 0, missWord = 0, totalWord = 0, missQ = 0, missO = 0;
  P.forEach(p => {
    w.wqSents(p.body).forEach(s => { totalSent++; if (!ZH.s[s]) missSent++; });
    (p.words || []).forEach(x => { totalWord++; if (!w.wqLookupWord(x)) missWord++; });
    (p.q || []).forEach(q => {
      if (!ZH.q[q.q]) missQ++;
      q.o.forEach(o => { if (!ZH.o[o]) missO++; });
    });
  });
  ok(missSent === 0, "全部范文句子都有中文（" + totalSent + " 句）", "缺 " + missSent);
  ok(missWord === 0, "全部重点词汇都有中文（" + totalWord + " 个）", "缺 " + missWord);
  ok(missQ === 0, "全部练习题题干都有中文", "缺 " + missQ);
  ok(missO === 0, "全部练习题选项都有中文", "缺 " + missO);
}

console.log("\n【2】范文页：中英对照 + 点词查义");
{
  const w = boot();
  w.wqOpen("w1");
  const dlg = w.document.getElementById("wqDialog");
  ok(/中英对照/.test(dlg.innerHTML), "有模式切换条");
  ok(dlg.querySelectorAll(".wq-mode-btn").length === 3, "三种显示模式");

  // 默认中英对照：英文句子 + 中文句子
  const p1 = w.WRITE_DATA.passages.filter(x => x.id === "w1")[0];
  const zhShown = dlg.querySelector(".wq-reader").textContent;
  ok(/Hello, everyone!/.test(zhShown), "显示英文范文");
  ok(/大家好|你们好/.test(zhShown), "显示中文翻译");

  // 点词查义
  const wordEl = dlg.querySelector(".wq-word");
  ok(!!wordEl, "范文里的单词可点击");
  wordEl.dispatchEvent(new w.Event("click"));
  const tip = w.document.getElementById("wqWordTip").textContent;
  ok(/→/.test(tip) && tip.length > 4, "点单词显示中文意思：" + tip.trim());

  // 词汇 chip 带中文
  const chips = dlg.querySelectorAll(".wq-word-chip");
  ok(chips.length > 0 && chips[0].querySelector("small"), "重点词汇带中文释义");

  // 纯中文模式
  w.wqSetMode("zh");
  const zhBody = w.document.getElementById("wqDialog").querySelector(".wq-reader").textContent;
  ok(!/Hello, everyone!/.test(zhBody), "只看中文模式不显示英文");
  ok(zhBody.trim().length > 20, "只看中文模式有内容");

  // 纯英文模式
  w.wqSetMode("en");
  const enBody = w.document.getElementById("wqDialog").querySelector(".wq-reader").textContent;
  ok(/Hello, everyone!/.test(enBody), "纯英文模式显示英文");
}

console.log("\n【3】分步写作：结构");
{
  const w = boot();
  const P = w.WRITE_DATA.passages;
  let badSteps = 0, noCn = 0, noKw = 0, noEn = 0;
  P.forEach(p => {
    w.wqOpen(p.id);
    const s = w.WQ_SESSION;
    const want = (p.tips && p.tips.length) ? p.tips.length : 4;
    if (s.steps.length !== Math.min(want, w.wqSents(p.body).length)) badSteps++;
    s.steps.forEach(st => {
      if (!st.cn) noCn++;
      if (!st.kws.length) noKw++;
      if (!st.en) noEn++;
    });
    w.wqClose();
  });
  ok(badSteps === 0, "99 篇都能按写作要点拆成对应步数", badSteps + " 篇不对");
  ok(noCn === 0, "每一步都有中文提示", noCn + " 步缺");
  ok(noKw === 0, "每一步都有参考关键词", noKw + " 步缺");
  ok(noEn === 0, "每一步都有范文参考句", noEn + " 步缺");
}

console.log("\n【4】分步写作：交互与评分");
{
  const w = boot();
  w.wqOpen("w1");
  w.wqStartWrite();
  let dlg = w.document.getElementById("wqDialog");
  ok(/第 1 \/ 4 步/.test(dlg.innerHTML), "进入第 1 步（共 4 步）");
  ok(!!dlg.querySelector("#wqInput"), "有写作输入框");
  ok(dlg.querySelectorAll(".wq-dot").length === 4, "进度点 4 个");
  ok(dlg.querySelectorAll(".wq-chip").length > 0, "有可插入的词汇按钮");
  ok(/中文意思/.test(dlg.innerHTML), "有中文提示");

  // 空内容检查
  w.wqCheckStep();
  ok(/还没写/.test(w.document.getElementById("wqFeedback").innerHTML), "空内容会被拦下并提示");

  // 太短
  w.document.getElementById("wqInput").value = "Hi.";
  w.document.getElementById("wqInput").dispatchEvent(new w.Event("input"));
  w.wqCheckStep();
  ok(/太短/.test(w.document.getElementById("wqFeedback").innerHTML), "太短会提示补充");

  // 写得好：直接用范文原句
  const s = w.WQ_SESSION;
  const ref = s.steps[0].en;
  w.document.getElementById("wqInput").value = ref;
  w.document.getElementById("wqInput").dispatchEvent(new w.Event("input"));
  w.wqCheckStep();
  let fb = w.document.getElementById("wqFeedback").innerHTML;
  ok(/写得不错/.test(fb), "写对会给正面反馈");
  ok((fb.match(/wq-mini-star on/g) || []).length === 3, "用上范文关键词拿 3 星");
  ok(/下一步/.test(fb), "出现「下一步」按钮");

  // 插入词汇按钮
  w.document.getElementById("wqInput").value = "I am";
  const before = w.document.getElementById("wqInput").value;
  w.wqInsert("student");
  ok(w.document.getElementById("wqInput").value.indexOf("student") > before.indexOf("student"), "点词汇能插入光标处");

  // 走到最后一步并交卷
  w.wqStartWrite();
  for (let i = 0; i < s.steps.length; i++){
    w.document.getElementById("wqInput").value = w.WQ_SESSION.steps[i].en;
    w.document.getElementById("wqInput").dispatchEvent(new w.Event("input"));
    w.wqCheckStep();
    w.wqStepNext();
  }
  const html = w.document.getElementById("wqDialog").innerHTML;
  ok(/我的作文/.test(html), "最后进入「我的作文」成果页");
  ok(/我写的/.test(html), "成果页展示我写的作文");
  ok(/和范文比一比/.test(html), "成果页可和范文对照");
  const mywork = w.S.writing.mywork["w1"];
  ok(!!mywork && mywork.split("\n").length === s.steps.length, "我的作文已保存（" + (mywork ? mywork.split("\n").length : 0) + " 段）");
  ok(w.S.writing.done["w1"] === 3, "全对拿 3 星，实际 " + w.S.writing.done["w1"]);
  ok(w.S.writing.coins > 0, "写作得金币 " + w.S.writing.coins);
}

console.log("\n【5】重进时保留已写内容");
{
  const w = boot();
  w.wqOpen("w1");
  w.wqStartWrite();
  w.document.getElementById("wqInput").value = "My name is Ann.";
  w.document.getElementById("wqInput").dispatchEvent(new w.Event("input"));
  w.wqStepNext();
  w.document.getElementById("wqInput").value = "I am nine.";
  w.document.getElementById("wqInput").dispatchEvent(new w.Event("input"));
  w.wqCheckStep();
  w.wqStepNext();
  w.wqStepNext();
  w.wqStepNext();
  w.wqClose();
  w.wqOpen("w1");
  ok(/写过/.test(w.document.getElementById("wqDialog").innerHTML), "范文页提示之前写过");
  w.wqStartWrite();
  ok(w.document.getElementById("wqInput").value === "My name is Ann.", "重新进入保留第 1 步内容");
}

console.log("\n【6】读懂检查（原选择题）已加中文且降级为选做");
{
  const w = boot();
  w.wqOpen("w1");
  let dlg = w.document.getElementById("wqDialog");
  ok(/读懂检查/.test(dlg.innerHTML) && /选做/.test(dlg.innerHTML), "选择题标注为「选做」");
  ok(/开始写这篇/.test(dlg.innerHTML), "主按钮是「开始写这篇」");

  w.wqStartQuiz();
  dlg = w.document.getElementById("wqDialog");
  const qEn = dlg.querySelector(".wq-q-en"), qZh = dlg.querySelector(".wq-q-zh");
  ok(!!qEn && !!qZh, "题干有英文 + 中文：" + (qZh ? qZh.textContent : ""));
  const optZh = dlg.querySelectorAll(".wq-opt-zh");
  ok(optZh.length >= 3, "选项有中文（" + optZh.length + " 个）");

  // 答对后进结果页，提供去写作的入口
  const q = w.WQ_SESSION.passage.q[0];
  w.document.querySelectorAll(".wq-opt")[q.a].dispatchEvent(new w.Event("click"));
  w.wqNext(); w.document.querySelectorAll(".wq-opt")[w.WQ_SESSION.passage.q[1].a].dispatchEvent(new w.Event("click"));
  w.wqNext(); w.document.querySelectorAll(".wq-opt")[w.WQ_SESSION.passage.q[2].a].dispatchEvent(new w.Event("click"));
  w.wqNext();
  const res = w.document.getElementById("wqDialog").innerHTML;
  ok(/读懂检查完成/.test(res), "读懂检查有独立结果页");
  ok(/去写这篇/.test(res), "结果页引导去写作");
  ok(w.S.writing.done["w1"] <= 2, "只做检查最高 2 星（鼓励动笔），实际 " + w.S.writing.done["w1"]);
}

console.log("\n【7】回归：列表页与进度");
{
  const w = boot();
  w.wqRender();
  ok(w.document.querySelectorAll(".wq-book").length === 4, "4 本书");
  w.wqToggle(1);
  ok(w.document.querySelectorAll("#wqList1 .wq-passage:not(.wq-collapse)").length === 25, "第 1 本 25 篇");
  w.wqOpen("w1");
  w.wqStartWrite();
  w.document.getElementById("wqInput").value = "Hello, everyone! My name is Li Ming.";
  w.document.getElementById("wqInput").dispatchEvent(new w.Event("input"));
  w.wqCheckStep(); w.wqStepNext(); w.wqStepNext(); w.wqStepNext(); w.wqStepNext();
  w.wqClose();
  ok(/✍️写过/.test(w.document.getElementById("wqBooks").innerHTML) === false, "（关闭后重渲染需再展开）");
  w.wqToggle(1);
  ok(/✍️写过/.test(w.document.getElementById("wqBooks").innerHTML), "列表里标注「写过」");
  ok(/\d+ \/ 99/.test(w.document.getElementById("wqTotalTxt").textContent), "进度文字正常：" + w.document.getElementById("wqTotalTxt").textContent);
}

console.log("\n===== 结果：" + pass + " 通过 / " + fail + " 失败 =====");
process.exit(fail ? 1 : 0);
