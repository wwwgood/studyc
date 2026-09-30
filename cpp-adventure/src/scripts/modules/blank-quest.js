/* ---------------- 英语选择填空 · 做题模块 blank-quest.js ----------------
 * 「✅ 选择填空」子模块：按章节练习 BLANK_QUESTIONS（data/english-blank.js）。
 * 交互规则（家长指定，走统一答案浮层 answer-overlay）：
 *   1. 作答或点「不会做看答案」后弹出全屏大字答案浮层，正确答案放大显示；
 *   2. 浮层里的「下一题」按钮倒计时锁定：答对 3 秒、答错/看答案 6 秒后才亮起；
 *      有解析时还必须点「我已看懂」才放行；
 *   3. 答错和「不会做看答案」都会自动进错题本（blank 模块），跳过的题不会无声丢掉；
 *   4. 做完出成绩和错题本（错题答案同样大字显示），可只重做错题。
 * 进度为当次会话有效，不写入 S 全局状态；函数全部 bq 前缀，避免冲突。
 */
var BQ_WAIT_OK = 3;   /* 答对后强制停留秒数 */
var BQ_WAIT_BAD = 6;  /* 答错 / 直接看答案后强制停留秒数 */
var BQ_LETTERS = ["A", "B", "C", "D"];

var bqQueue = [], bqPos = 0, bqResults = {}, bqLastWrong = [];
var bqAnswered = false, bqPicked = null, bqIsLast = false;

function bqChName(chId) {
  for (var i = 0; i < BLANK_CHAPTERS.length; i++) {
    if (BLANK_CHAPTERS[i].id === chId) return BLANK_CHAPTERS[i].name;
  }
  return "";
}
function bqChips(qi) {
  var q = BLANK_QUESTIONS[qi];
  return '<span class="bq-chip bq-chip-ch">第' + q.ch + '章 · ' + bqChName(q.ch) + '</span>' +
    '<span class="bq-chip bq-chip-tag">考点：' + q.tag + '</span>' +
    '<span class="bq-chip">' + q.src + '</span>';
}
function bqCountCorrect() {
  var n = 0;
  for (var i = 0; i < bqPos; i++) { if (bqResults[bqQueue[i]] && bqResults[bqQueue[i]].ok) n++; }
  return n;
}

/* ---------- 开始面板（子模块页） ---------- */
function bqRender() {
  if (typeof engEnsureData === "function") engEnsureData();
  var box = document.getElementById("eqSubBlank");
  if (!box || typeof BLANK_QUESTIONS === "undefined") return;
  var rows = "";
  for (var i = 0; i < BLANK_CHAPTERS.length; i++) {
    var c = BLANK_CHAPTERS[i], n = 0;
    for (var j = 0; j < BLANK_QUESTIONS.length; j++) { if (BLANK_QUESTIONS[j].ch === c.id) n++; }
    rows += '<div class="bq-chrow"><span>第' + c.id + '章 ' + c.name + '</span><b>' + n + ' 题</b></div>';
  }
  var rules = '<div class="bq-rules">' +
    '<p>① 每题先自己作答，不会做可点「不会做？看答案」；</p>' +
    '<p>② 答案用<b>大字浮层</b>显示：答对停留 ' + BQ_WAIT_OK + ' 秒、答错停留 ' + BQ_WAIT_BAD + ' 秒，「下一题」才亮起；</p>' +
    '<p>③ 答错和看答案都会<b>自动进错题本</b>，看完解析（点「我已看懂」）才能进下一题；</p>' +
    '<p>④ 做完出成绩和错题本，可以只重做错题。</p></div>';
  var redo = bqLastWrong.length
    ? '<button class="bq-btn warn" type="button" onclick="bqStartWrong()">只重做错题（' + bqLastWrong.length + '）</button>'
    : "";
  box.innerHTML =
    '<div class="bq-panel">' +
      '<p class="bq-total">共 <b>' + BLANK_QUESTIONS.length + '</b> 题 · ' + BLANK_CHAPTERS.length + ' 个语法章节</p>' +
      rules +
      '<div class="bq-chlist">' + rows + '</div>' +
      '<div class="bq-btnrow"><button class="bq-btn" type="button" onclick="bqStartAll()">开始刷题 ▶</button>' + redo + '</div>' +
    '</div>';
}

