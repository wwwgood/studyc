/* ---------------- 学校练习 school.js ----------------
 * 与学校课本《信息学奥赛一本通》（董永建）同步的练习模块：
 *   进去就是「做题 → 解答 → 解析」三步，方便反复看、反复学。
 * 数据在 data/school-bank.js（19 题，三份解答的重复内容已合并）；
 * 状态存 localStorage cppsSchoolV1（学会标记 + 上次看到哪）。
 * 全部为新增逻辑，不改动其他模块。
 */
var SCH_LESSON_INDEX = 0;
var SCH_ACTIVE_ID = null;   /* "primer" / "sheet" / 题目 id */
var SCH_TAB = "do";         /* do=做题 / code=解答 / ex=解析 */
var SCH_KEY = "cppsSchoolV1";
var SCH_INBOX_KEY = "cppsSchoolInbox";
var SCH_VIEW = 0;

function schState(){
  try {
    var v = JSON.parse(localStorage.getItem(SCH_KEY));
    if (v && v.mastered) return v;
  } catch(e){}
  return { mastered: {}, last: null };
}
function schSave(st){
  try { localStorage.setItem(SCH_KEY, JSON.stringify(st)); } catch(e){}
}
function schLesson(){ return SCHOOL_LESSONS[SCH_LESSON_INDEX] || SCHOOL_LESSONS[0]; }
function schProblems(){ return schLesson().problems; }
function schFind(id){
  var ps = schProblems();
  for (var i = 0; i < ps.length; i++){ if (ps[i].id === id) return ps[i]; }
  return null;
}
function schStars(n){ return "★".repeat(n) + "☆".repeat(Math.max(0, 3 - n)); }

