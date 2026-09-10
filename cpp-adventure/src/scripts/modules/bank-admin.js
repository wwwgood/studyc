/* ---------------- 题库管理后台 bank-admin.js ----------------
 * 页面上的题库配置入口：导入真题、查看统计、浏览题目。
 * 支持：文本粘贴、JSON、PDF（PDF.js）、Word（mammoth.js）、图片（百度OCR）。
 * 预设科目：英语/数学/语文/其他。
 */

var BA_SUBJECTS = [
  {id: "english", name: "英语", emoji: "🔤"},
  {id: "math", name: "数学", emoji: "🔢"},
  {id: "chinese", name: "语文", emoji: "📖"},
  {id: "other", name: "其他", emoji: "📝"}
];

var BA_MODULES = {
  english: [
    { id: "grammar", name: "语法闯关" },
    { id: "vocab", name: "词汇闯关" },
    { id: "reading", name: "阅读理解" },
    { id: "writing", name: "作文训练" },
    { id: "exam", name: "真题演练" }
  ],
  math: [
    { id: "arithmetic", name: "计算题" },
    { id: "geometry", name: "几何题" },
    { id: "wordproblem", name: "应用题" },
    { id: "exam", name: "真题演练" }
  ],
  chinese: [
    { id: "pinyin", name: "拼音字词" },
    { id: "reading", name: "阅读理解" },
    { id: "composition", name: "作文" },
    { id: "exam", name: "真题演练" }
  ],
  other: [
    { id: "general", name: "综合题" }
  ]
};

/* 语法12章 + 词汇20单元：用于导入归属下拉（替代看不懂的数字topicId） */
var BA_CHAPTERS = [
  { id: 1,  name: "🏝️ 名词（可数/不可数/复数/所有格）" },
  { id: 2,  name: "⛵ 冠词（a / an / the）" },
  { id: 3,  name: "🌳 代词（人称/物主/指示/不定）" },
  { id: 4,  name: "⛏️ 数词（基数词/序数词）" },
  { id: 5,  name: "🏔️ 形容词（比较级/最高级）" },
  { id: 6,  name: "🐎 副词（频度/方式）" },
  { id: 7,  name: "🌀 介词（时间/地点）" },
  { id: 8,  name: "🌉 连词（并列/从属）" },
  { id: 9,  name: "🏰 动词（be动词/三单/情态/现在时）" },
  { id: 10, name: "⚓ 进行时（现在进行时/ing形式）" },
  { id: 11, name: "🚂 过去将来时（一般过去/将来）" },
  { id: 12, name: "👑 句型（疑问句/祈使句/感叹句）" }
];

var BA_UNITS = [
  { id: 1,  name: "👨‍👩‍👧 家庭与人物" },
  { id: 2,  name: "🏫 学校与学习" },
  { id: 3,  name: "🐶 动物与宠物" },
  { id: 4,  name: "🍎 食物与饮料" },
  { id: 5,  name: "🌈 颜色与衣服" },
  { id: 6,  name: "🔢 数字与时间" },
  { id: 7,  name: "🏠 房间与家具" },
  { id: 8,  name: "🚗 交通与地点" },
  { id: 9,  name: "🌦 天气与季节" },
  { id: 10, name: "💬 日常活动" },
  { id: 11, name: "🎪 兴趣与爱好" },
  { id: 12, name: "🛒 购物与数量" },
  { id: 13, name: "🏥 身体与健康" },
  { id: 14, name: "🎒 文具与用品" },
  { id: 15, name: "🌍 自然与环境" },
  { id: 16, name: "🎉 节日与庆祝" },
  { id: 17, name: "🤔 情感与感受" },
  { id: 18, name: "✈️ 旅行与方位" },
  { id: 19, name: "🎵 艺术与娱乐" },
  { id: 20, name: "📚 综合复习" }
];

/* ---------- 打开/关闭 ---------- */
function baOpen(){
  try { baRestoreImported(); } catch(e){}
  baRender();
  document.getElementById("baDialogMask").classList.add("open");
  document.body.style.overflow = "hidden";
}

function baClose(){
  document.getElementById("baDialogMask").classList.remove("open");
  document.body.style.overflow = "";
}

/* ---------- 主渲染 ---------- */
var BA_CURRENT_TAB = "import";

function baRender(){
  var dialog = document.getElementById("baDialog");
  if (!dialog) return;
  var stats = baGetStats();
  var tab = BA_CURRENT_TAB;
  function panelShow(t){ return tab === t ? "" : ' style="display:none"'; }
  var html = '<div class="ba-dlg-head">' +
    '<span class="ba-cap">📚 题库管理</span>' +
    '<button class="ba-close" type="button" onclick="baClose()">×</button>' +
  '</div>' +
  '<div class="ba-dlg-body">' +
    '<div class="ba-tabs">' +
      '<button class="ba-tab' + (tab === 'import' ? ' active' : '') + '" data-tab="import" type="button" onclick="baSwitchTab(\'import\')">📥 导入真题</button>' +
      '<button class="ba-tab' + (tab === 'stats' ? ' active' : '') + '" data-tab="stats" type="button" onclick="baSwitchTab(\'stats\')">📊 题库统计</button>' +
      '<button class="ba-tab' + (tab === 'browse' ? ' active' : '') + '" data-tab="browse" type="button" onclick="baSwitchTab(\'browse\')">🔍 浏览题目</button>' +
      '<button class="ba-tab' + (tab === 'api' ? ' active' : '') + '" data-tab="api" type="button" onclick="baSwitchTab(\'api\')">🔑 API配置</button>' +
    '</div>' +
    '<div class="ba-panel" id="baPanelImport"' + panelShow('import') + '>' + baRenderImport() + '</div>' +
    '<div class="ba-panel" id="baPanelStats"' + panelShow('stats') + '>' + baRenderStats(stats) + '</div>' +
    '<div class="ba-panel" id="baPanelBrowse"' + panelShow('browse') + '>' + baRenderBrowse() + '</div>' +
    '<div class="ba-panel" id="baPanelAPI"' + panelShow('api') + '>' + baRenderAPI() + '</div>' +
  '</div>';
  dialog.innerHTML = html;
  baUpdateModules();
  if (tab === 'browse') baBrowseFilter();
  baBindFileZone();
}

function baBindFileZone(){
  var zone = document.getElementById("baFileZone");
  var input = document.getElementById("baFileInput");
  if (!zone || !input) return;
  if (zone._baBound) return;
  zone._baBound = true;
  zone.addEventListener("click", function(){ input.click(); });
  input.addEventListener("change", function(){
    if (input.files.length > 0) baHandleFiles(input.files);
    input.value = "";
  });
  zone.addEventListener("dragover", function(e){ e.preventDefault(); zone.classList.add("dragover"); });
  zone.addEventListener("dragleave", function(){ zone.classList.remove("dragover"); });
  zone.addEventListener("drop", function(e){
    e.preventDefault();
    zone.classList.remove("dragover");
    if (e.dataTransfer.files.length > 0) baHandleFiles(e.dataTransfer.files);
  });
}

function baSwitchTab(tab){
  BA_CURRENT_TAB = tab;
  var tabs = document.querySelectorAll('.ba-tab');
  for (var i = 0; i < tabs.length; i++){
    tabs[i].classList.toggle('active', tabs[i].getAttribute('data-tab') === tab);
  }
  document.getElementById("baPanelImport").style.display = tab === 'import' ? '' : 'none';
  document.getElementById("baPanelStats").style.display = tab === 'stats' ? '' : 'none';
  document.getElementById("baPanelBrowse").style.display = tab === 'browse' ? '' : 'none';
  document.getElementById("baPanelAPI").style.display = tab === 'api' ? '' : 'none';
  if (tab === 'browse') baBrowseFilter();
}

/* ---------- 导入面板 ---------- */
function baRenderImport(){
  var subjectOpts = BA_SUBJECTS.map(function(s){
    return '<option value="' + s.id + '"' + (s.id === "english" ? " selected" : "") + '>' + s.emoji + ' ' + s.name + '</option>';
  }).join("");

  return '<div class="ba-import-area">' +
    '<div class="ba-file-zone" id="baFileZone">' +
      '<div class="ba-file-hint">📁 拖拽文件到这里，或点击选择文件</div>' +
      '<div class="ba-file-types">支持：.txt .json .pdf .doc .docx .png .jpg（图片自动OCR，可多选）</div>' +
      '<input type="file" id="baFileInput" accept=".txt,.json,.pdf,.doc,.docx,.png,.jpg,.jpeg" multiple style="display:none">' +
    '</div>' +
    '<div class="ba-file-help">' +
      '<b>📄 上传后怎么处理？</b><br>' +
      '• <b>.txt / .json</b>：读取文本 → 填入下方粘贴框<br>' +
      '• <b>.pdf</b>：PDF.js 提取文字 → 填入粘贴框<br>' +
      '• <b>.doc / .docx</b>：mammoth.js 提取文字+图片 → 文字填入粘贴框，图片自动OCR（.doc旧格式如不兼容，请另存为.docx）<br>' +
      '• <b>.png / .jpg</b>：Tesseract.js（离线免费）OCR识别 → 识别结果追加到粘贴框<br>' +
      '• 文件内容读入后，点下方「🔍 解析并预览」按钮，系统自动拆题、识别题型、匹配答案、识别考点' +
    '</div>' +
    '<div class="ba-paste-area">' +
      '<div class="ba-paste-label">或粘贴题目文本：</div>' +
      '<textarea id="baPasteText" placeholder="格式示例：&#10;1. There are some ___ on the table.&#10;A. tomato   B. tomatos   C. tomatoes   D. tomatoos&#10;答案：C&#10;解析：以辅音字母+o结尾的名词变复数加es&#10;&#10;（每题之间空一行）"></textarea>' +
    '</div>' +
    '<button class="ba-parse-btn" type="button" onclick="baParseAndPreview()">🔍 解析并预览</button>' +
  '</div>' +
  '<div class="ba-import-config">' +
    '<div class="ba-config-title">📝 导入归属（以下信息标记这批题的出处，方便日后筛选）</div>' +
    '<div class="ba-config-row">' +
      '<label>科目</label><select id="baSubject" onchange="baUpdateModules()">' + subjectOpts + '</select>' +
    '</div>' +
    '<div class="ba-config-row">' +
      '<label>模块</label><select id="baModule" onchange="baUpdateModuleTopic()"></select>' +
      '<span class="ba-config-tip">题库无自动识别考点时，归到此模块</span>' +
    '</div>' +
    '<div class="ba-config-row">' +
      '<label>专题章节</label>' +
      /* 注意：这里不能再挂 baUpdateModuleTopic()，否则一选就被重建、跳回「不指定」 */
      '<select id="baModuleTopic" onchange="baOnTopicChange()"></select>' +
      '<span class="ba-config-tip" id="baTopicTip">选语法→对应12章，选词汇→对应20单元，其他模块不指定</span>' +
    '</div>' +
    '<div class="ba-config-row">' +
      '<label>来源</label><select id="baSource"><option value="真题" selected>真题</option><option value="自编">自编</option></select>' +
    '</div>' +
    '<div class="ba-config-row">' +
      '<label>来源详情</label><input type="text" id="baSourceDetail" placeholder="如：2023年北京小升初英语真题">' +
    '</div>' +
    '<div class="ba-config-row">' +
      '<label>年份</label><input type="number" id="baYear" value="0" min="0" placeholder="如：2023">' +
      '<label>地区</label><input type="text" id="baRegion" placeholder="如：北京">' +
    '</div>' +
    '<div class="ba-config-row">' +
      '<label>难度</label><select id="baDifficulty"><option value="1">1-基础</option><option value="2">2-中等</option><option value="3" selected>3-较难</option><option value="4">4-难</option><option value="5">5-极难</option></select>' +
      '<span class="ba-config-tip">影响练习时的出现顺序，由易到难</span>' +
    '</div>' +
  '</div>' +
  '<div class="ba-preview" id="baPreview"></div>';
}

function baUpdateModules(){
  var subjectEl = document.getElementById("baSubject");
  if (!subjectEl) return;
  var subject = subjectEl.value;
  var modules = BA_MODULES[subject] || [];
  var opts = modules.map(function(m){
    return '<option value="' + m.id + '">' + m.name + '</option>';
  }).join("");
  var sel = document.getElementById("baModule");
  if (sel){
    sel.innerHTML = opts;
    if (sel.options.length > 0 && !sel.value) sel.value = sel.options[0].value;
  }
  baUpdateModuleTopic();
}

/* 记住每个模块上次选的章节，避免重绘后被清空 */
var BA_TOPIC_MEM = { _module: "" };

function baTopicList(module){
  if (module === "grammar") return BA_CHAPTERS;
  if (module === "vocab") return BA_UNITS;
  return [];
}

/* 根据选中的模块，动态生成「专题章节」下拉：语法→12章 / 词汇→20单元 / 其他→不指定
 * 重建时会尽量保留用户已选中的章节（原来一选就被重置成「不指定」，就是这个坑） */
