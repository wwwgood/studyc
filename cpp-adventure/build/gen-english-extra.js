/*
 * 英语语法扩题生成器：给每例补 lv:2(进阶)/lv:3(挑战) 题，并生成第 13 章 30 题综合模拟。
 * 用法：node build/gen-english-extra.js
 * 产物：src/scripts/data/english-grammar-extra.js（被 index.html 引入，在 english-grammar.js 之后）
 */
var fs = require("fs");
var path = require("path");
var vm = require("vm");

var dataPath = path.join(__dirname, "..", "src", "scripts", "data", "english-grammar.js");
var code = fs.readFileSync(dataPath, "utf8");
var sandbox = { EQ_DATA: null };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
var D = sandbox.EQ_DATA;

D.lessons.forEach(function(l){
  l.q.forEach(function(q){ if (!q.lv) q.lv = 1; });
});

var R = {};
function add(id, lv, q, o, a, why){
  if (!R[id]) R[id] = [];
  R[id].push({ q: q, o: o, a: a, why: why, lv: lv });
}

var L = {};
D.lessons.forEach(function(l){ L[l.id] = l; });

/* ==================== 第一章 名词岛（9 例） ==================== */
add("n1",2,"「She is my ___ teacher.」中哪个是名词？",["my","teacher","is"],1,"teacher 是「老师」，表示人，是名词；my 是代词，is 是动词。");
add("n1",2,"下面哪个不是名词？",["desk 书桌","beautiful 美丽的","water 水"],1,"beautiful 是形容词「美丽的」，描述样子不是名词。");
add("n1",3,"「The ___ are flying in the sky.」横线处填名词复数，正确的是？",["bird","birds","birdes"],1,"birds 是 bird 的正确复数（直接加 s），作主语要用复数。");
add("n1",3,"哪个句子名词用法正确？",["I have a happiness.","I have a book.","I have a waters."],1,"happiness 是抽象名词通常不加 a；water 不可数不加 s 也不加 a；book 可数加 a 正确。");

add("n2",2,"「三只猫」英语是？",["three cat","three cats","three cates"],1,"可数名词复数直接加 s：three cats。");
add("n2",2,"下面哪个是不可数名词？",["apple","bread","egg"],1,"面包不可数（不能说 one bread, two breads）；苹果和鸡蛋可数。");
add("n2",3,"「I want ___ orange juice.」正确的是？",["two","two glass of","two glasses of"],2,"juice 不可数，量词 glass 要复数：two glasses of orange juice。");
add("n2",3,"哪个表达错误？",["a pen","two pens","two pen"],2,"two pen 错：两个以上要加 s，应为 two pens。");

add("n3",2,"「five ___」五把椅子，填？",["chair","chairs","chairies"],1,"chair 直接加 s 变 chairs。");
add("n3",2,"pen 的复数是？",["penes","pens","penies"],1,"pen 以辅音结尾，直接加 s：pens。");
add("n3",3,"「The ___ are reading books.」填？",["boy","boys","boies"],1,"boy 以元音字母+ y 结尾，直接加 s：boys。");
add("n3",3,"哪个复数形式错误？",["cats","dogs","mans"],2,"mans 错：man 的复数是不规则变化 men。");

add("n4",2,"「两块手表」是？",["two watch","two watchs","two watches"],2,"watch 以 ch 结尾，要加 es：watches。");
add("n4",2,"box 的复数是？",["boxs","boxes","boxies"],1,"box 以 x 结尾，加 es：boxes。");
add("n4",3,"「three ___」三个班级，填？",["class","classes","classs"],1,"class 以 s 结尾，加 es：classes。");
add("n4",3,"哪个加 es 正确？",["bus→buses","book→bookes","pen→penes"],0,"bus 以 s 结尾加 es 正确；book 和 pen 直接加 s。");

add("n5",2,"city 的复数是？",["citys","cities","cityes"],1,"c 是辅音字母，y 变 i 加 es：cities。");
add("n5",2,"boy 的复数是？",["boys","boies","boyes"],0,"b 后面 o 是元音字母，y 不变，直接加 s：boys。");
add("n5",3,"「两个婴儿」是？",["two babys","two babies","two babyes"],1,"b 是辅音字母，y 变 i 加 es：babies。");
add("n5",3,"key 的复数是？",["keys","keies","keyes"],0,"e 是元音字母，y 不变，直接加 s：keys。");

add("n6",2,"knife 的复数是？",["knifes","knives","knifes"],1,"fe 变 ves：knives。");
add("n6",2,"leaf 的复数是？",["leafs","leaves","leafes"],1,"f 变 ves：leaves。");
add("n6",3,"「那些狼」是？",["those wolfs","those wolves","those wolfes"],1,"f 变 ves：wolves。");
add("n6",3,"下面哪个复数变化正确？",["shelf→shelfs","shelf→shelves","shelf→shelfes"],1,"shelf 以 f 结尾，f 变 v 加 es：shelves。");

add("n7",2,"man 的复数是？",["mans","men","manes"],1,"man 是不规则变化：men。");
add("n7",2,"foot 的复数是？",["foots","feet","footes"],1,"foot 是不规则变化：feet。");
add("n7",3,"「三个孩子」是？",["three childs","three children","three childes"],1,"child 是不规则变化：children。");
add("n7",3,"mouse 的复数是？",["mouses","mice","mouses"],1,"mouse 是不规则变化：mice。");

add("n8",2,"「一些牛奶」是？",["a milk","some milks","some milk"],2,"milk 不可数，不加 a 也不加 s，用 some milk。");
add("n8",2,"下面哪个不可数？",["apple","water","book"],1,"水不可数；苹果和书可数。");
add("n8",3,"「三片面包」是？",["three breads","three bread","three pieces of bread"],2,"bread 不可数，用量词：three pieces of bread。");
add("n8",3,"哪个表达正确？",["a water","two waters","a glass of water"],2,"water 不可数，不能加 a 或复数，只能用量词 a glass of water。");

add("n9",2,"「我爸爸的车」是？",["my father car","my father's car","my fathers car"],1,"单数名词所有格加 's：father's。");
add("n9",2,"「学生们的书」是？",["the student's books","the students' books","the students's books"],1,"students 已以 s 结尾，只加撇号：students'。");
add("n9",3,"「Tom and Jerry's room」的意思是？",["Tom 的房间和 Jerry 的房间","Tom 和 Jerry 共用的房间","Tom 的房间和 Jerry 的"],1,"两人共有的东西，只在最后一人加 's。");
add("n9",3,"「women's hats」的意思是？",["女人的帽子","女人的帽子（一个女人的）","女人是帽子"],0,"women 是不规则复数（不以 s 结尾），加 's：women's 表示「女人们的」。");

/* ==================== 第二章 冠词湾（8 例） ==================== */
add("a1",2,"___ orange 是？",["a","an","the"],1,"orange 以元音音素 /ɒ/ 开头，用 an。");
add("a1",2,"___ book 是？",["a","an","the"],0,"book 以辅音音素 /b/ 开头，用 a。");
add("a1",3,"___ honest boy 是？",["a","an","the"],1,"honest 的 h 不发音，开头是元音音素 /ɒ/，用 an。");
add("a1",3,"___ university 是？",["a","an","the"],0,"university 开头 u 读 /juː/，是辅音音素，用 a。");

add("a2",2,"I see ___ bird. ___ bird is blue.",["a, The","the, A","an, The"],0,"第一次提到用 a，第二次特指用 the。");
add("a2",2,"She has ___ umbrella. ___ umbrella is red.",["a, A","an, The","the, An"],1,"umbrella 元音开头用 an；第二次特指用 the。");
add("a2",3,"There is ___ cat under the table. ___ cat is sleeping.",["a, The","the, A","an, The"],0,"第一次用 a cat，第二次特指用 the cat。");
add("a2",3,"哪个冠词使用正确？",["I have a apple.","I have an dog.","I have an egg."],2,"egg 元音开头用 an 正确；apple 应用 an；dog 应用 a。");

