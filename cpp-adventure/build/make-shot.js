/* 临时：生成截图用 harness（只显示学校练习区块，打开 0201 解析页签） */
const fs = require("fs");
let h = fs.readFileSync(__dirname + "/../dist/index.html", "utf8");
const inject =
  '<style>section:not(#school){display:none !important;} .portal-hero,.adventure-map{display:none !important;}</style>' +
  '<script>window.addEventListener("load",function(){setTimeout(function(){var rm=document.getElementById("ntRemindMask");if(rm&&rm.parentNode)rm.parentNode.removeChild(rm);location.hash="#/cpp";setTimeout(function(){try{schOpen("0201");schSetTab("ex");window.scrollTo(0,0);}catch(e){document.title="ERR:"+e.message;}},500);},250);});<\/script></body>';
h = h.replace("</body>", inject);
fs.writeFileSync(__dirname + "/_shot.html", h);
console.log("harness ready");
