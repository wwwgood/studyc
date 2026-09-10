/* ---------------- 重要消息 notes.js ----------------
 * 录入重要安排/消息，挂接科目，支持「日历式」定时提醒：
 *   不提醒 / 只提醒一次(指定日期+时间) / 每天 / 工作日(周一~五) / 休息日(周六日)
 * 到点会：弹提示框 + 系统通知(需授权) + 震动。
 * 数据存 localStorage["importantNotes"]，随「☁️ 同步」跨设备。
 *
 * 提醒机制说明（重要）：
 *   纯前端、无服务端推送。只有「页面开着」时才会检查并触发提醒；
 *   关掉网页 / 平板锁屏 / 浏览器被系统回收后，无法触发。
 *   每 30 秒检查一次；一次性提醒若错过超过 12 小时，不再补提醒。
 *   安卓平板：Chrome/Edge 浏览器可弹提示框；授权后还能弹系统通知；
 *   建议「添加到主屏幕」当 PWA 用，体验更接近 App。
 */
var NOTES_KEY = "importantNotes";
var NOTE_SUBJECTS = [
  { id: "cpp", name: "信息学", emoji: "💻" },
  { id: "math", name: "数学", emoji: "🧮" },
  { id: "english", name: "英语", emoji: "🔤" },
  { id: "chinese", name: "语文", emoji: "📖" },
  { id: "other", name: "其他", emoji: "📌" }
];
var NT_REMIND_MODES = [
  { id: "none", name: "不提醒", emoji: "🔕" },
  { id: "once", name: "只提醒一次", emoji: "⏰" },
  { id: "daily", name: "每天", emoji: "🔄" },
  { id: "weekday", name: "工作日（周一~五）", emoji: "💼" },
  { id: "weekend", name: "休息日（周六日）", emoji: "🏖️" }
];
var NT_EDIT_ID = null;
var NT_FIRE_QUEUE = [];
var NT_DIALOG_OPEN = false;

function ntState(){
  var raw = null;
  try { raw = localStorage.getItem(NOTES_KEY); } catch(e){}
  if (raw === null){
    var list = ntDefaults();
    ntSave(list);
    return list;
  }
  try { return JSON.parse(raw) || []; } catch(e){ return []; }
}

function ntSave(list){
  try { localStorage.setItem(NOTES_KEY, JSON.stringify(list)); } catch(e){}
}

function ntDefaults(){
  return [
    { id: "nt_def1", subjects: ["chinese", "math"], title: "纪中少科院考试", content: "以前是考语文数学，奥数题18题", eventDate: "2026-09-13", timeNote: "", remindMode: "once", remindDate: "2026-09-13", remindTime: "08:00", lastFired: "", done: false, created: Date.now() },
    { id: "nt_def2", subjects: ["cpp"], title: "信息学选拔", content: "我知道的连续4年都是四年级第二学期考", eventDate: "", timeNote: "四年级第二学期（约2027年5月）", remindMode: "none", remindTime: "09:00", remindDate: "", lastFired: "", done: false, created: Date.now() }
  ];
}

function ntEsc(s){
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function ntSubjectBadges(subs){
  return (subs || []).map(function(id){
    for (var i = 0; i < NOTE_SUBJECTS.length; i++){
      if (NOTE_SUBJECTS[i].id === id) return '<span class="nt-sub-badge">' + NOTE_SUBJECTS[i].emoji + NOTE_SUBJECTS[i].name + '</span>';
    }
    return "";
  }).join("");
}

function ntParseDate(s){
  var m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s || "");
  if (!m) return null;
  return new Date(+m[1], +m[2] - 1, +m[3]);
}

function ntDaysLeft(s){
  var d = ntParseDate(s);
  if (!d) return null;
  var t = new Date();
  t.setHours(0, 0, 0, 0);
  return Math.round((d - t) / 86400000);
}

function ntDueBadge(it){
  var left = ntDaysLeft(it.eventDate);
  if (left === null) return '<span class="nt-due none">⏳ ' + ntEsc(it.timeNote || "未设日期") + '</span>';
  if (left < 0) return '<span class="nt-due over">⚠️ 已过 ' + (-left) + ' 天</span>';
  if (left === 0) return '<span class="nt-due today">🔥 就是今天！</span>';
  return '<span class="nt-due soon">📅 还有 ' + left + ' 天</span>';
}

