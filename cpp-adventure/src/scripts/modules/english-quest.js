/* ---------------- 英语语法大冒险 english-quest.js ----------------
 * 玩法：12 大语法岛屿 → 100 个关卡。每关先「学一学」（讲解 + 口诀 + 例句发音），
 * 再「练一练」（逐题闯关）。答对连击涨金币，全对拿三星；进度保存在指挥官档案（S.eng）。
 */
var EQ_COIN_PER_Q = 10;

function eqState(){
  if (!S.eng) S.eng = { done: {}, coins: 0 };
  if (!S.eng.done) S.eng.done = {};
  if (typeof S.eng.coins !== "number") S.eng.coins = 0;
  return S.eng;
}
function eqLesson(id){
  for (var i = 0; i < EQ_DATA.lessons.length; i++){
    if (EQ_DATA.lessons[i].id === id) return EQ_DATA.lessons[i];
  }
  return null;
}
function eqChapterLessons(ch){
  return EQ_DATA.lessons.filter(function(l){ return l.ch === ch; });
}
function eqStats(){
  var done = Object.keys(eqState().done).length;
  return { done: done, total: EQ_DATA.lessons.length, coins: eqState().coins };
}

/* ---------- 总览渲染 ---------- */
function eqRender(){
  var st = eqStats();
  var bar = document.getElementById("eqTotalBar");
  var txt = document.getElementById("eqTotalTxt");
  var coins = document.getElementById("eqCoins");
  var stars = document.getElementById("eqStars");
  if (bar) bar.style.width = (st.done / st.total * 100) + "%";
  if (txt) txt.textContent = "已点亮 " + st.done + " / " + st.total + " 例";
  if (coins) coins.textContent = st.coins;
  if (stars) stars.textContent = Object.values(eqState().done).reduce(function(a, b){ return a + b; }, 0);

  var wrap = document.getElementById("eqChapters");
  if (!wrap) return;
  var html = "";
  EQ_DATA.chapters.forEach(function(c){
    var ls = eqChapterLessons(c.id);
    var done = ls.filter(function(l){ return eqState().done[l.id]; }).length;
    var pct = Math.round(done / ls.length * 100);
    var full = done === ls.length;
    html += '<div class="eq-chapter' + (full ? " full" : "") + '" data-ch="' + c.id + '">' +
      '<button class="eq-ch-head" type="button" onclick="eqToggle(' + c.id + ')">' +
        '<span class="eq-ch-emoji">' + c.emoji + '</span>' +
        '<span class="eq-ch-name">' + c.name + '<small>' + c.desc + '</small></span>' +
        '<span class="eq-ch-meta"><b>' + done + '</b>/' + ls.length + ' 例' +
          (full ? ' 🏅' : '') + '</span>' +
        '<span class="eq-arrow" id="eqArrow' + c.id + '">▾</span>' +
      '</button>' +
      '<div class="eq-ch-bar"><span style="width:' + pct + '%"></span></div>' +
      '<div class="eq-lv-list" id="eqLvList' + c.id + '" hidden></div>' +
    '</div>';
  });
  wrap.innerHTML = html;
}

function eqToggle(chId){
  var list = document.getElementById("eqLvList" + chId);
  var arrow = document.getElementById("eqArrow" + chId);
  if (!list) return;
  if (!list.hidden){ list.hidden = true; if (arrow) arrow.textContent = "▾"; return; }
  var html = "";
  eqChapterLessons(chId).forEach(function(l, i){
    var got = eqState().done[l.id] || 0;
    html += '<button class="eq-lv' + (got ? " done" : "") + '" type="button" onclick="eqOpen(\'' + l.id + '\')">' +
      '<span class="eq-lv-no">' + (i + 1) + '</span>' +
      '<span class="eq-lv-name">' + l.t + '</span>' +
      '<span class="eq-lv-stars">' + (got ? "★".repeat(got) : "☆☆☆") + '</span>' +
    '</button>';
  });
  list.innerHTML = html;
  list.hidden = false;
  if (arrow) arrow.textContent = "▴";
}

/* ---------- 学习弹窗 ---------- */
var EQ_SESSION = null;

function eqOpen(id){
  var l = eqLesson(id);
  if (!l) return;
  EQ_SESSION = { lesson: l, idx: 0, wrong: 0, combo: 0, phase: "learn" };
  eqDialogLearn();
  var mask = document.getElementById("eqDialogMask");
  mask.classList.add("open");
  document.body.style.overflow = "hidden";
}
function eqClose(){
  var mask = document.getElementById("eqDialogMask");
  mask.classList.remove("open");
  document.body.style.overflow = "";
  EQ_SESSION = null;
  eqRender();
  if (typeof portalRenderTopbar === "function") portalRenderTopbar();
}

