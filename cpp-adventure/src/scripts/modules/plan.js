var PLAN_Q = [
  {k:"book", q:"1. 教材版本打算用哪本？", o:[{v:"fun", l:"《小学生C++ 趣味编程》"}, {v:"youth", l:"《青少年C++ 编程入门》"}, {v:"both", l:"两本搭配（推荐）"}]},
  {k:"days", q:"2. 每周能保证学几天？", o:[{v:"2", l:"2 天"}, {v:"3", l:"3 天（推荐）"}, {v:"4", l:"4 天"}, {v:"5", l:"5 天"}]},
  {k:"typing", q:"3. 孩子打字基础如何？", o:[{v:"no", l:"还没练过"}, {v:"some", l:"会一点"}, {v:"ok", l:"每分钟 30 字以上（已达标）"}]},
  {k:"math", q:"4. 数学底子如何？", o:[{v:"need", l:"四则运算还要练"}, {v:"ok", l:"四则运算熟，余数刚学"}, {v:"great", l:"四则 + 余数都熟"}]},
  {k:"gesp", q:"5. 阶段一末要不要首考 GESP 1 级？", o:[{v:"no", l:"先不考，稳扎稳打"}, {v:"try", l:"去试试（推荐）"}]},
  {k:"tutor", q:"6. 需要外部辅导吗？", o:[{v:"self", l:"家长陪跑"}, {v:"out", l:"会找机构或老师"}]}
];
var planSel = {};
function planInit(){
  var p = S.plan || {};
  PLAN_Q.forEach(function(q){ planSel[q.k] = p[q.k] || ""; });
  drawPlanForm(); drawPlanResult();
}
function drawPlanForm(){
  var f = document.getElementById("planForm"); if (!f) return; f.innerHTML = "";
  PLAN_Q.forEach(function(q){
    var it = document.createElement("div"); it.className = "cn-item";
    var h = document.createElement("h4"); h.textContent = q.q; it.appendChild(h);
    var ops = document.createElement("div"); ops.className = "cn-opts";
    q.o.forEach(function(op){
      var b = document.createElement("button"); b.type = "button"; b.className = "cn-opt"; b.textContent = op.l;
      if (planSel[q.k] === op.v) b.classList.add("sel");
      b.onclick = (function(qk, v, b, ops){ return function(){
        ops.querySelectorAll(".cn-opt").forEach(function(x){ x.classList.remove("sel"); });
        b.classList.add("sel"); planSel[qk] = v;
      }; })(q.k, op.v, b, ops);
      ops.appendChild(b);
    });
    it.appendChild(ops); f.appendChild(it);
  });
}
function planSave(){
  var miss = "";
  PLAN_Q.forEach(function(q){ if (!planSel[q.k]) miss = q.k; });
  if (miss){ showToast("还有问题没选完哦，选完再保存 ★"); return; }
  var np = {};
  PLAN_Q.forEach(function(q){ np[q.k] = planSel[q.k]; });
  S.plan = np; saveS();
  drawPlanResult();
  showToast("收到！专属飞行计划已生成 ★");
}
function planTips(p){
  var t = [];
  var bk = {"fun":"主打《小学生C++ 趣味编程》：1~12 关逐课对照","youth":"主打《青少年C++ 编程入门》：前 12 关会自动给章节提示","both":"两本搭配：趣味书进门、入门书补全"};
  t.push("教材：" + (bk[p.book] || "两本搭配"));
  var tm = {"2":"每周 2 天 × 每次 25~30 分钟，重在连续","3":"每周 3 天（周三六日）× 每次 30~40 分钟","4":"每周 4 天 × 每次 25~30 分钟，短而勤","5":"每周 5 天 × 每次 20~25 分钟，短战线保兴趣"};
  t.push("时间：" + (tm[p.days] || "每周 3 天"));
  if (p.typing === "no") t.push("打字：前 2 周只玩「键盘指法」每次 5 分钟；摸熟 F/J 凸点、能不看键盘再上「打字热身」测速。");
  else if (p.typing === "some") t.push("打字：指法 3 分钟热身 + 测速 3 分钟，每周目标 +5 键。");
  else t.push("打字：直接冲 30 字/分，指法当热身。");
  if (p.math === "need") t.push("数学：先陪练四则运算，「数学脑力」每天 1 轮；余数随课堂慢慢来。");
  else if (p.math === "ok") t.push("数学：每天 1 轮数学脑力，余数题多遇多练。");
  else t.push("数学：每天 1 轮数学脑力保持手感。");
  if (p.gesp === "try") t.push("阶段一末：报名 GESP 1 级（3/6/9/12 月，60 过 90 跳），考前用「模拟赛训练场」练手。");
  else t.push("阶段一末：先不报名，把 12 关稳过完，下学期再报。");
  if (p.tutor === "out") t.push("外援：机构或老师带节奏，家长盯心态；本系统照常陪跑，两边要同步不打架。");
  else t.push("陪跑：家长当观战员，代码交给孩子；卡 2 次以上先休息再战。");
  return t;
}
function drawPlanResult(){
  var box = document.getElementById("planResult"); if (!box) return;
  if (!S.plan){ box.innerHTML = ""; return; }
  var lis = planTips(S.plan).map(function(x){ return "<li>" + x + "</li>"; }).join("");
  box.innerHTML = '<div class="plan-box"><h4>专属飞行计划（已保存 · 可随时重选）</h4><ul class="plan-list">' + lis + "</ul></div>";
}
document.getElementById("planSave").addEventListener("click", planSave);
