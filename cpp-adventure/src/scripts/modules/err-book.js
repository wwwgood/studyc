/* ---------------- 错题本 err-book.js ----------------
 * 自动收集所有英语模块的错题（做错的 + 不会做/看答案/跳过的）。
 * 进度保存在 S.errBook = { items: [...] }。
 * 每条: { id, module, q, o, a, why, source, time, count, skips, correctStreak, status, learnedAt }
 *
 * 核心原则（家长指定，勿擅自改）：
 *   1. 只要「做错一次」或「不会做一次」，就进错题本，并且**永远不会自动消失**；
 *   2. 没掌握的题反复出现（「重做待复习」每次都带上它），直到连续做对够次数；
 *   3. 连续做对 ≥ EB_LEARN_STREAK 次 → 标为「已学会」，降低复习频率
 *      （不再挤进「重做待复习」队列，想练时走「复习已学会」或单题重做）；
 *   4. 已学会的题**仍然留在错题本里、可见可练**，只有手动 ✕ 才真正剔除。
 *
 * 「已学会」不是删除，是降频。旧版把这一步叫「沉没」并直接从默认列表里藏起来，
 * 容易被误解成题目被删了 —— 现在改名为「已学会」，且默认视图显示全部。
 *
 * 两个失败计数，语义严格分开：
 *   count = 真正选错的次数
 *   skips = 「不会做 / 看答案 / 跳过」的次数（不是答错，不混进 count）
 *   权重 ebWeight = count + skips，用于排序（最不会的排最前）
 *
 * 状态（只有两个；删除只有手动一条路）：
 *   active  待复习 —— 还没连续做对够次数
 *   learned 已学会 —— 连续做对够次数（自动），或手动标记
 * 兼容旧数据：历史上的 dormant（沉没）/ resolved（已解决）一律归一成 learned。
 */

var EB_LEARN_STREAK = 3;              /* 连续答对几次算「已学会」（家长给定，勿改） */
var EB_FILTER = "all";                /* 默认展示全部：不要让已学会的题看起来像被删了 */
var EB_STATUS_ACTIVE = "active";
var EB_STATUS_LEARNED = "learned";

/* 旧状态归一：dormant / resolved → learned；其余（含空值）→ active */
function ebNormStatus(s){
  if (s === EB_STATUS_LEARNED || s === "dormant" || s === "resolved") return EB_STATUS_LEARNED;
  return EB_STATUS_ACTIVE;
}

function ebState(){
  if (!S.errBook) S.errBook = { items: [] };
  if (!S.errBook.items) S.errBook.items = [];
  var items = S.errBook.items;
  for (var i = 0; i < items.length; i++){
    var n = ebNormStatus(items[i].status);
    if (items[i].status !== n) items[i].status = n;   /* 幂等迁移，只写一次 */
  }
  return S.errBook;
}

/* 全局接口：任何模块答错 / 不会做时调用（item.skipped=true 表示不会做/跳过） */
function errBookAdd(module, item){
  var st = ebState();
  var exist = null;
  for (var i = 0; i < st.items.length; i++){
    if (st.items[i].module === module && st.items[i].q === item.q){
      exist = st.items[i];
      break;
    }
  }
  /* count = 真正选错的次数；skips = 「不会做/看答案/跳过」的次数。
   * 二者语义不同、互不污染：不会做不是答错，不能混进 count 里，
   * 否则「错 N 次」会把没做过的题也算进去，排序和展示都会失真。 */
  if (exist){
    if (item.skipped) exist.skips = (exist.skips || 0) + 1;
    else exist.count = (exist.count || 0) + 1;
    exist.time = Date.now();
    exist.correctStreak = 0;
    exist.status = EB_STATUS_ACTIVE;   /* 又错/又不会 → 放回待复习（已学会的也降级重来） */
    if (item.source && !exist.source) exist.source = item.source;
  } else {
    st.items.push({
      id: "eb" + Date.now() + Math.floor(Math.random() * 1000),
      module: module,
      q: item.q,
      type: item.type || "choice",
      o: item.o,
      a: item.a,
      ansText: item.ansText || "",
      words: item.words,
      blanks: item.blanks,
      passage: item.passage,
      questions: item.questions,
      sample: item.sample,
      tips: item.tips,
      why: item.why,
      source: item.source || "",
      time: Date.now(),
      count: item.skipped ? 0 : 1,
      skips: item.skipped ? 1 : 0,
      correctStreak: 0,
      status: EB_STATUS_ACTIVE
    });
    ebNotifyNew();
  }
  saveS();
}

