/* ---------------- 真题演练 exam-quest.js ----------------
 * 小升初/分班考/密考真题。按套卷闯关，答错自动入错题本。
 * 进度保存在 S.exam = { done: { paperId: stars }, coins: 0 }。
 */
var XQ_COIN_PER_Q = 12;

function xqState(){
  if (!S.exam) S.exam = { done: {}, coins: 0 };
  if (!S.exam.done) S.exam.done = {};
  if (typeof S.exam.coins !== "number") S.exam.coins = 0;
  return S.exam;
}

function xqStats(){
  var st = xqState();
  var done = Object.keys(st.done).length;
  return { done: done, total: EXAM_DATA.papers.length, coins: st.coins };
}

/* ---------- 总览渲染 ---------- */
function xqRender(){
  var st = xqStats();
  var bar = document.getElementById("xqTotalBar");
  var txt = document.getElementById("xqTotalTxt");
  var coins = document.getElementById("xqCoins");
  if (bar) bar.style.width = (st.done / st.total * 100) + "%";
  if (txt) txt.textContent = "已完成 " + st.done + " / " + st.total + " 套真题";
  if (coins) coins.textContent = st.coins;

  var wrap = document.getElementById("xqPapers");
  if (!wrap) return;
  var html = "";
  EXAM_DATA.categories.forEach(function(c){
    var ps = EXAM_DATA.papers.filter(function(p){ return p.cat === c.id; });
    var doneCount = ps.filter(function(p){ return xqState().done[p.id]; }).length;
    html += '<div class="xq-cat-block">';
    html += '<div class="xq-cat-head"><span class="xq-cat-emoji">' + c.emoji + '</span><span class="xq-cat-name">' + c.name + '</span><span class="xq-cat-meta">' + doneCount + '/' + ps.length + ' 套</span></div>';
    ps.forEach(function(p){
      var done = xqState().done[p.id];
      var stars = done ? "★".repeat(done) : "☆☆☆";
      html += '<button class="xq-paper' + (done ? " done" : "") + '" type="button" onclick="xqOpen(\'' + p.id + '\')">' +
        '<span class="xq-paper-name">' + p.name + '</span>' +
        '<span class="xq-paper-meta">' + p.questions.length + '题 · ' + p.time + '分钟</span>' +
        '<span class="xq-paper-stars">' + stars + '</span>' +
      '</button>';
    });
    html += '</div>';
  });
  wrap.innerHTML = html;
}

/* ---------- 答题弹窗 ---------- */
var XQ_SESSION = null;

function xqOpen(pid){
  var p = EXAM_DATA.papers.filter(function(x){ return x.id === pid; })[0];
  if (!p) return;
  XQ_SESSION = { paper: p, idx: 0, wrong: 0, combo: 0, answers: [] };
  xqRenderQuiz();
  var mask = document.getElementById("xqDialogMask");
  if (mask) mask.classList.add("open");
  document.body.style.overflow = "hidden";
}

function xqRenderQuiz(){
  var p = XQ_SESSION.paper;
  var q = p.questions[XQ_SESSION.idx];
  var passage = q.q.indexOf("\n\n") >= 0 ? q.q.split("\n\n") : null;
  var qText = passage ? passage[passage.length - 1] : q.q;
  var passageHtml = "";
  if (passage && passage.length > 1){
    for (var i = 0; i < passage.length - 1; i++){
      passageHtml += '<div class="xq-passage">' + passage[i].replace(/\n/g, "<br>") + '</div>';
    }
  }
  var opts = q.o.map(function(t, i){
    return '<button class="xq-opt" type="button" data-i="' + i + '" onclick="xqAnswer(this)">' + String.fromCharCode(65 + i) + ". " + t + '</button>';
  }).join("");
  var dialog = document.getElementById("xqDialog");
  if (!dialog) return;
  dialog.innerHTML =
    '<div class="xq-dlg-head">' +
      '<span class="xq-cap">📝 ' + p.name + ' · 第 ' + (XQ_SESSION.idx + 1) + '/' + p.questions.length + ' 题</span>' +
      '<button class="xq-close" type="button" onclick="xqClose()">×</button>' +
    '</div>' +
    '<div class="xq-dlg-body">' +
      '<div class="xq-combo-track">🔥 连击 <b>' + XQ_SESSION.combo + '</b> · 🪙 ' + xqState().coins + '</div>' +
      passageHtml +
      '<div class="xq-question">' + qText + '</div>' +
      '<div class="xq-opts">' + opts + '</div>' +
      '<div class="xq-feedback" id="xqFeedback"></div>' +
    '</div>';
}

