var ERR_TEACH = {
  math: function(e){
    var tip = "";
    if (e.op === "+") tip = "加法：把两个数合在一起。可以掰手指、画小棒数一数。";
    else if (e.op === "-") tip = "减法：从大数里拿走小数。大的在前，小的在后。";
    else if (e.op === "×") tip = "乘法：就是连加。比如 3×4 = 3+3+3+3 = 12。背乘法口诀最快！";
    else if (e.op === "%") tip = "余数：除完剩多少。比如 10÷3=3 余 1，所以 10%3=1。";
    return e.q + " 的答案是 <b>" + e.ans + "</b>。你写了 <span class='wrong'>" + e.wrong + "</span>。<br>" + tip;
  },
  kb: function(e){
    var f = KB_FINGER[e.target] || KB_FINGER[SHIFT_MAP[e.target]] || "手指";
    var base = SHIFT_MAP[e.target] || e.target;
    if (e.target === "SPACE") return "空格键由<b>大拇指</b>负责，左右都行。最长的那个键就是空格！";
    if (SHIFT_MAP[e.target]) return "要打 <b>" + e.target + "</b>，先按住 Shift 不松开，再按 <b>" + base + "</b> 键。这根键由" + f + "负责。";
    return "<b>" + e.target + "</b> 键由<b>" + f + "</b>负责。F 和 J 上有小凸点，摸到就能找回手位。";
  },
  type: function(e){
    return "在打 <code>" + e.code + "</code> 时，第 " + e.pos + " 个字符按错了。正确的是 <b>" + e.correct + "</b>，你按了 <span class='wrong'>" + e.wrong + "</span>。慢一点，一个一个对准再敲。";
  },
  quiz: function(e){
    return "题目：" + e.q + "<br>正确答案：<b>" + e.ans + "</b>，你选了 <span class='wrong'>" + e.wrong + "</span>。回到对应关卡再看看知识点讲解，想清楚了再来！";
  },
  eng: function(e){
    var parts = e.q.split("：");
    var word = e.ans;
    return "这个编程英文单词是 <b>" + word + "</b>，意思是 <b>" + (parts[1] || "") + "</b>。你写了 <span class='wrong'>" + e.wrong + "</span>。记住：C++ 关键字全部小写，一个字母都不能错！";
  }
};
function addError(cat, data){
  if (!S.errors) S.errors = [];
  for (let i = 0; i < S.errors.length; i++){
    if (S.errors[i].cat === cat && S.errors[i].q === data.q){
      S.errors[i].wrong = data.wrong; S.errors[i].ts = Date.now(); S.errors[i].resolved = false;
      saveS(); updateTabs(); renderErr();
      return;
    }
  }
  data.cat = cat; data.ts = Date.now(); data.resolved = false;
  S.errors.push(data);
  if (S.errors.length > 50) S.errors.shift();
  saveS(); updateTabs(); renderErr();
}
function renderErr(){
  var box = document.getElementById("errBook"); if (!box) return;
  var errs = S.errors || [];
  var active = errs.filter(function(e){return !e.resolved;});
  if (active.length === 0 && errs.length === 0){
    box.innerHTML = '<div class="err-empty"><div class="big">📝</div>还没有错题，继续保持！做错的题会自动出现在这里。</div>';
    return;
  }
  var html = "";
  if (errs.length > 0){
    html += '<div class="err-list">';
    errs.forEach(function(e, i){
      var catLabel = e.cat === "math" ? "数学" : e.cat === "kb" ? "击键" : e.cat === "eng" ? "英文" : "打字";
      html += '<div class="err-item' + (e.resolved ? " resolved" : "") + '">';
      html += '<span class="err-cat">' + catLabel + '</span>';
      html += '<div class="err-body">';
      html += '<div class="q">' + e.q + '</div>';
      html += '<div class="a">正确答案：<b>' + e.ans + '</b>　你写的：<span class="wrong">' + e.wrong + '</span></div>';
      html += '<div class="err-actions">';
      html += '<button class="err-btn-teach" onclick="errTeach(' + i + ')">教会我</button>';
      html += '<button class="err-btn-prac" onclick="errPrac(' + i + ')">再练一次</button>';
      html += '<button class="err-btn-del" onclick="errDel(' + i + ')">' + (e.resolved ? "已掌握" : "已会了") + '</button>';
      html += '</div>';
      html += '<div class="err-teach" id="errTeach' + i + '" style="display:none;"></div>';
      html += '</div></div>';
    });
    html += '</div>';
  }
  box.innerHTML = html;
}
function errTeach(i){
  var e = S.errors[i]; if (!e) return;
  var el = document.getElementById("errTeach" + i);
  if (el.style.display === "none"){
    var fn = ERR_TEACH[e.cat];
    el.innerHTML = fn ? fn(e) : "这道题的正确答案是 " + e.ans + "。多练几遍就记住啦！";
    el.style.display = "block";
  } else el.style.display = "none";
}
function errPrac(i){
  var e = S.errors[i]; if (!e) return;
  var box = document.getElementById("errBook");
  var html = '<div class="err-prac-mode" id="errPracBox">';
  if (e.cat === "math"){
    var q = e.q.replace(/\s+/g, "");
    html += '<div class="pq" id="pracQ">' + q + '</div>';
    html += '<input class="math-input" id="pracIn" inputmode="numeric" placeholder="?" onkeydown="if(event.key===\'Enter\')errPracCheck(' + i + ')">';
    html += '<p class="bug-feedback" id="pracFb" style="text-align:center;color:var(--blue)">算一算，按回车。</p>';
  } else if (e.cat === "kb"){
    var t = e.target === "SPACE" ? "空格" : e.target;
    html += '<div class="pq" id="pracQ">在键盘上敲：' + t + '</div>';
    html += '<p class="bug-feedback" id="pracFb" style="text-align:center;color:var(--blue)">在真键盘上敲出对应的键。</p>';
    errPracKbTarget = e.target;
  } else if (e.cat === "type"){
    html += '<div class="pq" style="font-size:18px;font-family:Consolas,monospace;">' + e.code + '</div>';
    html += '<p class="bug-feedback" id="pracFb" style="text-align:center;color:var(--blue)">把上面这行代码完整敲一遍，注意第 ' + e.pos + ' 个字符。</p>';
    errPracTypeTarget = e.code;
  } else if (e.cat === "eng"){
    html += '<div class="pq" style="font-size:18px;">拼写：' + e.q + '</div>';
    html += '<input class="eng-input" id="pracIn" placeholder="拼出英文" autocomplete="off" onkeydown="if(event.key===\'Enter\')errPracEngCheck(' + i + ')">';
    html += '<p class="bug-feedback" id="pracFb" style="text-align:center;color:var(--blue)">拼对了就消灭这道错题！</p>';
  } else if (e.cat === "quiz"){
    html += '<div class="pq" style="font-size:16px;">' + e.q + '</div>';
    html += '<div style="font-size:15px;color:var(--ink-soft);margin-bottom:8px;">正确答案：<b>' + e.ans + '</b></div>';
    html += '<input class="eng-input" id="pracIn" placeholder="输入正确答案" autocomplete="off" onkeydown="if(event.key===\'Enter\')errPracQuizCheck(' + i + ')">';
    html += '<p class="bug-feedback" id="pracFb" style="text-align:center;color:var(--blue)">输入正确答案，消灭这道错题！</p>';
  }
  html += '<div style="text-align:center;margin-top:10px;"><button class="err-btn-del" onclick="renderErr()">返回错题本</button></div>';
  html += '</div>';
  var prev = box.innerHTML; box.innerHTML = html + '<div id="errPrevList" style="display:none;">' + prev + '</div>';
  if (e.cat === "math"){ var inp = document.getElementById("pracIn"); if (inp) inp.focus(); }
  else if (e.cat === "kb"){ errPracKbOn = true; }
}
var errPracKbTarget = ""; var errPracKbOn = false; var errPracTypeTarget = "";
function errPracCheck(i){
  var e = S.errors[i]; if (!e) return;
  var inp = document.getElementById("pracIn"); if (!inp) return;
  var v = parseInt(inp.value, 10);
  var fb = document.getElementById("pracFb");
  if (v === e.ans){
    fb.textContent = "对啦！这道题消灭了 ★";
    fb.style.color = "var(--green)";
    e.resolved = true; saveS(); updateTabs();
    setTimeout(function(){ renderErr(); }, 1200);
  } else {
    fb.textContent = "再想想，答案是 " + e.ans + "。多算几遍。";
    fb.style.color = "var(--action-dark)";
  }
}
function errPracEngCheck(i){
  var e = S.errors[i]; if (!e) return;
  var inp = document.getElementById("pracIn"); if (!inp) return;
  var v = inp.value.trim().toLowerCase();
  var fb = document.getElementById("pracFb");
  if (v === String(e.ans).toLowerCase()){
    fb.textContent = "对啦！这道错题消灭了 ★"; fb.style.color = "var(--green)";
    e.resolved = true; saveS(); updateTabs();
    setTimeout(function(){ renderErr(); }, 1200);
  } else {
    fb.textContent = "正确拼写：" + e.ans + "。再试一次。"; fb.style.color = "var(--action-dark)";
    inp.value = ""; inp.focus();
  }
}
function errPracQuizCheck(i){
  var e = S.errors[i]; if (!e) return;
  var inp = document.getElementById("pracIn"); if (!inp) return;
  var v = inp.value.trim();
  var fb = document.getElementById("pracFb");
  if (v === String(e.ans)){
    fb.textContent = "对啦！这道错题消灭了 ★"; fb.style.color = "var(--green)";
    e.resolved = true; saveS(); updateTabs();
    setTimeout(function(){ renderErr(); }, 1200);
  } else {
    fb.textContent = "正确答案：" + e.ans + "。再想想。"; fb.style.color = "var(--action-dark)";
    inp.value = ""; inp.focus();
  }
}
function errDel(i){
  var e = S.errors[i]; if (!e) return;
  e.resolved = true; saveS(); updateTabs(); renderErr();
}
function errPracKey(e){
  if (!errPracKbOn) return;
  if (e.key === "Shift" || e.key === "Control" || e.key === "Alt" || e.key === "CapsLock") return;
  var k = e.key.toUpperCase(); if (k === " ") k = "SPACE";
  if (k.length !== 1 && k !== "SPACE") return;
  var fb = document.getElementById("pracFb"); if (!fb) return;
  if (k === errPracKbTarget){
    fb.textContent = "对啦！这个键消灭了 ★";
    fb.style.color = "var(--green)";
    errPracKbOn = false;
    for (let i = 0; i < (S.errors || []).length; i++){
      if (S.errors[i].cat === "kb" && S.errors[i].target === errPracKbTarget){ S.errors[i].resolved = true; saveS(); updateTabs(); break; }
    }
    setTimeout(function(){ renderErr(); }, 1200);
  } else {
    fb.textContent = "按到 " + (k === "SPACE" ? "空格" : k) + "，目标是 " + (errPracKbTarget === "SPACE" ? "空格" : errPracKbTarget) + "。";
    fb.style.color = "var(--action-dark)";
  }
}
document.addEventListener("keydown", errPracKey);
