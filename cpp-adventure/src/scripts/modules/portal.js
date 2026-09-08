/* ---------------- 门户 portal.js：学科视图路由与首页统计 ---------------- */
var PORTAL_VIEWS = ["home", "cpp", "english", "checkin", "notes"];
var PORTAL_KEY = "portalLastView";

function portalCurrentView(){
  var h = location.hash || "";
  if (h.indexOf("#/") === 0){
    var v = h.slice(2).split("?")[0];
    if (PORTAL_VIEWS.indexOf(v) >= 0) return v;
  }
  return null;
}

function portalApply(view, push){
  if (PORTAL_VIEWS.indexOf(view) < 0) view = "home";
  document.body.setAttribute("data-view", view);
  try { localStorage.setItem(PORTAL_KEY, view); } catch(e){}
  var links = document.querySelectorAll(".portal-nav a");
  for (var i = 0; i < links.length; i++){
    if (links[i].getAttribute("data-view") === view) links[i].setAttribute("aria-current", "true");
    else links[i].removeAttribute("aria-current");
  }
  /* 离开视图时收起全局浮层，避免残留遮挡 */
  try {
    if (typeof closeLevel === "function") closeLevel();
    if (typeof closeLogin === "function") closeLogin();
  } catch(e){}
  var fm = document.getElementById("focusMask");
  if (fm) fm.classList.remove("open");
  var ed = document.getElementById("eqDialogMask");
  if (ed) ed.classList.remove("open");
  /* 打卡家长锁联动 */
  if (typeof checkinOnViewChange === "function") checkinOnViewChange(view === "checkin");
  if (view === "english" && typeof eqOnEnter === "function") eqOnEnter();
  if (view === "notes" && typeof ntOnEnter === "function") ntOnEnter();
  if (view === "home") portalRenderHomeStats();
  portalRenderTopbar();
  window.scrollTo(0, 0);
  if (push && portalCurrentView() !== view){ location.hash = "#/" + view; }
}

function portalRoute(){
  var v = portalCurrentView();
  if (v){ portalApply(v, false); return; }
  /* 非 #/ hash（如 cpp 内部锚点 #map）不打断当前视图 */
  if (document.body.getAttribute("data-view")) return;
  var last = null;
  try { last = localStorage.getItem(PORTAL_KEY); } catch(e){}
  portalApply(last || "home", false);
}

/* ---------- 顶栏用户/金币显示 ---------- */
function portalRenderTopbar(){
  var ub = document.getElementById("portalUserBtn");
  if (ub && SDB.current) ub.textContent = "👤 " + SDB.current;
  var sb = document.getElementById("portalShopBtn");
  if (sb && typeof awTotalCoins === "function"){
    var c = awTotalCoins();
    sb.textContent = "🎁 奖品店 · 🪙" + c;
  }
}

/* ---------- 首页统计 ---------- */
function portalRenderHomeStats(){
  portalRenderTopbar();
  /* 指挥官名 */
  var w = document.getElementById("portalWelcome");
  if (w && SDB.current){
    w.innerHTML = '欢迎回来，<span class="hi">' + SDB.current.replace(/[<>&]/g, "") + '</span>！';
  }
  /* 信息学 */
  var sc = document.getElementById("pcStatCpp");
  if (sc && typeof starsOf === "function") sc.textContent = "★ " + starsOf() + " 关 · Lv." + lvOf(starsOf());
  /* 英语 */
  var se = document.getElementById("pcStatEng");
  if (se && typeof eqStats === "function"){
    var st = eqStats();
    var vocabDone = (typeof vqStats === "function") ? vqStats().done : 0;
    var readDone = (typeof rqStats === "function") ? rqStats().done : 0;
    var writeDone = (typeof wqStats === "function") ? wqStats().done : 0;
    var examDone = (typeof xqStats === "function") ? xqStats().done : 0;
    se.textContent = "语法 " + st.done + "/" + st.total + " · 词汇 " + vocabDone + "/20 · 阅读 " + readDone + "/100 · 作文 " + writeDone + "/99 · 真题 " + examDone + "/9";
  }
  /* 打卡（只读本地数据，不需要解锁） */
  var sk = document.getElementById("pcStatCk");
  var today = document.getElementById("portalToday");
  try {
    var key = portalTodayKey();
    var data = JSON.parse(localStorage.getItem("studentCheckIn") || "{}");
    var d = data[key];
    var total = 0, done = 0;
    if (d){
      if (d.chinese){ total += (d.chinese.content || []).length; if (d.chinese.completed) done++; }
      if (d.english){ total += (d.english.content || []).length; if (d.english.completed) done++; }
      (d.customTasks || []).forEach(function(t){ total++; if (t.completed) done++; });
    }
    if (sk) sk.textContent = "今日 " + done + "/" + total + " 完成";
    if (today){
      if (total > 0 && done >= total) today.innerHTML = "🎉 今天的打卡全部完成啦，你是最棒的小指挥官！";
      else if (total > 0) today.innerHTML = "📌 今日打卡 " + done + "/" + total + "，还有 " + (total - done) + " 项没完成哦！";
      else today.textContent = "今天还没有安排作业，去打卡本里加一个吧！";
    }
  } catch(e){}
}
function portalTodayKey(){
  var d = new Date();
  var m = d.getMonth() + 1, day = d.getDate();
  return d.getFullYear() + "-" + (m < 10 ? "0" + m : m) + "-" + (day < 10 ? "0" + day : day);
}

window.addEventListener("hashchange", portalRoute);
window.addEventListener("load", portalRoute);