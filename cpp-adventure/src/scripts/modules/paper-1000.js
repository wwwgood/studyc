/* ---------------- 小学语法1000题 paper-1000.js ----------------
 * 「📚 1000题」入口：按章节（名词/冠词/代词…）列表，点击章节即进入
 * topic-exam 专题真题训练（自动判分、金币连击、错题本、星级进度）。
 * 题目来自 PAPER1000_DATA（english-paper-1000.js），已合并进 QB_DATA。
 * 进度保存在 S.topicExam.done["paper1000_<章节id>"]，金币在 S.topicExam.coins。
 */
function p1000Count(chapterId){
  if (typeof PAPER1000_DATA === "undefined") return 0;
  return PAPER1000_DATA.questions.filter(function(q){ return q.topicId === chapterId; }).length;
}

function p1000Stars(chapterId){
  if (typeof teState !== "function") return 0;
  var st = teState().done["paper1000_" + chapterId];
  return st || 0;
}

function p1000Open(){
  if (typeof PAPER1000_DATA === "undefined"){
    if (typeof baToast === "function") baToast("1000题数据未加载");
    return;
  }
  var dialog = document.getElementById("teDialog");
  var mask = document.getElementById("teDialogMask");
  if (!dialog || !mask) return;

  var rows = "";
  PAPER1000_DATA.chapters.forEach(function(ch, i){
    var n = p1000Count(ch.id);
    var stars = p1000Stars(ch.id);
    var starRow = "";
    for (var s = 1; s <= 3; s++) starRow += '<span class="' + (s <= stars ? "on" : "") + '">★</span>';
    rows += '<button class="p1000-row' + (n === 0 ? " empty" : "") + '" type="button"' +
      (n === 0 ? "" : ' onclick="topicExamOpen(\'paper1000\', ' + ch.id + ', \'1000题 · ' + ch.name + '\')"') + '>' +
      '<span class="p1000-idx">' + (i + 1) + '</span>' +
      '<span class="p1000-name">' + ch.name + '<i class="p1000-page">' + ch.page + '</i></span>' +
      '<span class="p1000-meta">' +
        (n > 0 ? '<span class="p1000-cnt">' + n + ' 题</span><span class="te-star-row">' + starRow + '</span>'
               : '<span class="p1000-todo">📝 转写中，敬请期待</span>') +
      '</span>' +
    '</button>';
  });

  var total = PAPER1000_DATA.questions.length;
  var coins = (typeof teState === "function") ? teState().coins : 0;
  dialog.innerHTML =
    '<div class="te-dlg-head"><span class="te-cap">📚 ' + PAPER1000_DATA.name + '</span>' +
      '<button class="te-close" type="button" onclick="teClose()">×</button></div>' +
    '<div class="te-dlg-body p1000-body">' +
      '<div class="p1000-intro">🏫 ' + PAPER1000_DATA.source + ' · 已收录 <b>' + total + '</b> 题' +
        ' · 🪙 ' + coins + '<br>' +
        '<span class="p1000-tip">每章 10 题随机练，答对拿金币连击，答错自动进错题本</span></div>' +
      '<div class="p1000-list">' + rows + '</div>' +
    '</div>';
  mask.classList.add("open");
  document.body.style.overflow = "hidden";
}