/* ---------- 定时提醒：解析与计算 ---------- */
function ntParseTime(s){
  var m = /^(\d{1,2}):(\d{2})$/.exec(s || "");
  if (!m) return null;
  var h = +m[1], mi = +m[2];
  if (h < 0 || h > 23 || mi < 0 || mi > 59) return null;
  return { h: h, m: mi };
}

function ntModeLabel(mode){
  for (var i = 0; i < NT_REMIND_MODES.length; i++){ if (NT_REMIND_MODES[i].id === mode) return NT_REMIND_MODES[i].name; }
  return "不提醒";
}

function ntRemindLabel(it){
  var mode = it.remindMode || "none";
  if (mode === "none") return "";
  var t = it.remindTime || "";
  if (mode === "once") return "⏰ " + (it.remindDate || "未设日期") + " " + t;
  if (mode === "daily") return "🔄 每天 " + t;
  if (mode === "weekday") return "💼 工作日 " + t;
  if (mode === "weekend") return "🏖️ 休息日 " + t;
  return "";
}

/* 计算下一次触发时间：返回 { at: 时间戳, key: 去重键 } 或 null */
function ntNextFire(it){
  if (!it || it.done) return null;
  var mode = it.remindMode || "none";
  if (mode === "none") return null;
  var t = ntParseTime(it.remindTime);
  if (!t) return null;
  var now = new Date();
  if (mode === "once"){
    var d = ntParseDate(it.remindDate);
    if (!d) return null;
    d.setHours(t.h, t.m, 0, 0);
    return { at: d.getTime(), key: "once:" + it.id };
  }
  var dow = now.getDay();
  var matches = (mode === "daily") ||
    (mode === "weekday" && dow >= 1 && dow <= 5) ||
    (mode === "weekend" && (dow === 0 || dow === 6));
  if (!matches) return null;
  var todayAt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), t.h, t.m, 0, 0);
  return { at: todayAt.getTime(), key: todayAt.toDateString() };
}

/* 保存时：若本次触发点已过，则标记为已触发，避免刚存就立刻弹 */
function ntSuppressIfPast(it){
  var f = ntNextFire(it);
  it.lastFired = (f && Date.now() >= f.at) ? f.key : "";
}

/* 今天待提醒（未触发） */
function ntTodayPending(){
  var now = new Date();
  return ntState().filter(function(it){
    if (it.done) return false;
    var f = ntNextFire(it);
    if (!f) return false;
    if (it.lastFired === f.key) return false;
    var d = new Date(f.at);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  });
}

/* ---------- 视图入口 ---------- */
function ntOpen(){
  location.hash = "#/notes";
}

function ntOnEnter(){
  NT_EDIT_ID = null;
  ntRender();
  ntRenderBanner();
  ntRefreshNavBadge();
}

