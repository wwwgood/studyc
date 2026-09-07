/* gen-exam.js — 生成小升初/分班考/密考英语真题
 * 用法: node build/gen-exam.js
 * 输出: src/scripts/data/english-exam.js
 */
var fs = require("fs");
var path = require("path");

var categories = [
  {id: 1, name: "小升初真题", emoji: "📋", desc: "各地小升初英语选拔真题"},
  {id: 2, name: "重点初中分班考", emoji: "🏫", desc: "重点中学入学分班考试"},
  {id: 3, name: "小升初密考", emoji: "🔒", desc: "名校选拔性密考真题"}
];

var papers = [];

/* ===== 第一类：小升初真题 ===== */

papers.push({
  id: "ex101", cat: 1, name: "小升初英语真题·语法精选（一）", time: 45,
  questions: [
    {q: "There ___ a book and two pens on the desk.", o: ["is", "are", "am", "be"], a: 0, why: "There be句型遵循就近原则，离be动词最近的是a book（单数），所以用is。"},
    {q: "My sister and I ___ students.", o: ["am", "is", "are", "be"], a: 2, why: "主语My sister and I是复数，be动词用are。"},
    {q: "— ___ is your birthday? — It's on May 5th.", o: ["What", "When", "Where", "Who"], a: 1, why: "问日期用When，回答是on May 5th。"},
    {q: "He ___ to school every day.", o: ["walk", "walks", "walking", "walked"], a: 1, why: "主语He是第三人称单数，一般现在时动词加s，用walks。"},
    {q: "Would you like ___ apple?", o: ["a", "an", "the", "/"], a: 1, why: "apple以元音音素开头，用an。"},
    {q: "This is ___ umbrella. ___ umbrella is yellow.", o: ["a; The", "an; The", "an; A", "the; An"], a: 1, why: "第一次提到用an umbrella（元音开头），第二次提到用The表特指。"},
    {q: "— ___ books do you have? — I have ten.", o: ["What", "How many", "How much", "How"], a: 1, why: "问可数名词数量用How many。"},
    {q: "Look! The boys ___ football on the playground.", o: ["play", "plays", "are playing", "played"], a: 2, why: "Look!提示正在发生，用现在进行时are playing。"},
    {q: "I ___ my homework yesterday evening.", o: ["do", "did", "doing", "done"], a: 1, why: "yesterday evening表过去，用一般过去时did。"},
    {q: "Tom is ___ than Mike.", o: ["tall", "taller", "tallest", "the tallest"], a: 1, why: "than提示比较级，用taller。"},
    {q: "This box is ___ of the three.", o: ["heavy", "heavier", "heaviest", "the heaviest"], a: 3, why: "of the three提示最高级，最高级前要加the。"},
    {q: "___ beautiful the flower is!", o: ["What", "What a", "How", "How a"], a: 2, why: "感叹句修饰形容词beautiful用How，结构为How+adj+主谓。"},
    {q: "What ___ fine day it is!", o: ["a", "an", "the", "/"], a: 0, why: "感叹句What a + adj + n，day是可数名词单数，用a。"},
    {q: "He will go to Beijing ___ next week.", o: ["in", "on", "at", "/"], a: 3, why: "next/last/this/that修饰的时间状语前不加介词。"},
    {q: "My father was born ___ May 1st, 1980.", o: ["in", "on", "at", "of"], a: 1, why: "具体某一天用介词on。"},
    {q: "We usually have lunch ___ noon.", o: ["in", "on", "at", "by"], a: 2, why: "at noon（在中午）是固定搭配。"},
    {q: "The teacher told us ___ late for school.", o: ["don't be", "not be", "not to be", "to not be"], a: 2, why: "tell sb not to do sth，否定not放在to前。"},
    {q: "Could you ___ me your pen?", o: ["borrow", "lend", "return", "take"], a: 1, why: "lend sb sth（借给某人某物），borrow是借入，lend是借出。"},
    {q: "I have ___ to tell you.", o: ["something important", "important something", "some important thing", "important thing"], a: 0, why: "形容词修饰不定代词要后置，something important。"},
    {q: "Neither he nor I ___ a student.", o: ["am", "is", "are", "be"], a: 0, why: "neither...nor...就近原则，离be最近的是I，用am。"}
  ]
});

