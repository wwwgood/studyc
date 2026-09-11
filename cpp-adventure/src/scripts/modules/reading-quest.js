/* ---------------- 英语阅读大冒险 reading-quest.js ----------------
 * 玩法：100 篇短文 → 每篇 3 道理解题。读文章→答题→赚金币。
 * 进度保存在 S.reading = { done: { passageId: stars }, coins: 0 }。
 */
var RQ_COIN_PER_Q = 8;

function rqState(){
  if (!S.reading) S.reading = { done: {}, coins: 0 };
  if (!S.reading.done) S.reading.done = {};
  if (typeof S.reading.coins !== "number") S.reading.coins = 0;
  return S.reading;
}

function rqStats(){
  var st = rqState();
  var done = Object.keys(st.done).length;
  return { done: done, total: READ_DATA.passages.length, coins: st.coins };
}

/* ---------- 总览渲染 ---------- */
function rqRender(){
  var st = rqStats();
  var bar = document.getElementById("rqTotalBar");
  var txt = document.getElementById("rqTotalTxt");
  var coins = document.getElementById("rqCoins");
  if (bar) bar.style.width = (st.done / st.total * 100) + "%";
  if (txt) txt.textContent = "已读完 " + st.done + " / " + st.total + " 篇";
  if (coins) coins.textContent = st.coins;

  var wrap = document.getElementById("rqPassages");
  if (!wrap) return;
  var html = "";
  READ_DATA.passages.forEach(function(p, i){
    var done = rqState().done[p.id];
    var row = Math.floor(i / 10) + 1;
    if (i % 10 === 0) html += '<div class="rq-row-label">第 ' + row + ' 组（' + (i + 1) + '-' + Math.min(i + 10, 100) + ' 篇）</div>';
    html += '<button class="rq-card' + (done ? " done" : "") + '" type="button" onclick="rqOpen(\'' + p.id + '\')">' +
      '<span class="rq-no">' + (i + 1) + '</span>' +
      '<span class="rq-title">' + p.title + '</span>' +
      (done ? '<span class="rq-stars">' + '★'.repeat(done) + '</span>' : '<span class="rq-stars">☆☆☆</span>') +
    '</button>';
  });
  wrap.innerHTML = html;
}

/* ---------- 阅读弹窗 ---------- */
var RQ_SESSION = null;

function rqOpen(pid){
  rqStopSpeak();
  var p = READ_DATA.passages.filter(function(x){ return x.id === pid; })[0];
  if (!p) return;
  RQ_SESSION = { passage: p, idx: 0, wrong: 0, combo: 0, phase: "read" };
  rqRenderRead();
  document.getElementById("rqDialogMask").classList.add("open");
  document.body.style.overflow = "hidden";
}

function rqRenderRead(){
  var p = RQ_SESSION.passage;
  var speakBtn = p.body.length < 300 ? '<button class="rq-speak-btn" id="rqSpeakBtn" type="button" onclick="rqSpeak()">🔊 朗读全文</button>' : '';
  document.getElementById("rqDialog").innerHTML =
    '<div class="rq-dlg-head">' +
      '<span class="rq-cap">📖 ' + p.title + '</span>' +
      '<button class="rq-close" type="button" onclick="rqClose()">×</button>' +
    '</div>' +
    '<div class="rq-dlg-body">' +
      '<div class="rq-passage">' + p.body + '</div>' +
      speakBtn +
      '<button class="rq-start-btn" type="button" onclick="rqStartQuiz()">开始答题 →</button>' +
    '</div>';
  rqRenderSpeakBtn();
}

/* ---------- 朗读控制（可中途停止） ---------- */
var rqSpeaking = false;

function rqStopSpeak(){
  try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch(e){}
  rqSpeaking = false;
  rqRenderSpeakBtn();
}
function rqRenderSpeakBtn(){
  var btn = document.getElementById("rqSpeakBtn");
  if (!btn) return;
  btn.textContent = rqSpeaking ? "⏹ 停止朗读" : "🔊 朗读全文";
  btn.classList.toggle("speaking", !!rqSpeaking);
}

/* 朗读全文：点一下开始，正在读时再点一下即停止 */
function rqSpeak(){
  try {
    if (!window.speechSynthesis) return;
    if (rqSpeaking){ rqStopSpeak(); return; }
    if (!RQ_SESSION || !RQ_SESSION.passage) return;
    var u = new SpeechSynthesisUtterance(RQ_SESSION.passage.body);
    u.lang = "en-US"; u.rate = 0.85;
    u.onend = function(){ rqSpeaking = false; rqRenderSpeakBtn(); };
    u.onerror = function(){ rqSpeaking = false; rqRenderSpeakBtn(); };
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
    rqSpeaking = true; rqRenderSpeakBtn();
  } catch(e){}
}

function rqStartQuiz(){
  rqStopSpeak();
  RQ_SESSION.phase = "quiz";
  RQ_SESSION.idx = 0;
  RQ_SESSION.wrong = 0;
  RQ_SESSION.combo = 0;
  rqRenderQuiz();
}

