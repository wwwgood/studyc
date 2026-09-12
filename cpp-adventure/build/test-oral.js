/* 验证：口语训练模块 + 写作/阅读朗读可中途停止 + 词汇朗读 */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("C:/Users/zb/.workbuddy/binaries/node/workspace/node_modules/jsdom");

function rd(p){ return fs.readFileSync(path.join("E:/htdocs/studyc/cpp-adventure", p), "utf8"); }

const dom = new JSDOM(
  '<!DOCTYPE html><body>' +
  '<div id="wqTotalBar"></div><div id="wqTotalTxt"></div><div id="wqCoins"></div>' +
  '<div id="wqBooks"></div><div id="wqDialogMask"></div><div id="wqDialog"></div>' +
  '<div id="rqTotalBar"></div><div id="rqTotalTxt"></div><div id="rqCoins"></div>' +
  '<div id="rqPassages"></div><div id="rqDialogMask"></div><div id="rqDialog"></div>' +
  '<div id="oqTotalBar"></div><div id="oqTotalTxt"></div><div id="oqCoins"></div>' +
  '<div id="oqLevels"></div><div id="oqDialogMask"></div><div id="oqDialog"></div>' +
  '</body>',
  { url: "http://localhost/", runScripts: "dangerously" }
);
const w = dom.window;

/* 基础全局 + TTS 桩（speak 不自动触发 onend，便于测试“正在读”状态） */
w.eval('var S={writing:{done:{},coins:0,mywork:{}}}; function saveS(){};');
w.speechSynthesis = {
  cancel: function(){ w.__canceled = true; },
  speak: function(u){ w.__lastUtter = u; }
};
w.SpeechSynthesisUtterance = function(t){ this.text = t; this.lang = ""; this.rate = 1; this.onend = null; this.onerror = null; };

w.eval(rd("src/scripts/data/english-writing.js"));
w.eval(rd("src/scripts/data/english-writing-zh.js"));
w.eval(rd("src/scripts/modules/writing-quest.js"));
w.eval(rd("src/scripts/data/english-reading.js"));
w.eval(rd("src/scripts/modules/reading-quest.js"));
w.eval(rd("src/scripts/data/english-oral.js"));
w.eval(rd("src/scripts/modules/oral-quest.js"));

let pass = 0, fail = 0;
function ok(cond, msg){ if (cond){ pass++; console.log("✅ " + msg); } else { fail++; console.log("❌ " + msg); } }

/* ===== 1. 作文朗读可中途停止 + 词汇朗读 ===== */
w.wqOpen(w.WRITE_DATA.passages[0].id);
const spkBtn = w.document.getElementById("wqSpeakBtn");
ok(!!spkBtn, "作文朗读按钮已渲染(id=wqSpeakBtn)");
ok(spkBtn.textContent === "🔊 朗读范文", "初始按钮文案=朗读范文");
w.wqSpeak();
ok(w.wqSpeaking === true, "点朗读后 wqSpeaking=true（开始读）");
ok(spkBtn.textContent === "⏹ 停止朗读", "按钮变为「停止朗读」");
w.wqSpeak();
ok(w.wqSpeaking === false, "再点一次 wqSpeaking=false（中途可停）");
ok(spkBtn.textContent === "🔊 朗读范文", "按钮恢复「朗读范文」");

const p0 = w.WRITE_DATA.passages[0];
ok(p0.words && p0.words.length > 0, "范文有关键词可用于朗读");
w.wqSpeakWords();
ok(w.wqSpeaking === true, "点「朗读全部词汇」后 wqSpeaking=true");
w.wqStopSpeak();
ok(w.wqSpeaking === false, "wqStopSpeak 可停止词汇朗读");
/* 词汇 chip 含 🔊 图标 */
const chip = w.document.querySelector("#wqDialog .wq-word-chip .wq-spk");
ok(!!chip, "重点词汇 chip 含 🔊 图标（点一下可听）");

/* ===== 2. 阅读朗读可中途停止 ===== */
w.eval('RQ_SESSION = { passage: { body: "Hello class." } };');
w.rqSpeak();
ok(w.rqSpeaking === true, "阅读朗读 rqSpeaking=true（开始读）");
w.rqSpeak();
ok(w.rqSpeaking === false, "阅读朗读可中途停止");

