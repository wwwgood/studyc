/* ---------------- 奖品店 awards.js ----------------
 * 玩法：孩子学习赚金币 → 奖品店兑换小愿望（看电视/买礼物等）。
 * 家长后台配置奖品 + 金币价；孩子花金币兑换；每级解锁更多奖品。
 * 金币来源：S.coins（C++ 闯关）+ S.eng.coins（英语闯关）。
 */
var AW_DEFAULTS = [
  { id: "aw1", emoji: "🍦", name: "一个冰淇淋", cost: 50, lv: 1 },
  { id: "aw2", emoji: "🍫", name: "一块巧克力", cost: 80, lv: 1 },
  { id: "aw3", emoji: "📺", name: "看电视 30 分钟", cost: 120, lv: 2 },
  { id: "aw4", emoji: "🎮", name: "玩游戏 30 分钟", cost: 150, lv: 2 },
  { id: "aw5", emoji: "📚", name: "买一本喜欢的书", cost: 300, lv: 3 },
  { id: "aw6", emoji: "🎯", name: "周末游乐园一次", cost: 500, lv: 3 },
  { id: "aw7", emoji: "🎁", name: "神秘大礼（家长定制）", cost: 800, lv: 4 }
];

function awState(){
  if (!S.awards) S.awards = { redeemed: [] };
  if (!S.awards.redeemed) S.awards.redeemed = [];
  return S.awards;
}
function awConfig(){
  if (!SDB.awardConfig || !SDB.awardConfig.length) SDB.awardConfig = AW_DEFAULTS.slice();
  return SDB.awardConfig;
}
function awTotalCoins(){
  var cpp = S.coins || 0;
  var eng = (S.eng && S.eng.coins) ? S.eng.coins : 0;
  var vocab = (S.vocab && S.vocab.coins) ? S.vocab.coins : 0;
  var reading = (S.reading && S.reading.coins) ? S.reading.coins : 0;
  var writing = (S.writing && S.writing.coins) ? S.writing.coins : 0;
  var exam = (S.exam && S.exam.coins) ? S.exam.coins : 0;
  return cpp + eng + vocab + reading + writing + exam;
}
function awUserLevel(){
  var stars = Object.keys(S.passed || {}).length;
  var engStars = Object.values((S.eng && S.eng.done) || {}).reduce(function(a, b){ return a + b; }, 0);
  var vocabStars = Object.values((S.vocab && S.vocab.done) || {}).reduce(function(a, b){ return a + b; }, 0);
  var readStars = Object.values((S.reading && S.reading.done) || {}).reduce(function(a, b){ return a + b; }, 0);
  var writeStars = Object.values((S.writing && S.writing.done) || {}).reduce(function(a, b){ return a + b; }, 0);
  var examStars = Object.values((S.exam && S.exam.done) || {}).reduce(function(a, b){ return a + b; }, 0);
  var total = stars + engStars + vocabStars + readStars + writeStars + examStars;
  if (total >= 60) return 4;
  if (total >= 30) return 3;
  if (total >= 10) return 2;
  return 1;
}

