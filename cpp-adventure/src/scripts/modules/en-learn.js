/* ---------------- 英语系统学习模块 en-learn.js ----------------
 * "先讲后练" 核心流程：讲解 → 例题 → 习题 → 笔记
 * 数据来自 EN_TOPICS（en-learn-data.js）
 * 状态存储在 S.enLearn
 */

/* ---------- 状态初始化 ---------- */
function elState(){
  if (!S.enLearn) S.enLearn = {
    currentStage: "xsx",
    topics: {},       // topicId -> {lessonDone, examplesScore, quizScore, stars, notes, dates, mastered}
    records: [],      // 自动学习记录 [{date, time, timestamp, endTimestamp, duration, topicId, topicName, stage, action, score, total, correct, wrong, mastered, stars, notes}]
    streak: { current: 0, lastDate: null, best: 0 }
  };
  if (!S.enLearn.topics) S.enLearn.topics = {};
  if (!S.enLearn.records) S.enLearn.records = [];
  if (!S.enLearn.streak) S.enLearn.streak = { current: 0, lastDate: null, best: 0 };

  // 迁移旧 calendar 数据（如果有）
  if (S.enLearn.calendar && typeof S.enLearn.calendar === "object"){
    var oldCal = S.enLearn.calendar;
    Object.keys(oldCal).forEach(function(dateStr){
      var ids = oldCal[dateStr];
      if (Array.isArray(ids)){
        ids.forEach(function(id){
          var t = EN_TOPICS.find(function(x){ return x.id === id; });
          S.enLearn.records.push({
            date: dateStr, time: "--:--", timestamp: 0, endTimestamp: 0, duration: 0,
            topicId: id, topicName: t ? t.name : id, stage: t ? t.stage : "xsx",
            action: "full", score: 0, total: 0, correct: 0, wrong: 0,
            mastered: false, stars: 0, notes: ""
          });
        });
      }
    });
    delete S.enLearn.calendar;
    saveS();
  }
  return S.enLearn;
}

/* 获取或创建某个知识点的学习记录 */
function elTopicState(id){
  var st = elState();
  if (!st.topics[id]) st.topics[id] = {
    lessonDone: false,
    examplesScore: 0,
    examplesTotal: 0,
    quizScore: 0,
    quizTotal: 0,
    stars: 0,
    notes: "",
    dates: [],
    lastDate: null,
    mastered: false,
    masteredAt: null,
    tryCount: 0
  };
  return st.topics[id];
}

/* 判定"已掌握" */
function elCheckMastered(state){
  if (state.mastered) return true;
  var condA = state.lessonDone && state.examplesScore === state.examplesTotal && state.examplesTotal > 0 &&
              state.quizScore / state.quizTotal >= 0.8 && state.quizTotal > 0;
  var condB = state.lessonDone && state.quizScore === state.quizTotal && state.quizTotal >= 10;
  var condC = state.tryCount >= 3 && state.quizTotal > 0 &&
              state.quizScore / state.quizTotal >= 0.7 &&
              state.lastDate && state.dates.length >= 2;
  var mastered = condA || condB || condC;
  if (mastered && !state.mastered){
    state.mastered = true;
    state.masteredAt = new Date().toISOString().split('T')[0];
    saveS();
  }
  return mastered;
}

/* ---------- 学段选择 ---------- */
function elRenderStages(){
  var wrap = document.getElementById("elStageTabs");
  if (!wrap) return;
  var st = elState();
  var html = "";
  var stages = Object.values(EN_STAGES).sort(function(a,b){ return a.order - b.order; });
  stages.forEach(function(s){
    var active = s.id === st.currentStage ? " active" : "";
    var topics = EN_TOPICS.filter(function(t){ return t.stage === s.id; });
    var learned = topics.filter(function(t){ return elTopicState(t.id).lessonDone; }).length;
    html += '<button class="el-stage-btn' + active + '" onclick="elSelectStage(\'' + s.id + '\')">' +
      '<b>' + s.name + '</b><small>' + learned + '/' + topics.length + '</small></button>';
  });
  wrap.innerHTML = html;
}

function elSelectStage(id){
  elState().currentStage = id;
  saveS();
  elRenderStages();
  elRenderTopics();
}

