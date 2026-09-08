/* ---------------- 错题本 err-book.js ----------------
 * 自动收集所有英语模块的错题，支持重做和清除。
 * 进度保存在 S.errBook = { items: [...] }。
 * 每条: { id, module, q, o, a, why, source, time, count, correctStreak, status }
 *
 * 智能降频机制：
 * - status: active（活跃）/ dormant（沉没）/ resolved（已解决）
 * - correctStreak: 连续答对次数
 * - 答对3次 → 自动沉没（dormant），不再出现在默认列表
 * - 答错 → 重置 correctStreak=0，status=active（复活）
 * - 手动标记 resolved → 不再出现在默认列表
 */

var EB_DORMANT_THRESHOLD = 3;
var EB_FILTER = "active";

function ebState(){
  if (!S.errBook) S.errBook = { items: [] };
  if (!S.errBook.items) S.errBook.items = [];
  return S.errBook;
}

/* 全局接口：任何模块答错时调用 */
function errBookAdd(module, item){
  var st = ebState();
  var exist = null;
  for (var i = 0; i < st.items.length; i++){
    if (st.items[i].module === module && st.items[i].q === item.q){
      exist = st.items[i];
      break;
    }
  }
  if (exist){
    exist.count = (exist.count || 1) + 1;
    exist.time = Date.now();
    exist.correctStreak = 0;
    exist.status = "active";
  } else {
    st.items.push({
      id: "eb" + Date.now() + Math.floor(Math.random() * 1000),
      module: module,
      q: item.q,
      o: item.o,
      a: item.a,
      why: item.why,
      source: item.source || "",
      time: Date.now(),
      count: 1,
      correctStreak: 0,
      status: "active"
    });
  }
  saveS();
}

function ebStats(){
  var st = ebState();
  var byModule = {};
  var byStatus = { active: 0, dormant: 0, resolved: 0 };
  st.items.forEach(function(it){
    var s = it.status || "active";
    if (!byModule[it.module]) byModule[it.module] = { active: 0, dormant: 0, resolved: 0 };
    byModule[it.module][s]++;
    byStatus[s]++;
  });
  return { total: st.items.length, byModule: byModule, byStatus: byStatus };
}

var EB_MODULE_NAMES = {
  grammar: "📖 语法闯关",
  vocab: "📚 词汇闯关",
  reading: "📄 阅读理解",
  writing: "✍️ 作文训练",
  exam: "📝 真题演练"
};

