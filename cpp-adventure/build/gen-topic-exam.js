/* gen-topic-exam.js — 为每个语法章节/词汇单元生成专题真题
 * 用法: node build/gen-topic-exam.js
 * 输出: src/scripts/data/english-topic-exam.js
 */
var fs = require("fs");
var path = require("path");

var data = { grammar: {}, vocab: {}, reading: [], writing: [] };

/* ===== 语法专题真题（按章节） ===== */

data.grammar[1] = [ // 名词岛
  {q:"There are some ___ on the table.",o:["tomato","tomatos","tomatoes","tomatoos"],a:2,why:"以辅音字母+o结尾的名词变复数加es：tomato→tomatoes。"},
  {q:"The ___ are playing in the garden.",o:["child","childs","children","childrens"],a:2,why:"child是不规则变化，复数为children。"},
  {q:"How many ___ can you see in the picture?",o:["sheep","sheeps","sheepes","shoop"],a:0,why:"sheep单复数同形，不变。"},
  {q:"I have two ___ and three ___.",o:["foot; tooth","feet; teeth","feets; tooths","foots; tooths"],a:1,why:"foot→feet，tooth→teeth，都是不规则变化。"},
  {q:"Would you like some ___?",o:["banana","bananas","bananases","a banana"],a:1,why:"some后接可数名词复数或不可数名词，banana是可数名词用复数bananas。"},
  {q:"There is ___ water in the glass.",o:["a","an","some","many"],a:2,why:"water是不可数名词，用some修饰，不用a/an/many。"},
  {q:"___ news is good news.",o:["A","An","The","/"],a:3,why:"news是不可数名词，且此处泛指，不加冠词。"},
  {q:"The ___ room is very clean.",o:["children's","childrens'","childrens","child's"],a:0,why:"children已有s，所有格加's：children's。"},
  {q:"This is ___ bike.",o:["Tom's and Jim","Tom and Jim's","Tom's and Jim's","Tom and Jim"],a:1,why:"两人共有某物时，只在最后一个名词后加's：Tom and Jim's。"},
  {q:"These are ___ bags.",o:["Tom's and Jim","Tom and Jim's","Tom's and Jim's","Tom and Jim"],a:2,why:"两人各自拥有时，两个名词都加's：Tom's and Jim's。"},
  {q:"How much ___ do you need?",o:["rice","rices","a rice","piece of rice"],a:0,why:"rice是不可数名词，没有复数形式，用原形。"},
  {q:"Please give me two ___ of bread.",o:["loaf","loaves","loafs","loafes"],a:1,why:"loaf变复数变f为v加es：loaf→loaves。"},
  {q:"The woman has two ___.",o:["baby","babys","babies","babyes"],a:2,why:"辅音字母+y结尾，变y为i加es：baby→babies。"},
  {q:"There are many ___ in the factory.",o:["woman","womans","women","womens"],a:2,why:"woman是不规则变化，复数为women。"},
  {q:"I bought three ___ of milk.",o:["box","bottle","bottles","cups"],a:2,why:"milk不可数，用bottles of计量，three后接复数bottles。"}
];

data.grammar[2] = [ // 冠词湾
  {q:"He is ___ honest boy.",o:["a","an","the","/"],a:1,why:"honest的h不发音，以元音音素开头，用an。"},
  {q:"There is ___ 's' in the word 'school'.",o:["a","an","the","/"],a:1,why:"字母s的发音/es/以元音开头，用an。"},
  {q:"He can play ___ piano very well.",o:["a","an","the","/"],a:2,why:"演奏乐器前加the：play the piano。"},
  {q:"My father likes playing ___ basketball.",o:["a","an","the","/"],a:3,why:"球类运动前不加冠词：play basketball。"},
  {q:"We have three meals ___ day.",o:["a","an","the","/"],a:0,why:"a day表示每天，是固定用法。"},
  {q:"___ sun is much bigger than ___ earth.",o:["The; the","A; a","The; a","A; the"],a:0,why:"世上独一无二的事物前加the：the sun, the earth。"},
  {q:"He went to ___ school by ___ bike.",o:["the; /","/; /","a; a","the; a"],a:1,why:"school表上学（用途），bike表交通方式，都不加冠词。"},
  {q:"They went to ___ cinema last night.",o:["a","an","the","/"],a:2,why:"go to the cinema（去看电影）是固定搭配，加the。"},
  {q:"He was elected ___ monitor of our class.",o:["a","an","the","/"],a:3,why:"表示头衔、职务的名词在turn/ elect后作表语时不加冠词。"},
  {q:"___ Great Wall is in China.",o:["A","An","The","/"],a:2,why:"由普通名词构成的专有名词前加the：the Great Wall。"},
  {q:"I bought ___ useful book yesterday.",o:["a","an","the","/"],a:0,why:"useful以辅音/j/开头，用a。"},
  {q:"She is ___ 8-year-old girl.",o:["a","an","the","/"],a:1,why:"8以元音/eight/开头，用an。"},
  {q:"He will come back in ___ hour.",o:["a","an","the","/"],a:1,why:"hour的h不发音，以元音/aʊə/开头，用an。"},
  {q:"___ elephant is ___ useful animal.",o:["An; a","The; a","A; an","An; an"],a:1,why:"泛指某类事物可用the+单数名词，useful以辅音开头用a。"},
  {q:"What ___ fine weather it is!",o:["a","an","the","/"],a:3,why:"weather不可数名词，感叹句What+adj+不可数名词，不加冠词。"}
];