/* ---------- 知识点列表 ---------- */
function elRenderTopics(){
  var wrap = document.getElementById("elTopicList");
  if (!wrap) return;
  var st = elState();
  var topics = EN_TOPICS.filter(function(t){ return t.stage === st.currentStage; })
    .sort(function(a,b){ return a.order - b.order; });

  if (!topics.length){
    wrap.innerHTML = '<div class="el-empty">该学段暂无内容，请选择其他学段</div>';
    return;
  }

  var html = '<div class="el-topics-grid">';
  topics.forEach(function(t, idx){
    var state = elTopicState(t.id);
    var mastered = elCheckMastered(state);
    var statusClass = mastered ? " mastered" : (state.lessonDone ? " learning" : "");
    var statusText = mastered ? "⭐ 已掌握" : (state.lessonDone ? "📖 学习中" : "🆕 未开始");
    var btnText = mastered ? "再练一次" : (state.lessonDone ? "继续学习" : "开始学习");

    html += '<div class="el-topic-card' + statusClass + '">' +
      '<div class="el-tc-num">' + (idx + 1) + '</div>' +
      '<div class="el-tc-body">' +
        '<h3>' + t.name + '</h3>' +
        '<p class="el-tc-desc">' + (t.desc || "") + '</p>' +
        '<div class="el-tc-meta">' +
          '<span class="el-tc-status">' + statusText + '</span>' +
          '<span class="el-tc-stars">' + elStars(state.stars) + '</span>' +
        '</div>' +
      '</div>' +
      '<button class="el-tc-btn" onclick="elStartTopic(\'' + t.id + '\')">' + btnText + '</button>' +
    '</div>';
  });
  html += '</div>';
  wrap.innerHTML = html;
}

function elStars(n){
  n = n || 0;
  var s = "";
  for (var i = 1; i <= 3; i++) s += '<span class="' + (i <= n ? "on" : "") + '">★</span>';
  return s;
}

/* ---------- 开始学习 ---------- */
var EL_CURRENT = null;   // 当前知识点
var EL_STEP = 0;         // 当前步骤 0=讲解 1=例题 2=习题 3=笔记
var EL_EXAMPLE_IDX = 0;  // 当前例题索引
var EL_QUIZ_IDX = 0;     // 当前习题索引
var EL_QUIZ_SCORE = 0;   // 习题得分
var EL_START_TIME = 0;   // 本次学习开始时间戳
var EL_LESSON_IDX = 0;   // 当前讲解卡片索引
var EL_LESSON_CARDS = [];// 讲解卡片数组 [{emoji,title,text,quiz:{...},answered,ok}]

function elStartTopic(id){
  var topic = EN_TOPICS.find(function(t){ return t.id === id; });
  if (!topic) return;
  EL_CURRENT = topic;
  EL_STEP = 0;
  EL_EXAMPLE_IDX = 0;
  EL_QUIZ_IDX = 0;
  EL_QUIZ_SCORE = 0;
  EL_LESSON_IDX = 0;
  EL_LESSON_CARDS = [];
  EL_START_TIME = Date.now();
  elShowStep();
}

/* 自动写入一条学习记录 */
function elPushRecord(action, score, total, correct, wrong, notes){
  var st = elState();
  var t = EL_CURRENT;
  if (!t) return;
  var now = new Date();
  var nowTs = Date.now();
  var state = elTopicState(t.id);
  var duration = EL_START_TIME ? Math.max(1, Math.round((nowTs - EL_START_TIME) / 60000)) : 0;

  var rec = {
    date: now.toISOString().split('T')[0],
    time: now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0'),
    timestamp: EL_START_TIME || nowTs,
    endTimestamp: nowTs,
    duration: duration,
    topicId: t.id,
    topicName: t.name,
    stage: t.stage || st.currentStage,
    action: action || "full",
    score: score !== undefined ? score : (state.quizScore || 0),
    total: total !== undefined ? total : (state.quizTotal || 0),
    correct: correct !== undefined ? correct : (state.quizScore || 0),
    wrong: wrong !== undefined ? wrong : Math.max(0, (state.quizTotal || 0) - (state.quizScore || 0)),
    mastered: state.mastered || false,
    stars: state.stars || 0,
    notes: notes || state.notes || ""
  };
  st.records.unshift(rec);

  // 更新连续学习天数
  var today = rec.date;
  var yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  var ystr = yesterday.toISOString().split('T')[0];
  if (st.streak.lastDate === ystr){
    st.streak.current++;
  } else if (st.streak.lastDate !== today){
    st.streak.current = 1;
  }
  st.streak.lastDate = today;
  if (st.streak.current > st.streak.best) st.streak.best = st.streak.current;

  saveS();
}

function elShowStep(){
  var mask = elMask();
  var card = document.getElementById("elCard");
  if (!card) return;

  var html = "";
  if (EL_STEP === 0) html = elRenderLesson();
  else if (EL_STEP === 1) html = elRenderExamples();
  else if (EL_STEP === 2) html = elRenderQuiz();
  else if (EL_STEP === 3) html = elRenderNotes();

  card.innerHTML = html;
  mask.classList.add("open");
  document.body.style.overflow = "hidden";
}

/* ---------- 讲解页（卡片滑动 · 边做边学） ---------- */

/* 把 lesson.blocks 展开为讲解卡片数组
 * 支持类型：
 *  - card：一屏一个知识点卡片 {emoji,title,content,quiz:{q,options,answer,why}}
 *  - text / tip / code：兼容旧数据的纯文字块，会自动按长度拆成多张短卡片
 *  - mini-quiz：独立小题卡 {q,options,answer,why,emoji}
 */
