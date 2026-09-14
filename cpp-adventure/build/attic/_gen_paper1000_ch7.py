# -*- coding: utf-8 -*-
# 追加 量词（topicId=7）40 题到 english-paper-1000.js（一次性脚本，幂等）
import io

def esc(s):
    return (s.replace('\\', '\\\\').replace('"', '\\"')
             .replace('\n', '\\n'))

qs = []
def fill(i, q, ans, why):
    qs.append('    { id: "p1000-%03d", subject: "english", module: "paper1000", topicId: 7, type: "fill",\n      q: "%s",\n      ansText: "%s",\n      why: "%s",\n      source: "语法1000题·量词" }' % (i, esc(q), esc(ans), esc(why)))

def cho(i, q, o, a, why):
    opts = ", ".join('"%s"' % esc(x) for x in o)
    qs.append('    { id: "p1000-%03d", subject: "english", module: "paper1000", topicId: 7, type: "choice",\n      q: "%s",\n      o: [%s], a: %d,\n      why: "%s",\n      source: "语法1000题·量词" }' % (i, esc(q), opts, a, esc(why)))

cho(471, "She eats ______ food, so she is ______ fat.", ["much too; too many","too much; much too","too much; many too","much too; too much"], 1, "too much修饰不可数名词，too many修饰可数名词；much too中心词是too，后面跟形容词或副词表示程度。故答案选B。")
cho(472, "I have ______ oranges and ______ orange juice.", ["a little; a few","a few; a little","a few; a few"], 1, "oranges为可数名词用a few修饰；orange juice为不可数名词用a little修饰。")
cho(473, "I bought ______ exercise books with ______ money.", ["a few; a few","a few; a little","a little; a few","a little; a little"], 1, "a few+可数名词复数，a little+不可数名词。故答案为B。")
fill(474, "There are some books on the desk.（改为否定句）", "There aren't any books on the desk", "there be句型肯定句变否定句在be动词后加not；some在否定句中要改为any。")
cho(475, "I have some ______ and some ______ .", ["candy; egg","milk; bread","robot; kite"], 1, "some后面要加可数名词复数或不可数名词。milk和bread都是不可数名词。句意：我有一些牛奶和面包。故选B。")
cho(476, "Eat ______ hot dog and drink ______ milk.", ["a…a","a…some","some…some"], 1, "考查冠词。热狗可数，牛奶不可数。")
cho(477, "—Are there ______ flowers near the river?\n—Yes, there are ______ .", ["some; some","any; some"], 1, "肯定句中用some，否定句和疑问句中用any，故选B。")
cho(478, "Have ______ tea, please.", ["a cup of","an","a cup"], 0, "“一杯茶”可以用a cup of tea表示，故选A。")
cho(479, "There's only ______ milk and ______ tomatoes in the fridge.", ["a little; a little","a few; a little","a little; a few"], 2, "milk为不可数名词故使用a little；tomato为可数名词故使用a few。故答案选C。")
cho(480, "I was so hungry that I ate two ______ .", ["bowls of noodle","bowls of noodles","bowl of noodles"], 1, "noodles和量词bowl配合，two bowls of noodles两碗面条。故答案为B。")
cho(481, "There's ______ ice-cream in the refrigerator.", ["any","some","few"], 1, "该句是肯定句排除any；few修饰可数名词，而ice-cream是不可数名词。")
cho(482, "Can I have ______ rice?", ["a","an","some"], 2, "rice为不可数名词，前面用some，故选择C。")
cho(483, "I don't have ______ lessons ______ Sunday morning.", ["some; on","any; on","any; in"], 1, "lessons是复数，前面加some/any，don't表示否定用any；在具体的某天早上用时间介词on。所以选B。")
cho(484, "—Can you see ______ apples ______ the tree?\n—Yes, I can.", ["some; on","some; in","any; in","any; on"], 3, "疑问句中用any；on the tree表示原本就长在树上的物体如苹果；in the tree指停留在树上的东西。故选D。")
cho(485, "There isn't ______ meat. Pass me a piece of meat.", ["some","few","any"], 2, "some一般用于肯定句；few修饰可数名词。否定句用any。")
cho(486, "—May I have ______ orange juice?\n—Here's ______ . Here you are.", ["some; a few","any; some","some; a little","any; a little"], 2, "问句表示请求用some；orange juice不可数用a little。")
fill(487, "国王什么衣服也没穿。\nThe king isn't ______ ______ clothes.", "wearing；any", "国王现在没有穿衣服要用现在进行时wearing；否定句中some要变为any。故答案为wearing，any。")
cho(488, "We shouldn't eat too ______ candies, and we shouldn't drink too ______ cold water.", ["much; much","much; many","many; many","many; much"], 3, "too many + 可数名词复数；too much + 不可数名词。")
cho(489, "—Look, there are so ______ cakes on the table.\n—Yes, but I had too ______ food this morning.", ["many; many","much; many","many; much","much; much"], 2, "many后接可数名词复数cakes，much后接不可数名词food。故答案选C。")
cho(490, "Look! ______ sheep ______ grass over there.", ["A few, eating","A little, eat","A few, are eating","Few, is eating"], 2, "sheep单复同形，a few后接可数名词；现在进行时结构be + V-ing。选C。")
cho(491, "We waste ______ food every day, there are still ______ hungry people in the world, we shouldn't do that.", ["too many; much","too much; many","too many; many"], 1, "food不可数用too much；people为集合名词表复数用many。故填：B。")
cho(492, "I have ______ lessons ______ Monday morning.", ["some; on","any; on","any; in"], 0, "some用于肯定句；表示具体的某天早上用时间介词on。故选A。")
cho(493, "—Do you see ______ birds in the tree?\n—NO, but I see ______ monkeys in it.", ["some; any","any; some","any; any"], 1, "any用于疑问句；some用在肯定句中。")
cho(494, "—There isn't ______ food in the fridge.\n—Let's go to the supermarket to buy ______ .", ["any; some","any; any","some; any"], 0, "否定句用any，肯定句表示“一些”用some。")
cho(495, "Do you have ______ ?", ["any sticker","some stickers","any stickers"], 2, "一般疑问句中要用any；sticker是可数名词要加复数。故选C。")
cho(496, "There are ______ books on the table.", ["any","some","an","a"], 1, "Some用在肯定句中表示一些，故选B。")
cho(497, "—Would you like ______ things to drink?\n—Thank you. But I don't want to drink ______ .", ["some; some","some; any","any; some","some; some"], 1, "Would you like句式中用some表示请求；否定句中用any。故选B。")
cho(498, "—Do you have ______ toy cars?\n—Yes. I have ______ toy cars.", ["some; any","any; any","any; some"], 2, "any用于否定句和疑问句中，some用于肯定句中。故选C。")
cho(499, "I can see a lot of ______ in the street.", ["tree","car","people"], 2, "a lot of后接可数名词复数，people属于集体名词单复数同形，故选C。")
cho(500, "There is ______ bread in the fridge, let us go to buy some, ______ ?", ["little; will you","few; shall we","a few; will you","some; shall we"], 0, "bread为不可数名词用little修饰；let us...+will you表示请求。故选A。")
cho(501, "She has ______ eggs and ______ milk for breakfast.", ["a few; a few","a few; a little","a little; a few"], 1, "eggs可数用a few修饰；milk不可数用a little修饰。故答案为B。")
cho(502, "—Would you like ______ juice?\n—Yes, please.", ["some","any","little","many"], 0, "some用在肯定句中、期望得到对方肯定回答的句子中以及would you like的句式之中。故答案选A。")
cho(503, "They have ______ .", ["many tea","much oranges","much burgers","much bread"], 3, "many修饰可数名词，much修饰不可数名词。只有D用much修饰不可数的bread是完全正确的。")
cho(504, "A: Can I help you?\nB: Some ______ , please.", ["hot dog","noodles","ball"], 1, "some后应填可数名词复数或不可数名词，A和C均为可数名词单数故排除。请给我一些面条。故答案为B。")
cho(505, "There are ______ grapes on my uncle's farm.", ["lot of","lots of","a lot"], 1, "lots of=a lot of表示“许多”，后接可数名词复数或不可数名词，AC选项形式有误。故答案为B。")
cho(506, "We have ______ rain this year, so the trees and grass don't grow well.", ["little","a little","few","a few"], 0, "rain不可数排除few和a few；今年雨水很少，little表否定。故选A。")
cho(507, "---______ did you walk back to the hotel?\n---Because I didn't have ______ money ______ a taxi.", ["How; no; to","Why; no; for","Why; any; for","When; some; to"], 2, "用Because回答所以问句应为Why；否定句用any；为打车准备的钱用for。故答案选C。")
cho(508, "—Drinking too ______ cola is bad for your health.\n—Thank you, Doctor. I just drink ______ .", ["many; a few","many; a little","much; a few","much; a little"], 3, "too much+不可数名词；a little一些+不可数名词。喝太多可乐不好，我只喝了一点儿。故选D。")
cho(509, "—I'd like ______ milk.\n—OK! Here you are.", ["a","some","an"], 1, "milk不可数，用some修饰。")
cho(510, "—Can I have ______ apple juice?\n—Sorry, there isn't ______ apple juice.", ["any; any","any; some","some; any"], 2, "问句表示请求用some；答句为否定句所以用any。故选C。")

p = r"E:\htdocs\studyc\cpp-adventure\src\scripts\data\english-paper-1000.js"
src = io.open(p, encoding="utf8").read()
idx = src.find('    { id: "p1000-471"')
if idx >= 0:
    src = src[:idx].rstrip().rstrip(",") + "\n  ]\n};"
anchor = "  ]\n};"
assert src.count(anchor) == 1, src.count(anchor)
block = ",\n" + ",\n".join(qs) + "\n  ]\n};"
io.open(p, "w", encoding="utf8").write(src.replace(anchor, block))
print("appended", len(qs), "questions (ch7)")