/* ---------- 流程控制 ---------- */
function bqStartAll() {
  bqQueue = []; for (var i = 0; i < BLANK_QUESTIONS.length; i++) bqQueue.push(i);
  bqPos = 0; bqResults = {};
  bqOpenDialog(); bqShowIntro();
}
function bqStartWrong() {
  bqQueue = bqLastWrong.slice();
  if (!bqQueue.length) { bqRender(); return; }
  for (var i = 0; i < bqQueue.length; i++) delete bqResults[bqQueue[i]];
  bqPos = 0;
  bqOpenDialog(); bqShowIntro();
}
function bqOpenDialog() {
  var mask = document.getElementById("bqDialogMask");
  if (!mask) return;
  mask.classList.add("open");
  document.body.style.overflow = "hidden";
}
function bqClose() {
  var m1 = document.getElementById("bqDialogMask");
  if (m1) m1.classList.remove("open");
  document.body.style.overflow = "";
  bqRender();
}
function bqDlgHead(title) {
  return '<div class="eq-dlg-head"><span class="eq-cap">✅ 选择填空</span>' +
    '<h3>' + title + '</h3>' +
    '<button class="eq-close" type="button" onclick="bqClose()">×</button></div>';
}

function bqShowIntro() {
  var dlg = document.getElementById("bqDialog");
  if (!dlg) return;
  var qi = bqQueue[bqPos], chId = BLANK_QUESTIONS[qi].ch, n = 0;
  for (var i = bqPos; i < bqQueue.length; i++) { if (BLANK_QUESTIONS[bqQueue[i]].ch === chId) n++; }
  dlg.innerHTML = bqDlgHead(bqChName(chId)) +
    '<div class="bq-body bq-intro">' +
      '<div class="bq-chnum">第 ' + chId + ' 章</div>' +
      '<p class="bq-muted">本章共 ' + n + ' 题 · 先自己作答，再看大字答案</p>' +
      '<button class="bq-btn" type="button" onclick="bqShowQuestion()">开始本章 ▶</button>' +
    '</div>';
}

function bqShowQuestion() {
  bqAnswered = false; bqPicked = null;
  var dlg = document.getElementById("bqDialog");
  if (!dlg) return;
  var qi = bqQueue[bqPos], q = BLANK_QUESTIONS[qi];
  var correct = bqCountCorrect(), wrong = bqPos - correct;
  var pct = Math.round(bqPos / bqQueue.length * 100);
  var opts = "";
  for (var i = 0; i < q.opts.length; i++) {
    opts += '<button class="bq-opt" type="button" onclick="bqPick(' + i + ')">' +
      '<span class="bq-lt">' + BQ_LETTERS[i] + '</span><span>' + q.opts[i] + '</span></button>';
  }
  dlg.innerHTML = bqDlgHead('第 ' + (bqPos + 1) + ' / ' + bqQueue.length + ' 题') +
    '<div class="bq-body">' +
      '<div class="bq-topbar">' +
        '<span class="bq-stat okc">✓ ' + correct + '</span>' +
        '<span class="bq-stat badc">✗ ' + wrong + '</span>' +
        '<span class="bq-bar"><i style="width:' + pct + '%"></i></span>' +
      '</div>' +
      '<div class="bq-chips">' + bqChips(qi) + '</div>' +
      '<div class="bq-stem">' + q.stem + '</div>' +
      '<div class="bq-opts">' + opts + '</div>' +
      '<button class="bq-peek" type="button" onclick="bqPeek()">👀 不会做？看答案（自动进错题本）→</button>' +
    '</div>';
}

function bqPick(i) {
  if (bqAnswered) return;
  bqAnswered = true; bqPicked = i;
  var qi = bqQueue[bqPos], q = BLANK_QUESTIONS[qi], ok = (q.ans === i);
  bqResults[qi] = { p: i, ok: ok };
  if (!ok && typeof errBookAdd === "function"){
    errBookAdd("blank", { q: q.stem, o: q.opts, a: q.ans, why: q.exp, source: "第" + q.ch + "章 · " + q.tag });
  }
  saveS();
  bqAnswerOverlay(ok ? "ok" : "bad");
}
function bqPeek() {
  if (bqAnswered) return;
  bqAnswered = true; bqPicked = null;
  var qi = bqQueue[bqPos], q = BLANK_QUESTIONS[qi];
  bqResults[qi] = { p: null, ok: false };
  if (typeof errBookAdd === "function"){
    errBookAdd("blank", { q: q.stem, o: q.opts, a: q.ans, why: q.exp, source: "第" + q.ch + "章 · " + q.tag, skipped: true });
  }
  saveS();
  bqAnswerOverlay("peek");
}

