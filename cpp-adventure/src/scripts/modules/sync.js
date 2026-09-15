/* ---------------- 数据同步 sync.js ----------------
 * 跨设备数据同步：导出/导入 localStorage 学习数据
 * 导出：把所有学习数据打包为 JSON 文件下载
 * 导入：上传 JSON 文件恢复数据到 localStorage
 * 配合 GitHub Pages 部署，PC 和平板通过 URL 访问同一页面
 */

function syncOpen(){
  var mask = document.getElementById("syncDialogMask");
  if (!mask) return;
  mask.classList.add("open");
  document.body.style.overflow = "hidden";
  syncRender();
}

function syncClose(){
  var mask = document.getElementById("syncDialogMask");
  if (mask) mask.classList.remove("open");
  document.body.style.overflow = "";
}

function syncRender(){
  var dialog = document.getElementById("syncDialog");
  if (!dialog) return;
  var dataSize = syncCalcSize();
  dialog.innerHTML =
    '<div class="sync-dlg-head">' +
      '<span class="sync-cap">☁️ 数据同步</span>' +
      '<button class="sync-close" type="button" onclick="syncClose()">×</button>' +
    '</div>' +
    '<div class="sync-dlg-body">' +
      '<div class="sync-data-info" style="margin-bottom:12px;">当前指挥官：<b>' + (SDB.current || '未设置') + '</b> · 数据约 <b>' + dataSize + ' KB</b>（含全部账号的进度/错题/打卡/真题）</div>' +
      '<div class="sync-section" id="gsPanel"><h3>🔗 云同步 · GitHub（推荐：连一次，全自动）</h3>加载中…</div>' +
      '<div class="sync-section">' +
        '<h3>💾 自动备份（不用管，出事能救回）</h3>' +
        '<p class="sync-desc">本浏览器自动留 12 份快照；每天自动下载一份备份文件到「下载」文件夹。</p>' +
        '<button class="sync-export-btn" type="button" onclick="bkupNow(\'manual\'); syncRender(); setTimeout(function(){ if(typeof syncRender===\"function\") syncRender(); }, 300);">💾 立即备份一次</button>' +
        '<div id="bkupBox" style="margin-top:10px;">加载中…</div>' +
      '</div>' +
      '<details class="sync-details">' +
        '<summary>📁 备用：文件导出 / 导入（没配云端时手动搬数据）</summary>' +
        '<div class="sync-section" style="border:none;margin:0;box-shadow:none;">' +
          '<p class="sync-desc">导出得到一个 .json 文件 → 发到其他设备（微信/网盘）→ 在那台设备点「选择数据文件」导入。<b>更推荐上面的 GitHub 云同步：连一次就全自动。</b></p>' +
          '<button class="sync-export-btn" type="button" onclick="syncExport()">📥 导出数据文件</button>' +
          '<input type="file" id="syncFileInput" accept=".json" style="display:none">' +
          '<button class="sync-import-btn" type="button" onclick="document.getElementById(\'syncFileInput\').click()">📂 选择数据文件导入</button>' +
          '<div id="syncImportResult"></div>' +
        '</div>' +
      '</details>' +
      '<details class="sync-details">' +
        '<summary>☁️ 备用：Cloudflare 云端（另一条云通道，可选）</summary>' +
        (typeof csRender === "function" ? csRender() : '') +
      '</details>' +
      '<p class="sync-desc" style="text-align:center;">一句话：日常什么都不用做；换设备 = 新设备连一次 GitHub → 点「从云端恢复」。</p>' +
      '<div id="csStatusLine" style="display:none"></div>' +
    '</div>';
  if (typeof gsRenderPanel === "function") gsRenderPanel();
  var input = document.getElementById("syncFileInput");
  if (input){
    input.addEventListener("change", function(){
      if (input.files.length > 0) syncImport(input.files[0]);
    });
  }
  if (typeof bkupRenderList === "function") bkupRenderList();
}

