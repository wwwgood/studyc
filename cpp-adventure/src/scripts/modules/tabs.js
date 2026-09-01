function trainTab(idx){
  document.querySelectorAll(".train-tab").forEach(function(t, i){ t.classList.toggle("active", i === idx); });
  document.querySelectorAll(".train-panel").forEach(function(p, i){ p.classList.toggle("active", i === idx); });
}
function updateTabs(){
  var fp = S.fp || {};
  var tk = document.getElementById("tabKb"); if (tk) tk.textContent = "命中 " + (fp.ok || 0) + " 键";
  var tm = document.getElementById("tabMath"); if (tm) tm.textContent = "得分 " + (S.mathScore || 0);
  var tt = document.getElementById("tabType"); if (tt) tt.textContent = (S.typing || 0) + " 字/分";
  var te = document.getElementById("tabErr"); if (te) te.textContent = ((S.errors || []).filter(function(e){return !e.resolved;})).length + " 题";
  var tg = document.getElementById("tabEng"); if (tg) tg.textContent = (S.engOk || 0) + " 词";
  var tl = document.getElementById("tabLog"); if (tl) tl.textContent = (S.logs || []).length + " 条";
}
