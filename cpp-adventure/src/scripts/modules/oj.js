/* ---------------- 实战特训 oj.js：真题训练 + 半年航线 + 作战手册 ---------------- */
/* 独立于现有闯关模块，状态存 localStorage（cppsOjV1），全部新增逻辑，不改动其他模块 */

var OJ_ACTIVE_ID = null;
var OJ_TAB = 0;
/* 训练模式状态：mode=train 答题闯关 / learn 直接看解析；qi 当前测验题；correct 答对数 */
var OJ_TRAIN = {mode:"train", id:null, qi:0, correct:0, answered:false};

function ojStars(n){
  return "★".repeat(n) + "☆".repeat(4 - n);
}

function ojState(){ return ojLoad(); }
function ojSaveState(){ ojSave(ojState()); }
function ojIsMastered(id){ return !!ojState().mastered[id]; }
function ojIndexById(id){
  var all = ojAll();
  for (var i = 0; i < all.length; i++){ if (all[i].id === id) return i; }
  return -1;
}
function ojNo(id){ return ojIndexById(id) + 1; }

function ojToggleMaster(id){
  var st = ojState();
  if (st.mastered[id]) delete st.mastered[id];
  else st.mastered[id] = true;
  ojSave(st);
  ojRenderList();
  ojRenderDetail(id);
  ojRenderStats();
}

function ojRenderStats(){
  var st = ojState();
  var done = Object.keys(st.mastered).length;
  var el = document.getElementById("ojStatMastered");
  if (el) el.textContent = done + " / " + ojAll().length;
  var tot = document.getElementById("ojStatTotal");
  if (tot) tot.textContent = ojAll().length;
  var cus = document.getElementById("ojStatCustom");
  if (cus) cus.textContent = ojCustomLoad().length;
}

/* ---------- 真题列表（按题型分组） ---------- */
function ojRenderList(){
  var box = document.getElementById("ojList");
  if (!box) return;
  var st = ojState();
  var all = ojAll();
  var html = "";
  OJ_CATS.forEach(function(cat){
    var items = all.filter(function(t){ return t.cat === cat; });
    if (items.length === 0) return;
    html += '<div class="oj-group">' +
      '<div class="oj-group-title">📂 ' + cat + '<span class="oj-cnt">' + items.length + ' 题</span></div>' +
      '<div class="oj-list">';
    items.forEach(function(t){
      var mastered = !!st.mastered[t.id];
      html += '<button class="oj-item' + (mastered ? " mastered" : "") +
        '" type="button" onclick="ojOpen(' + t.id + ')" aria-label="第 ' + ojNo(t.id) + ' 题 ' + t.title + '">' +
        '<span class="oj-no">' + ojNo(t.id) + '</span>' +
        '<span class="oj-item-info">' +
          '<span class="oj-item-title">' + t.title + '</span>' +
          '<span class="oj-item-meta"><span class="oj-stars">' + ojStars(t.stars) + '</span>' +
          '<span>目标 ' + t.band + ' 分</span></span>' +
        '</span>' +
        '<span class="oj-master-mark">' + (mastered ? "✅ 已掌握" : "未掌握") + '</span>' +
      '</button>';
    });
    html += '</div></div>';
  });
  box.innerHTML = html;
}

/* ---------- 题目详情 ---------- */
function ojFind(id){
  var all = ojAll();
  for (var i = 0; i < all.length; i++){ if (all[i].id === id) return all[i]; }
  return null;
}
function ojOpen(id){
  OJ_ACTIVE_ID = id;
  var t = ojFind(id);
  if (OJ_TRAIN.mode === "train" && t && t.quiz && t.quiz.length){
    ojStartTrain(id);
  } else {
    ojRenderDetail(id);
  }
  try { document.getElementById("ojDetail").scrollIntoView({behavior:"smooth", block:"nearest"}); } catch(e){}
}

/* ---------- 训练/学习模式切换 ---------- */
function ojSetMode(m){
  OJ_TRAIN.mode = m;
  var b1 = document.getElementById("ojModeTrain");
  var b2 = document.getElementById("ojModeLearn");
  if (b1) b1.classList.toggle("active", m === "train");
  if (b2) b2.classList.toggle("active", m === "learn");
  if (OJ_ACTIVE_ID !== null) ojOpen(OJ_ACTIVE_ID);
}

