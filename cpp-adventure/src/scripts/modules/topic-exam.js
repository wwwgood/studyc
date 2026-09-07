/* ---------------- 专题真题训练 topic-exam.js ----------------
 * 在每个专题学完后，可就地进行对应小升初真题训练。
 * 答错自动入错题本。进度保存在 S.topicExam = { done: { key: stars }, coins: 0 }。
 */
var TE_COIN_PER_Q = 8;

function teState(){
  if (!S.topicExam) S.topicExam = { done: {}, coins: 0 };
  if (!S.topicExam.done) S.topicExam.done = {};
  if (typeof S.topicExam.coins !== "number") S.topicExam.coins = 0;
  return S.topicExam;
}

var TE_SESSION = null;

/* 从任意模块调用：module=grammar/vocab/reading/writing, topicId=章节/单元ID, topicName=名称
 * 优先从统一题库随机选题（每次不同），题库无题时回退到 TOPIC_EXAM_DATA */
function topicExamOpen(module, topicId, topicName){
  var questions = [];
  var count = 10;
  if (typeof qbSelect === "function"){
    questions = qbSelect(module, topicId, count, null, "english");
  }
  if (questions.length === 0){
    if (module === "grammar" && typeof TOPIC_EXAM_DATA !== "undefined" && TOPIC_EXAM_DATA.grammar[topicId]){
      questions = TOPIC_EXAM_DATA.grammar[topicId];
    } else if (module === "vocab" && typeof TOPIC_EXAM_DATA !== "undefined" && TOPIC_EXAM_DATA.vocab[topicId]){
      questions = TOPIC_EXAM_DATA.vocab[topicId];
    } else if (module === "reading" && typeof TOPIC_EXAM_DATA !== "undefined"){
      questions = TOPIC_EXAM_DATA.reading;
    } else if (module === "writing" && typeof TOPIC_EXAM_DATA !== "undefined"){
      questions = TOPIC_EXAM_DATA.writing;
    }
  }
  if (questions.length === 0){
    var dialog = document.getElementById("teDialog");
    if (dialog){
      dialog.innerHTML =
        '<div class="te-dlg-head"><span class="te-cap">🎯 ' + topicName + ' · 专题真题</span>' +
          '<button class="te-close" type="button" onclick="teClose()">×</button></div>' +
        '<div class="te-dlg-body"><div class="te-empty" style="text-align:center;padding:40px 20px;font-size:18px;color:#888;">📋 该专题暂无真题题目<br><br>请先在「题库管理」中导入对应真题<br>或去其他专题练习吧！</div></div>';
      var mask = document.getElementById("teDialogMask");
      if (mask) mask.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    return;
  }
  TE_SESSION = { module: module, topicId: topicId, topicName: topicName, questions: questions, idx: 0, wrong: 0, combo: 0 };
  teRenderQuiz();
  var mask = document.getElementById("teDialogMask");
  if (mask) mask.classList.add("open");
  document.body.style.overflow = "hidden";
}

function teRenderQuiz(){
  var q = TE_SESSION.questions[TE_SESSION.idx];
  var passage = q.q.indexOf("\n\n") >= 0 ? q.q.split("\n\n") : null;
  var qText = passage ? passage[passage.length - 1] : q.q;
  var passageHtml = "";
  if (passage && passage.length > 1){
    for (var i = 0; i < passage.length - 1; i++){
      passageHtml += '<div class="te-passage">' + passage[i].replace(/\n/g, "<br>") + '</div>';
    }
  }
  var opts = q.o.map(function(t, i){
    return '<button class="te-opt" type="button" data-i="' + i + '" onclick="teAnswer(this)">' + String.fromCharCode(65 + i) + ". " + t + '</button>';
  }).join("");
  var dialog = document.getElementById("teDialog");
  if (!dialog) return;
  dialog.innerHTML =
    '<div class="te-dlg-head">' +
      '<span class="te-cap">🎯 ' + TE_SESSION.topicName + ' · 专题真题 ' + (TE_SESSION.idx + 1) + '/' + TE_SESSION.questions.length + '</span>' +
      '<button class="te-close" type="button" onclick="teClose()">×</button>' +
    '</div>' +
    '<div class="te-dlg-body">' +
      '<div class="te-combo-track">🔥 连击 <b>' + TE_SESSION.combo + '</b> · 🪙 ' + teState().coins + '</div>' +
      passageHtml +
      '<div class="te-question">' + qText + '</div>' +
      '<div class="te-opts">' + opts + '</div>' +
      '<div class="te-feedback" id="teFeedback"></div>' +
    '</div>';
}

function teAnswer(btn){
  var q = TE_SESSION.questions[TE_SESSION.idx];
  var i = parseInt(btn.getAttribute("data-i"), 10);
  var opts = btn.parentNode.querySelectorAll(".te-opt");
  for (var k = 0; k < opts.length; k++) opts[k].disabled = true;
  var fb = document.getElementById("teFeedback");
  if (i === q.a){
    btn.classList.add("ok");
    TE_SESSION.combo++;
    var gain = TE_COIN_PER_Q * (1 + Math.floor(TE_SESSION.combo / 3));
    teState().coins += gain;
    fb.innerHTML = '<div class="te-fb ok">✅ 正确！+🪙' + gain + ' · ' + q.why + '</div>' +
      '<button class="te-next-btn" type="button" onclick="teNext()">下一题 →</button>';
    saveS();
    if (typeof portalRenderTopbar === "function") portalRenderTopbar();
  } else {
    btn.classList.add("no");
    opts[q.a].classList.add("ok");
    TE_SESSION.combo = 0;
    TE_SESSION.wrong++;
    if (typeof errBookAdd === "function") errBookAdd(TE_SESSION.module, { q: q.q, o: q.o, a: q.a, why: q.why, source: TE_SESSION.topicName + " 专题真题" });
    fb.innerHTML = '<div class="te-fb no">❌ ' + q.why + '</div>' +
      '<button class="te-next-btn" type="button" onclick="teNext()">继续 →</button>';
    saveS();
  }
}

function teNext(){
  TE_SESSION.idx++;
  if (TE_SESSION.idx < TE_SESSION.questions.length){ teRenderQuiz(); return; }
  teFinish();
}

function teFinish(){
  var total = TE_SESSION.questions.length;
  var wrong = TE_SESSION.wrong;
  var stars = wrong === 0 ? 3 : (wrong <= Math.floor(total * 0.2) ? 2 : 1);
  var key = TE_SESSION.module + "_" + TE_SESSION.topicId;
  var old = teState().done[key] || 0;
  if (stars > old) teState().done[key] = stars;
  saveS();
  if (typeof fireConfetti === "function" && stars >= 2) fireConfetti();
  var starRow = "";
  for (var i = 1; i <= 3; i++) starRow += '<span class="' + (i <= stars ? "on" : "") + '">★</span>';
  var dialog = document.getElementById("teDialog");
  if (!dialog) return;
  dialog.innerHTML =
    '<div class="te-dlg-head result"><span class="te-cap">🏁 专题真题完成</span>' +
      '<button class="te-close" type="button" onclick="teClose()">×</button></div>' +
    '<div class="te-dlg-body te-result">' +
      '<div class="te-result-stars">' + starRow + '</div>' +
      '<h3>' + TE_SESSION.topicName + '</h3>' +
      '<p>答对 ' + (total - wrong) + '/' + total + ' · ' + (stars === 3 ? "全部正确！小升初稳了！🏆" : stars === 2 ? "优秀！再接再厉！" : "完成！错题已加入错题本，多练几次！") + '</p>' +
      '<div class="te-result-btns">' +
        '<button class="te-go-btn ghost" type="button" onclick="teRetry()">🔁 再做一次</button>' +
        '<button class="te-go-btn" type="button" onclick="teClose()">返回</button>' +
      '</div>' +
    '</div>';
}

function teRetry(){
  TE_SESSION.idx = 0;
  TE_SESSION.wrong = 0;
  TE_SESSION.combo = 0;
  teRenderQuiz();
}

function teClose(){
  var mask = document.getElementById("teDialogMask");
  if (mask) mask.classList.remove("open");
  document.body.style.overflow = "";
  TE_SESSION = null;
  if (typeof portalRenderTopbar === "function") portalRenderTopbar();
}