/* ---------- 渲染 ---------- */
function ebRender(){
  var st = ebState();
  var stats = ebStats();
  var txt = document.getElementById("ebTotalTxt");
  if (txt) txt.textContent = "活跃 " + stats.byStatus.active + " · 沉没 " + stats.byStatus.dormant + " · 已解决 " + stats.byStatus.resolved;

  var wrap = document.getElementById("ebList");
  if (!wrap) return;

  if (stats.total === 0){
    wrap.innerHTML = '<div class="eb-empty"><div class="eb-empty-icon">🎉</div><p>还没有错题！继续加油！</p><p class="eb-empty-sub">做错的题会自动出现在这里，方便反复练习</p></div>';
    return;
  }

  var filterOpts = [
    { v: "active", label: "活跃错题（" + stats.byStatus.active + "）" },
    { v: "dormant", label: "已沉没（" + stats.byStatus.dormant + "）" },
    { v: "resolved", label: "已解决（" + stats.byStatus.resolved + "）" },
    { v: "all", label: "全部（" + stats.total + "）" }
  ].map(function(p){
    return '<option value="' + p.v + '"' + (EB_FILTER === p.v ? " selected" : "") + '>' + p.label + '</option>';
  }).join("");

  var html = '<div class="eb-toolbar">' +
    '<select class="eb-filter" onchange="EB_FILTER=this.value; ebRender()">' + filterOpts + '</select>' +
    '<button class="eb-practice-all" type="button" onclick="ebPracticeAll()">🔁 重做活跃错题</button>' +
    '<button class="eb-clear" type="button" onclick="ebClearAll()">🗑️ 清空全部</button>' +
  '</div>';

  var visibleItems = st.items.filter(function(it){
    if (EB_FILTER === "all") return true;
    var s = it.status || "active";
    return s === EB_FILTER;
  });

  if (visibleItems.length === 0){
    html += '<div class="eb-empty"><div class="eb-empty-icon">✨</div><p>这个分类下没有错题</p></div>';
    wrap.innerHTML = html;
    return;
  }

  var modules = ["grammar", "vocab", "reading", "writing", "exam"];
  modules.forEach(function(m){
    var items = visibleItems.filter(function(it){ return it.module === m; });
    if (items.length === 0) return;
    var name = EB_MODULE_NAMES[m] || m;
    html += '<div class="eb-group">';
    html += '<div class="eb-group-head"><span class="eb-group-name">' + name + '</span><span class="eb-group-count">' + items.length + ' 题</span></div>';
    items.forEach(function(it, idx){
      var qShort = it.q.length > 60 ? it.q.substring(0, 60) + "..." : it.q;
      var passage = it.q.indexOf("\n\n") >= 0 ? it.q.split("\n\n") : null;
      var qText = passage ? passage[passage.length - 1] : it.q;
      qShort = qText.length > 60 ? qText.substring(0, 60) + "..." : qText;
      var stBadge = "";
      var s = it.status || "active";
      if (s === "dormant") stBadge = ' <span class="eb-st-dormant">沉没</span>';
      else if (s === "resolved") stBadge = ' <span class="eb-st-resolved">已解决</span>';
      var streakInfo = it.correctStreak > 0 ? ' · 连对 ' + it.correctStreak + ' 次' : "";
      html += '<div class="eb-item">' +
        '<div class="eb-item-q">' + (idx + 1) + ". " + qShort + stBadge + '</div>' +
        '<div class="eb-item-meta">错 ' + it.count + ' 次' + streakInfo + (it.source ? ' · ' + it.source : '') + '</div>' +
        '<div class="eb-item-ops">' +
          '<button class="eb-item-btn" type="button" onclick="ebPracticeOne(\'' + it.id + '\')">重做</button>';
      if (s === "active") html += '<button class="eb-item-resolve" type="button" onclick="ebResolve(\'' + it.id + '\')" title="标记已解决">✔️</button>';
      if (s === "dormant") html += '<button class="eb-item-revive" type="button" onclick="ebRevive(\'' + it.id + '\')" title="重新激活">🔄</button>';
      html += '<button class="eb-item-del" type="button" onclick="ebRemove(\'' + it.id + '\')">✕</button>' +
        '</div>' +
      '</div>';
    });
    html += '</div>';
  });

  wrap.innerHTML = html;
}

/* ---------- 单题重做 ---------- */
var EB_SESSION = null;

function ebPracticeOne(id){
  var st = ebState();
  var it = null;
  for (var i = 0; i < st.items.length; i++){
    if (st.items[i].id === id){ it = st.items[i]; break; }
  }
  if (!it) return;
  EB_SESSION = { items: [it], idx: 0 };
  ebRenderQuiz();
  var mask = document.getElementById("ebDialogMask");
  if (mask) mask.classList.add("open");
  document.body.style.overflow = "hidden";
}

function ebPracticeAll(){
  var st = ebState();
  var items = st.items.filter(function(it){ return (it.status || "active") === "active"; });
  if (items.length === 0){ alert("没有活跃错题可重做"); return; }
  EB_SESSION = { items: items, idx: 0 };
  ebRenderQuiz();
  var mask = document.getElementById("ebDialogMask");
  if (mask) mask.classList.add("open");
  document.body.style.overflow = "hidden";
}

function ebPracticeModule(module){
  var st = ebState();
  var items = st.items.filter(function(it){ return it.module === module && (it.status || "active") === "active"; });
  if (items.length === 0){ alert("该模块没有活跃错题"); return; }
  EB_SESSION = { items: items, idx: 0 };
  ebRenderQuiz();
  var mask = document.getElementById("ebDialogMask");
  if (mask) mask.classList.add("open");
  document.body.style.overflow = "hidden";
}

