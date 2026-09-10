/* ---------------- 专项试卷 papers.js ----------------
 * 上传 PDF 原卷直接当卷子做（不解析文字内容）：
 *  - PDF 用 pdf.js 渲染成图片原样展示（扫描件也支持）
 *  - 每页叠加透明画板：铅笔/橡皮手写答题（触屏+鼠标）
 *  - 听力 mp3 关联到卷子，本地播放
 *  - 试卷文件（PDF/mp3/笔迹）存 IndexedDB（大容量，不占 GitHub 空间）
 *  - 元数据（试卷列表）存 localStorage
 *  - 试卷包导出/导入：一个 JSON 文件，微信互传 PC↔平板
 */
var PP_DB_NAME = "sc_paper_files";
var PP_DB_STORE = "files";
var PP_META_KEY = "sc_papers";

/* ---------- IndexedDB 封装 ---------- */
var PP_DB = null;
function ppOpenDB(){
  return new Promise(function(resolve, reject){
    if (PP_DB) return resolve(PP_DB);
    var req = indexedDB.open(PP_DB_NAME, 1);
    req.onupgradeneeded = function(e){
      var db = e.target.result;
      if (!db.objectStoreNames.contains(PP_DB_STORE)) db.createObjectStore(PP_DB_STORE);
    };
    req.onsuccess = function(e){ PP_DB = e.target.result; resolve(PP_DB); };
    req.onerror = function(){ reject(req.error || new Error("无法打开本地试卷库")); };
  });
}
function ppDBPut(key, blob){
  return ppOpenDB().then(function(db){
    return new Promise(function(resolve, reject){
      var tx = db.transaction(PP_DB_STORE, "readwrite");
      tx.objectStore(PP_DB_STORE).put(blob, key);
      tx.oncomplete = function(){ resolve(); };
      tx.onerror = function(){ reject(tx.error); };
    });
  });
}
function ppDBGet(key){
  return ppOpenDB().then(function(db){
    return new Promise(function(resolve, reject){
      var tx = db.transaction(PP_DB_STORE, "readonly");
      var rq = tx.objectStore(PP_DB_STORE).get(key);
      rq.onsuccess = function(){ resolve(rq.result || null); };
      rq.onerror = function(){ reject(rq.error); };
    });
  });
}
function ppDBDelRange(prefix){
  return ppOpenDB().then(function(db){
    return new Promise(function(resolve, reject){
      var tx = db.transaction(PP_DB_STORE, "readwrite");
      var store = tx.objectStore(PP_DB_STORE);
      var range = IDBKeyRange.bound(prefix, prefix + "\uffff");
      store.delete(range);
      tx.oncomplete = function(){ resolve(); };
      tx.onerror = function(){ reject(tx.error); };
    });
  });
}

/* ---------- 元数据 ---------- */
var PP_META_KEY = "sc_papers";
var PP_CATS_KEY = "sc_paper_cats";

function ppMeta(){
  try { var v = JSON.parse(localStorage.getItem(PP_META_KEY) || "[]"); return Array.isArray(v) ? v : []; }
  catch(e){ return []; }
}
function ppSaveMeta(list){ localStorage.setItem(PP_META_KEY, JSON.stringify(list)); }
function ppFind(pid){ return ppMeta().filter(function(p){ return p.id === pid; })[0] || null; }

/* 专题（试卷分类） */
function ppCats(){
  try { var v = JSON.parse(localStorage.getItem(PP_CATS_KEY) || "[]"); return Array.isArray(v) ? v : []; }
  catch(e){ return []; }
}
function ppSaveCats(list){ localStorage.setItem(PP_CATS_KEY, JSON.stringify(list)); }
function ppCatName(cid){
  var c = ppCats().filter(function(x){ return x.id === cid; })[0];
  return c ? c.name : "";
}

