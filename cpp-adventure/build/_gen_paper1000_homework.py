# -*- coding: utf-8 -*-
# 追加 作业练习36题（代词16+冠词20）到 english-paper-1000.js 冠词章（topicId=2），幂等
import io

def esc(s):
    return (s.replace('\\', '\\\\').replace('"', '\\"')
             .replace('\n', '\\n'))

qs = []
def cho(i, q, o, a, why, src):
    opts = ", ".join('"%s"' % esc(x) for x in o)
    qs.append('    { id: "p1000-%03d", subject: "english", module: "paper1000", topicId: 2, type: "choice",\n      q: "%s",\n      o: [%s], a: %d,\n      why: "%s",\n      source: "%s" }' % (i, esc(q), opts, a, esc(why), esc(src)))

def fl(i, q, ans, why):
    qs.append('    { id: "p1000-%03d", subject: "english", module: "paper1000", topicId: 2, type: "fill",\n      q: "%s",\n      ansText: "%s",\n      why: "%s",\n      source: "作业练习·冠词" }' % (i, esc(q), esc(ans), esc(why)))

S1 = "作业练习·代词"
# ===== 考点一：人称代词的主宾格转换 =====
cho(1021, "______ likes playing basketball.（He / Him）", ["He","Him"], 0, "放在动词likes前面做主语，用主格He。解题技巧：动词前用主格，动词或介词后用宾格。", S1)
cho(1022, "Please help ______ with my homework.（I / me）", ["I","me"], 1, "放在动词help后面做宾语，用宾格me。", S1)
cho(1023, "The book is for ______ .（she / her）", ["she","her"], 1, "放在介词for后面，必须用宾格her。", S1)
# ===== 考点二：物主代词的“有名无名” =====
cho(1024, "This is ______ book.（my / mine）", ["my","mine"], 0, "后面有名词book，用形容词性物主代词my。解题技巧：有名用形（容词性），无名用名（词性）。", S1)
cho(1025, "That bike is not mine. It's ______ .（he / his）", ["he","his"], 1, "后面没有名词，独立使用，用名词性物主代词his（相当于his bike）。", S1)
cho(1026, "______ teacher is very kind.（Our / Ours）", ["Our","Ours"], 0, "后面有名词teacher，用形容词性物主代词Our。", S1)
# ===== 考点三：并列人称的顺序 =====
cho(1027, "Mary and ______ are classmates.（I / me）", ["I","me"], 0, "做主语用主格I，且根据礼貌原则，I要放在最后。", S1)
cho(1028, "______ are good friends.", ["You, he and I","I, you and he"], 0, "单数并列遵循“二、三、一”的顺序（You, he and I）；复数按“一、二、三”。", S1)
# ===== 考点四：反身代词的固定搭配 =====
cho(1029, "The little girl can dress ______ .（her / herself）", ["her","herself"], 1, "固定搭配dress oneself（自己穿衣服），主语是单数女孩，用herself。注意单复数要和主语一致。", S1)
cho(1030, "We enjoyed ______ at the party.（us / ourselves）", ["us","ourselves"], 1, "固定搭配enjoy oneself（玩得开心），主语是We，对应ourselves。", S1)
# ===== 考点五：指示代词与疑问代词 =====
cho(1031, "______ are my friends.（This / These）", ["This","These"], 1, "后面是复数名词friends，且指近处，用These。根据语境远近、单复数选择this/that/these/those。", S1)
cho(1032, "______ is your English teacher?（Who / What）", ["Who","What"], 0, "提问“人”是谁，用Who。", S1)
cho(1033, "______ bag is this?（Who / Whose）", ["Who","Whose"], 1, "提问“谁的”，表所属关系，用Whose。", S1)
# ===== 考点六：不定代词（高年级易错点） =====
cho(1034, "—Do you have ______ apples?\n—Yes, I have ______ .（some / any）", ["any; some","some; any"], 0, "一般疑问句用any；肯定回答用some。解题技巧：肯定句用some，否定/疑问句用any（请求建议除外）。", S1)
cho(1035, "There is ______ water in the bottle. We need to buy some.（little / a little）", ["little","a little"], 0, "根据后半句“我们需要买一些”可知水“几乎没有”，表否定，用little。有a是肯定（有一点），没a是否定（几乎没有）。", S1)

