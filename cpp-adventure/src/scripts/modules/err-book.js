/* ---------------- 错题本 err-book.js ----------------
 * 自动收集所有英语模块的错题，支持重做和清除。
 * 进度保存在 S.errBook = { items: [...] }。
 * 每条: { id, module, q, o, a, why, source, time, count }
 */

function ebState(){
  if (!S.errBook) S.errBook = { items: [] };
  if (!S.errBook.items) S.errBook.items = [];
  return S.errBook;
}

/* 全局接口：任何模块答错时调用 */
function errBookAdd(module, item){
  var st = ebState();
  var exist = null;
  for (var i = 0; i < st.items.length; i++){
    if (st.items[i].module === module && st.items[i].q === item.q){
      exist = st.items[i];
      break;
    }
  }
  if (exist){
    exist.count = (exist.count || 1) + 1;
    exist.time = Date.now();
  } else {
    st.items.push({
      id: "eb" + Date.now() + Math.floor(Math.random() * 1000),
      module: module,
      q: item.q,
      o: item.o,
      a: item.a,
      why: item.why,
      source: item.source || "",
      time: Date.now(),
      count: 1
    });
  }
  saveS();
}

function ebStats(){
  var st = ebState();
  var byModule = {};
  st.items.forEach(function(it){
    if (!byModule[it.module]) byModule[it.module] = 0;
    byModule[it.module]++;
  });
  return { total: st.items.length, byModule: byModule };
}

var EB_MODULE_NAMES = {
  grammar: "📖 语法闯关",
  vocab: "📚 词汇闯关",
  reading: "📄 阅读理解",
  writing: "✍️ 作文训练",
  exam: "📝 真题演练"
};

/* ---------- 渲染 ---------- */
function ebRender(){
  var st = ebState();
  var stats = ebStats();
  var txt = document.getElementById("ebTotalTxt");
  if (txt) txt.textContent = "共 " + stats.total + " 道错题";

  var wrap = document.getElementById("ebList");
  if (!wrap) return;

  if (stats.total === 0){
    wrap.innerHTML = '<div class="eb-empty"><div class="eb-empty-icon">🎉</div><p>还没有错题！继续加油！</p><p class="eb-empty-sub">做错的题会自动出现在这里，方便反复练习</p></div>';
    return;
  }

  var html = '<div class="eb-toolbar">' +
    '<button class="eb-practice-all" type="button" onclick="ebPracticeAll()">🔁 全部重做</button>' +
    '<button class="eb-clear" type="button" onclick="ebClearAll()">🗑️ 清空错题本</button>' +
  '</div>';

  var modules = ["grammar", "vocab", "reading", "writing", "exam"];
  modules.forEach(function(m){
    var items = st.items.filter(function(it){ return it.module === m; });
    if (items.length === 0) return;
    var name = EB_MODULE_NAMES[m] || m;
    html += '<div class="eb-group">';
    html += '<div class="eb-group-head"><span class="eb-group-name">' + name + '</span><span class="eb-group-count">' + items.length + ' 题</span></div>';
    items.forEach(function(it, idx){
      var qShort = it.q.length > 60 ? it.q.substring(0, 60) + "..." : it.q;
      var passage = it.q.indexOf("\n\n") >= 0 ? it.q.split("\n\n") : null;
      var qText = passage ? passage[passage.length - 1] : it.q;
      qShort = qText.length > 60 ? qText.substring(0, 60) + "..." : qText;
      html += '<div class="eb-item">' +
        '<div class="eb-item-q">' + (idx + 1) + ". " + qShort + '</div>' +
        '<div class="eb-item-meta">错 ' + it.count + ' 次' + (it.source ? ' · ' + it.source : '') + '</div>' +
        '<button class="eb-item-btn" type="button" onclick="ebPracticeOne(\'' + it.id + '\')">重做</button>' +
        '<button class="eb-item-del" type="button" onclick="ebRemove(\'' + it.id + '\')">✕</button>' +
      '</div>';
    });
    html += '</div>';
  });

  wrap.innerHTML = html;
}

/* ---------- 单题重做 ---------- */
var EB_SESSION = null;

function ebPracticeOne(id){
  var st = ebState();
  var it = null;
  for (var i = 0; i < st.items.length; i++){
    if (st.items[i].id === id){ it = st.items[i]; break; }
  }
  if (!it) return;
  EB_SESSION = { items: [it], idx: 0 };
  ebRenderQuiz();
  var mask = document.getElementById("ebDialogMask");
  if (mask) mask.classList.add("open");
  document.body.style.overflow = "hidden";
}

