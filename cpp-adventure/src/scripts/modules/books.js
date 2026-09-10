/* ---------------- 电子课本 books.js ----------------
 * 上传 PDF / 图片 / Word 电子课本原样展示 + 手写标注：
 *  - PDF 用 pdf.js 渲染成图片原样展示（扫描件也支持）
 *  - 图片（jpg/png/gif/webp）直接 img 展示，一文件夹多图 = 一本多页
 *  - Word（docx）用 mammoth.js 转 HTML 展示
 *  - 每页叠加透明画板：铅笔/橡皮手写标注（触屏+鼠标）
 *  - 课本文件（PDF/图片/Word/笔迹）存 IndexedDB（大容量，不占 GitHub 空间）
 *  - 元数据（课本列表）存 localStorage
 *  - 课本包导出/导入：一个 JSON 文件，微信互传 PC↔平板
 */
var BK_DB_NAME = "sc_book_files";
var BK_DB_STORE = "files";
var BK_META_KEY = "sc_books";
var BK_CATS_KEY = "sc_book_cats";

/* ---------- IndexedDB 封装 ---------- */
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
function bkDBPut(key, blob){
  return bkOpenDB().then(function(db){
    return new Promise(function(resolve, reject){
      var tx = db.transaction(BK_DB_STORE, "readwrite");
      tx.objectStore(BK_DB_STORE).put(blob, key);
      tx.oncomplete = function(){ resolve(); };
      tx.onerror = function(){ reject(tx.error); };
    });
  });
}
function bkDBGet(key){
  return bkOpenDB().then(function(db){
    return new Promise(function(resolve, reject){
      var tx = db.transaction(BK_DB_STORE, "readonly");
      var rq = tx.objectStore(BK_DB_STORE).get(key);
      rq.onsuccess = function(){ resolve(rq.result || null); };
      rq.onerror = function(){ reject(rq.error); };
    });
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
  });
}

/* ---------- 元数据 ---------- */
function bkMeta(){
  try { var v = JSON.parse(localStorage.getItem(BK_META_KEY) || "[]"); return Array.isArray(v) ? v : []; }
  catch(e){ return []; }
}
function bkSaveMeta(list){ localStorage.setItem(BK_META_KEY, JSON.stringify(list)); }
function bkFind(bid){ return bkMeta().filter(function(b){ return b.id === bid; })[0] || null; }

/* 分类（课本分类） */
function bkCats(){
  try { var v = JSON.parse(localStorage.getItem(BK_CATS_KEY) || "[]"); return Array.isArray(v) ? v : []; }
  catch(e){ return []; }
}
function bkSaveCats(list){ localStorage.setItem(BK_CATS_KEY, JSON.stringify(list)); }
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

/* ---------- 存储兼容工具 ----------
 * 老版本把 Blob 直接存进 IndexedDB：安卓浏览器（或清理工具清缓存）可能丢掉 Blob
 * 底层文件，读取时报「NotFoundError: 需要的文件或目录不能被找到」。
 * 新版本统一存 ArrayBuffer / 字符串（内联存储，不依赖 Blob 文件），
 * 读取时向下兼容两种格式。 */
function bkAsBlob(rec, mime){
  if (!rec) return null;
  if (rec instanceof Blob) return rec;
  if (rec instanceof ArrayBuffer) return new Blob([rec], { type: mime });
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView && ArrayBuffer.isView(rec)) return new Blob([rec], { type: mime });
  if (rec && rec.buf instanceof ArrayBuffer) return new Blob([rec.buf], { type: rec.mime || mime });
  return null;
}
function bkErrText(err){
  var name = (err && err.name) || "";
  var msg = (err && err.message) || "";
  if (name === "NotFoundError" || /file or directory|找不到|不能被找到|could not be found/i.test(msg)){
    return "这本课本的本地数据已丢失或被浏览器清理，请删除后重新上传一次（新版不会再出现这个问题）";
  }
  return msg || "未知错误";
}

