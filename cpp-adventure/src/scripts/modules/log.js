var LOG_CATS = [
  {id:"信息学", cls:"cat-info", icon:"\u{1F4BB}", color:"#3B82F6"},
  {id:"数学", cls:"cat-math", icon:"\u{1F522}", color:"#34D399"},
  {id:"语文", cls:"cat-chinese", icon:"\u{1F4D6}", color:"#F87171"},
  {id:"英语", cls:"cat-english", icon:"\u{1F524}", color:"#8B5CF6"},
  {id:"学习规划", cls:"cat-plan", icon:"\u{1F3AF}", color:"#FF8A3D"},
  {id:"阅读笔记", cls:"cat-read", icon:"\u{1F4DA}", color:"#FFC94D"},
  {id:"其他", cls:"cat-other", icon:"\u{1F4DD}", color:"#4A628A"}
];
var LOG_GRADES = ["三年级","四年级","五年级","六年级","初一","初二","初三","高一","高二","高三"];
var LOG_PROG_WORDS = ["变量","数据类型","输入输出","条件判断","if","switch","循环","for","while","数组","字符串","枚举","模拟","排序","查找","递归","进制转换","一维数组","二维数组","栈","队列","结构体","贪心","函数","cout","cin","int","void","main","include","namespace","break","continue","return","const","double","char","bool","long","sizeof","string"];
var LOG_COMP_WORDS = ["CSP-J","CSP-S","GESP","市赛","省赛","国赛","NOIP","邀请赛","联赛","普及组","提高组","初赛","复赛"];
var LOG_TIME_WORDS = ["暑假","寒假","本学期","下学期","本周","今天","明天","下周","本月","今年"];
var LOG_ACT_WORDS = ["计划","目标","要做","需要","准备","复习","练习","完成","开始","学习","读完","做完","参加","报名"];