function baUpdateModuleTopic(){
  var sel = document.getElementById("baModule");
  var topicSel = document.getElementById("baModuleTopic");
  if (!sel || !topicSel) return;
  var module = sel.value || (sel.options.length > 0 ? sel.options[0].value : "");
  var sameModule = (BA_TOPIC_MEM._module === module);
  var prev = sameModule ? topicSel.value : "";
  var list = baTopicList(module);

  var opts = '<option value="0">— 不指定 —</option>';
  list.forEach(function(item){
    opts += '<option value="' + item.id + '">' + item.name + '</option>';
  });
  topicSel.innerHTML = opts;

  /* 恢复选择：优先当前值，其次该模块上次记住的值 */
  var keep = prev || (BA_TOPIC_MEM[module] || "");
  if (keep && String(keep) !== "0"){
    var hit = false;
    for (var i = 0; i < topicSel.options.length; i++){
      if (topicSel.options[i].value === String(keep)){ hit = true; break; }
    }
    if (hit) topicSel.value = String(keep);
  }
  BA_TOPIC_MEM._module = module;
  baUpdateTopicTip();
}

/* 用户手动切换专题章节：只做记录 + 刷新提示，绝不重建下拉 */
function baOnTopicChange(){
  var sel = document.getElementById("baModule");
  var topicSel = document.getElementById("baModuleTopic");
  if (!sel || !topicSel) return;
  var module = sel.value || (sel.options.length > 0 ? sel.options[0].value : "");
  BA_TOPIC_MEM._module = module;
  BA_TOPIC_MEM[module] = topicSel.value;
  baUpdateTopicTip();
  baRefreshAssignLabels();
}

function baUpdateTopicTip(){
  var tip = document.getElementById("baTopicTip");
  var topicSel = document.getElementById("baModuleTopic");
  if (!tip || !topicSel) return;
  var v = parseInt(topicSel.value, 10) || 0;
  if (v === 0){
    tip.textContent = "选语法→对应12章，选词汇→对应20单元，其他模块不指定（当前：不指定，将按自动识别的考点归类）";
  } else {
    var label = topicSel.options[topicSel.selectedIndex] ? topicSel.options[topicSel.selectedIndex].text : ("第" + v + "章");
    tip.textContent = "已指定：" + label + " —— 导入时这批题统一归入该章节";
  }
}

/* ---------- 归属判定：预览与导入共用同一套规则，避免两处口径不一致 ---------- */
/* 优先级：① 单题「手动归类」 ② 用户在「专题章节」明确指定 ③ 自动识别考点 ④ 兜底用所选模块 */
function baGetImportDefaults(){
  var subjEl = document.getElementById("baSubject");
  var modEl = document.getElementById("baModule");
  var topicEl = document.getElementById("baModuleTopic");
  return {
    subject: subjEl ? subjEl.value : "english",
    module: modEl ? (modEl.value || (modEl.options.length ? modEl.options[0].value : "")) : "",
    topicId: topicEl ? (parseInt(topicEl.value, 10) || 0) : 0
  };
}

function baResolveTarget(q, def, validMods){
  if (q && q.kpOverride && q.kpOverrideModule &&
      (!validMods || validMods.indexOf(q.kpOverrideModule) >= 0)){
    return { module: q.kpOverrideModule, topicId: q.kpOverrideTopicId || 0, by: "手动归类" };
  }
  if (def && def.topicId > 0){
    return { module: def.module, topicId: def.topicId, by: "指定章节" };
  }
  if (q && q.kpModule && (!validMods || validMods.indexOf(q.kpModule) >= 0) &&
      typeof q.kpTopicId === "number"){
    return { module: q.kpModule, topicId: q.kpTopicId, by: "自动考点" };
  }
  return { module: def ? def.module : "", topicId: 0, by: "模块默认" };
}

/* 预览区已渲染时，改动「专题章节」可实时刷新每题的归入提示 */
function baRefreshAssignLabels(){
  var preview = document.getElementById("baPreview");
  if (!preview || !preview._questions) return;
  var def = baGetImportDefaults();
  var validMods = (BA_MODULES[def.subject] || []).map(function(m){ return m.id; });
  preview._questions.forEach(function(q, i){
    var item = document.getElementById("ba-item-" + i);
    if (!item) return;
    var box = item.querySelector(".ba-preview-assign");
    if (!box) return;
    var tgt = baResolveTarget(q, def, validMods);
    var kpText = q.kpOverride ? ('<b>' + baEsc(q.kpOverride) + '</b>（手动）')
      : (q.kp && q.kp.length ? ('<b>' + baEsc(q.kp[0]) + '</b>（自动）') : '<i>未识别</i>');
    box.innerHTML = '📌 归入：' + kpText +
      ' → ' + baEsc(def.subject) + ' / ' + baEsc(tgt.module) +
      ' · 章节 <b>' + baEsc(baTopicLabel(tgt.module, tgt.topicId)) + '</b>' +
      '（' + tgt.by + '）';
  });
}

/* ---------- 文件处理（支持多文件） ---------- */
function baHandleFile(file){
  baHandleFiles([file]);
}

function baHandleFiles(files){
  var imageFiles = [];
  for (var i = 0; i < files.length; i++){
    var file = files[i];
    var name = file.name.toLowerCase();
    var ext = name.split(".").pop();
    if (ext === "txt" || ext === "json"){
      (function(f){
        var reader = new FileReader();
        reader.onload = function(){
          document.getElementById("baPasteText").value = reader.result;
          baToast("已加载文件：" + f.name);
        };
        reader.readAsText(f);
      })(file);
    } else if (ext === "pdf"){
      baParsePDF(file);
    } else if (ext === "doc" || ext === "docx"){
      baParseDocx(file);
    } else if (ext === "png" || ext === "jpg" || ext === "jpeg"){
      imageFiles.push(file);
    } else {
      baToast("不支持的文件格式：" + ext);
    }
  }
  if (imageFiles.length > 0){
    baOCRImages(imageFiles);
  }
}

/* PDF 解析（使用 PDF.js） */
function baParsePDF(file){
  if (typeof pdfjsLib === "undefined"){
    baToast("PDF.js 未加载，请确保网络可用。或先将PDF转为文本再粘贴。");
    return;
  }
  baToast("正在解析PDF...");
  var reader = new FileReader();
  reader.onload = function(){
    pdfjsLib.getDocument({data: new Uint8Array(reader.result)}).promise.then(function(pdf){
      var totalPages = pdf.numPages;
      var allText = "";
      var pagePromises = [];
      for (var i = 1; i <= totalPages; i++){
        pagePromises.push(pdf.getPage(i).then(function(page){
          return page.getTextContent().then(function(content){
            var text = "";
            content.items.forEach(function(item){ text += item.str + " "; });
            return text + "\n\n";
          });
        }));
      }
      Promise.all(pagePromises).then(function(texts){
        allText = texts.join("");
        document.getElementById("baPasteText").value = allText;
        baToast("PDF解析完成，共" + totalPages + "页。请检查文本后点「解析并预览」");
      });
    }).catch(function(err){
      baToast("PDF解析失败：" + err.message);
    });
  };
  reader.readAsArrayBuffer(file);
}

/* Word 解析（使用 mammoth.js）—— 支持提取嵌入图片做OCR */
function baParseDocx(file){
  if (typeof mammoth === "undefined"){
    baToast("mammoth.js 未加载，请确保网络可用。或先将Word转为文本再粘贴。");
    return;
  }
  baToast("正在解析Word文档...");
  var reader = new FileReader();
  reader.onload = function(){
    mammoth.convertToHtml({arrayBuffer: reader.result}).then(function(result){
      var html = result.value;
      var textOnly = html.replace(/<img[^>]*>/g, "\n[图片]\n")
        .replace(/<[^>]+>/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/^\[图片\]\n/gm, "")
        .trim();
      var imgRegex = /<img[^>]+src="data:image\/[^;]+;base64,([^"]+)"[^>]*>/g;
      var images = [];
      var m;
      while ((m = imgRegex.exec(html)) !== null){
        images.push(m[1]);
      }
      if (images.length === 0){
        document.getElementById("baPasteText").value = textOnly;
        baToast("Word解析完成（无嵌入图片）。请检查文本后点「解析并预览」");
        return;
      }
      baToast("Word含" + images.length + "张图片，正在OCR识别...");
      baOCRMultipleBase64(images, function(allOcrText){
        var combined = textOnly ? textOnly + "\n\n" + allOcrText : allOcrText;
        document.getElementById("baPasteText").value = combined;
        baToast("Word解析+OCR完成（" + images.length + "张图片）。请检查后点「解析并预览」");
      });
    }).catch(function(err){
      var isDoc = file.name.toLowerCase().endsWith(".doc");
      baToast(isDoc ?
        "旧版.doc格式不兼容，请用Word另存为.docx后再上传" :
        "Word解析失败：" + err.message);
    });
  };
  reader.readAsArrayBuffer(file);
}

/* 判断百度OCR是否可用（引擎选中百度且Key已配置） */
function baHasBaiduOCR(){
  if (baGetEngine() !== "baidu") return false;
  return !!(localStorage.getItem("ba_baidu_api_key") && localStorage.getItem("ba_baidu_secret_key"));
}

/* 批量OCR：接收base64数组，逐张识别，合并结果
 * 优先用百度OCR（精度高），未配置则用Tesseract.js（免费离线）
 */
function baOCRMultipleBase64(base64List, callback){
  if (base64List.length === 0){ callback(""); return; }
  if (baHasBaiduOCR()){
    baOCRBaidu(base64List, callback);
  } else {
    baOCRTesseract(base64List, callback);
  }
}

/* 百度OCR批量识别 */
function baOCRBaidu(base64List, callback){
  var apiKey = localStorage.getItem("ba_baidu_api_key");
  var secretKey = localStorage.getItem("ba_baidu_secret_key");
  fetch("https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=" + apiKey + "&client_secret=" + secretKey)
    .then(function(r){ return r.json(); })
    .then(function(tokenData){
      var accessToken = tokenData.access_token;
      var allText = "";
      var idx = 0;
      function nextImage(){
        if (idx >= base64List.length){ callback(allText); return; }
        baToast("百度OCR识别第 " + (idx + 1) + "/" + base64List.length + " 张...");
        fetch("https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=" + accessToken, {
          method: "POST",
          headers: {"Content-Type": "application/x-www-form-urlencoded"},
          body: "image=" + encodeURIComponent(base64List[idx]) + "&language_type=CHN_ENG"
        })
          .then(function(r){ return r.json(); })
          .then(function(ocrData){
            if (!ocrData.error_code){
              (ocrData.words_result || []).forEach(function(item){ allText += item.words + "\n"; });
              allText += "\n";
            }
            idx++;
            nextImage();
          })
          .catch(function(){ idx++; nextImage(); });
      }
      nextImage();
    })
    .catch(function(err){
      baToast("百度OCR获取token失败，尝试离线OCR...");
      baOCRTesseract(base64List, callback);
    });
}

/* Tesseract.js 离线OCR批量识别（免费，无需API Key） */
function baOCRTesseract(base64List, callback){
  if (typeof Tesseract === "undefined"){
    baToast("Tesseract.js 未加载，请确保网络可用。或手动粘贴文本。");
    callback("");
    return;
  }
  var allText = "";
  var idx = 0;
  function nextImage(){
    if (idx >= base64List.length){ callback(allText); return; }
    baToast("离线OCR识别第 " + (idx + 1) + "/" + base64List.length + " 张（首次加载较慢）...");
    var dataUrl = "data:image/png;base64," + base64List[idx];
    Tesseract.recognize(dataUrl, "chi_sim+eng", {
      logger: function(m){
        if (m.status === "recognizing text"){
          baToast("离线OCR识别第 " + (idx + 1) + "/" + base64List.length + " 张... " + Math.round(m.progress * 100) + "%");
        }
      }
    }).then(function(result){
      allText += result.data.text + "\n\n";
      idx++;
      nextImage();
    }).catch(function(err){
      baToast("第 " + (idx + 1) + " 张识别失败：" + err.message);
      idx++;
      nextImage();
    });
  }
  nextImage();
}

/* 图片OCR入口 —— 支持单张和多张批量 */
function baOCRImage(file){
  baOCRImages([file]);
}

function baOCRImages(files){
  baToast("正在读取 " + files.length + " 张图片...");
  var base64List = [];
  var loaded = 0;
  for (var i = 0; i < files.length; i++){
    (function(file, idx){
      var reader = new FileReader();
      reader.onload = function(){
        base64List[idx] = reader.result.split(",")[1];
        loaded++;
        if (loaded === files.length){
          baOCRMultipleBase64(base64List, function(allOcrText){
            var existing = document.getElementById("baPasteText").value;
            if (existing.trim()){
              document.getElementById("baPasteText").value = existing + "\n\n" + allOcrText;
            } else {
              document.getElementById("baPasteText").value = allOcrText;
            }
            baToast("OCR识别完成（" + files.length + "张图片）。请检查后点「解析并预览」");
          });
        }
      };
      reader.readAsDataURL(file);
    })(files[i], i);
  }
}