/* ---------- 渲染课本列表（按分类分组） ---------- */
function bkRender(){
  var wrap = document.getElementById("bkList");
  if (!wrap){ console.warn("[bk] bkRender: #bkList 元素不存在"); return; }
  var list = bkMeta();
  console.log("[bk] bkRender 被调用：list.length=", list.length, "cats.length=", bkCats().length);
  if (list.length === 0){
    wrap.innerHTML = '<div class="bk-empty">📖 还没有电子课本。<br>点右上「＋ 添加课本」，上传 PDF / 图片 / Word 就能直接看，还能手写标注。</div>' +
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
  console.log("[bk] bkRender 渲染完成：html.length=", html.length);
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
  var size = bkFmtSize(b.fileSize || 0);
  var catOpts = bkCatOptionsHTML(b.catId || "", false);
  var emoji = bkTypeEmoji(b.fileType);
  var typeLabel = b.fileType === "pdf" ? "PDF" : (b.fileType === "img" ? "图片" : (b.fileType === "docx" ? "Word" : "课本"));
  return '<div class="bk-card">' +
    '<button class="bk-card-main" type="button" onclick="bkOpen(\'' + b.id + '\')">' +
      '<span class="bk-card-emoji">' + emoji + '</span>' +
      '<span class="bk-card-info">' +
        '<span class="bk-card-name">' + bkEsc(b.name) + '</span>' +
        '<span class="bk-card-meta">' + typeLabel + ' · ' + (b.pages || 0) + ' 页 · ' + size + '</span>' +
      '</span>' +
      '<span class="bk-card-go">打开看 →</span>' +
    '</button>' +
    '<select class="bk-cat-select" title="移入分类" onchange="bkModifyCat(\'' + b.id + '\', this.value)">' + catOpts + '</select>' +
    '<button class="bk-card-del" type="button" title="删除课本" onclick="bkDelete(\'' + b.id + '\')">🗑</button>' +
  '</div>';
}

/* ---------- 添加课本 ---------- */
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
      '<span class="bk-cap">📖 添加电子课本</span>' +
      '<button class="bk-close" type="button" onclick="bkClose()">×</button>' +
    '</div>' +
    '<div class="bk-dlg-body">' +
      '<div class="bk-add-tip">📁 选一个<b>课本文件夹</b>：系统自动以文件夹名建分类。<br>' +
        '支持以下文件类型：<br>' +
        '　📄 PDF —— 每个文件是一本课本（多页）<br>' +
        '　🖼 图片（jpg/png/gif/webp）—— 文件夹内所有图片合并为一本多页课本<br>' +
        '　📝 Word（docx）—— 每个文件是一本课本<br>' +
        '文件夹结构示例：<br>' +
        '　四年级上册课本/<br>' +
        '　　├ 语文.pdf<br>' +
        '　　├ 数学.pdf<br>' +
        '　　├ 英语.docx<br>' +
        '　　├ 课外阅读1.jpg<br>' +
        '　　└ 课外阅读2.jpg</div>' +
      '<div class="bk-add-row">' +
        '<label>📁 课本文件夹</label>' +
        '<input type="file" id="bkFolderInput" webkitdirectory allowdirs multiple accept=".pdf,.docx,.jpg,.jpeg,.png,.gif,.webp,application/pdf,image/*">' +
        '<button class="bk-btn sm" type="button" onclick="bkScanFolder()">🔍 扫描文件夹</button>' +
      '</div>' +
      '<div id="bkFolderPreview"></div>' +
      '<div class="bk-add-actions">' +
        '<button class="bk-btn primary" type="button" onclick="bkSaveBatch()" id="bkSaveBatchBtn" style="display:none">💾 全部保存（0 本）</button>' +
        '<button class="bk-btn" type="button" onclick="bkClose()">取消</button>' +
      '</div>' +
    '</div>';
  mask.classList.add("open");
  BK_SESSION = BK_SESSION || {};
  BK_SESSION._batch = [];
  BK_SESSION._catName = "";
}

function bkIsImage(name){
  var n = name.toLowerCase();
  return n.endsWith(".jpg") || n.endsWith(".jpeg") || n.endsWith(".png") || n.endsWith(".gif") || n.endsWith(".webp") || n.endsWith(".bmp");
}
function bkIsPDF(name){ return name.toLowerCase().endsWith(".pdf"); }
function bkIsDocx(name){ return name.toLowerCase().endsWith(".docx"); }

/* 扫描文件夹：识别分类名 + 配对文件 */
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

  /* 1. 取文件夹名 */
  var folderName = "";
  for (var i = 0; i < files.length; i++){
    var rp = files[i].webkitRelativePath || "";
    if (rp){
      var parts = rp.split(/[\\/]/);
      if (parts.length > 1){ folderName = parts[0]; break; }
    }
  }
  if (!folderName) folderName = "未命名分类";

  /* 2. 分类文件 */
  var pdfs = [], docxs = [], images = [];
  files.forEach(function(f){
    if (bkIsPDF(f.name)) pdfs.push(f);
    else if (bkIsDocx(f.name)) docxs.push(f);
    else if (bkIsImage(f.name)) images.push(f);
  });
  if (pdfs.length === 0 && docxs.length === 0 && images.length === 0){
    bkToast("文件夹内没有找到支持的文件（PDF / 图片 / Word）");
    return;
  }

  /* 3. 构建批次：每个 PDF/Word 一本，所有图片合并为一本 */
  var batch = [];
  pdfs.forEach(function(f){
    batch.push({ files: [f], name: f.name.replace(/\.pdf$/i, ""), fileType: "pdf", fileSize: f.size, pages: 0 });
  });
  docxs.forEach(function(f){
    batch.push({ files: [f], name: f.name.replace(/\.docx$/i, ""), fileType: "docx", fileSize: f.size, pages: 0 });
  });
  if (images.length > 0){
    images.sort(function(a, b){ return (a.webkitRelativePath || a.name).localeCompare(b.webkitRelativePath || b.name); });
    var imgSize = 0;
    images.forEach(function(f){ imgSize += f.size; });
    var imgName = images.length > 1 ? folderName + "（图片集）" : images[0].name.replace(/\.[^.]+$/, "");
    batch.push({ files: images, name: imgName, fileType: "img", fileSize: imgSize, pages: images.length });
  }

  BK_SESSION._batch = batch;
  BK_SESSION._catName = folderName;
  console.log("[bk] bkScanFolder: folderName=", folderName, "batch=", batch.length, "本 (pdf=", pdfs.length, "docx=", docxs.length, "img=", images.length, ")");

  /* 4. 渲染预览列表 */
  var preview = document.getElementById("bkFolderPreview");
  var html = '<div class="bk-folder-info">📂 分类：<b>' + bkEsc(folderName) + '</b>　（共 ' + batch.length + ' 本课本：' + pdfs.length + ' 个PDF + ' + docxs.length + ' 个Word + ' + images.length + ' 张图片）</div>';
  html += '<div class="bk-batch-list">';
  batch.forEach(function(item, idx){
    var emoji = bkTypeEmoji(item.fileType);
    var typeLabel = item.fileType === "pdf" ? "PDF" : (item.fileType === "img" ? "图片" + (item.files.length > 1 ? "×" + item.files.length : "") : "Word");
    html += '<div class="bk-batch-row">' +
      '<span class="bk-batch-name"><b>' + (idx + 1) + '.</b> ' + emoji + ' ' + bkEsc(item.name) + '</span>' +
      '<span class="bk-batch-meta">' + typeLabel + ' · ' + bkFmtSize(item.fileSize) + '</span>' +
      '<input type="text" class="bk-batch-rename" value="' + bkEsc(item.name) + '" onchange="BK_SESSION._batch[' + idx + '].name=this.value" placeholder="课本名">' +
    '</div>';
  });
  html += '</div>';
  preview.innerHTML = html;

  var btn = document.getElementById("bkSaveBatchBtn");
  if (btn){
    btn.style.display = "inline-block";
    btn.textContent = "💾 全部保存（" + batch.length + " 本）";
  }
}

