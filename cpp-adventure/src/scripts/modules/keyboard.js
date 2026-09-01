var KB_ROWS = [
  [{k:"Esc"},{k:"F1"},{k:"F2"},{k:"F3"},{k:"F4"},{k:"F5"},{k:"F6"},{k:"F7"},{k:"F8"},{k:"F9"},{k:"F10"},{k:"F11"},{k:"F12"}],
  [{k:"`", s:"~"},{k:"1", s:"!"},{k:"2", s:"@"},{k:"3", s:"#"},{k:"4", s:"$"},{k:"5", s:"%"},{k:"6", s:"^"},{k:"7", s:"&"},{k:"8", s:"*"},{k:"9", s:"("},{k:"0", s:")"},{k:"-", s:"_"},{k:"=", s:"+"},{k:"Backspace", w:1}],
  [{k:"Tab", w:1},{k:"Q"},{k:"W"},{k:"E"},{k:"R"},{k:"T"},{k:"Y"},{k:"U"},{k:"I"},{k:"O"},{k:"P"},{k:"[", s:"{"},{k:"]", s:"}"},{k:"\\", s:"|"}],
  [{k:"CapsLock", w:1},{k:"A"},{k:"S"},{k:"D"},{k:"F"},{k:"G"},{k:"H"},{k:"J"},{k:"K"},{k:"L"},{k:";", s:":"},{k:"'", s:'"'},{k:"Enter", w:1}],
  [{k:"Shift", w:1, side:"L"},{k:"Z"},{k:"X"},{k:"C"},{k:"V"},{k:"B"},{k:"N"},{k:"M"},{k:",", s:"<"},{k:".", s:">"},{k:"/", s:"?"},{k:"Shift", w:1, side:"R"}],
  [{k:"Ctrl", w:1},{k:"Win"},{k:"Alt", w:1},{k:"Space", space:1},{k:"Alt"},{k:"Menu"},{k:"Ctrl", w:1}],
  [{k:"Ins"},{k:"Del"},{k:"Home"},{k:"End"},{k:"PgUp"},{k:"PgDn"},{k:"←"},{k:"↑"},{k:"↓"},{k:"→"}]
];
var KB_FINGER = {
  "1":"左手小指","Q":"左手小指","A":"左手小指","Z":"左手小指","Tab":"左手小指","CapsLock":"左手小指",
  "2":"左手无名指","W":"左手无名指","S":"左手无名指","X":"左手无名指",
  "3":"左手中指","E":"左手中指","D":"左手中指","C":"左手中指",
  "4":"左手食指","5":"左手食指","R":"左手食指","T":"左手食指","F":"左手食指","G":"左手食指","V":"左手食指","B":"左手食指",
  "6":"右手食指","7":"右手食指","Y":"右手食指","U":"右手食指","H":"右手食指","J":"右手食指","N":"右手食指","M":"右手食指",
  "8":"右手中指","I":"右手中指","K":"右手中指",",":"右手中指",
  "9":"右手无名指","O":"右手无名指","L":"右手无名指",".":"右手无名指","-":"右手无名指",
  "0":"右手小指","P":"右手小指",";":"右手小指","/":"右手小指","=":"右手小指","[":"右手小指","]":"右手小指","\\":"右手小指","'":"右手小指","Backspace":"右手小指","Enter":"右手小指",
  "Shift":"左手小指","SPACE":"大拇指"
};
var KB_FP = {"左手小指":"fp1","左手无名指":"fp2","左手中指":"fp3","左手食指":"fp4","右手食指":"fp5","右手中指":"fp6","右手无名指":"fp7","右手小指":"fp8","大拇指":"fp9"};
var SHIFT_MAP = {"~":"`","!":"1","@":"2","#":"3","$":"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0","_":"-","+":"=","{":"[","}":"]","|":"\\",":":";","\"":"'","<":",",">":".","?":"/"};
function kbRender(){
  var bd = document.getElementById("kbBoard"); if (!bd) return; bd.innerHTML = "";
  KB_ROWS.forEach(function(row){
    var r = document.createElement("div"); r.className = "krow";
    row.forEach(function(o){
      var b = document.createElement("button"); b.type = "button";
      var cls = "k-key";
      if (o.w) cls += " w";
      if (o.space) cls += " space";
      var f = KB_FINGER[o.k];
      if (o.side && o.side === "R") cls += " fp8";
      else if (o.side) cls += " fp1";
      else if (f) cls += " " + KB_FP[f];
      else cls += " mid";
      b.className = cls;
      b.setAttribute("data-k", o.k);
      if (o.s){ var ii = document.createElement("i"); ii.textContent = o.s; var bb = document.createElement("b"); bb.textContent = o.k; b.appendChild(ii); b.appendChild(bb); }
      else b.textContent = (o.k === "Space" ? "空格" : o.k);
      b.setAttribute("aria-label", (o.k === "Space" ? "空格键" : o.k + " 键"));
      b.onclick = (function(kk, ss, sd){ return function(){ kbShow(kk, ss, sd); }; })(o.k, o.s, o.side);
      r.appendChild(b);
    });
    bd.appendChild(r);
  });
}
function kbShow(k, s, side){
  var h = document.getElementById("kbHint"); if (!h) return;
  if (side){ h.textContent = (side === "L" ? "左" : "右") + " Shift" + (side === "L" ? "：左手小指。按住它不松开，再按字母或数字键，就能打出大写和上面的符号。" : "：右手小指。按住它不松开，再按字母或数字键，就能打出大写和上面的符号。"); return; }
  if (k === "Space"){ h.textContent = "空格：大拇指管，左右都行，用惯的那只。"; return; }
  if (k === "Esc"){ h.textContent = "Esc：逃跑键，按它取消当前操作，程序员的护身符。"; return; }
  var f = KB_FINGER[k];
  if (!f){ h.textContent = k + "：功能键或编辑键，常和 Shift / Ctrl 搭配使用。"; return; }
  if (s) h.textContent = k + " 键由" + f + "负责；按住 Shift 再按它，能打出 " + s + "。C++ 里会用哦！";
  else h.textContent = k + " 键由" + f + "负责；F 和 J 上有小凸点，摸到就能找回手位。";
}
var kb = {on:false, ok:0, need:15, err:0, target:""};
var KB_HOME = ["F","J","A","S","D","K","L",";","SPACE"];
var KB_LETTER = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","1","2","3","4","5","6","7","8","9","0","SPACE"];
var KB_SYM = ["1","2","3","4","5","6","7","8","9","0","!","@","#","$","%","^","&","*","(",")","-","_","=","+","[","{","]","}",";",":","'","\"",",","<",".",">","/","?","`","~","SPACE"];
var KB_ALL = [];
Object.keys(KB_FINGER).forEach(function(kk){ if (kk.length === 1 && kk !== "SPACE" && KB_ALL.indexOf(kk) < 0) KB_ALL.push(kk); });
Object.keys(SHIFT_MAP).forEach(function(kk){ if (KB_ALL.indexOf(kk) < 0) KB_ALL.push(kk); });
KB_ALL.push("SPACE");
function kbPool(){
  var ok = (S.fp && S.fp.ok) || 0;
  if (ok >= 120) return KB_ALL;
  if (ok >= 60) return KB_SYM;
  if (ok >= 25) return KB_LETTER;
  return KB_HOME;
}
function kbLevelName(){
  var ok = (S.fp && S.fp.ok) || 0;
  if (ok >= 120) return "Lv4 全键司令";
  if (ok >= 60) return "Lv3 符号特遣队";
  if (ok >= 25) return "Lv2 字母舰队";
  return "Lv1 新兵营";
}
function kbFingerOf(ch){
  if (ch === "SPACE") return "大拇指（左右都行）";
  var base = SHIFT_MAP[ch] || ch;
  var f = KB_FINGER[base];
  if (SHIFT_MAP[ch]) return "按住 Shift 再按 " + base + " 键 → " + (f || "");
  return f || "功能键";
}
function kbPick(){
  var pool = kbPool();
  kb.target = pool[Math.floor(Math.random() * pool.length)];
  var tEl = document.getElementById("kbTarget");
  var tipEl = document.getElementById("kbTip");
  tEl.textContent = kb.target === "SPACE" ? "空格" : kb.target;
  tipEl.textContent = kbFingerOf(kb.target);
  document.getElementById("kbStat").textContent = "本轮 " + kb.ok + "/" + kb.need;
  var lvEl = document.getElementById("kbLv");
  if (lvEl) lvEl.textContent = kbLevelName() + " · 累计命中 " + ((S.fp && S.fp.ok) || 0) + " 键";
  kbMark(true);
}
function kbStart(){
  kb.on = true; kb.ok = 0; kb.err = 0;
  var mi = document.getElementById("mathIn"); if (mi) mi.blur();
  document.getElementById("kbStart").textContent = "再玩一轮";
  var h = document.getElementById("kbHint");
  if (S.plan && S.plan.typing === "no") h.textContent = "家长已选了「还没练过」：别急，先只玩指法，找得到凸点、不看键盘，再上打字测速。";
  else h.textContent = "看大字，用手指在真键盘上敲。按错不扣分，慢慢来！目标键会按等级慢慢变难。";
  document.getElementById("kbTip").textContent = "看上面的大字，在真键盘上敲出对应的键，15 键一轮。";
  kbPick();
}
function kbMark(on){
  var want = kb.target === "SPACE" ? "Space" : (SHIFT_MAP[kb.target] || kb.target);
  document.querySelectorAll(".k-key").forEach(function(el){ el.classList.toggle("is-target", on && el.getAttribute("data-k") === want); });
}
function kbEnd(){
  kb.on = false; kbMark(false); kb.target = "";
  var fp = S.fp || {}; fp.ok = (fp.ok || 0) + kb.ok; fp.err = (fp.err || 0) + kb.err;
  S.fp = fp; saveS();
  document.getElementById("kbTarget").textContent = "一轮完成！";
  document.getElementById("kbTip").textContent = kb.ok >= kb.need ? "15 键全对，指法小新星！" : "本轮对 " + kb.ok + "/15，多玩几轮更稳。";
  document.getElementById("kbStat").textContent = "累计命中 " + (fp.ok || 0) + " 键";
  var lvEl = document.getElementById("kbLv");
  if (lvEl) lvEl.textContent = kbLevelName();
  updateTabs();
}
function kbKey(e){
  if (!kb.on) return;
  if (!e.key) return;
  if (["Shift","Control","Alt","CapsLock","Tab","Backspace","Enter","Escape","Meta"].indexOf(e.key) >= 0) return;
  var k = e.key.toUpperCase(); if (k === " ") k = "SPACE";
  if (k.length !== 1 && k !== "SPACE") return;
  var tEl = document.getElementById("kbTarget");
  if (k === kb.target){
    kb.ok++;
    kbMark(false);
    tEl.style.color = "var(--green)";
    setTimeout(function(){ if (kb.on) tEl.style.color = "var(--gold)"; }, 240);
    if (kb.ok >= kb.need){ kbEnd(); return; }
    kbPick();
  } else {
    kb.err++;
    var tDisp = kb.target === "SPACE" ? "空格" : kb.target;
    var kDisp = k === "SPACE" ? "空格" : k;
    document.getElementById("kbTip").textContent = "按到 " + kDisp + " 啦，目标是 " + tDisp + "。慢一点，手指找准再敲。";
    addError("kb", {q: "键盘敲：" + tDisp, ans: tDisp, wrong: kDisp, target: kb.target});
  }
}
document.addEventListener("keydown", kbKey);
document.getElementById("kbStart").addEventListener("click", kbStart);