function ebNotifyNew(){
  var tab = document.querySelector('.eq-tab[data-tab="errbook"]');
  if (tab) tab.classList.add('has-new');
  ebRefreshTab();
}

function ebRefreshTab(){
  var tab = document.querySelector('.eq-tab[data-tab="errbook"]');
  if (!tab) return;
  var stats = ebStats();
  var activeCount = stats.byStatus.active;
  var badge = tab.querySelector('.eb-tab-badge');
  if (activeCount > 0){
    if (!badge){
      badge = document.createElement('span');
      badge.className = 'eb-tab-badge';
      tab.appendChild(badge);
    }
    badge.textContent = activeCount;
  } else if (badge){
    badge.remove();
  }
}

function ebStats(){
  var st = ebState();
  var byModule = {};
  var byStatus = { active: 0, learned: 0 };
  var skipped = 0;                     /* 有过「不会做/跳过」记录的题数 */
  st.items.forEach(function(it){
    var s = ebNormStatus(it.status);
    if (!byModule[it.module]) byModule[it.module] = { active: 0, learned: 0 };
    byModule[it.module][s]++;
    byStatus[s]++;
    if ((it.skips || 0) > 0) skipped++;
  });
  return { total: st.items.length, byModule: byModule, byStatus: byStatus, skipped: skipped };
}

/* 一道题的「总失败权重」：答错 + 不会做，都算没掌握。
 * 只答对过、从没失败过的题不参与排序（权重 0）。 */
function ebWeight(it){
  return (it.count || 0) + (it.skips || 0);
}

/* ---------- 状态迁移（纯逻辑，便于测试/复用）---------- */

/* 答对一次：累计连对；够次数就标「已学会」+ 记下学会时间。
 * 返回「这一次是否刚跨过门槛」，用于提示文案。 */
function ebMarkCorrect(it){
  it.correctStreak = (it.correctStreak || 0) + 1;
  if (it.correctStreak >= EB_LEARN_STREAK){
    it.status = EB_STATUS_LEARNED;
    it.learnedAt = Date.now();
    return true;
  }
  return false;
}

/* 答错一次：count+1，连对清零，退回待复习（已学会的也会降级重来）。 */
function ebMarkWrong(it){
  it.count = (it.count || 0) + 1;
  it.correctStreak = 0;
  it.status = EB_STATUS_ACTIVE;
}

var EB_MODULE_NAMES = {
  grammar: "📖 语法闯关",
  vocab: "📚 词汇闯关",
  reading: "📄 阅读理解",
  writing: "✍️ 作文训练",
  exam: "📝 真题演练",
  blank: "✅ 选择填空"
};

