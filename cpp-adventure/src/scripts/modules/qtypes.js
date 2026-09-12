/* ---------------- 题型引擎 qtypes.js ----------------
 * 统一支持多题型：选择题 / 选词填空 / 填空(汉译英·词性转换·单句改错·改正填空) / 阅读理解 / 作文。
 * 供 专题真题(topic-exam)、真题演练(exam-quest)、错题本(err-book) 共用。
 *
 * 题目字段约定（旧数据无 type 时默认 choice，完全兼容）：
 *  - choice : { type:"choice", q, o:[选项], a:正确下标, why }
 *  - fill   : { type:"fill", q, ansText:"答案" 或 "答案1|答案2", why }
 *             （覆盖：词性转换填空/汉译英/单句改错/改正填空，答案忽略大小写与标点）
 *  - cloze  : { type:"cloze", q, words:[词库], blanks:["每空答案"...], why }
 *  - reading: { type:"reading", q, passage:"短文", questions:[{q,o?,a?,why?}...], why }
 *  - writing: { type:"writing", q, tips:[要点], sample:"范文", why }
 */
var QT_LABELS = {
  choice: "🔵 选择题",
  cloze: "🧩 选词填空",
  fill: "✏️ 填空（词性转换/汉译英/改错）",
  reading: "📄 阅读理解",
  writing: "✍️ 作文"
};
var QT_OPTIONS = [
  { v: "auto", label: "🪄 自动识别" },
  { v: "choice", label: "🔵 选择题" },
  { v: "cloze", label: "🧩 选词填空" },
  { v: "fill", label: "✏️ 填空/汉译英/改错" },
  { v: "reading", label: "📄 阅读理解" },
  { v: "writing", label: "✍️ 作文" }
];
function qtLabel(t){ return QT_LABELS[t] || QT_LABELS.choice; }
function qtTypeOf(q){ return (q && q.type) || "choice"; }