add("a3",2,"___ moon is bright tonight.",["A","An","The"],2,"月亮独一无二，用 the。");
add("a3",2,"Close ___ door, please.",["a","an","the"],2,"都知道是哪扇门，特指用 the。");
add("a3",3,"___ Yellow River is very long.",["A","An","The"],2,"河流名称前用 the：the Yellow River。");
add("a3",3,"___ Great Wall is famous.",["A","An","The"],2,"独一无二的名胜用 the：the Great Wall。");

add("a4",2,"I like playing ___ basketball.",["a","the","不填"],2,"球类运动前零冠词：play basketball。");
add("a4",2,"She can play ___ piano.",["a","the","不填"],1,"乐器前要加 the：play the piano。");
add("a4",3,"Let's play ___ chess after school.",["a","the","不填"],2,"棋类前零冠词：play chess。");
add("a4",3,"哪个表达正确？",["play the football","play football","play a football"],1,"球类前零冠词：play football。");

add("a5",2,"I have ___ breakfast at 7.",["a","the","不填"],2,"三餐前零冠词：have breakfast。");
add("a5",2,"We play ___ after school.",["a football","football","the football"],1,"球类前零冠词：play football。");
add("a5",3,"___ Smiths are having dinner.",["A","An","The"],2,"姓氏复数前加 the 表示「一家人」：the Smiths。");
add("a5",3,"哪个表达正确？",["go to the school","go to school","go to a school"],1,"go to school 表示「去上学」是固定搭配，零冠词。");

add("a6",2,"He is ___ honest man.",["a","an","the"],1,"honest 的 h 不发音，元音音素开头用 an。");
add("a6",2,"It took ___ hour to finish.",["a","an","the"],1,"hour 的 h 不发音，元音音素开头用 an。");
add("a6",3,"She is ___ 8-year-old girl.",["a","an","the"],1,"8 读 /eɪt/，元音音素开头用 an。");
add("a6",3,"That's ___ useful dictionary.",["a","an","the"],0,"useful 开头 u 读 /juː/，辅音音素开头用 a。");

add("a7",2,"___ sun is shining.",["A","An","The"],2,"太阳独一无二，用 the。");
add("a7",2,"Please pass me ___ salt.",["a","an","the"],2,"都知道是哪份盐，特指用 the。");
add("a7",3,"___ Pacific Ocean is the largest ocean.",["A","An","The"],2,"海洋名称前用 the：the Pacific Ocean。");
add("a7",3,"___ Spring Festival is coming.",["A","An","The"],2,"传统节日前用 the：the Spring Festival。");

add("a8",2,"My father is ___ teacher.",["a","an","the"],0,"teacher 辅音开头用 a，表示职业。");
add("a8",2,"She works in ___ hospital.",["a","an","the"],0,"hospital 辅音开头用 a，泛指一家医院。");
add("a8",3,"He was made ___ monitor of our class.",["a","an","the"],2,"表示头衔职务时零冠词，但这里指「那个班长」用 the。");
add("a8",3,"What ___ heavy rain!",["a","an","the"],0,"heavy 辅音开头，what a + 形容词 + 名词：what a heavy rain。");

/* ==================== 第三章 代词森林（11 例） ==================== */
add("p1",2,"___ am a student.",["I","Me","My"],0,"作主语用主格 I。");
add("p1",2,"___ is my friend.",["He","Him","His"],0,"作主语用主格 He。");
add("p1",3,"___ are going to the park.",["Us","We","Our"],1,"作主语用主格 We。");
add("p1",3,"Please help ___ with the homework.",["I","me","my"],1,"作宾语用宾格 me。");

add("p2",2,"This book is ___.",["my","mine","me"],1,"后面没有名词，用名词性物主代词 mine。");
add("p2",2,"That is ___ pen.",["my","mine","me"],0,"后面有名词 pen，用形容词性物主代词 my。");
add("p2",3,"These shoes are ___.",["her","hers","she"],1,"后面没有名词，用名词性物主代词 hers。");
add("p2",3,"___ bag is on the desk.",["His","He","Him"],0,"后面有名词 bag，用形容词性物主代词 His。");

add("p3",2,"I can do it by ___.",["me","myself","my"],1,"反身代词 by myself 表示「我自己」。");
add("p3",2,"She hurt ___ while playing.",["her","herself","she"],1,"反身代词作宾语：hurt herself。");
add("p3",3,"The cat is washing ___.",["it","itself","its"],1,"反身代词：washing itself。");
add("p3",3,"We enjoyed ___ at the party.",["us","ourselves","our"],1,"反身代词：enjoyed ourselves。");

add("p4",2,"This is ___ for you and me.",["our","ours","us"],2,"作宾语用宾格 us。");
add("p4",2,"___ of them like swimming.",["Both","All","Every"],0,"两者都用 both；三者以上用 all。");
add("p4",3,"___ student should hand in homework.",["Every","All","Both"],0,"every 后接单数名词：every student。");
add("p4",3,"___ side of the street has trees.",["Both","All","Every"],0,"两边都用 both sides。");

add("p5",2,"I have two pens. One is red, ___ is blue.",["other","the other","another"],1,"两支笔，一支红，另一支用 the other。");
add("p5",2,"I don't like this one. Show me ___ .",["other","another","the other"],1,"泛指「另一个」用 another。");
add("p5",3,"Some are reading, ___ are writing.",["other","others","the others"],1,"some...others... 表示「一些……另一些……」。");
add("p5",3,"I have three pens. One is here, where are ___ ?",["other","others","the others"],2,"三支笔，一支在这，其余的用 the others。");

add("p6",2,"Is there ___ in the room?",["someone","anyone","no one"],1,"疑问句用 anyone。");
add("p6",2,"There is ___ wrong with my bike.",["something","anything","nothing"],0,"肯定句用 something。");
add("p6",3,"I can't see ___ in the dark.",["something","anything","nothing"],1,"否定句用 anything。");
add("p6",3,"___ is better than nothing.",["Something","Anything","Nothing"],0,"肯定句用 something，谚语「有总比没有好」。");

add("p7",2,"This is the book ___ I bought yesterday.",["who","which","what"],1,"物用 which/that 作关系代词。");
add("p7",2,"The man ___ is talking is my father.",["who","which","what"],0,"人用 who/that 作关系代词。");
add("p7",3,"I know the girl ___ father is a doctor.",["who","whose","which"],1,"表示「谁的」用 whose。");
add("p7",3,"This is the house ___ we live in.",["who","which","what"],1,"物用 which/that。");

add("p8",2,"___ are my books.",["This","These","That"],1,"复数用 these。");
add("p8",2,"___ is my pen.",["This","These","Those"],0,"单数用 this。");
add("p8",3,"Look at ___ stars in the sky.",["this","these","that"],1,"复数且距离近用 these。");
add("p8",3,"___ books over there are mine.",["This","These","Those"],2,"复数且距离远用 those。");

add("p9",2,"What is ___ name?",["you","your","yours"],1,"后面有名词 name，用形容词性物主代词 your。");
add("p9",2,"___ are classmates.",["Us","We","Our"],1,"作主语用主格 We。");
add("p9",3,"The teacher asked ___ to read.",["we","us","our"],1,"作宾语用宾格 us。");
add("p9",3,"Is this pen ___?",["your","yours","you"],1,"后面没有名词，用名词性物主代词 yours。");

add("p10",2,"He teaches ___ English.",["us","we","our"],0,"作宾语用宾格 us。");
add("p10",2,"Let ___ go first.",["me","I","my"],0,"let 后接宾格 me。");
add("p10",3,"It was ___ who broke the window.",["me","I","my"],1,"强调句型用主格 I。");
add("p10",3,"___ is raining hard.",["It","This","That"],0,"表示天气用 it：It is raining。");

