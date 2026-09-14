const fs = require("fs");
const CRLF = "\r\n";
const gp = "E:\\htdocs\\studyc\\cpp-adventure\\src\\scripts\\data\\english-grammar.js";
let t = fs.readFileSync(gp, "utf8");

const oldQ = [
  '    q: [',
  '      { q: "下列哪个是代词？", o: ["run", "they", "apple"], a: 1, why: "they（他们）是代词；run 是动词，apple 是名词。" },',
  '      { q: "「我自己」属于哪类代词？", o: ["人称代词", "反身代词", "物主代词"], a: 1, why: "表示「我自己」的是反身代词 myself。" }',
  '    ]',
].join(CRLF);
const newQ = [
  '    q: [',
  '      { q: "代词的作用是什么？", o: ["避免啰嗦、让句子简洁", "让句子变长", "代替动词"], a: 0, lv: 1, why: "代词用来代替名词，避免重复啰嗦：Tom likes his car. He drives it." },',
  '      { q: "「你的」属于哪类代词？", o: ["人称代词", "物主代词", "指示代词"], a: 1, lv: 1, why: "表示「谁的」的是物主代词（my、your、his…）。" },',
  '      { q: "「这个」属于哪类代词？", o: ["指示代词", "不定代词", "疑问代词"], a: 0, lv: 1, why: "this / that / these / those 是指示代词。" },',
  '      { q: "「某人」属于哪类代词？", o: ["反身代词", "不定代词", "物主代词"], a: 1, lv: 2, why: "somebody / someone / 某人 是不定代词，指不确定的人。" },',
  '      { q: "「谁」属于哪类代词？", o: ["疑问代词", "人称代词", "反身代词"], a: 0, lv: 2, why: "who / what / which 用来提问，是疑问代词。" },',
  '      { q: "下列哪个是代词？", o: ["happy", "nobody", "jump"], a: 1, lv: 2, why: "nobody（没有人）是不定代词；happy 是形容词，jump 是动词。" }',
  '    ]',
].join(CRLF);
if (t.indexOf(oldQ) < 0) throw new Error("pz q 未命中");
t = t.split(oldQ).join(newQ);
fs.writeFileSync(gp, t, "utf8");
console.log("pz 练习题补足 6 题");