/* 归一化：小写、去首尾空格、折叠空格、去常见标点（判题宽松） */
function qtNorm(s){
  return String(s == null ? "" : s).trim().toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[，。、；：！？.,;:!?'"（）()「」“”‘’]/g, "");
}
/* 多答案解析：数组 / | / 、 / ； 分隔 */
function qtAnsList(a){
  if (a == null) return [];
  if (Array.isArray(a)) return a.map(function(x){ return String(x); });
  return String(a).split(/\s*[|/、；;]\s*/).filter(function(x){ return x; });
}

/* ================= 渲染 ================= */
function qtRender(q, prefix){
  var t = qtTypeOf(q);
  if (t === "cloze") return qtRenderCloze(q, prefix);
  if (t === "fill") return qtRenderFill(q, prefix);
  if (t === "reading") return qtRenderReading(q, prefix);
  if (t === "writing") return qtRenderWriting(q, prefix);
  return qtRenderChoice(q, prefix);
}
function qtRenderChoice(q, prefix){
  var opts = q.o || [];
  var html = '<div class="qt-opts" data-p="' + prefix + '">';
  opts.forEach(function(o, i){
    html += '<button class="qt-opt" type="button" style="display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box;text-align:left;margin:6px 0;padding:11px 14px;" data-p="' + prefix + '" data-i="' + i + '" onclick="qtPick(this)">' +
      '<span class="qt-opt-key">' + String.fromCharCode(65 + i) + '</span> <span class="qt-opt-text">' + o + '</span></button>';
  });
  html += '</div>';
  return html;
}
function qtRenderFill(q, prefix){
  return '<div class="qt-fill" data-p="' + prefix + '">' +
    '<input class="qt-input" type="text" data-p="' + prefix + '" placeholder="在此输入答案（可直接键盘输入）">' +
    (q.aRef ? '<div class="qt-hint">💡 ' + q.aRef + '</div>' : '') +
  '</div>';
}
function qtRenderCloze(q, prefix){
  var words = q.words || [];
  var blanks = q.blanks || [];
  var html = '<div class="qt-cloze" data-p="' + prefix + '">';
  html += '<div class="qt-blanks">';
  blanks.forEach(function(b, i){
    html += '<span class="qt-blank" data-p="' + prefix + '" data-i="' + i + '" onclick="qtBlankClick(this)">' +
      '<span class="qt-blank-num">' + (i + 1) + '</span>' +
      '<span class="qt-blank-val" data-p="' + prefix + '" data-i="' + i + '"></span></span>';
  });
  html += '</div>';
  if (words.length){
    html += '<div class="qt-words" data-p="' + prefix + '">';
    words.forEach(function(w, i){
      html += '<button class="qt-word" type="button" data-p="' + prefix + '" data-w="' + i + '" onclick="qtWordClick(this)">' + w + '</button>';
    });
    html += '</div><div class="qt-cloze-tip">点击上方单词填入空格；点空格可清空重选</div>';
  }
  html += '</div>';
  return html;
}
function qtRenderReading(q, prefix){
  var subs = q.questions || [];
  var html = '';
  if (q.passage){
    html += '<div class="qt-passage">' + String(q.passage).replace(/\n/g, "<br>") + '</div>';
  }
  html += '<div class="qt-subs" data-p="' + prefix + '">';
  subs.forEach(function(sq, si){
    html += '<div class="qt-sub"><div class="qt-sub-q">' + (si + 1) + '. ' + sq.q + '</div>';
    if (sq.o && sq.o.length){
      html += '<div class="qt-opts">';
      sq.o.forEach(function(o, oi){
        html += '<button class="qt-opt" type="button" style="display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box;text-align:left;margin:6px 0;padding:11px 14px;" data-p="' + prefix + '" data-s="' + si + '" data-i="' + oi + '" onclick="qtPick(this)">' +
          '<span class="qt-opt-key">' + String.fromCharCode(65 + oi) + '</span> <span class="qt-opt-text">' + o + '</span></button>';
      });
      html += '</div>';
    } else {
      html += '<input class="qt-input" type="text" data-p="' + prefix + '" data-s="' + si + '" placeholder="在此输入答案">';
    }
    html += '</div>';
  });
  html += '</div>';
  return html;
}
function qtRenderWriting(q, prefix){
  var html = '';
  if (q.tips && q.tips.length){
    html += '<div class="qt-tips"><b>✍️ 写作要点：</b><ul>' +
      q.tips.map(function(x){ return '<li>' + x + '</li>'; }).join("") + '</ul></div>';
  }
  html += '<textarea class="qt-write" rows="7" data-p="' + prefix + '" placeholder="在这里写你的作文（建议 40 词以上）…"></textarea>';
  html += '<div class="qt-self" data-p="' + prefix + '"><span>写完后给自己打个分：</span>' +
    ['1','2','3','4','5'].map(function(n){
      return '<button class="qt-star" type="button" data-p="' + prefix + '" data-v="' + n + '" onclick="qtStarPick(this)">⭐</button>';
    }).join("") +
    '<span class="qt-self-txt" data-p="' + prefix + '"></span></div>';
  return html;
}

/* 交互：选项选中 / 词库填词 / 空格清空 / 自评 */
function qtPick(btn){
  var p = btn.getAttribute("data-p");
  var s = btn.getAttribute("data-s");
  var sel = '.qt-opt[data-p="' + p + '"]' + (s ? '[data-s="' + s + '"]' : '');
  var list = document.querySelectorAll(sel);
  for (var i = 0; i < list.length; i++){
    list[i].classList.remove("picked");
    /* 内联样式兜底清空：防止旧缓存 CSS 缺少 .picked 规则时看不到反馈 */
    list[i].style.background = "";
    list[i].style.borderColor = "";
  }
  btn.classList.add("picked");
  /* 内联样式兜底：保证任何环境下选中项都有明显高亮 */
  btn.style.background = "#FEF3C7";
  btn.style.borderColor = "#F59E0B";
}
function qtWordClick(btn){
  var p = btn.getAttribute("data-p");
  var val = (btn.textContent || "").trim();
  var blanks = document.querySelectorAll('.qt-blank-val[data-p="' + p + '"]');
  for (var i = 0; i < blanks.length; i++){
    if (!blanks[i].textContent){
      blanks[i].textContent = val;
      blanks[i].classList.add("filled");
      btn.classList.add("used");
      return;
    }
  }
}
function qtBlankClick(el){
  var valEl = el.querySelector(".qt-blank-val");
  if (!valEl || !valEl.textContent) return;
  var w = valEl.textContent;
  valEl.textContent = "";
  valEl.classList.remove("filled");
  var p = valEl.getAttribute("data-p");
  var words = document.querySelectorAll('.qt-word[data-p="' + p + '"].used');
  for (var i = 0; i < words.length; i++){
    if ((words[i].textContent || "").trim() === w){
      words[i].classList.remove("used");
      break;
    }
  }
}
function qtStarPick(btn){
  var p = btn.getAttribute("data-p");
  var v = parseInt(btn.getAttribute("data-v"), 10);
  var stars = document.querySelectorAll('.qt-star[data-p="' + p + '"]');
  for (var i = 0; i < stars.length; i++){
    var sv = parseInt(stars[i].getAttribute("data-v"), 10);
    stars[i].classList.toggle("on", sv <= v);
  }
  var txt = document.querySelector('.qt-self-txt[data-p="' + p + '"]');
  if (txt) txt.textContent = "已自评 " + v + " 星";
}

/* ================= 读取输入 ================= */
function qtRead(q, prefix){
  var t = qtTypeOf(q);
  if (t === "choice"){
    var sel = document.querySelector('.qt-opt[data-p="' + prefix + '"].picked');
    return sel ? parseInt(sel.getAttribute("data-i"), 10) : -1;
  }
  if (t === "fill"){
    var inp = document.querySelector('.qt-input[data-p="' + prefix + '"]');
    return inp ? inp.value : "";
  }
  if (t === "cloze"){
    var blanks = document.querySelectorAll('.qt-blank-val[data-p="' + prefix + '"]');
    var arr = [];
    for (var i = 0; i < blanks.length; i++) arr.push(blanks[i].textContent);
    return arr;
  }
  if (t === "reading"){
    var subs = q.questions || [];
    var out = [];
    for (var s = 0; s < subs.length; s++){
      var sq = subs[s];
      if (sq.o && sq.o.length){
        var b = document.querySelector('.qt-opt[data-p="' + prefix + '"][data-s="' + s + '"].picked');
        out.push(b ? parseInt(b.getAttribute("data-i"), 10) : -1);
      } else {
        var inp = document.querySelector('.qt-input[data-p="' + prefix + '"][data-s="' + s + '"]');
        out.push(inp ? inp.value : "");
      }
    }
    return out;
  }
  if (t === "writing"){
    var ta = document.querySelector('.qt-write[data-p="' + prefix + '"]');
    return ta ? ta.value : "";
  }
  return null;
}

/* ================= 判题 ================= */
function qtGrade(q, input){
  var t = qtTypeOf(q);
  if (t === "choice"){
    var ok = (input === q.a);
    return { ok: ok, show: ok ? "" : "正确答案：" + String.fromCharCode(65 + q.a) };
  }
  if (t === "fill"){
    var raw = String(q.ansText != null ? q.ansText : q.a);
    var list = qtAnsList(raw);
    var ok = list.length > 0;
    if (ok){
      /* 多空题（答案以「；」分隔）：输入的每一空都要对上 */
      if (raw.indexOf("；") >= 0 || raw.indexOf(";") >= 0){
        var inputs = String(input == null ? "" : input).split(/s*[；;]s*/).filter(function(x){ return x; });
        ok = inputs.length === list.length && inputs.every(function(u, i){ return qtNorm(u) === qtNorm(list[i]); });
      } else {
        ok = list.some(function(ans){ return qtNorm(ans) === qtNorm(input); });
      }
    }
    return { ok: ok, show: ok ? "" : "参考答案：" + list.join(" / ") };
  }
  if (t === "cloze"){
    var blanks = q.blanks || [];
    var right = 0, parts = [];
    for (var i = 0; i < blanks.length; i++){
      var a = qtNorm(blanks[i]);
      var u = qtNorm(input[i]);
      var o = (a !== "" && a === u);
      if (o) right++;
      parts.push("第" + (i + 1) + "空" + (o ? " ✅" : " ❌" + (input[i] ? "（填了「" + input[i] + "」）" : "（未填）") + "，应为 " + blanks[i]));
    }
    return { ok: right === blanks.length, show: parts.join("　"), partial: right };
  }
  if (t === "reading"){
    var subs = q.questions || [];
    var right = 0, parts = [];
    for (var s = 0; s < subs.length; s++){
      var sq = subs[s];
      var o = false, ansTxt = "";
      if (sq.o && sq.o.length){
        ansTxt = String.fromCharCode(65 + sq.a);
        o = (input[s] === sq.a);
      } else {
        var al = qtAnsList(sq.ansText != null ? sq.ansText : sq.a);
        ansTxt = al.join(" / ");
        o = al.length > 0 && al.some(function(x){ return qtNorm(x) === qtNorm(input[s]); });
      }
      if (o) right++;
      parts.push("第" + (s + 1) + "题" + (o ? " ✅" : " ❌（应为 " + ansTxt + "）"));
    }
    return { ok: right === subs.length, show: parts.join("　"), partial: right };
  }
  if (t === "writing"){
    var len = String(input == null ? "" : input).trim().length;
    return { ok: len >= 20, show: "", len: len };
  }
  return { ok: false, show: "" };
}

/* 判题后高亮正确答案（补全未填的空格） */
function qtMarkRight(q, prefix){
  var t = qtTypeOf(q);
  /* 先清掉选项上的内联兜底样式，让 qt-right/qt-wrong 类颜色正常显示 */
  function qtClearInline(scope){
    var all = scope.querySelectorAll('.qt-opt[data-p="' + prefix + '"]');
    for (var i = 0; i < all.length; i++){
      all[i].style.background = "";
      all[i].style.borderColor = "";
    }
  }
  if (t === "choice"){
    qtClearInline(document);
    var b = document.querySelector('.qt-opt[data-p="' + prefix + '"][data-i="' + q.a + '"]');
    if (b) b.classList.add("qt-right");
  }
  if (t === "cloze"){
    var blanks = document.querySelectorAll('.qt-blank-val[data-p="' + prefix + '"]');
    (q.blanks || []).forEach(function(b, i){
      if (blanks[i] && !blanks[i].textContent) blanks[i].textContent = b;
    });
  }
  if (t === "reading"){
    qtClearInline(document);
    (q.questions || []).forEach(function(sq, s){
      if (sq.o && sq.o.length){
        var b = document.querySelector('.qt-opt[data-p="' + prefix + '"][data-s="' + s + '"][data-i="' + sq.a + '"]');
        if (b) b.classList.add("qt-right");
      }
    });
  }
}

/* 标准答案文本（展示/入库/错题本） */
function qtAnswerText(q){
  var t = qtTypeOf(q);
  if (t === "choice") return String.fromCharCode(65 + q.a) + (q.o && q.o[q.a] ? " " + q.o[q.a] : "");
  if (t === "fill") return qtAnsList(q.ansText != null ? q.ansText : q.a).join(" / ");
  if (t === "cloze") return (q.blanks || []).map(function(b, i){ return (i + 1) + "." + b; }).join(" ");
  if (t === "reading"){
    return (q.questions || []).map(function(sq, s){
      var a = sq.o && sq.o.length ? String.fromCharCode(65 + sq.a) : qtAnsList(sq.ansText != null ? sq.ansText : sq.a).join("/");
      return (s + 1) + "." + a;
    }).join(" ");
  }
  if (t === "writing") return "（作文：写 40 词以上，参考范文见解析）";
  return "";
}

/* ================= 事件委托兜底 =================
 * 个别浏览器扩展（如广告过滤）或安全策略会拦截按钮的内联 onclick，
 * 这里在 document 上统一委托 .qt-opt/.qt-word/.qt-blank 的点击，
 * 保证任何环境下选项都可选。与内联 onclick 重复触发无害（qtPick 幂等）。 */
(function(){
  if (window.__qtDelegated) return;
  if (typeof document === "undefined" || typeof document.addEventListener !== "function") return;
  window.__qtDelegated = true;
  document.addEventListener("click", function(ev){
    var t = ev.target;
    if (!t || !t.closest) return;
    var opt = t.closest(".qt-opt");
    if (opt){ qtPick(opt); return; }
    var word = t.closest(".qt-word");
    if (word){ qtWordClick(word); return; }
    var blank = t.closest(".qt-blank");
    if (blank){ qtBlankClick(blank); return; }
  }, false);
})();
