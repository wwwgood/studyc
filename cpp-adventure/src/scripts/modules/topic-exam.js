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
  if (topicId === "all") count = 9999;
  if (typeof qbSelect === "function"){
    questions = qbSelect(module, (topicId === "all" ? null : topicId), count, null, "english");
  }
  if (questions.length === 0 && topicId !== "all"){
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
  TE_SESSION = { module: module, topicId: topicId, topicName: topicName, questions: questions, idx: 0, wrong: 0, combo: 0, answered: false };
  teRenderQuiz();
  var mask = document.getElementById("teDialogMask");
  if (mask) mask.classList.add("open");
  document.body.style.overflow = "hidden";
}

function teRenderQuiz(){
  var q = TE_SESSION.questions[TE_SESSION.idx];
  var qType = (typeof qtTypeOf === "function") ? qtTypeOf(q) : "choice";
  var inputHtml = (typeof qtRender === "function") ? qtRender(q, "qt") : "";
  var qTitle = q.q ? '<div class="te-question">' + q.q + '</div>' : '';
  var dialog = document.getElementById("teDialog");
  if (!dialog) return;
  dialog.innerHTML =
    '<div class="te-dlg-head">' +
      '<span class="te-cap">🎯 ' + TE_SESSION.topicName + ' · 专题真题 ' + (TE_SESSION.idx + 1) + '/' + TE_SESSION.questions.length +
      (typeof qtLabel === "function" ? ' · ' + qtLabel(qType) : '') + '</span>' +
      '<button class="te-close" type="button" onclick="teClose()">×</button>' +
    '</div>' +
    '<div class="te-dlg-body">' +
      '<div class="te-combo-track">🔥 连击 <b>' + TE_SESSION.combo + '</b> · 🪙 ' + teState().coins + '</div>' +
      qTitle +
      inputHtml +
      '<div class="te-feedback" id="teFeedback"></div>' +
      '<div class="te-act" id="teAct">' +
        '<button class="qt-submit" type="button" onclick="teAnswer()">' + (qType === "writing" ? "✍️ 我写完了，看范文" : "✅ 提交答案") + '</button>' +
      '</div>' +
    '</div>';
}


function teAnswer(){
  var q = TE_SESSION.questions[TE_SESSION.idx];
  if (TE_SESSION.answered) return;
  var input = (typeof qtRead === "function") ? qtRead(q, "qt") : null;
  var grade = (typeof qtGrade === "function") ? qtGrade(q, input) : { ok: false, show: "" };
  if (typeof qtMarkRight === "function") qtMarkRight(q, "qt");
  TE_SESSION.answered = true;
  var fb = document.getElementById("teFeedback");
  if (!fb) return;
  var qType = qtTypeOf(q);
  var sampleHtml = "";
  if (qType === "writing" && (q.sample || q.why)){
    sampleHtml = '<div class="qt-sample"><b>📝 参考范文：</b>' + (q.sample || q.why) + '</div>';
  }
  if (grade.ok){
    TE_SESSION.combo++;
    var gain = TE_COIN_PER_Q * (1 + Math.floor(TE_SESSION.combo / 3));
    teState().coins += gain;
    fb.innerHTML = '<div class="te-fb ok">✅ ' + (qType === "writing" ? "写完了！" : "正确！") + '+🪙' + gain +
      (q.why ? '<div class="te-fb-why">' + q.why + '</div>' : '') + '</div>' + sampleHtml +
      '<button class="te-next-btn" type="button" onclick="teNext()">下一题 →</button>';
    saveS();
    if (typeof portalRenderTopbar === "function") portalRenderTopbar();
  } else {
    TE_SESSION.combo = 0;
    TE_SESSION.wrong++;
    var showTxt = grade.show ? '<div class="qt-grade-show">' + grade.show + '</div>' : '';
    if (typeof errBookAdd === "function"){
      errBookAdd(TE_SESSION.module, {
        q: q.q || q.passage || "", type: qType,
        o: q.o, a: q.a, ansText: (typeof qtAnswerText === "function") ? qtAnswerText(q) : "",
        words: q.words, blanks: q.blanks, passage: q.passage,
        questions: q.questions, sample: q.sample, tips: q.tips,
        why: q.why, source: TE_SESSION.topicName + " 专题真题"
      });
    }
    fb.innerHTML = '<div class="te-fb no">❌ ' + showTxt +
      (q.why ? '<div class="te-fb-why">' + q.why + '</div>' : '') + '</div>' + sampleHtml +
      '<button class="te-next-btn" type="button" onclick="teNext()">继续 →</button>';
    saveS();
  }
}


function teNext(){
  TE_SESSION.idx++;
  TE_SESSION.answered = false;
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
      (TE_SESSION.module === "writing" ? '<p class="te-tip">💡 这些只是「写作小知识」。真正提高作文水平，还是要动笔写 →</p>' : '') +
      '<div class="te-result-btns">' +
        (TE_SESSION.module === "writing" ? '<button class="te-go-btn" type="button" onclick="teGotoWriting()">✍️ 去真写一篇</button>' : '') +
        '<button class="te-go-btn ghost" type="button" onclick="teRetry()">🔁 再做一次</button>' +
        '<button class="te-go-btn" type="button" onclick="teClose()">返回</button>' +
      '</div>' +
    '</div>';
}

/* 从「作文知识小测」跳到真正的写作训练（分步写一整篇） */
function teGotoWriting(){
  teClose();
  if (typeof wqOpen !== "function" || typeof WRITE_DATA === "undefined") return;
  if (typeof eqSwitchTab === "function"){ try { eqSwitchTab("writing"); } catch(e){} }
  var ps = WRITE_DATA.passages;
  var todo = ps.filter(function(p){ return !(S.writing && S.writing.done && S.writing.done[p.id]); });
  var pick = todo.length ? todo[0] : ps[0];
  wqOpen(pick.id);
}

function teRetry(){
  TE_SESSION.idx = 0;
  TE_SESSION.wrong = 0;
  TE_SESSION.combo = 0;
  TE_SESSION.answered = false;
  teRenderQuiz();
}

function teClose(){
  var mask = document.getElementById("teDialogMask");
  if (mask) mask.classList.remove("open");
  document.body.style.overflow = "";
  TE_SESSION = null;
  if (typeof portalRenderTopbar === "function") portalRenderTopbar();
}