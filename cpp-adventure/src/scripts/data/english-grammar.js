/* ---------------- 英语语法大冒险 · 100 例数据 ----------------
 * 依据《小学英语语法 100 例》（主编：蒋树业）的章节体系组织：
 * 12 大语法岛屿，共 100 个关卡；每关 = 卡通讲解 + 生活比喻 + 口诀 + 例句 + 闯关练习。
 * 内容贴合小学英语课本话题（家庭、学校、动物、食物、颜色、数字、日常活动等），由易到难。
 */
var EQ_DATA = {
  chapters: [
    { id: 1,  name: "名词岛",       emoji: "🏝️", desc: "给身边的东西起名字" },
    { id: 2,  name: "冠词湾",       emoji: "⛵", desc: "a / an / the 三兄弟" },
    { id: 3,  name: "代词森林",     emoji: "🌳", desc: "你、我、他，代词来帮忙" },
    { id: 4,  name: "数词矿井",     emoji: "⛏️", desc: "数字和第几的秘密" },
    { id: 5,  name: "形容词雪山",   emoji: "🏔️", desc: "描述世界的颜色和样子" },
    { id: 6,  name: "副词草原",     emoji: "🐎", desc: "让句子跑得更快更准" },
    { id: 7,  name: "介词迷宫",     emoji: "🌀", desc: "时间地点的小路标" },
    { id: 8,  name: "连词大桥",     emoji: "🌉", desc: "把句子连起来的工程师" },
    { id: 9,  name: "动词城",       emoji: "🏰", desc: "一般现在时的王国" },
    { id: 10, name: "进行时码头",   emoji: "⚓", desc: "正在发生的事情" },
    { id: 11, name: "时光列车",     emoji: "🚂", desc: "过去和将来的旅行" },
    { id: 12, name: "句型城堡",     emoji: "👑", desc: "问句祈使句总动员" }
  ],
  lessons: [
  /* ============ 第一章 名词岛（9 例） ============ */
  {
    id: "n1", ch: 1, t: "名词是什么", tip: "名词 = 万物贴名牌",
    body: "名词就是给人和东西「贴名牌」：人（Tom、妈妈）、动物（cat 猫）、物品（desk 书桌）、地点（school 学校）、还有看不见的（love 爱）都算。你指着一个东西说出它的名字，就是在说名词！",
    say: "人事物地加情感，能叫出名的都是名词。",
    ex: [
      { en: "This is my school.", zh: "这是我的学校。" },
      { en: "The cat is cute.", zh: "这只猫很可爱。" },
      { en: "I love my mother.", zh: "我爱我的妈妈。" }
    ],
    q: [
      { q: "下面哪个词是名词？", o: ["run 跑", "apple 苹果", "happy 开心的"], a: 1, why: "apple（苹果）是可以吃的物品名称，是名词；run 是动词，happy 是形容词。" },
      { q: "「老师」的英语名词是？", o: ["teacher", "teach", "school"], a: 0, why: "teacher 是名词「老师」；teach 是动词「教」；school 是「学校」。" }
    ]
  },
  {
    id: "n2", ch: 1, t: "可数名词", tip: "可数名词 = 一个一个数得清",
    body: "苹果能一个一个数：one apple, two apples, three apples……这样的名词叫可数名词。可数名词有单数和复数两种样子。一个用单数，两个以上变复数（多数直接加 s）。",
    say: "数得清的是可数，一个就单数，多个要加 s。",
    ex: [
      { en: "I have one book.", zh: "我有一本书。" },
      { en: "I have two books.", zh: "我有两本书。" },
      { en: "Three dogs are playing.", zh: "三只狗在玩。" }
    ],
    q: [
      { q: "两个香蕉应该怎么说？", o: ["two banana", "two bananas", "a banana"], a: 1, why: "两个以上要用复数 bananas，别忘记加 s！" },
      { q: "下面哪个是可数名词？", o: ["water 水", "egg 鸡蛋", "milk 牛奶"], a: 1, why: "鸡蛋可以一个一个数（one egg, two eggs）；水和牛奶数不清个数，是不可数名词。" }
    ]
  },
  {
    id: "n3", ch: 1, t: "复数规则一：直接加 s", tip: "大多数名词排队加 s",
    body: "把单数变复数，大多数名词只要在后面加 s，像给火车挂车厢一样简单：book→books，dog→dogs，apple→apples。读的时候注意：s 有时读 /s/，有时读 /z/，跟读课本就好。",
    say: "大多数名词最听话，直接加 s 就变多。",
    ex: [
      { en: "two books", zh: "两本书" },
      { en: "many cats", zh: "许多猫" },
      { en: "five pens", zh: "五支钢笔" }
    ],
    q: [
      { q: "「三只鸟」是？", o: ["three bird", "three birds", "a bird"], a: 1, why: "三只是三个以上，bird 要变复数 birds。" },
      { q: "bag 的复数是？", o: ["bagges", "bags", "bag"], a: 1, why: "bag 直接加 s 变 bags。" }
    ]
  },
  {
    id: "n4", ch: 1, t: "复数规则二：s, x, ch, sh 加 es", tip: "穿盔甲的单词要加 es",
    body: "如果单词的尾巴是 s、x、ch、sh 这几个「刺刺的音」，直接加 s 会读不顺，所以要加 es，多一拍更好念：bus→buses，box→boxes，watch→watches，dish→dishes。",
    say: "s x ch sh 尾巴尖，多穿一件 es 衣。",
    ex: [
      { en: "two buses", zh: "两辆公交车" },
      { en: "four boxes", zh: "四个盒子" },
      { en: "three watches", zh: "三块手表" }
    ],
    q: [
      { q: "「两个盒子」是？", o: ["two boxs", "two boxes", "two box"], a: 1, why: "box 以 x 结尾，要加 es 变 boxes。" },
      { q: "class 的复数是？", o: ["classes", "classs", "class"], a: 0, why: "class 以 s 结尾，加 es 变 classes。" }
    ]
  },
  {
    id: "n5", ch: 1, t: "复数规则三：辅音字母 + y 结尾", tip: "y 小姐变身记：y 变 i 加 es",
    body: "「辅音字母 + y」结尾的词变复数时，y 要变身成 i，再加 es：baby→babies，city→cities，family→families。但如果是「元音字母 + y」（如 boy、key），y 不变身，直接加 s：boys，keys。",
    say: "辅音把 y 拦，y 变 i 加 es；元音牵着手，y 不变加 s。",
    ex: [
      { en: "two babies", zh: "两个宝宝" },
      { en: "many families", zh: "许多家庭" },
      { en: "three boys", zh: "三个男孩" }
    ],
    q: [
      { q: "baby 的复数是？", o: ["babys", "babies", "babyes"], a: 1, why: "b 是辅音字母，y 变 i 加 es：babies。" },
      { q: "「两把钥匙」是？", o: ["two keies", "two keys", "two keyes"], a: 1, why: "key 里 e 是元音字母，y 不变身，直接加 s：keys。" }
    ]
  },
  {
    id: "n6", ch: 1, t: "复数规则四：f / fe 变 ves", tip: "f、fe 爱变身：变 v 加 es",
    body: "有些以 f 或 fe 结尾的名词变复数时，f/fe 会变成 ves：leaf（叶子）→leaves，knife（小刀）→knives，wolf（狼）→wolves。记住小口诀，例外只有少数几个（如 roofs）。",
    say: "f 和 fe 手拉手，变身 ves 往前走。",
    ex: [
      { en: "green leaves", zh: "绿叶子" },
      { en: "two knives", zh: "两把小刀" },
      { en: "wolves live in forests.", zh: "狼住在森林里。" }
    ],
    q: [
      { q: "leaf 的复数是？", o: ["leafs", "leafes", "leaves"], a: 2, why: "f 变 v 加 es：leaves。" },
      { q: "「一把刀」用英语说 a knife，那「三把刀」是？", o: ["three knifes", "three knives", "three knive"], a: 1, why: "fe 变 ves：three knives。" }
    ]
  },
  {
    id: "n7", ch: 1, t: "不规则复数", tip: "不爱排队的小淘气",
    body: "有些名词变复数不按规则来，是「小淘气」，要单独记住：man→men（男人），woman→women（女人），child→children（孩子），foot→feet（脚），tooth→teeth（牙齿），mouse→mice（老鼠）。",
    say: "男女孩子脚和牙，老鼠变样全要背：men, women, children, feet, teeth, mice。",
    ex: [
      { en: "There are five men in the room.", zh: "房间里有五个男人。" },
      { en: "The children are happy.", zh: "孩子们很开心。" },
      { en: "Brush your teeth twice a day.", zh: "每天刷两次牙。" }
    ],
    q: [
      { q: "child 的复数是？", o: ["childs", "children", "childes"], a: 1, why: "child 是特殊变化：children。" },
      { q: "「两颗牙」是？", o: ["two tooths", "two teeth", "two toothes"], a: 1, why: "tooth 变 teeth，是最有名的淘气包之一。" }
    ]
  },
  {
    id: "n8", ch: 1, t: "不可数名词", tip: "数不清的「大部队」",
    body: "水、牛奶、米饭、钱……这些数不清个数的名词叫不可数名词，它们没有复数形式，前面不能加 a / an，也不能直接加数字。想说「一杯水」要说 a glass of water，「一些水」说 some water。",
    say: "水奶米面数不清，不加 s、不加 a；一杯一碗加量词。",
    ex: [
      { en: "I want some water.", zh: "我想要一些水。" },
      { en: "a glass of milk", zh: "一杯牛奶" },
      { en: "two cups of tea", zh: "两杯茶" }
    ],
    q: [
      { q: "下面哪个词是不可数名词？", o: ["book 书", "rice 米饭", "pen 钢笔"], a: 1, why: "米饭数不清一颗颗，是不可数名词；书和笔都能数个数。" },
      { q: "「两杯水」的正确说法是？", o: ["two waters", "two glass of water", "two glasses of water"], a: 2, why: "水不可数，量词 glass 要变复数：two glasses of water。" }
    ]
  },
  {
    id: "n9", ch: 1, t: "名词所有格 's", tip: "小尾巴 's = 谁的",
    body: "想表达「Tom 的书包」，英语用 Tom's bag——在人名后面加个小尾巴 's，就表示「谁的」。单数名词加 's；复数以 s 结尾只加 '（如 the students' desks 同学们的书桌）。这是名词的「专属标记」。",
    say: "谁的物品加 's，复数有 s 只加撇。",
    ex: [
      { en: "This is Tom's bag.", zh: "这是汤姆的书包。" },
      { en: "my mother's car", zh: "我妈妈的车" },
      { en: "the teachers' office", zh: "老师们办公室" }
    ],
    q: [
      { q: "「露西的猫」是？", o: ["Lucy cat", "Lucy's cat", "Lucys' cat"], a: 1, why: "表示「Lucy 的」要用 Lucy's cat。" },
      { q: "the boys' football 的意思是？", o: ["男孩的足球（一个男孩）", "男孩们的足球", "足球是男孩"], a: 1, why: "boys 是复数，撇号在 s 后面，表示「男孩们的」。" }
    ]
  },

  /* ============ 第二章 冠词湾（8 例） ============ */
  {
    id: "a1", ch: 2, t: "a 和 an 的区别", tip: "看第一个音穿什么鞋",
    body: "a 和 an 都表示「一个」，选择看后面单词的第一个音：元音音素开头的词用 an（an apple, an egg, an orange, an elephant），辅音音素开头的用 a（a book, a dog, a pen）。注意听的是「音」不是字母哦：an hour（h 不发音），a useful book（u 读 /juː/）。",
    say: "元音开头穿 an 鞋，辅音开头穿 a 鞋；a e i o u 是元音。",
    ex: [
      { en: "an apple a day", zh: "一天一个苹果" },
      { en: "a big dog", zh: "一只大狗" },
      { en: "an old man", zh: "一位老人" }
    ],
    q: [
      { q: "___ egg 是？", o: ["a egg", "an egg", "the eggs"], a: 1, why: "egg 以元音音素 /e/ 开头，用 an。" },
      { q: "___ useful book", o: ["a", "an", "不填"], a: 0, why: "useful 开头 u 读 /juː/，是辅音音素，用 a！" }
    ]
  },
  {
    id: "a2", ch: 2, t: "什么时候用 a / an", tip: "第一次见面的新朋友",
    body: "第一次提到某个东西时用 a / an，就像做自我介绍：「I have a cat.（我有一只猫）」。第二次再提这只猫，双方都认识了，就要改用 the：「The cat is white.（这只猫是白色的）」。",
    say: "第一次见面用 a，第二次见面用 the。",
    ex: [
      { en: "I see a bird. The bird is blue.", zh: "我看见一只鸟。这只鸟是蓝色的。" },
      { en: "She has an umbrella. The umbrella is red.", zh: "她有一把雨伞。这把伞是红色的。" }
    ],
    q: [
      { q: "I have ___ pen. ___ pen is new.", o: ["a, The", "The, a", "an, The"], a: 0, why: "第一次提到钢笔用 a；第二次都知道是哪支了，用 The。" },
      { q: "第一次介绍「一辆公交车」说？", o: ["the bus", "a bus", "buses"], a: 1, why: "第一次提到用 a bus。" }
    ]
  },
  {
    id: "a3", ch: 2, t: "the 表示特指", tip: "the = 就是那个咱们都知道的",
    body: "the 像「手电筒」，照向双方都知道的那个东西：the sun 太阳（独一无二）、the moon 月亮、the door 我们都知道的那扇门。特指就用 the，这是冠词里最忙碌的一个！",
    say: "独一无二用 the，你知我知也用 the。",
    ex: [
      { en: "The sun is big and bright.", zh: "太阳又大又亮。" },
      { en: "Close the door, please.", zh: "请关门。（我们都知道是哪扇）" },
      { en: "The moon is round tonight.", zh: "今晚月亮很圆。" }
    ],
    q: [
      { q: "___ Earth goes around ___ sun.", o: ["The, the", "A, a", "An, an"], a: 0, why: "地球和太阳都是独一无二的，都用 the。" },
      { q: "请开灯应该怎么说？", o: ["Turn on a light, please.", "Turn on the light, please.", "Turn on lights, please."], a: 1, why: "房间里的灯大家都知道是哪盏，特指用 the light。" }
    ]
  },
  {
    id: "a4", ch: 2, t: "球类棋类零冠词", tip: "玩球不穿鞋（不加 the / a）",
    body: "play 后面接球类、棋类时什么都不加：play football 踢足球，play basketball 打篮球，play chess 下棋。但演奏乐器必须加 the：play the piano 弹钢琴，play the violin 拉小提琴。",
    say: "球棋光脚跑（零冠词），乐器戴 the 帽。",
    ex: [
      { en: "We play football after school.", zh: "放学后我们踢足球。" },
      { en: "I can play the piano.", zh: "我会弹钢琴。" },
      { en: "Let's play chess!", zh: "我们来下棋吧！" }
    ],
    q: [
      { q: "「打篮球」是？", o: ["play the basketball", "play basketball", "play a basketball"], a: 1, why: "球类零冠词：play basketball。" },
      { q: "「拉小提琴」是？", o: ["play violin", "play a violin", "play the violin"], a: 2, why: "乐器要加 the：play the violin。" }
    ]
  },
  {
    id: "a5", ch: 2, t: "三餐零冠词", tip: "吃饭不戴帽",
    body: "一日三餐前面通常不加冠词：have breakfast 吃早餐，have lunch 吃午餐，have dinner 吃晚餐。但如果三餐前有形容词修饰，就可以加：a big dinner 一顿丰盛的晚餐。",
    say: "早午晚餐光吃饭，不加 a 也不加 the。",
    ex: [
      { en: "I have breakfast at seven.", zh: "我七点吃早餐。" },
      { en: "We had a big dinner together.", zh: "我们一起吃了一顿丰盛的晚餐。" },
      { en: "It's time for lunch.", zh: "到吃午餐的时间啦。" }
    ],
    q: [
      { q: "「吃早餐」是？", o: ["have a breakfast", "have the breakfast", "have breakfast"], a: 2, why: "三餐前零冠词：have breakfast。" },
      { q: "We had ___ wonderful lunch. 选？", o: ["a", "不填", "the"], a: 0, why: "三餐被形容词 wonderful 修饰时，可以加 a。" }
    ]
  },
  {
    id: "a6", ch: 2, t: "go to school 类短语", tip: "去上学不带 the",
    body: "go to school（去上学）、go to bed（上床睡觉）、go to hospital（去医院看病）、at home（在家）、in class（在课堂上）这类短语表示「与场所相关的活动」，不加 the。加了 the 意思就变了：go to the school 只是「去学校那个地方」（比如送东西）。",
    say: "上学睡觉去医院，目的活动不加 the。",
    ex: [
      { en: "I go to school at eight.", zh: "我八点去上学。" },
      { en: "Go to bed early, please.", zh: "请早点睡觉。" },
      { en: "Mom is at home.", zh: "妈妈在家。" }
    ],
    q: [
      { q: "「早点上床睡觉」是？", o: ["go to the bed", "go to bed", "go to a bed"], a: 1, why: "表示「去睡觉」这个活动用 go to bed，零冠词。" },
      { q: "She is in ___ class now.", o: ["the", "a", "不填"], a: 2, why: "in class 表示「在上课」，零冠词。" }
    ]
  },
  {
    id: "a7", ch: 2, t: "a / an 的数量含义", tip: "a = 一个",
    body: "a / an 除了「第一次提到」，还带着「一个」的意思：a book 一本书。它只能用在单数可数名词前。千万别说 a books 或 a water（水不可数）——那是它的两个「不许」。",
    say: "a 后只站单数名词，复数不可数都别来。",
    ex: [
      { en: "I have a sister and a brother.", zh: "我有一个姐姐和一个哥哥。" },
      { en: "There is a zoo in our city.", zh: "我们城市里有一个动物园。" },
      { en: "an hour later", zh: "一小时后（h 不发音）" }
    ],
    q: [
      { q: "下面哪个说法是对的？", o: ["a apples", "a water", "a banana"], a: 2, why: "a 只能放在单数可数名词前；apples 是复数，water 不可数，都不行。" },
      { q: "「一个橙子」是？", o: ["a orange", "an orange", "an oranges"], a: 1, why: "orange 以元音音素开头，用 an。" }
    ]
  },
  {
    id: "a8", ch: 2, t: "冠词综合小测验", tip: "三兄弟大集合",
    body: "冠词三兄弟汇总：a / an 表示「一个」（第一次提到），the 表示「特指」（你知我知），很多情况零冠词（球类、三餐、去上学）。做题三步走：先问可不可数，再问第几次提到，最后问是不是固定短语。",
    say: "一数二提三固定，冠词选择不用愁。",
    ex: [
      { en: "I have a dog. The dog is smart.", zh: "我有一只狗。这只狗很聪明。" },
      { en: "We play football and have lunch.", zh: "我们踢足球、吃午餐。" },
      { en: "The sun rises in the east.", zh: "太阳从东方升起。" }
    ],
    q: [
      { q: "This is ___ old castle. ___ castle is famous.", o: ["an, The", "a, A", "an, An"], a: 0, why: "old 以元音开头用 an；第二次提到城堡特指用 The。" },
      { q: "Which is WRONG（错误）? ", o: ["play the chess", "play the piano", "have dinner"], a: 0, why: "棋类零冠词，要说 play chess；乐器才加 the。" }
    ]
  },

  /* ============ 第三章 代词森林（11 例） ============ */
  {
    id: "p1", ch: 3, t: "人称代词主格", tip: "干活的先锋队",
    body: "句子里「谁」做动作，就要用主格代词：I 我、you 你/你们、he 他、she 她、it 它、we 我们、they 他们。它们站在句子开头当主角，就像队伍里的先锋。",
    say: "我你他她它，我们和他们，主格站句首，动作它来发。",
    ex: [
      { en: "I am a student.", zh: "我是一名学生。" },
      { en: "She likes singing.", zh: "她喜欢唱歌。" },
      { en: "They play football.", zh: "他们踢足球。" }
    ],
    q: [
      { q: "（我的妹妹）___ is seven.", o: ["He", "She", "It"], a: 1, why: "妹妹是女生，用 She。" },
      { q: "Tom 和我 → ___ are friends.", o: ["We", "They", "You"], a: 0, why: "「Tom 和我」包括我们自己，用 We（我们）。" }
    ]
  },
  {
    id: "p2", ch: 3, t: "人称代词宾格", tip: "接受动作的接球队员",
    body: "动作「落到谁身上」，就用宾格：me、you、him、her、it、us、them。它们常站在动词或介词后面，像接住球（动作）的队员：Thank you. / Look at me. / I like him.",
    say: "动介后面站宾格，me him her it 接好球。",
    ex: [
      { en: "Thank you for helping me.", zh: "谢谢你帮我。" },
      { en: "The dog follows her.", zh: "狗跟着她。" },
      { en: "Please sit with us.", zh: "请和我们坐一起。" }
    ],
    q: [
      { q: "Miss Li teaches ___ English.", o: ["we", "us", "our"], a: 1, why: "teach 是动词，后面接宾格 us。" },
      { q: "This gift is for ___（他们）.", o: ["they", "their", "them"], a: 2, why: "介词 for 后面用宾格 them。" }
    ]
  },
  {
    id: "p3", ch: 3, t: "形容词性物主代词", tip: "my / your 是小标签",
    body: "表示「谁的」，后面必须跟名词的是形容词性物主代词：my 我的、your 你的、his 他的、her 她的、its 它的、our 我们的、their 他们的。像贴在东西上的小标签：my book 我的书，her bag 她的书包。",
    say: "物主代词是标签，后面必须跟名词。",
    ex: [
      { en: "My schoolbag is heavy.", zh: "我的书包很沉。" },
      { en: "His father is a doctor.", zh: "他的爸爸是医生。" },
      { en: "Their classroom is clean.", zh: "他们的教室很干净。" }
    ],
    q: [
      { q: "___（她的）eyes are big.", o: ["She", "Her", "Hers"], a: 1, why: "eyes 是名词，前面要用形容词性物主代词 Her。" },
      { q: "这是___（我们的）老师。 ___ teacher", o: ["We", "Us", "Our"], a: 2, why: "teacher 是名词，前面用 Our。" }
    ]
  },
  {
    id: "p4", ch: 3, t: "名词性物主代词", tip: "mine 独立站，名词不用带",
    body: "mine、yours、his、hers、ours、theirs 是「独立版」物主代词，后面不再跟名词，自己就能代表「……的东西」：This is my book. = This book is mine. 它像一个「自带标签的背包」，不用再挂东西。",
    say: "名词性代词本领大，独自站岗不带娃（名词）。",
    ex: [
      { en: "This book is mine.", zh: "这本书是我的。" },
      { en: "Is this pen yours?", zh: "这支笔是你的吗？" },
      { en: "The red bike is hers.", zh: "那辆红色的自行车是她的。" }
    ],
    q: [
      { q: "That schoolbag isn't ___.（我的）", o: ["my", "me", "mine"], a: 2, why: "后面没有名词，要用名词性物主代词 mine。" },
      { q: "___（她的）is on the desk.", o: ["Her", "Hers", "She"], a: 1, why: "单独作主语用名词性 Hers。" }
    ]
  },
  {
    id: "p5", ch: 3, t: "反身代词", tip: "照镜子的自己",
    body: "myself、yourself、himself、herself、itself、ourselves、themselves 表示「某人自己」，像照镜子看到的自己：I can do it myself. 我自己能做。常用短语：by myself 独自、enjoy yourself 玩得开心、help yourself 随便吃。",
    say: "镜子里的自己：self 一照就出现。",
    ex: [
      { en: "I can wash my clothes myself.", zh: "我能自己洗衣服。" },
      { en: "Help yourself to some fish.", zh: "随便吃点鱼。" },
      { en: "They enjoyed themselves at the party.", zh: "他们在派对上玩得很开心。" }
    ],
    q: [
      { q: "She made the cake ___.（她自己）", o: ["her", "hers", "herself"], a: 2, why: "表示「她自己」用反身代词 herself。" },
      { q: "「玩得开心（你）」是？", o: ["enjoy you", "enjoy yourself", "enjoy yours"], a: 1, why: "固定搭配 enjoy yourself。" }
    ]
  },
  {
    id: "p6", ch: 3, t: "指示代词 this / that / these / those", tip: "近处 these 远处 those",
    body: "this 这（近处单数）、that 那（远处单数）、these 这些（近处复数）、those 那些（远处复数）。像用手指东西：近的用 th-is，远的用 th-at；复数加尾巴 -e/-ose。打电话时「我是……」用 This is…（This is Mary speaking.）",
    say: "近单 this 远单 that，近复 these 远复 those。",
    ex: [
      { en: "This is my new pen.", zh: "这是我的新钢笔。" },
      { en: "Who is that man over there?", zh: "那边那个男人是谁？" },
      { en: "These apples are sweet; those lemons are sour.", zh: "这些苹果甜，那些柠檬酸。" }
    ],
    q: [
      { q: "___（那些）are my books.", o: ["That", "These", "Those"], a: 2, why: "books 复数 + 远处，用 Those。" },
      { q: "远处的一只鸟说？", o: ["This is a bird.", "That is a bird.", "Those are birds."], a: 1, why: "远处单数用 That。" }
    ]
  },
  {
    id: "p7", ch: 3, t: "some 和 any", tip: "some 逛超市，any 爱提问",
    body: "some 和 any 都表示「一些」。some 多用在肯定句（I have some milk.）；any 多用在疑问句和否定句（Do you have any milk? / I don't have any milk.）。但请求和邀请的问句很客气，还是用 some：Would you like some juice?",
    say: "肯定 some 疑否 any，客气邀请 some 回来。",
    ex: [
      { en: "There is some bread on the table.", zh: "桌上有一些面包。" },
      { en: "Are there any pictures in your room?", zh: "你房间里有画吗？" },
      { en: "Would you like some tea?", zh: "要来点茶吗？（邀请用 some）" }
    ],
    q: [
      { q: "I don't have ___ money.", o: ["some", "any", "many"], a: 1, why: "否定句用 any。" },
      { q: "Would you like ___ bananas?", o: ["some", "any", "much"], a: 0, why: "礼貌邀请用 some。" }
    ]
  },
  {
    id: "p8", ch: 3, t: "many 和 much", tip: "many 数得清，much 数不清",
    body: "many 配可数名词复数（many apples 许多苹果、many books），much 配不可数名词（much water、much time）。「多少」提问也一样：How many books? / How much milk? 记住：How many 问可数，How much 问不可数（也问价格）。",
    say: "many 数一数，much 不可数；How much 还能问价格。",
    ex: [
      { en: "How many students are there in your class?", zh: "你们班有多少学生？" },
      { en: "How much water do you drink every day?", zh: "你每天喝多少水？" },
      { en: "There is too much rain in summer.", zh: "夏天雨水太多。" }
    ],
    q: [
      { q: "How ___ apples do you want?", o: ["much", "many", "some"], a: 1, why: "apples 可数复数，用 many。" },
      { q: "How ___ is the T-shirt?（问价格）", o: ["many", "much", "old"], a: 1, why: "问价格用 How much。" }
    ]
  },
  {
    id: "p9", ch: 3, t: "both 和 all", tip: "both 俩人手拉手，all 大家手拉手",
    body: "both 表示「两者都」，all 表示「三者及以上都」或「全部」。Both of us like music.（我们俩都喜欢音乐。）All the students are here.（所有学生都到了。）位置诀窍：它们站在 be 动词后面、实义动词前面：We are both ten. / We both like dogs.",
    say: "两个用 both，全部用 all；be 后实义动词前。",
    ex: [
      { en: "Both answers are right.", zh: "两个答案都对。" },
      { en: "All my friends like ice cream.", zh: "我所有的朋友都喜欢冰淇淋。" },
      { en: "They are both in the same class.", zh: "他们俩在同一个班。" }
    ],
    q: [
      { q: "___ of my hands are clean.（两只手）", o: ["All", "Both", "Every"], a: 1, why: "手有两只，用 Both。" },
      { q: "___ the students passed the test.（全部学生）", o: ["Both", "All", "Some"], a: 1, why: "三个以上用 All。" }
    ]
  },
  {
    id: "p10", ch: 3, t: "each 和 every", tip: "each 一个一个看，every 全体一起看",
    body: "each 强调「各自、每个单独」，可单独用也可修饰单数名词：Each student has a pen.（每个学生各有一支笔。）every 只能修饰单数名词，强调「全体没有一个例外」：Every day is a new day. each of + 复数名词也常用：each of us。",
    say: "each 单独 each of 全，every 后面名词单数站。",
    ex: [
      { en: "Each child got a gift.", zh: "每个孩子都得到了一份礼物。" },
      { en: "Every student must wear a uniform.", zh: "每个学生都必须穿校服。" },
      { en: "Each of us has a dream.", zh: "我们每个人都有梦想。" }
    ],
    q: [
      { q: "___ book on the shelf is interesting.", o: ["Every", "Each", "All"], a: 1, why: "Each 可直接修饰名词，此处Each/Every都常见，但 book 单独存在 shelf 上更强调逐个，标准答案 Each。All 后面要加 the/复数。" },
      { q: "___ of the boys has a kite.", o: ["Each", "Every", "All"], a: 0, why: "each of + 复数名词是固定用法；every 不能接 of。" }
    ]
  },
  {
    id: "p11", ch: 3, t: "疑问代词 who / what / which", tip: "提问三剑客",
    body: "who 问「谁」（问人）：Who is your English teacher? what 问「什么」（问事物）：What is in your bag? which 问「哪一个」（在一定范围内选择）：Which color do you like, red or blue? 有选择范围时 which 更准！",
    say: "who 问人，what 问事，which 挑一个。",
    ex: [
      { en: "Who is that girl?", zh: "那个女孩是谁？" },
      { en: "What is your favorite subject?", zh: "你最喜欢的科目是什么？" },
      { en: "Which season do you like best?", zh: "你最喜欢哪个季节？" }
    ],
    q: [
      { q: "—___ is knocking at the door? —Maybe Tom.", o: ["What", "Who", "Which"], a: 1, why: "问「谁」用 Who。" },
      { q: "___ one do you want, the big cake or the small one?", o: ["What", "Who", "Which"], a: 2, why: "在两个蛋糕里选择，用 Which。" }
    ]
  },

  /* ============ 第四章 数词矿井（6 例） ============ */
  {
    id: "num1", ch: 4, t: "基数词 1~12", tip: "数字宝宝排排坐",
    body: "1~12 是数字大家庭的「基础宝宝」，每个都有自己的名字，没有规律，要像记朋友名字一样记住：one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve。它们是后面所有数字的地基！",
    say: "一到十二没有巧，天天念，记得牢。",
    ex: [
      { en: "I have seven marbles.", zh: "我有七颗弹珠。" },
      { en: "There are twelve months in a year.", zh: "一年有十二个月。" },
      { en: "Ten plus two is twelve.", zh: "十加二等于十二。" }
    ],
    q: [
      { q: "「八」是？", o: ["eigth", "eight", "aite"], a: 1, why: "八写作 eight，注意没有 i 的 e 在前。" },
      { q: "「我三岁了」是？", o: ["I am three.", "I am third.", "I have three."], a: 0, why: "说年龄用基数词：I am three." }
    ]
  },
  {
    id: "num2", ch: 4, t: "基数词 13~19 与整十", tip: "-teen 小尾巴和 -ty 大尾巴",
    body: "13~19 都带小尾巴 teen：thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen。整十数带大尾巴 ty：twenty, thirty, forty, fifty, sixty, seventy, eighty, ninety。注意 forty 没有 u，fifty 中 fift 有变化！",
    say: "十几 teen，几十 ty；forty 掉了 u，别记错。",
    ex: [
      { en: "My brother is fifteen.", zh: "我哥哥十五岁。" },
      { en: "There are forty desks in the hall.", zh: "大厅里有四十张桌子。" },
      { en: "Twenty plus thirty is fifty.", zh: "二十加三十等于五十。" }
    ],
    q: [
      { q: "「四十」的正确拼写是？", o: ["fourty", "forty", "forteen"], a: 1, why: "forty 没有 u，是最容易拼错的一个！" },
      { q: "「十九」是？", o: ["ninety", "nineteen", "ninteen"], a: 1, why: "十九 = nine + teen = nineteen；ninety 是九十。" }
    ]
  },
  {
    id: "num3", ch: 4, t: "几十几与 hundred", tip: "整十加个位，中间小横杠",
    body: "21~99 的数：先说整十，加个位，中间用连字符 - 连接：21 = twenty-one，35 = thirty-five，99 = ninety-nine。百位用 hundred：100 = one hundred，200 = two hundred（hundred 一般不加 s）。",
    say: "整十在前个位在后，中间横杠拉小手。",
    ex: [
      { en: "My grandma is eighty-five.", zh: "我奶奶八十五岁。" },
      { en: "The book has one hundred pages.", zh: "这本书有一百页。" },
      { en: "Room 306 = Room three oh six.", zh: "306 房间。" }
    ],
    q: [
      { q: "「六十八」是？", o: ["sixty-eight", "sixty eight", "sixteen-eight"], a: 0, why: "sixty + 连字符 + eight：sixty-eight。" },
      { q: "two hundred 的用法对吗？", o: ["对，hundred 不加 s", "错，要 two hundreds", "错，要 two hundred of"], a: 0, why: "确切数字时 hundred 用单数：two hundred。" }
    ]
  },
  {
    id: "num4", ch: 4, t: "序数词：第几名", tip: "加 th 变「第几」，三个小淘气例外",
    body: "表示「第一、第二、第三」要用序数词：first (1st), second (2nd), third (3rd)。从第四开始一般加 th：fourth, fifth (第五，five 变 fift), sixth, seventh, eighth, ninth, twelfth, twentieth。序数词前面常加 the：the first day 第一天。",
    say: "一二三，特殊记；fourth 起加 th；fifth 缩尾巴。",
    ex: [
      { en: "I am the first one to arrive.", zh: "我是第一个到的。" },
      { en: "May is the fifth month.", zh: "五月是第五个月。" },
      { en: "This is my second time here.", zh: "这是我第二次来这儿。" }
    ],
    q: [
      { q: "「第三」是？", o: ["three", "third", "threeth"], a: 1, why: "第三是特殊的 third。" },
      { q: "「第五」是？", o: ["fiveth", "fifth", "fiftieth"], a: 1, why: "five 变 fift 再加 th：fifth。" }
    ]
  },
  {
    id: "num5", ch: 4, t: "时间的读法", tip: "整点 o'clock，几点几分这样读",
    body: "整点说「数字 + o'clock」：seven o'clock 七点。几点几分：先说点再说分（7:15 = seven fifteen）；也可以用 past / to：15 分用 a quarter past seven，30 分用 half past seven，45 分用 a quarter to eight（差一刻到八点）。",
    say: "整点 o'clock；past 分在前，to 分在后加一点。",
    ex: [
      { en: "It's eight o'clock.", zh: "现在八点整。" },
      { en: "It's half past six.", zh: "六点半了。" },
      { en: "It's a quarter to ten.", zh: "差一刻十点（九点四十五）。" }
    ],
    q: [
      { q: "7:30 可以说？", o: ["half past seven", "half to seven", "seven half"], a: 0, why: "30 分钟用 half past + 点数。" },
      { q: "It's a quarter past nine. 是几点？", o: ["8:45", "9:15", "9:45"], a: 1, why: "a quarter past nine = 九点过一刻 = 9:15。" }
    ]
  },
  {
    id: "num6", ch: 4, t: "日期与年份", tip: "日期用序数，年份一串读",
    body: "问日期用 What's the date today? 回答用「月份 + 序数词」：October 1st (读 the first of October / October the first)。年份一串读：2026 读 twenty twenty-six。问「几月几日」别和问星期（What day…）弄混哦！",
    say: "几日用 date 序数词，星期 day 加星期名。",
    ex: [
      { en: "—What's the date today? —It's June 1st.", zh: "——今天几号？——六月一日。" },
      { en: "My birthday is on May 20th.", zh: "我的生日在五月二十日。" },
      { en: "—What day is it today? —It's Monday.", zh: "——今天星期几？——星期一。" }
    ],
    q: [
      { q: "「今天几号」问？", o: ["What day is it today?", "What's the date today?", "What time is it?"], a: 1, why: "问日期用 What's the date；What day 问星期。" },
      { q: "My birthday is ___ October 1st.", o: ["in", "at", "on"], a: 2, why: "具体某一天用介词 on。" }
    ]
  },

  /* ============ 第五章 形容词雪山（10 例） ============ */
  {
    id: "adj1", ch: 5, t: "形容词是什么", tip: "给名词化妆的小画家",
    body: "形容词描述人和东西「什么样」：big 大的、small 小的、beautiful 美丽的、tall 高的。它像给名词化妆：a big apple（一个大苹果）。位置在名词前面，或放在 be 动词后面：The apple is big.",
    say: "形容名词前面站，be 动词后也常见。",
    ex: [
      { en: "She has long hair.", zh: "她有一头长发。" },
      { en: "The sky is blue.", zh: "天空是蓝色的。" },
      { en: "It's a sunny day.", zh: "天气晴朗。" }
    ],
    q: [
      { q: "下面哪个是形容词？", o: ["swim 游泳", "clever 聪明的", "window 窗户"], a: 1, why: "clever 描述「聪明的」，是形容词。" },
      { q: "「这是一座高山」是？", o: ["It's a mountain high.", "It's a high mountain.", "It's a high mountain big."], a: 1, why: "形容词放在名词前面：a high mountain。" }
    ]
  },
  {
    id: "adj2", ch: 5, t: "比较级初认识", tip: "俩人比一比，加 er 加 than",
    body: "两个东西比较时用比较级 + than：Tom is taller than Ben.（Tom 比 Ben 高。）规则变化：一般直接加 er（taller, stronger）；以 e 结尾加 r（nicer, larger）；「辅音 + y」结尾变 i 加 er（happier, easier）；重读闭音节双写尾字母加 er（bigger, hotter, thinner）。",
    say: "比较级，加 er；比不过就 than 連。",
    ex: [
      { en: "An elephant is bigger than a horse.", zh: "大象比马大。" },
      { en: "Summer is hotter than spring.", zh: "夏天比春天热。" },
      { en: "I am happier today.", zh: "我今天更开心。" }
    ],
    q: [
      { q: "big 的比较级是？", o: ["biger", "bigger", "more big"], a: 1, why: "重读闭音节双写 g 再加 er：bigger。" },
      { q: "Tom is ___ than his brother.（高）", o: ["tall", "taller", "tallest"], a: 1, why: "有 than，用比较级 taller。" }
    ]
  },
  {
    id: "adj3", ch: 5, t: "最高级初认识", tip: "一群里最棒的，加 est 加 the",
    body: "三者以上比较，用最高级（est 形式），前面别忘了 the：the tallest 最高、the biggest 最大。最高级常和 of / in 短语连用：He is the tallest in our class.（他在我们班最高。）in 后面接集体/地点，of 后面接同类的人或物。",
    say: "最高级加 est，the 别忘记；范围 in 或 of。",
    ex: [
      { en: "The panda is the cutest of all animals.", zh: "熊猫是所有动物里最可爱的。" },
      { en: "This is the biggest park in the city.", zh: "这是城里最大的公园。" },
      { en: "She is the youngest in her family.", zh: "她是家里最小的。" }
    ],
    q: [
      { q: "Lucy is ___ girl in our class.（最高的）", o: ["taller", "the tallest", "tall"], a: 1, why: "全班范围内最……用最高级 the tallest。" },
      { q: "「最大」的最高级形式是？", o: ["bigest", "the biggest", "bigger"], a: 1, why: "双写 g 加 est：the biggest。" }
    ]
  },
  {
    id: "adj4", ch: 5, t: "不规则比较级", tip: "好更好 best 三兄弟",
    body: "有几个形容词的比较级最高级是「变身怪杰」，要单独记：good/well→better→best；bad/badly→worse→worst；many/much→more→most；little→less→least；far→farther→farthest。",
    say: "好变 better，坏变 worse；多 more 少 less 背熟它。",
    ex: [
      { en: "Your idea is better than mine.", zh: "你的主意比我的好。" },
      { en: "This is the worst weather this week.", zh: "这是这周最糟的天气。" },
      { en: "I have more books than you.", zh: "我的书比你的多。" }
    ],
    q: [
      { q: "good 的比较级是？", o: ["gooder", "better", "best"], a: 1, why: "good 变 better；best 是最高级。" },
      { q: "Today is ___ than yesterday.（更糟）", o: ["badder", "worse", "worst"], a: 1, why: "bad 的比较级是特殊的 worse。" }
    ]
  },
  {
    id: "adj5", ch: 5, t: "as ... as 一样…", tip: "中间放原级，比不出高低",
    body: "表示「和……一样」用 as + 形容词原级 + as：Tom is as tall as Ben.（Tom 和 Ben 一样高。）否定式 not as/so ... as 表示「不如……」：My bag is not as heavy as yours.（我的包没你的重。）中间一定用原级，不能加 er！",
    say: "as…as 手拉手，中间原级走。",
    ex: [
      { en: "Lily is as clever as Lucy.", zh: "Lily 和 Lucy 一样聪明。" },
      { en: "This line is not as long as that one.", zh: "这条线没有那条长。" },
      { en: "Run as fast as you can.", zh: "尽你最快地跑。" }
    ],
    q: [
      { q: "He is as ___ as his father.（强壮）", o: ["stronger", "strong", "strongest"], a: 1, why: "as...as 中间用原级 strong。" },
      { q: "「我的房间不如你的大」是？", o: ["My room is as big as yours.", "My room is not as big as yours.", "My room is bigger than yours."], a: 1, why: "「不如」用 not as...as。" }
    ]
  },
  {
    id: "adj6", ch: 5, t: "比较级的修饰语", tip: "much / a little 帮比较级加马力",
    body: "比较级前面可以加程度词「加马力」：much（……得多）、a little（一点点）、even（甚至更）、a lot。注意：very 只能修饰原级（very tall），不能修饰比较级！要说 much taller。",
    say: "much 一点儿别放 very；a little 轻轻加。",
    ex: [
      { en: "This road is much wider than that one.", zh: "这条路比那条宽得多。" },
      { en: "I feel a little better now.", zh: "我现在感觉好一点儿了。" },
      { en: "Today is even colder than yesterday.", zh: "今天甚至比昨天还冷。" }
    ],
    q: [
      { q: "She is ___ taller than me.", o: ["very", "much", "more"], a: 1, why: "比较级前用 much；very 只能修饰原级。" },
      { q: "下面哪个是对的？", o: ["very bigger", "much bigger", "very much big"], a: 1, why: "much + 比较级 bigger 才正确。" }
    ]
  },
  {
    id: "adj7", ch: 5, t: "the same as 与 be different from", tip: "一样 same，不同 different",
    body: "「和……一样」用 the same as：My schoolbag is the same as yours.（我的书包和你的一样。）「和……不同」用 be different from：My schoolbag is different from yours.（我的书包和你的不同。）注意 same 前面总是带 the！",
    say: "same 前有 the，different from 不分离。",
    ex: [
      { en: "We are in the same class.", zh: "我们在同一个班。" },
      { en: "My answer is the same as his.", zh: "我的答案和他的相同。" },
      { en: "Winter is different from summer.", zh: "冬天和夏天不同。" }
    ],
    q: [
      { q: "My bike is ___ same ___ hers.", o: ["the, as", "a, as", "the, from"], a: 0, why: "the same as 是固定搭配。" },
      { q: "「这本字典和那本不同」是？", o: ["This dictionary is the same as that one.", "This dictionary is different from that one.", "This dictionary is different than that one."], a: 1, why: "「不同」用 be different from。" }
    ]
  },
  {
    id: "adj8", ch: 5, t: "-ing 和 -ed 形容词", tip: "ing 令人…，ed 感到…",
    body: "以 -ing 结尾的形容词表示「令人……的」（描述事物本身），以 -ed 结尾表示「（人）感到……的」：The film is interesting.（电影令人感兴趣。）I am interested in the film.（我对电影感兴趣。）常用的还有 exciting / excited，surprising / surprised，boring / bored。",
    say: "ing 物让人感，ed 人心里边。",
    ex: [
      { en: "The football game is exciting.", zh: "足球赛令人兴奋。" },
      { en: "We are excited about the trip.", zh: "我们对旅行很兴奋。" },
      { en: "The book is boring. I feel bored.", zh: "这本书很无聊，我感到无聊。" }
    ],
    q: [
      { q: "The news is ___.（令人惊讶的）", o: ["surprised", "surprising", "surprise"], a: 1, why: "描述新闻本身「令人惊讶」用 -ing 形式 surprising。" },
      { q: "I am ___ in English.（感兴趣的）", o: ["interesting", "interested", "interest"], a: 1, why: "人「感到感兴趣」用 interested，固定搭配 be interested in。" }
    ]
  },
  {
    id: "adj9", ch: 5, t: "多个形容词排队", tip: "观点形状年龄色，先来后到有规矩",
    body: "好几个形容词修饰一个名词时，要排队：观点（beautiful）→ 大小/形状（big, round）→ 年龄/新旧（old, new）→ 颜色（red）→ 材料（wooden）。例：a beautiful big round old red wooden table（一张漂亮的大红旧圆木桌）。实际最多两三个，别堆太多哦。",
    say: "观点大小和新旧，颜色材料殿后走。",
    ex: [
      { en: "a small red schoolbag", zh: "一个红色的小书包" },
      { en: "She has long black hair.", zh: "她有一头黑色的长发。" },
      { en: "It's a nice new bike.", zh: "是一辆漂亮的新自行车。" }
    ],
    q: [
      { q: "正确的排序是？", o: ["a red big apple", "a big red apple", "an apple red big"], a: 1, why: "大小在颜色前面：a big red apple。" },
      { q: "「一辆新的蓝色小汽车」是？", o: ["a blue new car", "a new blue car", "a car new blue"], a: 1, why: "新旧在颜色前面：a new blue car。" }
    ]
  },
  {
    id: "adj10", ch: 5, t: "形容词综合闯关", tip: "雪山之巅大挑战",
    body: "复习一座「雪山」：形容词修饰名词放前面；比较级 + than 俩人比；最高级 the + est 三者比；as...as 中间原级；much 修饰比较级；same 前有 the。一步一关往上爬！",
    say: "形比最 as 四件宝，用好它们分数高。",
    ex: [
      { en: "Winter is the coldest season of the year.", zh: "冬天是一年中最冷的季节。" },
      { en: "My brother is two years older than me.", zh: "我哥哥比我大两岁。" },
      { en: "Our classroom is as clean as theirs.", zh: "我们的教室和他们的一样干净。" }
    ],
    q: [
      { q: "Which is the ___ river in China?（最长）", o: ["longer", "longest", "the longest"], a: 1, why: "句首已有 the，填最高级 longest。" },
      { q: "My bag is much ___ than yours.（重）", o: ["heavier", "heaviest", "very heavy"], a: 0, why: "much + 比较级：much heavier。" }
    ]
  },

  /* ============ 第六章 副词草原（8 例） ============ */
  {
    id: "adv1", ch: 6, t: "副词是什么", tip: "修饰动词的「加速器」",
    body: "副词描述动作「怎么做、什么时候、多经常」：run fast 跑得快、speak loudly 大声说。它像给动词装上加速器或瞄准镜。许多副词由形容词 + ly 变来：quick→quickly，slow→slowly。",
    say: "形容词加 ly，摇身变副词。",
    ex: [
      { en: "The rabbit runs fast.", zh: "兔子跑得快。" },
      { en: "Please read it slowly.", zh: "请慢慢读。" },
      { en: "She sings beautifully.", zh: "她唱歌很好听。" }
    ],
    q: [
      { q: "下面哪个是副词？", o: ["quick", "quickly", "quickness"], a: 1, why: "quickly 是 quick 加 ly 变成的副词。" },
      { q: "「他大声说话」是？", o: ["He speaks loud.", "He speaks loudly.", "He speaks loudness."], a: 1, why: "修饰动词 speak 用副词 loudly。" }
    ]
  },
  {
    id: "adv2", ch: 6, t: "副词构成规则", tip: "加 ly 的三个小规矩",
    body: "形容词变副词：一般直接加 ly（real→really）；以辅音 + y 结尾变 y 为 i 加 ly（happy→happily, easy→easily）；以 le 结尾去 e 加 y（possible→possibly, terrible→terribly）。注意 good 的副词是 well，不是 goodly！",
    say: "直加 ly，y 变 i，le 去 e 加 y；good 特殊变 well。",
    ex: [
      { en: "He did his homework quickly.", zh: "他很快做完了作业。" },
      { en: "The children are playing happily.", zh: "孩子们玩得开心。" },
      { en: "She dances well.", zh: "她舞跳得好。（good→well）" }
    ],
    q: [
      { q: "easy 的副词是？", o: ["easyly", "easily", "easilly"], a: 1, why: "辅音 + y 结尾：变 i 加 ly → easily。" },
      { q: "「她英语讲得好」是？", o: ["She speaks English good.", "She speaks English well.", "She speaks English goodly."], a: 1, why: "good 的副词是 well。" }
    ]
  },
  {
    id: "adv3", ch: 6, t: "频率副词：always 到 never", tip: "频率尺子从 100% 到 0%",
    body: "always 总是（100%）→ usually 通常 → often 经常 → sometimes 有时 → never 从不（0%）。它们像一把频率尺子。位置：be 动词后，实义动词前：He is always late. / He always gets up early.",
    say: "always 最勤快，never 摸鱼王；be 后实义前。",
    ex: [
      { en: "I always brush my teeth in the morning.", zh: "我早上总是刷牙。" },
      { en: "We sometimes play chess after class.", zh: "我们有时课后下棋。" },
      { en: "She is never late for school.", zh: "她上学从不迟到。" }
    ],
    q: [
      { q: "He ___ eats breakfast. He has it every day.", o: ["never", "sometimes", "always"], a: 2, why: "每天都吃 → always（总是）。" },
      { q: "正确的位置是？", o: ["She late is always.", "She is always late.", "She always is late."], a: 1, why: "频率副词放 be 动词后：is always late。" }
    ]
  },
  {
    id: "adv4", ch: 6, t: "时间地点副词的位置", tip: "小地点大地点，先小后大",
    body: "英语说地点习惯「先小后大」：He lives in Beijing, China.（先北京后中国。）时间副词通常放句尾，也可放句首强调：We play football after school. / After school, we play football. 一个句子里：方式→地点→时间（他跑得快、在操场、今天下午）。",
    say: "地点从小到大排，时间多在句尾呆。",
    ex: [
      { en: "I was born in Guangzhou, China.", zh: "我出生在中国广州。" },
      { en: "They played happily on the playground yesterday.", zh: "昨天他们在操场上玩得很开心。" },
      { en: "Tomorrow I will go to the library.", zh: "明天我要去图书馆。" }
    ],
    q: [
      { q: "正确的语序是？", o: ["He lives in China, Beijing.", "He lives in Beijing, China.", "He in Beijing lives, China."], a: 1, why: "先小地点 Beijing，后大地点 China。" },
      { q: "「方式 + 地点 + 时间」顺序是？", o: ["yesterday, at school, quickly", "quickly, at school, yesterday", "at school, quickly, yesterday"], a: 1, why: "方式（quickly）→ 地点（at school）→ 时间（yesterday）。" }
    ]
  },
  {
    id: "adv5", ch: 6, t: "副词的比较级", tip: "副词也能比一比",
    body: "副词比较级：-ly 结尾的用 more（more slowly），单音节直接加 er（faster, harder）；最高级用 most / est（the fastest）。常用句型和形容词一样：He runs faster than me. / She sings the most beautifully in our class.",
    say: "er faster，more slowly；than 一出场，比较级就上。",
    ex: [
      { en: "A cheetah runs faster than a lion.", zh: "猎豹跑得比狮子快。" },
      { en: "Please speak more slowly.", zh: "请说得再慢一点。" },
      { en: "Who laughs the loudest?", zh: "谁笑得最大声？" }
    ],
    q: [
      { q: "Work ___, and you will pass the exam.（更努力）", o: ["harder", "harder than", "hardest"], a: 0, why: "单独表示「更努力」用比较级 harder。" },
      { q: "more slowly 的原级是？", o: ["slow", "slower", "slowest"], a: 0, why: "slowly 是 slow 的副词，more slowly 是其比较级，原级 slow/slowly。" }
    ]
  },
  {
    id: "adv6", ch: 6, t: "hard 和 hardly", tip: "一个玩命干，一个几乎不",
    body: "hard 本身既是形容词（困难的）又是副词（努力地）：study hard 努力学习。hardly 是另一个词，意思是「几乎不」：He hardly watches TV.（他几乎不看电视。）两个长得像，意思差很远，别上当！",
    say: "hard 拼命干，hardly 几乎不算数。",
    ex: [
      { en: "We study hard every day.", zh: "我们每天努力学习。" },
      { en: "It hardly ever snows here.", zh: "这里几乎从不下雪。" },
      { en: "I could hardly hear you.", zh: "我几乎听不见你说话。" }
    ],
    q: [
      { q: "It ___ rains in the desert.（几乎不）", o: ["hard", "hardly", "harder"], a: 1, why: "「几乎不」用 hardly。" },
      { q: "「努力学习」是？", o: ["study hardly", "study hard", "hard study"], a: 1, why: "「努力地」用副词 hard：study hard。" }
    ]
  },
  {
    id: "adv7", ch: 6, t: "too, also, either", tip: "肯定 too/also，否定 either",
    body: "表示「也」：too 放句尾（I like dogs, too.）；also 放句中（I also like cats.）；either 用于否定句尾（I don't like rain, either.）。口诀：肯定 too、also 任意走，否定 either 收尾巴。",
    say: "肯定 too also，否定 either 来收尾。",
    ex: [
      { en: "I am a student, too.", zh: "我也是一名学生。" },
      { en: "She also wants to go.", zh: "她也想去。" },
      { en: "He can't swim. I can't, either.", zh: "他不会游泳。我也不会。" }
    ],
    q: [
      { q: "I don't like coffee, ___.", o: ["too", "also", "either"], a: 2, why: "否定句中的「也」用 either 放句尾。" },
      { q: "He is ___ from Beijing.（他也是北京人）", o: ["too", "also", "either"], a: 1, why: "句中表示「也」用 also（also 放实义动词前、be 后：is also from）。" }
    ]
  },
  {
    id: "adv8", ch: 6, t: "副词综合闯关", tip: "草原大比拼",
    body: "草原闯关复习：ly 变身规则；频率尺 always→never（be 后实义前）；地点先小后大；hard 和 hardly 大不同；否定句「也」用 either。带上这些武器出发！",
    say: "副词虽小本领大，时间地点方法全靠它。",
    ex: [
      { en: "Listen carefully in class.", zh: "课上认真听讲。" },
      { en: "My sister usually gets up at six.", zh: "我姐姐通常六点起床。" },
      { en: "He runs fastest in our team.", zh: "他是我们队里跑得最快的。" }
    ],
    q: [
      { q: "She sings ___ of the three.（最美妙）", o: ["beautifully", "more beautifully", "the most beautifully"], a: 2, why: "三者中「最……」用最高级 the most beautifully。" },
      { q: "正确的句子是？", o: ["He always is happy.", "He is always happy.", "Always he is happy."], a: 1, why: "频率副词放 be 动词之后。" }
    ]
  },

  /* ============ 第七章 介词迷宫（10 例） ============ */
  {
    id: "prep1", ch: 7, t: "时间介词 at / on / in", tip: "at 一点，on 一天，in 一大段",
    body: "at 用在具体时刻：at seven（七点）、at noon、at night。on 用在具体某天：on Monday、on May 1st、on Sunday morning。in 用在较长的时间段：in the morning、in May、in 2026、in spring。",
    say: "at 点、on 天、in 大段，时间迷宫全通关。",
    ex: [
      { en: "I get up at six thirty.", zh: "我六点半起床。" },
      { en: "We have no classes on Saturday.", zh: "周六我们没有课。" },
      { en: "Birds fly back in spring.", zh: "春天鸟儿飞回来。" }
    ],
    q: [
      { q: "School starts ___ eight o'clock.", o: ["in", "on", "at"], a: 2, why: "具体时刻用 at。" },
      { q: "___ the morning of May 1st（五一日早上）", o: ["In", "On", "At"], a: 1, why: "具体某天的早上用 on！" }
    ]
  },
  {
    id: "prep2", ch: 7, t: "地点介词 in / on / at", tip: "in 大范围，on 表面上，at 一个点",
    body: "in 表示「在……里面/大范围」：in the box、in China、in the classroom。on 表示「在……表面上」：on the desk、on the wall、on the floor。at 表示「在某个点/场所」：at home、at school、at the bus stop。",
    say: "in 进里面，on 贴表面，at 是一点。",
    ex: [
      { en: "The cat is in the box.", zh: "猫在盒子里。" },
      { en: "Your book is on the desk.", zh: "你的书在课桌上。" },
      { en: "We meet at the school gate.", zh: "我们在校门口集合。" }
    ],
    q: [
      { q: "There are many fish ___ the river.", o: ["in", "on", "at"], a: 0, why: "在河里面用 in。" },
      { q: "The picture is ___ the wall.", o: ["in", "on", "at"], a: 1, why: "画贴在墙表面上，用 on。" }
    ]
  },
  {
    id: "prep3", ch: 7, t: "方位介词全家福", tip: "上下前后左右站位操",
    body: "方位介词一队人：on 在上面、under 在下面、in front of 在前面、behind 在后面、next to / beside 在旁边、near 在附近、between 在（两者）之间。想象教室站位操：老师站讲台（in front of），黑板在墙（on the wall）。",
    say: "on 上 under 下，front 前 behind 后，beside 旁边 between 夹。",
    ex: [
      { en: "The ball is under the chair.", zh: "球在椅子下面。" },
      { en: "There is a tree in front of the house.", zh: "房子前面有一棵树。" },
      { en: "I sit between Tom and Lily.", zh: "我坐在 Tom 和 Lily 中间。" }
    ],
    q: [
      { q: "The bird is ___ the tree.（在树上，外部长着）", o: ["in", "on", "under"], a: 1, why: "树上长的东西（鸟、叶子）用 on；外物进入树冠用 in。鸟站树枝上用 on。" },
      { q: "The bank is ___ the supermarket and the park.（在……之间）", o: ["next", "between", "behind"], a: 1, why: "两者之间用 between。" }
    ]
  },
  {
    id: "prep4", ch: 7, t: "in / on 穿戴与交通", tip: "in 套装 on 单件，by 车马 in/on 舱位",
    body: "穿戴：in + 颜色/衣服（The girl in red 穿红衣服的女孩），on + 单件（with glasses 戴眼镜用 with）。交通：by + 交通工具零冠词（by bus, by bike, by plane）；步行用 on foot；in a car / on the bus 强调「在车里/车上」。",
    say: "in 红裙 on 外套，by bus on foot 各走各道。",
    ex: [
      { en: "The girl in a red dress is my sister.", zh: "穿红裙子的女孩是我妹妹。" },
      { en: "I go to school by bike every day.", zh: "我每天骑车上学。" },
      { en: "Does he come to work on foot?", zh: "他步行上班吗？" }
    ],
    q: [
      { q: "He goes to Beijing ___ plane.", o: ["on", "by", "in"], a: 1, why: "by + 交通工具：by plane。" },
      { q: "「步行上学」是？", o: ["by foot", "on foot", "in foot"], a: 1, why: "步行固定用 on foot。" }
    ]
  },
  {
    id: "prep5", ch: 7, t: "with 和 without", tip: "with 带着走，without 全没有",
    body: "with 表示「带着、和……一起、用……」：come with me（和我一起来）、cut it with a knife（用刀切）。without 表示「没有」：coffee without sugar（不加糖的咖啡）。with 像背包背着走，without 就是把东西丢了。",
    say: "with 有，without 无；工具有无全看它。",
    ex: [
      { en: "I go to the park with my friends.", zh: "我和朋友们一起去公园。" },
      { en: "We see with our eyes.", zh: "我们用眼睛看。" },
      { en: "He left without saying goodbye.", zh: "他没说再见就走了。" }
    ],
    q: [
      { q: "Write ___ your pen, please.", o: ["use", "with", "by"], a: 1, why: "「用……工具」介词用 with。" },
      { q: "「没有水的花」可以说？", o: ["flowers with water", "flowers without water", "flowers by water"], a: 1, why: "「没有」用 without。" }
    ]
  },
  {
    id: "prep6", ch: 7, t: "for 和 since", tip: "for 一段时间，since 一个起点",
    body: "for + 时间段（for two hours 两小时、for ten years）；since + 过去的起点（since 2020、since last week）。它们常和完成时一起出现：I have lived here for ten years. / I have lived here since 2016. for 问「多久」，since 问「从何时」。",
    say: "for 段，since 点；多长时间 for 上前。",
    ex: [
      { en: "I have studied English for three years.", zh: "我学英语已经三年了。" },
      { en: "He has been in the club since last month.", zh: "他从上个月起就在俱乐部了。" },
      { en: "We waited for twenty minutes.", zh: "我们等了二十分钟。" }
    ],
    q: [
      { q: "I have known her ___ five years.", o: ["since", "for", "at"], a: 1, why: "five years 是时间段，用 for。" },
      { q: "She has lived here ___ she was five.", o: ["for", "since", "from"], a: 1, why: "she was five 是过去时间点，用 since。" }
    ]
  },
  {
    id: "prep7", ch: 7, t: "常见介词固定搭配", tip: "介词拍档成双对",
    body: "介词常和动词、形容词组成固定拍档：look at 看、listen to 听、wait for 等待、be good at 擅长、be afraid of 害怕、be late for 迟到、be interested in 对……感兴趣。这些搭配像固定朋友组合，不能随便换人！",
    say: "动词介词手拉手，固定搭配不撒手。",
    ex: [
      { en: "Look at the blackboard, please.", zh: "请看黑板。" },
      { en: "She is good at swimming.", zh: "她擅长游泳。" },
      { en: "Don't be late for class.", zh: "上课别迟到。" }
    ],
    q: [
      { q: "Tom is good ___ football.", o: ["in", "at", "on"], a: 1, why: "固定搭配 be good at。" },
      { q: "We are listening ___ the teacher.", o: ["at", "for", "to"], a: 2, why: "listen to 是固定搭配。" }
    ]
  },
  {
    id: "prep8", ch: 7, t: "in / on / to 表方位", tip: "在境内 in，接壤 on，分家 to",
    body: "表示一个地方在另一个地方的位置：in 表示「在范围内」（Guangzhou is in the south of China.）；on 表示「接壤相邻」（Hunan is on the north of Guangdong.）；to 表示「隔开不相邻」（Japan is to the east of China.）。",
    say: "包在里 in，挨着 on，隔海相望用 to。",
    ex: [
      { en: "Taipei is in the south of the island.", zh: "台北在这座岛的南部。" },
      { en: "Canada is on the north of the USA.", zh: "加拿大在美国北面（接壤）。" },
      { en: "The park is to the west of our school.", zh: "公园在我们学校西边（不相邻）。" }
    ],
    q: [
      { q: "Harbin is ___ the north of China.（在中国境内）", o: ["on", "to", "in"], a: 2, why: "在国土范围内用 in。" },
      { q: "Hainan is ___ the south of Guangdong.（隔海相望）", o: ["to", "in", "on"], a: 0, why: "不相邻、隔开的方位用 to。" }
    ]
  },
  {
    id: "prep9", ch: 7, t: "介词短语大闯关", tip: "迷宫出口在此",
    body: "复习迷宫地图：时间 at 点 on 天 in 段；地点 in 里 on 面 at 点；方位上下前后 between 夹；by 交通 on foot；for 段 since 点；固定搭配别改拍。",
    say: "介词虽小路标多，跟着口诀不迷路。",
    ex: [
      { en: "We will meet at 3:00 on Friday in the library.", zh: "我们周五三点在图书馆见面。" },
      { en: "The mouse is afraid of the cat.", zh: "老鼠怕猫。" },
      { en: "They arrived in Beijing at noon.", zh: "他们中午到了北京。" }
    ],
    q: [
      { q: "I was born ___ March, 2015.", o: ["at", "on", "in"], a: 2, why: "月份是较长的时间段，用 in。" },
      { q: "Please wait ___ me ___ the bus stop.", o: ["for, at", "at, for", "to, at"], a: 0, why: "wait for 等待 + at the bus stop 在公交站。" }
    ]
  },
  {
    id: "prep10", ch: 7, t: "across / through / along", tip: "横穿、穿膛、沿路走",
    body: "across 表示「横穿」表面（从一边到另一边）：walk across the street 过马路、swim across the river 游过河。through 表示「从内部穿过」：through the tunnel 穿过隧道、through the forest 穿过森林。along 表示「沿着」：walk along the road 沿着路走。",
    say: "across 横着穿，through 膛里过，along 沿着边。",
    ex: [
      { en: "Don't run across the street. Use the zebra crossing.", zh: "别跑着横穿马路，要走斑马线。" },
      { en: "The train goes through a long tunnel.", zh: "火车穿过一条长长的隧道。" },
      { en: "We took a walk along the river.", zh: "我们沿着河边散步。" }
    ],
    q: [
      { q: "The light comes ___ the window.", o: ["across", "through", "along"], a: 1, why: "光从窗户「内部空间」穿过，用 through。" },
      { q: "Be careful when you go ___ the road.", o: ["across", "through", "along"], a: 0, why: "横穿马路（表面从一边到另一边）用 across。" }
    ]
  },

  /* ============ 第八章 连词大桥（6 例） ============ */
  {
    id: "conj1", ch: 8, t: "and / but / or", tip: "并列、转折、选择三兄弟",
    body: "and 表示并列「和、并且」（I like apples and bananas.）；but 表示转折「但是」（He is small but strong.）；or 表示选择「或者」（Is it red or blue?）也表「否则」（Hurry up, or you'll be late.）。它们是句子之间的胶水。",
    say: "and 并排，but 转弯，or 来挑一个。",
    ex: [
      { en: "I have a cat and a dog.", zh: "我有一只猫和一只狗。" },
      { en: "The box is small but heavy.", zh: "盒子小但是重。" },
      { en: "Do you like tea or coffee?", zh: "你喜欢茶还是咖啡？" }
    ],
    q: [
      { q: "He worked hard, ___ he didn't pass the test.", o: ["and", "but", "or"], a: 1, why: "前后意思转折（努力却没过）用 but。" },
      { q: "Hurry up, ___ we will miss the bus.", o: ["and", "but", "or"], a: 2, why: "「否则」用 or：再不快点就赶不上了。" }
    ]
  },
  {
    id: "conj2", ch: 8, t: "so 和 because", tip: "因为所以科学道理",
    body: "because 表示原因「因为」，so 表示结果「所以」。英语一个句子里 because 和 so 只能二选一，不能成对出现（这是和汉语最大的不同！）：I stayed at home because it rained. = It rained, so I stayed at home.",
    say: "because 因，so 果；同框出没要扣分。",
    ex: [
      { en: "I like summer because I can swim.", zh: "我喜欢夏天，因为能游泳。" },
      { en: "It was late, so we went home.", zh: "天晚了，所以我们回家了。" },
      { en: "She is happy because she won the game.", zh: "她很开心，因为她赢了比赛。" }
    ],
    q: [
      { q: "下面哪个句子是对的？", o: ["Because he was tired, so he slept.", "He was tired, so he slept.", "Because he was tired, he slept, so."], a: 1, why: "because 和 so 不能同时用在一个句子里！" },
      { q: "I wear a coat ___ it is cold.", o: ["so", "because", "but"], a: 1, why: "后面解释「冷」的原因，用 because。" }
    ]
  },
  {
    id: "conj3", ch: 8, t: "both ... and / either ... or / neither ... nor", tip: "都、任一、都不三连招",
    body: "both ... and 表示「两者都」：Both Tom and Jerry like cheese.；either ... or「要么……要么」（二选一）：Either you or I wash the dishes.；neither ... nor「既不……也不」：Neither dad nor mom was at home. 注意：neither ... nor 连接主语时，动词就近原则！",
    say: "both 都，either 选，neither 双否全不要。",
    ex: [
      { en: "Both spring and autumn are cool here.", zh: "这里的春天和秋天都凉爽。" },
      { en: "You can take either the bus or the subway.", zh: "你可以坐公交或者地铁。" },
      { en: "Neither he nor I am wrong.", zh: "他和我都没错。（动词就近）" }
    ],
    q: [
      { q: "___ Lily ___ Lucy can come. They are both busy.（都不）", o: ["Both, and", "Neither, nor", "Either, or"], a: 1, why: "两人都来不了用 Neither ... nor。" },
      { q: "Neither the boys nor the girl ___ ready.", o: ["are", "is", "be"], a: 1, why: "就近原则：靠近动词的是 the girl（单数），用 is。" }
    ]
  },
  {
    id: "conj4", ch: 8, t: "时间连词 when / before / after", tip: "时间三站点",
    body: "when 当……时候（When I got home, Mom was cooking.）；before 在……之前（Wash hands before dinner.）；after 在……之后（After school, I do my homework.）。它们把两件事按时间顺序排好队。",
    say: "when 同刻，before 先，after 后。",
    ex: [
      { en: "When it rains, we stay indoors.", zh: "下雨时，我们待在室内。" },
      { en: "Brush your teeth before you go to bed.", zh: "睡觉前刷牙。" },
      { en: "After he finished lunch, he read a book.", zh: "他吃完午饭后看书。" }
    ],
    q: [
      { q: "___ you cross the road, look left and right.", o: ["Before", "After", "Because"], a: 0, why: "过马路「之前」先看左右，用 Before。" },
      { q: "I will call you ___ I arrive.", o: ["when", "before", "what"], a: 0, why: "「到达的时候」用 when。" }
    ]
  },
  {
    id: "conj5", ch: 8, t: "if 条件句初体验", tip: "如果……就……",
    body: "if 表示「如果」引出条件：If it rains tomorrow, we will stay at home.（如果明天下雨，我们就待在家里。）小心「主将从现」：主句用将来时 will，if 从句用一般现在时——这是小学最重要的连词规则之一！",
    say: "if 条件主将从现，主句 will 从句一般现在。",
    ex: [
      { en: "If you heat ice, it melts.", zh: "如果加热冰，它会化。" },
      { en: "If it is sunny tomorrow, we will have a picnic.", zh: "如果明天晴天，我们去野餐。" },
      { en: "You will be late if you don't hurry.", zh: "如果你不快点就会迟到。" }
    ],
    q: [
      { q: "If it ___ tomorrow, we will cancel the trip.", o: ["will rain", "rains", "rained"], a: 1, why: "主将从现：if 从句用一般现在时 rains。" },
      { q: "You will feel better ___ you take the medicine.", o: ["if", "so", "because"], a: 0, why: "表示条件「如果」用 if。" }
    ]
  },
  {
    id: "conj6", ch: 8, t: "连词综合闯关", tip: "大桥竣工检验",
    body: "连词大桥通车检查：and 并列、but 转折、or 选择或「否则」；because 因、so 果（不同框）；both/either/neither 三连招（就近原则）；when/before/after 排时间；if 主将从现。",
    say: "连词是桥词是车，逻辑通了句子活。",
    ex: [
      { en: "I was hungry, so I made a sandwich.", zh: "我饿了，所以做了个三明治。" },
      { en: "Both coffee and tea are popular here.", zh: "这里咖啡和茶都流行。" },
      { en: "When the light turns green, we can cross.", zh: "绿灯亮时我们就能过马路。" }
    ],
    q: [
      { q: "The movie is long ___ very interesting.", o: ["and", "but", "or"], a: 1, why: "「长」和「有趣」意思转折，用 but。" },
      { q: "If he ___ hard, he will win.", o: ["will study", "studies", "studying"], a: 1, why: "主将从现：if 从句用一般现在时 studies。" }
    ]
  },

  /* ============ 第九章 动词城 · 一般现在时（12 例） ============ */
  {
    id: "v1", ch: 9, t: "be 动词三兄弟 am / is / are", tip: "我 am 你 are，is 跟着他她它",
    body: "be 动词是「是」的意思，有三个兄弟：I 后面跟 am；you、we、they 后面跟 are；he、she、it 和单数名词后面跟 is。它们像三个门卫，主语是谁就派谁上岗。",
    say: "我用 am，你用 are，is 跟着他她它；单数 is 复数 are。",
    ex: [
      { en: "I am a pupil.", zh: "我是一名小学生。" },
      { en: "She is my English teacher.", zh: "她是我的英语老师。" },
      { en: "We are good friends.", zh: "我们是好朋友。" }
    ],
    q: [
      { q: "The apples ___ red.", o: ["is", "are", "am"], a: 1, why: "apples 是复数，用 are。" },
      { q: "Tom and I ___ in the same class.", o: ["am", "is", "are"], a: 2, why: "Tom 和 I 是两个人，用 are。" }
    ]
  },
  {
    id: "v2", ch: 9, t: "be 动词的否定与疑问", tip: "not 藏身后，be 动词跳到句首",
    body: "be 动词否定：在后面加 not（I am not late. / They aren't happy.）。变一般疑问句：把 be 动词提到句首（Are you ready? / Is he your brother?），回答也用 be：Yes, I am. / No, he isn't.",
    say: "否定 not 跟在 be 后；疑问 be 动词冲句首。",
    ex: [
      { en: "I am not a doctor.", zh: "我不是医生。" },
      { en: "—Are you ten? —Yes, I am.", zh: "——你十岁吗？——是的。" },
      { en: "—Is the cat black? —No, it isn't.", zh: "——这只猫是黑色的吗？——不，不是。" }
    ],
    q: [
      { q: "—Is she your sister? —___", o: ["Yes, she is.", "Yes, she are.", "Yes, is she."], a: 0, why: "用 be 动词回答：Yes, she is." },
      { q: "They ___ from America.（否定）", o: ["aren't", "isn't", "am not"], a: 0, why: "they 配 are，否定 aren't。" }
    ]
  },
  {
    id: "v3", ch: 9, t: "实义动词与一般现在时", tip: "平时常做的事，就用一般现在时",
    body: "表示经常做的、习惯性的事，用一般现在时：I get up at seven. We have lunch at school. 主语是 I / you / we / they 或复数时，动词用原形；表示普遍事实也用它：The sun rises in the east.",
    say: "习惯动作和真理，一般现在时来处理。",
    ex: [
      { en: "I go to school by bus.", zh: "我坐公交上学。" },
      { en: "They play games after class.", zh: "他们课后玩游戏。" },
      { en: "Fish live in water.", zh: "鱼生活在水里。" }
    ],
    q: [
      { q: "We ___ English every day.", o: ["study", "studies", "studying"], a: 0, why: "We 是复数，动词用原形 study。" },
      { q: "「地球绕着太阳转」是？", o: ["The earth went around the sun.", "The earth goes around the sun.", "The earth go around the sun."], a: 1, why: "客观事实用一般现在时；earth 单数，动词加 es：goes。" }
    ]
  },
  {
    id: "v4", ch: 9, t: "三单变化规则", tip: "他她它，动词加 s / es",
    body: "主语是第三人称单数（he、she、it、Tom、my mother 等）时，一般现在时的动词要加 s 或 es，这叫「三单」：He likes music. She watches TV. 一般加 s；s/x/ch/sh/o 结尾加 es（watches, goes, does）；辅音+y 变 i 加 es（studies, flies）；have 变 has。",
    say: "三单动词穿新衣，一般 s，特判 es；study 变 studies，have 变 has。",
    ex: [
      { en: "He plays football every Sunday.", zh: "他每周日踢足球。" },
      { en: "My mother goes shopping on Friday.", zh: "我妈妈周五去购物。" },
      { en: "The bird flies in the sky.", zh: "鸟在空中飞。" }
    ],
    q: [
      { q: "She ___ to school at 7:30.", o: ["go", "gos", "goes"], a: 2, why: "go 以 o 结尾，三单加 es：goes。" },
      { q: "Tom ___ his homework every evening.", o: ["do", "does", "doing"], a: 1, why: "Tom 是三单，do 变 does。" }
    ]
  },
  {
    id: "v5", ch: 9, t: "have / has", tip: "你我有 have，他她它有 has",
    body: "have 表示「拥有」：I / you / we / they 用 have，he / she / it 用 has。第三人称单数否定用 doesn't have（不是 doesn't has！），疑问用 Does ... have?",
    say: "我你我们 have，三单 has；doesn't 后面 have 原形回来。",
    ex: [
      { en: "I have two big eyes.", zh: "我有两只大眼睛。" },
      { en: "The robot has three arms.", zh: "机器人有三条手臂。" },
      { en: "She doesn't have a sister.", zh: "她没有姐妹。" }
    ],
    q: [
      { q: "My father ___ a new car.", o: ["have", "has", "haves"], a: 1, why: "my father 是三单，用 has。" },
      { q: "—Does Tom ___ a basketball? —Yes, he does.", o: ["has", "have", "haves"], a: 1, why: "Does 后面动词用原形 have。" }
    ]
  },
  {
    id: "v6", ch: 9, t: "do / does 疑问句与否定句", tip: "小助手 do / does 来帮忙",
    body: "实义动词变疑问或否定，要请助动词 do / does 出场：Do you like pears? I don't like pears. 主语三单用 does / doesn't，且后面的动词要「脱掉 s」恢复原形：Does he like pears? / He doesn't like pears.",
    say: "疑问否定 do 出场；一旦 does 出现，动词 s 就脱光。",
    ex: [
      { en: "—Do they live in Beijing? —No, they don't.", zh: "——他们住在北京吗？——不，不住。" },
      { en: "Does your brother like sports?", zh: "你哥哥喜欢运动吗？" },
      { en: "He doesn't eat breakfast at home.", zh: "他不在家吃早餐。" }
    ],
    q: [
      { q: "___ she speak English?", o: ["Do", "Does", "Is"], a: 1, why: "she 是三单，疑问用 Does。" },
      { q: "He ___ like winter.", o: ["don't", "doesn't", "isn't"], a: 1, why: "三单否定用 doesn't。" }
    ]
  },
  {
    id: "v7", ch: 9, t: "there be 句型", tip: "「有」某物，先报人数再点名",
    body: "表示「某地有某物」用 there be：There is + 单数 / 不可数，There are + 复数。be 动词跟「紧挨着它的名词」保持一致（就近原则）：There is a book and two pens on the desk.（a book 离得近，用 is）",
    say: "there be 表存在，is 单数 are 复数；靠近谁就听谁的。",
    ex: [
      { en: "There is a park near my home.", zh: "我家附近有一个公园。" },
      { en: "There are many stars in the sky.", zh: "天上有许多星星。" },
      { en: "There is some milk in the glass.", zh: "杯子里有一些牛奶。" }
    ],
    q: [
      { q: "There ___ two books and a pen in the bag.", o: ["is", "are", "have"], a: 1, why: "紧挨着 be 的是 two books（复数），就近用 are。" },
      { q: "There ___ some water in the bottle.", o: ["is", "are", "has"], a: 0, why: "water 不可数，用 is。" }
    ]
  },
  {
    id: "v8", ch: 9, t: "there be 的疑问与否定", tip: "be 动词提前，not 问答话",
    body: "there be 疑问句把 be 提前：Is there a zoo here? Are there any apples?（some 在疑问句变 any）否定在 be 后加 not：There isn't a swimming pool. / There aren't any birds in the cage.",
    say: "be 提句首问存在；some 疑问句里换 any。",
    ex: [
      { en: "—Is there a hospital near here? —Yes, there is.", zh: "——这附近有医院吗？——有。" },
      { en: "Are there any monkeys in the zoo?", zh: "动物园里有猴子吗？" },
      { en: "There aren't any clouds today.", zh: "今天没有云。" }
    ],
    q: [
      { q: "___ there any milk in the fridge?", o: ["Is", "Are", "Has"], a: 0, why: "milk 不可数，用 Is there。" },
      { q: "There aren't ___ apples left.", o: ["some", "any", "many of"], a: 1, why: "否定句用 any。" }
    ]
  },
  {
    id: "v9", ch: 9, t: "can 情态动词", tip: "can 是「超能力开关」",
    body: "can 表示「会、能」，后面永远接动词原形，没有人称变化：I can swim. She can dance. 否定 can't（cannot）：He can't fly. 疑问把 can 提前：Can you ride a bike? 回答：Yes, I can. / No, I can't.",
    say: "can 后动词原形站，谁来了也不变脸。",
    ex: [
      { en: "Birds can fly high.", zh: "鸟能飞得很高。" },
      { en: "I can play the guitar.", zh: "我会弹吉他。" },
      { en: "—Can she swim? —No, she can't.", zh: "——她会游泳吗？——不会。" }
    ],
    q: [
      { q: "My sister ___ cook noodles.", o: ["can to", "can", "cans"], a: 1, why: "can 后接动词原形，没有 cans 这种形式。" },
      { q: "—___ you help me? —Sure!", o: ["Can", "Do can", "Are"], a: 0, why: "can 提到句首构成疑问。" }
    ]
  },
  {
    id: "v10", ch: 9, t: "must / should 小警官", tip: "必须做和应该做",
    body: "must 表示「必须」（规则要求）：You must wear a helmet.（必须戴头盔。）should 表示「应该」（建议）：You should drink more water. 它们和 can 一样，后面接动词原形。否定：mustn't 表示「禁止」，shouldn't 表示「不应该」。",
    say: "must 硬规定，should 好建议；后面都站原形。",
    ex: [
      { en: "We must stop at a red light.", zh: "红灯必须停。" },
      { en: "You should go to bed early.", zh: "你应该早点睡觉。" },
      { en: "You mustn't play with fire.", zh: "你绝不能玩火。" }
    ],
    q: [
      { q: "Students ___ keep quiet in the library.", o: ["must to", "must", "musts"], a: 1, why: "must 后接动词原形 keep。" },
      { q: "「禁止游泳！」是？", o: ["You mustn't swim.", "You shouldn't swim.", "You can't to swim."], a: 0, why: "「禁止」语气最强，用 mustn't。" }
    ]
  },
  {
    id: "v11", ch: 9, t: "like doing 和 want to do", tip: "like 后加 ing，want 后接 to",
    body: "喜欢做某事：like + 动词 ing（I like reading.）也常说 like to read，都对。想要做某事：want to + 动词原形（I want to fly a kite.）记住公式：like doing 表爱好，want to do 表愿望。",
    say: "like 加 ing，want 加 to，后面动词各回各屋。",
    ex: [
      { en: "He likes playing basketball.", zh: "他喜欢打篮球。" },
      { en: "I want to visit the Great Wall.", zh: "我想去参观长城。" },
      { en: "Do you like drawing pictures?", zh: "你喜欢画画吗？" }
    ],
    q: [
      { q: "She likes ___ stories.", o: ["read", "reading", "to reading"], a: 1, why: "like 后接 ing：reading。" },
      { q: "They want ___ football this weekend.", o: ["play", "playing", "to play"], a: 2, why: "want to + 原形：want to play。" }
    ]
  },
  {
    id: "v12", ch: 9, t: "动词城总复习", tip: "王国大点兵",
    body: "动词城点兵：be 三兄弟 am/is/are；一般现在时讲习惯；三单动词加 s/es；do/does 帮疑问否定（does 后动词脱 s）；there be 表存在（就近原则）；can/must/should 后接原形；like doing、want to do。把城门守好！",
    say: "三单加 s 是铁律，does 出场原形回；can must 后面原形站。",
    ex: [
      { en: "My dad usually cooks dinner for us.", zh: "我爸爸通常为我们做晚餐。" },
      { en: "—Does she have a piano? —Yes, she does.", zh: "——她有钢琴吗？——有。" },
      { en: "You shouldn't watch TV too much.", zh: "你不应该看太多电视。" }
    ],
    q: [
      { q: "The earth ___ around the sun.", o: ["move", "moves", "moving"], a: 1, why: "earth 是三单，move 加 s：moves。" },
      { q: "—___ Mike often ___ his grandma? —Yes.", o: ["Does, visit", "Do, visits", "Does, visits"], a: 0, why: "三单疑问用 Does，后面动词用原形 visit。" }
    ]
  },

  /* ============ 第十章 进行时码头（6 例） ============ */
  {
    id: "ing1", ch: 10, t: "现在进行时的构成", tip: "be + ing 正在做",
    body: "表示「此刻正在做」，用 be (am/is/are) + 动词 ing：I am reading. She is singing. They are playing. be 像码头吊车，ing 像集装箱，缺一不可！",
    say: "正在做，be + ing；我是 am，他她它是 is，复数全是 are。",
    ex: [
      { en: "I am doing my homework now.", zh: "我现在正在做作业。" },
      { en: "Look! The bus is coming.", zh: "看！公交车来了。" },
      { en: "They are playing chess.", zh: "他们正在下棋。" }
    ],
    q: [
      { q: "He ___ watering the flowers.", o: ["am", "is", "are"], a: 1, why: "He 是三单，be 用 is。" },
      { q: "We ___ listening to music now.", o: ["is", "are", "am"], a: 1, why: "We 配 are。" }
    ]
  },
  {
    id: "ing2", ch: 10, t: "ing 的变化规则", tip: "直接加、去 e 加、双写加",
    body: "动词变 ing 三招：一般直接加（read→reading）；以不发音 e 结尾去 e 加（make→making, write→writing）；重读闭音节双写尾字母再加（run→running, swim→swimming, sit→sitting）。",
    say: "直加、去 e 加、双写加；run swim sit 都双写。",
    ex: [
      { en: "She is making a cake.", zh: "她正在做蛋糕。" },
      { en: "Look! He is running so fast.", zh: "看！他跑得真快。" },
      { en: "The kids are swimming in the pool.", zh: "孩子们正在泳池游泳。" }
    ],
    q: [
      { q: "write 的 ing 形式是？", o: ["writeing", "writing", "writting"], a: 1, why: "去 e 加 ing：writing。" },
      { q: "swim 的 ing 形式是？", o: ["swiming", "swimming", "swimmming"], a: 1, why: "重读闭音节双写 m：swimming。" }
    ]
  },
  {
    id: "ing3", ch: 10, t: "进行时的否定与疑问", tip: "not 加在 be 后，be 提前问一问",
    body: "现在进行时否定：be 后加 not（I'm not watching TV.）。疑问：be 提到句首（Are you listening? Is he sleeping?）回答还是用 be：Yes, I am. / No, he isn't.",
    say: "否定 not 跟 be 走，疑问 be 跳句首。",
    ex: [
      { en: "The baby isn't crying now.", zh: "宝宝现在不哭了。" },
      { en: "—Are they playing football? —Yes, they are.", zh: "——他们在踢足球吗？——是的。" },
      { en: "I am not feeling well today.", zh: "我今天不太舒服。" }
    ],
    q: [
      { q: "She ___ doing the dishes.（否定）", o: ["isn't", "aren't", "doesn't"], a: 0, why: "She 配 is，否定 isn't。" },
      { q: "—___ he cleaning the room? —No, he isn't.", o: ["Am", "Is", "Are"], a: 1, why: "he 配 Is，提到句首。" }
    ]
  },
  {
    id: "ing4", ch: 10, t: "now 标志词大搜索", tip: "now, look, listen 在哪里",
    body: "看到这些信号词，多半用现在进行时：now 现在、right now 此刻、look 看！、listen 听！、It's ... o'clock（正在描述此刻）。Look! The train is leaving.（信号词一出现，ing 马上就位）",
    say: "now / look / listen 一出现，be + ing 马上见。",
    ex: [
      { en: "Listen! Someone is singing.", zh: "听！有人在唱歌。" },
      { en: "The children are flying kites now.", zh: "孩子们现在正在放风筝。" },
      { en: "Look! The dog is jumping over the wall.", zh: "看！狗正在跳墙。" }
    ],
    q: [
      { q: "Look! The birds ___ in the sky.", o: ["fly", "are flying", "flew"], a: 1, why: "Look! 提示正在发生，用 are flying。" },
      { q: "Be quiet! The baby ___.", o: ["sleeps", "is sleeping", "sleeping"], a: 1, why: "此刻正在睡，用 is sleeping，注意别漏 be 动词！" }
    ]
  },
  {
    id: "ing5", ch: 10, t: "不爱进行时的动词", tip: "喜欢知道爱思考，天生不爱 ing",
    body: "表示喜欢、想法、感觉的动词一般不用进行时：like, love, want, know, think（认为）。说 I like it. 而不是 I am liking it. 它们像「心里的事」，一直是状态，不用加 ing。",
    say: "喜欢想要和知道，心里状态不 ing。",
    ex: [
      { en: "I like this song very much.", zh: "我非常喜欢这首歌。" },
      { en: "She knows the answer.", zh: "她知道答案。" },
      { en: "He wants a new bike.", zh: "他想要一辆新自行车。" }
    ],
    q: [
      { q: "哪个句子正确？", o: ["I am knowing him.", "I know him.", "I am know him."], a: 1, why: "know 表示状态，不用进行时。" },
      { q: "She ___ music.（喜欢）", o: ["is liking", "likes", "likeing"], a: 1, why: "like 表状态用一般现在时 likes。" }
    ]
  },
  {
    id: "ing6", ch: 10, t: "进行时综合闯关", tip: "码头出航总检查",
    body: "码头总结：be + ing 三步走（选 be、变 ing、组句子）；ing 变化三招（直加、去 e、双写）；now / look / listen 是信号灯；like / want / know 这类状态动词不 ing。",
    say: "be 是龙骨 ing 是帆，now 一喊就出航。",
    ex: [
      { en: "My mom is cooking in the kitchen now.", zh: "我妈妈现在正在厨房做饭。" },
      { en: "—What are you doing? —I'm drawing a robot.", zh: "——你在干什么？——我在画机器人。" },
      { en: "Look! It's raining outside.", zh: "看！外面在下雨。" }
    ],
    q: [
      { q: "—What is Tom doing? —He ___ a model plane.", o: ["makes", "is making", "makeing"], a: 1, why: "问正在做什么，回答用进行时 is making。" },
      { q: "sit 的 ing 形式是？", o: ["siting", "sitting", "situation"], a: 1, why: "重读闭音节双写 t：sitting。" }
    ]
  },

  /* ============ 第十一章 时光列车（8 例） ============ */
  {
    id: "t1", ch: 11, t: "was 和 were", tip: "am/is 的昨天是 was",
    body: "说「昨天/过去是……」，be 动词要变身：am / is 变 was，are 变 were。I was at home yesterday. They were happy last night. 否定 wasn't / weren't，疑问 was/were 提前。",
    say: "am is 变 was，are 变 were；昨天过去要变身。",
    ex: [
      { en: "I was late this morning.", zh: "今天早上我迟到了。" },
      { en: "We were at the beach last Sunday.", zh: "上周日我们在海边。" },
      { en: "—Was it sunny yesterday? —Yes, it was.", zh: "——昨天晴天吗？——是的。" }
    ],
    q: [
      { q: "They ___ at school yesterday.", o: ["was", "were", "are"], a: 1, why: "they 过去用 were。" },
      { q: "She ___ at the library just now.", o: ["were", "was", "is"], a: 1, why: "she 过去用 was；just now 意思是「刚才」。" }
    ]
  },
  {
    id: "t2", ch: 11, t: "规则动词过去式", tip: "加 ed 坐上时光列车",
    body: "一般过去时表示「过去发生的事」，规则动词加 ed：play→played, watch→watched, clean→cleaned。小变化：以 e 结尾加 d（like→liked）；辅音+y 变 i 加 ed（study→studied）；重读闭音节双写加 ed（stop→stopped）。",
    say: "过去的事 ed 记，直加、去 e、双写、变 i。",
    ex: [
      { en: "I watched TV last night.", zh: "昨晚我看了电视。" },
      { en: "We played games after dinner.", zh: "晚饭后我们玩了游戏。" },
      { en: "She studied hard last term.", zh: "上学期她学习很努力。" }
    ],
    q: [
      { q: "visit 的过去式是？", o: ["visitd", "visited", "visitted"], a: 1, why: "直接加 ed：visited。" },
      { q: "stop 的过去式是？", o: ["stoped", "stopped", "stoppt"], a: 1, why: "重读闭音节双写 p：stopped。" }
    ]
  },
  {
    id: "t3", ch: 11, t: "不规则动词过去式", tip: "变身怪杰再集合",
    body: "很多常用动词的过去式不规则，要单独记：go→went，do→did，have→had，eat→ate，see→saw，buy→bought，take→took，come→came，get→got，is/are→was/were。它们像变身怪杰，见一个记一个！",
    say: "go went do did have had，eat ate see saw 全靠背。",
    ex: [
      { en: "I went to the zoo last weekend.", zh: "上周末我去了动物园。" },
      { en: "We had a great time at the party.", zh: "我们在派对上玩得很开心。" },
      { en: "He ate two hamburgers just now.", zh: "他刚才吃了两个汉堡。" }
    ],
    q: [
      { q: "see 的过去式是？", o: ["seed", "saw", "seen"], a: 1, why: "see 变 saw。" },
      { q: "Yesterday he ___ a gift for mom.（buy）", o: ["buyed", "bought", "buys"], a: 1, why: "buy 变 bought。" }
    ]
  },
  {
    id: "t4", ch: 11, t: "过去时的否定与疑问", tip: "didn't 一站式服务",
    body: "实义动词过去时否定：didn't + 原形（I didn't go. 不是 didn't went！）。疑问：Did + 主语 + 动词原形？Did you watch the game? 回答：Yes, I did. / No, I didn't. 只要是 did 出场，动词一律还原！",
    say: "did 出场，动词还原；didn't 后面也是原形。",
    ex: [
      { en: "I didn't sleep well last night.", zh: "昨晚我没睡好。" },
      { en: "—Did you do your homework? —Yes, I did.", zh: "——你做作业了吗？——做了。" },
      { en: "He didn't come to school yesterday.", zh: "他昨天没来上学。" }
    ],
    q: [
      { q: "She ___ to the party last night.（没去）", o: ["didn't went", "didn't go", "not went"], a: 1, why: "didn't 后面接动词原形 go。" },
      { q: "—___ he finish his lunch? —No, he didn't.", o: ["Did", "Was", "Does"], a: 0, why: "过去时疑问用 Did，动词原形 finish。" }
    ]
  },
  {
    id: "t5", ch: 11, t: "be going to 打算", tip: "计划好的将来用 going to",
    body: "表示「打算、计划」做某事，用 be going to + 动词原形：I am going to visit my grandma this weekend.（这周末我打算去看奶奶。）它像已经买好票的行程，马上要发生或计划好的事都用它。",
    say: "打算计划 going to，be 动词跟着主语走。",
    ex: [
      { en: "We are going to have a picnic tomorrow.", zh: "我们明天打算去野餐。" },
      { en: "She is going to learn swimming this summer.", zh: "今年夏天她打算学游泳。" },
      { en: "It is going to rain. Take an umbrella!", zh: "要下雨了，带把伞！" }
    ],
    q: [
      { q: "I ___ going to clean my room.", o: ["is", "am", "are"], a: 1, why: "I 配 am going to。" },
      { q: "They are going to ___ a film tonight.（看）", o: ["watch", "watching", "watched"], a: 0, why: "be going to 后接动词原形 watch。" }
    ]
  },
  {
    id: "t6", ch: 11, t: "will 将来时", tip: "will 一出，谁都会变将来",
    body: "will + 动词原形表示将来：Everyone will have a robot. will 无人称变化，人人平等。否定 will not = won't；疑问 Will you ...? 回答 Yes, I will. / No, I won't. will 也可表承诺：I will help you.",
    say: "will 后面原形站，主语变了它不变。",
    ex: [
      { en: "I will be ten next year.", zh: "明年我就十岁了。" },
      { en: "Robots won't replace teachers.", zh: "机器人不会取代老师。" },
      { en: "—Will it snow tomorrow? —I hope so!", zh: "——明天会下雪吗？——希望会！" }
    ],
    q: [
      { q: "She ___ come to the party.（不来）", o: ["wills", "won't", "doesn't"], a: 1, why: "will 的否定是 won't。" },
      { q: "___ they win the game?", o: ["Will", "Are", "Did"], a: 0, why: "将来时疑问把 Will 提前。" }
    ]
  },
  {
    id: "t7", ch: 11, t: "时间标志词侦探", tip: "yesterday 队和 tomorrow 队",
    body: "标志词是时光侦探：yesterday、last night/week/month/year、... ago → 过去时；tomorrow、next week/month/year、soon、in the future → 将来时；every day、often、usually → 一般现在时。先找标志词，再选时态！",
    say: "last ago 是过去，next soon 是将来，every often 现在时。",
    ex: [
      { en: "I visited my uncle three days ago.", zh: "三天前我看望了叔叔。" },
      { en: "She will start school next September.", zh: "明年九月她将开始上学。" },
      { en: "He reads stories every night.", zh: "他每天晚上读故事。" }
    ],
    q: [
      { q: "We ___ to Beijing two years ago.", o: ["go", "went", "will go"], a: 1, why: "two years ago 是过去标志，用 went。" },
      { q: "Look at the clouds! It ___ rain soon.", o: ["will", "did", "rains"], a: 0, why: "soon 是将来标志，用 will rain。" }
    ]
  },
  {
    id: "t8", ch: 11, t: "时光列车终点站", tip: "过去将来一车通",
    body: "列车大总结：过去时讲已发生（was/were、加 ed、不规则单独记、didn't/did 后原形）；将来时讲要发生（be going to 计划、will 随口说）；标志词是车票，上车前先看票！",
    say: "过去 ed，将来 will；车票（标志词）拿好再上车。",
    ex: [
      { en: "Last year I was in Grade 3. Next year I will be in Grade 5.", zh: "去年我上三年级，明年我将上五年级。" },
      { en: "She didn't watch the film, but she will watch it tonight.", zh: "她没看过这部电影，但今晚她会看。" },
      { en: "We are going to plant trees next spring.", zh: "明年春天我们打算去植树。" }
    ],
    q: [
      { q: "There ___ a football match next Friday.", o: ["was", "is going to be", "had"], a: 1, why: "next Friday 将来，there be 的将来用 is going to be。" },
      { q: "My grandpa ___ me a story yesterday evening.", o: ["tells", "told", "will tell"], a: 1, why: "yesterday evening 过去，tell 变 told。" }
    ]
  },

  /* ============ 第十二章 句型城堡（6 例） ============ */
  {
    id: "s1", ch: 12, t: "陈述句语序", tip: "主语打头，动词跟上",
    body: "英语句子的基本队形：主语 + 谓语 + 其他（S + V + O）：I love music. She is reading a book. 和汉语差不多，但英语特别讲究「队形」，主语一般在动词前面，不能乱插队。",
    say: "主语带头动跟上，其余队员排后面。",
    ex: [
      { en: "My sister sings English songs.", zh: "我妹妹会唱英文歌。" },
      { en: "The boys are playing basketball.", zh: "男孩们在打篮球。" },
      { en: "I have a new schoolbag.", zh: "我有一个新书包。" }
    ],
    q: [
      { q: "正确的语序是？", o: ["Loves she music.", "She loves music.", "Music loves she."], a: 1, why: "主语 She 打头，动词 loves 跟上。" },
      { q: "The dog ___ the cat is chasing 哪个语序对？", o: ["原句", "The cat is chasing the dog.", "Is chasing the cat the dog."], a: 1, why: "主语 the cat + is chasing + 宾语 the dog，队形不能乱。" }
    ]
  },
  {
    id: "s2", ch: 12, t: "一般疑问句变身术", tip: "be / 情态提前，没有就请 do",
    body: "变一般疑问句三步：句中有 be 动词或情态动词（can, must），提到句首（She is a nurse. → Is she a nurse?）；没有就请 do/does/did 帮忙（He likes it. → Does he like it?）；动词记得还原！",
    say: "be 情态提句首，没有就请 do 帮手；does did 后面原形守。",
    ex: [
      { en: "—Is there a park nearby? —Yes, there is.", zh: "——附近有公园吗？——有。" },
      { en: "—Can you pass me the salt? —Sure.", zh: "——能把盐递给我吗？——当然。" },
      { en: "—Do you get up early? —No, I don't.", zh: "——你起得早吗？——不早。" }
    ],
    q: [
      { q: "变疑问：She can dance. → ___", o: ["She can dance?", "Can she dance?", "Does she can dance?"], a: 1, why: "有 can，直接提前：Can she dance?" },
      { q: "变疑问：Tom plays the drums. → ___", o: ["Does Tom plays the drums?", "Do Tom play the drums?", "Does Tom play the drums?"], a: 2, why: "用 Does，后面的动词要还原成原形 play。" }
    ]
  },
  {
    id: "s3", ch: 12, t: "特殊疑问句全家桶", tip: "疑问词打头阵",
    body: "特殊疑问句 = 疑问词 + 一般疑问句语序：What（什么）、Where（哪里）、When（何时）、Who（谁）、Why（为何）、How（怎样）、Whose（谁的）、How many/much（多少）。答句要给具体信息，不能只答 yes/no。",
    say: "what where when who why how，疑问词打头往后排队形。",
    ex: [
      { en: "Where is my cap? —It's on the sofa.", zh: "——我的帽子在哪？——在沙发上。" },
      { en: "When do you have dinner? —At six.", zh: "——你什么时候吃晚饭？——六点。" },
      { en: "How does he go to work? —By subway.", zh: "——他怎么去上班？——坐地铁。" }
    ],
    q: [
      { q: "—___ is your birthday? —In May.", o: ["What", "When", "Where"], a: 1, why: "问时间用 When。" },
      { q: "—___ book is this? —It's Kate's.", o: ["Who", "Whose", "Which"], a: 1, why: "问「谁的」用 Whose。" }
    ]
  },
  {
    id: "s4", ch: 12, t: "祈使句", tip: "动词打头，命令或请求",
    body: "祈使句表示命令、请求、建议，动词原形打头，通常不说主语：Stand up! Please close the door. 否定加 Don't：Don't run in the hallways. 礼貌一点，前面加 please。",
    say: "原形动词来带队，please 一加更礼貌；否定 Don't 来站岗。",
    ex: [
      { en: "Open the window, please.", zh: "请开窗。" },
      { en: "Don't be late for school.", zh: "上学别迟到。" },
      { en: "Let's play together!", zh: "我们一起玩吧！" }
    ],
    q: [
      { q: "「别在教室里吃东西」是？", o: ["Not eat in the classroom.", "Don't eat in the classroom.", "No eat in the classroom."], a: 1, why: "祈使句否定用 Don't + 原形。" },
      { q: "下面哪个是祈使句？", o: ["She opens the door.", "Opens the door.", "Open the door, please."], a: 2, why: "祈使句用动词原形打头，可加 please。" }
    ]
  },
  {
    id: "s5", ch: 12, t: "感叹句 What / How", tip: "What + 名词，How + 形容/副词",
    body: "感叹句两兄弟：What + (a/an) + 形容词 + 名词（What a big watermelon! 好大的西瓜！）；How + 形容词/副词（How beautiful! 真美！）判断技巧：后面马上有名词用 What，没有名词用 How。",
    say: "有名词用 What，光秃秃用 How。",
    ex: [
      { en: "What a lovely baby!", zh: "多可爱的宝宝啊！" },
      { en: "How fast the train is!", zh: "火车跑得真快！" },
      { en: "What beautiful flowers!", zh: "多么漂亮的花啊！（复数不加 a）" }
    ],
    q: [
      { q: "___ clever the boy is!", o: ["What", "How", "What a"], a: 1, why: "后面直接是形容词 clever，没有名词，用 How。" },
      { q: "___ an interesting story!", o: ["What", "How", "How an"], a: 0, why: "后面有名词 story 且单数可数，用 What an。" }
    ]
  },
  {
    id: "s6", ch: 12, t: "there be 与 have 的区别", tip: "存在用 there be，拥有用 have",
    body: "there be 说「某地存在某物」（客观摆在那儿）：There is a bird in the tree. have/has 说「某人拥有」（归属谁）：I have a bird. 记住：句子里有「地点」多半用 there be；说「谁的东西」用 have。",
    say: "地方有东西 there be，人拥有东西用 have。",
    ex: [
      { en: "There are four seasons in a year.", zh: "一年有四个季节。" },
      { en: "My cousin has a telescope.", zh: "我表哥有一个望远镜。" },
      { en: "There is a big tree in front of our school.", zh: "我们学校前面有一棵大树。" }
    ],
    q: [
      { q: "___ some juice in the cup.", o: ["There is", "There are", "Have"], a: 0, why: "杯子「里」有果汁，存在用 There is（juice 不可数）。" },
      { q: "We ___ a new teacher this term.", o: ["there are", "have", "there is"], a: 1, why: "「我们有老师」表示拥有，用 have。" }
    ]
  }
  ]
};