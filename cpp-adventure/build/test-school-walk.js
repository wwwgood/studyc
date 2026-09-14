/* 验证：解析页逐行讲解（walk）渲染 —— 一行代码配一句解析 */
const fs = require("fs");
const path = require("path");
const { JSDOM } = (() => { try { return require("jsdom"); } catch (e) { return require(path.join("C:/Users/zb/.workbuddy/binaries/node/workspace", "node_modules", "jsdom")); } })();

let pass = 0, fail = 0;
function ok(cond, msg){ if (cond){ pass++; console.log("  ✅ " + msg); } else { fail++; console.log("  ❌ " + msg); } }

const html = fs.readFileSync(path.join(__dirname, "..", "dist", "index.html"), "utf8");
const vc = new (require("jsdom").VirtualConsole)();
const dom = new JSDOM(html, { runScripts: "dangerously", url: "http://localhost/", virtualConsole: vc, pretendToBeVisual: true });
const { window } = dom;
const { document } = window;

// 切到信息学 > 学校练习
const schoolTab = document.querySelector('[data-tab="school"], #tab-school, [onclick*="school"]');
if (schoolTab) schoolTab.click();

setTimeout(() => {
  console.log("== 学校练习：解析页逐行讲解 ==");
  // 打开 0201
  if (typeof window.schOpen === "function") window.schOpen("0201");
  // 切到解析页签
  if (typeof window.schSetTab === "function") window.schSetTab("ex");

  const walkBox = document.querySelector(".sch-walk");
  ok(!!walkBox, "解析页出现逐行讲解块 .sch-walk");

  const rows = document.querySelectorAll(".sch-walk-row");
  ok(rows.length === 6, "0201 共 6 行代码 → 6 行讲解（实际 " + rows.length + "）");

  const firstCode = document.querySelector(".sch-walk-row .sch-walk-code");
  ok(firstCode && firstCode.textContent.indexOf("#include <iostream>") >= 0, "第 1 行代码 = #include <iostream>（代码原样显示）");

  const firstExp = document.querySelector(".sch-walk-row .sch-walk-exp");
  ok(firstExp && firstExp.textContent.indexOf("工具箱") >= 0, "第 1 行解析 = 工具箱说明");

  // 每行都有代码 + 解析，一一配对
  let allPaired = true;
  rows.forEach(r => {
    const c = r.querySelector(".sch-walk-code"), e = r.querySelector(".sch-walk-exp");
    if (!c || !e || !c.textContent.trim() || !e.textContent.trim()) allPaired = false;
  });
  ok(allPaired, "每一行都是「代码 + 解析」成对出现");

  // 逐行序号 1..6
  const lns = Array.from(document.querySelectorAll(".sch-walk-row .sch-walk-ln")).map(x => x.textContent.trim());
  ok(lns.join(",") === "1,2,3,4,5,6", "行号序号 1~6 连续（实际 " + lns.join(",") + "）");

  // 抽查其他题：0401（交换，11 行代码）和 0505（空格陷阱）
  window.schOpen("0401"); window.schSetTab("ex");
  const rows0401 = document.querySelectorAll(".sch-walk-row");
  ok(rows0401.length === 13, "0401 共 13 行代码 → 13 行讲解（实际 " + rows0401.length + "）");
  const exps0401 = Array.from(rows0401).map(r => r.querySelector(".sch-walk-exp").textContent);
  ok(exps0401.some(t => t.indexOf("A 倒空") >= 0), "0401 讲解含「A 倒空」三步曲");
  ok(exps0401.some(t => t.indexOf("可乐杯") >= 0), "0401 讲解含「可乐杯」比喻");

  window.schOpen("0505"); window.schSetTab("ex");
  const exps0505 = Array.from(document.querySelectorAll(".sch-walk-row .sch-walk-exp")).map(x => x.textContent);
  ok(exps0505.some(t => t.indexOf("220") >= 0), "0505 讲解含空格陷阱（220）");

  // 全部 19 题都有 walk
  let withWalk = 0;
  window.SCHOOL_LESSONS[0].problems.forEach(p => {
    if (p.analysis.some(b => b[0] === "walk")) withWalk++;
  });
  ok(withWalk === 19, "19 题全部带逐行讲解（实际 " + withWalk + "）");

  console.log("\n结果: " + pass + " 通过, " + fail + " 失败");
  process.exit(fail ? 1 : 0);
}, 300);