/* ===== 3. 口语训练模块 ===== */
const sceneNames = [...new Set(w.ORAL_DATA.levels.map(l => l.scene))];
ok(w.ORAL_DATA && w.ORAL_DATA.levels.length === 15, "口语数据共 15 关（学校5 + 羽毛球7 + 家常3）");
ok(sceneNames.length === 3, "口语数据分 3 个场景（学校 / 羽毛球场 / 家常聊天）");
ok(w.ORAL_DATA.levels[5].scene && w.ORAL_DATA.levels[5].scene.indexOf("羽毛球") > -1, "第6关起是羽毛球场景");
ok(w.ORAL_DATA.levels.filter(l => l.scene.indexOf("羽毛球") > -1).length === 7, "羽毛球场景共 7 关");
ok(w.ORAL_DATA.levels.filter(l => l.scene.indexOf("家常") > -1).length === 3, "家常聊天场景共 3 关");
ok(w.ORAL_DATA.levels.slice(5).every(l => l.items.every(it => it.en && it.zh && it.note)), "羽毛球+家常 10 关每句都有 英文+中文+小贴士");
ok(w.ORAL_DATA.levels.every(l => l.items.every(it => it.reply && it.reply.en)), "全部 150 句都配了常用回答（有问有答）");
ok(w.ORAL_DATA.levels[2].items[0].reply.en === "It's a book.", "第3关首句回答=It's a book.");
ok(w.ORAL_DATA.levels[5].items[0].reply.en === "Nice to see you too!", "第6关首句回答=Nice to see you too!");
w.oqRender();
const levels = w.document.querySelectorAll("#oqLevels .oq-level");
ok(levels.length === w.ORAL_DATA.levels.length, "口语总览渲染 " + w.ORAL_DATA.levels.length + " 关");
const sceneHeads = w.document.querySelectorAll("#oqLevels .oq-scene-head");
ok(sceneHeads.length === 3, "总览页插入 3 条场景标题（分组显示）");

w.oqOpen(1);
const items = w.document.querySelectorAll("#oqDialog .oq-item");
ok(items.length === w.ORAL_DATA.levels[0].items.length, "打开第1关渲染全部 " + w.ORAL_DATA.levels[0].items.length + " 句");
const stopBtn = w.document.getElementById("oqStopBtn");
ok(stopBtn && stopBtn.style.display === "none", "未朗读时「停止」按钮隐藏");
ok(!!w.document.querySelector("#oqDialog .oq-reply"), "弹窗里渲染了「💬 回答」块（有问有答）");
ok(!!w.document.querySelector("#oqDialog .oq-reply-tag"), "回答块带「💬 回答」标签");
ok(typeof w.oqLeadReply === "function", "oqLeadReply（读回答）已定义");

w.oqLead(0);
ok(w.S.oral.heard["1:" + w.ORAL_DATA.levels[0].items[0].en] === 1, "老师带读后 heard 标记");

w.oqMarkSaid(0);
const k0 = "1:" + w.ORAL_DATA.levels[0].items[0].en;
ok(w.S.oral.said[k0] === 1, "跟读打卡后 said 标记");
ok(w.S.oral.coins === w.OQ_COIN_PER_SAY, "跟读打卡得 " + w.OQ_COIN_PER_SAY + " 金币");
ok(w.document.getElementById("oqItem0").classList.contains("said"), "该句就地高亮为已跟读");
ok(w.document.getElementById("oqSay0").textContent === "✅ 已跟读", "按钮文案变为「已跟读」");

w.oqToggleRepeat();
ok(w.OQ_SESSION.repeat === true, "进入跟读模式");
ok(!!w.document.querySelector("#oqDialog .oq-card-big"), "跟读模式显示逐句大卡片");
w.oqToggleRepeat();
ok(w.OQ_SESSION.repeat === false, "可退出跟读模式");

/* ===== 4. 羽毛球场景关卡可正常打开 ===== */
w.oqOpen(6);
const bItems = w.document.querySelectorAll("#oqDialog .oq-item");
ok(bItems.length === 10, "打开羽毛球第6关渲染 10 句");
ok(w.document.querySelector("#oqDialog .oq-cap").textContent.indexOf("球场见面") > -1, "弹窗标题是「球场见面 · 约他打球」");
w.oqMarkSaid(0);
ok(w.S.oral.said["6:" + w.ORAL_DATA.levels[5].items[0].en] === 1, "羽毛球关卡跟读打卡同样生效");

/* ===== 5. 术语/比赛/家常新关卡可打开 ===== */
w.oqOpen(10);
ok(w.document.querySelectorAll("#oqDialog .oq-item").length === 10, "打开「羽毛球术语」关渲染 10 句");
ok(w.document.querySelector("#oqDialog .oq-cap").textContent.indexOf("羽毛球术语") > -1, "术语关弹窗标题正确");
w.oqOpen(11);
ok(w.document.querySelector("#oqDialog .oq-cap").textContent.indexOf("比赛用语") > -1, "「比赛用语」关可打开");
w.oqOpen(13);
ok(w.document.querySelector("#oqDialog .oq-cap").textContent.indexOf("聊家人") > -1, "家常「聊家人和朋友」关可打开");
w.oqClose();

