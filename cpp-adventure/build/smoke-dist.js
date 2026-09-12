/* 交付件冒烟：直接跑 dist/index.html（单文件版），验证专题章节控件 + 导入归并 */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require(path.join("C:/Users/zb/.workbuddy/binaries/node/workspace/node_modules/jsdom"));

const dist = path.join(__dirname, "..", "dist", "index.html");
const html = fs.readFileSync(dist, "utf8");
const errs = [];
const dom = new JSDOM(html, {
  url: "http://localhost/",
  runScripts: "dangerously",
  pretendToBeVisual: true,
  virtualConsole: new (require(path.join("C:/Users/zb/.workbuddy/binaries/node/workspace/node_modules/jsdom")).VirtualConsole)()
    .on("jsdomError", e => errs.push(String(e.message || e)))
});
const w = dom.window;

function check(cond, name, extra){
  console.log((cond ? "  ✅ " : "  ❌ ") + name + (cond ? "" : "  → " + (extra || "")));
  return cond ? 0 : 1;
}

setTimeout(function(){
  let bad = 0;
  console.log("【dist 冒烟】");
  bad += check(typeof w.baRender === "function", "bank-admin 已加载进单文件");
  bad += check(typeof w.QB_DATA !== "undefined", "QB_DATA 已加载");

  w.baOpen();
  const modSel = w.document.getElementById("baModule");
  const topicSel = w.document.getElementById("baModuleTopic");
  bad += check(!!topicSel, "题库管理对话框渲染出专题章节下拉");
  bad += check(topicSel && topicSel.options.length === 13, "下拉含12章+不指定",
               topicSel ? String(topicSel.options.length) : "无元素");

  topicSel.value = "7";
  topicSel.dispatchEvent(new w.Event("change"));
  bad += check(topicSel.value === "7", "选中第7章后保持（故障已修复）", "实际 " + topicSel.value);

  w.document.getElementById("baPasteText").value = [
    "1. We go to school ___ Monday.",
    "A. in   B. on   C. at   D. for",
    "答案：B",
    "解析：具体星期几前用介词on。"
  ].join("\n");
  w.baParseAndPreview();
  const before = w.QB_DATA.questions.length;
  w.baDoImport();
  const added = w.QB_DATA.questions.slice(before);
  bad += check(added.length === 1, "导入1道题", "实际 " + added.length);
  bad += check(added[0] && added[0].module === "grammar" && added[0].topicId === 7,
               "归入 grammar / 第7章", added[0] ? added[0].module + "/" + added[0].topicId : "无");
  bad += check(added[0] && /具体星期几前用介词on/.test(added[0].why || ""), "解析已保存",
               added[0] ? added[0].why : "");
  bad += check(!!w.localStorage.getItem("ba_imported_questions"), "已持久化到 localStorage");
  bad += check(typeof w.baLocateKp === "function" && typeof w.baKpFocusStep === "function",
               "考点定位（点击未识别跳转）已打进单文件");

  // —— 作文训练：中英翻译 + 分步写作 ——
  bad += check(typeof w.WRITE_ZH !== "undefined" && typeof w.WRITE_DATA !== "undefined",
               "作文翻译数据已打进单文件");
  bad += check(w.WRITE_ZH && Object.keys(w.WRITE_ZH.s).length >= 900,
               "句库 " + (w.WRITE_ZH ? Object.keys(w.WRITE_ZH.s).length : 0) + " 条");
  bad += check(typeof w.wqStartWrite === "function", "分步写作函数已打进单文件");

  w.wqOpen("w1");
  const dlg = w.document.getElementById("wqDialog").innerHTML;
  bad += check(/中英对照/.test(dlg), "范文页有中英对照切换");
  bad += check(/开始写这篇/.test(dlg), "主按钮是「开始写这篇」");
  bad += check(/读懂检查/.test(dlg) && /选做/.test(dlg), "选择题已降级为选做");

  w.wqStartWrite();
  const nStep = w.WQ_SESSION.steps.length;
  bad += check(/第 1 \/ \d+ 步/.test(w.document.getElementById("wqDialog").innerHTML), "进入分步写作第1步");
  for (let i = 0; i < nStep; i++){
    const el = w.document.getElementById("wqInput");
    if (!el) break;
    el.value = w.WQ_SESSION.steps[i].en;
    el.dispatchEvent(new w.Event("input"));
    w.wqCheckStep();
    if (i === 0){
      bad += check(/写得不错/.test(w.document.getElementById("wqFeedback").innerHTML), "写完检查给正面反馈");
      bad += check(/wrt|下一步|完成/.test(w.document.getElementById("wqFeedback").innerHTML), "检查后出现推进按钮");
    }
    w.wqStepNext();
  }
  bad += check(/我的作文/.test(w.document.getElementById("wqDialog").innerHTML), "完成写作进入成果页");
  bad += check(!!(w.S.writing && w.S.writing.mywork && w.S.writing.mywork["w1"]), "我的作文已保存");

  console.log(bad === 0 ? "\n===== dist 冒烟全部通过 =====" : "\n===== 有 " + bad + " 项未通过 =====");
  process.exit(bad === 0 ? 0 : 1);
}, 3000);
