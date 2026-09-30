/* ---------------- 英语闯关引擎 · 公共工具 english-common.js ----------------
 * 收敛 6 个闯关引擎（eq/rq/vq/wq/oq/xq）里逐字重复的结算片段。
 * 原先「星级行 HTML」和「记录最好成绩 + 撒花」在 4 个引擎里各抄一份，
 * 改一处要改四处，容易漏。这里统一成两个函数。
 *
 *   engStars(n)                     → 三颗星行 HTML（前 n 颗亮）
 *   engRecordStars(doneMap, id, n)  → 只增不减地记录最好星级，并撒花 + 存档
 *   engResultMsg(stars, msgs)       → 按星级取三档文案
 *
 * 依赖：saveS() / fireConfetti() 由全局提供，缺失时静默跳过，不炸引擎。
 */

function engStars(stars){
  stars = stars || 0;
  var row = "";
  for (var i = 1; i <= 3; i++) row += '<span class="' + (i <= stars ? "on" : "") + '">★</span>';
  return row;
}

/* 记录最好成绩：星星只增不减（重做拿低分不会覆盖高分），≥2 星撒花。 */
function engRecordStars(doneMap, id, stars){
  if (!doneMap) return 0;
  var old = doneMap[id] || 0;
  if (stars > old) doneMap[id] = stars;
  if (typeof saveS === "function") saveS();
  if (stars >= 2 && typeof fireConfetti === "function") fireConfetti();
  return old > stars ? old : stars;
}

/* 三档文案：msgs = [满星, 两星, 一星]，缺省回退到通用句。 */
function engResultMsg(stars, msgs){
  msgs = msgs || [];
  if (stars === 3) return msgs[0] || "太棒了，全对通关！🌟";
  if (stars === 2) return msgs[1] || "很好！再练一次就是满分！";
  return msgs[2] || "完成！多练几次更熟练！";
}
