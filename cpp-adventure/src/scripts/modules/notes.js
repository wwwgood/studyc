/* ---------------- 重要消息 notes.js ----------------
 * 录入重要安排/消息来源，挂接科目（信息学/数学/英语/语文/其他），
 * 按预计时间提前触发提醒。
 * 数据存 localStorage["importantNotes"]，随「☁️ 同步」跨设备。
 * 提醒机制：打开页面时检查 + 每30分钟检查一次（页面开着才有效，纯前端无后台推送）。
 */
var NOTES_KEY = "importantNotes";
var NOTE_SUBJECTS = [
  { id: "cpp", name: "信息学", emoji: "💻" },
  { id: "math", name: "数学", emoji: "🧮" },
  { id: "english", name: "英语", emoji: "🔤" },
  { id: "chinese", name: "语文", emoji: "📖" },
  { id: "other", name: "其他", emoji: "📌" }
];
var NT_EDIT_ID = null;
var NT_REMINDED = {};

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

/* 预置示例（仅第一次使用时写入一次） */
function ntDefaults(){
  return [
    { id: "nt_def1", subjects: ["chinese", "math"], title: "纪中少科院考试", content: "以前是考语文数学，奥数题18题", eventDate: "2026-09-13", timeNote: "", remindDays: 3, done: false, created: Date.now() },
    { id: "nt_def2", subjects: ["cpp"], title: "信息学选拔", content: "我知道的连续4年都是四年级第二学期考", eventDate: "", timeNote: "四年级第二学期（约2027年5月）", remindDays: 7, done: false, created: Date.now() }
  ];
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
  if (left === null) return '<span class="nt-due none">⏳ ' + (it.timeNote || "未设日期") + '</span>';
  if (left < 0) return '<span class="nt-due over">⚠️ 已过 ' + (-left) + ' 天</span>';
  if (left === 0) return '<span class="nt-due today">🔥 就是今天！</span>';
  return '<span class="nt-due soon">📅 还有 ' + left + ' 天</span>';
}

/* 是否处于提醒窗口：未完成 + 有日期 + 已进入提前期（过期未完成也持续提醒） */
function ntIsDue(it){
  if (it.done) return false;
  var left = ntDaysLeft(it.eventDate);
  if (left === null) return false;
  var rd = typeof it.remindDays === "number" ? it.remindDays : 3;
  return left <= rd;
}

/* ---------- 弹窗 UI ---------- */
function ntOpen(){
  var mask = document.getElementById("ntDialogMask");
  if (!mask) return;
  mask.classList.add("open");
  document.body.style.overflow = "hidden";
  NT_EDIT_ID = null;
  ntRender();
}

function ntClose(){
  var mask = document.getElementById("ntDialogMask");
  if (mask) mask.classList.remove("open");
  document.body.style.overflow = "";
  NT_EDIT_ID = null;
  ntRenderBanner();
}

