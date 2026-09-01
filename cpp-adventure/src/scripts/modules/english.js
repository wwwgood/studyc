var ENG_WORDS = [
  {w:"include", m:"#include", d:"包含，引入头文件", use:"#include <iostream>"},
  {w:"iostream", m:"输入输出流", d:"input output stream 的缩写", use:"#include <iostream>"},
  {w:"namespace", m:"命名空间", d:"名字的空间，防止冲突", use:"using namespace std;"},
  {w:"std", m:"标准", d:"standard 的缩写", use:"using namespace std;"},
  {w:"int", m:"整数", d:"integer 的缩写，存整数", use:"int a = 5;"},
  {w:"double", m:"小数", m2:"双精度浮点数", d:"存小数的类型", use:"double pi = 3.14;"},
  {w:"char", m:"字符", d:"character 的缩写，存单个字符", use:"char c = 'A';"},
  {w:"bool", m:"布尔", d:"true 或 false", use:"bool ok = true;"},
  {w:"cin", m:"读入", d:"C++ In，从键盘读数据", use:"cin >> n;"},
  {w:"cout", m:"输出", d:"C++ Out，打印到屏幕", use:"cout << n;"},
  {w:"for", m:"循环", d:"重复执行，有起始和结束", use:"for (int i=0;i<n;i++)"},
  {w:"while", m:"当循环", d:"当条件成立就重复", use:"while (n > 0)"},
  {w:"if", m:"如果", d:"条件成立才做", use:"if (a > b)"},
  {w:"else", m:"否则", d:"条件不成立才做", use:"else cout << 'no';"},
  {w:"return", m:"返回", d:"结束函数，给个结果", use:"return 0;"},
  {w:"break", m:"跳出", d:"立刻退出循环", use:"if (x==0) break;"},
  {w:"continue", m:"继续", d:"跳过这次，进下一轮", use:"if (x<0) continue;"},
  {w:"switch", m:"开关", d:"多选一判断", use:"switch(op)"},
  {w:"case", m:"情况", d:"switch 里的一个分支", use:"case 1: ..."},
  {w:"default", m:"默认", d:"switch 里都不匹配时执行", use:"default: ..."},
  {w:"struct", m:"结构体", d:"把多个变量打包", use:"struct Node{int x,y;}"},
  {w:"const", m:"常量", d:"constant 的缩写，不能改", use:"const int N=100;"},
  {w:"void", m:"空", d:"没有返回值", use:"void hello(){}"},
  {w:"long", m:"长整数", d:"比 int 更大的整数", use:"long long sum=0;"},
  {w:"string", m:"字符串", d:"存一串字符", use:"string s = \"hi\";"},
  {w:"sizeof", m:"大小", d:"看占多少字节", use:"sizeof(int)"},
  {w:"main", m:"主函数", d:"程序从这里开始跑", use:"int main(){}"},
];
var eng = {mode:"", idx:0, ok:0, err:0, pool:[], quizAns:0, spellInput:""};
function engNext(){
  if (eng.idx >= ENG_WORDS.length){ eng.idx = 0; }
  return ENG_WORDS[eng.idx];
}
function engShowProgress(){
  var el = document.getElementById("engProgress"); if (!el) return;
  el.textContent = "第 " + (eng.idx + 1) + "/" + ENG_WORDS.length + " 词　对 " + eng.ok + " 错 " + eng.err;
}
function engStartRead(){
  eng.mode = "read"; eng.idx = 0; eng.ok = 0; eng.err = 0;
  engRenderRead();
}
function engRenderRead(){
  var w = ENG_WORDS[eng.idx];
  var area = document.getElementById("engArea");
  area.innerHTML = '<div class="eng-stage">' +
    '<div class="eng-card-big">' + w.w + '</div>' +
    '<div class="eng-card-mean">' + w.m + '</div>' +
    '<div style="font-size:14px;color:var(--ink-soft);margin-bottom:8px;">' + w.d + '</div>' +
    '<div class="eng-card-use">' + w.use + '</div>' +
    '<div style="display:flex;gap:8px;justify-content:center;margin-top:12px;">' +
      '<button class="mode-btn" onclick="engNextRead()">下一个 →</button>' +
      '<button class="mode-btn green" onclick="engReadOk()">记住了</button>' +
    '</div></div>';
  engShowProgress();
}
function engNextRead(){
  eng.idx = (eng.idx + 1) % ENG_WORDS.length;
  engRenderRead();
}
function engReadOk(){
  eng.ok++;
  if (!S.engOk) S.engOk = 0;
  S.engOk = Math.min(ENG_WORDS.length, S.engOk + 1);
  saveS(); updateTabs();
  engNextRead();
}
function engStartQuiz(){
  eng.mode = "quiz"; eng.ok = 0; eng.err = 0;
  eng.idx = Math.floor(Math.random() * ENG_WORDS.length);
  engRenderQuiz();
}
function engRenderQuiz(){
  var w = ENG_WORDS[eng.idx];
  var area = document.getElementById("engArea");
  var opts = [w.m];
  while (opts.length < 4){
    var r = ENG_WORDS[Math.floor(Math.random() * ENG_WORDS.length)].m;
    if (opts.indexOf(r) < 0) opts.push(r);
  }
  opts.sort(function(){return Math.random() - 0.5;});
  eng.quizAns = opts.indexOf(w.m);
  var html = '<div class="eng-stage">' +
    '<div class="eng-card-big">' + w.w + '</div>' +
    '<div class="eng-quiz">这个单词的意思是？</div>' +
    '<div class="eng-options">';
  for (let i = 0; i < opts.length; i++){
    html += '<button class="eng-opt" onclick="engQuizPick(' + i + ',' + eng.quizAns + ',\'' + w.w.replace(/'/g,"\\'") + '\',\'' + w.m.replace(/'/g,"\\'") + '\')">' + opts[i] + '</button>';
  }
  html += '</div></div>';
  area.innerHTML = html;
  engShowProgress();
}
function engQuizPick(i, ans, word, mean){
  var btns = document.querySelectorAll(".eng-opt");
  btns.forEach(function(b, j){
    b.disabled = true;
    if (j === ans) b.classList.add("correct");
    else if (j === i) b.classList.add("wrong");
  });
  if (i === ans){
    eng.ok++;
    if (!S.engOk) S.engOk = 0;
    S.engOk = Math.min(ENG_WORDS.length, S.engOk + 1);
    saveS(); updateTabs();
    setTimeout(function(){ eng.idx = Math.floor(Math.random() * ENG_WORDS.length); engRenderQuiz(); }, 1100);
  } else {
    eng.err++;
    addError("eng", {q: word + " 的意思是？", ans: mean, wrong: "选错了"});
    setTimeout(function(){ engRenderQuiz(); }, 1800);
  }
}
function engStartSpell(){
  eng.mode = "spell"; eng.ok = 0; eng.err = 0;
  eng.idx = Math.floor(Math.random() * ENG_WORDS.length);
  engRenderSpell();
}
function engRenderSpell(){
  var w = ENG_WORDS[eng.idx];
  var area = document.getElementById("engArea");
  area.innerHTML = '<div class="eng-stage">' +
    '<div class="eng-card-mean" style="font-size:24px;">' + w.m + '</div>' +
    '<div style="font-size:14px;color:var(--ink-soft);margin-bottom:8px;">' + w.d + '</div>' +
    '<input class="eng-input" id="engSpellIn" placeholder="拼出英文" autocomplete="off" onkeydown="if(event.key===\'Enter\')engSpellCheck(\'' + w.w.replace(/'/g,"\\'") + '\',\'' + w.m.replace(/'/g,"\\'") + '\')">' +
    '<div class="eng-card-use" style="margin-top:4px;">' + w.use + '</div>' +
    '<p class="bug-feedback" id="engSpellFb" style="text-align:center;color:var(--blue)">拼写正确按回车提交。</p></div>';
  engShowProgress();
  var inp = document.getElementById("engSpellIn"); if (inp) inp.focus();
}
function engSpellCheck(word, mean){
  var inp = document.getElementById("engSpellIn"); if (!inp) return;
  var v = inp.value.trim().toLowerCase();
  var fb = document.getElementById("engSpellFb");
  if (v === word.toLowerCase()){
    fb.textContent = "对啦！★"; fb.style.color = "var(--green)";
    eng.ok++;
    if (!S.engOk) S.engOk = 0;
    S.engOk = Math.min(ENG_WORDS.length, S.engOk + 1);
    saveS(); updateTabs();
    setTimeout(function(){ eng.idx = Math.floor(Math.random() * ENG_WORDS.length); engRenderSpell(); }, 1100);
  } else {
    fb.textContent = "正确拼写：" + word + "。再试一次。"; fb.style.color = "var(--action-dark)";
    eng.err++;
    addError("eng", {q: "拼写：" + mean, ans: word, wrong: v});
    inp.value = ""; inp.focus();
  }
}
document.getElementById("engStartRead").addEventListener("click", engStartRead);
document.getElementById("engStartQuiz").addEventListener("click", engStartQuiz);