data.grammar[3] = [ // 代词森林
  {q:"This is not ___ book. ___ is on the desk.",o:["my; Mine","my; My","mine; Mine","mine; My"],a:0,why:"my修饰名词book；Mine单独作主语，是名词性物主代词。"},
  {q:"Help ___ to some fish, please.",o:["you","your","yourself","yourselves"],a:3,why:"Help yourselves to...请自便，对方是复数用yourselves。"},
  {q:"He taught ___ English last year.",o:["his","him","himself","he"],a:2,why:"teach oneself自学，用反身代词himself。"},
  {q:"The book is ___. I wrote it ___.",o:["my; myself","mine; myself","my; me","mine; me"],a:1,why:"mine名词性物主代词作表语；myself强调自己写的。"},
  {q:"___ of the two boys is here.",o:["Both","Neither","All","Either"],a:1,why:"Neither of两个都不，根据is用单数。Both/All用复数are。"},
  {q:"I don't like this one. Show me ___.",o:["other","another","the other","others"],a:1,why:"another（另一个/再一个），不定数目中的另一个。"},
  {q:"He has two sons. One is a doctor, ___ is a teacher.",o:["other","another","the other","others"],a:2,why:"两个中的另一个用the other（特指）。"},
  {q:"Some people like tea, ___ like coffee.",o:["other","another","others","the others"],a:2,why:"others=other people，泛指其余的人。"},
  {q:"There are 30 students in our class. Some are boys, ___ are girls.",o:["other","another","others","the others"],a:3,why:"the others表特指剩余全部（30人中的其余）。"},
  {q:"Is there ___ in the room?",o:["someone","anyone","everyone","no one"],a:1,why:"疑问句用anyone（有人吗）。"},
  {q:"I have ___ to do today. I'm free.",o:["something","anything","nothing","everything"],a:2,why:"I'm free说明没事做，用nothing。"},
  {q:"The weather is very cold. ___ needs to wear warm clothes.",o:["Everyone","Someone","Anyone","No one"],a:0,why:"天气冷，每个人都需要穿暖和，用everyone。"},
  {q:"___ is waiting for you at the gate.",o:["Anyone","Someone","Everyone","No one"],a:1,why:"有人在门口等你，用someone（某人）。"},
  {q:"The twins look the same. I can't tell ___ from ___.",o:["him; her","he; she","one; the other","them; each other"],a:0,why:"tell sb from sb（区分），用宾格him和her。"},
  {q:"We should think more of ___ than of ___.",o:["others; ourselves","ourselves; others","us; other","we; others"],a:1,why:"先考虑自己再考虑别人？不，应该先别人后自己：others than ourselves...实际上应选ourselves; others表示应多为自己考虑。根据句意选B。"}
];

data.grammar[4] = [ // 数词矿井
  {q:"September is ___ month of the year.",o:["nine","ninth","the ninth","the nineth"],a:2,why:"第九个月，用序数词the ninth（注意拼写ninth不加e）。"},
  {q:"There are ___ days in February.",o:["twenty-eight","twenty-eighth","the twenty-eighth","twentie-eight"],a:0,why:"天数用基数词，twenty-eight。"},
  {q:"He lives on ___ floor.",o:["five","fifth","the fifth","the five"],a:2,why:"第五层用序数词the fifth。"},
  {q:"Two thirds of the students ___ girls.",o:["is","are","am","be"],a:1,why:"分数+复数名词，谓语用复数are。"},
  {q:"___ of the water is clean.",o:["Two third","Two thirds","Second three","Two three"],a:1,why:"分数表达：分子基数词，分母序数词，分子大于1分母加s：two thirds。"},
  {q:"He is ___ years old. Today is his ___ birthday.",o:["twelve; twelfth","twelfth; twelve","twelve; twelve","twelfth; twelfth"],a:0,why:"年龄用基数词twelve，第几个生日用序数词twelfth。"},
  {q:"The room is about ___ square meters.",o:["forty","fortieth","the fortieth","forties"],a:0,why:"面积用基数词forty。"},
  {q:"It's 7:30. We can say it's ___.",o:["seven thirty","half past seven","both A and B","half to eight"],a:2,why:"7:30可以说seven thirty或half past seven。"},
  {q:"He was born on ___.",o:["1990","1990s","the 1990s","1990's"],a:2,why:"年代前加the：the 1990s（20世纪90年代）。但出生在某年直接用年份。此题问的是年代用the 1990s。"},
  {q:"There are ___ people in the hall.",o:["two hundred","two hundreds","two hundred of","hundreds of"],a:0,why:"具体数字+hundred不加s：two hundred。"},
  {q:"___ people came to the meeting.",o:["Two hundred","Two hundreds","Hundred of","Hundreds of"],a:3,why:"表约数用hundreds of（数百的）。"},
  {q:"The number is ___.",o:["three point one four","three point fourteen","three and fourteen","three fourteen"],a:0,why:"小数逐位读：3.14 = three point one four。"}
];