/* ---------- 试卷智能解析器 ---------- */
/* OCR识别出纯文本后，自动拆分题目、识别题型、猜测科目，不依赖任何付费API */

var BA_QTYPE_LABELS = {
  single: "🔵 单选题",
  multi: "🟣 多选题",
  judge: "🟢 判断题",
  fill: "🟡 填空题",
  solve: "🟠 解答题",
  essay: "✍️ 作文题",
  reading: "📄 阅读理解",
  listening: "🎧 听力题",
  phonics: "🔤 单词辩音",
  translation: "🔄 英汉互译",
  sentransform: "🔁 句型转换",
  complete: "✏️ 完成句子",
  match: "🔗 连线匹配",
  order: "📋 排序题",
  dialogue: "💬 情景对话"
};

/* 试卷大题标题 → 题型分类映射 */
var BA_SECTION_TYPES = [
  { keys: ["听力", "听对话", "听短文", "听录音"], type: "listening" },
  { keys: ["单词辩音", "辩音", "语音", "发音", "找出.*发音", "划线.*发音"], type: "phonics" },
  { keys: ["英汉互译", "汉译英", "英译汉", "翻译"], type: "translation" },
  { keys: ["句型转换", "改写句子", "同义句转换", "按要求改写"], type: "sentransform" },
  { keys: ["完成句子", "补全句子", "填空完成"], type: "complete" },
  { keys: ["连线", "匹配", "配对"], type: "match" },
  { keys: ["排序", "排列", "重新排列", "连词成句"], type: "order" },
  { keys: ["情景对话", "交际用语", "补全对话", "选择答语"], type: "dialogue" },
  { keys: ["单项选择", "选择题"], type: "single" },
  { keys: ["阅读理解", "阅读"], type: "reading" },
  { keys: ["作文", "写作", "书面表达"], type: "essay" },
  { keys: ["判断"], type: "judge" },
  { keys: ["完形填空", "填空"], type: "fill" },
  { keys: ["解答", "计算"], type: "solve" }
];

function baGuessSectionType(title){
  if (!title) return null;
  for (var i = 0; i < BA_SECTION_TYPES.length; i++){
    var st = BA_SECTION_TYPES[i];
    for (var j = 0; j < st.keys.length; j++){
      if (title.indexOf(st.keys[j]) >= 0) return st.type;
    }
  }
  return null;
}

