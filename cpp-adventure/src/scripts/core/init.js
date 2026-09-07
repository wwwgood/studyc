window.addEventListener("load", function(){
  ensureDefaultUser();
  drawCmdr();
  drawAll(); drawRoad(); mtNew(); kbRender(); planInit(); bindFocus();
  updateTabs(); renderErr(); logRender(); initMascot();
  if (typeof eqRender === "function") eqRender();
});
/* 静态导出门禁探针 */
window.__DESIGN_STATIC_ERRORS__ = [];
window.addEventListener("error", function(e){
  try { window.__DESIGN_STATIC_ERRORS__.push(String(e.message || e.type || "error")); } catch(_){}
}, true);
window.addEventListener("unhandledrejection", function(e){
  try { window.__DESIGN_STATIC_ERRORS__.push(String(e.reason || "unhandled")); } catch(_){}
}, true);