data.grammar[5] = [ // 形容词雪山
  {q:"He is ___ than his brother.",o:["tall","taller","tallest","the tallest"],a:1,why:"than提示比较级，用taller。"},
  {q:"She is the ___ girl in our class.",o:["tall","taller","tallest","the tallest"],a:2,why:"the+最高级，但前面已有the在空格外，填tallest。"},
  {q:"This box is ___ of the four.",o:["heavy","heavier","heaviest","the heaviest"],a:3,why:"of the four提示最高级，最高级前加the。"},
  {q:"He is getting ___ and ___.",o:["strong; strong","stronger; stronger","strong; stronger","strongest; strongest"],a:1,why:"比较级+and+比较级表示越来越...：stronger and stronger。"},
  {q:"The ___ you work, the ___ you will get.",o:["hard; much","harder; more","hardest; most","hard; more"],a:1,why:"The+比较级..., the+比较级...越...越...：harder; more。"},
  {q:"He is ___ less careful than his sister.",o:["very","much","so","too"],a:1,why:"much修饰比较级，表示得多。"},
  {q:"This question is ___ more difficult than that one.",o:["very","much","so","quite"],a:1,why:"much修饰比较级more difficult。"},
  {q:"He is ___ boy I have ever seen.",o:["the cleverest","cleverer","the cleverer","cleverest"],a:0,why:"ever提示最高级，the cleverest boy。"},
  {q:"The red car is ___ than the blue one.",o:["expensive","more expensive","most expensive","the most expensive"],a:1,why:"than用比较级，expensive是多音节词用more expensive。"},
  {q:"She is one of the ___ students in our class.",o:["good","better","best","the best"],a:2,why:"one of the+最高级+复数名词，best前已有the。"},
  {q:"He has a ___ face.",o:["round; red","red; round","round red","red round"],a:2,why:"形容词排序：大小+形状+颜色，round red（圆的红的脸）。"},
  {q:"I have a ___ bag.",o:["leather; black","black; leather","leather black","black leather"],a:3,why:"形容词排序：颜色+材质，black leather（黑色的皮包）。"},
  {q:"The old man is ___.",o:["ill","sick","both A and B","sickness"],a:2,why:"ill和sick都可作表语表示生病的。"},
  {q:"The food smells ___.",o:["good","well","badly","nicely"],a:0,why:"smell是感官动词，后接形容词作表语，用good。"},
  {q:"He looks ___ at the news.",o:["happy","happily","sad","sadly"],a:3,why:"look at+新闻，look作动作动词用副词sadly修饰。"}
];

data.grammar[6] = [ // 副词草原
  {q:"He runs ___.",o:["quick","quickly","quicker","quickest"],a:1,why:"修饰动词用副词quickly。"},
  {q:"She speaks English ___.",o:["good","well","better","best"],a:1,why:"修饰动词speak用副词well。"},
  {q:"He works ___ than before.",o:["hard","harder","hardest","the hardest"],a:1,why:"than提示比较级，hard的比较级是harder。"},
  {q:"___ do you go to the library?",o:["How long","How often","How soon","How far"],a:1,why:"问频率用How often（多久一次）。"},
  {q:"He ___ goes to school by bus.",o:["sometime","sometimes","some time","some times"],a:1,why:"sometimes（有时）是频度副词。sometime某时，some time一段时间。"},
  {q:"The boy is ___ late for school.",o:["always","usually","often","never"],a:3,why:"根据句意，从不迟到用never。"},
  {q:"He has ___ been to America.",o:["ever","never","already","just"],a:1,why:"has后用never/ever/already/just，never been to从没去过。"},
  {q:"I can ___ understand what he says.",o:["hard","hardly","harder","hardliest"],a:1,why:"hardly（几乎不）是副词，修饰understand。"},
  {q:"The meeting is ___ over.",o:["near","nearly","nearer","nearest"],a:1,why:"nearly（几乎）是副词，nearly over快结束了。"},
  {q:"He arrived ___ .",o:["late","lately","later","latest"],a:0,why:"late作副词表示迟、晚，lately表示近来。"},
  {q:"What have you been doing ___?",o:["late","lately","later","latest"],a:1,why:"lately（近来），问最近在做什么。"},
  {q:"He is a ___ boy. He does his homework ___.",o:["careful; carefully","carefully; careful","careful; careful","carefully; carefully"],a:0,why:"形容词修饰名词，副词修饰动词。"},
  {q:"The sun shines ___ in the sky.",o:["bright","brightly","brighter","brightest"],a:1,why:"修饰动词shine用副词brightly。"},
  {q:"He speaks too ___ for me to understand.",o:["fast","fastly","faster","fastness"],a:0,why:"fast既是形容词也是副词，没有fastly。"}
];