function ebRenderQuiz(){
  var it = EB_SESSION.items[EB_SESSION.idx];
  var passage = it.q.indexOf("\n\n") >= 0 ? it.q.split("\n\n") : null;
  var qText = passage ? passage[passage.length - 1] : it.q;
  var passageHtml = "";
  if (passage && passage.length > 1){
    for (var i = 0; i < passage.length - 1; i++){
      passageHtml += '<div class="eb-passage">' + passage[i].replace(/\n/g, "<br>") + '</div>';
    }
  }
  var opts = it.o.map(function(t, i){
    return '<button class="eb-opt" type="button" data-i="' + i + '" onclick="ebAnswer(this)">' + String.fromCharCode(65 + i) + ". " + t + '</button>';
  }).join("");
  var dialog = document.getElementById("ebDialog");
  if (!dialog) return;
  var mName = EB_MODULE_NAMES[it.module] || it.module;
  var streakTxt = it.correctStreak > 0 ? ' · 连对 ' + it.correctStreak + '/' + EB_DORMANT_THRESHOLD : "";
  dialog.innerHTML =
    '<div class="eb-dlg-head">' +
      '<span class="eb-cap">❌ 错题重做 · ' + mName + ' · ' + (EB_SESSION.idx + 1) + '/' + EB_SESSION.items.length + streakTxt + '</span>' +
      '<button class="eb-close" type="button" onclick="ebClose()">×</button>' +
    '</div>' +
    '<div class="eb-dlg-body">' +
      passageHtml +
      '<div class="eb-question">' + qText + '</div>' +
      '<div class="eb-opts">' + opts + '</div>' +
      '<div class="eb-feedback" id="ebFeedback"></div>' +
    '</div>';
}

function ebAnswer(btn){
  var it = EB_SESSION.items[EB_SESSION.idx];
  var i = parseInt(btn.getAttribute("data-i"), 10);
  var opts = btn.parentNode.querySelectorAll(".eb-opt");
  for (var k = 0; k < opts.length; k++) opts[k].disabled = true;
  var fb = document.getElementById("ebFeedback");
  if (i === it.a){
    btn.classList.add("ok");
    it.correctStreak = (it.correctStreak || 0) + 1;
    var willDormant = it.correctStreak >= EB_DORMANT_THRESHOLD && (it.status || "active") === "active";
    if (willDormant) it.status = "dormant";
    saveS();
    var msg = '✅ 正确！' + it.why;
    if (willDormant) msg += '<br><span class="eb-dormant-notice">🎉 连续答对 ' + EB_DORMANT_THRESHOLD + ' 次，这道题已沉没！</span>';
    else if (it.correctStreak > 0) msg += '<br><span class="eb-streak-notice">连续答对 ' + it.correctStreak + '/' + EB_DORMANT_THRESHOLD + ' 次，再答对 ' + (EB_DORMANT_THRESHOLD - it.correctStreak) + ' 次就沉没</span>';
    fb.innerHTML = '<div class="eb-fb ok">' + msg + '</div>' +
      '<button class="eb-next-btn" type="button" onclick="ebNext()">下一题 →</button>';
  } else {
    btn.classList.add("no");
    opts[it.a].classList.add("ok");
    it.count = (it.count || 1) + 1;
    it.correctStreak = 0;
    it.status = "active";
    saveS();
    fb.innerHTML = '<div class="eb-fb no">❌ ' + it.why + '</div>' +
      '<button class="eb-next-btn" type="button" onclick="ebNext()">继续 →</button>';
  }
}

function ebNext(){
  EB_SESSION.idx++;
  if (EB_SESSION.idx < EB_SESSION.items.length){ ebRenderQuiz(); return; }
  var dialog = document.getElementById("ebDialog");
  if (!dialog) return;
  dialog.innerHTML =
    '<div class="eb-dlg-head result"><span class="eb-cap">🏁 重做完成</span>' +
      '<button class="eb-close" type="button" onclick="ebClose()">×</button></div>' +
    '<div class="eb-dlg-body eb-result">' +
      '<div class="eb-result-icon">💪</div>' +
      '<h3>错题重做完毕！</h3>' +
      '<p>坚持练习，错题会越来越少！</p>' +
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

function ebResolve(id){
  var st = ebState();
  for (var i = 0; i < st.items.length; i++){
    if (st.items[i].id === id){ st.items[i].status = "resolved"; break; }
  }
  saveS();
  ebRender();
}

function ebRevive(id){
  var st = ebState();
  for (var i = 0; i < st.items.length; i++){
    if (st.items[i].id === id){ st.items[i].status = "active"; st.items[i].correctStreak = 0; break; }
  }
  saveS();
  ebRender();
}

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

window.addEventListener("load", function(){ if (document.getElementById("ebList")) ebRender(); });
