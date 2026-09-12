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


/* ---------- 章节 → 考点 映射（学完本章直接练本章考点真题） ---------- */
var EQ_KP_MAP = [
  ["名词是什么", "名词辨认"],
  ["专有名词", "专有名词"],
  ["作定语", "名词作定语"],
  ["所有格", "名词所有格"],
  ["直接加 s", "名词复数-加s规则"],
  ["s, x, ch, sh", "名词复数-es规则"],
  ["辅音字母 + y", "名词复数-ies规则"],
  ["f / fe", "名词复数-ves规则"],
  ["不规则复数", "不规则名词复数"],
  ["可数名词", "可数与不可数名词"],
  ["不可数名词", "可数与不可数名词"],
  ["a 和 an", "a与an的区别"],
  ["定冠词", "定冠词the"],
  ["冠词", "冠词综合"],
  ["物主代词", "物主代词"],
  ["人称代词", "人称代词主格宾格"],
  ["指示代词", "指示代词"],
  ["不定代词", "不定代词"],
  ["序数词", "序数词"],
  ["基数词", "基数词"],
  ["最高级", "形容词最高级"],
  ["比较级", "形容词比较级"],
  ["as 同级", "as同级比较"],
  ["形容词", "形容词辨认与用法"],
  ["频率副词", "频率副词"],
  ["副词", "副词辨认与ly变化"],
  ["时间介词", "时间介词"],
  ["地点", "地点方位介词"],
  ["方位介词", "地点方位介词"],
  ["and / but / or", "并列连词and/but/or"],
  ["连词", "并列连词and/but/or"],
  ["because", "because与so"],
  ["so", "because与so"],
  ["there be", "there be句型"],
  ["be 动词", "be动词am/is/are"],
  ["第三人称", "动词第三人称单数"],
  ["三单", "动词第三人称单数"],
  ["do / does", "do/does助动词"],
  ["助动词", "do/does助动词"],
  ["情态动词", "情态动词"],
  ["一般现在时", "一般现在时"],
  ["现在进行时", "现在进行时"],
  ["进行时", "现在进行时"],
  ["ing", "动词ing形式"],
  ["一般过去时", "一般过去时"],
  ["过去时", "一般过去时"],
  ["一般将来时", "一般将来时"],
  ["将来时", "一般将来时"],
  ["特殊疑问", "特殊疑问句"],
  ["一般疑问", "一般疑问句"],
  ["祈使句", "祈使句"],
  ["感叹句", "感叹句"],
  ["句型", "问句与句型综合"],
  ["什么时候用 a / an", "a与an的区别"],
  ["the 表示特指", "定冠词the"],
  ["go to school", "名词固定搭配"],
  ["a / an 的数量含义", "a与an的区别"],
  ["as ... as", "as同级比较"],
  ["反身代词", null],
  ["many 和 much", "可数与不可数名词"],
  ["both 和 all", "不定代词"],
  ["each 和", "不定代词"],
  ["every", "不定代词"],
  ["疑问代词", "特殊疑问句"],
  ["几十几与 hundred", "基数词"],
  ["时间的读法", "基数词"],
  ["日期与年份", "基数词"],
  ["the same as", "名词固定搭配"],
  ["hard 和 hardly", "副词辨认与ly变化"],
  ["穿戴与交通", "地点方位介词"],
  ["with 和 without", "地点方位介词"],
  ["for 和 since", "时间介词"],
  ["常见介词固定搭配", "时间介词"],
  ["in / on / to", "地点方位介词"],
  ["介词短语大闯关", "地点方位介词"],
  ["across / through / along", "地点方位介词"],
  ["both ... and", "并列连词and/but/or"],
  ["either ... or", "并列连词and/but/or"],
  ["neither ... nor", "并列连词and/but/or"],
  ["if 条件句", "一般将来时"],
  ["have / has", "动词第三人称单数"],
  ["must / should", "情态动词"],
  ["now 标志词", "现在进行时"],
  ["was 和 were", "一般过去时"],
  ["规则动词过去式", "一般过去时"],
  ["不规则动词过去式", "一般过去时"],
  ["时间标志词", "一般过去时"],
  ["陈述句语序", "问句与句型综合"]
];
function eqKpOfLesson(l){
  for (var i = 0; i < EQ_KP_MAP.length; i++){
    if (l.t.indexOf(EQ_KP_MAP[i][0]) >= 0) return EQ_KP_MAP[i][1];
  }
  return null;
}
function eqChapterName(ch){
  for (var i = 0; i < EQ_DATA.chapters.length; i++){
    if (EQ_DATA.chapters[i].id === ch) return EQ_DATA.chapters[i].name;
  }
  return "";
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
  var st = eqState();
  var done = st.done[l.id] || 0;
  var qN = (l.q && l.q.length) ? l.q.length : 0;
  var exHtml = l.ex.map(function(e, i){
    return '<div class="eq-ex-row"><span class="eq-ex-no">' + (i + 1) + '</span>' +
      '<span class="eq-ex-en">' + e.en + '</span>' +
      '<button class="eq-say" type="button" onclick="eqSpeak(this)" data-en="' + e.en.replace(/"/g, "&quot;") + '" title="听发音">🔊</button>' +
      '<span class="eq-ex-zh">' + e.zh + '</span></div>';
  }).join("");
  var kp = eqKpOfLesson(l);
  var statusHtml = done
    ? '<span style="background:#D1FAE5;color:#065F46;border-radius:999px;padding:5px 14px;font-size:13px;font-weight:700;">✅ 练一练已通过 ' + "★".repeat(done) + '</span>'
    : '<span style="background:#FFF6E5;color:#92400E;border-radius:999px;padding:5px 14px;font-size:13px;font-weight:700;">⏳ 练一练未完成</span>';
  var quizBtn = done
    ? '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;background:#F0FFF8;border-radius:12px;padding:10px 14px;">' +
        '<span style="font-size:15px;font-weight:700;color:#065F46;">⚔️ 练一练已通过</span>' +
        '<button class="eq-go-btn ghost" type="button" onclick="eqStartQuiz()">🔁 再练一次</button></div>'
    : '<button class="eq-go-btn" type="button" style="width:100%;padding:14px 20px;font-size:16px;" onclick="eqStartQuiz()">⚔️ 练一练（' + qN + ' 题）</button>';
  var kpBtn = kp
    ? '<button class="eq-go-btn topic" type="button" style="width:100%;padding:14px 20px;font-size:16px;" onclick="topicExamOpen(\'grammar\',null,\'' + kp.replace(/'/g, "\\'") + '\',\'' + kp.replace(/'/g, "\\'") + '\')">🎯 练本章真题：' + kp + '</button>'
    : '<button class="eq-go-btn topic" type="button" style="width:100%;padding:14px 20px;font-size:16px;" onclick="kpPanelOpen(\'grammar\',\'english\',\'英语语法\')">🎯 按考点练真题</button>';
  var next = eqNextLessonId(l.id);
  var nextBtn = done && next
    ? '<button class="eq-go-btn" type="button" style="width:100%;padding:14px 20px;font-size:16px;" onclick="eqOpen(\'' + next + '\')">下一例 →</button>'
    : '';
  var chName = eqChapterName(l.ch);
  document.getElementById("eqDialog").innerHTML =
    '<div class="eq-dlg-head">' +
      '<span class="eq-cap">🧑‍✈️ 语法船长 · ' + chName + '</span>' +
      '<h3>' + l.t + '</h3>' +
      '<button class="eq-close" type="button" onclick="eqClose()">×</button>' +
    '</div>' +
    '<div class="eq-dlg-body">' +
      '<div style="margin-bottom:12px;">' + statusHtml + '</div>' +
      '<div class="eq-tip">💡 ' + l.tip + '</div>' +
      '<div class="eq-cap-bubble">' + l.body + '</div>' +
      '<div class="eq-motto">🧾 口诀：' + l.say + '</div>' +
      '<div class="eq-ex-box">' + exHtml + '</div>' +
      '<div style="display:flex;flex-direction:column;gap:10px;margin-top:4px;">' + quizBtn + kpBtn + nextBtn + '</div>' +
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
    if (typeof fxAnswer === "function") fxAnswer(true);
    btn.classList.add("ok");
    EQ_SESSION.combo++;
    var gain = EQ_COIN_PER_Q * EQ_SESSION.combo;
    eqState().coins += gain;
    eqFloatCoin("+" + gain + " 🪙");
    if (EQ_SESSION.combo >= 2) eqShowCombo(EQ_SESSION.combo);
    fb.innerHTML = '<div class="eq-fb ok">✅ 太棒了！' + q.why + '</div>' +
      '<button class="eq-again-btn" type="button" onclick="eqNextQ()">下一题 →</button>';
  } else {
    if (typeof fxAnswer === "function") fxAnswer(false);
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