papers.push({
  id: "ex102", cat: 1, name: "小升初英语真题·语法精选（二）", time: 45,
  questions: [
    {q: "The number of the students ___ 50.", o: ["am", "is", "are", "be"], a: 1, why: "The number of...（...的数量）作主语，谓语用单数is。"},
    {q: "A number of students ___ playing on the playground.", o: ["is", "are", "am", "be"], a: 1, why: "A number of（许多）+复数名词，谓语用复数are。"},
    {q: "He has two ___. One is red, ___ is blue.", o: ["pen; another", "pens; another", "pens; the other", "pen; the other"], a: 2, why: "two pens（复数加s）；两个中另一个用the other（特指）。"},
    {q: "I don't like this shirt. Please show me ___.", o: ["other", "another", "the other", "others"], a: 1, why: "another（另一个/再一个），用于不定数目中的另一个。"},
    {q: "Some students are reading, ___ are writing.", o: ["other", "another", "others", "the others"], a: 2, why: "others=other students，泛指其余的学生。"},
    {q: "He is ___ honest boy. We all like him.", o: ["a", "an", "the", "/"], a: 1, why: "honest以元音/h/开头但h不发音，首字母h不发音，所以用an。"},
    {q: "There is ___ 'h' in the word 'hour'.", o: ["a", "an", "the", "/"], a: 1, why: "字母h的发音/eitʃ/以元音开头，用an。"},
    {q: "He spent two hours ___ his homework.", o: ["do", "doing", "to do", "done"], a: 1, why: "spend time doing sth是固定搭配。"},
    {q: "It took me three days ___ the book.", o: ["read", "reading", "to read", "readed"], a: 2, why: "It takes sb time to do sth是固定句型。"},
    {q: "You'd better ___ late next time.", o: ["not be", "not to be", "don't be", "to not be"], a: 0, why: "had better not do sth，had better后接动词原形。"},
    {q: "The old man lives ___, but he doesn't feel ___.", o: ["alone; lonely", "lonely; alone", "alone; alone", "lonely; lonely"], a: 0, why: "alone（独自一人，客观），lonely（孤独的，主观感受）。"},
    {q: "He made his son ___ the room.", o: ["clean", "to clean", "cleaning", "cleaned"], a: 0, why: "make sb do sth，make后接不带to的不定式。"},
    {q: "I saw him ___ into the room just now.", o: ["go", "to go", "going", "gone"], a: 0, why: "see sb do sth（看见某人做了某事），强调全过程用不带to的不定式。"},
    {q: "The book is ___. I wrote it ___.", o: ["my; myself", "mine; myself", "my; me", "mine; me"], a: 1, why: "mine（名词性物主代词）作表语；myself强调自己写的。"},
    {q: "Help ___ to some fish, children.", o: ["yourself", "yourselves", "you", "your"], a: 1, why: "children是复数，反身代词用yourselves。Help yourselves to...请自便。"},
    {q: "He has ___ been to Beijing. It's his first visit.", o: ["ever", "never", "already", "just"], a: 1, why: "It's his first visit说明没去过，用never。"},
    {q: "— ___ have you been here? — For three years.", o: ["How long", "How often", "How soon", "How far"], a: 0, why: "For+时间段用How long提问。"},
    {q: "— ___ will he come back? — In two days.", o: ["How long", "How often", "How soon", "How far"], a: 2, why: "In+时间段（多久以后）用How soon提问。"},
    {q: "The river is about ___.", o: ["ten meter long", "ten meters long", "ten-meter long", "ten-meters-long"], a: 1, why: "数字+复数名词+形容词作表语，不需要连字符。"},
    {q: "He is a ___ boy. He always does his homework ___.", o: ["careful; carefully", "carefully; careful", "careful; careful", "carefully; carefully"], a: 0, why: "形容词修饰名词，副词修饰动词。"}
  ]
});

