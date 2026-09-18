/* 端到端验证：英语学习 → 名词岛 → 可数名词 → 练一练 全流程
 * 回归场景：答案浮层曾被 eq-mask(z 150000) 压住 → 用户只能点× → 会话被毁 → 下一题炸回主页。
 * 验证点：
 *  1. 答题后答案浮层打开（aoMask.open）
 *  2. dist 里 .ao-mask 层级 > .eq-mask 层级（防 CSS 回退）
 *  3. 点「我已看懂」→「下一题」→ 正常出下一题（不是退出/卡死）
 *  4. 答完最后一题 → 闯关结算页正常渲染（带再练/下一例按钮）
 *  5. 关闭学习弹窗（eqClose）后浮层/悬浮按钮被同步收掉，再点下一题不炸
 *  6. 全程无自动下载备份文件（URL.createObjectURL 未被 saveS 触发）
 */
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = (() => { try { return require("jsdom"); } catch (e) { return require(path.join("C:/Users/zb/.workbuddy/binaries/node/workspace", "node_modules", "jsdom")); } })();

let pass = 0, fail = 0;
function ok(cond, msg){ if (cond){ pass++; console.log("  ✅ " + msg); } else { fail++; console.log("  ❌ " + msg); } }

const html = fs.readFileSync(path.join(__dirname, "..", "dist", "index.html"), "utf8");

/* CSS 层级静态校验（jsdom 无布局，从 dist 文本里抓 z-index 比） */
function cssZ(src, sel){
  const m = src.match(new RegExp(sel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\{[^}]*z-index:(\\d+)"));
  return m ? parseInt(m[1], 10) : null;
}
const eqZ = cssZ(html, ".eq-mask"), aoZ = cssZ(html, ".ao-mask"), pillZ = cssZ(html, "#aoPill");
console.log("== 层级 ==");
ok(aoZ != null && eqZ != null && aoZ > eqZ, `.ao-mask(${aoZ}) > .eq-mask(${eqZ})（浮层盖住题目弹窗）`);
ok(pillZ != null && pillZ > eqZ, `#aoPill(${pillZ}) > .eq-mask(${eqZ})（悬浮下一题盖住弹窗）`);
ok(!/labExportDailyFile|studyc-backup-/.test(html), "dist 无每日自动下载备份逻辑（答题不再弹 json）");

/* 下载钩子：统计 createObjectURL 调用（答案浮层流程不应触发） */
let downloads = 0;
const vc = new VirtualConsole();
const dom = new JSDOM(html, { runScripts: "dangerously", url: "http://localhost/", virtualConsole: vc, pretendToBeVisual: true });
const { window } = dom;
const { document } = window;
const realCreate = window.URL.createObjectURL;
window.URL.createObjectURL = function(...a){ downloads++; return realCreate ? realCreate.apply(window.URL, a) : "blob:fake"; };
window.URL.revokeObjectURL = function(){};

setTimeout(() => {
  console.log("== 名词岛 → 可数名词 → 练一练 ==");
  const w = window;
  ok(typeof w.eqOpen === "function" && typeof w.eqStartQuiz === "function", "英语引擎加载正常");

  w.eqOpen("n2");            /* 可数名词 */
  w.eqStartQuiz();           /* 练一练 */
  ok(!!document.getElementById("eqDialogMask").classList.contains("open"), "题目浮窗打开");
  ok(w.EQ_SESSION && w.EQ_SESSION.quizList.length > 0, "出题正常（" + (w.EQ_SESSION ? w.EQ_SESSION.quizList.length : 0) + " 题）");

  const total = w.EQ_SESSION.quizList.length;
  let answeredAll = true;
  for (let i = 0; i < total; i++){
    const q = w.EQ_SESSION.quizList[w.EQ_SESSION.idx];
    const opts = document.querySelectorAll("#eqDialog .eq-opt");
    if (!opts.length){ answeredAll = false; break; }
    opts[q.a].click();       /* 全部答对 */
    /* 浮层应打开且盖住弹窗（z 值比较由 CSS 静态校验兜底，这里验 open 状态） */
    const aoMask = document.getElementById("aoMask");
    if (i === 0){
      ok(aoMask && aoMask.classList.contains("open"), "答题后答案浮层打开");
      ok(!!document.getElementById("aoNextBtn"), "浮层内有「下一题」按钮");
      ok(!!document.getElementById("aoBackBtn") || !!document.querySelector(".ao-backbtn"), "浮层内有「返回原题」按钮");
    }
    /* 模拟看完解析 + 倒计时走完 → 下一题 */
    if (typeof w.aoReadOk === "function") w.aoReadOk();
    w.aoReady = true;        /* 跳过倒计时 */
    w.aoNext();
    const after = w.EQ_SESSION;
    if (!after || after.idx !== i + 1){ answeredAll = false; console.log("  (在第 " + (i + 1) + " 题后中断)"); break; }
  }
  ok(answeredAll, total + " 题逐题推进全部正常（没有中途卡死/退出）");

  /* 通关结算页 */
  const dlg = document.getElementById("eqDialog") ? document.getElementById("eqDialog").innerHTML : "";
  ok(dlg.indexOf("闯关完成") >= 0, "答完出现「闯关完成」结算页（不是空白/退出）");
  ok(dlg.indexOf("再练一次") >= 0 && dlg.indexOf("下一例") >= 0, "结算页有「再练一次」「下一例」按钮（不是只能关闭）");
  ok(typeof w.eqState === "function" && w.eqState().coins > 0, "金币已入账（当前 " + (typeof w.eqState === "function" ? w.eqState().coins : 0) + " 🪙，积分没丢）");

  /* 关闭弹窗 → 浮层残留检查 */
  w.eqClose();
  const ao = document.getElementById("aoMask");
  ok(!(ao && ao.classList.contains("open")), "关闭学习弹窗后答案浮层已同步收掉（不再冒出下层浮窗）");
  ok(!document.getElementById("aoPill"), "悬浮「下一题」按钮已同步收掉");
  ok(downloads === 0, "全流程触发下载文件次数 = " + downloads + "（应为 0）");

  console.log(fail === 0 ? "\n全部通过 ✅ (" + pass + ")" : "\n有失败 ❌ pass=" + pass + " fail=" + fail);
  process.exit(fail === 0 ? 0 : 1);
}, 600);