/* ---------- 大字答案浮层（统一走 answer-overlay） ---------- */
function bqAnswerOverlay(mode) {
  var qi = bqQueue[bqPos], q = BLANK_QUESTIONS[qi];
  bqIsLast = (bqPos === bqQueue.length - 1);
  var head = mode === "ok" ? "回答正确 ✓" : mode === "bad" ? "回答错误 ✗" : "正确答案";
  var wait = (mode === "ok") ? BQ_WAIT_OK : BQ_WAIT_BAD;
  if (typeof aoShow !== "function"){ bqNext(); return; }
  aoShow({
    ok: mode === "ok",
    head: head,
    qHtml: aoQHtml({ q: q.stem, o: q.opts, a: q.ans }, mode === "bad" ? bqPicked : undefined),
    bigHtml: aoBig(BQ_LETTERS[q.ans], q.opts[q.ans]),
    userHtml: (mode === "bad" && bqPicked != null) ? aoEsc(BQ_LETTERS[bqPicked] + ". " + q.opts[bqPicked]) : "",
    whyHtml: q.exp,
    wait: wait,
    onNext: bqNext
  });
}

function bqNext() {
  var m = document.getElementById("bqAnsMask");
  if (m) m.classList.remove("open");
  bqPos++;
  if (bqPos >= bqQueue.length) { bqSummary(); return; }
  var prevCh = BLANK_QUESTIONS[bqQueue[bqPos - 1]].ch;
  var curCh = BLANK_QUESTIONS[bqQueue[bqPos]].ch;
  if (prevCh !== curCh) { bqShowIntro(); } else { bqShowQuestion(); }
}

/* ---------- 成绩 + 错题本 ---------- */
function bqSummary() {
  var dlg = document.getElementById("bqDialog");
  if (!dlg) return;
  var total = bqQueue.length;
  bqLastWrong = [];
  for (var i = 0; i < bqQueue.length; i++) {
    var r = bqResults[bqQueue[i]];
    if (!r || !r.ok) bqLastWrong.push(bqQueue[i]);
  }
  var correct = total - bqLastWrong.length;
  var rate = total ? Math.round(correct / total * 100) : 0;

  var cards = "";
  for (var j = 0; j < bqLastWrong.length; j++) {
    var qi = bqLastWrong[j], q = BLANK_QUESTIONS[qi], r2 = bqResults[qi];
    var your = (r2 && r2.p !== null && r2.p !== undefined)
      ? BQ_LETTERS[r2.p] + ". " + q.opts[r2.p] : "未作答";
    cards += '<div class="bq-wcard">' +
      '<div class="bq-chips">' + bqChips(qi) + '</div>' +
      '<div class="bq-stem">' + q.stem + '</div>' +
      '<div class="bq-yourans">你的答案：<s>' + your + '</s></div>' +
      '<div class="bq-big sm"><span class="bq-letter">' + BQ_LETTERS[q.ans] + '</span><span class="bq-atext">. ' + q.opts[q.ans] + '</span></div>' +
      '<div class="bq-exp">💡 解析：' + q.exp + '</div>' +
    '</div>';
  }
  var redoBtn = bqLastWrong.length
    ? '<button class="bq-btn warn" type="button" onclick="bqStartWrong()">只重做错题（' + bqLastWrong.length + '）</button>' : "";
  dlg.innerHTML = bqDlgHead("练习完成 🎉") +
    '<div class="bq-body bq-center">' +
      '<div class="bq-score"><span class="bq-num">' + correct + '</span><span class="bq-slash"> / ' + total + '</span></div>' +
      '<p class="bq-muted">正确率 ' + rate + '% · 错题 ' + bqLastWrong.length + ' 题（正确答案大字显示）</p>' +
      '<div class="bq-btnrow">' + redoBtn +
        '<button class="bq-btn" type="button" onclick="bqStartAll()">全部重做</button>' +
      '</div>' +
    '</div>' +
    (bqLastWrong.length ? cards : "");
}
