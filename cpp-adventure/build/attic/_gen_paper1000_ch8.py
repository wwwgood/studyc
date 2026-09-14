# -*- coding: utf-8 -*-
# 追加 介词（topicId=8）50 题到 english-paper-1000.js（一次性脚本，幂等）
import io

def esc(s):
    return (s.replace('\\', '\\\\').replace('"', '\\"')
             .replace('\n', '\\n'))

qs = []
def fill(i, q, ans, why):
    qs.append('    { id: "p1000-%03d", subject: "english", module: "paper1000", topicId: 8, type: "fill",\n      q: "%s",\n      ansText: "%s",\n      why: "%s",\n      source: "语法1000题·介词" }' % (i, esc(q), esc(ans), esc(why)))

def cho(i, q, o, a, why):
    opts = ", ".join('"%s"' % esc(x) for x in o)
    qs.append('    { id: "p1000-%03d", subject: "english", module: "paper1000", topicId: 8, type: "choice",\n      q: "%s",\n      o: [%s], a: %d,\n      why: "%s",\n      source: "语法1000题·介词" }' % (i, esc(q), opts, a, esc(why)))

cho(511, "壮壮看到这些玩具在床上，应该说：", ["Look! They are near the bed.","Look! They are on the bed.","Oh! It's here."], 1, "根据情景中的关键词“在床上（on the bed）”可知选B。")
cho(512, "He likes to play ______ football ______ Sunday.", ["the; at","/; on","/; at","/; in"], 1, "考查冠词和介词。球类运动零冠词，星期前面用介词on。")
cho(513, "They ______ have a party ______ seven o'clock.", ["is going to; on","are going to; in","are going to; at"], 2, "一般将来时：主语+be going to+动词原形。they主语为复数谓语用are；具体的时间点用介词at。故选C。")
cho(514, "He goes to work ______ every day.", ["by their bikes","by his bike","by the bike","on his bike"], 3, "by+交通工具中间不能加冠词或者代词，故ABC均排除；on his bike也表示骑自行车。故答案为D。")
cho(515, "Excuse ______ , could you tell me the way ______ the park?", ["me; on","me; to","I; to"], 1, "动词后加宾格用me；the way to...到……的路。故答案选B。")
cho(516, "My home is ______ the post office.", ["far","near","near from"], 1, "表示“离得远”要用far from；near“接近于”，介词，后可直接跟地点名词；near from搭配错误。故选B。")
cho(517, "I was born ______ 2004.", ["in","on","at"], 0, "考查介词。in接年份，故答案选A。")
cho(518, "—Will you ______ fish ______ me?\n—Yes, I ______ .", ["cooking; to; will","cook; for; do","cook; for; will"], 2, "will后用动词原形排除A；Will you do...?回答为Yes, I will./No, I won't. 故排除B。故答案选C。")
cho(519, "What do you have ______ Thursdays?", ["at","on","in"], 1, "具体的“天”用介词on（即使这里是复数），具体时间点用at，月份年份用in。所以选B。")
cho(520, "We don't go to school ______ Friday.", ["at","in","on","by"], 2, "在星期五用介词on。")
cho(521, "—______ do you go to Beijing from New York?\n—______ plane.", ["Where; By","How; On","How; By"], 2, "询问交通方式用How，乘坐飞机by plane。")
cho(522, "You should ______ your books ______ order.", ["putting; in","put; in","puts; on"], 1, "should后接动词原形put；“把……放整齐”put sth. in order。故选B。")
cho(523, "Look, the cinema is ______ the restaurant.", ["next","next to","to"], 1, "next to...在...旁边。故答案为B。")
cho(524, "Photos are ______ the wall.", ["on","in","under","at"], 0, "表示“挂在、贴在”墙上的时候用介词on。故选A。")
cho(525, "Please turn right ______ the crossing.", ["at","in","on"], 0, "at the crossing 在十字路口。")
cho(526, "—Where ______ my sunglasses?\n—They're ______ the floor.", ["are; in","is; on","are; on"], 2, "sunglasses为复数，谓语动词使用are；on the floor 在地板上。故答案为C。")
cho(527, "They arrived ______ the shop at 8 am.", ["to","along","beside","at"], 3, "at + 小地点，arrive at 到达。故选D。")
cho(528, "It's warm ______ September.", ["in","on","at","for"], 0, "月份前面加上in，一个具体的时间则用on。")
cho(529, "You should walk ______ the street.", ["along","for","with","at"], 0, "along 沿着。")
cho(530, "The cat is ______ the door.", ["behind","next","in"], 0, "猫在门后，用behind。")
cho(531, "He is ______ the bathroom.", ["in","under","on"], 0, "in the bathroom意为“在浴室”。in表示在某个空间的里面。故选A。")
cho(532, "Helen is in front of me. I am ______ her.", ["behind","in front of","beside","next"], 0, "Helen在我的前面，因此我在她的后面，behind表示在……的后面。")
cho(533, "Steve Jobs died ______ 2011.", ["on","in","at"], 1, "年份前用介词in。故答案选B。")
cho(534, "Mike usually gets up ______ 8 o'clock ______ Saturday.", ["at, on","on, on","in, at","at, in"], 0, "具体某一时间点用介词at；在星期几用介词on。选择A。")
cho(535, "I get up ______ 10 o'clock every morning.", ["in","on","at"], 2, "10点钟为特定的某个时刻，故使用介词at。故选C。")
cho(536, "______ you tell me the way ______ the lake?", ["Could, on","Could, to","Are, to"], 1, "你能告诉我去……的路吗？Could you tell me the way to...? 故答案选B。")
cho(537, "We can meet ______ the park gate ______ 3:00 p.m.", ["at, on","on, at","at, at"], 2, "at the gate是固定搭配；3:00 p.m.为具体时间点，at后加具体时间点。所以选择C。")
cho(538, "The birds are flying ______ the rivers and mountains.", ["over","to","on"], 0, "over在正上方，on在上面且与物体接触。所以选over，选A。")
cho(539, "—Do you usually go to school ______ foot, Jane?\n—Yes, but I'd like to go by ______ car.", ["on; /","on; a","by; /","by; a"], 0, "On foot步行，固定介词短语；by car零冠词。故选A。")
cho(540, "I usually get up ______ 9:00 am.", ["at","in","on","with"], 0, "在具体的时刻前要用时间介词at。故答案选A。")
cho(541, "Ann's birthday is ______ January 11th.", ["in","on","at"], 1, "几月几号用介词on。故答案选B。")
fill(542, "看图判断句子正（T）误（F）：\n1.（图中教室）This is a classroom.\n2. There are three desks and two chairs.\n3. The computer is on the teacher's desk.\n4. There are three windows.\n5. The blackboard is near the door.", "T；F；T；F；T", "1：图片是一间教室相符T；2：图中是两张书桌三把椅子，不相符F；3：电脑在讲台上相符T；4：图中不是三扇窗户，不相符F；5：黑板在门旁边相符T。")
cho(543, "Lucy arrives in Shijiazhuang ______ 11:00 ______ the morning ______ February 2.", ["in; on; at","at; at; on","at; in; on"], 2, "时刻前使用介词at；一天中的早晚前使用介词in；具体年月日前使用介词on。故答案为C。")
cho(544, "The young men walked ______ the forest and came to a big river at last.", ["on","over","through","across"], 2, "“穿过树林”是从空间内部穿过，需用介词through，故选C。")
cho(545, "It's cold in Guangzhou ______ January.", ["in","for","of"], 0, "介词in与月份搭配。选A。")
cho(546, "He arrived ______ Beijing ______ 10:30 ______ May 12.", ["at; in; at","to; on; at","in; on; at","in; at; on"], 3, "arrive in +大地点（北京），at +钟点（10:30），on+日期（May 12）。所以答案选择D。")
cho(547, "Mrs. White arrived ______ London ______ six this morning.", ["at, at","at, on","in, at","in, for"], 2, "in + 大地点（London），at + 具体时间点（six）。故选C。")
cho(548, "There is a cooking class ______ Sunday morning ______ 9:00.", ["in; on","on, at","at; at"], 1, "in表示“在某世纪/年/季度/月/周或上午/下午/晚上”；on表示“在具体的某一天”或特定日期的上午；at表示“在某一时刻”。故选B。")
cho(549, "He didn't go to the party not ______ the time but ______ he was ill.", ["because of, because","because, because","because, because of","because of, because of"], 0, "前一空使用介词because of，后一空是原因状语从句用because。句意：他没参加派对不是因为时间，而是因为他生病了。选择A。")
cho(550, "A cat is running after a mouse. The cat is ______ the mouse.", ["in front of","behind","in"], 1, "考查方位介词。猫追老鼠，猫在老鼠后面用behind。")
cho(551, "A lot of people ______ different cities come to visit Shenzhen every year.", ["on","at","from"], 2, "根据题意是每年有很多来自（from）不同城市的人们来深圳，故选C。")
cho(552, "We'll have a meeting at Hilton Hotel ______ May, 2015.", ["on","in","at","from"], 1, "月份前用介词in。故选B。")
cho(553, "—Excuse me, ______ can I get to the restaurant?\n—You can turn left ______ the bookstore.", ["Where; at","How; on","How; at"], 2, "询问怎么到达用How；在书店（位置）左转用at。")
cho(554, "______ the morning of June 27, they visited the Great Wall.", ["In","At","From","On"], 3, "在具体某天的早上要用on。故答案为D。")
cho(555, "Sun is a tall girl ______ glasses. Do you know ______ ?", ["with, her","in, she","by, herself","at, she"], 0, "with表示带有，接具体有形的东西；know为动词，动词后要用宾格her。故答案选A。")
cho(556, "They live ______ the ______ floor.", ["in; ninth","in; nine","on; ninth","on; nineth"], 2, "在第几层楼用介词on，表达第几用序数词the ninth floor。故选C。")
cho(557, "Sue ______ born ______ 2012.", ["is, in","was, in","were, on","was, on"], 1, "be born，2012年表过去用was，时间介词in +年份。故选B。")
cho(558, "—When were you born?\n—I was born ______ May 1st, 1990.", ["in","at","on","for"], 2, "在具体的某一天用介词on。")
cho(559, "He usually goes to school ______ bus, but he went to school ______ his father's car today.", ["by, in","by; by","on; by","in; by"], 0, "by后直接加交通工具；若交通工具前有修饰词，要用on或in。故答案为A。")
cho(560, "______ Monday we go to school ______ seven o'clock.", ["In; at","At; in","On; at","On; for"], 2, "在星期几用介词on，具体在几点钟用介词at。故答案选C。")

p = r"E:\htdocs\studyc\cpp-adventure\src\scripts\data\english-paper-1000.js"
src = io.open(p, encoding="utf8").read()
idx = src.find('    { id: "p1000-511"')
if idx >= 0:
    src = src[:idx].rstrip().rstrip(",") + "\n  ]\n};"
anchor = "  ]\n};"
assert src.count(anchor) == 1, src.count(anchor)
block = ",\n" + ",\n".join(qs) + "\n  ]\n};"
io.open(p, "w", encoding="utf8").write(src.replace(anchor, block))
print("appended", len(qs), "questions (ch8)")
