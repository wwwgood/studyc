/* 端到端验证：英语模块本轮修复
 *  1. 延迟装载：load 后 engEnsureData 已把全部英语数据装好（EQ_DATA/VOCAB_DATA/PAPER1000_DATA 可用）
 *  2. 选择填空接回：页签 → 子视图 → 刷题 → 答错进错题本(blank) → 看答案跳过也进错题本
 *  3. 1000题独立子视图：页签高亮 + p1000Panel 渲染章节行
 *  4. 专项试卷独立子视图：eqSubPapers 可见
 *  5. 「不会做看答案」：语法 eqPeek 入错题本且标记 skipped
 *  6. 专题真题 teSkip：跳过的题进错题本（不再无声丢题）
 *  7. 错题本：blank 分组显示 + 跳过次数徽章 + 重做排序（错多优先）
 */
const fs = require("fs");
const path = require("path");
const { JSDOM } = (() => { try { return require("jsdom"); } catch (e) { return require(path.join("C:/Users/zb/.workbuddy/binaries/node/workspace", "node_modules", "jsdom")); } })();

let pass = 0, fail = 0;
function ok(cond, msg){ if (cond){ pass++; console.log("  ✅ " + msg); } else { fail++; console.log("  ❌ " + msg); } }

const html = fs.readFileSync(path.join(__dirname, "..", "dist", "index.html"), "utf8");
const dom = new JSDOM(html, { runScripts: "dangerously", url: "http://localhost/", pretendToBeVisual: true });
const { window } = dom;
const { document } = window;