/* ---------- 文本工具 ---------- */
function schEsc(s){
  return String(s == null ? "" : s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
/* 行内强调：先转义，再套标记（强调样式集中在 school.css，可整体调整/回滚） */
function schFmt(s){
  s = schEsc(s);
  s = s.replace(/`([^`]+)`/g, '<span class="sch-icode">$1</span>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<b class="sch-b">$1</b>');
  s = s.replace(/\[hl\]([\s\S]*?)\[\/hl\]/g, '<span class="sch-hl">$1</span>');
  s = s.replace(/\[wv\]([\s\S]*?)\[\/wv\]/g, '<span class="sch-wv">$1</span>');
  s = s.replace(/\[rd\]([\s\S]*?)\[\/rd\]/g, '<span class="sch-rd">$1</span>');
  return s;
}
/* 解析块渲染 */
function schBlocks(blocks){
  var html = "";
  (blocks || []).forEach(function(b){
    var t = b[0], d = b[1];
    if (t === "p") html += '<p class="sch-p">' + schFmt(d) + '</p>';
    else if (t === "h") html += '<div class="sch-h">' + schFmt(d) + '</div>';
    else if (t === "ul") html += '<ul class="sch-ul">' + d.map(function(x){ return '<li>' + schFmt(x) + '</li>'; }).join("") + '</ul>';
    else if (t === "steps") html += '<ol class="sch-steps">' + d.map(function(x){ return '<li>' + schFmt(x) + '</li>'; }).join("") + '</ol>';
    else if (t === "tip") html += '<div class="sch-tip"><span class="sch-cap">🧠 口诀</span><span>' + schFmt(d) + '</span></div>';
    else if (t === "warn") html += '<div class="sch-warn"><span class="sch-cap">⚠️ 注意</span><span>' + schFmt(d) + '</span></div>';
    else if (t === "table") html += '<table class="sch-tbl">' + d.map(function(row, i){
      return '<tr>' + row.map(function(c){ return (i === 0 ? "<th>" : "<td>") + schFmt(c) + (i === 0 ? "</th>" : "</td>"); }).join("") + '</tr>';
    }).join("") + '</table>';
    else if (t === "code") html += '<pre class="sch-snippet">' + schEsc(d.join("\n")) + '</pre>';
    else if (t === "walk"){
      /* 逐行讲解：d = [[代码行, 解析], ...]，一行代码配一句解析 */
      html += '<div class="sch-walk"><div class="sch-walk-cap">🔍 逐行讲解 · 一行代码一句话</div>' +
        d.map(function(row, i){
          return '<div class="sch-walk-row">' +
            '<span class="sch-walk-ln">' + (i + 1) + '</span>' +
            '<code class="sch-walk-code">' + schFmt(row[0]) + '</code>' +
            '<span class="sch-walk-exp">' + schFmt(row[1]) + '</span>' +
          '</div>';
        }).join("") + '</div>';
    }
  });
  return html;
}

/* ---------- 列表 ---------- */
function schRenderList(){
  var box = document.getElementById("schList");
  if (!box) return;
  var les = schLesson();
  var st = schState();
  var html = '<div class="sch-pins">' +
    '<button class="sch-pin' + (SCH_ACTIVE_ID === "primer" ? " active" : "") + '" type="button" onclick="schOpen(\'primer\')">📖 开课必读 · 基础魔法</button>' +
    '<button class="sch-pin' + (SCH_ACTIVE_ID === "sheet" ? " active" : "") + '" type="button" onclick="schOpen(\'sheet\')">🔖 考前速查卡</button>' +
  '</div>';
  les.groups.forEach(function(g){
    var items = les.problems.filter(function(p){ return p.grp === g.id; });
    if (!items.length) return;
    html += '<div class="sch-group"><div class="sch-group-title">📂 ' + schEsc(g.name) + '<span class="sch-cnt">' + items.length + ' 题</span></div><div class="sch-list">';
    items.forEach(function(p){
      var m = !!st.mastered[p.id];
      var isActive = SCH_ACTIVE_ID === p.id;
      html += '<button class="sch-item' + (m ? " mastered" : "") + (isActive ? " active" : "") + '" type="button" onclick="schOpen(\'' + p.id + '\')" aria-label="' + schEsc(p.name + " " + p.title) + '">' +
        '<span class="sch-item-no">' + p.no + '</span>' +
        '<span class="sch-item-info">' +
          '<span class="sch-item-title">' + schEsc(p.title) + '</span>' +
          '<span class="sch-item-meta"><span class="sch-stars">' + schStars(p.diff) + '</span>' +
          '<span class="sch-item-point">' + schEsc((p.points && p.points[0]) || "") + '</span></span>' +
        '</span>' +
        '<span class="sch-mark">' + (m ? "✅" : "○") + '</span>' +
      '</button>';
    });
    html += '</div></div>';
  });
  box.innerHTML = html;
}

/* ---------- 统计 & 课时标签 ---------- */
function schRenderStats(){
  var st = schState();
  var total = 0, done = 0;
  SCHOOL_LESSONS.forEach(function(l){
    l.problems.forEach(function(p){ total++; if (st.mastered[p.id]) done++; });
  });
  var mEl = document.getElementById("schStatMastered");
  if (mEl) mEl.textContent = done + " / " + total;
  var tEl = document.getElementById("schStatTotal");
  if (tEl) tEl.textContent = total;
  var lEl = document.getElementById("schStatLessons");
  if (lEl) lEl.textContent = SCHOOL_LESSONS.length;
}
function schRenderTabs(){
  var box = document.getElementById("schLessonTabs");
  if (!box) return;
  if (SCHOOL_LESSONS.length <= 1){ box.innerHTML = ""; return; }
  var html = "";
  SCHOOL_LESSONS.forEach(function(l, i){
    html += '<button class="sch-ltab' + (i === SCH_LESSON_INDEX ? " active" : "") + '" type="button" onclick="schSwitchLesson(' + i + ')">📚 ' + schEsc(l.title) + '</button>';
  });
  box.innerHTML = html;
}
function schSwitchLesson(i){
  SCH_LESSON_INDEX = i;
  SCH_ACTIVE_ID = null;
  SCH_TAB = "do";
  schRenderTabs(); schRenderList(); schRenderStats(); schRenderDetail();
}

/* ---------- 详情 ---------- */
function schOpen(id){
  SCH_ACTIVE_ID = id;
  if (id !== "primer" && id !== "sheet") SCH_TAB = "do";
  var st = schState();
  st.last = id;
  schSave(st);
  schRenderList();
  schRenderDetail();
  try {
    var el = document.getElementById("schDetail");
    if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch(e){}
}
function schSetTab(t){ SCH_TAB = t; schRenderDetail(); }
function schTabBtn(key, label){
  return '<button class="sch-tab' + (SCH_TAB === key ? " active" : "") + '" type="button" onclick="schSetTab(\'' + key + '\')">' + label + '</button>';
}
function schCodeWrap(fname, codeArr, id, alt){
  return '<div class="sch-code-wrap">' +
    '<div class="sch-code-head"><span>' + schEsc(fname) + '</span>' +
    '<button class="sch-copy-btn" type="button" onclick="schCopyCode(\'' + id + '\',' + (alt ? "true" : "false") + ')">📋 复制代码</button></div>' +
    '<pre class="sch-code">' + schEsc((codeArr || []).join("\n")) + '</pre></div>';
}
function schRenderDetail(){
  var box = document.getElementById("schDetail");
  if (!box) return;
  var les = schLesson();
  /* 特殊项：开课必读 / 考前速查卡 */
  if (SCH_ACTIVE_ID === "primer" || SCH_ACTIVE_ID === "sheet"){
    var item = (SCH_ACTIVE_ID === "primer") ? les.primer : les.sheet;
    var icon = (SCH_ACTIVE_ID === "primer") ? "📖" : "🔖";
    box.innerHTML = '<div class="sch-card">' +
      '<div class="sch-card-head"><h3>' + icon + ' ' + schEsc(item.title) + '</h3>' +
      '<span class="sch-tag">合并自三份解答</span></div>' +
      schBlocks(item.blocks) +
    '</div>';
    return;
  }
  if (!SCH_ACTIVE_ID){
    box.innerHTML = '<div class="sch-empty">点左边任何一项开始：<b>做题</b>（先自己写）→ <b>解答</b>（对答案）→ <b>解析</b>（吃透知识点）→</div>';
    return;
  }
  var p = schFind(SCH_ACTIVE_ID);
  if (!p){ box.innerHTML = '<div class="sch-empty">没找到这道题，点左边列表重新选一道吧。</div>'; return; }
  var st = schState();
  var m = !!st.mastered[p.id];
  var html = '<div class="sch-card">' +
    '<div class="sch-card-head">' +
      '<h3>🏫 ' + schEsc(p.name) + ' · ' + schEsc(p.title) + '</h3>' +
      '<span class="sch-tag"><span class="sch-stars">' + schStars(p.diff) + '</span></span>' +
      '<span class="sch-tag band">' + (m ? "✅ 已学会" : "做完记得标记学会") + '</span>' +
    '</div>' +
    '<div class="sch-tabs">' +
      schTabBtn("do", "📝 做题") +
      schTabBtn("code", "💻 解答") +
      schTabBtn("ex", "📖 解析") +
    '</div>' +
    '<div class="sch-tab-panel">' + schTabContent(p) + '</div>' +
    '<div class="sch-actions">' +
      '<button class="sch-btn ' + (m ? "done" : "primary") + '" type="button" onclick="schToggleMaster(\'' + p.id + '\')">' + (m ? "✅ 已学会（点一下取消）" : "🎯 标记已学会") + '</button>' +
      '<button class="sch-btn ghost" type="button" onclick="schPrevNext(-1)">◀ 上一题</button>' +
      '<button class="sch-btn ghost" type="button" onclick="schPrevNext(1)">下一题 ▶</button>' +
    '</div>' +
  '</div>';
  box.innerHTML = html;
}
function schTabContent(p){
  if (SCH_TAB === "code"){
    var html = '<div class="sch-sec-title">💻 参考代码（合并后的解答）</div>' +
      schCodeWrap("main.cpp · " + p.no, p.code, p.id, false);
    if (p.codeAlt && p.codeAlt.length){
      html += '<div class="sch-sec-title">➕ 另一种写法' + (p.codeAltNote ? '（' + schEsc(p.codeAltNote) + '）' : '') + '</div>' +
        schCodeWrap("alt.cpp · " + p.no, p.codeAlt, p.id, true);
    }
    html += '<div class="sch-do-tip" style="margin-top:10px;">✍️ 看懂不等于会写——盖住代码自己敲一遍，再回来对照。</div>';
    return html;
  }
  if (SCH_TAB === "ex"){
    return schBlocks(p.analysis);
  }
  /* 做题 */
  var html2 = '<div class="sch-do-tip">🙌 先自己在纸上或电脑上写一遍，写完再点上面的「💻 解答」对照答案。</div>' +
    '<div class="sch-sec-title">📋 题目描述</div>' +
    '<div class="sch-desc">' + schEsc(p.desc) + '</div>' +
    '<div class="sch-sec-title">⌨️ 输入 / 输出</div>' +
    '<div class="sch-io"><div><b>输入：</b>' + schEsc(p.input) + '</div><div><b>输出：</b>' + schEsc(p.output) + '</div></div>' +
    '<div class="sch-sec-title">🧪 用例</div>' +
    '<div class="sch-samples">' +
      '<div class="sch-sample"><span class="sch-sample-cap">输入</span><pre>' + schEsc(p.sampleIn) + '</pre></div>' +
      '<div class="sch-sample"><span class="sch-sample-cap">输出</span><pre>' + schEsc(p.sampleOut) + '</pre></div>' +
    '</div>';
  if (p.points && p.points.length){
    html2 += '<div class="sch-sec-title">🎯 考点</div><div class="sch-points">' + p.points.map(function(x){ return '<span class="sch-point">' + schEsc(x) + '</span>'; }).join("") + '</div>';
  }
  return html2;
}

/* ---------- 动作 ---------- */
function schToggleMaster(id){
  var st = schState();
  if (st.mastered[id]) delete st.mastered[id];
  else st.mastered[id] = true;
  schSave(st);
  schRenderList(); schRenderStats(); schRenderDetail();
  schRenderBadges();
  schToast(st.mastered[id] ? "🎉 已标记「学会」！" : "已取消标记");
}
function schPrevNext(dir){
  var ps = schProblems();
  if (!ps.length) return;
  var idx = -1;
  for (var i = 0; i < ps.length; i++){ if (ps[i].id === SCH_ACTIVE_ID){ idx = i; break; } }
  if (idx < 0) idx = (dir > 0 ? -2 + 1 : 0); /* primer/sheet 或空：从第一题开始 */
  var next = idx + dir;
  if (next < 0) next = ps.length - 1;
  if (next >= ps.length) next = 0;
  schOpen(ps[next].id);
}
function schCopyCode(id, alt){
  var p = schFind(id);
  if (!p) return;
  var text = ((alt ? p.codeAlt : p.code) || []).join("\n");
  var doneFn = function(){ schToast("代码已复制，去 Dev-C++ 里自己敲一遍吧！"); };
  try {
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(doneFn, function(){ schCopyFallback(text); });
    } else {
      schCopyFallback(text);
    }
  } catch(e){ schCopyFallback(text); }
}
function schCopyFallback(text){
  try {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    schToast("代码已复制，去 Dev-C++ 里自己敲一遍吧！");
  } catch(e){
    schToast("复制失败，请手动选中代码复制。");
  }
}
function schToast(msg){
  if (typeof ojToast === "function"){ ojToast(msg); }
}

/* ---------- 视图切换（题目 / 徽章墙 / 投稿箱） ---------- */
function schSwitchView(i){
  SCH_VIEW = i;
  var tabs = document.querySelectorAll(".sch-view");
  for (var k = 0; k < tabs.length; k++) tabs[k].classList.toggle("active", k === i);
  for (var k2 = 0; k2 < 3; k2++){
    var panel = document.getElementById("schPanel" + k2);
    if (panel) panel.classList.toggle("active", k2 === i);
  }
  if (i === 1) schRenderBadges();
  if (i === 2) schRenderInbox();
}

/* ---------- 练习徽章墙（照徽章墙的做法考核） ---------- */
function schRenderBadges(){
  var box = document.getElementById("schBadges");
  if (!box) return;
  var les = schLesson();
  var st = schState();
  var total = les.problems.length;
  var done = 0;
  les.problems.forEach(function(p){ if (st.mastered[p.id]) done++; });
  var pct = total ? Math.round(done / total * 100) : 0;
  var allLit = (done === total && total > 0);
  var html = '<div class="sch-badge-hero' + (allLit ? " lit" : "") + '">' +
    '<div class="sch-badge-big">' + (allLit ? "🏆" : "🎯") + '</div>' +
    '<div class="sch-badge-big-info">' +
      '<h3>' + schEsc(les.title) + (allLit ? ' · 已全部点亮！' : '') + '</h3>' +
      '<div class="sch-badge-bar"><span style="width:' + pct + '%"></span></div>' +
      '<span class="sch-badge-sub">已点亮 <b>' + done + '</b> / ' + total + ' 枚题目徽章 · 做完一题点「标记已学会」就会点亮一枚</span>' +
    '</div></div>';
  html += '<div class="sch-bgroups">';
  les.groups.forEach(function(g){
    var items = les.problems.filter(function(p){ return p.grp === g.id; });
    var dn = items.filter(function(p){ return st.mastered[p.id]; }).length;
    var all = dn === items.length && items.length > 0;
    html += '<span class="sch-bgroup' + (all ? " done" : "") + '">' + (all ? "🏅 " : "○ ") + schEsc(g.name.replace(/^第[一二三四五]组 · /, "")) + ' ' + dn + '/' + items.length + '</span>';
  });
  html += '</div>';
  html += '<div class="sch-bgrid">';
  les.problems.forEach(function(p){
    var m = !!st.mastered[p.id];
    html += '<button class="sch-badge' + (m ? " lit" : "") + '" type="button" onclick="schBadgeOpen(\'' + p.id + '\')" title="' + schEsc(p.name + " " + p.title) + '">' +
      '<span class="sch-badge-ico">' + (m ? "🏅" : "🔒") + '</span>' +
      '<span class="sch-badge-no">' + schEsc(p.no) + '</span>' +
      '<span class="sch-badge-t">' + schEsc(p.title) + '</span>' +
      '<span class="sch-badge-s">' + (m ? "已点亮" : "待点亮") + '</span>' +
    '</button>';
  });
  html += '</div>';
  html += '<div class="sch-actions"><button class="sch-btn primary" type="button" onclick="schRandomQuiz()">🎲 抽一题考我</button>' +
    '<span class="sch-quiz-tip">从还没点亮的题里随机抽一道，当场做一遍</span></div>';
  box.innerHTML = html;
}
function schBadgeOpen(id){ schSwitchView(0); schOpen(id); }
function schRandomQuiz(){
  var st = schState();
  var ps = schProblems().filter(function(p){ return !st.mastered[p.id]; });
  if (!ps.length) ps = schProblems();
  if (!ps.length) return;
  var p = ps[Math.floor(Math.random() * ps.length)];
  schSwitchView(0);
  schOpen(p.id);
  schToast("考你这道：" + p.name + " " + p.title);
}

/* ---------- 投稿箱（格式不限，粘进来由 AI 处理成正式课时） ---------- */
function schInboxLoad(){
  try {
    var v = JSON.parse(localStorage.getItem(SCH_INBOX_KEY));
    if (Array.isArray(v)) return v;
  } catch(e){}
  return [];
}
function schInboxSave(list){
  try { localStorage.setItem(SCH_INBOX_KEY, JSON.stringify(list)); } catch(e){}
}
function schInboxAdd(){
  var ta = document.getElementById("schInboxText");
  var src = document.getElementById("schInboxSrc");
  var text = ta ? ta.value.trim() : "";
  if (!text){ schToast("先把网址内容粘进来再存"); return; }
  var list = schInboxLoad();
  list.push({ t: Date.now(), src: src ? src.value.trim() : "", text: text });
  schInboxSave(list);
  ta.value = ""; if (src) src.value = "";
  schRenderInbox();
  schToast("✅ 已存入投稿箱（会自动随备份上云），共 " + list.length + " 条");
}
function schInboxDel(i){
  if (!confirm("删除这条投稿？")) return;
  var list = schInboxLoad();
  list.splice(i, 1);
  schInboxSave(list);
  schRenderInbox();
}
function schInboxCopyAll(){
  var list = schInboxLoad();
  if (!list.length){ schToast("投稿箱还是空的"); return; }
  var parts = list.map(function(it, i){
    var d = new Date(it.t);
    var pad = function(n){ return (n < 10 ? "0" : "") + n; };
    var t = d.getFullYear() + "-" + pad(d.getMonth()+1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes());
    return "【投稿 " + (i+1) + "】" + t + (it.src ? "（来源：" + it.src + "）" : "") + "\n" + it.text;
  });
  var text = "以下是学校练习投稿箱的全部内容，请帮我整理成正式课时：\n\n" + parts.join("\n\n———\n\n");
  try {
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(function(){ schToast("已复制全部投稿，发给 AI 即可"); }, function(){ schCopyFallback(text); });
    } else { schCopyFallback(text); }
  } catch(e){ schCopyFallback(text); }
}
function schRenderInbox(){
  var box = document.getElementById("schInbox");
  if (!box) return;
  var list = schInboxLoad();
  var html = '<div class="sch-inbox-box">' +
    '<div class="sch-inbox-tip">📥 <b>格式不限</b>：在平板/电脑上把网址内容全选复制，整段粘到这里存档（自动随备份上云）。攒好后到电脑上点「复制全部投稿」发给 AI，我来整理成下一课。</div>' +
    '<div class="sch-inbox-src"><input type="text" id="schInboxSrc" placeholder="来源网址（选填）" autocomplete="off"></div>' +
    '<textarea class="sch-inbox-ta" id="schInboxText" rows="7" placeholder="把网址内容整段粘贴到这里…&#10;&#10;推荐格式（照着填处理更快，格式不一致也没关系）：&#10;【题目】启蒙0601 【例6.1】标题&#10;描述：……&#10;输入：…… 输出：……&#10;【解答】（代码直接粘）&#10;【解析】要点、口诀、易错……"></textarea>' +
    '<div class="sch-actions" style="margin-top:10px;">' +
      '<button class="sch-btn primary" type="button" onclick="schInboxAdd()">📥 存入投稿箱</button>' +
      '<button class="sch-btn ghost" type="button" onclick="schInboxCopyAll()">📋 复制全部投稿（发给 AI）</button>' +
      '<button class="sch-btn ghost" type="button" onclick="schRenderInbox()">刷新</button>' +
    '</div></div>';
  html += '<div class="sch-inbox-list-sec"><div class="sch-sec-title">📮 已存投稿（' + list.length + ' 条）</div>';
  if (!list.length){
    html += '<div class="sch-empty">还没有投稿。在平板上学完、看到好内容，随手粘进来就行。</div>';
  } else {
    html += '<div class="sch-inbox-list">';
    list.forEach(function(it, i){
      var d = new Date(it.t);
      var pad = function(n){ return (n < 10 ? "0" : "") + n; };
      var t = pad(d.getMonth()+1) + "月" + pad(d.getDate()) + "日 " + pad(d.getHours()) + ":" + pad(d.getMinutes());
      var prev = it.text.replace(/\s+/g, " ").slice(0, 60);
      html += '<div class="sch-inbox-item"><span class="sch-inbox-no">' + (i+1) + '</span>' +
        '<span class="sch-inbox-prev">' + schEsc(prev) + (it.text.length > 60 ? "…" : "") + '</span>' +
        '<span class="sch-inbox-time">' + t + '</span>' +
        '<button class="sch-btn danger sch-btn-s2" type="button" onclick="schInboxDel(' + i + ')">删除</button></div>';
    });
    html += '</div>';
  }
  html += '</div>';
  box.innerHTML = html;
}

/* ---------- 初始化 ---------- */
function schInit(){
  schRenderTabs();
  var st = schState();
  if (!SCH_ACTIVE_ID){
    if (st.last && (st.last === "primer" || st.last === "sheet" || schFind(st.last))){
      SCH_ACTIVE_ID = st.last;
    } else if (schProblems().length){
      SCH_ACTIVE_ID = schProblems()[0].id;
    }
  }
  schRenderList();
  schRenderStats();
  schRenderDetail();
  schRenderBadges();
  schRenderInbox();
}
if (document.readyState === "loading"){
  window.addEventListener("DOMContentLoaded", schInit);
} else {
  schInit();
}
