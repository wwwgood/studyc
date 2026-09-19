/* ---------------- 电子课本（云盘目录版）books.js ----------------
 * 课本文件不存网站、不上传：这里只登记「课本名字 + 它在云盘里的位置」。
 *  - 文件本体放在用户自己的云盘（网盘/OneDrive 等），看书去云盘看
 *  - 目录（名字/分类/云盘位置）存 localStorage（sc_books / sc_book_cats）
 *  - GitHub 云同步（gist-sync.js）自动带上这两个键 → 所有设备目录一致
 *  - 位置填 http/https 链接时，可点 🔗 直接跳去云盘打开
 *  - 「扫描文件夹」只读取文件名和大小，不读取、不上传文件内容
 *  - 旧版（文件存 IndexedDB）升级兼容：老条目原样保留，删除条目时顺手清理旧文件副本
 */
var BK_DB_NAME = "sc_book_files";   /* 旧版文件库：只用于删除时清理残留，不再写入 */
var BK_DB_STORE = "files";
var BK_META_KEY = "sc_books";
var BK_CATS_KEY = "sc_book_cats";

/* ---------- 旧版 IndexedDB 清理（只删不写） ---------- */
var BK_DB = null;
function bkOpenDB(){
  return new Promise(function(resolve, reject){
    if (BK_DB) return resolve(BK_DB);
    var req = indexedDB.open(BK_DB_NAME, 1);
    req.onupgradeneeded = function(e){
      var db = e.target.result;
      if (!db.objectStoreNames.contains(BK_DB_STORE)) db.createObjectStore(BK_DB_STORE);
    };
    req.onsuccess = function(e){ BK_DB = e.target.result; resolve(BK_DB); };
    req.onerror = function(){ reject(req.error || new Error("无法打开本地课本库")); };
  });
}
function bkDBDelRange(prefix){
  return bkOpenDB().then(function(db){
    return new Promise(function(resolve, reject){
      var tx = db.transaction(BK_DB_STORE, "readwrite");
      var store = tx.objectStore(BK_DB_STORE);
      var range = IDBKeyRange.bound(prefix, prefix + "\uffff");
      store.delete(range);
      tx.oncomplete = function(){ resolve(); };
      tx.onerror = function(){ reject(tx.error); };
    });
  }).catch(function(){});
}

/* ---------- 元数据 ---------- */
function bkMeta(){
  try { var v = JSON.parse(localStorage.getItem(BK_META_KEY) || "[]"); return Array.isArray(v) ? v : []; }
  catch(e){ return []; }
}
function bkSaveMeta(list){
  localStorage.setItem(BK_META_KEY, JSON.stringify(list));
  /* 目录变化后让 GitHub 云同步择机上传（gsMarkDirty 有节流与防呆，不会立刻写） */
  try { if (typeof gsMarkDirty === "function") gsMarkDirty(); } catch(e){}
}
function bkFind(bid){ return bkMeta().filter(function(b){ return b.id === bid; })[0] || null; }

/* 目录收敛：云同步合并后同一本可能出现新旧两条（同 id 不同内容），只留最新编辑的那条。
 * 只按 id 去重，绝不碰无重复的条目；在进入视图和页面加载时执行一次。 */
function bkBetterOf(a, b){
  var ta = a.edited || a.created || 0;
  var tb = b.edited || b.created || 0;
  if (ta !== tb) return ta > tb ? a : b;
  return (!a.location && b.location) ? b : a;
}
function bkNormalizeStore(){
  var list = bkMeta();
  var seen = {}, out = [], changed = false;
  list.forEach(function(b){
    if (!b || !b.id || !b.name){ changed = true; return; }
    if (typeof b.location !== "string"){ b.location = ""; changed = true; }
    var prev = seen[b.id];
    if (!prev){ seen[b.id] = b; out.push(b); return; }
    changed = true;
    var keep = bkBetterOf(prev, b);
    out[out.indexOf(prev)] = keep;
    seen[b.id] = keep;
  });
  if (changed) bkSaveMeta(out);
  return out;
}