function elBuildLessonCards(t){
  var blocks = t.lesson && t.lesson.blocks ? t.lesson.blocks : [];
  var cards = [];
  var pending = []; // 累计的纯文字

  function flushText(){
    if (!pending.length) return;
    // 按空行/标题/编号切分，尽量每卡一小段
    var joined = pending.join("\n");
    var parts = joined.split(/\n{2,}|(?=【)|(?=❊)|(?=✭)|(?=①)|(?=②)|(?=③)|(?=④)|(?=⑤)|(?=⑥)|(?=⑦)|(?=⑧)|(?=⑨)|(?=⑩)|(?=\d+\.\s)/);
    var emojiList = ["🔎", "💡", "🧩", "✨", "📌", "🎯", "🚀", "⭐"];
    parts.forEach(function(p, i){
      p = (p || "").trim();
      if (!p) return;
      if (p.length > 380){
        // 超长段再按句号切
        var sents = p.split(/(?<=。|！|？|\?|!)/);
        var buf = "";
        sents.forEach(function(sn){
          buf += sn;
          if (buf.trim().length >= 200 && buf.trim().length <= 400){
            cards.push(elMakeLearnCard(buf.trim(), emojiList[cards.length % emojiList.length]));
            buf = "";
          }
        });
        if (buf.trim()) cards.push(elMakeLearnCard(buf.trim(), emojiList[cards.length % emojiList.length]));
      } else {
        cards.push(elMakeLearnCard(p, emojiList[cards.length % emojiList.length]));
      }
    });
    pending = [];
  }

  blocks.forEach(function(b){
    if (b.type === "card"){
      flushText();
      cards.push({
        kind: "learn",
        emoji: b.emoji || "💡",
        title: b.title || "",
        text: b.content || "",
        quiz: b.quiz ? elNormalizeQuiz(b.quiz) : null,
        answered: false, ok: false
      });
    } else if (b.type === "mini-quiz"){
      flushText();
      cards.push({
        kind: "quiz",
        emoji: b.emoji || "🎯",
        title: b.title || "小挑战",
        text: b.content || "",
        quiz: elNormalizeQuiz(b),
        answered: false, ok: false
      });
    } else {
      pending.push(b.content || "");
    }
  });
  flushText();
  return cards;
}

/* 归一化 quiz 字段：兼容 {q,options,answer,why} / {q,o,a} / {question,option,ans} */
function elNormalizeQuiz(q){
  if (!q) return null;
  var options = q.options || q.o || q.option || [];
  options = options.map(function(o){ return typeof o === "string" ? o : (o.text || o.label || ""); });
  var answer = q.answer !== undefined ? q.answer : (q.a !== undefined ? q.a : q.ans);
  if (typeof answer === "string") answer = parseInt(answer, 10);
  return {
    q: q.q || q.question || "请选择：",
    options: options,
    answer: (answer === -1 || answer === undefined || answer === null || isNaN(answer)) ? -1 : Number(answer),
    why: q.why || q.explain || ""
  };
}

function elMakeLearnCard(text, emoji){
  return {
    kind: "learn",
    emoji: emoji || "💡",
    title: "",
    text: text,
    quiz: null,
    answered: false, ok: false
  };
}

