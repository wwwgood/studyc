function drawHud(){
  document.getElementById("hudStars").textContent = String(starsOf());
  document.getElementById("hudLevel").textContent = String(lvOf(starsOf()));
  document.getElementById("totalCount").textContent = String(LEVELS.length);
}
function renderStage(s){
  var list = LEVELS.filter(function(l){ return l.st === s; });
  var g = document.getElementById("levelGrid"); g.innerHTML = "";
  list.forEach(function(lv, k){
    var unlocked = (k === 0) ? true : isPassed(list[k-1].id);
    var passed = isPassed(lv.id);
    var bt = document.createElement("button");
    bt.className = "level-node" + (unlocked ? (passed ? " passed" : " current") : " locked");
    bt.setAttribute("role", "listitem");
    bt.setAttribute("data-st", String(lv.st));
    bt.setAttribute("aria-label", (unlocked ? "" : "未解锁。") + "第" + lv.id + "关：" + lv.nm + (passed ? "（已过关）" : ""));
    if (unlocked) { bt.onclick = (function(lv){ return function() { openLevel(lv); }; })(lv); }
    else { bt.disabled = true; }
    bt.innerHTML = '<span class="no">' + (unlocked ? "第 " + lv.id + " 关" : "未解锁") + '</span>' +
      '<span class="ic">' + lv.zi + '</span>' +
      '<span class="nm">' + lv.nm + '</span>' +
      (passed ? '<span class="bd">已点亮</span>' : '<span class="bd">' + lv.bd + '</span>');
    g.appendChild(bt);
  });
  document.getElementById("mapStageTitle").textContent = STAGE_INFO[s].nm;
  document.getElementById("mapStageDesc").textContent = STAGE_INFO[s].ds;
  drawPath(s);
}
function drawPath(s){
  var svg = document.getElementById("pathSvg");
  var cards = document.querySelectorAll(".level-grid .level-node");
  var wrap = document.querySelector(".path-wrap");
  if (!cards.length || !wrap) return;
  var wr = wrap.getBoundingClientRect();
  var d = "";
  for (let i = 0; i < cards.length; i++){
    var r = cards[i].getBoundingClientRect();
    var x = r.left + r.width / 2 - wr.left;
    var y = r.top + r.height / 2 - wr.top;
    if (i > 0){ var pr = cards[i-1].getBoundingClientRect();
      d += "M" + (pr.left + pr.width/2 - wr.left) + " " + (pr.top + pr.height/2 - wr.top) + " L" + x + " " + y + " "; }
  }
  svg.setAttribute("viewBox", "0 0 " + Math.max(10, wr.width) + " " + Math.max(10, wr.height));
  svg.innerHTML = '<path d="' + d + '" stroke="#FFC94D" stroke-width="3" stroke-dasharray="7 6" fill="none" opacity="0.5"/>';
}
function openLevel(lv){
  document.getElementById("dlgNo").textContent = "第 " + lv.id + " 关 · " + (lv.st === 1 ? "语法星域" : (lv.st === 2 ? "算法星域" : "数据星域"));
  document.getElementById("dlgTitle").textContent = lv.zi + " " + lv.nm;
  document.getElementById("dlgGoal").textContent = "目标：" + lv.goal;
  var body = document.getElementById("dlgBody"); body.innerHTML = "";
  body.appendChild(blk("生活比喻讲解", expBlk(lv)));
  body.appendChild(blk("教材对应", '<div class="booktips"><div class="booktip"><b>《小学生C++ 趣味编程》</b><br>' + lv.b1 + '</div><div class="booktip"><b>《青少年C++ 编程入门》</b><br>' + lv.b2 + "</div></div>"));
  body.appendChild(blk("瞧瞧示例代码", codeBlk(lv)));
  body.appendChild(blk("把 Bug 任务", bugBlk(lv)));
  var qb = blk("过关联卡", null);
  var qd = document.createElement("div"); qd.className = "quiz";
  var qp = document.createElement("p"); qp.id = "quizProg"; qp.className = "quiz-prog"; qp.textContent = "已答对 0/" + lv.quiz.length; qd.appendChild(qp);
  lv.quiz.forEach(function(q, qi){ qd.appendChild(quizItem(lv, q, qi)); });
  qb.appendChild(qd); body.appendChild(qb);
  var row = document.createElement("div"); row.className = "finish-row";
  var pass = document.createElement("button");
  pass.className = "pass-btn"; pass.id = "passBtn"; pass.disabled = true;
  pass.textContent = "还差 " + lv.quiz.length + " 题答对就能过关";
  pass.onclick = (function(lv){ return function() { winLevel(lv); }; })(lv);
  row.appendChild(pass); body.appendChild(row);
  document.getElementById("levelDialog").classList.add("open");
  document.getElementById("backdrop").classList.add("open");
  document.body.style.overflow = "hidden";
}
function blk(t, html){ var div = document.createElement("div"); div.className = "block";
  var h = document.createElement("h4"); h.textContent = t; div.appendChild(h);
  if (html){
    if (typeof html === "string") { var n = document.createElement("div"); n.innerHTML = html; div.appendChild(n); }
    else { div.appendChild(html); }
  }
  return div; }