papers.push({
  id: "ex103", cat: 1, name: "小升初英语真题·词汇与情景交际", time: 40,
  questions: [
    {q: "The sign says '___'. You shouldn't smoke here.", o: ["NO SMOKING", "NO PARKING", "NO PHOTOS", "NO LITTERING"], a: 0, why: "shouldn't smoke（不应抽烟）对应NO SMOKING标志。"},
    {q: "— Shall we go to the park this Sunday? — ___", o: ["That's right.", "Good idea!", "I think so.", "Yes, we shall."], a: 1, why: "Shall we...?提建议，回答用Good idea!表示赞同。"},
    {q: "— Would you like some more rice? — ___. I'm full.", o: ["Yes, please", "No, thanks", "I'd love to", "Just a little"], a: 1, why: "I'm full说明吃饱了，委婉拒绝用No, thanks。"},
    {q: "— Hello, may I speak to Tom? — ___", o: ["I'm Tom.", "This is Tom speaking.", "Yes, I am.", "My name is Tom."], a: 1, why: "电话用语中介绍自己用This is...speaking。"},
    {q: "— ___? — I'd like to buy a pen.", o: ["What do you want", "Can I help you", "What would you like", "Both B and C"], a: 3, why: "购物场景Can I help you?和What would you like?都可以。"},
    {q: "— I'm sorry I'm late. — ___", o: ["You're welcome.", "It doesn't matter.", "Thank you.", "That's right."], a: 1, why: "别人道歉说迟到，回答It doesn't matter.（没关系）。"},
    {q: "— Happy birthday to you! — ___", o: ["The same to you.", "Thank you.", "You're welcome.", "That's OK."], a: 1, why: "生日祝福是针对个人的，用Thank you.回复（不用The same to you）。"},
    {q: "— Merry Christmas! — ___", o: ["Thank you.", "The same to you.", "You're welcome.", "Happy birthday."], a: 1, why: "圣诞节是共同节日，用The same to you.（你也一样）回复。"},
    {q: "The opposite of 'expensive' is ___.", o: ["cheap", "rich", "poor", "free"], a: 0, why: "expensive（贵的）反义词是cheap（便宜的）。"},
    {q: "Which word has a different sound for the underlined part?", o: ["c**a**ke", "c**a**t", "m**a**ke", "l**a**te"], a: 1, why: "cat中a发/æ/，其他词中a发/eɪ/（开音节）。"},
    {q: "Choose the word with the same sound as 'b**ir**d'.", o: ["girl", "shirt", "first", "fire"], a: 3, why: "bird中ir发/ɜː/，fire中ir发/aɪə/，其余ir都发/ɜː/。实际girl/shirt/first都发/ɜː/，选fire不同。"},
    {q: "Which is NOT a school subject?", o: ["Math", "English", "Hospital", "Music"], a: 2, why: "Hospital是医院，不是学校科目。"},
    {q: "Which month has only 28 or 29 days?", o: ["January", "February", "March", "April"], a: 1, why: "二月February有28天，闰年29天。"},
    {q: "The ___ day of the week is Sunday.", o: ["first", "second", "last", "third"], a: 0, why: "在英语中Sunday是一周的第一天。"},
    {q: "Which one is a fruit?", o: ["potato", "tomato", "banana", "cabbage"], a: 2, why: "banana（香蕉）是水果，potato是土豆，cabbage是卷心菜。"},
    {q: "If you want to know the time, you can say '___'", o: ["What's the date?", "What time is it?", "What day is it?", "What's the weather?"], a: 1, why: "问时间用What time is it?"},
    {q: "Which can fly?", o: ["A fish", "A bird", "A dog", "A cat"], a: 1, why: "鸟会飞（A bird can fly）。"},
    {q: "We use a ___ to drink water.", o: ["fork", "knife", "cup", "plate"], a: 2, why: "cup（杯子）用来喝水。fork是叉子，knife是刀，plate是盘子。"},
    {q: "The teacher writes on the ___ with chalk.", o: ["desk", "blackboard", "chair", "book"], a: 1, why: "老师用粉笔在黑板（blackboard）上写字。"},
    {q: "If it rains, you need a ___.", o: ["hat", "umbrella", "scarf", "sunglasses"], a: 1, why: "下雨需要雨伞（umbrella）。"}
  ]
});

/* ===== 第二类：重点初中分班考 ===== */

papers.push({
  id: "ex201", cat: 2, name: "重点初中分班考·英语综合（一）", time: 60,
  questions: [
    {q: "Neither of the two boys ___ from America.", o: ["come", "comes", "coming", "are coming"], a: 1, why: "neither of + 复数名词/代词，谓语用单数comes。"},
    {q: "The population of China ___ larger than that of any other country.", o: ["are", "is", "am", "were"], a: 1, why: "population（人口）作主语用单数is。"},
    {q: "He is the only one of the students who ___ late for class today.", o: ["is", "are", "am", "were"], a: 0, why: "the only one of...定语从句修饰the only one，谓语用单数is。"},
    {q: "I prefer reading ___ watching TV.", o: ["than", "to", "for", "with"], a: 1, why: "prefer doing A to doing B（与B相比更喜欢A），用介词to。"},
    {q: "He used to ___ up early, but now he is used to ___ up late.", o: ["get; get", "getting; getting", "get; getting", "getting; get"], a: 2, why: "used to do（过去常常），be used to doing（习惯于）。"},
    {q: "The teacher asked me ___.", o: ["what was the matter", "what the matter was", "what is the matter", "what the matter is"], a: 0, why: "what's the matter是固定表达，语序不变，但主句过去时，从句也用过去时。"},
    {q: "I don't know ___ tomorrow.", o: ["what will he do", "what he will do", "he will do what", "what does he do"], a: 1, why: "宾语从句用陈述语序（主语+谓语），且时态与主句一致。"},
    {q: "Could you tell me ___?", o: ["where is the post office", "where the post office is", "where was the post office", "the post office is where"], a: 1, why: "宾语从句用陈述语序，where the post office is。"},
    {q: "He asked me if I ___ the film the next day.", o: ["will see", "would see", "saw", "had seen"], a: 1, why: "主句过去时，从句时态往前推，the next day提示过去将来时would see。"},
    {q: "By the time he was ten, he ___ 100 English words.", o: ["learned", "had learned", "has learned", "was learning"], a: 1, why: "By the time+过去时，主句用过去完成时had learned。"},
    {q: "I will stay at home if it ___ tomorrow.", o: ["rain", "rains", "will rain", "rained"], a: 1, why: "主将从现，if条件句用一般现在时rains。"},
    {q: "He has had the bike ___.", o: ["for two years", "since two years", "two years ago", "in two years"], a: 0, why: "现在完成时+for+时间段，since+时间点。"},
    {q: "The film ___ for ten minutes when we got to the cinema.", o: ["began", "had begun", "had been on", "has been on"], a: 2, why: "begin是瞬间动词，完成时不能与for连用，改用had been on。"},
    {q: "___ hard work it is!", o: ["What", "What a", "How", "How a"], a: 0, why: "work是不可数名词，用What+adj+不可数名词，不加a。"},
    {q: "I found ___ difficult to learn English well.", o: ["it", "this", "that", "one"], a: 0, why: "find it+adj+to do，it是形式宾语，真正宾语是to do。"},
    {q: "The Smiths ___ having dinner now.", o: ["is", "are", "am", "be"], a: 1, why: "The Smiths（史密斯一家），表复数，用are。"},
    {q: "This is the most beautiful park ___ I have ever visited.", o: ["that", "which", "what", "where"], a: 0, why: "最高级修饰先行词时，定语从句只能用that。"},
    {q: "The reason ___ he was late is unknown.", o: ["that", "which", "why", "what"], a: 2, why: "reason后用why引导定语从句。"},
    {q: "Not only he but also his parents ___ music.", o: ["like", "likes", "liking", "to like"], a: 0, why: "not only...but also...就近原则，离谓语最近的是parents（复数），用like。"},
    {q: "Either you or he ___ right.", o: ["are", "is", "am", "were"], a: 1, why: "either...or...就近原则，离谓语最近的是he（单数），用is。"}
  ]
});

