/* ---------------- GitHub Gist 云同步 gist-sync.js ----------------
 * 把全部学习数据（进度/金币/错题本/奖品店/设置/导入真题）备份到一个
 * 私有 Gist，实现 GitHub Pages / 本地文件 / 任何设备打开都记住进度。
 *
 * 使用前提：在 GitHub 创建一个只勾选 gist 权限的访问令牌（PAT）。
 * 配置存 localStorage "sc_gist"：{ token, gistId, auto }。
 * 数据文件：Gist 内 studyc-data.json（内容=全部 localStorage）。
 * 同步策略：手动上/下拉 + 自动上传（saveS 后节流 8 秒，云端最后写入胜出）。
 *
 * 与 Cloudflare 云同步（cloud-sync.js）互相独立，可任选其一。
 */
var GS_CFG_KEY = "sc_gist";
var GS_FILE = "studyc-data.json";
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
    gsToast("✅ 已连接，开始首次上传…");
    gsPush();
  }).catch(function(e){
    gsToast("❌ 连接失败：" + e.message + "（请检查令牌是否勾选了 gist 权限）");
  });
}

/* 上传：整包写入 Gist */
function gsPush(silent){
  var cfg = gsCfg();
  if (!cfg || !cfg.gistId){ if (!silent) gsToast("请先连接 GitHub"); return Promise.resolve(false); }
  GS_DIRTY = false;
  var payload = {};
  payload[GS_FILE] = { content: JSON.stringify(gsSnapshot()) };
  return fetch("https://api.github.com/gists/" + cfg.gistId, {
    method: "PATCH",
    headers: gsApiHeaders(cfg.token),
    body: JSON.stringify({ files: payload })
  }).then(function(r){
    if (!r.ok) return r.json().then(function(j){ throw new Error(j.message || ("HTTP " + r.status)); });
    var cfg2 = gsCfg();
    cfg2.lastPush = new Date().toISOString();
    gsSaveCfg(cfg2);
    if (!silent) gsToast("☁️ 已上传到 GitHub 云端");
    var el = document.getElementById("gsStatus");
    if (el) el.innerHTML = gsStatusHtml();
    return true;
  }).catch(function(e){
    if (!silent) gsToast("❌ 上传失败：" + e.message);
    return false;
  });
}

/* 下载：云端数据覆盖本机（换设备/清缓存后用） */
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
    var f = g.files && g.files[GS_FILE];
    if (!f || !f.content){ gsToast("云端还没有数据，先点「上传到云端」"); return; }
    var payload;
    try { payload = JSON.parse(f.content); } catch(e){ gsToast("云端数据无法解析"); return; }
    if (!payload || !payload.data){ gsToast("云端数据格式不对"); return; }
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
    if (GS_DIRTY) gsPush(true);
  }, 8000);
}

function gsToggleAuto(){
  var cfg = gsCfg();
  if (!cfg) return;
  cfg.auto = !cfg.auto;
  gsSaveCfg(cfg);
  gsRenderPanel();
  if (cfg.auto){ gsToast("已开启自动上传：学习后 8 秒自动备份到 GitHub"); gsPush(true); }
  else gsToast("已关闭自动上传");
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
        '<button class="sync-export-btn" type="button" onclick="gsToggleAuto()">' + (cfg.auto ? "⏸ 关闭自动上传" : "⏱ 开启自动上传") + '</button>' +
        '<button class="sync-export-btn gs-danger" type="button" onclick="gsDisconnect()">🔓 断开</button>' +
      '</div>' +
      '<p class="sync-desc">换设备：新设备打开网站 → 同一个令牌连接后点「从云端恢复」。</p>';
  } else {
    box.innerHTML =
      '<div class="gs-steps">三步搞定：<b>① GitHub 创建令牌</b>（Settings → Developer settings → Personal access tokens (classic) → Generate new token，只勾 <b>gist</b> 权限）→ ' +
      '<b>② 粘贴到下面点连接</b> → <b>③ 开启自动上传</b>。之后每次学习自动备份，任何设备都能恢复。</div>' +
      '<input type="password" id="gsToken" class="gs-token" placeholder="粘贴 GitHub 访问令牌（ghp_ 开头）" autocomplete="off">' +
      '<button class="sync-export-btn" type="button" onclick="gsConnect()">🔗 连接 GitHub 云端</button>';
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
