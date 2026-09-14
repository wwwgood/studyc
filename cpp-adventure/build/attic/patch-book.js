const fs = require("fs");

/* ============ 教材内容（《小学英语语法100例·代词》） ============ */
const BOOKS = {
  pz: [
    "【什么是代词】用来代替名词（人或事物的名称）的词，作用是避免啰嗦。比如不说 “Tom likes Tom's car. Tom drives Tom's car”，而是说 “Tom likes his car. He drives it”。",
    "【代词家族 6 大类（必考分类）】① 人称代词（我、你、他…）② 物主代词（我的、你的…）③ 反身代词（我自己、你自己…）④ 指示代词（这个、那个…）⑤ 疑问代词（谁、什么…）⑥ 不定代词（某人、某事、一切…）。",
    "【极速记忆口诀】① 人称代词主宾格：主格作主头前站，宾格作宾后边站；动词介词后跟宾，切莫混淆记心间。② 物主代词：形物代，能力差，后面必须把名加；名物代，能力强，后面名词不能放；his、its 本是一样，单数复数不加长。③ 人称排序：单数并列二（你）三（他）一（我）；复数并列一（我们）二（你们）三（他们）。④ some/any：肯定 some，否定 any，疑问 usually 用 any；若表请求或建议，some 进句莫迟疑。",
    "【学习建议】① 把「人称代词表」和「物主代词表」抄在笔记本第一页，这是所有代词题的根基。② 盯紧名词：做物主代词题，先看横线后面有没有名词——有名词选形容词性（my/your…），没名词选名词性（mine/yours…）。③ 注意单复数：看到 these/those、both/all、either/neither，立刻判断谓语动词用 is 还是 are。④ 特殊用法要敏感：it 表天气/时间、who 在介词后变 whom、some 在请求疑问句——都是拿分点。",
  ],
  p1: [
    "【人称代词核心表格（建议背诵）】人称 单数（主格/宾格）复数（主格/宾格）：第一人称 I/me → we/us；第二人称 you/you → you/you；第三人称 he/him、she/her、it/it → they/them。",
    "【主格与宾格铁律】主格（Subject）放在动词前面，作主语：She often goes shopping.（She 是动作发出者）。宾格（Object）放在动词或介词后面，作宾语：Who teaches us English?（us 在 teaches 后面）；We often write E-mails to her.（her 在介词 to 后面）。",
    "【it 的“七十二变”（高分考点）】① 指动物：通常用 it；表示喜爱（宠物、故事里的动物）可以用 he/she：The rabbit didn't know where she was.（把兔子拟人化）② 指无生命物体：表达热爱、赞美时，祖国、大地、月亮可用 she：The moon… she looks like a round plate. ③ 指天气：It is hot today. ④ 指时间：It is 8 o'clock. ⑤ 指距离：It is 3 kilometres away.",
    "【主格排序（礼貌原则）】单数并列：You > He/She > I（把别人放前面，自己放最后）：You, he and I are all fans. 复数并列：We > You > They（通常把自己这方放前面）：We, you and they will visit Shanghai Zoo.",
  ],
  p2: [
    "【主格与宾格用法铁律】主格放在动词前面作主语；宾格放在动词或介词后面作宾语。例（动词后）：Who teaches us English?（us 在 teaches 后面）例（介词后）：We often write E-mails to her.（her 在介词 to 后面）。",
    "【口语提醒】口语中常用 Who 代替 Whom；介词后面只能用 Whom：With whom?",
  ],
  p3: [
    "【物主代词对比表格】类别 形容词性（我的…）名词性（我的东西）记忆技巧：第一人称单数 my / mine → my+名词；第二人称单数 your / yours → your+名词；第三人称单数 his / his、her / hers、its / its（注意：his 和 its 形式不变）；第一人称复数 our / ours → our+名词；第二人称复数 your / yours；第三人称复数 their / theirs → their+名词。",
    "【核心区别】形容词性物主代词（弱）：后面必须跟名词，像形容词一样修饰名词：This is my book.（my 后面有 book）。名词性物主代词（强）：后面绝对不能跟名词，它自己就等于“形容词性物主代词 + 名词”：This is mine.（= my book）；Ours is very big.（= Our classroom）。",
    "【口诀】形物代，能力差，后面必须把名加；名物代，能力强，后面名词不能放。",
  ],
  p4: [
    "【核心区别】名词性物主代词后面绝对不能跟名词，自己就等于“形容词性物主代词 + 名词”：This is mine.（= my book）；Ours is very big.（= Our classroom）。",
    "【双重所有格（难点）】结构：of + 名词性物主代词，表示“…的一个/一些”。A friend of mine = 我的一个朋友（暗示我有很多朋友，这是其中之一）；My friend = 我的朋友（特指某一个，或强调关系）。",
  ],
  p5: [
    "【含义】反身代词表示“…自己”。",
    "【构成】单数：-self（myself, yourself, himself, herself, itself）；复数：-selves（ourselves, yourselves, themselves）。",
    "【用法】① 作宾语：enjoy oneself（玩得开心）。② 强调：I myself did it.（我自己做的）。",
  ],
  p6: [
    "【近指与远指】近指：this（这个）、these（这些）；远指：that（那个）、those（那些）。",
    "【电话用语】介绍自己：This is…（我是…）；询问对方：Is that…?（你是…吗？）",
    "【指代前文】That's the problem.（That 指代前面提到的情况）",
  ],
  p7: [
    "【Some 与 Any 基本规则】Some 通常用于肯定句，表示“一些”，可修饰可数名词复数（some apples），也可修饰不可数名词（some water）。Any 通常用于否定句和疑问句，表示“一些”或“任何”。",
    "【考试特例（必背）】① Some 用在疑问句：表示建议、请求，或希望得到肯定回答时用 some 不用 any：Would you like some coffee?（表示建议）；Can I have some money?（表示请求）② Any 用在肯定句：当意思变成“任何的”：You can ask any teacher here.",
    "【记忆口诀】Some 肯定 Any 否，疑问句中 Any 走；若表请求或建议，Some 进疑问不用愁；Any 若译“任何”意，肯定句中也能留。",
    "【复合不定代词】由 some/any/no/every + body/one/thing 构成（something, anyone, nobody…）。规则一：形容词修饰必须后置：I want to eat something delicious.（不能说 delicious something）规则二：作主语永远看作单数：Everybody is here.",
  ],
  p8: [
    "【Few / A few 与 Little / A little】这组词不仅看数量，还要看“态度”：修饰可数名词（books）：a few 肯定“有一点，但还是有”；few 否定“几乎没有了”。修饰不可数名词（water）：a little 肯定“有一点”；little 否定“几乎没有了”。",
    "【Many / Much】Many 修饰可数名词；Much 修饰不可数名词。",
    "【A lot of / Lots of】通吃！既可修饰可数，也可修饰不可数，常用于肯定句。",
  ],
  p9: [
    "【Both 与 All 的数量游戏】Both 指两者都（2 个人/物）：Both of the boys… / The boys are both…。All 指三者或三者以上都（≥3），也可指整体（全部）：All of the students… / We all like…",
    "【位置规则】放在 be 动词、助动词、情态动词之后，实义动词之前：They are all students.（be 动词后）；We all like swimming.（实义动词前）。",
  ],
  p10: [
    "【No 与 None 的区别】No 是形容词，不能单独使用，后面必须加名词：I have no money.（= not any）。None 是代词，单独使用，后面不能直接加名词，常与 of 连用：I have none.（我一点也没有）；None of the students are/is here.（学生没一个在这儿）。谓语单复数：None of + 不可数名词，谓语用单数；None of + 可数名词复数，谓语单复数均可（口语常用复数）。",
    "【“另一个”家族】Another：泛指“另一个、再一个”（总数不确定）：Give me another one. The other：特指“两者中的另一个”：One hand holds a book, the other holds a pen.（公式：One…, the other…）Others：泛指“别人、别的东西”（= other + 复数名词）：Some like football, others like basketball. The others：特指“其余的所有人/物”：Ten are on the playground, the others are in the classroom.（公式：Some…, the others…）",
    "【记忆口诀】两者之间用 the other，三者以上 another 凑；others 泛指别的人，the others 剩的全都有。",
  ],
  p11: [
    "【疑问代词 5W1H】Who（谁 - 主格）/ Whom（谁 - 宾格）：口语中常用 Who 代替 Whom；介词后面只能用 Whom（With whom?）。Whose（谁的）：后面接名词（Whose book?）。What（什么）：问事物或职业。Which（哪一个）：在有限范围内选择。",
  ],
};