/* 批量保存：逐本写入 IndexedDB */
function bkSaveBatch(){
  if (!BK_SESSION || !BK_SESSION._batch){ bkToast("请先选择文件夹并扫描"); console.warn("[bk] bkSaveBatch: BK_SESSION 或 _batch 为空"); return; }
  var batch = BK_SESSION._batch || [];
  if (batch.length === 0){ bkToast("没有可保存的课本"); return; }
  var catName = BK_SESSION._catName || "未命名分类";
  console.log("[bk] bkSaveBatch 开始：batch=", batch.length, "本, catName=", catName);

  /* 分类：建或找已有 */
  var cats = bkCats();
  var catId = "";
  var exist = cats.filter(function(c){ return c.name === catName; })[0];
  if (exist){ catId = exist.id; }
  else { catId = bkUid(); cats.push({ id: catId, name: catName }); bkSaveCats(cats); }

  bkToast("正在保存 " + batch.length + " 本课本…");
  var meta = bkMeta();
  var chain = Promise.resolve();
  var saved = 0;
  var failed = 0;

  batch.forEach(function(item, _idx){
    chain = chain.then(function(){
      return new Promise(function(resolve){
        var bid = bkUid();
        /* 读取文件为 ArrayBuffer 存入 IndexedDB（不用 Blob：安卓上 Blob 文件可能被系统清理导致读不出） */
        var fchain = Promise.resolve();
        if (item.fileType === "pdf" || item.fileType === "docx"){
          /* 单文件：存原始 ArrayBuffer */
          fchain = fchain.then(function(){
            return new Promise(function(r){
              var r0 = new FileReader();
              r0.onload = function(){ bkDBPut(bid + ":content", r0.result).then(function(){ r(true); }, function(){ r(false); }); };
              r0.onerror = function(){ r(false); };
              r0.readAsArrayBuffer(item.files[0]);
            });
          });
        } else if (item.fileType === "img"){
          /* 多图片：存为 content:0, content:1, ...（{buf, mime} 对象） */
          item.files.forEach(function(f, i){
            fchain = fchain.then(function(ok){
              if (ok === false) return false;
              return new Promise(function(r){
                var ri = new FileReader();
                ri.onload = function(){ bkDBPut(bid + ":content:" + i, { buf: ri.result, mime: f.type || "image/jpeg" }).then(function(){ r(true); }, function(){ r(false); }); };
                ri.onerror = function(){ r(false); };
                ri.readAsArrayBuffer(f);
              });
            });
          });
        }

        fchain.then(function(ok){
          if (ok === false){ failed++; resolve(); return; }
          meta.push({
            id: bid, name: item.name, catId: catId,
            fileType: item.fileType, pages: item.pages || 0, fileSize: item.fileSize,
            fileCount: item.files.length, created: Date.now()
          });
          saved++;
          var btn = document.getElementById("bkSaveBatchBtn");
          if (btn) btn.textContent = "💾 保存中 " + saved + " / " + batch.length + "…";
          resolve();
        }).catch(function(){ failed++; resolve(); });
      });
    });
  });

  chain.then(function(){
    bkSaveMeta(meta);
    console.log("[bk] bkSaveBatch 完成：saved=", saved, "failed=", failed, "meta.length=", meta.length, "localStorage sc_books=", localStorage.getItem(BK_META_KEY));
    if (failed > 0){
      bkToast("⚠️ 已保存 " + saved + " 本，" + failed + " 本写入失败（本地存储空间不足？），建议重试");
    } else {
      bkToast("✅ 已保存 " + saved + " 本课本到「" + catName + "」");
    }
    bkRender();
    bkClose();
  }).catch(function(err){
    console.error("[bk] bkSaveBatch chain 失败:", err);
    bkToast("保存失败：" + (err && err.message || "未知错误"));
  });
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
    rows = '<div class="bk-cat-none">还没有分类。在下方输入名称点「＋ 新建」，比如「四年级上册课本」。</div>';
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
      '<div class="bk-add-tip">分类用来给课本分组。删除分类不会删除课本（课本会移到「未归类」）。</div>' +
      rows +
      '<div class="bk-cat-newrow">' +
        '<input type="text" id="bkNewCatName2" placeholder="新分类名称，如：四年级上册课本" maxlength="20">' +
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
  if (!confirm("删除分类「" + c.name + "」？\n" + (n > 0 ? "该分类下 " + n + " 本课本会移到「未归类」，课本本身不会被删除。" : "该分类下没有课本。"))) return;
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
  if (!confirm("确定删除课本「" + b.name + "」吗？\n课本文件和手写笔迹会一起删除，删除后无法恢复。")) return;
  bkDBDelRange(bid + ":").then(function(){
    var list = bkMeta().filter(function(x){ return x.id !== bid; });
    bkSaveMeta(list);
    bkRender();
    bkToast("已删除课本");
  }).catch(function(){ bkToast("删除失败"); });
}

