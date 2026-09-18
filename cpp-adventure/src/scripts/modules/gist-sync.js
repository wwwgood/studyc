/* ---------------- GitHub Gist 云同步 gist-sync.js ----------------
 * 把全部学习数据（进度/金币/错题本/奖品店/设置/导入真题）备份到一个
 * 私有 Gist，实现 GitHub Pages / 本地文件 / 任何设备打开都记住进度。
 *
 * 使用前提：在 GitHub 创建一个只勾选 gist 权限的访问令牌（PAT）。
 * 配置存 localStorage "sc_gist"：{ token, gistId, auto }。
 * 数据文件（v2 增量格式）：每个 localStorage 键一个分段文件 studyc-<键>.json，
 *   studyc-meta.json 记录段哈希；上传时只 PATCH 内容变了的段（增量），
 *   旧版单文件 studyc-data.json 首次同步自动迁移删除。
 * 同步策略：双向同步（拉云端→四分支：本机空恢复/本机有上传/两端都有按时间戳
 *   合并——学习进度并集、错题日志去重、金币取大，写回本机并上传）。
 *   自动：页面加载 + saveS 后节流 8 秒（开启自动时）执行 gsSync，旧的绝不冲掉新的；
 *   手动：上传/恢复按钮仍可强制单方向（带确认与留底）。
 *
 * 与 Cloudflare 云同步（cloud-sync.js）互相独立，可任选其一，逻辑一致。
 */
var GS_CFG_KEY = "sc_gist";
var GS_FILE = "studyc-data.json"; /* 旧版整包文件名（仅兼容读取/迁移用） */
var GS_DIRTY = false;
var GS_TIMER = null;

function gsCfg(){
  try {
    var v = JSON.parse(localStorage.getItem(GS_CFG_KEY) || "null");
    if (v && v.token) return v;
  } catch(e){}
  return null;
}

function gsSaveCfg(c){
  localStorage.setItem(GS_CFG_KEY, JSON.stringify(c));
}

function gsApiHeaders(token){
  return {
    "Authorization": "Bearer " + token,
    "Accept": "application/vnd.github+json",
    "Content-Type": "application/json"
  };
}

/* 打包全部学习数据（与 sync.js 的 syncCollectData 一致：排除本同步配置自身） */
function gsSnapshot(){
  var data = {};
  try {
    for (var i = 0; i < localStorage.length; i++){
      var k = localStorage.key(i);
      if (!k || k === GS_CFG_KEY || k === "sc_cloud") continue;
      data[k] = localStorage.getItem(k);
    }
  } catch(e){}
  return { app: "studyc-sync", updatedAt: new Date().toISOString(), data: data };
}

/* ---------- 增量同步（v2）：每个 localStorage 键一个 Gist 文件 ----------
 * 旧版整包单文件：每次上传都全量 PATCH（几百 KB），平板弱网卡顿、数据越大越慢。
 * v2：键 → 分段文件（studyc-<safeKey>.json），内容就是该键原值；
 *     studyc-meta.json 记录每段的键名+内容哈希；上传前只 PATCH 哈希变了的段，
 *     一次 PATCH 批量带齐（变更段 + 删除段 + meta），云端旧单文件自动迁移删除。
 * 兼容：云端只有旧 studyc-data.json 时按整包读入，首次成功写入后删除旧文件。 */
var GS_META_FILE = "studyc-meta.json";
var GS_LEGACY_FILE = "studyc-data.json";

