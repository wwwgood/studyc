/* ---------------- 英语口语大冒险 oral-quest.js ----------------
 * 玩法：5 个难度递增的课堂口语关卡 → 每关若干句常用语。
 *   ① 听老师带读（🔊）→ ② 自己跟读打卡（🎤 我读了一遍）→ 进度累计
 *   另有「🎤 跟读模式」逐句带练、「🔊 朗读全部」整关领读、「⏹ 停止」随时停。
 * 进度：S.oral = { heard:{key:1}, said:{key:1}, coins:0 }，key = level.id + ":" + item.en。
 */
var OQ_COIN_PER_SAY = 1;

/* ---------- 自定义关卡（我的口语本） ----------
 * 存在 S.oralCustom = [{ id:"c<时间戳>", name, emoji, desc, scene:"✏️ 我的口语本 · 自定义", items:[{en,zh,note}] }]。
 * 既可手动一句一句加，也可用 AI（🤖）按中文场景整关生成后存进来。
 */
var OQ_CUSTOM_SCENE = "✏️ 我的口语本 · 自定义";
function oqCustomLoad(){
  oqState();
  if (!S.oralCustom || !S.oralCustom.length) S.oralCustom = [];
  return S.oralCustom;
}
function oqCustomSave(){ saveS(); }
/* 全部关卡 = 内置 + 自定义（自定义排后面） */
function oqAllLevels(){ return ORAL_DATA.levels.concat(oqCustomLoad()); }
function oqFindLevel(lid){
  return oqAllLevels().filter(function(x){ return String(x.id) === String(lid); })[0];
}

/* ---------- 状态 ---------- */
function oqState(){
  if (!S.oral) S.oral = { heard: {}, said: {}, coins: 0 };
  if (!S.oral.heard) S.oral.heard = {};
  if (!S.oral.said) S.oral.said = {};
  if (typeof S.oral.coins !== "number") S.oral.coins = 0;
  return S.oral;
}
function oqKey(lid, en){ return lid + ":" + en; }

function oqStats(){
  var st = oqState();
  var heard = 0, said = 0, total = 0, levelsDone = 0;
  oqAllLevels().forEach(function(lv){
    var n = lv.items.length;
    total += n;
    var d = 0;
    lv.items.forEach(function(it){
      var k = oqKey(lv.id, it.en);
      if (st.heard[k]) heard++;
      if (st.said[k]) { said++; d++; }
    });
    if (d === n) levelsDone++;
  });
  return { total: total, heard: heard, said: said, levels: oqAllLevels().length, levelsDone: levelsDone };
}