function elRenderLesson(){
  var t = EL_CURRENT;
  if (!EL_LESSON_CARDS.length) EL_LESSON_CARDS = elBuildLessonCards(t);
  var cards = EL_LESSON_CARDS;
  if (EL_LESSON_IDX >= cards.length) EL_LESSON_IDX = Math.max(0, cards.length - 1);
  if (!cards.length){
    return '<div class="el-lesson">' + elStepBar(0) +
      '<h2>📖 ' + elEscape(t.name) + ' · 讲解</h2>' +
      '<div class="el-empty">该知识点暂无讲解内容</div>' +
      '<div class="el-nav"><button class="el-btn primary" onclick="elLessonDone()">跳过讲解，进入例题 →</button></div></div>';
  }

  var card = cards[EL_LESSON_IDX];
  var total = cards.length;
  var pctDone = cards.filter(function(c){ return c.answered || !c.quiz; }).length;

  var html = '<div class="el-lesson el-cards">' +
    elStepBar(0) +
    '<div class="el-cards-head">' +
      '<span class="el-cards-badge">🎮 边做边学</span>' +
      '<span class="el-cards-count">' + (EL_LESSON_IDX + 1) + ' / ' + total + '</span>' +
    '</div>' +
    '<h2>📖 ' + elEscape(t.name) + '</h2>';

  /* 进度点 + 进度条 */
  html += '<div class="el-cards-dots">';
  cards.forEach(function(c, i){
    var cls = "el-card-dot";
    if (i === EL_LESSON_IDX) cls += " on";
    else if (c.answered) cls += c.ok ? " ok" : " bad";
    else if (c.quiz) cls += " todo";
    else cls += " free";
    html += '<button class="' + cls + '" onclick="elLessonGo(' + i + ')" aria-label="第' + (i+1) + '张"></button>';
  });
  html += '</div>';

  /* 卡片主体 */
  html += '<div class="el-lcard">' +
    '<div class="el-lcard-emoji">' + (card.emoji || "💡") + '</div>' +
    (card.title ? '<div class="el-lcard-title">' + elEscape(card.title) + '</div>' : '');

  if (card.text) html += '<div class="el-lcard-text">' + elEscape(card.text) + '</div>';

  /* 卡片内做题 */
  if (card.quiz){
    var qz = card.quiz;
    html += '<div class="el-lcard-quiz">' +
      '<div class="el-lcard-q">' + elEscape(qz.q) + '</div>' +
      '<div class="el-lcard-opts">';

    if (card.answered){
      qz.options.forEach(function(opt, i){
        var cls = "el-lopt";
        if (i === qz.answer) cls += " right";
        else if (i === card.picked && !card.ok) cls += " wrong";
        html += '<div class="' + cls + '">' +
          '<span class="el-lopt-key">' + "ABCD"[i] + '</span>' +
          '<span class="el-lopt-txt">' + elEscape(opt) + '</span>' +
          (i === qz.answer ? '<span class="el-lopt-mark">✅</span>' : (i === card.picked && !card.ok ? '<span class="el-lopt-mark">✗</span>' : '')) +
        '</div>';
      });
      html += '<div class="el-lcard-fb ' + (card.ok ? "ok" : "err") + '">' +
        (card.ok ? "🎉 答对啦！" : "😅 没关系，记住下面的规律") + '</div>';
      if (qz.why) html += '<div class="el-lcard-why">💡 ' + elEscape(qz.why) + '</div>';
    } else {
      qz.options.forEach(function(opt, i){
        html += '<button class="el-lopt" onclick="elLessonAnswer(' + EL_LESSON_IDX + ',' + i + ',this)">' +
          '<span class="el-lopt-key">' + "ABCD"[i] + '</span>' +
          '<span class="el-lopt-txt">' + elEscape(opt) + '</span>' +
        '</button>';
      });
    }
    html += '</div></div>';

    /* 做题后导航 */
    if (card.answered){
      var hasNext = EL_LESSON_IDX < total - 1;
      html += '<div class="el-nav">' +
        (hasNext
          ? '<button class="el-btn" onclick="elLessonPrev()">← 上一张</button><button class="el-btn primary" onclick="elLessonNext()">下一关 →</button>'
          : '<button class="el-btn" onclick="elLessonPrev()">← 上一张</button><button class="el-btn primary" onclick="elLessonDone()">🎖 完成讲解，进入例题 ⚡</button>') +
      '</div>';
    } else {
      html += '<div class="el-lcard-hint">👆 先选一个答案，答完就能看规律</div>';
    }
  } else {
    /* 纯讲解卡：可以直接翻页 */
    var hasNext2 = EL_LESSON_IDX < total - 1;
    html += '<div class="el-lcard-free"></div><div class="el-nav">' +
      (EL_LESSON_IDX > 0 ? '<button class="el-btn" onclick="elLessonPrev()">← 上一张</button>' : '') +
      (hasNext2
        ? '<button class="el-btn primary" onclick="elLessonNext()">下一张 →</button>'
        : '<button class="el-btn primary" onclick="elLessonDone()">🎖 完成讲解，进入例题 ⚡</button>') +
    '</div>';
  }

  html += '</div></div>';
  return html;
}

/* 卡片答题：点击选项即时判对错并显示解析 */
function elLessonAnswer(cardIdx, optIdx, btn){
  var card = EL_LESSON_CARDS[cardIdx];
  if (!card || !card.quiz || card.answered) return;
  card.answered = true;
  card.picked = optIdx;
  card.ok = (optIdx === card.quiz.answer);
  if (!card.ok && card.quiz.answer === -1) card.ok = true; // 无标准答案视为完成
  if (card.ok && !card.quiz.why) card.quiz.why = "";
  elShowStep();
}

function elLessonNext(){
  if (EL_LESSON_IDX < EL_LESSON_CARDS.length - 1){
    EL_LESSON_IDX++;
    elShowStep();
  } else {
    elLessonDone();
  }
}

function elLessonPrev(){
  if (EL_LESSON_IDX > 0){
    EL_LESSON_IDX--;
    elShowStep();
  }
}

function elLessonGo(i){
  if (i < 0 || i >= EL_LESSON_CARDS.length) return;
  var target = EL_LESSON_CARDS[i];
  // 未答题卡不允许直接跳过，除非它没有题
  if (target.quiz && !target.answered){
    var canJump = true;
    for (var k = 0; k < i; k++){
      if (EL_LESSON_CARDS[k].quiz && !EL_LESSON_CARDS[k].answered){ canJump = false; break; }
    }
    if (!canJump) return;
  }
  EL_LESSON_IDX = i;
  elShowStep();
}

