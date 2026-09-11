/* ---------------- 英语词汇大冒险 vocab-quest.js ----------------
 * 玩法：20 个词库岛 → 每岛 60 词。三种闯关模式：
 * 1) 看词选义（看英文选中文）2) 拼写（看中文拼英文）3) 听写（听发音拼英文）
 * 答对赚金币，进度保存在 S.vocab。
 */
var VQ_COIN_PER_Q = 5;

function vqState(){
  if (!S.vocab) S.vocab = { done: {}, coins: 0, learned: {} };
  if (!S.vocab.done) S.vocab.done = {};
  if (!S.vocab.learned) S.vocab.learned = {};
  if (typeof S.vocab.coins !== "number") S.vocab.coins = 0;
  return S.vocab;
}

function vqStats(){
  var st = vqState();
  var done = Object.keys(st.done).length;
  var learned = Object.keys(st.learned).length;
  var total = 0;
  VOCAB_DATA.units.forEach(function(u){ total += u.words.length; });
  return { done: done, total: VOCAB_DATA.units.length, learned: learned, totalWords: total, coins: st.coins };
}

/* ---------- 总览渲染 ---------- */
function vqRender(){
  var st = vqStats();
  var bar = document.getElementById("vqTotalBar");
  var txt = document.getElementById("vqTotalTxt");
  var coins = document.getElementById("vqCoins");
  if (bar) bar.style.width = (st.done / st.total * 100) + "%";
  if (txt) txt.textContent = "已点亮 " + st.done + " / " + st.total + " 个词库岛 · 已学 " + st.learned + " / " + st.totalWords + " 词";
  if (coins) coins.textContent = st.coins;

  var wrap = document.getElementById("vqUnits");
  if (!wrap) return;
  var html = "";
  VOCAB_DATA.units.forEach(function(u){
    var done = vqState().done[u.id];
    var learned = u.words.filter(function(w){ return vqState().learned[w.en]; }).length;
    var pct = Math.round(learned / u.words.length * 100);
    var full = done >= 3;
    html += '<div class="vq-unit' + (full ? " full" : "") + '" data-uid="' + u.id + '">' +
      '<button class="vq-unit-btn" type="button" onclick="vqOpen(' + u.id + ')">' +
        '<span class="vq-emoji">' + u.emoji + '</span>' +
        '<span class="vq-name">第 ' + u.id + ' 岛 · ' + u.name + '</span>' +
        '<span class="vq-meta">' + learned + '/' + u.words.length + ' 词' +
          (done ? ' ★'.repeat(done) : '') +
          (full ? ' 🏅' : '') + '</span>' +
      '</button>' +
      '<div class="vq-bar"><span style="width:' + pct + '%"></span></div>' +
    '</div>';
  });
  wrap.innerHTML = html;
}

/* ---------- 闯关弹窗 ---------- */
var VQ_SESSION = null;

function vqOpen(uid){
  var u = VOCAB_DATA.units.filter(function(x){ return x.id === uid; })[0];
  if (!u) return;
  VQ_SESSION = { unit: u, mode: 0, idx: 0, wrong: 0, combo: 0, quizList: [] };
  vqStartMode();
  document.getElementById("vqDialogMask").classList.add("open");
  document.body.style.overflow = "hidden";
}

function vqStartMode(){
  var u = VQ_SESSION.unit;
  var mode = VQ_SESSION.mode;
  var modeNames = ["看词选义", "拼写挑战", "听写挑战"];
  var modeEmojis = ["👁️", "✍️", "👂"];
  var words = u.words.slice(0, 10);
  VQ_SESSION.idx = 0;
  VQ_SESSION.wrong = 0;
  VQ_SESSION.combo = 0;
  VQ_SESSION.quizList = words.map(function(w){
    if (mode === 0){
      var opts = [w.zh];
      var pool = u.words.filter(function(x){ return x.zh !== w.zh; });
      while (opts.length < 4 && pool.length > 0){
        var r = pool[Math.floor(Math.random() * pool.length)];
        if (opts.indexOf(r.zh) < 0) opts.push(r.zh);
      }
      while (opts.length < 4) opts.push("—");
      var ans = opts.indexOf(w.zh);
      opts = opts.slice();
      for (var i = opts.length - 1; i > 0; i--){
        var j = Math.floor(Math.random() * (i + 1));
        var t = opts[i]; opts[i] = opts[j]; opts[j] = t;
      }
      ans = opts.indexOf(w.zh);
      return { type: "choice", word: w, q: w.en + " [" + w.pos + "]", opts: opts, ans: ans };
    } else if (mode === 1){
      return { type: "spell", word: w, q: w.zh + " [" + w.pos + "]" };
    } else {
      return { type: "dict", word: w, q: "听发音写单词" };
    }
  });
  vqRenderQuiz();
}