papers.push({
  id: "ex202", cat: 2, name: "重点初中分班考·阅读理解专练", time: 50,
  questions: [
    {q: "Read the passage and answer.\n\nTom is a little boy. He is only seven years old. He likes to ask questions. One day, he went to the zoo with his father. He saw many animals there. He asked his father a lot of questions. His father was very happy to answer them.\n\nHow old is Tom?", o: ["Six", "Seven", "Eight", "Nine"], a: 1, why: "文中说He is only seven years old，所以Tom七岁。"},
    {q: "Where did Tom go one day?", o: ["To the park", "To the zoo", "To the school", "To the shop"], a: 1, why: "文中说he went to the zoo with his father。"},
    {q: "Who did Tom go with?", o: ["His mother", "His father", "His teacher", "His friend"], a: 1, why: "文中说he went to the zoo with his father。"},
    {q: "How did his father feel?", o: ["Sad", "Angry", "Happy", "Tired"], a: 2, why: "文中说His father was very happy to answer them。"},
    {q: "What did Tom like to do?", o: ["Play games", "Ask questions", "Watch TV", "Read books"], a: 1, why: "文中说He likes to ask questions。"},
    {q: "\n\nMike: What's your favorite subject, Lily?\nLily: My favorite subject is English. What about you, Mike?\nMike: I like math best. It's interesting.\nLily: But I think math is too difficult for me.\nMike: Don't worry. I can help you.\n\nWhat's Lily's favorite subject?", o: ["Math", "English", "Chinese", "Music"], a: 1, why: "对话中Lily说My favorite subject is English。"},
    {q: "What does Mike think of math?", o: ["Difficult", "Boring", "Interesting", "Easy"], a: 2, why: "Mike说I like math best. It's interesting。"},
    {q: "What does Lily think of math?", o: ["Interesting", "Too difficult", "Easy", "Boring"], a: 1, why: "Lily说I think math is too difficult for me。"},
    {q: "What will Mike do?", o: ["Help Lily with math", "Teach Lily English", "Do homework", "Play with Lily"], a: 0, why: "Mike说Don't worry. I can help you，帮助Lily学数学。"},
    {q: "\n\nThere are four seasons in a year. They are spring, summer, autumn and winter. Spring is the first season. It's warm and trees turn green. Summer is hot. We can swim. Autumn is cool. Farmers are busy. Winter is cold. We can make snowmen.\n\nHow many seasons are there in a year?", o: ["Three", "Four", "Five", "Two"], a: 1, why: "文中说There are four seasons in a year。"},
    {q: "Which season is the first?", o: ["Summer", "Autumn", "Spring", "Winter"], a: 2, why: "文中说Spring is the first season。"},
    {q: "What can we do in summer?", o: ["Make snowmen", "Swim", "Pick apples", "Plant trees"], a: 1, why: "文中说Summer is hot. We can swim。"},
    {q: "What can we do in winter?", o: ["Swim", "Make snowmen", "Fly kites", "Climb hills"], a: 1, why: "文中说Winter is cold. We can make snowmen。"},
    {q: "Who are busy in autumn?", o: ["Teachers", "Students", "Farmers", "Workers"], a: 2, why: "文中说Autumn is cool. Farmers are busy。"},
    {q: "\n\nDear Amy,\nHow are you? I'm in Beijing now. It's a beautiful city. The weather is sunny and warm. Yesterday I went to the Great Wall. It was great! I took many photos. Tomorrow I will go to the Summer Palace. I will come back next week.\nLove, Mary\n\nWhere is Mary now?", o: ["Shanghai", "Beijing", "Guangzhou", "Nanjing"], a: 1, why: "信中说I'm in Beijing now。"},
    {q: "How is the weather in Beijing?", o: ["Rainy and cold", "Sunny and warm", "Cloudy and cool", "Windy and hot"], a: 1, why: "信中说The weather is sunny and warm。"},
    {q: "Where did Mary go yesterday?", o: ["The Summer Palace", "The Great Wall", "Tian'anmen Square", "The zoo"], a: 1, why: "信中说Yesterday I went to the Great Wall。"},
    {q: "Where will Mary go tomorrow?", o: ["The Great Wall", "The Summer Palace", "The zoo", "Home"], a: 1, why: "信中说Tomorrow I will go to the Summer Palace。"},
    {q: "When will Mary come back?", o: ["Tomorrow", "Next week", "Next month", "Next year"], a: 1, why: "信中说I will come back next week。"},
    {q: "What did Mary do at the Great Wall?", o: ["Took photos", "Bought gifts", "Ate food", "Met friends"], a: 0, why: "信中说I took many photos。"}
  ]
});