/* 渲染本地快照列表 */
function bkupRenderList(){
  var box = document.getElementById("bkupBox");
  if (!box) return;
  if (typeof bkupList !== "function"){ box.innerHTML = '<div class="sync-tips">当前浏览器不支持快照备份。</div>'; return; }
  bkupList().then(function(list){
    if (!list || list.length === 0){
      box.innerHTML = '<div class="sync-tips">还没有快照。学习过程中会自动保存，也可以点上面的「立即备份一次」。</div>';
      return;
    }
    var html = '<div class="bkup-list">';
    list.forEach(function(s){
      var d = new Date(s.t);
      var pad = function(n){ return (n < 10 ? "0" : "") + n; };
      var label = (d.getMonth() + 1) + "月" + d.getDate() + "日 " + pad(d.getHours()) + ":" + pad(d.getMinutes()) +
        (s.reason === "manual" ? "（手动）" : "（自动）") + (s.info ? " · " + s.info : "");
      html += '<div class="bkup-row">' +
        '<span class="bkup-time">🕐 ' + label + '</span>' +
        '<button class="sync-import-btn bkup-restore-btn" type="button" onclick="bkupDoRestore(' + s.t + ')">恢复</button>' +
      '</div>';
    });
    html += '</div>';
    box.innerHTML = html;
  });
}

function bkupDoRestore(t){
  if (!confirm("确定用这份快照覆盖当前数据吗？\n（会恢复到 " + new Date(t).toLocaleString() + " 时的进度）")) return;
  /* 用户确认后才留底：给当前状态留一份 pre-restore 快照，恢复错/更糟时可反悔 */
  try { if (typeof bkupNow === "function") bkupNow("pre-restore", true); } catch(_){}
  bkupRestore(t).then(function(ok){
    if (ok){ baToast("✅ 已恢复到该快照！页面即将刷新"); setTimeout(function(){ location.reload(); }, 1200); }
    else baToast("❌ 恢复失败，快照不存在或已损坏");
  });
}

function syncCalcSize(){
  var total = 0;
  try {
    for (var i = 0; i < localStorage.length; i++){
      var key = localStorage.key(i);
      var val = localStorage.getItem(key);
      total += (val || "").length;
    }
  } catch(e){}
  return Math.round(total / 1024);
}

function syncCollectData(){
  var data = {};
  try {
    for (var i = 0; i < localStorage.length; i++){
      var key = localStorage.key(i);
      if (!key) continue;
      data[key] = localStorage.getItem(key);
    }
  } catch(e){}
  return data;
}

function syncExport(){
  var data = syncCollectData();
  var payload = {
    app: "studyc-sync",
    version: 1,
    exportTime: new Date().toISOString(),
    user: SDB.current || "",
    data: data
  };
  var json = JSON.stringify(payload, null, 2);
  var blob = new Blob([json], { type: "application/json" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  var dateStr = new Date().toISOString().slice(0, 10);
  var userStr = (SDB.current || "user").replace(/[^\w\u4e00-\u9fff]/g, "");
  a.href = url;
  a.download = "studyc-" + userStr + "-" + dateStr + ".json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  baToast("数据已导出！请把文件传到另一台设备上导入。");
}

function syncImport(file){
  var reader = new FileReader();
  reader.onload = function(){
    try {
      var payload = JSON.parse(reader.result);
      if (payload.app !== "studyc-sync"){
        document.getElementById("syncImportResult").innerHTML =
          '<div class="sync-import-error">❌ 不是有效的学习数据文件</div>';
        return;
      }
      try { if (typeof bkupNow === "function") bkupNow("pre-import", true); } catch(_){}
      var data = payload.data;
      var count = 0;
      Object.keys(data).forEach(function(key){
        localStorage.setItem(key, data[key]);
        count++;
      });
      document.getElementById("syncImportResult").innerHTML =
        '<div class="sync-import-ok">✅ 导入成功！恢复了 ' + count + ' 项数据。页面将在2秒后刷新...</div>';
      setTimeout(function(){ location.reload(); }, 2000);
    } catch(e){
      document.getElementById("syncImportResult").innerHTML =
        '<div class="sync-import-error">❌ 文件解析失败：' + e.message + '</div>';
    }
  };
  reader.readAsText(file);
}