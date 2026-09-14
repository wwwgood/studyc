const fs = require("fs");

function replaceAround(src, from, to, newText) {
  const i = src.indexOf(from);
  if (i < 0) throw new Error("未找到 from: " + from.slice(0, 40));
  const j = src.indexOf(to, i);
  if (j < 0) throw new Error("未找到 to: " + to.slice(0, 40));
  return src.slice(0, i) + newText + src.slice(j + to.length);
}

/* english-quest.js */
let p1 = "E:\\htdocs\\studyc\\cpp-adventure\\src\\scripts\\modules\\english-quest.js";
let t1 = fs.readFileSync(p1, "utf8");
t1 = replaceAround(t1,
  "topicExamOpen(\\'grammar\\',",
  "🎯 专题真题</button>",
  "topicExamOpen(\\'grammar\\',\\'all\\',\\'全部英语真题\\')" + '">📚 全部真题一起练</button>');
fs.writeFileSync(p1, t1, "utf8");
console.log("english-quest 入口已改");

/* vocab-quest.js */
let p2 = "E:\\htdocs\\studyc\\cpp-adventure\\src\\scripts\\modules\\vocab-quest.js";
let t2 = fs.readFileSync(p2, "utf8");
t2 = replaceAround(t2,
  "topicExamOpen(\\'vocab\\',",
  "🎯 专题真题</button>",
  "topicExamOpen(\\'vocab\\',\\'all\\',\\'全部词汇真题\\')" + '">📚 全部真题一起练</button>');
fs.writeFileSync(p2, t2, "utf8");
console.log("vocab-quest 入口已改");

/* reading-quest.js */
let p3 = "E:\\htdocs\\studyc\\cpp-adventure\\src\\scripts\\modules\\reading-quest.js";
let t3 = fs.readFileSync(p3, "utf8");
t3 = replaceAround(t3,
  "topicExamOpen(\\'reading\\',0,",
  "🎯 专题真题</button>",
  "topicExamOpen(\\'reading\\',\\'all\\',\\'全部阅读真题\\')" + '">📚 全部真题一起练</button>');
fs.writeFileSync(p3, t3, "utf8");
console.log("reading-quest 入口已改");
