# -*- coding: utf-8 -*-
# 追加 句法之复合句（topicId=14）60 题到 english-paper-1000.js（一次性脚本，幂等）
import io

def esc(s):
    return (s.replace('\\', '\\\\').replace('"', '\\"')
             .replace('\n', '\\n'))

qs = []
def fill(i, q, ans, why):
    qs.append('    { id: "p1000-%03d", subject: "english", module: "paper1000", topicId: 14, type: "fill",\n      q: "%s",\n      ansText: "%s",\n      why: "%s",\n      source: "语法1000题·复合句" }' % (i, esc(q), esc(ans), esc(why)))

def cho(i, q, o, a, why):
    opts = ", ".join('"%s"' % esc(x) for x in o)
    qs.append('    { id: "p1000-%03d", subject: "english", module: "paper1000", topicId: 14, type: "choice",\n      q: "%s",\n      o: [%s], a: %d,\n      why: "%s",\n      source: "语法1000题·复合句" }' % (i, esc(q), opts, a, esc(why)))

cho(921, "The teenagers like the musician ______ different kinds of music.", ["who play","which plays","who plays","that play"], 2, "考查定语从句。先行词是musician，关系代词要用who，musician是单数用plays。所以选C。")
cho(922, "The teacher ______ has long curly hair is reading books.", ["where","which","who"], 2, "who引导的定语从句。先行词the teacher是人，选择who/that。故答案选C。")
cho(923, "The food ______ is cold smells good.", ["how","what","who","which"], 3, "考查定语从句。先行词为物，引导词为which。")
cho(924, "I am sure ______ the doctor will come soon.", ["that","what","how"], 0, "考查宾语从句的用法。宾语从句里不缺成分和含义，用that。故选A。")
cho(925, "Susan will not arrive at the airport on time ______ she hurries up.", ["when","if","once","unless"], 3, "句意：苏珊无法准时到达机场除非她快一点。unless除非。")
cho(926, "Choose the correct answer.\nThis is the cake ______ my cousin made.", ["who","where","which"], 2, "考查定语从句。先行词cake是物用which。")
cho(927, "The fan ______ is small and green is broken.", ["where","which","who"], 1, "which引导的定语从句。先行词the fan是物体，选择which/that。故答案选B。")
cho(928, "Hi! I am Jordan ______ comes from China.", ["where","which","who"], 2, "指代Jordan（人）用who/that。")
cho(929, "You'll miss the train ______ you hurry up.", ["unless","as","if","until"], 0, "句意为：你会错过车的，除非你快点。unless除非。故选A。")
cho(930, "The restaurant ______ we had lunch was near the airport.", ["that","who","where"], 2, "考察定语及定语从句。先行词restaurant是地点用where。")
cho(931, "Is she the girl ______ you are looking for?", ["what","when","where","who"], 3, "考查关系代词。the girl为人，用who引导。句意：这是你要找的女孩嘛？故选D。")
cho(932, "Rosa likes music ______ is quiet and gentle.", ["that","what","who","where"], 0, "考查定语从句。what不能引导定语从句。故而选A。")
cho(933, "Could you tell me ______ a moment ago?", ["what were they talking about","what are they talking about","what they were talking about","what they are talking about"], 2, "宾语从句应用陈述句语序；a moment ago表示过去时。故答案选C。")
cho(934, "______ most of the earth's surface is covered by water, fresh water is very rare and precious.", ["As","Once","If","Although"], 3, "句意为：尽管地球上大部分地方都被水覆盖，但是淡水是很稀少也很珍贵的。故选D。")
cho(935, "My mother likes little animals ______ they are friendly and gentle.", ["but","and","or","because"], 3, "我妈妈很喜欢小动物因为他们非常的友好和温和。表示因果关系，故答案选D。")
cho(936, "Could you tell me ______ the National Stadium?", ["how to get to","which way is to","how can I get to","what is the way to"], 0, "考查宾语从句。宾语从句需要用陈述语序，B选项表达不正确，选择A。")
cho(937, "______ Mike didn't win the race, he was still wearing a smile on his face.", ["If","Since","Although","Because"], 2, "虽然Mike没有赢得比赛，但是他仍然在脸上挂着笑容。although虽然。故答案为C。")
cho(938, "______ the dentist was cleaning my teeth, I fell asleep in his chair.", ["When","Because","While","Why"], 2, "While 加过去进行时。")
cho(939, "It's ______ an interesting film that I would like to see it again.", ["so","such","as"], 1, "an interesting film是名词短语，用such引导。故选B。")
cho(940, "______ it was really hot, millions of people were still waiting outside the museum in Shanghai Expo.", ["Because","When","Although","While"], 2, "虽然很热，但是数以百万计的人还是在博物馆外面等着。故选C。")
cho(941, "I wanted to be a scientist ______ I was a little girl.", ["after","before","since","when"], 3, "当我还是小女孩时就想当科学家，when当……时。")
cho(942, "I will stay with you ______ you feel better.", ["until","when","because"], 0, "until直到。句意：我将会和你待在一起直到你感觉好一点。故答案选A。")
cho(943, "—Could you tell me ______ you'll go to Paris?\n—Next month .", ["why","where","when","how"], 2, "由下文next month可知，问句在询问什么时候去巴黎。故选C。")
cho(944, "—Could you tell me ______ now?\n—Talking about festival.", ["what they were doing","what are they doing","what they are doing","what were they doing"], 2, "由now可知时态要用现在进行时，并且宾语从句应用陈述句语序。故答案选C。")
fill(945, "I'm going to watch less TV ______ （so/because） I want to have more time for revision.", "because", "because连接原因状语从句。我打算少看电视，因为我想有更多时间复习。故答案为：because。")
cho(946, "You must not play on the road ______ there are many cars and bikes.", ["because","but","so","and"], 0, "后半句是解释为什么不要在路上玩的原因。because从属连词连接原因状语从句。故答案为：A。")
cho(947, "He asked ______ .", ["when did the match begin","when does the match begin","when the match began","when the match will begin"], 2, "宾语从句要遵循陈述语序，排除A和B；同时遵循“主过从过去”的原则。故答案选C。")
cho(948, "I was so tired ______ I feel asleep in the armchair.", ["as","such","that"], 2, "so...that如此……以至于。")
cho(949, "People ______ had lost everything in a big fire got much help from their friends.", ["what","which","who"], 2, "先行词people人物，关系词应该选择who/that。故选C。")
cho(950, "I don't know ______ up so early last Sunday.", ["why did he get","why he gets","why does he get","why he got"], 3, "考查宾语从句的时态和语序。根据last Sunday可知是一般过去时，故答案选D。")
cho(951, "Can you tell me ______ ?", ["where can I find my classroom","where is my classroom","where I can find my classroom","which is my classroom"], 2, "宾语从句的语序应为陈述句的语序，排除A、B、D。")
cho(952, "I had ______ breakfast that I ______ anything else for the rest of the day.", ["such a big; didn't eat","such a; didn't eat","so big a; eat"], 0, "such a big breakfast；that后用过去时didn't eat。答案A。")
cho(953, "Can you show me the new bike ______ last week?", ["that you bought it","which you bought it","which your father gave it to you","that your father gave you"], 3, "关系代词要在定语从句中做一定成分，先行词后面引导的句子是不完整的，排除A、B、C。")
cho(954, "It was ______ book that I couldn't put it down.", ["so good a","such a good","such good a"], 1, "such a good book。")
cho(955, "—What did Max just say to you?\n—He asked me ______ .", ["if I would like to go skating","when did I buy this CD","where I will spend the weekend","that I had a good time"], 0, "宾语从句中需要用陈述句语序排除B；根据asked引导词不能为that排除D；宾语从句中时态要保持一致排除C。故答案为A。")
cho(956, "Most students like the teachers ______ understand them well.", ["which","who","where","when"], 1, "考查定语从句。先行词teachers是人用who。")
cho(957, "I don't like the people ______ don't help others when they are in trouble.", ["who","which","whose","what"], 0, "考查定语从句。先行词people在定语从句中做主语，故答案为A。")
cho(958, "Lele walks to the cinema ______ is next to the park.", ["that","what","who"], 0, "考查定语从句。描述的名词是一个事物我们可以用which/that。")
cho(959, "I like winter ______ I can make a snowman.", ["but","to","because"], 2, "设空处前后是因果关系，故答案为C。")
cho(960, "She didn't tell me what ______ .", ["is his name","his name was","was his name","his name is"], 1, "宾语从句必须用陈述语序排除A、C；主句didn't tell是过去式，从句动词也要用相应的过去式排除D。选B。")
cho(961, "This is the present ______ my dad gave me for my birthday.", ["who","where","that"], 2, "that引导的定语从句。先行词the present是物体，选择that/which。故答案C。")
cho(962, "He had a stomach ache ______ he ate something bad this morning.", ["or","if","so","because"], 3, "他肚子疼，因为今天早上他吃了一些不好的东西。because因为。故答案为D。")
cho(963, "I like ______ oranges ______ they are sweet and sour, wow, they are so yummy!", ["eat; so","eating; so","eating; because"], 2, "like后面跟的是动词ing形式；后面叙述的是原因用because。故选C。")
cho(964, "John likes watching the animals ______ have tails and wings.", ["who","that","what"], 1, "指代animals（物）用that/which。")
cho(965, "The manager came up to see ______ .", ["what was the matter","what the matter was","what the matter is","what's the matter"], 0, "主句是过去时态，从句也要用相应的过去式；What is/was the matter属于特殊句式，本身已经是陈述句语序。故选A。")
cho(966, "—______ do you like science?\n—______ it's interesting.", ["Why; So","What, Because","Why; Because"], 2, "考察疑问代词why，回答用because。")
cho(967, "The girl ______ is crying is afraid of clowns.", ["who","what","which"], 0, "考查定语从句。描述的名词是一个人我们可以用who/that。")
cho(968, "—______ do you like tigers?\n—______ they are so beautiful and strong!", ["Why; because","How; So","Why; Because"], 2, "答句的后半句是在表述tigers的原因，问题应该用why来提问，句首要大写。故选C。")
cho(969, "Running man is ______ popular TV show that I want to see it every day.", ["so","such","such a","too"], 2, "主句核心词是TV show，单数可数名词，前面用such a修饰。故选C。")
fill(970, "选出正确的关系词（A. who　B. where　C. which）：\n1 We like sitting on the balcony ______ we can watch birds.\n2 This is the swimming pool ______ is great for swimming lessons.\n3 I'm going to the water park with my friends ______ love swimming, too.\n4 You can change buses near the café ______ we had lunch yesterday.\n5 Look at the woman ______ is reading a book.", "B；C；A；B；A", "1：balcony阳台是地点用where。2：swimming pool后的定语从句缺乏主语应用which。3：friends是人用who。4：café是地点用where。5：woman是人用who。答案BCABA。")
cho(971, "—It's so noisy here that I can't hear ______ just now. Could you please say it again?\n—No problem.", ["what you say","what do you say","what you said","what did you say"], 2, "宾语从句要用陈述句语序排除B和D；根据句意“你”刚刚已经说完，用一般过去时。故选C。")
cho(972, "Peter works in a shop ______ I buy shoes.", ["where","which","that"], 0, "考查定语从句。描述的名词是一个地点我们可以用where。")
cho(973, "It was ______ that she couldn't finish it by herself.", ["so difficult a work","such a difficult work","so difficult work","such difficult work"], 3, "考查so...that和such...that区别。可以用such difficult work或so difficult the work is。故选D。")
cho(974, "Can you guess ______ ?", ["what she wear","what she wears","what does she wear","what does she wears"], 1, "考查宾语从句的语序问题。宾语从句是特殊疑问词+主语+谓语动词。故选B。")
cho(975, "We will go travelling if it ______ rain this weekend.", ["won't","isn't","doesn't","don't"], 2, "本题考查条件状语从句，主将从现，it三单用doesn't。")
cho(976, "I don't know ______ he will come tomorrow.", ["what","where","who","whether"], 3, "我不知道他明天是否会来，whether引导宾语从句表“是否”。")
cho(977, "The animal over there is an elephant, ______ is big and quiet.", ["which","that","where"], 0, "指代animal用which/that，非限制性定语从句用which。")
cho(978, "I like summer ______ I can eat ice cream.", ["but","so","because"], 2, "我喜欢夏天因为我可以吃冰淇淋，因果关系用because。")
cho(979, "I like kittens ______ they are very cute.", ["so","because","but"], 1, "后半句明显是解释喜欢小猫咪的原因，所以用because。故选择B。")
cho(980, "The computer ______ I bought a week ago broke down today.", ["what","who","which","whom"], 2, "句意：我一周前买的电脑今天坏了。空格处引导先行词computer的定语从句，且在从句中做宾语。因此选C项。")

p = r"E:\htdocs\studyc\cpp-adventure\src\scripts\data\english-paper-1000.js"
src = io.open(p, encoding="utf8").read()
idx = src.find('    { id: "p1000-921"')
if idx >= 0:
    src = src[:idx].rstrip().rstrip(",") + "\n  ]\n};"
anchor = "  ]\n};"
assert src.count(anchor) == 1, src.count(anchor)
block = ",\n" + ",\n".join(qs) + "\n  ]\n};"
io.open(p, "w", encoding="utf8").write(src.replace(anchor, block))
print("appended", len(qs), "questions (ch14)")
