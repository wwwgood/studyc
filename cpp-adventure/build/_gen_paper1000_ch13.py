# -*- coding: utf-8 -*-
# 追加 句法之简单句（topicId=13）50 题到 english-paper-1000.js（一次性脚本，幂等）
import io

def esc(s):
    return (s.replace('\\', '\\\\').replace('"', '\\"')
             .replace('\n', '\\n'))

qs = []
def fill(i, q, ans, why):
    qs.append('    { id: "p1000-%03d", subject: "english", module: "paper1000", topicId: 13, type: "fill",\n      q: "%s",\n      ansText: "%s",\n      why: "%s",\n      source: "语法1000题·简单句" }' % (i, esc(q), esc(ans), esc(why)))

def cho(i, q, o, a, why):
    opts = ", ".join('"%s"' % esc(x) for x in o)
    qs.append('    { id: "p1000-%03d", subject: "english", module: "paper1000", topicId: 13, type: "choice",\n      q: "%s",\n      o: [%s], a: %d,\n      why: "%s",\n      source: "语法1000题·简单句" }' % (i, esc(q), opts, a, esc(why)))

cho(871, "Pass ______ a fork, please.", ["me","my","I"], 0, "pass sb. sth.句型中sb.用人称代词的宾格。故选A。")
cho(872, "Can you ______ your bike ______ me?", ["show; for","showing; with","show; to"], 2, "can后用动词原形show；show sth. to sb=show sb. sth. 把某样东西展示给某人。故C。")
cho(873, "Give that hammer ______ me.", ["to","in","for","on"], 0, "Give sth to sb =give sb sth给某人某东西。")
cho(874, "I gave a sweet ______ the girl. She ______ happy.", ["to; became","to; become","for; became"], 0, "give sth to sb；时态保持一致，gave为过去时，become也应用过去时became。故答案选A。")
fill(875, "连词成句：This sister my is.", "This is my sister", "This指示代词作主语，is系动词，my sister作表语。故答案为：This is my sister.")
fill(876, "Let me show you my clothes.（改为同义句）\nLet me ______ ______ ______ ______ you.", "show；my；clothes；to", "show sth to sb = show sb sth。故答案是：show; my; clothes; to。")
cho(877, "Give ______ , please.", ["it me","me it","it to me","it for me"], 2, "give sth. to sb.或者give sb. sth.；当代词放在give之后要用宾格（it to me）。故选C。")
cho(878, "She ______ flowers ______ her mother.", ["buy; for","bought; to","bought; for"], 2, "主语she是第三人称，buy未加s排除A；双宾语搭配buy sth. for sb.。故选C。")
cho(879, "On Spring Festival, people will ______ lucky money ______ children.", ["give; to","gived; for","gived; /"], 0, "give sb. sth=give sth. to sb. 可知选项A正确。will后用原形。故选A。")
fill(880, "Mike c ______ Liu Tao yesterday, because he wanted to g ______ h ______ the fish.", "called；give；him", "yesterday可知用一般过去时called；want to do sth填give；give后用宾格him。Mike昨天给刘涛打电话因为他想把鱼给刘涛。")
fill(881, "He sends his friends an email.（同义句）\nHe sends ______ ______ ______ his friends.", "an；email；to", "send sb. sth. =send sth. to sb 送某人某物。故答案为an email to。")
fill(882, "The two men showed the king his new clothes.（改成同义句）", "The two men showed his new clothes to the king", "show sb. sth. = show sth. to sb.")
cho(883, "Please show ______ birthday presents ______ .", ["I; to us","your; them","you; to them","your; to us"], 3, "请向我们展示你的生日礼物：形容词性物主代词your；show sth. to sb.填to us。故答案为D。")
fill(884, "连词成句：go to the zoo I with my parents .", "I go to the zoo with my parents", "I做主语句首，go to the zoo动宾结构，with my parents状语句末。我和我的父母一起去动物园。")
cho(885, "Give a book to ______ .", ["I","him","they"], 1, "人称代词宾格放在动词和介词后面。介词to后面要用宾格him。故选B。")
cho(886, "Mr. Williams ______ some beautiful stamps ______ us this morning.", ["shows; for","showed; to","show; for","shows; to"], 1, "this morning用过去时showed；show sth. to sb.。故选B。")
cho(887, "Here is a card ______ Kate. Please give ______ .", ["from; her to it","for; it to her","to; her it","with; it her"], 1, "给Kate的卡片用for；give sb. sth.=give sth. to sb.（it to her）。故选：B。")
cho(888, "This hotel ______ us ______ a large house.", ["provides; for","offers; to","provides, with","offers; with"], 2, "Provide sb with sth=offer sth to sb 表示为某人提供某物。故答案选C。")
cho(889, "—Mum, can I ______ my new clothes ______ my friends?\n—Sure.", ["show; to","show; around","buy; for"], 0, "show sth. to sb.意为展示、出示。我可以向伙伴们展示我的新衣服。故选A。")
cho(890, "This toy plane is Peter's. Please give ______ .", ["it to him","him to it","him it","it him"], 0, "give sb sth=give sth to sb，it to him正确。")
cho(891, "Can you get a pair of shoes ______ me?", ["for","in","on"], 0, "Get sth for sb=get sb sth。你能为我买一双鞋吗？")
cho(892, "My father told me ______ tell lies.", ["to","not to","to not","don't to"], 1, "tell sb.（not）to do sth.告诉某人（不要）做某事。我的爸爸告诉我不要说谎。故选：B。")
cho(893, "The boy ______ his new bike ______ his friends.", ["show, at","shows; to","showing; for"], 1, "show sb. sth =show sth. to sb. 男孩向他的朋友们展示了他的新自行车。主语三单shows。故选：B。")
fill(894, "按实际情况回答问题：\nHow many hours do you sleep each night?", "I sleep seven hours each night", "how引导的特殊疑问句对时间进行提问，主语I，根据实际作答即可。")
cho(895, "What will she buy ______ her mother on Mother's Day?", ["to","on","from","for"], 3, "for为了，后面跟对象。她会在母亲节为她妈妈买什么呢？")
fill(896, "连词成句：too friend is He my .", "He is my friend too", "He作主语，is系动词，my friend作表语，too放句末。他也是我的朋友。")
fill(897, "连词成句：is ice cream so The delicious !", "The ice cream is so delicious!", "the定冠词，is系动词，delicious表语，so副词修饰形容词。这个冰淇淋是如此的美味啊！")
fill(898, "连词成句：big The eyes has long hair beautiful and blue girl .", "The girl has beautiful long hair and big blue eyes", "主语the girl；谓语has；宾语hair和eyes；beautiful/long/big/blue做定语；and并列。这个女孩有一头漂亮的长头发和一双蓝色的大眼睛。")
fill(899, "She will show me some photos.（写出同义句）", "She will show some photos to me", "固定搭配show sb. sth.可与show sth. to sb.进行转换。")
fill(900, "连词成句：elephant The is fat .", "The elephant is fat", "主系表结构。大象很胖。")
fill(901, "按要求变换句型：\n(1) The animals have lessons at school.（否定句）\nThe animals ______ ______ lessons at school.\n(2) The family is celebrating Thanksgiving.（对画线部分提问）\n______ ______ ______ the family ______ ?", "don't；have；Which；festival；is；celebrating", "(1)含have的否定句借助don't。(2)对Thanksgiving提问：Which festival is the family celebrating。")
fill(902, "按要求完成下列各题：\n(1) It's cool in October and November.（对画线部分cool提问）\n______ ______ ______ in October or November?\n(2) The children have presents from Santa Claus.（同义句）\nSanta Claus ______ ______ ______ ______ .\n(3) What day is it? Do you know?（合并成一句）\nDo you know ______ ______ ______ ______ ?", "How's；the；weather；gives；the；children；presents；what；day；it；is", "(1)问天气用How's the weather。(2)Santa Claus gives the children presents。(3)Do you know what day it is?")
fill(903, "按要求完成下列各题：\n(1) I am going to study French.（变成否定句）\nI ______ ______ going to study French.\n(2) Tom is going to buy a new bike.（变一般疑问句）\n______ Tom ______ ______ buy a new bike?\n(3) We are going to study History.（对画线部分History提问）\n______ ______ you ______ ______ study?\n(4) 连词成句：there going to we are speak Chinese .\n(5) We learn to each other.（选出错误的一项并改正）A. learn　B. to　C. each other\n错误项：______ 改正：______", "am；not；Is；going；to；What；are；going；to；We are going to speak Chinese there；to改为from", "(1)be后加not am not。(2)is提到句首Is Tom going to。(3)对科目提问用What are you going to study。(4)We are going to speak Chinese there。(5)learn from...意为“向……学习”，to改为from。")
fill(904, "翻译：在中国新年，我的祖父母将会给我一个红包。", "My grandparents are going to give me a red packet at Chinese New Year", "主语+谓语+宾语+时间状语；will用be going to give；红包a red packet；在中国新年at Chinese New Year。")
fill(905, "按实际情况回答问题：When were you born?", "I was born on May 25th 2008", "答语句构为I was born+on+具体日期。根据实际作答。")
fill(906, "连词成句：friend for chocolate gift buys a horses as two birthday her she best .", "She buys two chocolate horses as a birthday gift for her best friend", "buy sth. for sb.和as作为……的用法。她买了两个巧克力马作为生日礼物送给她最好的朋友。")
fill(907, "连词成句：often the I plant water .", "I often water the plant", "water the plant 浇植物。我经常浇植物。")
cho(908, "I ______ vegetables. They are good.", ["like","don't like","favourite"], 0, "根据后面They are good. 它们是很好的。可知我是喜欢蔬菜的，like喜欢。故选A。")
fill(909, "写出下列句子的同义句：\n(1) Would you show me those blue trousers?\nCan you ______ those blue trousers ______ me?\n(2) Can I help you?\nWhat ______ I ______ for ______ ?\n(3) I want a toy bike.\nI want ______ ______ a toy bike.", "show；to；can；do；you；to；buy", "(1)show sth to sb。(2)What can I do for you?(3)want to buy想要买。")
fill(910, "连词成句：a I to want musician be .", "I want to be a musician", "I是主语，want to do sth.固定搭配，be a musician做一名音乐家。故答案为：I want to be a musician.")
fill(911, "根据提示，补全句子：\n(1) We can ______ （给我们的妈妈） some flowers. That's ______ （一个好主意） .\n(2) I like ______ （所有的节日） , but Ann ______ （喜欢中秋节） .\n(3) There aren't ______ （龙舟比赛） ______ （在一些地方） .\n(4) We are ______ （寻找一些蔬菜） .\n(5) There's ______ （在厨房里的一个冰箱） .", "give our mother；a good idea；all festivals；likes the Mid-Autumn Festival；dragon boat races；in some places；looking for some vegetables；a fridge in the kitchen", "按中文提示直译即可。")
fill(912, "连词成句：\n(1) into Cut pieces the picture .\n(2) make Let's puzzle a .\n(3) is Who it for ?\n(4) is birthday coming Her .\n(5) cut A his leaf finger .", "Cut the picture into pieces.；Let's make a puzzle.；Who is it for?；Her birthday is coming.；A leaf cut his finger.", "按主谓宾（表）结构连句，注意祈使句和疑问句语序。")
fill(913, "连词成句：\n(1) can't I it do .\n(2) I Can you help ?\n(3) Lingling a boat can row .\n(4) My make can cakes mum .", "I can't do it.；Can I help you?；Lingling can row a boat.；My mum can make cakes.", "含情态动词can的陈述句、疑问句语序。")
fill(914, "连词成句，并注意大小写及标点符号：\n(1) Peter playing football likes .\n(2) basketball like they playing both .\n(3) also we help carry people bags heavy .\n(4) are we the in class same .", "Peter likes playing football.；They both like playing basketball.；We also help people carry heavy bags.；We are in the same class.", "like doing sth喜欢做某事；both都；also也；in the same class在同一个班。")
fill(915, "连词成句：have a I ruler .", "I have a ruler", "I作主语，have作谓语，a ruler作宾语。")
fill(916, "翻译：我的叔叔是一名厨师。", "My uncle is a cook", "主系表结构：My uncle主语，is系动词，a cook表语。")
fill(917, "连词成句：I holiday busy friend in my be and will the summer .", "My friend and I will be busy in the summer holiday", "my friend and I做主语句首，will be谓语表将来，busy表语，in the summer holiday时间状语。")
cho(918, "—______ it often sunny in Nanjing in spring?\n—Yes.", ["Does","Is","Did","Was"], 1, "主语it，sunny表语，主系表结构缺少系动词；often一般现在时。Be(即am、is、are等)属于系动词，排除A。故选B。")
fill(919, "翻译：It's so interesting.", "这是非常有趣的", "主系表结构，表示……是……的。interesting有趣的。")
fill(920, "I often borrow a dictionary from Ben.（改为同义句）\nBen often ______ his dictionary ______ me.", "lends；to", "当主语为Ben时，是Ben把字典借给我；lend sth. to sb.；Ben是第三人称单数用lends。故答案为：lends；to。")

p = r"E:\htdocs\studyc\cpp-adventure\src\scripts\data\english-paper-1000.js"
src = io.open(p, encoding="utf8").read()
idx = src.find('    { id: "p1000-871"')
if idx >= 0:
    src = src[:idx].rstrip().rstrip(",") + "\n  ]\n};"
anchor = "  ]\n};"
assert src.count(anchor) == 1, src.count(anchor)
block = ",\n" + ",\n".join(qs) + "\n  ]\n};"
io.open(p, "w", encoding="utf8").write(src.replace(anchor, block))
print("appended", len(qs), "questions (ch13)")