function elStepBar(active){
  var steps = ["讲解", "例题", "习题", "笔记"];
  var html = '<div class="el-step-bar">';
  steps.forEach(function(s, i){
    if (i > 0) html += "<span>→</span>";
    html += '<span class="' + (i === active ? "on" : "") + '">' + s + '</span>';
  });
  return html + '</div>';
}

function elLessonDone(){
  var state = elTopicState(EL_CURRENT.id);
  state.lessonDone = true;
  state.dates.push(new Date().toISOString().split('T')[0]);
  state.lastDate = state.dates[state.dates.length - 1];
  elPushRecord("lesson");
  saveS();
  EL_STEP = 1;
  elShowStep();
}

/* ---------- 例题页 ---------- */
function elRenderExamples(){
  var t = EL_CURRENT;
  var examples = t.examples || [];
  var html = '<div class="el-examples">' +
    '<div class="el-step-bar"><span>讲解</span><span>→</span><span class="el-step on">例题</span><span>→</span><span>习题</span><span>→</span><span>笔记</span></div>' +
    '<h2>✏️ ' + t.name + ' · 例题 (' + (EL_EXAMPLE_IDX + 1) + '/' + Math.max(1, examples.length) + ')</h2>';

  if (!examples.length){
    html += '<div class="el-empty">该知识点暂无例题，直接进入习题。</div>' +
      '<div class="el-nav"><button class="el-btn primary" onclick="elExamplesDone()">进入习题 →</button></div>';
    return html + '</div>';
  }

  var ex = examples[EL_EXAMPLE_IDX];
  html += '<div class="el-ex-question">' + elEscape(ex.q) + '</div>';

  if (ex.options && ex.options.length){
    html += '<div class="el-ex-options">';
    ex.options.forEach(function(opt, i){
      var label = typeof opt === "string" ? opt : (opt.label || opt.text || "");
      html += '<button class="el-opt" onclick="elExampleAnswer(' + i + ')">' + label + '</button>';
    });
    html += '</div>';
  } else {
    html += '<div class="el-ex-input"><input type="text" id="elExInput" placeholder="请输入答案" onkeydown="if(event.key===\'Enter\')elExampleAnswerText()"></div>' +
      '<button class="el-btn" onclick="elExampleAnswerText()">提交答案</button>';
  }

  html += '<div id="elExFeedback"></div>';
  html += '</div>';
  return html;
}

function elExampleAnswer(idx){
  var ex = EL_CURRENT.examples[EL_EXAMPLE_IDX];
  var fb = document.getElementById("elExFeedback");
  if (!fb) return;

  if (ex.answer === -1 || ex.answer === undefined){
    fb.innerHTML = '<div class="el-feedback ok">📝 已作答<div class="el-why"><small>本题暂无标准答案，请对照课本自查。</small></div></div>' +
      '<div class="el-nav"><button class="el-btn primary" onclick="elNextExample()">下一题 →</button></div>';
    return;
  }

  var correct = (idx === ex.answer);
  if (correct){
    fb.innerHTML = '<div class="el-feedback ok">✅ 正确！<div class="el-why">' + elEscape(ex.why || "很好！") + '</div></div>' +
      '<div class="el-nav"><button class="el-btn primary" onclick="elNextExample()">下一题 →</button></div>';
  } else {
    fb.innerHTML = '<div class="el-feedback err">❌ 再想想<div class="el-why">' + elEscape(ex.why || "请仔细阅读讲解内容") + '</div></div>' +
      '<div class="el-nav"><button class="el-btn" onclick="elNextExample()">跳过，看解析</button></div>';
  }
}

function elExampleAnswerText(){
  var input = document.getElementById("elExInput");
  if (!input) return;
  var val = input.value.trim().toLowerCase();
  var ex = EL_CURRENT.examples[EL_EXAMPLE_IDX];
  var fb = document.getElementById("elExFeedback");
  if (!fb) return;

  var answers = ex.answers || [];
  var hasAnswer = answers.length > 0 && !(answers.length === 1 && !answers[0].trim());

  if (!hasAnswer || ex.answer === -1 || ex.answer === undefined){
    fb.innerHTML = '<div class="el-feedback ok">📝 已记录答案：' + elEscape(val) + '<br><small>本题暂无标准答案，请对照课本自查。</small></div>' +
      '<div class="el-nav"><button class="el-btn primary" onclick="elNextExample()">下一题 →</button></div>';
    return;
  }

  var correct = false;
  if (ex.options && ex.options.length){
    correct = ex.options.some(function(o){ return (o.text || o).toLowerCase() === val; });
  } else {
    correct = answers.some(function(a){ return a.toLowerCase().replace(/\s+/g, ' ').trim() === val; });
  }
  elExampleAnswer(correct ? 0 : -1);
}

