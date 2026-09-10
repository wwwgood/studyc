/* ---------------- 英语口语大冒险 english-oral.js ----------------
 * 口语库分三个场景（scene），场景内由易到难分关：
 *   ① 🏫 学校课堂 —— 英语课上老师常说、常讲、常问、常听的常用语（第 1-5 关）
 *   ② 🏸 羽毛球场 —— 和巴基斯坦球友打球全程：约球、场上边打边聊、羽毛球术语、
 *      比赛规则比分、场上夸奖关心、休息聊天、约下次（第 6-12 关）
 *   ③ 🏠 家常聊天 —— 场下无话不谈：家人朋友、学校周末、好吃的好玩的和节日（第 13-15 关）
 * 每句带：英文(en) + 中文(zh) + 小贴士(note) + 常用回答(reply:{en,zh})，做到有问有答。
 * 进度保存在 S.oral = { heard:{key:1}, said:{key:1}, coins:0 }。
 * key = level.id + ":" + item.en
 */
var ORAL_DATA = {
  levels: [
    {
      id: 1,
      scene: "🏫 学校 · 课堂口语",
      name: "课堂问候",
      emoji: "👋",
      desc: "最简单的课堂用语，先听老师怎么说，跟着读",
      items: [
        { en: "Stand up.", zh: "起立。", note: "老师让你站起来时说。", reply: { en: "Yes, teacher.", zh: "好的，老师。" } },
        { en: "Sit down.", zh: "坐下。", note: "坐下听讲或休息时说。", reply: { en: "Thank you.", zh: "谢谢。" } },
        { en: "Good morning, class.", zh: "同学们，早上好。", note: "早上上课老师第一句。", reply: { en: "Good morning, teacher.", zh: "老师早上好。" } },
        { en: "Good afternoon, class.", zh: "同学们，下午好。", note: "下午上课老师说。", reply: { en: "Good afternoon, teacher.", zh: "老师下午好。" } },
        { en: "Hello, teacher.", zh: "老师好。", note: "你跟老师打招呼。", reply: { en: "Hello!", zh: "你好！" } },
        { en: "Goodbye, teacher.", zh: "老师再见。", note: "下课跟老师说再见。", reply: { en: "Goodbye!", zh: "再见！" } },
        { en: "Open your book.", zh: "打开书。", note: "准备看书或读书。", reply: { en: "OK.", zh: "好的。" } },
        { en: "Close your book.", zh: "合上书。", note: "书看完收起来。", reply: { en: "Yes, teacher.", zh: "好的，老师。" } },
        { en: "Listen to me.", zh: "听我说。", note: "老师要你专心听。", reply: { en: "Yes, I'm listening.", zh: "好的，我在听。" } },
        { en: "Look at the blackboard.", zh: "看黑板。", note: "老师写字时让你看。", reply: { en: "OK, I'm looking.", zh: "好的，我看着呢。" } }
      ]
    },
    {
      id: 2,
      scene: "🏫 学校 · 课堂口语",
      name: "课堂指令",
      emoji: "📢",
      desc: "老师上课常下的小指令，照着做就行",
      items: [
        { en: "Read after me.", zh: "跟我读。", note: "最重要的一句，跟读开始啦。", reply: { en: "OK!", zh: "好的！" } },
        { en: "Listen carefully.", zh: "仔细听。", note: "要认真听清楚。", reply: { en: "Yes, I will.", zh: "好的，我会的。" } },
        { en: "Speak loudly.", zh: "大声说。", note: "别害羞，声音大一点。", reply: { en: "OK, I'll try.", zh: "好的，我试试。" } },
        { en: "Repeat, please.", zh: "请重复一遍。", note: "再说一次。", reply: { en: "OK, again.", zh: "好的，再来。" } },
        { en: "Again, please.", zh: "再来一次。", note: "还想让你做一遍。", reply: { en: "Sure!", zh: "好的！" } },
        { en: "Open your mouth.", zh: "张开嘴。", note: "读单词/发音时老师说。", reply: { en: "Ahh...", zh: "啊——" } },
        { en: "Work in pairs.", zh: "两人一组练习。", note: "和同桌一起练。", reply: { en: "Let's start!", zh: "我们开始吧！" } },
        { en: "Hands up.", zh: "举手。", note: "想回答先举手。", reply: { en: "Me!", zh: "我来！" } },
        { en: "Put up your hand.", zh: "举起你的手。", note: "和 Hands up 一个意思。", reply: { en: "Me, me!", zh: "我，我！" } },
        { en: "Line up.", zh: "排队。", note: "排队出教室或做操。", reply: { en: "OK!", zh: "好的！" } }
      ]
    },
    {
      id: 3,
      scene: "🏫 学校 · 课堂口语",
      name: "老师常问 · 我常答",
      emoji: "❓",
      desc: "老师最爱问的问题，先听懂，再学着回答",
      items: [
        { en: "What's this?", zh: "这是什么？", note: "指着近处的东西问。", reply: { en: "It's a book.", zh: "这是一本书。" } },
        { en: "What's that?", zh: "那是什么？", note: "指着远处的东西问。", reply: { en: "It's a desk.", zh: "那是一张书桌。" } },
        { en: "How are you?", zh: "你好吗？", note: "常答：I'm fine, thank you.", reply: { en: "I'm fine, thank you.", zh: "我很好，谢谢。" } },
        { en: "What's your name?", zh: "你叫什么名字？", note: "介绍自己时答名字。", reply: { en: "My name is Tom.", zh: "我叫汤姆。" } },
        { en: "How old are you?", zh: "你几岁了？", note: "答：I'm ... years old.", reply: { en: "I'm ten years old.", zh: "我十岁了。" } },
        { en: "What color is it?", zh: "它是什么颜色？", note: "问颜色。", reply: { en: "It's red.", zh: "是红色的。" } },
        { en: "Can you spell it?", zh: "你会拼写吗？", note: "把单词字母拼出来。", reply: { en: "Yes. B-O-O-K.", zh: "会。B-O-O-K。" } },
        { en: "Do you understand?", zh: "你明白了吗？", note: "懂就说 Yes, I do.", reply: { en: "Yes, I do.", zh: "是的，我懂了。" } },
        { en: "Who can answer?", zh: "谁能回答？", note: "想答就举手。", reply: { en: "I can!", zh: "我能！" } },
        { en: "May I come in?", zh: "我可以进来吗？", note: "进教室前敲门问。", reply: { en: "Yes, come in.", zh: "可以，进来吧。" } }
      ]
    },
    {
      id: 4,
      scene: "🏫 学校 · 课堂口语",
      name: "课堂互动 · 表达",
      emoji: "🙋",
      desc: "在课上大胆开口，说出你的需要和想法",
      items: [
        { en: "May I go to the bathroom?", zh: "我可以去洗手间吗？", note: "想上厕所时礼貌地问。", reply: { en: "Yes, you may.", zh: "可以，去吧。" } },
        { en: "Can I drink some water?", zh: "我可以喝口水吗？", note: "口渴时问。", reply: { en: "Sure, go ahead.", zh: "可以，去喝吧。" } },
        { en: "I'm sorry, I'm late.", zh: "对不起，我迟到了。", note: "迟到进门说。", reply: { en: "It's OK. Come in.", zh: "没关系，进来吧。" } },
        { en: "Let me try.", zh: "让我试试。", note: "勇敢举手尝试。", reply: { en: "OK, go ahead!", zh: "好的，你来！" } },
        { en: "I don't know.", zh: "我不知道。", note: "诚实说不会。", reply: { en: "That's OK. Let's learn.", zh: "没关系，我们一起学。" } },
        { en: "Please help me.", zh: "请帮帮我。", note: "卡住了请老师帮忙。", reply: { en: "Sure, what's wrong?", zh: "好的，怎么了？" } },
        { en: "Can you say it again?", zh: "你能再说一遍吗？", note: "没听清请重复。", reply: { en: "Of course.", zh: "当然可以。" } },
        { en: "I finished my work.", zh: "我做完作业了。", note: "做完告诉老师。", reply: { en: "Well done!", zh: "做得好！" } },
        { en: "Good job!", zh: "做得好！", note: "老师表扬你或同学。", reply: { en: "Thank you!", zh: "谢谢！" } },
        { en: "Well done!", zh: "干得好！", note: "和 Good job 一样是夸奖。", reply: { en: "Thanks!", zh: "谢谢！" } }
      ]
    },
    {
      id: 5,
      scene: "🏫 学校 · 课堂口语",
      name: "进阶课堂用语",
      emoji: "🚀",
      desc: "更难一点，但用上它你就是英语小达人",
      items: [
        { en: "Could you speak more slowly, please?", zh: "你能说慢一点吗？", note: "没跟上请老师放慢。", reply: { en: "Sure, no problem.", zh: "好的，没问题。" } },
        { en: "What does this word mean?", zh: "这个词是什么意思？", note: "遇到生词就问。", reply: { en: "It means 'happy'.", zh: "意思是'快乐'。" } },
        { en: "Can you give me an example?", zh: "你能举个例子吗？", note: "想听具体用法。", reply: { en: "Sure. For example...", zh: "好的，比如……" } },
        { en: "Let's practice together.", zh: "我们一起练习吧。", note: "邀请一起练。", reply: { en: "Great idea!", zh: "好主意！" } },
        { en: "Today we are going to learn…", zh: "今天我们学习……", note: "老师开场说今天内容。", reply: { en: "Sounds fun!", zh: "听起来真有趣！" } },
        { en: "Please take out your notebook.", zh: "请拿出你的笔记本。", note: "要记笔记了。", reply: { en: "OK, here it is.", zh: "好的，拿出来了。" } },
        { en: "Read the text, please.", zh: "请读课文。", note: "读一段课文。", reply: { en: "Yes, teacher.", zh: "好的，老师。" } },
        { en: "Make a sentence, please.", zh: "请造一个句子。", note: "用单词造句。", reply: { en: "Let me try.", zh: "我试试。" } },
        { en: "Raise your hand before you speak.", zh: "说话前先举手。", note: "课堂规矩。", reply: { en: "Yes, I will.", zh: "好的，我会的。" } },
        { en: "See you tomorrow.", zh: "明天见。", note: "放学道别。", reply: { en: "See you!", zh: "明天见！" } }
      ]
    },
    {
      id: 6,
      scene: "🏸 羽毛球场 · 和外国朋友",
      name: "球场见面 · 约他打球",
      emoji: "🤝",
      desc: "见到巴基斯坦球友先说什么？学会打招呼和邀请",
      items: [
        { en: "Hi! Nice to see you!", zh: "嗨！见到你真高兴！", note: "见面热情打招呼，他会说 Me too!", reply: { en: "Nice to see you too!", zh: "见到你也高兴！" } },
        { en: "Do you want to play badminton?", zh: "你想打羽毛球吗？", note: "邀请他打球，他答 Yes! 就开打。", reply: { en: "Yes, I'd love to!", zh: "好啊，我很想！" } },
        { en: "Let's play together!", zh: "我们一起玩吧！", note: "招呼他加入。", reply: { en: "Great! Let's go!", zh: "太好了，走吧！" } },
        { en: "Can I play with you?", zh: "我能和你一起玩吗？", note: "想加入时礼貌地问。", reply: { en: "Sure, join us!", zh: "当然，一起吧！" } },
        { en: "Are you ready?", zh: "你准备好了吗？", note: "开打前问。", reply: { en: "I'm ready!", zh: "准备好了！" } },
        { en: "It's your turn.", zh: "轮到你了。", note: "turn 是\"轮到的顺序\"。", reply: { en: "OK, my turn!", zh: "好的，轮到我了！" } },
        { en: "Let's start!", zh: "我们开始吧！", note: "一声令下开始比赛。", reply: { en: "Let's go!", zh: "开始吧！" } },
        { en: "Let's be friends!", zh: "我们做朋友吧！", note: "最真诚的邀请，他一定会说 OK!", reply: { en: "OK, let's be friends!", zh: "好，我们做朋友！" } },
        { en: "What's your name?", zh: "你叫什么名字？", note: "他会答 My name is...", reply: { en: "My name is Ali.", zh: "我叫阿里。" } },
        { en: "You're so good!", zh: "你真厉害！", note: "夸他球打得好。", reply: { en: "Thank you! You too!", zh: "谢谢！你也很棒！" } }
      ]
    },
    {
      id: 7,
      scene: "🏸 羽毛球场 · 和外国朋友",
      name: "球场上 · 边打边聊",
      emoji: "🏸",
      desc: "打球时最常用的话：发球、好球、报比分",
      items: [
        { en: "Whose serve?", zh: "轮到谁发球？", note: "serve 是发球。", reply: { en: "Your serve.", zh: "你发球。" } },
        { en: "My serve.", zh: "我发球。", note: "该你发就这么说。", reply: { en: "OK, go ahead!", zh: "好的，发吧！" } },
        { en: "Good shot!", zh: "好球！", note: "shot 是击球。", reply: { en: "Thanks!", zh: "谢谢！" } },
        { en: "Nice try!", zh: "好险，差点就接到了！", note: "他没接到但球很刁钻时鼓励他。", reply: { en: "Almost!", zh: "就差一点！" } },
        { en: "It's out!", zh: "出界了！", note: "out 就是球出界。", reply: { en: "Oh, too bad.", zh: "哎呀，可惜。" } },
        { en: "That's my point.", zh: "这分是我的。", note: "point 是得分。", reply: { en: "Good point!", zh: "好球！" } },
        { en: "The score is 5 to 3.", zh: "比分是 5 比 3。", note: "报比分用 to：5 to 3。", reply: { en: "OK, let's keep going!", zh: "好，继续！" } },
        { en: "Let me pick up the shuttlecock.", zh: "我来捡球。", note: "shuttlecock 就是羽毛球。", reply: { en: "Thanks!", zh: "谢谢！" } },
        { en: "Let's take a break.", zh: "我们休息一下吧。", note: "break 是休息，累了就说。", reply: { en: "Good idea. I'm tired.", zh: "好主意，我累了。" } },
        { en: "You win! Well played!", zh: "你赢了！打得漂亮！", note: "输了也大方祝贺。", reply: { en: "Thank you! Good game!", zh: "谢谢！好比赛！" } }
      ]
    },
    {
      id: 10,
      scene: "🏸 羽毛球场 · 和外国朋友",
      name: "羽毛球术语 · 动作名称",
      emoji: "🎯",
      desc: "常上场就要会行话：扣杀、吊球、高远球……",
      items: [
        { en: "Smash!", zh: "扣杀！", note: "最帅的进攻动作。", reply: { en: "Nice smash!", zh: "好一记扣杀！" } },
        { en: "Nice smash!", zh: "好一记扣杀！", note: "夸他杀球漂亮。", reply: { en: "Thanks!", zh: "谢谢！" } },
        { en: "drop shot", zh: "吊球。", note: "轻轻把球吊到网前。", reply: { en: "Nice drop shot!", zh: "好吊球！" } },
        { en: "clear", zh: "高远球。", note: "把球打得又高又远。", reply: { en: "Good clear!", zh: "好高远球！" } },
        { en: "net shot", zh: "网前球。", note: "在网前轻轻一放。", reply: { en: "Great net shot!", zh: "好网前球！" } },
        { en: "forehand", zh: "正手。", note: "顺手那一面的击球。", reply: { en: "Strong forehand!", zh: "正手真有力！" } },
        { en: "backhand", zh: "反手。", note: "用手背那一面击球。", reply: { en: "Cool backhand!", zh: "反手真酷！" } },
        { en: "What a rally!", zh: "这个回合太精彩了！", note: "rally 是你来我往的一个回合。", reply: { en: "Yes, so exciting!", zh: "对，太刺激了！" } },
        { en: "drive", zh: "平抽球。", note: "又快又平、贴网而过的球。", reply: { en: "Fast drive!", zh: "平抽真快！" } },
        { en: "Your footwork is great!", zh: "你的步法真棒！", note: "footwork 是步法。", reply: { en: "Thank you! I practice a lot.", zh: "谢谢！我练了很多。" } }
      ]
    },
    {
      id: 11,
      scene: "🏸 羽毛球场 · 和外国朋友",
      name: "比赛用语 · 规则与比分",
      emoji: "🏆",
      desc: "常上场就要懂规则：局点、平分、换边……",
      items: [
        { en: "Let's play best of three.", zh: "我们三局两胜吧。", note: "best of three 就是三局两胜。", reply: { en: "OK, sounds good!", zh: "好的，没问题！" } },
        { en: "21 points wins the game.", zh: "21 分赢一局。", note: "正式规则每局 21 分。", reply: { en: "Got it!", zh: "明白！" } },
        { en: "Game point!", zh: "局点！", note: "再得 1 分就赢这一局了。", reply: { en: "Come on!", zh: "加油！" } },
        { en: "Match point!", zh: "赛点！", note: "再赢 1 分整场就结束了。", reply: { en: "This is it!", zh: "就这一分了！" } },
        { en: "Deuce!", zh: "平分！", note: "20 平以后叫 deuce。", reply: { en: "So close!", zh: "太接近了！" } },
        { en: "Serve fault.", zh: "发球违例。", note: "发球出界或过高算违例。", reply: { en: "Oh, my bad.", zh: "哎呀，我的错。" } },
        { en: "Let's change sides.", zh: "我们交换场地吧。", note: "一局结束要换边。", reply: { en: "OK, let's go.", zh: "好的，走。" } },
        { en: "Let's take an interval.", zh: "我们歇一局再打。", note: "interval 是局间休息。", reply: { en: "Good, I need water.", zh: "好，我要喝口水。" } },
        { en: "You're leading by 3.", zh: "你领先 3 分。", note: "lead 是领先。", reply: { en: "Come on, I can catch up!", zh: "加油，我能追上！" } },
        { en: "20 to 20! So close!", zh: "20 比 20！太接近了！", note: "so close 是比分咬得紧。", reply: { en: "Anyone can win!", zh: "谁都有机会！" } }
      ]
    },
    {
      id: 12,
      scene: "🏸 羽毛球场 · 和外国朋友",
      name: "场上关心 · 夸奖与道歉",
      emoji: "💪",
      desc: "打到人要道歉、摔倒要关心，好朋友就要互相打气",
      items: [
        { en: "Watch out!", zh: "小心！", note: "球快打到人时大声提醒。", reply: { en: "Whoa, thanks!", zh: "哇，谢谢提醒！" } },
        { en: "Are you OK?", zh: "你还好吗？", note: "他摔倒了先问这句。", reply: { en: "I'm OK, thanks!", zh: "我没事，谢谢！" } },
        { en: "Are you hurt?", zh: "你受伤了吗？", note: "看他疼得厉害再问这句。", reply: { en: "No, I'm fine.", zh: "没有，我没事。" } },
        { en: "My bad! Sorry!", zh: "我的错！对不起！", note: "球打到别人时赶紧说。", reply: { en: "It's OK, no worries!", zh: "没事，别在意！" } },
        { en: "Take your time.", zh: "别急，慢慢来。", note: "他累了或摔了，让他休息。", reply: { en: "Thanks, I'll rest a bit.", zh: "谢谢，我歇一下。" } },
        { en: "Let me help you.", zh: "我来帮你。", note: "伸手拉他起来。", reply: { en: "Thank you so much!", zh: "太谢谢你了！" } },
        { en: "You improved a lot!", zh: "你进步好大！", note: "improve 是进步。", reply: { en: "Really? Thank you!", zh: "真的吗？谢谢！" } },
        { en: "Don't give up!", zh: "别放弃！", note: "他落后时给他打气。", reply: { en: "I won't! Thanks!", zh: "不会的，谢谢！" } },
        { en: "Good luck! Have fun!", zh: "加油！玩得开心！", note: "开打前互相鼓励。", reply: { en: "You too!", zh: "你也一样！" } },
        { en: "It's not about winning. It's about fun!", zh: "不在乎输赢，开心就好！", note: "打球的真正意义。", reply: { en: "You're right!", zh: "你说得对！" } }
      ]
    },
    {
      id: 8,
      scene: "🏸 羽毛球场 · 和外国朋友",
      name: "休息时 · 认识新朋友",
      emoji: "💬",
      desc: "坐下喝水时聊一聊，了解彼此、交个好朋友",
      items: [
        { en: "Where are you from?", zh: "你来自哪里？", note: "他会说 I'm from Pakistan.", reply: { en: "I'm from Pakistan.", zh: "我来自巴基斯坦。" } },
        { en: "I'm from China.", zh: "我来自中国。", note: "介绍自己的国家。", reply: { en: "Cool! I'd love to visit.", zh: "真棒，我想去看看。" } },
        { en: "What language do you speak?", zh: "你说什么语言？", note: "巴基斯坦很多人都会说英语。", reply: { en: "I speak English and Urdu.", zh: "我说英语和乌尔都语。" } },
        { en: "Which school do you go to?", zh: "你在哪所学校上学？", note: "他可能答 I go to ... School.", reply: { en: "I go to City School.", zh: "我在城市学校上学。" } },
        { en: "What's your favorite sport?", zh: "你最喜欢的运动是什么？", note: "favorite 是\"最喜欢的\"。", reply: { en: "I love cricket!", zh: "我最爱板球！" } },
        { en: "I like badminton best.", zh: "我最喜欢羽毛球。", note: "best 是\"最\"。", reply: { en: "Me too! It's so fun.", zh: "我也是！太好玩了。" } },
        { en: "Do you have any brothers or sisters?", zh: "你有兄弟姐妹吗？", note: "他可能答 I have a sister.", reply: { en: "Yes, I have a sister.", zh: "有，我有个姐姐。" } },
        { en: "What do you like to eat?", zh: "你喜欢吃什么？", note: "聊吃的最容易交朋友。", reply: { en: "I like noodles.", zh: "我喜欢面条。" } },
        { en: "Do you like Chinese food?", zh: "你喜欢中国菜吗？", note: "他很可能说 Yes, very much!", reply: { en: "Yes, very much!", zh: "喜欢，非常喜欢！" } },
        { en: "You're my good friend.", zh: "你是我的好朋友。", note: "真诚表达友谊。", reply: { en: "And you're mine!", zh: "你也是我的好朋友！" } }
      ]
    },
    {
      id: 9,
      scene: "🏸 羽毛球场 · 和外国朋友",
      name: "约下次 · 道别",
      emoji: "📅",
      desc: "学会约时间、约地点，开心地说再见",
      items: [
        { en: "When do you usually play?", zh: "你通常什么时候打球？", note: "usually 是\"通常\"。", reply: { en: "I usually play on weekends.", zh: "我通常周末打。" } },
        { en: "How about this weekend?", zh: "这周末怎么样？", note: "How about 用来提建议。", reply: { en: "That sounds great!", zh: "太好了，就这么定！" } },
        { en: "What time shall we meet?", zh: "我们几点见面？", note: "问具体见面时间。", reply: { en: "How about 9 o'clock?", zh: "9 点怎么样？" } },
        { en: "Let's meet at 9 o'clock.", zh: "我们 9 点见面吧。", note: "报整点：at + 数字 + o'clock。", reply: { en: "OK, see you then!", zh: "好的，到时见！" } },
        { en: "Where shall we meet?", zh: "我们在哪儿见面？", note: "shall we 是\"我们……好不好\"。", reply: { en: "At the badminton court.", zh: "在羽毛球场吧。" } },
        { en: "At the badminton court.", zh: "在羽毛球场。", note: "court 就是球场。", reply: { en: "OK, I'll be there.", zh: "好的，我准时到。" } },
        { en: "Don't forget to bring your racket.", zh: "别忘了带球拍。", note: "racket 是球拍。", reply: { en: "I won't. Thanks!", zh: "不会忘的，谢谢！" } },
        { en: "I had a great time today.", zh: "今天我玩得很开心。", note: "分开前说。", reply: { en: "Me too! Let's do it again.", zh: "我也是！下次再来。" } },
        { en: "See you next time!", zh: "下次见！", note: "约好下次再一起打。", reply: { en: "See you! Take care.", zh: "再见，保重。" } },
        { en: "Goodbye, my friend!", zh: "再见，我的朋友！", note: "热情挥手告别。", reply: { en: "Goodbye! See you soon!", zh: "再见，期待再见！" } }
      ]
    },
    {
      id: 13,
      scene: "🏠 家常聊天 · 无话不谈",
      name: "聊家人和朋友",
      emoji: "👨‍👩‍👧",
      desc: "场下坐下聊：家里几口人、爸爸妈妈做什么的",
      items: [
        { en: "How many people are in your family?", zh: "你家有几口人？", note: "他可能答 There are four people.", reply: { en: "There are four people.", zh: "我家有四口人。" } },
        { en: "There are three people in my family.", zh: "我家有三口人。", note: "介绍自己家最常用的一句。", reply: { en: "That's a nice small family.", zh: "真好，是个小家庭。" } },
        { en: "What does your dad do?", zh: "你爸爸是做什么工作的？", note: "问工作，他可能答 He is a doctor.", reply: { en: "He is a doctor.", zh: "他是医生。" } },
        { en: "My mom is a great cook.", zh: "我妈妈做饭特别好吃。", note: "cook 这里是\"做饭的人\"。", reply: { en: "Lucky you!", zh: "你真有口福！" } },
        { en: "Do you live with your grandparents?", zh: "你和爷爷奶奶住在一起吗？", note: "grandparents 是爷爷奶奶/外公外婆。", reply: { en: "Yes, we live together.", zh: "是的，住在一起。" } },
        { en: "I have a little sister.", zh: "我有个小妹妹。", note: "younger sister 是妹妹。", reply: { en: "How cute!", zh: "真可爱！" } },
        { en: "Do you have any pets?", zh: "你养宠物吗？", note: "他可能答 I have a cat.", reply: { en: "Yes, I have a cat.", zh: "有，我养了只猫。" } },
        { en: "What's your pet's name?", zh: "你的宠物叫什么名字？", note: "聊宠物最容易打开话匣子。", reply: { en: "His name is Lucky.", zh: "它叫幸运。" } },
        { en: "My best friend is my deskmate.", zh: "我最好的朋友是我同桌。", note: "deskmate 是同桌。", reply: { en: "That's so nice!", zh: "真好啊！" } },
        { en: "Welcome to my home!", zh: "欢迎来我家玩！", note: "真诚邀请。", reply: { en: "Thank you! I'd love to.", zh: "谢谢，我很乐意！" } }
      ]
    },
    {
      id: 14,
      scene: "🏠 家常聊天 · 无话不谈",
      name: "聊学校和生活",
      emoji: "📚",
      desc: "上几年级、喜欢什么课、周末干嘛、几点睡觉",
      items: [
        { en: "What grade are you in?", zh: "你上几年级？", note: "他可能答 I'm in Grade Four.", reply: { en: "I'm in Grade Four.", zh: "我上四年级。" } },
        { en: "I'm in Grade Four.", zh: "我上四年级。", note: "介绍自己年级。", reply: { en: "Same here! We're the same age.", zh: "我也是！我们一样大。" } },
        { en: "What's your favorite subject?", zh: "你最喜欢哪门课？", note: "subject 是科目。", reply: { en: "I like math best.", zh: "我最喜欢数学。" } },
        { en: "I like PE best.", zh: "我最喜欢体育课。", note: "PE 就是体育课。", reply: { en: "Me too! Running is fun.", zh: "我也是！跑步真好玩。" } },
        { en: "Do you have a lot of homework?", zh: "你作业多吗？", note: "聊作业是学生间永恒的话题。", reply: { en: "Yes, too much!", zh: "好多啊，写不完！" } },
        { en: "What do you do on weekends?", zh: "你周末做什么？", note: "巴基斯坦人超爱板球 cricket。", reply: { en: "I play cricket.", zh: "我打板球。" } },
        { en: "Sometimes I play games.", zh: "我有时候打打游戏。", note: "sometimes 是有时候。", reply: { en: "Me too! What games?", zh: "我也玩！玩什么？" } },
        { en: "I go to the park with my dad.", zh: "我和爸爸去公园。", note: "聊周末活动。", reply: { en: "That sounds nice.", zh: "听起来真好。" } },
        { en: "What time do you go to bed?", zh: "你几点睡觉？", note: "他可能答 At nine。", reply: { en: "At nine o'clock.", zh: "九点。" } },
        { en: "See you at school!", zh: "学校见！", note: "原来你们还是一个学校的！", reply: { en: "See you! Let's sit together.", zh: "再见，我们坐一起！" } }
      ]
    },
    {
      id: 15,
      scene: "🏠 家常聊天 · 无话不谈",
      name: "聊吃的和节日",
      emoji: "🥟",
      desc: "中国菜、饺子、春节和中秋，请他尝尝你的最爱",
      items: [
        { en: "What's your favorite Chinese food?", zh: "你最喜欢什么中国菜？", note: "他很可能说 noodles 或 rice。", reply: { en: "I love noodles.", zh: "我最爱面条。" } },
        { en: "Do you like dumplings?", zh: "你喜欢饺子吗？", note: "dumplings 是饺子。", reply: { en: "Yes, they're delicious!", zh: "喜欢，太好吃了！" } },
        { en: "Have you ever tried hotpot?", zh: "你吃过火锅吗？", note: "have you ever... 是\"你……过吗\"。", reply: { en: "No, not yet. Is it spicy?", zh: "还没，辣吗？" } },
        { en: "Is it too spicy for you?", zh: "对你来说太辣了吗？", note: "spicy 是辣。", reply: { en: "A little, but I like it!", zh: "有一点，但我喜欢！" } },
        { en: "Do you know Spring Festival?", zh: "你知道春节吗？", note: "Spring Festival 是春节。", reply: { en: "Yes, it's the Chinese New Year!", zh: "知道，是中国新年！" } },
        { en: "We eat mooncakes at Mid-Autumn Festival.", zh: "中秋节我们吃月饼。", note: "mooncake 是月饼。", reply: { en: "I'd love to try one!", zh: "我想尝一个！" } },
        { en: "Would you like to try some?", zh: "你想尝尝吗？", note: "分享零食时说。", reply: { en: "Yes, please! Thank you!", zh: "好的，谢谢！" } },
        { en: "This gift is for you.", zh: "这个礼物送给你。", note: "送小礼物，友谊升温。", reply: { en: "Wow, thank you so much!", zh: "哇，太谢谢了！" } },
        { en: "Can you teach me Urdu?", zh: "你能教我乌尔都语吗？", note: "Urdu 是巴基斯坦的乌尔都语。", reply: { en: "Sure! And you teach me Chinese?", zh: "好啊！你教我中文？" } },
        { en: "Thank you for playing with me!", zh: "谢谢你陪我玩！", note: "发自内心地感谢。", reply: { en: "You're welcome! Anytime!", zh: "不客气，随时奉陪！" } }
      ]
    }
  ]
};