/* ---------- 分类（课本分类） ---------- */
function bkCats(){
  try { var v = JSON.parse(localStorage.getItem(BK_CATS_KEY) || "[]"); return Array.isArray(v) ? v : []; }
  catch(e){ return []; }
}
function bkSaveCats(list){
  localStorage.setItem(BK_CATS_KEY, JSON.stringify(list));
  try { if (typeof gsMarkDirty === "function") gsMarkDirty(); } catch(e){}
}
function bkCatName(cid){
  var c = bkCats().filter(function(x){ return x.id === cid; })[0];
  return c ? c.name : "";
}

function bkUid(){
  return "b" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function bkFmtSize(n){
  if (n >= 1024 * 1024) return (n / 1024 / 1024).toFixed(1) + " MB";
  if (n >= 1024) return Math.round(n / 1024) + " KB";
  return n + " B";
}
function bkEsc(s){
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function bkTypeEmoji(ft){
  if (ft === "pdf") return "📄";
  if (ft === "img") return "🖼";
  if (ft === "docx") return "📝";
  return "📖";
}
function bkIsUrl(s){ return /^https?:\/\//i.test(String(s || "").trim()); }

/* ---------- 渲染课本目录（按分类分组） ---------- */
function bkRender(){
  var wrap = document.getElementById("bkList");
  if (!wrap){ console.warn("[bk] bkRender: #bkList 元素不存在"); return; }
  var list = bkNormalizeStore();
  if (list.length === 0){
    wrap.innerHTML = '<div class="bk-empty">📖 目录里还没有课本。<br>点右上「＋ 添加课本」登记名字和云盘位置，文件放在你自己的云盘里。</div>' +
      (bkCats().length > 0 ? '<div class="bk-empty-cats">🗂 已建分类：' + bkCats().map(function(c){ return bkEsc(c.name); }).join("、") + '</div>' : '');
    return;
  }

  var cats = bkCats();
  var html = "";
  if (cats.length > 0){
    cats.forEach(function(c){
      var bs = list.filter(function(b){ return b.catId === c.id; });
      if (bs.length === 0) return;
      html += bkRenderCatBlock(c, bs);
    });
    var uncat = list.filter(function(b){ return !b.catId || !cats.some(function(c){ return c.id === b.catId; }); });
    if (uncat.length > 0){
      html += bkRenderCatBlock({ id: "", name: "📁 未归类", emoji: "📁" }, uncat);
    }
  } else {
    list.slice().reverse().forEach(function(b){ html += bkRenderCard(b); });
  }
  wrap.innerHTML = html;
}

function bkRenderCatBlock(c, bs){
  var totalSize = 0;
  bs.forEach(function(b){ totalSize += b.fileSize || 0; });
  var html = '<div class="bk-cat-block">' +
    '<div class="bk-cat-head">' +
      '<span class="bk-cat-emoji">' + (c.emoji || "🗂") + '</span>' +
      '<span class="bk-cat-name">' + bkEsc(c.name) + '</span>' +
      '<span class="bk-cat-meta">' + bs.length + ' 本 · ' + bkFmtSize(totalSize) + '</span>' +
    '</div>' +
    '<div class="bk-cat-list">';
  bs.slice().reverse().forEach(function(b){ html += bkRenderCard(b); });
  html += '</div></div>';
  return html;
}

function bkRenderCard(b){
  var catOpts = bkCatOptionsHTML(b.catId || "", false);
  var emoji = bkTypeEmoji(b.fileType);
  var bits = [];
  if (b.fileType === "pdf") bits.push("PDF");
  else if (b.fileType === "docx") bits.push("Word");
  else if (b.fileType === "img") bits.push("图片");
  if (b.fileSize) bits.push(bkFmtSize(b.fileSize));
  var meta = bits.length ? bits.join(" · ") : "目录条目";

  var loc = (b.location || "").trim();
  var locLine = loc
    ? '<span class="bk-card-meta bk-card-loc">📍 <span class="bk-loc-text' + (bkIsUrl(loc) ? " bk-loc-link" : "") + '" title="' + bkEsc(loc) + '">' + bkEsc(loc) + '</span></span>'
    : '<span class="bk-card-meta bk-card-loc bk-loc-empty">📍 云盘位置还没填，点卡片填一下</span>';
  var urlBtn = bkIsUrl(loc)
    ? '<button class="bk-card-del" type="button" title="去云盘打开" onclick="bkOpenUrl(\'' + b.id + '\')">🔗</button>'
    : "";

  return '<div class="bk-card">' +
    '<button class="bk-card-main" type="button" onclick="bkOpen(\'' + b.id + '\')" title="编辑名字 / 云盘位置">' +
      '<span class="bk-card-emoji">' + emoji + '</span>' +
      '<span class="bk-card-info">' +
        '<span class="bk-card-name">' + bkEsc(b.name) + '</span>' +
        '<span class="bk-card-meta">' + meta + '</span>' +
        locLine +
      '</span>' +
      '<span class="bk-card-go">✏️ 编辑</span>' +
    '</button>' +
    urlBtn +
    '<select class="bk-cat-select" title="移入分类" onchange="bkModifyCat(\'' + b.id + '\', this.value)">' + catOpts + '</select>' +
    '<button class="bk-card-del" type="button" title="从目录移除" onclick="bkDelete(\'' + b.id + '\')">🗑</button>' +
  '</div>';
}

/* ---------- 添加 / 编辑 ---------- */
function bkCatOptionsHTML(selectedId, withNew){
  var cats = bkCats();
  var opts = '<option value=""' + (selectedId === "" ? " selected" : "") + '>（不分类）</option>';
  cats.forEach(function(c){
    opts += '<option value="' + c.id + '"' + (selectedId === c.id ? " selected" : "") + '>' + bkEsc(c.name) + '</option>';
  });
  if (withNew){
    opts += '<option value="__new__"' + (selectedId === "__new__" ? " selected" : "") + '>（＋ 新建分类…）</option>';
  }
  return opts;
}

function bkOpenAdd(){
  var dlg = document.getElementById("bkDialog");
  var mask = document.getElementById("bkMask");
  if (!dlg || !mask) return;
  dlg.className = "bk-dialog";
  dlg.innerHTML =
    '<div class="bk-dlg-head">' +
      '<span class="bk-cap">📖 登记课本（只记名字和云盘位置）</span>' +
      '<button class="bk-close" type="button" onclick="bkClose()">×</button>' +
    '</div>' +
    '<div class="bk-dlg-body">' +
      '<div class="bk-add-tip">这里的「电子课本」只是<b>目录</b>：登记课本名字 + 它在你云盘里的位置，<b>文件不上传到网站</b>。看书去云盘看；名字和位置会随 GitHub 云同步带到所有设备。</div>' +
      '<div class="bk-add-row">' +
        '<label>课本名字</label>' +
        '<input type="text" id="bkAddName" placeholder="如：义务教育教科书 数学 七年级 上册" maxlength="80">' +
      '</div>' +
      '<div class="bk-add-row">' +
        '<label>所属分类</label>' +
        '<select id="bkAddCatSel" class="bk-cat-select" style="max-width:none;flex:1;">' + bkCatOptionsHTML("", true) + '</select>' +
      '</div>' +
      '<div class="bk-add-row">' +
        '<label>云盘位置</label>' +
        '<input type="text" id="bkAddLoc" placeholder="云盘分享链接或路径，可留空以后填" maxlength="300">' +
      '</div>' +
      '<div class="bk-add-actions">' +
        '<button class="bk-btn primary" type="button" onclick="bkAddOne()">＋ 登记这本</button>' +
        '<button class="bk-btn" type="button" onclick="bkClose()">收起</button>' +
      '</div>' +
      '<div class="bk-add-tip" style="margin-top:18px;"><b>📁 批量登记：</b>选一个课本文件夹，只把<b>文件名</b>登记进目录（以文件夹名建分类），不读取、不上传文件内容。</div>' +
      '<div class="bk-add-row">' +
        '<label>课本文件夹</label>' +
        '<input type="file" id="bkFolderInput" webkitdirectory multiple>' +
        '<button class="bk-btn sm" type="button" onclick="bkScanFolder()">🔍 扫描文件夹</button>' +
      '</div>' +
      '<div id="bkFolderPreview"></div>' +
      '<div class="bk-add-actions">' +
        '<button class="bk-btn primary" type="button" onclick="bkSaveBatch()" id="bkSaveBatchBtn" style="display:none">💾 全部登记（0 条）</button>' +
      '</div>' +
    '</div>';
  mask.classList.add("open");
}

/* 手动登记一条 */
function bkAddOne(){
  var nameEl = document.getElementById("bkAddName");
  var name = ((nameEl && nameEl.value) || "").trim();
  if (!name){ bkToast("先填课本名字"); return; }
  var catId = "";
  var sel = document.getElementById("bkAddCatSel");
  if (sel && sel.value === "__new__"){
    var nm = prompt("新分类名称：", "") || "";
    nm = nm.trim();
    if (nm){
      var cats = bkCats();
      var exist = cats.filter(function(c){ return c.name === nm; })[0];
      if (exist) catId = exist.id;
      else { catId = bkUid(); cats.push({ id: catId, name: nm }); bkSaveCats(cats); }
    }
  } else if (sel){
    catId = sel.value || "";
  }
  var loc = ((document.getElementById("bkAddLoc") || {}).value || "").trim();
  var list = bkMeta();
  var dup = list.filter(function(b){ return b.name === name && (b.catId || "") === catId; })[0];
  if (dup){
    if (!dup.location && loc){ dup.location = loc; dup.edited = Date.now(); bkSaveMeta(list); bkRender(); bkClose(); bkToast("目录里已有这本，已把云盘位置补上"); return; }
    bkToast("目录里已有同名同分类的课本，没有重复添加");
    return;
  }
  list.push({ id: bkUid(), name: name, catId: catId, location: loc, created: Date.now() });
  bkSaveMeta(list);
  bkRender();
  bkClose();
  bkToast("✅ 已登记「" + name + "」（只记名字，文件不上传）");
}

function bkIsImage(name){
  var n = name.toLowerCase();
  return n.endsWith(".jpg") || n.endsWith(".jpeg") || n.endsWith(".png") || n.endsWith(".gif") || n.endsWith(".webp") || n.endsWith(".bmp");
}
function bkIsPDF(name){ return name.toLowerCase().endsWith(".pdf"); }
function bkIsDocx(name){ return name.toLowerCase().endsWith(".docx"); }

/* 扫描文件夹：只登记文件名（不读取文件内容） */
function bkScanFolder(){
  var input = document.getElementById("bkFolderInput");
  if (!input || !input.files || input.files.length === 0){
    bkToast("请先选择一个课本文件夹");
    return;
  }
  var files = Array.prototype.slice.call(input.files);
  if (files.length > 500){
    bkToast("文件夹内文件太多（" + files.length + "），建议分批");
    return;
  }

  /* 1. 取文件夹名（建分类用） */
  var folderName = "";
  for (var i = 0; i < files.length; i++){
    var rp = files[i].webkitRelativePath || "";
    if (rp){
      var parts = rp.split(/[\\/]/);
      if (parts.length > 1){ folderName = parts[0]; break; }
    }
  }
  if (!folderName) folderName = "未命名分类";

  /* 2. 只要支持的文件名，一个文件一条目录 */
  var batch = [];
  files.forEach(function(f){
    var ft = null;
    if (bkIsPDF(f.name)) ft = "pdf";
    else if (bkIsDocx(f.name)) ft = "docx";
    else if (bkIsImage(f.name)) ft = "img";
    if (!ft) return;
    batch.push({ name: f.name.replace(/\.[^.]+$/, ""), fileType: ft, fileSize: f.size || 0 });
  });
  if (batch.length === 0){
    bkToast("文件夹内没有找到 PDF / 图片 / Word 文件");
    return;
  }

  BK_BATCH = batch;
  BK_BATCH_CAT = folderName;

  /* 3. 预览（可改名） */
  var preview = document.getElementById("bkFolderPreview");
  var html = '<div class="bk-folder-info">📂 分类：<b>' + bkEsc(folderName) + '</b>　（识别到 ' + batch.length + ' 个文件名，只登记名字，不读取文件内容）</div>';
  html += '<div class="bk-batch-list">';
  batch.forEach(function(item, idx){
    var emoji = bkTypeEmoji(item.fileType);
    var typeLabel = item.fileType === "pdf" ? "PDF" : (item.fileType === "img" ? "图片" : "Word");
    html += '<div class="bk-batch-row">' +
      '<span class="bk-batch-name"><b>' + (idx + 1) + '.</b> ' + emoji + ' ' + bkEsc(item.name) + '</span>' +
      '<span class="bk-batch-meta">' + typeLabel + (item.fileSize ? " · " + bkFmtSize(item.fileSize) : "") + '</span>' +
      '<input type="text" class="bk-batch-rename" value="' + bkEsc(item.name) + '" onchange="BK_BATCH[' + idx + '].name=this.value" placeholder="课本名">' +
    '</div>';
  });
  html += '</div>';
  preview.innerHTML = html;

  var btn = document.getElementById("bkSaveBatchBtn");
  if (btn){
    btn.style.display = "inline-block";
    btn.textContent = "💾 全部登记（" + batch.length + " 条）";
  }
}

/* 批量登记：只写目录，不碰文件 */
function bkSaveBatch(){
  var batch = BK_BATCH || [];
  if (batch.length === 0){ bkToast("请先扫描文件夹"); return; }
  var catName = BK_BATCH_CAT || "未命名分类";

  var cats = bkCats();
  var catId = "";
  var exist = cats.filter(function(c){ return c.name === catName; })[0];
  if (exist){ catId = exist.id; }
  else { catId = bkUid(); cats.push({ id: catId, name: catName }); bkSaveCats(cats); }

  var list = bkMeta();
  var added = 0, dup = 0;
  batch.forEach(function(item){
    var dupHit = list.filter(function(b){ return (b.catId || "") === catId && b.name === item.name; })[0];
    if (dupHit){ dup++; return; }
    list.push({
      id: bkUid(), name: item.name, catId: catId,
      fileType: item.fileType, fileSize: item.fileSize || 0,
      location: "", created: Date.now()
    });
    added++;
  });
  bkSaveMeta(list);
  bkRender();
  bkClose();
  if (added > 0){
    bkToast("✅ 已登记 " + added + " 本到「" + catName + "」（只记名字，文件不上传）" + (dup ? "，跳过重复 " + dup + " 条" : ""));
  } else {
    bkToast("这些课本名字都已在目录里，没有重复添加");
  }
}

/* 编辑一条：改名字 + 填/改云盘位置 */
function bkOpen(bid){
  var b = bkFind(bid);
  if (!b){ console.warn("[bk] bkOpen: 找不到 bid=", bid); return; }
  var dlg = document.getElementById("bkDialog");
  var mask = document.getElementById("bkMask");
  if (!dlg || !mask) return;
  dlg.className = "bk-dialog small";
  var loc = (b.location || "").trim();
  var openBtn = bkIsUrl(loc)
    ? '<a class="bk-btn" type="button" href="' + bkEsc(loc) + '" target="_blank" rel="noopener">🔗 现在去云盘打开</a>'
    : "";
  dlg.innerHTML =
    '<div class="bk-dlg-head">' +
      '<span class="bk-cap">📖 编辑课本信息</span>' +
      '<button class="bk-close" type="button" onclick="bkClose()">×</button>' +
    '</div>' +
    '<div class="bk-dlg-body">' +
      '<div class="bk-add-tip">文件不上传到这里。把课本在<b>云盘里的位置</b>填在下面（分享链接或路径都行），以后点 🔗 或照着路径去云盘看。名字和位置会自动随 GitHub 云同步到所有设备。</div>' +
      '<div class="bk-add-row">' +
        '<label>课本名字</label>' +
        '<input type="text" id="bkEditName" value="' + bkEsc(b.name) + '" maxlength="80">' +
      '</div>' +
      '<div class="bk-add-row">' +
        '<label>云盘位置</label>' +
        '<input type="text" id="bkEditLoc" value="' + bkEsc(loc) + '" placeholder="如 https://pan.xx.com/s/xxxx 或 /我的云盘/初中数学/数学七上.pdf" maxlength="300">' +
      '</div>' +
      '<div class="bk-add-actions">' +
        '<button class="bk-btn primary" type="button" onclick="bkSaveEdit(\'' + b.id + '\')">💾 保存</button>' +
        openBtn +
        '<button class="bk-btn" type="button" onclick="bkClose()">取消</button>' +
      '</div>' +
    '</div>';
  mask.classList.add("open");
}

function bkSaveEdit(bid){
  var nameEl = document.getElementById("bkEditName");
  var locEl = document.getElementById("bkEditLoc");
  var name = ((nameEl && nameEl.value) || "").trim();
  if (!name){ bkToast("课本名字不能为空"); return; }
  var loc = ((locEl && locEl.value) || "").trim();
  var list = bkMeta();
  list.forEach(function(b){
    if (b.id !== bid) return;
    b.name = name;
    b.location = loc;
    b.edited = Date.now();
  });
  bkSaveMeta(list);
  bkRender();
  bkClose();
  bkToast("✅ 已保存，目录会随云同步到所有设备");
}

/* 一键跳去云盘看 */
function bkOpenUrl(bid){
  var b = bkFind(bid);
  var loc = b ? (b.location || "").trim() : "";
  if (!bkIsUrl(loc)){ bkToast("这条还没填云盘链接，先点卡片编辑填上"); return; }
  window.open(loc, "_blank", "noopener");
}

/* ---------- 分类管理 ---------- */
function bkManageCats(){
  var dlg = document.getElementById("bkDialog");
  var mask = document.getElementById("bkMask");
  if (!dlg || !mask) return;
  var cats = bkCats();
  var list = bkMeta();
  var rows = "";
  if (cats.length === 0){
    rows = '<div class="bk-cat-none">还没有分类。在下方输入名称点「＋ 新建」，比如「人教版」。</div>';
  }
  cats.forEach(function(c){
    var n = list.filter(function(b){ return b.catId === c.id; }).length;
    rows += '<div class="bk-cat-row">' +
      '<span class="bk-cat-row-name">🗂 ' + bkEsc(c.name) + '</span>' +
      '<span class="bk-cat-row-meta">' + n + ' 本课本</span>' +
      '<button class="bk-btn sm" type="button" onclick="bkRenameCat(\'' + c.id + '\')" title="重命名">✏️</button>' +
      '<button class="bk-btn sm" type="button" onclick="bkDeleteCat(\'' + c.id + '\')" title="删除分类">🗑</button>' +
    '</div>';
  });
  dlg.className = "bk-dialog small";
  dlg.innerHTML =
    '<div class="bk-dlg-head">' +
      '<span class="bk-cap">🗂 管理分类</span>' +
      '<button class="bk-close" type="button" onclick="bkClose()">×</button>' +
    '</div>' +
    '<div class="bk-dlg-body">' +
      '<div class="bk-add-tip">分类用来给课本目录分组。删除分类不会删除课本条目（条目会移到「未归类」）。</div>' +
      rows +
      '<div class="bk-cat-newrow">' +
        '<input type="text" id="bkNewCatName2" placeholder="新分类名称，如：人教版" maxlength="20">' +
        '<button class="bk-btn primary" type="button" onclick="bkAddCat()">＋ 新建</button>' +
      '</div>' +
    '</div>';
  mask.classList.add("open");
}

function bkAddCat(){
  var name = (document.getElementById("bkNewCatName2").value || "").trim();
  if (!name){ bkToast("请输入分类名称"); return; }
  var cats = bkCats();
  if (cats.filter(function(c){ return c.name === name; })[0]){ bkToast("同名分类已存在"); return; }
  cats.push({ id: bkUid(), name: name });
  bkSaveCats(cats);
  bkToast("已新建分类：" + name);
  bkManageCats();
  bkRender();
}

function bkRenameCat(cid){
  var c = bkCats().filter(function(x){ return x.id === cid; })[0];
  if (!c) return;
  var name = prompt("重命名分类：", c.name);
  if (!name || !name.trim() || name.trim() === c.name) return;
  name = name.trim();
  var cats = bkCats();
  cats.forEach(function(x){ if (x.id === cid) x.name = name; });
  bkSaveCats(cats);
  bkToast("已重命名为：" + name);
  bkManageCats();
  bkRender();
}

function bkDeleteCat(cid){
  var c = bkCats().filter(function(x){ return x.id === cid; })[0];
  if (!c) return;
  var n = bkMeta().filter(function(b){ return b.catId === cid; }).length;
  if (!confirm("删除分类「" + c.name + "」？\n" + (n > 0 ? "该分类下 " + n + " 本课本会移到「未归类」，课本条目不会被删除。" : "该分类下没有课本。"))) return;
  bkSaveCats(bkCats().filter(function(x){ return x.id !== cid; }));
  var list = bkMeta();
  list.forEach(function(b){ if (b.catId === cid) b.catId = ""; });
  bkSaveMeta(list);
  bkToast("已删除分类");
  bkManageCats();
  bkRender();
}

function bkModifyCat(bid, catId){
  var list = bkMeta();
  list.forEach(function(b){ if (b.id === bid) b.catId = catId || ""; });
  bkSaveMeta(list);
  bkRender();
  bkToast(catId ? "已移入「" + bkCatName(catId) + "」" : "已移到未归类");
}

function bkDelete(bid){
  var b = bkFind(bid);
  if (!b) return;
  if (!confirm("从目录移除「" + b.name + "」？\n（只是删掉这条目录记录，云盘里的文件不受影响）")) return;
  var list = bkMeta().filter(function(x){ return x.id !== bid; });
  bkSaveMeta(list);
  bkRender();
  bkToast("已从目录移除");
  /* 旧版把课本文件存过本机浏览器 IndexedDB，顺手清掉对应残留（失败忽略） */
  bkDBDelRange(bid + ":");
}

/* ---------- 关闭 ---------- */
function bkClose(){
  var mask = document.getElementById("bkMask");
  if (mask) mask.classList.remove("open");
}

/* ---------- 提示 ---------- */
function bkToast(msg){
  var box = document.getElementById("bkToast");
  if (!box){
    box = document.createElement("div");
    box.id = "bkToast";
    box.className = "bk-toast";
    document.body.appendChild(box);
  }
  box.textContent = msg;
  box.classList.add("show");
  clearTimeout(BK_TOAST_T);
  BK_TOAST_T = setTimeout(function(){ box.classList.remove("show"); }, 2400);
}
var BK_TOAST_T = null;

/* ---------- 批量登记的临时状态 ---------- */
var BK_BATCH = [];
var BK_BATCH_CAT = "";

/* ---------- 视图进入回调 ---------- */
function bkOnEnter(){
  bkNormalizeStore();
  bkRender();
}

window.addEventListener("load", function(){
  if (document.getElementById("bkList")) bkOnEnter();
});