/* ---------- 阅读器（全屏） ---------- */
var BK_SESSION = null;   // { bid, name, fileType, scale, fit, pageCount, color, eraser, pages, current }

function bkOpen(bid){
  var b = bkFind(bid);
  if (!b){ console.warn("[bk] bkOpen: 找不到 bid=", bid); return; }
  console.log("[bk] bkOpen：", b.name, "fileType=", b.fileType, "pages=", b.pages);
  var mask = document.getElementById("bkMask");
  var dlg = document.getElementById("bkDialog");
  if (!mask || !dlg) return;
  dlg.className = "bk-dialog";

  var emoji = bkTypeEmoji(b.fileType);
  var writeBtn = "";
  var inkTools = "";
  if (b.fileType !== "docx"){
    writeBtn = '<button class="bk-fab" id="bkBtnWrite" type="button" onclick="bkToggleWrite()" title="书写/操作切换">✍️</button>';
    inkTools =
      '<div class="bk-reader-tools2" id="bkTools2" style="display:none">' +
        '<span class="bk-t2-label">✏️ 颜色</span>' +
        '<button type="button" class="bk-color" data-c="#e91e63" style="background:#e91e63" onclick="bkPickColor(this)"></button>' +
        '<button type="button" class="bk-color" data-c="#2196f3" style="background:#2196f3" onclick="bkPickColor(this)"></button>' +
        '<button type="button" class="bk-color" data-c="#4caf50" style="background:#4caf50" onclick="bkPickColor(this)"></button>' +
        '<button type="button" class="bk-color" data-c="#000000" style="background:#000" onclick="bkPickColor(this)"></button>' +
        '<button type="button" class="bk-tb" id="bkBtnEraser" onclick="bkPickColor({eraser:true});">🧽 橡皮</button>' +
        '<button type="button" class="bk-tb" onclick="bkClearPage()">🗑 清空本页</button>' +
        '<span class="bk-t2-hint">书写模式已开启：手指直接写字，自动保存；点右下角 🖐️ 按钮退出书写后，才能滑动翻页</span>' +
      '</div>';
  }

  dlg.innerHTML =
    '<div class="bk-dlg-head bk-reader-head">' +
      '<button class="bk-back" type="button" onclick="bkClose()">⬅ 返回</button>' +
      '<span class="bk-cap" id="bkReaderTitle">' + emoji + ' ' + bkEsc(b.name) + '</span>' +
      '<button class="bk-close" type="button" onclick="bkClose()">×</button>' +
    '</div>' +
    '<div class="bk-reader-toolbar" id="bkToolbar">' +
      '<button type="button" class="bk-tb" onclick="bkTool(\'prev\')">⬅ 上一页</button>' +
      '<button type="button" class="bk-tb" onclick="bkTool(\'next\')">下一页 ➡</button>' +
      '<span class="bk-tb-page" id="bkPageInfo">第 1 页</span>' +
      '<button type="button" class="bk-tb" onclick="bkTool(\'zoomout\')">−</button>' +
      '<span class="bk-tb-zoom" id="bkZoomInfo">100%</span>' +
      '<button type="button" class="bk-tb" onclick="bkTool(\'zoomin\')">＋</button>' +
      '<button type="button" class="bk-tb" onclick="bkTool(\'fit\')">🖼 适配</button>' + writeBtn +
    '</div>' +
    inkTools +
    '<div class="bk-pages" id="bkPages"><div class="bk-loading">⏳ 正在打开课本…</div></div>';
  mask.classList.add("open");

  BK_SESSION = {
    bid: bid, name: b.name, fileType: b.fileType, scale: 1, fit: true, pageCount: 0,
    color: "#e91e63", eraser: false, pages: [], current: 0, writing: false
  };
  /* 占一条历史记录：阅读器里按浏览器/安卓返回键 = 关闭阅读器，不会退出网站 */
  BK_PUSHED = true;
  try { history.pushState({bkReader:1}, ""); } catch(e){ BK_PUSHED = false; }

  if (b.fileType === "pdf") bkLoadPDF(bid, b);
  else if (b.fileType === "img") bkLoadImages(bid, b);
  else if (b.fileType === "docx") bkLoadDocx(bid, b);
}

/* 读取 PDF 并渲染 */
function bkLoadPDF(bid, b){
  console.log("[bk] bkLoadPDF 开始：bid=", bid, "fileType=", b.fileType, "pages=", b.pages, "protocol=", location.protocol);
  /* 显式配置 pdf.js worker：https 下必须指定，否则部分浏览器找不到 worker 脚本会报错 */
  if (typeof pdfjsLib !== "undefined" && pdfjsLib.GlobalWorkerOptions){
    try {
      if (location.protocol === "file:"){
        /* file:// 协议下 pdf.js Worker 被安全策略阻止，禁用 worker 使用主线程 fake worker */
        pdfjsLib.GlobalWorkerOptions.workerSrc = "";
        console.log("[bk] file:// 协议：已禁用 pdf.js worker");
      } else if (!pdfjsLib.GlobalWorkerOptions.workerSrc){
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      }
    } catch(e) {}
  }
  bkDBGet(bid + ":content").then(function(rec){
    var blob = bkAsBlob(rec, "application/pdf");
    console.log("[bk] bkLoadPDF blob=", blob ? blob.size + " bytes" : "null", "存储类型=", (rec && rec.constructor && rec.constructor.name) || typeof rec);
    if (!blob){ bkToast("课本文件丢失，请重新添加"); bkClose(); return; }
    return blob.arrayBuffer();
  }).then(function(buf){
    if (!buf){ console.warn("[bk] bkLoadPDF: buf 为空"); return; }
    console.log("[bk] bkLoadPDF buf.size=", buf.byteLength, "pdfjsLib=", typeof pdfjsLib);
    if (typeof pdfjsLib === "undefined"){
      bkToast("PDF 组件未加载，请刷新页面重试");
      bkClose();
      return;
    }
    return pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise;
  }).then(function(pdf){
    if (!pdf){ console.warn("[bk] bkLoadPDF: pdf 为空"); return; }
    console.log("[bk] bkLoadPDF pdf.numPages=", pdf.numPages);
    BK_SESSION.pdf = pdf;
    BK_SESSION.pageCount = pdf.numPages;
    var meta = bkFind(bid);
    if (meta && meta.pages !== pdf.numPages){
      meta.pages = pdf.numPages;
      bkSaveMeta(bkMeta().map(function(m){ return m.id === bid ? meta : m; }));
    }
    bkRenderPDFPages(pdf);
  }).catch(function(err){
    console.error("[bk] bkLoadPDF 失败:", err, err && err.name);
    if (location.protocol === "file:"){
      bkToast("本地 file:// 打开不支持 PDF 渲染，请用 https://wwwgood.github.io/studyc/ 访问");
    } else {
      bkToast("打开 PDF 失败：" + bkErrText(err));
    }
    bkClose();
  });
}