function ntRender(){
  var dialog = document.getElementById("ntDialog");
  if (!dialog) return;
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

  var remindOpts = [[0, "当天才提醒"], [1, "提前1天"], [3, "提前3天"], [7, "提前7天"], [14, "提前14天"], [30, "提前30天"]].map(function(p){
    var rd = typeof f.remindDays === "number" ? f.remindDays : 3;
    return '<option value="' + p[0] + '"' + (rd === p[0] ? " selected" : "") + '>' + p[1] + '</option>';
  }).join("");

  var html =
    '<div class="nt-head">' +
      '<span class="nt-title">📌 重要消息</span>' +
      '<button class="nt-close" type="button" onclick="ntClose()">×</button>' +
    '</div>' +
    '<div class="nt-body">' +
      '<div class="nt-form">' +
        '<div class="nt-form-cap">' + formTitle + '</div>' +
        '<input class="nt-f-title" id="ntFTitle" type="text" placeholder="标题（必填），如：纪中少科院考试" value="' + (f.title || "").replace(/"/g, "&quot;") + '" maxlength="60">' +
        '<textarea class="nt-f-content" id="ntFContent" rows="3" placeholder="内容/来源详情，如：以前是考语文数学，奥数题18题">' + (f.content || "") + '</textarea>' +
        '<div class="nt-form-row"><label>挂接科目：</label>' + subjectChecks + '</div>' +
        '<div class="nt-form-row">' +
          '<label>预计时间：</label><input class="nt-f-date" id="ntFDate" type="date" value="' + (f.eventDate || "") + '">' +
          '<input class="nt-f-timenote" id="ntFTimeNote" type="text" placeholder="日期不确切时的文字说明，如：四年级第二学期" value="' + (f.timeNote || "").replace(/"/g, "&quot;") + '">' +
        '</div>' +
        '<div class="nt-form-row"><label>提前提醒：</label><select class="nt-f-remind" id="ntFRemind">' + remindOpts + '</select>' +
          '<span class="nt-tip">打开网页时自动检查并弹提醒（页面开着每30分钟检查一次）</span></div>' +
        '<div class="nt-form-btns">' +
          '<button class="nt-save-btn" type="button" onclick="ntSubmit()">' + (NT_EDIT_ID ? "💾 保存修改" : "✅ 添加") + '</button>' +
          (NT_EDIT_ID ? '<button class="nt-cancel-btn" type="button" onclick="ntCancelEdit()">取消</button>' : '') +
        '</div>' +
      '</div>' +
      '<div class="nt-list-cap">📋 全部消息（' + list.length + ' 条）</div>' +
      '<div class="nt-list">' +
        (list.length === 0 ? '<div class="nt-empty">还没有重要消息，先在上面录入一条吧！</div>' :
        list.map(function(it, idx){
          return '<div class="nt-item' + (it.done ? " done" : "") + (ntIsDue(it) ? " due" : "") + '">' +
            '<div class="nt-item-head">' +
              '<span class="nt-item-title">' + (it.done ? "✅ " : "") + it.title + '</span>' +
              ntDueBadge(it) +
            '</div>' +
            (it.content ? '<div class="nt-item-content">' + it.content.replace(/\n/g, "<br>") + '</div>' : "") +
            '<div class="nt-item-foot">' +
              '<span class="nt-item-subs">' + ntSubjectBadges(it.subjects) + '</span>' +
              '<span class="nt-item-ops">' +
                (it.done ? "" : '<button class="nt-op done" type="button" onclick="ntToggleDone(\'' + it.id + '\')">✔️ 完成</button>') +
                '<button class="nt-op" type="button" onclick="ntEdit(\'' + it.id + '\')">✏️ 编辑</button>' +
                '<button class="nt-op del" type="button" onclick="ntDel(\'' + it.id + '\')">🗑️</button>' +
              '</span>' +
            '</div>' +
          '</div>';
        }).join("")) +
      '</div>' +
    '</div>';
  dialog.innerHTML = html;
}

function ntSubmit(){
  var titleEl = document.getElementById("ntFTitle");
  var title = titleEl ? titleEl.value.trim() : "";
  if (!title){ alert("请先填写标题"); return; }
  var content = (document.getElementById("ntFContent") || {}).value || "";
  var date = (document.getElementById("ntFDate") || {}).value || "";
  var timeNote = (document.getElementById("ntFTimeNote") || {}).value || "";
  var remind = parseInt((document.getElementById("ntFRemind") || {}).value, 10);
  if (isNaN(remind)) remind = 3;
  var subs = [];
  var checks = document.querySelectorAll(".nt-f-sub");
  for (var i = 0; i < checks.length; i++){
    if (checks[i].checked) subs.push(checks[i].value);
  }
  var list = ntState();
  if (NT_EDIT_ID){
    for (var j = 0; j < list.length; j++){
      if (list[j].id === NT_EDIT_ID){
        list[j].title = title; list[j].content = content; list[j].subjects = subs;
        list[j].eventDate = date; list[j].timeNote = timeNote; list[j].remindDays = remind;
      }
    }
    NT_EDIT_ID = null;
  } else {
    list.push({ id: "nt" + Date.now() + Math.floor(Math.random() * 1000), title: title, content: content, subjects: subs, eventDate: date, timeNote: timeNote, remindDays: remind, done: false, created: Date.now() });
  }
  ntSave(list);
  ntRender();
  ntRenderBanner();
  ntRefreshTopBtn();
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
  ntRefreshTopBtn();
}

function ntEdit(id){
  NT_EDIT_ID = id;
  ntRender();
  var dialog = document.getElementById("ntDialog");
  if (dialog) dialog.scrollTop = 0;
}

function ntDel(id){
  if (!confirm("确定删除这条消息？")) return;
  var list = ntState().filter(function(it){ return it.id !== id; });
  ntSave(list);
  if (NT_EDIT_ID === id) NT_EDIT_ID = null;
  ntRender();
  ntRenderBanner();
  ntRefreshTopBtn();
}

/* ---------- 提醒横幅（弹窗外部，页面顶部常驻） ---------- */
function ntRenderBanner(){
  var box = document.getElementById("ntBanner");
  if (!box) return;
  var due = ntState().filter(ntIsDue);
  if (due.length === 0){ box.innerHTML = ""; box.style.display = "none"; return; }
  due.sort(function(a, b){ return (ntDaysLeft(a.eventDate) || 0) - (ntDaysLeft(b.eventDate) || 0); });
  var html = '<div class="nt-banner-inner">' +
    '<span class="nt-banner-cap">🔔 重要提醒</span>' +
    due.map(function(it){
      var left = ntDaysLeft(it.eventDate);
      var when = left === 0 ? "今天" : (left < 0 ? "已过" + (-left) + "天" : left + "天后");
      return '<span class="nt-banner-item" onclick="ntOpen()" title="点击查看详情">' +
        '<b>' + it.title + '</b> · ' + when + ' · ' + ntSubjectBadges(it.subjects) + '</span>';
    }).join("") +
    '<button class="nt-banner-close" type="button" onclick="ntDismissBanner()" title="本次暂不显示">×</button>' +
  '</div>';
  box.innerHTML = html;
  box.style.display = "block";
}

var NT_DISMISS_KEY = "ntBannerDismissed";
function ntDismissBanner(){
  var box = document.getElementById("ntBanner");
  if (box) box.style.display = "none";
  try { sessionStorage.setItem(NT_DISMISS_KEY, "1"); } catch(e){}
}

/* 顶栏按钮红点 */
function ntRefreshTopBtn(){
  var btn = document.getElementById("portalNotesBtn");
  if (!btn) return;
  var due = ntState().filter(ntIsDue).length;
  btn.textContent = due > 0 ? "📌 消息🔴" + due : "📌 消息";
}

/* ---------- 提醒检查 ---------- */
function ntCheck(){
  var due = ntState().filter(ntIsDue);
  var fresh = due.filter(function(it){ return !NT_REMINDED[it.id]; });
  if (fresh.length === 0) return;
  fresh.forEach(function(it){ NT_REMINDED[it.id] = true; });
  var canBanner = true;
  try { if (sessionStorage.getItem(NT_DISMISS_KEY) === "1") canBanner = false; } catch(e){}
  if (canBanner) ntRenderBanner();
  ntRefreshTopBtn();
}

window.addEventListener("load", function(){
  ntCheck();
  setInterval(ntCheck, 30 * 60 * 1000);
});