/* ===== 第三类：小升初密考 ===== */

papers.push({
  id: "ex301", cat: 3, name: "小升初密考·英语综合能力（一）", time: 60,
  questions: [
    {q: "Choose the word that doesn't belong.", o: ["apple", "banana", "carrot", "orange"], a: 2, why: "apple/banana/orange是水果，carrot（胡萝卜）是蔬菜。"},
    {q: "Choose the word that doesn't belong.", o: ["Monday", "Tuesday", "Sunday", "January"], a: 3, why: "Monday/Tuesday/Sunday是星期，January是一月。"},
    {q: "Choose the word that doesn't belong.", o: ["red", "blue", "green", "big"], a: 3, why: "red/blue/green是颜色，big是大小形容词。"},
    {q: "Choose the word that doesn't belong.", o: ["dog", "cat", "fish", "tree"], a: 3, why: "dog/cat/fish是动物，tree是植物。"},
    {q: "Choose the word that doesn't belong.", o: ["spring", "summer", "winter", "weekend"], a: 3, why: "spring/summer/winter是季节，weekend是周末。"},
    {q: "Rearrange: 'is / the / what / today / date' → ___", o: ["What is the date today?", "What the date is today?", "The date is what today?", "Today what is the date?"], a: 0, why: "问日期的正确语序是What is the date today?"},
    {q: "Rearrange: 'you / do / what / do / on Sundays' → ___", o: ["What you do on Sundays?", "What do you do on Sundays?", "Do what you do on Sundays?", "On Sundays what do you do?"], a: 1, why: "特殊疑问句结构：What + do + you + do + on Sundays?"},
    {q: "Choose the correct spelling.", o: ["beautifull", "beautiful", "beautifull", "beauteful"], a: 1, why: "beautiful是正确拼写，注意eau组合和只有一个l。"},
    {q: "Choose the correct spelling.", o: ["friend", "freind", "freend", "frend"], a: 0, why: "friend是正确拼写，ie组合。"},
    {q: "Choose the correct spelling.", o: ["because", "becouse", "becaus", "beccause"], a: 0, why: "because是正确拼写。"},
    {q: "Find the mistake: 'He don't like playing football.'", o: ["He", "don't", "like", "playing"], a: 1, why: "He是第三人称单数，应改为doesn't。"},
    {q: "Find the mistake: 'She is more taller than me.'", o: ["She", "is", "more taller", "than me"], a: 2, why: "taller已经是比较级，不能再用more，应改为taller。"},
    {q: "Find the mistake: 'There have many books on the shelf.'", o: ["There", "have", "many books", "on the shelf"], a: 1, why: "There be句型不能用have，应改为are。"},
    {q: "Find the mistake: 'I am a Chinese. I come from China.'", o: ["I am a Chinese", "I come", "from", "China"], a: 0, why: "Chinese作名词指人时单复数同形，应改为I am Chinese。"},
    {q: "Find the mistake: 'How many water do you drink every day?'", o: ["How many", "water", "do you drink", "every day"], a: 0, why: "water是不可数名词，应用How much。"},
    {q: "Complete: If you ___ (study) hard, you ___ (pass) the exam.", o: ["study; will pass", "will study; pass", "study; pass", "studied; will pass"], a: 0, why: "主将从现，if条件句用一般现在时，主句用将来时。"},
    {q: "Complete: He ___ (not go) to school if it ___ (rain) tomorrow.", o: ["won't go; rains", "doesn't go; will rain", "won't go; will rain", "doesn't go; rains"], a: 0, why: "主将从现，主句用将来时won't go，if从句用现在时rains。"},
    {q: "Choose the best response: 'I failed the exam.' — '___'", o: ["Well done!", "Don't give up!", "Congratulations!", "You're welcome."], a: 1, why: "对方考试不及格，应鼓励Don't give up!（不要放弃）。"},
    {q: "Choose the best response: 'I won the first prize!' — '___'", o: ["What a pity!", "Congratulations!", "I'm sorry to hear that.", "Never mind."], a: 1, why: "对方获奖，应祝贺Congratulations!"},
    {q: "Choose the best response: 'My grandmother is ill.' — '___'", o: ["Great!", "I'm sorry to hear that.", "Good luck.", "Don't worry."], a: 1, why: "听到不好的消息用I'm sorry to hear that.（很遗憾听到这个）。"}
  ]
});