data.grammar[7] = [ // 介词迷宫
  {q:"He was born ___ May 1st, 2000.",o:["in","on","at","of"],a:1,why:"具体某一天用on。"},
  {q:"We have classes ___ Monday ___ Friday.",o:["from; to","between; and","from; until","in; on"],a:0,why:"from...to...从...到...。"},
  {q:"He arrived ___ Beijing yesterday.",o:["in","at","on","to"],a:0,why:"arrive in+大地方（城市），arrive at+小地方。"},
  {q:"He arrived ___ the station at 5:00.",o:["in","at","on","to"],a:1,why:"arrive at+小地方（车站）。"},
  {q:"Look ___ the blackboard, please.",o:["at","on","in","to"],a:0,why:"look at看，固定搭配。"},
  {q:"The cat is ___ the table.",o:["under","on","in","at"],a:0,why:"根据句意，猫在桌子下面用under。"},
  {q:"He is good ___ math.",o:["in","at","on","for"],a:1,why:"be good at擅长，固定搭配。"},
  {q:"She is interested ___ music.",o:["in","at","on","with"],a:0,why:"be interested in对...感兴趣。"},
  {q:"The teacher is strict ___ us.",o:["in","with","on","at"],a:1,why:"be strict with sb对某人严格。"},
  {q:"He is angry ___ me.",o:["with","at","on","to"],a:0,why:"be angry with sb对某人生气。"},
  {q:"There is a bridge ___ the river.",o:["on","over","above","across"],a:1,why:"over指在正上方横跨，桥横跨河上用over。"},
  {q:"He jumped ___ the wall.",o:["over","above","on","across"],a:0,why:"跳过墙用over（越过）。"},
  {q:"Walk ___ the street and turn left.",o:["over","across","through","along"],a:3,why:"along沿着，沿着街走用along。"},
  {q:"He went ___ the forest alone.",o:["over","across","through","along"],a:2,why:"through穿过（内部穿过森林），用through。"},
  {q:"The bank is ___ the post office and the hospital.",o:["between","among","in","on"],a:0,why:"between在两者之间，among在三者或以上之间。"}
];

data.grammar[8] = [ // 连词大桥
  {q:"He was tired, ___ he kept working.",o:["and","but","so","or"],a:1,why:"前后转折，用but（但是）。"},
  {q:"Hurry up, ___ you'll be late.",o:["and","but","so","or"],a:3,why:"否则用or，hurry up or you'll be late。"},
  {q:"He didn't go to school ___ he was ill.",o:["and","but","because","so"],a:2,why:"因为病了所以没去上学，用because。"},
  {q:"He was ill, ___ he didn't go to school.",o:["and","but","because","so"],a:3,why:"所以用so，因果关系。"},
  {q:"___ he is poor, he is happy.",o:["But","Although","Because","If"],a:1,why:"虽然穷但快乐，用Although（虽然）。"},
  {q:"He will come ___ it doesn't rain.",o:["and","but","if","so"],a:2,why:"如果不下雨他会来，用if（如果）。"},
  {q:"He is ___ a teacher ___ a doctor.",o:["both; and","neither; nor","either; or","not only; but also"],a:0,why:"既是老师又是医生，用both...and...。"},
  {q:"He is ___ a teacher ___ a doctor. He is a worker.",o:["both; and","neither; nor","either; or","not only; but also"],a:1,why:"既不是老师也不是医生，用neither...nor...。"},
  {q:"___ you ___ I am right.",o:["Both; and","Neither; nor","Either; or","Not only; but also"],a:2,why:"要么你对要么我对，用either...or...。"},
  {q:"He speaks ___ English ___ French.",o:["both; and","neither; nor","either; or","not only; but also"],a:3,why:"不仅会说英语还会说法语，用not only...but also...。"},
  {q:"I don't know ___ he will come or not.",o:["that","if","what","which"],a:1,why:"whether...or not（是否），if可引导宾语从句表是否。"},
  {q:"Do it ___ you can.",o:["as","like","when","while"],a:0,why:"as you can尽你所能，as引导方式状语从句。"},
  {q:"He speaks English ___ he were an Englishman.",o:["as","like","as if","that"],a:2,why:"as if仿佛，他说话仿佛是英国人。"},
  {q:"You can't learn well ___ you work hard.",o:["if","unless","because","so"],a:1,why:"unless除非=if not，除非努力否则学不好。"},
  {q:"___ you try, ___ you will succeed.",o:["If; then","When; then","As; so","No matter; /"],a:0,why:"If...then...如果...那么...。"}
];