function ebPracticeAll(){
  var st = ebState();
  if (st.items.length === 0) return;
  EB_SESSION = { items: st.items.slice(), idx: 0 };
  ebRenderQuiz();
  var mask = document.getElementById("ebDialogMask");
  if (mask) mask.classList.add("open");
  document.body.style.overflow = "hidden";
}

function ebPracticeModule(module){
  var st = ebState();
  var items = st.items.filter(function(it){ return it.module === module; });
  if (items.length === 0) return;
  EB_SESSION = { items: items, idx: 0 };
  ebRenderQuiz();
  var mask = document.getElementById("ebDialogMask");
  if (mask) mask.classList.add("open");
  document.body.style.overflow = "hidden";
}

function ebRenderQuiz(){
  var it = EB_SESSION.items[EB_SESSION.idx];
  var passage = it.q.indexOf("\n\n") >= 0 ? it.q.split("\n\n") : null;
  var qText = passage ? passage[passage.length - 1] : it.q;
  var passageHtml = "";
  if (passage && passage.length > 1){
    for (var i = 0; i < passage.length - 1; i++){
      passageHtml += '<div class="eb-passage">' + passage[i].replace(/\n/g, "<br>") + '</div>';
    }
  }
  var opts = it.o.map(function(t, i){
    return '<button class="eb-opt" type="button" data-i="' + i + '" onclick="ebAnswer(this)">' + String.fromCharCode(65 + i) + ". " + t + '</button>';
  }).join("");
  var dialog = document.getElementById("ebDialog");
  if (!dialog) return;
  var mName = EB_MODULE_NAMES[it.module] || it.module;
  dialog.innerHTML =
    '<div class="eb-dlg-head">' +
      '<span class="eb-cap">❌ 错题重做 · ' + mName + ' · ' + (EB_SESSION.idx + 1) + '/' + EB_SESSION.items.length + '</span>' +
      '<button class="eb-close" type="button" onclick="ebClose()">×</button>' +
    '</div>' +
    '<div class="eb-dlg-body">' +
      passageHtml +
      '<div class="eb-question">' + qText + '</div>' +
      '<div class="eb-opts">' + opts + '</div>' +
      '<div class="eb-feedback" id="ebFeedback"></div>' +
    '</div>';
}

function ebAnswer(btn){
  var it = EB_SESSION.items[EB_SESSION.idx];
  var i = parseInt(btn.getAttribute("data-i"), 10);
  var opts = btn.parentNode.querySelectorAll(".eb-opt");
  for (var k = 0; k < opts.length; k++) opts[k].disabled = true;
  var fb = document.getElementById("ebFeedback");
  if (i === it.a){
    btn.classList.add("ok");
    fb.innerHTML = '<div class="eb-fb ok">✅ 正确！' + it.why + '</div>' +
      '<button class="eb-next-btn" type="button" onclick="ebNext()">下一题 →</button>';
  } else {
    btn.classList.add("no");
    opts[it.a].classList.add("ok");
    it.count = (it.count || 1) + 1;
    saveS();
    fb.innerHTML = '<div class="eb-fb no">❌ ' + it.why + '</div>' +
      '<button class="eb-next-btn" type="button" onclick="ebNext()">继续 →</button>';
  }
}

function ebNext(){
  EB_SESSION.idx++;
  if (EB_SESSION.idx < EB_SESSION.items.length){ ebRenderQuiz(); return; }
  var dialog = document.getElementById("ebDialog");
  if (!dialog) return;
  dialog.innerHTML =
    '<div class="eb-dlg-head result"><span class="eb-cap">🏁 重做完成</span>' +
      '<button class="eb-close" type="button" onclick="ebClose()">×</button></div>' +
    '<div class="eb-dlg-body eb-result">' +
      '<div class="eb-result-icon">💪</div>' +
      '<h3>错题重做完毕！</h3>' +
      '<p>坚持练习，错题会越来越少！</p>' +
      '<div class="eb-result-btns">' +
        '<button class="eb-go-btn" type="button" onclick="ebClose()">返回错题本</button>' +
      '</div>' +
    '</div>';
}

function ebClose(){
  var mask = document.getElementById("ebDialogMask");
  if (mask) mask.classList.remove("open");
  document.body.style.overflow = "";
  EB_SESSION = null;
  ebRender();
}

function ebRemove(id){
  var st = ebState();
  st.items = st.items.filter(function(it){ return it.id !== id; });
  saveS();
  ebRender();
}

function ebClearAll(){
  if (!confirm("确定清空所有错题吗？此操作不可撤销。")) return;
  var st = ebState();
  st.items = [];
  saveS();
  ebRender();
}

window.addEventListener("load", function(){ if (document.getElementById("ebList")) ebRender(); });