papers.push({
  id: "ex302", cat: 3, name: "小升初密考·英语综合能力（二）", time: 60,
  questions: [
    {q: "Fill in: The teacher made us ___ (quiet) in the library.", o: ["to be quiet", "be quiet", "quiet", "being quiet"], a: 1, why: "make sb do sth，make后接不带to的不定式。"},
    {q: "Fill in: I remember ___ (see) him somewhere before.", o: ["to see", "seeing", "see", "saw"], a: 1, why: "remember doing sth（记得做过某事），remember to do（记得要做某事）。这里是记得见过，用seeing。"},
    {q: "Fill in: Please remember ___ (lock) the door when you leave.", o: ["to lock", "locking", "lock", "locked"], a: 0, why: "记得要锁门（还没锁），用remember to lock。"},
    {q: "Fill in: He stopped ___ (smoke) last year.", o: ["to smoke", "smoking", "smoke", "smoked"], a: 1, why: "stop doing sth（停止正在做的事），去年戒烟用stopped smoking。"},
    {q: "Fill in: He stopped ___ (talk) to me and went away.", o: ["to talk", "talking", "talk", "talked"], a: 0, why: "stop to do sth（停下来去做某事），停下来跟我说话用stopped to talk。"},
    {q: "Fill in: I'm looking forward to ___ (hear) from you.", o: ["hear", "hearing", "be hearing", "heard"], a: 1, why: "look forward to中to是介词，后接doing，用hearing。"},
    {q: "Fill in: The boy is old enough ___ (go) to school.", o: ["go", "to go", "going", "gone"], a: 1, why: "enough + to do sth，用to go。"},
    {q: "Fill in: It's kind ___ you to help me.", o: ["for", "of", "to", "with"], a: 1, why: "It's kind of sb to do sth，形容词修饰人用of。"},
    {q: "Fill in: It's important ___ us to learn English well.", o: ["for", "of", "to", "with"], a: 0, why: "It's important for sb to do sth，important修饰事用for。"},
    {q: "Fill in: The story happened ___ a cold winter morning.", o: ["in", "on", "at", "of"], a: 1, why: "具体某天的早上用on，on a cold winter morning。"},
    {q: "Fill in: He has been a teacher ___ 2010.", o: ["for", "since", "in", "from"], a: 1, why: "since+时间点，for+时间段。2010是时间点，用since。"},
    {q: "Fill in: I have learned English ___ five years.", o: ["for", "since", "in", "from"], a: 0, why: "for+时间段，five years是时间段，用for。"},
    {q: "Fill in: The boy ___ glasses is my brother.", o: ["in", "with", "on", "of"], a: 1, why: "with glasses（戴眼镜的），用with表示带有。"},
    {q: "Fill in: He is interested ___ playing basketball.", o: ["in", "at", "on", "with"], a: 0, why: "be interested in sth/doing sth是固定搭配。"},
    {q: "Fill in: She is good ___ singing.", o: ["in", "at", "on", "for"], a: 1, why: "be good at doing sth（擅长做某事）是固定搭配。"},
    {q: "Fill in: The old man is famous ___ his novels.", o: ["for", "as", "in", "of"], a: 0, why: "be famous for（因...而著名），be famous as（作为...而著名）。因小说出名用for。"},
    {q: "Fill in: Yao Ming is famous ___ a basketball player.", o: ["for", "as", "in", "of"], a: 1, why: "作为篮球运动员出名，用be famous as。"},
    {q: "Fill in: Please ___ the TV. The baby is sleeping.", o: ["turn on", "turn off", "turn up", "turn over"], a: 1, why: "婴儿在睡觉，应该关电视turn off。"},
    {q: "Fill in: It's dark. Please ___ the light.", o: ["turn on", "turn off", "turn down", "turn over"], a: 0, why: "天黑了，应该开灯turn on。"},
    {q: "Fill in: The plane will ___ in ten minutes.", o: ["take off", "take on", "take away", "take over"], a: 0, why: "take off（起飞），飞机十分钟后起飞。"}
  ]
});

/* ===== 更多真题 ===== */