setTimeout(() => {
  const w = window;
  console.log("== 延迟装载 ==");
  ok(Array.isArray(w.EQ_DATA && w.EQ_DATA.lessons) && w.EQ_DATA.lessons.length > 100, "EQ_DATA 已装载（" + (w.EQ_DATA ? w.EQ_DATA.lessons.length : 0) + " 例，含第13章综合模拟）");
  ok(w.VOCAB_DATA && w.VOCAB_DATA.units && w.VOCAB_DATA.units.length > 0, "VOCAB_DATA 已装载");
  ok(w.PAPER1000_DATA && w.PAPER1000_DATA.chapters && w.PAPER1000_DATA.chapters.length > 0, "PAPER1000_DATA 已装载");
  ok(w.READ_DATA && w.WRITE_DATA && w.EXAM_DATA, "READ/WRITE/EXAM_DATA 已装载");
  ok(typeof w.engEnsureData === "function", "engEnsureData 可用");

  console.log("== 选择填空接回 ==");
  w.eqSwitchTab("blank");
  const blankBox = document.getElementById("eqSubBlank");
  ok(blankBox && blankBox.style.display !== "none", "eqSubBlank 子视图可见");
  ok(blankBox.innerHTML.indexOf("开始刷题") >= 0 && blankBox.innerHTML.indexOf("语法章节") >= 0, "选择填空面板已渲染（共题数+开始按钮）");
  const blankTab = document.querySelector('.eq-tab[data-tab="blank"]');
  ok(blankTab && blankTab.classList.contains("active"), "选择填空页签高亮");

  w.bqStartAll();
  ok(document.getElementById("bqDialogMask").classList.contains("open"), "刷题弹窗打开");
  w.bqShowQuestion();
  const bqQ = w.BLANK_QUESTIONS[w.bqQueue[w.bqPos]];
  const wrongIdx = (bqQ.ans + 1) % bqQ.opts.length;
  const bqBtns = document.querySelectorAll("#bqDialog .bq-opt");
  ok(bqBtns.length === bqQ.opts.length, "选项渲染正常（" + bqBtns.length + " 项）");
  bqBtns[wrongIdx].click();
  ok(w.S.errBook && w.S.errBook.items.some(it => it.module === "blank"), "答错自动进错题本（blank 模块）");
  ok(document.getElementById("aoMask") && document.getElementById("aoMask").classList.contains("open"), "答错后统一答案浮层打开");
  ok(document.getElementById("aoMask").innerHTML.indexOf("我已看懂") >= 0, "浮层带解析和「我已看懂」门禁");
  if (typeof w.aoReadOk === "function") w.aoReadOk();
  w.aoReady = true; w.aoNext();
  /* 第二题：直接看答案（peek）*/
  w.bqPeek();
  const skipped = w.S.errBook.items.filter(it => it.module === "blank" && it.skips > 0);
  ok(skipped.length > 0, "「不会做看答案」进错题本且标记跳过次数");
  if (typeof w.aoReadOk === "function") w.aoReadOk();
  w.aoReady = true; w.aoNext();
  w.bqClose();

  console.log("== 1000题 / 专项试卷 子视图 ==");
  w.eqSwitchTab("p1000");
  const p1000Box = document.getElementById("eqSubP1000");
  ok(p1000Box && p1000Box.style.display !== "none", "1000题子视图可见");
  ok(document.querySelectorAll("#p1000Panel .p1000-row").length > 0, "1000题章节行已渲染（" + document.querySelectorAll("#p1000Panel .p1000-row").length + " 章）");
  ok((document.querySelector('.eq-tab[data-tab="p1000"]') || {}).classList && document.querySelector('.eq-tab[data-tab="p1000"]').classList.contains("active"), "1000题页签高亮（不再是弹窗）");
  ok(!document.getElementById("teDialogMask").classList.contains("open"), "1000题不再挤占专题真题弹窗");
  w.eqSwitchTab("papers");
  const papersBox = document.getElementById("eqSubPapers");
  ok(papersBox && papersBox.style.display !== "none" && !!document.getElementById("ppPanel"), "专项试卷独立子视图可见（与真题演练分离）");
  w.eqSwitchTab("exam");
  ok(document.getElementById("xqPapers") && document.getElementById("xqPapers").innerHTML.length > 0, "真题演练子视图只剩真题列表（专项试卷已迁走）");

  console.log("== 语法「不会做看答案」 ==");
  const ebBefore = (w.S.errBook ? w.S.errBook.items.length : 0);
  w.eqOpen("n1");
  w.eqStartQuiz();
  ok(!!document.querySelector("#eqDialog .eq-again-btn"), "语法题面有「不会做，看答案」按钮");
  w.eqPeek();
  const ebAfter = w.S.errBook.items.length;
  ok(ebAfter === ebBefore + 1, "eqPeek 入错题本（" + ebBefore + " → " + ebAfter + "）");
  ok(w.EQ_SESSION.wrong === 1, "跳过按未做对计（影响星级，但不无声丢题）");
  ok(document.getElementById("aoMask").classList.contains("open"), "看答案浮层打开");
  if (typeof w.aoReadOk === "function") w.aoReadOk();
  w.aoReady = true; w.aoNext();
  ok(w.EQ_SESSION.idx === 1, "看完答案正常进下一题");
  w.eqClose();

  console.log("== 专题真题 teSkip ==");
  w.topicExamOpen("grammar", null, "名词辨认", "名词辨认");
  if (w.TE_SESSION && w.TE_SESSION.questions.length){
    const ebCnt = w.S.errBook.items.length;
    const teQ = w.TE_SESSION.questions[w.TE_SESSION.idx];
    const teQText = teQ.q || teQ.passage || "";
    const findTe = () => w.S.errBook.items.filter((it) => it.module === "grammar" && it.q === teQText)[0];
    const before = findTe();
    const beforeSkips = before ? (before.skips || 0) : -1;
    w.teSkip();
    const after = findTe();
    /* 语义：跳过的题必须留下痕迹——新题建条目（skips=1），旧题累加 skips（去重不重复建） */
    const expectSkips = beforeSkips < 0 ? 1 : beforeSkips + 1;
    ok(!!after && (after.skips || 0) === expectSkips,
       "teSkip 跳过的题记入错题本（skips " + (beforeSkips < 0 ? "新建" : beforeSkips) + " → " + (after ? after.skips : "无") + "）");
    ok(w.S.errBook.items.length === ebCnt + (before ? 0 : 1),
       "错题本条目数正确（新题 +1 / 已存在则去重，不重复建条目）");
    ok(document.getElementById("aoMask").classList.contains("open"), "跳过后弹出答案浮层");
    if (typeof w.aoReadOk === "function") w.aoReadOk();
    w.aoReady = true; w.aoNext();
  } else {
    console.log("  (题库无名词辨认真题，跳过 teSkip 用例)");
  }
  w.teClose && w.teClose();

  console.log("== 错题本 ==");
  w.eqSwitchTab("errbook");
  const ebHtml = document.getElementById("ebList").innerHTML;
  ok(ebHtml.indexOf("选择填空") >= 0, "错题本有「选择填空」分组");
  ok(ebHtml.indexOf("不会做") >= 0, "错题条目显示「👀 不会做 N 次」");
  const ebStatsTxt = document.getElementById("ebTotalTxt").textContent;
  ok(/待复习/.test(ebStatsTxt) && /已学会/.test(ebStatsTxt), "错题本统计正常（" + ebStatsTxt.trim() + "）");

  console.log("== 错题管理：不会做 vs 答错 语义分离 ==");
  /* 造一道「只跳过、从没答错」的题，count 必须保持 0，skips 才 +1 */
  w.errBookAdd("reading", { q: "语义分离测试题", o: ["a", "b"], a: 0, why: "x", source: "u", skipped: true });
  const onlySkip = w.S.errBook.items.filter((it) => it.q === "语义分离测试题")[0];
  ok(onlySkip && onlySkip.count === 0 && onlySkip.skips === 1, "首次跳过：count=0、skips=1（不把不会做算成答错）");
  w.errBookAdd("reading", { q: "语义分离测试题", o: ["a", "b"], a: 0, why: "x", source: "u", skipped: true });
  ok(onlySkip.count === 0 && onlySkip.skips === 2, "再次跳过：只累加 skips，count 仍为 0");
  w.errBookAdd("reading", { q: "语义分离测试题", o: ["a", "b"], a: 0, why: "x", source: "u" });
  ok(onlySkip.count === 1 && onlySkip.skips === 2, "真答错：只累加 count，skips 不受影响");
  ok(w.ebWeight(onlySkip) === 3, "ebWeight = count + skips = 3");

  console.log("== 错题管理：「不会做」筛选视角 ==");
  w.EB_FILTER = "skipped";
  w.ebRender();
  const skippedHtml = document.getElementById("ebList").innerHTML;
  ok(skippedHtml.indexOf("语义分离测试题") >= 0, "「不会做」筛选能列出有跳过记录的题");
  const skippedStats = w.ebStats();
  ok(skippedStats.skipped >= 1, "统计里 skipped=" + skippedStats.skipped + " 已单列");
  w.EB_FILTER = "all";
  w.ebRender();
  w.alert = function(){};   /* 空队列时的 alert 在 jsdom 里会炸，桩掉 */

  console.log("== 错题管理：「已学会」状态机（不留死角不删除）==");
  const demo = { status: "active", count: 1, skips: 0, correctStreak: 0 };
  ok(w.ebMarkCorrect(demo) === false && demo.status === "active", "连对 1 次：还没到「已学会」");
  w.ebMarkCorrect(demo);
  ok(w.ebMarkCorrect(demo) === true && demo.status === "learned" && demo.learnedAt > 0,
     "连对满 " + w.EB_LEARN_STREAK + " 次 → 标为「已学会」并记下时间");
  const cntBefore = demo.count;
  w.ebMarkWrong(demo);
  ok(demo.status === "active" && demo.correctStreak === 0 && demo.count === cntBefore + 1,
     "已学会后再答错 → 退回「待复习」、连对清零、错次 +1");

  console.log("== 错题管理：旧数据归一（沉没/已解决 → 已学会）==");
  const legacy1 = { module: "reading", q: "旧数据沉没题", status: "dormant" };
  const legacy2 = { module: "reading", q: "旧数据已解决题", status: "resolved" };
  w.S.errBook.items.push(legacy1, legacy2);
  w.ebState();
  ok(legacy1.status === "learned", "旧状态 dormant（沉没）归一为 learned（已学会）");
  ok(legacy2.status === "learned", "旧状态 resolved（已解决）归一为 learned（已学会）");

  console.log("== 错题管理：已学会 = 降频但不消失 ==");
  /* 把 demo 造进错题本，确保有 learned 样本 */
  w.S.errBook.items.push({ id: "ebDemo", module: "grammar", q: "已学会样例题", o: ["a", "b"], a: 0, why: "x",
                           count: 1, skips: 0, correctStreak: 3, status: "learned", learnedAt: 1 });
  w.ebRender();
  const listAll = document.getElementById("ebList").innerHTML;
  ok(listAll.indexOf("已学会样例题") >= 0, "已学会的题仍然显示在错题本列表里（默认「全部」）");
  ok(listAll.indexOf("✅ 已学会") >= 0, "已学会的题带「✅ 已学会」徽章");

  w.ebPracticeAll();
  ok(w.EB_SESSION.items.length > 0 && w.EB_SESSION.items.every((it) => w.ebNormStatus(it.status) === "active"),
     "「重做待复习」队列里不含已学会的题（降到不被反复打扰）");
  w.ebClose();

  w.ebPracticeLearned();
  ok(w.EB_SESSION.items.length > 0 && w.EB_SESSION.items.every((it) => w.ebNormStatus(it.status) === "learned"),
     "「复习已学会」只收已学会的题（想练随时能练）");
  w.ebClose();

  /* 手动剔除是唯一真正消失的途径 */
  w.ebRemove("ebDemo");
  ok(!w.S.errBook.items.some((it) => it.id === "ebDemo"), "手动 ✕ 才从错题本真正剔除");

  /* 重做排序：按总失败权重（答错+不会做）降序 */
  const firstItem = w.S.errBook.items.filter((it) => w.ebNormStatus(it.status) === "active")[0];
  firstItem.count = 5;
  w.ebPracticeAll();
  ok(w.EB_SESSION.items[0] === firstItem, "重做待复习按失败权重降序（最不会的排最前）");
  w.ebClose();

  console.log("== 公共工具 english-common（去重后语义锁定）==");
  const cntOn = (h) => (h.match(/class="on"/g) || []).length;
  ok(w.engStars(0) && cntOn(w.engStars(0)) === 0, "engStars(0) 三颗星全灭");
  ok(cntOn(w.engStars(2)) === 2, "engStars(2) 恰好两颗亮");
  ok(cntOn(w.engStars(99)) === 3, "engStars 越界不超三颗");
  const dm = {};
  w.engRecordStars(dm, "x", 2);
  const afterFirst = dm.x;
  w.engRecordStars(dm, "x", 1);
  ok(dm.x === afterFirst && dm.x === 2, "engRecordStars 只增不减（重做低分不覆盖高分）");
  let confetti = 0;
  const realConfetti = w.fireConfetti;
  w.fireConfetti = function(){ confetti++; };
  w.engRecordStars(dm, "y", 3);
  ok(confetti === 1, "≥2 星触发撒花一次");
  w.engRecordStars(dm, "z", 1);
  ok(confetti === 1, "1 星不撒花");
  w.fireConfetti = realConfetti;
  ok(w.engResultMsg(3, ["满", "中", "低"]) === "满", "engResultMsg 满星取第一档");
  ok(w.engResultMsg(1, ["满", "中", "低"]) === "低", "engResultMsg 一星取第三档");
  ok(w.engResultMsg(2, null).length > 0, "engResultMsg 缺省文案有兜底");

  console.log(fail === 0 ? "\n全部通过 ✅ (" + pass + ")" : "\n有失败 ❌ pass=" + pass + " fail=" + fail);
  process.exit(fail === 0 ? 0 : 1);
}, 600);