add("p11",2,"There are many trees on ___ side of the river.",["each","every","both"],0,"两侧各一边用 each side。");
add("p11",2,"___ of the students has a book.",["Each","Every","Both"],0,"each of + 复数名词，谓语用单数。");
add("p11",3,"We have ___ time left. Hurry up!",["little","a little","few"],0,"time 不可数，几乎没有用 little（表否定）。");
add("p11",3,"I have ___ friends here. Let's play together.",["few","a few","little"],1,"friends 可数，有一些用 a few（表肯定）。");

/* ==================== 第四章 数词矿井（6 例） ==================== */
add("num1",2,"My birthday is on May ___.",["five","fifth","fiveth"],1,"日期用序数词：the fifth → May fifth。");
add("num1",2,"There are ___ days in a week.",["seven","seventh","seventh"],0,"数量用基数词：seven。");
add("num1",3,"He is the ___ to arrive.",["one","first","oneth"],1,"顺序用序数词：first。");
add("num1",3,"March ___ is Women's Day.",["eight","eighth","eightth"],1,"日期用序数词：eighth。");

add("num2",2,"1st 表示？",["第一","一","十一"],0,"1st = first = 第一。");
add("num2",2,"3rd 表示？",["三","第三","三十"],1,"3rd = third = 第三。");
add("num2",3,"22nd 表示？",["二十二","第二十二","第二"],1,"22nd = twenty-second = 第二十二。");
add("num2",3,"下面哪个序数词拼写正确？",["fiveth","ninth","twelveth"],1,"nine→ninth（去 e 加 th）；five→fifth（ve 变 f 加 th）；twelve→twelfth。");

add("num3",2,"1999 读作？",["nineteen ninety-nine","one thousand nine hundred ninety-nine","nineteen hundred ninety-nine"],0,"年份四位分两段读：nineteen ninety-nine。");
add("num3",2,"2008 读作？",["two thousand and eight","twenty zero eight","two zero zero eight"],0,"2000 后的年份：two thousand and eight。");
add("num3",3,"7:30 读作？",["seven thirty","half past seven","both A and B"],2,"7:30 既可以读 seven thirty 也可以读 half past seven。");
add("num3",3,"6:45 可以读作？",["six forty-five","a quarter to seven","both A and B"],2,"两种读法都对。");

add("num4",2,"102 读作？",["one hundred and two","one hundred two","a hundred two"],0,"百位和十位/个位之间加 and：one hundred and two。");
add("num4",2,"365 天是？",["three hundred sixty-five days","three hundred and sixty-five days","three hundreds and sixty-five days"],1,"百位和十位间加 and，hundred 不加 s。");
add("num4",3,"5,000 读作？",["five thousand","five thousands","five of thousand"],0,"thousand 前有数字不加 s：five thousand。");
add("num4",3,"几百人 用英语说？",["hundreds of people","hundred of people","hundreds people"],0,"表示「数百」用 hundreds of，hundreds 加 s。");

add("num5",2,"2 × 3 = 6 读作？",["Two times three is six.","Two and three is six.","Two multiply three is six."],0,"乘法读 times：Two times three is six。");
add("num5",2,"8 ÷ 2 = 4 读作？",["Eight divided by two is four.","Eight divide two is four.","Eight over two is four."],0,"除法读 divided by：Eight divided by two is four。");
add("num5",3,"12 - 5 = 7 读作？",["Twelve minus five is seven.","Twelve subtract five is seven.","Twelve take five is seven."],0,"减法读 minus：Twelve minus five is seven。");
add("num5",3,"第 100 用英语说？",["one hundredth","one hundredthth","hundred"],0,"100 → one hundredth（序数词）。");

add("num6",2,"My phone number is 138-___-5678.",["five five five five","four four four four","double four double four"],1,"数字逐个读：four four four four。");
add("num6",2,"房间 305 读作？",["three zero five","three hundred and five","thirty-five"],0,"房间号逐位读：three zero five。");
add("num6",3,"0.5 读作？",["zero point five","zero dot five","half"],0,"小数读 point：zero point five。");
add("num6",3,"3/4 读作？",["three fourths","three four","three over four"],0,"分数分子用基数，分母用序数词：three fourths。");

/* ==================== 第五章 形容词雪山（10 例） ==================== */
add("adj1",2,"The elephant is ___.",["big","bigger","biggest"],0,"单独描述用原级 big。");
add("adj1",2,"She is a ___ girl.",["happy","happily","happiness"],0,"修饰名词用形容词 happy。");
add("adj1",3,"The soup smells ___.",["good","well","goodly"],0,"感官动词后用形容词 good。");
add("adj1",3,"He looks ___ today.",["sad","sadly","sadness"],0,"look 是感官动词，后接形容词 sad。");

add("adj2",2,"My bag is ___ than yours.",["heavy","heavier","heaviest"],1,"比较级用 heavier。");
add("adj2",2,"She is ___ than her sister.",["tall","taller","tallest"],1,"比较级用 taller。");
add("adj2",3,"This question is ___ than that one.",["difficult","more difficult","most difficult"],1,"多音节词比较级加 more：more difficult。");
add("adj2",3,"Today is ___ than yesterday.",["hot","hotter","hottest"],1,"hot 双写 t 加 er：hotter。");

add("adj3",2,"He is the ___ in our class.",["tall","taller","tallest"],2,"最高级用 tallest。");
add("adj3",2,"This is the ___ book I have ever read.",["good","better","best"],2,"最高级用 best。");
add("adj3",3,"She is one of the ___ students in the school.",["good","better","best"],2,"one of the + 最高级：best。");
add("adj3",3,"The Yangtze River is the ___ river in China.",["long","longer","longest"],2,"最高级用 longest。");

add("adj4",2,"good 的比较级是？",["gooder","better","goodest"],1,"good 是不规则变化：better。");
add("adj4",2,"bad 的最高级是？",["baddest","worst","worst"],1,"bad 是不规则变化：worst → worst。");
add("adj4",3,"little 的比较级是？",["littler","less","lesser"],1,"little 表示量时比较级是 less。");
add("adj4",3,"many 的比较级是？",["manier","more","much"],1,"many/much 的比较级都是 more。");

add("adj5",2,"He is as ___ as his brother.",["tall","taller","tallest"],0,"as...as 之间用原级 tall。");
add("adj5",2,"This box is not as ___ as that one.",["heavy","heavier","heaviest"],0,"as...as 之间用原级 heavy。");
add("adj5",3,"She runs as ___ as a deer.",["fast","faster","fastest"],0,"as...as 之间用原级 fast。");
add("adj5",3,"Tom is not so ___ as Jerry.",["clever","cleverer","cleverest"],0,"not so...as 之间用原级 clever。");

add("adj6",2,"The ___ boy is my brother.",["five-years-old","five-year-old","five year old"],1,"复合形容词作定语，名词用单数：five-year-old。");
add("adj6",2,"He is ___ .",["five years old","five-years-old","five year old"],0,"作表语时不用连字符，名词用复数：five years old。");
add("adj6",3,"It's a ___ walk from here.",["ten-minute","ten-minutes","ten minute"],0,"复合形容词：ten-minute。");
add("adj6",3,"The building is ___ .",["100-meters-tall","100-meter-tall","100 meters tall"],2,"作表语不用连字符：100 meters tall。");

