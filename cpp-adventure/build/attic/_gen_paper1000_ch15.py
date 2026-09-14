# -*- coding: utf-8 -*-
# 追加 句法之祈使句（topicId=15）40 题到 english-paper-1000.js（一次性脚本，幂等）——全书完
import io

def esc(s):
    return (s.replace('\\', '\\\\').replace('"', '\\"')
             .replace('\n', '\\n'))

qs = []
def fill(i, q, ans, why):
    qs.append('    { id: "p1000-%03d", subject: "english", module: "paper1000", topicId: 15, type: "fill",\n      q: "%s",\n      ansText: "%s",\n      why: "%s",\n      source: "语法1000题·祈使句" }' % (i, esc(q), esc(ans), esc(why)))

def cho(i, q, o, a, why):
    opts = ", ".join('"%s"' % esc(x) for x in o)
    qs.append('    { id: "p1000-%03d", subject: "english", module: "paper1000", topicId: 15, type: "choice",\n      q: "%s",\n      o: [%s], a: %d,\n      why: "%s",\n      source: "语法1000题·祈使句" }' % (i, esc(q), opts, a, esc(why)))

cho(981, "轮到你们组值日了，你想让别人和你一起打扫教室，你会说：", ["Let me clean the classroom.","Let's clean the classroom."], 1, "根据情景中提到的“让别人和你一起”可知选Let's clean the classroom.（B）。")
cho(982, "早上遇到朋友，你想邀请他一起去上学，用英语怎么说？", ["Let's go to school.","Good morning."], 0, "A项适用于邀请对方一起去上学；B项适用于在早上向对方问好。根据题目要求，故选A。")
cho(983, "______ up early tomorrow!", ["Getting","Get","To get","Got"], 1, "祈使句动词原形放开头。")
cho(984, "______ clean the classroom.", ["let","let's","Let's"], 2, "“Let's + 动词原形 + 其他”句型表示“让我们一起……”。Let's是Let us的缩写，句子首字母要大写。故选C。")
cho(985, "______ the food quickly.", ["Eat","Eating","To eat","Eaten"], 0, "祈使句动词原形放开头。")
fill(986, "完成句子：\n(1) 请不要迟到。______ be late.\n(2) 回答这个问题。______ this question.\n(3) 让我来打开窗户。______ ______ open the window.", "Don't；Answer；Let；me", "(1)Be型祈使句的否定式在句首加don't。(2)do型祈使句的肯定形式为动词原形开头。(3)Let型祈使句表示“让某人……”。")
cho(987, "______ me your ticket, please.", ["Showing","Showed","Show","To show"], 2, "考查祈使句。根据句意和please，得知这是个祈使句。祈使句以动词原形开头。故选C。")
cho(988, "—Let's ______ the blackboard.\n—OK, let's go.", ["cleans","to clean","clean"], 2, "Let's后接动词原形clean。")
cho(989, "Be careful! Don't ______ the vase.", ["broke","breaking","breaked","break"], 3, "考查否定的祈使句。Don't后面跟的是动词原形break。故选D。")
cho(990, "The TV is too loud. Please ______ .", ["turn it down","to turn it down","turn down it"], 0, "祈使句用动词原形开头；代词it放在turn down中间。")
cho(991, "The floor is wet. Don't ______ here.", ["walking","walks","walk"], 2, "地板很湿，不要走那里。祈使句用动词原形。故答案选C。")
cho(992, "______ play football in the street. It's dangerous.", ["Don't","Do","Not"], 0, "祈使句的否定结构为：Don't +动词原形。故答案选A。")
fill(993, "Eat and drink here.（否定句）", "Don't eat or drink here", "否定句中表示和应为or。句意：不要在这饮食。故答案为：Don't eat or drink here.")
cho(994, "______ sad. You can go next time.", ["Don't be","Doesn't be","Don't"], 0, "否定祈使句Don't be + 形容词：别难过。故选A。")
fill(995, "Let's ______ （take） a bus to school.", "take", "Let's+动词原形。")
cho(996, "Please ______ the window, it's too cold outside!", ["closing","open","close"], 2, "祈使句表示请求，Please可以用在句首，后面跟动词原形。天气冷所以要关窗。故选C。")
cho(997, "______ that, please.", ["Don't","Don't dose","Don't do","Don't doing"], 2, "祈使句的否定句是直接否定动词的，否定的助动词don't后面加动词原形do。故选C。")
cho(998, "______ these flowers ______ me, please.", ["Giving; to","Gives; /","Give; to","Give; /"], 2, "这是个祈使句动词用原形Give；give sth to sb表示给某人某东西。故选C。")
cho(999, "Let's ______ together.", ["watch TV","watches TV","watching TV","to watch TV"], 0, "Let's后面应用动词原形，Let's do sth.“咱们做某事吧”是固定句式。故选A。")
cho(1000, "Let's ______ straight and turn left.", ["go","goes","go to"], 0, "Let's后常跟动词原形。")
cho(1001, "The baby is sleeping. ______ loudly.", ["Speak","Speaking","Don't speak","Not speak"], 2, "宝宝在睡觉，所以不要大声讲话。祈使句变否定，Don't放在动词原形前。")
cho(1002, "—Sorry for being late again.\n—______ here on time next time, or you'll be punished.", ["Be","Being","To be","Been"], 0, "下次准时到这儿，否则你会被惩罚。祈使句中需要用动词原形开头Be。故答案为A。")
cho(1003, "The teacher often says, \"______ late for school.\"", ["Don't","Don't be","Not","Not to"], 1, "老师说：“上学不能迟到。”根据祈使句否定句型排除C和D；迟到be late for。故答案选B。")
cho(1004, "It's 12 o'clock. Let's ______ .", ["have lunch","has lunch","having lunch"], 0, "考查祈使句。Let sb do sth让某人做某事。故选A。")
cho(1005, "It is too hot in the room. ______ the window, please.", ["Open","Opens","You open"], 0, "祈使句，无主语，动词原形放句首。所以用Open。")
cho(1006, "Don't ______ TV for a long time. It's bad for your eyes.", ["watching","to watch","watch"], 2, "本空所含句子为祈使句，本空应填动词原形watch。故选：C。")
fill(1007, "连词成句：to school Let's go .", "Let's go to school", "Let's……意为“让我们……”，后接动词原形；go to school意为“去上学”。故答案为：Let's go to school.")
fill(1008, "连词成句：some Have milk .", "Have some milk", "祈使句，动词原形开头。喝点牛奶。")
cho(1009, "______ worried about me, Mom, I've grown up.", ["Don't","Don't be","Not","Not be"], 1, "be worried about为……担心，忧虑。否定祈使句Don't be。选B。")
cho(1010, "______ interrupt（打断） while others are talking.", ["Must","Don't","Mustn't"], 1, "别人说话的时候不要打断。mustn't可以用Don't+祈使句来替代，mustn't使用时前面应有主语。故此题选择B项。")
cho(1011, "Let's ______ a phone call to Wang Tao.", ["makes","make","making"], 1, "让我们给王涛打一个电话吧！根据Let's后加动词原形。故选：B。")
cho(1012, "Tom, ______ afraid of speaking in front of people. You are the best one.", ["don't","not","not be","don't be"], 3, "这是一个祈使句，afraid是形容词，前面一定要有be动词，否定用don't be。故选D。")
cho(1013, "—______ me some pens, please.\n—Here you are.", ["Give","Gives","Giving"], 0, "祈使句以动词原形开头Give。")
fill(1014, "Let's play football in the p ______ .", "playground", "让我们去操场踢足球吧。根据首字母p可知，应填playground。")
cho(1015, "______ lean out of the window. It's dangerous!", ["Don't","mustn't","must"], 0, "不要靠在窗户上，很危险。mustn't可以用祈使句句首加Don't来替换，mustn't使用时前面应该有主语。故此题选择A项。")
cho(1016, "______ late for school next time.", ["Don't","Don't be","Be not","Doesn't"], 1, "下次不要再上课迟到了。否定祈使句要用Don't开头；因为late是形容词，所以要用be动词。故正确答案是Don't be late for school next time.")
cho(1017, "Please ______ draw on the wall.", ["not","can't","don't","didn't"], 2, "祈使句让人不要做某事用don't。故选C。")
cho(1018, "当室内空气不清新，你想换一下空气时，你需要做的是：", ["Open the window.","Close the window."], 0, "因室内空气不好，想换一下空气，一般是打开窗户，而不是关闭窗户。故答案为：A。")
cho(1019, "______ close the window.", ["Let me","Let's","Let"], 0, "let sb do“让某人做某事”。let's=let us不符合句意。句意：让我关闭窗户吧。故选：A。")
fill(1020, "Put the words in order to make a sentence.\nthe box Tick .", "Tick the box", "考查祈使句。句意为：在方框中打勾。")

p = r"E:\htdocs\studyc\cpp-adventure\src\scripts\data\english-paper-1000.js"
src = io.open(p, encoding="utf8").read()
idx = src.find('    { id: "p1000-981"')
if idx >= 0:
    src = src[:idx].rstrip().rstrip(",") + "\n  ]\n};"
anchor = "  ]\n};"
assert src.count(anchor) == 1, src.count(anchor)
block = ",\n" + ",\n".join(qs) + "\n  ]\n};"
io.open(p, "w", encoding="utf8").write(src.replace(anchor, block))
print("appended", len(qs), "questions (ch15) — 全书完！")