function ppUid(){
  return "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ---------- 渲染真题演练页里的专项试卷区（按专题分组） ---------- */
function ppRender(){
  var wrap = document.getElementById("ppList");
  if (!wrap) return;
  var list = ppMeta();
  if (list.length === 0){
    wrap.innerHTML = '<div class="xq-empty">📄 还没有专项试卷。<br>点右上「＋ 添加试卷」，上传 PDF 原卷就能直接做（扫描件也可以），听力 mp3 可一并添加。</div>' +
      (ppCats().length > 0 ? '<div class="pp-empty-cats">🗂 已建专题：' + ppCats().map(function(c){ return ppEsc(c.name); }).join("、") + '</div>' : '');
    return;
  }

  var cats = ppCats();
  var html = "";
  if (cats.length > 0){
    /* 每个专题一个分组 */
    cats.forEach(function(c){
      var ps = list.filter(function(p){ return p.catId === c.id; });
      if (ps.length === 0) return;
      html += ppRenderCatBlock(c, ps);
    });
    /* 未归类的试卷 */
    var uncat = list.filter(function(p){ return !p.catId || !cats.some(function(c){ return c.id === p.catId; }); });
    if (uncat.length > 0){
      html += ppRenderCatBlock({ id: "", name: "📁 未归类", emoji: "📁" }, uncat);
    }
  } else {
    list.slice().reverse().forEach(function(p){ html += ppRenderCard(p); });
  }
  wrap.innerHTML = html;
}

function ppRenderCatBlock(c, ps){
  var audioN = 0, pdfSize = 0;
  ps.forEach(function(p){ audioN += (p.audios || []).length; pdfSize += p.pdfSize || 0; });
  var html = '<div class="pp-cat-block">' +
    '<div class="pp-cat-head">' +
      '<span class="pp-cat-emoji">' + (c.emoji || "🗂") + '</span>' +
      '<span class="pp-cat-name">' + ppEsc(c.name) + '</span>' +
      '<span class="pp-cat-meta">' + ps.length + ' 套 · ' + ppFmtSize(pdfSize) + '</span>' +
    '</div>' +
    '<div class="pp-cat-list">';
  ps.slice().reverse().forEach(function(p){ html += ppRenderCard(p); });
  html += '</div></div>';
  return html;
}

function ppRenderCard(p){
  var audioN = (p.audios || []).length;
  var pdfSize = ppFmtSize(p.pdfSize || 0);
  var catOpts = ppCatOptionsHTML(p.catId || "", false);
  return '<div class="pp-card">' +
    '<button class="pp-card-main" type="button" onclick="ppOpen(\'' + p.id + '\')">' +
      '<span class="pp-card-emoji">📄</span>' +
      '<span class="pp-card-info">' +
        '<span class="pp-card-name">' + ppEsc(p.name) + '</span>' +
        '<span class="pp-card-meta">' + (p.pages || 0) + ' 页 · ' + pdfSize +
          (audioN > 0 ? ' · 🎧 ' + audioN + ' 段听力' : '') +
        '</span>' +
      '</span>' +
      '<span class="pp-card-go">开始做 →</span>' +
    '</button>' +
    '<select class="pp-cat-select" title="移入专题" onchange="ppModifyCat(\'' + p.id + '\', this.value)">' + catOpts + '</select>' +
    '<button class="pp-card-del" type="button" title="删除试卷" onclick="ppDelete(\'' + p.id + '\')">🗑</button>' +
  '</div>';
}


function ppFmtSize(n){
  if (n >= 1024 * 1024) return (n / 1024 / 1024).toFixed(1) + " MB";
  if (n >= 1024) return Math.round(n / 1024) + " KB";
  return n + " B";
}
function ppEsc(s){
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ---------- 添加试卷 ---------- */
function ppCatOptionsHTML(selectedId, withNew){
  var cats = ppCats();
  var opts = '<option value=""' + (selectedId === "" ? " selected" : "") + '>（不分类）</option>';
  cats.forEach(function(c){
    opts += '<option value="' + c.id + '"' + (selectedId === c.id ? " selected" : "") + '>' + ppEsc(c.name) + '</option>';
  });
  if (withNew){
    opts += '<option value="__new__"' + (selectedId === "__new__" ? " selected" : "") + '>（＋ 新建专题…）</option>';
  }
  return opts;
}

function ppOnCatSelect(){
  var sel = document.getElementById("ppCat");
  var inp = document.getElementById("ppNewCatName");
  if (!sel || !inp) return;
  inp.style.display = sel.value === "__new__" ? "" : "none";
}

function ppOpenAdd(){
  var dlg = document.getElementById("ppDialog");
  var mask = document.getElementById("ppMask");
  if (!dlg || !mask) return;
  dlg.className = "pp-dialog";
  dlg.innerHTML =
    '<div class="pp-dlg-head">' +
      '<span class="pp-cap">📄 添加专项试卷</span>' +
      '<button class="pp-close" type="button" onclick="ppClose()">×</button>' +
    '</div>' +
    '<div class="pp-dlg-body">' +
      '<div class="pp-add-tip">上传 PDF 原卷直接开做（扫描件、图片版都能看），听力 mp3 可同时选多个或后补。选好专题，试卷就不会混在一起。</div>' +
      '<div class="pp-add-row"><label>🗂 专题</label>' +
        '<select id="ppCat" onchange="ppOnCatSelect()">' + ppCatOptionsHTML("", true) + '</select>' +
        '<input type="text" id="ppNewCatName" placeholder="新专题名称，如：四年级上册专项试卷" maxlength="20" style="display:none">' +
      '</div>' +
      '<div class="pp-add-row"><label>试卷名称</label>' +
        '<input type="text" id="ppName" placeholder="如：期中检测卷1（含答案）" maxlength="40"></div>' +
      '<div class="pp-add-row"><label>📄 试卷 PDF</label>' +
        '<input type="file" id="ppPdfInput" accept=".pdf,application/pdf"></div>' +
      '<div class="pp-add-row"><label>🎧 听力音频（可多选/可不选）</label>' +
        '<input type="file" id="ppAudioInput" accept=".mp3,.m4a,.wav,audio/*" multiple></div>' +
      '<div class="pp-add-actions">' +
        '<button class="pp-btn primary" type="button" onclick="ppSaveAdd()">💾 保存试卷</button>' +
        '<button class="pp-btn" type="button" onclick="ppClose()">取消</button>' +
      '</div>' +
    '</div>';
  mask.classList.add("open");
}

function ppSaveAdd(){
  var name = (document.getElementById("ppName").value || "").trim();
  var pdfInput = document.getElementById("ppPdfInput");
  var audioInput = document.getElementById("ppAudioInput");
  if (!name) name = (pdfInput.files[0] && pdfInput.files[0].name || "未命名试卷").replace(/\.pdf$/i, "");
  if (!pdfInput.files || pdfInput.files.length === 0){
    ppToast("请先选择 PDF 试卷文件");
    return;
  }
  var pdfFile = pdfInput.files[0];
  if (!/\.pdf$/i.test(pdfFile.name)){
    ppToast("只能上传 .pdf 试卷文件");
    return;
  }

  /* 解析专题 */
  var catId = "";
  var catSel = document.getElementById("ppCat");
  if (catSel){
    if (catSel.value === "__new__"){
      var newName = (document.getElementById("ppNewCatName").value || "").trim();
      if (!newName){ ppToast("请填写新专题名称，或选择已有专题"); return; }
      var cats = ppCats();
      var exist = cats.filter(function(c){ return c.name === newName; })[0];
      if (exist){ catId = exist.id; }
      else { catId = ppUid(); cats.push({ id: catId, name: newName }); ppSaveCats(cats); }
    } else {
      catId = catSel.value || "";
    }
  }

  var audios = audioInput.files ? Array.prototype.slice.call(audioInput.files) : [];
  var pid = ppUid();
  var audioList = audios.map(function(f){ return { name: f.name }; });

  var reader = new FileReader();
  reader.onload = function(){
    var buf = reader.result;
    ppDBPut(pid + ":pdf", new Blob([buf], {type: "application/pdf"}))
      .then(function(){
        var chain = Promise.resolve();
        audios.forEach(function(f, i){
          chain = chain.then(function(){
            return new Promise(function(resolve){
              var r2 = new FileReader();
              r2.onload = function(){ ppDBPut(pid + ":audio:" + i, new Blob([r2.result], {type: "audio/mpeg"})).then(resolve); };
              r2.onerror = function(){ resolve(); };
              r2.readAsArrayBuffer(f);
            });
          });
        });
        return chain;
      })
      .then(function(){
        var meta = ppMeta();
        meta.push({ id: pid, name: name, catId: catId, pages: 0, pdfSize: pdfFile.size, audios: audioList, created: Date.now() });
        ppSaveMeta(meta);
        ppToast("试卷已保存：" + name + (catId ? "（归入「" + ppCatName(catId) + "」）" : "") + (audioList.length ? "，含 " + audioList.length + " 段听力" : ""));
        ppClose();
        if (typeof xqRender === "function") xqRender();
        ppRender();
      })
      .catch(function(err){
        ppToast("保存失败：" + (err && err.message || "未知错误"));
      });
  };
  reader.onerror = function(){ ppToast("读取 PDF 失败"); };
  reader.readAsArrayBuffer(pdfFile);
}

/* ---------- 专题管理 ---------- */
function ppManageCats(){
  var dlg = document.getElementById("ppDialog");
  var mask = document.getElementById("ppMask");
  if (!dlg || !mask) return;
  var cats = ppCats();
  var list = ppMeta();
  var rows = "";
  if (cats.length === 0){
    rows = '<div class="pp-cat-none">还没有专题。在下方输入名称点「＋ 新建」，比如「四年级上册专项试卷」。</div>';
  }
  cats.forEach(function(c){
    var n = list.filter(function(p){ return p.catId === c.id; }).length;
    rows += '<div class="pp-cat-row">' +
      '<span class="pp-cat-row-name">🗂 ' + ppEsc(c.name) + '</span>' +
      '<span class="pp-cat-row-meta">' + n + ' 套试卷</span>' +
      '<button class="pp-btn sm" type="button" onclick="ppRenameCat(\'' + c.id + '\')" title="重命名">✏️</button>' +
      '<button class="pp-btn sm" type="button" onclick="ppDeleteCat(\'' + c.id + '\')" title="删除专题">🗑</button>' +
    '</div>';
  });
  dlg.className = "pp-dialog small";
  dlg.innerHTML =
    '<div class="pp-dlg-head">' +
      '<span class="pp-cap">🗂 管理专题</span>' +
      '<button class="pp-close" type="button" onclick="ppClose()">×</button>' +
    '</div>' +
    '<div class="pp-dlg-body">' +
      '<div class="pp-add-tip">专题用来给试卷分组。删除专题不会删除试卷（试卷会移到「未归类」）。</div>' +
      rows +
      '<div class="pp-cat-newrow">' +
        '<input type="text" id="ppNewCatName2" placeholder="新专题名称，如：四年级上册专项试卷" maxlength="20">' +
        '<button class="pp-btn primary" type="button" onclick="ppAddCat()">＋ 新建</button>' +
      '</div>' +
    '</div>';
  mask.classList.add("open");
}

function ppAddCat(){
  var name = (document.getElementById("ppNewCatName2").value || "").trim();
  if (!name){ ppToast("请输入专题名称"); return; }
  var cats = ppCats();
  if (cats.filter(function(c){ return c.name === name; })[0]){ ppToast("同名专题已存在"); return; }
  cats.push({ id: ppUid(), name: name });
  ppSaveCats(cats);
  ppToast("已新建专题：" + name);
  ppManageCats();
  ppRender();
}

function ppRenameCat(cid){
  var c = ppCats().filter(function(x){ return x.id === cid; })[0];
  if (!c) return;
  var name = prompt("重命名专题：", c.name);
  if (!name || !name.trim() || name.trim() === c.name) return;
  name = name.trim();
  var cats = ppCats();
  cats.forEach(function(x){ if (x.id === cid) x.name = name; });
  ppSaveCats(cats);
  ppToast("已重命名为：" + name);
  ppManageCats();
  ppRender();
}

function ppDeleteCat(cid){
  var c = ppCats().filter(function(x){ return x.id === cid; })[0];
  if (!c) return;
  var n = ppMeta().filter(function(p){ return p.catId === cid; }).length;
  if (!confirm("删除专题「" + c.name + "」？\n" + (n > 0 ? "该专题下 " + n + " 套试卷会移到「未归类」，试卷本身不会被删除。" : "该专题下没有试卷。"))) return;
  ppSaveCats(ppCats().filter(function(x){ return x.id !== cid; }));
  var list = ppMeta();
  list.forEach(function(p){ if (p.catId === cid) p.catId = ""; });
  ppSaveMeta(list);
  ppToast("已删除专题");
  ppManageCats();
  ppRender();
}

/* 把试卷移入指定专题（卡片上的下拉用） */
function ppModifyCat(pid, catId){
  var list = ppMeta();
  list.forEach(function(p){ if (p.id === pid) p.catId = catId || ""; });
  ppSaveMeta(list);
  ppRender();
  ppToast(catId ? "已移入「" + ppCatName(catId) + "」" : "已移到未归类");
}

function ppDelete(pid){
  var p = ppFind(pid);
  if (!p) return;
  if (!confirm("确定删除试卷「" + p.name + "」吗？\n试卷文件和手写笔迹会一起删除，删除后无法恢复。")) return;
  ppDBDelRange(pid + ":").then(function(){
    var list = ppMeta().filter(function(x){ return x.id !== pid; });
    ppSaveMeta(list);
    ppRender();
    if (typeof xqRender === "function") xqRender();
    ppToast("已删除试卷");
  }).catch(function(){ ppToast("删除失败"); });
}

/* ---------- 阅读器（全屏） ---------- */
var PP_SESSION = null;   // { pid, name, pdf, pageCount, scale, colors, color, eraser, pages: [] }

function ppOpen(pid){
  var p = ppFind(pid);
  if (!p) return;
  var mask = document.getElementById("ppMask");
  var dlg = document.getElementById("ppDialog");
  if (!mask || !dlg) return;
  dlg.className = "pp-dialog";

  dlg.innerHTML =
    '<div class="pp-dlg-head pp-reader-head">' +
      '<span class="pp-cap" id="ppReaderTitle">📄 ' + ppEsc(p.name) + '</span>' +
      '<button class="pp-close" type="button" onclick="ppClose()">×</button>' +
    '</div>' +
    '<div class="pp-reader-toolbar" id="ppToolbar">' +
      '<button type="button" class="pp-tb" onclick="ppTool(\'audio\')" id="ppBtnAudio">🎧 听力</button>' +
      '<button type="button" class="pp-tb" onclick="ppTool(\'prev\')">⬅ 上一页</button>' +
      '<button type="button" class="pp-tb" onclick="ppTool(\'next\')">下一页 ➡</button>' +
      '<span class="pp-tb-page" id="ppPageInfo">第 1 页</span>' +
      '<button type="button" class="pp-tb" onclick="ppTool(\'zoomout\')">−</button>' +
      '<span class="pp-tb-zoom" id="ppZoomInfo">100%</span>' +
      '<button type="button" class="pp-tb" onclick="ppTool(\'zoomin\')">＋</button>' +
      '<button type="button" class="pp-tb" onclick="ppTool(\'fit\')">🖼 适配</button>' +
    '</div>' +
    '<div class="pp-reader-tools2" id="ppTools2">' +
      '<span class="pp-t2-label">✏️ 书写</span>' +
      '<button type="button" class="pp-color" data-c="#e91e63" style="background:#e91e63" onclick="ppPickColor(this)"></button>' +
      '<button type="button" class="pp-color" data-c="#2196f3" style="background:#2196f3" onclick="ppPickColor(this)"></button>' +
      '<button type="button" class="pp-color" data-c="#4caf50" style="background:#4caf50" onclick="ppPickColor(this)"></button>' +
      '<button type="button" class="pp-color" data-c="#000000" style="background:#000" onclick="ppPickColor(this)"></button>' +
      '<button type="button" class="pp-tb" id="ppBtnEraser" onclick="ppPickColor({eraser:true});">🧽 橡皮</button>' +
      '<button type="button" class="pp-tb" onclick="ppClearPage()">🗑 清空本页</button>' +
      '<span class="pp-t2-hint">手直接在页面上写，写完自动保存</span>' +
    '</div>' +
    '<div class="pp-audio-panel" id="ppAudioPanel" style="display:none"></div>' +
    '<div class="pp-pages" id="ppPages"><div class="pp-loading">⏳ 正在打开试卷…</div></div>';
  mask.classList.add("open");

  PP_SESSION = {
    pid: pid, name: p.name, scale: 1, fit: true, pageCount: 0,
    color: "#e91e63", eraser: false, pages: [], audioURLs: [],
    current: 0, _audio: null, _audioIdx: -1
  };
  ppLoadPDF(pid, p);
  ppRenderAudioBar(p);
}

/* 读取 PDF 并渲染 */
function ppLoadPDF(pid, p){
  ppDBGet(pid + ":pdf").then(function(blob){
    if (!blob){ ppToast("试卷文件丢失，请重新添加"); ppClose(); return; }
    return blob.arrayBuffer();
  }).then(function(buf){
    if (typeof pdfjsLib === "undefined"){
      ppToast("PDF 组件未加载，请刷新页面重试");
      ppClose();
      return;
    }
    return pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise;
  }).then(function(pdf){
    PP_SESSION.pdf = pdf;
    PP_SESSION.pageCount = pdf.numPages;
    var meta = ppFind(pid);
    if (meta && meta.pages !== pdf.numPages){
      meta.pages = pdf.numPages;
      ppSaveMeta(ppMeta().map(function(m){ return m.id === pid ? meta : m; }));
    }
    ppRenderPages(pdf);
  }).catch(function(err){
    ppToast("打开 PDF 失败：" + (err && err.message || "未知错误"));
    ppClose();
  });
}

function ppRenderPages(pdf){
  var wrap = document.getElementById("ppPages");
  if (!wrap) return;
  var html = "";
  for (var i = 0; i < pdf.numPages; i++){
    html += '<div class="pp-page" data-pg="' + i + '">' +
      '<div class="pp-page-num">第 ' + (i + 1) + ' 页</div>' +
      '<canvas class="pp-pdf-canvas" data-pg="' + i + '"></canvas>' +
      '<canvas class="pp-ink-canvas" data-pg="' + i + '"></canvas>' +
    '</div>';
  }
  wrap.innerHTML = html;
  var tasks = [];
  for (var i = 0; i < pdf.numPages; i++) tasks.push(ppDrawPage(pdf, i));
  Promise.all(tasks).then(function(){
    ppBindInk();
    ppApplyScale();
  });
}

function ppDrawPage(pdf, idx){
  return pdf.getPage(idx + 1).then(function(page){
    var canvas = document.querySelector('.pp-pdf-canvas[data-pg="' + idx + '"]');
    if (!canvas) return;
    var base = 1.6;   // 固定渲染分辨率
    var viewport = page.getViewport({ scale: base });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    return page.render({ canvasContext: canvas.getContext("2d"), viewport: viewport }).promise
      .then(function(){
        var ink = document.querySelector('.pp-ink-canvas[data-pg="' + idx + '"]');
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

/* 应用缩放：同时作用于 PDF 层和手写层（CSS 尺寸，不重渲染） */
function ppApplyScale(){
  var pages = document.querySelectorAll(".pp-page");
  for (var i = 0; i < pages.length; i++){
    var pdfC = pages[i].querySelector(".pp-pdf-canvas");
    var inkC = pages[i].querySelector(".pp-ink-canvas");
    if (!pdfC || !inkC) continue;
    var w = parseFloat(pdfC.getAttribute("data-w")) || 0;
    var h = parseFloat(pdfC.getAttribute("data-h")) || 0;
    if (PP_SESSION.fit){
      var avail = document.getElementById("ppPages").clientWidth - 24;
      PP_SESSION.scale = avail / w;
      PP_SESSION.fit = false;
    }
    pdfC.style.width = (w * PP_SESSION.scale) + "px";
    pdfC.style.height = (h * PP_SESSION.scale) + "px";
    inkC.style.width = (w * PP_SESSION.scale) + "px";
    inkC.style.height = (h * PP_SESSION.scale) + "px";
  }
  var zi = document.getElementById("ppZoomInfo");
  if (zi) zi.textContent = Math.round(PP_SESSION.scale * 100) + "%";
}

/* 缩放时归一化指针坐标到 canvas 像素 */
function ppInkPos(canvas, e){
  var rect = canvas.getBoundingClientRect();
  var cx = e.clientX, cy = e.clientY;
  if (e.touches && e.touches[0]){ cx = e.touches[0].clientX; cy = e.touches[0].clientY; }
  return {
    x: (cx - rect.left) * (canvas.width / rect.width),
    y: (cy - rect.top) * (canvas.height / rect.height)
  };
}

/* ---------- 手写 ---------- */
function ppBindInk(){
  var inks = document.querySelectorAll(".pp-ink-canvas");
  for (var i = 0; i < inks.length; i++){
    var canvas = inks[i];
    canvas.style.touchAction = "none";
    PP_SESSION.pages[parseInt(canvas.getAttribute("data-pg"), 10)] = { strokes: [], drawing: null };
    canvas.addEventListener("pointerdown", ppInkDown);
    canvas.addEventListener("pointermove", ppInkMove);
    canvas.addEventListener("pointerup", ppInkUp);
    canvas.addEventListener("pointerleave", ppInkUp);
    ppLoadInk(canvas);
  }
}

function ppLoadInk(canvas){
  var pg = parseInt(canvas.getAttribute("data-pg"), 10);
  if (!PP_SESSION) return;
  PP_SESSION.pages[pg].strokes = [];
  ppDBGet(PP_SESSION.pid + ":ink:" + pg).then(function(blob){
    if (!blob) return;
    return blob.text();
  }).then(function(text){
    if (!text || !PP_SESSION) return;
    var strokes;
    try { strokes = JSON.parse(text); } catch(e){ return; }
    if (!Array.isArray(strokes)) return;
    PP_SESSION.pages[pg].strokes = strokes;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.forEach(function(st){ ppStrokeLine(canvas, st, st.color, st.width); });
  }).catch(function(){});
}

function ppInkDown(e){
  var canvas = e.currentTarget;
  if (!PP_SESSION) return;
  var pg = parseInt(canvas.getAttribute("data-pg"), 10);
  canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
  var pos = ppInkPos(canvas, e);
  var st = {
    color: PP_SESSION.eraser ? "#ffffff" : PP_SESSION.color,
    width: PP_SESSION.eraser ? 26 : 4,
    points: [pos]
  };
  PP_SESSION.pages[pg].strokes.push(st);
  PP_SESSION.pages[pg].drawing = st;
  PP_SESSION.current = pg;
  var pi = document.getElementById("ppPageInfo");
  if (pi) pi.textContent = "第 " + (pg + 1) + " 页";
  var ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, st.width / 2, 0, Math.PI * 2);
  ctx.fillStyle = st.color;
  ctx.fill();
}
function ppInkMove(e){
  var canvas = e.currentTarget;
  if (!PP_SESSION) return;
  var pg = parseInt(canvas.getAttribute("data-pg"), 10);
  var drawing = PP_SESSION.pages[pg] && PP_SESSION.pages[pg].drawing;
  if (!drawing) return;
  e.preventDefault();
  var pos = ppInkPos(canvas, e);
  drawing.points.push(pos);
  ppStrokeLine(canvas, drawing, drawing.color, drawing.width);
}
function ppInkUp(e){
  var canvas = e.currentTarget;
  if (!PP_SESSION) return;
  var pg = parseInt(canvas.getAttribute("data-pg"), 10);
  var drawing = PP_SESSION.pages[pg] && PP_SESSION.pages[pg].drawing;
  if (!drawing) return;
  var strokes = PP_SESSION.pages[pg].strokes.filter(function(s){ return s.points.length > 0; });
  PP_SESSION.pages[pg].strokes = strokes;
  PP_SESSION.pages[pg].drawing = null;
  ppSaveInk(pg);
}

function ppStrokeLine(canvas, st, color, width){
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

function ppSaveInk(pg){
  var strokes = PP_SESSION.pages[pg].strokes;
  var blob = new Blob([JSON.stringify(strokes)], {type: "application/json"});
  ppDBPut(PP_SESSION.pid + ":ink:" + pg, blob).catch(function(){});
}

function ppClearPage(){
  var canvas = document.querySelector('.pp-ink-canvas[data-pg="' + PP_SESSION.current + '"]');
  if (!canvas) return;
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  PP_SESSION.pages[PP_SESSION.current].strokes = [];
  ppSaveInk(PP_SESSION.current);
  ppToast("本页已清空");
}

function ppPickColor(btn){
  PP_SESSION.eraser = !!btn.eraser;
  PP_SESSION.color = btn.getAttribute ? (btn.getAttribute("data-c") || PP_SESSION.color) : PP_SESSION.color;
  var colors = document.querySelectorAll(".pp-color");
  for (var i = 0; i < colors.length; i++) colors[i].classList.remove("active");
  var er = document.getElementById("ppBtnEraser");
  if (er) er.classList.remove("active");
  if (btn.eraser){ if (er) er.classList.add("active"); }
  else if (btn.getAttribute){ btn.classList.add("active"); }
}

/* ---------- 听力 ---------- */
function ppPlayAudio(idx){
  var pid = PP_SESSION.pid;
  if (PP_SESSION._audio && PP_SESSION._audioIdx === idx){
    PP_SESSION._audio.pause();
    PP_SESSION._audio = null;
    PP_SESSION._audioIdx = -1;
    ppRenderAudioBar(ppFind(pid));
    return;
  }
  ppDBGet(pid + ":audio:" + idx).then(function(blob){
    if (!blob){ ppToast("音频文件丢失"); return; }
    var url = URL.createObjectURL(blob);
    if (PP_SESSION._audio){
      PP_SESSION._audio.pause();
      URL.revokeObjectURL(PP_SESSION._audio._url || "");
      PP_SESSION._audio = null;
    }
    var audio = new Audio(url);
    audio._url = url;
    PP_SESSION._audio = audio;
    PP_SESSION._audioIdx = idx;
    audio.play().catch(function(){ ppToast("音频播放失败"); });
    var p = ppFind(pid);
    ppRenderAudioBar(p, idx);
  });
}
function ppRenderAudioBar(p, playingIdx){
  var panel = document.getElementById("ppAudioPanel");
  if (!panel) return;
  var audios = p.audios || [];
  if (audios.length === 0){
    panel.innerHTML = '<div class="pp-audio-empty">📭 本卷还没有听力音频。可在添加试卷时一起上传，或删除后重新添加。</div>';
    return;
  }
  var html = '<div class="pp-audio-title">🎧 本卷听力（点击播放，再点停止）</div>';
  audios.forEach(function(a, i){
    var play = i === playingIdx ? '⏸ 停止' : '▶ 播放';
    html += '<div class="pp-audio-row" id="ppAudioRow' + i + '">' +
      '<span class="pp-audio-name">音频 ' + (i + 1) + '：' + ppEsc(a.name) + '</span>' +
      '<button class="pp-btn sm" type="button" onclick="ppPlayAudio(' + i + ')">' + play + '</button>' +
    '</div>';
  });
  panel.innerHTML = html;
}
function ppAudiosReset(){
  var rows = document.querySelectorAll('[id^="ppAudioRow"]');
  for (var i = 0; i < rows.length; i++){
    var btn = rows[i].querySelector(".pp-btn");
    if (btn) btn.textContent = "▶ 播放";
  }
}

/* ---------- 工具栏 ---------- */
function ppTool(act){
  if (!PP_SESSION) return;
  if (act === "audio"){
    var panel = document.getElementById("ppAudioPanel");
    if (panel) panel.style.display = panel.style.display === "none" ? "" : "none";
    return;
  }
  if (act === "prev"){ ppScrollTo(PP_SESSION.current - 1); }
  else if (act === "next"){ ppScrollTo(PP_SESSION.current + 1); }
  else if (act === "zoomin"){ PP_SESSION.fit = false; PP_SESSION.scale = Math.min(PP_SESSION.scale * 1.15, 3); ppApplyScale(); }
  else if (act === "zoomout"){ PP_SESSION.fit = false; PP_SESSION.scale = Math.max(PP_SESSION.scale / 1.15, 0.5); ppApplyScale(); }
  else if (act === "fit"){ PP_SESSION.fit = true; PP_SESSION.scale = 1; ppApplyScale(); }
}

function ppScrollTo(pg){
  if (pg < 0 || pg >= PP_SESSION.pageCount) return;
  PP_SESSION.current = pg;
  var el = document.querySelector('.pp-page[data-pg="' + pg + '"]');
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  var pi = document.getElementById("ppPageInfo");
  if (pi) pi.textContent = "第 " + (pg + 1) + " 页";
}

/* ---------- 导出/导入试卷包 ---------- */
function ppExportPack(){
  var list = ppMeta();
  if (list.length === 0){ ppToast("还没有试卷，先添加再导出"); return; }
  if (!confirm("导出全部 " + list.length + " 套试卷为一个试卷包文件？\n（含 PDF、听力音频、手写笔迹，微信发送到平板后导入即可用）")) return;

  ppToast("正在打包，请稍候…");
  var pack = { ver: 1, exported: new Date().toISOString(), cats: ppCats(), papers: [] };
  var chain = Promise.resolve();
  list.forEach(function(p){
    chain = chain.then(function(){
      return (function(){
        var entry = {
          id: p.id, name: p.name, catId: p.catId || "", pages: p.pages || 0, created: p.created,
          pdfSize: p.pdfSize || 0, audios: p.audios || []
        };
        var tasks = [];
        tasks.push(ppBlobToB64(ppDBGet(p.id + ":pdf"), "pdf"));
        (p.audios || []).forEach(function(a, i){
          tasks.push(ppBlobToB64(ppDBGet(p.id + ":audio:" + i), "a" + i));
        });
        var pgCount = p.pages || 0;
        for (var pg = 0; pg < pgCount; pg++){
          (function(pgIndex){
            tasks.push(ppBlobToB64(ppDBGet(p.id + ":ink:" + pgIndex), "ink" + pgIndex));
          })(pg);
        }
        return Promise.all(tasks).then(function(results){
          results.forEach(function(r){
            if (r.tag === "pdf") entry.pdf = r.data;
            else if (r.tag.indexOf("a") === 0) entry["audio" + r.tag.slice(1)] = r.data;
            else if (r.tag.indexOf("ink") === 0) entry[r.tag] = r.data;
          });
          pack.papers.push(entry);
        });
      })();
    });
  });

  chain.then(function(){
    var json = JSON.stringify(pack);
    var blob = new Blob([json], {type: "application/json"});
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "专项试卷包-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 2000);
    ppToast("✅ 试卷包已导出（" + ppFmtSize(json.length) + "），微信发送到平板后导入即可");
  }).catch(function(err){
    ppToast("打包失败：" + (err && err.message || ""));
  });
}

function ppBlobToB64(promise, tag){
  return promise.then(function(blob){
    if (!blob) return { tag: tag, data: "" };
    return new Promise(function(resolve, reject){
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

function ppImport(input){
  var file = input && input.files && input.files[0];
  if (!file) return;
  var r = new FileReader();
  r.onload = function(){
    var pack;
    try { pack = JSON.parse(r.result); } catch(e){ ppToast("试卷包解析失败：不是有效的 JSON"); input.value = ""; return; }
    ppRestorePack(pack).then(function(ok){
      ppToast(ok ? "✅ 导入完成！" : "导入完成（部分内容缺失）");
      ppRender();
      if (typeof xqRender === "function") xqRender();
    });
  };
  r.onerror = function(){ ppToast("读取文件失败"); };
  r.readAsText(file);
  input.value = "";
}

function ppRestorePack(pack){
  if (!pack || !Array.isArray(pack.papers)) return Promise.resolve(false);
  /* 合并专题（按 id 去重） */
  if (Array.isArray(pack.cats)){
    var cats = ppCats();
    pack.cats.forEach(function(c){
      if (!cats.filter(function(x){ return x.id === c.id; })[0]) cats.push({ id: c.id, name: c.name });
    });
    ppSaveCats(cats);
  }
  var meta = ppMeta();
  var chain = Promise.resolve();
  pack.papers.forEach(function(p, _idx){
    var pid = p.id || ppUid();
    chain = chain.then(function(){
      return (function(){
        var writes = [];
        if (p.pdf) writes.push(ppB64ToBlob(p.pdf).then(function(b){ return ppDBPut(pid + ":pdf", b); }));
        (p.audios || []).forEach(function(a, i){
          var key = "audio" + i;
          if (p[key]) writes.push(ppB64ToBlob(p[key]).then(function(b){ return ppDBPut(pid + ":audio:" + i, b); }));
        });
        for (var pg = 0; pg < (p.pages || 0); pg++){
          var ikey = "ink" + pg;
          if (p[ikey]) (function(pgI){
            writes.push(ppB64ToBlob(p[ikey]).then(function(b){ return ppDBPut(pid + ":ink:" + pgI, b); }));
          })(pg);
        }
        return Promise.all(writes).then(function(){
          var exists = meta.filter(function(m){ return m.id === pid; })[0];
          if (!exists) meta.push({
            id: pid, name: p.name || "导入试卷", catId: p.catId || "",
            pages: p.pages || 0, pdfSize: p.pdfSize || 0,
            audios: p.audios || [], created: p.created || Date.now()
          });
        });
      })();
    });
  });
  return chain.then(function(){
    ppSaveMeta(meta);
    return true;
  }).catch(function(){ return false; });
}

function ppB64ToBlob(b64){
  return new Promise(function(resolve, reject){
    try {
      var bin = atob(b64);
      var arr = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      resolve(new Blob([arr]));
    } catch(e){ reject(e); }
  });
}

/* ---------- 关闭 ---------- */
function ppClose(){
  var mask = document.getElementById("ppMask");
  if (mask) mask.classList.remove("open");
  PP_SESSION = null;
}

/* ---------- 轻提示 ---------- */
function ppToast(msg){
  var box = document.getElementById("ppToast");
  if (!box){
    box = document.createElement("div");
    box.id = "ppToast";
    box.className = "pp-toast";
    document.body.appendChild(box);
  }
  box.textContent = msg;
  box.classList.add("show");
  clearTimeout(PP_TOAST_T);
  PP_TOAST_T = setTimeout(function(){ box.classList.remove("show"); }, 2400);
}
var PP_TOAST_T = null;

window.addEventListener("load", function(){
  if (document.getElementById("ppList")) ppRender();
});