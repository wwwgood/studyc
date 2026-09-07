const fs = require("fs");
const html = fs.readFileSync("dist/index.html", "utf8");
const checks = [
  ["baSmartParse 函数", html.includes("function baSmartParse")],
  ["baGuessSubject 函数", html.includes("function baGuessSubject")],
  ["baGuessQType 函数", html.includes("function baGuessQType")],
  ["baSplitBigBlocks 函数", html.includes("function baSplitBigBlocks")],
  ["baSplitSmallQuestions 函数", html.includes("function baSplitSmallQuestions")],
  ["baParseOneQuestion 函数", html.includes("function baParseOneQuestion")],
  ["baApplySubject 函数", html.includes("function baApplySubject")],
  ["BA_QTYPE_LABELS", html.includes("BA_QTYPE_LABELS")],
  ["题型标签CSS", html.includes(".ba-qtype-tag")],
  ["题型摘要CSS", html.includes(".ba-type-summary")],
  ["应用科目按钮CSS", html.includes(".ba-auto-subject-btn")],
  ["百度额度已修正", html.includes("个人免费额度500次")],
  ["baClearAPI 已移除", !html.includes("baClearAPI")],
  ["ba-panel CSS 已删", !html.includes(".ba-panel{display:none;}")],
  ["am[1]语法正确", html.includes("am[1].toUpperCase().charCodeAt(0) - 65")]
];
let fail = 0;
checks.forEach(c => { console.log((c[1] ? "PASS" : "FAIL") + " - " + c[0]); if (!c[1]) fail++; });
process.exit(fail ? 1 : 0);
