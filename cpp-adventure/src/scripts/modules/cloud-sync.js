/* ---------------- 云端同步 cloud-sync.js ----------------
 * 把学习进度备份到 Cloudflare Workers + KV 云端：
 *  - 配置（服务器地址 / 账号 / 密码）存 localStorage key "sc_cloud"
 *  - 上传：把全部 localStorage 学习数据打包 POST 到云端
 *  - 下载：GET 云端存档覆盖本地（用于换机/清缓存后恢复）
 *  - 自动：页面加载时检测"本机是空的但云端有数据"则提示恢复；
 *         每次 saveS() 后标记脏，5 秒内节流自动上传。
 * 保障多设备、清缓存不丢数据。
 */
var CS_CFG_KEY = "sc_cloud";

/* ---------- 配置读写 ---------- */
function csCfg(){
  try {
    var v = JSON.parse(localStorage.getItem(CS_CFG_KEY) || "null");
    if (v && v.url && v.user && v.token) return v;
  } catch(e){}
  return null;
}
function csSaveCfg(c){
  localStorage.setItem(CS_CFG_KEY, JSON.stringify(c));
}
function csEsc(s){
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ---------- 快照：打包全部学习数据 ---------- */
function csSnapshot(){
  var data = {};
  try {
    for (var i = 0; i < localStorage.length; i++){
      var k = localStorage.key(i);
      if (!k) continue;
      if (k === CS_CFG_KEY) continue;
      data[k] = localStorage.getItem(k);
    }
  } catch(e){}
  return data;
}
/* 本机是否有真实学习数据（判断"全新空设备"） */
function csHasLocalData(){
  try {
    var raw = localStorage.getItem("cppsAdventureV2");
    if (raw){
      var db = JSON.parse(raw);
      if (db && typeof dbHasReal === "function" && dbHasReal(db)) return true;
      if (db && db.users && Object.keys(db.users).length > 0) return true;
    }
  } catch(e){}
  return false;
}

/* ---------- 上传到云端 ---------- */
function csPush(){
  var cfg = csCfg();
  if (!cfg) return Promise.resolve(false);
  var data = csSnapshot();
  if (Object.keys(data).length === 0) return Promise.resolve(false);
  /* 防呆：本机没有真实学习数据时不上传，防止把空数据覆盖到云端 */
  if (typeof csHasLocalData === "function" && !csHasLocalData()){
    try { console.warn("[cs] 本机无真实学习数据，跳过上传（防止云端被空数据覆盖）"); } catch(_){}
    return Promise.resolve(false);
  }
  return fetch(cfg.url + "/api/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: cfg.user, token: cfg.token, data: data })
  }).then(function(r){ return r.json().catch(function(){ return {}; }); })
    .then(function(j){
      if (j && j.ok){
        cfg.lastPush = j.updatedAt || Date.now();
        csSaveCfg(cfg);
        return true;
      }
      console.warn("[cs] 云端上传失败:", j && j.msg);
      return false;
    })
    .catch(function(e){ console.warn("[cs] 云端连接失败:", e); return false; });
}

/* ---------- 从云端拉取（是否覆盖由调用方决定） ---------- */
function csFetchCloud(){
  var cfg = csCfg();
  if (!cfg) return Promise.resolve(null);
  return fetch(cfg.url + "/api/sync?user=" + encodeURIComponent(cfg.user) + "&token=" + encodeURIComponent(cfg.token))
    .then(function(r){ return r.json().catch(function(){ return {}; }); })
    .then(function(j){
      if (j && j.ok && j.exists) return j;
      return null;
    })
    .catch(function(){ return null; });
}

/* 应用云端数据覆盖本机（恢复） */
function csApplyCloud(cloudData){
  var data = cloudData.data || {};
  Object.keys(data).forEach(function(k){
    try { localStorage.setItem(k, data[k]); } catch(e){}
  });
}

/* ---------- 自动逻辑 ---------- */
var CS_DIRTY = false;
var CS_TIMER = null;
function csMarkDirty(){
  CS_DIRTY = true;
  if (CS_TIMER) return;
  CS_TIMER = setTimeout(function(){
    CS_TIMER = null;
    if (CS_DIRTY && typeof SDB !== "undefined" && SDB && SDB.current){
      CS_DIRTY = false;
      csPush();
    }
  }, 5000);
}

/* 页面加载后调用：若本机空但云端有，提示恢复；否则后台把本机备份上传 */
function csAutoInit(){
  var cfg = csCfg();
  if (!cfg) return;
  csToast("☁️ 已开启云端同步，正在检查…");
  csFetchCloud().then(function(cloud){
    if (cloud){
      if (!csHasLocalData()){
        csApplyCloud(cloud);
        csToast("☁️ 已从云端恢复学习进度");
        setTimeout(function(){ location.reload(); }, 1200);
      } else {
        csPush();
      }
    } else {
      if (csHasLocalData()) csPush();
    }
  });
}