papers.push({
  id: "ex104", cat: 1, name: "小升初英语真题·句型转换与完形填空", time: 50,
  questions: [
    {q: "Change to negative: 'He plays football every day.' → He ___ ___ football every day.", o: ["doesn't; play", "don't; play", "doesn't; plays", "isn't; play"], a: 0, why: "第三人称单数否定用doesn't + 动词原形。"},
    {q: "Change to question: 'She likes reading books.' → ___ she ___ reading books?", o: ["Does; like", "Do; like", "Does; likes", "Is; like"], a: 0, why: "第三人称单数疑问用Does + 主语 + 动词原形。"},
    {q: "Change to past: 'They go to school by bus.' → They ___ to school by bus.", o: ["goed", "went", "go", "going"], a: 1, why: "go的过去式是went（不规则变化）。"},
    {q: "Change to future: 'I am a student.' → I ___ ___ a student.", o: ["will; be", "will; am", "am; will", "shall; am"], a: 0, why: "一般将来时will + 动词原形，be是原形。"},
    {q: "Change to passive: 'People speak English in many countries.' → English ___ ___ in many countries.", o: ["is; spoken", "is; spoke", "are; spoken", "was; spoken"], a: 0, why: "被动语态be + 过去分词，English被说，用is spoken。"},
    {q: "Combine: 'He is young. He can't go to school.' → He is ___ young ___ go to school.", o: ["so; that", "too; to", "very; to", "too; that"], a: 1, why: "too...to...（太...而不能...），太年轻不能上学。"},
    {q: "Combine: 'He is tall. He can reach the shelf.' → He is ___ tall ___ he can reach the shelf.", o: ["so; that", "too; to", "such; that", "very; that"], a: 0, why: "so...that...（如此...以至于...），如此高以至于能够到。"},
    {q: "Combine: 'I don't know. He doesn't know either.' → ___ I ___ he knows.", o: ["Both; and", "Neither; nor", "Either; or", "Not only; but also"], a: 1, why: "Neither...nor...（既不...也不...），两人都不知道。"},
    {q: "Combine: 'Tom likes math. Jim likes math too.' → ___ Tom and Jim ___ math.", o: ["Both; like", "Neither; likes", "Either; likes", "All; like"], a: 0, why: "Both...and...（...和...都），两人都喜欢，用复数like。"},
    {q: "Complete the sentence: 'The more you read, ___ you will understand.'", o: ["more", "the more", "most", "the most"], a: 1, why: "The more..., the more...（越...越...），读得越多，理解得越多。"},
    {q: "\n\nCloze: Mr. Black is a teacher. He ___1___ English in a middle school. He works very hard. Every day he gets up at 6:00 and then has breakfast. He goes to ___2___ at 7:30. His students like him very much because his classes are ___3___.\n\n1. ___", o: ["teach", "teaches", "teaching", "taught"], a: 1, why: "主语He是第三人称单数，一般现在时动词加es，teach→teaches。"},
    {q: "2. ___", o: ["home", "school", "bed", "work"], a: 1, why: "老师7:30去学校（go to school）。"},
    {q: "3. ___", o: ["boring", "interesting", "difficult", "sad"], a: 1, why: "学生喜欢他因为课有趣（interesting）。"},
    {q: "\n\nCloze: It was a sunny Sunday. Lily and her family went to the park. They ___1___ a picnic under a big tree. Lily's father ___2___ some photos. Lily and her brother ___3___ games on the grass. They had a good time.\n\n1. ___", o: ["have", "had", "having", "has"], a: 1, why: "故事发生在过去（went），用had。"},
    {q: "2. ___", o: ["take", "took", "taking", "takes"], a: 1, why: "过去时，take的过去式是took。"},
    {q: "3. ___", o: ["play", "played", "playing", "plays"], a: 1, why: "过去时，play的过去式是played。"},
    {q: "Change to exclamatory: 'The weather is very nice.' → ___ nice weather it is!", o: ["What", "What a", "How", "How a"], a: 0, why: "weather是不可数名词，用What + adj + 不可数名词，不加a。"},
    {q: "Change to exclamatory: 'The girl is very lovely.' → ___ lovely the girl is!", o: ["What", "What a", "How", "How a"], a: 2, why: "感叹句修饰形容词lovely用How。"},
    {q: "Change to exclamatory: 'They are working very hard.' → ___ hard they are working!", o: ["What", "What a", "How", "How a"], a: 2, why: "感叹句修饰副词hard用How。"},
    {q: "Change to exclamatory: 'It is a very beautiful flower.' → ___ a beautiful flower it is!", o: ["What", "What an", "How", "How a"], a: 0, why: "flower是可数名词单数，用What a + adj + n。"}
  ]
});

