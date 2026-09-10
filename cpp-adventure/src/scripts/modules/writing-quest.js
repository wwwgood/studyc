/* ---------------- 英语作文大冒险 writing-quest.js ----------------
 * 玩法：4 本书 → 每本 25 篇范文。
 *   ① 读范文（英文 / 中英对照 / 中文，点任意单词查意思）
 *   ② 学要点 + 记词汇（都带中文）
 *   ③ ✍️ 分步写作：按「写作要点」一步一步把作文写出来（本模块的核心）
 *   ④ 出成果：我的作文 vs 范文
 *
 * 说明：原来的 3 道选择题已降级为可选的「🔍 读懂检查」，不再是考核主体。
 * 进度：S.writing = { done:{passageId:stars}, coins, mywork:{passageId:作文} }
 */
var WQ_COIN_PER_Q = 8;
var WQ_COIN_PER_STEP = 10;

/* 常见虚词，不参与「关键词命中」判定 */
var WQ_STOP = {
  a:1,an:1,the:1,is:1,am:1,are:1,was:1,were:1,be:1,been:1,being:1,to:1,of:1,in:1,on:1,at:1,
  for:1,with:1,and:1,or:1,but:1,my:1,me:1,we:1,our:1,us:1,he:1,him:1,his:1,she:1,her:1,it:1,
  its:1,they:1,them:1,their:1,you:1,your:1,this:1,that:1,these:1,those:1,there:1,here:1,do:1,
  does:1,did:1,have:1,has:1,had:1,will:1,would:1,can:1,could:1,so:1,very:1,too:1,also:1,
  then:1,than:1,when:1,what:1,how:1,who:1,which:1,where:1,why:1,i:1,from:1,about:1,into:1,
  up:1,out:1,not:1,no:1,all:1,some:1,any:1,more:1,most:1,many:1,much:1,one:1,two:1,as:1,
  by:1,if:1,because:1,good:1,like:1
};

