/* 生成小学英语 1200 词数据：20 单元 × 60 词 */
var fs = require("fs");
var path = require("path");

var UNITS = [
  { name: "家庭与人物", emoji: "👨‍👩‍👧", words: [
    "father/父亲/n","mother/母亲/n","dad/爸爸/n","mom/妈妈/n","parent/父母/n","parents/父母/n","son/儿子/n","daughter/女儿/n",
    "brother/兄弟/n","sister/姐妹/n","baby/婴儿/n","grandfather/祖父/n","grandmother/祖母/n","grandpa/爷爷/n","grandma/奶奶/n",
    "uncle/叔叔/n","aunt/阿姨/n","cousin/表兄妹/n","husband/丈夫/n","wife/妻子/n","family/家庭/n","child/孩子/n","children/孩子们/n",
    "people/人们/n","person/人/n","man/男人/n","woman/女人/n","boy/男孩/n","girl/女孩/n","friend/朋友/n","friendship/友谊/n",
    "name/名字/n","age/年龄/n","Mr/先生/n","Mrs/夫人/n","Miss/小姐/n","Ms/女士/n","sir/先生/n","madam/夫人/n",
    "king/国王/n","queen/王后/n","prince/王子/n","princess/公主/n","neighbor/邻居/n","guest/客人/n","host/主人/n","baby/宝宝/n",
    "twin/双胞胎/n","classmate/同学/n","deskmate/同桌/n","teacher/老师/n","student/学生/n","pupil/小学生/n","class/班级/n",
    "everyone/每个人/pron","someone/某人/pron","nobody/没有人/pron","anybody/任何人/pron","somebody/某人/pron","everybody/大家/pron",
    "who/谁/pron","whom/谁/pron","whose/谁的/pron"
  ]},
  { name: "身体与健康", emoji: "💪", words: [
    "head/头/n","hair/头发/n","face/脸/n","eye/眼睛/n","eyes/眼睛/n","ear/耳朵/n","nose/鼻子/n","mouth/嘴/n",
    "tooth/牙齿/n","teeth/牙齿/n","tongue/舌头/n","lip/嘴唇/n","neck/脖子/n","shoulder/肩膀/n","arm/手臂/n","hand/手/n",
    "finger/手指/n","nail/指甲/n","chest/胸/n","back/背/n","waist/腰/n","leg/腿/n","knee/膝盖/n","foot/脚/n",
    "feet/脚/n","toe/脚趾/n","skin/皮肤/n","bone/骨头/n","blood/血/n","heart/心/n","brain/大脑/n","body/身体/n",
    "health/健康/n","sick/生病的/adj","ill/生病的/adj","well/健康的/adj","strong/强壮的/adj","weak/弱的/adj","tall/高的/adj","short/矮的/adj",
    "fat/胖的/adj","thin/瘦的/adj","young/年轻的/adj","old/老的/adj","right/右边的/adj","left/左边的/adj","clean/干净的/adj","dirty/脏的/adj",
    "wash/洗/v","brush/刷/v","cut/切/v","hurt/受伤/v","pain/疼痛/n","medicine/药/n","doctor/医生/n","nurse/护士/n",
    "hospital/医院/n","clinic/诊所/n","pharmacy/药房/n","pill/药片/n","vitamin/维生素/n","exercise/锻炼/n","rest/休息/n","sleep/睡觉/n"
  ]},
  { name: "学校与教育", emoji: "🏫", words: [
    "school/学校/n","class/课/n","classroom/教室/n","grade/年级/n","term/学期/n","semester/学期/n","lesson/课/n","subject/科目/n",
    "Chinese/语文/n","English/英语/n","math/数学/n","science/科学/n","art/美术/n","music/音乐/n","PE/体育/n","history/历史/n",
    "geography/地理/n","biology/生物/n","physics/物理/n","chemistry/化学/n","computer/电脑/n","book/书/n","textbook/课本/n","notebook/笔记本/n",
    "dictionary/字典/n","pen/钢笔/n","pencil/铅笔/n","ruler/尺子/n","eraser/橡皮/n","bag/书包/n","backpack/背包/n","desk/书桌/n",
    "table/桌子/n","chair/椅子/n","blackboard/黑板/n","whiteboard/白板/n","chalk/粉笔/n","marker/记号笔/n","paper/纸/n","page/页/n",
    "word/单词/n","sentence/句子/n","letter/字母/n","number/数字/n","question/问题/n","answer/答案/n","test/考试/n","exam/考试/n",
    "homework/作业/n","task/任务/n","project/项目/n","report/报告/n","grade/成绩/n","score/分数/n","mark/分数/n","point/分数/n",
    "pass/及格/v","fail/不及格/v","learn/学习/v","study/学习/v","teach/教/v","read/读/v","write/写/v","spell/拼写/v"
  ]},
  { name: "动物", emoji: "🐾", words: [
    "cat/猫/n","dog/狗/n","pig/猪/n","cow/牛/n","horse/马/n","sheep/羊/n","goat/山羊/n","chicken/鸡/n",
    "duck/鸭/n","goose/鹅/n","rabbit/兔子/n","mouse/老鼠/n","rat/大老鼠/n","bird/鸟/n","fish/鱼/n","frog/青蛙/n",
    "snake/蛇/n","turtle/乌龟/n","bear/熊/n","lion/狮子/n","tiger/老虎/n","wolf/狼/n","fox/狐狸/n","deer/鹿/n",
    "monkey/猴子/n","elephant/大象/n","panda/熊猫/n","koala/考拉/n","kangaroo/袋鼠/n","zebra/斑马/n","giraffe/长颈鹿/n","camel/骆驼/n",
    "whale/鲸鱼/n","dolphin/海豚/n","shark/鲨鱼/n","seal/海豹/n","penguin/企鹅/n","eagle/鹰/n","owl/猫头鹰/n","parrot/鹦鹉/n",
    "bee/蜜蜂/n","ant/蚂蚁/n","fly/苍蝇/n","butterfly/蝴蝶/n","spider/蜘蛛/n","worm/虫子/n","pet/宠物/n","animal/动物/n",
    "zoo/动物园/n","farm/农场/n","forest/森林/n","jungle/丛林/n","ocean/海洋/n","river/河/n","lake/湖/n","sea/海/n",
    "beach/海滩/n","desert/沙漠/n","mountain/山/n","hill/小山/n","valley/山谷/n","island/岛/n","wild/野生的/adj","tame/驯服的/adj"
  ]},
  { name: "饮食", emoji: "🍔", words: [
    "rice/米饭/n","noodle/面条/n","bread/面包/n","cake/蛋糕/n","meat/肉/n","beef/牛肉/n","pork/猪肉/n","chicken/鸡肉/n",
    "fish/鱼肉/n","egg/鸡蛋/n","milk/牛奶/n","cheese/奶酪/n","butter/黄油/n","yogurt/酸奶/n","soup/汤/n","salt/盐/n",
    "sugar/糖/n","oil/油/n","sauce/酱汁/n","vinegar/醋/n","pepper/胡椒/n","tea/茶/n","coffee/咖啡/n","juice/果汁/n",
    "water/水/n","drink/饮料/n","food/食物/n","meal/一餐/n","breakfast/早餐/n","lunch/午餐/n","dinner/晚餐/n","supper/晚饭/n",
    "snack/零食/n","picnic/野餐/n","party/派对/n","restaurant/餐厅/n","kitchen/厨房/n","fridge/冰箱/n","bowl/碗/n","plate/盘子/n",
    "cup/杯子/n","glass/玻璃杯/n","bottle/瓶子/n","spoon/勺子/n","fork/叉子/n","knife/刀/n","chopsticks/筷子/n","tray/托盘/n",
    "cook/烹饪/v","bake/烤/v","boil/煮/v","fry/煎/v","mix/混合/v","cut/切/v","wash/洗/v","eat/吃/v",
    "drink/喝/v","taste/品尝/v","smell/闻/v","hungry/饿的/adj","thirsty/渴的/adj","full/饱的/adj","empty/空的/adj","delicious/美味的/adj"
  ]},
  { name: "水果蔬菜", emoji: "🍎", words: [
    "apple/苹果/n","banana/香蕉/n","orange/橙子/n","pear/梨/n","peach/桃子/n","grape/葡萄/n","lemon/柠檬/n","cherry/樱桃/n",
    "strawberry/草莓/n","watermelon/西瓜/n","mango/芒果/n","pineapple/菠萝/n","coconut/椰子/n","kiwi/猕猴桃/n","blueberry/蓝莓/n","fruit/水果/n",
    "tomato/西红柿/n","potato/土豆/n","carrot/胡萝卜/n","cabbage/卷心菜/n","onion/洋葱/n","garlic/大蒜/n","corn/玉米/n","bean/豆/n",
    "pea/豌豆/n","pumpkin/南瓜/n","eggplant/茄子/n","mushroom/蘑菇/n","lettuce/生菜/n","spinach/菠菜/n","cucumber/黄瓜/n","pepper/辣椒/n",
    "vegetable/蔬菜/n","nut/坚果/n","peanut/花生/n","walnut/核桃/n","seed/种子/n","leaf/叶子/n","root/根/n","flower/花/n",
    "rose/玫瑰/n","lily/百合/n","sunflower/向日葵/n","grass/草/n","tree/树/n","branch/树枝/n","trunk/树干/n","stick/树枝/n",
    "wood/木头/n","forest/森林/n","jungle/丛林/n","plant/植物/n","grow/生长/v","water/浇水/v","pick/采摘/v","plant/种植/v",
    "green/绿的/adj","red/红的/adj","yellow/黄的/adj","purple/紫的/adj","pink/粉的/adj","fresh/新鲜的/adj","ripe/熟的/adj","sweet/甜的/adj"
  ]},
  { name: "颜色", emoji: "🎨", words: [
    "red/红色/n","orange/橙色/n","yellow/黄色/n","green/绿色/n","blue/蓝色/n","purple/紫色/n","pink/粉色/n","black/黑色/n",
    "white/白色/n","gray/灰色/n","grey/灰色/n","brown/棕色/n","gold/金色/n","silver/银色/n","color/颜色/n","colour/颜色/n",
    "light/浅的/adj","dark/深的/adj","bright/明亮的/adj","pale/苍白的/adj","deep/深的/adj","rich/浓的/adj","warm/暖的/adj","cool/凉的/adj",
    "red/红的/adj","orange/橙的/adj","yellow/黄的/adj","green/绿的/adj","blue/蓝的/adj","purple/紫的/adj","pink/粉的/adj","black/黑的/adj",
    "white/白的/adj","gray/灰的/adj","brown/棕的/adj","golden/金色的/adj","silvery/银色的/adj","colorful/彩色的/adj","plain/素色的/adj","mixed/混合的/adj",
    "beautiful/美丽的/adj","ugly/丑的/adj","pretty/漂亮的/adj","lovely/可爱的/adj","nice/好看的/adj","good-looking/好看的/adj","cute/可爱的/adj","handsome/帅的/adj",
    "paint/画/v","draw/画/v","color/涂色/v","dye/染色/v","mix/混合/v","match/搭配/v","design/设计/v","art/艺术/n",
    "picture/图画/n","photo/照片/n","painting/画作/n","portrait/肖像/n","shape/形状/n","circle/圆形/n","square/方形/n","triangle/三角形/n"
  ]},
  { name: "数字与数学", emoji: "🔢", words: [
    "one/一/num","two/二/num","three/三/num","four/四/num","five/五/num","six/六/num","seven/七/num","eight/八/num",
    "nine/九/num","ten/十/num","eleven/十一/num","twelve/十二/num","thirteen/十三/num","fourteen/十四/num","fifteen/十五/num","sixteen/十六/num",
    "seventeen/十七/num","eighteen/十八/num","nineteen/十九/num","twenty/二十/num","thirty/三十/num","forty/四十/num","fifty/五十/num","sixty/六十/num",
    "seventy/七十/num","eighty/八十/num","ninety/九十/num","hundred/百/num","thousand/千/num","million/百万/num","zero/零/num","first/第一/num",
    "second/第二/num","third/第三/num","fourth/第四/num","fifth/第五/num","sixth/第六/num","seventh/第七/num","eighth/第八/num","ninth/第九/num",
    "tenth/第十/num","twentieth/第二十/num","once/一次/adv","twice/两次/adv","half/一半/n","quarter/四分之一/n","double/两倍/adj","triple/三倍/adj",
    "add/加/v","plus/加/prep","subtract/减/v","minus/减/prep","multiply/乘/v","times/乘/prep","divide/除/v","equal/等于/v",
    "number/数字/n","digit/数位/n","math/数学/n","sum/和/n","difference/差/n","product/积/n","result/结果/n","answer/答案/n"
  ]},
  { name: "时间与日期", emoji: "⏰", words: [
    "time/时间/n","clock/时钟/n","watch/手表/n","hour/小时/n","minute/分钟/n","second/秒/n","moment/片刻/n","day/天/n",
    "week/周/n","month/月/n","year/年/n","decade/十年/n","century/世纪/n","morning/早上/n","noon/中午/n","afternoon/下午/n",
    "evening/傍晚/n","night/晚上/n","midnight/午夜/n","today/今天/n","tomorrow/明天/n","yesterday/昨天/n","now/现在/adv","then/那时/adv",
    "later/后来/adv","soon/很快/adv","early/早的/adj","late/晚的/adj","Monday/周一/n","Tuesday/周二/n","Wednesday/周三/n","Thursday/周四/n",
    "Friday/周五/n","Saturday/周六/n","Sunday/周日/n","weekday/工作日/n","weekend/周末/n","January/一月/n","February/二月/n","March/三月/n",
    "April/四月/n","May/五月/n","June/六月/n","July/七月/n","August/八月/n","September/九月/n","October/十月/n","November/十一月/n",
    "December/十二月/n","spring/春天/n","summer/夏天/n","autumn/秋天/n","fall/秋天/n","winter/冬天/n","season/季节/n","date/日期/n",
    "schedule/日程/n","plan/计划/n","time/时间/n","past/过去/n","present/现在/n","future/将来/n","begin/开始/v","end/结束/v"
  ]},
  { name: "天气与季节", emoji: "🌤️", words: [
    "sun/太阳/n","moon/月亮/n","star/星星/n","sky/天空/n","cloud/云/n","rain/雨/n","snow/雪/n","wind/风/n",
    "storm/暴风雨/n","thunder/雷/n","lightning/闪电/n","fog/雾/n","ice/冰/n","water/水/n","fire/火/n","heat/热/n",
    "cold/冷/n","warm/温暖/n","cool/凉爽/n","temperature/温度/n","degree/度数/n","weather/天气/n","climate/气候/n","sunny/晴的/adj",
    "rainy/下雨的/adj","snowy/下雪的/adj","windy/有风的/adj","cloudy/多云的/adj","foggy/有雾的/adj","stormy/暴风雨的/adj","hot/热的/adj","cold/冷的/adj",
    "warm/暖的/adj","cool/凉的/adj","dry/干的/adj","wet/湿的/adj","nice/好的/adj","bad/坏的/adj","fine/晴朗的/adj","terrible/糟糕的/adj",
    "umbrella/雨伞/n","raincoat/雨衣/n","sunglasses/太阳镜/n","fan/风扇/n","heater/加热器/n","air conditioner/空调/n","thermometer/温度计/n","barometer/气压计/n",
    "shine/照耀/v","blow/吹/v","fall/落下/v","melt/融化/v","freeze/结冰/v","boil/沸腾/v","dry/变干/v","wet/弄湿/v",
    "forecast/预报/n","report/报告/n","news/新闻/n","message/消息/n","information/信息/n","fact/事实/n","truth/真相/n","lie/谎言/n"
  ]},
  { name: "服装与配饰", emoji: "👕", words: [
    "shirt/衬衫/n","T-shirt/T恤/n","coat/外套/n","jacket/夹克/n","sweater/毛衣/n","vest/背心/n","suit/西装/n","uniform/制服/n",
    "dress/连衣裙/n","skirt/短裙/n","pants/裤子/n","trousers/裤子/n","jeans/牛仔裤/n","shorts/短裤/n","leggings/打底裤/n","pajamas/睡衣/n",
    "shoe/鞋/n","shoes/鞋子/n","boot/靴子/n","boots/靴子/n","sock/袜子/n","socks/袜子/n","stocking/长筒袜/n","sandal/凉鞋/n",
    "slipper/拖鞋/n","hat/帽子/n","cap/鸭舌帽/n","glove/手套/n","gloves/手套/n","scarf/围巾/n","tie/领带/n","belt/腰带/n",
    "button/纽扣/n","zip/拉链/n","pocket/口袋/n","collar/衣领/n","sleeve/袖子/n","size/尺码/n","color/颜色/n","style/款式/n",
    "wear/穿/v","put on/穿上/v","take off/脱下/v","try on/试穿/v","fit/合身/v","match/搭配/v","wash/洗/v","iron/熨/v",
    "bag/包/n","handbag/手提包/n","backpack/背包/n","wallet/钱包/n","purse/小钱包/n","watch/手表/n","glasses/眼镜/n","ring/戒指/n",
    "necklace/项链/n","earring/耳环/n","bracelet/手链/n","hairpin/发夹/n","umbrella/雨伞/n","key/钥匙/n","phone/手机/n","camera/相机/n"
  ]},
  { name: "地点与建筑", emoji: "🏠", words: [
    "house/房子/n","home/家/n","room/房间/n","bedroom/卧室/n","living room/客厅/n","kitchen/厨房/n","bathroom/浴室/n","toilet/厕所/n",
    "garden/花园/n","yard/院子/n","garage/车库/n","balcony/阳台/n","basement/地下室/n","attic/阁楼/n","stairs/楼梯/n","elevator/电梯/n",
    "door/门/n","window/窗户/n","wall/墙/n","floor/地板/n","ceiling/天花板/n","roof/屋顶/n","chimney/烟囱/n","gate/大门/n",
    "fence/栅栏/n","path/小路/n","driveway/车道/n","park/公园/n","playground/操场/n","square/广场/n","street/街道/n","road/路/n",
    "highway/高速公路/n","corner/角落/n","block/街区/n","neighborhood/社区/n","city/城市/n","town/镇/n","village/村庄/n","country/国家/n",
    "capital/首都/n","downtown/市中心/n","suburb/郊区/n","rural/农村的/adj","urban/城市的/adj","place/地点/n","area/区域/n","region/地区/n",
    "zone/地带/n","district/区/n","location/位置/n","direction/方向/n","north/北/n","south/南/n","east/东/n","west/西/n",
    "map/地图/n","address/地址/n","entrance/入口/n","exit/出口/n","front/前面/n","back/后面/n","inside/里面/n","outside/外面/n"
  ]},
  { name: "交通与旅行", emoji: "🚗", words: [
    "car/小汽车/n","bus/公交车/n","bike/自行车/n","bicycle/自行车/n","motorbike/摩托车/n","train/火车/n","subway/地铁/n","taxi/出租车/n",
    "plane/飞机/n","airplane/飞机/n","ship/船/n","boat/小船/n","ferry/渡轮/n","truck/卡车/n","lorry/卡车/n","van/面包车/n",
    "rocket/火箭/n","spaceship/宇宙飞船/n","helicopter/直升机/n","scooter/滑板车/n","skateboard/滑板/n","wheel/轮子/n","engine/引擎/n","tire/轮胎/n",
    "seat/座位/n","door/车门/n","window/车窗/n","mirror/后视镜/n","light/车灯/n","brake/刹车/n","wheel/方向盘/n","horn/喇叭/n",
    "drive/驾驶/v","ride/骑/v","fly/飞/v","sail/航行/v","travel/旅行/v","walk/走路/v","run/跑/v","stop/停止/v",
    "start/出发/v","arrive/到达/v","leave/离开/v","go/去/v","come/来/v","enter/进入/v","exit/退出/v","pass/通过/v",
    "ticket/票/n","fare/车费/n","passport/护照/n","visa/签证/n","luggage/行李/n","suitcase/行李箱/n","bag/包/n","map/地图/n",
    "journey/旅程/n","trip/旅行/n","tour/旅游/n","vacation/假期/n","holiday/假日/n","hotel/酒店/n","motel/汽车旅馆/n","camp/露营/n",
    "station/车站/n","airport/机场/n","port/港口/n","parking/停车场/n","traffic/交通/n","road/道路/n","way/路/n","route/路线/n"
  ]},
  { name: "自然与环境", emoji: "🌍", words: [
    "nature/自然/n","environment/环境/n","earth/地球/n","world/世界/n","land/陆地/n","sea/海/n","ocean/海洋/n","water/水/n",
    "air/空气/n","fire/火/n","stone/石头/n","rock/岩石/n","sand/沙子/n","soil/土壤/n","mud/泥巴/n","dust/灰尘/n",
    "metal/金属/n","gold/金子/n","silver/银子/n","iron/铁/n","copper/铜/n","glass/玻璃/n","plastic/塑料/n","paper/纸/n",
    "wood/木头/n","rubber/橡胶/n","oil/油/n","gas/气体/n","energy/能源/n","light/光/n","sound/声音/n","noise/噪音/n",
    "smell/气味/n","taste/味道/n","touch/触觉/n","sight/视觉/n","hearing/听觉/n","color/颜色/n","shape/形状/n","size/大小/n",
    "weight/重量/n","height/高度/n","length/长度/n","width/宽度/n","depth/深度/n","area/面积/n","volume/体积/n","speed/速度/n",
    "plant/植物/n","tree/树/n","flower/花/n","grass/草/n","leaf/叶子/n","root/根/n","seed/种子/n","fruit/果实/n",
    "mountain/山/n","hill/丘陵/n","valley/山谷/n","river/河流/n","lake/湖泊/n","stream/小溪/n","waterfall/瀑布/n","volcano/火山/n",
    "cave/洞穴/n","island/岛屿/n","beach/海滩/n","coast/海岸/n","shore岸边/n","desert/沙漠/n","forest/森林/n","jungle/丛林/n"
  ]},
  { name: "家居用品", emoji: "🛋️", words: [
    "bed/床/n","pillow/枕头/n","blanket/毯子/n","quilt/被子/n","sheet/床单/n","mattress/床垫/n","desk/书桌/n","table/桌子/n",
    "chair/椅子/n","stool/凳子/n","sofa/沙发/n","bench/长凳/n","shelf/架子/n","bookshelf/书架/n","cabinet/柜子/n","drawer/抽屉/n",
    "wardrobe/衣柜/n","closet/壁橱/n","mirror/镜子/n","picture/画/n","clock/钟/n","lamp/台灯/n","light/灯/n","fan/风扇/n",
    "tv/电视/n","computer/电脑/n","phone/电话/n","radio/收音机/n","camera/相机/n","printer/打印机/n","screen/屏幕/n","keyboard/键盘/n",
    "mouse/鼠标/n","speaker/音箱/n","headphone/耳机/n","microphone/麦克风/n","battery/电池/n","wire/电线/n","plug/插头/n","socket/插座/n",
    "cup/杯子/n","glass/玻璃杯/n","bowl/碗/n","plate/盘子/n","pot/锅/n","pan/平底锅/n","kettle/水壶/n","teapot/茶壶/n",
    "spoon/勺子/n","fork/叉子/n","knife/刀/n","chopsticks/筷子/n","towel/毛巾/n","soap/肥皂/n","shampoo/洗发水/n","toothbrush/牙刷/n",
    "toothpaste/牙膏/n","comb/梳子/n","brush/刷子/n","scissors/剪刀/n","needle/针/n","thread/线/n","rope/绳子/n","chain/链子/n",
    "lock/锁/n","key/钥匙/n","handle/把手/n","button/按钮/n","switch/开关/n","tool/工具/n","hammer/锤子/n","nail/钉子/n"
  ]},
  { name: "运动与游戏", emoji: "⚽", words: [
    "ball/球/n","football/足球/n","basketball/篮球/n","volleyball/排球/n","tennis/网球/n","ping-pong/乒乓球/n","badminton/羽毛球/n","baseball/棒球/n",
    "swim/游泳/v","run/跑步/v","jump/跳/v","climb/爬/v","fly/飞/v","ride/骑/v","drive/驾驶/v","ski/滑雪/v",
    "skate/滑冰/v","surf/冲浪/v","dive/潜水/v","fish/钓鱼/v","hunt/打猎/v","race/比赛/v","compete/竞争/v","win/赢/v",
    "lose/输/v","play/玩/v","game/游戏/n","sport/运动/n","match/比赛/n","team/队伍/n","player/选手/n","coach/教练/n",
    "score/得分/n","goal/进球/n","point/分数/n","medal/奖牌/n","trophy/奖杯/n","prize/奖品/n","gift/礼物/n","card/卡片/n",
    "toy/玩具/n","doll/洋娃娃/n","puzzle/拼图/n","block/积木/n","kite/风筝/n","balloon/气球/n","robot/机器人/n","game/游戏机/n",
    "chess/国际象棋/n","piano/钢琴/n","guitar/吉他/n","violin/小提琴/n","drum/鼓/n","flute/笛子/n","trumpet/小号/n","music/音乐/n",
    "song/歌曲/n","dance/跳舞/v","sing/唱歌/v","draw/画画/v","paint/绘画/v","read/阅读/v","write/写作/v","story/故事/n",
    "movie/电影/n","film/电影/n","cartoon/动画片/n","show/节目/n","theater/剧院/n","cinema/电影院/n","circus/马戏团/n","zoo/动物园/n"
  ]},
  { name: "职业与工作", emoji: "👨‍💼", words: [
    "teacher/老师/n","student/学生/n","doctor/医生/n","nurse/护士/n","farmer/农民/n","worker/工人/n","driver/司机/n","cook/厨师/n",
    "pilot/飞行员/n","sailor/水手/n","soldier/士兵/n","police/警察/n","fireman/消防员/n","postman/邮递员/n","writer/作家/n","reader/读者/n",
    "singer/歌手/n","dancer/舞蹈家/n","actor/演员/n","actress/女演员/n","artist/艺术家/n","painter/画家/n","musician/音乐家/n","scientist/科学家/n",
    "engineer/工程师/n","lawyer/律师/n","judge/法官/n","king/国王/n","queen/女王/n","president/总统/n","leader/领导/n","boss/老板/n",
    "manager/经理/n","clerk/职员/n","secretary/秘书/n","assistant/助手/n","guide/导游/n","guard/保安/n","host/主持人/n","guest/客人/n",
    "job/工作/n","work/工作/n","career/职业/n","business/生意/n","company/公司/n","factory/工厂/n","shop/商店/n","store/店铺/n",
    "office/办公室/n","bank/银行/n","market/市场/n","supermarket/超市/n","mall/商场/n","hotel/酒店/n","restaurant/餐厅/n","cafe/咖啡馆/n",
    "work/工作/v","do/做/v","make/制作/v","build/建造/v","create/创造/v","design/设计/v","plan/计划/v","organize/组织/v",
    "help/帮助/v","serve/服务/v","lead/领导/v","follow/跟随/v","teach/教/v","learn/学/v","train/训练/v","practice/练习/v"
  ]},
  { name: "动作与动词", emoji: "🏃", words: [
    "be/是/v","have/有/v","do/做/v","make/制作/v","go/去/v","come/来/v","take/拿/v","give/给/v",
    "get/得到/v","put/放/v","let/让/v","keep/保持/v","find/找到/v","lose/丢失/v","look/看/v","see/看见/v",
    "watch/观看/v","show/展示/v","hear/听见/v","listen/听/v","smell/闻/v","taste/尝/v","feel/感觉/v","touch/触摸/v",
    "say/说/v","tell/告诉/v","speak/说/v","talk/谈话/v","ask/问/v","answer/回答/v","read/读/v","write/写/v",
    "think/想/v","know/知道/v","believe/相信/v","remember/记得/v","forget/忘记/v","understand/理解/v","learn/学/v","study/学习/v",
    "love/爱/v","like/喜欢/v","hate/讨厌/v","want/想要/v","need/需要/v","hope/希望/v","wish/愿望/v","try/尝试/v",
    "begin/开始/v","start/开始/v","end/结束/v","stop/停止/v","finish/完成/v","continue/继续/v","change/改变/v","become/变成/v",
    "move/移动/v","turn/转/v","open/打开/v","close/关上/v","push/推/v","pull/拉/v","carry/搬运/v","bring/带来/v",
    "buy/买/v","sell/卖/v","pay/付钱/v","cost/花费/v","spend/花费/v","save/节省/v","borrow/借/v","lend/借出/v",
    "meet/遇见/v","wait/等待/v","sit/坐/v","stand/站/v","lie/躺/v","sleep/睡/v","wake/醒来/v","rest/休息/v"
  ]},
  { name: "情感与形容词", emoji: "😊", words: [
    "happy/快乐的/adj","sad/悲伤的/adj","angry/生气的/adj","excited/兴奋的/adj","tired/累的/adj","bored/无聊的/adj","surprised/惊讶的/adj","afraid/害怕的/adj",
    "scared/害怕的/adj","worried/担心的/adj","nervous/紧张的/adj","calm/平静的/adj","relaxed/放松的/adj","proud/骄傲的/adj","ashamed/羞愧的/adj","lonely/孤独的/adj",
    "glad/高兴的/adj","pleased/满意的/adj","thankful/感恩的/adj","grateful/感激的/adj","sorry/抱歉的/adj","kind/善良的/adj","nice/好的/adj","mean/刻薄的/adj",
    "friendly/友好的/adj","unfriendly/不友好的/adj","polite/礼貌的/adj","rude/粗鲁的/adj","honest/诚实的/adj","brave/勇敢的/adj","shy/害羞的/adj","funny/有趣的/adj",
    "serious/严肃的/adj","silly/傻的/adj","clever/聪明的/adj","smart/聪明的/adj","wise/明智的/adj","foolish/愚蠢的/adj","careful/小心的/adj","careless/粗心的/adj",
    "good/好的/adj","bad/坏的/adj","right/对的/adj","wrong/错的/adj","true/真的/adj","false/假的/adj","real/真的/adj","fake/假的/adj",
    "big/大的/adj","small/小的/adj","large/大的/adj","tiny/微小的/adj","huge/巨大的/adj","long/长的/adj","short/短的/adj","tall/高的/adj",
    "wide/宽的/adj","narrow/窄的/adj","thick/厚的/adj","thin/薄的/adj","heavy/重的/adj","light/轻的/adj","hard/硬的/adj","soft/软的/adj",
    "new/新的/adj","old/旧的/adj","young/年轻的/adj","fresh/新鲜的/adj","full/满的/adj","empty/空的/adj","rich/富的/adj","poor/穷的/adj"
  ]},
  { name: "常用词与短语", emoji: "📝", words: [
    "the/这个/art","a/一个/art","an/一个/art","of/的/prep","to/到/prep","in/在...里/prep","on/在...上/prep","at/在/prep",
    "for/为了/prep","with/和/prep","by/通过/prep","from/从/prep","about/关于/prep","into/进入/prep","out of/从...出/prep","over/在...上方/prep",
    "under/在...下/prep","above/在...上方/prep","below/在...下方/prep","between/在...之间/prep","among/在...之中/prep","before/在...前/prep","after/在...后/prep","during/在...期间/prep",
    "until/直到/prep","since/自从/prep","through/通过/prep","across/横过/prep","along/沿着/prep","around/围绕/prep","against/反对/prep","without/没有/prep",
    "and/和/conj","or/或/conj","but/但是/conj","so/所以/conj","because/因为/conj","although/虽然/conj","if/如果/conj","when/当...时/conj",
    "while/当...时/conj","as/作为/conj","than/比/conj","that/那个/conj","what/什么/pron","which/哪个/pron","who/谁/pron","where/哪里/adv",
    "when/什么时候/adv","why/为什么/adv","how/怎么/adv","how many/多少/phrase","how much/多少/phrase","how long/多长/phrase","how old/多大/phrase","how far/多远/phrase",
    "very/非常/adv","quite/相当/adv","too/太/adv","also/也/adv","either/也/adv","neither/也不/adv","both/两者都/adv","all/全部/adv",
    "some/一些/adj","any/任何/adj","many/许多/adj","much/许多/adj","few/很少/adj","little/很少/adj","every/每个/adj","each/每个/adj"
  ]}
];

var units = UNITS.map(function(u, i){
  return {
    id: i + 1,
    name: u.name,
    emoji: u.emoji,
    words: u.words.map(function(w){
      var parts = w.split("/");
      return { en: parts[0], zh: parts[1], pos: parts[2] || "n" };
    })
  };
});

var total = units.reduce(function(a, u){ return a + u.words.length; }, 0);

var out = "/* ---------------- 小学英语 1200 词数据 ----------------\n";
out += " * 由 build/gen-vocab.js 生成。20 单元 × 60 词 = " + total + " 词。\n";
out += " * 每词含 en（英文）、zh（中文）、pos（词性）。\n";
out += " */\n";
out += "var VOCAB_DATA = " + JSON.stringify({ units: units }, null, 2) + ";\n";

var outPath = path.join(__dirname, "..", "src", "scripts", "data", "english-vocab.js");
fs.writeFileSync(outPath, out, "utf8");
console.log("Generated: " + outPath);
console.log("Units: " + units.length + " · Words: " + total);