/* ---------- 页面渲染 ---------- */
function ntRender(){
  var container = document.getElementById("ntPageContent");
  if (!container) return;
  var list = ntState().slice();
  list.sort(function(a, b){
    if (!!a.done !== !!b.done) return a.done ? 1 : -1;
    var la = ntDaysLeft(a.eventDate), lb = ntDaysLeft(b.eventDate);
    if (la === null && lb === null) return (b.created || 0) - (a.created || 0);
    if (la === null) return 1;
    if (lb === null) return -1;
    return la - lb;
  });

  var formTitle = NT_EDIT_ID ? "✏️ 编辑消息" : "➕ 录入重要消息";
  var editItem = null;
  if (NT_EDIT_ID){
    for (var i = 0; i < list.length; i++){ if (list[i].id === NT_EDIT_ID){ editItem = list[i]; break; } }
  }
  var f = editItem || {};

  var subjectChecks = NOTE_SUBJECTS.map(function(s){
    var on = (f.subjects || []).indexOf(s.id) >= 0;
    return '<label class="nt-sub-check"><input type="checkbox" class="nt-f-sub" value="' + s.id + '"' + (on ? " checked" : "") + '> ' + s.emoji + s.name + '</label>';
  }).join("");

  var mode = f.remindMode || "none";
  var modeOpts = NT_REMIND_MODES.map(function(m){
    return '<option value="' + m.id + '"' + (mode === m.id ? " selected" : "") + '>' + m.emoji + ' ' + m.name + '</option>';
  }).join("");
  var showTime = mode !== "none";
  var showDate = mode === "once";
  var rTime = f.remindTime || "09:00";
  var rDate = f.remindDate || "";

  var pending = ntTodayPending();

  var html =
    '<div class="nt-page">' +
      '<div class="nt-form">' +
        '<div class="nt-form-cap">' + formTitle + '</div>' +
        '<input class="nt-f-title" id="ntFTitle" type="text" placeholder="标题（必填），如：纪中少科院考试" value="' + ntEsc(f.title || "") + '" maxlength="60">' +
        '<textarea class="nt-f-content" id="ntFContent" rows="4" placeholder="内容/来源详情，如：以前是考语文数学，奥数题18题">' + ntEsc(f.content || "") + '</textarea>' +
        '<div class="nt-form-row"><label>挂接科目：</label>' + subjectChecks + '</div>' +
        '<div class="nt-form-row">' +
          '<label>预计时间：</label><input class="nt-f-date" id="ntFEventDate" type="date" value="' + (f.eventDate || "") + '">' +
          '<input class="nt-f-timenote" id="ntFTimeNote" type="text" placeholder="日期不确切时的文字说明，如：四年级第二学期" value="' + ntEsc(f.timeNote || "") + '">' +
        '</div>' +
        '<div class="nt-form-row">' +
          '<label>定时提醒：</label>' +
          '<select class="nt-f-mode" id="ntFMode" onchange="ntModeChanged()">' + modeOpts + '</select>' +
          '<input class="nt-f-time" id="ntFTime" type="time" value="' + rTime + '"' + (showTime ? '' : ' style="display:none"') + '>' +
          '<input class="nt-f-reminddate" id="ntFRemindDate" type="date" value="' + rDate + '"' + (showDate ? '' : ' style="display:none"') + '>' +
        '</div>' +
        '<div class="nt-form-row"><span class="nt-tip">💡 到点会弹提示框 + 系统通知（首次保存时请点「允许」）。⚠️ 只有页面开着时才有效，关掉网页/锁屏无法触发；建议「添加到主屏幕」当 App 用。</span></div>' +
        '<div class="nt-form-btns">' +
          '<button class="nt-save-btn" type="button" onclick="ntSubmit()">' + (NT_EDIT_ID ? "💾 保存修改" : "✅ 添加") + '</button>' +
          (NT_EDIT_ID ? '<button class="nt-cancel-btn" type="button" onclick="ntCancelEdit()">取消</button>' : '') +
        '</div>' +
      '</div>' +
      '<div class="nt-list-cap">📋 全部消息（' + list.length + ' 条' + (pending.length > 0 ? ' · 🔔 今日待提醒 ' + pending.length + ' 条' : '') + '）</div>' +
      '<div class="nt-list">' +
        (list.length === 0 ? '<div class="nt-empty">还没有重要消息，先在上面录入一条吧！</div>' :
        list.map(function(it){
          return '<div class="nt-item' + (it.done ? " done" : "") + (ntTodayPending().indexOf(it) >= 0 ? " due" : "") + '">' +
            '<div class="nt-item-head">' +
              '<span class="nt-item-title">' + (it.done ? "✅ " : "") + ntEsc(it.title) + '</span>' +
              ntDueBadge(it) +
            '</div>' +
            (it.content ? '<div class="nt-item-content">' + ntEsc(it.content).replace(/\n/g, "<br>") + '</div>' : "") +
            (it.remindMode && it.remindMode !== "none" ? '<div class="nt-item-remind">🔔 ' + ntEsc(ntRemindLabel(it)) + '</div>' : "") +
            '<div class="nt-item-foot">' +
              '<span class="nt-item-subs">' + ntSubjectBadges(it.subjects) + '</span>' +
              '<span class="nt-item-ops">' +
                (it.done ? '<button class="nt-op" type="button" onclick="ntToggleDone(\'' + it.id + '\')">↩️ 取消完成</button>' : '<button class="nt-op done" type="button" onclick="ntToggleDone(\'' + it.id + '\')">✔️ 完成</button>') +
                '<button class="nt-op" type="button" onclick="ntEdit(\'' + it.id + '\')">✏️ 编辑</button>' +
                '<button class="nt-op del" type="button" onclick="ntDel(\'' + it.id + '\')">🗑️</button>' +
              '</span>' +
            '</div>' +
          '</div>';
        }).join("")) +
      '</div>' +
    '</div>';
  container.innerHTML = html;
}

