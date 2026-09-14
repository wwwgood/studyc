# -*- coding: utf-8 -*-
# 追加 动词（topicId=10）50 题到 english-paper-1000.js（一次性脚本，幂等）
import io

def esc(s):
    return (s.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n'))

qs = []
def fill(i, q, ans, why):
    qs.append('    { id: "p1000-%03d", subject: "english", module: "paper1000", topicId: 10, type: "fill",\n      q: "%s",\n      ansText: "%s",\n      why: "%s",\n      source: "语法1000题·动词" }' % (i, esc(q), esc(ans), esc(why)))

def cho(i, q, o, a, why):
    opts = ", ".join('"%s"' % esc(x) for x in o)
    qs.append('    { id: "p1000-%03d", subject: "english", module: "paper1000", topicId: 10, type: "choice",\n      q: "%s",\n      o: [%s], a: %d,\n      why: "%s",\n      source: "语法1000题·动词" }' % (i, esc(q), opts, a, esc(why)))

cho(601, "I like ______ because they can ______ mice.", ["cats; catch","cat; catching","cat; catch"], 0, "like后加可数名词复数，they can后加动词原形。")
cho(602, "The sandwiches ______ very hot.", ["is","am","are"], 2, "考查be动词。“我是am，你是are，is跟着他她它，复数都用are”可知答案为C。")
cho(603, "—What ______ those?\n—They ______ ducks.", ["are; is","are; are","is; are"], 1, "those是that的复数，ducks名词复数，动词要用复数。故选B。")
cho(604, "I like ______ because they can ______ and they are ______ .", ["rabbits; hop; cute","rabbits; hopping; cute","rabbits; cute; hop"], 0, "like后加名词复数，they can+动词原形，they are+形容词。")
cho(605, "—______ you Japanese?\n— Yes， ______", ["Is; I am","Are; I am not","Are; I am"], 2, "you的be动词用are；疑问句将be动词提至句首，答语有Yes应用肯定形式I am。")
cho(606, "I ______ a boy. My name ______ Tom. My friends ______ in the playground.", ["am; is; are","are; am; is","am; are; is"], 0, "I用am；My name第三人称单数用is；My friends复数用are。")
cho(607, "After he finished school, he ______ a bank manager in 1919.", ["works as","worked","worked as"], 2, "根据1919过去式，work as作为……而工作。故答案选C。")
cho(608, "Jack ______ get up late, but now he ______ getting up early.", ["used to; is used to","used to; used to","is used to; used to","is used to; is used to"], 0, "used to do sth表示过去常常做某事，be used to doing sth表示习惯做某事。故选A。")
cho(609, "The coat ______ be Lily's. She wears it very often.", ["may","might","must"], 2, "她经常穿它，肯定推测“一定是”Lily的，用must。")
cho(610, "My mother is ______ a cake ______ my birthday.", ["making; to","making; for","doing; to","doing; for"], 1, "is可知是现在进行时；for表示“为了”。故选B。")
cho(611, "______ they ______ any children?", ["Have; got","Has; got","Have; get"], 0, "they复数用Have；固定搭配have got有。")
cho(612, "Harry's been driving all day, he ______ be tired.", ["need","can","shall","must"], 3, "考查情态动词must，Harry已经开车一天了，后面说他一定很累，must表示肯定的猜测。")
cho(613, "Jane and Tom ______ my friends.", ["am","is","are"], 2, "两人共同做主语，用are。")
cho(614, "Where ______ you from?", ["is","do","are","be"], 2, "主语是you，谓语用are；where are you from表示问人来自哪里。")
cho(615, "______ this an ______ car?", ["Am; Italian","Is; Korea","Is; English"], 2, "根据this选择Is，形容车用表国家的形容词English。")
fill(616, "单词大变险：\n(1) tall（反义词）______\n(2) go（第三人称单数）______\n(3) Li Ming（名词所有格）______\n(4) he（宾格）______\n(5) black（反义词）______", "short；goes；Li Ming's；him；white", "(1)short与tall互为反义词；(2)go三单goes；(3)Li Ming's名词所有格；(4)he的宾格him；(5)white与black互为反义词。")
fill(617, "根据中文提示完成句子：\n(1) —她怎么了？她看上去很伤心。—她找不到她的新钢笔。\n—What's ______ ______ ______ ? She ______ ______ .\n—She ______ ______ her new pen.\n(2) —你在圣诞节喜欢做什么？—我喜欢把长筒袜放在床上。然后等待礼物。\n—What do you like ______ ______ Christmas?\n—I like ______ the ______ on the bed. Then, I ______ for the ______ .\n(3) 我经常在晚上7：00读书。\nI ______ ______ books ______ seven o'clock ______ the evening.", "wrong；with；her；looks；sad；can't；find；doing；at；putting；stocking；wait；presents；often；read；at；in", "(1)What's wrong with her?她怎么了；looks sad看上去很伤心；can't find找不到。(2)like doing sth；at Christmas；putting the stocking on the bed；wait for the presents等待礼物。(3)often read books at seven o'clock in the evening。")
fill(618, "Fill in the blanks with am, is, are, have or has（用 am, is, are, have, has 填空）：\n(1) —What ______ that? —It's a goose.\n(2) — ______ they cows? —Yes. The cows ______ white and black.\n(3) I ______ Old MacDonald. I ______ a farm. My farm ______ big.\n(4) I ______ five ducks. They ______ lovely.", "is；Are；are；am；have；is；have；are", "(1)that用is；(2)they用Are，cows复数用are；(3)I用am，拥有农场用have，farm单数用is；(4)拥有五只鸭用have，they用are。")
fill(619, "根据汉语完成句子，每空一词：\n(1) 房子前面有一辆汽车。There is a car ______ ______ ______ the house.\n(2) 你打算如何处理那些盘子？What ______ you ______ ______ ______ ______ those plates?\n(3) 请把它给我。Please give ______ ______ ______ .\n(4) 我正把这些书放到书架上。I'm ______ these books ______ ______ ______ .\n(5) 不要摔了那个花瓶。______ ______ that vase.", "in；front；of；are；going；to；deal；with；it；to；me；putting；on；the；shelf；Don't；drop", "(1)in front of在……前面；(2)be going to deal with打算处理；(3)give it to me；(4)现在进行时putting on the shelf；(5)否定祈使句Don't drop。")
fill(620, "用 there be 或 have 的正确形式填空：\n(1) I ______ a new dress.\n(2) He ______ a nice cake.\n(3) ______ any books on the desk?\n(4) ______ some water in the bottle.\n(5) What do you ______ ?\n(6) Our teacher ______ some interesting books.\n(7) Your parents ______ a big tent.\n(8) ______ a lot of skirts and a dress on the sofa.\n(9) ______ any soup on the table.\n(10) What does your mother ______ ?", "have；has；Are there；There is；have；has；have；There are；There isn't；have", "(1)I用have；(2)He用has；(3)books复数用Are there；(4)water不可数用There is；(5)do you后用have；(6)teacher单数用has；(7)parents复数用have；(8)skirts复数用There are；(9)soup不可数否定用There isn't；(10)does后用have。")
fill(621, "选择正确的答案：\n(1) ______ you like some beet?　A. Can　B. Would　C. Are\n(2) What would you like ______ dinner?　A. for　B. of　C. in\n(3) Here you ______ .　A. am　B. is　C. are\n(4) We ______ some fish and rice.　A. have　B. has　C. to have\n(5) Can I ______ some juice?　A. have　B. has　C. like", "B；A；C；A；A", "(1)would like sth.想要；(2)for dinner晚餐；(3)you用are，Here you are给你；(4)we为复数用have；(5)can+动词原形have。")
fill(622, "短语翻译：\n(1) 擅长 ______\n(2) 做美食 ______\n(3) 下（车）______\n(4) 开飞机 ______\n(5) 开出租车 ______\n(6) 立刻，马上 ______\n(7) 跳进…… ______\n(8) 在中国 ______", "good at；cook nice food；get off；fly a plane；drive a taxi；right away；jump into；in China", "备选答案be good at（擅长）。")
fill(623, "Read and write（用所给动词的适当形式填空）：\n(1) My sister ______ (be) a student. She ______ (have) some good friends.\n(2) My father can ______ (drive) a car. He ______ (be) a good driver.\n(3) Eddie, ______ (close) the door, please. It's cold.\n(4) My brother likes ______ (ride) a bicycle in the park.\n(5) Lucy ______ (walk) to school every day.\n(6) I ______ (be) a cook. I can ______ (cook) nice food.\n(7) Here ______ (be) some books.", "is；has；drive；is；close；riding；walks；am；cook；are", "(1)sister单数用is和has；(2)can后用原形drive，he用is；(3)祈使句用close；(4)like后接riding；(5)三单walks；(6)I用am，can后用cook；(7)books复数用are。")
fill(624, "连词成句：\n(1) find can't dog I my .\n(2) matter What's the ?\n(3) to I'm the going ask gatekeeper .\n(4) ago saw half I hour an her .\n(5) help Thank for you your .\n(6) can help tourists way find I their .", "I can't find my dog.；What's the matter?；I'm going to ask the gatekeeper.；I saw her half an hour ago.；Thank you for your help.；I can help tourists find their way.", "(1)我找不到我的狗；(2)What's the matter?怎么了；(3)我打算去问门卫；(4)我半小时前见过她；(5)谢谢你的帮助；(6)我可以帮助游客找到路。")
fill(625, "根据汉语完成句子，每空一词：\n(1) 他可能在图书馆。He ______ ______ in the library.\n(2) 我们对这次考试的成绩不确定。We ______ ______ ______ ______ of the grades of the exam.\n(3) 我妹妹可能正在看电视。My sister ______ ______ ______ TV.\n(4) 他可能已经在给他妈妈打电话了。He ______ ______ ______ calling his mother.\n(5) 布朗先生可能很忙。Mr. Brown ______ ______ very busy.", "can；be；are；not；sure；may；be；watching；may；have；been；may；be", "(1)can be可能；(2)are not sure of不确定；(3)may be watching可能正在看；(4)may have been calling可能一直在打；(5)may be可能很忙。")
fill(626, "Complete the sentences：\n(1) He has had some cabbage.（改为否定句）\n(2) Susan has had a haircut.（改为一般疑问句）\n(3) Have you had dinner?（作出否定回答）\n(4) I have finished my work.（改为一般疑问句，并作出肯定回答）\n(5) They have been to that place.（改为否定句）", "He hasn't had any cabbage.；Has Susan had a haircut?；No, I haven't.；Have you finished your work?；They haven't been to that place.", "(1)助动词后加not，some改为any；(2)助动词提前改一般疑问句；(3)否定回答No, I haven't；(4)have提前，肯定回答Yes, I have；(5)助动词后加not。")
fill(627, "完成句子：\n(1) 他擅长做模型船，而且他做得非常好。He is good at making ______ ______ , and he does it very well.\n(2) Tom是一个好男孩，他可以唱的非常好。Tom is a good boy, and he can ______ ______ ______ .", "model；ships；sing；very；well", "(1)model ships模型船；(2)sing very well唱得非常好。")
fill(628, "写出下列动词的过去式：\n(1) try ______　(2) free ______　(3) live ______　(4) lose ______\n(5) win ______　(6) take ______　(7) start ______　(8) sell ______\n(9) leave ______　(10) make ______　(11) keep ______　(12) love ______\n(13) get ______　(14) read ______　(15) have ______", "tried；freed；lived；lost；won；took；started；sold；left；made；kept；loved；got；read；had", "规则动词加-ed（try→tried, live→lived, start→started, love→loved等）；不规则：lose→lost, win→won, take→took, sell→sold, leave→left, make→made, keep→kept, get→got, read→read, have→had。")
fill(629, "根据中文意思，完成下列英文句子：\n(1) 一些农民正在农场上种菜。Some farmers are ______ ______ on the farm.\n(2) 我们有30多只鸭子。We have ______ ______ 30 ducks.\n(3) 那个男孩每天放学后喂猪。The boy feeds the pigs ______ ______ every day.\n(4) 汤姆，醒来！到上学的时间了。Tom, ______ ______ ! It's time for school.\n(5) 我早上比下午有更多的事情要做。I have ______ ______ things to do in the morning than in the afternoon.\n(6) 河里有几条鱼。There are ______ ______ in the river.", "growing；vegetables；more；than；after；school；wake；up；much；more；some；fish", "(1)现在进行时growing vegetables；(2)more than 30多于30只；(3)after school放学后；(4)wake up醒来；(5)much more things更多的事情；(6)some fish几条鱼（fish单复同形）。")
fill(630, "英汉互译：\n(1) 去钓鱼 ______\n(2) 说中文 ______\n(3) 等一会儿 ______\n(4) 发一封电子邮件 ______\n(5) 学习英语 ______\n(6) in the playground ______\n(7) by the river ______\n(8) live in China ______\n(9) after school ______\n(10) have Chinese lessons ______", "go fishing；speak Chinese；wait a minute；send an email；study English；在操场；在河边；住在中国；放学后；上中文课", "(3)备选wait a moment；(5)备选learn English。")
fill(631, "完成句子：\n(1) 你能说英文吗？是的，我能。我擅长英语。Can you speak English? Yes, I can. I ______ ______ ______ ______ .\n(2) 你能做什么？What ______ you ______ ?", "am；good；at；English；can；do", "(1)be good at English擅长英语；(2)What can you do?你能做什么？")
fill(632, "看图选择正确的短语，将其抄写在相应图下的横线上：\n（备选：go ice-skating / make a card / go for lunch / open the gift / Mother's Day / wake up）\n图1（写有祝妈妈节日快乐的卡片）______\n图2（孩子在床上伸懒腰）______\n图3（女孩在滑冰）______\n图4（女孩在餐厅门口）______\n图5（两个孩子在制作卡片）______\n图6（两个孩子打开礼物）______", "Mother's Day；wake up；go ice-skating；go for lunch；make a card；open the gift", "1：图中有妈妈节日快乐字样Mother's Day；2：伸懒腰wake up；3：女孩在滑冰go ice-skating；4：女孩在餐厅门口go for lunch；5：制作卡片make a card；6：打开礼物open the gift。")
fill(633, "Read, choose and write（选词填空：can / have / has / do / does / can't）：\n(1) I ______ a pink skirt. Jill ______ a yellow skirt.\n(2) A horse ______ run, but it ______ fly.\n(3) —______ a cup of tea. —Thank you.\n(4) —______ you have any cousins? —Yes, I ______ two cousins.\n(5) —What ______ Mrs Black do? —She is a cook.", "have；has；can；can't；Have；Do；have；does", "(1)I用have，Jill单数用has；(2)马会跑can run，不会飞can't fly；(3)Have a cup of tea喝杯茶；(4)Do you...提问，I用have；(5)Mrs Black第三人称单数用does。")
cho(634, "My brother and I ______ students.", ["am","is","are"], 2, "be动词搭配，所有复数要用are。弟弟和我是两个人，故选C。")
fill(635, "Look at the leaflet. Complete it with the verbs below（用以下动词完成游乐园卡片，不要重复哦）：\n（备选：A. fly　B. drive　C. ride　D. go）\n(1) ______ in a hot air balloon.\n(2) ______ on a banana boat.\n(3) ______ a motorbike or mountain bike.\n(4) ______ a go-kart And have fun!", "fly；ride；drive；go", "(1)热气球在天上飞fly；(2)香蕉船与on搭配的动词只有ride；(3)骑摩托车drive；(4)开卡丁车go。")
fill(636, "选词填空（has to / traffic lights / walk to / have a rest / show him round / great fun）：\n(1) There is a big party at the prince's house. It's ______ .\n(2) The library is not far. Let's ______ the library together.\n(3) Yang Ling turns right at the ______ .\n(4) You have a cold. You should ______ and drink some warm water.\n(5) My mother has a bad cough, she ______ take some medicine.\n(6) Ben is new in our class. We can ______ our school.", "great fun；walk to；traffic lights；have a rest；has to；show him around", "(1)很有趣great fun；(2)走着去walk to；(3)红绿灯traffic lights；(4)休息一下have a rest；(5)不得不has to；(6)四处参观show him around。")
fill(637, "—How can I ______ （get/gets） to your school?\n—Turn left at the ______ （two/second） traffic lights.", "get；second", "情态动词can后用动词原形get；在第二个交通灯处左拐用序数词second。")
fill(638, "We must follow the rules on the road.（对划线部分提问）\n______ ______ ______ do on the road?", "What；must；you", "对具体做的事情提问用what；原句有情态动词must，疑问句由must引导；原句中“我们”变疑问句改为“你们”。故答案为What, must, you。")
fill(639, "You m ______ keep your desk clean. You m ______ talk loudly in class.", "must；mustn't", "你必须保持桌面清洁，你禁止在班内大声说话。故答案为：must；mustn't。")
fill(640, "红灯亮了，Peter还要过马路，你会这样制止他：You ______ ______ .", "must；stop", "表示你必须停下。答案为must stop。")
cho(641, "---______ this book yours?\n---No, it's not ______ book. It is ______ .", ["Is, mine, her","Is, my, hers","Are, mine, hers","Are, my, her"], 1, "主语this动词用is；第二空后有名词用形容词性物主代词my；第三空后面没有名词用名词性物主代词hers。故答案为B。")
cho(642, "—When are you going to ______ for Shanghai?\n—Tomorrow morning.", ["get off","turn off","take off","set off"], 3, "get off下车；turn off关闭；take off脱下/起飞；set off动身。你什么时候动身去上海？故选D。")
cho(643, "She is ______ now. She can ______ well.", ["dance; dancing","dancing; dance","dancing; dances"], 1, "第一句“她现在正在跳舞”应为is dancing；第二句情态动词can后用动词原形dance。故答案为B。")
cho(644, "You ______ play in the street. It's dangerous.", ["may","can","mustn't","must"], 2, "mustn't意为“禁止”，句意为“你不能在街上玩，那太危险了”。")
cho(645, "—Can your sister sing?\n—______ .", ["Yes, he can","Yes, he does","No, she doesn't","Yes, she can"], 3, "Can...? 的肯定回答为Yes, ...can；否定回答为No, ...can't。")
cho(646, "—What can you do for the party, Chen Jie?\n—I can ______ .\n—Wonderful. Let's dance together.", ["draw cartoons","play the pipa","dance"], 2, "根据“一起跳舞”可知，只有dance符合要求。")
cho(647, "We ______ be quiet in the library.", ["must","mustn't","don't"], 0, "句意：我们在图书馆里必须保持安静。A必须，B不许，C不要。故选A。")
cho(648, "She can clean the classroom.（改为否定句）", ["She can't clean the classroom.","She doesn't clean the classroom.","Don't she clean the classroom."], 0, "含有情态动词can，直接在情态动词后加not即可。")
cho(649, "—Are there any apples on the tree? —No, ______ .", ["they are","there aren't","are"], 1, "there be句型的一般疑问句，否定回答用No, there aren't。故正确答案为B。")
cho(650, "—What colour is it?\n—It ______ red.", ["was","is","are"], 1, "主语是It第三人称单数，be动词应该用is。故选B。")

p = r"E:\htdocs\studyc\cpp-adventure\src\scripts\data\english-paper-1000.js"
src = io.open(p, encoding="utf8").read()
idx = src.find('    { id: "p1000-601"')
if idx >= 0:
    src = src[:idx].rstrip().rstrip(",") + "\n  ]\n};"
anchor = "  ]\n};"
assert src.count(anchor) == 1, src.count(anchor)
block = ",\n" + ",\n".join(qs) + "\n  ]\n};"
io.open(p, "w", encoding="utf8").write(src.replace(anchor, block))
print("appended", len(qs), "questions (ch10)")