/* ---------- 界面（配置选项卡） ---------- */
function csRender(cfg){
  var c = cfg || csCfg() || {};
  csSyncDialogStatus();
  return '<div class="sync-section cs-section">' +
      '<h3>☁️ 云端同步（多设备/不丢数据）</h3>' +
      '<p class="sync-desc">把进度备份到你的 Cloudflare 云端。换设备或清缓存后，用同一账号密码点「从云端恢复」就能找回来。</p>' +
      (c && c.url ? '<div class="cs-status cs-on">✅ 已连接云端：' + csEsc(c.user) + '</div>' : '<div class="cs-status cs-off">⚠️ 未配置云端（在下方填写，不会用不配置）</div>') +
      '<div class="cs-grid">' +
        '<label>云端地址<input type="text" id="csUrl" placeholder="https://studyc-sync.xxx.workers.dev" value="' + csEsc(c.url || "") + '"></label>' +
        '<label>云端账号<input type="text" id="csUser" maxlength="30" placeholder="如 ziyu" value="' + csEsc(c.user || "") + '"></label>' +
        '<label>云端密码<input type="password" id="csToken" maxlength="50" placeholder="自己设一个密码" value="' + csEsc(c.token || "") + '"></label>' +
      '</div>' +
      '<div class="cs-actions">' +
        '<button class="sync-export-btn" type="button" onclick="csSaveConfig()">☁️ 保存云端配置</button>' +
        (c && c.url ? '<button class="sync-import-btn" type="button" onclick="csDoPush()">📤 上传到云端</button>' +
          '<button class="sync-import-btn" type="button" onclick="csDoRestore()">📥 从云端恢复</button>' : '') +
      '</div>' +
    '</div>';
}
function csSyncDialogStatus(){
  var s = document.getElementById("csStatusLine");
  if (s){
    var c = csCfg();
    s.textContent = c ? "已配置云端（" + c.user + "）" : "未配置云端";
  }
}
function csSaveConfig(){
  var url = (document.getElementById("csUrl").value || "").trim().replace(/\/+$/, "");
  var user = (document.getElementById("csUser").value || "").trim();
  var token = document.getElementById("csToken").value || "";
  if (!url || !user || !token){ csToast("请把云端地址、账号、密码都填上"); return; }
  if (!/^https?:\/\//.test(url)){ csToast("云端地址要以 http:// 或 https:// 开头"); return; }
  csSaveCfg({ url: url, user: user, token: token, lastPush: Date.now() });
  csToast("☁️ 云端配置已保存！点「上传到云端」备份一次");
  syncRender();
}
function csDoPush(){
  csToast("☁️ 正在上传学习数据到云端…");
  csPush().then(function(ok){
    csToast(ok ? "✅ 已上传到云端！" : "❌ 上传失败，请检查云端地址和网络");
  });
}
function csDoRestore(){
  if (!confirm("确定用云端数据覆盖本机当前进度吗？\n（平时不会覆盖，只有这一步会。）")) return;
  csToast("☁️ 正在从云端恢复…");
  csFetchCloud().then(function(cloud){
    if (!cloud){ csToast("云端还没有数据（或账号密码不对）"); return; }
    csApplyCloud(cloud);
    csToast("✅ 已从云端恢复！页面即将刷新");
    setTimeout(function(){ location.reload(); }, 1200);
  });
}

/* ---------- 提示（复用页面已有 toast，找不到则自建） ---------- */
function csToast(msg){
  try {
    if (typeof bkToast === "function"){ bkToast(msg); return; }
    if (typeof ppToast === "function"){ ppToast(msg); return; }
  } catch(e){}
  var box = document.getElementById("csToast");
  if (!box){
    box = document.createElement("div");
    box.id = "csToast";
    box.style.cssText = "position:fixed;left:50%;bottom:60px;transform:translateX(-50%);z-index:99999;background:rgba(17,24,39,.95);color:#fff;padding:10px 18px;border-radius:30px;font-size:14px;box-shadow:0 4px 16px rgba(0,0,0,.3);opacity:0;transition:opacity .25s;max-width:86vw;text-align:center;pointer-events:none;";
    document.body.appendChild(box);
  }
  box.textContent = msg;
  box.style.opacity = "1";
  clearTimeout(csToast._t);
  csToast._t = setTimeout(function(){ box.style.opacity = "0"; }, 2200);
}

window.addEventListener("load", function(){
  setTimeout(function(){
    if (typeof csAutoInit === "function") csAutoInit();
  }, 1500);
});