data.grammar[9] = [ // 动词城
  {q:"He ___ to school every day.",o:["walk","walks","walking","walked"],a:1,why:"第三人称单数一般现在时加s：walks。"},
  {q:"He has ___ his homework.",o:["do","did","done","doing"],a:2,why:"has+过去分词构成完成时，do的过去分词是done。"},
  {q:"The teacher made him ___ outside.",o:["stand","to stand","standing","stood"],a:0,why:"make sb do sth，make后接不带to的不定式。"},
  {q:"I saw him ___ the room.",o:["enter","to enter","entering","entered"],a:0,why:"see sb do sth强调全过程，用不带to的不定式。"},
  {q:"I saw him ___ the room when I passed by.",o:["enter","to enter","entering","entered"],a:2,why:"see sb doing sth强调正在进行，用entering。"},
  {q:"He stopped ___ and looked at me.",o:["to read","reading","read","reads"],a:1,why:"stop doing停止正在做的事，停止读书用reading。"},
  {q:"He stopped ___ a letter.",o:["to write","writing","write","writes"],a:0,why:"stop to do停下来去做某事，停下来写信用to write。"},
  {q:"I remember ___ him at the party.",o:["to meet","meeting","meet","met"],a:1,why:"remember doing记得做过某事，记得在聚会上见过用meeting。"},
  {q:"Please remember ___ the door.",o:["to lock","locking","lock","locked"],a:0,why:"remember to do记得要做某事，记得锁门用to lock。"},
  {q:"He spent two hours ___ the book.",o:["read","reading","to read","reads"],a:1,why:"spend time doing sth固定搭配。"},
  {q:"It took me two hours ___ the book.",o:["read","reading","to read","reads"],a:2,why:"It takes sb time to do sth固定句型。"},
  {q:"He is used to ___ up early.",o:["get","getting","got","gets"],a:1,why:"be used to doing习惯于做某事，to是介词。"},
  {q:"He used to ___ up early.",o:["get","getting","got","gets"],a:0,why:"used to do过去常常，后接动词原形。"},
  {q:"Would you mind ___ the window?",o:["open","opening","to open","opened"],a:1,why:"mind doing sth介意做某事，固定搭配。"},
  {q:"He is looking forward to ___ you.",o:["see","seeing","saw","sees"],a:1,why:"look forward to doing，to是介词，后接doing。"}
];

data.grammar[10] = [ // 进行时码头
  {q:"Look! The boys ___ football.",o:["play","plays","are playing","played"],a:2,why:"Look!提示正在进行，用现在进行时are playing。"},
  {q:"Listen! Someone ___ in the room.",o:["sing","sings","is singing","sang"],a:2,why:"Listen!提示正在进行，用is singing。"},
  {q:"He ___ a book now.",o:["read","reads","is reading","readed"],a:2,why:"now提示正在进行，用is reading。"},
  {q:"What ___ you ___ at 8:00 yesterday?",o:["did; do","were; doing","are; doing","do; do"],a:1,why:"at 8:00 yesterday提示过去进行时，were doing。"},
  {q:"He ___ TV when I came in.",o:["watch","watched","was watching","is watching"],a:2,why:"when I came in提示过去某时刻正在进行，用was watching。"},
  {q:"While he ___, the phone rang.",o:["cook","cooked","was cooking","is cooking"],a:2,why:"while引导的从句用进行时，was cooking。"},
  {q:"They ___ a meeting at this time yesterday.",o:["have","had","were having","are having"],a:2,why:"at this time yesterday提示过去进行时。"},
  {q:"He ___ his homework from 7 to 9 last night.",o:["did","was doing","is doing","does"],a:1,why:"from 7 to 9 last night提示过去进行时。"},
  {q:"The water ___ . Please turn off the tap.",o:["boils","is boiling","boiled","was boiling"],a:1,why:"正在沸腾（现在进行时表示此刻状态）。"},
  {q:"He is always ___ others.",o:["help","helps","helping","helped"],a:2,why:"always+进行时表感情色彩，总是帮助别人。"},
  {q:"The train ___ at 10:00 tomorrow.",o:["leaves","is leaving","left","will leave"],a:1,why:"火车明天10点出发，进行时表按计划将要发生的事。"},
  {q:"I ___ for you at the school gate.",o:["wait","waited","am waiting","was waiting"],a:2,why:"正在校门口等你，现在进行时。"}
];

data.grammar[11] = [ // 时光列车
  {q:"He ___ to Beijing last year.",o:["go","goes","went","has gone"],a:2,why:"last year用一般过去时went。"},
  {q:"He ___ to Beijing. He will be back next week.",o:["went","has been","has gone","goes"],a:2,why:"has gone to去了某地还没回来，will be back说明还没回。"},
  {q:"He ___ to Beijing twice.",o:["went","has been","has gone","goes"],a:1,why:"has been to去过某地已回来，twice表示经验。"},
  {q:"I ___ my homework yet.",o:["didn't finish","haven't finished","don't finish","won't finish"],a:1,why:"yet常与现在完成时连用，haven't finished。"},
  {q:"He ___ here since 2010.",o:["lived","has lived","lives","is living"],a:1,why:"since 2010与现在完成时连用，has lived。"},
  {q:"He ___ here for ten years.",o:["lived","has lived","lives","is living"],a:1,why:"for ten years与现在完成时连用。"},
  {q:"By the time he was 10, he ___ 100 books.",o:["read","had read","has read","was reading"],a:1,why:"By the time+过去时，主句用过去完成时had read。"},
  {q:"He said he ___ the film the day before.",o:["saw","had seen","has seen","would see"],a:1,why:"宾语从句时态一致，the day before提示过去完成时。"},
  {q:"If it ___ tomorrow, we won't go out.",o:["rain","rains","will rain","rained"],a:1,why:"主将从现，if从句用一般现在时rains。"},
  {q:"He ___ 20 years old next year.",o:["is","was","will be","has been"],a:2,why:"next year用一般将来时will be。"},
  {q:"There ___ a meeting tomorrow.",o:["is","was","will be","has been"],a:2,why:"tomorrow用将来时will be。"},
  {q:"He ___ in this school since he was 12.",o:["studies","studied","has studied","is studying"],a:2,why:"since从句用现在完成时has studied。"},
  {q:"The film ___ for 10 minutes.",o:["began","has begun","has been on","begins"],a:2,why:"begin是瞬间动词，与for连用改用has been on。"},
  {q:"He ___ the army for 3 years.",o:["joined","has joined","has been in","joins"],a:2,why:"join是瞬间动词，与for连用改用has been in。"},
  {q:"I ___ never ___ such a beautiful place before.",o:["have; seen","had; seen","did; see","do; see"],a:0,why:"before与现在完成时连用，have never seen。"}
];

