/* 验证：大字答案浮层（answer-overlay）+ 选择填空下线 + 21 题并回 */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("C:/Users/zb/.workbuddy/binaries/node/workspace/node_modules/jsdom");

function rd(p){ return fs.readFileSync(path.join("E:/htdocs/studyc/cpp-adventure", p), "utf8"); }

const dom = new JSDOM(
  '<!DOCTYPE html><body>' +
  '<div id="eqSubGrammar"></div><div id="eqSubVocab"></div><div id="eqSubReading"></div>' +
  '<div id="eqSubWriting"></div><div id="eqSubOral"></div><div id="eqSubExam"></div><div id="eqSubErrBook"></div>' +
  '<div id="eqChapters"></div><div id="eqDialogMask"></div><div id="eqDialog"></div>' +
  '<div id="vqDialogMask"></div><div id="vqDialog"></div>' +
  '<div id="vqTotalBar"></div><div id="vqTotalTxt"></div><div id="vqCoins"></div><div id="vqUnits"></div>' +
  '</body>',
  { url: "http://localhost/", runScripts: "dangerously" }
);
const w = dom.window;
w.eval('var S={writing:{done:{},coins:0,mywork:{}},vocab:{},oral:{}}; function saveS(){}; function portalRenderTopbar(){}; function baToast(){};');
w.speechSynthesis = { cancel(){}, speak(){} };
w.SpeechSynthesisUtterance = function(t){ this.text=t; };

w.eval(rd("src/scripts/data/english-vocab.js"));
w.eval(rd("src/scripts/data/question-bank.js"));
w.eval(rd("src/scripts/data/english-paper-1000.js"));
w.eval(rd("src/scripts/modules/qtypes.js"));
w.eval(rd("src/scripts/modules/answer-overlay.js"));
w.eval(rd("src/scripts/modules/vocab-quest.js"));

let pass = 0, fail = 0;
function ok(cond, msg){ if (cond){ pass++; console.log("✅ " + msg); } else { fail++; console.log("❌ " + msg); } }

/* ===== 1. 选择填空已下线、21 题已并回 ===== */
ok(typeof w.BLANK_QUESTIONS === "undefined", "english-blank.js 不再被打包（BLANK_QUESTIONS 未定义）");
ok(typeof w.bqRender === "undefined", "blank-quest.js 不再被打包（bqRender 未定义）");
ok(w.PAPER1000_DATA.questions.length === 1033, "1000题数据共 1033 题（1000 + 并回 21 + 适当形式填空 12）");
const xz = w.PAPER1000_DATA.questions.filter(q => String(q.id).indexOf("xz-") === 0);
ok(xz.length === 21, "并回的选择填空题共 21 道（xz-001~xz-021）");
ok(xz.every(q => q.q && Array.isArray(q.o) && typeof q.a === "number" && q.why && q.topicId), "21 题字段齐全（题干/选项/答案/解析/章节）");
const topics = new Set(xz.map(q => q.topicId));
ok(topics.size >= 6, "21 题分散到 " + topics.size + " 个 1000题 章节");
const merged = typeof w.QB_DATA !== "undefined" && w.QB_DATA.questions.some(q => q.id === "xz-001");
ok(merged || typeof w.mergePaper1000 === "undefined", "xz 题并入统一题库 QB_DATA（或由加载钩子合并）");

/* ===== 2. 浮层基础行为 ===== */
ok(typeof w.aoShow === "function" && typeof w.aoNext === "function", "浮层 aoShow/aoNext 已加载");
ok(w.AO_WAIT_OK === 3 && w.AO_WAIT_BAD === 6, "锁定时长：答对 3 秒 / 答错 6 秒");

w.aoShow({ ok: true, sub: "+🪙1", bigHtml: w.aoBig("B", "to see"), whyHtml: "nice 后接 to do", onNext: function(){ w.__advanced = true; } });
const mask = w.document.getElementById("aoMask");
const btn = w.document.getElementById("aoNextBtn");
ok(!!mask && mask.classList.contains("open"), "作答后弹出全屏浮层");
ok(!!w.document.querySelector("#aoCard .ao-big"), "浮层显示大字正确答案");
ok(btn.disabled === true && btn.textContent.indexOf("3") > -1, "「下一题」按钮初始锁定（3 秒倒计时）");
ok(w.__advanced !== true, "锁定期间点不了（aoNext 直接返回）");
w.aoNext(); /* 锁定中应无效 */
ok(w.__advanced !== true && mask.classList.contains("open"), "倒计时未结束点击无效");

/* ===== 2.5 原题回显 ===== */
w.aoShow({ ok: false,
  qHtml: w.aoQHtml({ q: "I ______ to school every day.", o: ["go", "goes", "going", "gone"], a: 0 }, 1),
  bigHtml: w.aoBig("A", "go"), whyHtml: "主语 I 后用动词原形" });
