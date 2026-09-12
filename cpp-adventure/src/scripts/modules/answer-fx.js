/* ---------------- 答题动效 answer-fx.js ----------------
 * 每次答题后的全屏轻动效：
 *   答对 → 彩纸雨 + 蹦出来的鼓励语（🎉🌟🎊）
 *   答错 → 柔和的小雨点 + 暖心鼓励（💪 加油）
 * 用法：fxAnswer(true) / fxAnswer(false)。
 * 1.6 秒自动消失；层为 pointer-events:none，不挡任何点击。
 * 系统开启"减少动态效果"时自动跳过。
 */
var FX_OK_LINES = ["太棒了！", "答对啦！", "你真棒！", "厉害了！", "继续冲！", "满分操作！", "脑子转得真快！"];
var FX_NO_LINES = ["没关系，再来一次！", "错了不怕，学到就是赚到！", "就差一点点，加油！", "思考的孩子最棒～", "下次一定对！", "深呼吸，再看一眼解析"];

function fxAnswer(ok){
  try {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var old = document.getElementById("fxAnswerLayer");
    if (old) old.remove();

    var layer = document.createElement("div");
    layer.id = "fxAnswerLayer";
    layer.className = ok ? "ok" : "no";
    var lines = ok ? FX_OK_LINES : FX_NO_LINES;
    var line = lines[Math.floor(Math.random() * lines.length)];
    var emojis = ok ? ["🎉", "🌟", "🎊", "🏆", "💯", "🚀"] : ["💪", "🌱", "🤗", "⚡"];
    var emo = emojis[Math.floor(Math.random() * emojis.length)];
    layer.innerHTML =
      '<div class="fx-answer">' +
        '<div class="fx-emoji">' + emo + '</div>' +
        '<div class="fx-line">' + line + '</div>' +
      '</div>';
    var colors = ok
      ? ["#FFC94D", "#FF8A3D", "#3B82F6", "#34D399", "#8B5CF6", "#F87171"]
      : ["#93C5FD", "#FCD34D", "#A7F3D0", "#FDA4AF"];
    var n = ok ? 26 : 12;
    for (var i = 0; i < n; i++){
      var s = document.createElement("span");
      s.className = "fx-particle";
      s.style.left = (5 + Math.random() * 90) + "%";
      s.style.background = colors[Math.floor(Math.random() * colors.length)];
      s.style.animationDelay = (Math.random() * 0.35) + "s";
      s.style.animationDuration = (1 + Math.random() * 0.8) + "s";
      layer.appendChild(s);
    }
    document.body.appendChild(layer);
    setTimeout(function(){
      var l = document.getElementById("fxAnswerLayer");
      if (l) l.remove();
    }, 1600);
  } catch(e){}
}