papers.push({
  id: "ex203", cat: 2, name: "重点初中分班考·完形填空与阅读", time: 55,
  questions: [
    {q: "\n\nCloze: Many people like to watch TV. Watching TV is one of the most important activities of the day. TV ___1___ the outside world closer to people's homes. Some people say the world is ___2___ than before because of TV.\n\n1. ___", o: ["bring", "brings", "brought", "bringing"], a: 1, why: "TV是第三人称单数，一般现在时用brings。"},
    {q: "2. ___", o: ["big", "bigger", "small", "smaller"], a: 3, why: "因为电视让世界更近，所以世界变小了，用smaller。"},
    {q: "\n\nCloze: A good reader is like a good driver. Before you read a book, you should know ___1___ to read it. Some books are easy to read. You can read them ___2___. Some books are difficult. You should read them ___3___.\n\n1. ___", o: ["what", "why", "how", "where"], a: 1, why: "读书前应知道为什么读（why），即阅读目的。"},
    {q: "2. ___", o: ["slowly", "quickly", "carefully", "loudly"], a: 1, why: "简单的书可以快速读（quickly）。"},
    {q: "3. ___", o: ["quickly", "slowly", "fast", "carelessly"], a: 1, why: "难的书应该慢慢读（slowly）。"},
    {q: "\n\nRead and answer:\n\nA man was walking in a park. He found a bag of money. He picked it up and took it to the police station. The police officer thanked him and said, 'You are an honest man.' The next day, the owner of the money came to the police station. He gave the man 500 yuan as a reward.\n\nWhat did the man find in the park?", o: ["A bag of money", "A bag of food", "A book", "A dog"], a: 0, why: "文中说He found a bag of money。"},
    {q: "What did he do with it?", o: ["Kept it", "Took it to the police station", "Gave it to a friend", "Threw it away"], a: 1, why: "文中说He picked it up and took it to the police station。"},
    {q: "What did the police officer say?", o: ["You are a rich man", "You are an honest man", "You are a kind man", "You are a good man"], a: 1, why: "文中说You are an honest man。"},
    {q: "What did the owner give the man?", o: ["100 yuan", "500 yuan", "1000 yuan", "Nothing"], a: 1, why: "文中说He gave the man 500 yuan as a reward。"},
    {q: "What kind of person is the man?", o: ["Rich", "Honest", "Funny", "Clever"], a: 1, why: "拾金不昧说明他是诚实的人（honest）。"},
    {q: "\n\nRead and answer:\n\nIn England, people don't usually talk much. You can go on a bus or a train, and everyone sits looking out of the window. They often read books or newspapers. But they don't talk much. When you meet English people, they often talk about one thing—the weather. So if you want to talk to an English person, you can say 'Nice weather for the time of year.'\n\nWhat do English people usually do on a bus?", o: ["Talk much", "Read books or newspapers", "Sleep", "Eat"], a: 1, why: "文中说They often read books or newspapers。"},
    {q: "What do English people often talk about?", o: ["Books", "Newspapers", "The weather", "Money"], a: 2, why: "文中说they often talk about one thing—the weather。"},
    {q: "What can you say to start a conversation with an English person?", o: ["How are you?", "Nice weather for the time of year.", "What's your name?", "How old are you?"], a: 1, why: "文中建议说'Nice weather for the time of year.'。"},
    {q: "Do English people talk much on trains?", o: ["Yes", "No", "Sometimes", "Always"], a: 1, why: "文中说people don't usually talk much。"},
    {q: "What does everyone do on a bus?", o: ["Talks to each other", "Sits looking out of the window", "Sings", "Plays games"], a: 1, why: "文中说everyone sits looking out of the window。"},
    {q: "\n\nRead and answer:\n\nA: Excuse me. How can I get to the post office?\nB: Go straight and turn left at the second crossing. It's on your right.\nA: Is it far from here?\nB: No, it's about 500 meters.\nA: Thank you very much.\nB: You're welcome.\n\nWhere does A want to go?", o: ["The bank", "The post office", "The hospital", "The school"], a: 1, why: "对话中A问How can I get to the post office?"},
    {q: "How should A go?", o: ["Turn right at the first crossing", "Go straight and turn left at the second crossing", "Turn left at the first crossing", "Go straight and turn right at the second crossing"], a: 1, why: "B说Go straight and turn left at the second crossing。"},
    {q: "Is the post office far?", o: ["Yes, very far", "No, about 500 meters", "No, about 100 meters", "Yes, about 1 kilometer"], a: 1, why: "B说No, it's about 500 meters。"},
    {q: "Where is the post office?", o: ["On the left", "On the right", "Next to the bank", "Behind the school"], a: 1, why: "B说It's on your right。"},
    {q: "What does A say to thank B?", o: ["Thanks", "Thank you very much", "Thank you", "Thanks a lot"], a: 1, why: "A说Thank you very much。"}
  ]
});

/* ===== 生成输出 ===== */
var totalQ = 0;
papers.forEach(function(p){ totalQ += p.questions.length; });

var out = "// AUTO-GENERATED by build/gen-exam.js — 小升初/分班考/密考英语真题\n";
out += "// " + papers.length + " 套试卷, " + totalQ + " 道题\n";
out += "var EXAM_DATA = {\n";
out += "  categories: " + JSON.stringify(categories, null, 2) + ",\n";
out += "  papers: " + JSON.stringify(papers, null, 2) + "\n";
out += "};\n";

var outPath = path.join(__dirname, "..", "src", "scripts", "data", "english-exam.js");
fs.writeFileSync(outPath, out, "utf8");
console.log("Generated " + outPath);
console.log("Categories: " + categories.length + ", Papers: " + papers.length + ", Questions: " + totalQ);