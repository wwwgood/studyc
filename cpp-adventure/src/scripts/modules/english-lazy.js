/* ---------------- 英语数据延迟装载 english-lazy.js ----------------
 * 重数据文件（语法/词汇/阅读/作文/真题/1000题 等约 3.5 万行）不再在页面打开时立即执行，
 * 而是注册到 engLazy 队列，首次进入英语相关视图/弹窗时由 engEnsureData() 一次性执行。
 * 目的：缩短首页冷启动时间（平板端明显）。单文件离线构建不受影响（数据仍内联，只是延后执行）。
 * 数据文件的包装由 build/merge.js 在构建时完成，src 源文件保持原样（生成器可正常重新生成）。
 */
var __ENG_LAZY = { done: false, fns: [] };

function engLazy(fn){
  if (__ENG_LAZY.done) fn();
  else __ENG_LAZY.fns.push(fn);
}

function engEnsureData(){
  if (__ENG_LAZY.done) return;
  __ENG_LAZY.done = true;
  var fns = __ENG_LAZY.fns;
  __ENG_LAZY.fns = [];
  for (var i = 0; i < fns.length; i++){
    try { fns[i](); }
    catch(e){
      try { console.error("[english-lazy] 英语数据装载失败：", e); } catch(_){}
    }
  }
  /* 装载完成后刷新首页英语统计（首页可能先于数据渲染过一帧 0 值） */
  try { if (typeof portalRenderHomeStats === "function") portalRenderHomeStats(); } catch(e){}
}

/* 页面空闲后自动装载：错开首屏渲染高峰（平板首屏卡顿主因），
 * 装载完首页统计自动变准。用户更早点进英语视图时，入口函数会先行触发。 */
(function(){
  if (typeof window === "undefined" || !window.addEventListener) return;
  function kick(fn){
    if (window.requestIdleCallback) window.requestIdleCallback(fn);
    else setTimeout(fn, 1800);
  }
  function go(){ kick(function(){ engEnsureData(); }); }
  if (document.readyState === "complete") go();
  else window.addEventListener("load", go);
})();
