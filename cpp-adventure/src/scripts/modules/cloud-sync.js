/* ---------------- 云端同步 cloud-sync.js ----------------
 * 把学习进度备份到 Cloudflare Workers + KV 云端：
 *  - 配置（服务器地址 / 账号 / 密码）存 localStorage key "sc_cloud"
 *  - 自动同步：页面加载 + 每次 saveS() 后（节流 5 秒）执行双向同步 csSync()：
 *      本机空&云端有 → 恢复云端；本机有&云端空 → 上传本机；
 *      两端都有 → 按时间戳合并（主存档 updatedAt 比较，学习进度并集、
 *      错题/日志去重、金币取大），写回本机并上传——旧的绝不冲掉新的。
 *  - 手动：上传/恢复按钮仍可强制单方向（带确认与留底）。
 * 保障多设备、清缓存不丢数据、跨设备进度以最新为准。
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
      if (k === "sc_gist") continue; /* GitHub 令牌不进 Cloudflare 云端 */
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

/* ---------- 手动上传到云端 ---------- */
function csPush(){
  var cfg = csCfg();
  if (!cfg) return Promise.resolve(false);
  var data = csSnapshot();
  if (Object.keys(data).length === 0) return Promise.resolve(false);
  /* 防呆一：本机没有真实学习数据时不上传，防止把空数据覆盖到云端 */
  if (typeof csHasLocalData === "function" && !csHasLocalData()){
    try { console.warn("[cs] 本机无真实学习数据，跳过上传（防止云端被空数据覆盖）"); } catch(_){}
    return Promise.resolve(false);
  }
  /* 防呆二（旧不冲新）：云端明显比本机新时，不静默覆盖 */
  var localT = csDbTime(csParseMain(data["cppsAdventureV2"]));
  return csFetchCloud().then(function(cloud){
    if (cloud && cloud.data && csPayloadHasReal(cloud.data)){
      var cloudT = csDbTime(csParseMain(cloud.data["cppsAdventureV2"]));
      if (cloudT > localT + 5 * 60 * 1000){
        var go = confirm("⚠️ 云端进度比本机新（云端 " + csFmtTs(cloudT) + " > 本机 " + csFmtTs(localT) + "）。\n" +
          "直接上传会用本机旧进度覆盖云端新进度。\n\n" +
          "点「确定」仍用本机覆盖云端；点「取消」自动合并两边（两边最新记录都保留）。");
        if (!go){
          csToast("☁️ 正在自动合并两边最新进度…");
          return csSync();
        }
      }
    }
    return csUploadData(data);
  });
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

/* 应用云端数据覆盖本机（恢复）。
 * 红线铁律6：覆盖本机前必须先留底（pre-restore 强制快照），恢复错了能反悔。 */
function csApplyCloud(cloudData){
  try { if (typeof bkupNow === "function") bkupNow("pre-restore", true); } catch(_){}
  var data = (cloudData && cloudData.data) || {};
  Object.keys(data).forEach(function(k){
    try { localStorage.setItem(k, data[k]); } catch(e){}
  });
}

/* 合并结果写回本机（不刷新页面，不触发 saveS 循环） */
function csApplyLocal(mergedData){
  Object.keys(mergedData || {}).forEach(function(k){
    if (k === CS_CFG_KEY || k === "sc_gist") return;
    try { localStorage.setItem(k, mergedData[k]); } catch(e){}
  });
}

/* 云端快照里是否有真实学习数据（防空数据覆盖） */
function csPayloadHasReal(data){
  try {
    var raw = data && data["cppsAdventureV2"];
    if (!raw) return false;
    var db = JSON.parse(raw);
    return typeof dbHasReal === "function" ? dbHasReal(db) : !!(db && db.users && Object.keys(db.users).length);
  } catch(e){ return false; }
}

function csParseMain(raw){
  try { return JSON.parse(raw || "null"); } catch(e){ return null; }
}

/* 主存档更新时间戳（兼容旧档无 updatedAt） */
function csDbTime(db){
  try {
    var t = db && db.updatedAt;
    if (typeof t === "number") return t;
    if (typeof t === "string") return new Date(t).getTime() || 0;
  } catch(e){}
  return 0;
}

function csFmtTs(ts){
  try {
    var d = new Date(ts), p = function(n){ return (n < 10 ? "0" : "") + n; };
    return (d.getMonth() + 1) + "月" + d.getDate() + "日 " + p(d.getHours()) + ":" + p(d.getMinutes());
  } catch(e){ return "未知时间"; }
}

/* 通用值合并：对象递归并集、数组去重并集、数字取大、布尔或、其余取较新侧。
 * 学习进度（passed/eng/exam/reading/oral/stars 等对象）→ 并集不丢；
 * 错题/日志（errors/logs 数组）→ 按内容去重并集；金币（coins 数字）→ 取大；
 * 字符串/计划等 → 较新一侧优先。旧的绝不冲掉新的。 */
function csMergeVal(a, b, takeA){
  if (a == null) return b;
  if (b == null) return a;
  var isObjA = typeof a === "object" && !Array.isArray(a);
  var isObjB = typeof b === "object" && !Array.isArray(b);
  if (isObjA && isObjB){
    var out = {};
    Object.keys(a).forEach(function(k){ out[k] = a[k]; });
    Object.keys(b).forEach(function(k){
      if (k in out) out[k] = csMergeVal(out[k], b[k], takeA);
      else out[k] = b[k];
    });
    return out;
  }
  if (Array.isArray(a) && Array.isArray(b)){
    var seen = {}, out2 = [];
    a.concat(b).forEach(function(v){
      var key;
      try { key = JSON.stringify(v); } catch(e){ key = String(v); }
      if (!seen[key]){ seen[key] = 1; out2.push(v); }
    });
    return out2;
  }
  if (typeof a === "number" && typeof b === "number") return Math.max(a, b);
  if (typeof a === "boolean" && typeof b === "boolean") return a || b;
  return takeA ? a : b;
}

/* 合并两份主存档，返回新对象（不修改入参） */
function csMergeDb(a, b){
  var at = csDbTime(a), bt = csDbTime(b);
  var takeA = at >= bt;
  var aU = (a && a.users) || {}, bU = (b && b.users) || {};
  var names = {};
  Object.keys(aU).forEach(function(n){ names[n] = 1; });
  Object.keys(bU).forEach(function(n){ names[n] = 1; });
  var out = {
    users: {},
    current: csMergeVal(a && a.current, b && b.current, takeA),
    schemaVersion: Math.max((a && a.schemaVersion) || 1, (b && b.schemaVersion) || 1),
    updatedAt: Math.max(at, bt)
  };
  Object.keys(names).forEach(function(nm){
    out.users[nm] = csMergeVal(aU[nm], bU[nm], takeA) || {};
  });
  return out;
}

/* 合并两份完整快照（localStorage 键值对集合），返回合并后快照。
 * 方向由主存档 updatedAt 决定；主存档用 csMergeDb，其余键尝试 JSON 通用合并。 */
function csMergeSnapshot(localData, cloudData){
  var out = {};
  Object.keys(localData || {}).forEach(function(k){ out[k] = localData[k]; });
  var takeA = true;
  try {
    var lMain = csParseMain(out["cppsAdventureV2"]);
    var cMain = csParseMain((cloudData || {})["cppsAdventureV2"]);
    takeA = csDbTime(lMain) >= csDbTime(cMain);
  } catch(e){}
  Object.keys(cloudData || {}).forEach(function(k){
    if (k === CS_CFG_KEY || k === "sc_gist") return;
    if (!(k in out)){ out[k] = cloudData[k]; return; }
    if (k === "cppsAdventureV2"){
      try {
        var la = csParseMain(out[k]), cb = csParseMain(cloudData[k]);
        if (la && cb) out[k] = JSON.stringify(csMergeDb(la, cb));
        else out[k] = takeA ? out[k] : cloudData[k];
      } catch(e){ out[k] = takeA ? out[k] : cloudData[k]; }
      return;
    }
    try {
      var va = JSON.parse(out[k]), vb = JSON.parse(cloudData[k]);
      out[k] = JSON.stringify(csMergeVal(va, vb, takeA));
    } catch(e){
      out[k] = takeA ? out[k] : cloudData[k];
    }
  });
  return out;
}

/* 上传指定快照到云端（不带本机快照重新打包） */
function csUploadData(data, opts){
  var cfg = csCfg();
  if (!cfg) return Promise.resolve(false);
  if (!data || Object.keys(data).length === 0) return Promise.resolve(false);
  if (!csPayloadHasReal(data)) return Promise.resolve(false);
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

/* 双向同步核心：拉云端 → 四分支 → 写本机 + 上传。
 * 保证：本机/云端谁最新都不丢；两边进度合并保留。 */
function csSync(opts){
  opts = opts || {};
  return csFetchCloud().then(function(cloud){
    var localData = csSnapshot();
    var localHas = csHasLocalData();
    var cloudHas = !!(cloud && cloud.data && csPayloadHasReal(cloud.data));
    if (!localHas && cloudHas){
      csApplyCloud(cloud);
      csToast("☁️ 已从云端恢复最新学习进度");
      if (opts.reload !== false) setTimeout(function(){ location.reload(); }, 1200);
      return { action: "restore" };
    }
    if (localHas && !cloudHas){
      return csUploadData(localData, opts).then(function(ok){ return { action: ok ? "push" : "fail" }; });
    }
    if (localHas && cloudHas){
      var merged = csMergeSnapshot(localData, cloud.data);
      csApplyLocal(merged);
      return csUploadData(merged, opts).then(function(ok){
        csToast(ok ? "☁️ 已合并云端与本机进度（两边最新记录都保留）" : "☁️ 已合并到本机，云端上传稍后自动重试");
        return { action: ok ? "merge" : "merge-local" };
      });
    }
    return { action: "none" };
  }).catch(function(e){ console.warn("[cs] 同步异常:", e); return { action: "error" }; });
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
      csSync();
    }
  }, 5000);
}

/* 页面加载后调用：双向同步——空则恢复、有则上传、都有则合并（旧不冲新） */
function csAutoInit(){
  var cfg = csCfg();
  if (!cfg) return;
  csToast("☁️ 已开启云端同步，正在检查…");
  csSync();
}

/* ---------- 界面（配置选项卡） ---------- */
function csRender(cfg){
  var c = cfg || csCfg() || {};
  csSyncDialogStatus();
  return '<div class="sync-section cs-section">' +
      '<h3>☁️ 云端同步（多设备/不丢数据）</h3>' +
      '<p class="sync-desc">把进度备份到你的 Cloudflare 云端，多设备自动双向同步：以最新为准，学习进度合并保留，旧进度不会冲掉新进度。换设备用同一账号密码打开即自动同步。</p>' +
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
    box.style.cssText = "position:fixed;left:50%;bottom:60px;transform:translateX(-50%);z-index:160000;background:rgba(17,24,39,.95);color:#fff;padding:10px 18px;border-radius:30px;font-size:14px;box-shadow:0 4px 16px rgba(0,0,0,.3);opacity:0;transition:opacity .25s;max-width:86vw;text-align:center;pointer-events:none;";
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