function eqDialogLearn(){
  var l = EQ_SESSION.lesson;
  var exHtml = l.ex.map(function(e, i){
    return '<div class="eq-ex-row"><span class="eq-ex-no">' + (i + 1) + '</span>' +
      '<span class="eq-ex-en">' + e.en + '</span>' +
      '<button class="eq-say" type="button" onclick="eqSpeak(this)" data-en="' + e.en.replace(/"/g, "&quot;") + '" title="听发音">🔊</button>' +
      '<span class="eq-ex-zh">' + e.zh + '</span></div>';
  }).join("");
  document.getElementById("eqDialog").innerHTML =
    '<div class="eq-dlg-head">' +
      '<span class="eq-cap">🧑‍✈️ 语法船长</span>' +
      '<h3>' + l.t + '</h3>' +
      '<button class="eq-close" type="button" onclick="eqClose()">×</button>' +
    '</div>' +
    '<div class="eq-dlg-body">' +
      '<div class="eq-tip">💡 ' + l.tip + '</div>' +
      '<div class="eq-cap-bubble">' + l.body + '</div>' +
      '<div class="eq-motto">🧾 口诀：' + l.say + '</div>' +
      '<div class="eq-ex-box">' + exHtml + '</div>' +
      '<button class="eq-go-btn" type="button" onclick="eqStartQuiz()">⚔️ 练一练，出发！</button>' +
    '</div>';
}

function eqSpeak(btn){
  try {
    if (!window.speechSynthesis) return;
    var u = new SpeechSynthesisUtterance(btn.getAttribute("data-en"));
    u.lang = "en-US";
    u.rate = 0.85;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
    btn.classList.add("speaking");
    setTimeout(function(){ btn.classList.remove("speaking"); }, 1200);
  } catch(e){}
}

function eqStartQuiz(){
  EQ_SESSION.idx = 0;
  EQ_SESSION.wrong = 0;
  EQ_SESSION.combo = 0;
  // 按难度档排序出题：基础(lv1) → 进阶(lv2) → 挑战(lv3)，同档保持原顺序
  var sorted = EQ_SESSION.lesson.q.slice().sort(function(a, b){
    return (a.lv || 1) - (b.lv || 1);
  });
  EQ_SESSION.quizList = sorted;
  eqRenderQuiz();
}

function eqLvLabel(lv){
  if (lv === 3) return "🔥 挑战";
  if (lv === 2) return "⚡ 进阶";
  return "🌱 基础";
}

function eqRenderQuiz(){
  var l = EQ_SESSION.lesson;
  var q = EQ_SESSION.quizList[EQ_SESSION.idx];
  var opts = q.o.map(function(t, i){
    return '<button class="eq-opt" type="button" data-i="' + i + '" onclick="eqAnswer(this)">' + t + '</button>';
  }).join("");
  document.getElementById("eqDialog").innerHTML =
    '<div class="eq-dlg-head">' +
      '<span class="eq-cap">⚔️ 第 ' + (EQ_SESSION.idx + 1) + ' / ' + EQ_SESSION.quizList.length + ' 题 · ' + eqLvLabel(q.lv) + '</span>' +
      '<h3>' + l.t + '</h3>' +
      '<button class="eq-close" type="button" onclick="eqClose()">×</button>' +
    '</div>' +
    '<div class="eq-dlg-body">' +
      '<div class="eq-combo-track">🔥 连击 <b id="eqComboN">' + EQ_SESSION.combo + '</b> · 🪙 ' + eqState().coins + '</div>' +
      '<div class="eq-question">' + q.q + '</div>' +
      '<div class="eq-opts">' + opts + '</div>' +
      '<div class="eq-feedback" id="eqFeedback"></div>' +
    '</div>';
}

function eqAnswer(btn){
  var q = EQ_SESSION.quizList[EQ_SESSION.idx];
  var i = parseInt(btn.getAttribute("data-i"), 10);
  var opts = btn.parentNode.querySelectorAll(".eq-opt");
  for (var k = 0; k < opts.length; k++) opts[k].disabled = true;
  var fb = document.getElementById("eqFeedback");
  if (i === q.a){
    btn.classList.add("ok");
    EQ_SESSION.combo++;
    var gain = EQ_COIN_PER_Q * EQ_SESSION.combo;
    eqState().coins += gain;
    eqFloatCoin("+" + gain + " 🪙");
    if (EQ_SESSION.combo >= 2) eqShowCombo(EQ_SESSION.combo);
    fb.innerHTML = '<div class="eq-fb ok">✅ 太棒了！' + q.why + '</div>' +
      '<button class="eq-again-btn" type="button" onclick="eqNextQ()">下一题 →</button>';
  } else {
    btn.classList.add("no");
    opts[q.a].classList.add("ok");
    EQ_SESSION.combo = 0;
    EQ_SESSION.wrong++;
    if (typeof errBookAdd === "function") errBookAdd("grammar", { q: q.q, o: q.o, a: q.a, why: q.why, source: EQ_SESSION.lesson.t });
    fb.innerHTML = '<div class="eq-fb no">❌ 再想想：' + q.why + '</div>' +
      '<button class="eq-again-btn" type="button" onclick="eqNextQ()">继续 →</button>';
  }
  saveS();
}

function eqNextQ(){
  EQ_SESSION.idx++;
  if (EQ_SESSION.idx < EQ_SESSION.quizList.length){ eqRenderQuiz(); return; }
  eqFinish();
}

function eqFinish(){
  var l = EQ_SESSION.lesson;
  var total = EQ_SESSION.quizList.length;
  var wrong = EQ_SESSION.wrong;
  var stars = wrong === 0 ? 3 : (wrong <= 2 ? 2 : 1);
  var old = eqState().done[l.id] || 0;
  if (stars > old) eqState().done[l.id] = stars;
  saveS();
  if (typeof fireConfetti === "function" && stars >= 2) fireConfetti();
  var done = Object.keys(eqState().done).length;
  var starRow = "";
  for (var i = 1; i <= 3; i++) starRow += '<span class="' + (i <= stars ? "on" : "") + '">★</span>';
  var next = eqNextLessonId(l.id);
  var msg = stars === 3 ? "一次全对，语法船长为你敬礼！🫡"
          : stars === 2 ? "很不错！再练一次就是满分船长！"
          : "过关啦！再来一次巩固一下更棒！";
  document.getElementById("eqDialog").innerHTML =
    '<div class="eq-dlg-head result"><span class="eq-cap">🏁 闯关完成</span>' +
      '<button class="eq-close" type="button" onclick="eqClose()">×</button></div>' +
    '<div class="eq-dlg-body eq-result">' +
      '<div class="eq-result-stars">' + starRow + '</div>' +
      '<h3>' + l.t + '</h3>' +
      '<p>' + msg + '</p>' +
      '<p class="eq-result-meta">📊 本关 ' + (total - wrong) + '/' + total + ' 正确 · 总进度 ' + done + ' / ' + EQ_DATA.lessons.length + ' · 🪙 ' + eqState().coins + '</p>' +
      '<div class="eq-result-btns">' +
        '<button class="eq-go-btn ghost" type="button" onclick="eqStartQuiz()">🔁 再练一次</button>' +
        '<button class="eq-go-btn topic" type="button" onclick="kpPanelOpen(\'grammar\',\'english\',\'英语语法\')">🎯 按考点练真题</button>' +
        (next ? '<button class="eq-go-btn" type="button" onclick="eqOpen(\'' + next + '\')">下一例 →</button>'
              : '<button class="eq-go-btn" type="button" onclick="eqClose()">🏆 岛屿通关！</button>') +
      '</div>' +
    '</div>';
}

function eqNextLessonId(id){
  var idx = -1;
  for (var i = 0; i < EQ_DATA.lessons.length; i++){
    if (EQ_DATA.lessons[i].id === id){ idx = i; break; }
  }
  return idx >= 0 && idx + 1 < EQ_DATA.lessons.length ? EQ_DATA.lessons[idx + 1].id : null;
}

/* ---------- 特效 ---------- */
function eqShowCombo(n){
  var el = document.getElementById("eqCombo");
  if (!el) return;
  el.textContent = "🔥 连击 ×" + n + "！";
  el.classList.remove("show");
  void el.offsetWidth;
  el.classList.add("show");
  setTimeout(function(){ el.classList.remove("show"); }, 1200);
}
function eqFloatCoin(txt){
  var el = document.getElementById("eqFloat");
  if (!el) return;
  var s = document.createElement("span");
  s.textContent = txt;
  el.appendChild(s);
  setTimeout(function(){ s.remove(); }, 1100);
}

/* ---------- 生命周期 ---------- */
function eqOnEnter(){ eqRender(); }

function eqSwitchTab(tab){
  var tabs = document.querySelectorAll('.eq-tab');
  for (var i = 0; i < tabs.length; i++){
    tabs[i].classList.toggle('active', tabs[i].getAttribute('data-tab') === tab);
  }
  document.getElementById('eqSubGrammar').style.display = tab === 'grammar' ? '' : 'none';
  document.getElementById('eqSubVocab').style.display = tab === 'vocab' ? '' : 'none';
  document.getElementById('eqSubReading').style.display = tab === 'reading' ? '' : 'none';
  document.getElementById('eqSubWriting').style.display = tab === 'writing' ? '' : 'none';
  document.getElementById('eqSubOral').style.display = tab === 'oral' ? '' : 'none';
  document.getElementById('eqSubExam').style.display = tab === 'exam' ? '' : 'none';
  document.getElementById('eqSubErrBook').style.display = tab === 'errbook' ? '' : 'none';
  if (tab === 'grammar') eqRender();
  if (tab === 'vocab' && typeof vqRender === "function") vqRender();
  if (tab === 'reading' && typeof rqRender === "function") rqRender();
  if (tab === 'writing' && typeof wqRender === "function") wqRender();
  if (tab === 'oral' && typeof oqRender === "function") oqRender();
  if (tab === 'exam' && typeof xqRender === "function") xqRender();
  if (tab === 'exam' && typeof ppRender === "function") ppRender();
  if (tab === 'errbook' && typeof ebRender === "function") ebRender();
}

window.addEventListener("load", function(){
  if (document.getElementById("eqChapters")) eqRender();
});