/* ---------- 渲染 ---------- */
function ebRender(){
  var st = ebState();
  var stats = ebStats();
  var txt = document.getElementById("ebTotalTxt");
  if (txt) txt.textContent = "待复习 " + stats.byStatus.active + " · 已学会 " + stats.byStatus.learned + " · 共 " + stats.total + " 题";

  var wrap = document.getElementById("ebList");
  if (!wrap) return;

  if (stats.total === 0){
    wrap.innerHTML = '<div class="eb-empty"><div class="eb-empty-icon">🎉</div><p>还没有错题！继续加油！</p><p class="eb-empty-sub">做错或不会做的题会自动出现在这里，方便反复练习</p></div>';
    return;
  }

  /* 默认「全部」——已学会的题也要看得见，绝不因为学会了就从本子里消失 */
  var filterOpts = [
    { v: "all", label: "全部（" + stats.total + "）" },
    { v: "active", label: "待复习（" + stats.byStatus.active + "）" },
    { v: "learned", label: "已学会（" + stats.byStatus.learned + "）" },
    { v: "skipped", label: "👀 不会做过（" + stats.skipped + "）" }
  ].map(function(p){
    return '<option value="' + p.v + '"' + (EB_FILTER === p.v ? " selected" : "") + '>' + p.label + '</option>';
  }).join("");

  var html = '<div class="eb-toolbar">' +
    '<select class="eb-filter" onchange="EB_FILTER=this.value; ebRender()">' + filterOpts + '</select>' +
    '<button class="eb-practice-all" type="button" onclick="ebPracticeAll()">🔁 重做待复习（' + stats.byStatus.active + '）</button>' +
    '<button class="eb-practice-learned" type="button" onclick="ebPracticeLearned()">♻️ 复习已学会（' + stats.byStatus.learned + '）</button>' +
    '<button class="eb-clear" type="button" onclick="ebClearAll()">🗑️ 清空全部</button>' +
  '</div>';

  var visibleItems = st.items.filter(function(it){
    if (EB_FILTER === "all") return true;
    if (EB_FILTER === "skipped") return (it.skips || 0) > 0;   /* 「不会做过」专属视角 */
    return ebNormStatus(it.status) === EB_FILTER;
  });

  if (visibleItems.length === 0){
    html += '<div class="eb-empty"><div class="eb-empty-icon">✨</div><p>这个分类下没有错题</p></div>';
    wrap.innerHTML = html;
    return;
  }

  var modules = ["grammar", "vocab", "reading", "writing", "exam", "blank"];
  modules.forEach(function(m){
    var items = visibleItems.filter(function(it){ return it.module === m; });
    if (items.length === 0) return;
    /* 组内排序：待复习在前（按失败权重降序，最不会的排最前），
     * 已学会在后（按学会时间升序，最久没碰的排前面，想复习先看到它） */
    items = items.slice().sort(function(a, b){
      var sa = ebNormStatus(a.status), sb = ebNormStatus(b.status);
      if (sa !== sb) return sa === EB_STATUS_ACTIVE ? -1 : 1;
      if (sa === EB_STATUS_ACTIVE) return ebWeight(b) - ebWeight(a);
      return (a.learnedAt || 0) - (b.learnedAt || 0);
    });
    var name = EB_MODULE_NAMES[m] || m;
    html += '<div class="eb-group">';
    html += '<div class="eb-group-head"><span class="eb-group-name">' + name + '</span><span class="eb-group-count">' + items.length + ' 题</span></div>';
    items.forEach(function(it, idx){
      var qShort = it.q.length > 60 ? it.q.substring(0, 60) + "..." : it.q;
      var passage = it.q.indexOf("\n\n") >= 0 ? it.q.split("\n\n") : null;
      var qText = passage ? passage[passage.length - 1] : it.q;
      qShort = qText.length > 60 ? qText.substring(0, 60) + "..." : qText;
      var s = ebNormStatus(it.status);
      var stBadge = s === EB_STATUS_LEARNED ? ' <span class="eb-st-learned">✅ 已学会</span>' : "";
      var streakInfo = it.correctStreak > 0 ? ' · 连对 ' + it.correctStreak + ' 次' : "";
      var metaParts = [];
      if ((it.count || 0) > 0) metaParts.push('错 ' + it.count + ' 次');
      if ((it.skips || 0) > 0) metaParts.push('👀 不会做 ' + it.skips + ' 次');
      var metaTxt = metaParts.length ? metaParts.join(' · ') : '待复习';
      html += '<div class="eb-item' + (s === EB_STATUS_LEARNED ? " learned" : "") + '">' +
        '<div class="eb-item-q">' + (idx + 1) + ". " + qShort + stBadge + '</div>' +
        '<div class="eb-item-meta">' + metaTxt +
          streakInfo + (it.source ? ' · ' + it.source : '') + '</div>' +
        '<div class="eb-item-ops">' +
          '<button class="eb-item-btn" type="button" onclick="ebPracticeOne(\'' + it.id + '\')">重做</button>';
      if (s === EB_STATUS_ACTIVE) html += '<button class="eb-item-resolve" type="button" onclick="ebMarkLearned(\'' + it.id + '\')" title="标记为已学会">✅</button>';
      if (s === EB_STATUS_LEARNED) html += '<button class="eb-item-revive" type="button" onclick="ebRevive(\'' + it.id + '\')" title="放回待复习">🔄</button>';
      html += '<button class="eb-item-del" type="button" onclick="ebRemove(\'' + it.id + '\')" title="从错题本剔除">✕</button>' +
        '</div>' +
      '</div>';
    });
    html += '</div>';
  });

  wrap.innerHTML = html;
}

/* ---------- 重做会话 ---------- */
var EB_SESSION = null;

function ebStartSession(items){
  if (items.length === 0) return false;
  EB_SESSION = { items: items, idx: 0, answered: false };
  ebRenderQuiz();
  var mask = document.getElementById("ebDialogMask");
  if (mask) mask.classList.add("open");
  document.body.style.overflow = "hidden";
  return true;
}

function ebPracticeOne(id){
  var st = ebState();
  var it = null;
  for (var i = 0; i < st.items.length; i++){
    if (st.items[i].id === id){ it = st.items[i]; break; }
  }
  if (!it) return;
  ebStartSession([it]);
}

