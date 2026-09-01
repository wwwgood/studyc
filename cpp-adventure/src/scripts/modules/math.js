var mt = {a:0, b:0, op:"+", ans:0, score:0, done:0};
function mtNew(){
  var t = Math.floor(Math.random() * 4);
  var a = 2 + Math.floor(Math.random() * 18);
  var b = 2 + Math.floor(Math.random() * 9);
  if (t === 0){ mt.op = "+"; mt.ans = a + b; }
  else if (t === 1){ mt.op = "-"; if (a < b){ var z = a; a = b; b = z; } mt.ans = a - b; }
  else if (t === 2){ mt.op = "×"; mt.ans = a * b; }
  else { mt.op = "%"; var div = 3 + Math.floor(Math.random() * 6); mt.ans = a % div; b = div; }
  mt.a = a; mt.b = b;
  document.getElementById("mathQ").textContent = a + " " + mt.op + " " + b + " = ?";
  var inEl = document.getElementById("mathIn");
  inEl.value = ""; inEl.focus();
}
function mtCheck(){
  var inEl = document.getElementById("mathIn");
  var v = parseInt(inEl.value, 10);
  if (isNaN(v)) return;
  var st = document.getElementById("mathStatus");
  if (v === mt.ans){
    mt.score++;
    st.textContent = "对啦！+" + mt.score + " 分，下一题";
    st.style.color = "var(--green)";
  } else {
    st.textContent = "答案是 " + mt.ans + "。下一题继续！";
    st.style.color = "var(--action-dark)";
    addError("math", {q: mt.a + " " + mt.op + " " + mt.b + " = ?", ans: mt.ans, wrong: v, op: mt.op});
  }
  mt.done++;
  if (mt.done >= 10){
    st.textContent = "一轮完成：" + mt.score + "/10。" + (mt.score >= 8 ? "太强了！" : "再一轮会更强。");
    S.math = Math.min(10, (S.math || 0) + (mt.score >= 8 ? 1 : 0)); S.mathScore = (S.mathScore || 0) + mt.score; saveS();
    mt.done = 0; mt.score = 0;
  }
  updateTabs();
  mtNew();
}
document.getElementById("mathIn").addEventListener("keydown", function(e){ if (e.key === "Enter") mtCheck(); });
document.getElementById("mathRestart").addEventListener("click", function(){ mt.score = 0; mt.done = 0; mtNew(); });