function bkRenderPDFPages(pdf){
  var wrap = document.getElementById("bkPages");
  if (!wrap){ console.warn("[bk] bkRenderPDFPages: #bkPages 不存在"); return; }
  console.log("[bk] bkRenderPDFPages: 渲染", pdf.numPages, "页");
  var html = "";
  for (var i = 0; i < pdf.numPages; i++){
    html += '<div class="bk-page" data-pg="' + i + '">' +
      '<div class="bk-page-num">第 ' + (i + 1) + ' 页</div>' +
      '<canvas class="bk-pdf-canvas" data-pg="' + i + '"></canvas>' +
      '<canvas class="bk-ink-canvas" data-pg="' + i + '"></canvas>' +
    '</div>';
  }
  wrap.innerHTML = html;
  var tasks = [];
  for (var i = 0; i < pdf.numPages; i++) tasks.push(bkDrawPage(pdf, i));
  Promise.all(tasks).then(function(){
    console.log("[bk] bkRenderPDFPages: 所有页渲染完成");
    bkBindInk();
    bkApplyScale();
  }).catch(function(err){ console.error("[bk] bkRenderPDFPages 渲染失败:", err); });
}

function bkDrawPage(pdf, idx){
  return pdf.getPage(idx + 1).then(function(page){
    var canvas = document.querySelector('.bk-pdf-canvas[data-pg="' + idx + '"]');
    if (!canvas) return;
    var base = 1.6;
    var viewport = page.getViewport({ scale: base });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    return page.render({ canvasContext: canvas.getContext("2d"), viewport: viewport }).promise
      .then(function(){
        var ink = document.querySelector('.bk-ink-canvas[data-pg="' + idx + '"]');
        if (ink){
          ink.width = viewport.width;
          ink.height = viewport.height;
        }
        var shell = canvas.parentNode;
        if (shell){
          shell.style.minHeight = viewport.height + "px";
        }
        canvas.setAttribute("data-w", viewport.width);
        canvas.setAttribute("data-h", viewport.height);
      });
  });
}

/* 读取图片集并渲染 */
function bkLoadImages(bid, b){
  var count = b.fileCount || b.pages || 1;
  console.log("[bk] bkLoadImages 开始：bid=", bid, "count=", count);
  BK_SESSION.pageCount = count;
  var wrap = document.getElementById("bkPages");
  if (!wrap) return;
  var html = "";
  for (var i = 0; i < count; i++){
    html += '<div class="bk-page" data-pg="' + i + '">' +
      '<div class="bk-page-num">第 ' + (i + 1) + ' 页</div>' +
      '<img class="bk-img-canvas" data-pg="' + i + '" style="display:none">' +
      '<canvas class="bk-ink-canvas" data-pg="' + i + '"></canvas>' +
    '</div>';
  }
  wrap.innerHTML = html;

  var chain = Promise.resolve();
  for (var i = 0; i < count; i++){
    (function(idx){
      chain = chain.then(function(){
        return bkDBGet(bid + ":content:" + idx).then(function(rec){
          var blob = bkAsBlob(rec, "image/jpeg");
          if (!blob) return;
          var url = URL.createObjectURL(blob);
          var img = document.querySelector('.bk-img-canvas[data-pg="' + idx + '"]');
          if (!img) return;
          return new Promise(function(resolve){
            img.onload = function(){
              img.style.display = "block";
              var ink = document.querySelector('.bk-ink-canvas[data-pg="' + idx + '"]');
              if (ink){
                ink.width = img.naturalWidth;
                ink.height = img.naturalHeight;
              }
              var shell = img.parentNode;
              if (shell) shell.style.minHeight = img.naturalHeight + "px";
              img.setAttribute("data-w", img.naturalWidth);
              img.setAttribute("data-h", img.naturalHeight);
              resolve();
            };
            img.onerror = function(){ resolve(); };
            img.src = url;
          });
        });
      });
    })(i);
  }
  chain.then(function(){
    console.log("[bk] bkLoadImages: 所有图片加载完成");
    bkBindInk();
    bkApplyScale();
  });
}