data.grammar[12] = [ // 句型城堡
  {q:"There ___ a book and two pens on the desk.",o:["is","are","am","be"],a:0,why:"There be就近原则，最近的是a book用is。"},
  {q:"There ___ two pens and a book on the desk.",o:["is","are","am","be"],a:1,why:"就近原则，最近的是two pens用are。"},
  {q:"___ beautiful the girl is!",o:["What","What a","How","How a"],a:2,why:"感叹句修饰形容词beautiful用How。"},
  {q:"___ a beautiful girl she is!",o:["What","What an","How","How a"],a:0,why:"感叹句修饰可数名词单数用What a + adj + n。"},
  {q:"___ good news it is!",o:["What","What a","How","How a"],a:0,why:"news不可数名词，What + adj + 不可数名词，不加a。"},
  {q:"Never ___ such a thing.",o:["I have seen","have I seen","I saw","did I see"],a:1,why:"Never放句首，部分倒装，have I seen。"},
  {q:"Not only ___ a student, but also he is a singer.",o:["he is","is he","he was","was he"],a:1,why:"Not only放句首，部分倒装，is he。"},
  {q:"He asked me ___.",o:["what was the matter","what the matter was","what is the matter","what the matter is"],a:0,why:"what's the matter是固定表达，语序不变，时态与主句一致。"},
  {q:"Could you tell me ___?",o:["where is the bank","where the bank is","where was the bank","the bank is where"],a:1,why:"宾语从句用陈述语序，where the bank is。"},
  {q:"I don't know ___ will happen next.",o:["that","what","which","who"],a:1,why:"什么会发生用what，引导宾语从句。"},
  {q:"He said ___ he would come.",o:["that","what","which","if"],a:0,why:"that引导宾语从句，可省略。"},
  {q:"The question is ___ he will come or not.",o:["that","whether","what","which"],a:1,why:"whether...or not是否，引导表语从句。"},
  {q:"It is important ___ we should learn English well.",o:["that","what","which","if"],a:0,why:"It is important that...，that引导主语从句。"},
  {q:"He is ___ a good teacher ___ all students like him.",o:["so; that","such; that","too; to","very; that"],a:1,why:"such...that如此...以至于，such+名词。"},
  {q:"He speaks ___ fast ___ I can't understand him.",o:["so; that","such; that","too; to","very; that"],a:0,why:"so...that如此...以至于，so+形容词/副词。"}
];

/* ===== 词汇专题真题（按单元） ===== */