/* 「重做待复习」：只收待复习的题 —— 已学会的题不再挤这个队列，等于降了频 */
function ebPracticeAll(){
  var st = ebState();
  var items = st.items.filter(function(it){ return ebNormStatus(it.status) === EB_STATUS_ACTIVE; });
  if (items.length === 0){ alert("没有待复习的错题了"); return; }
  /* 最不会的题排最前：答错次数 + 不会做/跳过次数，一起算，先把硬骨头过一遍 */
  items = items.slice().sort(function(a, b){ return ebWeight(b) - ebWeight(a); });
  ebStartSession(items);
}

/* 「复习已学会」：手动想练才来，最久没碰的排前面 */
function ebPracticeLearned(){
  var st = ebState();
  var items = st.items.filter(function(it){ return ebNormStatus(it.status) === EB_STATUS_LEARNED; });
  if (items.length === 0){ alert("还没有已学会的题"); return; }
  items = items.slice().sort(function(a, b){ return (a.learnedAt || 0) - (b.learnedAt || 0); });
  ebStartSession(items);
}

function ebPracticeModule(module){
  var st = ebState();
  var items = st.items.filter(function(it){ return it.module === module && ebNormStatus(it.status) === EB_STATUS_ACTIVE; });
  if (items.length === 0){ alert("该模块没有待复习的错题"); return; }
  ebStartSession(items);
}

function ebRenderQuiz(){
  var it = EB_SESSION.items[EB_SESSION.idx];
  var qType = (typeof qtTypeOf === "function") ? qtTypeOf(it) : "choice";
  var inputHtml = (typeof qtRender === "function") ? qtRender(it, "eb") : "";
  var qTitle = it.q ? '<div class="eb-question">' + it.q + '</div>' : '';
  var dialog = document.getElementById("ebDialog");
  if (!dialog) return;
  var mName = EB_MODULE_NAMES[it.module] || it.module;
  var streakTxt = it.correctStreak > 0 ? ' · 连对 ' + it.correctStreak + '/' + EB_LEARN_STREAK : "";
  dialog.innerHTML =
    '<div class="eb-dlg-head">' +
      '<span class="eb-cap">❌ 错题重做 · ' + mName + ' · ' + (EB_SESSION.idx + 1) + '/' + EB_SESSION.items.length + streakTxt +
      (typeof qtLabel === "function" ? ' · ' + qtLabel(qType) : '') + '</span>' +
      '<button class="eb-close" type="button" onclick="ebClose()">×</button>' +
    '</div>' +
    '<div class="eb-dlg-body">' +
      qTitle +
      inputHtml +
      '<div class="eb-feedback" id="ebFeedback"></div>' +
      '<div class="eb-act" id="ebAct">' +
        '<button class="qt-submit" type="button" onclick="ebAnswer()">' + (qType === "writing" ? "✍️ 我写完了，看范文" : "✅ 提交答案") + '</button>' +
      '</div>' +
    '</div>';
}