S2 = "作业练习·冠词"
# ===== 冠词填空 1-10 =====
fl(1036, "There is ______ picture of ______ elephant on ______ wall.", "a；an；the", "picture可数单数泛指，辅音音素开头用a；elephant元音音素开头用an；on the wall特指这面墙上的画用the。")
fl(1037, "This is ______ useful book. I've read it for ______ hour.", "a；an", "useful虽以元音字母u开头但发音/juː/首音是辅音音素，用a；hour的h不发音，元音音素开头用an。")
fl(1038, "______ elephant is much heavier than ______ horse.", "An；a", "不定冠词+单数名词表示一类事物：elephant元音音素开头用An（句首大写）；horse辅音音素开头用a。")
fl(1039, "______ doctor told him to take ______ medicine three times ______ day.", "The；/；a", "特指给他看病的医生用The；medicine不可数且泛指前不加冠词；three times a day表示频率是固定用法。")
fl(1040, "Let's go out for ______ walk.", "a", "go out for a walk（出去散步）是固定短语，中间需要加不定冠词a。")
fl(1041, "It's too hot. Open ______ door, please.", "the", "双方都知道的那扇门，是特指，用定冠词the。")
fl(1042, "There is ______ woman over there. ______ woman is Meimei's mother.", "a；The", "第一句泛指“一个女人”，woman辅音音素开头用a；第二句特指前面提到过的那位女人，用The。")
fl(1043, "______ sun rises in ______ east.", "The；the", "sun是世界上独一无二的天体，前面必须加The；in the east方位词前加定冠词the。")
fl(1044, "______ Yangtze River is ______ longest river in ______ China.", "The；the；/", "河流名称前加定冠词The；longest是最高级前必须加the；China是专有名词前零冠词。")
fl(1045, "Are you going to do it ______ second time?", "a", "a second time表示“再一次”表动作的重复；the second time则特指“第二次（特定的某次）”。句意表重复用a。")
# ===== 冠词选择 1-10 =====
cho(1046, "—Does Jim have ______ ruler?\n—Yes, he has ______ .", ["a; one","an; one","a; an"], 1, "ruler单数可数辅音音素开头泛指用a；回答用one泛指同类事物中的一个。故选B。", S2)
cho(1047, "There is ______ old bike. ______ old bike is Mr Zhao's.", ["an; The","a; The","an; A"], 0, "泛指“一辆旧自行车”old元音音素开头用an；特指前面提到过的那辆用The。故选A。", S2)
cho(1048, "______ apple a day keeps the doctors away.", ["A","The","An"], 2, "泛指“一个苹果”，apple以元音音素开头用An。故选C。", S2)
cho(1049, "—How many books do you have?\n—I have ______ book. That's ______ English book.", ["a; an","an; a","one; an"], 2, "强调数量“一”用one book；泛指一本英语书English元音音素开头用an。故选C。", S2)
cho(1050, "At that time Tom was ______ one-year-old baby.", ["a","an","the"], 0, "泛指“一个一岁的婴儿”，one-year-old中one以辅音音素/j/开头用a。故选A。", S2)
cho(1051, "______ tiger is ______ China.", ["A; from","The; of","The; from"], 2, "The tiger单数加定冠词泛指老虎这一类；be from China“来自中国”固定搭配。故选C。", S2)
cho(1052, "We can't see ______ sun at ______ night.", ["the; the","the; /","a; the"], 1, "sun独一无二加the；at night固定短语中间不加冠词。故选B。", S2)
cho(1053, "______ useful book it is!", ["What an","How a","What a","What"], 2, "感叹句中心词是名词book，用What引导；useful发音以辅音音素/juː/开头用a。What a useful book it is! 故选C。", S2)
cho(1054, "One afternoon he found ______ handbag. There was ______ \"s\" on the corner of ______ handbag.", ["a; an; the","a; a; the","an; an; an","the; a; a"], 0, "handbag辅音音素开头泛指用a；字母s发音/es/元音音素开头用an；特指前面提到的那个手提包的角落用the。故选A。", S2)
cho(1055, "______ old lady with white hair spoke ______ English well at ______ meeting.", ["An; an; a","The; /; an","The; /; a","The; /; the"], 3, "old lady with white hair有后置定语修饰特指那位白发老妇人用The；speak English语言前不加冠词；at a meeting泛指一次会议。故选D。", S2)

p = r"E:\htdocs\studyc\cpp-adventure\src\scripts\data\english-paper-1000.js"
src = io.open(p, encoding="utf8").read()
idx = src.find('    { id: "p1000-1021"')
if idx >= 0:
    src = src[:idx].rstrip().rstrip(",") + "\n  ]\n};"
anchor = "  ]\n};"
assert src.count(anchor) == 1, src.count(anchor)
block = ",\n" + ",\n".join(qs) + "\n  ]\n};"
io.open(p, "w", encoding="utf8").write(src.replace(anchor, block))
print("appended", len(qs), "homework questions")