/* ---------- 奖品店主界面 ---------- */
function openShop(){
  awRenderShop();
  document.getElementById("awMask").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeShop(){
  document.getElementById("awMask").classList.remove("open");
  document.body.style.overflow = "";
}

function awRenderShop(){
  var coins = awTotalCoins();
  var ulv = awUserLevel();
  var cfg = awConfig();
  var redeemed = awState().redeemed;
  var html =
    '<div class="aw-head">' +
      '<span class="aw-title">🎁 奖品店</span>' +
      '<span class="aw-coins">🪙 我的金币 <b>' + coins + '</b></span>' +
      '<button class="aw-close" type="button" onclick="closeShop()">×</button>' +
    '</div>' +
    '<div class="aw-body">' +
      '<div class="aw-level-bar">🏅 当前等级 Lv.' + ulv + ' · 累计兑换 ' + redeemed.length + ' 件' +
        '<span class="aw-level-hint">攒星升级，解锁更多奖品！Lv.' + (ulv < 4 ? ulv + 1 : 4) + ' 需要 ' + awNextLevelStars(ulv) + ' 颗星</span>' +
      '</div>' +
      '<div class="aw-grid">';

  cfg.forEach(function(a){
    var locked = a.lv > ulv;
    var can = !locked && coins >= a.cost;
    var redeemedCount = redeemed.filter(function(r){ return r.id === a.id; }).length;
    html += '<div class="aw-card' + (locked ? " locked" : "") + (can ? " can" : "") + '">' +
      '<div class="aw-emoji">' + (locked ? "🔒" : a.emoji) + '</div>' +
      '<div class="aw-name">' + a.name + '</div>' +
      '<div class="aw-cost">🪙 ' + a.cost + '</div>' +
      (locked
        ? '<div class="aw-locked">Lv.' + a.lv + ' 解锁</div>'
        : '<button class="aw-btn' + (can ? "" : " disabled") + '" type="button" ' +
          (can ? 'onclick="awRedeem(\'' + a.id + '\')"' : 'disabled') + '>兑换</button>') +
      (redeemedCount > 0 ? '<div class="aw-redeemed">已兑 ' + redeemedCount + ' 次</div>' : '') +
    '</div>';
  });

  html += '</div>' +
    '<div class="aw-history">' +
      '<h4>📋 我的兑换记录</h4>' +
      (redeemed.length === 0
        ? '<p class="aw-empty">还没有兑换过奖品，加油攒金币吧！💪</p>'
        : '<ul>' + redeemed.slice().reverse().map(function(r){
            return '<li><span>' + r.emoji + ' ' + r.name + '</span><span class="aw-h-cost">-🪙' + r.cost + '</span><span class="aw-h-time">' + r.time + '</span></li>';
          }).join("") + '</ul>') +
    '</div>' +
    '<div class="aw-parent">' +
      '<button class="aw-parent-btn" type="button" onclick="awParentOpen()">⚙️ 家长管理（需密码）</button>' +
    '</div>' +
  '</div>';

  document.getElementById("awBox").innerHTML = html;
}

function awNextLevelStars(lv){
  if (lv === 1) return 10;
  if (lv === 2) return 30;
  if (lv === 3) return 60;
  return 60;
}

function awRedeem(id){
  var cfg = awConfig();
  var a = cfg.filter(function(x){ return x.id === id; })[0];
  if (!a) return;
  var coins = awTotalCoins();
  if (coins < a.cost){ awToast("金币不够哦，再努力攒攒！💪"); return; }
  var cpp = S.coins || 0;
  var eng = (S.eng && S.eng.coins) ? S.eng.coins : 0;
  var need = a.cost;
  if (eng >= need){ S.eng.coins = eng - need; }
  else { need -= eng; S.eng.coins = 0; S.coins = cpp - need; }
  var now = new Date();
  var time = (now.getMonth() + 1) + "/" + now.getDate() + " " + now.getHours() + ":" + String(now.getMinutes()).padStart(2, "0");
  awState().redeemed.push({ id: a.id, name: a.name, emoji: a.emoji, cost: a.cost, time: time });
  saveS();
  awToast("🎉 兑换成功：" + a.emoji + " " + a.name + "！找家长领奖吧～");
  if (typeof fireConfetti === "function") fireConfetti();
  awRenderShop();
  if (typeof drawAll === "function") drawAll();
  if (typeof eqRender === "function") eqRender();
}

function awToast(msg){
  var el = document.getElementById("awToast");
  if (!el){
    el = document.createElement("div");
    el.id = "awToast";
    el.className = "aw-toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(function(){ el.classList.remove("show"); }, 2500);
}

/* ---------- 家长管理后台 ---------- */
var AW_PARENT_AUTH = false;

function awParentOpen(){
  var pwd = prompt("请输入家长密码（默认 123456）：");
  if (pwd === null) return;
  if (pwd !== awParentPwd()){
    awToast("密码错误！");
    return;
  }
  AW_PARENT_AUTH = true;
  awRenderParent();
}

function awParentPwd(){
  if (!SDB.awardPwd) SDB.awardPwd = "123456";
  return SDB.awardPwd;
}

function awRenderParent(){
  var cfg = awConfig();
  var html =
    '<div class="aw-head">' +
      '<span class="aw-title">⚙️ 奖品家长管理</span>' +
      '<button class="aw-close" type="button" onclick="awParentClose()">×</button>' +
    '</div>' +
    '<div class="aw-body">' +
      '<p class="aw-parent-tip">💡 在这里配置奖品名称和金币价格。孩子学习赚够金币就能兑换，每级解锁更多奖品。</p>' +
      '<div class="aw-parent-list">';
  cfg.forEach(function(a, i){
    html += '<div class="aw-parent-row">' +
      '<input class="aw-p-emoji" type="text" maxlength="2" value="' + a.emoji + '" id="awEmoji' + i + '">' +
      '<input class="aw-p-name" type="text" value="' + a.name.replace(/"/g, "&quot;") + '" id="awName' + i + '">' +
      '<input class="aw-p-cost" type="number" min="1" value="' + a.cost + '" id="awCost' + i + '">' +
      '<span>金币</span>' +
      '<select class="aw-p-lv" id="awLv' + i + '">' +
        [1,2,3,4].map(function(v){ return '<option value="' + v + '"' + (a.lv === v ? " selected" : "") + '>Lv.' + v + '</option>'; }).join("") +
      '</select>' +
      '<button class="aw-p-del" type="button" onclick="awParentDel(' + i + ')">🗑️</button>' +
    '</div>';
  });
  html += '</div>' +
    '<div class="aw-parent-actions">' +
      '<button class="aw-p-add" type="button" onclick="awParentAdd()">➕ 新增奖品</button>' +
      '<button class="aw-p-save" type="button" onclick="awParentSave()">💾 保存配置</button>' +
      '<button class="aw-p-chpwd" type="button" onclick="awParentChPwd()">🔑 改密码</button>' +
    '</div>' +
    '<div class="aw-parent-stats">' +
      '<h4>📊 全局统计</h4>' +
      awParentGlobalStats() +
    '</div>' +
  '</div>';
  document.getElementById("awBox").innerHTML = html;
}

function awParentGlobalStats(){
  var users = Object.keys(SDB.users || {});
  var html = '<table class="aw-stats-table"><tr><th>用户</th><th>C++星</th><th>语法星</th><th>词汇星</th><th>阅读星</th><th>作文星</th><th>真题星</th><th>金币</th><th>已兑换</th></tr>';
  users.forEach(function(nm){
    var u = SDB.users[nm];
    var cppStars = Object.keys(u.passed || {}).length;
    var engStars = Object.values((u.eng && u.eng.done) || {}).reduce(function(a, b){ return a + b; }, 0);
    var vocabStars = Object.values((u.vocab && u.vocab.done) || {}).reduce(function(a, b){ return a + b; }, 0);
    var readStars = Object.values((u.reading && u.reading.done) || {}).reduce(function(a, b){ return a + b; }, 0);
    var writeStars = Object.values((u.writing && u.writing.done) || {}).reduce(function(a, b){ return a + b; }, 0);
    var examStars = Object.values((u.exam && u.exam.done) || {}).reduce(function(a, b){ return a + b; }, 0);
    var coins = (u.coins || 0) + ((u.eng && u.eng.coins) || 0) + ((u.vocab && u.vocab.coins) || 0) + ((u.reading && u.reading.coins) || 0) + ((u.writing && u.writing.coins) || 0) + ((u.exam && u.exam.coins) || 0);
    var redeemed = (u.awards && u.awards.redeemed) ? u.awards.redeemed.length : 0;
    html += '<tr><td>' + nm + '</td><td>' + cppStars + '</td><td>' + engStars + '</td><td>' + vocabStars + '</td><td>' + readStars + '</td><td>' + writeStars + '</td><td>' + examStars + '</td><td>' + coins + '</td><td>' + redeemed + '</td></tr>';
  });
  html += '</table>';
  return html;
}

function awParentAdd(){
  var cfg = awConfig();
  cfg.push({ id: "aw" + Date.now(), emoji: "🎁", name: "新奖品", cost: 100, lv: 1 });
  SDB.awardConfig = cfg;
  saveS();
  awRenderParent();
}

function awParentDel(i){
  var cfg = awConfig();
  if (cfg.length <= 1){ awToast("至少保留一个奖品"); return; }
  cfg.splice(i, 1);
  SDB.awardConfig = cfg;
  saveS();
  awRenderParent();
}

function awParentSave(){
  var cfg = awConfig();
  cfg.forEach(function(a, i){
    var emoji = document.getElementById("awEmoji" + i);
    var name = document.getElementById("awName" + i);
    var cost = document.getElementById("awCost" + i);
    var lv = document.getElementById("awLv" + i);
    if (emoji) a.emoji = emoji.value.trim() || "🎁";
    if (name) a.name = name.value.trim() || "奖品";
    if (cost) a.cost = Math.max(1, parseInt(cost.value, 10) || 100);
    if (lv) a.lv = parseInt(lv.value, 10) || 1;
  });
  SDB.awardConfig = cfg;
  saveS();
  awToast("✅ 奖品配置已保存");
  awRenderParent();
}

function awParentChPwd(){
  var old = prompt("旧密码：");
  if (old !== awParentPwd()){ awToast("旧密码不对"); return; }
  var nw = prompt("新密码：");
  if (!nw || nw.length < 4){ awToast("新密码至少 4 位"); return; }
  SDB.awardPwd = nw;
  saveS();
  awToast("✅ 密码已更新");
}

function awParentClose(){
  AW_PARENT_AUTH = false;
  awRenderShop();
}

/* ---------- 生命周期 ---------- */
window.addEventListener("load", function(){
  awConfig();
});