function gsHashStr(str){
  /* FNV-1a：判断键内容是否变化，与数据安全无关 */
  var h = 2166136261;
  try {
    str = String(str == null ? "" : str);
    for (var i = 0; i < str.length; i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  } catch(e){ return ""; }
  return (h >>> 0).toString(36);
}
function gsFileSafeKey(k){
  return "studyc-" + String(k).replace(/[^A-Za-z0-9_-]/g, function(c){
    return "_" + c.charCodeAt(0).toString(36) + "_";
  }) + ".json";
}
function gsSegmentFiles(data){
  var files = {}, keys = {};
  Object.keys(data || {}).forEach(function(k){
    var name = gsFileSafeKey(k);
    var v = data[k] == null ? "" : String(data[k]);
    files[name] = v;
    keys[name] = { key: k, hash: gsHashStr(v) };
  });
  return { files: files, keys: keys };
}
/* 把 Gist JSON 组装成旧格式 payload（兼容四分支逻辑）：
 * 有 meta → 按段拼装；无 meta → 回退旧单文件。 */
function gsAssembleCloud(g){
  var files = (g && g.files) || {};
  var meta = null;
  try { meta = JSON.parse(files[GS_META_FILE] && files[GS_META_FILE].content || "null"); } catch(e){ meta = null; }
  if (meta && meta.keys){
    var data = {};
    Object.keys(meta.keys).forEach(function(name){
      var info = meta.keys[name] || {};
      var f = files[name];
      if (info.key && f && typeof f.content === "string") data[info.key] = f.content;
    });
    return { data: data, meta: meta, hasLegacy: false, updatedAt: meta.updatedAt || null };
  }
  if (files[GS_LEGACY_FILE] && files[GS_LEGACY_FILE].content){
    try {
      var p = JSON.parse(files[GS_LEGACY_FILE].content);
      if (p && p.data) return { data: p.data, meta: null, hasLegacy: true, updatedAt: p.updatedAt || null };
    } catch(e){}
  }
  return { data: {}, meta: null, hasLegacy: false, updatedAt: null };
}

/* 增量上传：与云端段哈希比对，只传变化段；变更段+删除段+meta 合并进一次 PATCH。 */
function gsUploadData(data, silent, cloudInfo){
  var cfg = gsCfg();
  if (!cfg || !cfg.gistId) return Promise.resolve(false);
  if (!data || Object.keys(data).length === 0) return Promise.resolve(false);
  var seg = gsSegmentFiles(data);
  var prev = (cloudInfo && cloudInfo.meta && cloudInfo.meta.keys) || null;
  var body = {}, changed = 0;
  Object.keys(seg.files).forEach(function(name){
    if (!prev || !prev[name] || prev[name].hash !== seg.keys[name].hash){
      body[name] = { content: seg.files[name] };
      changed++;
    }
  });
  if (prev){
    Object.keys(prev).forEach(function(name){
      if (!(name in seg.keys)) body[name] = null; /* 本机已无此键 → 删除云端段 */
    });
  }
  if (cloudInfo && cloudInfo.hasLegacy) body[GS_LEGACY_FILE] = null; /* 旧单文件迁移删除 */
  body[GS_META_FILE] = { content: JSON.stringify({ app: "studyc-sync-meta", version: 2, updatedAt: new Date().toISOString(), keys: seg.keys }) };
  return fetch("https://api.github.com/gists/" + cfg.gistId, {
    method: "PATCH",
    headers: gsApiHeaders(cfg.token),
    body: JSON.stringify({ files: body })
  }).then(function(r){
    if (!r.ok) return r.json().then(function(j){ throw new Error(j.message || ("HTTP " + r.status)); });
    var c = gsCfg(); c.lastPush = new Date().toISOString(); gsSaveCfg(c);
    var el = document.getElementById("gsStatus");
    if (el) el.innerHTML = gsStatusHtml();
    try { console.log("[gist-sync] 增量上传：" + changed + " 段变更 / 共 " + Object.keys(seg.keys).length + " 段"); } catch(_){}
    return true;
  }).catch(function(e){
    console.warn("[gist-sync] 上传失败:", e.message);
    return false;
  });
}

/* 云端是否有「真实学习数据」：解析 studyc-data.json 里的主存档并用 dbHasReal 判定。
 * 上传防呆的依据：云端空数据没有备份价值，不许覆盖云端好备份。 */
function gsPayloadHasReal(payload){
  try {
    if (!payload || !payload.data) return false;
    var raw = payload.data["cppsAdventureV2"];
    if (!raw) return false;
    var db = JSON.parse(raw);
    return typeof dbHasReal === "function" ? dbHasReal(db) : !!(db && db.users);
  } catch(e){ return false; }
}

/* 云端数据覆盖本机（留底可反悔） */
function gsApplyCloud(payload){
  try { if (typeof bkupNow === "function") bkupNow("pre-gist-restore", true); } catch(_){}
  for (var k in payload.data){
    if (k === GS_CFG_KEY || k === "sc_cloud") continue;
    localStorage.setItem(k, payload.data[k]);
  }
}

/* 双向同步核心：拉云端 → 四分支 → 写本机 + 上传。
 * 复用 cloud-sync.js 的合并函数（csMergeSnapshot/csApplyLocal/csPayloadHasReal），
 * 保证：本机/云端谁最新都不丢；两边进度合并保留。 */
function gsSync(silent){
  var cfg = gsCfg();
  if (!cfg || !cfg.gistId) return Promise.resolve({ action: "noconfig" });
  return fetch("https://api.github.com/gists/" + cfg.gistId, { headers: gsApiHeaders(cfg.token) })
  .then(function(r){
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  }).then(function(g){
    var cloudInfo = gsAssembleCloud(g);
    var cloudPayload = { app: "studyc-sync", updatedAt: cloudInfo.updatedAt, data: cloudInfo.data };
    var localPayload = gsSnapshot();
    var localHas = gsPayloadHasReal(localPayload);
    var cloudHas = gsPayloadHasReal(cloudPayload);
    if (!localHas && cloudHas){
      gsApplyCloud(cloudPayload);
      if (!silent) gsToast("☁️ 已从 GitHub 云端恢复最新学习进度");
      setTimeout(function(){ location.reload(); }, 1200);
      return { action: "restore" };
    }
    if (localHas && !cloudHas){
      return gsPush(silent).then(function(ok){ return { action: ok ? "push" : "fail" }; });
    }
    if (localHas && cloudHas){
      var merged = csMergeSnapshot(localPayload.data, cloudPayload.data);
      csApplyLocal(merged);
      return gsUploadData(merged, silent, cloudInfo).then(function(ok){
        if (!silent) gsToast(ok ? "☁️ 已合并云端与本机进度（两边最新记录都保留）" : "☁️ 已合并到本机，云端上传稍后自动重试");
        return { action: ok ? "merge" : "merge-local" };
      });
    }
    return { action: "none" };
  }).catch(function(e){
    if (!silent) gsToast("❌ 同步失败：" + e.message);
    else console.warn("[gist-sync] 自动同步失败:", e.message);
    return { action: "error" };
  });
}

/* 页面加载后自动双向同步（开启自动或已连接即检查，静默执行，旧不冲新） */
function gsAutoInit(){
  var cfg = gsCfg();
  if (!cfg || !cfg.gistId) return;
  gsSync(true);
}

/* 首次连接：创建私有 Gist 并绑定 */
function gsConnect(){
  var tokenEl = document.getElementById("gsToken");
  var token = tokenEl ? tokenEl.value.trim() : "";
  if (!token){ gsToast("请先粘贴 GitHub 访问令牌（PAT）"); return; }
  gsToast("正在连接 GitHub…");
  var initData = {};
  initData[GS_FILE] = { content: JSON.stringify(gsSnapshot()) };
  fetch("https://api.github.com/gists", {
    method: "POST",
    headers: gsApiHeaders(token),
    body: JSON.stringify({
      description: "梓煜学习空间站 · 云同步（勿删）",
      public: false,
      files: initData
    })
  }).then(function(r){
    if (!r.ok) return r.json().then(function(j){
      throw new Error(j.message || ("HTTP " + r.status));
    });
    return r.json();
  }).then(function(g){
    var cfg = gsCfg() || {};
    cfg.token = token;
    cfg.gistId = g.id;
    gsSaveCfg(cfg);
    gsToast("✅ 已连接，开始首次双向同步…");
    gsSync();
  }).catch(function(e){
    gsToast("❌ 连接失败：" + e.message + "（请检查令牌是否勾选了 gist 权限）");
  });
}

/* 进度规模：给一份数据算一个"学到多少"的分数（闯关数×10 + 日志/错题条数 + 其他学习数据体量）。
 * 用途：多台设备都自动上传时，防止进度旧的设备把云端较新的数据覆盖掉。 */
function gsDataScore(data){
  var score = 0;
  try {
    var mainRaw = data["cppsAdventureV2"];
    if (mainRaw){
      var db = JSON.parse(mainRaw);
      if (db && db.users){
        Object.keys(db.users).forEach(function(nm){
          var u = db.users[nm] || {};
          score += Object.keys(u.passed || {}).length * 10;
          score += (u.logs || []).length;
          score += (u.errors || []).length;
        });
      }
    }
  } catch(e){}
  try {
    Object.keys(data || {}).forEach(function(k){
      if (k === "cppsAdventureV2" || k === GS_CFG_KEY || k === "sc_cloud") return;
      score += Math.floor(String(data[k] || "").length / 200);
    });
  } catch(e){}
  return score;
}

/* 上传：整包写入 Gist。
 * 防呆一：本机没有真实学习数据 → 拒绝上传（防止空数据覆盖云端好备份）。
 * 防呆二（多设备保护）：上传前先看一眼云端——云端进度规模比本机大（别的设备学得更靠前）
 *   就拒绝本次上传，防止旧数据覆盖新数据；手动上传会给确认框说明。 */
function gsPush(silent){
  var cfg = gsCfg();
  if (!cfg || !cfg.gistId){ if (!silent) gsToast("请先连接 GitHub"); return Promise.resolve(false); }
  GS_DIRTY = false;
  var payload = gsSnapshot();
  if (!gsPayloadHasReal(payload)){
    try { console.warn("[gist-sync] 本机无真实学习数据，跳过上传（防止云端被空数据覆盖）"); } catch(_){}
    if (!silent) gsToast("⚠️ 本机没有真实学习数据，已跳过上传（保护云端备份）");
    return Promise.resolve(false);
  }
  var localScore = gsDataScore(payload.data);
  return fetch("https://api.github.com/gists/" + cfg.gistId, { headers: gsApiHeaders(cfg.token) })
  .then(function(r){
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  }).then(function(g){
    /* 多设备保护：对比云端与本机的进度规模 */
    var cloudScore = -1;
    var cloudInfo = null;
    try {
      var cf = g.files && g.files[GS_FILE];
      if (cf && cf.content){
        var cp = JSON.parse(cf.content);
        if (cp && cp.data) cloudScore = gsDataScore(cp.data);
      }
    } catch(e){ cloudScore = -1; }
    cloudInfo = gsAssembleCloud(g); /* 段哈希供增量比对；旧单文件也兼容读取 */
    try {
      if (cloudInfo.meta) cloudScore = gsDataScore(cloudInfo.data);
      else if (!cf || !cf.content) cloudScore = -1;
    } catch(e){}
    if (cloudScore > localScore){
      if (!silent){
        var go = confirm("⚠️ 云端进度比本机新（规模 " + cloudScore + " > 本机 " + localScore + "）。\n" +
          "现在上传会用本机的旧进度覆盖云端的新进度。\n\n" +
          "建议先点「从云端恢复」取回最新进度。\n仍要坚持用本机数据覆盖云端吗？");
        if (!go){ gsToast("已取消上传，云端新进度未受影响"); return false; }
      } else {
        gsToast("⚠️ 云端进度比本机新，已暂停自动上传；请点「从云端恢复」取回最新");
        GS_DIRTY = true;
        return false;
      }
    }
    /* 增量上传：与云端段哈希比对，只传变化段（旧单文件自动迁移删除） */
    return gsUploadData(payload.data, silent, cloudInfo).then(function(ok){
      if (!silent && ok) gsToast("☁️ 已上传到 GitHub 云端");
      return ok;
    });
  }).catch(function(e){
    GS_DIRTY = true;
    if (!silent) gsToast("❌ 上传失败：" + e.message);
    else gsToast("☁️ 自动上传暂未完成，稍后学习时会自动重试（本机数据不会丢）");
    return false;
  });
}

/* 下载：云端数据覆盖本机（换设备/清缓存后用）。
 * 红线铁律6：覆盖本机前必须先留底（pre-gist-pull 强制快照），可反悔。
 * 多设备保护：确认框显示云端与本机的进度规模对比，防止误把新进度换回旧的。 */
function gsPull(){
  var cfg = gsCfg();
  if (!cfg || !cfg.gistId){ gsToast("请先连接 GitHub"); return; }
  gsToast("正在从 GitHub 拉取…");
  fetch("https://api.github.com/gists/" + cfg.gistId, {
    headers: gsApiHeaders(cfg.token)
  }).then(function(r){
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  }).then(function(g){
    var cloudInfo = gsAssembleCloud(g);
    if (!cloudInfo.data || Object.keys(cloudInfo.data).length === 0){ gsToast("云端还没有数据，先点「上传到云端」"); return; }
    var payload = { app: "studyc-sync", updatedAt: cloudInfo.updatedAt, data: cloudInfo.data };
    var cloudScore = gsDataScore(payload.data);
    var localScore = gsDataScore(gsSnapshot().data);
    var warn = (cloudScore < localScore) ? "\n\n⚠️ 注意：云端规模 " + cloudScore + " 比本机 " + localScore + " 小——云端看起来更旧，恢复会丢掉本机较新的进度！" : "";
    if (!confirm("确定用 GitHub 云端数据覆盖本机当前数据吗？\n（云端进度规模 " + cloudScore + " ｜ 本机进度规模 " + localScore + "）" + warn + "\n覆盖前会自动留底当前数据，可反悔。")){ gsToast("已取消恢复"); return; }
    try { if (typeof bkupNow === "function") bkupNow("pre-gist-pull", true); } catch(_){}
    var n = 0;
    for (var k in payload.data){
      if (k === GS_CFG_KEY || k === "sc_cloud") continue;
      localStorage.setItem(k, payload.data[k]);
      n++;
    }
    gsToast("✅ 已恢复 " + n + " 项数据，正在刷新页面…");
    setTimeout(function(){ location.reload(); }, 1200);
  }).catch(function(e){
    gsToast("❌ 拉取失败：" + e.message);
  });
}

/* 断开：只解绑本机，不删云端 Gist */
function gsDisconnect(){
  if (!confirm("断开 GitHub 云同步？（云端备份保留，本机不再自动上传）")) return;
  localStorage.removeItem(GS_CFG_KEY);
  gsRenderPanel();
  gsToast("已断开 GitHub 云同步");
}

/* 自动上传：saveS 后标记脏，节流 8 秒 */
function gsMarkDirty(){
  var cfg = gsCfg();
  if (!cfg || !cfg.auto) return;
  GS_DIRTY = true;
  if (GS_TIMER) return;
  GS_TIMER = setTimeout(function(){
    GS_TIMER = null;
    if (GS_DIRTY) gsSync(true);
  }, 8000);
}

function gsToggleAuto(){
  var cfg = gsCfg();
  if (!cfg) return;
  cfg.auto = !cfg.auto;
  gsSaveCfg(cfg);
  gsRenderPanel();
  if (cfg.auto){ gsToast("已开启自动同步：学习后自动与云端合并（两边进度都保留）"); gsSync(true); }
  else gsToast("已关闭自动同步（打开页面时仍会自动检查一次）");
}

/* ---------- 面板渲染（嵌入同步对话框） ---------- */
function gsStatusHtml(){
  var cfg = gsCfg();
  if (!cfg || !cfg.gistId) return "";
  var last = cfg.lastPush ? cfg.lastPush.slice(0, 16).replace("T", " ") : "还没上传过";
  return '上次上传：<b>' + last + '</b>' + (cfg.auto ? ' · 自动上传已开' : '');
}

function gsRenderPanel(){
  var box = document.getElementById("gsPanel");
  if (!box) return;
  var cfg = gsCfg();
  if (cfg && cfg.gistId){
    box.innerHTML =
      '<div class="gs-ok">✅ 已连接 GitHub 云端（私有 Gist ' + cfg.gistId.slice(0, 7) + '…）<br>' +
      '<span class="gs-status" id="gsStatus">' + gsStatusHtml() + '</span></div>' +
      '<div class="gs-btns">' +
        '<button class="sync-export-btn" type="button" onclick="gsPush()">⬆️ 上传到云端</button>' +
        '<button class="sync-export-btn" type="button" onclick="gsPull()">⬇️ 从云端恢复</button>' +
        '<button class="sync-export-btn" type="button" onclick="gsToggleAuto()">' + (cfg.auto ? "⏸ 关闭自动同步" : "⏱ 开启自动同步") + '</button>' +
        '<button class="sync-export-btn gs-danger" type="button" onclick="gsDisconnect()">🔓 断开</button>' +
      '</div>' +
      '<p class="sync-desc">多设备自动同步：打开页面自动与云端合并，以最新为准，两边进度都保留。</p>';
  } else {
    box.innerHTML =
      '<div class="gs-steps">三步搞定（全程约 1 分钟，仅需这一次）：<b>① 创建令牌</b>——点下面的直达链接，登录 GitHub 后直接点 <b>Generate token</b>（已自动勾选 gist 权限）→ ' +
      '<b>② 复制令牌粘贴到下面</b>，点「连接 GitHub 云端」→ <b>③ 开启自动上传</b>。之后每次学习 8 秒内自动备份；换设备点「从云端恢复」一键取回。</div>' +
      '<a class="sync-export-btn" style="display:inline-block;text-decoration:none;margin:2px 0 10px;" href="https://github.com/settings/tokens/new?scopes=gist&description=studyc-sync" target="_blank" rel="noopener">⚡ 第①步：一键打开 GitHub 令牌创建页</a>' +
      '<input type="password" id="gsToken" class="gs-token" placeholder="② 粘贴 GitHub 访问令牌（ghp_ 开头）" autocomplete="off">' +
      '<button class="sync-export-btn" type="button" onclick="gsConnect()">🔗 连接 GitHub 云端</button>' +
      '<p class="sync-desc" style="margin-top:6px;">连接后建议立即开启自动上传：学习后 8 秒自动备份到 GitHub，全程无需手动。</p>';
  }
}

function gsToast(msg){
  if (typeof baToast === "function") baToast(msg);
  else console.log("[gist-sync]", msg);
}

/* 面板存在时刷新 */
function gsRefreshIfVisible(){
  if (document.getElementById("gsPanel")) gsRenderPanel();
}

/* 页面加载后自动双向同步一次（与 cloud 通道同一节奏，静默执行） */
if (typeof window !== "undefined" && window.addEventListener){
  window.addEventListener("load", function(){
    setTimeout(function(){ gsAutoInit(); }, 1500);
  });
}