/* ---------- 小工具 ---------- */
function wqEsc(s){
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
/* 查中文翻译，WRITE_ZH 未加载时安全返回空 */
function wqZh(map, key){
  if (typeof WRITE_ZH === "undefined" || !key) return "";
  var m = WRITE_ZH[map];
  return (m && m[key]) ? m[key] : "";
}
/* 查单词意思，带简单的形态还原（cats→cat, playing→play） */
function wqLookupWord(raw){
  var s = String(raw == null ? "" : raw).toLowerCase().trim();
  if (!s) return "";
  /* 先按短语整体查（grow up / police officer / Grade Four） */
  var hit = wqZh("w", s);
  if (hit) return hit;
  /* 再去掉空格等符号按单词查 */
  var w = s.replace(/[^a-z']/g, "");
  if (!w) return "";
  hit = wqZh("w", w);
  if (hit) return hit;
  var tries = [
    w.replace(/(ies)$/, "y"), w.replace(/(es)$/, ""), w.replace(/s$/, ""),
    w.replace(/(ing)$/, "e"), w.replace(/(ing)$/, ""),
    w.replace(/(ied)$/, "y"), w.replace(/(ed)$/, "e"), w.replace(/(ed)$/, ""),
    w.replace(/(er)$/, ""), w.replace(/(est)$/, "")
  ];
  for (var i = 0; i < tries.length; i++){
    if (tries[i] && tries[i].length > 1){
      var t = wqZh("w", tries[i]);
      if (t) return t;
    }
  }
  return "";
}
/* 按句号/问号/感叹号切句，与生成翻译数据时的规则保持一致 */
function wqSents(body){
  var arr = String(body || "").match(/[^.!?]+[.!?]+/g);
  if (!arr || !arr.length) arr = [String(body || "")];
  return arr.map(function(s){ return s.trim(); }).filter(function(s){ return !!s; });
}
/* 把一句英文里的每个单词包成可点击的 span */
function wqWordsHtml(sent){
  return String(sent).replace(/[A-Za-z][A-Za-z']*/g, function(w){
    return '<span class="wq-word" data-w="' + wqEsc(w) + '" onclick="wqTipWord(this)">' + wqEsc(w) + '</span>';
  });
}
function wqWordsPlain(sent){
  return String(sent).replace(/[A-Za-z][A-Za-z']*/g, function(w){
    return '<span class="wq-word plain" data-w="' + wqEsc(w) + '" onclick="wqTipWord(this)">' + wqEsc(w) + '</span>';
  });
}

/* ---------- 状态 ---------- */
function wqState(){
  if (!S.writing) S.writing = { done: {}, coins: 0 };
  if (!S.writing.done) S.writing.done = {};
  if (!S.writing.mywork) S.writing.mywork = {};
  if (typeof S.writing.coins !== "number") S.writing.coins = 0;
  return S.writing;
}
function wqStats(){
  var st = wqState();
  return {
    done: Object.keys(st.done).length,
    total: WRITE_DATA.passages.length,
    coins: st.coins,
    wrote: Object.keys(st.mywork).length
  };
}

/* ---------- 总览渲染 ---------- */
function wqRender(){
  var st = wqStats();
  var bar = document.getElementById("wqTotalBar");
  var txt = document.getElementById("wqTotalTxt");
  var coins = document.getElementById("wqCoins");
  if (bar) bar.style.width = (st.done / st.total * 100) + "%";
  if (txt) txt.textContent = "已学 " + st.done + " / " + st.total + " 篇范文";
  if (coins) coins.textContent = st.coins;

  var wrap = document.getElementById("wqBooks");
  if (!wrap) return;
  var html = "";
  WRITE_DATA.books.forEach(function(b){
    var ps = WRITE_DATA.passages.filter(function(p){ return p.book === b.id; });
    var doneCount = ps.filter(function(p){ return wqState().done[p.id]; }).length;
    var pct = Math.round(doneCount / ps.length * 100);
    var full = doneCount === ps.length;
    html += '<div class="wq-book' + (full ? " full" : "") + '" data-bid="' + b.id + '">' +
      '<button class="wq-book-head" type="button" onclick="wqToggle(' + b.id + ')">' +
        '<span class="wq-emoji">' + b.emoji + '</span>' +
        '<span class="wq-name">' + b.name + '<small>' + b.desc + '</small></span>' +
        '<span class="wq-meta"><b>' + doneCount + '</b>/' + ps.length + ' 篇' + (full ? ' 🏅' : '') + '</span>' +
        '<span class="wq-arrow" id="wqArrow' + b.id + '">▾</span>' +
      '</button>' +
      '<div class="wq-bar"><span style="width:' + pct + '%"></span></div>' +
      '<div class="wq-passage-list" id="wqList' + b.id + '" hidden></div>' +
    '</div>';
  });
  wrap.innerHTML = html;
}

function wqToggle(bid){
  var list = document.getElementById("wqList" + bid);
  var arrow = document.getElementById("wqArrow" + bid);
  if (!list) return;
  if (!list.hidden){ list.hidden = true; if (arrow) arrow.textContent = "▾"; return; }
  var ps = WRITE_DATA.passages.filter(function(p){ return p.book === bid; });
  var html = "";
  ps.forEach(function(p, i){
    var done = wqState().done[p.id];
    var wrote = wqState().mywork[p.id];
    html += '<button class="wq-passage' + (done ? " done" : "") + '" type="button" onclick="wqOpen(\'' + p.id + '\')">' +
      '<span class="wq-no">' + (i + 1) + '</span>' +
      '<span class="wq-title">' + wqEsc(p.title) + (wrote ? '<span class="wq-wrote-tag">✍️写过</span>' : '') + '</span>' +
      '<span class="wq-cat">' + wqEsc(p.cat) + '</span>' +
      '<span class="wq-stars">' + (done ? '★'.repeat(done) : '☆☆☆') + '</span>' +
    '</button>';
  });
  html += '<button class="wq-passage wq-collapse" type="button" onclick="wqToggle(' + bid + ')">▲ 收起本类</button>';
  list.innerHTML = html;
  list.hidden = false;
  if (arrow) arrow.textContent = "▴";
}

/* ---------- 打开 / 关闭 ---------- */
var WQ_SESSION = null;

function wqOpen(pid){
  wqStopSpeak();
  var p = WRITE_DATA.passages.filter(function(x){ return x.id === pid; })[0];
  if (!p) return;
  WQ_SESSION = {
    passage: p,
    phase: "read",
    mode: "both",
    idx: 0, wrong: 0, combo: 0,
    steps: [], stepIdx: 0, stepStars: [], mytexts: []
  };
  wqBuildSteps();
  /* 之前写过的作文，重新进来接着用 */
  var saved = wqState().mywork[p.id];
  if (saved) WQ_SESSION.mytexts = String(saved).split("\n").filter(function(x){ return x.trim(); });
  wqRenderRead();
  document.getElementById("wqDialogMask").classList.add("open");
  document.body.style.overflow = "hidden";
}

function wqClose(){
  wqStopSpeak();
  var mask = document.getElementById("wqDialogMask");
  if (mask) mask.classList.remove("open");
  document.body.style.overflow = "";
  WQ_SESSION = null;
  wqRender();
  if (typeof portalRenderTopbar === "function") portalRenderTopbar();
}

/* 把范文按「写作要点」拆成若干步，每步对应几句范文 */
function wqBuildSteps(){
  var s = WQ_SESSION;
  var sents = wqSents(s.passage.body);
  var tips = (s.passage.tips && s.passage.tips.length) ? s.passage.tips : [];
  var n = tips.length || 4;
  if (n > sents.length) n = sents.length;
  if (n < 1) n = 1;
  /* 句子尽量均匀地分给每一步：先按 base 句分，前 rem 步各多 1 句 */
  var base = Math.floor(sents.length / n);
  var rem = sents.length % n;
  if (base < 1) base = 1;
  var steps = [], pos = 0;
  for (var i = 0; i < n; i++){
    var take = (i < rem) ? (base + 1) : base;
    if (pos >= sents.length) break;
    if (i === n - 1) take = sents.length - pos;   /* 最后一步兜底吃掉剩余 */
    var seg = sents.slice(pos, pos + take);
    pos += take;
    if (!seg.length) break;
    steps.push({
      tip: tips[i] || ("第 " + (i + 1) + " 部分"),
      sents: seg,
      en: seg.join(" "),
      cn: seg.map(function(x){ return wqZh("s", x); }).filter(function(x){ return !!x; }).join(""),
      kws: wqKeywords(seg)
    });
  }
  s.steps = steps;
  /* 预先填上之前写的内容 */
  s.mytexts = steps.map(function(_, i){ return s.mytexts[i] || ""; });
}

/* 从参考句里挑出「关键词」（实词，最多 6 个） */
function wqKeywords(sents){
  var out = [];
  sents.forEach(function(sn){
    (String(sn).match(/[A-Za-z][A-Za-z']*/g) || []).forEach(function(w){
      var lw = w.toLowerCase();
      if (lw.length < 3) return;
      if (WQ_STOP[lw]) return;
      if (out.indexOf(lw) < 0) out.push(lw);
    });
  });
  return out.slice(0, 6);
}

/* ---------- ① 读范文 ---------- */
function wqSetMode(mode){
  if (!WQ_SESSION) return;
  WQ_SESSION.mode = mode;
  wqRenderRead();
}

function wqRenderRead(){
  var s = WQ_SESSION;
  var p = s.passage;
  var mode = s.mode || "both";
  var sents = wqSents(p.body);

  var bodyHtml = "";
  sents.forEach(function(sn){
    var zh = wqZh("s", sn);
    if (mode === "zh"){
      bodyHtml += '<div class="wq-sent zh">' + (zh ? wqEsc(zh) : '<i>（暂无翻译）</i>') + '</div>';
    } else {
      var en = (mode === "en") ? wqEsc(sn) : wqWordsHtml(sn);
      bodyHtml += '<div class="wq-sent' + (mode === "en" ? " en-only" : "") + '">' + en + '</div>';
      if (mode === "both" && zh) bodyHtml += '<div class="wq-sent zh">' + wqEsc(zh) + '</div>';
    }
  });

  var tipsHtml = (p.tips || []).map(function(t, i){
    return '<li><span class="wq-tip-no">' + (i + 1) + '</span>' + wqEsc(t) + '</li>';
  }).join("");

  var wordsHtml = (p.words || []).map(function(w){
    var zh = wqLookupWord(w);
    return '<span class="wq-word-chip" onclick="wqSpeakWord(\'' + wqEsc(w).replace(/'/g, "\\'") + '\')" title="点一下 🔊 听读音">' +
      '<span class="wq-spk">🔊</span>' + wqEsc(w) + (zh ? '<small>' + wqEsc(zh) + '</small>' : '') + '</span>';
  }).join("");

  var n = s.steps.length;
  var hasWork = !!wqState().mywork[p.id];

  document.getElementById("wqDialog").innerHTML =
    '<div class="wq-dlg-head">' +
      '<span class="wq-cap">✍️ ' + wqEsc(p.title) + ' · ' + wqEsc(p.cat) + '</span>' +
      '<button class="wq-close" type="button" onclick="wqClose()">×</button>' +
    '</div>' +
    '<div class="wq-dlg-body">' +
      '<div class="wq-mode-bar">' +
        '<button type="button" class="wq-mode-btn' + (mode === "en" ? " on" : "") + '" onclick="wqSetMode(\'en\')">🔤 纯英文</button>' +
        '<button type="button" class="wq-mode-btn' + (mode === "both" ? " on" : "") + '" onclick="wqSetMode(\'both\')">🔁 中英对照</button>' +
        '<button type="button" class="wq-mode-btn' + (mode === "zh" ? " on" : "") + '" onclick="wqSetMode(\'zh\')">🇨🇳 只看中文</button>' +
      '</div>' +
      '<div class="wq-reader" id="wqPassage">' + bodyHtml + '</div>' +
      '<div class="wq-word-tip" id="wqWordTip">👆 点范文里任意一个单词，这里就显示它的中文意思</div>' +
      '<button class="wq-speak-btn" id="wqSpeakBtn" type="button" onclick="wqSpeak()">🔊 朗读范文</button>' +
      '<div class="wq-tips-box">' +
        '<h4>💡 写作要点（下面写作文就按这 ' + n + ' 步来）</h4>' +
        '<ul class="wq-tips">' + tipsHtml + '</ul>' +
      '</div>' +
      '<div class="wq-words-box">' +
        '<h4>📝 重点词汇（点一下 🔊 听读音）</h4>' +
        '<div class="wq-words">' + wordsHtml + '</div>' +
        '<button class="wq-speak-btn wq-speak-words" type="button" onclick="wqSpeakWords()">🔊 朗读全部词汇</button>' +
      '</div>' +
      '<button class="wq-start-btn" type="button" onclick="wqStartWrite()">✍️ 开始写这篇（' + n + ' 步）</button>' +
      '<button class="wq-start-btn ghost" type="button" onclick="wqStartQuiz()">🔍 先做读懂检查（' + (p.q || []).length + ' 题，选做）</button>' +
      (hasWork ? '<div class="wq-haswork">📄 你之前写过这篇，点上面「开始写」可以接着改。</div>' : '') +
    '</div>';
  wqRenderSpeakBtn();
}

/* 点击单词 → 显示中文意思 */
function wqTipWord(el){
  var box = document.getElementById("wqWordTip");
  if (!el || !box) return;
  var w = el.getAttribute("data-w") || "";
  var zh = wqLookupWord(w);
  var olds = document.querySelectorAll(".wq-word.on");
  for (var i = 0; i < olds.length; i++) olds[i].classList.remove("on");
  el.classList.add("on");
  box.innerHTML = zh
    ? '<b>' + wqEsc(w) + '</b> → <span class="wq-tip-zh">' + wqEsc(zh) + '</span>'
    : '<b>' + wqEsc(w) + '</b> → <span class="wq-tip-none">词库里暂时没有这个词，记住它！</span>';
  wqSpeakWord(w);
}

/* ---------- 朗读控制（可中途停止） ---------- */
var wqSpeaking = false;

/* 停止当前朗读，并复位按钮文案 */
function wqStopSpeak(){
  try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch(e){}
  wqSpeaking = false;
  wqRenderSpeakBtn();
}
/* 同步「朗读范文 / 停止朗读」按钮状态 */
function wqRenderSpeakBtn(){
  var btn = document.getElementById("wqSpeakBtn");
  if (!btn) return;
  btn.textContent = wqSpeaking ? "⏹ 停止朗读" : "🔊 朗读范文";
  btn.classList.toggle("speaking", !!wqSpeaking);
}

/* 朗读整篇范文：点一下开始，正在读时再点一下即停止（中途可停） */
function wqSpeak(){
  try {
    if (!window.speechSynthesis) return;
    if (wqSpeaking){ wqStopSpeak(); return; }                 /* 正在读 → 停止 */
    var txt = (WQ_SESSION && WQ_SESSION.passage.body) || "";
    if (!txt) return;
    var u = new SpeechSynthesisUtterance(txt);
    u.lang = "en-US"; u.rate = 0.85;
    u.onend = function(){ wqSpeaking = false; wqRenderSpeakBtn(); };
    u.onerror = function(){ wqSpeaking = false; wqRenderSpeakBtn(); };
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
    wqSpeaking = true; wqRenderSpeakBtn();
  } catch(e){}
}

/* 朗读单词（点词查义时触发）；会打断整篇朗读 */
function wqSpeakWord(w){
  try {
    if (!window.speechSynthesis || !w) return;
    var u = new SpeechSynthesisUtterance(w);
    u.lang = "en-US"; u.rate = 0.8;
    speechSynthesis.cancel();
    wqSpeaking = false; wqRenderSpeakBtn();
    speechSynthesis.speak(u);
  } catch(e){}
}

/* 依次朗读本篇全部重点词汇（点「朗读全部词汇」） */
function wqSpeakWords(list){
  try {
    if (!window.speechSynthesis) return;
    if (!list || !list.length) list = (WQ_SESSION && WQ_SESSION.passage.words) || [];
    if (!list || !list.length) return;
    speechSynthesis.cancel();
    wqSpeaking = true; wqRenderSpeakBtn();
    var i = 0;
    function next(){
      if (i >= list.length){ wqSpeaking = false; wqRenderSpeakBtn(); return; }
      var w = list[i++];
      var u = new SpeechSynthesisUtterance(w);
      u.lang = "en-US"; u.rate = 0.78;
      u.onend = next; u.onerror = next;
      speechSynthesis.speak(u);
    }
    next();
  } catch(e){}
}

/* ---------- ② ✍️ 分步写作（核心） ---------- */
function wqStartWrite(){
  wqStopSpeak();
  if (!WQ_SESSION) return;
  WQ_SESSION.phase = "write";
  WQ_SESSION.stepIdx = 0;
  WQ_SESSION.stepStars = [];
  wqRenderWrite();
}

function wqRenderWrite(){
  var s = WQ_SESSION;
  var p = s.passage;
  var i = s.stepIdx;
  var st = s.steps[i];
  if (!st) { wqFinishWrite(); return; }

  /* 进度点 */
  var track = s.steps.map(function(_, k){
    var cls = k < i ? "done" : (k === i ? "now" : "");
    return '<span class="wq-dot ' + cls + '">' + (k + 1) + '</span>';
  }).join('<span class="wq-dot-line"></span>');

  /* 可用词句：本步关键词 + 本篇重点词汇 */
  var chips = [];
  (p.words || []).forEach(function(w){ if (chips.indexOf(w) < 0) chips.push(w); });
  st.kws.forEach(function(k){ if (chips.indexOf(k) < 0) chips.push(k); });
  var chipsHtml = chips.slice(0, 14).map(function(c){
    var zh = wqLookupWord(c);
    return '<button type="button" class="wq-chip" onclick="wqInsert(\'' + wqEsc(c).replace(/'/g, "\\'") + '\')" title="点一下插进作文里">' +
      wqEsc(c) + (zh ? '<small>' + wqEsc(zh) + '</small>' : '') + '</button>';
  }).join("");

  document.getElementById("wqDialog").innerHTML =
    '<div class="wq-dlg-head">' +
      '<span class="wq-cap">✍️ 第 ' + (i + 1) + ' / ' + s.steps.length + ' 步 · ' + wqEsc(p.title) + '</span>' +
      '<button class="wq-close" type="button" onclick="wqClose()">×</button>' +
    '</div>' +
    '<div class="wq-dlg-body">' +
      '<div class="wq-step-track">' + track + '</div>' +
      '<div class="wq-step-tip"><b>这一步写什么：</b>' + wqEsc(st.tip) + '</div>' +
      (st.cn ? '<div class="wq-step-cn"><b>🀄 中文意思（照着写成英文）：</b>' + wqEsc(st.cn) + '</div>' : '') +
      '<div class="wq-chips-box"><div class="wq-chips-label">🀄 可以用的词（点一下插进去）：</div>' +
        '<div class="wq-chips">' + chipsHtml + '</div></div>' +
      '<textarea id="wqInput" class="wq-write-input" rows="4" ' +
        'placeholder="在这里用英语写下这一段…（写完点下面的「检查这一步」）" ' +
        'oninput="wqSaveStep()">' + wqEsc(s.mytexts[i] || "") + '</textarea>' +
      '<div class="wq-feedback" id="wqFeedback"></div>' +
      '<div class="wq-step-btns">' +
        '<button type="button" class="wq-step-btn primary" onclick="wqCheckStep()">✅ 检查这一步</button>' +
        '<button type="button" class="wq-step-btn" onclick="wqToggleRef()">💡 看范文怎么写</button>' +
        (i > 0 ? '<button type="button" class="wq-step-btn ghost" onclick="wqGoStep(' + (i - 1) + ')">← 上一步</button>' : '') +
      '</div>' +
      '<div class="wq-ref" id="wqRef" hidden>' +
        '<div class="wq-ref-en">' + wqEsc(st.en) + '</div>' +
        (st.cn ? '<div class="wq-ref-cn">' + wqEsc(st.cn) + '</div>' : '') +
        '<div class="wq-ref-note">范文只是参考，你用自己的话写出来更棒！</div>' +
      '</div>' +
    '</div>';
}

function wqSaveStep(){
  var s = WQ_SESSION;
  var el = document.getElementById("wqInput");
  if (s && el) s.mytexts[s.stepIdx] = el.value;
}

function wqGoStep(i){
  wqSaveStep();
  WQ_SESSION.stepIdx = i;
  wqRenderWrite();
}

function wqInsert(word){
  var el = document.getElementById("wqInput");
  if (!el) return;
  var v = el.value;
  var pos = (typeof el.selectionStart === "number") ? el.selectionStart : v.length;
  var needSpace = (pos > 0 && !/\s$/.test(v.slice(0, pos)));
  var ins = (needSpace ? " " : "") + word;
  el.value = v.slice(0, pos) + ins + v.slice(pos);
  var np = pos + ins.length;
  try { el.setSelectionRange(np, np); } catch(e){}
  el.focus();
  wqSaveStep();
}

function wqToggleRef(){
  wqSaveStep();
  var el = document.getElementById("wqRef");
  if (!el) return;
  el.hidden = !el.hidden;
}

/* 检查这一步写得怎么样 */
function wqCheckStep(){
  var s = WQ_SESSION;
  wqSaveStep();
  var i = s.stepIdx;
  var st = s.steps[i];
  var text = (s.mytexts[i] || "").trim();
  var fb = document.getElementById("wqFeedback");
  if (!fb) return;

  if (!text){
    fb.innerHTML = '<div class="wq-fb warn">⚠️ 还没写呢～ 照着上面的中文意思写一句试试，写完再来检查。</div>';
    return;
  }

  var lw = text.toLowerCase();
  var hit = st.kws.filter(function(k){ return lw.indexOf(k) >= 0; });
  var miss = st.kws.filter(function(k){ return lw.indexOf(k) < 0; });
  var rate = st.kws.length ? (hit.length / st.kws.length) : 1;
  var wc = (text.match(/[A-Za-z][A-Za-z']*/g) || []).length;

  var tips = [];
  if (!/^[A-Z]/.test(text)) tips.push("句子第一个字母要大写哦");
  if (!/[.!?]$/.test(text)) tips.push("句子末尾别忘了加句号 .");
  if (wc < 2) tips.push("至少写 2 个单词，把意思写完整");

  var stars = 0;
  if (wc >= 2){
    if (rate >= 0.6 || hit.length >= 3) stars = 3;
    else if (rate >= 0.25 || hit.length >= 1) stars = 2;
    else stars = 1;
  }
  s.stepStars[i] = stars;

  var starHtml = "";
  for (var k = 1; k <= 3; k++) starHtml += '<span class="wq-mini-star' + (k <= stars ? " on" : "") + '">★</span>';

  var html = "";
  if (stars === 0){
    html += '<div class="wq-fb warn">⚠️ 写得太短啦，再补几个词把意思说完整。</div>';
  } else {
    html += '<div class="wq-fb ok">👍 写得不错！' + starHtml +
      '<br>你写的：<span class="wq-my">' + wqEsc(text) + '</span></div>';
  }
  if (hit.length) html += '<div class="wq-fb-tip">✅ 用上了这些词：' + wqEsc(hit.join("、")) + '</div>';
  if (miss.length && stars < 3) html += '<div class="wq-fb-tip">💡 还可以试试用上：' + wqEsc(miss.join("、")) + '</div>';
  if (tips.length) html += '<div class="wq-fb-tip">✏️ ' + wqEsc(tips.join("；")) + '</div>';

  if (stars > 0){
    var gain = WQ_COIN_PER_STEP * stars;
    wqState().coins += gain;
    saveS();
    if (typeof portalRenderTopbar === "function") portalRenderTopbar();
    html += '<div class="wq-fb-coin">🪙 +' + gain + '</div>';
    html += '<div class="wq-step-next"><button type="button" class="wq-step-btn primary" onclick="wqStepNext()">' +
      (i < s.steps.length - 1 ? '下一步 →' : '🏁 完成，看我的作文') + '</button>' +
      '<button type="button" class="wq-step-btn ghost" onclick="wqCheckStep()">↻ 再检查一次</button></div>';
  } else {
    html += '<div class="wq-step-next"><button type="button" class="wq-step-btn ghost" onclick="wqToggleRef()">💡 看看范文怎么写</button></div>';
  }
  fb.innerHTML = html;
}

function wqStepNext(){
  var s = WQ_SESSION;
  wqSaveStep();
  if (s.stepIdx < s.steps.length - 1){ s.stepIdx++; wqRenderWrite(); return; }
  wqFinishWrite();
}

/* ---------- ③ 写作成果 ---------- */
function wqFinishWrite(){
  var s = WQ_SESSION;
  var p = s.passage;
  var my = s.mytexts.map(function(t){ return (t || "").trim(); }).filter(function(t){ return !!t; });
  var text = my.join("\n");

  var stt = wqState();
  if (text) stt.mywork[p.id] = text; else delete stt.mywork[p.id];

  var got = s.stepStars.filter(function(x){ return typeof x === "number"; });
  var avg = got.length ? (got.reduce(function(a, b){ return a + b; }, 0) / got.length) : 0;
  var wroteAll = my.length >= s.steps.length;
  var stars = wroteAll ? (avg >= 2.7 ? 3 : (avg >= 1.8 ? 2 : 1)) : (avg >= 2.5 ? 2 : 1);
  if (stars < 1) stars = 1;

  var old = stt.done[p.id] || 0;
  if (stars > old) stt.done[p.id] = stars;
  saveS();
  if (typeof fireConfetti === "function" && stars >= 2) fireConfetti();

  var starRow = "";
  for (var i = 1; i <= 3; i++) starRow += '<span class="' + (i <= stars ? "on" : "") + '">★</span>';

  var myHtml = my.map(function(t, i){
    return '<div class="wq-my-line"><span class="wq-my-no">' + (i + 1) + '</span>' + wqEsc(t) + '</div>';
  }).join("");

  document.getElementById("wqDialog").innerHTML =
    '<div class="wq-dlg-head result"><span class="wq-cap">🏁 我的作文</span>' +
      '<button class="wq-close" type="button" onclick="wqClose()">×</button></div>' +
    '<div class="wq-dlg-body">' +
      '<div class="wq-result-stars">' + starRow + '</div>' +
      '<p class="wq-result-say">' + (stars === 3 ? "太棒了！这篇写得很完整！🌟" : stars === 2 ? "写得不错！再用上几个好词就满分啦！" : "完成啦！多写多练会越来越好！") + '</p>' +
      '<div class="wq-my-box"><h4>📄 我写的 ' + wqEsc(p.title) + '</h4>' +
        (myHtml || '<div class="wq-empty">（还没有内容）</div>') +
      '</div>' +
      '<details class="wq-compare"><summary>📖 和范文比一比</summary>' +
        '<div class="wq-ref-en">' + wqEsc(p.body) + '</div>' +
        '<div class="wq-ref-cn">' + wqEsc(wqSents(p.body).map(function(x){ return wqZh("s", x); }).join("")) + '</div>' +
      '</details>' +
      '<div class="wq-result-btns">' +
        '<button class="wq-go-btn" type="button" onclick="wqCopyMine()">📋 复制我的作文</button>' +
        '<button class="wq-go-btn ghost" type="button" onclick="wqOpen(\'' + p.id + '\')">🔁 再改改</button>' +
        '<button class="wq-go-btn ghost" type="button" onclick="wqClose()">返回</button>' +
      '</div>' +
      '<p class="wq-result-meta">📊 总进度 ' + Object.keys(stt.done).length + ' / ' + WRITE_DATA.passages.length + ' · 🪙 ' + stt.coins + '</p>' +
    '</div>';
  WQ_SESSION.phase = "done";
}

function wqCopyMine(){
  var s = WQ_SESSION;
  if (!s) return;
  var text = s.mytexts.filter(function(t){ return (t || "").trim(); }).join("\n");
  if (!text) return;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text);
    } else {
      var ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); document.body.removeChild(ta);
    }
    if (typeof baToast === "function") baToast("已复制我的作文！");
  } catch(e){}
}

/* ---------- ④ 🔍 读懂检查（原选择题，现为选做） ---------- */
function wqStartQuiz(){
  wqStopSpeak();
  if (!WQ_SESSION) return;
  WQ_SESSION.phase = "quiz";
  WQ_SESSION.idx = 0;
  WQ_SESSION.wrong = 0;
  WQ_SESSION.combo = 0;
  wqRenderQuiz();
}

function wqRenderQuiz(){
  var s = WQ_SESSION;
  var p = s.passage;
  var q = p.q[s.idx];
  if (!q){ wqQuizDone(); return; }
  var zhQ = wqZh("q", q.q);
  var opts = q.o.map(function(t, i){
    var zhO = wqZh("o", t);
    return '<button class="wq-opt" type="button" data-i="' + i + '" onclick="wqAnswer(this)">' +
      '<span class="wq-opt-en">' + wqEsc(t) + '</span>' +
      (zhO ? '<span class="wq-opt-zh">' + wqEsc(zhO) + '</span>' : '') +
    '</button>';
  }).join("");
  document.getElementById("wqDialog").innerHTML =
    '<div class="wq-dlg-head">' +
      '<span class="wq-cap">🔍 读懂检查 · 第 ' + (s.idx + 1) + '/' + p.q.length + ' 题</span>' +
      '<button class="wq-close" type="button" onclick="wqClose()">×</button>' +
    '</div>' +
    '<div class="wq-dlg-body">' +
      '<div class="wq-combo-track">🔥 连击 <b>' + s.combo + '</b> · 🪙 ' + wqState().coins + '</div>' +
      '<div class="wq-question"><div class="wq-q-en">' + wqEsc(q.q) + '</div>' +
        (zhQ ? '<div class="wq-q-zh">' + wqEsc(zhQ) + '</div>' : '') + '</div>' +
      '<div class="wq-opts">' + opts + '</div>' +
      '<div class="wq-feedback" id="wqFeedback"></div>' +
    '</div>';
}

function wqAnswer(btn){
  var s = WQ_SESSION;
  var q = s.passage.q[s.idx];
  var i = parseInt(btn.getAttribute("data-i"), 10);
  var opts = btn.parentNode.querySelectorAll(".wq-opt");
  for (var k = 0; k < opts.length; k++) opts[k].disabled = true;
  var fb = document.getElementById("wqFeedback");
  if (i === q.a){
    btn.classList.add("ok");
    s.combo++;
    var gain = WQ_COIN_PER_Q * (1 + Math.floor(s.combo / 3));
    wqState().coins += gain;
    fb.innerHTML = '<div class="wq-fb ok">✅ 正确！+🪙' + gain + ' · ' + wqEsc(q.why) + '</div>' +
      '<button class="wq-next-btn" type="button" onclick="wqNext()">下一题 →</button>';
    saveS();
    if (typeof portalRenderTopbar === "function") portalRenderTopbar();
  } else {
    btn.classList.add("no");
    if (opts[q.a]) opts[q.a].classList.add("ok");
    s.combo = 0;
    s.wrong++;
    if (typeof errBookAdd === "function") errBookAdd("writing", { q: q.q, o: q.o, a: q.a, why: q.why, source: s.passage.title });
    fb.innerHTML = '<div class="wq-fb no">❌ ' + wqEsc(q.why) + '</div>' +
      '<button class="wq-next-btn" type="button" onclick="wqNext()">继续 →</button>';
    saveS();
  }
}

function wqNext(){
  WQ_SESSION.idx++;
  if (WQ_SESSION.idx < WQ_SESSION.passage.q.length){ wqRenderQuiz(); return; }
  wqQuizDone();
}

function wqQuizDone(){
  var s = WQ_SESSION;
  var p = s.passage;
  var right = p.q.length - s.wrong;
  var stt = wqState();
  /* 只做检查不写作时，也按正确率记星，但最高 2 星 —— 想要 3 星得动笔写 */
  var stars = s.wrong === 0 ? 2 : (s.wrong <= 1 ? 1 : 1);
  var old = stt.done[p.id] || 0;
  if (stars > old) stt.done[p.id] = stars;
  saveS();
  document.getElementById("wqDialog").innerHTML =
    '<div class="wq-dlg-head result"><span class="wq-cap">🔍 读懂检查完成</span>' +
      '<button class="wq-close" type="button" onclick="wqClose()">×</button></div>' +
    '<div class="wq-dlg-body wq-result">' +
      '<h3>答对 ' + right + ' / ' + p.q.length + ' 题</h3>' +
      '<p>' + (s.wrong === 0 ? '全对！范文读懂了 👍' : '有错题很正常，再看看范文～') + '</p>' +
      '<p class="wq-result-meta">💡 想拿满 3 颗星，还要动笔把这篇写出来哦</p>' +
      '<div class="wq-result-btns">' +
        '<button class="wq-go-btn" type="button" onclick="wqStartWrite()">✍️ 去写这篇（' + s.steps.length + ' 步）</button>' +
        '<button class="wq-go-btn ghost" type="button" onclick="wqOpen(\'' + p.id + '\')">📖 再看范文</button>' +
        '<button class="wq-go-btn ghost" type="button" onclick="wqClose()">返回</button>' +
      '</div>' +
    '</div>';
  WQ_SESSION.phase = "done";
}

function wqOnEnter(){ wqRender(); }
window.addEventListener("load", function(){ if (document.getElementById("wqBooks")) wqRender(); });
