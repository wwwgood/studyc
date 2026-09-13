/* ---------------- 英语语法例句增强库 english-grammar-exboost.js ----------------
 * 按 lesson id 提供额外教学例句，渲染时与原 ex 数组合并。
 * 每句遵循"例子先行+说明跟进"：英文例句 + 中文翻译 + （括号内点破语法教学点）。
 * 例句覆盖该课核心教学点，供跟读与对照学习。
 */
var EQ_EXBOOST = {
  /* ===== 第三章 代词森林 ===== */
  pz: [
    { en: "I like apples. They are sweet.", zh: "我喜欢苹果，它们很甜。（They 代替 apples，避免重复）" },
    { en: "This is my book. That is your book.", zh: "这是我的书，那是你的书。（this/that 是指示代词）" },
    { en: "The cat can wash itself.", zh: "猫会自己洗脸。（itself 是反身代词，照镜子）" },
    { en: "What is your name?", zh: "你叫什么名字？（what 是疑问代词，用来提问）" },
    { en: "Somebody is knocking at the door.", zh: "有人在敲门。（somebody 是不定代词，不知道是谁）" },
    { en: "My bag is red. Yours is blue.", zh: "我的包是红的，你的包是蓝的。（mine/yours 是物主代词，谁的）" }
  ],
  p1: [
    { en: "We are in the same class.", zh: "我们在同一个班。（we 我们，主格站句首）" },
    { en: "It is sunny today.", zh: "今天天气晴朗。（it 指天气，不用翻译出来）" },
    { en: "It is eight o'clock.", zh: "现在八点。（it 指时间，高分考点）" },
    { en: "You, he and I are good friends.", zh: "你、他和我都是好朋友。（礼貌排序：别人在前，我放最后）" },
    { en: "It is three kilometres away.", zh: "离这儿三公里远。（it 指距离）" },
    { en: "He runs fast.", zh: "他跑得快。（he 站在动词 runs 前面发动作）" }
  ],
  p2: [
    { en: "The teacher helps me with my homework.", zh: "老师帮我做作业。（me 在动词 helps 后面，接好球）" },
    { en: "This present is for him.", zh: "这份礼物是给他的。（介词 for 后面用宾格 him）" },
    { en: "Mum is calling us for dinner.", zh: "妈妈喊我们吃晚饭。（动词 calling 后用宾格 us）" },
    { en: "I often write e-mails to them.", zh: "我经常给他们写邮件。（介词 to 后面用宾格 them）" },
    { en: "Please look at her new dress.", zh: "请看她的新裙子。（look at 介词后用宾格 her）" },
    { en: "Let me try again.", zh: "让我再试一次。（Let 是动词，后面接宾格 me）" }
  ],
  p3: [
    { en: "Her mother is a nurse.", zh: "她的妈妈是护士。（Her 后面有名词 mother，小标签贴名词）" },
    { en: "Its tail is long.", zh: "它的尾巴很长。（its 后面跟名词 tail；its 形式永远不变）" },
    { en: "Our school is beautiful.", zh: "我们的学校很美。（Our + 名词 school）" },
    { en: "Your hands are dirty. Go and wash them.", zh: "你的手脏了，去洗洗。（Your + 名词 hands）" },
    { en: "This is his pencil, not my pencil.", zh: "这是他的铅笔，不是我的铅笔。（his 既是他的，形式不变）" }
  ],
  p4: [
    { en: "This book is mine.", zh: "这本书是我的。（mine = my book，后面不带名词）" },
    { en: "The red pen is hers.", zh: "红色的钢笔是她的。（hers 独立站，= her pen）" },
    { en: "Ours is bigger than yours.", zh: "我们的比你们的大。（Ours = our classroom，后面没有名词）" },
    { en: "A friend of mine lives in Beijing.", zh: "我的一个朋友住在北京。（双重所有格 a friend of mine）" },
    { en: "Their books are new; ours are old.", zh: "他们的书是新的，我们的是旧的。（theirs/ours 后面都不跟名词）" }
  ],
  p5: [
    { en: "I can dress myself now.", zh: "我现在会自己穿衣服了。（myself 我自己）" },
    { en: "Be careful! Don't hurt yourself.", zh: "小心！别伤到自己。（yourself 你自己）" },
    { en: "The cat is cleaning itself.", zh: "猫在清理自己。（itself 它自己）" },
    { en: "We enjoyed ourselves at the party.", zh: "我们在派对上玩得很开心。（enjoy oneself 玩得开心，固定搭配）" },
    { en: "She made this cake by herself.", zh: "这个蛋糕是她自己做的。（by oneself 独自、亲手）" },
    { en: "They finished the work themselves.", zh: "他们自己完成了工作。（themselves 他们自己，起强调作用）" }
  ],
  p6: [
    { en: "This apple is sweet, but that one is sour.", zh: "这个苹果甜，那个酸。（this 近处，that 远处）" },
    { en: "These are my shoes.", zh: "这些是我的鞋。（these 近处复数，后面用 are）" },
    { en: "Those birds fly to the south in winter.", zh: "那些鸟冬天飞去南方。（those 远处复数）" },
    { en: "Who is that boy over there?", zh: "那边那个男孩是谁？（远处的人用 that）" },
    { en: "This is my desk; that is yours.", zh: "这是我的桌子，那是你的。（this/that 对比使用）" }
  ],
  p7: [
    { en: "I have some milk for breakfast.", zh: "我早餐喝些牛奶。（肯定句用 some；milk 不可数）" },
    { en: "I don't have any brothers.", zh: "我没有兄弟。（否定句用 any）" },
    { en: "Are there any apples in the fridge?", zh: "冰箱里有苹果吗？（一般疑问句用 any）" },
    { en: "Would you like some tea?", zh: "你想喝点茶吗？（请求/建议的问句用 some，高分考点）" },
    { en: "You can ask any teacher here.", zh: "你可以问这里的任何一位老师。（any 表任何，肯定句也能用）" },
    { en: "Something is wrong with my bike.", zh: "我的自行车坏了。（something 肯定句；形容词要放后面）" }
  ],
  p8: [
    { en: "How many books do you have?", zh: "你有多少本书？（books 数得清，用 many）" },
    { en: "How much water do you drink every day?", zh: "你每天喝多少水？（water 数不清，用 much）" },
    { en: "There are too many cars on the road.", zh: "路上车太多了。（可数名词复数配 many）" },
    { en: "There is too much snow in winter.", zh: "冬天的雪太多。（不可数名词配 much）" }
  ],
  p9: [
    { en: "Both of my parents are teachers.", zh: "我的父母都是老师。（both 两个都，谓语用 are）" },
    { en: "All of the students are here.", zh: "所有学生都到了。（all 全都，谓语用 are）" },
    { en: "Both answers are correct.", zh: "两个答案都对。（both + 复数名词）" },
    { en: "All the water is gone.", zh: "水全没了。（all + 不可数名词，谓语用 is）" }
  ],
  p10: [
    { en: "Each student has a locker.", zh: "每个学生都有一个储物柜。（each 强调一个一个，谓语用 has）" },
    { en: "Every morning I run for ten minutes.", zh: "每天早晨我跑十分钟步。（every 全体一起看，谓语用单数）" },
    { en: "Each of the answers is right.", zh: "每个答案都是对的。（each of + 复数，谓语仍用单数 is）" },
    { en: "Every child likes games.", zh: "每个孩子都喜欢游戏。（every + 单数名词）" }
  ],
  p11: [
    { en: "Who is your English teacher?", zh: "谁是你的英语老师？（who 问人）" },
    { en: "What is your favourite subject?", zh: "你最喜欢的科目是什么？（what 问事物）" },
    { en: "Which colour do you like, red or blue?", zh: "你喜欢哪种颜色，红的还是蓝的？（which 在有限范围内选）" },
    { en: "Whose bag is this?", zh: "这是谁的包？（whose 问归属，后面接名词）" },
    { en: "With whom did you go to the park?", zh: "你和谁去的公园？（介词后只能用 whom，高分考点）" }
  ],

  /* ===== 第一章 名词乐园 ===== */
  n1: [
    { en: "The dog is sleeping.", zh: "狗在睡觉。（dog 是动物名词）" },
    { en: "Beijing is a big city.", zh: "北京是个大城市。（Beijing 是地点名词）" },
    { en: "My brother loves football.", zh: "我哥哥爱足球。（brother 是人称名词，football 是事物名词）" }
  ],
  n2: [
    { en: "I have two books.", zh: "我有两本书。（book 可以数：a book, two books）" },
    { en: "There are five apples on the table.", zh: "桌上有五个苹果。（apple 可数，能加 s）" },
    { en: "An egg a day keeps me strong.", zh: "每天一个鸡蛋让我强壮。（egg 可数，一个用 an）" }
  ],
  n3: [
    { en: "I have three pens.", zh: "我有三支钢笔。（pen + s = pens，直接加 s）" },
    { en: "Cats like fish.", zh: "猫喜欢鱼。（cat + s = cats）" },
    { en: "There are many books in the library.", zh: "图书馆里有很多书。（book + s = books）" },
    { en: "Two dogs are playing in the park.", zh: "两只狗在公园里玩。（dog + s = dogs）" }
  ],
  n4: [
    { en: "I have two boxes of chocolates.", zh: "我有两盒巧克力。（box 以 x 结尾，+ es）" },
    { en: "There are three buses at the stop.", zh: "车站有三辆公交车。（bus + es）" },
    { en: "She watches TV every day.", zh: "她每天看电视。（watch + es）" },
    { en: "Brush your teeth twice a day.", zh: "一天刷两次牙。（tooth 刷牙用复数；brush 动词）" }
  ],
  n5: [
    { en: "There are many babies in the park.", zh: "公园里有很多宝宝。（baby 辅音+y，变 i 加 es）" },
    { en: "Beijing and Shanghai are big cities.", zh: "北京和上海是大城市。（city 变 cities）" },
    { en: "I like reading stories.", zh: "我喜欢读故事。（story 变 stories）" },
    { en: "Look! The boys are playing football.", zh: "看！男孩们在踢球。（boy 是元音+y，直接加 s）" }
  ],
  n6: [
    { en: "The leaves turn yellow in autumn.", zh: "秋天树叶变黄。（leaf 变 leaves）" },
    { en: "Be careful with the knives!", zh: "小心刀子！（knife 变 knives）" },
    { en: "I can see five wolves in the picture.", zh: "图里能看到五只狼。（wolf 变 wolves）" }
  ],
  n7: [
    { en: "Three children are singing.", zh: "三个孩子在唱歌。（child 变 children，不规则）" },
    { en: "Wash your hands before meals.", zh: "饭前洗手。（hand 规则；注意 foot 变 feet）" },
    { en: "My feet hurt after the long walk.", zh: "走远路后我脚疼。（foot 变 feet）" },
    { en: "Cats catch mice.", zh: "猫抓老鼠。（mouse 变 mice）" }
  ],
  n8: [
    { en: "I drink milk every morning.", zh: "我每天早晨喝牛奶。（milk 不可数，不能加 s）" },
    { en: "There is some water in the bottle.", zh: "瓶子里有些水。（water 不可数，用 is）" },
    { en: "Would you like some bread?", zh: "想吃点面包吗？（bread 不可数，用 some 修饰）" },
    { en: "Two cups of tea, please.", zh: "请来两杯茶。（tea 不可数，用 cup of 计量）" }
  ],
  n9: [
    { en: "This is Tom's bike.", zh: "这是汤姆的自行车。（Tom's = 汤姆的，人名加 's）" },
    { en: "My mother's bag is new.", zh: "我妈妈的包是新的。（mother's 妈妈的）" },
    { en: "These are the children's books.", zh: "这些是孩子们的书。（children 已是复数，直接加 's）" },
    { en: "Look at the teachers' desks.", zh: "看老师们办公桌。（复数 teachers 加 ' 即可）" }
  ],

  /* ===== 第二章 冠词岛 ===== */
  a1: [
    { en: "I have a cat and an orange.", zh: "我有一只猫和一个橙子。（cat 辅音开头用 a，orange 元音开头用 an）" },
    { en: "She is an honest girl.", zh: "她是个诚实的女孩。（honest 的 h 不发音，算元音开头）" },
    { en: "It is a useful book.", zh: "这是本有用的书。（useful 读 /ju:/，辅音音素开头，用 a）" }
  ],
  a2: [
    { en: "There is an old tree in the park.", zh: "公园里有一棵老树。（old 元音开头用 an）" },
    { en: "I saw a bird and an eagle.", zh: "我看见一只鸟和一只鹰。（bird 用 a，eagle 用 an）" },
    { en: "He is a university student.", zh: "他是一名大学生。（university 读 /ju:/，用 a）" }
  ],
  a3: [
    { en: "The sun rises in the east.", zh: "太阳从东方升起。（独一无二的东西用 the）" },
    { en: "Close the door, please.", zh: "请关门。（双方都知道是哪个门，特指用 the）" },
    { en: "The book on the desk is mine.", zh: "桌上那本书是我的。（带修饰语特指，用 the）" }
  ],
  a4: [
    { en: "We play football after school.", zh: "放学后我们踢足球。（球类前不加冠词）" },
    { en: "Can you play the piano?", zh: "你会弹钢琴吗？（乐器前要加 the，对比记忆）" },
    { en: "They often play basketball.", zh: "他们常打篮球。（basketball 球类，零冠词）" }
  ],
  a5: [
    { en: "I have breakfast at seven.", zh: "我七点吃早餐。（三餐前不加冠词）" },
    { en: "We had lunch together.", zh: "我们一起吃了午饭。（lunch 三餐，零冠词）" },
    { en: "Mum is cooking dinner.", zh: "妈妈在做晚饭。（dinner 三餐，零冠词）" }
  ],
  a6: [
    { en: "We go to school by bus.", zh: "我们坐公交上学。（go to school 固定短语，零冠词）" },
    { en: "He goes to bed at nine.", zh: "他九点上床睡觉。（go to bed 零冠词）" },
    { en: "My mother goes to work by bike.", zh: "妈妈骑车上班。（go to work 零冠词）" }
  ],
  a7: [
    { en: "a hundred students", zh: "一百个学生。（a = 一，表示数量）" },
    { en: "I have a brother and two sisters.", zh: "我有一个哥哥和两个姐姐。（a 表示一个）" },
    { en: "We meet twice a week.", zh: "我们每周见两次。（a = 每，twice a week 每周两次）" }
  ],
  a8: [
    { en: "I am a student. I study at a school near the park.", zh: "我是学生，在公园附近的一所学校上学。（第一次提到用 a，特指用 the）" },
    { en: "An apple a day keeps the doctor away.", zh: "一天一苹果，医生远离我。（an/a/the 经典谚语）" },
    { en: "The moon is bright tonight.", zh: "今晚月亮很亮。（moon 独一无二用 the）" }
  ],

  /* ===== 第四章 数词镇 ===== */
  num1: [
    { en: "I have ten fingers.", zh: "我有十根手指。（ten 10）" },
    { en: "There are twelve months in a year.", zh: "一年有十二个月。（twelve 12）" },
    { en: "Nine plus one is ten.", zh: "九加一等于十。（nine, one, ten 基数词）" }
  ],
  num2: [
    { en: "My brother is thirteen years old.", zh: "我哥哥十三岁。（thirteen 13）" },
    { en: "There are twenty desks in our classroom.", zh: "我们教室有二十张桌子。（twenty 整十）" },
    { en: "Fifteen minus five is ten.", zh: "十五减五等于十。（fifteen 15）" }
  ],
  num3: [
    { en: "My grandma is seventy years old.", zh: "我奶奶七十岁。（seventy 整十）" },
    { en: "There are one hundred students in the hall.", zh: "大厅里有一百个学生。（hundred 百）" },
    { en: "Twenty-three plus thirty-two is fifty-five.", zh: "23 加 32 等于 55。（几十几：整十 + 个位）" }
  ],
  num4: [
    { en: "I am the first one to get to school.", zh: "我是第一个到校的。（first 第一，序数词）" },
    { en: "Today is her fifth birthday.", zh: "今天是她的五岁生日。（fifth 第五，five 变 fifth）" },
    { en: "February is the second month of the year.", zh: "二月是一年中的第二个月。（second 第二）" }
  ],
  num5: [
    { en: "It is half past six.", zh: "现在六点半。（half past + 小时）" },
    { en: "The meeting begins at a quarter to nine.", zh: "会议八点四十五开始。（a quarter to nine 差一刻到九点）" },
    { en: "School starts at eight o'clock.", zh: "学校八点上课。（整点 o'clock）" }
  ],
  num6: [
    { en: "Today is June the first.", zh: "今天是六月一日。（日期用序数词）" },
    { en: "I was born in 2016.", zh: "我出生于 2016 年。（年份直接读数字）" },
    { en: "We have no classes on Saturday.", zh: "我们周六没课。（星期几首字母大写）" }
  ],

  /* ===== 第五章 形容词山 ===== */
  adj1: [
    { en: "The red apple is sweet.", zh: "红苹果很甜。（red 修饰 apple，形容词）" },
    { en: "She is a clever girl.", zh: "她是个聪明的女孩。（clever 放名词前）" },
    { en: "The sky is blue today.", zh: "今天天空很蓝。（形容词放 be 动词后）" }
  ],
  adj2: [
    { en: "Tom is taller than Jim.", zh: "汤姆比吉姆高。（taller = tall + er，比一比）" },
    { en: "This box is heavier than that one.", zh: "这个箱子比那个重。（heavy 变 heavier）" },
    { en: "My hair is longer than yours.", zh: "我的头发比你的长。（long + er）" }
  ],
  adj3: [
    { en: "He is the tallest boy in our class.", zh: "他是我们班最高的男孩。（tallest 最高，加 the）" },
    { en: "The Changjiang River is the longest river in China.", zh: "长江是中国最长的河。（longest 最长）" },
    { en: "It is the biggest city in the country.", zh: "它是该国最大的城市。（big 双写 g + est）" }
  ],
  adj4: [
    { en: "This book is better than that one.", zh: "这本书比那本好。（good 变 better）" },
    { en: "She is the best student in the class.", zh: "她是班里最好的学生。（good 变 best）" },
    { en: "Today is worse than yesterday.", zh: "今天比昨天糟。（bad 变 worse）" }
  ],
  adj5: [
    { en: "Tom is as tall as his father.", zh: "汤姆和他爸爸一样高。（as + 原级 + as）" },
    { en: "My bag is not as heavy as yours.", zh: "我的包没有你的重。（not as...as 不一样）" },
    { en: "This line is as long as that one.", zh: "这条线和那条一样长。（as...as 一样）" }
  ],
  adj6: [
    { en: "You are much taller than me.", zh: "你比我高多了。（much 加强比较级）" },
    { en: "This problem is even harder.", zh: "这道题甚至更难。（even 更、甚至）" },
    { en: "I feel a lot better today.", zh: "我今天感觉好多了。（a lot 加强）" }
  ],
  adj7: [
    { en: "My bike is the same as yours.", zh: "我的自行车和你的一样。（the same as）" },
    { en: "This picture is different from that one.", zh: "这幅画和那幅不同。（different from）" },
    { en: "Your answer is the same as mine.", zh: "你的答案和我的一样。（the same as）" }
  ],
  adj8: [
    { en: "The film is interesting.", zh: "这部电影很有趣。（ing 修饰物，令人…）" },
    { en: "I am interested in music.", zh: "我对音乐感兴趣。（ed 修饰人，感到…）" },
    { en: "The news is exciting. We are all excited.", zh: "消息令人兴奋，我们都很兴奋。（ing 物 / ed 人对比）" }
  ],
  adj9: [
    { en: "a beautiful red flower", zh: "一朵美丽的红花。（观点在前、颜色在后）" },
    { en: "a big round table", zh: "一张大圆桌。（大小在前、形状在后）" },
    { en: "a small black cat", zh: "一只小黑猫。（大小 → 颜色）" }
  ],
  adj10: [
    { en: "Summer is the hottest season of the year.", zh: "夏天是一年最热的季节。（hot 双写 t + est）" },
    { en: "Lucy is more careful than Lily.", zh: "露西比莉莉细心。（多音节用 more）" },
    { en: "This is the most interesting story.", zh: "这是最有趣的故事。（most + 多音节）" }
  ],

  /* ===== 第六章 副词林 ===== */
  adv1: [
    { en: "He runs fast.", zh: "他跑得快。（fast 修饰动词 runs）" },
    { en: "She sings beautifully.", zh: "她唱歌很动听。（beautifully 修饰 sings）" },
    { en: "The old man walks slowly.", zh: "老人走得慢。（slowly 副词）" }
  ],
  adv2: [
    { en: "He is a careful driver. He drives carefully.", zh: "他是细心的司机，开车很细心。（careful + ly = carefully）" },
    { en: "The baby sleeps quietly.", zh: "宝宝安静地睡觉。（quiet + ly）" },
    { en: "Please write your name clearly.", zh: "请把名字写清楚。（clear + ly）" }
  ],
  adv3: [
    { en: "I always get up at six.", zh: "我总是六点起床。（always 总是 100%）" },
    { en: "She usually walks to school.", zh: "她通常走路上学。（usually 通常）" },
    { en: "He never eats junk food.", zh: "他从不吃垃圾食品。（never 从不 0%）" }
  ],
  adv4: [
    { en: "We will go to the zoo tomorrow.", zh: "我们明天去动物园。（时间副词常放句尾）" },
    { en: "The children are playing outside.", zh: "孩子们在外面玩。（地点副词放句尾）" },
    { en: "Suddenly, it began to rain.", zh: "突然下起雨来。（副词也可放句首）" }
  ],
  adv5: [
    { en: "Tom runs faster than Jim.", zh: "汤姆跑得比吉姆快。（fast 的比较级还是 fast）" },
    { en: "She sings better than me.", zh: "她唱得比我好。（well 变 better）" },
    { en: "He works the hardest in the team.", zh: "他是队里工作最努力的。（hard → hardest）" }
  ],
  adv6: [
    { en: "He studies hard.", zh: "他学习努力。（hard 努力地）" },
    { en: "I can hardly see it.", zh: "我几乎看不见它。（hardly 几乎不，意思相反！）" },
    { en: "It rained hard last night.", zh: "昨晚雨下得很大。（hard 猛烈地）" }
  ],
  adv7: [
    { en: "I like apples, too.", zh: "我也喜欢苹果。（too 用于句尾，肯定句）" },
    { en: "She also likes apples.", zh: "她也喜欢苹果。（also 用于句中）" },
    { en: "I don't like pears, either.", zh: "我也不喜欢梨。（either 用于否定句句尾）" }
  ],
  adv8: [
    { en: "Please speak more slowly.", zh: "请说慢一点。（slowly 的比较级 more slowly）" },
    { en: "He arrived early as usual.", zh: "他照常到得很早。（early 副词）" },
    { en: "Listen carefully to the teacher.", zh: "认真听老师讲。（carefully 副词）" }
  ],

  /* ===== 第七章 介词河 ===== */
  prep1: [
    { en: "I get up at six thirty.", zh: "我六点半起床。（at + 具体时刻）" },
    { en: "We have class on Monday.", zh: "我们周一上课。（on + 具体某天）" },
    { en: "It often rains in summer.", zh: "夏天常下雨。（in + 季节/月份/年份）" }
  ],
  prep2: [
    { en: "The pen is in the pencil box.", zh: "笔在文具盒里。（in 里面）" },
    { en: "The book is on the desk.", zh: "书在桌子上。（on 表面接触）" },
    { en: "He is waiting at the bus stop.", zh: "他在公交站等车。（at 小地点）" }
  ],
  prep3: [
    { en: "The cat is under the chair.", zh: "猫在椅子下面。（under 下方）" },
    { en: "The bird is in the tree.", zh: "鸟在树上。（外来物在树上用 in）" },
    { en: "There is a bridge over the river.", zh: "河上有座桥。（over 正上方跨越）" }
  ],
  prep4: [
    { en: "The girl in red is my sister.", zh: "穿红衣服的女孩是我妹妹。（穿着用 in）" },
    { en: "He goes to work on foot.", zh: "他步行上班。（on foot 步行）" },
    { en: "We went there by train.", zh: "我们坐火车去的。（by + 交通工具）" }
  ],
  prep5: [
    { en: "I cut the cake with a knife.", zh: "我用刀切蛋糕。（with 用工具）" },
    { en: "Coffee without sugar, please.", zh: "请来杯不加糖的咖啡。（without 没有）" },
    { en: "She came in with a big smile.", zh: "她带着大大的微笑进来。（with 带着某物）" }
  ],
  prep6: [
    { en: "I have lived here for five years.", zh: "我住在这里五年了。（for + 一段时间）" },
    { en: "He has studied English since 2020.", zh: "他从 2020 年起学英语。（since + 起点）" },
    { en: "We have known each other for a long time.", zh: "我们认识很久了。（for + 时段）" }
  ],
  prep7: [
    { en: "Don't laugh at others.", zh: "不要嘲笑别人。（laugh at 固定搭配）" },
    { en: "She is good at maths.", zh: "她擅长数学。（be good at）" },
    { en: "Listen to the teacher carefully.", zh: "认真听老师讲。（listen to）" }
  ],
  prep8: [
    { en: "Guangzhou is in the south of China.", zh: "广州在中国南部。（境内用 in）" },
    { en: "Japan lies to the east of China.", zh: "日本位于中国以东。（境外接壤外用 to）" },
    { en: "Hunan is on the south of Hubei.", zh: "湖南在湖北南边。（接壤用 on）" }
  ],
  prep9: [
    { en: "Thank you for your help.", zh: "谢谢你的帮助。（thank sb. for）" },
    { en: "What about playing football?", zh: "踢足球怎么样？（what about doing）" },
    { en: "He left without saying goodbye.", zh: "他没道别就走了。（without doing）" }
  ],
  prep10: [
    { en: "Be careful when you go across the street.", zh: "过马路要小心。（across 从表面穿过）" },
    { en: "The train went through the tunnel.", zh: "火车穿过隧道。（through 从内部穿过）" },
    { en: "We walked along the river.", zh: "我们沿着河散步。（along 沿着）" }
  ],

  /* ===== 第八章 连词桥 ===== */
  conj1: [
    { en: "I like apples and bananas.", zh: "我喜欢苹果和香蕉。（and 并列，都爱）" },
    { en: "He is short but strong.", zh: "他个子矮但很强壮。（but 转折）" },
    { en: "Do you like tea or coffee?", zh: "你喜欢茶还是咖啡？（or 选择）" }
  ],
  conj2: [
    { en: "It was late, so we went home.", zh: "天晚了，所以我们回家了。（so 所以）" },
    { en: "I stayed at home because it rained.", zh: "我待在家，因为下雨了。（because 因为）" },
    { en: "She was happy because she won the game.", zh: "她赢了比赛，所以很开心。（because 说明原因）" }
  ],
  conj3: [
    { en: "Both Tom and Jim like swimming.", zh: "汤姆和吉姆都喜欢游泳。（both...and 两者都）" },
    { en: "Either you or I am wrong.", zh: "不是你错就是我错。（either...or 二选一）" },
    { en: "He can neither read nor write.", zh: "他既不会读也不会写。（neither...nor 两者都不）" }
  ],
  conj4: [
    { en: "When I got home, Mum was cooking.", zh: "我到家时妈妈在做饭。（when 当…时候）" },
    { en: "Wash your hands before you eat.", zh: "吃饭前先洗手。（before 在…之前）" },
    { en: "After he finished his homework, he watched TV.", zh: "写完作业后他看了电视。（after 在…之后）" }
  ],
  conj5: [
    { en: "If it rains tomorrow, we will stay at home.", zh: "如果明天下雨，我们就待在家。（if 条件）" },
    { en: "If you are happy, clap your hands.", zh: "如果你开心就拍拍手。（if 如果）" },
    { en: "You will pass the exam if you work hard.", zh: "努力学就能通过考试。（if 从句）" }
  ],
  conj6: [
    { en: "I was doing my homework while my brother was playing.", zh: "我在写作业而弟弟在玩。（while 与此同时）" },
    { en: "He is not only clever but also kind.", zh: "他不仅聪明而且善良。（not only...but also）" },
    { en: "Hurry up, or you will miss the bus.", zh: "快点，否则赶不上公交了。（or 否则）" }
  ],

  /* ===== 第九章 动词城 ===== */
  v1: [
    { en: "I am a pupil.", zh: "我是小学生。（I 搭配 am）" },
    { en: "She is my teacher.", zh: "她是我的老师。（三单用 is）" },
    { en: "They are my friends.", zh: "他们是我的朋友。（复数用 are）" }
  ],
  v2: [
    { en: "I am not late.", zh: "我没有迟到。（否定：am + not）" },
    { en: "Is he your brother?", zh: "他是你哥哥吗？（疑问：Is 提前）" },
    { en: "They aren't in the classroom.", zh: "他们不在教室。（aren't = are not）" }
  ],
  v3: [
    { en: "I play football every day.", zh: "我每天踢足球。（一般现在时表习惯）" },
    { en: "We go to school together.", zh: "我们一起上学。（复数动词用原形）" },
    { en: "The shop opens at nine.", zh: "商店九点开门。（三单 opens）" }
  ],
  v4: [
    { en: "He likes maths.", zh: "他喜欢数学。（like 三单加 s）" },
    { en: "She watches TV in the evening.", zh: "她晚上看电视。（watch 变 watches）" },
    { en: "Tom studies hard.", zh: "汤姆学习努力。（study 变 studies）" }
  ],
  v5: [
    { en: "I have two brothers.", zh: "我有两个兄弟。（I 用 have）" },
    { en: "She has a beautiful dress.", zh: "她有一条漂亮的裙子。（三单用 has）" },
    { en: "They have lunch at school.", zh: "他们在学校吃午饭。（have lunch 吃午饭）" }
  ],
  v6: [
    { en: "Do you like ice cream?", zh: "你喜欢冰淇淋吗？（Do 提问，动词原形）" },
    { en: "Does he play the guitar?", zh: "他会弹吉他吗？（Does 提问，动词还原）" },
    { en: "I don't know the answer.", zh: "我不知道答案。（don't 否定）" }
  ],
  v7: [
    { en: "There is a clock on the wall.", zh: "墙上有个钟。（单数用 is）" },
    { en: "There are many stars in the sky.", zh: "天上有许多星星。（复数用 are）" },
    { en: "There is some milk in the glass.", zh: "杯里有些牛奶。（不可数用 is）" }
  ],
  v8: [
    { en: "There isn't any bread left.", zh: "没剩什么面包了。（否定 isn't any）" },
    { en: "Is there a park near your home?", zh: "你家附近有公园吗？（Is there 提问）" },
    { en: "Are there any apples in the basket?", zh: "篮子里有苹果吗？（Are there 提问）" }
  ],
  v9: [
    { en: "I can swim very fast.", zh: "我能游得很快。（can + 动词原形）" },
    { en: "Can you help me?", zh: "你能帮我吗？（Can 提问）" },
    { en: "She can't come today.", zh: "她今天不能来。（can't 否定）" }
  ],
  v10: [
    { en: "You must finish your homework first.", zh: "你必须先完成作业。（must 必须）" },
    { en: "You should go to bed early.", zh: "你应该早点睡。（should 建议）" },
    { en: "You mustn't play with fire.", zh: "你绝不能玩火。（mustn't 禁止）" }
  ],
  v11: [
    { en: "I like reading books.", zh: "我喜欢读书。（like + doing）" },
    { en: "He wants to be a pilot.", zh: "他想当飞行员。（want to do）" },
    { en: "We enjoy playing basketball.", zh: "我们喜欢打篮球。（enjoy + doing）" }
  ],
  v12: [
    { en: "My father doesn't watch TV on weekdays.", zh: "爸爸工作日不看电视。（doesn't 三单否定）" },
    { en: "Do they have sports after class?", zh: "他们课后运动吗？（Do 提问）" },
    { en: "There is going to be a meeting tomorrow.", zh: "明天有个会。（there be 将来式）" }
  ],

  /* ===== 第十章 进行时港 ===== */
  ing1: [
    { en: "I am reading a book now.", zh: "我现在在读书。（am + reading）" },
    { en: "She is cooking dinner.", zh: "她在做饭。（is + cooking）" },
    { en: "They are playing games.", zh: "他们在玩游戏。（are + playing）" }
  ],
  ing2: [
    { en: "He is writing a letter.", zh: "他在写信。（write 去 e 加 ing）" },
    { en: "We are swimming in the river.", zh: "我们在河里游泳。（swim 双写 m 加 ing）" },
    { en: "Look! It is raining.", zh: "看！下雨了。（rain 直接加 ing）" }
  ],
  ing3: [
    { en: "I am not watching TV.", zh: "我没在看电视。（am not 否定）" },
    { en: "Is she doing her homework?", zh: "她在做作业吗？（Is 提前）" },
    { en: "What are you doing?", zh: "你在干什么？（特殊疑问）" }
  ],
  ing4: [
    { en: "Listen! Someone is singing.", zh: "听！有人在唱歌。（Listen! 标志词）" },
    { en: "Look! The bus is coming.", zh: "看！公交来了。（Look! 标志词）" },
    { en: "They are cleaning the classroom now.", zh: "他们现在在打扫教室。（now 标志词）" }
  ],
  ing5: [
    { en: "I like this song very much.", zh: "我非常喜欢这首歌。（like 表喜好不用进行时）" },
    { en: "I know the answer.", zh: "我知道答案。（know 表状态不用进行时）" },
    { en: "She has a new bike.", zh: "她有辆新自行车。（have 拥有不用进行时）" }
  ],
  ing6: [
    { en: "My mother is washing clothes at the moment.", zh: "妈妈此刻在洗衣服。（at the moment 此刻）" },
    { en: "Are you listening to me?", zh: "你在听我说话吗？（进行时提问）" },
    { en: "The children aren't sleeping now.", zh: "孩子们现在没在睡觉。（现在否定）" }
  ],

  /* ===== 第十一章 时光列车 ===== */
  t1: [
    { en: "I was at home yesterday.", zh: "我昨天在家。（I 搭 was）" },
    { en: "They were late this morning.", zh: "他们今天早上迟到了。（复数用 were）" },
    { en: "She wasn't at school last week.", zh: "她上周没来学校。（wasn't 否定）" }
  ],
  t2: [
    { en: "I visited my grandparents last weekend.", zh: "上周末我看望了祖父母。（visit + ed）" },
    { en: "He studied hard last night.", zh: "他昨晚学习很用功。（study 变 studied）" },
    { en: "We played chess after dinner.", zh: "晚饭后我们下了棋。（play + ed）" }
  ],
  t3: [
    { en: "I went to the zoo last Sunday.", zh: "上周日我去了动物园。（go 变 went）" },
    { en: "She saw a film yesterday evening.", zh: "她昨晚看了场电影。（see 变 saw）" },
    { en: "We ate mooncakes at Mid-Autumn Festival.", zh: "中秋节我们吃了月饼。（eat 变 ate）" }
  ],
  t4: [
    { en: "I didn't go to school yesterday.", zh: "我昨天没上学。（didn't + 原形）" },
    { en: "Did you watch the game last night?", zh: "昨晚你看比赛了吗？（Did 提问）" },
    { en: "Where did you go last summer?", zh: "去年夏天你去了哪？（where did 提问）" }
  ],
  t5: [
    { en: "I am going to visit the museum tomorrow.", zh: "我明天打算去博物馆。（be going to 打算）" },
    { en: "It is going to rain.", zh: "快要下雨了。（be going to 即将）" },
    { en: "They are going to have a picnic.", zh: "他们打算去野餐。（are going to）" }
  ],
  t6: [
    { en: "I will be twelve next year.", zh: "我明年就十二岁了。（will 将来）" },
    { en: "She will come to my party.", zh: "她会来我的派对。（will + 原形）" },
    { en: "We won't have classes on Sunday.", zh: "周日我们不上课。（won't 否定）" }
  ],
  t7: [
    { en: "I did my homework two hours ago.", zh: "我两小时前做的作业。（ago 标志过去）" },
    { en: "We will meet next week.", zh: "我们下周见。（next week 标志将来）" },
    { en: "Look at the blackboard now.", zh: "现在看黑板。（now 标志进行）" }
  ],
  t8: [
    { en: "Yesterday I was ill, but today I feel better.", zh: "昨天我病了，今天好多了。（过去与现在对比）" },
    { en: "He bought a toy car for me last Friday.", zh: "上周五他给我买了辆玩具车。（buy 变 bought）" },
    { en: "Soon the train will start.", zh: "火车很快就要开了。（soon 将来）" }
  ],

  /* ===== 第十二章 句型王宫 ===== */
  s1: [
    { en: "My sister works in a hospital.", zh: "我姐姐在医院工作。（主语 + 谓语 + 地点）" },
    { en: "The little boy is drinking milk.", zh: "小男孩在喝牛奶。（主 + 谓 + 宾）" },
    { en: "Birds fly in the sky.", zh: "鸟在空中飞。（基本语序）" }
  ],
  s2: [
    { en: "Are you a doctor?", zh: "你是医生吗？（be 动词提前）" },
    { en: "Do you like winter?", zh: "你喜欢冬天吗？（Do 提前）" },
    { en: "Can he swim across the river?", zh: "他能游过这条河吗？（Can 提前）" }
  ],
  s3: [
    { en: "Where do you live?", zh: "你住在哪里？（where 问地点）" },
    { en: "When does school start?", zh: "学校几点上课？（when 问时间）" },
    { en: "Why are you late?", zh: "你为什么迟到？（why 问原因）" }
  ],
  s4: [
    { en: "Open the window, please.", zh: "请打开窗户。（祈使句：动词开头）" },
    { en: "Don't run in the hallway.", zh: "不要在走廊里跑。（Don't 否定祈使）" },
    { en: "Let's go to the library.", zh: "我们去图书馆吧。（Let's + 原形）" }
  ],
  s5: [
    { en: "What a beautiful flower it is!", zh: "多么美的花啊！（What + a + 形容词 + 名词）" },
    { en: "How clever the boy is!", zh: "这男孩多聪明啊！（How + 形容词）" },
    { en: "How fast he runs!", zh: "他跑得多快啊！（How + 副词）" }
  ],
  s6: [
    { en: "There is a lamp on the table.", zh: "桌上有盏台灯。（there be 表存在）" },
    { en: "I have a new schoolbag.", zh: "我有一个新书包。（have 表拥有）" },
    { en: "There are two cats under the bed.", zh: "床下有两只猫。（there are 复数）" }
  ]
};