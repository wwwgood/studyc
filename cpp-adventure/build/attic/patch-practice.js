const fs = require("fs");
const CRLF = "\r\n";
const gp = "E:\\htdocs\\studyc\\cpp-adventure\\src\\scripts\\data\\english-grammar.js";
let t = fs.readFileSync(gp, "utf8");

/* 每章追加的新练习题（3 选项，带 lv，答案+解析） */
const ADD = {
  p1: [
    { q: "______ went to the cinema last Sunday.", o: ["I and my father", "My father and I", "Me and my father"], a: 1, lv: 2, why: "作主语排除宾格开头的选项；礼貌原则单数并列“二、三、一”（别人在前），My father and I 最标准。" },
    { q: "— Who is that woman? — Which one? — The woman under that tall tree. — ______ is my aunt.", o: ["She", "Her", "He"], a: 0, lv: 1, why: "指代“那位女士”（我的阿姨），作主语用主格 She。" },
    { q: "My father is a worker. ______ works in a big factory.", o: ["He", "She", "It"], a: 0, lv: 1, why: "爸爸是男性，作主语用 He。" },
    { q: "My mother is a teacher. ______ is a maths teacher.", o: ["He", "She", "It"], a: 1, lv: 1, why: "妈妈是女性，作主语用 She。" },
  ],
  p2: [
    { q: "Let ______ play basketball after school. (we)", o: ["we", "us", "our"], a: 1, lv: 1, why: "Let 是动词，动词后接人称代词宾格，we 的宾格是 us。" },
    { q: "Open the door for ______ (I, me) please.", o: ["I", "me", "my"], a: 1, lv: 1, why: "for 是介词，介词后必须接宾格 me。" },
    { q: "Catch ______ (he, him)! He's a thief.", o: ["he", "him", "his"], a: 1, lv: 1, why: "Catch 是动词，后接宾格 him。" },
    { q: "Look at ______ (they, them). They are drawing pictures.", o: ["they", "them", "their"], a: 1, lv: 1, why: "Look at 中 at 是介词，后接宾格 them。" },
    { q: "Give ______ a bowl of rice.", o: ["I", "she", "her"], a: 2, lv: 1, why: "Give sb. sth. 中 sb. 用宾格，her 可以是宾格（她）。" },
    { q: "— Do you know John? — Yes, can you give the books to ______?", o: ["he", "him", "his"], a: 1, lv: 1, why: "give sth. to sb.，介词 to 后接宾格 him，指代 John。" },
    { q: "Her students like ______ very much.", o: ["she", "her", "hers"], a: 1, lv: 1, why: "like 是动词，后接宾格 her，指“喜欢她”。" },
  ],
  p3: [
    { q: "______ father is reading newspaper now. (he)", o: ["His", "He", "Him"], a: 0, lv: 2, why: "空格后有名词 father，需填形容词性物主代词 His（他的）。He 是主格，Him 是宾格。" },
    { q: "These aren't ______ shoes. ______ are dark green. (I)", o: ["my; Mine", "mine; My", "my; my"], a: 0, lv: 2, why: "第一空后有名词 shoes 用形容词性 my；第二空后无名词、作主语指“我的鞋子”，用名词性 Mine。" },
    { q: "Look at the car. ______ (It's, Its) color is black.", o: ["It's", "Its", "It"], a: 1, lv: 2, why: "空格后有名词 color 需填“它的”形容词性物主代词 Its；It's = It is。" },
    { q: "Their school is in the country. ______ (Our, Ours) school is in the city.", o: ["Our", "Ours", "We"], a: 0, lv: 1, why: "空格后有名词 school，用形容词性物主代词 Our。" },
  ],
  p4: [
    { q: "Are these oranges ______ (their, theirs)?", o: ["their", "theirs", "them"], a: 1, lv: 2, why: "句末没有名词，意为“这些橘子是他们的吗？”，用名词性物主代词 theirs。" },
    { q: "The blue bike is ______ (her, his), not mine.", o: ["her", "his", "hers"], a: 1, lv: 2, why: "句末无名词需填名词性物主代词，指“他的车”用 his（his 既是形容词性也是名词性）。" },
    { q: "Your bags are green, ______ (their, theirs) are yellow.", o: ["their", "theirs", "they"], a: 1, lv: 2, why: "作主语且指“他们的包”，后无名词，用名词性物主代词 theirs。" },
    { q: "The brown jacket is ______. ______ is white and black.", o: ["my, His", "mine, His", "me, Him"], a: 1, lv: 2, why: "第一空后无名词指“我的夹克”用名词性 mine；第二空作主语指“他的夹克”用 His。" },
    { q: "A friend of ______ came to see ______ yesterday.", o: ["me, me", "my, me", "mine, me"], a: 2, lv: 2, why: "第一空双重所有格 a friend of mine 用名词性物主代词；第二空作 see 的宾语用宾格 me。" },
  ],
  p7: [
    { q: "Are there ______ rulers in your pencil-box?", o: ["a", "some", "any"], a: 2, lv: 1, why: "一般疑问句用 any；some 用于肯定句。" },
    { q: "David, I have ______ to tell you.", o: ["something interesting", "interesting something", "anything interesting"], a: 0, lv: 2, why: "肯定句用 something；形容词修饰不定代词要后置：something interesting。" },
  ],
  p8: [
    { q: "—Can you speak French? —Yes, but only ______.", o: ["little", "a little", "some"], a: 1, lv: 2, why: "French 是不可数名词；回答 Yes 表肯定“会一点”用 a little（little 是否定含义“几乎不会”）。" },
  ],
  p9: [
    { q: "Tom's parents are ______ teachers.", o: ["both", "all", "two"], a: 0, lv: 1, why: "parents 指父母两个人，两者都用 both；三者以上才用 all。" },
  ],
};

function qLine(q){
  return '      { q: ' + JSON.stringify(q.q) + ', o: ' + JSON.stringify(q.o) + ', a: ' + q.a + ', lv: ' + q.lv + ', why: ' + JSON.stringify(q.why) + ' }';
}

Object.keys(ADD).forEach(function(id){
  const s = t.indexOf('id: "' + id + '"');
  if (s < 0) throw new Error(id + " 未命中");
  const next = t.indexOf('id: "p', s + 3);
  const e = next > 0 ? next : t.length;
  const seg = t.slice(s, e);
  const tail = CRLF + "    ]" + CRLF + "  },";
  const at = seg.indexOf(tail);
  if (at < 0) throw new Error(id + " q 数组结尾未命中");
  const lines = ADD[id].map(qLine);
  const newSeg = seg.slice(0, at) + ",\r\n" + lines.join(",\r\n") + CRLF + "    ]" + seg.slice(at + (CRLF + "    ]").length);
  t = t.slice(0, s) + newSeg + t.slice(e);
  console.log(id + " 追加 " + ADD[id].length + " 题");
});

fs.writeFileSync(gp, t, "utf8");
console.log("完成");