function expBlk(lv){
  var box = document.createElement("div"); box.className = "exp-box";
  var lines = lv.exp.split("\n");
  var curP = null;
  lines.forEach(function(line){
    if (!line.trim()) return;
    var t = line.trim();
    var isPoint = /^[①②③④⑤⑥⑦⑧⑨⑩]/.test(t) || /^[•●]/.test(t) || /^[✓✗]/.test(t);
    var isCode = false;
    if (!isPoint) {
      var codeMatch = /^(int\s|double\s|char\s|bool\s|string\s|for\s*\(|while\s*\(|if\s*\(|else\s|switch\s*\(|case\s|return\s|cout\s|cin\s|struct\s|stack\s|queue\s|s\.|q\.|a\.|fac\(|pos\s|\/\/)/.test(t);
      var hasCodeSym = /[;{}]/.test(t) && /\(|=|<<|>>/.test(t);
      isCode = codeMatch || hasCodeSym;
    }
    var isTip = /^(注意|口诀|记住|特别|最重要|记忆|考前|赛前|赛后|生活|关键)/.test(t);
    if (isPoint) {
      if (curP) { box.appendChild(curP); curP = null; }
      var pt = document.createElement("div"); pt.className = "exp-point"; pt.textContent = t;
      box.appendChild(pt);
    } else if (isCode) {
      if (curP) { box.appendChild(curP); curP = null; }
      var cd = document.createElement("div"); cd.className = "exp-code"; cd.textContent = t;
      box.appendChild(cd);
    } else if (isTip) {
      if (curP) { box.appendChild(curP); curP = null; }
      var tp = document.createElement("div"); tp.className = "exp-tip"; tp.textContent = t;
      box.appendChild(tp);
    } else {
      if (!curP) { curP = document.createElement("p"); }
      curP.textContent += t + " ";
    }
  });
  if (curP) { box.appendChild(curP); }
  return box;
}
function codeBlk(lv){
  var pre = document.createElement("pre"); pre.className = "code";
  var co = document.createElement("code"); co.textContent = lv.code.join("\n"); pre.appendChild(co);
  var out = document.createElement("div"); out.className = "run-out"; out.id = "runOut" + lv.id; out.textContent = "运行结果（演示）：\n" + lv.runOut; pre.appendChild(out);
  var bt = document.createElement("button"); bt.className = "run-btn"; bt.textContent = "运行看看";
  bt.onclick = (function(out){ return function() { out.classList.toggle("show"); }; })(out);
  pre.appendChild(bt);
  return pre; }
function bugBlk(lv){
  var d = document.createElement("div"); d.className = "bug-box";
  var pre = document.createElement("pre"); pre.className = "code"; pre.style.background = "#2B1212"; pre.style.color = "#FDD"; pre.style.margin = "0";
  pre.textContent = lv.bug; d.appendChild(pre);
  var f = document.createElement("p"); f.className = "bug-feedback"; f.id = "bugF" + lv.id; f.textContent = "哪一行不对劲？找好后点下面按钮。"; d.appendChild(f);
  var bt = document.createElement("button"); bt.className = "mode-btn"; bt.textContent = "我找到啦";
  bt.onclick = (function(f, lv){ return function() { f.textContent = "明白啦：" + lv.bugAns; f.style.color = "var(--green)"; }; })(f, lv);
  d.appendChild(bt); return d; }
function quizItem(lv, q, qi){
  var d = document.createElement("div"); d.className = "q";
  var t = document.createElement("p"); t.className = "qt"; t.textContent = (qi+1) + ". " + q.q; d.appendChild(t);
  var ops = document.createElement("div"); ops.className = "opts";
  var fb = document.createElement("span"); fb.className = "qfb"; d.appendChild(fb);
  q.o.forEach(function(op, oi){
    var b = document.createElement("button"); b.className = "opt"; b.textContent = op;
    b.onclick = (function(qi, oi, q, ops, d, fb){ return function() {
      if (d.dataset.done) return;
      if (q.a === oi){
        b.classList.add("ok"); d.dataset.done = "1";
        fb.textContent = "答对啦！"; fb.style.color = "var(--green)";
        checkQuiz(lv);
      } else {
        b.classList.add("no");
        fb.textContent = "不对哦，再想想！"; fb.style.color = "var(--red)";
        addError("quiz", {q: lv.nm + " 第" + (qi+1) + "题：" + q.q, ans: q.o[q.a], wrong: q.o[oi], lvId: lv.id, qi: qi});
        setTimeout(function(){ b.classList.remove("no"); }, 1000);
      }
    }; })(qi, oi, q, ops, d, fb);
    ops.appendChild(b);
  });
  d.appendChild(ops); return d; }
function checkQuiz(lv){
  var qs = document.querySelectorAll(".quiz .q");
  var done = 0;
  qs.forEach(function(q){ if (q.dataset.done) done++; });
  var bt = document.getElementById("passBtn");
  var prog = document.getElementById("quizProg");
  if (prog) prog.textContent = "已答对 " + done + "/" + qs.length;
  if (done === qs.length && qs.length > 0){ bt.disabled = false; bt.textContent = "全部答对！点亮这一关 ★"; }
  else { bt.disabled = true; bt.textContent = "还差 " + (qs.length - done) + " 题答对就能过关"; }
}
function winLevel(lv){
  S.passed[lv.id] = 1; saveS();
  fireConfetti();
  document.getElementById("levelDialog").classList.remove("open");
  document.getElementById("backdrop").classList.remove("open");
  document.body.style.overflow = "";
  drawAll();
  var n = LEVELS.length; var cur = curIdx();
  if (cur >= n){ showToast("你真厉害！点亮全部 " + n + " 关，荣获代码小指挥官终章 ★"); }
  else { showToast("🎉 过关！下一关：" + LEVELS[cur].nm + " 已经点亮了！"); }
}
function showToast(m){
  var t = document.createElement("div");
  t.style.cssText = "position:fixed;left:50%;top:18px;transform:translateX(-50%);background:#0B1B3B;color:#fff;padding:12px 22px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.35);z-index:200;max-width:90%;text-align:center;font-weight:700;border:2px solid #FFC94D";
  t.textContent = m; document.body.appendChild(t);
  setTimeout(function(){ t.style.opacity = "0"; t.style.transition = "opacity .6s"; }, 2600);
  setTimeout(function(){ t.remove(); }, 3300);
}
function closeLevel(){
  document.getElementById("levelDialog").classList.remove("open");
  document.getElementById("backdrop").classList.remove("open");
  document.body.style.overflow = "";
}
function resetAll(){
  if (confirm("真的要清空「" + (SDB.current || "当前指挥官") + "」的全部进度，从第 1 关重来吗？")){
    S.passed = {}; S.fp = {}; S.typing = 0; S.mathScore = 0; saveS(); drawAll(); updateTabs(); showToast("已重设，从第 1 关重新起 ★");
  }
}
function drawBadgeWall(){
  var g = document.getElementById("badgeGrid"); g.innerHTML = "";
  LEVELS.forEach(function(lv){
    var d = document.createElement("div"); d.className = "badge" + (isPassed(lv.id) ? "" : " locked");
    d.innerHTML = '<div class="ic">' + lv.zi + '</div><div class="na">' + lv.nm + '</div><div class="bd">' + (isPassed(lv.id) ? "已获得" : "未获得") + "</div>";
    g.appendChild(d);
  });
  var s = starsOf(); var n = LEVELS.length;
  document.getElementById("lvBig").textContent = String(lvOf(s));
  document.getElementById("lvBar").style.width = Math.round(s / n * 100) + "%";
  document.getElementById("lvTxt").textContent = "已点亮 " + s + "/" + n + " 关。" + (s >= n ? "终章达成 ★" : "还差 " + (n - s) + " 颗星；每 5 星升一等级。");
}
function drawAll(){ drawHud(); renderStage(currentStage()); drawBadgeWall(); }
function currentStage(){
  var el = document.querySelector(".stage-tab[aria-selected=\"true\"]");
  return el ? parseInt(el.dataset.s, 10) : 1;
}
function goMap(){ document.getElementById("map").scrollIntoView({behavior:"smooth"}); }

/* 过关撒花动画 */
function fireConfetti(){
  var box = document.getElementById("confetti");
  if (!box) return;
  var colors = ["#FFC94D","#FF8A3D","#3B82F6","#34D399","#8B5CF6","#F87171"];
  for (var i = 0; i < 60; i++){
    var s = document.createElement("span");
    s.style.left = Math.random() * 100 + "%";
    s.style.background = colors[Math.floor(Math.random() * colors.length)];
    s.style.animationDelay = Math.random() * 0.5 + "s";
    s.style.animationDuration = (2 + Math.random() * 2) + "s";
    box.appendChild(s);
  }
  setTimeout(function(){ box.innerHTML = ""; }, 4000);
}

/* 吉祥物小火箭对话 */
var MASCOT_TIPS = [
  "卡住了？看看讲解里的生活比喻！",
  "Bug 不是错误，是藏起来的小怪兽，抓住它！",
  "每过一关就亮一颗星，集满星星你就是指挥官！",
  "先看懂代码，再自己写，最后教别人——学会的秘诀",
  "F 和 J 键上有小凸点，摸到就找回手位了",
  "别怕报错，报错是电脑在跟你说话呢",
  "一天练一点，比一天练很多更管用",
  "数学脑力训练能让你的算法更快更准"
];
function initMascot(){
  var m = document.getElementById("mascot");
  var b = document.getElementById("mascotBubble");
  if (!m || !b) return;
  m.onclick = function(){
    var tip = MASCOT_TIPS[Math.floor(Math.random() * MASCOT_TIPS.length)];
    b.textContent = "🚀 " + tip;
    b.classList.add("show");
    clearTimeout(window._mascotT);
    window._mascotT = setTimeout(function(){ b.classList.remove("show"); }, 4000);
  };
}