/* ---------- 训练模式：答题闯关 ---------- */
function ojStartTrain(id){
  OJ_TRAIN.id = id; OJ_TRAIN.qi = 0; OJ_TRAIN.correct = 0; OJ_TRAIN.answered = false;
  ojRenderTrain();
}
function ojRenderTrain(){
  var box = document.getElementById("ojDetail");
  if (!box) return;
  var t = ojFind(OJ_TRAIN.id);
  if (!t){ ojRenderDetail(OJ_TRAIN.id); return; }
  var quiz = t.quiz || [];
  if (OJ_TRAIN.qi >= quiz.length){ ojFinishTrain(); return; }
  var q = quiz[OJ_TRAIN.qi];
  var total = quiz.length;
  var pct = Math.round(OJ_TRAIN.qi / total * 100);
  var html =
    '<div class="oj-card oj-train">' +
      '<div class="oj-card-head">' +
        '<h3>⚔️ 训练模式 · 第 ' + ojNo(t.id) + ' 题 ' + t.title + '</h3>' +
        '<span class="oj-tag">考点闯关 ' + (OJ_TRAIN.qi + 1) + ' / ' + total + '</span>' +
        '<span class="oj-tag band">已答对 ' + OJ_TRAIN.correct + '</span>' +
      '</div>' +
      '<div class="oj-progress"><div class="oj-progress-bar" style="width:' + pct + '%"></div></div>' +
      '<div class="oj-train-q">' + ojEsc(q.q) + '</div>' +
      '<div class="oj-opts" id="ojOpts">' +
        q.opts.map(function(o, i){
          return '<button class="oj-opt" type="button" onclick="ojAnswerTrain(' + i + ')" id="ojOpt' + i + '">' +
            '<span class="oj-opt-key">' + String.fromCharCode(65 + i) + '</span>' +
            '<span class="oj-opt-text">' + ojEsc(o) + '</span></button>';
        }).join("") +
      '</div>' +
      '<div class="oj-fb" id="ojFb" style="display:none"></div>' +
      '<div class="oj-train-foot" id="ojTrainFoot">' +
        '<button class="oj-btn ghost" type="button" onclick="ojSetMode(\'learn\')">📖 直接看解析</button>' +
      '</div>' +
    '</div>';
  box.innerHTML = html;
}
function ojAnswerTrain(i){
  if (OJ_TRAIN.answered) return;
  OJ_TRAIN.answered = true;
  var t = ojFind(OJ_TRAIN.id);
  var q = t.quiz[OJ_TRAIN.qi];
  var right = (i === q.ans);
  if (right) OJ_TRAIN.correct++;
  var optsBox = document.getElementById("ojOpts");
  if (!optsBox) return;
  var btns = optsBox.querySelectorAll ? optsBox.querySelectorAll(".oj-opt") : [];
  for (var k = 0; k < btns.length; k++){
    var b = btns[k];
    var idx = parseInt(b.id.replace("ojOpt",""), 10);
    b.classList.add("no-click");
    if (idx === q.ans) b.classList.add("right");
    else if (idx === i) b.classList.add("wrong");
  }
  var fb = document.getElementById("ojFb");
  if (fb){
    fb.style.display = "block";
    fb.className = "oj-fb " + (right ? "ok" : "err");
    fb.innerHTML = (right ? "✅ 答对了！" : "❌ 答错了，正确答案是 " + String.fromCharCode(65 + q.ans) + "。") +
      '<div class="oj-fb-why">' + ojEsc(q.why) + '</div>';
  }
  var foot = document.getElementById("ojTrainFoot");
  if (foot){
    var more = (OJ_TRAIN.qi + 1 < t.quiz.length);
    foot.innerHTML = '<button class="oj-btn primary" type="button" onclick="ojNextTrain()">' +
      (more ? "下一题 →" : "查看本关小结 🎉") + '</button>';
  }
}
function ojNextTrain(){
  OJ_TRAIN.qi++;
  OJ_TRAIN.answered = false;
  ojRenderTrain();
}
function ojFinishTrain(){
  var box = document.getElementById("ojDetail");
  if (!box) return;
  var t = ojFind(OJ_TRAIN.id);
  if (!t){ return; }
  var quiz = t.quiz || [];
  var total = quiz.length;
  var good = (OJ_TRAIN.correct >= Math.ceil(total / 2));
  /* 训练完成自动标记掌握 */
  if (good){
    var st = ojState();
    st.mastered[t.id] = true;
    ojSave(st);
    ojRenderList(); ojRenderStats();
  }
  var html =
    '<div class="oj-card oj-train">' +
      '<div class="oj-card-head"><h3>🎉 本关完成！</h3>' +
      '<span class="oj-tag">考点闯关 ' + OJ_TRAIN.correct + ' / ' + total + '</span></div>' +
      '<div class="oj-finish ' + (good ? "ok" : "warn") + '">' +
        (good ? "🎯 答对一半以上，这道题的核心思路你已经掌握了，已自动标记「已掌握」！" :
                "💪 再想想：这道题的关键还没吃透，建议看看下面的解析，然后点「重新训练」。") +
      '</div>' +
      '<div class="oj-sec-title">📋 题目</div>' +
      '<div class="oj-desc">' + ojEsc(t.desc) + '</div>' +
      '<div class="oj-sec-title">🎯 核心考点</div>' +
      '<div class="oj-points">' + (t.points || ["综合应用"]).map(function(p){ return '<span class="oj-point">' + ojEsc(p) + '</span>'; }).join("") + '</div>';
  if (t.code && t.code.length){
    html += '<div class="oj-sec-title">💻 参考代码（C++）</div>' +
      '<div class="oj-code-wrap">' +
        '<div class="oj-code-head"><span>main.cpp</span>' +
        '<button class="oj-copy-btn" type="button" onclick="ojCopyCode(' + t.id + ')">📋 复制代码</button></div>' +
        '<pre class="oj-code">' + ojEsc(t.code.join("\n")) + '</pre>' +
      '</div>';
  }
  if (t.explain){
    html += '<div class="oj-sec-title">📝 答案解析</div>' +
      '<div class="oj-explain">' + ojEsc(t.explain) + '</div>';
  }
  html += '<div class="oj-train-foot">' +
      '<button class="oj-btn primary" type="button" onclick="ojStartTrain(' + t.id + ')">🔄 重新训练</button>' +
      '<button class="oj-btn ghost" type="button" onclick="ojSetMode(\'learn\')">📖 看完整解析</button>' +
    '</div>' +
  '</div>';
  box.innerHTML = html;
}