/* 猜测科目：分析文本特征 */
function baGuessSubject(text){
  var englishWords = (text.match(/[a-zA-Z]{4,}/g) || []).length;
  var mathSymbols = (text.match(/[+\-×÷=≤≥<>√∑∫°]/g) || []).length;
  var mathWords = /(计算|求解|证明|三角形|方程|函数|几何|代数|面积|周长|体积|概率|分母|分子|倍数|因数|整除|余数|小数|分数|百分数|比例|速度|路程|相遇|追及|工程|利润|折扣|利息)/.test(text);
  var chineseWords = /(拼音|笔画|偏旁|部首|古诗|默写|组词|造句|近义词|反义词|成语|修辞|拟人|比喻|陈述句|疑问句|感叹句|祈使句|关联词|段落|标点)/.test(text);
  var essayWords = /(作文|写作|范文|以「|以"|题目：|不少于.*字|写一篇)/.test(text);

  if (essayWords && !mathWords && englishWords < 3) return { subject: "chinese", reason: "含作文/写作关键词" };
  if (englishWords > 8 && !mathWords) return { subject: "english", reason: "含较多英文单词（" + englishWords + "个）" };
  if (mathSymbols > 5 || mathWords) return { subject: "math", reason: "含数学符号或术语" };
  if (chineseWords) return { subject: "chinese", reason: "含语文术语" };
  if (englishWords > 3) return { subject: "english", reason: "含英文内容" };
  return { subject: "other", reason: "未识别出明显科目特征" };
}

/* 识别题型 */
function baGuessQType(text){
  var optCount = (text.match(/[A-D][\.、．]/g) || []).length;
  var hasFill = /____|＿＿|（\s*）|\(\s*\)|〔\s*〕|填空/.test(text);
  var hasJudge = /判断题|对\s*错|正确.*错误|√.*×|T.*F/i.test(text);
  var hasSolve = /(解答|计算|证明|求\s|试求|解方程|列式)/.test(text);
  var hasEssay = /(作文|写作|范文|以「|以"|题目：|不少于.*字|写一篇)/.test(text);
  var hasReading = /(阅读|读下面|读以下|根据短文|根据文章| passage|Read the)/i.test(text);
  var ansMulti = /答案[：:]\s*[A-D]{2,}/.test(text);

  if (hasEssay) return "essay";
  if (hasReading && text.length > 200) return "reading";
  if (optCount >= 2 && ansMulti) return "multi";
  if (optCount >= 4) return "single";
  if (hasJudge) return "judge";
  if (hasFill) return "fill";
  if (hasSolve) return "solve";
  if (optCount >= 2) return "single";
  return "solve";
}

/* 按大题标记分块：一、二、三、 或 一. 二. 三. 或 一、选择题 */
function baSplitBigBlocks(text){
  var marker = /^([一二三四五六七八九十]+[、．\.]\s*.*)$/m;
  if (!marker.test(text)) return [{ title: "", text: text }];
  var lines = text.split("\n");
  var blocks = [];
  var currentTitle = "";
  var current = [];
  lines.forEach(function(line){
    var trimmed = line.trim();
    if (/^[一二三四五六七八九十]+[、．\.]/.test(trimmed)){
      if (current.length > 0) blocks.push({ title: currentTitle, text: current.join("\n") });
      currentTitle = trimmed;
      current = [];
    } else {
      current.push(line);
    }
  });
  if (current.length > 0) blocks.push({ title: currentTitle, text: current.join("\n") });
  return blocks;
}

/* 按小题号拆分：1. 2. 3. 或 1、2、3、 或 (1) (2) (3)；记录题号供末尾答案表匹配 */
function baSplitSmallQuestions(block){
  var lines = block.split("\n").map(function(l){ return l.trim(); }).filter(function(l){ return l; });
  if (lines.length === 0) return [];
  var qBlocks = [];
  var current = [];
  var currentNo = null;
  lines.forEach(function(line){
    var m = line.match(/^(\d+)[\.、．]\s/);
    if (m){
      if (current.length > 0) qBlocks.push({ no: currentNo, lines: current });
      current = [line];
      currentNo = parseInt(m[1], 10);
    } else {
      current.push(line);
    }
  });
  if (current.length > 0) qBlocks.push({ no: currentNo, lines: current });
  return qBlocks;
}

/* 解析单道题：行内答案优先，末尾答案表兜底；无解析时按考点自动生成 */
function baParseOneQuestion(lines, subject, answerKey, qNo, sectionType){
  if (lines.length < 1) return null;
  if (lines.length === 1 && /^[一二三四五六七八九十]+[、．\.]/.test(lines[0])) return null;
  var fullText = lines.join("\n");
  var qType;
  if (sectionType && sectionType !== "single"){
    qType = sectionType;
  } else {
    qType = baGuessQType(fullText);
  }
  var hasOpts = /[A-D][\.、．]/.test(fullText);
  var treatAs;
  if (qType === "single" || qType === "multi"){
    treatAs = qType;
  } else if (qType === "judge"){
    treatAs = "judge";
  } else if (hasOpts && (qType === "phonics" || qType === "listening" || qType === "dialogue" || qType === "complete")){
    treatAs = "single";
  } else {
    treatAs = "solve";
  }
  var qText = lines[0].replace(/^\d+[\.、．]\s*/, "").trim();
  var opts = [];
  var ans = 0;
  var ansSource = "未找到";
  var why = "";
  var whyAuto = false;

  if (treatAs === "single" || treatAs === "multi"){
    lines.forEach(function(line){
      var m = line.match(/^([A-D])[\.、．]\s*(.*)$/);
      if (m) opts.push(m[2].trim());
    });
    if (opts.length < 2){
      var optLine = lines.find(function(l){ return /[A-D][\.、．]/.test(l); });
      if (optLine){
        opts = [];
        var re = /([A-D])[\.、．]\s*([^\n]*?)(?=\s+[A-D][\.、．]|$)/g;
        var mm;
        while ((mm = re.exec(optLine)) !== null) opts.push(mm[2].trim());
      }
    }
    if (opts.length < 2) return null;
    var ansLine = lines.find(function(l){ return /答案|answer/i.test(l); });
    var inlineFound = false;
    if (ansLine){
      if (treatAs === "multi"){
        var am = ansLine.match(/答案[：:]\s*([A-D]+)/i);
        if (am){ ans = am[1].split("").map(function(c){ return c.charCodeAt(0) - 65; }); inlineFound = true; }
      } else {
        var am2 = ansLine.match(/([A-Da-d])/);
        if (am2){ ans = am2[1].toUpperCase().charCodeAt(0) - 65; inlineFound = true; }
      }
      if (inlineFound) ansSource = "原卷行内";
    }
    if (!inlineFound && answerKey && qNo && answerKey[qNo]){
      var letter = answerKey[qNo];
      if (treatAs === "multi" && letter.length > 1){
        ans = letter.split("").map(function(c){ return c.charCodeAt(0) - 65; });
      } else {
        ans = letter.charCodeAt(0) - 65;
        if (ans < 0 || ans >= opts.length) ans = 0;
      }
      ansSource = "答案表";
    }
  } else if (treatAs === "judge"){
    opts = ["正确", "错误"];
    var ansLine2 = lines.find(function(l){ return /答案|answer/i.test(l); });
    if (ansLine2){ ans = /对|正确|√|T/i.test(ansLine2) ? 0 : 1; ansSource = "原卷行内"; }
    else if (answerKey && qNo && answerKey[qNo]){
      var jl = answerKey[qNo];
      ans = (jl === "A" || jl === "T") ? 0 : 1;
      ansSource = "答案表";
    }
  } else {
    qText = fullText.replace(/^\d+[\.、．]\s*/, "").trim();
    opts = ["（主观题，需人工评分）"];
    ans = 0;
    ansSource = "主观题";
  }

  var whyLine = lines.find(function(l){ return /解析|解释|分析/i.test(l); });
  if (whyLine){
    why = whyLine.replace(/^.*[解析|解释|分析][：:]\s*/, "").trim();
    ansSource = ansSource === "未找到" ? "原卷行内" : ansSource;
  }

  var q = { q: qText, o: opts, a: ans, why: why, kp: [], qType: qType, ansSource: ansSource };
  var kn = baDetectKnowledge(why, qText, opts);
  if (kn){
    q.kp = [kn.name]; q.kpTopicId = kn.topicId; q.kpModule = kn.module; q.kpConfidence = kn.src;
    if (!why && (treatAs === "single" || treatAs === "multi" || treatAs === "judge")){
      q.why = baGenWhy(kn.name, opts, ans, treatAs);
      if (q.why) q.whyAuto = true;
    }
  }
  return q;
}

/* ==================== 考点识别引擎 ====================
 * 三重证据匹配：解析文本（最强）→ 题干特征 → 选项特征
 * 考点映射到系统章节（topicId），导入后自动进入对应专题训练池
 */
var BA_KNOWLEDGE_MAP = [
  /* ---- 第1章 名词岛（具体规则在前，宽泛兜底在后） ---- */
  { module:"grammar", topicId:1, name:"可数与不可数名词", how:/不可数|可数名词|uncountable/, howQ:/How much.*(water|bread|milk|rice|tea|juice|money|paper|time|homework|news)/i, opts:/^(water|bread|milk|rice|tea|juice|money|paper|snow|hair|homework|news|advice)$/i },
  { module:"grammar", topicId:1, name:"名词复数-es规则", how:/加\s*es|以.*(s|x|ch|sh).*结尾/, opts:/(buses|boxes|watches|dishes|classes|tomatoes|potatoes)/ },
  { module:"grammar", topicId:1, name:"名词复数-ies规则", how:/y.*变.*ies|辅音字母.*y/, opts:/(cities|babies|families|stories|studies|candies)/ },
  { module:"grammar", topicId:1, name:"名词复数-ves规则", how:/f.*变.*ves|fe/, opts:/(leaves|knives|wolves|shelves|lives|wives)/ },
  { module:"grammar", topicId:1, name:"不规则名词复数", how:/不规则复数|特殊.*复数/, howQ:/\b(men|women|children|feet|teeth|mice|sheep|deer|people)\b/, opts:/^(men|women|children|feet|teeth|mice|tomatoes|potatoes)$/i },
  { module:"grammar", topicId:1, name:"名词所有格", how:/所有格/, howQ:/'s\s/ },
  { module:"grammar", topicId:1, name:"名词复数-加s规则", how:/直接加\s*s|一般.*加\s*s|变复数/, howQ:/\b(two|three|four|five|many|some|lots of)\b.*\b(bananas|birds|books|dogs|pens|cats|apples|bags|eggs)\b/i },
  { module:"grammar", topicId:1, name:"名词辨认", how:/名词辨析|考查名词|词性|名词辨辨认|哪个.*是名词/, opts:/^(run|jump|eat|happy|sad|big)$/ },
  /* ---- 第2章 冠词湾 ---- */
  { module:"grammar", topicId:2, name:"a与an的区别", how:/an?\s*与|元音.*an|用\s*an\b|a\s*\/\s*an/, opts:/^(a|an)$/i },
  { module:"grammar", topicId:2, name:"定冠词the", how:/定冠词/, opts:/^(the|\/|不填)$/i },
  { module:"grammar", topicId:2, name:"冠词综合", how:/冠词/, opts:/^(a|an|the|\/|不填)$/i },
  /* ---- 第3章 代词森林（仅靠解析与选项，题干代词太常见不作为证据） ---- */
  { module:"grammar", topicId:3, name:"物主代词", how:/物主代词|形容词性.*代词|名词性.*代词/, opts:/^(my|your|his|her|its|our|their|mine|yours|hers|ours|theirs)$/i },
  { module:"grammar", topicId:3, name:"人称代词主格宾格", how:/主格|宾格|人称代词/, opts:/^(I|he|she|they|we|him|her|them|us|me)$/i },
  { module:"grammar", topicId:3, name:"指示代词", how:/指示代词/, opts:/^(this|that|these|those)$/i },
  { module:"grammar", topicId:3, name:"不定代词", how:/不定代词/, opts:/^(some|any|each|every|both|all|either|neither|something|anything|nothing|nobody|everyone)$/i },
  /* ---- 第4章 数词矿井 ---- */
  { module:"grammar", topicId:4, name:"序数词", how:/序数词/, howQ:/\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|twelfth|twentieth)\b/i },
  { module:"grammar", topicId:4, name:"基数词", how:/基数词|hundred|thousand/, howQ:/\b(one|two|three|hundred|thousand)\b/i },
  /* ---- 第5章 形容词雪山 ---- */
  { module:"grammar", topicId:5, name:"形容词最高级", how:/最高级/, howQ:/\bthe\s+\w+est\b|\bthe most\b/i, opts:/est$|most\s/i },
  { module:"grammar", topicId:5, name:"形容词比较级", how:/比较级/, howQ:/\bthan\b/i, opts:/er$|more\s/i },
  { module:"grammar", topicId:5, name:"as同级比较", how:/as.*as|同级/, howQ:/as\s+\w+\s+as/i },
  { module:"grammar", topicId:5, name:"形容词辨认与用法", how:/形容词/, opts:/^(big|small|tall|short|happy|sad|beautiful|good|bad|new|old|hot|cold)$/i },
  /* ---- 第6章 副词草原 ---- */
  { module:"grammar", topicId:6, name:"频率副词", how:/频率副词|频度/, howQ:/\b(always|usually|often|sometimes|seldom|never)\b/i },
  { module:"grammar", topicId:6, name:"副词辨认与ly变化", how:/副词/, howQ:/\w+ly\b/i },
  /* ---- 第7章 介词迷宫 ---- */
  { module:"grammar", topicId:7, name:"时间介词", how:/时间介词|介词.*时间/, howQ:/(in|on|at)\s+(the\s+)?(morning|afternoon|evening|night|Monday|Sunday|weekend|o'?clock|noon|\d{1,2}[:：]|\d{1,4}年|May|June|July|spring|summer|autumn|winter)|(___+|＿＿+)\s*(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|morning|afternoon|evening|night)/i, opts:/^(in|on|at)$/i },
  { module:"grammar", topicId:7, name:"地点方位介词", how:/地点介词|方位介词|介词/, opts:/^(under|behind|beside|near|between|above|over|next to|in front of)$/i },
  /* ---- 第8章 连词大桥 ---- */
  { module:"grammar", topicId:8, name:"并列连词and/but/or", how:/连词|并列/, opts:/^(and|but|or|so)$/i },
  { module:"grammar", topicId:8, name:"because与so", how:/because|因果/, opts:/^(because|so)$/i },
  /* ---- 第9章 动词城（一般现在时；there be 在 be 动词之前） ---- */
  { module:"grammar", topicId:9, name:"there be句型", how:/there\s*be|There\s*be/i, howQ:/\bthere\s+(___+|＿＿+|is|are|was|were)\b/i, opts:/^(is|are|was|were|has|have)$/i },
  { module:"grammar", topicId:9, name:"be动词am/is/are", how:/be动词|am\s*is\s*are|is\s*are/, opts:/^(am|is|are|be|was|were)$/i },
  { module:"grammar", topicId:9, name:"动词第三人称单数", how:/三单|第三人称单数|单三/, howQ:/\b(goes|does|watches|washes|studies|flies|has)\b|\bhe\s+\w+s\b|\bshe\s+\w+s\b/i },
  { module:"grammar", topicId:9, name:"do/does助动词", how:/助动词|do\s*does|don'?t|doesn'?t/, howQ:/\b(do|does|don'?t|doesn'?t|Do|Does|Don'?t|Doesn'?t)\b/ },
  { module:"grammar", topicId:9, name:"情态动词", how:/情态动词/, opts:/^(can|could|must|should|may)$/i },
  { module:"grammar", topicId:9, name:"一般现在时", how:/一般现在时/, howQ:/\b(every day|every week|usually|always|often)\b/i },
  /* ---- 第10章 进行时码头 ---- */
  { module:"grammar", topicId:10, name:"现在进行时", how:/现在进行时|进行时/, howQ:/\b(now|Look!|Listen!|right now|at the moment)\b|\bis\s+\w+ing\b|\bare\s+\w+ing\b/i, opts:/ing$/i },
  { module:"grammar", topicId:10, name:"动词ing形式", how:/ing形式|现在分词|双写.*ing|去e加ing/, opts:/\w+ing/i },
  /* ---- 第11章 时光列车 ---- */
  { module:"grammar", topicId:11, name:"一般过去时", how:/过去式|过去时/, howQ:/\b(yesterday|last (week|night|month|year|Sunday)|ago)\b|\bwas\b|\bwere\b|\b(went|saw|ate|had|did|took|made|came|got|bought|read|wrote)\b/i },
  { module:"grammar", topicId:11, name:"一般将来时", how:/将来时|will|going to/, howQ:/\b(tomorrow|next (week|month|year|Sunday)|in the future|soon)\b|\bwill\b|\bgoing to\b/i, opts:/^(will|shall|am going to|is going to|are going to)$/i },
  /* ---- 第12章 句型城堡 ---- */
  { module:"grammar", topicId:12, name:"特殊疑问句", how:/特殊疑问/, howQ:/^(what|where|when|who|whose|why|how|which)\b/i, opts:/^(What|Where|When|Who|Whose|Why|How|Which)$/i },
  { module:"grammar", topicId:12, name:"一般疑问句", how:/一般疑问/, howQ:/^(Do|Does|Is|Are|Can|Did|Will)\b.*\?/ },
  { module:"grammar", topicId:12, name:"祈使句", how:/祈使句/, howQ:/^(Don'?t|Please|Let'?s)\b/i },
  { module:"grammar", topicId:12, name:"感叹句", how:/感叹句/, howQ:/^What\s+a\b|^How\s/i },
  { module:"grammar", topicId:12, name:"问句与句型综合", how:/疑问句|句型/ },
  /* ---- 数学 ---- */
  { module:"arithmetic", topicId:0, name:"加减运算", how:/加法|减法|相加|相减/, howQ:/[+\-－]/ },
  { module:"arithmetic", topicId:0, name:"乘除运算", how:/乘法|除法|相乘|相除/, howQ:/[×*÷/]/ },
  { module:"arithmetic", topicId:0, name:"余数问题", how:/余数|除不尽|模/ },
  { module:"wordproblem", topicId:0, name:"分数与小数", how:/分数|小数|百分数|百分比/ },
  { module:"wordproblem", topicId:0, name:"几何图形", how:/三角形|正方形|长方形|圆形|周长|面积|体积/ },
  { module:"wordproblem", topicId:0, name:"应用题综合", how:/应用题|路程|速度|相遇|工程|利润|折扣/ },
  /* ---- 语文 ---- */
  { module:"pinyin", topicId:0, name:"拼音与字词", how:/拼音|声母|韵母|音调|注音/ },
  { module:"reading", topicId:0, name:"词语辨析", how:/近义词|反义词|词语|组词/ },
  { module:"reading", topicId:0, name:"修辞手法", how:/比喻|拟人|夸张|排比|修辞/ },
  { module:"composition", topicId:0, name:"古诗默写", how:/古诗|默写|诗句|填诗句/ }
];

/* 考点识别：解析文本（最强证据）→ 题干 → 选项 */
function baDetectKnowledge(why, qText, opts){
  var optText = (opts || []).join(" ");
  var qo = (qText || "") + " " + optText;
  for (var i = 0; i < BA_KNOWLEDGE_MAP.length; i++){
    var k = BA_KNOWLEDGE_MAP[i];
    if (k.how && why && k.how.test(why)) return { name: k.name, module: k.module, topicId: k.topicId, src: "解析" };
  }
  for (var j = 0; j < BA_KNOWLEDGE_MAP.length; j++){
    var kq = BA_KNOWLEDGE_MAP[j];
    if (kq.howQ && qo && kq.howQ.test(qo)) return { name: kq.name, module: kq.module, topicId: kq.topicId, src: "题干" };
  }
  var optList = opts || [];
  for (var oi = 0; oi < optList.length; oi++){
    for (var m = 0; m < BA_KNOWLEDGE_MAP.length; m++){
      var ko = BA_KNOWLEDGE_MAP[m];
      if (ko.opts && optList[oi] && ko.opts.test(optList[oi])) return { name: ko.name, module: ko.module, topicId: ko.topicId, src: "选项" };
    }
  }
  return null;
}

/* ==================== 解析模板库 ====================
 * 原卷没有解析时，按考点自动生成讲解
 */
var BA_WHY_TPL = {
  "可数与不可数名词": "本题考查可数与不可数名词。water（水）、bread（面包）、milk（牛奶）这类数不清个数的是不可数名词：不能加a/an、没有复数，问数量用How much；苹果、鸡蛋等数得清的是可数名词。{answer}",
  "名词复数-es规则": "本题考查名词复数的加es规则：以s、x、ch、sh结尾的名词变复数要加es，如bus→buses、box→boxes、watch→watches。{answer}",
  "名词复数-ies规则": "本题考查名词复数的变y规则：辅音字母+y结尾的名词变复数，把y改为i再加es，如city→cities、baby→babies。{answer}",
  "名词复数-ves规则": "本题考查名词复数的f变ves规则：f/fe结尾的名词变复数，把f/fe改为ves，如leaf→leaves、knife→knives。{answer}",
  "不规则名词复数": "本题考查不规则名词复数：man→men、woman→women、child→children、foot→feet、tooth→teeth、mouse→mice，这些词变复数不按规则，要单独记牢。{answer}",
  "名词所有格": "本题考查名词所有格：表示「某人的」在名词后加's，如Tom's book（汤姆的书）、my mother's bag（妈妈的包）。{answer}",
  "名词复数-加s规则": "本题考查名词复数：大多数名词变复数直接加s，如book→books、dog→dogs；两个以上要用复数形式。{answer}",
  "名词辨认": "本题考查名词辨析：名词是表示人、事物、地点名称的词。run/jump是动词，happy/sad是形容词，apple/teacher才是名词。{answer}",
  "a与an的区别": "本题考查a与an的用法：a用在辅音音素开头的单词前，an用在元音音素开头的单词前。an apple、an egg、an hour；a book、a useful book。{answer}",
  "定冠词the": "本题考查定冠词the：特指某（些）人或物、上文提过的事物、双方都知道的事物用the。{answer}",
  "冠词综合": "本题考查冠词用法：a/an表示泛指「一个」（an用于元音音素开头），the表示特指。{answer}",
  "物主代词": "本题考查物主代词：形容词性物主代词（my/your/his/her）后面必须跟名词；名词性物主代词（mine/yours/hers）独立使用，后面不跟名词。{answer}",
  "人称代词主格宾格": "本题考查人称代词：主格（I/he/she/we/they）作主语，宾格（me/him/her/us/them）作宾语，放在动词或介词后面。{answer}",
  "指示代词": "本题考查指示代词：this（这个）/these（这些）指近处，that（那个）/those（那些）指远处。{answer}",
  "不定代词": "本题考查不定代词：some多用于肯定句，any多用于疑问句和否定句；both指两者都，all指三者及以上都。{answer}",
  "序数词": "本题考查序数词：表示「第几」用序数词，first（第一）、second（第二）、third（第三），前面通常加the。{answer}",
  "基数词": "本题考查基数词：表示数量用基数词，one、two、three；hundred/thousand与具体数连用不加s（two hundred）。{answer}",
  "形容词最高级": "本题考查形容词最高级：三者及以上比较用最高级，一般加est或用most，前面要加the，如the tallest、the most beautiful。{answer}",
  "形容词比较级": "本题考查形容词比较级：两者比较用比较级，一般加er或用more，句中常有than（比），如taller than、more beautiful than。{answer}",
  "as同级比较": "本题考查as...as同级比较结构：as+形容词/副词原级+as，表示「和…一样」，中间用原级不用比较级。{answer}",
  "形容词辨认与用法": "本题考查形容词：形容词用来描述名词的样子和性质，常放在be动词后（She is happy）或名词前（a big apple）。{answer}",
  "频率副词": "本题考查频率副词：always（总是100%）＞usually（通常）＞often（经常）＞sometimes（有时）＞never（从不0%），一般放在实义动词前、be动词后。{answer}",
  "副词辨认与ly变化": "本题考查副词：副词修饰动词，常由形容词+ly构成（quick→quickly），说明动作怎样发生。{answer}",
  "时间介词": "本题考查时间介词：in用于年/月/季节/泛指早中晚（in the morning），on用于具体某一天/星期（on Monday），at用于时刻（at 7:00）和at noon/at night。{answer}",
  "地点方位介词": "本题考查地点介词：in在里面、on在上面、under在下面、behind在后面、beside在旁边、between在两者之间。{answer}",
  "并列连词and/but/or": "本题考查并列连词：and表并列（和）、but表转折（但是）、or表选择（或者）。{answer}",
  "because与so": "本题考查因果连词：because（因为）引出原因，so（所以）引出结果；中文「因为…所以…」成对，但英文中because和so不能同时用。{answer}",
  "there be句型": "本题考查there be句型：表示「某地有某物」，be动词看后面的名词——单数/不可数用is，复数用are（就近原则）。{answer}",
  "be动词am/is/are": "本题考查be动词：I用am，you/复数用are，he/she/it/单数用is。{answer}",
  "动词第三人称单数": "本题考查动词三单：主语是he/she/it或单数名词时，一般现在时的动词要加s/es，如goes、watches、studies。{answer}",
  "do/does助动词": "本题考查助动词do/does：主语三单用does，其他人称用do；否定句和疑问句中要用助动词，后面的动词恢复原形。{answer}",
  "情态动词": "本题考查情态动词：can（能）、must（必须）、should（应该）后面必须跟动词原形，没有人称和数的变化。{answer}",
  "一般现在时": "本题考查一般现在时：表示经常性、习惯性的动作，常与every day、usually、always等词连用；注意动词三单形式。{answer}",
  "现在进行时": "本题考查现在进行时：表示正在进行的动作，结构是be+动词ing，常见标志词有now、Look!、Listen!。{answer}",
  "动词ing形式": "本题考查动词ing形式：一般直接加ing（play→playing）；以不发音e结尾去e加ing（make→making）；重读闭音节双写末尾字母加ing（run→running）。{answer}",
  "一般过去时": "本题考查一般过去时：表示过去发生的动作，常与yesterday、last week、…ago连用；动词变过去式（规则加ed，不规则要记，如go→went）。{answer}",
  "一般将来时": "本题考查一般将来时：表示将来的动作，用will+动词原形或be going to+动词原形，常与tomorrow、next week连用。{answer}",
  "特殊疑问句": "本题考查特殊疑问句：以what（什么）、where（哪里）、when（何时）、who（谁）、how（怎样）等疑问词开头，不能用yes/no回答。{answer}",
  "一般疑问句": "本题考查一般疑问句：以Do/Does/Is/Are/Can等开头，用Yes或No回答。{answer}",
  "祈使句": "本题考查祈使句：表示请求或命令，动词原形开头；否定形式是Don't+动词原形，如Don't run!。{answer}",
  "感叹句": "本题考查感叹句：What+a/an+形容词+名词（What a big apple!）或How+形容词/副词（How beautiful!）。{answer}",
  "问句与句型综合": "本题考查句型结构：注意疑问句的语序和句式特点。{answer}",
  "加减运算": "本题考查加减运算：认真计算，注意进位和退位。{answer}",
  "乘除运算": "本题考查乘除运算：先算乘除后算加减，注意口诀和竖式。{answer}",
  "余数问题": "本题考查余数：被除数=除数×商+余数，余数必须比除数小。{answer}",
  "分数与小数": "本题考查分数与小数：注意分数的意义、小数点位置和单位换算。{answer}",
  "几何图形": "本题考查几何知识：记住周长、面积公式，看清图形特征。{answer}",
  "应用题综合": "本题考查应用题：先理清数量关系，再列式计算，最后检查单位。{answer}",
  "拼音与字词": "本题考查拼音字词：注意声母韵母、声调位置和易错字。{answer}",
  "词语辨析": "本题考查词语运用：结合语境选择恰当的词语，注意近义词的区别。{answer}",
  "修辞手法": "本题考查修辞手法：比喻要有本体喻体，拟人是把物当人写。{answer}",
  "古诗默写": "本题考查古诗积累：注意生字写法和标点，不要写错别字。{answer}"
};

/* 按考点自动生成解析（原卷没有解析时的兜底） */
function baGenWhy(kpName, opts, ans, qType){
  var tpl = BA_WHY_TPL[kpName];
  if (!tpl) return "";
  var answerText = "";
  if (qType === "single" && opts && typeof ans === "number" && opts[ans] !== undefined){
    answerText = "正确答案：" + String.fromCharCode(65 + ans) + ". " + opts[ans] + "。";
  } else if (qType === "multi" && Array.isArray(ans)){
    answerText = "正确答案：" + ans.map(function(i){ return String.fromCharCode(65 + i); }).join("") + "。";
  } else if (qType === "judge" && opts && opts[ans] !== undefined){
    answerText = "正确答案：" + opts[ans] + "。";
  }
  return tpl.replace("{answer}", answerText);
}

/* ==================== 末尾答案表提取 ====================
 * 支持「参考答案 1-5 BCADA 6-10 CBDAB」和「1.B 2、C」两种格式
 */
function baExtractAnswerKey(text){
  var lines = text.split("\n");
  var startIdx = -1;
  for (var i = 0; i < lines.length; i++){
    if (/^\s*(参考答案|答案\s*[:：]?\s*$|keys?\b\s*[:：]?|answer\s*key)/i.test(lines[i])) startIdx = i;
  }
  if (startIdx < 0) return {};
  var keyText = lines.slice(startIdx).join("\n");
  var map = {};
  var mm;
  var reRange = /(\d{1,3})\s*[-~—－至]\s*(\d{1,3})\s*[:：]?\s*([A-Da-d]{1,50})/g;
  while ((mm = reRange.exec(keyText)) !== null){
    var s = parseInt(mm[1], 10), e = parseInt(mm[2], 10), letters = mm[3];
    if (e >= s && (e - s + 1) === letters.length && (e - s) < 50){
      for (var j = 0; j < letters.length; j++){
        if (!map[s + j]) map[s + j] = letters[j].toUpperCase();
      }
    }
  }
  var reSingle = /(\d{1,3})\s*[\.、．:：]\s*([A-Da-d])\b/g;
  while ((mm = reSingle.exec(keyText)) !== null){
    var no = parseInt(mm[1], 10);
    if (!map[no]) map[no] = mm[2].toUpperCase();
  }
  return map;
}

/* 智能解析入口 */
function baSmartParse(text){
  var subjectGuess = baGuessSubject(text);
  var answerKey = baExtractAnswerKey(text);
  var questions = [];
  var bigBlocks = baSplitBigBlocks(text);

  bigBlocks.forEach(function(block){
    var sectionType = baGuessSectionType(block.title);
    var qBlocks = baSplitSmallQuestions(block.text);
    qBlocks.forEach(function(qb){
      var q = baParseOneQuestion(qb.lines, subjectGuess.subject, answerKey, qb.no, sectionType);
      if (q) questions.push(q);
    });
  });

  if (questions.length === 0){
    questions = baParseText(text, answerKey);
  }
  return {
    questions: questions, subject: subjectGuess.subject, subjectReason: subjectGuess.reason,
    hasAnswerKey: Object.keys(answerKey).length > 0
  };
}

/* ---------- 解析与预览 ---------- */
function baParseAndPreview(){
  var text = document.getElementById("baPasteText").value.trim();
  if (!text){ baToast("请先粘贴题目文本或上传文件"); return; }

  var questions = [];
  var parsedSubject = null;
  var parsedReason = "";
  var isJson = false;

  try {
    var json = JSON.parse(text);
    if (Array.isArray(json)){
      isJson = true;
      questions = json.map(function(item){
        return {
          q: item.q, o: item.o, a: item.a, why: item.why || "",
          kp: item.kp || [], qType: item.qType || "single"
        };
      });
    }
  } catch(e){
    var result = baSmartParse(text);
    questions = result.questions;
    parsedSubject = result.subject;
    parsedReason = result.subjectReason;
  }

  if (questions.length === 0){
    baToast("未解析到题目，请检查格式");
    return;
  }
  /* 每题默认「采纳」，解析错的可单独取消，不会被导入 */
  questions.forEach(function(q){ if (q._pick === undefined) q._pick = true; });

  var preview = document.getElementById("baPreview");
  var html = '<div class="ba-preview-head">✅ 解析到 ' + questions.length + ' 道题';
  if (parsedSubject){
    var subjName = BA_SUBJECTS.find(function(s){ return s.id === parsedSubject; });
    html += ' · 猜测科目：' + (subjName ? subjName.emoji + " " + subjName.name : parsedSubject) + '（' + parsedReason + '）';
    var userSubject = document.getElementById("baSubject").value;
    if (userSubject !== parsedSubject){
      html += ' <button class="ba-auto-subject-btn" type="button" onclick="baApplySubject(\'' + parsedSubject + '\')">应用此科目</button>';
    }
  }
  if (isJson) html += ' · JSON格式';
  html += '</div>';

  var typeCounts = {};
  questions.forEach(function(q){ typeCounts[q.qType || "single"] = (typeCounts[q.qType || "single"] || 0) + 1; });
  if (!isJson && Object.keys(typeCounts).length > 0){
    html += '<div class="ba-type-summary">';
    Object.keys(typeCounts).forEach(function(t){
      html += '<span class="ba-type-chip">' + (BA_QTYPE_LABELS[t] || t) + ' ×' + typeCounts[t] + '</span>';
    });
    html += '</div>';
  }

  /* 考点分布：每个标签都可点击，点了直接跳到对应题目（含「未识别」） */
  html += baKpSummaryHtml(questions);
  html += '<div class="ba-kp-nav" id="baKpNav" style="display:none"></div>';

  var def = baGetImportDefaults();
  var defValidMods = (BA_MODULES[def.subject] || []).map(function(m){ return m.id; });

  /* 采纳控制条：解析错的题直接取消勾选，就不会被导入 */
  html += '<div class="ba-pick-bar">' +
    '<span class="ba-pick-count">☑️ 已采纳 <b id="baPickCount">' + questions.length + '</b> / ' + questions.length +
      ' 道　<span class="ba-pick-tip">解析错的题，取消该题上的「采纳」就不会导入</span></span>' +
    '<button type="button" class="ba-pick-btn" onclick="baPickAll(true)">全选</button>' +
    '<button type="button" class="ba-pick-btn" onclick="baPickAll(false)">全不选</button>' +
    '<button type="button" class="ba-pick-btn" onclick="baPickInvert()">反选</button>' +
  '</div>';

  html += '<div class="ba-preview-list">';
  questions.forEach(function(q, i){
    var qType = q.qType || "single";
    var typeLabel = BA_QTYPE_LABELS[qType] || qType;
    var ansBadge = q.ansSource ? '<span class="ba-ans-badge src-' + q.ansSource + '">' + q.ansSource + '</span>' : '';
    var whyAutoBadge = q.whyAuto ? '<span class="ba-why-auto">⚡自动解析</span>' : '';
    var kpHtml = "";
    if (q.kp && q.kp.length){
      kpHtml = '<div class="ba-preview-kp">🎯 考点：' + baEsc(q.kp[0]) + (q.kpConfidence ? '<span class="ba-kp-src">' + baEsc(q.kpConfidence) + '</span>' : '') + '</div>';
    }
    var kpSelect = '<div class="ba-kp-edit"><label>手动归类：</label><select class="ba-kp-select" onchange="baSetKp(' + i + ', this)">' + baKpSelectOptions(q.kp && q.kp[0] ? q.kp[0] : "") + '</select></div>';
    var tgt = baResolveTarget(q, def, defValidMods);
    var kpText = q.kpOverride ? ('<b>' + baEsc(q.kpOverride) + '</b>（手动）')
      : (q.kp && q.kp.length ? ('<b>' + baEsc(q.kp[0]) + '</b>（自动）') : '<i>未识别</i>');
    var assignHtml = '<div class="ba-preview-assign">📌 归入：' + kpText +
      ' → ' + baEsc(def.subject) + ' / ' + baEsc(tgt.module) +
      ' · 章节 <b>' + baEsc(baTopicLabel(tgt.module, tgt.topicId)) + '</b>（' + tgt.by + '）</div>';
    var ansEditor = baAnsEditorFor(q, i);
    var whyEditor = '<div class="ba-why-edit"><label>解析：</label><textarea class="ba-why-input" rows="2" placeholder="粘贴或录入解析（可留空）" onchange="baSetWhy(' + i + ', this.value)">' + baEsc(q.why || "") + '</textarea></div>';
    html += '<div class="ba-preview-item' + (q._pick === false ? ' ba-item-skip' : '') + '" id="ba-item-' + i + '">' +
      '<div class="ba-item-top">' +
        '<span class="ba-qtype-tag">' + typeLabel + '</span>' +
        '<label class="ba-item-pick"><input type="checkbox"' + (q._pick === false ? '' : ' checked') +
          ' onchange="baSetPick(' + i + ', this.checked)"> 采纳这道题</label>' +
      '</div>' +
      '<div class="ba-preview-q">' + (i + 1) + '. ' + q.q + '</div>' +
      '<div class="ba-preview-opts">' + baRenderOptsHtml(q) + '</div>' +
      '<div class="ba-preview-badges">' + ansBadge + whyAutoBadge + '</div>' +
      ansEditor +
      whyEditor +
      kpHtml +
      assignHtml +
      kpSelect +
    '</div>';
  });
  html += '</div>';
  html += '<button class="ba-import-btn" type="button" onclick="baDoImport()">📥 确认导入题库</button>';
  preview.innerHTML = html;
  preview._questions = questions;
  BA_KP_FOCUS = { key: null, idxs: [], pos: -1 };
}

/* ---------- 考点分布条 + 点击定位 ----------
 * 考点标签（含「❓ 未识别」）都可点击：点了直接跳到那一类题目，
 * 高亮所有同类题，并提供 上一处 / 下一处 逐题跳转，方便快速补考点。
 */
var BA_KP_FOCUS = { key: null, idxs: [], pos: -1 };
var BA_KP_UNKNOWN = "__unknown__";

/* 题目归入哪个考点名（手动归类优先） */
function baKpNameOf(q){
  if (!q) return "";
  if (q.kpOverride) return q.kpOverride;
  return (q.kp && q.kp.length) ? q.kp[0] : "";
}

function baKpMatch(q, key){
  if (key === BA_KP_UNKNOWN) return baKpNameOf(q) === "";
  return baKpNameOf(q) === key;
}

function baKpSummaryHtml(questions){
  if (!questions || !questions.length) return '<div id="baKpSummaryBox"></div>';
  var kpCounts = {};
  var kpUnknown = 0;
  questions.forEach(function(q){
    var name = baKpNameOf(q);
    if (name) kpCounts[name] = (kpCounts[name] || 0) + 1;
    else kpUnknown++;
  });
  var kpKeys = Object.keys(kpCounts).sort(function(a, b){ return kpCounts[b] - kpCounts[a]; });
  if (kpKeys.length === 0 && kpUnknown === 0) return '<div id="baKpSummaryBox"></div>';

  var html = '<div id="baKpSummaryBox">';
  html += '<div class="ba-kp-summary"><b>🎯 考点分布：</b>';
  kpKeys.forEach(function(k){
    html += '<span class="ba-kp-chip" title="点击定位到这类题" onclick="baLocateKp(\'' +
      String(k).replace(/'/g, "\\'") + '\')">' + baEsc(k) + ' ×' + kpCounts[k] + '</span>';
  });
  if (kpUnknown > 0){
    html += '<span class="ba-kp-chip unknown" title="点击定位到未识别的题目" onclick="baLocateKp(\'' +
      BA_KP_UNKNOWN + '\')">❓ 未识别 ×' + kpUnknown + '</span>';
  }
  html += '</div>';
  if (kpUnknown > 0){
    html += '<div class="ba-kp-hint">💡 点上面的「❓ 未识别 ×' + kpUnknown +
      '」可逐题跳到未识别的题目，用该题下方的「手动归类」补考点；未指定专题章节时，未识别的题只归入所选模块。</div>';
  }
  html += '</div>';
  return html;
}

/* 重算考点分布（手动归类后数字要跟着变） */
function baRefreshKpSummary(){
  var preview = document.getElementById("baPreview");
  if (!preview || !preview._questions) return;
  var box = document.getElementById("baKpSummaryBox");
  if (!box) return;
  box.outerHTML = baKpSummaryHtml(preview._questions);
}

/* 点击考点标签：定位到这一类题目 */
function baLocateKp(key){
  var preview = document.getElementById("baPreview");
  if (!preview || !preview._questions) return;
  var qs = preview._questions;
  var idxs = [];
  for (var i = 0; i < qs.length; i++){
    if (baKpMatch(qs[i], key)) idxs.push(i);
  }
  if (idxs.length === 0){ baToast("这一类当前没有题目"); return; }
  baKpFocusClear();
  BA_KP_FOCUS = { key: key, idxs: idxs, pos: -1 };
  for (var j = 0; j < idxs.length; j++){
    var el = document.getElementById("ba-item-" + idxs[j]);
    if (el) el.classList.add("ba-item-focus");
  }
  var nav = document.getElementById("baKpNav");
  if (nav) nav.style.display = "";
  baKpFocusStep(1);
}

/* 上一处 / 下一处 */
function baKpFocusStep(step){
  var f = BA_KP_FOCUS;
  if (!f || !f.idxs.length) return;
  var oldEl = f.pos >= 0 ? document.getElementById("ba-item-" + f.idxs[f.pos]) : null;
  if (oldEl){ oldEl.classList.remove("ba-item-focus-cur"); oldEl.classList.remove("ba-item-flash"); }
  if (step > 0) f.pos = (f.pos >= f.idxs.length - 1) ? 0 : f.pos + 1;
  else if (step < 0) f.pos = (f.pos <= 0) ? f.idxs.length - 1 : f.pos - 1;
  else if (f.pos < 0) f.pos = 0;   // step=0：停在当前位置，只重绘高亮

  var el = document.getElementById("ba-item-" + f.idxs[f.pos]);
  if (el){
    el.classList.add("ba-item-focus-cur");
    el.classList.remove("ba-item-flash");
    /* 重新触发闪烁动画 */
    void el.offsetWidth;
    el.classList.add("ba-item-flash");
    if (typeof el.scrollIntoView === "function"){
      try { el.scrollIntoView({ behavior: "smooth", block: "center" }); }
      catch(e){ try { el.scrollIntoView(); } catch(e2){} }
    }
    var kpSel = el.querySelector(".ba-kp-select");
    if (kpSel) kpSel.classList.add("ba-kp-select-hl");
  }
  var nav = document.getElementById("baKpNav");
  if (nav){
    var label = (f.key === BA_KP_UNKNOWN) ? "未识别考点" : f.key;
    nav.innerHTML = '<span class="ba-kp-nav-text">🔎 正在定位：<b>' + baEsc(label) +
      '</b>　第 ' + (f.pos + 1) + ' / ' + f.idxs.length + ' 道</span>' +
      '<button type="button" class="ba-kp-nav-btn" onclick="baKpFocusStep(-1)">← 上一处</button>' +
      '<button type="button" class="ba-kp-nav-btn" onclick="baKpFocusStep(1)">下一处 →</button>' +
      '<button type="button" class="ba-kp-nav-btn ghost" onclick="baKpFocusClear()">清除定位</button>';
  }
}

/* 清除高亮（keepNav=true 时保留导航条，供重算用） */
function baKpFocusClear(keepNav){
  var f = BA_KP_FOCUS;
  if (f && f.idxs.length){
    for (var i = 0; i < f.idxs.length; i++){
      var el = document.getElementById("ba-item-" + f.idxs[i]);
      if (!el) continue;
      el.classList.remove("ba-item-focus", "ba-item-focus-cur", "ba-item-flash");
      var s = el.querySelector(".ba-kp-select");
      if (s) s.classList.remove("ba-kp-select-hl");
    }
  }
  BA_KP_FOCUS = { key: null, idxs: [], pos: -1 };
  var nav = document.getElementById("baKpNav");
  if (nav && !keepNav){ nav.style.display = "none"; nav.innerHTML = ""; }
}

/* 手动归类后重算定位集合：已修好的题从「未识别」里移除 */
function baKpFocusRefresh(){
  var f = BA_KP_FOCUS;
  if (!f || !f.key) return;
  var preview = document.getElementById("baPreview");
  if (!preview || !preview._questions) return;
  var key = f.key, pos = f.pos;
  var idxs = [];
  preview._questions.forEach(function(q, i){ if (baKpMatch(q, key)) idxs.push(i); });
  baKpFocusClear(true);
  if (idxs.length === 0){
    baToast("这一类已全部处理完 ✅");
    var nav = document.getElementById("baKpNav");
    if (nav){ nav.style.display = "none"; nav.innerHTML = ""; }
    return;
  }
  BA_KP_FOCUS = { key: key, idxs: idxs, pos: -1 };
  idxs.forEach(function(i){
    var el = document.getElementById("ba-item-" + i);
    if (el) el.classList.add("ba-item-focus");
  });
  /* 尽量停在原来那道题附近 */
  var wantIdx = (pos >= 0 && pos < preview._questions.length) ? pos : idxs[0];
  var at = idxs.indexOf(wantIdx);
  BA_KP_FOCUS.pos = at >= 0 ? at : 0;
  baKpFocusStep(0);
}

/* ---------- 逐题「采纳」：解析错的题可以不导入 ---------- */
function baSetPick(i, checked){
  var q = baGetQ(i);
  if (!q) return;
  q._pick = !!checked;
  var item = document.getElementById("ba-item-" + i);
  if (item) item.classList.toggle("ba-item-skip", !checked);
  baUpdatePickCount();
}

function baPickAll(v){
  var preview = document.getElementById("baPreview");
  if (!preview || !preview._questions) return;
  preview._questions.forEach(function(q, i){
    q._pick = v;
    var item = document.getElementById("ba-item-" + i);
    if (item){
      item.classList.toggle("ba-item-skip", !v);
      var cb = item.querySelector(".ba-item-pick input");
      if (cb) cb.checked = v;
    }
  });
  baUpdatePickCount();
}

function baPickInvert(){
  var preview = document.getElementById("baPreview");
  if (!preview || !preview._questions) return;
  preview._questions.forEach(function(q, i){
    var v = (q._pick === false);
    q._pick = v;
    var item = document.getElementById("ba-item-" + i);
    if (item){
      item.classList.toggle("ba-item-skip", !v);
      var cb = item.querySelector(".ba-item-pick input");
      if (cb) cb.checked = v;
    }
  });
  baUpdatePickCount();
}

function baUpdatePickCount(){
  var preview = document.getElementById("baPreview");
  var el = document.getElementById("baPickCount");
  if (!preview || !preview._questions || !el) return;
  var n = 0;
  preview._questions.forEach(function(q){ if (q._pick !== false) n++; });
  el.textContent = n;
}

/* ---------- 导入后：告诉用户题去哪了 ---------- */
function baSubjectName(id){
  var s = BA_SUBJECTS.find(function(x){ return x.id === id; });
  return s ? (s.emoji + " " + s.name) : id;
}

function baModuleName(subject, module){
  var mods = BA_MODULES[subject] || [];
  var m = mods.find(function(x){ return x.id === module; });
  return m ? m.name : module;
}

/* 生成「去哪里能找到/练到」的中文路径 */
function baWhereToFind(subject, module, topicId){
  var sName = baSubjectName(subject);
  var mName = baModuleName(subject, module);
  if (topicId > 0){
    var chap = baTopicLabel(module, topicId);
    return sName + " → " + mName + " → 第" + topicId + "章 " + chap + "（在该章节点「专题真题训练」即可练到）";
  }
  return sName + " → " + mName;
}

/* 跳到浏览页，并自动筛到刚导入的科目/模块 */
function baGoBrowse(subject, module){
  BA_CURRENT_TAB = "browse";
  baRender();
  var s = document.getElementById("baBrowseSubject");
  if (s && subject) s.value = subject;
  baBrowseFillModules();
  var m = document.getElementById("baBrowseModule");
  if (m && module) m.value = module;
  var src = document.getElementById("baBrowseSource");
  if (src) src.value = "__imported__";
  baBrowseFilter();
  var mask = document.getElementById("baDialogMask");
  if (mask) mask.classList.add("open");
}

function baApplySubject(subject){
  var sel = document.getElementById("baSubject");
  if (sel){ sel.value = subject; baUpdateModules(); }
  baToast("已应用科目：" + subject);
}

/* ---------- 预览界面手工编辑：答案 + 解析 ---------- */
function baEsc(s){
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function baRenderOptsHtml(q){
  var qType = q.qType || "single";
  return q.o.map(function(opt, j){
    var letter = String.fromCharCode(65 + j);
    var isAns = (qType === "multi" ? (Array.isArray(q.a) && q.a.indexOf(j) >= 0) : j === q.a);
    return '<span class="ba-preview-opt' + (isAns ? " ans" : "") + '">' + letter + '. ' + opt + '</span>';
  }).join("");
}

function baGetQ(i){
  var preview = document.getElementById("baPreview");
  if (!preview._questions || !preview._questions[i]) return null;
  return preview._questions[i];
}

function baHasRealOpts(q){
  return q.o && q.o.length >= 2 && q.o[0] !== "（主观题，需人工评分）";
}

function baAnsEditorFor(q, i){
  var qType = q.qType || "single";
  var realOpts = baHasRealOpts(q);
  if (qType === "judge"){
    var curJ = q.a === 0 ? "对" : "错";
    return '<span class="ba-ans-edit"><label>答案：</label><select onchange="baSetAnsJudge(' + i + ', this.value)">' +
      '<option value="对"' + (curJ === "对" ? " selected" : "") + '>对 ✓</option>' +
      '<option value="错"' + (curJ === "错" ? " selected" : "") + '>错 ✗</option></select></span>';
  }
  if (qType === "multi" && realOpts){
    var curM = Array.isArray(q.a) ? q.a.map(function(x){ return String.fromCharCode(65 + x); }).join("") : "";
    return '<span class="ba-ans-edit"><label>答案：</label><input type="text" value="' + baEsc(curM) + '" placeholder="如：AB" onchange="baSetAnsMulti(' + i + ', this.value)"></span>';
  }
  if (realOpts && (qType === "single" || qType === "phonics" || qType === "listening" || qType === "dialogue" || qType === "complete")){
    var n = q.o.length;
    var cur = (typeof q.a === "number" && q.a >= 0 && q.a < n) ? String.fromCharCode(65 + q.a) : "";
    var options = "";
    for (var j = 0; j < n; j++){
      var letter = String.fromCharCode(65 + j);
      options += '<option value="' + letter + '"' + (letter === cur ? " selected" : "") + '>' + letter + '</option>';
    }
    return '<span class="ba-ans-edit"><label>答案：</label><select onchange="baSetAnsSingle(' + i + ', this.value)">' + options + '</select></span>';
  }
  return '<span class="ba-ans-edit wide"><label>标准答案：</label><input type="text" value="' + baEsc(q.ansText || "") + '" placeholder="系统未识别答案，可粘贴或录入（可留空）" onchange="baSetAnsText(' + i + ', this.value)"></span>';
}

function baUpdateItem(i, q){
  var item = document.getElementById("ba-item-" + i);
  if (!item) return;
  var optsEl = item.querySelector(".ba-preview-opts");
  var badgesEl = item.querySelector(".ba-preview-badges");
  if (optsEl) optsEl.innerHTML = baRenderOptsHtml(q);
  if (badgesEl){
    var ansBadge = q.ansSource ? '<span class="ba-ans-badge src-' + q.ansSource + '">' + q.ansSource + '</span>' : '';
    var whyAutoBadge = q.whyAuto ? '<span class="ba-why-auto">⚡自动解析</span>' : '';
    badgesEl.innerHTML = ansBadge + whyAutoBadge;
  }
}

function baSetAnsSingle(i, letter){
  var q = baGetQ(i); if (!q) return;
  q.a = letter.charCodeAt(0) - 65;
  q.ansSource = "手工录入";
  baUpdateItem(i, q);
}

function baSetAnsJudge(i, val){
  var q = baGetQ(i); if (!q) return;
  q.a = (val === "对") ? 0 : 1;
  q.ansSource = "手工录入";
  baUpdateItem(i, q);
}

function baSetAnsMulti(i, val){
  var q = baGetQ(i); if (!q) return;
  var letters = String(val || "").toUpperCase().replace(/[^A-D]/g, "").split("").filter(function(c, idx, arr){ return arr.indexOf(c) === idx; });
  q.a = letters.map(function(c){ return c.charCodeAt(0) - 65; });
  q.ansSource = "手工录入";
  baUpdateItem(i, q);
}

function baSetAnsText(i, val){
  var q = baGetQ(i); if (!q) return;
  q.ansText = val;
  if (val) q.ansSource = "手工录入";
  baUpdateItem(i, q);
}

function baSetWhy(i, val){
  var q = baGetQ(i); if (!q) return;
  q.why = val;
  q.whyAuto = false;
  baUpdateItem(i, q);
}

function baTopicLabel(module, topicId){
  if (topicId === 0 || !topicId) return "不指定";
  if (module === "grammar" || !module){
    var c = BA_CHAPTERS.find(function(x){ return x.id === topicId; });
    return c ? c.name.replace(/^[^\s]+\s/, "") : "第" + topicId + "章";
  }
  if (module === "vocab"){
    var u = BA_UNITS.find(function(x){ return x.id === topicId; });
    return u ? u.name.replace(/^[^\s]+\s/, "") : "第" + topicId + "单元";
  }
  return "第" + topicId + "章/单元";
}

function baKpSelectOptions(currentKp){
  var html = '<option value="">— 自动识别 —</option>';
  var seen = {};
  BA_KNOWLEDGE_MAP.forEach(function(k){
    if (seen[k.name]) return;
    seen[k.name] = true;
    var sel = (currentKp === k.name) ? " selected" : "";
    html += '<option value="' + k.name + '" data-module="' + k.module + '" data-topic="' + k.topicId + '"' + sel + '>' + k.name + '</option>';
  });
  return html;
}

function baSetKp(i, selEl){
  var preview = document.getElementById("baPreview");
  if (!preview._questions || !preview._questions[i]) return;
  var q = preview._questions[i];
  var val = selEl.value;
  if (val){
    q.kpOverride = val;
    var opt = selEl.options[selEl.selectedIndex];
    q.kpOverrideModule = opt.getAttribute("data-module");
    q.kpOverrideTopicId = parseInt(opt.getAttribute("data-topic"), 10);
  } else {
    q.kpOverride = null;
    q.kpOverrideModule = null;
    q.kpOverrideTopicId = null;
  }
  /* 归类改了：归入提示、考点分布数字、定位高亮都要跟着刷新 */
  baRefreshAssignLabels();
  baRefreshKpSummary();
  baKpFocusRefresh();
}

function baParseText(text, answerKey){
  var questions = [];
  var blocks = text.split(/\n\s*\n/);
  var qNo = 0;
  blocks.forEach(function(block){
    block = block.trim();
    if (!block) return;
    var lines = block.split("\n").map(function(l){ return l.trim(); }).filter(function(l){ return l; });
    if (lines.length < 2) return;
    qNo++;

    var qLine = lines[0].replace(/^\d+[\.\、]\s*/, "");
    var optLine = lines.find(function(l){ return /[A-D][\.\、]/.test(l); });
    if (!optLine) return;

    var opts_arr = [];
    var optRegex = /([A-D])[\.\、]\s*([^\n]*?)(?=\s+[A-D][\.\、]|$)/g;
    var m;
    while ((m = optRegex.exec(optLine)) !== null){
      opts_arr.push(m[2].trim());
    }
    if (opts_arr.length < 2){
      opts_arr = [];
      lines.forEach(function(l){
        var mm = l.match(/^[A-D][\.\、]\s*(.*)$/);
        if (mm) opts_arr.push(mm[1].trim());
      });
    }
    if (opts_arr.length < 2) return;

    var ansLine = lines.find(function(l){ return /答案|answer/i.test(l); });
    var ans = 0;
    var ansSource = "未找到";
    if (ansLine){
      var am = ansLine.match(/[答案：:\s]*([A-Da-d])/);
      if (am){ ans = am[1].toUpperCase().charCodeAt(0) - 65; ansSource = "原卷行内"; }
    }
    if (ansSource === "未找到" && answerKey && answerKey[qNo]){
      ans = answerKey[qNo].charCodeAt(0) - 65;
      if (ans < 0 || ans >= opts_arr.length) ans = 0;
      ansSource = "答案表";
    }

    var whyLine = lines.find(function(l){ return /解析|解释|why/i.test(l); });
    var why = whyLine ? whyLine.replace(/^.*[解析|解释|why][:：\s]*/, "").trim() : "";
    var whyAuto = false;

    var q = { q: qLine, o: opts_arr, a: ans, why: why, kp: [], qType: "single", ansSource: ansSource };
    var kn = baDetectKnowledge(why, qLine, opts_arr);
    if (kn){
      q.kp = [kn.name]; q.kpTopicId = kn.topicId; q.kpModule = kn.module; q.kpConfidence = kn.src;
      if (!why){
        q.why = baGenWhy(kn.name, opts_arr, ans, "single");
        if (q.why) q.whyAuto = true;
      }
    }
    questions.push(q);
  });
  return questions;
}

/* ---------- 导入到题库 ---------- */
function baDoImport(){
  var preview = document.getElementById("baPreview");
  if (!preview._questions || preview._questions.length === 0){
    baToast("没有可导入的题目");
    return;
  }
  var all = preview._questions;
  var questions = all.filter(function(q){ return q._pick !== false; });
  var skipped = all.length - questions.length;
  if (questions.length === 0){
    baToast("没有勾选要导入的题目：请至少勾一道「采纳」，或点「全选」");
    return;
  }
  var def = baGetImportDefaults();
  var subject = def.subject;
  var source = document.getElementById("baSource").value;
  var sourceDetail = document.getElementById("baSourceDetail").value;
  var year = parseInt(document.getElementById("baYear").value) || 0;
  var region = document.getElementById("baRegion").value;
  var difficulty = parseInt(document.getElementById("baDifficulty").value) || 3;

  /* 注意：这里只导入勾选「采纳」的题，不要再用 preview._questions 覆盖 questions */
  var maxId = 0;
  if (typeof QB_DATA !== "undefined"){
    QB_DATA.questions.forEach(function(q){
      var n = parseInt((q.id || "").replace("qb", ""), 10);
      if (n > maxId) maxId = n;
    });
  }

  var validMods = (BA_MODULES[subject] || []).map(function(m){ return m.id; });
  var nManual = 0, nSpec = 0, nAuto = 0, nWhy = 0;
  var dist = {};
  var stamp = new Date().toISOString();

  questions.forEach(function(q){
    maxId++;
    var tgt = baResolveTarget(q, def, validMods);
    if (tgt.by === "手动归类"){ nManual++; q.kp = [q.kpOverride]; }
    else if (tgt.by === "指定章节"){ nSpec++; }
    else if (tgt.by === "自动考点"){ nAuto++; }
    if (q.why && String(q.why).trim()) nWhy++;

    var newQ = {
      id: "qb" + String(maxId).padStart(5, "0"),
      subject: subject, module: tgt.module, topicId: tgt.topicId,
      kp: q.kp || [], q: q.q, o: q.o, a: q.a, why: q.why || "",
      ansText: q.ansText || "",
      source: source, sourceDetail: sourceDetail,
      difficulty: difficulty, year: year, region: region,
      imported: true, importedAt: stamp
    };
    if (typeof QB_DATA !== "undefined") QB_DATA.questions.push(newQ);

    var dkey = tgt.module + "||" + tgt.topicId;
    dist[dkey] = (dist[dkey] || 0) + 1;
  });

  baPersistImported();

  /* 汇总去向：明确写出「去哪里能找到」，并给一键查看按钮 */
  var distHtml = "";
  var firstMod = "";
  Object.keys(dist).forEach(function(k){
    var parts = k.split("||");
    var mod = parts[0];
    var tid = parseInt(parts[1], 10) || 0;
    if (!firstMod) firstMod = mod;
    distHtml += '<div class="ba-import-dist-row">📍 ' + baEsc(baWhereToFind(subject, mod, tid)) +
      '：<b>' + dist[k] + ' 道</b></div>';
  });

  baToast("成功导入 " + questions.length + " 道题" +
    (skipped > 0 ? "（跳过 " + skipped + " 道未采纳的）" : "") +
    (nSpec > 0 ? "，其中 " + nSpec + " 道归入指定章节" : "") + "！");
  var successHtml = '<div class="ba-preview-success">✅ 已导入 ' + questions.length + ' 道题' +
    (skipped > 0 ? '，跳过 ' + skipped + ' 道（你取消采纳的）' : '') + '！' +
    (nWhy > 0 ? '<br>📖 其中 ' + nWhy + ' 道带解析，已随题一并保存' : '') +
    (nSpec > 0 ? '<br>📌 ' + nSpec + ' 道按你指定的「专题章节」归入' : '') +
    (nAuto > 0 ? '<br>🎯 ' + nAuto + ' 道按自动识别考点归入' : '') +
    (nManual > 0 ? '<br>✍️ ' + nManual + ' 道按单题「手动归类」归入' : '') +
    (distHtml ? '<div class="ba-import-dist"><div class="ba-import-dist-title">题都放这儿了：</div>' + distHtml + '</div>' : '') +
    '<div class="ba-import-actions">' +
      '<button type="button" class="ba-pick-btn primary" onclick="baGoBrowse(\'' + baEsc(subject) + '\', \'' + baEsc(firstMod) + '\')">🔍 立刻查看这批题</button>' +
      '<button type="button" class="ba-pick-btn" onclick="baParseAndPreview()">↩️ 继续导入下一批</button>' +
    '</div>' +
    '</div>';

  /* 顺序很关键：先 baRender() 刷新面板（它会清空预览区），再把成功回执写回预览区。
   * 以前是先写回执再 baRender()，回执立刻被冲掉，所以用户完全不知道题去哪了。 */
  baRender();
  var pv = document.getElementById("baPreview");
  if (pv){
    pv.innerHTML = successHtml;
    if (typeof pv.scrollIntoView === "function"){
      try { pv.scrollIntoView({ behavior: "smooth", block: "start" }); } catch(e){}
    }
  }
}

/* ---------- 导入题目的持久化（刷新后不丢） ---------- */
function baPersistImported(){
  try {
    if (typeof QB_DATA === "undefined") return;
    var list = QB_DATA.questions.filter(function(q){ return q.imported === true; });
    localStorage.setItem("ba_imported_questions", JSON.stringify(list));
  } catch(e){}
}

function baRestoreImported(){
  if (typeof QB_DATA === "undefined" || !QB_DATA.questions) return 0;
  var raw = null;
  try { raw = localStorage.getItem("ba_imported_questions"); } catch(e){ return 0; }
  if (!raw) return 0;
  var list;
  try { list = JSON.parse(raw); } catch(e){ return 0; }
  if (!Array.isArray(list)) return 0;
  var seen = {};
  QB_DATA.questions.forEach(function(q){ if (q && q.id) seen[q.id] = true; });
  var n = 0;
  list.forEach(function(q){
    if (!q || !q.id || seen[q.id]) return;
    q.imported = true;
    QB_DATA.questions.push(q);
    seen[q.id] = true;
    n++;
  });
  return n;
}

/* ---------- 统计面板 ---------- */
function baGetStats(){
  if (typeof QB_DATA === "undefined") return { total: 0, bySubject: {}, bySource: {} };
  var bySubject = {}, bySource = {}, byModule = {};
  QB_DATA.questions.forEach(function(q){
    bySubject[q.subject || "english"] = (bySubject[q.subject || "english"] || 0) + 1;
    bySource[q.source] = (bySource[q.source] || 0) + 1;
    var key = (q.subject || "english") + "/" + (q.module || "");
    byModule[key] = (byModule[key] || 0) + 1;
  });
  return { total: QB_DATA.questions.length, bySubject: bySubject, bySource: bySource, byModule: byModule };
}

function baRenderStats(stats){
  var html = '<div class="ba-stats-total">题库总计：<b>' + stats.total + '</b> 道题</div>';
  html += '<div class="ba-stats-section"><h4>按科目</h4>';
  BA_SUBJECTS.forEach(function(s){
    var count = stats.bySubject[s.id] || 0;
    html += '<div class="ba-stats-row"><span>' + s.emoji + ' ' + s.name + '</span><b>' + count + '</b></div>';
  });
  html += '</div>';
  html += '<div class="ba-stats-section"><h4>按来源</h4>';
  html += '<div class="ba-stats-row"><span>📝 真题</span><b>' + (stats.bySource["真题"] || 0) + '</b></div>';
  html += '<div class="ba-stats-row"><span>✏️ 自编</span><b>' + (stats.bySource["自编"] || 0) + '</b></div>';
  html += '</div>';
  html += '<div class="ba-stats-section"><h4>按模块</h4>';
  Object.keys(stats.byModule).sort().forEach(function(key){
    html += '<div class="ba-stats-row"><span>' + key + '</span><b>' + stats.byModule[key] + '</b></div>';
  });
  html += '</div>';
  return html;
}

/* ---------- 浏览面板 ---------- */
function baRenderBrowse(){
  if (typeof QB_DATA === "undefined") return '<div class="ba-empty">题库未加载</div>';
  var html = '<div class="ba-browse-filter">' +
    '<select id="baBrowseSubject" onchange="baBrowseFilter()">' +
      BA_SUBJECTS.map(function(s){ return '<option value="' + s.id + '">' + s.emoji + ' ' + s.name + '</option>'; }).join("") +
    '</select>' +
    '<select id="baBrowseSource" onchange="baBrowseFilter()">' +
      '<option value="">全部来源</option><option value="真题">真题</option><option value="自编">自编</option>' +
      '<option value="__imported__">📥 我导入的题</option>' +
    '</select>' +
    '<select id="baBrowseModule" onchange="baBrowseFilter()"></select>' +
  '</div>' +
  '<div class="ba-browse-count" id="baBrowseCount"></div>';
  html += '<div class="ba-browse-list" id="baBrowseList"></div>';
  return html;
}

function baBrowseFillModules(){
  var subjEl = document.getElementById("baBrowseSubject");
  var modEl = document.getElementById("baBrowseModule");
  if (!subjEl || !modEl) return;
  var prev = modEl.value;                       // 重建后保留已选的模块
  var mods = BA_MODULES[subjEl.value] || [];
  var opts = '<option value="">全部模块</option>';
  mods.forEach(function(m){ opts += '<option value="' + m.id + '">' + m.name + '</option>'; });
  modEl.innerHTML = opts;
  if (prev){
    for (var i = 0; i < modEl.options.length; i++){
      if (modEl.options[i].value === prev){ modEl.value = prev; break; }
    }
  }
}

function baBrowseFilter(){
  if (typeof QB_DATA === "undefined") return;
  var subjectEl = document.getElementById("baBrowseSubject");
  if (!subjectEl) return;
  baBrowseFillModules();
  var subject = subjectEl.value;
  var source = document.getElementById("baBrowseSource").value;
  var modEl = document.getElementById("baBrowseModule");
  var module = modEl ? modEl.value : "";
  var list = QB_DATA.questions.filter(function(q){
    if (q.subject !== subject) return false;
    if (module && q.module !== module) return false;
    if (source === "__imported__"){ if (!q.imported) return false; }
    else if (source && q.source !== source) return false;
    return true;
  });
  var shown = list.slice(0, 100); // 最多显示100条
  var countEl = document.getElementById("baBrowseCount");
  if (countEl){
    countEl.innerHTML = '共 <b>' + list.length + '</b> 道' +
      (list.length > shown.length ? '（显示前 ' + shown.length + ' 道）' : '');
  }

  var html = "";
  shown.forEach(function(q, i){
    var optsHtml = (q.o || []).map(function(opt, j){
      var letter = String.fromCharCode(65 + j);
      return '<span class="ba-browse-opt' + (j === q.a ? " ans" : "") + '">' + letter + '. ' + opt + '</span>';
    }).join("");
    html += '<div class="ba-browse-item">' +
      '<div class="ba-browse-q">' + (i + 1) + '. ' + q.q + '</div>' +
      '<div class="ba-browse-opts">' + optsHtml + '</div>' +
      '<div class="ba-browse-meta">📌 ' + baEsc(q.module || "") + ' · ' + baEsc(baTopicLabel(q.module, q.topicId)) +
        (q.kp && q.kp.length ? ' · 🎯 ' + baEsc(q.kp[0]) : '') +
        ' · ' + baEsc(q.source || "") + (q.sourceDetail ? ' · ' + baEsc(q.sourceDetail) : '') +
        (q.region ? ' · ' + baEsc(q.region) : '') +
        (q.why ? ' · 📖 有解析' : '') +
        (q.imported ? ' · 导入' : '') +
      '</div>' +
    '</div>';
  });
  if (list.length === 0) html = '<div class="ba-empty">没有符合条件的题目</div>';
  document.getElementById("baBrowseList").innerHTML = html;
}

/* ---------- API配置面板 ---------- */
function baGetEngine(){
  var e = localStorage.getItem("ba_ocr_engine");
  return e === "baidu" ? "baidu" : "tesseract";
}

function baRenderAPI(){
  var apiKey = localStorage.getItem("ba_baidu_api_key") || "";
  var secretKey = localStorage.getItem("ba_baidu_secret_key") || "";
  var engine = baGetEngine();
  var baiduReady = apiKey && secretKey;
  return '<div class="ba-api-section">' +
    '<h4>OCR识别引擎</h4>' +
    '<div class="ba-api-status">' +
      (engine === "baidu" ?
        '<span class="ba-api-badge ok">🔍 当前引擎：百度OCR（高精度）</span>' :
        '<span class="ba-api-badge">🔍 当前引擎：免费离线OCR（Tesseract.js）</span>') +
    '</div>' +
    '<div class="ba-config-row">' +
      '<label>识别引擎</label>' +
      '<select id="baOcrEngine" onchange="baSwitchEngine(this.value)">' +
        '<option value="tesseract"' + (engine === "tesseract" ? " selected" : "") + '>🆓 免费离线OCR（Tesseract.js · 无需配置）</option>' +
        '<option value="baidu"' + (engine === "baidu" ? " selected" : "") + '>⚡ 百度OCR（高精度 · 需配置Key）</option>' +
      '</select>' +
    '</div>' +
    '<p class="ba-api-desc">' +
      '<b>Tesseract.js</b>：免费、离线可用，首次识别需下载语言包（约2MB），之后浏览器缓存。<br>' +
      '<b>百度OCR</b>：精度更高，需联网。个人免费额度500次（总额，非每日），企业1000次/日。' +
      '前往 <a href="https://ai.baidu.com/tech/ocr" target="_blank">百度AI开放平台</a> 注册创建应用获取Key。' +
    '</p>' +
    '<h4 style="margin-top:14px;">百度OCR Key配置</h4>' +
    '<div class="ba-config-row">' +
      '<label>API Key</label><input type="text" id="baApiKey" value="' + apiKey + '" placeholder="选百度引擎时必填">' +
    '</div>' +
    '<div class="ba-config-row">' +
      '<label>Secret Key</label><input type="text" id="baSecretKey" value="' + secretKey + '" placeholder="选百度引擎时必填">' +
    '</div>' +
    '<button class="ba-save-api" type="button" onclick="baSaveAPI()">💾 保存Key</button>' +
    (baiduReady ? '<span class="ba-api-badge ok" style="margin-left:8px;">Key已保存 ✓</span>' : '') +
    '<div class="ba-api-note">' +
      '<p>📌 说明：</p>' +
      '<ul>' +
        '<li>两个引擎随时下拉切换，Key填一次保存即可，无需反复填写或清除</li>' +
        '<li>Key保存在本机localStorage，不会上传到任何服务器</li>' +
        '<li>选百度引擎但Key未配置时会自动回退到免费OCR</li>' +
        '<li>两个引擎都支持中英文混合识别</li>' +
      '</ul>' +
    '</div>' +
  '</div>';
}

function baSwitchEngine(engine){
  if (engine === "baidu"){
    var apiKey = (localStorage.getItem("ba_baidu_api_key") || "").trim();
    var secretKey = (localStorage.getItem("ba_baidu_secret_key") || "").trim();
    if (!apiKey || !secretKey){
      localStorage.setItem("ba_ocr_engine", "tesseract");
      baToast("百度Key未配置，请先填写并保存Key，再切换百度引擎");
      baRender();
      return;
    }
  }
  localStorage.setItem("ba_ocr_engine", engine);
  baToast(engine === "baidu" ? "已切换为百度OCR（高精度）" : "已切换为免费离线OCR");
  baRender();
}

function baSaveAPI(){
  var apiKey = document.getElementById("baApiKey").value.trim();
  var secretKey = document.getElementById("baSecretKey").value.trim();
  localStorage.setItem("ba_baidu_api_key", apiKey);
  localStorage.setItem("ba_baidu_secret_key", secretKey);
  baToast(apiKey ? "Key已保存，可在上方切换为百度引擎" : "Key已清空");
  baRender();
}

function baSaveAPI(){
  var apiKey = document.getElementById("baApiKey").value.trim();
  var secretKey = document.getElementById("baSecretKey").value.trim();
  localStorage.setItem("ba_baidu_api_key", apiKey);
  localStorage.setItem("ba_baidu_secret_key", secretKey);
  baToast(apiKey ? "已切换为百度OCR（高精度模式）" : "已切换为免费离线OCR");
  baRender();
}


/* ---------- Toast ---------- */
function baToast(msg){
  var t = document.getElementById("baToast");
  if (!t){
    t = document.createElement("div");
    t.id = "baToast";
    t.className = "ba-toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(function(){ t.classList.remove("show"); }, 3000);
}

/* ---------- 初始化 ---------- */
/* 脚本加载即恢复本机已导入的题目（刷新不丢），再初始化下拉 */
try { baRestoreImported(); } catch(e){}

window.addEventListener("load", function(){

  baUpdateModules();
});