/* ---------- 总览渲染 ---------- */
function oqRender(){
  var st = oqStats();
  var bar = document.getElementById("oqTotalBar");
  var txt = document.getElementById("oqTotalTxt");
  var coins = document.getElementById("oqCoins");
  if (bar) bar.style.width = (st.said / st.total * 100) + "%";
  if (txt) txt.textContent = "已跟读 " + st.said + " / " + st.total + " 句　·　已听 " + st.heard + " 句";
  if (coins) coins.textContent = oqState().coins;

  var wrap = document.getElementById("oqLevels");
  if (!wrap) return;
  var all = oqAllLevels();
  var html = "";
  var lastScene = null;
  all.forEach(function(lv){
    /* 场景分组标题（场景变化时插入一条） */
    if (lv.scene && lv.scene !== lastScene){
      lastScene = lv.scene;
      var sceneLevels = all.filter(function(x){ return x.scene === lv.scene; }).length;
      html += '<div class="oq-scene-head">' +
        '<span class="oq-scene-name">' + lv.scene + '</span>' +
        '<span class="oq-scene-meta">' + sceneLevels + ' 关</span>' +
      '</div>';
    }
    var done = lv.items.filter(function(it){ return oqState().said[oqKey(lv.id, it.en)]; }).length;
    var heardN = lv.items.filter(function(it){ return oqState().heard[oqKey(lv.id, it.en)]; }).length;
    var pct = Math.round(done / lv.items.length * 100);
    var full = done === lv.items.length;
    html += '<div class="oq-level' + (full ? " full" : "") + '" data-lid="' + lv.id + '">' +
      '<button class="oq-level-btn" type="button" onclick="oqOpen(\'' + String(lv.id).replace(/'/g, "") + '\')">' +
        '<span class="oq-emoji">' + lv.emoji + '</span>' +
        '<span class="oq-name">' + lv.name + '<small>' + lv.desc + '</small></span>' +
        '<span class="oq-meta">' + done + '/' + lv.items.length + ' 句' + (full ? ' 🏅' : '') + '</span>' +
        '<span class="oq-arrow">▾</span>' +
      '</button>' +
      '<div class="oq-bar"><span style="width:' + pct + '%"></span></div>' +
    '</div>';
  });
  /* 底部：我的口语本操作行（手动新建 / AI 生成） */
  html += '<div class="oq-actions">' +
    '<button class="oq-tool" type="button" onclick="oqNewLevelForm()">➕ 新建我的关卡</button>' +
    '<button class="oq-tool oq-tool-ai" type="button" onclick="oqAiForm()">🤖 AI 生成一关</button>' +
  '</div>';
  wrap.innerHTML = html;
}

/* ---------- 朗读控制（可中途停止） ---------- */
var oqSpeaking = false;
function oqStop(){
  try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch(e){}
  oqSpeaking = false; oqRenderSpeakBtn();
}
function oqRenderSpeakBtn(){
  var b = document.getElementById("oqStopBtn");
  if (b) b.style.display = oqSpeaking ? "" : "none";
}
/* 朗读一句（带读）；每次调用都从头读，可中途用“停止”停 */
function oqSpeak(txt){
  try {
    if (!window.speechSynthesis || !txt) return;
    if (oqSpeaking){ oqStop(); return; }
    var u = new SpeechSynthesisUtterance(txt);
    u.lang = "en-US"; u.rate = 0.8;
    u.onend = function(){ oqSpeaking = false; oqRenderSpeakBtn(); };
    u.onerror = function(){ oqSpeaking = false; oqRenderSpeakBtn(); };
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
    oqSpeaking = true; oqRenderSpeakBtn();
  } catch(e){}
}
/* 依次朗读整关全部句子（每句先读问句、再读回答） */
function oqSpeakAll(){
  try {
    if (!window.speechSynthesis || !OQ_SESSION) return;
    var list = [];
    OQ_SESSION.level.items.forEach(function(it){
      list.push(it.en);
      if (it.reply && it.reply.en) list.push(it.reply.en);
    });
    speechSynthesis.cancel();
    oqSpeaking = true; oqRenderSpeakBtn();
    var i = 0;
    function next(){
      if (i >= list.length){ oqSpeaking = false; oqRenderSpeakBtn(); return; }
      var t = list[i++];
      var u = new SpeechSynthesisUtterance(t);
      u.lang = "en-US"; u.rate = 0.8;
      u.onend = next; u.onerror = next;
      speechSynthesis.speak(u);
    }
    next();
  } catch(e){}
}

/* ---------- 弹窗：打开一关 ---------- */
var OQ_SESSION = null;

function oqOpen(lid){
  oqStop();
  var lv = oqFindLevel(lid);
  if (!lv) return;
  OQ_SESSION = { level: lv, repeat: false, rIdx: 0, custom: String(lv.id).indexOf("c") === 0 };
  oqRenderLevel();
  document.getElementById("oqDialogMask").classList.add("open");
  document.body.style.overflow = "hidden";
}

function oqClose(){
  oqStop();
  var mask = document.getElementById("oqDialogMask");
  if (mask) mask.classList.remove("open");
  document.body.style.overflow = "";
  OQ_SESSION = null;
  oqRender();
  if (typeof portalRenderTopbar === "function") portalRenderTopbar();
}

/* 老师带读一句，并记“已听” */
function oqLead(i){
  var lv = OQ_SESSION.level;
  var it = lv.items[i];
  if (!it) return;
  oqSpeak(it.en);
  oqState().heard[oqKey(lv.id, it.en)] = 1;
  saveS();
  oqRenderLevelMeta();
}
/* 朗读这一句的常用回答（有问有答） */
function oqLeadReply(i){
  var lv = OQ_SESSION.level;
  var it = lv.items[i];
  if (!it || !it.reply || !it.reply.en) return;
  oqSpeak(it.reply.en);
}

/* 我读了一遍：打卡“已跟读”，给小金币，就地更新这一句 */
function oqMarkSaid(i){
  var lv = OQ_SESSION.level;
  var it = lv.items[i];
  if (!it) return;
  var k = oqKey(lv.id, it.en);
  var st = oqState();
  var wasSaid = st.said[k];
  st.said[k] = 1;
  if (!wasSaid){
    st.coins += OQ_COIN_PER_SAY;
    saveS();
    if (typeof portalRenderTopbar === "function") portalRenderTopbar();
    oqRender();
    if (typeof baToast === "function") baToast("🎤 跟读 +1，继续保持！");
  } else {
    saveS();
  }
  var itemEl = document.getElementById("oqItem" + i);
  if (itemEl) itemEl.classList.add("said");
  var btn = document.getElementById("oqSay" + i);
  if (btn){ btn.classList.add("on"); btn.textContent = "✅ 已跟读"; }
  /* 该关是否全部跟读完成 */
  if (lv.items.every(function(x){ return oqState().said[oqKey(lv.id, x.en)]; })){
    if (typeof fireConfetti === "function") fireConfetti();
    if (typeof baToast === "function") baToast("🎉 这一关全部跟读完成！");
  }
}

/* 跟读模式：逐句大卡片带练 */
function oqToggleRepeat(){
  if (!OQ_SESSION) return;
  OQ_SESSION.repeat = !OQ_SESSION.repeat;
  OQ_SESSION.rIdx = 0;
  oqRenderLevel();
}
function oqRepeatNext(){
  if (!OQ_SESSION) return;
  OQ_SESSION.rIdx++;
  if (OQ_SESSION.rIdx >= OQ_SESSION.level.items.length){ OQ_SESSION.repeat = false; oqRenderLevel(); return; }
  oqRenderLevel();
}
function oqRepeatPrev(){
  if (!OQ_SESSION || OQ_SESSION.rIdx <= 0) return;
  OQ_SESSION.rIdx--;
  oqRenderLevel();
}

/* 重绘弹窗头部的进度文案（不打断朗读） */
function oqRenderLevelMeta(){
  var el = document.getElementById("oqLevelMeta");
  if (!el || !OQ_SESSION) return;
  var lv = OQ_SESSION.level;
  var done = lv.items.filter(function(it){ return oqState().said[oqKey(lv.id, it.en)]; }).length;
  var heardN = lv.items.filter(function(it){ return oqState().heard[oqKey(lv.id, it.en)]; }).length;
  el.textContent = "已听 " + heardN + " / " + lv.items.length + "　·　已跟读 " + done + " / " + lv.items.length;
}

function oqRenderLevel(){
  if (!OQ_SESSION) return;
  var lv = OQ_SESSION.level;
  var st = oqState();

  /* 跟读模式：一次一句大卡片 */
  if (OQ_SESSION.repeat){
    var i = OQ_SESSION.rIdx;
    var it = lv.items[i];
    var said = st.said[oqKey(lv.id, it.en)];
    document.getElementById("oqDialog").innerHTML =
      '<div class="oq-dlg-head">' +
        '<span class="oq-cap">🗣️ ' + lv.emoji + ' ' + lv.name + ' · 跟读 ' + (i + 1) + '/' + lv.items.length + '</span>' +
        '<button class="oq-stop" id="oqStopBtn" type="button" onclick="oqStop()" style="display:none">⏹ 停止</button>' +
        '<button class="oq-close" type="button" onclick="oqClose()">×</button>' +
      '</div>' +
      '<div class="oq-dlg-body">' +
        '<div class="oq-card-big">' +
          '<div class="oq-en">' + wqEsc(it.en) + '</div>' +
          '<div class="oq-zh">' + wqEsc(it.zh) + '</div>' +
          (it.note ? '<div class="oq-note">💡 ' + wqEsc(it.note) + '</div>' : '') +
          (it.reply && it.reply.en ?
            '<div class="oq-reply big-reply">' +
              '<span class="oq-reply-tag">💬 回答</span>' +
              '<div class="oq-en">' + wqEsc(it.reply.en) + '</div>' +
              '<div class="oq-zh">' + wqEsc(it.reply.zh || "") + '</div>' +
            '</div>' : '') +
        '</div>' +
        '<div class="oq-rep-btns">' +
          '<button class="oq-spk big" type="button" onclick="oqLead(' + i + ')">🔊 听老师读</button>' +
          (it.reply && it.reply.en ? '<button class="oq-spk big" type="button" onclick="oqLeadReply(' + i + ')">🔊 听回答</button>' : '') +
          '<button class="oq-say big ' + (said ? "on" : "") + '" type="button" id="oqSay' + i + '" onclick="oqMarkSaid(' + i + ')">' + (said ? "✅ 已跟读" : "🎤 我读了一遍") + '</button>' +
        '</div>' +
        '<div class="oq-rep-nav">' +
          (i > 0 ? '<button class="oq-nav" type="button" onclick="oqRepeatPrev()">← 上一句</button>' : '<span></span>') +
          '<button class="oq-nav" type="button" onclick="oqToggleRepeat()">退出跟读模式</button>' +
          (i < lv.items.length - 1 ? '<button class="oq-nav" type="button" onclick="oqRepeatNext()">下一句 →</button>' : '<button class="oq-nav" type="button" onclick="oqToggleRepeat()">完成 ✓</button>') +
        '</div>' +
        '<p class="oq-tip">先点「听老师读」，跟着小声读；读好了点「我读了一遍」打卡。</p>' +
      '</div>';
    return;
  }

  /* 列表模式：整关所有句子 */
  var isCustom = OQ_SESSION.custom;
  var items = lv.items.map(function(it, i){
    var said = st.said[oqKey(lv.id, it.en)];
    var replyHtml = "";
    if (it.reply && it.reply.en){
      replyHtml = '<div class="oq-reply">' +
        '<span class="oq-reply-tag">💬 回答</span>' +
        '<div class="oq-reply-line">' +
          '<div class="oq-en">' + wqEsc(it.reply.en) + '</div>' +
          '<div class="oq-zh">' + wqEsc(it.reply.zh || "") + '</div>' +
        '</div>' +
        '<button class="oq-spk sm" type="button" onclick="oqLeadReply(' + i + ')">🔊 听回答</button>' +
      '</div>';
    }
    return '<div class="oq-item' + (said ? " said" : "") + '" id="oqItem' + i + '">' +
      '<div class="oq-line">' +
        '<div class="oq-en">' + wqEsc(it.en) + '</div>' +
        '<div class="oq-zh">' + wqEsc(it.zh) + '</div>' +
      '</div>' +
      replyHtml +
      (it.note ? '<div class="oq-note">💡 ' + wqEsc(it.note) + '</div>' : '') +
      '<div class="oq-btns">' +
        '<button class="oq-spk" type="button" onclick="oqLead(' + i + ')">🔊 老师带读</button>' +
        '<button class="oq-say ' + (said ? "on" : "") + '" type="button" id="oqSay' + i + '" onclick="oqMarkSaid(' + i + ')">' + (said ? "✅ 已跟读" : "🎤 我读了一遍") + '</button>' +
        (isCustom ? '<button class="oq-del" type="button" onclick="oqDelSentence(' + i + ')">🗑 删这句</button>' : '') +
      '</div>' +
    '</div>';
  }).join("");

  document.getElementById("oqDialog").innerHTML =
    '<div class="oq-dlg-head">' +
      '<span class="oq-cap">🗣️ ' + lv.emoji + ' ' + lv.name + '</span>' +
      '<button class="oq-stop" id="oqStopBtn" type="button" onclick="oqStop()" style="display:none">⏹ 停止</button>' +
      '<button class="oq-close" type="button" onclick="oqClose()">×</button>' +
    '</div>' +
    '<div class="oq-dlg-body">' +
      '<div class="oq-level-meta" id="oqLevelMeta"></div>' +
      '<div class="oq-tools">' +
        '<button class="oq-tool" type="button" onclick="oqSpeakAll()">🔊 朗读全部</button>' +
        '<button class="oq-tool" type="button" onclick="oqToggleRepeat()">🎤 跟读模式</button>' +
        (isCustom ? '<button class="oq-tool" type="button" onclick="oqToggleAddForm()">➕ 加一句</button>' +
                    '<button class="oq-tool oq-tool-danger" type="button" onclick="oqDelLevel()">🗑 删掉这一关</button>' : '') +
      '</div>' +
      (isCustom ? '<div id="oqAddForm"></div>' : '') +
      '<div class="oq-list">' + items + '</div>' +
    '</div>';
  oqRenderLevelMeta();
}

/* ================= 我的口语本：手动新建关卡 / 加句 / 删句 / 删关 ================= */
function oqDialogShow(){
  document.getElementById("oqDialogMask").classList.add("open");
  document.body.style.overflow = "hidden";
}
function oqNewLevelForm(){
  oqStop();
  OQ_SESSION = null;
  document.getElementById("oqDialog").innerHTML =
    '<div class="oq-dlg-head">' +
      '<span class="oq-cap">✏️ 新建我的关卡</span>' +
      '<button class="oq-close" type="button" onclick="oqClose()">×</button>' +
    '</div>' +
    '<div class="oq-dlg-body">' +
      '<p class="oq-level-meta">先给这一关起个名字，保存后再点「➕ 加一句」把对话一句一句加进去。也可以直接用 🤖 AI 帮你生成。</p>' +
      '<div class="oq-form">' +
        '<label>关卡名字（必填）</label>' +
        '<input id="oqNewName" type="text" maxlength="20" placeholder="例如：聊放学一起回家">' +
        '<label>图标</label>' +
        '<select id="oqNewEmoji">' +
          '<option>💬</option><option>🏠</option><option>🎮</option><option>🍜</option><option>⚽</option>' +
          '<option>🚌</option><option>🌧</option><option>🎉</option><option>🐶</option><option>📚</option>' +
        '</select>' +
        '<label>一句话说明（选填）</label>' +
        '<input id="oqNewDesc" type="text" maxlength="40" placeholder="例如：约同学放学同路回家时说的英语">' +
        '<div class="oq-form-btns">' +
          '<button class="oq-spk big" type="button" onclick="oqCreateLevel()">保存并去加句子 →</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  oqDialogShow();
  setTimeout(function(){ var el = document.getElementById("oqNewName"); if (el) el.focus(); }, 50);
}
function oqCreateLevel(){
  var name = (document.getElementById("oqNewName").value || "").trim();
  if (!name){ if (typeof baToast === "function") baToast("先给关卡起个名字哦"); return; }
  var emoji = document.getElementById("oqNewEmoji").value || "💬";
  var desc = (document.getElementById("oqNewDesc").value || "").trim() || "我自己加的口语关卡";
  var lv = { id: "c" + Date.now(), name: name, emoji: emoji, desc: desc, scene: OQ_CUSTOM_SCENE, items: [] };
  oqCustomLoad().push(lv);
  oqCustomSave();
  OQ_SESSION = { level: lv, repeat: false, rIdx: 0, custom: true };
  oqRenderLevel();
  oqToggleAddForm(); /* 直接展开加句表单 */
  if (typeof baToast === "function") baToast("✅ 关卡建好了，加第一句吧！");
}
/* 「➕ 加一句」表单展开/收起 */
function oqToggleAddForm(){
  var box = document.getElementById("oqAddForm");
  if (!box) return;
  if (box.innerHTML){ box.innerHTML = ""; return; }
  box.innerHTML =
    '<div class="oq-form">' +
      '<label>英文句子（必填，不会的词可以先查词典）</label>' +
      '<input id="oqAddEn" type="text" placeholder="例如：Shall we walk home together?">' +
      '<label>中文意思</label>' +
      '<input id="oqAddZh" type="text" placeholder="例如：我们一起走路回家好吗？">' +
      '<label>💬 常用回答 · 英文（选填：有问就要有答）</label>' +
      '<input id="oqAddReplyEn" type="text" placeholder="例如：Sure, let\'s go!">' +
      '<label>💬 常用回答 · 中文</label>' +
      '<input id="oqAddReplyZh" type="text" placeholder="例如：好啊，走吧！">' +
      '<label>小贴士（选填：什么场合用）</label>' +
      '<input id="oqAddNote" type="text" placeholder="例如：放学约同学同路回家时说">' +
      '<div class="oq-form-btns">' +
        '<button class="oq-spk" type="button" onclick="oqAddSentence()">保存这句</button>' +
      '</div>' +
    '</div>';
  setTimeout(function(){ var el = document.getElementById("oqAddEn"); if (el) el.focus(); }, 50);
}
function oqAddSentence(){
  if (!OQ_SESSION || !OQ_SESSION.custom) return;
  var en = (document.getElementById("oqAddEn").value || "").trim();
  var zh = (document.getElementById("oqAddZh").value || "").trim();
  var replyEn = (document.getElementById("oqAddReplyEn").value || "").trim();
  var replyZh = (document.getElementById("oqAddReplyZh").value || "").trim();
  var note = (document.getElementById("oqAddNote").value || "").trim();
  if (!en){ if (typeof baToast === "function") baToast("英文句子还没填哦"); return; }
  var item = { en: en, zh: zh || "（自己补一句中文）", note: note };
  if (replyEn) item.reply = { en: replyEn, zh: replyZh || "" };
  OQ_SESSION.level.items.push(item);
  /* 同步回存储（OQ_SESSION.level 就是 S.oralCustom 里的引用，直接保存即可） */
  oqCustomSave();
  oqRenderLevel();
  oqToggleAddForm(); /* 收起表单 */
  if (typeof baToast === "function") baToast("🎤 加好了，点 🔊 听一听！");
}
function oqDelSentence(i){
  if (!OQ_SESSION || !OQ_SESSION.custom) return;
  var it = OQ_SESSION.level.items[i];
  if (!it) return;
  if (!window.confirm("删掉这句？\n" + it.en)) return;
  OQ_SESSION.level.items.splice(i, 1);
  oqCustomSave();
  oqRenderLevel();
}
function oqDelLevel(){
  if (!OQ_SESSION || !OQ_SESSION.custom) return;
  var lv = OQ_SESSION.level;
  if (!window.confirm("把「" + lv.name + "」整关删掉？里面的 " + lv.items.length + " 句都会删除。")) return;
  var arr = oqCustomLoad();
  var idx = arr.findIndex(function(x){ return String(x.id) === String(lv.id); });
  if (idx > -1) arr.splice(idx, 1);
  oqCustomSave();
  OQ_SESSION = null;
  oqClose();
}

/* ================= 🤖 AI 生成一关（硅基流动 OpenAI 兼容接口） ================= */
var OQ_AI_URL = "https://api.siliconflow.cn/v1/chat/completions";
var OQ_AI_MODEL = "Qwen/Qwen2.5-7B-Instruct";
var OQ_AI_DRAFT = null;

function oqAiForm(){
  oqStop();
  OQ_SESSION = null;
  var savedKey = "";
  try { savedKey = localStorage.getItem("oqAiKey") || ""; } catch(e){}
  document.getElementById("oqDialog").innerHTML =
    '<div class="oq-dlg-head">' +
      '<span class="oq-cap">🤖 AI 生成一关</span>' +
      '<button class="oq-close" type="button" onclick="oqClose()">×</button>' +
    '</div>' +
    '<div class="oq-dlg-body">' +
      '<p class="oq-level-meta">用中文写个场景（比如「和球友聊周末去游泳」），AI 就帮你生成 10 句对话，保存后和别的关卡一样能带读、打卡、跟读。<b>需要联网</b>，用的是硅基流动的接口（和你小升初 App 同一个 Key）。</p>' +
      '<div class="oq-form">' +
        '<label>API Key（只需填一次，存在本机）</label>' +
        '<input id="oqAiKey" type="password" placeholder="sk-..." value="' + wqEsc(savedKey) + '">' +
        '<label>想要什么样的对话？（中文描述）</label>' +
        '<textarea id="oqAiTopic" rows="3" placeholder="例如：放学后和巴基斯坦朋友约着打羽毛球，聊几点见面、带什么装备"></textarea>' +
        '<div class="oq-form-btns">' +
          '<button class="oq-spk big" type="button" id="oqAiGoBtn" onclick="oqAiGenerate()">✨ 生成对话</button>' +
        '</div>' +
      '</div>' +
      '<div id="oqAiOut"></div>' +
    '</div>';
  oqDialogShow();
  setTimeout(function(){ var el = document.getElementById("oqAiTopic"); if (el) el.focus(); }, 50);
}
/* 从模型回复里抠出 JSON（容错：去掉 ``` 代码块标记、取第一个 {...}） */
function oqParseAiJson(txt){
  try {
    var s = String(txt || "").replace(/```json/gi, "```").replace(/```/g, "");
    var a = s.indexOf("{"), b = s.lastIndexOf("}");
    if (a < 0 || b <= a) return null;
    var obj = JSON.parse(s.slice(a, b + 1));
    if (!obj || !Array.isArray(obj.items) || !obj.items.length) return null;
    obj.items = obj.items.filter(function(it){ return it && it.en && String(it.en).trim(); })
      .map(function(it){
        var o = { en: String(it.en).trim(), zh: String(it.zh || "").trim(), note: String(it.note || "").trim() };
        if (it.reply && it.reply.en) o.reply = { en: String(it.reply.en).trim(), zh: String(it.reply.zh || "").trim() };
        return o;
      });
    if (!obj.items.length) return null;
    obj.name = String(obj.name || "AI 生成的关卡").trim();
    obj.emoji = String(obj.emoji || "💬").trim().slice(0, 4) || "💬";
    obj.desc = String(obj.desc || "AI 按场景生成的口语对话").trim();
    return obj;
  } catch(e){ return null; }
}
function oqAiGenerate(){
  var keyEl = document.getElementById("oqAiKey");
  var topicEl = document.getElementById("oqAiTopic");
  var out = document.getElementById("oqAiOut");
  var key = (keyEl.value || "").trim();
  var topic = (topicEl.value || "").trim();
  if (!key){ out.innerHTML = '<div class="oq-ai-err">先填 API Key（硅基流动官网能免费申请）。Key 只保存在你本机浏览器里。</div>'; return; }
  if (!topic){ out.innerHTML = '<div class="oq-ai-err">先用中文写一句想要的对话场景。</div>'; return; }
  try { localStorage.setItem("oqAiKey", key); } catch(e){}
  var goBtn = document.getElementById("oqAiGoBtn");
  if (goBtn){ goBtn.disabled = true; goBtn.textContent = "⏳ 正在生成…"; }
  out.innerHTML = '<div class="oq-ai-loading">⏳ AI 正在编对话，几秒钟就好…</div>';

  var sys = "你是一位教中国小学生英语的口语老师。根据用户给出的场景，生成10句小学生能开口说的课堂/日常英语口语对话，必须是\"有问有答\"。" +
    "要求：en 用简单地道、10岁孩子说得出口的英文短句；zh 是中文翻译；note 是中文小贴士，说明使用场合（20字以内）；" +
    "reply 是这句话最常用的回答（{en:英文回答, zh:中文回答}），问句必须有回答，邀请/招呼也要配对方的回应，做到每句都能一问一答。" +
    '只输出 JSON，不要任何其他文字，格式：{"name":"关卡名(10字内)","emoji":"一个表情符号","desc":"一句话说明(20字内)","items":[{"en":"...","zh":"...","note":"...","reply":{"en":"...","zh":"..."}}]}，items 恰好10条。';
  fetch(OQ_AI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key },
    body: JSON.stringify({
      model: OQ_AI_MODEL,
      messages: [ { role: "system", content: sys }, { role: "user", content: topic } ],
      temperature: 0.7, max_tokens: 2000, stream: false
    })
  }).then(function(r){
    if (!r.ok) return r.text().then(function(t){
      throw new Error(r.status === 401 ? "API Key 不对或已过期（401）" : "接口报错 " + r.status + "：" + t.slice(0, 120));
    });
    return r.json();
  }).then(function(data){
    var content = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    var lv = oqParseAiJson(content);
    if (!lv) throw new Error("AI 返回的格式没读懂，点「重新生成」再试一次。");
    OQ_AI_DRAFT = lv;
    var prev = lv.items.map(function(it, i){
      return '<div class="oq-item"><div class="oq-line"><div class="oq-en">' + (i + 1) + '. ' + wqEsc(it.en) + '</div>' +
        '<div class="oq-zh">' + wqEsc(it.zh) + '</div></div>' +
        (it.reply && it.reply.en ? '<div class="oq-reply"><span class="oq-reply-tag">💬 回答</span><div class="oq-reply-line"><div class="oq-en">' + wqEsc(it.reply.en) + '</div><div class="oq-zh">' + wqEsc(it.reply.zh || "") + '</div></div></div>' : '') +
        (it.note ? '<div class="oq-note">💡 ' + wqEsc(it.note) + '</div>' : '') + '</div>';
    }).join("");
    out.innerHTML =
      '<div class="oq-ai-ok">✅ 生成好了！检查一下，满意就保存：</div>' +
      '<div class="oq-list">' + prev + '</div>' +
      '<div class="oq-form-btns">' +
        '<button class="oq-spk big" type="button" onclick="oqAiSave()">💾 保存到我的口语本</button>' +
        '<button class="oq-tool" type="button" onclick="oqAiGenerate()">🔄 重新生成</button>' +
      '</div>';
  }).catch(function(err){
    var msg = (err && err.message) || String(err);
    if (/Failed to fetch|NetworkError|CORS/i.test(msg)) msg = "连不上接口（要联网；如果一直失败，可能是浏览器拦截了跨域请求，把报错截图发我）";
    out.innerHTML = '<div class="oq-ai-err">❌ ' + wqEsc(msg) + '</div>';
    var b2 = document.getElementById("oqAiGoBtn");
    if (b2){ b2.disabled = false; b2.textContent = "✨ 生成对话"; }
  });
}
function oqAiSave(){
  if (!OQ_AI_DRAFT) return;
  var lv = {
    id: "c" + Date.now(),
    name: OQ_AI_DRAFT.name, emoji: OQ_AI_DRAFT.emoji, desc: OQ_AI_DRAFT.desc,
    scene: OQ_CUSTOM_SCENE, items: OQ_AI_DRAFT.items.slice()
  };
  oqCustomLoad().push(lv);
  oqCustomSave();
  OQ_AI_DRAFT = null;
  oqClose();
  oqOpen(lv.id);
  if (typeof baToast === "function") baToast("🤖 AI 关卡已保存，开练！");
}

function oqOnEnter(){ oqRender(); }
window.addEventListener("load", function(){ if (document.getElementById("oqLevels")) oqRender(); });
