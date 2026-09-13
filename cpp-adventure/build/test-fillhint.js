/* 验证：适当形式填空（空+括号提示词）不再被误判成判断题 + 考点不再误报复数
 * 复现案例：It's 2:00 in the afternoon. The children __________(make) a kite.
 * 用法：node build/test-fillhint.js
 */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require(path.join("C:/Users/zb/.workbuddy/binaries/node/workspace/node_modules/jsdom"));

const SRC = path.join(__dirname, "..", "src");
const bankCode = fs.readFileSync(path.join(SRC, "scripts", "modules", "bank-admin.js"), "utf8");

let pass = 0, fail = 0;
function ok(cond, name, extra){
  if (cond){ pass++; console.log("  ✅ " + name); }
  else { fail++; console.log("  ❌ " + name + (extra ? "  → " + extra : "")); }
}

const dom = new JSDOM(
  `<!DOCTYPE html><body>
    <div id="baDialogMask"><div id="baDialog"></div></div>
    <div id="baPreview"></div><div id="baToast"></div>
  </body>`,
  { url: "http://localhost/", runScripts: "dangerously" }
);
const w = dom.window;
w.eval("var QB_DATA = { questions: [] };");
/* qtypes 的题型标签桩（真机上由 qtypes.js 提供） */
w.eval('var QT_LABELS = { fill: "✏️ 填空题", cloze: "🧩 选词填空", reading: "📄 阅读理解", writing: "✍️ 作文", judge: "🟢 判断题" };');
w.eval(bankCode);
w.baRender();

function parse(text){
  w.document.getElementById("baPasteText").value = text;
  w.baParseAndPreview();
  return w.document.getElementById("baPreview")._questions || [];
}

console.log("\n【案例复现】kite 题（解析里带「正确/错误」字样）");
const kite = parse([
  "1. It's 2:00 in the afternoon. The children __________(make) a kite.",
  "答案：are making",
  "解析：考查动词适当形式。用 making 是错误的，children 后要用 are making 才正确。"
].join("\n"));
ok(kite.length === 1, "解析出 1 道题", "实际 " + kite.length);
ok(kite.length && kite[0].qType === "fill", "题型识别为填空(fill)，不是判断(judge)",
   kite.length ? kite[0].qType : "无");
ok(kite.length && (!kite[0].o || kite[0].o.join("") !== "正确错误"), "选项不是「正确/错误」");
ok(kite.length && kite[0].ansText && kite[0].ansText.indexOf("are making") > -1, "答案取到 are making",
   kite.length ? String(kite[0].ansText) : "");
const kn1 = kite.length ? w.baDetectKnowledge(kite[0].why, kite[0].q, kite[0].o || []) : null;
ok(!!kn1 && kn1.name === "现在进行时", "考点识别为「现在进行时」（It's + 钟点）",
   kn1 ? kn1.name : "无");

console.log("\n【考点纠偏】children 不再误触发「不规则名词复数」");
const kn2 = w.baDetectKnowledge("", "It's 2:00 in the afternoon. The children __________ (make) a kite.", []);
ok(!!kn2 && kn2.name !== "不规则名词复数", "带括号提示词时跳过名词复数规则",
   kn2 ? kn2.name : "无");
const kn3 = w.baDetectKnowledge("", "Look! The boys __________ (play) football.", []);
ok(!kn3 || kn3.name.indexOf("复数") === -1, "括号提示词场景无复数误报", kn3 ? kn3.name : "无");
/* 普通选择题里 children 仍是复数考点（不受影响） */
const kn4 = w.baDetectKnowledge("", "There are five children in the room. ______ they your friends?", ["is", "are", "am", "be"]);
ok(!!kn4, "普通题干考点检测仍正常");

console.log("\n【真判断题】正确/错误两选项 → 判断题类型");
const judge = parse([
  "1. Beijing is the capital of China.",
  "A. 正确   B. 错误",
  "答案：A",
  "解析：北京是中国的首都。"
].join("\n"));
ok(judge.length >= 1 && judge[0].qType === "judge", "选项列「A.正确 B.错误」识别为判断题(judge)",
   judge.length ? judge[0].qType : "无");
ok(judge.length >= 1 && (judge[0].type === "judge" ? "choice" : judge[0].type) === "choice",
   "渲染/判分层 judge 归一化为 choice（可正常作答）");
ok(judge.length >= 1 && (judge[0].a === 0), "答案 A → 正确");
const judgeWhy = judge.length >= 1 && judge[0].why;
ok(!!judgeWhy && judgeWhy.length > 0, "判断题解析保留", judgeWhy || "无");

/* 无选项、答案直接写 T 的极简格式：原样解析器按填空入库（判分时输入 T/正确均可匹配） */
const judge2 = parse([
  "1. There are four seasons in a year.",
  "答案：T"
].join("\n"));
ok(judge2.length >= 1 && judge2[0].qType === "fill" && /T/.test(String(judge2[0].ansText)),
   "无选项极简判断（答案：T）按填空入库，答案可输入判对",
   judge2.length ? judge2[0].qType + "/" + judge2[0].ansText : "无");

console.log("\n【大题标题兜底】判断大题下的括号提示词题改判填空");
const mixed = (function(){
  const t = [
    "四、判断题（正确的写T，错误的写F）",
    "1. It's 9:00 now. The girl __________ (dance) in the room.",
    "答案：is dancing"
  ].join("\n");
  return parse(t);
})();
ok(mixed.length >= 1 && mixed[0].qType === "fill", "判断大题下带 __________(dance) 的题按填空处理",
   mixed.length ? mixed[0].qType : "无");

console.log("\n【1000题扩展】适当形式填空 xd 批次");
const fs2 = require("fs");
global.document = { addEventListener(){} }; global.window = { addEventListener(){} };
eval(fs2.readFileSync(path.join(SRC, "scripts", "data", "english-paper-1000.js"), "utf8"));
const xds = PAPER1000_DATA.questions.filter(q => String(q.id).indexOf("xd-") === 0);
ok(PAPER1000_DATA.questions.length === 1033, "1000题总数 1033（1021 + 新增 12）",
   String(PAPER1000_DATA.questions.length));
ok(xds.length === 12, "xd 适当形式填空共 12 道", String(xds.length));
ok(xds.every(q => q.type === "fill" && w.BA_FILL_HINT_RE.test(q.q)), "12 题全部是 fill 且题干带空+括号提示词");
ok(xds.every(q => q.ansText && q.why), "12 题都有答案与解析");
const kiteQ = xds.find(q => q.id === "xd-001");
ok(!!kiteQ && kiteQ.ansText === "are making", "xd-001 是 kite 题的规范填空版（are making）");
ok(xds.every(q => q.topicId >= 1 && q.topicId <= 16), "topicId 都落在 1000题 章节范围内");

console.log("\n===== 适当形式填空解析测试：" + pass + " 通过 / " + fail + " 失败 =====");
process.exit(fail ? 1 : 0);