function rqRenderQuiz(){
  var p = RQ_SESSION.passage;
  var q = p.q[RQ_SESSION.idx];
  var opts = q.o.map(function(t, i){
    return '<button class="rq-opt" type="button" data-i="' + i + '" onclick="rqAnswer(this)">' + t + '</button>';
  }).join("");
  document.getElementById("rqDialog").innerHTML =
    '<div class="rq-dlg-head">' +
      '<span class="rq-cap">📖 ' + p.title + ' · 第 ' + (RQ_SESSION.idx + 1) + '/' + p.q.length + ' 题</span>' +
      '<button class="rq-close" type="button" onclick="rqClose()">×</button>' +
    '</div>' +
    '<div class="rq-dlg-body">' +
      '<div class="rq-passage-mini">' + p.body + '</div>' +
      '<div class="rq-combo-track">🔥 连击 <b>' + RQ_SESSION.combo + '</b> · 🪙 ' + rqState().coins + '</div>' +
      '<div class="rq-question">' + q.q + '</div>' +
      '<div class="rq-opts">' + opts + '</div>' +
      '<div class="rq-feedback" id="rqFeedback"></div>' +
    '</div>';
}

function rqAnswer(btn){
  var p = RQ_SESSION.passage;
  var q = p.q[RQ_SESSION.idx];
  var i = parseInt(btn.getAttribute("data-i"), 10);
  var opts = btn.parentNode.querySelectorAll(".rq-opt");
  for (var k = 0; k < opts.length; k++) opts[k].disabled = true;
  var fb = document.getElementById("rqFeedback");
  if (i === q.a){
    btn.classList.add("ok");
    RQ_SESSION.combo++;
    var gain = RQ_COIN_PER_Q * (1 + Math.floor(RQ_SESSION.combo / 3));
    rqState().coins += gain;
    fb.innerHTML = '<div class="rq-fb ok">✅ 正确！+🪙' + gain + ' · ' + q.why + '</div>' +
      '<button class="rq-next-btn" type="button" onclick="rqNext()">下一题 →</button>';
    saveS();
    if (typeof portalRenderTopbar === "function") portalRenderTopbar();
  } else {
    btn.classList.add("no");
    opts[q.a].classList.add("ok");
    RQ_SESSION.combo = 0;
    RQ_SESSION.wrong++;
    if (typeof errBookAdd === "function") errBookAdd("reading", { q: q.q, o: q.o, a: q.a, why: q.why, source: RQ_SESSION.passage.title });
    fb.innerHTML = '<div class="rq-fb no">❌ ' + q.why + '</div>' +
      '<button class="rq-next-btn" type="button" onclick="rqNext()">继续 →</button>';
    saveS();
  }
}

function rqNext(){
  RQ_SESSION.idx++;
  if (RQ_SESSION.idx < RQ_SESSION.passage.q.length){ rqRenderQuiz(); return; }
  rqFinish();
}

function rqFinish(){
  var p = RQ_SESSION.passage;
  var wrong = RQ_SESSION.wrong;
  var stars = wrong === 0 ? 3 : (wrong <= 1 ? 2 : 1);
  var old = rqState().done[p.id] || 0;
  if (stars > old) rqState().done[p.id] = stars;
  saveS();
  if (typeof fireConfetti === "function" && stars >= 2) fireConfetti();
  var done = Object.keys(rqState().done).length;
  var starRow = "";
  for (var i = 1; i <= 3; i++) starRow += '<span class="' + (i <= stars ? "on" : "") + '">★</span>';
  document.getElementById("rqDialog").innerHTML =
    '<div class="rq-dlg-head result"><span class="rq-cap">🏁 阅读完成</span>' +
      '<button class="rq-close" type="button" onclick="rqClose()">×</button></div>' +
    '<div class="rq-dlg-body rq-result">' +
      '<div class="rq-result-stars">' + starRow + '</div>' +
      '<h3>' + p.title + '</h3>' +
      '<p>' + (stars === 3 ? "全对！阅读理解满分！🌟" : stars === 2 ? "很好！再读一遍争取满分！" : "完成！多读多练更棒！") + '</p>' +
      '<p class="rq-result-meta">📊 总进度 ' + done + ' / ' + READ_DATA.passages.length + ' · 🪙 ' + rqState().coins + '</p>' +
      '<div class="rq-result-btns">' +
        '<button class="rq-go-btn ghost" type="button" onclick="rqOpen(\'' + p.id + '\')">🔁 再读一次</button>' +
        '<button class="rq-go-btn topic" type="button" onclick="topicExamOpen(\'reading\',\'all\',\'全部阅读真题\')">📚 全部真题一起练</button>' +
        '<button class="rq-go-btn" type="button" onclick="rqClose()">返回</button>' +
      '</div>' +
    '</div>';
}

function rqClose(){
  rqStopSpeak();
  var mask = document.getElementById("rqDialogMask");
  if (mask) mask.classList.remove("open");
  document.body.style.overflow = "";
  RQ_SESSION = null;
  rqRender();
  if (typeof portalRenderTopbar === "function") portalRenderTopbar();
}

function rqOnEnter(){ rqRender(); }
window.addEventListener("load", function(){ if (document.getElementById("rqPassages")) rqRender(); });