# -*- coding: utf-8 -*-
# 追加 连词（topicId=9）40 题到 english-paper-1000.js（一次性脚本，幂等）
import io

def esc(s):
    return (s.replace('\\', '\\\\').replace('"', '\\"')
             .replace('\n', '\\n'))

qs = []
def cho(i, q, o, a, why):
    opts = ", ".join('"%s"' % esc(x) for x in o)
    qs.append('    { id: "p1000-%03d", subject: "english", module: "paper1000", topicId: 9, type: "choice",\n      q: "%s",\n      o: [%s], a: %d,\n      why: "%s",\n      source: "语法1000题·连词" }' % (i, esc(q), opts, a, esc(why)))

cho(561, "Shanghai is a beautiful city, ______ it's quite noisy.", ["and","but","also"], 1, "but表示转折，虽然上海很美但是很嘈杂。故答案选B。")
cho(562, "--- Is your new bike red ______ green?\n--- It's green .", ["or","but","and"], 0, "因为回答It's green，可知这是选择疑问句，故选A。")
cho(563, "He has no brothers ______ sisters.", ["or","and","but","with"], 0, "“他没有哥哥和姐姐。”or用于否定句。")
cho(564, "We'd better hurry ______ it is getting dark.", ["and","but","as","unless"], 2, "句意为：我们最好快点，因为天要黑了。and和but为并列连词；as因为，unless除非。故选C。")
cho(565, "I like Song Qingling ______ she was great.", ["because","so","but"], 0, "句意：我喜欢宋庆龄因为她很棒。Because因为。故答案选A。")
cho(566, "He was about to go to bed ______ the doorbell rang.", ["while","as","before","when"], 3, "句意：当门铃响的时候，他正要上床睡觉。when当……时，后边动词既可短暂又可延续。故选D。")
cho(567, "______ I work hard, I ______ pass my exam.", ["If, will","If, won't","Unless; will"], 0, "If引导条件句：如果我努力，我就会通过考试，主句用将来时will。")
cho(568, "Susan will not arrive at the airport on time ______ she hurries up.", ["when","if","once","unless"], 3, "句意：苏珊无法准时到达机场除非她快一点。unless除非。")
cho(569, "I don't have ______ nice clothes ______ shoes.", ["some, and","any, and","any, or"], 2, "some用于肯定句中，any用于否定句与疑问句中；否定句中and应该变为or表“也不”。")
cho(570, "______ you ______ I like art, so let's go to art club together.", ["And, and","Either, or","Both, and"], 2, "Both,and两者都。句意：因为你和我都喜欢艺术，所以让我们一起去艺术俱乐部吧。故选C。")
cho(571, "He likes English, ______ it's easy.", ["and","or","because"], 2, "句意：他喜欢英语，因为它比较简单。because因为。故选C。")
cho(572, "I hurried ______ I wouldn't be late for class.", ["since","so that","as if","unless"], 1, "我要快点，这样就不会上课迟到了。so that“为了”；since“既然”；as if“好像”；unless“除非”。")
cho(573, "The shops were closed ______ I didn't get any milk.", ["so","but","or"], 0, "so 表“因果”译为“所以”。")
cho(574, "I learned a little Russian ______ I was at middle school.", ["though","although","as if","when"], 3, "句意为：当我读中学的时候，我学了一点俄语。when当……时候。故选D。")
cho(575, "My hobby is swimming, ______ my favourite season is summer.", ["so","but","if"], 0, "根据句意，我的爱好是游泳，因此我最喜欢的季节是夏天。故该题答案为A。")
cho(576, "I like music ______ my brother likes video games.", ["or","but","so"], 1, "考查连词。前后有转折，应该用but。")
cho(577, "You'll miss the train ______ you hurry up.", ["unless","as","if","until"], 0, "句意为：你会错过车的，除非你快点。unless除非。故选A。")
cho(578, "My grandpa is 67 years old, ______ he looks young.", ["so","but","and","however"], 1, "爷爷67岁了但他看起来很年轻，前后是句内转折用but；however虽表转折但是副词且用于句间。故答案选B。")
cho(579, "I'll let you know ______ he comes back.", ["before","because","as soon as","although"], 2, "句意：他一回来我就会让你知道的。as soon as一…就。故选C。")
cho(580, "The children can't read ______ write.", ["and","to","or"], 2, "or用于否定句和疑问句；and用于肯定句。句意：那个孩子既不会阅读也不会写。故选C。")
cho(581, "They went to the ocean park ______ they got up.", ["before","after","when"], 1, "意义为他们起床后去了海洋公园。")
cho(582, "—______ does the car stop?\n—______ an old man is crossing the road.", ["What; so","Why; Because","Why; So","What; because"], 1, "根据回答可知此句是问原因，第一个空填Why，后一个空回答用Because。")
cho(583, "Which would you like, sir, tea ______ coffee?", ["all","and","or"], 2, "选择疑问句用or。故选C。")
cho(584, "I like fish ______ I ______ like carrots.", ["but; don't","but; doesn't","and; doesn't"], 0, "句意：我喜欢鱼肉，但我不喜欢胡萝卜。前后句成转折关系填but；主语是I，否定形式为don't+动词原形。故选A。")
cho(585, "I don't like lemons ______ they are too sour.", ["but","or","because"], 2, "why提问，because回答。")
cho(586, "I don't have any pens ______ pencils.", ["and","or","too","also"], 1, "否定句中表示和用or。句意：我没有钢笔和铅笔。故选：B。")
cho(587, "A: Is the school on your right ______ on your left?\nB: On my right.", ["and","or","but"], 1, "疑问句为选择疑问句，故答案为B。")
cho(588, "I like spring, ______ I like the beautiful flowers.", ["why","to","because","for"], 2, "我喜欢春天因为我喜欢漂亮的花。because表示原因。故答案为C。")
cho(589, "He ______ home ______ she was satisfied ______ his answer yesterday.", ["didn't go; until; with","wasn't go; after; to","doesn't go; before; with","didn't go; until, to"], 0, "not … until直到才；be satisfied with对…满意。昨天直到她满足他的答案他才回家。故答案选A。")
cho(590, "Tom doesn't like spicy food ______ I don't like spicy food, either.", ["and","or","so"], 0, "根据题意Tom和我都不喜欢吃辣，连接两个并列的句子，故选A。")
cho(591, "I live in Canada, ______ I'm not a Canadian.", ["but","and","so","because"], 0, "此处表示转折。句意：我住在加拿大，但我不是加拿大人。故选A。")
cho(592, "—I don't like singing ______ dancing. What about you?\n—I don't like dancing ______ I like singing.", ["or, and","and, but","or, but"], 2, "or表“和”用于否定句；but表“转折”译为“但是”。")
cho(593, "Call a taxi, ______ you will miss the train.", ["and","though","because","or"], 3, "or意为“否则”，句意为“打个的吧，否则你会赶不上火车的”。")
cho(594, "Is your art teacher tall ______ short?", ["for","and","or"], 2, "表示选择时用or或者，因此选C。")
cho(595, "I'd like to go with you, ______ I'm too busy.", ["and","or","but","so"], 2, "我想跟你一起去，但是我太忙了，前后表转折用but。and并列，or选择，so因果。故选C。")
cho(596, "______ most of the earth's surface is covered by water, fresh water is very rare and precious.", ["As","Once","If","Although"], 3, "句意为：尽管地球上大部分地方都被水覆盖，但是淡水是很稀少也很珍贵的。Although尽管。故选D。")
cho(597, "—Can you play ping-pong ______ basketball?\n—I can play ping-pong.", ["and","or","but","with"], 1, "你能打篮球还是乒乓球，对二者选择用的是or。故选B。")
cho(598, "My mother likes little animals ______ they are friendly and gentle.", ["but","and","or","because"], 3, "我妈妈很喜欢小动物因为他们非常的友好和温和，表示因果关系用because。故答案选D。")
cho(599, "I wanted to be a scientist ______ I was a little girl.", ["after","before","since","when"], 3, "当我还是小女孩时就想当科学家，用when“当……时”。")
cho(600, "______ we are old, we still work in the fields every day.", ["Although","But","However","Because"], 0, "根据句意“尽管我们老了，我们仍然每天在田里工作”可知Although符合。故答案选A。")

p = r"E:\htdocs\studyc\cpp-adventure\src\scripts\data\english-paper-1000.js"
src = io.open(p, encoding="utf8").read()
idx = src.find('    { id: "p1000-561"')
if idx >= 0:
    src = src[:idx].rstrip().rstrip(",") + "\n  ]\n};"
anchor = "  ]\n};"
assert src.count(anchor) == 1, src.count(anchor)
block = ",\n" + ",\n".join(qs) + "\n  ]\n};"
io.open(p, "w", encoding="utf8").write(src.replace(anchor, block))
print("appended", len(qs), "questions (ch9)")