add("adj7",2,"I am ___ in this book.",["interest","interested","interesting"],1,"修饰人用 -ed：interested。");
add("adj7",2,"The book is ___.",["interest","interested","interesting"],2,"修饰物用 -ing：interesting。");
add("adj7",3,"The ___ movie made us ___.",["exciting, excited","excited, exciting","exciting, exciting"],0,"修饰物用 -ing，修饰人用 -ed：exciting movie, excited。");
add("adj7",3,"I am ___ in the ___ story.",["interested, interesting","interesting, interested","interested, interested"],0,"人用 interested，物用 interesting。");

add("adj8",2,"The red bag is ___, but the blue one is ___.",["nice, nicer","nicer, nicest","nice, nicest"],0,"并列比较，原级和比较级：nice, nicer。");
add("adj8",2,"She is ___ and ___.",["tall, thin","taller, thinner","tallest, thinnest"],1,"越来越……用比较级 and 比较级：taller and thinner。");
add("adj8",3,"The ___ you work, the ___ you will get.",["hard, more","harder, more","harder, much"],1,"the + 比较级, the + 比较级：The harder you work, the more you will get。");
add("adj8",3,"It's getting ___ and ___.",["cold, colder","colder, colder","coldest, coldest"],1,"越来越……用比较级 and 比较级：colder and colder。");

add("adj9",2,"This is a ___ flower.",["beautiful red","red beautiful","beautifully red"],0,"多个形容词顺序：观点+大小+新旧+颜色+产地+材质。beautiful（观点）+ red（颜色）。");
add("adj9",2,"He has a ___ car.",["big new red","red new big","new red big"],0,"大小+新旧+颜色：big new red。");
add("adj9",3,"I bought a ___ table.",["wooden round small","small round wooden","round small wooden"],1,"大小+形状+材质：small round wooden。");
add("adj9",3,"She is a ___ girl.",["Chinese clever young","young clever Chinese","clever young Chinese"],2,"观点+年龄+国籍：clever young Chinese。");

add("adj10",2,"The news is ___.",["exciting","excited","excite"],0,"news 是不可数名词，用 -ing 形容词修饰：exciting。");
add("adj10",2,"I am ___ at the news.",["surprise","surprised","surprising"],1,"人用 -ed：surprised。");
add("adj10",3,"The ___ result made everyone ___.",["surprising, surprised","surprised, surprising","surprising, surprising"],0,"物用 -ing，人用 -ed：surprising result, surprised。");
add("adj10",3,"He looked ___ at the ___ painting.",["amazed, amazing","amazing, amazed","amazed, amazed"],0,"人用 -ed（looked amazed），物用 -ing（amazing painting）。");

/* ==================== 第六章 副词草原（8 例） ==================== */
add("adv1",2,"She sings ___.",["beautiful","beautifully","beautifuly"],1,"修饰动词用副词 beautifully。");
add("adv1",2,"He runs ___.",["quick","quickly","quicker"],1,"修饰动词用副词 quickly。");
add("adv1",3,"The baby is sleeping ___.",["quiet","quietly","quieter"],1,"修饰动词用副词 quietly。");
add("adv1",3,"He speaks English ___.",["good","well","goodly"],1,"修饰动词用副词 well（不是 good）。");

add("adv2",2,"He works ___.",["hard","hardly","harder"],0,"hard 本身就是副词「努力地」，hardly 意思是「几乎不」。");
add("adv2",2,"It is raining ___.",["heavy","heavily","heavier"],1,"修饰动词用副词 heavily。");
add("adv2",3,"I ___ know him.",["hard","hardly","harder"],1,"hardly 表示「几乎不」：I hardly know him（我几乎不认识他）。");
add("adv2",3,"She studies ___, so she gets good grades.",["hard, hard","hardly, hardly","hard, hardly"],0,"hard 是副词「努力地」：studies hard。");

add("adv3",2,"He is a ___ worker.",["good","well","goodly"],0,"修饰名词用形容词 good。");
add("adv3",2,"He works ___.",["good","well","goodly"],1,"修饰动词用副词 well。");
add("adv3",3,"The food tastes ___.",["good","well","goodly"],0,"感官动词后用形容词 good。");
add("adv3",3,"He plays basketball ___.",["good","well","goodly"],1,"修饰动词用副词 well。");

add("adv4",2,"She arrived ___ .",["late","lately","later"],0,"late 本身就是副词「晚」，lately 意思是「最近」。");
add("adv4",2,"I haven't seen him ___.",["late","lately","later"],1,"lately 表示「最近」：haven't seen him lately。");
add("adv4",3,"He came home ___ last night.",["late","lately","later"],0,"late 表示「晚」：came home late。");
add("adv4",3,"What have you been doing ___?",["late","lately","later"],1,"lately 表示「最近」。");

add("adv5",2,"The plane flew ___ .",["high","highly","higher"],0,"high 本身是副词「高」，highly 意思是「高度地」。");
add("adv5",2,"He thinks ___ of you.",["high","highly","higher"],1,"think highly of 表示「高度评价」。");
add("adv5",3,"The bird flew ___ in the sky.",["high","highly","higher"],0,"high 表示「高」：flew high。");
add("adv5",3,"She is ___ praised by her teacher.",["high","highly","higher"],1,"highly praised 表示「高度赞扬」。");

add("adv6",2,"He ___ goes to school by bus.",["always","sometime","never"],0,"always 表示「总是」。");
add("adv6",2,"I ___ eat fast food.",["sometime","sometimes","some times"],1,"sometimes 表示「有时」。");
add("adv6",3,"He is ___ late for school.",["always","never","usually"],1,"never late 表示「从不迟到」。");
add("adv6",3,"频率副词中频率最高的是？",["always","usually","sometimes"],0,"always（总是）> usually（通常）> often（经常）> sometimes（有时）> never（从不）。");

add("adv7",2,"He ___ finishes his homework.",["careful","carefully","carefulness"],1,"修饰动词用副词 carefully。");
add("adv7",2,"She drives ___.",["careful","carefully","carefulness"],1,"修饰动词用副词 carefully。");
add("adv7",3,"He is a ___ driver.",["careful","carefully","carefulness"],0,"修饰名词用形容词 careful。");
add("adv7",3,"Please listen to me ___.",["careful","carefully","carefulness"],1,"修饰动词用副词 carefully。");

add("adv8",2,"The cat is ___ under the table.",["sleep, quietly","sleeping, quietly","sleeps, quiet"],1,"进行时 sleeping + 副词 quietly。");
add("adv8",2,"He ___ opened the door.",["quiet","quietly","quieter"],1,"修饰动词用副词 quietly。");
add("adv8",3,"She walked ___ into the room.",["quiet","quietly","quieter"],1,"修饰动词用副词 quietly。");
add("adv8",3,"The children are playing ___ outside.",["happy, happily","happily, happy","happy, happy"],0,"两个副词修饰：happily（怎样玩）, outside（在哪玩）。");

/* ==================== 第七章 介词迷宫（10 例） ==================== */
add("prep1",2,"My birthday is ___ May.",["in","on","at"],0,"月份用 in：in May。");
add("prep1",2,"We meet ___ Sunday.",["in","on","at"],1,"星期用 on：on Sunday。");
add("prep1",3,"The class starts ___ 8 o'clock.",["in","on","at"],2,"具体时刻用 at：at 8 o'clock。");
add("prep1",3,"I was born ___ 2010.",["in","on","at"],0,"年份用 in：in 2010。");

add("prep2",2,"The book is ___ the desk.",["on","in","at"],0,"在桌面上用 on。");
add("prep2",2,"The cat is ___ the box.",["on","in","at"],1,"在盒子里用 in。");
add("prep2",3,"There is a tree ___ the house.",["in front of","in","on"],0,"在房子前面用 in front of。");
add("prep2",3,"The plane is flying ___ the clouds.",["on","above","in"],1,"在云上方用 above。");