function vqRenderQuiz(){
  var u = VQ_SESSION.unit;
  var modeNames = ["看词选义", "拼写挑战", "听写挑战"];
  var modeEmojis = ["👁️", "✍️", "👂"];
  var q = VQ_SESSION.quizList[VQ_SESSION.idx];
  var body = "";

  if (q.type === "choice"){
    var opts = q.opts.map(function(t, i){
      return '<button class="vq-opt" type="button" data-i="' + i + '" onclick="vqAnswer(this)">' + t + '</button>';
    }).join("");
    body = '<div class="vq-question">' + q.q + '</div><div class="vq-opts">' + opts + '</div>';
  } else if (q.type === "spell"){
    body = '<div class="vq-question">✍️ 请拼写：' + q.q + '</div>' +
      '<input class="vq-input" id="vqInput" type="text" autocomplete="off" onkeydown="if(event.key===\'Enter\')vqCheckSpell()">' +
      '<button class="vq-check-btn" type="button" onclick="vqCheckSpell()">确认</button>';
  } else {
    body = '<div class="vq-question">👂 请听发音并拼写：</div>' +
      '<button class="vq-play-btn" type="button" onclick="vqSpeak(\'' + q.word.en + '\')">🔊 再听一次</button>' +
      '<input class="vq-input" id="vqInput" type="text" autocomplete="off" onkeydown="if(event.key===\'Enter\')vqCheckSpell()">' +
      '<button class="vq-check-btn" type="button" onclick="vqCheckSpell()">确认</button>';
    setTimeout(function(){ vqSpeak(q.word.en); }, 200);
  }

  document.getElementById("vqDialog").innerHTML =
    '<div class="vq-dlg-head">' +
      '<span class="vq-cap">' + modeEmojis[VQ_SESSION.mode] + ' ' + modeNames[VQ_SESSION.mode] + ' · 第 ' + u.id + ' 岛 ' + u.name + '</span>' +
      '<span class="vq-progress">' + (VQ_SESSION.idx + 1) + '/' + VQ_SESSION.quizList.length + '</span>' +
      '<button class="vq-close" type="button" onclick="vqClose()">×</button>' +
    '</div>' +
    '<div class="vq-dlg-body">' +
      '<div class="vq-combo-track">🔥 连击 <b>' + VQ_SESSION.combo + '</b> · 🪙 ' + vqState().coins + '</div>' +
      body +
      '<div class="vq-feedback" id="vqFeedback"></div>' +
    '</div>';

  var inp = document.getElementById("vqInput");
  if (inp) inp.focus();
}

function vqSpeak(word){
  try {
    if (!window.speechSynthesis) return;
    var u = new SpeechSynthesisUtterance(word);
    u.lang = "en-US";
    u.rate = 0.8;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  } catch(e){}
}

function vqAnswer(btn){
  var q = VQ_SESSION.quizList[VQ_SESSION.idx];
  var i = parseInt(btn.getAttribute("data-i"), 10);
  var opts = btn.parentNode.querySelectorAll(".vq-opt");
  for (var k = 0; k < opts.length; k++) opts[k].disabled = true;
  var fb = document.getElementById("vqFeedback");
  if (i === q.ans){
    btn.classList.add("ok");
    vqCorrect();
  } else {
    btn.classList.add("no");
    opts[q.ans].classList.add("ok");
    if (typeof errBookAdd === "function") errBookAdd("vocab", { q: q.q + " = ?", o: q.opts, a: q.ans, why: q.word.en + " 的意思是 " + q.word.zh, source: q.word.en });
    vqWrong(q.word.en + " = " + q.word.zh);
  }
}

