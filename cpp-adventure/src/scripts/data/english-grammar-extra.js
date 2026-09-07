/* ---------------- 英语语法扩题数据（自动生成，请勿手改） ----------------
 * 由 build/gen-english-extra.js 生成。给每例补 lv:2/3 题，并新增第 13 章 30 题综合模拟。
 * 在 english-grammar.js 之后加载，直接修改 EQ_DATA。
 */
(function(){
  // 1) 现有题目标记 lv:1
  EQ_DATA.lessons.forEach(function(l){
    l.q.forEach(function(q){ if (!q.lv) q.lv = 1; });
  });

  // 2) 按章节追加 lv:2/3 题
  var EXTRA = {
  "n1": [
    {
      "q": "「She is my ___ teacher.」中哪个是名词？",
      "o": [
        "my",
        "teacher",
        "is"
      ],
      "a": 1,
      "why": "teacher 是「老师」，表示人，是名词；my 是代词，is 是动词。",
      "lv": 2
    },
    {
      "q": "下面哪个不是名词？",
      "o": [
        "desk 书桌",
        "beautiful 美丽的",
        "water 水"
      ],
      "a": 1,
      "why": "beautiful 是形容词「美丽的」，描述样子不是名词。",
      "lv": 2
    },
    {
      "q": "「The ___ are flying in the sky.」横线处填名词复数，正确的是？",
      "o": [
        "bird",
        "birds",
        "birdes"
      ],
      "a": 1,
      "why": "birds 是 bird 的正确复数（直接加 s），作主语要用复数。",
      "lv": 3
    },
    {
      "q": "哪个句子名词用法正确？",
      "o": [
        "I have a happiness.",
        "I have a book.",
        "I have a waters."
      ],
      "a": 1,
      "why": "happiness 是抽象名词通常不加 a；water 不可数不加 s 也不加 a；book 可数加 a 正确。",
      "lv": 3
    }
  ],
  "n2": [
    {
      "q": "「三只猫」英语是？",
      "o": [
        "three cat",
        "three cats",
        "three cates"
      ],
      "a": 1,
      "why": "可数名词复数直接加 s：three cats。",
      "lv": 2
    },
    {
      "q": "下面哪个是不可数名词？",
      "o": [
        "apple",
        "bread",
        "egg"
      ],
      "a": 1,
      "why": "面包不可数（不能说 one bread, two breads）；苹果和鸡蛋可数。",
      "lv": 2
    },
    {
      "q": "「I want ___ orange juice.」正确的是？",
      "o": [
        "two",
        "two glass of",
        "two glasses of"
      ],
      "a": 2,
      "why": "juice 不可数，量词 glass 要复数：two glasses of orange juice。",
      "lv": 3
    },
    {
      "q": "哪个表达错误？",
      "o": [
        "a pen",
        "two pens",
        "two pen"
      ],
      "a": 2,
      "why": "two pen 错：两个以上要加 s，应为 two pens。",
      "lv": 3
    }
  ],
  "n3": [
    {
      "q": "「five ___」五把椅子，填？",
      "o": [
        "chair",
        "chairs",
        "chairies"
      ],
      "a": 1,
      "why": "chair 直接加 s 变 chairs。",
      "lv": 2
    },
    {
      "q": "pen 的复数是？",
      "o": [
        "penes",
        "pens",
        "penies"
      ],
      "a": 1,
      "why": "pen 以辅音结尾，直接加 s：pens。",
      "lv": 2
    },
    {
      "q": "「The ___ are reading books.」填？",
      "o": [
        "boy",
        "boys",
        "boies"
      ],
      "a": 1,
      "why": "boy 以元音字母+ y 结尾，直接加 s：boys。",
      "lv": 3
    },
    {
      "q": "哪个复数形式错误？",
      "o": [
        "cats",
        "dogs",
        "mans"
      ],
      "a": 2,
      "why": "mans 错：man 的复数是不规则变化 men。",
      "lv": 3
    }
  ],
  "n4": [
    {
      "q": "「两块手表」是？",
      "o": [
        "two watch",
        "two watchs",
        "two watches"
      ],
      "a": 2,
      "why": "watch 以 ch 结尾，要加 es：watches。",
      "lv": 2
    },
    {
      "q": "box 的复数是？",
      "o": [
        "boxs",
        "boxes",
        "boxies"
      ],
      "a": 1,
      "why": "box 以 x 结尾，加 es：boxes。",
      "lv": 2
    },
    {
      "q": "「three ___」三个班级，填？",
      "o": [
        "class",
        "classes",
        "classs"
      ],
      "a": 1,
      "why": "class 以 s 结尾，加 es：classes。",
      "lv": 3
    },
    {
      "q": "哪个加 es 正确？",
      "o": [
        "bus→buses",
        "book→bookes",
        "pen→penes"
      ],
      "a": 0,
      "why": "bus 以 s 结尾加 es 正确；book 和 pen 直接加 s。",
      "lv": 3
    }
  ],
  "n5": [
    {
      "q": "city 的复数是？",
      "o": [
        "citys",
        "cities",
        "cityes"
      ],
      "a": 1,
      "why": "c 是辅音字母，y 变 i 加 es：cities。",
      "lv": 2
    },
    {
      "q": "boy 的复数是？",
      "o": [
        "boys",
        "boies",
        "boyes"
      ],
      "a": 0,
      "why": "b 后面 o 是元音字母，y 不变，直接加 s：boys。",
      "lv": 2
    },
    {
      "q": "「两个婴儿」是？",
      "o": [
        "two babys",
        "two babies",
        "two babyes"
      ],
      "a": 1,
      "why": "b 是辅音字母，y 变 i 加 es：babies。",
      "lv": 3
    },
    {
      "q": "key 的复数是？",
      "o": [
        "keys",
        "keies",
        "keyes"
      ],
      "a": 0,
      "why": "e 是元音字母，y 不变，直接加 s：keys。",
      "lv": 3
    }
  ],
  "n6": [
    {
      "q": "knife 的复数是？",
      "o": [
        "knifes",
        "knives",
        "knifes"
      ],
      "a": 1,
      "why": "fe 变 ves：knives。",
      "lv": 2
    },
    {
      "q": "leaf 的复数是？",
      "o": [
        "leafs",
        "leaves",
        "leafes"
      ],
      "a": 1,
      "why": "f 变 ves：leaves。",
      "lv": 2
    },
    {
      "q": "「那些狼」是？",
      "o": [
        "those wolfs",
        "those wolves",
        "those wolfes"
      ],
      "a": 1,
      "why": "f 变 ves：wolves。",
      "lv": 3
    },
    {
      "q": "下面哪个复数变化正确？",
      "o": [
        "shelf→shelfs",
        "shelf→shelves",
        "shelf→shelfes"
      ],
      "a": 1,
      "why": "shelf 以 f 结尾，f 变 v 加 es：shelves。",
      "lv": 3
    }
  ],
  "n7": [
    {
      "q": "man 的复数是？",
      "o": [
        "mans",
        "men",
        "manes"
      ],
      "a": 1,
      "why": "man 是不规则变化：men。",
      "lv": 2
    },
    {
      "q": "foot 的复数是？",
      "o": [
        "foots",
        "feet",
        "footes"
      ],
      "a": 1,
      "why": "foot 是不规则变化：feet。",
      "lv": 2
    },
    {
      "q": "「三个孩子」是？",
      "o": [
        "three childs",
        "three children",
        "three childes"
      ],
      "a": 1,
      "why": "child 是不规则变化：children。",
      "lv": 3
    },
    {
      "q": "mouse 的复数是？",
      "o": [
        "mouses",
        "mice",
        "mouses"
      ],
      "a": 1,
      "why": "mouse 是不规则变化：mice。",
      "lv": 3
    }
  ],
  "n8": [
    {
      "q": "「一些牛奶」是？",
      "o": [
        "a milk",
        "some milks",
        "some milk"
      ],
      "a": 2,
      "why": "milk 不可数，不加 a 也不加 s，用 some milk。",
      "lv": 2
    },
    {
      "q": "下面哪个不可数？",
      "o": [
        "apple",
        "water",
        "book"
      ],
      "a": 1,
      "why": "水不可数；苹果和书可数。",
      "lv": 2
    },
    {
      "q": "「三片面包」是？",
      "o": [
        "three breads",
        "three bread",
        "three pieces of bread"
      ],
      "a": 2,
      "why": "bread 不可数，用量词：three pieces of bread。",
      "lv": 3
    },
    {
      "q": "哪个表达正确？",
      "o": [
        "a water",
        "two waters",
        "a glass of water"
      ],
      "a": 2,
      "why": "water 不可数，不能加 a 或复数，只能用量词 a glass of water。",
      "lv": 3
    }
  ],
  "n9": [
    {
      "q": "「我爸爸的车」是？",
      "o": [
        "my father car",
        "my father's car",
        "my fathers car"
      ],
      "a": 1,
      "why": "单数名词所有格加 's：father's。",
      "lv": 2
    },
    {
      "q": "「学生们的书」是？",
      "o": [
        "the student's books",
        "the students' books",
        "the students's books"
      ],
      "a": 1,
      "why": "students 已以 s 结尾，只加撇号：students'。",
      "lv": 2
    },
    {
      "q": "「Tom and Jerry's room」的意思是？",
      "o": [
        "Tom 的房间和 Jerry 的房间",
        "Tom 和 Jerry 共用的房间",
        "Tom 的房间和 Jerry 的"
      ],
      "a": 1,
      "why": "两人共有的东西，只在最后一人加 's。",
      "lv": 3
    },
    {
      "q": "「women's hats」的意思是？",
      "o": [
        "女人的帽子",
        "女人的帽子（一个女人的）",
        "女人是帽子"
      ],
      "a": 0,
      "why": "women 是不规则复数（不以 s 结尾），加 's：women's 表示「女人们的」。",
      "lv": 3
    }
  ],
  "a1": [
    {
      "q": "___ orange 是？",
      "o": [
        "a",
        "an",
        "the"
      ],
      "a": 1,
      "why": "orange 以元音音素 /ɒ/ 开头，用 an。",
      "lv": 2
    },
    {
      "q": "___ book 是？",
      "o": [
        "a",
        "an",
        "the"
      ],
      "a": 0,
      "why": "book 以辅音音素 /b/ 开头，用 a。",
      "lv": 2
    },
    {
      "q": "___ honest boy 是？",
      "o": [
        "a",
        "an",
        "the"
      ],
      "a": 1,
      "why": "honest 的 h 不发音，开头是元音音素 /ɒ/，用 an。",
      "lv": 3
    },
    {
      "q": "___ university 是？",
      "o": [
        "a",
        "an",
        "the"
      ],
      "a": 0,
      "why": "university 开头 u 读 /juː/，是辅音音素，用 a。",
      "lv": 3
    }
  ],
  "a2": [
    {
      "q": "I see ___ bird. ___ bird is blue.",
      "o": [
        "a, The",
        "the, A",
        "an, The"
      ],
      "a": 0,
      "why": "第一次提到用 a，第二次特指用 the。",
      "lv": 2
    },
    {
      "q": "She has ___ umbrella. ___ umbrella is red.",
      "o": [
        "a, A",
        "an, The",
        "the, An"
      ],
      "a": 1,
      "why": "umbrella 元音开头用 an；第二次特指用 the。",
      "lv": 2
    },
    {
      "q": "There is ___ cat under the table. ___ cat is sleeping.",
      "o": [
        "a, The",
        "the, A",
        "an, The"
      ],
      "a": 0,
      "why": "第一次用 a cat，第二次特指用 the cat。",
      "lv": 3
    },
    {
      "q": "哪个冠词使用正确？",
      "o": [
        "I have a apple.",
        "I have an dog.",
        "I have an egg."
      ],
      "a": 2,
      "why": "egg 元音开头用 an 正确；apple 应用 an；dog 应用 a。",
      "lv": 3
    }
  ],
  "a3": [
    {
      "q": "___ moon is bright tonight.",
      "o": [
        "A",
        "An",
        "The"
      ],
      "a": 2,
      "why": "月亮独一无二，用 the。",
      "lv": 2
    },
    {
      "q": "Close ___ door, please.",
      "o": [
        "a",
        "an",
        "the"
      ],
      "a": 2,
      "why": "都知道是哪扇门，特指用 the。",
      "lv": 2
    },
    {
      "q": "___ Yellow River is very long.",
      "o": [
        "A",
        "An",
        "The"
      ],
      "a": 2,
      "why": "河流名称前用 the：the Yellow River。",
      "lv": 3
    },
    {
      "q": "___ Great Wall is famous.",
      "o": [
        "A",
        "An",
        "The"
      ],
      "a": 2,
      "why": "独一无二的名胜用 the：the Great Wall。",
      "lv": 3
    }
  ],
  "a4": [
    {
      "q": "I like playing ___ basketball.",
      "o": [
        "a",
        "the",
        "不填"
      ],
      "a": 2,
      "why": "球类运动前零冠词：play basketball。",
      "lv": 2
    },
    {
      "q": "She can play ___ piano.",
      "o": [
        "a",
        "the",
        "不填"
      ],
      "a": 1,
      "why": "乐器前要加 the：play the piano。",
      "lv": 2
    },
    {
      "q": "Let's play ___ chess after school.",
      "o": [
        "a",
        "the",
        "不填"
      ],
      "a": 2,
      "why": "棋类前零冠词：play chess。",
      "lv": 3
    },
    {
      "q": "哪个表达正确？",
      "o": [
        "play the football",
        "play football",
        "play a football"
      ],
      "a": 1,
      "why": "球类前零冠词：play football。",
      "lv": 3
    }
  ],
  "a5": [
    {
      "q": "I have ___ breakfast at 7.",
      "o": [
        "a",
        "the",
        "不填"
      ],
      "a": 2,
      "why": "三餐前零冠词：have breakfast。",
      "lv": 2
    },
    {
      "q": "We play ___ after school.",
      "o": [
        "a football",
        "football",
        "the football"
      ],
      "a": 1,
      "why": "球类前零冠词：play football。",
      "lv": 2
    },
    {
      "q": "___ Smiths are having dinner.",
      "o": [
        "A",
        "An",
        "The"
      ],
      "a": 2,
      "why": "姓氏复数前加 the 表示「一家人」：the Smiths。",
      "lv": 3
    },
    {
      "q": "哪个表达正确？",
      "o": [
        "go to the school",
        "go to school",
        "go to a school"
      ],
      "a": 1,
      "why": "go to school 表示「去上学」是固定搭配，零冠词。",
      "lv": 3
    }
  ],
  "a6": [
    {
      "q": "He is ___ honest man.",
      "o": [
        "a",
        "an",
        "the"
      ],
      "a": 1,
      "why": "honest 的 h 不发音，元音音素开头用 an。",
      "lv": 2
    },
    {
      "q": "It took ___ hour to finish.",
      "o": [
        "a",
        "an",
        "the"
      ],
      "a": 1,
      "why": "hour 的 h 不发音，元音音素开头用 an。",
      "lv": 2
    },
    {
      "q": "She is ___ 8-year-old girl.",
      "o": [
        "a",
        "an",
        "the"
      ],
      "a": 1,
      "why": "8 读 /eɪt/，元音音素开头用 an。",
      "lv": 3
    },
    {
      "q": "That's ___ useful dictionary.",
      "o": [
        "a",
        "an",
        "the"
      ],
      "a": 0,
      "why": "useful 开头 u 读 /juː/，辅音音素开头用 a。",
      "lv": 3
    }
  ],
  "a7": [
    {
      "q": "___ sun is shining.",
      "o": [
        "A",
        "An",
        "The"
      ],
      "a": 2,
      "why": "太阳独一无二，用 the。",
      "lv": 2
    },
    {
      "q": "Please pass me ___ salt.",
      "o": [
        "a",
        "an",
        "the"
      ],
      "a": 2,
      "why": "都知道是哪份盐，特指用 the。",
      "lv": 2
    },
    {
      "q": "___ Pacific Ocean is the largest ocean.",
      "o": [
        "A",
        "An",
        "The"
      ],
      "a": 2,
      "why": "海洋名称前用 the：the Pacific Ocean。",
      "lv": 3
    },
    {
      "q": "___ Spring Festival is coming.",
      "o": [
        "A",
        "An",
        "The"
      ],
      "a": 2,
      "why": "传统节日前用 the：the Spring Festival。",
      "lv": 3
    }
  ],
  "a8": [
    {
      "q": "My father is ___ teacher.",
      "o": [
        "a",
        "an",
        "the"
      ],
      "a": 0,
      "why": "teacher 辅音开头用 a，表示职业。",
      "lv": 2
    },
    {
      "q": "She works in ___ hospital.",
      "o": [
        "a",
        "an",
        "the"
      ],
      "a": 0,
      "why": "hospital 辅音开头用 a，泛指一家医院。",
      "lv": 2
    },
    {
      "q": "He was made ___ monitor of our class.",
      "o": [
        "a",
        "an",
        "the"
      ],
      "a": 2,
      "why": "表示头衔职务时零冠词，但这里指「那个班长」用 the。",
      "lv": 3
    },
    {
      "q": "What ___ heavy rain!",
      "o": [
        "a",
        "an",
        "the"
      ],
      "a": 0,
      "why": "heavy 辅音开头，what a + 形容词 + 名词：what a heavy rain。",
      "lv": 3
    }
  ],
  "p1": [
    {
      "q": "___ am a student.",
      "o": [
        "I",
        "Me",
        "My"
      ],
      "a": 0,
      "why": "作主语用主格 I。",
      "lv": 2
    },
    {
      "q": "___ is my friend.",
      "o": [
        "He",
        "Him",
        "His"
      ],
      "a": 0,
      "why": "作主语用主格 He。",
      "lv": 2
    },
    {
      "q": "___ are going to the park.",
      "o": [
        "Us",
        "We",
        "Our"
      ],
      "a": 1,
      "why": "作主语用主格 We。",
      "lv": 3
    },
    {
      "q": "Please help ___ with the homework.",
      "o": [
        "I",
        "me",
        "my"
      ],
      "a": 1,
      "why": "作宾语用宾格 me。",
      "lv": 3
    }
  ],
  "p2": [
    {
      "q": "This book is ___.",
      "o": [
        "my",
        "mine",
        "me"
      ],
      "a": 1,
      "why": "后面没有名词，用名词性物主代词 mine。",
      "lv": 2
    },
    {
      "q": "That is ___ pen.",
      "o": [
        "my",
        "mine",
        "me"
      ],
      "a": 0,
      "why": "后面有名词 pen，用形容词性物主代词 my。",
      "lv": 2
    },
    {
      "q": "These shoes are ___.",
      "o": [
        "her",
        "hers",
        "she"
      ],
      "a": 1,
      "why": "后面没有名词，用名词性物主代词 hers。",
      "lv": 3
    },
    {
      "q": "___ bag is on the desk.",
      "o": [
        "His",
        "He",
        "Him"
      ],
      "a": 0,
      "why": "后面有名词 bag，用形容词性物主代词 His。",
      "lv": 3
    }
  ],
  "p3": [
    {
      "q": "I can do it by ___.",
      "o": [
        "me",
        "myself",
        "my"
      ],
      "a": 1,
      "why": "反身代词 by myself 表示「我自己」。",
      "lv": 2
    },
    {
      "q": "She hurt ___ while playing.",
      "o": [
        "her",
        "herself",
        "she"
      ],
      "a": 1,
      "why": "反身代词作宾语：hurt herself。",
      "lv": 2
    },
    {
      "q": "The cat is washing ___.",
      "o": [
        "it",
        "itself",
        "its"
      ],
      "a": 1,
      "why": "反身代词：washing itself。",
      "lv": 3
    },
    {
      "q": "We enjoyed ___ at the party.",
      "o": [
        "us",
        "ourselves",
        "our"
      ],
      "a": 1,
      "why": "反身代词：enjoyed ourselves。",
      "lv": 3
    }
  ],
  "p4": [
    {
      "q": "This is ___ for you and me.",
      "o": [
        "our",
        "ours",
        "us"
      ],
      "a": 2,
      "why": "作宾语用宾格 us。",
      "lv": 2
    },
    {
      "q": "___ of them like swimming.",
      "o": [
        "Both",
        "All",
        "Every"
      ],
      "a": 0,
      "why": "两者都用 both；三者以上用 all。",
      "lv": 2
    },
    {
      "q": "___ student should hand in homework.",
      "o": [
        "Every",
        "All",
        "Both"
      ],
      "a": 0,
      "why": "every 后接单数名词：every student。",
      "lv": 3
    },
    {
      "q": "___ side of the street has trees.",
      "o": [
        "Both",
        "All",
        "Every"
      ],
      "a": 0,
      "why": "两边都用 both sides。",
      "lv": 3
    }
  ],
  "p5": [
    {
      "q": "I have two pens. One is red, ___ is blue.",
      "o": [
        "other",
        "the other",
        "another"
      ],
      "a": 1,
      "why": "两支笔，一支红，另一支用 the other。",
      "lv": 2
    },
    {
      "q": "I don't like this one. Show me ___ .",
      "o": [
        "other",
        "another",
        "the other"
      ],
      "a": 1,
      "why": "泛指「另一个」用 another。",
      "lv": 2
    },
    {
      "q": "Some are reading, ___ are writing.",
      "o": [
        "other",
        "others",
        "the others"
      ],
      "a": 1,
      "why": "some...others... 表示「一些……另一些……」。",
      "lv": 3
    },
    {
      "q": "I have three pens. One is here, where are ___ ?",
      "o": [
        "other",
        "others",
        "the others"
      ],
      "a": 2,
      "why": "三支笔，一支在这，其余的用 the others。",
      "lv": 3
    }
  ],
  "p6": [
    {
      "q": "Is there ___ in the room?",
      "o": [
        "someone",
        "anyone",
        "no one"
      ],
      "a": 1,
      "why": "疑问句用 anyone。",
      "lv": 2
    },
    {
      "q": "There is ___ wrong with my bike.",
      "o": [
        "something",
        "anything",
        "nothing"
      ],
      "a": 0,
      "why": "肯定句用 something。",
      "lv": 2
    },
    {
      "q": "I can't see ___ in the dark.",
      "o": [
        "something",
        "anything",
        "nothing"
      ],
      "a": 1,
      "why": "否定句用 anything。",
      "lv": 3
    },
    {
      "q": "___ is better than nothing.",
      "o": [
        "Something",
        "Anything",
        "Nothing"
      ],
      "a": 0,
      "why": "肯定句用 something，谚语「有总比没有好」。",
      "lv": 3
    }
  ],
  "p7": [
    {
      "q": "This is the book ___ I bought yesterday.",
      "o": [
        "who",
        "which",
        "what"
      ],
      "a": 1,
      "why": "物用 which/that 作关系代词。",
      "lv": 2
    },
    {
      "q": "The man ___ is talking is my father.",
      "o": [
        "who",
        "which",
        "what"
      ],
      "a": 0,
      "why": "人用 who/that 作关系代词。",
      "lv": 2
    },
    {
      "q": "I know the girl ___ father is a doctor.",
      "o": [
        "who",
        "whose",
        "which"
      ],
      "a": 1,
      "why": "表示「谁的」用 whose。",
      "lv": 3
    },
    {
      "q": "This is the house ___ we live in.",
      "o": [
        "who",
        "which",
        "what"
      ],
      "a": 1,
      "why": "物用 which/that。",
      "lv": 3
    }
  ],
  "p8": [
    {
      "q": "___ are my books.",
      "o": [
        "This",
        "These",
        "That"
      ],
      "a": 1,
      "why": "复数用 these。",
      "lv": 2
    },
    {
      "q": "___ is my pen.",
      "o": [
        "This",
        "These",
        "Those"
      ],
      "a": 0,
      "why": "单数用 this。",
      "lv": 2
    },
    {
      "q": "Look at ___ stars in the sky.",
      "o": [
        "this",
        "these",
        "that"
      ],
      "a": 1,
      "why": "复数且距离近用 these。",
      "lv": 3
    },
    {
      "q": "___ books over there are mine.",
      "o": [
        "This",
        "These",
        "Those"
      ],
      "a": 2,
      "why": "复数且距离远用 those。",
      "lv": 3
    }
  ],
  "p9": [
    {
      "q": "What is ___ name?",
      "o": [
        "you",
        "your",
        "yours"
      ],
      "a": 1,
      "why": "后面有名词 name，用形容词性物主代词 your。",
      "lv": 2
    },
    {
      "q": "___ are classmates.",
      "o": [
        "Us",
        "We",
        "Our"
      ],
      "a": 1,
      "why": "作主语用主格 We。",
      "lv": 2
    },
    {
      "q": "The teacher asked ___ to read.",
      "o": [
        "we",
        "us",
        "our"
      ],
      "a": 1,
      "why": "作宾语用宾格 us。",
      "lv": 3
    },
    {
      "q": "Is this pen ___?",
      "o": [
        "your",
        "yours",
        "you"
      ],
      "a": 1,
      "why": "后面没有名词，用名词性物主代词 yours。",
      "lv": 3
    }
  ],
  "p10": [
    {
      "q": "He teaches ___ English.",
      "o": [
        "us",
        "we",
        "our"
      ],
      "a": 0,
      "why": "作宾语用宾格 us。",
      "lv": 2
    },
    {
      "q": "Let ___ go first.",
      "o": [
        "me",
        "I",
        "my"
      ],
      "a": 0,
      "why": "let 后接宾格 me。",
      "lv": 2
    },
    {
      "q": "It was ___ who broke the window.",
      "o": [
        "me",
        "I",
        "my"
      ],
      "a": 1,
      "why": "强调句型用主格 I。",
      "lv": 3
    },
    {
      "q": "___ is raining hard.",
      "o": [
        "It",
        "This",
        "That"
      ],
      "a": 0,
      "why": "表示天气用 it：It is raining。",
      "lv": 3
    }
  ],
  "p11": [
    {
      "q": "There are many trees on ___ side of the river.",
      "o": [
        "each",
        "every",
        "both"
      ],
      "a": 0,
      "why": "两侧各一边用 each side。",
      "lv": 2
    },
    {
      "q": "___ of the students has a book.",
      "o": [
        "Each",
        "Every",
        "Both"
      ],
      "a": 0,
      "why": "each of + 复数名词，谓语用单数。",
      "lv": 2
    },
    {
      "q": "We have ___ time left. Hurry up!",
      "o": [
        "little",
        "a little",
        "few"
      ],
      "a": 0,
      "why": "time 不可数，几乎没有用 little（表否定）。",
      "lv": 3
    },
    {
      "q": "I have ___ friends here. Let's play together.",
      "o": [
        "few",
        "a few",
        "little"
      ],
      "a": 1,
      "why": "friends 可数，有一些用 a few（表肯定）。",
      "lv": 3
    }
  ],
  "num1": [
    {
      "q": "My birthday is on May ___.",
      "o": [
        "five",
        "fifth",
        "fiveth"
      ],
      "a": 1,
      "why": "日期用序数词：the fifth → May fifth。",
      "lv": 2
    },
    {
      "q": "There are ___ days in a week.",
      "o": [
        "seven",
        "seventh",
        "seventh"
      ],
      "a": 0,
      "why": "数量用基数词：seven。",
      "lv": 2
    },
    {
      "q": "He is the ___ to arrive.",
      "o": [
        "one",
        "first",
        "oneth"
      ],
      "a": 1,
      "why": "顺序用序数词：first。",
      "lv": 3
    },
    {
      "q": "March ___ is Women's Day.",
      "o": [
        "eight",
        "eighth",
        "eightth"
      ],
      "a": 1,
      "why": "日期用序数词：eighth。",
      "lv": 3
    }
  ],
  "num2": [
    {
      "q": "1st 表示？",
      "o": [
        "第一",
        "一",
        "十一"
      ],
      "a": 0,
      "why": "1st = first = 第一。",
      "lv": 2
    },
    {
      "q": "3rd 表示？",
      "o": [
        "三",
        "第三",
        "三十"
      ],
      "a": 1,
      "why": "3rd = third = 第三。",
      "lv": 2
    },
    {
      "q": "22nd 表示？",
      "o": [
        "二十二",
        "第二十二",
        "第二"
      ],
      "a": 1,
      "why": "22nd = twenty-second = 第二十二。",
      "lv": 3
    },
    {
      "q": "下面哪个序数词拼写正确？",
      "o": [
        "fiveth",
        "ninth",
        "twelveth"
      ],
      "a": 1,
      "why": "nine→ninth（去 e 加 th）；five→fifth（ve 变 f 加 th）；twelve→twelfth。",
      "lv": 3
    }
  ],
  "num3": [
    {
      "q": "1999 读作？",
      "o": [
        "nineteen ninety-nine",
        "one thousand nine hundred ninety-nine",
        "nineteen hundred ninety-nine"
      ],
      "a": 0,
      "why": "年份四位分两段读：nineteen ninety-nine。",
      "lv": 2
    },
    {
      "q": "2008 读作？",
      "o": [
        "two thousand and eight",
        "twenty zero eight",
        "two zero zero eight"
      ],
      "a": 0,
      "why": "2000 后的年份：two thousand and eight。",
      "lv": 2
    },
    {
      "q": "7:30 读作？",
      "o": [
        "seven thirty",
        "half past seven",
        "both A and B"
      ],
      "a": 2,
      "why": "7:30 既可以读 seven thirty 也可以读 half past seven。",
      "lv": 3
    },
    {
      "q": "6:45 可以读作？",
      "o": [
        "six forty-five",
        "a quarter to seven",
        "both A and B"
      ],
      "a": 2,
      "why": "两种读法都对。",
      "lv": 3
    }
  ],
  "num4": [
    {
      "q": "102 读作？",
      "o": [
        "one hundred and two",
        "one hundred two",
        "a hundred two"
      ],
      "a": 0,
      "why": "百位和十位/个位之间加 and：one hundred and two。",
      "lv": 2
    },
    {
      "q": "365 天是？",
      "o": [
        "three hundred sixty-five days",
        "three hundred and sixty-five days",
        "three hundreds and sixty-five days"
      ],
      "a": 1,
      "why": "百位和十位间加 and，hundred 不加 s。",
      "lv": 2
    },
    {
      "q": "5,000 读作？",
      "o": [
        "five thousand",
        "five thousands",
        "five of thousand"
      ],
      "a": 0,
      "why": "thousand 前有数字不加 s：five thousand。",
      "lv": 3
    },
    {
      "q": "几百人 用英语说？",
      "o": [
        "hundreds of people",
        "hundred of people",
        "hundreds people"
      ],
      "a": 0,
      "why": "表示「数百」用 hundreds of，hundreds 加 s。",
      "lv": 3
    }
  ],
  "num5": [
    {
      "q": "2 × 3 = 6 读作？",
      "o": [
        "Two times three is six.",
        "Two and three is six.",
        "Two multiply three is six."
      ],
      "a": 0,
      "why": "乘法读 times：Two times three is six。",
      "lv": 2
    },
    {
      "q": "8 ÷ 2 = 4 读作？",
      "o": [
        "Eight divided by two is four.",
        "Eight divide two is four.",
        "Eight over two is four."
      ],
      "a": 0,
      "why": "除法读 divided by：Eight divided by two is four。",
      "lv": 2
    },
    {
      "q": "12 - 5 = 7 读作？",
      "o": [
        "Twelve minus five is seven.",
        "Twelve subtract five is seven.",
        "Twelve take five is seven."
      ],
      "a": 0,
      "why": "减法读 minus：Twelve minus five is seven。",
      "lv": 3
    },
    {
      "q": "第 100 用英语说？",
      "o": [
        "one hundredth",
        "one hundredthth",
        "hundred"
      ],
      "a": 0,
      "why": "100 → one hundredth（序数词）。",
      "lv": 3
    }
  ],
  "num6": [
    {
      "q": "My phone number is 138-___-5678.",
      "o": [
        "five five five five",
        "four four four four",
        "double four double four"
      ],
      "a": 1,
      "why": "数字逐个读：four four four four。",
      "lv": 2
    },
    {
      "q": "房间 305 读作？",
      "o": [
        "three zero five",
        "three hundred and five",
        "thirty-five"
      ],
      "a": 0,
      "why": "房间号逐位读：three zero five。",
      "lv": 2
    },
    {
      "q": "0.5 读作？",
      "o": [
        "zero point five",
        "zero dot five",
        "half"
      ],
      "a": 0,
      "why": "小数读 point：zero point five。",
      "lv": 3
    },
    {
      "q": "3/4 读作？",
      "o": [
        "three fourths",
        "three four",
        "three over four"
      ],
      "a": 0,
      "why": "分数分子用基数，分母用序数词：three fourths。",
      "lv": 3
    }
  ],
  "adj1": [
    {
      "q": "The elephant is ___.",
      "o": [
        "big",
        "bigger",
        "biggest"
      ],
      "a": 0,
      "why": "单独描述用原级 big。",
      "lv": 2
    },
    {
      "q": "She is a ___ girl.",
      "o": [
        "happy",
        "happily",
        "happiness"
      ],
      "a": 0,
      "why": "修饰名词用形容词 happy。",
      "lv": 2
    },
    {
      "q": "The soup smells ___.",
      "o": [
        "good",
        "well",
        "goodly"
      ],
      "a": 0,
      "why": "感官动词后用形容词 good。",
      "lv": 3
    },
    {
      "q": "He looks ___ today.",
      "o": [
        "sad",
        "sadly",
        "sadness"
      ],
      "a": 0,
      "why": "look 是感官动词，后接形容词 sad。",
      "lv": 3
    }
  ],
  "adj2": [
    {
      "q": "My bag is ___ than yours.",
      "o": [
        "heavy",
        "heavier",
        "heaviest"
      ],
      "a": 1,
      "why": "比较级用 heavier。",
      "lv": 2
    },
    {
      "q": "She is ___ than her sister.",
      "o": [
        "tall",
        "taller",
        "tallest"
      ],
      "a": 1,
      "why": "比较级用 taller。",
      "lv": 2
    },
    {
      "q": "This question is ___ than that one.",
      "o": [
        "difficult",
        "more difficult",
        "most difficult"
      ],
      "a": 1,
      "why": "多音节词比较级加 more：more difficult。",
      "lv": 3
    },
    {
      "q": "Today is ___ than yesterday.",
      "o": [
        "hot",
        "hotter",
        "hottest"
      ],
      "a": 1,
      "why": "hot 双写 t 加 er：hotter。",
      "lv": 3
    }
  ],
  "adj3": [
    {
      "q": "He is the ___ in our class.",
      "o": [
        "tall",
        "taller",
        "tallest"
      ],
      "a": 2,
      "why": "最高级用 tallest。",
      "lv": 2
    },
    {
      "q": "This is the ___ book I have ever read.",
      "o": [
        "good",
        "better",
        "best"
      ],
      "a": 2,
      "why": "最高级用 best。",
      "lv": 2
    },
    {
      "q": "She is one of the ___ students in the school.",
      "o": [
        "good",
        "better",
        "best"
      ],
      "a": 2,
      "why": "one of the + 最高级：best。",
      "lv": 3
    },
    {
      "q": "The Yangtze River is the ___ river in China.",
      "o": [
        "long",
        "longer",
        "longest"
      ],
      "a": 2,
      "why": "最高级用 longest。",
      "lv": 3
    }
  ],
  "adj4": [
    {
      "q": "good 的比较级是？",
      "o": [
        "gooder",
        "better",
        "goodest"
      ],
      "a": 1,
      "why": "good 是不规则变化：better。",
      "lv": 2
    },
    {
      "q": "bad 的最高级是？",
      "o": [
        "baddest",
        "worst",
        "worst"
      ],
      "a": 1,
      "why": "bad 是不规则变化：worst → worst。",
      "lv": 2
    },
    {
      "q": "little 的比较级是？",
      "o": [
        "littler",
        "less",
        "lesser"
      ],
      "a": 1,
      "why": "little 表示量时比较级是 less。",
      "lv": 3
    },
    {
      "q": "many 的比较级是？",
      "o": [
        "manier",
        "more",
        "much"
      ],
      "a": 1,
      "why": "many/much 的比较级都是 more。",
      "lv": 3
    }
  ],
  "adj5": [
    {
      "q": "He is as ___ as his brother.",
      "o": [
        "tall",
        "taller",
        "tallest"
      ],
      "a": 0,
      "why": "as...as 之间用原级 tall。",
      "lv": 2
    },
    {
      "q": "This box is not as ___ as that one.",
      "o": [
        "heavy",
        "heavier",
        "heaviest"
      ],
      "a": 0,
      "why": "as...as 之间用原级 heavy。",
      "lv": 2
    },
    {
      "q": "She runs as ___ as a deer.",
      "o": [
        "fast",
        "faster",
        "fastest"
      ],
      "a": 0,
      "why": "as...as 之间用原级 fast。",
      "lv": 3
    },
    {
      "q": "Tom is not so ___ as Jerry.",
      "o": [
        "clever",
        "cleverer",
        "cleverest"
      ],
      "a": 0,
      "why": "not so...as 之间用原级 clever。",
      "lv": 3
    }
  ],
  "adj6": [
    {
      "q": "The ___ boy is my brother.",
      "o": [
        "five-years-old",
        "five-year-old",
        "five year old"
      ],
      "a": 1,
      "why": "复合形容词作定语，名词用单数：five-year-old。",
      "lv": 2
    },
    {
      "q": "He is ___ .",
      "o": [
        "five years old",
        "five-years-old",
        "five year old"
      ],
      "a": 0,
      "why": "作表语时不用连字符，名词用复数：five years old。",
      "lv": 2
    },
    {
      "q": "It's a ___ walk from here.",
      "o": [
        "ten-minute",
        "ten-minutes",
        "ten minute"
      ],
      "a": 0,
      "why": "复合形容词：ten-minute。",
      "lv": 3
    },
    {
      "q": "The building is ___ .",
      "o": [
        "100-meters-tall",
        "100-meter-tall",
        "100 meters tall"
      ],
      "a": 2,
      "why": "作表语不用连字符：100 meters tall。",
      "lv": 3
    }
  ],
  "adj7": [
    {
      "q": "I am ___ in this book.",
      "o": [
        "interest",
        "interested",
        "interesting"
      ],
      "a": 1,
      "why": "修饰人用 -ed：interested。",
      "lv": 2
    },
    {
      "q": "The book is ___.",
      "o": [
        "interest",
        "interested",
        "interesting"
      ],
      "a": 2,
      "why": "修饰物用 -ing：interesting。",
      "lv": 2
    },
    {
      "q": "The ___ movie made us ___.",
      "o": [
        "exciting, excited",
        "excited, exciting",
        "exciting, exciting"
      ],
      "a": 0,
      "why": "修饰物用 -ing，修饰人用 -ed：exciting movie, excited。",
      "lv": 3
    },
    {
      "q": "I am ___ in the ___ story.",
      "o": [
        "interested, interesting",
        "interesting, interested",
        "interested, interested"
      ],
      "a": 0,
      "why": "人用 interested，物用 interesting。",
      "lv": 3
    }
  ],
  "adj8": [
    {
      "q": "The red bag is ___, but the blue one is ___.",
      "o": [
        "nice, nicer",
        "nicer, nicest",
        "nice, nicest"
      ],
      "a": 0,
      "why": "并列比较，原级和比较级：nice, nicer。",
      "lv": 2
    },
    {
      "q": "She is ___ and ___.",
      "o": [
        "tall, thin",
        "taller, thinner",
        "tallest, thinnest"
      ],
      "a": 1,
      "why": "越来越……用比较级 and 比较级：taller and thinner。",
      "lv": 2
    },
    {
      "q": "The ___ you work, the ___ you will get.",
      "o": [
        "hard, more",
        "harder, more",
        "harder, much"
      ],
      "a": 1,
      "why": "the + 比较级, the + 比较级：The harder you work, the more you will get。",
      "lv": 3
    },
    {
      "q": "It's getting ___ and ___.",
      "o": [
        "cold, colder",
        "colder, colder",
        "coldest, coldest"
      ],
      "a": 1,
      "why": "越来越……用比较级 and 比较级：colder and colder。",
      "lv": 3
    }
  ],
  "adj9": [
    {
      "q": "This is a ___ flower.",
      "o": [
        "beautiful red",
        "red beautiful",
        "beautifully red"
      ],
      "a": 0,
      "why": "多个形容词顺序：观点+大小+新旧+颜色+产地+材质。beautiful（观点）+ red（颜色）。",
      "lv": 2
    },
    {
      "q": "He has a ___ car.",
      "o": [
        "big new red",
        "red new big",
        "new red big"
      ],
      "a": 0,
      "why": "大小+新旧+颜色：big new red。",
      "lv": 2
    },
    {
      "q": "I bought a ___ table.",
      "o": [
        "wooden round small",
        "small round wooden",
        "round small wooden"
      ],
      "a": 1,
      "why": "大小+形状+材质：small round wooden。",
      "lv": 3
    },
    {
      "q": "She is a ___ girl.",
      "o": [
        "Chinese clever young",
        "young clever Chinese",
        "clever young Chinese"
      ],
      "a": 2,
      "why": "观点+年龄+国籍：clever young Chinese。",
      "lv": 3
    }
  ],
  "adj10": [
    {
      "q": "The news is ___.",
      "o": [
        "exciting",
        "excited",
        "excite"
      ],
      "a": 0,
      "why": "news 是不可数名词，用 -ing 形容词修饰：exciting。",
      "lv": 2
    },
    {
      "q": "I am ___ at the news.",
      "o": [
        "surprise",
        "surprised",
        "surprising"
      ],
      "a": 1,
      "why": "人用 -ed：surprised。",
      "lv": 2
    },
    {
      "q": "The ___ result made everyone ___.",
      "o": [
        "surprising, surprised",
        "surprised, surprising",
        "surprising, surprising"
      ],
      "a": 0,
      "why": "物用 -ing，人用 -ed：surprising result, surprised。",
      "lv": 3
    },
    {
      "q": "He looked ___ at the ___ painting.",
      "o": [
        "amazed, amazing",
        "amazing, amazed",
        "amazed, amazed"
      ],
      "a": 0,
      "why": "人用 -ed（looked amazed），物用 -ing（amazing painting）。",
      "lv": 3
    }
  ],
  "adv1": [
    {
      "q": "She sings ___.",
      "o": [
        "beautiful",
        "beautifully",
        "beautifuly"
      ],
      "a": 1,
      "why": "修饰动词用副词 beautifully。",
      "lv": 2
    },
    {
      "q": "He runs ___.",
      "o": [
        "quick",
        "quickly",
        "quicker"
      ],
      "a": 1,
      "why": "修饰动词用副词 quickly。",
      "lv": 2
    },
    {
      "q": "The baby is sleeping ___.",
      "o": [
        "quiet",
        "quietly",
        "quieter"
      ],
      "a": 1,
      "why": "修饰动词用副词 quietly。",
      "lv": 3
    },
    {
      "q": "He speaks English ___.",
      "o": [
        "good",
        "well",
        "goodly"
      ],
      "a": 1,
      "why": "修饰动词用副词 well（不是 good）。",
      "lv": 3
    }
  ],
  "adv2": [
    {
      "q": "He works ___.",
      "o": [
        "hard",
        "hardly",
        "harder"
      ],
      "a": 0,
      "why": "hard 本身就是副词「努力地」，hardly 意思是「几乎不」。",
      "lv": 2
    },
    {
      "q": "It is raining ___.",
      "o": [
        "heavy",
        "heavily",
        "heavier"
      ],
      "a": 1,
      "why": "修饰动词用副词 heavily。",
      "lv": 2
    },
    {
      "q": "I ___ know him.",
      "o": [
        "hard",
        "hardly",
        "harder"
      ],
      "a": 1,
      "why": "hardly 表示「几乎不」：I hardly know him（我几乎不认识他）。",
      "lv": 3
    },
    {
      "q": "She studies ___, so she gets good grades.",
      "o": [
        "hard, hard",
        "hardly, hardly",
        "hard, hardly"
      ],
      "a": 0,
      "why": "hard 是副词「努力地」：studies hard。",
      "lv": 3
    }
  ],
  "adv3": [
    {
      "q": "He is a ___ worker.",
      "o": [
        "good",
        "well",
        "goodly"
      ],
      "a": 0,
      "why": "修饰名词用形容词 good。",
      "lv": 2
    },
    {
      "q": "He works ___.",
      "o": [
        "good",
        "well",
        "goodly"
      ],
      "a": 1,
      "why": "修饰动词用副词 well。",
      "lv": 2
    },
    {
      "q": "The food tastes ___.",
      "o": [
        "good",
        "well",
        "goodly"
      ],
      "a": 0,
      "why": "感官动词后用形容词 good。",
      "lv": 3
    },
    {
      "q": "He plays basketball ___.",
      "o": [
        "good",
        "well",
        "goodly"
      ],
      "a": 1,
      "why": "修饰动词用副词 well。",
      "lv": 3
    }
  ],
  "adv4": [
    {
      "q": "She arrived ___ .",
      "o": [
        "late",
        "lately",
        "later"
      ],
      "a": 0,
      "why": "late 本身就是副词「晚」，lately 意思是「最近」。",
      "lv": 2
    },
    {
      "q": "I haven't seen him ___.",
      "o": [
        "late",
        "lately",
        "later"
      ],
      "a": 1,
      "why": "lately 表示「最近」：haven't seen him lately。",
      "lv": 2
    },
    {
      "q": "He came home ___ last night.",
      "o": [
        "late",
        "lately",
        "later"
      ],
      "a": 0,
      "why": "late 表示「晚」：came home late。",
      "lv": 3
    },
    {
      "q": "What have you been doing ___?",
      "o": [
        "late",
        "lately",
        "later"
      ],
      "a": 1,
      "why": "lately 表示「最近」。",
      "lv": 3
    }
  ],
  "adv5": [
    {
      "q": "The plane flew ___ .",
      "o": [
        "high",
        "highly",
        "higher"
      ],
      "a": 0,
      "why": "high 本身是副词「高」，highly 意思是「高度地」。",
      "lv": 2
    },
    {
      "q": "He thinks ___ of you.",
      "o": [
        "high",
        "highly",
        "higher"
      ],
      "a": 1,
      "why": "think highly of 表示「高度评价」。",
      "lv": 2
    },
    {
      "q": "The bird flew ___ in the sky.",
      "o": [
        "high",
        "highly",
        "higher"
      ],
      "a": 0,
      "why": "high 表示「高」：flew high。",
      "lv": 3
    },
    {
      "q": "She is ___ praised by her teacher.",
      "o": [
        "high",
        "highly",
        "higher"
      ],
      "a": 1,
      "why": "highly praised 表示「高度赞扬」。",
      "lv": 3
    }
  ],
  "adv6": [
    {
      "q": "He ___ goes to school by bus.",
      "o": [
        "always",
        "sometime",
        "never"
      ],
      "a": 0,
      "why": "always 表示「总是」。",
      "lv": 2
    },
    {
      "q": "I ___ eat fast food.",
      "o": [
        "sometime",
        "sometimes",
        "some times"
      ],
      "a": 1,
      "why": "sometimes 表示「有时」。",
      "lv": 2
    },
    {
      "q": "He is ___ late for school.",
      "o": [
        "always",
        "never",
        "usually"
      ],
      "a": 1,
      "why": "never late 表示「从不迟到」。",
      "lv": 3
    },
    {
      "q": "频率副词中频率最高的是？",
      "o": [
        "always",
        "usually",
        "sometimes"
      ],
      "a": 0,
      "why": "always（总是）> usually（通常）> often（经常）> sometimes（有时）> never（从不）。",
      "lv": 3
    }
  ],
  "adv7": [
    {
      "q": "He ___ finishes his homework.",
      "o": [
        "careful",
        "carefully",
        "carefulness"
      ],
      "a": 1,
      "why": "修饰动词用副词 carefully。",
      "lv": 2
    },
    {
      "q": "She drives ___.",
      "o": [
        "careful",
        "carefully",
        "carefulness"
      ],
      "a": 1,
      "why": "修饰动词用副词 carefully。",
      "lv": 2
    },
    {
      "q": "He is a ___ driver.",
      "o": [
        "careful",
        "carefully",
        "carefulness"
      ],
      "a": 0,
      "why": "修饰名词用形容词 careful。",
      "lv": 3
    },
    {
      "q": "Please listen to me ___.",
      "o": [
        "careful",
        "carefully",
        "carefulness"
      ],
      "a": 1,
      "why": "修饰动词用副词 carefully。",
      "lv": 3
    }
  ],
  "adv8": [
    {
      "q": "The cat is ___ under the table.",
      "o": [
        "sleep, quietly",
        "sleeping, quietly",
        "sleeps, quiet"
      ],
      "a": 1,
      "why": "进行时 sleeping + 副词 quietly。",
      "lv": 2
    },
    {
      "q": "He ___ opened the door.",
      "o": [
        "quiet",
        "quietly",
        "quieter"
      ],
      "a": 1,
      "why": "修饰动词用副词 quietly。",
      "lv": 2
    },
    {
      "q": "She walked ___ into the room.",
      "o": [
        "quiet",
        "quietly",
        "quieter"
      ],
      "a": 1,
      "why": "修饰动词用副词 quietly。",
      "lv": 3
    },
    {
      "q": "The children are playing ___ outside.",
      "o": [
        "happy, happily",
        "happily, happy",
        "happy, happy"
      ],
      "a": 0,
      "why": "两个副词修饰：happily（怎样玩）, outside（在哪玩）。",
      "lv": 3
    }
  ],
  "prep1": [
    {
      "q": "My birthday is ___ May.",
      "o": [
        "in",
        "on",
        "at"
      ],
      "a": 0,
      "why": "月份用 in：in May。",
      "lv": 2
    },
    {
      "q": "We meet ___ Sunday.",
      "o": [
        "in",
        "on",
        "at"
      ],
      "a": 1,
      "why": "星期用 on：on Sunday。",
      "lv": 2
    },
    {
      "q": "The class starts ___ 8 o'clock.",
      "o": [
        "in",
        "on",
        "at"
      ],
      "a": 2,
      "why": "具体时刻用 at：at 8 o'clock。",
      "lv": 3
    },
    {
      "q": "I was born ___ 2010.",
      "o": [
        "in",
        "on",
        "at"
      ],
      "a": 0,
      "why": "年份用 in：in 2010。",
      "lv": 3
    }
  ],
  "prep2": [
    {
      "q": "The book is ___ the desk.",
      "o": [
        "on",
        "in",
        "at"
      ],
      "a": 0,
      "why": "在桌面上用 on。",
      "lv": 2
    },
    {
      "q": "The cat is ___ the box.",
      "o": [
        "on",
        "in",
        "at"
      ],
      "a": 1,
      "why": "在盒子里用 in。",
      "lv": 2
    },
    {
      "q": "There is a tree ___ the house.",
      "o": [
        "in front of",
        "in",
        "on"
      ],
      "a": 0,
      "why": "在房子前面用 in front of。",
      "lv": 3
    },
    {
      "q": "The plane is flying ___ the clouds.",
      "o": [
        "on",
        "above",
        "in"
      ],
      "a": 1,
      "why": "在云上方用 above。",
      "lv": 3
    }
  ],
  "prep3": [
    {
      "q": "He goes to school ___ bus.",
      "o": [
        "by",
        "on",
        "in"
      ],
      "a": 0,
      "why": "乘交通工具用 by：by bus。",
      "lv": 2
    },
    {
      "q": "She walks ___ school every day.",
      "o": [
        "to",
        "at",
        "in"
      ],
      "a": 0,
      "why": "方向用 to：walks to school。",
      "lv": 2
    },
    {
      "q": "The letter is written ___ English.",
      "o": [
        "by",
        "in",
        "with"
      ],
      "a": 1,
      "why": "用某种语言用 in：in English。",
      "lv": 3
    },
    {
      "q": "Cut the apple ___ a knife.",
      "o": [
        "by",
        "in",
        "with"
      ],
      "a": 2,
      "why": "用工具用 with：with a knife。",
      "lv": 3
    }
  ],
  "prep4": [
    {
      "q": "Look ___ the blackboard.",
      "o": [
        "at",
        "on",
        "in"
      ],
      "a": 0,
      "why": "看某物用 look at。",
      "lv": 2
    },
    {
      "q": "Listen ___ the music.",
      "o": [
        "at",
        "to",
        "in"
      ],
      "a": 1,
      "why": "听某物用 listen to。",
      "lv": 2
    },
    {
      "q": "She is looking ___ her lost cat.",
      "o": [
        "at",
        "for",
        "after"
      ],
      "a": 1,
      "why": "look for 表示「寻找」。",
      "lv": 3
    },
    {
      "q": "Please look ___ my baby.",
      "o": [
        "at",
        "for",
        "after"
      ],
      "a": 2,
      "why": "look after 表示「照顾」。",
      "lv": 3
    }
  ],
  "prep5": [
    {
      "q": "He is good ___ math.",
      "o": [
        "at",
        "in",
        "on"
      ],
      "a": 0,
      "why": "be good at 表示「擅长」。",
      "lv": 2
    },
    {
      "q": "I am afraid ___ dogs.",
      "o": [
        "of",
        "to",
        "in"
      ],
      "a": 0,
      "why": "be afraid of 表示「害怕」。",
      "lv": 2
    },
    {
      "q": "She is interested ___ science.",
      "o": [
        "in",
        "at",
        "on"
      ],
      "a": 0,
      "why": "be interested in 表示「对……感兴趣」。",
      "lv": 3
    },
    {
      "q": "He is angry ___ me.",
      "o": [
        "with",
        "to",
        "on"
      ],
      "a": 0,
      "why": "be angry with 表示「生某人的气」。",
      "lv": 3
    }
  ],
  "prep6": [
    {
      "q": "The cup is ___ of tea.",
      "o": [
        "full",
        "fill",
        "filled"
      ],
      "a": 0,
      "why": "be full of 表示「装满」。",
      "lv": 2
    },
    {
      "q": "The bottle is ___ of water.",
      "o": [
        "full",
        "fill",
        "filled"
      ],
      "a": 0,
      "why": "be full of 表示「装满」。",
      "lv": 2
    },
    {
      "q": "Please fill the cup ___ water.",
      "o": [
        "of",
        "with",
        "in"
      ],
      "a": 1,
      "why": "fill...with 表示「用……装满」。",
      "lv": 3
    },
    {
      "q": "The room is full ___ people.",
      "o": [
        "of",
        "with",
        "in"
      ],
      "a": 0,
      "why": "be full of 是固定搭配。",
      "lv": 3
    }
  ],
  "prep7": [
    {
      "q": "He has been here ___ two hours.",
      "o": [
        "for",
        "since",
        "in"
      ],
      "a": 0,
      "why": "时间段用 for：for two hours。",
      "lv": 2
    },
    {
      "q": "She has lived here ___ 2010.",
      "o": [
        "for",
        "since",
        "in"
      ],
      "a": 1,
      "why": "时间点用 since：since 2010。",
      "lv": 2
    },
    {
      "q": "I have studied English ___ three years.",
      "o": [
        "for",
        "since",
        "in"
      ],
      "a": 0,
      "why": "时间段用 for：for three years。",
      "lv": 3
    },
    {
      "q": "He has been ill ___ Monday.",
      "o": [
        "for",
        "since",
        "in"
      ],
      "a": 1,
      "why": "时间点用 since：since Monday。",
      "lv": 3
    }
  ],
  "prep8": [
    {
      "q": "The ball is ___ the chair and the desk.",
      "o": [
        "between",
        "among",
        "in"
      ],
      "a": 0,
      "why": "两者之间用 between。",
      "lv": 2
    },
    {
      "q": "She is standing ___ her friends.",
      "o": [
        "between",
        "among",
        "in"
      ],
      "a": 1,
      "why": "三者以上之中用 among。",
      "lv": 2
    },
    {
      "q": "The choice is ___ yes and no.",
      "o": [
        "between",
        "among",
        "in"
      ],
      "a": 0,
      "why": "两者之间用 between。",
      "lv": 3
    },
    {
      "q": "Divide the sweets ___ the children.",
      "o": [
        "between",
        "among",
        "in"
      ],
      "a": 1,
      "why": "多个孩子分用 among。",
      "lv": 3
    }
  ],
  "prep9": [
    {
      "q": "He is ___ the tree.",
      "o": [
        "under",
        "at",
        "of"
      ],
      "a": 0,
      "why": "在树下用 under。",
      "lv": 2
    },
    {
      "q": "The cat jumped ___ the table.",
      "o": [
        "over",
        "at",
        "of"
      ],
      "a": 0,
      "why": "跳过桌子用 over。",
      "lv": 2
    },
    {
      "q": "Walk ___ the bridge carefully.",
      "o": [
        "over",
        "across",
        "through"
      ],
      "a": 1,
      "why": "走过桥面用 across。",
      "lv": 3
    },
    {
      "q": "The river flows ___ the city.",
      "o": [
        "over",
        "across",
        "through"
      ],
      "a": 2,
      "why": "流经城市用 through。",
      "lv": 3
    }
  ],
  "prep10": [
    {
      "q": "We have no class ___ Saturday and Sunday.",
      "o": [
        "on",
        "in",
        "at"
      ],
      "a": 0,
      "why": "周末两天用 on Saturday and Sunday。",
      "lv": 2
    },
    {
      "q": "See you ___ Monday morning.",
      "o": [
        "on",
        "in",
        "at"
      ],
      "a": 0,
      "why": "具体某天的上下午用 on：on Monday morning。",
      "lv": 2
    },
    {
      "q": "He will come ___ the morning of May 1st.",
      "o": [
        "on",
        "in",
        "at"
      ],
      "a": 0,
      "why": "具体某天的早上用 on：on the morning of May 1st。",
      "lv": 3
    },
    {
      "q": "We have a meeting ___ Friday afternoon.",
      "o": [
        "on",
        "in",
        "at"
      ],
      "a": 0,
      "why": "具体某天的下午用 on：on Friday afternoon。",
      "lv": 3
    }
  ],
  "conj1": [
    {
      "q": "I like apples ___ bananas.",
      "o": [
        "and",
        "or",
        "but"
      ],
      "a": 0,
      "why": "并列用 and。",
      "lv": 2
    },
    {
      "q": "She is tall ___ thin.",
      "o": [
        "and",
        "or",
        "but"
      ],
      "a": 0,
      "why": "并列特征用 and。",
      "lv": 2
    },
    {
      "q": "He ___ I are good friends.",
      "o": [
        "and",
        "or",
        "but"
      ],
      "a": 0,
      "why": "并列主语用 and。",
      "lv": 3
    },
    {
      "q": "Both Tom ___ Jerry like reading.",
      "o": [
        "and",
        "or",
        "but"
      ],
      "a": 0,
      "why": "both...and... 搭配用 and。",
      "lv": 3
    }
  ],
  "conj2": [
    {
      "q": "I want an apple ___ an orange.",
      "o": [
        "or",
        "and",
        "but"
      ],
      "a": 0,
      "why": "选择用 or。",
      "lv": 2
    },
    {
      "q": "Is it hot ___ cold?",
      "o": [
        "or",
        "and",
        "but"
      ],
      "a": 0,
      "why": "选择疑问用 or。",
      "lv": 2
    },
    {
      "q": "Hurry up, ___ you will be late.",
      "o": [
        "or",
        "and",
        "but"
      ],
      "a": 0,
      "why": "or 表示「否则」：Hurry up, or you will be late。",
      "lv": 3
    },
    {
      "q": "Would you like tea ___ coffee?",
      "o": [
        "or",
        "and",
        "but"
      ],
      "a": 0,
      "why": "选择用 or。",
      "lv": 3
    }
  ],
  "conj3": [
    {
      "q": "I want to go, ___ I am tired.",
      "o": [
        "but",
        "and",
        "or"
      ],
      "a": 0,
      "why": "转折用 but。",
      "lv": 2
    },
    {
      "q": "He is rich, ___ unhappy.",
      "o": [
        "but",
        "and",
        "or"
      ],
      "a": 0,
      "why": "转折用 but。",
      "lv": 2
    },
    {
      "q": "She is young ___ very clever.",
      "o": [
        "but",
        "and",
        "or"
      ],
      "a": 0,
      "why": "转折用 but。",
      "lv": 3
    },
    {
      "q": "I tried hard, ___ I failed.",
      "o": [
        "but",
        "and",
        "or"
      ],
      "a": 0,
      "why": "转折用 but。",
      "lv": 3
    }
  ],
  "conj4": [
    {
      "q": "It was raining, ___ I stayed at home.",
      "o": [
        "so",
        "because",
        "but"
      ],
      "a": 0,
      "why": "因果用 so。",
      "lv": 2
    },
    {
      "q": "I was tired, ___ I went to bed early.",
      "o": [
        "so",
        "because",
        "but"
      ],
      "a": 0,
      "why": "因果用 so。",
      "lv": 2
    },
    {
      "q": "It was late, ___ we went home.",
      "o": [
        "so",
        "because",
        "but"
      ],
      "a": 0,
      "why": "因果用 so。",
      "lv": 3
    },
    {
      "q": "He was hungry, ___ he ate a lot.",
      "o": [
        "so",
        "because",
        "but"
      ],
      "a": 0,
      "why": "因果用 so。",
      "lv": 3
    }
  ],
  "conj5": [
    {
      "q": "I stayed at home ___ it was raining.",
      "o": [
        "because",
        "so",
        "but"
      ],
      "a": 0,
      "why": "原因用 because。",
      "lv": 2
    },
    {
      "q": "He is sad ___ he lost his dog.",
      "o": [
        "because",
        "so",
        "but"
      ],
      "a": 0,
      "why": "原因用 because。",
      "lv": 2
    },
    {
      "q": "___ I was ill, I didn't go to school.",
      "o": [
        "Because",
        "So",
        "But"
      ],
      "a": 0,
      "why": "原因状语从句用 Because。",
      "lv": 3
    },
    {
      "q": "She didn't come ___ she was busy.",
      "o": [
        "because",
        "so",
        "but"
      ],
      "a": 0,
      "why": "原因用 because。",
      "lv": 3
    }
  ],
  "conj6": [
    {
      "q": "___ he is tired, he keeps working.",
      "o": [
        "Although",
        "Because",
        "So"
      ],
      "a": 0,
      "why": "让步用 Although。",
      "lv": 2
    },
    {
      "q": "He is poor ___ happy.",
      "o": [
        "but",
        "and",
        "so"
      ],
      "a": 0,
      "why": "转折用 but。",
      "lv": 2
    },
    {
      "q": "Although it is hard, ___ I will try.",
      "o": [
        "but",
        "so",
        "不填"
      ],
      "a": 2,
      "why": "although 和 but 不能同时用，填「不填」。",
      "lv": 3
    },
    {
      "q": "___ rich he is, he is not happy.",
      "o": [
        "However",
        "Although",
        "Because"
      ],
      "a": 1,
      "why": "让步用 Although。",
      "lv": 3
    }
  ],
  "v1": [
    {
      "q": "He ___ to school every day.",
      "o": [
        "goes",
        "go",
        "going"
      ],
      "a": 0,
      "why": "第三人称单数加 es：goes。",
      "lv": 2
    },
    {
      "q": "She ___ English well.",
      "o": [
        "speak",
        "speaks",
        "speaking"
      ],
      "a": 1,
      "why": "第三人称单数加 s：speaks。",
      "lv": 2
    },
    {
      "q": "My father ___ in a hospital.",
      "o": [
        "work",
        "works",
        "working"
      ],
      "a": 1,
      "why": "第三人称单数加 s：works。",
      "lv": 3
    },
    {
      "q": "The cat ___ on the sofa now.",
      "o": [
        "sleep",
        "sleeps",
        "sleeping"
      ],
      "a": 1,
      "why": "一般现在时第三人称单数：sleeps。",
      "lv": 3
    }
  ],
  "v2": [
    {
      "q": "I ___ a student.",
      "o": [
        "am",
        "is",
        "are"
      ],
      "a": 0,
      "why": "I 用 am。",
      "lv": 2
    },
    {
      "q": "He ___ a teacher.",
      "o": [
        "am",
        "is",
        "are"
      ],
      "a": 1,
      "why": "单数用 is。",
      "lv": 2
    },
    {
      "q": "They ___ my friends.",
      "o": [
        "am",
        "is",
        "are"
      ],
      "a": 2,
      "why": "复数用 are。",
      "lv": 3
    },
    {
      "q": "There ___ a book on the desk.",
      "o": [
        "is",
        "are",
        "am"
      ],
      "a": 0,
      "why": "单数用 is。",
      "lv": 3
    }
  ],
  "v3": [
    {
      "q": "Do you ___ English?",
      "o": [
        "like",
        "likes",
        "liking"
      ],
      "a": 0,
      "why": "助动词后用原形 like。",
      "lv": 2
    },
    {
      "q": "Does he ___ football?",
      "o": [
        "play",
        "plays",
        "playing"
      ],
      "a": 0,
      "why": "助动词后用原形 play。",
      "lv": 2
    },
    {
      "q": "___ she like music?",
      "o": [
        "Do",
        "Does",
        "Is"
      ],
      "a": 1,
      "why": "第三人称单数疑问用 Does。",
      "lv": 3
    },
    {
      "q": "___ they want to go?",
      "o": [
        "Do",
        "Does",
        "Is"
      ],
      "a": 0,
      "why": "复数疑问用 Do。",
      "lv": 3
    }
  ],
  "v4": [
    {
      "q": "I ___ like swimming.",
      "o": [
        "don't",
        "doesn't",
        "aren't"
      ],
      "a": 0,
      "why": "I 用 don't。",
      "lv": 2
    },
    {
      "q": "He ___ play basketball.",
      "o": [
        "don't",
        "doesn't",
        "isn't"
      ],
      "a": 1,
      "why": "第三人称单数用 doesn't。",
      "lv": 2
    },
    {
      "q": "She ___ have a car.",
      "o": [
        "don't",
        "doesn't",
        "isn't"
      ],
      "a": 1,
      "why": "第三人称单数用 doesn't。",
      "lv": 3
    },
    {
      "q": "We ___ like spicy food.",
      "o": [
        "don't",
        "doesn't",
        "aren't"
      ],
      "a": 0,
      "why": "复数用 don't。",
      "lv": 3
    }
  ],
  "v5": [
    {
      "q": "The water ___ cold.",
      "o": [
        "feel",
        "feels",
        "feeling"
      ],
      "a": 1,
      "why": "第三人称单数加 s：feels。",
      "lv": 2
    },
    {
      "q": "He ___ hard every day.",
      "o": [
        "study",
        "studies",
        "studying"
      ],
      "a": 1,
      "why": "辅音+y 变 ies：studies。",
      "lv": 2
    },
    {
      "q": "She ___ to music every evening.",
      "o": [
        "listen",
        "listens",
        "listening"
      ],
      "a": 1,
      "why": "第三人称单数加 s：listens。",
      "lv": 3
    },
    {
      "q": "My mom ___ dinner for us.",
      "o": [
        "cook",
        "cooks",
        "cooking"
      ],
      "a": 1,
      "why": "第三人称单数加 s：cooks。",
      "lv": 3
    }
  ],
  "v6": [
    {
      "q": "I have ___ my homework.",
      "o": [
        "do",
        "did",
        "done"
      ],
      "a": 2,
      "why": "have done 是现在完成时。",
      "lv": 2
    },
    {
      "q": "He has ___ the book.",
      "o": [
        "read",
        "reads",
        "reading"
      ],
      "a": 0,
      "why": "has + 过去分词，read 的过去分词还是 read。",
      "lv": 2
    },
    {
      "q": "She has ___ to Beijing.",
      "o": [
        "be",
        "been",
        "being"
      ],
      "a": 1,
      "why": "has been to 表示「去过」。",
      "lv": 3
    },
    {
      "q": "I have ___ this movie before.",
      "o": [
        "see",
        "saw",
        "seen"
      ],
      "a": 2,
      "why": "have seen 是现在完成时。",
      "lv": 3
    }
  ],
  "v7": [
    {
      "q": "Can you ___ English?",
      "o": [
        "speak",
        "speaks",
        "speaking"
      ],
      "a": 0,
      "why": "can 后用原形 speak。",
      "lv": 2
    },
    {
      "q": "He can ___ fast.",
      "o": [
        "run",
        "runs",
        "running"
      ],
      "a": 0,
      "why": "can 后用原形 run。",
      "lv": 2
    },
    {
      "q": "She ___ swim when she was five.",
      "o": [
        "can",
        "could",
        "cans"
      ],
      "a": 1,
      "why": "过去时用 could。",
      "lv": 3
    },
    {
      "q": "You ___ not smoke here.",
      "o": [
        "can",
        "could",
        "may"
      ],
      "a": 0,
      "why": "表示禁止用 can not / cannot。",
      "lv": 3
    }
  ],
  "v8": [
    {
      "q": "I must ___ my homework now.",
      "o": [
        "do",
        "doing",
        "did"
      ],
      "a": 0,
      "why": "must 后用原形 do。",
      "lv": 2
    },
    {
      "q": "He should ___ more water.",
      "o": [
        "drink",
        "drinks",
        "drinking"
      ],
      "a": 0,
      "why": "should 后用原形 drink。",
      "lv": 2
    },
    {
      "q": "You mustn't ___ late.",
      "o": [
        "be",
        "are",
        "being"
      ],
      "a": 0,
      "why": "mustn't 后用原形 be。",
      "lv": 3
    },
    {
      "q": "We should ___ our parents.",
      "o": [
        "help",
        "helps",
        "helping"
      ],
      "a": 0,
      "why": "should 后用原形 help。",
      "lv": 3
    }
  ],
  "v9": [
    {
      "q": "Let's ___ a game.",
      "o": [
        "play",
        "plays",
        "playing"
      ],
      "a": 0,
      "why": "let's 后用原形 play。",
      "lv": 2
    },
    {
      "q": "Let me ___ you.",
      "o": [
        "help",
        "helps",
        "helping"
      ],
      "a": 0,
      "why": "let 后用原形 help。",
      "lv": 2
    },
    {
      "q": "Let him ___ first.",
      "o": [
        "go",
        "goes",
        "going"
      ],
      "a": 0,
      "why": "let 后用原形 go。",
      "lv": 3
    },
    {
      "q": "Let's not ___ about it.",
      "o": [
        "talk",
        "talks",
        "talking"
      ],
      "a": 0,
      "why": "let's not 后用原形 talk。",
      "lv": 3
    }
  ],
  "v10": [
    {
      "q": "I want ___ a doctor.",
      "o": [
        "to be",
        "be",
        "being"
      ],
      "a": 0,
      "why": "want to + 动词原形：to be。",
      "lv": 2
    },
    {
      "q": "She wants ___ a book.",
      "o": [
        "to read",
        "read",
        "reading"
      ],
      "a": 0,
      "why": "want to + 动词原形：to read。",
      "lv": 2
    },
    {
      "q": "He decided ___ abroad.",
      "o": [
        "to study",
        "study",
        "studying"
      ],
      "a": 0,
      "why": "decide to + 动词原形：to study。",
      "lv": 3
    },
    {
      "q": "I hope ___ you again.",
      "o": [
        "to see",
        "see",
        "seeing"
      ],
      "a": 0,
      "why": "hope to + 动词原形：to see。",
      "lv": 3
    }
  ],
  "v11": [
    {
      "q": "Would you like ___ tea?",
      "o": [
        "some",
        "any",
        "a"
      ],
      "a": 0,
      "why": "委婉请求用 some。",
      "lv": 2
    },
    {
      "q": "Can I have ___ water?",
      "o": [
        "some",
        "any",
        "a"
      ],
      "a": 0,
      "why": "委婉请求用 some。",
      "lv": 2
    },
    {
      "q": "There isn't ___ milk left.",
      "o": [
        "some",
        "any",
        "a"
      ],
      "a": 1,
      "why": "否定句用 any。",
      "lv": 3
    },
    {
      "q": "Is there ___ bread on the table?",
      "o": [
        "some",
        "any",
        "a"
      ],
      "a": 1,
      "why": "疑问句用 any。",
      "lv": 3
    }
  ],
  "v12": [
    {
      "q": "There ___ a pen and two books on the desk.",
      "o": [
        "is",
        "are",
        "am"
      ],
      "a": 0,
      "why": "就近原则：a pen 近，用 is。",
      "lv": 2
    },
    {
      "q": "There ___ two books and a pen on the desk.",
      "o": [
        "is",
        "are",
        "am"
      ],
      "a": 1,
      "why": "就近原则：two books 近，用 are。",
      "lv": 2
    },
    {
      "q": "There ___ some water in the cup.",
      "o": [
        "is",
        "are",
        "am"
      ],
      "a": 0,
      "why": "water 不可数用 is。",
      "lv": 3
    },
    {
      "q": "There ___ some apples in the basket.",
      "o": [
        "is",
        "are",
        "am"
      ],
      "a": 1,
      "why": "apples 复数用 are。",
      "lv": 3
    }
  ],
  "ing1": [
    {
      "q": "I ___ reading a book now.",
      "o": [
        "am",
        "is",
        "are"
      ],
      "a": 0,
      "why": "I 用 am。",
      "lv": 2
    },
    {
      "q": "He ___ playing football.",
      "o": [
        "is",
        "am",
        "are"
      ],
      "a": 0,
      "why": "单数用 is。",
      "lv": 2
    },
    {
      "q": "They ___ watching TV.",
      "o": [
        "are",
        "is",
        "am"
      ],
      "a": 0,
      "why": "复数用 are。",
      "lv": 3
    },
    {
      "q": "She ___ doing her homework now.",
      "o": [
        "is",
        "am",
        "are"
      ],
      "a": 0,
      "why": "单数用 is。",
      "lv": 3
    }
  ],
  "ing2": [
    {
      "q": "write 的现在分词是？",
      "o": [
        "writeing",
        "writing",
        "writting"
      ],
      "a": 1,
      "why": "以不发音 e 结尾去 e 加 ing：writing。",
      "lv": 2
    },
    {
      "q": "make 的现在分词是？",
      "o": [
        "makeing",
        "making",
        "makking"
      ],
      "a": 1,
      "why": "去 e 加 ing：making。",
      "lv": 2
    },
    {
      "q": "run 的现在分词是？",
      "o": [
        "runing",
        "running",
        "runnning"
      ],
      "a": 1,
      "why": "双写 n 加 ing：running。",
      "lv": 3
    },
    {
      "q": "swim 的现在分词是？",
      "o": [
        "swiming",
        "swimming",
        "swimmming"
      ],
      "a": 1,
      "why": "双写 m 加 ing：swimming。",
      "lv": 3
    }
  ],
  "ing3": [
    {
      "q": "Look! The cat ___ on the sofa.",
      "o": [
        "sleeps",
        "is sleeping",
        "sleep"
      ],
      "a": 1,
      "why": "Look 提示进行时：is sleeping。",
      "lv": 2
    },
    {
      "q": "Listen! Someone ___ at the door.",
      "o": [
        "knocks",
        "is knocking",
        "knock"
      ],
      "a": 1,
      "why": "Listen 提示进行时：is knocking。",
      "lv": 2
    },
    {
      "q": "Be quiet! The baby ___.",
      "o": [
        "sleeps",
        "is sleeping",
        "sleep"
      ],
      "a": 1,
      "why": "Be quiet 提示进行时：is sleeping。",
      "lv": 3
    },
    {
      "q": "Where is Tom? He ___ in the garden.",
      "o": [
        "works",
        "is working",
        "work"
      ],
      "a": 1,
      "why": "询问正在做什么用进行时：is working。",
      "lv": 3
    }
  ],
  "ing4": [
    {
      "q": "I ___ my homework at 8 last night.",
      "o": [
        "do",
        "did",
        "was doing"
      ],
      "a": 2,
      "why": "at 8 last night 提示过去进行时：was doing。",
      "lv": 2
    },
    {
      "q": "She ___ when the phone rang.",
      "o": [
        "cooked",
        "was cooking",
        "cooks"
      ],
      "a": 1,
      "why": "过去某一时刻正在做：was cooking。",
      "lv": 2
    },
    {
      "q": "They ___ a movie at 9 yesterday evening.",
      "o": [
        "watched",
        "were watching",
        "watch"
      ],
      "a": 1,
      "why": "过去进行时：were watching。",
      "lv": 3
    },
    {
      "q": "He ___ a shower when I called him.",
      "o": [
        "took",
        "was taking",
        "takes"
      ],
      "a": 1,
      "why": "过去进行时：was taking。",
      "lv": 3
    }
  ],
  "ing5": [
    {
      "q": "I ___ going to visit my grandma.",
      "o": [
        "am",
        "is",
        "are"
      ],
      "a": 0,
      "why": "I 用 am。",
      "lv": 2
    },
    {
      "q": "He ___ going to buy a car.",
      "o": [
        "is",
        "am",
        "are"
      ],
      "a": 0,
      "why": "单数用 is。",
      "lv": 2
    },
    {
      "q": "We ___ going to have a picnic.",
      "o": [
        "are",
        "is",
        "am"
      ],
      "a": 0,
      "why": "复数用 are。",
      "lv": 3
    },
    {
      "q": "There ___ going to be a meeting.",
      "o": [
        "is",
        "are",
        "am"
      ],
      "a": 0,
      "why": "there is going to be 固定搭配。",
      "lv": 3
    }
  ],
  "ing6": [
    {
      "q": "I will ___ you tomorrow.",
      "o": [
        "see",
        "seeing",
        "saw"
      ],
      "a": 0,
      "why": "will 后用原形 see。",
      "lv": 2
    },
    {
      "q": "He will ___ 12 next year.",
      "o": [
        "be",
        "is",
        "being"
      ],
      "a": 0,
      "why": "will 后用原形 be。",
      "lv": 2
    },
    {
      "q": "Will you ___ me with the math?",
      "o": [
        "help",
        "helps",
        "helping"
      ],
      "a": 0,
      "why": "will 后用原形 help。",
      "lv": 3
    },
    {
      "q": "It will ___ rainy tomorrow.",
      "o": [
        "be",
        "is",
        "being"
      ],
      "a": 0,
      "why": "will 后用原形 be。",
      "lv": 3
    }
  ],
  "t1": [
    {
      "q": "I ___ to school yesterday.",
      "o": [
        "go",
        "went",
        "going"
      ],
      "a": 1,
      "why": "yesterday 用过去时：went。",
      "lv": 2
    },
    {
      "q": "She ___ a book last night.",
      "o": [
        "read",
        "reads",
        "reading"
      ],
      "a": 0,
      "why": "last night 用过去时，read 过去式还是 read。",
      "lv": 2
    },
    {
      "q": "He ___ TV last weekend.",
      "o": [
        "watch",
        "watched",
        "watches"
      ],
      "a": 1,
      "why": "last weekend 用过去时：watched。",
      "lv": 3
    },
    {
      "q": "They ___ happy to see us.",
      "o": [
        "are",
        "were",
        "was"
      ],
      "a": 1,
      "why": "过去时用 were。",
      "lv": 3
    }
  ],
  "t2": [
    {
      "q": "go 的过去式是？",
      "o": [
        "goed",
        "went",
        "going"
      ],
      "a": 1,
      "why": "go 是不规则变化：went。",
      "lv": 2
    },
    {
      "q": "see 的过去式是？",
      "o": [
        "seed",
        "saw",
        "seen"
      ],
      "a": 1,
      "why": "see 是不规则变化：saw。",
      "lv": 2
    },
    {
      "q": "buy 的过去式是？",
      "o": [
        "buyed",
        "bought",
        "buyt"
      ],
      "a": 1,
      "why": "buy 是不规则变化：bought。",
      "lv": 3
    },
    {
      "q": "teach 的过去式是？",
      "o": [
        "teached",
        "taught",
        "teacht"
      ],
      "a": 1,
      "why": "teach 是不规则变化：taught。",
      "lv": 3
    }
  ],
  "t3": [
    {
      "q": "I didn't ___ to the park.",
      "o": [
        "go",
        "went",
        "going"
      ],
      "a": 0,
      "why": "助动词后用原形 go。",
      "lv": 2
    },
    {
      "q": "He didn't ___ his homework.",
      "o": [
        "do",
        "did",
        "doing"
      ],
      "a": 0,
      "why": "助动词后用原形 do。",
      "lv": 2
    },
    {
      "q": "Did you ___ the movie?",
      "o": [
        "like",
        "liked",
        "likes"
      ],
      "a": 0,
      "why": "助动词后用原形 like。",
      "lv": 3
    },
    {
      "q": "She didn't ___ to me.",
      "o": [
        "speak",
        "spoke",
        "speaks"
      ],
      "a": 0,
      "why": "助动词后用原形 speak。",
      "lv": 3
    }
  ],
  "t4": [
    {
      "q": "Was he at home ___?",
      "o": [
        "yesterday",
        "tomorrow",
        "now"
      ],
      "a": 0,
      "why": "过去时搭配 yesterday。",
      "lv": 2
    },
    {
      "q": "I ___ 8 years old last year.",
      "o": [
        "am",
        "was",
        "were"
      ],
      "a": 1,
      "why": "last year 用过去时：was。",
      "lv": 2
    },
    {
      "q": "They ___ busy last week.",
      "o": [
        "are",
        "were",
        "was"
      ],
      "a": 1,
      "why": "复数过去时用 were。",
      "lv": 3
    },
    {
      "q": "___ you at school yesterday?",
      "o": [
        "Was",
        "Were",
        "Are"
      ],
      "a": 1,
      "why": "复数疑问用 Were。",
      "lv": 3
    }
  ],
  "t5": [
    {
      "q": "I will ___ 10 next year.",
      "o": [
        "am",
        "be",
        "being"
      ],
      "a": 1,
      "why": "will 后用原形 be。",
      "lv": 2
    },
    {
      "q": "He will ___ a doctor.",
      "o": [
        "is",
        "be",
        "being"
      ],
      "a": 1,
      "why": "will 后用原形 be。",
      "lv": 2
    },
    {
      "q": "They will ___ late.",
      "o": [
        "are",
        "be",
        "being"
      ],
      "a": 1,
      "why": "will 后用原形 be。",
      "lv": 3
    },
    {
      "q": "There will ___ a party tomorrow.",
      "o": [
        "is",
        "be",
        "being"
      ],
      "a": 1,
      "why": "will 后用原形 be。",
      "lv": 3
    }
  ],
  "t6": [
    {
      "q": "I am going to ___ a letter.",
      "o": [
        "write",
        "writing",
        "wrote"
      ],
      "a": 0,
      "why": "be going to 后用原形 write。",
      "lv": 2
    },
    {
      "q": "She is going to ___ a song.",
      "o": [
        "sing",
        "singing",
        "sang"
      ],
      "a": 0,
      "why": "be going to 后用原形 sing。",
      "lv": 2
    },
    {
      "q": "They are going to ___ a trip.",
      "o": [
        "have",
        "having",
        "had"
      ],
      "a": 0,
      "why": "be going to 后用原形 have。",
      "lv": 3
    },
    {
      "q": "He is going to ___ his room.",
      "o": [
        "clean",
        "cleaning",
        "cleaned"
      ],
      "a": 0,
      "why": "be going to 后用原形 clean。",
      "lv": 3
    }
  ],
  "t7": [
    {
      "q": "I ___ my keys. I can't find them.",
      "o": [
        "lose",
        "lost",
        "losing"
      ],
      "a": 1,
      "why": "已经丢了用过去时/完成时：lost。",
      "lv": 2
    },
    {
      "q": "He ___ his leg yesterday.",
      "o": [
        "break",
        "broke",
        "breaking"
      ],
      "a": 1,
      "why": "yesterday 用过去时：broke。",
      "lv": 2
    },
    {
      "q": "She has ___ her homework.",
      "o": [
        "finish",
        "finished",
        "finishing"
      ],
      "a": 1,
      "why": "has + 过去分词：finished。",
      "lv": 3
    },
    {
      "q": "I have ___ my room.",
      "o": [
        "clean",
        "cleaned",
        "cleaning"
      ],
      "a": 1,
      "why": "has + 过去分词：cleaned。",
      "lv": 3
    }
  ],
  "t8": [
    {
      "q": "I ___ English since 2018.",
      "o": [
        "study",
        "studied",
        "have studied"
      ],
      "a": 2,
      "why": "since 2018 用现在完成时：have studied。",
      "lv": 2
    },
    {
      "q": "He ___ here for 3 years.",
      "o": [
        "lives",
        "lived",
        "has lived"
      ],
      "a": 2,
      "why": "for 3 years 用现在完成时：has lived。",
      "lv": 2
    },
    {
      "q": "She ___ already ___ her dinner.",
      "o": [
        "has, eaten",
        "have, eaten",
        "is, eating"
      ],
      "a": 0,
      "why": "already 提示完成时：has eaten。",
      "lv": 3
    },
    {
      "q": "I ___ never ___ to Paris.",
      "o": [
        "have, been",
        "has, been",
        "am, been"
      ],
      "a": 0,
      "why": "never 提示完成时：have been。",
      "lv": 3
    }
  ],
  "s1": [
    {
      "q": "___ is your name?",
      "o": [
        "What",
        "Where",
        "When"
      ],
      "a": 0,
      "why": "问名字用 What。",
      "lv": 2
    },
    {
      "q": "___ old are you?",
      "o": [
        "What",
        "How",
        "Where"
      ],
      "a": 1,
      "why": "问年龄用 How。",
      "lv": 2
    },
    {
      "q": "___ do you live?",
      "o": [
        "What",
        "Where",
        "How"
      ],
      "a": 1,
      "why": "问地点用 Where。",
      "lv": 3
    },
    {
      "q": "___ is that man?",
      "o": [
        "Who",
        "What",
        "Where"
      ],
      "a": 0,
      "why": "问人用 Who。",
      "lv": 3
    }
  ],
  "s2": [
    {
      "q": "There ___ a book on the desk.",
      "o": [
        "is",
        "are",
        "am"
      ],
      "a": 0,
      "why": "单数用 is。",
      "lv": 2
    },
    {
      "q": "There ___ some apples in the basket.",
      "o": [
        "is",
        "are",
        "am"
      ],
      "a": 1,
      "why": "复数用 are。",
      "lv": 2
    },
    {
      "q": "There ___ some water in the bottle.",
      "o": [
        "is",
        "are",
        "am"
      ],
      "a": 0,
      "why": "不可数用 is。",
      "lv": 3
    },
    {
      "q": "There ___ two pens and a ruler on the desk.",
      "o": [
        "is",
        "are",
        "am"
      ],
      "a": 1,
      "why": "就近原则：two pens 近，用 are。",
      "lv": 3
    }
  ],
  "s3": [
    {
      "q": "___ open the window, please.",
      "o": [
        "Do",
        "Don't",
        "Not"
      ],
      "a": 1,
      "why": "否定祈使句用 Don't。",
      "lv": 2
    },
    {
      "q": "___ make noise in class.",
      "o": [
        "Do",
        "Don't",
        "Not"
      ],
      "a": 1,
      "why": "否定祈使句用 Don't。",
      "lv": 2
    },
    {
      "q": "Let's ___ late for class.",
      "o": [
        "not be",
        "not to be",
        "don't be"
      ],
      "a": 0,
      "why": "Let's not + 动词原形：not be。",
      "lv": 3
    },
    {
      "q": "___ bring your book next time.",
      "o": [
        "Do",
        "Don't",
        "Not"
      ],
      "a": 1,
      "why": "否定祈使句用 Don't。",
      "lv": 3
    }
  ],
  "s4": [
    {
      "q": "Can you swim? Yes, I ___.",
      "o": [
        "can",
        "do",
        "am"
      ],
      "a": 0,
      "why": "can 问 can 答。",
      "lv": 2
    },
    {
      "q": "Do you like tea? No, I ___.",
      "o": [
        "don't",
        "can't",
        "am not"
      ],
      "a": 0,
      "why": "do 问 do 答。",
      "lv": 2
    },
    {
      "q": "Is she a teacher? Yes, she ___.",
      "o": [
        "is",
        "does",
        "can"
      ],
      "a": 0,
      "why": "is 问 is 答。",
      "lv": 3
    },
    {
      "q": "Are they students? No, they ___.",
      "o": [
        "aren't",
        "don't",
        "can't"
      ],
      "a": 0,
      "why": "are 问 are 答。",
      "lv": 3
    }
  ],
  "s5": [
    {
      "q": "___ a beautiful day!",
      "o": [
        "What",
        "How",
        "What a"
      ],
      "a": 2,
      "why": "可数名词单数用 What a：What a beautiful day。",
      "lv": 2
    },
    {
      "q": "___ fast he runs!",
      "o": [
        "What",
        "How",
        "What a"
      ],
      "a": 1,
      "why": "修饰副词用 How：How fast。",
      "lv": 2
    },
    {
      "q": "___ lovely flowers!",
      "o": [
        "What",
        "How",
        "What a"
      ],
      "a": 0,
      "why": "复数名词用 What（不加 a）：What lovely flowers。",
      "lv": 3
    },
    {
      "q": "___ clever the boy is!",
      "o": [
        "What",
        "How",
        "What a"
      ],
      "a": 1,
      "why": "修饰形容词用 How：How clever。",
      "lv": 3
    }
  ],
  "s6": [
    {
      "q": "There ___ some milk in the glass.",
      "o": [
        "is",
        "are",
        "have"
      ],
      "a": 0,
      "why": "milk 不可数用 is。",
      "lv": 2
    },
    {
      "q": "I ___ a new bike.",
      "o": [
        "there is",
        "have",
        "there are"
      ],
      "a": 1,
      "why": "拥有用 have。",
      "lv": 2
    },
    {
      "q": "___ a book and two pens on the desk.",
      "o": [
        "There is",
        "There are",
        "Have"
      ],
      "a": 0,
      "why": "就近原则：a book 近，用 There is。",
      "lv": 3
    },
    {
      "q": "She ___ two sisters.",
      "o": [
        "there has",
        "has",
        "there are"
      ],
      "a": 1,
      "why": "拥有用 has。",
      "lv": 3
    }
  ]
};
  Object.keys(EXTRA).forEach(function(id){
    var l = EQ_DATA.lessons.filter(function(x){ return x.id === id; })[0];
    if (l) l.q = l.q.concat(EXTRA[id]);
  });

  // 3) 新增第 13 章
  if (!EQ_DATA.chapters.some(function(c){ return c.id === 13; })) {
    EQ_DATA.chapters.push({"id":13,"name":"小升初综合模拟","emoji":"🏆","desc":"跨章节真题级综合闯关"});
  }
  var EXAM = [
  {
    "id": "exam1",
    "ch": 13,
    "t": "小升初模拟卷一 · 基础综合",
    "tip": "跨章节综合 · 基础题型",
    "body": "这是小升初基础综合模拟卷，涵盖名词、冠词、代词、介词、动词时态等核心知识点。每道题都是小升初考试中常见的题型，认真做一遍，查漏补缺！",
    "say": "基础扎实，万题不慌；错题归档，下次不犯。",
    "ex": [
      {
        "en": "Knowledge is power.",
        "zh": "知识就是力量。"
      },
      {
        "en": "Practice makes perfect.",
        "zh": "熟能生巧。"
      }
    ],
    "q": [
      {
        "q": "There is ___ 'u' in the word 'useful'.",
        "o": [
          "a",
          "an",
          "the"
        ],
        "a": 0,
        "why": "'u' 读 /juː/，辅音音素开头用 a。",
        "lv": 1
      },
      {
        "q": "My sister is ___ 8-year-old girl.",
        "o": [
          "a",
          "an",
          "the"
        ],
        "a": 1,
        "why": "8 读 /eɪt/，元音音素开头用 an。",
        "lv": 1
      },
      {
        "q": "The teacher told us ___ story in class.",
        "o": [
          "a interesting",
          "an interesting",
          "the interesting"
        ],
        "a": 1,
        "why": "interesting 以元音音素开头，用 an。",
        "lv": 1
      },
      {
        "q": "Would you like ___ orange juice?",
        "o": [
          "a",
          "an",
          "some"
        ],
        "a": 2,
        "why": "juice 不可数，委婉请求用 some。",
        "lv": 1
      },
      {
        "q": "He has been to Beijing ___.",
        "o": [
          "two times",
          "twice",
          "second"
        ],
        "a": 1,
        "why": "两次用 twice，不用 two times。",
        "lv": 1
      },
      {
        "q": "The ___ day of October is National Day.",
        "o": [
          "one",
          "first",
          "oneth"
        ],
        "a": 1,
        "why": "日期用序数词：first。",
        "lv": 1
      },
      {
        "q": "My birthday is ___ September 10th.",
        "o": [
          "in",
          "on",
          "at"
        ],
        "a": 1,
        "why": "具体日期用 on：on September 10th。",
        "lv": 1
      },
      {
        "q": "He will come back ___ two hours.",
        "o": [
          "after",
          "in",
          "for"
        ],
        "a": 1,
        "why": "将来时中「……之后」用 in：in two hours。",
        "lv": 2
      },
      {
        "q": "The box is too heavy for me ___ .",
        "o": [
          "to carry it",
          "to carry",
          "carry"
        ],
        "a": 1,
        "why": "too...to 结构中 carry 后不再加 it（box 已是宾语）。",
        "lv": 2
      },
      {
        "q": "She is ___ girl that everyone likes her.",
        "o": [
          "so a lovely",
          "such a lovely",
          "such lovely a"
        ],
        "a": 1,
        "why": "such a + 形容词 + 单数可数名词：such a lovely girl。",
        "lv": 2
      }
    ]
  },
  {
    "id": "exam2",
    "ch": 13,
    "t": "小升初模拟卷二 · 时态综合",
    "tip": "时态辨析 · 时间状语判断",
    "body": "时态是小升初必考重点！通过时间状语判断时态：yesterday/last→过去时；now/look→进行时；tomorrow/next→将来时；since/for→完成时。",
    "say": "看时间状语，定动词时态；过去现在将来，各有标记。",
    "ex": [
      {
        "en": "Time and tide wait for no man.",
        "zh": "岁月不等人。"
      },
      {
        "en": "Better late than never.",
        "zh": "迟做总比不做好。"
      }
    ],
    "q": [
      {
        "q": "Look! The children ___ in the river.",
        "o": [
          "swim",
          "are swimming",
          "swam"
        ],
        "a": 1,
        "why": "Look! 提示进行时：are swimming。",
        "lv": 1
      },
      {
        "q": "I ___ my homework at 8 yesterday evening.",
        "o": [
          "do",
          "did",
          "was doing"
        ],
        "a": 2,
        "why": "at 8 yesterday evening 提示过去进行时：was doing。",
        "lv": 1
      },
      {
        "q": "He ___ to Shanghai tomorrow.",
        "o": [
          "goes",
          "went",
          "will go"
        ],
        "a": 2,
        "why": "tomorrow 提示将来时：will go。",
        "lv": 1
      },
      {
        "q": "My father ___ in this factory since 2010.",
        "o": [
          "works",
          "worked",
          "has worked"
        ],
        "a": 2,
        "why": "since 2010 提示现在完成时：has worked。",
        "lv": 1
      },
      {
        "q": "Where ___ you ___ last weekend?",
        "o": [
          "do, go",
          "did, go",
          "will, go"
        ],
        "a": 1,
        "why": "last weekend 提示过去时：did go。",
        "lv": 2
      },
      {
        "q": "By the time he got there, the train ___.",
        "o": [
          "left",
          "had left",
          "leaves"
        ],
        "a": 1,
        "why": "「到达前火车已走」过去的过去用过去完成时：had left。",
        "lv": 3
      },
      {
        "q": "She ___ her room when I called her.",
        "o": [
          "cleaned",
          "was cleaning",
          "cleans"
        ],
        "a": 1,
        "why": "call 时她正在打扫：was cleaning。",
        "lv": 2
      },
      {
        "q": "I ___ never ___ such a beautiful place.",
        "o": [
          "have, seen",
          "has, seen",
          "had, seen"
        ],
        "a": 0,
        "why": "never 提示现在完成时：have seen。",
        "lv": 2
      },
      {
        "q": "If it ___ tomorrow, we will stay at home.",
        "o": [
          "rain",
          "rains",
          "will rain"
        ],
        "a": 1,
        "why": "主将从现，if 从句用现在时：rains。",
        "lv": 3
      },
      {
        "q": "He ___ for 3 hours. Let him rest.",
        "o": [
          "studies",
          "has been studying",
          "studied"
        ],
        "a": 1,
        "why": "for 3 hours 且仍在进行：has been studying。",
        "lv": 3
      }
    ]
  },
  {
    "id": "exam3",
    "ch": 13,
    "t": "小升初模拟卷三 · 词法句法",
    "tip": "词形变化 · 句型转换",
    "body": "词法和句法是语法两大支柱。词法考词形变化（名词复数、动词时态、形容词比较级等）；句法考句型转换（肯定↔否定↔疑问、主动↔被动等）。",
    "say": "词法看变化，句法看结构；转换要细心，对应不遗漏。",
    "ex": [
      {
        "en": "All roads lead to Rome.",
        "zh": "条条大路通罗马。"
      },
      {
        "en": "Every coin has two sides.",
        "zh": "凡事都有两面。"
      }
    ],
    "q": [
      {
        "q": "The ___ are playing on the playground.",
        "o": [
          "child",
          "children",
          "childs"
        ],
        "a": 1,
        "why": "child 复数是不规则变化：children。",
        "lv": 1
      },
      {
        "q": "She is the ___ student in our class.",
        "o": [
          "good",
          "better",
          "best"
        ],
        "a": 2,
        "why": "the + 最高级：best。",
        "lv": 1
      },
      {
        "q": "My watch is different from ___.",
        "o": [
          "you",
          "your",
          "yours"
        ],
        "a": 2,
        "why": "后面没有名词，用名词性物主代词 yours。",
        "lv": 1
      },
      {
        "q": "He did his homework carefully.（改为否定句）",
        "o": [
          "He didn't did his homework carefully.",
          "He didn't do his homework carefully.",
          "He don't do his homework carefully."
        ],
        "a": 1,
        "why": "过去时否定加 didn't，动词还原：didn't do。",
        "lv": 2
      },
      {
        "q": "Tom is a good boy.（改为感叹句）",
        "o": [
          "What a good boy Tom is!",
          "How a good boy Tom is!",
          "What good boy Tom is!"
        ],
        "a": 0,
        "why": "单数可数名词用 What a：What a good boy Tom is!",
        "lv": 2
      },
      {
        "q": "I have been to Beijing twice.（对划线部分提问）",
        "o": [
          "How many times have you been to Beijing?",
          "How long have you been to Beijing?",
          "How often have you been to Beijing?"
        ],
        "a": 0,
        "why": "问次数用 How many times。",
        "lv": 3
      },
      {
        "q": "The teacher made us ___ the classroom after school.",
        "o": [
          "clean",
          "to clean",
          "cleaned"
        ],
        "a": 0,
        "why": "make sb. do sth. 用原形：clean。",
        "lv": 3
      },
      {
        "q": "Neither he nor I ___ a student.",
        "o": [
          "is",
          "am",
          "are"
        ],
        "a": 1,
        "why": "neither...nor 就近原则，靠近 I 用 am。",
        "lv": 3
      },
      {
        "q": "The book ___ well is very popular.",
        "o": [
          "sells",
          "sold",
          "selling"
        ],
        "a": 0,
        "why": "「书卖得好」主动表被动，一般现在时：sells。",
        "lv": 3
      },
      {
        "q": "Not only you but also he ___ right.",
        "o": [
          "are",
          "is",
          "am"
        ],
        "a": 1,
        "why": "not only...but also 就近原则，靠近 he 用 is。",
        "lv": 3
      }
    ]
  }
];
  EXAM.forEach(function(e){
    if (!EQ_DATA.lessons.some(function(l){ return l.id === e.id; })) EQ_DATA.lessons.push(e);
  });
})();