add("prep3",2,"He goes to school ___ bus.",["by","on","in"],0,"乘交通工具用 by：by bus。");
add("prep3",2,"She walks ___ school every day.",["to","at","in"],0,"方向用 to：walks to school。");
add("prep3",3,"The letter is written ___ English.",["by","in","with"],1,"用某种语言用 in：in English。");
add("prep3",3,"Cut the apple ___ a knife.",["by","in","with"],2,"用工具用 with：with a knife。");

add("prep4",2,"Look ___ the blackboard.",["at","on","in"],0,"看某物用 look at。");
add("prep4",2,"Listen ___ the music.",["at","to","in"],1,"听某物用 listen to。");
add("prep4",3,"She is looking ___ her lost cat.",["at","for","after"],1,"look for 表示「寻找」。");
add("prep4",3,"Please look ___ my baby.",["at","for","after"],2,"look after 表示「照顾」。");

add("prep5",2,"He is good ___ math.",["at","in","on"],0,"be good at 表示「擅长」。");
add("prep5",2,"I am afraid ___ dogs.",["of","to","in"],0,"be afraid of 表示「害怕」。");
add("prep5",3,"She is interested ___ science.",["in","at","on"],0,"be interested in 表示「对……感兴趣」。");
add("prep5",3,"He is angry ___ me.",["with","to","on"],0,"be angry with 表示「生某人的气」。");

add("prep6",2,"The cup is ___ of tea.",["full","fill","filled"],0,"be full of 表示「装满」。");
add("prep6",2,"The bottle is ___ of water.",["full","fill","filled"],0,"be full of 表示「装满」。");
add("prep6",3,"Please fill the cup ___ water.",["of","with","in"],1,"fill...with 表示「用……装满」。");
add("prep6",3,"The room is full ___ people.",["of","with","in"],0,"be full of 是固定搭配。");

add("prep7",2,"He has been here ___ two hours.",["for","since","in"],0,"时间段用 for：for two hours。");
add("prep7",2,"She has lived here ___ 2010.",["for","since","in"],1,"时间点用 since：since 2010。");
add("prep7",3,"I have studied English ___ three years.",["for","since","in"],0,"时间段用 for：for three years。");
add("prep7",3,"He has been ill ___ Monday.",["for","since","in"],1,"时间点用 since：since Monday。");

add("prep8",2,"The ball is ___ the chair and the desk.",["between","among","in"],0,"两者之间用 between。");
add("prep8",2,"She is standing ___ her friends.",["between","among","in"],1,"三者以上之中用 among。");
add("prep8",3,"The choice is ___ yes and no.",["between","among","in"],0,"两者之间用 between。");
add("prep8",3,"Divide the sweets ___ the children.",["between","among","in"],1,"多个孩子分用 among。");

add("prep9",2,"He is ___ the tree.",["under","at","of"],0,"在树下用 under。");
add("prep9",2,"The cat jumped ___ the table.",["over","at","of"],0,"跳过桌子用 over。");
add("prep9",3,"Walk ___ the bridge carefully.",["over","across","through"],1,"走过桥面用 across。");
add("prep9",3,"The river flows ___ the city.",["over","across","through"],2,"流经城市用 through。");

add("prep10",2,"We have no class ___ Saturday and Sunday.",["on","in","at"],0,"周末两天用 on Saturday and Sunday。");
add("prep10",2,"See you ___ Monday morning.",["on","in","at"],0,"具体某天的上下午用 on：on Monday morning。");
add("prep10",3,"He will come ___ the morning of May 1st.",["on","in","at"],0,"具体某天的早上用 on：on the morning of May 1st。");
add("prep10",3,"We have a meeting ___ Friday afternoon.",["on","in","at"],0,"具体某天的下午用 on：on Friday afternoon。");

/* ==================== 第八章 连词大桥（6 例） ==================== */
add("conj1",2,"I like apples ___ bananas.",["and","or","but"],0,"并列用 and。");
add("conj1",2,"She is tall ___ thin.",["and","or","but"],0,"并列特征用 and。");
add("conj1",3,"He ___ I are good friends.",["and","or","but"],0,"并列主语用 and。");
add("conj1",3,"Both Tom ___ Jerry like reading.",["and","or","but"],0,"both...and... 搭配用 and。");

add("conj2",2,"I want an apple ___ an orange.",["or","and","but"],0,"选择用 or。");
add("conj2",2,"Is it hot ___ cold?",["or","and","but"],0,"选择疑问用 or。");
add("conj2",3,"Hurry up, ___ you will be late.",["or","and","but"],0,"or 表示「否则」：Hurry up, or you will be late。");
add("conj2",3,"Would you like tea ___ coffee?",["or","and","but"],0,"选择用 or。");

add("conj3",2,"I want to go, ___ I am tired.",["but","and","or"],0,"转折用 but。");
add("conj3",2,"He is rich, ___ unhappy.",["but","and","or"],0,"转折用 but。");
add("conj3",3,"She is young ___ very clever.",["but","and","or"],0,"转折用 but。");
add("conj3",3,"I tried hard, ___ I failed.",["but","and","or"],0,"转折用 but。");

add("conj4",2,"It was raining, ___ I stayed at home.",["so","because","but"],0,"因果用 so。");
add("conj4",2,"I was tired, ___ I went to bed early.",["so","because","but"],0,"因果用 so。");
add("conj4",3,"It was late, ___ we went home.",["so","because","but"],0,"因果用 so。");
add("conj4",3,"He was hungry, ___ he ate a lot.",["so","because","but"],0,"因果用 so。");

add("conj5",2,"I stayed at home ___ it was raining.",["because","so","but"],0,"原因用 because。");
add("conj5",2,"He is sad ___ he lost his dog.",["because","so","but"],0,"原因用 because。");
add("conj5",3,"___ I was ill, I didn't go to school.",["Because","So","But"],0,"原因状语从句用 Because。");
add("conj5",3,"She didn't come ___ she was busy.",["because","so","but"],0,"原因用 because。");

add("conj6",2,"___ he is tired, he keeps working.",["Although","Because","So"],0,"让步用 Although。");
add("conj6",2,"He is poor ___ happy.",["but","and","so"],0,"转折用 but。");
add("conj6",3,"Although it is hard, ___ I will try.",["but","so","不填"],2,"although 和 but 不能同时用，填「不填」。");
add("conj6",3,"___ rich he is, he is not happy.",["However","Although","Because"],1,"让步用 Although。");

/* ==================== 第九章 动词城（12 例） ==================== */
add("v1",2,"He ___ to school every day.",["goes","go","going"],0,"第三人称单数加 es：goes。");
add("v1",2,"She ___ English well.",["speak","speaks","speaking"],1,"第三人称单数加 s：speaks。");
add("v1",3,"My father ___ in a hospital.",["work","works","working"],1,"第三人称单数加 s：works。");
add("v1",3,"The cat ___ on the sofa now.",["sleep","sleeps","sleeping"],1,"一般现在时第三人称单数：sleeps。");

add("v2",2,"I ___ a student.",["am","is","are"],0,"I 用 am。");
add("v2",2,"He ___ a teacher.",["am","is","are"],1,"单数用 is。");
add("v2",3,"They ___ my friends.",["am","is","are"],2,"复数用 are。");
add("v2",3,"There ___ a book on the desk.",["is","are","am"],0,"单数用 is。");

add("v3",2,"Do you ___ English?",["like","likes","liking"],0,"助动词后用原形 like。");
add("v3",2,"Does he ___ football?",["play","plays","playing"],0,"助动词后用原形 play。");
add("v3",3,"___ she like music?",["Do","Does","Is"],1,"第三人称单数疑问用 Does。");
add("v3",3,"___ they want to go?",["Do","Does","Is"],0,"复数疑问用 Do。");

