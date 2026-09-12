# -*- coding: utf-8 -*-
# 追加 代词（二）（topicId=4）60 题到 english-paper-1000.js（一次性脚本，幂等）
import io

def esc(s):
    return (s.replace('\\', '\\\\').replace('"', '\\"')
             .replace('\n', '\\n'))

qs = []
def fill(i, q, ans, why):
    qs.append('    { id: "p1000-%03d", subject: "english", module: "paper1000", topicId: 4, type: "fill",\n      q: "%s",\n      ansText: "%s",\n      why: "%s",\n      source: "语法1000题·代词（二）" }' % (i, esc(q), esc(ans), esc(why)))

def cho(i, q, o, a, why):
    opts = ", ".join('"%s"' % esc(x) for x in o)
    qs.append('    { id: "p1000-%03d", subject: "english", module: "paper1000", topicId: 4, type: "choice",\n      q: "%s",\n      o: [%s], a: %d,\n      why: "%s",\n      source: "语法1000题·代词（二）" }' % (i, esc(q), opts, a, esc(why)))

cho(211, "______ my English book and ______ books are theirs.", ["This is; that","This is; those","These are; that","These are; those"], 1, "第一空单数用This is；第二空复数用those。")
cho(212, "Do you like ______ ring? It was my birthday present.", ["this","those","these"], 0, "单数名词ring用this指代。")
cho(213, "—Mike, what is ______ ?\n—It's a kite.", ["this","these","those"], 0, "答句It's a kite为单数，用this提问。")
cho(214, "—Whose trousers ______ ?\n—I guess they are ______ .", ["is this; hers","are these; her","is this; her","are these; hers"], 3, "裤子是复数，指示代词用are these；第二空后面没有名词，填名词性物主代词hers，表示她的（裤子）。故答案选D。")
cho(215, "______ two girls are Mary and Linda.", ["This","That","These"], 2, "近的，复数名词用these。")
cho(216, "朋友到你家做客，你怎样介绍你的爸爸？", ["This is my sister.","This is my father."], 1, "考查情景问答，介绍某人用this is。")
fill(217, "this（复数）______", "these", "this是指示代词，意为“这个”，其复数形式是these，意为“这些”。故填these。")
cho(218, "—I haven't got any small change.\n—______ .", ["So do I","So have I","Neither I have","Neither have I"], 3, "Neither + 倒装句 结构表示“某物也不（是）……”。")
cho(219, "Will you please give the boy ______ to eat?", ["favorite something","different anything","popular everything","something delicious"], 3, "根据句意，你能给这个男孩一些吃的吗？复合不定代词与形容词连用，要把形容词放在后面，故答案为D。")
cho(220, "There must be something wrong with my ear. I can't hear ______ .", ["nothing","anything","something","somebody"], 1, "根据句意可知，表达的是“我听不到任何声音”，anything表示“任何事、物等”，故选B。")
cho(221, "—There isn't ______ food in the fridge.\n—Let's go to the supermarket to buy ______ .", ["any; some","any; any","some; any"], 0, "否定句用any，肯定句表示“一些”用some。")
cho(222, "Let's give them ______ to drink.", ["something different","different something","anything different","different anything"], 0, "形容词修饰不定代词放在不定代词之后，B、D排除；something用于肯定句，anything用于否定句，因此选A。")
cho(223, "I have ______ toilet paper. But I don't have ______ shampoo.", ["any; some","some; any","any; any"], 1, "some用于陈述句，any用于疑问句和否定句。故答案为B。")
cho(224, "John's father is hungry, but there is ______ for dinner.", ["something","nothing","anything","everything"], 1, "晚饭没有其他的了，选B。")
cho(225, "I can go back home. There's ______ to do here.", ["thing","nothing","all things"], 1, "表示“我可以回家了，这里没有事情可做了”。")
cho(226, "______ lovely the roses are! Would you like to buy ______ ?", ["How; some","How; much","What; any","What; some"], 0, "感叹句how引导形容词；此处some表建议。")
cho(227, "______ of my parents are on holiday in Hainan now.", ["All","Some","Any","Both"], 3, "父母指两者，两者都用both表示，选D。All表示三者或三者以上都，Some表示一些，any表示否定句中的一些或任何。")
cho(228, "Come here! I have ______ to tell you.", ["something important","important something","Some important thing","very important something"], 0, "考查复合不定代词和形容词用法。当两者连用时，形容词后置，所以选A。")
cho(229, "—Would you like ______ orange juice?\n--- Yes, please.", ["some","any","an","many"], 0, "句型Would you like...?是表示委婉请求，用some而不是any。故选A。")
cho(230, "The teacher has ______ to tell us.", ["something important","important something","some important"], 0, "考查不定代词用法。something的定语要后置，选A。")
cho(231, "Larry asks Bill and Peter to go on a picnic with him, but ______ of them wants to, because they have work to do.", ["either","any","neither","none"], 2, "Larry请求Bill和Peter一起去野餐，但是他们俩都不想去，neither表示两者都不，故答案为C。")
cho(232, "Eat ______ hot dog or drink ______ milk.", ["a…a","a…some","Some…some"], 1, "考查冠词。热狗可数，牛奶不可数。故选B。")
cho(233, "Everything here ______ very good and healthy.", ["is","are","am"], 0, "everything作主语，动词应用单数形式is。故答案选A。")
cho(234, "I had looked ______ , but I couldn't find my glasses.", ["nowhere","anywhere","everywhere","where"], 2, "nowhere意为“无处”；anywhere指“任何地方”用于疑问句和否定句；everywhere指“每个地方”。句意：我查看了每个地方，都没能找到我的眼镜。故选C。")
cho(235, "—What ______ are you?\n—I am ______ .", ["nation; China","national; Chinese","nationality; China","nationality; Chinese"], 3, "nationality是国籍的意思，通常与what构成特殊疑问句询问国籍。Chinese是中国人。")
cho(236, "—______ in your schoolbag?\n—A maths book and a pencil box.", ["What","What's","what's"], 1, "询问书包里有什么，用What's in your schoolbag? 句首字母大写。")
cho(237, "—______ I do?\n—You should do more exercise.", ["What should","How should","What do"], 0, "回答用了should，询问“我该做什么”用What should I do?")
cho(238, "Mum, I'm hungry. ______ for dinner?", ["What's","What","Where"], 0, "询问三餐吃什么的句型：What's for+三餐？句意：妈妈，我很饿。晚餐吃什么？故选A。")
cho(239, "—______ broke the window?\n—It's LiMing.", ["Who","What","Which","Where"], 0, "Who是对人提问，这里问谁打破了窗户。注意what are you?是问人的职业。")
cho(240, "______ nationality is Hans?", ["Where","What","How","Which"], 1, "对表语nationality这个名词提问用What。")
cho(241, "—______ ?\n—It's 11 o'clock.", ["How's the time","What the time","What's the time"], 2, "答句是时间，提问时间可用What's the time，故答案为C项。")
cho(242, "—______ in our new classroom?\n—Many desks and chairs.", ["Where's","What's","Who's"], 1, "答句是“许多桌椅”，问教室里有什么用What's。")
cho(243, "—______ is Mr Wang?\n—He is our PE teacher.", ["Why","How","Who"], 2, "询问“王老师是谁”，对人提问用Who。")
cho(244, "—______ one do you like, the blue one or the red one?\n—The red one, please.", ["Which","What","Where"], 0, "你喜欢哪一个，蓝色的还是红色的？which哪一个。")
fill(245, "连词成句：on chair the What is ?", "What is on the chair", "考查特殊疑问句。What is on the chair? 在椅子上是什么？")
cho(246, "______ pencils are these? Are they Li Ming's?", ["Who","Whose","What","Where"], 1, "这些铅笔是谁的？是李明的吗？Whose表示谁的。")
cho(247, "I like that ______ . Do you like ______ ?", ["pictures; it","picture; it","picture; picture"], 1, "that后接单数名词picture，排除A；下句用it代替那幅图片。故答案选B。")
cho(248, "______ is very cold today.", ["It is","Its","It's","It"], 3, "无人称动词主语通常用it，表示天气、时间、季节、距离等。A、C项谓语动词重复；its意为“它的”不是主格。故选D。")
cho(249, "—Why does he like running?\n—Because ______ cool!", ["they are","it is","they is"], 1, "跑步“这件事”用it，所以be动词用is，故选择B。")
cho(250, "—Is that your cousin?\n—______", ["Yes, it is.","No, he isn't.","Yes, it isn't."], 0, "Is that...?的肯定回答用Yes, it is.")
cho(251, "—Whose cap is this?\n—______", ["It's Amy.","It's Amy's.","They're Amy's."], 1, "Whose cap is this? 一般回答It's...后面接名词性物主代词做表语。It's Amy's 它是Amy的。故选B。")
cho(252, "The woman bought a pet dog for ______ son and he likes ______ very much.", ["her, it","her; its","she; it"], 0, "第一空修饰名词son用形容词性物主代词her；第二空用宾格it指代pet dog。")
cho(253, "Hello! I'm Linda. ______ eyes are big.", ["My","Me","I"], 0, "空格处应填形容词性物主代词My。B项为宾格，C项为主格。故答案为A。")
fill(254, "Tony is a boy. ______ （He/she） is my cousin.", "He", "Tony是一个男孩。根据第一句中boy可知，应选择表示男性的人称代词He。")
cho(255, "This new kind of ice cream tastes so delicious that I must share with my friends. Please give me ______ two.", ["other","the other","another","the others"], 2, "another又一个，在原来的基础上再来一个。根据句意可知已经尝过了，所以在原来的基础上再来两个，用another。故答案为C。")
fill(256, "At Christmas people like to give e ______ o ______ gifts.（互相）", "each；other", "固定短语each other，“互相，彼此”。句意：在圣诞节人们喜欢互相送礼物。")
cho(257, "They made the machine by ______ .", ["themselves","I","himself"], 0, "by oneself，独自地。句意：他们是自己做的那个机器。")
fill(258, "Peter learned English by ______ （he）.", "himself", "by oneself独自地，Peter对应himself。")
cho(259, "I could look after ______ when I was six.", ["herself","myself","yourself","himself"], 1, "look after oneself表示“照顾自己”，主语是I，故选myself。")
cho(260, "Please come in and make ______ at home.", ["you","your","yours","yourself"], 3, "本题考查反身代词。make yourself at home 请随意、别拘束。")
cho(261, "Peter and his sister Amy enjoyed ______ at the dancing party.", ["themself","himself","herself","themselves"], 3, "enjoy oneself玩得开心，前面提及两个人，反身代词用themselves。故答案选D。")
cho(262, "Don't worry. I can do it ______ .", ["by me","in me","in myself","by myself"], 3, "By myself表示“我自己”，句意是：我可以自己做。")
cho(263, "Help ______ , Linda.", ["youself","yourself","yourselves"], 1, "help yourself 请自便，Linda是单数用yourself。")
cho(264, "Boys, don't touch the machine, ______ you may hurt ______ .", ["or; myself","and; themselves","so; yourself","or; yourselves"], 3, "or否则，要不然；yourselves你们自己。男孩们，别碰这个机器，否则你们可能会伤到自己。故选D。")
cho(265, "—I have ______ to tell you, please help ______ to ______ fish, children.", ["something important; yourselves; some","important something; yourselves; some","important everything; yourself; little","something important; us; some"], 0, "形容词修饰不定代词时要放在不定代词的后面；help yourselves请随便吃。故选A。")
cho(266, "He doesn't have any son or daughter, so he lives by ______ .", ["his","him","he","himself"], 3, "考查反身代词。by oneself表示“由某人自己”。故选D。")
cho(267, "Help ______ to some fish, children.", ["yourselves","your","yours","youself"], 0, "Help yourself/yourselves表示“请自便，别客气”，children是复数用yourselves。选A。")
cho(268, "They all enjoyed ______ in the birthday party last night.", ["them","themself","themselves","theyselves"], 2, "enjoy oneself 意为“玩得开心”。他们昨晚在生日聚会上玩得很开心。故选C。")
cho(269, "---Did you find ______ in the park?\n---No, I found ______ there.", ["somebody, everybody","anybody, nobody","anybody, somebody","everybody, anybody"], 1, "anybody用于否定句和疑问句中，根据题意后面一空是没有发现任何人，所以是nobody。故答案选B。")
cho(270, "Boys and girls, help ______ to some steak.", ["yourselves","themselves","yourself"], 0, "固定搭配help oneself，主语为boys and girls是复数，要使用yourself的复数形式yourselves。")

p = r"E:\htdocs\studyc\cpp-adventure\src\scripts\data\english-paper-1000.js"
src = io.open(p, encoding="utf8").read()
idx = src.find('    { id: "p1000-211"')
if idx >= 0:
    src = src[:idx].rstrip().rstrip(",") + "\n  ]\n};"
anchor = "  ]\n};"
assert src.count(anchor) == 1, src.count(anchor)
block = ",\n" + ",\n".join(qs) + "\n  ]\n};"
io.open(p, "w", encoding="utf8").write(src.replace(anchor, block))
print("appended", len(qs), "questions (ch4)")