function ntModeChanged(){
  var m = document.getElementById("ntFMode");
  if (!m) return;
  var mode = m.value;
  var time = document.getElementById("ntFTime");
  var date = document.getElementById("ntFRemindDate");
  if (time) time.style.display = (mode === "none") ? "none" : "";
  if (date) date.style.display = (mode === "once") ? "" : "none";
}

function ntSubmit(){
  var titleEl = document.getElementById("ntFTitle");
  var title = titleEl ? titleEl.value.trim() : "";
  if (!title){ alert("请先填写标题"); return; }
  var content = (document.getElementById("ntFContent") || {}).value || "";
  var date = (document.getElementById("ntFEventDate") || {}).value || "";
  var timeNote = (document.getElementById("ntFTimeNote") || {}).value || "";
  var mode = (document.getElementById("ntFMode") || {}).value || "none";
  var rTime = (document.getElementById("ntFTime") || {}).value || "";
  var rDate = (document.getElementById("ntFRemindDate") || {}).value || "";
  if (mode !== "none" && !ntParseTime(rTime)){ alert("请设置提醒时间"); return; }
  if (mode === "once" && !ntParseDate(rDate)){ alert("「只提醒一次」需要选择提醒日期"); return; }
  var subs = [];
  var checks = document.querySelectorAll(".nt-f-sub");
  for (var i = 0; i < checks.length; i++){
    if (checks[i].checked) subs.push(checks[i].value);
  }
  var list = ntState();
  var it = null;
  if (NT_EDIT_ID){
    for (var j = 0; j < list.length; j++){
      if (list[j].id === NT_EDIT_ID){ it = list[j]; break; }
    }
    NT_EDIT_ID = null;
  }
  if (!it){
    it = { id: "nt" + Date.now() + Math.floor(Math.random() * 1000), done: false, created: Date.now(), lastFired: "" };
    list.push(it);
  }
  it.title = title; it.content = content; it.subjects = subs;
  it.eventDate = date; it.timeNote = timeNote;
  it.remindMode = mode; it.remindTime = rTime; it.remindDate = rDate;
  ntSuppressIfPast(it);
  delete it.remindDays;
  ntSave(list);
  if (mode !== "none") ntAskNotify();
  ntRender();
  ntRenderBanner();
  ntRefreshNavBadge();
}

function ntCancelEdit(){
  NT_EDIT_ID = null;
  ntRender();
}

function ntToggleDone(id){
  var list = ntState();
  for (var i = 0; i < list.length; i++){
    if (list[i].id === id) list[i].done = !list[i].done;
  }
  ntSave(list);
  ntRender();
  ntRenderBanner();
  ntRefreshNavBadge();
}

function ntEdit(id){
  NT_EDIT_ID = id;
  ntRender();
  window.scrollTo(0, 0);
}

function ntDel(id){
  if (!confirm("确定删除这条消息？")) return;
  var list = ntState().filter(function(it){ return it.id !== id; });
  ntSave(list);
  if (NT_EDIT_ID === id) NT_EDIT_ID = null;
  ntRender();
  ntRenderBanner();
  ntRefreshNavBadge();
}

/* ---------- 提醒弹框 ---------- */
function ntEnsureRemindUI(){
  if (document.getElementById("ntRemindMask")) return;
  var mask = document.createElement("div");
  mask.id = "ntRemindMask";
  mask.className = "nt-remind-mask";
  var box = document.createElement("div");
  box.id = "ntRemindBox";
  box.className = "nt-remind-box";
  box.setAttribute("role", "alertdialog");
  box.setAttribute("aria-modal", "true");
  mask.appendChild(box);
  document.body.appendChild(mask);
}

function ntFire(it){
  NT_FIRE_QUEUE.push(it);
  ntSystemNotify(it);
  try { if (navigator.vibrate) navigator.vibrate([200, 100, 200]); } catch(e){}
  if (!NT_DIALOG_OPEN) ntShowNextRemind();
}

function ntShowNextRemind(){
  if (NT_FIRE_QUEUE.length === 0){ NT_DIALOG_OPEN = false; return; }
  NT_DIALOG_OPEN = true;
  ntEnsureRemindUI();
  var it = NT_FIRE_QUEUE.shift();
  var mask = document.getElementById("ntRemindMask");
  var box = document.getElementById("ntRemindBox");
  if (!mask || !box) return;
  box.innerHTML =
    '<div class="nt-remind-cap">🔔 重要提醒</div>' +
    '<div class="nt-remind-title">' + ntEsc(it.title) + '</div>' +
    (it.content ? '<div class="nt-remind-content">' + ntEsc(it.content).replace(/\n/g, "<br>") + '</div>' : "") +
    '<div class="nt-remind-subs">' + ntSubjectBadges(it.subjects) + '</div>' +
    '<div class="nt-remind-ops">' +
      '<button class="nt-remind-btn view" type="button" onclick="ntGoView()">查看详情</button>' +
      '<button class="nt-remind-btn ok" type="button" onclick="ntCloseRemind()">知道了</button>' +
    '</div>';
  mask.classList.add("open");
}