function ebAnswer(){
  var it = EB_SESSION.items[EB_SESSION.idx];
  if (EB_SESSION.answered) return;
  var input = (typeof qtRead === "function") ? qtRead(it, "eb") : null;
  var grade = (typeof qtGrade === "function") ? qtGrade(it, input) : { ok: false, show: "" };
  if (typeof qtMarkRight === "function") qtMarkRight(it, "eb");
  EB_SESSION.answered = true;
  var fb = document.getElementById("ebFeedback");
  if (!fb) return;
  var qType = qtTypeOf(it);
  var sampleHtml = "";
  if (qType === "writing" && (it.sample || it.why)){
    sampleHtml = '<div class="qt-sample"><b>📝 参考范文：</b>' + (it.sample || it.why) + '</div>';
  }
  if (grade.ok){
    /* 连续做对够次数 → 标「已学会」：降频，但仍然留在本子里，不删 */
    var willLearn = ebMarkCorrect(it);
    saveS();
    if (typeof aoShow === "function"){
      var notice = "";
      if (willLearn) notice = "🎉 连续答对 " + EB_LEARN_STREAK + " 次，已标为「已学会」—— 以后不再挤进重做队列，但会一直留在错题本里";
      else if (it.correctStreak > 0) notice = "连续答对 " + it.correctStreak + "/" + EB_LEARN_STREAK + " 次，再答对 " + (EB_LEARN_STREAK - it.correctStreak) + " 次就标为「已学会」";
      aoShow({ ok: true, sub: notice, qHtml: aoQHtml(it), bigHtml: aoBigAns(it), whyHtml: it.why, extraHtml: sampleHtml, onNext: ebNext });
    } else {
      var msg = '✅ ' + (qType === "writing" ? "写完了！" : "正确！") + (grade.show ? ' · ' + grade.show : '') + (it.why ? ' · ' + it.why : '');
      if (willLearn) msg += '<br><span class="eb-learned-notice">🎉 连续答对 ' + EB_LEARN_STREAK + ' 次，已标为「已学会」！</span>';
      else if (it.correctStreak > 0) msg += '<br><span class="eb-streak-notice">连续答对 ' + it.correctStreak + '/' + EB_LEARN_STREAK + ' 次，再答对 ' + (EB_LEARN_STREAK - it.correctStreak) + ' 次就标为「已学会」</span>';
      fb.innerHTML = '<div class="eb-fb ok">' + msg + '</div>' + sampleHtml +
        '<button class="eb-next-btn" type="button" onclick="ebNext()">下一题 →</button>';
    }
  } else {
    ebMarkWrong(it);                  /* count+1、连对清零、退回待复习 */
    saveS();
    if (typeof aoShow === "function"){
      aoShow({ ok: false, qHtml: aoQHtml(it, input), bigHtml: aoBigAns(it), userHtml: aoUserPick(it, input), whyHtml: it.why, extraHtml: sampleHtml, onNext: ebNext });
    } else {
      var showTxt = grade.show ? '<div class="qt-grade-show">' + grade.show + '</div>' : '';
      fb.innerHTML = '<div class="eb-fb no">❌ ' + showTxt + (it.why ? ' · ' + it.why : '') + '</div>' + sampleHtml +
        '<button class="eb-next-btn" type="button" onclick="ebNext()">继续 →</button>';
    }
  }
}


function ebNext(){
  EB_SESSION.idx++;
  EB_SESSION.answered = false;
  if (EB_SESSION.idx < EB_SESSION.items.length){ ebRenderQuiz(); return; }
  var dialog = document.getElementById("ebDialog");
  if (!dialog) return;
  var st = ebState();
  var remain = st.items.filter(function(it){ return ebNormStatus(it.status) === EB_STATUS_ACTIVE; }).length;
  dialog.innerHTML =
    '<div class="eb-dlg-head result"><span class="eb-cap">🏁 重做完成</span>' +
      '<button class="eb-close" type="button" onclick="ebClose()">×</button></div>' +
    '<div class="eb-dlg-body eb-result">' +
      '<div class="eb-result-icon">💪</div>' +
      '<h3>这一轮做完了！</h3>' +
      '<p>还剩 ' + remain + ' 道待复习，已学会的题都留在错题本里，随时可以再练。</p>' +
      '<div class="eb-result-btns">' +
        '<button class="eb-go-btn" type="button" onclick="ebClose()">返回错题本</button>' +
      '</div>' +
    '</div>';
}

function ebClose(){
  var mask = document.getElementById("ebDialogMask");
  if (mask) mask.classList.remove("open");
  document.body.style.overflow = "";
  EB_SESSION = null;
  ebRender();
}

/* 手动标记「已学会」（不等连对 3 次也行） */
function ebMarkLearned(id){
  var st = ebState();
  for (var i = 0; i < st.items.length; i++){
    if (st.items[i].id === id){
      st.items[i].status = EB_STATUS_LEARNED;
      st.items[i].learnedAt = Date.now();
      break;
    }
  }
  saveS();
  ebRender();
}
/* 旧名兼容 */
function ebResolve(id){ ebMarkLearned(id); }

/* 放回待复习：连对清零，重新从高频复习开始 */
function ebRevive(id){
  var st = ebState();
  for (var i = 0; i < st.items.length; i++){
    if (st.items[i].id === id){
      st.items[i].status = EB_STATUS_ACTIVE;
      st.items[i].correctStreak = 0;
      break;
    }
  }
  saveS();
  ebRender();
}

/* 剔除：唯一真正「从错题本消失」的途径，且必须手动 */
function ebRemove(id){
  var st = ebState();
  st.items = st.items.filter(function(it){ return it.id !== id; });
  saveS();
  ebRender();
}

function ebClearAll(){
  if (!confirm("确定清空所有错题吗？此操作不可撤销。")) return;
  var st = ebState();
  st.items = [];
  saveS();
  ebRender();
}

window.addEventListener("load", function(){ if (document.getElementById("ebList")) ebRender(); ebRefreshTab(); });