add("v4",2,"I ___ like swimming.",["don't","doesn't","aren't"],0,"I 用 don't。");
add("v4",2,"He ___ play basketball.",["don't","doesn't","isn't"],1,"第三人称单数用 doesn't。");
add("v4",3,"She ___ have a car.",["don't","doesn't","isn't"],1,"第三人称单数用 doesn't。");
add("v4",3,"We ___ like spicy food.",["don't","doesn't","aren't"],0,"复数用 don't。");

add("v5",2,"The water ___ cold.",["feel","feels","feeling"],1,"第三人称单数加 s：feels。");
add("v5",2,"He ___ hard every day.",["study","studies","studying"],1,"辅音+y 变 ies：studies。");
add("v5",3,"She ___ to music every evening.",["listen","listens","listening"],1,"第三人称单数加 s：listens。");
add("v5",3,"My mom ___ dinner for us.",["cook","cooks","cooking"],1,"第三人称单数加 s：cooks。");

add("v6",2,"I have ___ my homework.",["do","did","done"],2,"have done 是现在完成时。");
add("v6",2,"He has ___ the book.",["read","reads","reading"],0,"has + 过去分词，read 的过去分词还是 read。");
add("v6",3,"She has ___ to Beijing.",["be","been","being"],1,"has been to 表示「去过」。");
add("v6",3,"I have ___ this movie before.",["see","saw","seen"],2,"have seen 是现在完成时。");

add("v7",2,"Can you ___ English?",["speak","speaks","speaking"],0,"can 后用原形 speak。");
add("v7",2,"He can ___ fast.",["run","runs","running"],0,"can 后用原形 run。");
add("v7",3,"She ___ swim when she was five.",["can","could","cans"],1,"过去时用 could。");
add("v7",3,"You ___ not smoke here.",["can","could","may"],0,"表示禁止用 can not / cannot。");

add("v8",2,"I must ___ my homework now.",["do","doing","did"],0,"must 后用原形 do。");
add("v8",2,"He should ___ more water.",["drink","drinks","drinking"],0,"should 后用原形 drink。");
add("v8",3,"You mustn't ___ late.",["be","are","being"],0,"mustn't 后用原形 be。");
add("v8",3,"We should ___ our parents.",["help","helps","helping"],0,"should 后用原形 help。");

add("v9",2,"Let's ___ a game.",["play","plays","playing"],0,"let's 后用原形 play。");
add("v9",2,"Let me ___ you.",["help","helps","helping"],0,"let 后用原形 help。");
add("v9",3,"Let him ___ first.",["go","goes","going"],0,"let 后用原形 go。");
add("v9",3,"Let's not ___ about it.",["talk","talks","talking"],0,"let's not 后用原形 talk。");

add("v10",2,"I want ___ a doctor.",["to be","be","being"],0,"want to + 动词原形：to be。");
add("v10",2,"She wants ___ a book.",["to read","read","reading"],0,"want to + 动词原形：to read。");
add("v10",3,"He decided ___ abroad.",["to study","study","studying"],0,"decide to + 动词原形：to study。");
add("v10",3,"I hope ___ you again.",["to see","see","seeing"],0,"hope to + 动词原形：to see。");

add("v11",2,"Would you like ___ tea?",["some","any","a"],0,"委婉请求用 some。");
add("v11",2,"Can I have ___ water?",["some","any","a"],0,"委婉请求用 some。");
add("v11",3,"There isn't ___ milk left.",["some","any","a"],1,"否定句用 any。");
add("v11",3,"Is there ___ bread on the table?",["some","any","a"],1,"疑问句用 any。");

add("v12",2,"There ___ a pen and two books on the desk.",["is","are","am"],0,"就近原则：a pen 近，用 is。");
add("v12",2,"There ___ two books and a pen on the desk.",["is","are","am"],1,"就近原则：two books 近，用 are。");
add("v12",3,"There ___ some water in the cup.",["is","are","am"],0,"water 不可数用 is。");
add("v12",3,"There ___ some apples in the basket.",["is","are","am"],1,"apples 复数用 are。");

/* ==================== 第十章 进行时码头（6 例） ==================== */
add("ing1",2,"I ___ reading a book now.",["am","is","are"],0,"I 用 am。");
add("ing1",2,"He ___ playing football.",["is","am","are"],0,"单数用 is。");
add("ing1",3,"They ___ watching TV.",["are","is","am"],0,"复数用 are。");
add("ing1",3,"She ___ doing her homework now.",["is","am","are"],0,"单数用 is。");

add("ing2",2,"write 的现在分词是？",["writeing","writing","writting"],1,"以不发音 e 结尾去 e 加 ing：writing。");
add("ing2",2,"make 的现在分词是？",["makeing","making","makking"],1,"去 e 加 ing：making。");
add("ing2",3,"run 的现在分词是？",["runing","running","runnning"],1,"双写 n 加 ing：running。");
add("ing2",3,"swim 的现在分词是？",["swiming","swimming","swimmming"],1,"双写 m 加 ing：swimming。");

add("ing3",2,"Look! The cat ___ on the sofa.",["sleeps","is sleeping","sleep"],1,"Look 提示进行时：is sleeping。");
add("ing3",2,"Listen! Someone ___ at the door.",["knocks","is knocking","knock"],1,"Listen 提示进行时：is knocking。");
add("ing3",3,"Be quiet! The baby ___.",["sleeps","is sleeping","sleep"],1,"Be quiet 提示进行时：is sleeping。");
add("ing3",3,"Where is Tom? He ___ in the garden.",["works","is working","work"],1,"询问正在做什么用进行时：is working。");

add("ing4",2,"I ___ my homework at 8 last night.",["do","did","was doing"],2,"at 8 last night 提示过去进行时：was doing。");
add("ing4",2,"She ___ when the phone rang.",["cooked","was cooking","cooks"],1,"过去某一时刻正在做：was cooking。");
add("ing4",3,"They ___ a movie at 9 yesterday evening.",["watched","were watching","watch"],1,"过去进行时：were watching。");
add("ing4",3,"He ___ a shower when I called him.",["took","was taking","takes"],1,"过去进行时：was taking。");

add("ing5",2,"I ___ going to visit my grandma.",["am","is","are"],0,"I 用 am。");
add("ing5",2,"He ___ going to buy a car.",["is","am","are"],0,"单数用 is。");
add("ing5",3,"We ___ going to have a picnic.",["are","is","am"],0,"复数用 are。");
add("ing5",3,"There ___ going to be a meeting.",["is","are","am"],0,"there is going to be 固定搭配。");

add("ing6",2,"I will ___ you tomorrow.",["see","seeing","saw"],0,"will 后用原形 see。");
add("ing6",2,"He will ___ 12 next year.",["be","is","being"],0,"will 后用原形 be。");
add("ing6",3,"Will you ___ me with the math?",["help","helps","helping"],0,"will 后用原形 help。");
add("ing6",3,"It will ___ rainy tomorrow.",["be","is","being"],0,"will 后用原形 be。");

/* ==================== 第十一章 时光列车（8 例） ==================== */
add("t1",2,"I ___ to school yesterday.",["go","went","going"],1,"yesterday 用过去时：went。");
add("t1",2,"She ___ a book last night.",["read","reads","reading"],0,"last night 用过去时，read 过去式还是 read。");
add("t1",3,"He ___ TV last weekend.",["watch","watched","watches"],1,"last weekend 用过去时：watched。");
add("t1",3,"They ___ happy to see us.",["are","were","was"],1,"过去时用 were。");

add("t2",2,"go 的过去式是？",["goed","went","going"],1,"go 是不规则变化：went。");
add("t2",2,"see 的过去式是？",["seed","saw","seen"],1,"see 是不规则变化：saw。");
add("t2",3,"buy 的过去式是？",["buyed","bought","buyt"],1,"buy 是不规则变化：bought。");
add("t2",3,"teach 的过去式是？",["teached","taught","teacht"],1,"teach 是不规则变化：taught。");

