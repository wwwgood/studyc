/* ---------------- 英语作文大冒险 writing-quest.js ----------------
 * 玩法：4 本书 → 每本 25 篇范文。读范文→学要点→记词汇→做练习→赚金币。
 * 进度保存在 S.writing = { done: { passageId: stars }, coins: 0 }。
 */
var WQ_COIN_PER_Q = 8;

function wqState(){
  if (!S.writing) S.writing = { done: {}, coins: 0 };
  if (!S.writing.done) S.writing.done = {};
  if (typeof S.writing.coins !== "number") S.writing.coins = 0;
  return S.writing;
}

function wqStats(){
  var st = wqState();
  var done = Object.keys(st.done).length;
  return { done: done, total: WRITE_DATA.passages.length, coins: st.coins };
}

/* ---------- 总览渲染 ---------- */
function wqRender(){
  var st = wqStats();
  var bar = document.getElementById("wqTotalBar");
  var txt = document.getElementById("wqTotalTxt");
  var coins = document.getElementById("wqCoins");
  if (bar) bar.style.width = (st.done / st.total * 100) + "%";
  if (txt) txt.textContent = "已学 " + st.done + " / " + st.total + " 篇范文";
  if (coins) coins.textContent = st.coins;

  var wrap = document.getElementById("wqBooks");
  if (!wrap) return;
  var html = "";
  WRITE_DATA.books.forEach(function(b){
    var ps = WRITE_DATA.passages.filter(function(p){ return p.book === b.id; });
    var doneCount = ps.filter(function(p){ return wqState().done[p.id]; }).length;
    var pct = Math.round(doneCount / ps.length * 100);
    var full = doneCount === ps.length;
    html += '<div class="wq-book' + (full ? " full" : "") + '" data-bid="' + b.id + '">' +
      '<button class="wq-book-head" type="button" onclick="wqToggle(' + b.id + ')">' +
        '<span class="wq-emoji">' + b.emoji + '</span>' +
        '<span class="wq-name">' + b.name + '<small>' + b.desc + '</small></span>' +
        '<span class="wq-meta"><b>' + doneCount + '</b>/' + ps.length + ' 篇' + (full ? ' 🏅' : '') + '</span>' +
        '<span class="wq-arrow" id="wqArrow' + b.id + '">▾</span>' +
      '</button>' +
      '<div class="wq-bar"><span style="width:' + pct + '%"></span></div>' +
      '<div class="wq-passage-list" id="wqList' + b.id + '" hidden></div>' +
    '</div>';
  });
  wrap.innerHTML = html;
}

function wqToggle(bid){
  var list = document.getElementById("wqList" + bid);
  var arrow = document.getElementById("wqArrow" + bid);
  if (!list) return;
  if (!list.hidden){ list.hidden = true; if (arrow) arrow.textContent = "▾"; return; }
  var ps = WRITE_DATA.passages.filter(function(p){ return p.book === bid; });
  var html = "";
  ps.forEach(function(p, i){
    var done = wqState().done[p.id];
    html += '<button class="wq-passage' + (done ? " done" : "") + '" type="button" onclick="wqOpen(\'' + p.id + '\')">' +
      '<span class="wq-no">' + (i + 1) + '</span>' +
      '<span class="wq-title">' + p.title + '</span>' +
      '<span class="wq-cat">' + p.cat + '</span>' +
      '<span class="wq-stars">' + (done ? '★'.repeat(done) : '☆☆☆') + '</span>' +
    '</button>';
  });
  list.innerHTML = html;
  list.hidden = false;
  if (arrow) arrow.textContent = "▴";
}

/* ---------- 学习弹窗 ---------- */
var WQ_SESSION = null;

function wqOpen(pid){
  var p = WRITE_DATA.passages.filter(function(x){ return x.id === pid; })[0];
  if (!p) return;
  WQ_SESSION = { passage: p, idx: 0, wrong: 0, combo: 0, phase: "read" };
  wqRenderRead();
  document.getElementById("wqDialogMask").classList.add("open");
  document.body.style.overflow = "hidden";
}

function wqRenderRead(){
  var p = WQ_SESSION.passage;
  var tipsHtml = p.tips.map(function(t, i){
    return '<li><span class="wq-tip-no">' + (i + 1) + '</span>' + t + '</li>';
  }).join("");
  var wordsHtml = p.words.map(function(w){
    return '<span class="wq-word-chip">' + w + '</span>';
  }).join("");
  document.getElementById("wqDialog").innerHTML =
    '<div class="wq-dlg-head">' +
      '<span class="wq-cap">✍️ ' + p.title + ' · ' + p.cat + '</span>' +
      '<button class="wq-close" type="button" onclick="wqClose()">×</button>' +
    '</div>' +
    '<div class="wq-dlg-body">' +
      '<div class="wq-passage">' + p.body + '</div>' +
      '<button class="wq-speak-btn" type="button" onclick="wqSpeak()">🔊 朗读范文</button>' +
      '<div class="wq-tips-box">' +
        '<h4>💡 写作要点</h4>' +
        '<ul class="wq-tips">' + tipsHtml + '</ul>' +
      '</div>' +
      '<div class="wq-words-box">' +
        '<h4>📝 重点词汇</h4>' +
        '<div class="wq-words">' + wordsHtml + '</div>' +
      '</div>' +
      '<button class="wq-start-btn" type="button" onclick="wqStartQuiz()">开始练习 →</button>' +
    '</div>';
}

