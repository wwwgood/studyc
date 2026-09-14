/* 验证：考点分布标签可点击定位（尤其是「❓ 未识别」），并能逐题跳转、改完自动更新
 * 用法：node build/test-kp-locate.js
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
w.eval(bankCode);
w.baRender();

/* 3 道题：1 道能识别考点，2 道识别不出来（中文题，英文考点库命中不了） */
const sample = [
  "1. There are some ___ on the table.",
  "A. tomato   B. tomatos   C. tomatoes   D. tomatoos",
  "答案：C",
  "解析：以辅音字母+o结尾的名词变复数加es。",
  "",
  "2. 下面哪个数最大？",
  "A. 11   B. 20   C. 9   D. 15",
  "答案：B",
  "",
  "3. 下列词语中没有错别字的一项是？",
  "A. 穿流不息   B. 川流不息   C. 穿留不息   D. 川留不息",
  "答案：B"
].join("\n");

console.log("\n【场景1】考点分布渲染出可点击的「未识别」标签");
w.document.getElementById("baPasteText").value = sample;
w.baParseAndPreview();
const qs = w.document.getElementById("baPreview")._questions;
ok(qs.length === 3, "解析出3道题", "实际 " + qs.length);
const unknownChip = w.document.querySelector(".ba-kp-chip.unknown");
ok(!!unknownChip, "出现「未识别」标签");
ok(/未识别 ×2/.test(unknownChip ? unknownChip.textContent : ""), "显示未识别 ×2",
   unknownChip ? unknownChip.textContent : "无");
ok(!!unknownChip && /baLocateKp/.test(unknownChip.getAttribute("onclick") || ""), "标签已挂点击事件",
   unknownChip ? unknownChip.getAttribute("onclick") : "");
const knownChips = w.document.querySelectorAll(".ba-kp-chip:not(.unknown)");
ok(knownChips.length >= 1, "已识别考点也有标签（同样可点）", "实际 " + knownChips.length);

console.log("\n【场景2】点击「未识别」→ 定位到未识别题目");
unknownChip.click();
let focusState = w.BA_KP_FOCUS;
ok(focusState.key === "__unknown__", "定位键=未识别", String(focusState.key));
ok(JSON.stringify(focusState.idxs) === "[1,2]", "命中第2、3题（下标1,2）", JSON.stringify(focusState.idxs));
const item1 = w.document.getElementById("ba-item-1");
const item2 = w.document.getElementById("ba-item-2");
ok(item1.classList.contains("ba-item-focus"), "第2题被高亮");
ok(item2.classList.contains("ba-item-focus"), "第3题被高亮");
ok(item1.classList.contains("ba-item-focus-cur"), "当前停在第2题");
const nav = w.document.getElementById("baKpNav");
ok(nav && nav.style.display !== "none", "导航条显示");
ok(/第 1 \/ 2 道/.test(nav.textContent), "导航条显示 第1/2道", nav.textContent.replace(/\s+/g, " "));

console.log("\n【场景3】下一处 / 上一处 跳转");
w.baKpFocusStep(1);
ok(w.document.getElementById("ba-item-2").classList.contains("ba-item-focus-cur"), "跳到第3题");
ok(!w.document.getElementById("ba-item-1").classList.contains("ba-item-focus-cur"), "第2题取消当前态");
ok(/第 2 \/ 2 道/.test(w.document.getElementById("baKpNav").textContent), "导航条显示 第2/2道");
w.baKpFocusStep(1);
ok(w.document.getElementById("ba-item-1").classList.contains("ba-item-focus-cur"), "再下一处回到第2题（循环）");
w.baKpFocusStep(-1);
ok(w.document.getElementById("ba-item-2").classList.contains("ba-item-focus-cur"), "上一处回到第3题");

console.log("\n【场景4】用「手动归类」补考点后，未识别减少并移出定位");
const sel2 = w.document.getElementById("ba-item-2").querySelector(".ba-kp-select");
ok(!!sel2, "第3题有手动归类下拉");
const firstRealOpt = Array.prototype.find.call(sel2.options, o => o.value);
sel2.value = firstRealOpt.value;
sel2.dispatchEvent(new w.Event("change"));
ok(w.BA_KP_FOCUS.idxs.length === 1, "定位集合剩1道", JSON.stringify(w.BA_KP_FOCUS.idxs));
const chipAfter = w.document.querySelector(".ba-kp-chip.unknown");
ok(!!chipAfter && /未识别 ×1/.test(chipAfter.textContent), "未识别计数变 ×1",
   chipAfter ? chipAfter.textContent : "已消失");
ok(!w.document.getElementById("ba-item-2").classList.contains("ba-item-focus"),
   "已修好的题移出高亮");

console.log("\n【场景5】把最后一道也补上 → 未识别标签消失、导航收起");
const target = w.BA_KP_FOCUS.idxs[0];
const selLast = w.document.getElementById("ba-item-" + target).querySelector(".ba-kp-select");
const optLast = Array.prototype.find.call(selLast.options, o => o.value);
selLast.value = optLast.value;
selLast.dispatchEvent(new w.Event("change"));
ok(!w.document.querySelector(".ba-kp-chip.unknown"), "未识别标签已消失");
ok(w.document.getElementById("baKpNav").style.display === "none", "导航条收起");
ok(w.BA_KP_FOCUS.idxs.length === 0, "定位集合清空");

console.log("\n【场景6】点击已识别考点标签也能定位");
const chipKnown = w.document.querySelector(".ba-kp-chip:not(.unknown)");
ok(!!chipKnown, "存在已识别考点标签");
if (chipKnown){
  chipKnown.click();
  ok(w.BA_KP_FOCUS.key !== "__unknown__" && w.BA_KP_FOCUS.idxs.length >= 1,
     "定位到该考点的题目", JSON.stringify(w.BA_KP_FOCUS));
}
w.baKpFocusClear();
ok(w.BA_KP_FOCUS.idxs.length === 0 && w.document.querySelectorAll(".ba-item-focus").length === 0,
   "清除定位后无残留高亮");

console.log("\n===== 结果：" + pass + " 通过 / " + fail + " 失败 =====");
process.exit(fail === 0 ? 0 : 1);