function vqCheckSpell(){
  var q = VQ_SESSION.quizList[VQ_SESSION.idx];
  var inp = document.getElementById("vqInput");
  var ans = inp.value.trim().toLowerCase();
  var fb = document.getElementById("vqFeedback");
  inp.disabled = true;
  if (ans === q.word.en.toLowerCase()){
    vqCorrect();
  } else {
    if (typeof errBookAdd === "function"){
      var opts = [q.word.en];
      var pool = VQ_SESSION.unit.words.filter(function(x){ return x.en !== q.word.en; });
      while (opts.length < 4 && pool.length > 0){
        var r = pool[Math.floor(Math.random() * pool.length)];
        if (opts.indexOf(r.en) < 0) opts.push(r.en);
      }
      while (opts.length < 4) opts.push("—");
      for (var i = opts.length - 1; i > 0; i--){
        var j = Math.floor(Math.random() * (i + 1));
        var t = opts[i]; opts[i] = opts[j]; opts[j] = t;
      }
      var ansIdx = opts.indexOf(q.word.en);
      errBookAdd("vocab", { q: "拼写：" + q.word.zh + " [" + q.word.pos + "]", o: opts, a: ansIdx, why: "正确拼写：" + q.word.en, source: q.word.en });
    }
    vqWrong("正确：" + q.word.en + " = " + q.word.zh);
  }
}

function vqCorrect(){
  VQ_SESSION.combo++;
  var gain = VQ_COIN_PER_Q * (1 + Math.floor(VQ_SESSION.combo / 3));
  vqState().coins += gain;
  vqState().learned[VQ_SESSION.quizList[VQ_SESSION.idx].word.en] = true;
  var fb = document.getElementById("vqFeedback");
  fb.innerHTML = '<div class="vq-fb ok">✅ 正确！+🪙' + gain + '</div>' +
    '<button class="vq-next-btn" type="button" onclick="vqNext()">下一题 →</button>';
  saveS();
  if (typeof portalRenderTopbar === "function") portalRenderTopbar();
}

function vqWrong(hint){
  VQ_SESSION.combo = 0;
  VQ_SESSION.wrong++;
  var fb = document.getElementById("vqFeedback");
  fb.innerHTML = '<div class="vq-fb no">❌ ' + hint + '</div>' +
    '<button class="vq-next-btn" type="button" onclick="vqNext()">继续 →</button>';
  saveS();
}

function vqNext(){
  VQ_SESSION.idx++;
  if (VQ_SESSION.idx < VQ_SESSION.quizList.length){ vqRenderQuiz(); return; }
  VQ_SESSION.mode++;
  if (VQ_SESSION.mode < 3){
    vqStartMode();
    return;
  }
  vqFinish();
}

function vqFinish(){
  var u = VQ_SESSION.unit;
  var wrong = VQ_SESSION.wrong;
  var stars = wrong === 0 ? 3 : (wrong <= 3 ? 2 : 1);
  var old = vqState().done[u.id] || 0;
  if (stars > old) vqState().done[u.id] = stars;
  saveS();
  if (typeof fireConfetti === "function" && stars >= 2) fireConfetti();
  var learned = u.words.filter(function(w){ return vqState().learned[w.en]; }).length;
  var starRow = "";
  for (var i = 1; i <= 3; i++) starRow += '<span class="' + (i <= stars ? "on" : "") + '">★</span>';
  document.getElementById("vqDialog").innerHTML =
    '<div class="vq-dlg-head result"><span class="vq-cap">🏁 闯关完成</span>' +
      '<button class="vq-close" type="button" onclick="vqClose()">×</button></div>' +
    '<div class="vq-dlg-body vq-result">' +
      '<div class="vq-result-stars">' + starRow + '</div>' +
      '<h3>第 ' + u.id + ' 岛 · ' + u.name + '</h3>' +
      '<p>' + (stars === 3 ? "完美通关，你是词汇大师！🌟" : stars === 2 ? "很棒！再练一次就是满分！" : "过关啦！多练几次更熟练！") + '</p>' +
      '<p class="vq-result-meta">📊 本岛已学 ' + learned + '/' + u.words.length + ' 词 · 🪙 ' + vqState().coins + '</p>' +
      '<div class="vq-result-btns">' +
        '<button class="vq-go-btn ghost" type="button" onclick="vqOpen(' + u.id + ')">🔁 再练一次</button>' +
        '<button class="vq-go-btn topic" type="button" onclick="topicExamOpen(\'vocab\',\'all\',\'全部词汇真题\')">📚 全部真题一起练</button>' +
        '<button class="vq-go-btn" type="button" onclick="vqClose()">返回</button>' +
      '</div>' +
    '</div>';
}

function vqClose(){
  var mask = document.getElementById("vqDialogMask");
  if (mask) mask.classList.remove("open");
  document.body.style.overflow = "";
  VQ_SESSION = null;
  vqRender();
  if (typeof portalRenderTopbar === "function") portalRenderTopbar();
}

function vqOnEnter(){ vqRender(); }
window.addEventListener("load", function(){ if (document.getElementById("vqUnits")) vqRender(); });