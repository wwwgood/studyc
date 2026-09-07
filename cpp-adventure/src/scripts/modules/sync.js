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
      '<div class="sync-section">' +
        '<h3>📊 当前数据</h3>' +
        '<div class="sync-data-info">' +
          '<div>当前指挥官：<b>' + (SDB.current || '未设置') + '</b></div>' +
          '<div>数据大小：约 <b>' + dataSize + ' KB</b></div>' +
          '<div>包含：学习进度、金币、错题本、打卡记录、导入的真题</div>' +
        '</div>' +
      '</div>' +
      '<div class="sync-section">' +
        '<h3>📤 导出数据到文件</h3>' +
        '<p class="sync-desc">把当前设备上的所有学习数据保存为一个文件，传到另一台设备上导入即可同步。</p>' +
        '<button class="sync-export-btn" type="button" onclick="syncExport()">📥 导出数据文件</button>' +
      '</div>' +
      '<div class="sync-section">' +
        '<h3>📥 从文件导入数据</h3>' +
        '<p class="sync-desc">选择之前导出的数据文件，恢复到当前设备。<b style="color:#DC2626;">注意：导入会覆盖当前设备上的数据！</b></p>' +
        '<input type="file" id="syncFileInput" accept=".json" style="display:none">' +
        '<button class="sync-import-btn" type="button" onclick="document.getElementById(\'syncFileInput\').click()">📂 选择数据文件</button>' +
        '<div id="syncImportResult"></div>' +
      '</div>' +
      '<div class="sync-section">' +
        '<h3>💡 使用说明</h3>' +
        '<div class="sync-tips">' +
          '<div>1. 在 PC 上点「导出数据文件」，下载一个 .json 文件</div>' +
          '<div>2. 把文件发到平板上（微信/邮件/U盘均可）</div>' +
          '<div>3. 在平板上打开同一网页，点「选择数据文件」导入</div>' +
          '<div>4. 两台设备的学习进度就同步了！</div>' +
          '<div style="margin-top:8px;color:#6B7280;">提示：每次学习后导出一次，换设备前导入一次，就能保持同步。</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  var input = document.getElementById("syncFileInput");
  if (input){
    input.addEventListener("change", function(){
      if (input.files.length > 0) syncImport(input.files[0]);
    });
  }
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
  var keysToSync = [
    "sdb_data", "studentCheckIn", "ba_imported_questions",
    "ba_baidu_api_key", "ba_baidu_secret_key", "ba_ocr_engine",
    "portalLastView"
  ];
  keysToSync.forEach(function(key){
    var val = localStorage.getItem(key);
    if (val !== null) data[key] = val;
  });
  for (var i = 0; i < localStorage.length; i++){
    var key = localStorage.key(i);
    if (key && key.indexOf("sdb_") === 0 && !data[key]){
      data[key] = localStorage.getItem(key);
    }
  }
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