/* ============ 写入 english-grammar.js ============ */
const CRLF = "\r\n";
const gp = "E:\\htdocs\\studyc\\cpp-adventure\\src\\scripts\\data\\english-grammar.js";
let t = fs.readFileSync(gp, "utf8");

/* pz 总览章节：插到代词森林注释后 */
const pzObj = [
  "  {",
  '    id: "pz", ch: 3, t: "代词总览与分类", tip: "先认全代词家族，再逐个击破",',
  '    body: "代词是代替名词（人或事物名称）的词，作用是避免啰嗦：Tom likes his car. He drives it.（用 his 和 it 代替重复）。英语代词分 6 大类：人称代词（我/你/他）、物主代词（我的/你的）、反身代词（我自己）、指示代词（这个/那个）、疑问代词（谁/什么）、不定代词（某人/某事）。",',
  '    say: "人称物主反身指，疑问不定共六类；代词一用不啰嗦，考点从此逐个破。",',
  '    book: ' + JSON.stringify(BOOKS.pz.map(function(x){ return x.replace(/"/g, "'"); }).join("<br>")) + ",",
  '    ex: [',
  '      { en: "Tom likes his car. He drives it.", zh: "汤姆喜欢他的车，他开着它。（his / it 代替重复）" },',
  '      { en: "This is my book. That is yours.", zh: "这是我的书，那是你的。（指示代词 + 物主代词）" },',
  '      { en: "Who is he? He is my friend.", zh: "他是谁？他是我的朋友。（疑问代词 + 人称代词）" }',
  "    ],",
  '    q: [',
  '      { q: "下列哪个是代词？", o: ["run", "they", "apple"], a: 1, why: "they（他们）是代词；run 是动词，apple 是名词。" },',
  '      { q: "「我自己」属于哪类代词？", o: ["人称代词", "反身代词", "物主代词"], a: 1, why: "表示「我自己」的是反身代词 myself。" }',
  "    ]",
  "  },",
  "",
].join(CRLF);
const anchorZ = "  /* ============ 第三章 代词森林（11 例） ============ */" + CRLF + "  {";
if (t.indexOf(anchorZ) < 0) throw new Error("pz 锚点未命中");
const newZ = "  /* ============ 第三章 代词森林（12 例） ============ */" + CRLF + pzObj + "  {";
t = t.split(anchorZ).join(newZ);

/* 每章 book 字段：在 tip 行后插入 */
const tips = {
  p1: '    id: "p1", ch: 3, t: "人称代词主格", tip: "干活的先锋队",',
  p2: '    id: "p2", ch: 3, t: "人称代词宾格", tip: "接受动作的接球队员",',
  p3: '    id: "p3", ch: 3, t: "形容词性物主代词", tip: "my / your 是小标签",',
  p4: '    id: "p4", ch: 3, t: "名词性物主代词", tip: "mine 独立站，名词不用带",',
  p5: '    id: "p5", ch: 3, t: "反身代词", tip: "照镜子的自己",',
  p6: '    id: "p6", ch: 3, t: "指示代词 this / that / these / those", tip: "近处 these 远处 those",',
  p7: '    id: "p7", ch: 3, t: "some 和 any", tip: "some 逛超市，any 爱提问",',
  p8: '    id: "p8", ch: 3, t: "many 和 much", tip: "many 数得清，much 数不清",',
  p9: '    id: "p9", ch: 3, t: "both 和 all", tip: "both 俩人手拉手，all 大家手拉手",',
  p10: '    id: "p10", ch: 3, t: "each 和 every", tip: "each 一个一个看，every 全体一起看",',
  p11: '    id: "p11", ch: 3, t: "疑问代词 who / what / which", tip: "提问三剑客",',
};
Object.keys(tips).forEach(function(k){
  const anchor = tips[k];
  if (t.indexOf(anchor) < 0) throw new Error(k + " 锚点未命中");
  const bookLine = '    book: ' + JSON.stringify(BOOKS[k].map(function(x){ return x.replace(/"/g, "'"); }).join("<br>")) + ",";
  t = t.split(anchor).join(anchor + CRLF + bookLine);
});

fs.writeFileSync(gp, t, "utf8");
console.log("english-grammar.js 教材注入完成");