/* 读取 Word 并渲染 */
function bkLoadDocx(bid, b){
  console.log("[bk] bkLoadDocx 开始：bid=", bid);
  bkDBGet(bid + ":content").then(function(rec){
    var blob = bkAsBlob(rec, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    console.log("[bk] bkLoadDocx blob=", blob ? blob.size + " bytes" : "null");
    if (!blob){ bkToast("课本文件丢失，请重新添加"); bkClose(); return; }
    return blob.arrayBuffer();
  }).then(function(buf){
    if (!buf){ console.warn("[bk] bkLoadDocx: buf 为空"); return; }
    console.log("[bk] bkLoadDocx buf.size=", buf.byteLength, "mammoth=", typeof mammoth);
    if (typeof mammoth === "undefined"){
      bkToast("Word 组件未加载，请刷新页面重试");
      bkClose();
      return;
    }
    return mammoth.convertToHtml({ arrayBuffer: buf });
  }).then(function(result){
    if (!result){ console.warn("[bk] bkLoadDocx: result 为空"); return; }
    console.log("[bk] bkLoadDocx html.length=", (result.value || "").length);
    var wrap = document.getElementById("bkPages");
    if (!wrap) return;
    var html = '<div class="bk-docx-page"><div class="bk-docx-content">' + (result.value || "<p>（空文档）</p>") + '</div></div>';
    wrap.innerHTML = html;
    BK_SESSION.pageCount = 1;
    var pi = document.getElementById("bkPageInfo");
    if (pi) pi.textContent = "第 1 页";
  }).catch(function(err){
    bkToast("打开 Word 失败：" + (err && err.message || "未知错误"));
    bkClose();
  });
}

/* 应用缩放：同时作用于内容层和手写层 */
function bkApplyScale(){
  var pages = document.querySelectorAll(".bk-page");
  for (var i = 0; i < pages.length; i++){
    var pdfC = pages[i].querySelector(".bk-pdf-canvas");
    var imgC = pages[i].querySelector(".bk-img-canvas");
    var inkC = pages[i].querySelector(".bk-ink-canvas");
    var content = pdfC || imgC;
    if (!content || !inkC) continue;
    var w = parseFloat(content.getAttribute("data-w")) || 0;
    var h = parseFloat(content.getAttribute("data-h")) || 0;
    if (w === 0 || h === 0) continue;
    if (BK_SESSION.fit){
      var avail = document.getElementById("bkPages").clientWidth - 24;
      BK_SESSION.scale = avail / w;
      BK_SESSION.fit = false;
    }
    content.style.width = (w * BK_SESSION.scale) + "px";
    content.style.height = (h * BK_SESSION.scale) + "px";
    inkC.style.width = (w * BK_SESSION.scale) + "px";
    inkC.style.height = (h * BK_SESSION.scale) + "px";
  }
  var zi = document.getElementById("bkZoomInfo");
  if (zi) zi.textContent = Math.round(BK_SESSION.scale * 100) + "%";
}

/* 缩放时归一化指针坐标到 canvas 像素 */
function bkInkPos(canvas, e){
  var rect = canvas.getBoundingClientRect();
  var cx = e.clientX, cy = e.clientY;
  if (e.touches && e.touches[0]){ cx = e.touches[0].clientX; cy = e.touches[0].clientY; }
  return {
    x: (cx - rect.left) * (canvas.width / rect.width),
    y: (cy - rect.top) * (canvas.height / rect.height)
  };
}

/* ---------- 手写 ---------- */
/* 书写/操作模式切换：默认操作模式（可滑动翻页缩放），点「✍️ 书写」才能写字 */
function bkToggleWrite(){
  if (!BK_SESSION) return;
  BK_SESSION.writing = !BK_SESSION.writing;
  var btn = document.getElementById("bkBtnWrite");
  if (btn){
    btn.classList.toggle("active", BK_SESSION.writing);
    btn.textContent = BK_SESSION.writing ? "🖐️" : "✍️";
  }
  var t2 = document.getElementById("bkTools2");
  if (t2) t2.style.display = BK_SESSION.writing ? "" : "none";
  bkSetInkMode();
}
function bkSetInkMode(){
  var write = !!(BK_SESSION && BK_SESSION.writing);
  var inks = document.querySelectorAll(".bk-ink-canvas");
  for (var i = 0; i < inks.length; i++){
    inks[i].style.pointerEvents = write ? "auto" : "none";
    inks[i].style.touchAction = write ? "none" : "auto";
  }
}

function bkBindInk(){
  var inks = document.querySelectorAll(".bk-ink-canvas");
  for (var i = 0; i < inks.length; i++){
    var canvas = inks[i];
    BK_SESSION.pages[parseInt(canvas.getAttribute("data-pg"), 10)] = { strokes: [], drawing: null };
    canvas.addEventListener("pointerdown", bkInkDown);
    canvas.addEventListener("pointermove", bkInkMove);
    canvas.addEventListener("pointerup", bkInkUp);
    canvas.addEventListener("pointerleave", bkInkUp);
    bkLoadInk(canvas);
  }
  bkSetInkMode();
}

function bkLoadInk(canvas){
  var pg = parseInt(canvas.getAttribute("data-pg"), 10);
  if (!BK_SESSION) return;
  BK_SESSION.pages[pg].strokes = [];
  bkDBGet(BK_SESSION.bid + ":ink:" + pg).then(function(rec){
    if (!rec) return;
    if (typeof rec === "string") return rec;
    if (rec instanceof Blob) return rec.text();
    return null;
  }).then(function(text){
    if (!text || !BK_SESSION) return;
    var strokes;
    try { strokes = JSON.parse(text); } catch(e){ return; }
    if (!Array.isArray(strokes)) return;
    BK_SESSION.pages[pg].strokes = strokes;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.forEach(function(st){ bkStrokeLine(canvas, st, st.color, st.width); });
  }).catch(function(){});
}

function bkInkDown(e){
  var canvas = e.currentTarget;
  if (!BK_SESSION || !BK_SESSION.writing) return;
  var pg = parseInt(canvas.getAttribute("data-pg"), 10);
  canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
  var pos = bkInkPos(canvas, e);
  var st = {
    color: BK_SESSION.eraser ? "#ffffff" : BK_SESSION.color,
    width: BK_SESSION.eraser ? 26 : 4,
    points: [pos]
  };
  BK_SESSION.pages[pg].strokes.push(st);
  BK_SESSION.pages[pg].drawing = st;
  BK_SESSION.current = pg;
  var pi = document.getElementById("bkPageInfo");
  if (pi) pi.textContent = "第 " + (pg + 1) + " 页";
  var ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, st.width / 2, 0, Math.PI * 2);
  ctx.fillStyle = st.color;
  ctx.fill();
}
function bkInkMove(e){
  var canvas = e.currentTarget;
  if (!BK_SESSION) return;
  var pg = parseInt(canvas.getAttribute("data-pg"), 10);
  var drawing = BK_SESSION.pages[pg] && BK_SESSION.pages[pg].drawing;
  if (!drawing) return;
  e.preventDefault();
  var pos = bkInkPos(canvas, e);
  drawing.points.push(pos);
  bkStrokeLine(canvas, drawing, drawing.color, drawing.width);
}
function bkInkUp(e){
  var canvas = e.currentTarget;
  if (!BK_SESSION) return;
  var pg = parseInt(canvas.getAttribute("data-pg"), 10);
  var drawing = BK_SESSION.pages[pg] && BK_SESSION.pages[pg].drawing;
  if (!drawing) return;
  var strokes = BK_SESSION.pages[pg].strokes.filter(function(s){ return s.points.length > 0; });
  BK_SESSION.pages[pg].strokes = strokes;
  BK_SESSION.pages[pg].drawing = null;
  bkSaveInk(pg);
}