function ntCloseRemind(){
  var mask = document.getElementById("ntRemindMask");
  if (mask) mask.classList.remove("open");
  setTimeout(ntShowNextRemind, 150);
}

function ntGoView(){
  var mask = document.getElementById("ntRemindMask");
  if (mask) mask.classList.remove("open");
  NT_FIRE_QUEUE = [];
  NT_DIALOG_OPEN = false;
  ntOpen();
}

/* ---------- 系统通知 ---------- */
function ntAskNotify(){
  if (!("Notification" in window)) return;
  try { if (Notification.permission === "default") Notification.requestPermission(); } catch(e){}
}

function ntSystemNotify(it){
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    var n = new Notification("🔔 " + it.title, {
      body: it.content || "到点提醒",
      tag: it.id + "-" + (it.lastFired || ""),
      renotify: true
    });
    setTimeout(function(){ n.close(); }, 20000);
    n.onclick = function(){ try { window.focus(); } catch(e){} ntOpen(); n.close(); };
  } catch(e){}
}

/* ---------- 今日提醒横幅 ---------- */
function ntRenderBanner(){
  var box = document.getElementById("ntBanner");
  if (!box) return;
  var pending = ntTodayPending();
  if (pending.length === 0){ box.innerHTML = ""; box.style.display = "none"; return; }
  pending.sort(function(a, b){
    var fa = ntNextFire(a), fb = ntNextFire(b);
    return (fa ? fa.at : 0) - (fb ? fb.at : 0);
  });
  var html = '<div class="nt-banner-inner">' +
    '<span class="nt-banner-cap">🔔 今日待提醒</span>' +
    pending.map(function(it){
      var t = it.remindTime ? it.remindTime + " " : "";
      return '<span class="nt-banner-item" onclick="ntOpen()" title="点击查看详情">' +
        '<b>' + (it.remindTime ? it.remindTime : "") + '</b> ' + ntEsc(it.title) + '</span>';
    }).join("") +
    '<button class="nt-banner-close" type="button" onclick="ntDismissBanner()" title="本次暂不显示">×</button>' +
  '</div>';
  box.innerHTML = html;
  box.style.display = "block";
}

var NT_DISMISS_KEY = "ntBannerDismiss";
function ntDismissBanner(){
  var box = document.getElementById("ntBanner");
  if (box) box.style.display = "none";
  try { sessionStorage.setItem(NT_DISMISS_KEY, "1"); } catch(e){}
}

/* 导航栏红点：显示今日待提醒数量 */
function ntRefreshNavBadge(){
  var links = document.querySelectorAll('.portal-nav a[data-view="notes"]');
  var n = ntTodayPending().length;
  for (var i = 0; i < links.length; i++){
    if (n > 0){
      links[i].innerHTML = '📌 重要消息<span class="nt-nav-dot">' + n + '</span>';
    } else {
      links[i].innerHTML = '📌 重要消息';
    }
  }
}

/* ---------- 提醒检查：每 30 秒一次 ---------- */
function ntCheck(){
  var now = Date.now();
  var list = ntState();
  var changed = false;
  for (var i = 0; i < list.length; i++){
    var it = list[i];
    var f = ntNextFire(it);
    if (!f) continue;
    if (it.lastFired === f.key) continue;
    if (now < f.at) continue;
    var mode = it.remindMode || "none";
    if (mode === "once" && now - f.at > 12 * 3600 * 1000){
      /* 一次性提醒错过超过 12 小时，不再补弹 */
      it.lastFired = f.key; changed = true; continue;
    }
    it.lastFired = f.key;
    changed = true;
    ntFire(it);
  }
  if (changed) ntSave(list);
  ntRenderBanner();
  ntRefreshNavBadge();
}

window.addEventListener("load", function(){
  ntEnsureRemindUI();
  ntCheck();
  setInterval(ntCheck, 30 * 1000);
});
