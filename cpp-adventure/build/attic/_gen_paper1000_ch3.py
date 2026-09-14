# -*- coding: utf-8 -*-
# 追加 代词（一）（topicId=3）60 题到 english-paper-1000.js（一次性脚本，幂等）
import io

def esc(s):
    return (s.replace('\\', '\\\\').replace('"', '\\"')
             .replace('\n', '\\n'))

qs = []
def fill(i, q, ans, why):
    qs.append('    { id: "p1000-%03d", subject: "english", module: "paper1000", topicId: 3, type: "fill",\n      q: "%s",\n      ansText: "%s",\n      why: "%s",\n      source: "语法1000题·代词（一）" }' % (i, esc(q), esc(ans), esc(why)))

def cho(i, q, o, a, why):
    opts = ", ".join('"%s"' % esc(x) for x in o)
    qs.append('    { id: "p1000-%03d", subject: "english", module: "paper1000", topicId: 3, type: "choice",\n      q: "%s",\n      o: [%s], a: %d,\n      why: "%s",\n      source: "语法1000题·代词（一）" }' % (i, esc(q), opts, a, esc(why)))

cho(151, "—Mike, is this ______ bag?\n—No, I think it's ______ .", ["your; her","yours; his","your; hers"], 2, "第一空后有名词bag，填形容词性物主代词，排除yours；第二空后没有名词，填名词性物主代词，her是形容词性物主代词。故选C。")
cho(152, "______ pen is red and ______ is red, too.", ["She; my","Her; mine","She; I","Her; me"], 1, "第一空后面有名词，需要用形容词性物主代词；第二空需要用名词性物主代词作主语。故答案为B。")
cho(153, "Li Lei ______ a boy. ______ is in Class 5.", ["am, He","is, She","are, His","is, He"], 3, "Li Lei是第三人称单数故而用is；男孩用He作主语。故选D。")
cho(154, "—I'd like some noodles.\n—Here ______ are.", ["you","your"], 0, "Here you are. 为固定用法。句意：—我想吃些面条。—给你。")
cho(155, "______ piano is too old, but she likes playing it.", ["She's","She","Her","Hers"], 2, "her是形容词性物主代词，用在名词前面做定语；hers是名词性物主代词，其后不可以再跟名词。空后有名词piano，用Her。")
cho(156, "My grandmother is very old and ______ hair is ______ .", ["her; white","his; white","his; yellow"], 0, "根据句意：我的奶奶很老，她的头发花白。“奶奶的”用her指代，白色的white。故选A。")
cho(157, "Where is ______ new toy? I can't find it.", ["you","your","yours","mine"], 1, "空后有名词toy，用形容词性物主代词your做定语。")
cho(158, "Many people lost ______ homes in Yushu earthquake.", ["them","they","their","theirs"], 2, "句子中缺少定语，形容词性物主代词their相当于形容词来修饰名词homes做定语。故选C。")
cho(159, "This is not ______ English book. ______ is in the classroom.", ["my; My","my; Mine","me; Mine","mine; My"], 1, "第一个空后面有名词，选形容词性物主代词；第二空后没有名词，需要名词性物主代词。")
fill(160, "I love Alice. I love ______ .（it / her / him / them）", "her", "考查人称代词宾格。her，“她”的宾格。Alice是女孩，应用her指代。")
cho(161, "—Where ______ my dogs?\n—______ in the bedroom.", ["is; It's","are; They're","is; They're"], 1, "主语my dogs为复数，be动词选are，并且用they代替。故选B。")
cho(162, "—Excuse me. What's ______ name, please?\n—______ name is Jerry.", ["you; Your","your; My","his; My","her; Your"], 1, "句意：—打扰一下，请问你叫什么名字？—我的名字是杰瑞。故选B。")
cho(163, "My uncle is funny and cool. We all like ______ !", ["you","he","him"], 2, "like后接人称代词宾格，uncle是男性用him。")
cho(164, "—My mom loves my grandma.\n—Yes, ______ loves ______ very much!", ["she; her","she; him","her; her"], 0, "前面用代词的主格形式，后面用人称代词的宾格形式：mom用she，grandma用her。所以选择A。")
fill(165, "那是你的尺子吗？\nIs that ______ ruler?", "your", "考查形容词性物主代词。你的your。故填your。")
cho(166, "--- ______ this book yours?\n---No, it's not ______ book. It is ______ .", ["Is, mine, her","Is, my, hers","Are, mine, hers","Are, my, her"], 1, "主语是this，动词用is；第二空后面有名词，用形容词性物主代词my；第三空后面没有名词，用名词性物主代词hers。故答案为B。")
cho(167, "Miss Li is ______ music teacher. We all like her very much.", ["we","us","our","ours"], 2, "We是主格，Us是宾格，our是形容词性物主代词，Ours是名词性物主代词。空后有名词teacher，用our。")
cho(168, "—I have ______ to tell you, please help ______ to ______ fish, children.", ["something important; yourselves; some","important something; yourselves; some","important everything; yourself; little","something important; us; some"], 0, "形容词修饰不定代词时要放在不定代词的后面，something important一些重要的事情；help yourselves请随便吃。故选A。")
cho(169, "What are ______ going to do on Sunday?", ["them","they","their"], 1, "一般将来时疑问句的结构是Be动词+主语+going to+动词，be动词后要填主语，要用主格。故答案选B。")
cho(170, "—Whose toys ______ ?\n—______ .", ["are these; It's mine","is it; They're mine","are these; They're mine"], 2, "toys是可数名词复数，所以be动词和代词都应用复数，答句也应该用They're。所以选择C。")
cho(171, "Hello! I'm Linda. ______ eyes are big.", ["My","Me","I"], 0, "空格处应填形容词性物主代词My。B项为宾格，C项为主格。故答案为A。")
cho(172, "He doesn't have any son or daughter, so he lives by ______ .", ["his","him","he","himself"], 3, "考查反身代词。by oneself表示“由某人自己”。故选D。")
cho(173, "—Is the model plane ______ , Andy?\n—No, it isn't. ______ is at home.", ["yours; Mine","yours; My","yours; Her","my; His"], 0, "“你的（飞机模型）”“我的（飞机模型）”都需要用名词性物主代词yours，mine。")
cho(174, "—There isn't ______ food in the fridge.\n—Let's go to the supermarket to buy ______ .", ["any; some","any; any","some; any"], 0, "否定句用any，肯定句表示“一些”用some。")
cho(175, "—Dinner is ready. Help ______ , kids!\n—Wow! It ______ delicious. You are really good at cooking, Mum.", ["yourself; looks","yourselves; feels","yourselves; sounds","yourselves; tastes"], 3, "help oneself to sth.表示“随便吃喝”，后面是kids所以用复数yourselves；食物是“尝起来”tastes。故答案为D。")
cho(176, "Lily was 9 years old. ______ was old enough to go to school ______ .", ["She, herself","She, she","Her, herself","Her, she"], 0, "第一个空缺主语要用人称代词主格She；第二空“某人自己做”可直接用反身代词herself。故答案选A。")
fill(177, "Our friend Wang Fang ______ （read） a book about the writer Shen Shixi and then she told ______ （we） something interesting in it.", "read；us", "根据后半句的谓语动词tell用了过去时可知此处也应该用过去时read；tell sb. sth.动词后用代词宾格us。")
cho(178, "The dog can eat with ______ mouth.", ["their","it's","its"], 2, "狗用它的嘴吃东西。its它的。")
cho(179, "Lele loves robots and ______ favourite robot is always Kuan.", ["his","their","her"], 0, "Lele是男孩名，形容词性物主代词用his修饰favourite robot。")
cho(180, "Miss Li is an English teacher. ______ teaches ______ English.", ["He; we","His; us","She; us"], 2, "teach sb sth第二空应用宾格us；teaches为谓语动词，缺少主语用主格She。故答案选C。")
cho(181, "—Is ______ in the study?\n—Yes, she is.", ["he","she","her"], 1, "问句缺主语，her不能作主语，排除C。根据回答中的she可知，问句的主语是“她”，故选B。")
cho(182, "Tommy is a friend of ______ .", ["I","my","mine","me"], 2, "a friend of mine“我的一个朋友”，of后用名词性物主代词mine。故选C。")
cho(183, "______ have a new schoolbag. ______ schoolbag is heavy.", ["I, my","I, My","My, I"], 1, "前者缺主语用人称代词主格I，后者修饰名词schoolbag用形容词性物主代词My。故选B。")
cho(184, "—Is this your suitcase?\n—No, it isn't ______ . It's ______ .", ["mine; hers","my; she's","mine; her","my; hers"], 0, "考查物主代词。mine表示“我的”；hers表示“她的”。")
cho(185, "______ is a policeman. ______ English name is John.", ["He; Her","Her; His","He; His","His; Her"], 2, "第一个空缺主语选he；第二个空缺定语用形容词性物主代词his。因此选C。")
fill(186, "This is ______ （our/we） classroom.", "our", "后接名词classroom，表示我们的教室，应该使用形容词性物主代词our。故答案为our。")
cho(187, "This is my mom. I love ______ .", ["she","him","her"], 2, "考查人称代词，前文是mom（女性），宾格用her。")
cho(188, "Please come in and make ______ at home.", ["you","your","yours","yourself"], 3, "本题考查反身代词。make yourself at home 请随意、别拘束。")
cho(189, "Mike is my pen pal. I often help him with ______ Chinese.", ["he","his","him","himself"], 1, "横线后有名词Chinese，用形容词性物主代词his。A是主格，C是宾格，D是反身代词。")
cho(190, "This is my uncle. ______ is a policeman.", ["She","He","It"], 1, "空格处替代uncle的，叔叔是男性，要用He，故选B。")
cho(191, "The writer is very famous. I like ______ books very much.", ["he","his","him"], 1, "books前需要形容词性物主代词his修饰，“他的书”。")
cho(192, "There is a new library in ______ school.", ["they","them","their"], 2, "“他们的学校”用their，故选择C。")
cho(193, "My sister is a clerk. ______ works in a bank near here.", ["She","He","I","You"], 0, "后面说她在银行工作，动词work前应该用主格she。因此选A项。")
cho(194, "Lily is a beautiful girl. ______ is very thin.", ["He","Him","She","Her"], 2, "考查代词使用，she代替Lily。")
cho(195, "______ pen is red. ______ pencil is green.", ["Those; This","This; Those","That; Those","This; That"], 3, "pen和pencil均为单数，故而指示代词均需为单数。这支This，那只That。选择D。")
cho(196, "—Excuse me, is this ______ school?\n—No, ______ is next to the post office.", ["your; our","yours; ours","your; ours","you; our"], 2, "第一个空后有名词填形容词性物主代词your；第二个空后没有名词填名词性物主代词ours。故选C。")
cho(197, "—Mike, what is ______ ?\n—It's a kite.", ["this","these","those"], 0, "答句It's a kite为单数，用this提问。")
cho(198, "—Here's a postcard for you, Jim!\n—Oh, ______ is from my friend, Mary.", ["he","it","she","it's"], 1, "a postcard一张明信片属于单数，用人称代词it来代替，因而选B。")
cho(199, "Is this ______ book?", ["your","you","yours"], 0, "询问这是你的书吗？用形容词性物主代词your。")
cho(200, "Can ______ show me ______ hands?", ["you; you","you; your","your; you"], 1, "第一空是句子主语，填写人称代词主格you；第二空后接名词hands，使用形容词性物主代词your。故选B。")
cho(201, "Eating too many sweets is bad for ______ .", ["we","I","us","our"], 2, "for为介词，后面应为宾格us。句意：吃太多的糖对我们不好。故选C。")
cho(202, "I'm going skating. Would you like to go with ______ ?", ["me","I","my","mine"], 0, "with后面缺宾语，填人称代词“我”的宾格形式me。")
cho(203, "The teachers are happy when ______ students win the prize.", ["they","their","theirs"], 1, "students前需要形容词性物主代词their修饰，“他们的学生”得奖时老师们很高兴。")
cho(204, "I love our teachers. ______ are always ready to help us.", ["They","You","We","He"], 0, "空处指的是前文的老师们，用they指代，选A。")
cho(205, "Pass ______ a fork, please.", ["me","my","I"], 0, "pass sb. sth.句型中，sb.用人称代词的宾格。故选A。")
cho(206, "Tomorrow is our teacher's birthday and we are going to give ______ a big surprise.", ["him","his","himself"], 0, "考查人称代词，给他一个惊喜，他为宾格用him。")
cho(207, "—What's ______ telephone number?\n—______ telephone number is 6872-36.", ["your, My","you; My","his; Her","her; His"], 0, "句意：—你的电话号码是多少？—我的电话号码是6872-3651。选择A。")
cho(208, "Let ______ see your new picture.", ["I","me","my"], 1, "考查人称代词，let后用宾格，故选B。")
cho(209, "Do you know ______ ?", ["she","her","he"], 1, "know动词后跟人称代词宾格，A和C都是主格，故选B。")
cho(210, "Don't worry. I can do it ______ .", ["by me","in me","in myself","by myself"], 3, "By myself表示“我自己”，句意是：我可以自己做。")

p = r"E:\htdocs\studyc\cpp-adventure\src\scripts\data\english-paper-1000.js"
src = io.open(p, encoding="utf8").read()
# 幂等：先删掉本章（p1000-151 起）再追加
idx = src.find('    { id: "p1000-151"')
if idx >= 0:
    src = src[:idx].rstrip().rstrip(",") + "\n  ]\n};"
anchor = "  ]\n};"
assert src.count(anchor) == 1, src.count(anchor)
block = ",\n" + ",\n".join(qs) + "\n  ]\n};"
io.open(p, "w", encoding="utf8").write(src.replace(anchor, block))
print("appended", len(qs), "questions (ch3)")