function bkStrokeLine(canvas, st, color, width){
  var pts = st.points;
  if (!pts || pts.length < 2) return;
  var ctx = canvas.getContext("2d");
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.stroke();
}

function bkSaveInk(pg){
  var strokes = BK_SESSION.pages[pg].strokes;
  /* 存字符串（不用 Blob）：安卓上 Blob 文件可能被系统清理导致读不出 */
  bkDBPut(BK_SESSION.bid + ":ink:" + pg, JSON.stringify(strokes)).catch(function(){});
}

function bkClearPage(){
  var canvas = document.querySelector('.bk-ink-canvas[data-pg="' + BK_SESSION.current + '"]');
  if (!canvas) return;
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  BK_SESSION.pages[BK_SESSION.current].strokes = [];
  bkSaveInk(BK_SESSION.current);
  bkToast("本页已清空");
}

function bkPickColor(btn){
  BK_SESSION.eraser = !!btn.eraser;
  BK_SESSION.color = btn.getAttribute ? (btn.getAttribute("data-c") || BK_SESSION.color) : BK_SESSION.color;
  var colors = document.querySelectorAll(".bk-color");
  for (var i = 0; i < colors.length; i++) colors[i].classList.remove("active");
  var er = document.getElementById("bkBtnEraser");
  if (er) er.classList.remove("active");
  if (btn.eraser){ if (er) er.classList.add("active"); }
  else if (btn.getAttribute){ btn.classList.add("active"); }
}

/* ---------- 工具栏 ---------- */
function bkTool(act){
  if (!BK_SESSION) return;
  if (act === "prev"){ bkScrollTo(BK_SESSION.current - 1); }
  else if (act === "next"){ bkScrollTo(BK_SESSION.current + 1); }
  else if (act === "zoomin"){ BK_SESSION.fit = false; BK_SESSION.scale = Math.min(BK_SESSION.scale * 1.15, 3); bkApplyScale(); }
  else if (act === "zoomout"){ BK_SESSION.fit = false; BK_SESSION.scale = Math.max(BK_SESSION.scale / 1.15, 0.5); bkApplyScale(); }
  else if (act === "fit"){ BK_SESSION.fit = true; BK_SESSION.scale = 1; bkApplyScale(); }
}

function bkScrollTo(pg){
  if (pg < 0 || pg >= BK_SESSION.pageCount) return;
  BK_SESSION.current = pg;
  var el = document.querySelector('.bk-page[data-pg="' + pg + '"]');
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  var pi = document.getElementById("bkPageInfo");
  if (pi) pi.textContent = "第 " + (pg + 1) + " 页";
}

