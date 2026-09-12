const fs = require("fs");
const p = "E:\\htdocs\\studyc\\cpp-adventure\\src\\scripts\\modules\\topic-exam.js";
let t = fs.readFileSync(p, "utf8");
const NL = "\r\n";

const old1 = "  var questions = [];" + NL + "  var count = 10;";
const new1 = "  var questions = [];" + NL + "  var count = 10;" + NL + "  if (topicId === \"all\") count = 9999;";
if (t.indexOf(old1) < 0) throw new Error("①未命中");
t = t.split(old1).join(new1);

const old2 = "    questions = qbSelect(module, topicId, count, null, \"english\");";
const new2 = "    questions = qbSelect(module, (topicId === \"all\" ? null : topicId), count, null, \"english\");";
if (t.indexOf(old2) < 0) throw new Error("②未命中");
t = t.split(old2).join(new2);

fs.writeFileSync(p, t, "utf8");
console.log("topic-exam 全部混练支持已加");