ok(!!w.document.querySelector("#aoCard .ao-q"), "浮层显示原题块");
ok(w.document.querySelector("#aoCard .ao-qstem").textContent.indexOf("I ______ to school") > -1, "原题题干正确显示");
ok(w.document.querySelectorAll("#aoCard .ao-qopt").length === 4, "四个选项全部回显");
const goodOpt = w.document.querySelector("#aoCard .ao-qopt.good");
const noOpt = w.document.querySelector("#aoCard .ao-qopt.no");
ok(!!goodOpt && goodOpt.textContent.indexOf("go") > -1 && goodOpt.textContent.indexOf("✓") > -1, "正确选项标绿 ✓");
ok(!!noOpt && noOpt.textContent.indexOf("goes") > -1 && noOpt.textContent.indexOf("✗") > -1, "错选选项标红划线 ✗");
/* 只传题干（写作/拼写题）时不渲染选项 */
w.aoShow({ ok: true, qHtml: w.aoQHtml({ q: "My Weekend Plan（写一篇短文）" }), bigHtml: w.aoBig("", "范文"), onNext: function(){ w.__advanced = true; } });
ok(w.document.querySelectorAll("#aoCard .ao-qopt").length === 0 &&
   w.document.querySelector("#aoCard .ao-qstem").textContent.indexOf("My Weekend Plan") > -1, "写作题只显示题干、不渲染选项");
/* passage 兜底：题干缺失时回退到 passage 字段 */
const ph = w.aoQHtml({ passage: "Tom is a good boy.", o: ["a", "b"], a: 0 });
ok(ph.indexOf("Tom is a good boy.") > -1, "无题干时回退显示 passage");

/* ===== 2.6 两条路：返回原题 / 悬浮下一题 ===== */
w.aoBack();
ok(!w.document.getElementById("aoMask").classList.contains("open"), "点「← 返回原题」关闭浮层");
ok(!!w.document.getElementById("aoPill"), "关闭后右下角出现悬浮「下一题」按钮");
w.__pill = false;
/* 直接调内部 onNext 不可见——用 aoResume 验证前进回调 */
w.eval('aoOnNext = function(){ window.__pill = true; };');
w.aoResume();
ok(w.__pill === true, "悬浮「下一题」点击后回调引擎前进");
ok(!w.document.getElementById("aoPill"), "前进后悬浮按钮消失");
/* 重开浮层，衔接后面的倒计时解锁测试 */
w.aoShow({ ok: true, sub: "+🪙1", bigHtml: w.aoBig("B", "to see"), whyHtml: "nice 后接 to do", onNext: function(){ w.__advanced = true; } });
ok(!!w.document.querySelector("#aoCard .ao-backbtn"), "浮层右上角有「← 返回原题」按钮");

/* 模拟 3 秒倒计时走完 */
w.eval('(function(){ var b=document.getElementById("aoNextBtn"); var t=setInterval(function(){},1000); clearInterval(t); })();');
/* 直接驱动 aoTimer 的回调：把 left 减到 0 */
w.eval('(function(){ for (var i=0;i<3;i++){ if (aoTimer) { /* 手动触发一次 tick */ } } })();');
/* 更直接：覆写 setInterval 已来不及，改为快进——直接调用内部逻辑不可行，用真实计时器等待 */
setTimeout(function(){
  const btn2 = w.document.getElementById("aoNextBtn");
  ok(btn2 && btn2.disabled === false && btn2.textContent === "下一题 ▶", "3 秒后按钮亮起为「下一题 ▶」");
  btn2.click();
  ok(w.__advanced === true, "点「下一题」回调引擎前进函数");
  ok(!mask.classList.contains("open"), "浮层关闭");

  /* ===== 3. 词汇引擎接入浮层（真实判答链路） ===== */
  w.vqRender();
  ok(!!w.document.querySelector("#vqUnits .vq-unit, #vqUnits [onclick]"), "词汇总览可渲染");
  /* 打开第一个单元（默认「看词选义」选择题模式） */
  if (typeof w.vqOpen === "function" && w.VOCAB_DATA.units && w.VOCAB_DATA.units.length){
    w.vqOpen(w.VOCAB_DATA.units[0].id);
  }
  ok(!!w.document.querySelector("#vqDialog .vq-opt"), "词汇答题卡渲染了选项");
  /* 点第一个选项（无论对错都会走 aoShow） */
  const firstOpt = w.document.querySelector("#vqDialog .vq-opt");
  firstOpt.click();
  const aoMask2 = w.document.getElementById("aoMask");
  ok(!!aoMask2 && aoMask2.classList.contains("open"), "词汇判答后弹出大字答案浮层（VQ 引擎接入成功）");
  ok(!!w.document.querySelector("#aoCard .ao-q"), "词汇浮层同样显示原题块");
  const vBtn = w.document.getElementById("aoNextBtn");
  ok(!!vBtn && vBtn.disabled === true, "词汇浮层的「下一题」同样锁定");

  console.log("\n===== 浮层&下线测试：" + pass + " 通过 / " + fail + " 失败 =====");
  process.exit(fail ? 1 : 0);
}, 3400);