/* ---------- 导出/导入课本包 ---------- */
function bkExportPack(){
  var list = bkMeta();
  if (list.length === 0){ bkToast("还没有课本，先添加再导出"); return; }
  if (!confirm("导出全部 " + list.length + " 本课本为一个课本包文件？\n（含 PDF / 图片 / Word / 手写笔迹，微信发送到平板后导入即可用）")) return;

  bkToast("正在打包，请稍候…");
  var pack = { ver: 1, exported: new Date().toISOString(), cats: bkCats(), books: [] };
  var chain = Promise.resolve();
  list.forEach(function(b){
    chain = chain.then(function(){
      return (function(){
        var entry = {
          id: b.id, name: b.name, catId: b.catId || "", fileType: b.fileType,
          pages: b.pages || 0, fileSize: b.fileSize || 0, fileCount: b.fileCount || 1,
          created: b.created || Date.now()
        };
        var tasks = [];
        if (b.fileType === "pdf" || b.fileType === "docx"){
          tasks.push(bkRecToB64(bkDBGet(b.id + ":content"), "content"));
        } else if (b.fileType === "img"){
          var fc = b.fileCount || b.pages || 1;
          for (var i = 0; i < fc; i++){
            (function(imgIdx){
              tasks.push(bkRecToB64(bkDBGet(b.id + ":content:" + imgIdx), "content" + imgIdx));
            })(i);
          }
        }
        var pgCount = b.pages || 0;
        for (var pg = 0; pg < pgCount; pg++){
          (function(pgIndex){
            tasks.push(bkRecToB64(bkDBGet(b.id + ":ink:" + pgIndex), "ink" + pgIndex));
          })(pg);
        }
        return Promise.all(tasks).then(function(results){
          results.forEach(function(r){
            entry[r.tag] = r.data;
          });
          pack.books.push(entry);
        });
      })();
    });
  });

  chain.then(function(){
    var json = JSON.stringify(pack);
    var blob = new Blob([json], {type: "application/json"});
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "电子课本包-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 2000);
    bkToast("✅ 课本包已导出（" + bkFmtSize(json.length) + "），微信发送到平板后导入即可");
  }).catch(function(err){
    bkToast("打包失败：" + (err && err.message || ""));
  });
}

function bkRecToB64(promise, tag){
  return promise.then(function(rec){
    if (!rec) return { tag: tag, data: "" };
    var blob = (typeof rec === "string") ? new Blob([rec], {type: "application/json"}) : bkAsBlob(rec, "");
    if (!blob) return { tag: tag, data: "" };
    return new Promise(function(resolve){
      var r = new FileReader();
      r.onload = function(){
        var base64 = String(r.result).split(",")[1] || "";
        resolve({ tag: tag, data: base64 });
      };
      r.onerror = function(){ resolve({ tag: tag, data: "" }); };
      r.readAsDataURL(blob);
    });
  });
}

function bkImport(input){
  var file = input && input.files && input.files[0];
  if (!file) return;
  var r = new FileReader();
  r.onload = function(){
    var pack;
    try { pack = JSON.parse(r.result); } catch(e){ bkToast("课本包解析失败：不是有效的 JSON"); input.value = ""; return; }
    bkRestorePack(pack).then(function(ok){
      bkToast(ok ? "✅ 导入完成！" : "导入完成（部分内容缺失）");
      bkRender();
    });
  };
  r.onerror = function(){ bkToast("读取文件失败"); };
  r.readAsText(file);
  input.value = "";
}

function bkRestorePack(pack){
  if (!pack || !Array.isArray(pack.books)) return Promise.resolve(false);
  if (Array.isArray(pack.cats)){
    var cats = bkCats();
    pack.cats.forEach(function(c){
      if (!cats.filter(function(x){ return x.id === c.id; })[0]) cats.push({ id: c.id, name: c.name });
    });
    bkSaveCats(cats);
  }
  var meta = bkMeta();
  var chain = Promise.resolve();
  pack.books.forEach(function(b, _idx){
    var bid = b.id || bkUid();
    chain = chain.then(function(){
      return (function(){
        var writes = [];
        if (b.fileType === "pdf" || b.fileType === "docx"){
          if (b.content) writes.push(bkB64ToBuf(b.content).then(function(buf){ return bkDBPut(bid + ":content", buf); }));
        } else if (b.fileType === "img"){
          var fc = b.fileCount || b.pages || 1;
          for (var i = 0; i < fc; i++){
            var key = "content" + i;
            if (b[key]) (function(imgIdx, imgData){
              writes.push(bkB64ToBuf(imgData).then(function(buf){ return bkDBPut(bid + ":content:" + imgIdx, buf); }));
            })(i, b[key]);
          }
        }
        for (var pg = 0; pg < (b.pages || 0); pg++){
          var ikey = "ink" + pg;
          if (b[ikey]) (function(pgI, inkStr){
            writes.push(bkDBPut(bid + ":ink:" + pgI, bkB64ToStr(inkStr)));
          })(pg, b[ikey]);
        }
        return Promise.all(writes).then(function(){
          var exists = meta.filter(function(m){ return m.id === bid; })[0];
          if (!exists) meta.push({
            id: bid, name: b.name || "导入课本", catId: b.catId || "",
            fileType: b.fileType || "pdf", pages: b.pages || 0, fileSize: b.fileSize || 0,
            fileCount: b.fileCount || 1, created: b.created || Date.now()
          });
        });
      })();
    });
  });
  return chain.then(function(){
    bkSaveMeta(meta);
    return true;
  }).catch(function(){ return false; });
}

function bkB64ToBuf(b64){
  return new Promise(function(resolve, reject){
    try {
      var bin = atob(b64);
      var arr = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      resolve(arr.buffer);
    } catch(e){ reject(e); }
  });
}
function bkB64ToStr(b64){
  try { return atob(b64); } catch(e){ return ""; }
}

/* ---------- 关闭 ---------- */
var BK_PUSHED = false;
function bkCloseCore(){
  var mask = document.getElementById("bkMask");
  if (mask) mask.classList.remove("open");
  BK_SESSION = null;
}
function bkClose(){
  if (BK_PUSHED){ BK_PUSHED = false; try { history.back(); } catch(e){} }
  bkCloseCore();
}
/* 安卓返回键：阅读器开着时只关阅读器，不退出网站 */
window.addEventListener("popstate", function(){
  if (BK_SESSION){ BK_PUSHED = false; bkCloseCore(); }
});

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

/* ---------- 视图进入回调 ---------- */
function bkOnEnter(){
  console.log("[bk] bkOnEnter 被调用");
  bkRender();
}

window.addEventListener("load", function(){
  if (document.getElementById("bkList")) bkRender();
});