function ojRenderDetail(id){
  var box = document.getElementById("ojDetail");
  if (!box) return;
  var t = null;
  for (var i = 0; i < ojAll().length; i++){ if (ojAll()[i].id === id){ t = ojAll()[i]; break; } }
  if (!t){ box.innerHTML = '<div class="oj-empty">请选择一道真题开始。</div>'; return; }
  var no = ojNo(id);
  var mastered = ojIsMastered(id);
  var points = (t.points && t.points.length) ? t.points : ["综合应用"];
  var codeArr = (t.code && t.code.length) ? t.code : [];
  var codeText = codeArr.join("\n");
  var html =
    '<div class="oj-card">' +
      '<div class="oj-card-head">' +
        '<h3>第 ' + no + ' 题 · ' + ojEsc(t.title) + '</h3>' +
        '<span class="oj-tag">' + ojEsc(t.cat) + '</span>' +
        '<span class="oj-tag"><span class="oj-stars">' + ojStars(t.stars) + '</span></span>' +
        '<span class="oj-tag band">目标 ' + t.band + ' 分</span>' +
      '</div>';
  /* 题目 */
  if (t.desc){
    html += '<div class="oj-sec-title">📋 题目</div>' +
      '<div class="oj-desc">' + ojEsc(t.desc) + '</div>';
  }
  if (t.io){
    html += '<div class="oj-io">' + ojEsc(t.io) + '</div>';
  }
  /* 考点 */
  html += '<div class="oj-sec-title">🎯 核心考点</div>' +
    '<div class="oj-points">' + points.map(function(p){ return '<span class="oj-point">' + ojEsc(p) + '</span>'; }).join("") + '</div>';
  /* 代码（有才显示） */
  if (codeArr.length){
    html += '<div class="oj-sec-title">💻 参考代码（C++）</div>' +
      '<div class="oj-code-wrap">' +
        '<div class="oj-code-head"><span>main.cpp · ' + points.map(ojEsc).join(" / ") + '</span>' +
        '<button class="oj-copy-btn" type="button" onclick="ojCopyCode(' + t.id + ')">📋 复制代码</button></div>' +
        '<pre class="oj-code" id="ojCode' + t.id + '">' + ojEsc(codeText) + '</pre>' +
      '</div>';
  }
  /* 解析（有才显示） */
  if (t.explain){
    html += '<div class="oj-sec-title">📝 答案解析</div>' +
      '<div class="oj-explain">' + ojEsc(t.explain) + '</div>';
  }
  /* 变形训练（有才显示） */
  if (t.variant){
    html += '<div class="oj-sec-title">🔄 变形训练</div>' +
      '<div class="oj-variant">' + ojEsc(t.variant) + '</div>';
  }
  html += '<div class="oj-actions">' +
      '<button class="oj-btn ' + (mastered ? "done" : "primary") + '" type="button" onclick="ojToggleMaster(' + t.id + ')">' +
        (mastered ? "✅ 已掌握（点击取消）" : "🎯 标记已掌握") + '</button>' +
      '<button class="oj-btn ghost" type="button" onclick="ojPrevNext(' + t.id + ',-1)">◀ 上一题</button>' +
      '<button class="oj-btn ghost" type="button" onclick="ojPrevNext(' + t.id + ',1)">下一题 ▶</button>' +
    '</div>' +
  '</div>';
  box.innerHTML = html;
}