function vocabQuestions(unitId, theme, words) {
  var qs = [];
  // 根据单元主题生成词汇真题
  if (unitId === 1) { // 家庭与人物
    qs = [
      {q:"My father's father is my ___.",o:["uncle","grandfather","cousin","brother"],a:1,why:"父亲的父亲是grandfather（爷爷）。"},
      {q:"My mother's sister is my ___.",o:["aunt","uncle","cousin","sister"],a:0,why:"母亲的姐妹是aunt（阿姨/姑姑）。"},
      {q:"My father's brother is my ___.",o:["aunt","uncle","cousin","nephew"],a:1,why:"父亲的兄弟是uncle（叔叔/伯伯）。"},
      {q:"My aunt's child is my ___.",o:["brother","sister","cousin","nephew"],a:2,why:"阿姨的孩子是cousin（表兄弟姐妹）。"},
      {q:"My parents' parents are my ___.",o:["grandparents","uncles","aunts","cousins"],a:0,why:"父母的父母是grandparents（祖父母）。"},
      {q:"She is my mother's daughter, but not my sister. Who is she?",o:["My cousin","My aunt","Me","My mother"],a:2,why:"妈妈的女儿但不是我姐姐，那就是我自己。"},
      {q:"How do you call your father's wife?",o:["Aunt","Mother","Sister","Grandmother"],a:1,why:"父亲的妻子是母亲Mother。"}
    ];
  } else if (unitId === 3) { // 学校与教育
    qs = [
      {q:"We write with a ___ on the blackboard.",o:["pen","chalk","pencil","ruler"],a:1,why:"在黑板上写用粉笔chalk。"},
      {q:"The teacher writes on the ___ with chalk.",o:["desk","blackboard","chair","book"],a:1,why:"老师用粉笔在黑板blackboard上写字。"},
      {q:"Students sit on ___ in the classroom.",o:["desks","chairs","tables","beds"],a:1,why:"学生坐在椅子chairs上。"},
      {q:"We do experiments in the ___.",o:["library","lab","playground","office"],a:1,why:"做实验在实验室lab。"},
      {q:"We borrow books from the ___.",o:["lab","library","classroom","office"],a:1,why:"借书在图书馆library。"},
      {q:"The ___ is in charge of a school.",o:["teacher","headmaster","student","cleaner"],a:1,why:"校长headmaster管理学校。"},
      {q:"We have PE class on the ___.",o:["classroom","playground","lab","library"],a:1,why:"体育课在操场playground上。"}
    ];
  } else if (unitId === 4) { // 动物
    qs = [
      {q:"A ___ can swim but can't fly.",o:["bird","fish","dog","cat"],a:1,why:"鱼fish会游泳但不会飞。"},
      {q:"A ___ can fly.",o:["fish","bird","dog","cat"],a:1,why:"鸟bird会飞。"},
      {q:"A ___ is the king of animals.",o:["tiger","lion","elephant","bear"],a:1,why:"狮子lion是百兽之王。"},
      {q:"A ___ has a long neck.",o:["giraffe","elephant","bear","monkey"],a:0,why:"长颈鹿giraffe有长脖子。"},
      {q:"A ___ has a long trunk (象鼻).",o:["giraffe","elephant","bear","monkey"],a:1,why:"大象elephant有长鼻子。"},
      {q:"A ___ likes bananas.",o:["monkey","cat","dog","rabbit"],a:0,why:"猴子monkey喜欢香蕉。"},
      {q:"A ___ hops and has long ears.",o:["rabbit","cat","dog","pig"],a:0,why:"兔子rabbit跳且长耳朵。"}
    ];
  } else if (unitId === 5) { // 饮食
    qs = [
      {q:"We eat ___ for breakfast in China.",o:["bread","porridge","hamburger","pizza"],a:1,why:"中国人早餐常喝粥porridge。"},
      {q:"We use ___ to drink soup.",o:["fork","spoon","knife","chopsticks"],a:1,why:"喝汤用勺子spoon。"},
      {q:"We use ___ to eat noodles in China.",o:["fork","spoon","knife","chopsticks"],a:3,why:"中国人吃面条用筷子chopsticks。"},
      {q:"___ is a kind of fast food.",o:["Rice","Hamburger","Porridge","Soup"],a:1,why:"汉堡包Hamburger是快餐。"},
      {q:"We drink ___ every day to stay healthy.",o:["cola","water","coffee","beer"],a:1,why:"每天喝水water保持健康。"},
      {q:"Breakfast is the ___ meal of the day.",o:["first","second","third","last"],a:0,why:"早餐是一天的第一顿。"},
      {q:"We eat ___ with meat and vegetables.",o:["rice","water","milk","tea"],a:0,why:"米饭rice配肉和蔬菜。"}
    ];
  } else if (unitId === 10) { // 天气与季节
    qs = [
      {q:"It's ___. Take an umbrella with you.",o:["sunny","rainy","cloudy","windy"],a:1,why:"带雨伞说明下雨rainy。"},
      {q:"It's ___. Put on your coat.",o:["hot","cold","warm","cool"],a:1,why:"穿外套说明冷cold。"},
      {q:"It's ___. Wear sunglasses.",o:["sunny","rainy","snowy","cloudy"],a:0,why:"戴太阳镜说明晴朗sunny。"},
      {q:"We can make snowmen in ___.",o:["spring","summer","autumn","winter"],a:3,why:"冬天winter可以堆雪人。"},
      {q:"Trees turn green in ___.",o:["spring","summer","autumn","winter"],a:0,why:"春天spring树变绿。"},
      {q:"Leaves fall in ___.",o:["spring","summer","autumn","winter"],a:2,why:"秋天autumn落叶。"},
      {q:"It's very ___ in summer. We can swim.",o:["cold","hot","cool","warm"],a:1,why:"夏天很热hot可以游泳。"}
    ];
  } else {
    // 通用词汇真题
    qs = [
      {q:"Which word is related to '" + theme + "'?",o:[words[0]||"A", words[1]||"B", "computer", "internet"],a:0,why:words[0]+"属于"+theme+"主题词汇。"},
      {q:"Which word does NOT belong to '" + theme + "'?",o:[words[0]||"A", words[1]||"B", "computer", words[2]||"C"],a:2,why:"computer不属于"+theme+"主题。"},
      {q:"Choose the correct meaning of '" + (words[0]||"word") + "'.",o:["选项A","选项B","选项C","选项D"],a:0,why:"请查阅词典确认词义。"},
      {q:"'" + (words[1]||"word") + "' is a ___.",o:["noun","verb","adjective","adverb"],a:0,why:"请根据上下文判断词性。"},
      {q:"Fill in: I need a ___ about " + theme + ".",o:[words[0]||"A", words[1]||"B", "nothing", "everything"],a:0,why:words[0]+"与"+theme+"主题相关。"}
    ];
  }
  return qs;
}

// 读取词汇数据生成词汇专题真题
var vocabCode = fs.readFileSync(path.join(__dirname, "..", "src", "scripts", "data", "english-vocab.js"), "utf8");
eval(vocabCode);
VOCAB_DATA.units.forEach(function(u){
  var words = u.words.slice(0, 5).map(function(w){ return w.en; });
  data.vocab[u.id] = vocabQuestions(u.id, u.name, words);
});