function logCatInfo(cat){
  for (let i=0;i<LOG_CATS.length;i++){ if(LOG_CATS[i].id===cat) return LOG_CATS[i]; }
  return LOG_CATS[LOG_CATS.length-1];
}
function escHtml(s){
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
function logTimeStr(ts){
  var d = new Date(ts);
  var pad = function(n){ return n<10?"0"+n:""+n; };
  return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())+" "+pad(d.getHours())+":"+pad(d.getMinutes());
}
function logAdd(){
  var cat = document.getElementById("logCat").value;
  var grade = document.getElementById("logGrade").value;
  var title = document.getElementById("logTitle").value.trim();
  var content = document.getElementById("logContent").value.trim();
  if (!title && !content){ showToast("标题和内容不能都为空哦！"); return; }
  if (!S.logs) S.logs = [];
  S.logs.unshift({id:Date.now(), cat:cat, grade:grade, title:title||"（无标题）", content:content, ts:Date.now()});
  saveS();
  document.getElementById("logTitle").value = "";
  document.getElementById("logContent").value = "";
  logRender();
  updateTabs();
  showToast("记录已保存 \u2705");
}
function logDel(id){
  if (!S.logs) return;
  S.logs = S.logs.filter(function(r){ return r.id !== id; });
  saveS();
  logRender();
  updateTabs();
  showToast("已删除");
}
function logRender(){
  var si = document.getElementById("logSearchInput");
  var kw = si ? (si.value||"").trim().toLowerCase() : "";
  var fc = document.getElementById("logFilterCat");
  var fcat = fc ? fc.value : "";
  var fg = document.getElementById("logFilterGrade");
  var fgrade = fg ? fg.value : "";
  var logs = S.logs || [];
  var filtered = logs.filter(function(r){
    if (fcat && r.cat !== fcat) return false;
    if (fgrade && r.grade !== fgrade) return false;
    if (kw){
      var hay = (r.title+" "+r.content+" "+r.cat+" "+r.grade).toLowerCase();
      if (hay.indexOf(kw) === -1) return false;
    }
    return true;
  });
  var box = document.getElementById("logList");
  if (!box) return;
  if (filtered.length === 0){
    box.innerHTML = '<div class="log-empty"><div class="big">\u{1F4CB}</div>'+(logs.length===0?"还没有记录，先写一条试试吧！":"没有匹配的记录")+'</div>';
    return;
  }
  var html = "";
  filtered.forEach(function(r){
    var ci = logCatInfo(r.cat);
    html += '<div class="log-item" style="border-left-color:'+ci.color+'">'+
      '<div class="log-item-head">'+
        '<span class="log-badge '+ci.cls+'">'+ci.icon+' '+escHtml(r.cat)+'</span>'+
        '<span class="log-grade-tag">'+escHtml(r.grade)+'</span>'+
        '<span class="log-time">'+logTimeStr(r.ts)+'</span>'+
      '</div>'+
      '<div class="log-title">'+escHtml(r.title)+'</div>'+
      (r.content ? '<div class="log-content">'+escHtml(r.content)+'</div>' : '')+
      '<button class="log-del" onclick="logDel('+r.id+')">删除</button>'+
    '</div>';
  });
  box.innerHTML = html;
}
function logExtractCore(text){
  var books = [], concepts = [], comps = [], times = [], acts = [];
  var bookRe = /《[^》]+》/g, m;
  while ((m = bookRe.exec(text)) !== null){ if (books.indexOf(m[0]) === -1) books.push(m[0]); }
  LOG_PROG_WORDS.forEach(function(w){ if (text.toLowerCase().indexOf(w.toLowerCase()) !== -1) concepts.push(w); });
  LOG_COMP_WORDS.forEach(function(w){ if (text.toUpperCase().indexOf(w.toUpperCase()) !== -1) comps.push(w); });
  LOG_TIME_WORDS.forEach(function(w){ if (text.indexOf(w) !== -1) times.push(w); });
  LOG_ACT_WORDS.forEach(function(w){ if (text.indexOf(w) !== -1) acts.push(w); });
  return {books:books, concepts:concepts, comps:comps, times:times, acts:acts};
}
function logSwitchView(v){
  document.querySelectorAll(".log-view-btn").forEach(function(b){ b.classList.remove("active"); });
  var btns = document.querySelectorAll(".log-view-btn");
  var idx = v==="list"?0 : v==="extract"?1 : 2;
  if (btns[idx]) btns[idx].classList.add("active");
  var lv = document.getElementById("logListView");
  var eb = document.getElementById("logExtractBox");
  if (v === "list"){ lv.style.display=""; eb.style.display="none"; }
  else { lv.style.display="none"; eb.style.display="block";
    if (v === "extract") logExtractAll(); else logShowPlan();
  }
}
function logExtractAll(){
  var logs = S.logs || [];
  var box = document.getElementById("logExtractBox");
  if (logs.length === 0){ box.innerHTML = '<div class="log-empty"><div class="big">\u{1F4CB}</div>还没有记录可提炼！</div>'; return; }
  var allText = logs.map(function(r){ return r.title+" "+r.content; }).join("\n");
  var ex = logExtractCore(allText);
  function grp(label, items, color){
    if (!items.length) return "";
    var tags = items.map(function(t){ return '<span class="log-extract-tag">'+escHtml(t)+'</span>'; }).join("");
    return '<div class="log-extract-group"><div class="log-extract-label" style="color:'+color+'">'+label+'（'+items.length+'）</div><div class="log-extract-tags">'+tags+'</div></div>';
  }
  var html = '<div class="log-extract-box"><h4>\u{1F50D} 核心提炼 \u00B7 共 '+logs.length+' 条记录</h4>';
  html += grp("\u{1F4DA} 书籍", ex.books, "#8B5CF6");
  html += grp("\u{1F4BB} 编程概念", ex.concepts, "#3B82F6");
  html += grp("\u{1F3C6} 竞赛阶段", ex.comps, "#FF8A3D");
  html += grp("\u{1F4C5} 时间节点", ex.times, "#34D399");
  html += grp("\u2705 行动关键词", ex.acts, "#F87171");
  if (!ex.books.length && !ex.concepts.length && !ex.comps.length && !ex.times.length && !ex.acts.length){
    html += '<p style="color:var(--ink-soft);">暂未识别到核心元素。提示：用《》标注书名，提到编程概念或竞赛名称可自动提炼。</p>';
  }
  html += '</div>';
  box.innerHTML = html;
}
function logShowPlan(){
  var logs = S.logs || [];
  var box = document.getElementById("logExtractBox");
  if (logs.length === 0){ box.innerHTML = '<div class="log-empty"><div class="big">\u{1F4CB}</div>还没有记录可规划！</div>'; return; }
  var byGrade = {};
  logs.forEach(function(r){ var g = r.grade||"未分类"; if(!byGrade[g]) byGrade[g]=[]; byGrade[g].push(r); });
  var sorted = Object.keys(byGrade).sort(function(a,b){
    var ia=LOG_GRADES.indexOf(a), ib=LOG_GRADES.indexOf(b);
    if(ia===-1) ia=99; if(ib===-1) ib=99; return ia-ib;
  });
  var html = '<div class="log-plan-box"><h4>\u{1F3AF} 年级规划视图 \u00B7 按年级汇总</h4>';
  sorted.forEach(function(g){
    var recs = byGrade[g];
    var allText = recs.map(function(r){ return r.title+" "+r.content; }).join("\n");
    var ex = logExtractCore(allText);
    html += '<div class="log-plan-grade"><div class="log-plan-grade-title">'+escHtml(g)+' \u00B7 '+recs.length+' 条记录</div><ul class="log-plan-items">';
    if (ex.books.length) html += '<li>\u{1F4DA} 书籍：'+ex.books.map(escHtml).join("、")+'</li>';
    if (ex.concepts.length) html += '<li>\u{1F4BB} 编程知识点：'+ex.concepts.map(escHtml).join("、")+'</li>';
    if (ex.comps.length) html += '<li>\u{1F3C6} 竞赛目标：'+ex.comps.map(escHtml).join("、")+'</li>';
    if (ex.times.length) html += '<li>\u{1F4C5} 时间节点：'+ex.times.map(escHtml).join("、")+'</li>';
    if (ex.acts.length) html += '<li>\u2705 行动关键词：'+ex.acts.map(escHtml).join("、")+'</li>';
    html += '<li>\u{1F4CB} 本年级记录：</li><ul class="log-plan-sub">';
    recs.forEach(function(r){ html += '<li>'+escHtml(r.title)+'（'+escHtml(r.cat)+'）</li>'; });
    html += '</ul></ul></div>';
  });
  html += '</div>';
  box.innerHTML = html;
}


