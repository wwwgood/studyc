var ROAD = [
  {t:"现在 · 四年级", b:"打字 + 数学热身", d:"训练基地每天 3 分钟打字；数学随课热身", ic:"键"},
  {t:"阶段一末", b:"中山市小学生信息学邀请赛（可选）", d:"以当年官方通知为准；第一次体验比赛氛围", ic:"赛"},
  {t:"阶段二 · 每 3 个月", b:"GESP 1→2 级机考", d:"每年 3/6/9/12 月 4 次；60 分过级，90 分可跳级", ic:"级"},
  {t:"阶段三 · 六年级", b:"GESP 3→4 级 + 市赛冲名次", d:"为初中 CSP-J 与信息学特长生资格攒履历", ic:"星"},
  {t:"初中（12 岁起）", b:"CSP-J 入门组首战", d:"看生日不看年级：当年 9 月 1 日前满 12 岁可报", ic:"冲"},
  {t:"初高中", b:"CSP-S + 省赛 + 国赛", d:"从普及组一路晋级，信息学之路越来越亮", ic:"冠"}
];
function drawRoad(){
  var r = document.getElementById("roadList"); r.innerHTML = "";
  ROAD.forEach(function(it){
    var d = document.createElement("div"); d.className = "dum";
    d.innerHTML = '<div class="dot">' + it.ic + '</div><div class="r-card"><time>' + it.t + '</time><b>' + it.b + '</b><span class="rd">' + it.d + "</span></div>";
    r.appendChild(d);
  });
}

/* ------- 初始化 ------ */
document.querySelectorAll(".stage-tab").forEach(function(t){
  t.addEventListener("click", function(){
    document.querySelectorAll(".stage-tab").forEach(function(x){ x.setAttribute("aria-selected", "false"); });
    t.setAttribute("aria-selected", "true");
    renderStage(t.dataset.s);
  });
});
window.addEventListener("resize", function(){
  if (document.getElementById("levelGrid").children.length) drawPath(currentStage());
});