function ojPrevNext(id, dir){
  var all = ojAll();
  var idx = -1;
  for (var i = 0; i < all.length; i++){ if (all[i].id === id){ idx = i; break; } }
  var next = idx + dir;
  if (next < 0) next = all.length - 1;
  if (next >= all.length) next = 0;
  ojOpen(all[next].id);
}

function ojCopyCode(id){
  var t = null;
  for (var i = 0; i < ojAll().length; i++){ if (ojAll()[i].id === id){ t = ojAll()[i]; break; } }
  if (!t) return;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(t.code.join("\n")).then(function(){
        ojToast("代码已复制，去 Dev-C++ 里自己敲一遍吧！");
      }, function(){ ojCopyFallback(t.code.join("\n")); });
    } else {
      ojCopyFallback(t.code.join("\n"));
    }
  } catch(e){ ojCopyFallback(t.code.join("\n")); }
}
function ojCopyFallback(text){
  try {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    ojToast("代码已复制，去 Dev-C++ 里自己敲一遍吧！");
  } catch(e){
    ojToast("复制失败，请手动选中代码复制。");
  }
}
var __ojToastTimer = null;
function ojToast(msg){
  var t = document.getElementById("ojToast");
  if (!t){
    t = document.createElement("div");
    t.id = "ojToast";
    t.style.cssText = "position:fixed;left:50%;bottom:32px;transform:translateX(-50%);background:#0B1B3B;color:#fff;padding:10px 20px;border-radius:999px;font-size:14px;font-weight:700;z-index:200000;box-shadow:0 8px 24px rgba(0,0,0,.3);transition:opacity .3s;";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = "1";
  clearTimeout(__ojToastTimer);
  __ojToastTimer = setTimeout(function(){ t.style.opacity = "0"; }, 2400);
}
function ojEsc(s){
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

/* ---------- 半年航线：按周任务清单（可勾选 + 进度条） ---------- */
function ojTaskKey(phase, w){ return phase + "_" + w; }
function ojRenderTasks(){
  var box = document.getElementById("ojPlanList");
  if (!box) return;
  var st = ojState();
  if (!st.tasks) st.tasks = {};
  var html = "";
  var phaseDoneCount = 0;
  OJ_TASKS.forEach(function(ph){
    var tasks = ph.tasks;
    var doneN = 0;
    tasks.forEach(function(tk){ if (st.tasks[ojTaskKey(ph.phase, tk.w)]) doneN++; });
    var total = tasks.length;
    var allDone = (doneN === total);
    if (allDone) phaseDoneCount++;
    var pct = Math.round(doneN / total * 100);
    html +=
      '<div class="oj-plan' + (allDone ? " done" : "") + '">' +
        '<div class="oj-plan-no">' + ph.phase + '</div>' +
        '<div class="oj-plan-body">' +
          '<h4>' + ph.title + '</h4>' +
          '<span class="oj-plan-span">' + ph.span + ' · 达标：' + ph.goal + '</span>' +
          '<div class="oj-progress"><div class="oj-progress-bar" style="width:' + pct + '%"></div>' +
          '<span class="oj-progress-txt">' + doneN + ' / ' + total + ' 周任务</span></div>' +
          '<div class="oj-task-list">';
    tasks.forEach(function(tk){
      var key = ojTaskKey(ph.phase, tk.w);
      var done = !!st.tasks[key];
      html +=
        '<div class="oj-task' + (done ? " done" : "") + '">' +
          '<button class="oj-task-tick" type="button" onclick="ojToggleTask(' + ph.phase + ',\'' + tk.w + '\')" aria-label="' + tk.w + ' 完成状态">' +
            (done ? "✅" : "⬜") + '</button>' +
          '<div class="oj-task-body">' +
            '<div class="oj-task-title">' + tk.w + ' · ' + tk.name + '</div>' +
            '<div class="oj-task-do">📖 ' + tk.do + '</div>' +
            '<div class="oj-task-check">🎯 过关：' + tk.check + '</div>';
      if (tk.link){
        html += '<button class="oj-btn oj-btn-s oj-task-link" type="button" onclick="ojOpen(' + tk.link + ')">⚔️ 去练这道真题 →</button>';
      }
      html += '</div></div>';
    });
    html += '</div></div></div>';
  });
  box.innerHTML = html;
  var cnt = document.getElementById("ojStatPlan");
  if (cnt) cnt.textContent = phaseDoneCount + " / " + OJ_TASKS.length + " 阶段达标";
}

function ojToggleTask(phase, w){
  var st = ojState();
  if (!st.tasks) st.tasks = {};
  var key = ojTaskKey(phase, w);
  if (st.tasks[key]) delete st.tasks[key];
  else st.tasks[key] = true;
  ojSave(st);
  ojRenderTasks();
}

/* ---------- 作战手册：情景策略闯关 ---------- */
var OJ_STRAT = {idx:0, correct:0, answered:false};
function ojRenderStrategy(){
  var box = document.getElementById("ojStrategy");
  if (!box) return;
  if (OJ_STRAT.idx >= OJ_STRATEGY.length){ ojFinishStrategy(); return; }
  var q = OJ_STRATEGY[OJ_STRAT.idx];
  var total = OJ_STRATEGY.length;
  var html =
    '<div class="oj-card oj-train">' +
      '<div class="oj-card-head">' +
        '<h3>🧭 策略闯关</h3>' +
        '<span class="oj-tag">情景题 ' + (OJ_STRAT.idx + 1) + ' / ' + total + '</span>' +
        '<span class="oj-tag band">答对 ' + OJ_STRAT.correct + '</span>' +
      '</div>' +
      '<div class="oj-progress"><div class="oj-progress-bar" style="width:' + Math.round(OJ_STRAT.idx / total * 100) + '%"></div></div>' +
      '<div class="oj-train-q">' + ojEsc(q.q) + '</div>' +
      '<div class="oj-opts" id="ojSOpts">' +
        q.opts.map(function(o, i){
          return '<button class="oj-opt" type="button" onclick="ojAnswerStrategy(' + i + ')" id="ojSOpt' + i + '">' +
            '<span class="oj-opt-key">' + String.fromCharCode(65 + i) + '</span>' +
            '<span class="oj-opt-text">' + ojEsc(o) + '</span></button>';
        }).join("") +
      '</div>' +
      '<div class="oj-fb" id="ojSFb" style="display:none"></div>' +
      '<div class="oj-train-foot" id="ojSFoot"></div>' +
    '</div>';
  box.innerHTML = html;
}
function ojAnswerStrategy(i){
  if (OJ_STRAT.answered) return;
  OJ_STRAT.answered = true;
  var q = OJ_STRATEGY[OJ_STRAT.idx];
  var right = (i === q.ans);
  if (right) OJ_STRAT.correct++;
  var box = document.getElementById("ojSOpts");
  if (!box) return;
  var btns = box.querySelectorAll ? box.querySelectorAll(".oj-opt") : [];
  for (var k = 0; k < btns.length; k++){
    var b = btns[k];
    var idx = parseInt(b.id.replace("ojSOpt",""), 10);
    b.classList.add("no-click");
    if (idx === q.ans) b.classList.add("right");
    else if (idx === i) b.classList.add("wrong");
  }
  var fb = document.getElementById("ojSFb");
  if (fb){
    fb.style.display = "block";
    fb.className = "oj-fb " + (right ? "ok" : "err");
    fb.innerHTML = (right ? "✅ 有战术头脑！" : "❌ 注意，正确的是 " + String.fromCharCode(65 + q.ans) + "。") +
      '<div class="oj-fb-why">' + ojEsc(q.why) + '</div>';
  }
  var foot = document.getElementById("ojSFoot");
  if (foot){
    var more = (OJ_STRAT.idx + 1 < OJ_STRATEGY.length);
    foot.innerHTML = '<button class="oj-btn primary" type="button" onclick="ojNextStrategy()">' +
      (more ? "下一题 →" : "查看战术等级 🏆") + '</button>';
  }
}
function ojNextStrategy(){
  OJ_STRAT.idx++;
  OJ_STRAT.answered = false;
  ojRenderStrategy();
}
function ojFinishStrategy(){
  var box = document.getElementById("ojStrategy");
  if (!box) return;
  var c = OJ_STRAT.correct, total = OJ_STRATEGY.length;
  var rank, cls;
  if (c === total){ rank = "🏆 战术大师"; cls = "ok"; }
  else if (c >= total - 1){ rank = "🎖️ 优秀指挥官"; cls = "ok"; }
  else if (c >= Math.ceil(total / 2)){ rank = "✅ 合格指挥官"; cls = "ok"; }
  else { rank = "💪 新兵训练中"; cls = "warn"; }
  box.innerHTML =
    '<div class="oj-card oj-train">' +
      '<div class="oj-card-head"><h3>🧭 策略闯关完成</h3>' +
      '<span class="oj-tag">答对 ' + c + ' / ' + total + '</span></div>' +
      '<div class="oj-finish ' + cls + '">你的战术等级：<b>' + rank + '</b></div>' +
      '<div class="oj-sec-title">📖 考场速查手册</div>' +
      '<div class="oj-hb-grid">' + ojHandbookHtml() + '</div>' +
      '<div class="oj-train-foot">' +
        '<button class="oj-btn primary" type="button" onclick="OJ_STRAT.idx=0;OJ_STRAT.correct=0;OJ_STRAT.answered=false;ojRenderStrategy()">🔄 重新闯关</button>' +
      '</div>' +
    '</div>';
}
function ojHandbookHtml(){
  var html = "";
  OJ_HANDBOOK.forEach(function(h){
    html += '<div class="oj-hb-card"><h4>' + h.icon + ' ' + h.title + '</h4><ul>' +
      h.items.map(function(it){ return '<li>' + it + '</li>'; }).join("") +
      '</ul></div>';
  });
  return html;
}

/* ---------- 作战手册：速查卡（保留） ---------- */
function ojRenderHandbook(){
  var box = document.getElementById("ojHandbook");
  if (!box) return;
  box.innerHTML = ojHandbookHtml();
}

/* ---------- 加题：文本解析 ---------- */
var OJ_MARKS = [
  {key:"desc", re:/^\s*(题目|问题|描述)\s*[:：]/},
  {key:"io", re:/^\s*(输入|输出|输入输出)\s*[:：]/},
  {key:"points", re:/^\s*(核心考点|考点)\s*[:：]/},
  {key:"code", re:/^\s*(参考代码|代码|程序)\s*[:：]/},
  {key:"code", re:/^```(cpp|c\+\+|cc)?\s*$/i},
  {key:"explain", re:/^\s*(参考解析|解析|思路)\s*[:：]/},
  {key:"variant", re:/^\s*(变形训练|变形|拓展|举一反三)\s*[:：]/}
];
function ojGuessCat(s){
  var rules = [
    ["图论", /(bfs|dfs|迷宫|最短路|连通块|图论|岛屿|染色|房间|矩阵)/i],
    ["动态规划", /(背包|动态规划|\bdp\b|状态转移|最优子结构)/i],
    ["数论", /(素数|质数|埃氏筛|辗转相除|\bgcd\b|\blcm\b|公约数|公倍数|数论|分解质因数)/i],
    ["基础数据结构", /(栈|队列|约瑟夫|括号|链表|哈希|堆)/i],
    ["基础算法", /(排序|二分|查找|枚举|贪心|递归|模拟)/i]
  ];
  for (var i = 0; i < rules.length; i++){
    if (rules[i][1].test(s)) return rules[i][0];
  }
  return "基础语法与模拟";
}
function ojParseText(text){
  if (!text || !text.trim()) return null;
  var t = text.replace(/\r\n/g, "\n").trim();
  var out = {title:"", desc:"", io:"", points:[], code:[], explain:"", variant:"", cat:"基础语法与模拟", stars:1};
  /* 标题：第 N 题：标题 / 题号标题 */
  var mt = t.match(/第\s*\d+\s*题\s*[:：]?\s*([^\n]+)/);
  if (mt) out.title = mt[1].trim().replace(/^[#*\s]+/, "");
  /* 难度：文本中的 ★ 数量 */
  var starsM = t.match(/★+/g);
  if (starsM && starsM.length){
    out.stars = Math.min(4, Math.max(1, starsM[0].length));
  }
  /* 分段收集：标记行切换段落，并把标记符号之后的内容计入本段 */
  var sections = {};
  var cur = null;
  t.split("\n").forEach(function(line){
    var mHit = null, rest = null;
    for (var i = 0; i < OJ_MARKS.length; i++){
      var m2 = line.match(OJ_MARKS[i].re);
      if (m2){ mHit = OJ_MARKS[i].key; rest = line.slice(m2[0].length); break; }
    }
    if (mHit){
      cur = mHit;
      if (!sections[cur]) sections[cur] = [];
      /* io 段保留「输入：/输出：」前缀，其余段只取标记后的内容 */
      var content = (mHit === "io") ? line.trim() : (rest ? rest.trim() : "");
      if (content) sections[cur].push(content);
    } else if (cur){
      sections[cur].push(line);
    }
  });
  function seg(key){
    var arr = (sections[key] || []).slice();
    while (arr.length && !arr[0].trim()) arr.shift();
    while (arr.length && !arr[arr.length - 1].trim()) arr.pop();
    return arr;
  }
  var descLines = seg("desc");
  if (descLines.length) out.desc = descLines.join("\n").trim();
  var ioLines = seg("io");
  if (ioLines.length) out.io = ioLines.join("\n").trim();
  var pointLines = seg("points");
  if (pointLines.length){
    out.points = pointLines.join("、").split(/[、,，;；\n]/).map(function(s){ return s.trim(); }).filter(Boolean);
  }
  var codeLines = seg("code").filter(function(l){ return !/^```/.test(l.trim()); });
  while (codeLines.length && !codeLines[0].trim()) codeLines.shift();
  while (codeLines.length && !codeLines[codeLines.length - 1].trim()) codeLines.pop();
  out.code = codeLines;
  var exLines = seg("explain");
  if (exLines.length) out.explain = exLines.join("\n").trim();
  var vaLines = seg("variant");
  if (vaLines.length) out.variant = vaLines.join("\n").trim();
  /* 无任何标记 → 整段当题目 */
  if (!out.desc && !out.code.length && !out.explain){
    out.desc = t.replace(/^#+\s*/, "");
  }
  /* 题型自动推断 */
  out.cat = ojGuessCat(out.title + " " + out.desc + " " + out.points.join(" "));
  /* 标题兜底 */
  if (!out.title){
    var first = (out.desc || t).split("\n")[0].trim().replace(/^#+\s*/, "");
    out.title = (first || "未命名题目").slice(0, 30);
  }
  return out;
}

/* ---------- 加题：两步保存（题目框 + 答案解析框） ---------- */
function ojClearAdd(){
  var t1 = document.getElementById("ojAddTitle");
  if (t1) t1.value = "";
  var t2 = document.getElementById("ojAddAnswer");
  if (t2) t2.value = "";
}
function ojSaveCustom(){
  var t1 = document.getElementById("ojAddTitle");
  var t2 = document.getElementById("ojAddAnswer");
  var titleText = (t1 ? t1.value : "").trim();
  var ansText = (t2 ? t2.value : "").trim();
  if (!titleText){ ojToast("先把题目粘到上面那个框里"); return; }
  if (!ansText){ ojToast("再把答案解析粘到下面那个框里"); return; }
  /* 答案解析框智能拆分：有代码就提出来，其余当解析文字 */
  var codeArr = [];
  var explain = ansText;
  var fences = ansText.match(/```(?:cpp|c\+\+|cc)?\s*\n?([\s\S]*?)```/i);
  if (fences){
    codeArr = fences[1].replace(/\r/g, "").split("\n");
    while (codeArr.length && !codeArr[0].trim()) codeArr.shift();
    while (codeArr.length && !codeArr[codeArr.length - 1].trim()) codeArr.pop();
    explain = ansText.replace(/```(?:cpp|c\+\+|cc)?\s*\n?[\s\S]*?```/gi, "").trim();
  } else {
    /* 支持「参考代码：」标记方式 */
    var parsed = ojParseText(ansText);
    if (parsed && parsed.code.length){
      codeArr = parsed.code;
      explain = (parsed.explain || parsed.desc || ansText).trim();
    }
  }
  var item = {
    id: ojNextId(),
    title: titleText.split("\n")[0].slice(0, 30),
    cat: ojGuessCat(titleText + " " + explain),
    stars: 1,
    band: ojBandFor(1),
    desc: titleText,
    io: "",
    points: ["综合应用"],
    code: codeArr,
    explain: explain,
    variant: ""
  };
  var list = ojCustomLoad();
  list.push(item);
  ojCustomSave(list);
  ojClearAdd();
  ojRenderList(); ojRenderCustom(); ojRenderStats(); ojRenderDetail(item.id);
  ojToast("✅ 已保存为第 " + ojNo(item.id) + " 题，题目和解析都在「真题训练」里");
}
function ojDeleteCustom(id){
  if (!confirm("确定删除这道自定义题吗？")) return;
  var list = ojCustomLoad().filter(function(t){ return t.id !== id; });
  ojCustomSave(list);
  var st = ojState();
  if (st.mastered[id]) delete st.mastered[id];
  ojSave(st);
  ojRenderList(); ojRenderCustom(); ojRenderStats();
  if (OJ_ACTIVE_ID === id){
    var all = ojAll();
    if (all.length) ojOpen(all[0].id);
  }
  ojToast("已删除");
}
function ojRenderCustom(){
  var box = document.getElementById("ojCustomList");
  if (!box) return;
  var list = ojCustomLoad();
  if (!list.length){
    box.innerHTML = '<div class="oj-empty">还没有自定义题：上面粘题目、下面粘答案解析，点「保存这道题」就行。</div>';
    return;
  }
  var html = "";
  list.forEach(function(t){
    html += '<div class="oj-custom-item">' +
      '<span class="oj-custom-no">' + ojNo(t.id) + '</span>' +
      '<span class="oj-custom-title">' + ojEsc(t.title) + ' <span class="oj-stars">' + ojStars(t.stars) + '</span></span>' +
      '<span class="oj-custom-cat">' + ojEsc(t.cat) + '</span>' +
      '<button class="oj-btn ghost oj-btn-s" type="button" onclick="ojOpen(' + t.id + ')">查看</button>' +
      '<button class="oj-btn danger oj-btn-s" type="button" onclick="ojDeleteCustom(' + t.id + ')">删除</button>' +
    '</div>';
  });
  box.innerHTML = html;
}

/* ---------- Tab 切换 ---------- */
function ojSwitchTab(i){
  OJ_TAB = i;
  for (var k = 0; k < 4; k++){
    var tab = document.querySelectorAll(".oj-tab")[k];
    var panel = document.getElementById("ojPanel" + k);
    if (tab) tab.classList.toggle("active", k === i);
    if (panel) panel.classList.toggle("active", k === i);
  }
  if (i === 1) ojRenderTasks();
  if (i === 2){ ojRenderStrategy(); ojRenderHandbook(); }
  if (i === 3) ojRenderCustom();
}

/* ---------- 初始化 ---------- */
function ojInit(){
  ojRenderList();
  ojRenderStats();
  ojRenderTasks();
  ojRenderHandbook();
  ojRenderCustom();
  if (OJ_ACTIVE_ID === null && ojAll().length > 0) ojOpen(ojAll()[0].id);
}
if (document.readyState === "loading"){
  window.addEventListener("DOMContentLoaded", ojInit);
} else {
  ojInit();
}