/* --------- 批量提纯 --------- */
var LOG_BATCH_RESULTS = [];
function logBatchToggle(){
  var btn = document.getElementById("logBatchToggle");
  var area = document.getElementById("logBatchArea");
  if (!btn || !area) return;
  var open = area.style.display !== "none";
  if (open){ area.style.display = "none"; btn.classList.remove("open"); }
  else { area.style.display = "flex"; btn.classList.add("open"); }
}
function logBatchClear(){
  var ti = document.getElementById("logBatchInput"); if (ti) ti.value = "";
  var rb = document.getElementById("logBatchResults"); if (rb) rb.innerHTML = "";
  var st = document.getElementById("logBatchStat"); if (st) st.textContent = "";
  LOG_BATCH_RESULTS = [];
}
function logSplitSegments(raw){
  var lines = raw.split(/\n+/);
  var segs = [];
  lines.forEach(function(line){
    line = line.trim();
    if (!line) return;
    line = line.replace(/^\d{4}[\/\-.]\d+[\/\-.]\d+\s+\d+[:：]\d+\s*/, "");
    line = line.replace(/^[^\s:：]{2,10}[\s:：]+/, "");
    line = line.replace(/\[表情\]|\[图片\]|\[语音\]|\[视频\]|\[文件\]|\[链接\]|\[红包\]|\[转账\]|\[收款\]/g, "");
    line = line.trim();
    if (!line) return;
    if (line.length > 80){
      var subs = line.split(/[。！？；]/);
      var buf = "";
      subs.forEach(function(s){
        s = s.trim();
        if (!s) return;
        if (buf && (buf.length + s.length > 80)){ segs.push(buf); buf = s; }
        else { buf = buf ? buf + "。" + s : s; }
      });
      if (buf) segs.push(buf);
    } else { segs.push(line); }
  });
  return segs;
}
function logIsNoise(text){
  if (/\d+\.?\d*%/.test(text)) return false;
  if (text.length < 6) return true;
  var noise = [
    /^(好的?|收到|谢谢|嗯+|哈哈+|ok|OK|行|对|是|不是|可以|了解|明白|知道|好嘞|好的呀|没问题|辛苦了?|感谢|赞|棒|牛)[！。？～~]*$/,
    /^撤回了一条消息/,
    /^(早上好|下午好|晚上好|早安|晚安|新年好|节日快乐)[！。？]*$/,
    /^\d+$/,
    /^\d{1,2}[:：]\d{2}$/,
    /^[@＠].*/,
    /^https?:\/\//,
    /^(已阅|已看|已读|已收到|已转|已发)/,
    /^(请问|咨询|了解一?下|想问|麻烦问)[？?]?$/
  ];
  for (let i = 0; i < noise.length; i++){ if (noise[i].test(text)) return true; }
  return false;
}
var LOG_VALUE_WORDS = ["学","练","训练","课","教","考","题","作业","复习","预习","刷题","上课","集训","培训","辅导","计划","安排","目标","规划","准备","报名","开营","开课","截止","时间","进度","建议","应该","需要","关键","重要","必须","注意","记住","没必要","来得及","耽误","抢跑","贯通","衔接","比赛","竞赛","CSP","GESP","邀请赛","初赛","复赛","市赛","省赛","国赛","NOIP","明天","下周","本月","暑假","寒假","学期","开学","期末","期中","即将","数学","思维","逻辑","算法","编程","信息学","C++","小升初","五升六","四升五","三升四","初中","高中","教辅","教材","视频课","网课","老师","教练","家长","同学","考点","题型","难度","基础","提高","拓展","中考","高考","上线率","录取","升学","总分","成绩","分数","占比","纪中","一中","侨中","桂山","实中","普高","分数线","招生","指标","正取","满分","平均分","最高分","最低分","重点","中学","排名","排位","志愿","填报","统招","调剂","实验班","尖子班","重点班","特长生","分班","联考","统考","模考","月考","调考","期考","成绩单","录取线","公费","自费","择校","分配","定向","名额","生源","报考","考纲","考题","真题","模拟"];
function logScoreText(text){
  var s = 0;
  LOG_VALUE_WORDS.forEach(function(w){ if (text.indexOf(w) !== -1) s++; });
  if (text.length > 25) s++;
  if (text.length > 50) s++;
  if (/《[^》]+》/.test(text)) s++;
  if (/\d+月|\d+号|\d+日|周[一二三四五六日]/.test(text)) s++;
  if (/\d+\.?\d*%/.test(text)) s += 2;
  if (/\d+分以上\d+人/.test(text)) s += 2;
  if (/率为\d/.test(text)) s += 1;
  if (/A\+|A率/.test(text)) s += 1;
  if (/\d+人/.test(text) && /占比|比例|占/.test(text)) s += 1;
  if (/上线|录取|分数|成绩|招生|排名/.test(text)) s += 1;
  return s;
}
function logDetectCat(text){
  if (/(C\+\+|编程|算法|信息学|代码|程序|for|while|cout|cin|数组|循环|变量|CSP|GESP|NOIP)/i.test(text)) return "\u4fe1\u606f\u5b66";
  if (/(数学|思维|算术|奥数|计算|几何|代数|数论|应用题)/.test(text)) return "\u6570\u5b66";
  if (/(语文|阅读|作文|古诗|背诵|默写|文言文)/.test(text)) return "\u8bed\u6587";
  if (/(英语|单词|语法|听力|口语|剑桥|新概念)/.test(text)) return "\u82f1\u8bed";
  if (/(计划|安排|目标|规划|准备|策略|方向|路线|节奏|贯通|衔接|抢跑|小升初|升学|集训|培训|中考|高考|上线率|录取|分数线|总分|成绩|招生|志愿|排名|排位|纪中|一中|侨中|桂山|实中|普高|A\+|占比|分以上|满分|平均分|重点|中学|指标|正取|特长生|分班|联考|统考|模考)/.test(text)) return "\u5b66\u4e60\u89c4\u5212";
  if (/《[^》]+》|教辅|教材|书|读物/.test(text)) return "\u9605\u8bfb\u7b14\u8bb0";
  return "\u5176\u4ed6";
}
function logDetectGrade(text){
  if (/(小升初|升初|初一|七年级)/.test(text)) return "\u516d\u5e74\u7ea7";
  if (/(五升六|五年级|六年级)/.test(text)) return "\u4e94\u5e74\u7ea7";
  if (/(四升五|四年级|五年级)/.test(text)) return "\u56db\u5e74\u7ea7";
  if (/(三升四|三年级)/.test(text)) return "\u4e09\u5e74\u7ea7";
  if (/(初二|初三)/.test(text)) return "\u521d\u4e8c";
  return "\u56db\u5e74\u7ea7";
}
function logGenTitle(text){
  var t = text.substring(0, 30);
  var cut = t.search(/[，。！？；,]/);
  if (cut > 6) t = t.substring(0, cut);
  if (text.length > 30) t += "\u2026";
  return t;
}
function logMergeDataLines(segs){
  var merged = [];
  var buf = "";
  segs.forEach(function(s){
    var isData = /\d+\.?\d*%/.test(s) || /率为\d/.test(s) || /\d+分以上\d+人/.test(s);
    var isShort = s.length < 50;
    if (isData && isShort){
      buf = buf ? buf + "\n" + s : s;
    } else {
      if (buf){ merged.push(buf); buf = ""; }
      merged.push(s);
    }
  });
  if (buf) merged.push(buf);
  return merged;
}
function logBatchPurify(){
  var raw = document.getElementById("logBatchInput").value.trim();
  if (!raw){ showToast("\u8bf7\u5148\u7c98\u8d34\u6587\u5b57"); return; }
  var segs = logSplitSegments(raw);
  segs = logMergeDataLines(segs);
  var total = segs.length;
  var filtered = segs.filter(function(s){ return !logIsNoise(s); });
  var noiseCount = total - filtered.length;
  var scored = filtered.map(function(s){
    return { text: s, score: logScoreText(s), cat: logDetectCat(s), grade: logDetectGrade(s), title: logGenTitle(s), saved: false };
  });
  var valuable = scored.filter(function(item){ return item.score >= 2; });
  var lowValue = scored.filter(function(item){ return item.score < 2; });
  LOG_BATCH_RESULTS = valuable;
  var stat = document.getElementById("logBatchStat");
  if (stat) stat.innerHTML = "\u5171 " + total + " \u6761\uff0c\u8fc7\u6ee4\u5e9f\u8bdd " + noiseCount + " \u6761\uff0c\u4f4e\u4ef7\u503c " + lowValue.length + " \u6761\uff0c<b>\u63d0\u53d6\u51fa " + valuable.length + " \u6761\u6709\u4ef7\u503c\u4fe1\u606f</b>";
  logBatchRender();
}
function logBatchRender(){
  var box = document.getElementById("logBatchResults");
  if (!box) return;
  if (LOG_BATCH_RESULTS.length === 0){
    box.innerHTML = '<div class="log-batch-empty"><div class="big">\U0001F50D</div>\u672a\u63d0\u53d6\u5230\u6709\u4ef7\u503c\u4fe1\u606f\uff0c\u8bf7\u5c1d\u8bd5\u7c98\u8d34\u66f4\u591a\u5bf9\u8bdd\u6587\u5b57</div>';
    return;
  }
  var html = "";
  LOG_BATCH_RESULTS.forEach(function(item, idx){
    var ci = logCatInfo(item.cat);
    var savedTag = item.saved ? '<span class="log-batch-saved-tag">\u2705 \u5df2\u4fdd\u5b58</span>' : "";
    html += '<div class="log-batch-item" style="border-left-color:' + ci.color + '" id="logBatchItem_' + idx + '">' +
      '<div class="log-batch-item-head">' +
        '<input type="checkbox" checked id="logBatchChk_' + idx + '">' +
        '<span class="log-batch-score">\u4ef7\u503c\u5206 ' + item.score + '</span>' +
        '<span class="log-badge ' + ci.cls + '">' + ci.icon + ' ' + escHtml(item.cat) + '</span>' +
        '<span class="log-grade-tag">' + escHtml(item.grade) + '</span>' +
        savedTag +
      '</div>' +
      '<div class="log-batch-item-fields">' +
        '<div class="log-batch-field-row">' +
          '<div class="log-field"><span class="log-label">\u7c7b\u522b</span>' +
            '<select class="log-select" id="logBatchCat_' + idx + '">' +
              '<option value="\u4fe1\u606f\u5b66"' + (item.cat==="\u4fe1\u606f\u5b66"?" selected":"") + '>\U0001F4BB \u4fe1\u606f\u5b66</option>' +
              '<option value="\u6570\u5b66"' + (item.cat==="\u6570\u5b66"?" selected":"") + '>\U0001F522 \u6570\u5b66</option>' +
              '<option value="\u8bed\u6587"' + (item.cat==="\u8bed\u6587"?" selected":"") + '>\U0001F4D6 \u8bed\u6587</option>' +
              '<option value="\u82f1\u8bed"' + (item.cat==="\u82f1\u8bed"?" selected":"") + '>\U0001F524 \u82f1\u8bed</option>' +
              '<option value="\u5b66\u4e60\u89c4\u5212"' + (item.cat==="\u5b66\u4e60\u89c4\u5212"?" selected":"") + '>\U0001F3AF \u5b66\u4e60\u89c4\u5212</option>' +
              '<option value="\u9605\u8bfb\u7b14\u8bb0"' + (item.cat==="\u9605\u8bfb\u7b14\u8bb0"?" selected":"") + '>\U0001F4DA \u9605\u8bfb\u7b14\u8bb0</option>' +
              '<option value="\u5176\u4ed6"' + (item.cat==="\u5176\u4ed6"?" selected":"") + '>\U0001F4DD \u5176\u4ed6</option>' +
            '</select>' +
          '</div>' +
          '<div class="log-field"><span class="log-label">\u5e74\u7ea7</span>' +
            '<select class="log-select" id="logBatchGrade_' + idx + '">' +
              ["\u4e09\u5e74\u7ea7","\u56db\u5e74\u7ea7","\u4e94\u5e74\u7ea7","\u516d\u5e74\u7ea7","\u521d\u4e00","\u521d\u4e8c","\u521d\u4e09"].map(function(g){
                return '<option value="' + g + '"' + (item.grade===g?" selected":"") + '>' + g + '</option>';
              }).join("") +
            '</select>' +
          '</div>' +
          '<div class="log-field" style="flex:1;min-width:200px;"><span class="log-label">\u6807\u9898</span>' +
            '<input class="log-batch-title-input" id="logBatchTitle_' + idx + '" value="' + escHtml(item.title) + '">' +
          '</div>' +
        '</div>' +
        '<div class="log-field"><span class="log-label">\u5185\u5bb9</span>' +
          '<textarea class="log-batch-content-input" id="logBatchContent_' + idx + '">' + escHtml(item.text) + '</textarea>' +
        '</div>' +
      '</div>' +
      '<div class="log-batch-item-actions">' +
        (item.saved ? '' : '<button class="log-batch-save-one" onclick="logBatchSaveOne(' + idx + ')">\U0001F4BE \u4fdd\u5b58\u8fd9\u6761</button>') +
      '</div>' +
    '</div>';
  });
  html += '<div class="log-batch-footer">' +
    '<button class="log-batch-save-all" onclick="logBatchSaveAll()">\U0001F4BE \u5168\u90e8\u4fdd\u5b58\u9009\u4e2d</button>' +
    '<span style="font-size:13px;color:var(--ink-soft);">\u52fe\u9009\u8981\u4fdd\u5b58\u7684\u6761\u76ee\uff0c\u53d6\u6d88\u52fe\u9009\u53ef\u8df3\u8fc7\u4e0d\u9700\u8981\u7684</span>' +
  '</div>';
  box.innerHTML = html;
}
function logBatchSaveOne(idx){
  var item = LOG_BATCH_RESULTS[idx];
  if (!item || item.saved) return;
  var cat = document.getElementById("logBatchCat_" + idx).value;
  var grade = document.getElementById("logBatchGrade_" + idx).value;
  var title = document.getElementById("logBatchTitle_" + idx).value.trim() || "\uff08\u65e0\u6807\u9898\uff09";
  var content = document.getElementById("logBatchContent_" + idx).value.trim();
  if (!content){ showToast("\u5185\u5bb9\u4e0d\u80fd\u4e3a\u7a7a"); return; }
  if (!S.logs) S.logs = [];
  S.logs.unshift({id: Date.now()+idx, cat: cat, grade: grade, title: title, content: content, ts: Date.now()});
  saveS();
  item.saved = true;
  logBatchRender();
  logRender();
  updateTabs();
  showToast("\u5df2\u4fdd\u5b58\uff1a" + title.substring(0, 20));
}
function logBatchSaveAll(){
  var saved = 0;
  LOG_BATCH_RESULTS.forEach(function(item, idx){
    if (item.saved) return;
    var chk = document.getElementById("logBatchChk_" + idx);
    if (chk && !chk.checked) return;
    var cat = document.getElementById("logBatchCat_" + idx).value;
    var grade = document.getElementById("logBatchGrade_" + idx).value;
    var title = document.getElementById("logBatchTitle_" + idx).value.trim() || "\uff08\u65e0\u6807\u9898\uff09";
    var content = document.getElementById("logBatchContent_" + idx).value.trim();
    if (!content) return;
    if (!S.logs) S.logs = [];
    S.logs.unshift({id: Date.now()+idx, cat: cat, grade: grade, title: title, content: content, ts: Date.now()});
    item.saved = true;
    saved++;
  });
  if (saved > 0){
    saveS();
    logBatchRender();
    logRender();
    updateTabs();
    showToast("\u6210\u529f\u4fdd\u5b58 " + saved + " \u6761\u8bb0\u5f55 \u2705");
  } else {
    showToast("\u6ca1\u6709\u9009\u4e2d\u7684\u6761\u76ee");
  }
}
