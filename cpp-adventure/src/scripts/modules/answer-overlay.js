/* ---------------- 大字答案浮层 answer-overlay.js ----------------
 * 所有答题引擎共用的「答案展示 + 前进锁定」浮层：
 *   1. 作答后弹出全屏浮层，正确答案超大字显示，答错同时划线展示错选；
 *   2. 浮层里唯一的「下一题」按钮倒计时锁定：答对 3 秒、答错 6 秒后才亮起；
 *   3. 两条路都可走：点「← 返回原题」关掉浮层回题目界面慢慢看（右下角会出现
 *      悬浮「下一题 ▶」，看完随时点它继续）；或直接等倒计时点浮层里的「下一题」；
 *   4. 引擎的判分、金币、连击、错题本逻辑不变，只接管「展示答案 + 前进」。
 * 引擎里均以 typeof aoShow === "function" 判断启用，未加载时退回原行内反馈。
 * 可调参数：AO_WAIT_OK / AO_WAIT_BAD（秒）。
 */
var AO_WAIT_OK = 3;
var AO_WAIT_BAD = 6;
var aoTimer = null, aoReady = false, aoOnNext = null;

function aoKillPill(){
  var p = document.getElementById("aoPill");
  if (p) p.remove();
}
/* 返回原题后，右下角悬浮「下一题」按钮（已看过答案，不再锁定） */
function aoShowPill(){
  aoKillPill();
  var d = document.createElement("div");
  d.id = "aoPill";
  d.innerHTML = '<button class="ao-pillbtn" type="button" onclick="aoResume()">下一题 ▶</button>';
  document.body.appendChild(d);
}
/* 关闭浮层、回到原题界面（不清空 onNext，之后仍可前进） */
function aoBack(){
  try{
    if (aoTimer){ clearInterval(aoTimer); aoTimer = null; }
    var m = document.getElementById("aoMask");
    if (m) m.classList.remove("open");
    document.body.style.overflow = "";
    aoShowPill();
  }catch(e){}
}
/* 悬浮按钮前进，与 aoNext 等效 */
function aoResume(){
  if (!aoReady) return;
  aoKillPill();
  var f = aoOnNext; aoOnNext = null; aoReady = false;
  if (typeof f === "function") f();
}

function aoMask(){
  var m = document.getElementById("aoMask");
  if (!m){
    m = document.createElement("div");
    m.id = "aoMask";
    m.className = "eq-mask ao-mask";
    m.innerHTML = '<div class="ao-card" id="aoCard"></div>';
    document.body.appendChild(m);
  }
  return m;
}

