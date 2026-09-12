/* 验证作文训练列表：展开/收起 + 标题不截断 */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("C:/Users/zb/.workbuddy/binaries/node/workspace/node_modules/jsdom");

function rd(p){ return fs.readFileSync(path.join("E:/htdocs/studyc/cpp-adventure", p), "utf8"); }

const dom = new JSDOM(
  '<!DOCTYPE html><body><div id="wqTotalBar"></div><div id="wqTotalTxt"></div>' +
  '<div id="wqCoins"></div><div id="wqBooks"></div>' +
  '<div id="wqDialogMask"></div><div id="wqDialog"></div></body>',
  { url: "http://localhost/", runScripts: "dangerously" }
);
const w = dom.window;
w.eval('var S={writing:{done:{},coins:0,mywork:{}}}; function saveS(){};');
w.eval(rd("src/scripts/data/english-writing.js"));
w.eval(rd("src/scripts/data/english-writing-zh.js"));
w.eval(rd("src/scripts/modules/writing-quest.js"));

let pass = 0, fail = 0;
function ok(cond, msg){ if (cond){ pass++; console.log("✅ " + msg); } else { fail++; console.log("❌ " + msg); } }

w.wqRender();
const bid = w.WRITE_DATA.books[0].id;
const book = w.document.querySelector('[data-bid="' + bid + '"]');
const head = book.querySelector(".wq-book-head");
const arrow = w.document.getElementById("wqArrow" + bid);
const list = w.document.getElementById("wqList" + bid);

ok(list.hidden, "初始状态列表隐藏");
ok(arrow.textContent === "▾", "初始箭头向下");

head.click();
ok(!list.hidden, "点击 book head 后列表展开");
ok(arrow.textContent === "▴", "展开后箭头向上");

const firstTitle = list.querySelector(".wq-title");
ok(firstTitle, "展开后有标题元素");
const titleStyle = w.getComputedStyle(firstTitle);
ok(titleStyle.whiteSpace !== "nowrap", "标题允许换行显示完整");

const collapseBtn = list.querySelector(".wq-collapse");
ok(collapseBtn, "展开后有「收起本类」按钮");

collapseBtn.click();
ok(list.hidden, "点击收起按钮后列表隐藏");
ok(arrow.textContent === "▾", "收起后箭头向下");

head.click();
ok(!list.hidden, "再次展开");
head.click();
ok(list.hidden, "再次点击 book head 可收起");

console.log("\n===== 作文列表测试：" + pass + " 通过 / " + fail + " 失败 =====");
process.exit(fail ? 1 : 0);