function xqAnswer(btn){
  var p = XQ_SESSION.paper;
  var q = p.questions[XQ_SESSION.idx];
  var i = parseInt(btn.getAttribute("data-i"), 10);
  var opts = btn.parentNode.querySelectorAll(".xq-opt");
  for (var k = 0; k < opts.length; k++) opts[k].disabled = true;
  var fb = document.getElementById("xqFeedback");
  if (i === q.a){
    btn.classList.add("ok");
    XQ_SESSION.combo++;
    var gain = XQ_COIN_PER_Q * (1 + Math.floor(XQ_SESSION.combo / 3));
    xqState().coins += gain;
    fb.innerHTML = '<div class="xq-fb ok">✅ 正确！+🪙' + gain + ' · ' + q.why + '</div>' +
      '<button class="xq-next-btn" type="button" onclick="xqNext()">下一题 →</button>';
    saveS();
    if (typeof portalRenderTopbar === "function") portalRenderTopbar();
  } else {
    btn.classList.add("no");
    opts[q.a].classList.add("ok");
    XQ_SESSION.combo = 0;
    XQ_SESSION.wrong++;
    if (typeof errBookAdd === "function") errBookAdd("exam", { q: q.q, o: q.o, a: q.a, why: q.why, source: p.name });
    fb.innerHTML = '<div class="xq-fb no">❌ ' + q.why + '</div>' +
      '<button class="xq-next-btn" type="button" onclick="xqNext()">继续 →</button>';
    saveS();
  }
}

function xqNext(){
  XQ_SESSION.idx++;
  if (XQ_SESSION.idx < XQ_SESSION.paper.questions.length){ xqRenderQuiz(); return; }
  xqFinish();
}

function xqFinish(){
  var p = XQ_SESSION.paper;
  var wrong = XQ_SESSION.wrong;
  var total = p.questions.length;
  var stars = wrong === 0 ? 3 : (wrong <= Math.floor(total * 0.2) ? 2 : 1);
  var old = xqState().done[p.id] || 0;
  if (stars > old) xqState().done[p.id] = stars;
  saveS();
  if (typeof fireConfetti === "function" && stars >= 2) fireConfetti();
  var done = Object.keys(xqState().done).length;
  var starRow = "";
  for (var i = 1; i <= 3; i++) starRow += '<span class="' + (i <= stars ? "on" : "") + '">★</span>';
  var dialog = document.getElementById("xqDialog");
  if (!dialog) return;
  dialog.innerHTML =
    '<div class="xq-dlg-head result"><span class="xq-cap">🏁 真题完成</span>' +
      '<button class="xq-close" type="button" onclick="xqClose()">×</button></div>' +
    '<div class="xq-dlg-body xq-result">' +
      '<div class="xq-result-stars">' + starRow + '</div>' +
      '<h3>' + p.name + '</h3>' +
      '<p>答对 ' + (total - wrong) + '/' + total + ' · ' + (stars === 3 ? "满分通关！🏆" : stars === 2 ? "优秀！再接再厉！" : "完成！错题会自动加入错题本，多练几次！") + '</p>' +
      '<p class="xq-result-meta">📊 总进度 ' + done + ' / ' + EXAM_DATA.papers.length + ' · 🪙 ' + xqState().coins + '</p>' +
      '<div class="xq-result-btns">' +
        '<button class="xq-go-btn ghost" type="button" onclick="xqOpen(\'' + p.id + '\')">🔁 再做一次</button>' +
        '<button class="xq-go-btn" type="button" onclick="xqClose()">返回</button>' +
      '</div>' +
    '</div>';
}

function xqClose(){
  var mask = document.getElementById("xqDialogMask");
  if (mask) mask.classList.remove("open");
  document.body.style.overflow = "";
  XQ_SESSION = null;
  xqRender();
  if (typeof portalRenderTopbar === "function") portalRenderTopbar();
}

window.addEventListener("load", function(){ if (document.getElementById("xqPapers")) xqRender(); });