/* 大字答案排版：letter 是选项字母（可为空），text 是答案内容 */
function aoBig(letter, text){
  return '<span class="ao-letter">' + letter + '</span>' +
         '<span class="ao-atext">' + (letter ? ". " : "") + text + '</span>';
}
function aoEsc(s){
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
/* 题库类题目（choice/fill/cloze/reading）的正确答案大字 */
function aoBigAns(q){
  if (qtTypeOf(q) === "choice"){
    return aoBig(String.fromCharCode(65 + q.a), q.o && q.o[q.a] != null ? q.o[q.a] : "");
  }
  return aoBig("", (typeof qtAnswerText === "function") ? qtAnswerText(q) : "");
}
/* 用户错选的小字展示（划线用） */
function aoUserPick(q, input){
  if (qtTypeOf(q) === "choice"){
    if (typeof input === "number" && input >= 0 && q.o && q.o[input] != null){
      return aoEsc(String.fromCharCode(65 + input) + " " + q.o[input]);
    }
    return "未作答";
  }
  return input != null && input !== "" ? aoEsc(String(input)) : "未作答";
}

/* 原题回显：题干 + 选项列表，答对项标绿 ✓、错选项标红 ✗。
 * q 至少含 { q:题干, o:[选项], a:正确下标 }；input 是用户选择（选项下标或填空文本，可为空）。
 * 只传题干（写作题等）时不渲染选项。 */
function aoQHtml(q, input){
  if (!q) return "";
  var stem = q.q || q.passage || "";
  if (!stem) return "";
  var html = '<div class="ao-qtitle">原题</div><div class="ao-qstem">' + aoEsc(stem) + '</div>';
  if (q.o && q.o.length){
    var rows = "";
    for (var k = 0; k < q.o.length; k++){
      var cls = "ao-qopt", mark = "";
      if (typeof q.a === "number" && k === q.a){ cls += " good"; mark = " ✓"; }
      else if (typeof input === "number" && k === input){ cls += " no"; mark = " ✗"; }
      rows += '<div class="' + cls + '"><b>' + String.fromCharCode(65 + k) + '</b>' +
              '<span>' + aoEsc(q.o[k]) + '</span>' +
              (mark ? '<em class="ao-mark">' + mark + '</em>' : '') +
            '</div>';
    }
    html += '<div class="ao-qopts">' + rows + '</div>';
  }
  return '<div class="ao-q">' + html + '</div>';
}

function aoShow(opts){
  try{
    aoKillPill();
    var m = aoMask();
    var card = document.getElementById("aoCard");
    var ok = !!opts.ok;
    var cls = opts.cardClass || (ok ? "ok" : "bad");
    var head = opts.head || (ok ? "回答正确 ✓" : "回答错误 ✗");
    var wait = opts.wait || (ok ? AO_WAIT_OK : AO_WAIT_BAD);
    var hasWhy = !!opts.whyHtml;
    var html = '<button class="ao-backbtn" type="button" onclick="aoBack()" title="关闭浮层，返回原题界面">← 返回原题</button>' +
               '<div class="ao-anshead ' + cls + '">' + head + '</div>';
    if (opts.sub) html += '<div class="ao-sub">' + opts.sub + '</div>';
    if (opts.qHtml) html += opts.qHtml;
    if (opts.userHtml) html += '<div class="ao-yourans">你的答案：<s>' + opts.userHtml + '</s></div>';
    if (opts.bigHtml){
      html += '<div class="ao-anslabel">正 确 答 案</div>' +
              '<div class="ao-big">' + opts.bigHtml + '</div>';
    }
    if (opts.whyHtml) html += '<div class="ao-exp" id="aoExpBox"><div class="ao-exp-inner">💡 解析：' + opts.whyHtml + '</div><button class="ao-readok-btn" type="button" id="aoReadOkBtn" onclick="aoReadOk()" style="display:none;">✅ 我已看懂</button></div>';
    if (opts.extraHtml) html += '<div class="ao-extra">' + opts.extraHtml + '</div>';
    html += '<button id="aoNextBtn" class="ao-nextbtn" type="button" disabled onclick="aoNext()">⏳ ' + wait + ' 秒后可继续</button>';
    card.className = "ao-card " + cls;
    card.innerHTML = html;
    m.classList.add("open");
    document.body.style.overflow = "hidden";

    aoReady = false; aoOnNext = opts.onNext || null;
    if (aoTimer) clearInterval(aoTimer);
    var left = wait;
    aoTimer = setInterval(function(){
      left--;
      var b = document.getElementById("aoNextBtn");
      if (!b){ clearInterval(aoTimer); aoTimer = null; return; }
      if (left > 0){
        b.textContent = "⏳ " + left + " 秒后可继续" + (hasWhy ? "（必须看解析）" : "");
      } else {
        clearInterval(aoTimer); aoTimer = null;
        if (hasWhy){
          b.textContent = "⚠️ 请先点击解析区的「我已看懂」";
          var rbtn = document.getElementById("aoReadOkBtn");
          if (rbtn) rbtn.style.display = "block";
        } else {
          aoReady = true;
          b.disabled = false; b.classList.add("ready");
          b.textContent = "下一题 ▶";
        }
      }
    }, 1000);
  }catch(e){}
}

function aoReadOk(){
  var rbtn = document.getElementById("aoReadOkBtn");
  if (rbtn) rbtn.textContent = "✅ 已看懂";
  aoReady = true;
  var b = document.getElementById("aoNextBtn");
  if (b){
    b.disabled = false;
    b.classList.add("ready");
    b.textContent = "下一题 ▶";
  }
}
function aoNext(){
  if (!aoReady) return;
  aoReady = false;
  aoKillPill();
  if (aoTimer){ clearInterval(aoTimer); aoTimer = null; }
  var m = document.getElementById("aoMask");
  if (m) m.classList.remove("open");
  var f = aoOnNext; aoOnNext = null;
  if (typeof f === "function") f();
}