/* ===== 6. 我的口语本：手动新建 / 加句 / 删句 / 删关 ===== */
w.confirm = function(){ return true; };
w.oqNewLevelForm();
ok(!!w.document.getElementById("oqNewName"), "新建关卡表单已渲染");
w.document.getElementById("oqNewName").value = "聊游泳";
w.document.getElementById("oqNewDesc").value = "约同学去游泳";
w.oqCreateLevel();
ok(w.S.oralCustom && w.S.oralCustom.length === 1, "手动创建自定义关卡成功");
ok(w.OQ_SESSION && w.OQ_SESSION.custom === true, "创建后直接进入该关弹窗（自定义态）");
ok(!!w.document.getElementById("oqAddEn"), "创建后自动展开「加一句」表单");
w.document.getElementById("oqAddEn").value = "Can you swim?";
w.document.getElementById("oqAddZh").value = "你会游泳吗？";
w.document.getElementById("oqAddNote").value = "对方可能说 Yes, I can.";
w.oqAddSentence();
ok(w.S.oralCustom[0].items.length === 1, "加一句成功存入 S.oralCustom");
ok(w.document.querySelectorAll("#oqDialog .oq-item").length === 1, "弹窗重绘显示新加的句子");
ok(!!w.document.querySelector("#oqDialog .oq-del"), "自定义关卡的句子带「删这句」按钮");
ok(w.oqStats().total === 151, "总进度统计包含自定义句（150 内置 + 1 自定义）");
w.oqMarkSaid(0);
ok(w.S.oral.said[w.S.oralCustom[0].id + ":Can you swim?"] === 1, "自定义关卡跟读打卡同样生效");
w.oqDelSentence(0);
ok(w.S.oralCustom[0].items.length === 0, "删句成功");
w.oqDelLevel();
ok(w.S.oralCustom.length === 0, "删整关成功");

/* ===== 7. 🤖 AI 生成一关：表单 / JSON 解析 / 网络容错 ===== */
ok(typeof w.oqParseAiJson === "function", "oqParseAiJson 已定义");
const goodJson = '前置废话```json\n{"name":"聊游泳","emoji":"🏊","desc":"约同学游泳","items":[{"en":"Let\'s swim!","zh":"去游泳吧！","note":"约人"},{"en":"Hi","zh":"嗨","note":""}]}\n```后面废话';
const parsed = w.oqParseAiJson(goodJson);
ok(parsed && parsed.items.length === 2 && parsed.items[0].en === "Let's swim!", "能从带```代码块和前后废话的回复中解析出 JSON");
ok(parsed.items[1].note === "", "空 note 容错为空字符串");
ok(w.oqParseAiJson("抱歉我无法生成") === null, "纯文本回复返回 null");
ok(w.oqParseAiJson('{"name":"x","items":[]}') === null, "items 为空返回 null");
/* AI 回复带 reply 字段时能正确保留 */
const aiWithReply = '{"name":"聊游泳","emoji":"🏊","desc":"约游泳","items":[{"en":"Can you swim?","zh":"你会游泳吗？","note":"问能力","reply":{"en":"Yes, I can.","zh":"我会。"}}]}';
const pr = w.oqParseAiJson(aiWithReply);
ok(pr && pr.items[0].reply && pr.items[0].reply.en === "Yes, I can.", "oqParseAiJson 能保留 reply 字段（AI 也做到有问有答）");
w.oqAiForm();
ok(!!w.document.getElementById("oqAiKey") && !!w.document.getElementById("oqAiTopic"), "AI 生成表单已渲染（Key + 场景描述）");
w.document.getElementById("oqAiKey").value = "sk-test";
w.document.getElementById("oqAiTopic").value = "";
w.oqAiGenerate();
ok(!!w.document.querySelector("#oqAiOut .oq-ai-err"), "没填场景描述时给出提示（不发起请求）");
/* 模拟网络失败：验证 Key 已存本机 + 人话报错 */
w.fetch = function(){ return Promise.reject(new TypeError("Failed to fetch")); };
w.document.getElementById("oqAiKey").value = "sk-test-123";
w.document.getElementById("oqAiTopic").value = "约同学去游泳";
w.oqAiGenerate();
setTimeout(function(){
  ok(w.eval('localStorage.getItem("oqAiKey")') === "sk-test-123", "API Key 已存到本机 localStorage（只填一次）");
  const errTxt = (w.document.querySelector("#oqAiOut .oq-ai-err") || {}).textContent || "";
  ok(errTxt.indexOf("联网") > -1 || errTxt.indexOf("跨域") > -1, "网络失败时给出人话提示（联网/跨域）");
  console.log("\n===== 口语&朗读测试：" + pass + " 通过 / " + fail + " 失败 =====");
  process.exit(fail ? 1 : 0);
}, 120);