/* ===== 阅读技巧真题 ===== */
data.reading = [
  {q:"Read: 'Tom got up at 7:00 this morning.' When did Tom get up?",o:["6:00","7:00","8:00","9:00"],a:1,why:"文中明确说at 7:00，直接找细节答案。"},
  {q:"Read: 'The weather was fine, so we went to the park.' Why did they go to the park?",o:["Because it was hot","Because the weather was fine","Because it was raining","Because they were tired"],a:1,why:"so表因果，天气好所以去公园。"},
  {q:"Read: 'Mary is 12. Her brother is 2 years older than her.' How old is Mary's brother?",o:["10","12","14","16"],a:2,why:"Mary 12岁，哥哥大2岁，12+2=14。"},
  {q:"Read: 'There are 24 students in the class. 10 are boys.' How many girls are there?",o:["10","14","24","34"],a:1,why:"24-10=14个女生。"},
  {q:"Read: 'The library is open from 9:00 to 17:00.' How long is the library open?",o:["7 hours","8 hours","9 hours","10 hours"],a:1,why:"17-9=8小时。"},
  {q:"Read: 'He was happy because he passed the exam.' How did he feel?",o:["Sad","Happy","Angry","Tired"],a:1,why:"文中说He was happy。"},
  {q:"Read: 'It took me 30 minutes to walk to school.' How did the writer go to school?",o:["By bus","By car","On foot","By bike"],a:2,why:"walk步行=on foot。"},
  {q:"Read: 'The red bag is 50 yuan. The blue bag is 30 yuan.' Which is cheaper?",o:["The red bag","The blue bag","They are the same","We don't know"],a:1,why:"蓝色包30元<红色包50元，蓝色更便宜。"},
  {q:"Read: 'Today is Monday. Tomorrow is my birthday.' What day is the writer's birthday?",o:["Monday","Tuesday","Wednesday","Sunday"],a:1,why:"今天是Monday，明天是Tuesday。"},
  {q:"Read: 'She has long hair and big eyes.' What does she look like?",o:["Short hair, small eyes","Long hair, big eyes","Short hair, big eyes","Long hair, small eyes"],a:1,why:"文中说long hair and big eyes。"}
];

/* ===== 作文技巧真题 ===== */
data.writing = [
  {q:"作文开头应该怎么写?",o:["直接进入主题","用问候语开头","引用名言或设问引入","随便写"],a:2,why:"好的开头用引用名言或设问引入，吸引读者注意。"},
  {q:"写人的作文应该包含什么?",o:["外貌描写","性格描写","爱好描写","以上都对"],a:3,why:"写人要包含外貌、性格、爱好等多方面描写。"},
  {q:"记事作文的六要素是?",o:["时间、地点、人物","起因、经过、结果","以上都是","以上都不是"],a:2,why:"记事六要素：时间、地点、人物、起因、经过、结果。"},
  {q:"英语作文中，每段开头应该?",o:["缩进","顶格","随意","加大字号"],a:0,why:"英语作文每段开头应缩进（通常4-5个空格）。"},
  {q:"写日记的格式，日期应该写在?",o:["左上角","右上角","正中间","底部"],a:1,why:"英语日记日期通常写在右上角。"},
  {q:"看图作文的关键是?",o:["仔细观察图片","发挥想象","逻辑连贯","以上都对"],a:3,why:"看图作文需要观察图片、发挥想象、逻辑连贯。"},
  {q:"作文结尾应该?",o:["突然结束","总结全文或抒发感情","重复开头","随便写"],a:1,why:"好的结尾应总结全文或抒发感情，首尾呼应。"},
  {q:"英语作文中，句子之间应该用___连接。",o:["逗号","句号","分号","随意"],a:1,why:"完整句子之间用句号分隔。"},
  {q:"写好英语作文的基础是?",o:["词汇量大","语法正确","多读多练","以上都对"],a:3,why:"词汇、语法、多读多练都是写好作文的基础。"},
  {q:"分类作文是按___来分的。",o:["时间","地点","主题","人物"],a:2,why:"分类作文按主题分类，如写人、记事、写景等。"}
];

/* ===== 生成输出 ===== */
var grammarCount = 0;
Object.keys(data.grammar).forEach(function(k){ grammarCount += data.grammar[k].length; });
var vocabCount = 0;
Object.keys(data.vocab).forEach(function(k){ vocabCount += data.vocab[k].length; });
var totalCount = grammarCount + vocabCount + data.reading.length + data.writing.length;

var out = "// AUTO-GENERATED by build/gen-topic-exam.js — 专题真题\n";
out += "// 语法" + Object.keys(data.grammar).length + "章 " + grammarCount + "题, 词汇" + Object.keys(data.vocab).length + "单元 " + vocabCount + "题, 阅读" + data.reading.length + "题, 作文" + data.writing.length + "题\n";
out += "var TOPIC_EXAM_DATA = " + JSON.stringify(data, null, 2) + ";\n";

var outPath = path.join(__dirname, "..", "src", "scripts", "data", "english-topic-exam.js");
fs.writeFileSync(outPath, out, "utf8");
console.log("Generated " + outPath);
console.log("Grammar: " + Object.keys(data.grammar).length + " chapters, " + grammarCount + " questions");
console.log("Vocab: " + Object.keys(data.vocab).length + " units, " + vocabCount + " questions");
console.log("Reading: " + data.reading.length + " questions");
console.log("Writing: " + data.writing.length + " questions");
console.log("Total: " + totalCount + " questions");