add("t3",2,"I didn't ___ to the park.",["go","went","going"],0,"助动词后用原形 go。");
add("t3",2,"He didn't ___ his homework.",["do","did","doing"],0,"助动词后用原形 do。");
add("t3",3,"Did you ___ the movie?",["like","liked","likes"],0,"助动词后用原形 like。");
add("t3",3,"She didn't ___ to me.",["speak","spoke","speaks"],0,"助动词后用原形 speak。");

add("t4",2,"Was he at home ___?",["yesterday","tomorrow","now"],0,"过去时搭配 yesterday。");
add("t4",2,"I ___ 8 years old last year.",["am","was","were"],1,"last year 用过去时：was。");
add("t4",3,"They ___ busy last week.",["are","were","was"],1,"复数过去时用 were。");
add("t4",3,"___ you at school yesterday?",["Was","Were","Are"],1,"复数疑问用 Were。");

add("t5",2,"I will ___ 10 next year.",["am","be","being"],1,"will 后用原形 be。");
add("t5",2,"He will ___ a doctor.",["is","be","being"],1,"will 后用原形 be。");
add("t5",3,"They will ___ late.",["are","be","being"],1,"will 后用原形 be。");
add("t5",3,"There will ___ a party tomorrow.",["is","be","being"],1,"will 后用原形 be。");

add("t6",2,"I am going to ___ a letter.",["write","writing","wrote"],0,"be going to 后用原形 write。");
add("t6",2,"She is going to ___ a song.",["sing","singing","sang"],0,"be going to 后用原形 sing。");
add("t6",3,"They are going to ___ a trip.",["have","having","had"],0,"be going to 后用原形 have。");
add("t6",3,"He is going to ___ his room.",["clean","cleaning","cleaned"],0,"be going to 后用原形 clean。");

add("t7",2,"I ___ my keys. I can't find them.",["lose","lost","losing"],1,"已经丢了用过去时/完成时：lost。");
add("t7",2,"He ___ his leg yesterday.",["break","broke","breaking"],1,"yesterday 用过去时：broke。");
add("t7",3,"She has ___ her homework.",["finish","finished","finishing"],1,"has + 过去分词：finished。");
add("t7",3,"I have ___ my room.",["clean","cleaned","cleaning"],1,"has + 过去分词：cleaned。");

add("t8",2,"I ___ English since 2018.",["study","studied","have studied"],2,"since 2018 用现在完成时：have studied。");
add("t8",2,"He ___ here for 3 years.",["lives","lived","has lived"],2,"for 3 years 用现在完成时：has lived。");
add("t8",3,"She ___ already ___ her dinner.",["has, eaten","have, eaten","is, eating"],0,"already 提示完成时：has eaten。");
add("t8",3,"I ___ never ___ to Paris.",["have, been","has, been","am, been"],0,"never 提示完成时：have been。");

/* ==================== 第十二章 句型城堡（6 例） ==================== */
add("s1",2,"___ is your name?",["What","Where","When"],0,"问名字用 What。");
add("s1",2,"___ old are you?",["What","How","Where"],1,"问年龄用 How。");
add("s1",3,"___ do you live?",["What","Where","How"],1,"问地点用 Where。");
add("s1",3,"___ is that man?",["Who","What","Where"],0,"问人用 Who。");

add("s2",2,"There ___ a book on the desk.",["is","are","am"],0,"单数用 is。");
add("s2",2,"There ___ some apples in the basket.",["is","are","am"],1,"复数用 are。");
add("s2",3,"There ___ some water in the bottle.",["is","are","am"],0,"不可数用 is。");
add("s2",3,"There ___ two pens and a ruler on the desk.",["is","are","am"],1,"就近原则：two pens 近，用 are。");

add("s3",2,"___ open the window, please.",["Do","Don't","Not"],1,"否定祈使句用 Don't。");
add("s3",2,"___ make noise in class.",["Do","Don't","Not"],1,"否定祈使句用 Don't。");
add("s3",3,"Let's ___ late for class.",["not be","not to be","don't be"],0,"Let's not + 动词原形：not be。");
add("s3",3,"___ bring your book next time.",["Do","Don't","Not"],1,"否定祈使句用 Don't。");

add("s4",2,"Can you swim? Yes, I ___.",["can","do","am"],0,"can 问 can 答。");
add("s4",2,"Do you like tea? No, I ___.",["don't","can't","am not"],0,"do 问 do 答。");
add("s4",3,"Is she a teacher? Yes, she ___.",["is","does","can"],0,"is 问 is 答。");
add("s4",3,"Are they students? No, they ___.",["aren't","don't","can't"],0,"are 问 are 答。");

add("s5",2,"___ a beautiful day!",["What","How","What a"],2,"可数名词单数用 What a：What a beautiful day。");
add("s5",2,"___ fast he runs!",["What","How","What a"],1,"修饰副词用 How：How fast。");
add("s5",3,"___ lovely flowers!",["What","How","What a"],0,"复数名词用 What（不加 a）：What lovely flowers。");
add("s5",3,"___ clever the boy is!",["What","How","What a"],1,"修饰形容词用 How：How clever。");

add("s6",2,"There ___ some milk in the glass.",["is","are","have"],0,"milk 不可数用 is。");
add("s6",2,"I ___ a new bike.",["there is","have","there are"],1,"拥有用 have。");
add("s6",3,"___ a book and two pens on the desk.",["There is","There are","Have"],0,"就近原则：a book 近，用 There is。");
add("s6",3,"She ___ two sisters.",["there has","has","there are"],1,"拥有用 has。");

/* ==================== 第十三章 小升初综合模拟（30 题） ==================== */
D.chapters.push({ id: 13, name: "小升初综合模拟", emoji: "🏆", desc: "跨章节真题级综合闯关" });

var exam = {
  id: "exam1", ch: 13, t: "小升初模拟卷一 · 基础综合",
  tip: "跨章节综合 · 基础题型",
  body: "这是小升初基础综合模拟卷，涵盖名词、冠词、代词、介词、动词时态等核心知识点。每道题都是小升初考试中常见的题型，认真做一遍，查漏补缺！",
  say: "基础扎实，万题不慌；错题归档，下次不犯。",
  ex: [
    { en: "Knowledge is power.", zh: "知识就是力量。" },
    { en: "Practice makes perfect.", zh: "熟能生巧。" }
  ],
  q: [
    { q: "There is ___ 'u' in the word 'useful'.", o: ["a", "an", "the"], a: 0, why: "'u' 读 /juː/，辅音音素开头用 a。", lv: 1 },
    { q: "My sister is ___ 8-year-old girl.", o: ["a", "an", "the"], a: 1, why: "8 读 /eɪt/，元音音素开头用 an。", lv: 1 },
    { q: "The teacher told us ___ story in class.", o: ["a interesting", "an interesting", "the interesting"], a: 1, why: "interesting 以元音音素开头，用 an。", lv: 1 },
    { q: "Would you like ___ orange juice?", o: ["a", "an", "some"], a: 2, why: "juice 不可数，委婉请求用 some。", lv: 1 },
    { q: "He has been to Beijing ___.", o: ["two times", "twice", "second"], a: 1, why: "两次用 twice，不用 two times。", lv: 1 },
    { q: "The ___ day of October is National Day.", o: ["one", "first", "oneth"], a: 1, why: "日期用序数词：first。", lv: 1 },
    { q: "My birthday is ___ September 10th.", o: ["in", "on", "at"], a: 1, why: "具体日期用 on：on September 10th。", lv: 1 },
    { q: "He will come back ___ two hours.", o: ["after", "in", "for"], a: 1, why: "将来时中「……之后」用 in：in two hours。", lv: 2 },
    { q: "The box is too heavy for me ___ .", o: ["to carry it", "to carry", "carry"], a: 1, why: "too...to 结构中 carry 后不再加 it（box 已是宾语）。", lv: 2 },
    { q: "She is ___ girl that everyone likes her.", o: ["so a lovely", "such a lovely", "such lovely a"], a: 1, why: "such a + 形容词 + 单数可数名词：such a lovely girl。", lv: 2 }
  ]
};
D.lessons.push(exam);

