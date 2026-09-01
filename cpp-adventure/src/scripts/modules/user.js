function drawCmdr(){
  var bar = document.getElementById("cmdrBar");
  var name = document.getElementById("cmdrName");
  if (SDB.current){
    bar.style.display = "flex";
    name.textContent = SDB.current;
  } else {
    bar.style.display = "none";
  }
}
function openLogin(){
  var mask = document.getElementById("loginMask");
  var list = document.getElementById("userList");
  list.innerHTML = "";
  Object.keys(SDB.users).forEach(function(nm){
    var item = document.createElement("div");
    item.className = "user-list-item" + (nm === SDB.current ? " active" : "");
    var st = Object.keys(SDB.users[nm].passed || {}).length;
    item.innerHTML = '<span>👤 ' + nm + ' · ★' + st + '</span>' +
      (nm === SDB.current ? '<span style="color:var(--green);font-weight:700">当前</span>' : '<button type="button" onclick="switchUser(\'' + nm.replace(/'/g,"\\'") + '\')">切换</button>');
    list.appendChild(item);
  });
  mask.classList.add("open");
  setTimeout(function(){ document.getElementById("loginName").focus(); }, 50);
}
function closeLogin(){ document.getElementById("loginMask").classList.remove("open"); }
function doLogin(){
  var nm = document.getElementById("loginName").value.trim();
  if (!nm){ document.getElementById("loginName").focus(); return; }
  if (!SDB.users[nm]) SDB.users[nm] = {passed:{}};
  SDB.current = nm;
  S = SDB.users[nm];
  saveS();
  closeLogin();
  document.getElementById("loginName").value = "";
  afterUserSwitch();
}
function switchUser(nm){
  SDB.current = nm;
  S = SDB.users[nm];
  saveS();
  closeLogin();
  afterUserSwitch();
}
function afterUserSwitch(){
  drawCmdr();
  drawAll();
  drawRoad();
  mtNew();
  kbRender();
  planInit();
  updateTabs();
  renderErr();
}
function exportSave(){
  var data = JSON.stringify(SDB, null, 2);
  var blob = new Blob([data], {type:"application/json"});
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "cpp冒险存档_" + (SDB.current || "备份") + ".json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function importSave(e){
  var file = e.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(){
    try {
      var data = JSON.parse(reader.result);
      if (data && data.users){
        SDB = data;
        if (SDB.current && SDB.users[SDB.current]) S = SDB.users[SDB.current];
        else S = {passed:{}};
        saveS();
        afterUserSwitch();
        alert("存档导入成功！欢迎回来，" + (SDB.current || "指挥官") + "。");
      } else { alert("文件格式不对哦，请选之前导出的存档文件。"); }
    } catch(err){ alert("读取失败：" + err.message); }
  };
  reader.readAsText(file);
  e.target.value = "";
}