function elNextExample(){
  EL_EXAMPLE_IDX++;
  if (EL_EXAMPLE_IDX >= EL_CURRENT.examples.length){
    elExamplesDone();
  } else {
    elShowStep();
  }
}

function elExamplesDone(){
  var state = elTopicState(EL_CURRENT.id);
  state.examplesScore = EL_CURRENT.examples ? EL_CURRENT.examples.length : 0;
  state.examplesTotal = state.examplesScore;
  elPushRecord("example", state.examplesScore, state.examplesTotal, state.examplesScore, 0);
  saveS();
  EL_STEP = 2;
  EL_QUIZ_IDX = 0;
  EL_QUIZ_SCORE = 0;
  elShowStep();
}

/* ---------- 习题页 ---------- */
function elRenderQuiz(){
  var t = EL_CURRENT;
  var quiz = t.quiz || { questions: [] };
  var total = quiz.questions ? quiz.questions.length : 0;

  var html = '<div class="el-quiz">' +
    '<div class="el-step-bar"><span>讲解</span><span>→</span><span>例题</span><span>→</span><span class="el-step on">习题</span><span>→</span><span>笔记</span></div>' +
    '<h2>📝 ' + t.name + ' · 习题 (' + (EL_QUIZ_IDX + 1) + '/' + Math.max(1, total) + ')</h2>';

  if (!total){
    html += '<div class="el-empty">该知识点暂无习题。</div>' +
      '<div class="el-nav"><button class="el-btn primary" onclick="elQuizDone()">去写笔记 →</button></div>';
    return html + '</div>';
  }

  var q = quiz.questions[EL_QUIZ_IDX];
  html += '<div class="el-quiz-question">' + elEscape(q.question || q.q || "") + '</div>';

  if (q.type === 'choice' && q.options && q.options.length){
    html += '<div class="el-quiz-options">';
    q.options.forEach(function(opt, i){
      var text = typeof opt === "string" ? opt : (opt.text || opt.label || "");
      html += '<button class="el-opt" onclick="elQuizAnswer(' + i + ')">' + elEscape(text) + '</button>';
    });
    html += '</div>';
  } else {
    html += '<div class="el-quiz-input"><input type="text" id="elQuizInput" placeholder="请输入答案" onkeydown="if(event.key===\'Enter\')elQuizAnswerText()"></div>' +
      '<button class="el-btn" onclick="elQuizAnswerText()">提交</button>';
  }

  html += '<div id="elQuizFeedback"></div>';
  html += '<div class="el-quiz-progress"><div class="el-quiz-bar" style="width:' + (EL_QUIZ_IDX / total * 100) + '%"></div></div>';
  html += '</div>';
  return html;
}

function elQuizAnswer(idx){
  var q = EL_CURRENT.quiz.questions[EL_QUIZ_IDX];
  var fb = document.getElementById("elQuizFeedback");
  if (!fb) return;

  if (q.answer === -1 || q.answer === undefined){
    // 暂无标准答案，不判分，只提示
    fb.innerHTML = '<div class="el-feedback ok">📝 已作答：' + elEscape(q.options[idx] || "") + '<br><small>本题暂无标准答案，请对照课本自查。</small></div>' +
      '<div class="el-nav"><button class="el-btn primary" onclick="elNextQuiz()">下一题 →</button></div>';
    return;
  }

  var correct = (idx === q.answer);
  if (correct) EL_QUIZ_SCORE++;

  if (correct){
    fb.innerHTML = '<div class="el-feedback ok">✅ 正确！' + (q.why ? '<div class="el-why">' + elEscape(q.why) + '</div>' : '') + '</div>';
  } else {
    fb.innerHTML = '<div class="el-feedback err">❌ 错误' + (q.why ? '<div class="el-why">' + elEscape(q.why) + '</div>' : '') + '</div>';
  }

  fb.innerHTML += '<div class="el-nav"><button class="el-btn primary" onclick="elNextQuiz()">下一题 →</button></div>';
}

function elQuizAnswerText(){
  var input = document.getElementById("elQuizInput");
  if (!input) return;
  var q = EL_CURRENT.quiz.questions[EL_QUIZ_IDX];
  var fb = document.getElementById("elQuizFeedback");
  if (!fb) return;

  var userAns = input.value.trim();
  var answers = q.answers || [];
  var hasAnswer = answers.length > 0 && !(answers.length === 1 && !answers[0].trim());

  if (!hasAnswer){
    // 暂无标准答案，只记录不判分
    fb.innerHTML = '<div class="el-feedback ok">📝 已记录答案：' + elEscape(userAns) + '<br><small>本题暂无标准答案，请对照课本自查。</small></div>' +
      '<div class="el-nav"><button class="el-btn primary" onclick="elNextQuiz()">下一题 →</button></div>';
    return;
  }

  // 有答案，进行比对（小写、去空格、允许多个正确答案）
  var normUser = userAns.toLowerCase().replace(/\s+/g, ' ').trim();
  var correct = answers.some(function(ans){
    return normUser === ans.toLowerCase().replace(/\s+/g, ' ').trim();
  });

  if (correct) EL_QUIZ_SCORE++;

  if (correct){
    fb.innerHTML = '<div class="el-feedback ok">✅ 正确！</div>';
  } else {
    fb.innerHTML = '<div class="el-feedback err">❌ 错误。参考答案：' + elEscape(answers.join(' / ')) + '</div>';
  }
  fb.innerHTML += '<div class="el-nav"><button class="el-btn primary" onclick="elNextQuiz()">下一题 →</button></div>';
}