function wqSpeak(){
  try {
    if (!window.speechSynthesis) return;
    var u = new SpeechSynthesisUtterance(WQ_SESSION.passage.body);
    u.lang = "en-US";
    u.rate = 0.85;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  } catch(e){}
}

function wqStartQuiz(){
  WQ_SESSION.phase = "quiz";
  WQ_SESSION.idx = 0;
  WQ_SESSION.wrong = 0;
  WQ_SESSION.combo = 0;
  wqRenderQuiz();
}

function wqRenderQuiz(){
  var p = WQ_SESSION.passage;
  var q = p.q[WQ_SESSION.idx];
  var opts = q.o.map(function(t, i){
    return '<button class="wq-opt" type="button" data-i="' + i + '" onclick="wqAnswer(this)">' + t + '</button>';
  }).join("");
  document.getElementById("wqDialog").innerHTML =
    '<div class="wq-dlg-head">' +
      '<span class="wq-cap">✍️ ' + p.title + ' · 第 ' + (WQ_SESSION.idx + 1) + '/' + p.q.length + ' 题</span>' +
      '<button class="wq-close" type="button" onclick="wqClose()">×</button>' +
    '</div>' +
    '<div class="wq-dlg-body">' +
      '<div class="wq-combo-track">🔥 连击 <b>' + WQ_SESSION.combo + '</b> · 🪙 ' + wqState().coins + '</div>' +
      '<div class="wq-question">' + q.q + '</div>' +
      '<div class="wq-opts">' + opts + '</div>' +
      '<div class="wq-feedback" id="wqFeedback"></div>' +
    '</div>';
}

function wqAnswer(btn){
  var p = WQ_SESSION.passage;
  var q = p.q[WQ_SESSION.idx];
  var i = parseInt(btn.getAttribute("data-i"), 10);
  var opts = btn.parentNode.querySelectorAll(".wq-opt");
  for (var k = 0; k < opts.length; k++) opts[k].disabled = true;
  var fb = document.getElementById("wqFeedback");
  if (i === q.a){
    btn.classList.add("ok");
    WQ_SESSION.combo++;
    var gain = WQ_COIN_PER_Q * (1 + Math.floor(WQ_SESSION.combo / 3));
    wqState().coins += gain;
    fb.innerHTML = '<div class="wq-fb ok">✅ 正确！+🪙' + gain + ' · ' + q.why + '</div>' +
      '<button class="wq-next-btn" type="button" onclick="wqNext()">下一题 →</button>';
    saveS();
    if (typeof portalRenderTopbar === "function") portalRenderTopbar();
  } else {
    btn.classList.add("no");
    opts[q.a].classList.add("ok");
    WQ_SESSION.combo = 0;
    WQ_SESSION.wrong++;
    if (typeof errBookAdd === "function") errBookAdd("writing", { q: q.q, o: q.o, a: q.a, why: q.why, source: WQ_SESSION.passage.title });
    fb.innerHTML = '<div class="wq-fb no">❌ ' + q.why + '</div>' +
      '<button class="wq-next-btn" type="button" onclick="wqNext()">继续 →</button>';
    saveS();
  }
}

function wqNext(){
  WQ_SESSION.idx++;
  if (WQ_SESSION.idx < WQ_SESSION.passage.q.length){ wqRenderQuiz(); return; }
  wqFinish();
}

function wqFinish(){
  var p = WQ_SESSION.passage;
  var wrong = WQ_SESSION.wrong;
  var stars = wrong === 0 ? 3 : (wrong <= 1 ? 2 : 1);
  var old = wqState().done[p.id] || 0;
  if (stars > old) wqState().done[p.id] = stars;
  saveS();
  if (typeof fireConfetti === "function" && stars >= 2) fireConfetti();
  var done = Object.keys(wqState().done).length;
  var starRow = "";
  for (var i = 1; i <= 3; i++) starRow += '<span class="' + (i <= stars ? "on" : "") + '">★</span>';
  document.getElementById("wqDialog").innerHTML =
    '<div class="wq-dlg-head result"><span class="wq-cap">🏁 学习完成</span>' +
      '<button class="wq-close" type="button" onclick="wqClose()">×</button></div>' +
    '<div class="wq-dlg-body wq-result">' +
      '<div class="wq-result-stars">' + starRow + '</div>' +
      '<h3>' + p.title + '</h3>' +
      '<p>' + (stars === 3 ? "全对！写作小达人！🌟" : stars === 2 ? "很好！再学一次争取满分！" : "完成！多学多练更棒！") + '</p>' +
      '<p class="wq-result-meta">📊 总进度 ' + done + ' / ' + WRITE_DATA.passages.length + ' · 🪙 ' + wqState().coins + '</p>' +
      '<div class="wq-result-btns">' +
        '<button class="wq-go-btn ghost" type="button" onclick="wqOpen(\'' + p.id + '\')">🔁 再学一次</button>' +
        '<button class="wq-go-btn topic" type="button" onclick="topicExamOpen(\'writing\',0,\'作文训练\')">🎯 专题真题</button>' +
        '<button class="wq-go-btn" type="button" onclick="wqClose()">返回</button>' +
      '</div>' +
    '</div>';
}

function wqClose(){
  var mask = document.getElementById("wqDialogMask");
  if (mask) mask.classList.remove("open");
  document.body.style.overflow = "";
  WQ_SESSION = null;
  wqRender();
  if (typeof portalRenderTopbar === "function") portalRenderTopbar();
}

function wqOnEnter(){ wqRender(); }
window.addEventListener("load", function(){ if (document.getElementById("wqBooks")) wqRender(); });