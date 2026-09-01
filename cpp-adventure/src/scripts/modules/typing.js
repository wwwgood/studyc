var TYPES = [
  "cout << \"hi\";",
  "int a = 5; a++;",
  "for (int i = 0; i < 3; i++)",
  "cin >> n; cout << n;"
];
var tp = {i:0, pos:0, tmr:null, ok:0, err:0, on:false};
function tpRender(){
  var area = document.getElementById("typeArea"); area.innerHTML = "";
  var line = TYPES[tp.i] || "全部打完啦！";
  if (tp.i >= TYPES.length){
    area.innerHTML = '<p>全部打完啦！等倒计时完看成绩。</p>'; return;
  }
  for (let i = 0; i < line.length; i++){
    var sp = document.createElement("span");
    sp.textContent = line[i] === " " ? "·" : line[i];
    if (i < tp.pos) sp.style.color = "var(--green)";
    if (i === tp.pos) sp.className = "cur";
    area.appendChild(sp);
  }
}
function tpStart(){
  if (tp.on) return;
  tp.on = true; tp.i = 0; tp.pos = 0; tp.ok = 0; tp.err = 0;
  if (tp.tmr) clearTimeout(tp.tmr);
  tp.tmr = setTimeout(tpEnd, 60000);
  document.getElementById("typeStartO").textContent = "打字中…";
  document.getElementById("typeStartO").disabled = true;
  document.getElementById("typeStatus").textContent = "快敲！60 秒倒计时。注意大小写和符号。";
  tpRender();
}
function tpKey(e){
  if (!tp.on) return;
  if (["Shift","Control","Alt","CapsLock","Escape","Meta"].indexOf(e.key) >= 0) return;
  if (e.key.length !== 1) return;
  if (tp.i >= TYPES.length) return;
  var line = TYPES[tp.i];
  if (e.key === line[tp.pos]){
    tp.pos++; tp.ok++;
    if (tp.pos >= line.length){ tp.i++; tp.pos = 0; }
    tpRender();
  } else {
    tp.err++;
    addError("type", {q: "打字第 " + (tp.pos+1) + " 个字符", ans: line[tp.pos], wrong: e.key, code: line, pos: tp.pos+1, correct: line[tp.pos]});
  }
}
function tpEnd(){
  tp.on = false;
  var stat = document.getElementById("typeStatus");
  var cpm = Math.round(tp.ok);
  var wpm = Math.round(tp.ok / 2);
  stat.textContent = "时间到！打了 " + tp.ok + " 键 ≈ " + wpm + " 字/分。" + (wpm >= 30 ? "达标啦，可以正式起飞 ★" : "再练练，目标 30 字/分。");
  S.typing = wpm; saveS();
  updateTabs();
  document.getElementById("typeStartO").textContent = "再来一次";
  document.getElementById("typeStartO").disabled = false;
}
document.addEventListener("keydown", tpKey);
document.getElementById("typeStartO").addEventListener("click", tpStart);

/* --------- 数学 --- */