function elNextQuiz(){
  var quiz = EL_CURRENT.quiz || { questions: [] };
  EL_QUIZ_IDX++;
  if (EL_QUIZ_IDX >= quiz.questions.length){
    elQuizDone();
  } else {
    elShowStep();
  }
}

function elQuizDone(){
  var state = elTopicState(EL_CURRENT.id);
  var quiz = EL_CURRENT.quiz || { questions: [] };
  var total = quiz.questions ? quiz.questions.length : 0;
  var correct = Math.max(state.quizScore, EL_QUIZ_SCORE);
  var wrong = total - correct;
  state.quizScore = correct;
  state.quizTotal = total;
  state.tryCount++;

  // 计算星级
  var pct = total > 0 ? correct / total : 0;
  var stars = 0;
  if (pct >= 0.9) stars = 3;
  else if (pct >= 0.7) stars = 2;
  else if (pct >= 0.5) stars = 1;
  if (stars > state.stars) state.stars = stars;

  elPushRecord("quiz", correct, total, correct, wrong);
  saveS();
  EL_STEP = 3;
  elShowStep();
}

/* ---------- 笔记页 ---------- */
function elRenderNotes(){
  var t = EL_CURRENT;
  var state = elTopicState(t.id);
  var today = new Date().toISOString().split('T')[0];

  var html = '<div class="el-notes">' +
    '<div class="el-step-bar"><span>讲解</span><span>→</span><span>例题</span><span>→</span><span>习题</span><span>→</span><span class="el-step on">笔记</span></div>' +
    '<h2>📓 学习笔记 · ' + today + '</h2>';

  // 自动记录
  html += '<div class="el-auto-note">' +
    '<h4>📋 自动记录</h4>' +
    '<p>知识点：<b>' + t.name + '</b></p>' +
    '<p>例题：' + (state.examplesScore || 0) + '/' + (state.examplesTotal || 0) + '</p>' +
    '<p>习题：' + (state.quizScore || 0) + '/' + (state.quizTotal || 0) + '</p>' +
    '<p>星级：' + elStars(state.stars) + '</p>' +
    '<p>状态：' + (state.mastered ? "⭐ 已掌握" : "📖 学习中") + '</p>' +
    '</div>';

  // 手写笔记
  html += '<div class="el-note-input">' +
    '<h4>✏️ 补充笔记</h4>' +
    '<textarea id="elNoteArea" placeholder="写下今天学到了什么，哪里还不懂...">' + elEscape(state.notes || "") + '</textarea>' +
    '</div>';

  // 日历勾选
  html += '<div class="el-note-calendar">' +
    '<h4>📅 今天打卡</h4>' +
    '<label class="el-checkin"><input type="checkbox" id="elCheckin" checked> ✅ 今天已学习 ' + t.name + '</label>' +
    '</div>';

  html += '<div class="el-nav">' +
    '<button class="el-btn primary" onclick="elSaveNotes()">保存笔记，完成学习 ✓</button>' +
    '<button class="el-btn" onclick="elCloseMask()">稍后补充</button>' +
    '</div>';

  html += '</div>';
  return html;
}

function elSaveNotes(){
  var t = EL_CURRENT;
  var state = elTopicState(t.id);
  var area = document.getElementById("elNoteArea");
  var notes = "";
  if (area){
    notes = area.value;
    state.notes = notes;
  }

  elCheckMastered(state);
  // 记录完整学习（含笔记）
  var total = state.quizTotal || 0;
  var correct = state.quizScore || 0;
  elPushRecord("full", correct, total, correct, total - correct, notes);
  saveS();
  elCloseMask();
  elRenderTopics();
}

/* ---------- 学习记录列表 ---------- */
var EL_RECORDS_FILTER = ""; // 当前筛选关键词

function elToggleRecords(){
  var panel = document.getElementById("elRecordsPanel");
  if (!panel) return;
  var show = panel.style.display !== "block";
  panel.style.display = show ? "block" : "none";
  if (show) elRenderRecords();
}