var exam2 = {
  id: "exam2", ch: 13, t: "小升初模拟卷二 · 时态综合",
  tip: "时态辨析 · 时间状语判断",
  body: "时态是小升初必考重点！通过时间状语判断时态：yesterday/last→过去时；now/look→进行时；tomorrow/next→将来时；since/for→完成时。",
  say: "看时间状语，定动词时态；过去现在将来，各有标记。",
  ex: [
    { en: "Time and tide wait for no man.", zh: "岁月不等人。" },
    { en: "Better late than never.", zh: "迟做总比不做好。" }
  ],
  q: [
    { q: "Look! The children ___ in the river.", o: ["swim", "are swimming", "swam"], a: 1, why: "Look! 提示进行时：are swimming。", lv: 1 },
    { q: "I ___ my homework at 8 yesterday evening.", o: ["do", "did", "was doing"], a: 2, why: "at 8 yesterday evening 提示过去进行时：was doing。", lv: 1 },
    { q: "He ___ to Shanghai tomorrow.", o: ["goes", "went", "will go"], a: 2, why: "tomorrow 提示将来时：will go。", lv: 1 },
    { q: "My father ___ in this factory since 2010.", o: ["works", "worked", "has worked"], a: 2, why: "since 2010 提示现在完成时：has worked。", lv: 1 },
    { q: "Where ___ you ___ last weekend?", o: ["do, go", "did, go", "will, go"], a: 1, why: "last weekend 提示过去时：did go。", lv: 2 },
    { q: "By the time he got there, the train ___.", o: ["left", "had left", "leaves"], a: 1, why: "「到达前火车已走」过去的过去用过去完成时：had left。", lv: 3 },
    { q: "She ___ her room when I called her.", o: ["cleaned", "was cleaning", "cleans"], a: 1, why: "call 时她正在打扫：was cleaning。", lv: 2 },
    { q: "I ___ never ___ such a beautiful place.", o: ["have, seen", "has, seen", "had, seen"], a: 0, why: "never 提示现在完成时：have seen。", lv: 2 },
    { q: "If it ___ tomorrow, we will stay at home.", o: ["rain", "rains", "will rain"], a: 1, why: "主将从现，if 从句用现在时：rains。", lv: 3 },
    { q: "He ___ for 3 hours. Let him rest.", o: ["studies", "has been studying", "studied"], a: 1, why: "for 3 hours 且仍在进行：has been studying。", lv: 3 }
  ]
};
D.lessons.push(exam2);

var exam3 = {
  id: "exam3", ch: 13, t: "小升初模拟卷三 · 词法句法",
  tip: "词形变化 · 句型转换",
  body: "词法和句法是语法两大支柱。词法考词形变化（名词复数、动词时态、形容词比较级等）；句法考句型转换（肯定↔否定↔疑问、主动↔被动等）。",
  say: "词法看变化，句法看结构；转换要细心，对应不遗漏。",
  ex: [
    { en: "All roads lead to Rome.", zh: "条条大路通罗马。" },
    { en: "Every coin has two sides.", zh: "凡事都有两面。" }
  ],
  q: [
    { q: "The ___ are playing on the playground.", o: ["child", "children", "childs"], a: 1, why: "child 复数是不规则变化：children。", lv: 1 },
    { q: "She is the ___ student in our class.", o: ["good", "better", "best"], a: 2, why: "the + 最高级：best。", lv: 1 },
    { q: "My watch is different from ___.", o: ["you", "your", "yours"], a: 2, why: "后面没有名词，用名词性物主代词 yours。", lv: 1 },
    { q: "He did his homework carefully.（改为否定句）", o: ["He didn't did his homework carefully.", "He didn't do his homework carefully.", "He don't do his homework carefully."], a: 1, why: "过去时否定加 didn't，动词还原：didn't do。", lv: 2 },
    { q: "Tom is a good boy.（改为感叹句）", o: ["What a good boy Tom is!", "How a good boy Tom is!", "What good boy Tom is!"], a: 0, why: "单数可数名词用 What a：What a good boy Tom is!", lv: 2 },
    { q: "I have been to Beijing twice.（对划线部分提问）", o: ["How many times have you been to Beijing?", "How long have you been to Beijing?", "How often have you been to Beijing?"], a: 0, why: "问次数用 How many times。", lv: 3 },
    { q: "The teacher made us ___ the classroom after school.", o: ["clean", "to clean", "cleaned"], a: 0, why: "make sb. do sth. 用原形：clean。", lv: 3 },
    { q: "Neither he nor I ___ a student.", o: ["is", "am", "are"], a: 1, why: "neither...nor 就近原则，靠近 I 用 am。", lv: 3 },
    { q: "The book ___ well is very popular.", o: ["sells", "sold", "selling"], a: 0, why: "「书卖得好」主动表被动，一般现在时：sells。", lv: 3 },
    { q: "Not only you but also he ___ right.", o: ["are", "is", "am"], a: 1, why: "not only...but also 就近原则，靠近 he 用 is。", lv: 3 }
  ]
};
D.lessons.push(exam3);

/* ==================== 序列化输出 ==================== */
var out = "/* ---------------- 英语语法扩题数据（自动生成，请勿手改） ----------------\n";
out += " * 由 build/gen-english-extra.js 生成。给每例补 lv:2/3 题，并新增第 13 章 30 题综合模拟。\n";
out += " * 在 english-grammar.js 之后加载，直接修改 EQ_DATA。\n";
out += " */\n";
out += "(function(){\n";
out += "  // 1) 现有题目标记 lv:1\n";
out += "  EQ_DATA.lessons.forEach(function(l){\n";
out += "    l.q.forEach(function(q){ if (!q.lv) q.lv = 1; });\n";
out += "  });\n\n";
out += "  // 2) 按章节追加 lv:2/3 题\n";
out += "  var EXTRA = " + JSON.stringify(R, null, 2) + ";\n";
out += "  Object.keys(EXTRA).forEach(function(id){\n";
out += "    var l = EQ_DATA.lessons.filter(function(x){ return x.id === id; })[0];\n";
out += "    if (l) l.q = l.q.concat(EXTRA[id]);\n";
out += "  });\n\n";
out += "  // 3) 新增第 13 章\n";
out += "  if (!EQ_DATA.chapters.some(function(c){ return c.id === 13; })) {\n";
out += "    EQ_DATA.chapters.push(" + JSON.stringify({ id: 13, name: "小升初综合模拟", emoji: "🏆", desc: "跨章节真题级综合闯关" }) + ");\n";
out += "  }\n";
out += "  var EXAM = " + JSON.stringify([exam, exam2, exam3], null, 2) + ";\n";
out += "  EXAM.forEach(function(e){\n";
out += "    if (!EQ_DATA.lessons.some(function(l){ return l.id === e.id; })) EQ_DATA.lessons.push(e);\n";
out += "  });\n";
out += "})();\n";

var outPath = path.join(__dirname, "..", "src", "scripts", "data", "english-grammar-extra.js");
fs.writeFileSync(outPath, out, "utf8");

var totalExtra = Object.keys(R).reduce(function(a, k){ return a + R[k].length; }, 0);
var examQ = exam.q.length + exam2.q.length + exam3.q.length;
console.log("Generated: " + outPath);
console.log("Extra questions: " + totalExtra + " (across " + Object.keys(R).length + " lessons)");
console.log("Chapter 13 questions: " + examQ);
console.log("Total new questions: " + (totalExtra + examQ));