function elRenderRecords(){
  var panel = document.getElementById("elRecordsPanel");
  if (!panel) return;
  var st = elState();
  var records = st.records || [];

  var html = '<div class="el-rec-header">' +
    '<b>📋 学习记录</b>' +
    '<span class="el-rec-count">' + records.length + ' 条</span>' +
    '<button class="el-rec-close" onclick="elToggleRecords()">✕</button>' +
    '</div>';

  html += '<div class="el-rec-filter">' +
    '<input type="text" id="elRecFilter" placeholder="筛选知识点或日期…" value="' + elEscape(EL_RECORDS_FILTER) + '" oninput="elFilterRecords(this.value)">' +
    '</div>';

  // 统计
  var today = new Date().toISOString().split('T')[0];
  var todayRecs = records.filter(function(r){ return r.date === today; });
  var todayDuration = todayRecs.reduce(function(s, r){ return s + (r.duration || 0); }, 0);
  var todayTopics = [...new Set(todayRecs.map(function(r){ return r.topicId; }))];
  html += '<div class="el-rec-stats">' +
    '🔥 连续 ' + (st.streak.current || 0) + ' 天（最高 ' + (st.streak.best || 0) + '）｜' +
    '今日 ' + todayDuration + ' 分钟 · ' + todayTopics.length + ' 个知识点' +
    '</div>';

  html += '<div class="el-rec-list">';
  if (!records.length){
    html += '<div class="el-rec-empty">暂无学习记录。完成一个知识点（讲解→例题→习题→笔记）后，这里会自动出现记录。</div>';
  } else {
    var filter = EL_RECORDS_FILTER.toLowerCase();
    var shown = 0;
    records.forEach(function(rec, idx){
      if (filter && !((rec.topicName || "").toLowerCase().indexOf(filter) > -1 || (rec.date || "").indexOf(filter) > -1)) return;
      shown++;

      var actionText = { lesson: "📖 讲解", example: "✏️ 例题", quiz: "📝 习题", full: "✅ 完成" };
      var actionCls = { lesson: "lesson", example: "example", quiz: "quiz", full: "full" };
      var act = actionText[rec.action] || "📚 学习";
      var actCls = actionCls[rec.action] || "";

      var pct = rec.total > 0 ? Math.round(rec.correct / rec.total * 100) : 0;
      var pctBar = rec.total > 0 ? '<div class="el-rec-pct"><div style="width:' + pct + '%" class="el-rec-bar ' + (pct >= 80 ? 'ok' : (pct >= 60 ? 'mid' : 'low')) + '"></div></div>' : '';
      var pctText = rec.total > 0 ? '<span class="el-rec-pct-text">' + rec.correct + '/' + rec.total + ' (' + pct + '%)</span>' : '';

      var wrongHint = rec.wrong > 0 ? '<span class="el-rec-wrong">❌ ' + rec.wrong + ' 错</span>' : '';
      var masterHint = rec.mastered ? '<span class="el-rec-master">⭐ 已掌握</span>' : '';

      html += '<div class="el-rec-item">' +
        '<div class="el-rec-top">' +
          '<span class="el-rec-date">' + rec.date + ' ' + rec.time + '</span>' +
          '<span class="el-rec-action ' + actCls + '">' + act + '</span>' +
        '</div>' +
        '<div class="el-rec-title">' + elEscape(rec.topicName || rec.topicId) + '</div>' +
        '<div class="el-rec-meta">' +
          '<span>⏱ ' + (rec.duration || 0) + ' 分钟</span>' +
          pctText +
          wrongHint +
          masterHint +
        '</div>' +
        pctBar +
        (rec.notes ? '<div class="el-rec-notes">📝 ' + elEscape(rec.notes.substring(0, 80)) + (rec.notes.length > 80 ? '…' : '') + '</div>' : '') +
      '</div>';
    });
    if (!shown){
      html += '<div class="el-rec-empty">没有匹配「' + elEscape(filter) + '」的记录</div>';
    }
  }
  html += '</div>';

  html += '<div class="el-rec-footer">' +
    '<button class="el-btn sm" onclick="if(confirm(\'确定清空所有学习记录？不可恢复！\')){S.enLearn.records=[];saveS();elRenderRecords();}">🗑 清空记录</button>' +
    '</div>';

  panel.innerHTML = html;
}

function elFilterRecords(val){
  EL_RECORDS_FILTER = val || "";
  elRenderRecords();
}

/* ---------- 工具 ---------- */
function elMask(){
  var m = document.getElementById("elMask");
  if (!m){
    m = document.createElement("div");
    m.id = "elMask";
    m.className = "eq-mask el-mask";
    m.innerHTML = '<div class="el-card" id="elCard"></div>' +
      '<button class="el-close" type="button" aria-label="关闭" onclick="elCloseMask()">✕</button>';
    document.body.appendChild(m);
  }
  return m;
}

function elCloseMask(){
  try {
    var m = document.getElementById("elMask");
    if (m) m.classList.remove("open");
    document.body.style.overflow = "";
  } catch(e){}
}

function elEscape(s){
  if (!s) return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>").replace(/  /g, " &nbsp;");
}

/* ---------- 初始化 ---------- */
function elInit(){
  elRenderStages();
  elRenderTopics();
}
