/* ---------------- "走进闪亮家族"系列英语作文数据 ----------------
 * 由 build/gen-writing.js 生成。4 本书 × 25 篇 = 99 篇范文。
 * 每篇含范文正文、写作要点、重点词汇、3 道练习题。
 */
var WRITE_DATA = {
  "books": [
    {
      "id": 1,
      "name": "示范作文大全",
      "emoji": "🌟",
      "desc": "各类优秀范文精选"
    },
    {
      "id": 2,
      "name": "分类作文大全",
      "emoji": "📂",
      "desc": "按题材分类写作"
    },
    {
      "id": 3,
      "name": "看图作文大全",
      "emoji": "🖼️",
      "desc": "看图写话训练"
    },
    {
      "id": 4,
      "name": "日记大全",
      "emoji": "📔",
      "desc": "日记格式范文"
    }
  ],
  "passages": [
    {
      "id": "w1",
      "book": 1,
      "title": "Self-Introduction",
      "cat": "自我介绍",
      "body": "Hello, everyone! My name is Li Ming. I am ten years old. I am a student in Grade Four. I study at Sunshine Primary School. I like reading books and playing football. My favorite subject is English. I want to be a teacher when I grow up. I hope we can be good friends. Thank you!",
      "tips": [
        "开头问好 Hello everyone",
        "介绍名字、年龄、年级、学校",
        "介绍爱好和最喜欢的科目",
        "结尾表达交友愿望"
      ],
      "words": [
        "everyone",
        "student",
        "Grade Four",
        "favorite",
        "subject",
        "grow up"
      ],
      "q": [
        {
          "q": "How old is Li Ming?",
          "o": [
            "Eight",
            "Nine",
            "Ten"
          ],
          "a": 2,
          "why": "文章说 I am ten years old。"
        },
        {
          "q": "What does Li Ming want to be?",
          "o": [
            "A doctor",
            "A teacher",
            "A pilot"
          ],
          "a": 1,
          "why": "文章说 I want to be a teacher。"
        },
        {
          "q": "What is his favorite subject?",
          "o": [
            "Math",
            "Chinese",
            "English"
          ],
          "a": 2,
          "why": "文章说 My favorite subject is English。"
        }
      ]
    },
    {
      "id": "w2",
      "book": 1,
      "title": "My Family",
      "cat": "描写人物",
      "body": "There are three people in my family: my father, my mother and me. My father is a doctor. He works in a hospital. My mother is a teacher. She teaches Chinese. I am a student. We love each other very much. On weekends, we often go to the park together. I have a happy family.",
      "tips": [
        "开头说明家庭人数",
        "分别介绍每个成员的职业",
        "描述家庭活动",
        "结尾表达感受"
      ],
      "words": [
        "people",
        "doctor",
        "hospital",
        "teacher",
        "teach",
        "weekend"
      ],
      "q": [
        {
          "q": "How many people are there in the family?",
          "o": [
            "Two",
            "Three",
            "Four"
          ],
          "a": 1,
          "why": "文章说 There are three people。"
        },
        {
          "q": "What does the father do?",
          "o": [
            "Teacher",
            "Doctor",
            "Driver"
          ],
          "a": 1,
          "why": "文章说 My father is a doctor。"
        },
        {
          "q": "Where do they go on weekends?",
          "o": [
            "The park",
            "The zoo",
            "The cinema"
          ],
          "a": 0,
          "why": "文章说 go to the park together。"
        }
      ]
    },
    {
      "id": "w3",
      "book": 1,
      "title": "My Best Friend",
      "cat": "描写人物",
      "body": "My best friend is Amy. She is a lovely girl. She is tall and thin. She has long black hair and big eyes. Amy is good at math and English. She often helps me with my homework. We go to school together every day. We like reading story books. We are good friends.",
      "tips": [
        "开头点明谁是最好的朋友",
        "描写外貌特征",
        "描写优点和特长",
        "描述共同活动"
      ],
      "words": [
        "best friend",
        "lovely",
        "tall",
        "thin",
        "good at",
        "help"
      ],
      "q": [
        {
          "q": "What does Amy look like?",
          "o": [
            "Short and fat",
            "Tall and thin",
            "Short and thin"
          ],
          "a": 1,
          "why": "文章说 She is tall and thin。"
        },
        {
          "q": "What is Amy good at?",
          "o": [
            "Math and English",
            "Art and Music",
            "PE and Science"
          ],
          "a": 0,
          "why": "文章说 good at math and English。"
        },
        {
          "q": "What do they like doing together?",
          "o": [
            "Playing sports",
            "Reading story books",
            "Watching TV"
          ],
          "a": 1,
          "why": "文章说 We like reading story books。"
        }
      ]
    },
    {
      "id": "w4",
      "book": 1,
      "title": "My School",
      "cat": "写景",
      "body": "My school is very beautiful. It has a big playground. We can play football and basketball there. There are many trees and flowers in our school. In spring, the flowers are beautiful. Our classroom is big and clean. There are forty desks and chairs in it. I love my school very much.",
      "tips": [
        "开头总体评价",
        "描述学校设施",
        "描述环境特色",
        "结尾表达喜爱"
      ],
      "words": [
        "beautiful",
        "playground",
        "flower",
        "classroom",
        "clean",
        "desk"
      ],
      "q": [
        {
          "q": "What can they do on the playground?",
          "o": [
            "Play football and basketball",
            "Read books",
            "Have lunch"
          ],
          "a": 0,
          "why": "文章说 play football and basketball there。"
        },
        {
          "q": "When are the flowers beautiful?",
          "o": [
            "Summer",
            "Spring",
            "Autumn"
          ],
          "a": 1,
          "why": "文章说 In spring, the flowers are beautiful。"
        },
        {
          "q": "How many desks are in the classroom?",
          "o": [
            "Thirty",
            "Forty",
            "Fifty"
          ],
          "a": 1,
          "why": "文章说 forty desks and chairs。"
        }
      ]
    },
    {
      "id": "w5",
      "book": 1,
      "title": "My Day",
      "cat": "记事",
      "body": "I get up at seven o'clock every morning. I brush my teeth and wash my face. Then I have breakfast. I go to school at half past seven. I have four classes in the morning and two in the afternoon. After school, I do my homework. I go to bed at nine. This is my day.",
      "tips": [
        "按时间顺序描写",
        "用具体时间点",
        "描述每个时间段的活动",
        "结尾总结"
      ],
      "words": [
        "get up",
        "brush teeth",
        "breakfast",
        "class",
        "homework",
        "go to bed"
      ],
      "q": [
        {
          "q": "What time does the writer get up?",
          "o": [
            "6:00",
            "7:00",
            "8:00"
          ],
          "a": 1,
          "why": "文章说 get up at seven o'clock。"
        },
        {
          "q": "How many classes are there in the morning?",
          "o": [
            "Two",
            "Three",
            "Four"
          ],
          "a": 2,
          "why": "文章说 four classes in the morning。"
        },
        {
          "q": "What time does the writer go to bed?",
          "o": [
            "8:00",
            "9:00",
            "10:00"
          ],
          "a": 1,
          "why": "文章说 go to bed at nine。"
        }
      ]
    },
    {
      "id": "w6",
      "book": 1,
      "title": "My Weekend",
      "cat": "记事",
      "body": "I had a busy weekend. On Saturday morning, I did my homework. In the afternoon, I went to the park with my friends. We played games and had a picnic. On Sunday, I visited my grandma. I helped her clean the house. We had a big dinner together. I was tired but happy.",
      "tips": [
        "用过去时描述过去的事",
        "按周六周日分别描写",
        "描述具体活动",
        "结尾表达感受"
      ],
      "words": [
        "busy",
        "weekend",
        "homework",
        "picnic",
        "visit",
        "tired"
      ],
      "q": [
        {
          "q": "What did the writer do on Saturday morning?",
          "o": [
            "Played games",
            "Did homework",
            "Visited grandma"
          ],
          "a": 1,
          "why": "文章说 I did my homework。"
        },
        {
          "q": "Who did the writer visit on Sunday?",
          "o": [
            "Friends",
            "Grandma",
            "Teacher"
          ],
          "a": 1,
          "why": "文章说 I visited my grandma。"
        },
        {
          "q": "How did the writer feel?",
          "o": [
            "Tired but happy",
            "Bored",
            "Sad"
          ],
          "a": 0,
          "why": "文章说 I was tired but happy。"
        }
      ]
    },
    {
      "id": "w7",
      "book": 1,
      "title": "My Favorite Animal",
      "cat": "状物",
      "body": "My favorite animal is the panda. Pandas are black and white. They live in China. They eat bamboo. Pandas are very cute and fat. They like sleeping and eating. There are not many pandas in the world. We should protect them. I love pandas very much.",
      "tips": [
        "开头点明最喜欢的动物",
        "描写外貌特征",
        "描述生活习性",
        "呼吁保护动物"
      ],
      "words": [
        "favorite",
        "panda",
        "bamboo",
        "cute",
        "protect",
        "world"
      ],
      "q": [
        {
          "q": "What color are pandas?",
          "o": [
            "Black and white",
            "Brown and white",
            "Black and yellow"
          ],
          "a": 0,
          "why": "文章说 Pandas are black and white。"
        },
        {
          "q": "What do pandas eat?",
          "o": [
            "Meat",
            "Bamboo",
            "Fish"
          ],
          "a": 1,
          "why": "文章说 They eat bamboo。"
        },
        {
          "q": "Where do pandas live?",
          "o": [
            "Africa",
            "China",
            "America"
          ],
          "a": 1,
          "why": "文章说 They live in China。"
        }
      ]
    },
    {
      "id": "w8",
      "book": 1,
      "title": "Four Seasons",
      "cat": "写景",
      "body": "There are four seasons in a year. Spring is warm. Trees turn green and flowers come out. Summer is hot. We can swim in the pool. Autumn is cool. Farmers are busy with harvest. Winter is cold. We can make snowmen. I like spring best because everything is beautiful.",
      "tips": [
        "开头总述四季",
        "每个季节选一个特点",
        "描述季节活动",
        "结尾点明最喜欢的季节"
      ],
      "words": [
        "season",
        "warm",
        "turn green",
        "harvest",
        "snowman",
        "everything"
      ],
      "q": [
        {
          "q": "What can we do in summer?",
          "o": [
            "Make snowmen",
            "Swim in the pool",
            "Pick apples"
          ],
          "a": 1,
          "why": "文章说 We can swim in the pool。"
        },
        {
          "q": "Which season does the writer like best?",
          "o": [
            "Spring",
            "Summer",
            "Autumn"
          ],
          "a": 0,
          "why": "文章说 I like spring best。"
        },
        {
          "q": "What happens in autumn?",
          "o": [
            "Trees turn green",
            "Farmers harvest",
            "We make snowmen"
          ],
          "a": 1,
          "why": "文章说 Farmers are busy with harvest。"
        }
      ]
    },
    {
      "id": "w9",
      "book": 1,
      "title": "My Hobby",
      "cat": "自我介绍",
      "body": "My hobby is reading books. I like reading story books and science books. I read books every day after finishing my homework. Books can tell me many interesting things. They can help me learn about the world. My favorite book is 'Journey to the West'. Reading makes me happy and wise.",
      "tips": [
        "开头点明爱好",
        "描述具体读什么书",
        "说明爱好的好处",
        "推荐一本最喜欢的书"
      ],
      "words": [
        "hobby",
        "reading",
        "finish",
        "interesting",
        "wise",
        "Journey to the West"
      ],
      "q": [
        {
          "q": "What is the writer's hobby?",
          "o": [
            "Reading books",
            "Playing football",
            "Drawing"
          ],
          "a": 0,
          "why": "文章说 My hobby is reading books。"
        },
        {
          "q": "When does the writer read books?",
          "o": [
            "Before school",
            "After homework",
            "In class"
          ],
          "a": 1,
          "why": "文章说 every day after finishing my homework。"
        },
        {
          "q": "What is the favorite book?",
          "o": [
            "Journey to the West",
            "Harry Potter",
            "Three Kingdoms"
          ],
          "a": 0,
          "why": "文章说 'Journey to the West'。"
        }
      ]
    },
    {
      "id": "w10",
      "book": 1,
      "title": "A Happy Day",
      "cat": "记事",
      "body": "Last Sunday was a happy day for me. My parents took me to the zoo. We saw many animals there. The monkeys were very funny. They jumped from tree to tree. The elephants were very big. We took many photos. At noon, we had lunch in a restaurant. We went home at five o'clock. It was a wonderful day.",
      "tips": [
        "开头点明是什么日子",
        "按时间顺序描写活动",
        "描述所见所闻",
        "结尾总结感受"
      ],
      "words": [
        "happy",
        "zoo",
        "monkey",
        "funny",
        "elephant",
        "wonderful"
      ],
      "q": [
        {
          "q": "Where did they go last Sunday?",
          "o": [
            "The park",
            "The zoo",
            "The museum"
          ],
          "a": 1,
          "why": "文章说 took me to the zoo。"
        },
        {
          "q": "Which animal was funny?",
          "o": [
            "Elephants",
            "Monkeys",
            "Pandas"
          ],
          "a": 1,
          "why": "文章说 The monkeys were very funny。"
        },
        {
          "q": "What time did they go home?",
          "o": [
            "4:00",
            "5:00",
            "6:00"
          ],
          "a": 1,
          "why": "文章说 went home at five o'clock。"
        }
      ]
    },
    {
      "id": "w11",
      "book": 1,
      "title": "My Teacher",
      "cat": "描写人物",
      "body": "My favorite teacher is Miss Wang. She is our English teacher. She is tall and beautiful. She has long hair and a kind smile. Miss Wang is very patient. She never gets angry with us. In her class, we play games and sing songs. She makes English easy and fun. We all love her very much.",
      "tips": [
        "开头点明最喜欢的老师",
        "描写外貌和性格",
        "描述课堂特色",
        "结尾表达喜爱"
      ],
      "words": [
        "favorite",
        "patient",
        "kind",
        "smile",
        "never get angry",
        "easy and fun"
      ],
      "q": [
        {
          "q": "What subject does Miss Wang teach?",
          "o": [
            "Chinese",
            "Math",
            "English"
          ],
          "a": 2,
          "why": "文章说 our English teacher。"
        },
        {
          "q": "What is Miss Wang like?",
          "o": [
            "Tall and beautiful",
            "Short and strict",
            "Tall and strict"
          ],
          "a": 0,
          "why": "文章说 She is tall and beautiful。"
        },
        {
          "q": "What do they do in class?",
          "o": [
            "Play games and sing songs",
            "Only read books",
            "Only write"
          ],
          "a": 0,
          "why": "文章说 we play games and sing songs。"
        }
      ]
    },
    {
      "id": "w12",
      "book": 1,
      "title": "My Bedroom",
      "cat": "写景",
      "body": "I have a small but nice bedroom. There is a bed near the window. On the bed, there is a blue quilt. Next to the bed, there is a desk. I put my books and lamp on it. There is a bookshelf behind the door. It is full of story books. My bedroom is clean and tidy. I like it very much.",
      "tips": [
        "开头总体描述",
        "用 There is/are 句型描写物品位置",
        "描述物品细节",
        "结尾表达喜爱"
      ],
      "words": [
        "nice",
        "bedroom",
        "quilt",
        "desk",
        "lamp",
        "bookshelf",
        "tidy"
      ],
      "q": [
        {
          "q": "Where is the bed?",
          "o": [
            "Near the door",
            "Near the window",
            "Next to the desk"
          ],
          "a": 1,
          "why": "文章说 a bed near the window。"
        },
        {
          "q": "What is on the desk?",
          "o": [
            "Books and lamp",
            "A computer",
            "A clock"
          ],
          "a": 0,
          "why": "文章说 my books and lamp on it。"
        },
        {
          "q": "Where is the bookshelf?",
          "o": [
            "Behind the door",
            "Next to the bed",
            "Near the window"
          ],
          "a": 0,
          "why": "文章说 behind the door。"
        }
      ]
    },
    {
      "id": "w13",
      "book": 1,
      "title": "My Favorite Food",
      "cat": "状物",
      "body": "My favorite food is dumplings. Dumplings are traditional Chinese food. My mother makes dumplings for us every weekend. She puts meat and vegetables inside. I help her make dumplings. They are very delicious. I can eat twenty dumplings at a time. Dumplings are my favorite. I love them!",
      "tips": [
        "开头点明最喜欢的食物",
        "介绍食物特色",
        "描述制作过程",
        "结尾表达喜爱"
      ],
      "words": [
        "dumpling",
        "traditional",
        "vegetable",
        "delicious",
        "at a time"
      ],
      "q": [
        {
          "q": "What is the writer's favorite food?",
          "o": [
            "Noodles",
            "Dumplings",
            "Rice"
          ],
          "a": 1,
          "why": "文章说 My favorite food is dumplings。"
        },
        {
          "q": "When does mother make dumplings?",
          "o": [
            "Every day",
            "Every weekend",
            "Every month"
          ],
          "a": 1,
          "why": "文章说 every weekend。"
        },
        {
          "q": "How many dumplings can the writer eat?",
          "o": [
            "Ten",
            "Fifteen",
            "Twenty"
          ],
          "a": 2,
          "why": "文章说 eat twenty dumplings。"
        }
      ]
    },
    {
      "id": "w14",
      "book": 1,
      "title": "A Trip to Beijing",
      "cat": "记事",
      "body": "Last summer, I went to Beijing with my family. We went there by train. First, we visited the Great Wall. It was very long and great. Then, we went to Tian'anmen Square. It was big and beautiful. We took many photos. We also ate Beijing roast duck. It was delicious. We had a great time in Beijing.",
      "tips": [
        "开头说明时间地点人物",
        "用 first, then 描述行程",
        "描述所见所吃",
        "结尾总结感受"
      ],
      "words": [
        "trip",
        "by train",
        "Great Wall",
        "Square",
        "roast duck",
        "great time"
      ],
      "q": [
        {
          "q": "How did they go to Beijing?",
          "o": [
            "By plane",
            "By train",
            "By bus"
          ],
          "a": 1,
          "why": "文章说 went there by train。"
        },
        {
          "q": "What did they visit first?",
          "o": [
            "Tian'anmen Square",
            "The Great Wall",
            "The zoo"
          ],
          "a": 1,
          "why": "文章说 First, we visited the Great Wall。"
        },
        {
          "q": "What did they eat?",
          "o": [
            "Beijing roast duck",
            "Dumplings",
            "Noodles"
          ],
          "a": 0,
          "why": "文章说 ate Beijing roast duck。"
        }
      ]
    },
    {
      "id": "w15",
      "book": 1,
      "title": "My Pet",
      "cat": "状物",
      "body": "I have a pet cat. Her name is Mimi. She is white and small. She has two big eyes and a long tail. Mimi likes eating fish. She also likes playing with a ball. Every morning, she sits on my bed and wakes me up. Mimi is very cute. She is my good friend. I love her very much.",
      "tips": [
        "开头介绍宠物名字",
        "描写外貌特征",
        "描述生活习性",
        "结尾表达感情"
      ],
      "words": [
        "pet",
        "tail",
        "fish",
        "ball",
        "wake up",
        "cute"
      ],
      "q": [
        {
          "q": "What is the cat's name?",
          "o": [
            "Kitty",
            "Mimi",
            "Tom"
          ],
          "a": 1,
          "why": "文章说 Her name is Mimi。"
        },
        {
          "q": "What color is Mimi?",
          "o": [
            "Black",
            "White",
            "Brown"
          ],
          "a": 1,
          "why": "文章说 She is white and small。"
        },
        {
          "q": "What does Mimi like eating?",
          "o": [
            "Meat",
            "Fish",
            "Bread"
          ],
          "a": 1,
          "why": "文章说 likes eating fish。"
        }
      ]
    },
    {
      "id": "w16",
      "book": 1,
      "title": "I Love Spring",
      "cat": "写景",
      "body": "There are four seasons in a year. My favorite season is spring. In spring, the weather gets warm. Trees turn green. Flowers begin to open. Birds sing in the trees. I can fly kites with my friends in the park. Spring is a beautiful season. It brings hope and life. I love spring!",
      "tips": [
        "开头点明最喜欢的季节",
        "描述季节特点",
        "描述季节活动",
        "结尾升华主题"
      ],
      "words": [
        "season",
        "get warm",
        "turn green",
        "fly kites",
        "hope",
        "life"
      ],
      "q": [
        {
          "q": "What is the writer's favorite season?",
          "o": [
            "Summer",
            "Autumn",
            "Spring"
          ],
          "a": 2,
          "why": "文章说 My favorite season is spring。"
        },
        {
          "q": "What can the writer do in spring?",
          "o": [
            "Swim",
            "Fly kites",
            "Make snowmen"
          ],
          "a": 1,
          "why": "文章说 I can fly kites。"
        },
        {
          "q": "What happens to trees in spring?",
          "o": [
            "Turn green",
            "Lose leaves",
            "Turn yellow"
          ],
          "a": 0,
          "why": "文章说 Trees turn green。"
        }
      ]
    },
    {
      "id": "w17",
      "book": 1,
      "title": "My Dream",
      "cat": "自我介绍",
      "body": "Everyone has a dream. My dream is to be a doctor. Doctors help sick people. They work in hospitals. They wear white coats. I want to help people feel better. To be a doctor, I must study hard now. I will go to medical school. I believe my dream will come true one day.",
      "tips": [
        "开头引出梦想话题",
        "描述职业特点",
        "说明为什么有这个梦想",
        "结尾表达决心"
      ],
      "words": [
        "dream",
        "doctor",
        "sick",
        "hospital",
        "coat",
        "come true"
      ],
      "q": [
        {
          "q": "What is the writer's dream?",
          "o": [
            "To be a teacher",
            "To be a doctor",
            "To be a pilot"
          ],
          "a": 1,
          "why": "文章说 My dream is to be a doctor。"
        },
        {
          "q": "Where do doctors work?",
          "o": [
            "Schools",
            "Hospitals",
            "Shops"
          ],
          "a": 1,
          "why": "文章说 They work in hospitals。"
        },
        {
          "q": "What must the writer do?",
          "o": [
            "Study hard",
            "Play sports",
            "Read books"
          ],
          "a": 0,
          "why": "文章说 I must study hard now。"
        }
      ]
    },
    {
      "id": "w18",
      "book": 1,
      "title": "A Birthday Party",
      "cat": "记事",
      "body": "Yesterday was my birthday. I had a party at home. Many friends came to my party. My mother made a big birthday cake. There were ten candles on it. My friends sang 'Happy Birthday' to me. I made a wish and blew out the candles. We ate cake and played games. I got many presents. It was a wonderful day!",
      "tips": [
        "开头说明事件",
        "描述派对过程",
        "描写细节（蛋糕/蜡烛/许愿）",
        "结尾总结感受"
      ],
      "words": [
        "birthday",
        "party",
        "candle",
        "make a wish",
        "blow out",
        "present"
      ],
      "q": [
        {
          "q": "How many candles were on the cake?",
          "o": [
            "Eight",
            "Nine",
            "Ten"
          ],
          "a": 2,
          "why": "文章说 ten candles on it。"
        },
        {
          "q": "What did the writer do before blowing out candles?",
          "o": [
            "Ate cake",
            "Made a wish",
            "Opened presents"
          ],
          "a": 1,
          "why": "文章说 I made a wish and blew out the candles。"
        },
        {
          "q": "How was the day?",
          "o": [
            "Boring",
            "Wonderful",
            "Tiring"
          ],
          "a": 1,
          "why": "文章说 It was a wonderful day!"
        }
      ]
    },
    {
      "id": "w19",
      "book": 1,
      "title": "My Mother",
      "cat": "描写人物",
      "body": "My mother is the most important person in my life. She is a nurse. She works in a hospital. She is tall and has short hair. My mother is very kind and hardworking. She gets up early every morning to make breakfast for me. She helps me with my homework. She always encourages me. I love my mother forever.",
      "tips": [
        "开头表达母亲的重要性",
        "介绍职业和外貌",
        "描述性格和付出",
        "结尾表达感恩"
      ],
      "words": [
        "important",
        "nurse",
        "kind",
        "hardworking",
        "encourage",
        "forever"
      ],
      "q": [
        {
          "q": "What does mother do?",
          "o": [
            "Teacher",
            "Nurse",
            "Doctor"
          ],
          "a": 1,
          "why": "文章说 She is a nurse。"
        },
        {
          "q": "What does mother do every morning?",
          "o": [
            "Makes breakfast",
            "Goes to work",
            "Reads books"
          ],
          "a": 0,
          "why": "文章说 gets up early every morning to make breakfast。"
        },
        {
          "q": "How is the mother?",
          "o": [
            "Kind and hardworking",
            "Strict and serious",
            "Quiet and shy"
          ],
          "a": 0,
          "why": "文章说 very kind and hardworking。"
        }
      ]
    },
    {
      "id": "w20",
      "book": 1,
      "title": "Water",
      "cat": "状物",
      "body": "Water is very important to us. We drink water every day. We also use water to wash things and cook food. Plants and animals need water too. Without water, there would be no life on earth. But clean water is getting less and less. We should save water. Don't waste it. Let's protect our water resources together.",
      "tips": [
        "开头说明水的重要性",
        "列举水的用途",
        "指出水资源问题",
        "呼吁节约用水"
      ],
      "words": [
        "important",
        "without",
        "life",
        "earth",
        "save",
        "waste",
        "resource"
      ],
      "q": [
        {
          "q": "What do we use water for?",
          "o": [
            "Only drinking",
            "Drinking, washing, cooking",
            "Only washing"
          ],
          "a": 1,
          "why": "文章说 drink water, use water to wash and cook。"
        },
        {
          "q": "What should we do?",
          "o": [
            "Save water",
            "Use more water",
            "Drink less water"
          ],
          "a": 0,
          "why": "文章说 We should save water。"
        },
        {
          "q": "What would happen without water?",
          "o": [
            "No problem",
            "No life on earth",
            "More food"
          ],
          "a": 1,
          "why": "文章说 there would be no life on earth。"
        }
      ]
    },
    {
      "id": "w21",
      "book": 1,
      "title": "My School Life",
      "cat": "记事",
      "body": "I am a student in Grade Four. I go to school from Monday to Friday. We have many subjects: Chinese, math, English, art, music and PE. My favorite subject is English. We have a big playground. After class, I play with my friends there. Our teachers are very kind. I learn a lot at school. I enjoy my school life.",
      "tips": [
        "开头介绍基本情况",
        "列举科目",
        "描述课间活动",
        "结尾总结感受"
      ],
      "words": [
        "subject",
        "Chinese",
        "math",
        "art",
        "music",
        "PE",
        "enjoy"
      ],
      "q": [
        {
          "q": "How many days does the writer go to school?",
          "o": [
            "Five days",
            "Six days",
            "Seven days"
          ],
          "a": 0,
          "why": "文章说 from Monday to Friday。"
        },
        {
          "q": "What is the favorite subject?",
          "o": [
            "Chinese",
            "Math",
            "English"
          ],
          "a": 2,
          "why": "文章说 My favorite subject is English。"
        },
        {
          "q": "Where does the writer play after class?",
          "o": [
            "In the classroom",
            "On the playground",
            "In the library"
          ],
          "a": 1,
          "why": "文章说 I play with my friends there (playground)。"
        }
      ]
    },
    {
      "id": "w22",
      "book": 1,
      "title": "A Rainy Day",
      "cat": "记事",
      "body": "It rained all day yesterday. I couldn't go out to play. I stayed at home and did many things. In the morning, I finished my homework. In the afternoon, I read a story book. Then I drew a picture of my family. My mother made hot soup for dinner. We sat together and watched TV. It was a cozy day at home.",
      "tips": [
        "开头说明天气情况",
        "按时间顺序描写室内活动",
        "描述家庭温馨场景",
        "结尾总结感受"
      ],
      "words": [
        "rain",
        "stay at home",
        "finish",
        "draw",
        "hot soup",
        "cozy"
      ],
      "q": [
        {
          "q": "Why couldn't the writer go out?",
          "o": [
            "It was hot",
            "It rained",
            "It was cold"
          ],
          "a": 1,
          "why": "文章说 It rained all day yesterday。"
        },
        {
          "q": "What did the writer do in the afternoon?",
          "o": [
            "Read a book and drew",
            "Played games",
            "Watched TV"
          ],
          "a": 0,
          "why": "文章说 I read a story book. Then I drew a picture。"
        },
        {
          "q": "How was the day?",
          "o": [
            "Boring",
            "Cozy",
            "Sad"
          ],
          "a": 1,
          "why": "文章说 It was a cozy day。"
        }
      ]
    },
    {
      "id": "w23",
      "book": 1,
      "title": "My Favorite Season",
      "cat": "自我介绍",
      "body": "My favorite season is autumn. In autumn, the weather is cool and comfortable. The leaves turn yellow and red. They fall from the trees. Farmers are busy picking apples and oranges. I like walking in the park with my parents. The fallen leaves are like a golden carpet. Autumn is beautiful and harvest time.",
      "tips": [
        "开头点明最喜欢的季节",
        "描述气候特点",
        "描述景色和活动",
        "结尾总结"
      ],
      "words": [
        "autumn",
        "comfortable",
        "leaf",
        "fall",
        "harvest",
        "carpet"
      ],
      "q": [
        {
          "q": "What is the writer's favorite season?",
          "o": [
            "Spring",
            "Summer",
            "Autumn"
          ],
          "a": 2,
          "why": "文章说 My favorite season is autumn。"
        },
        {
          "q": "What happens to leaves in autumn?",
          "o": [
            "Turn green",
            "Turn yellow and red",
            "Stay green"
          ],
          "a": 1,
          "why": "文章说 The leaves turn yellow and red。"
        },
        {
          "q": "What are farmers busy doing?",
          "o": [
            "Planting trees",
            "Picking apples",
            "Making snowmen"
          ],
          "a": 1,
          "why": "文章说 picking apples and oranges。"
        }
      ]
    },
    {
      "id": "w24",
      "book": 1,
      "title": "How to Keep Healthy",
      "cat": "自我介绍",
      "body": "Health is very important. To keep healthy, we should do three things. First, eat good food. Eat more vegetables and fruit. Don't eat too much junk food. Second, do exercise every day. We can run, swim or play sports. Third, sleep well. Go to bed early and get up early. If we do these, we will be healthy and happy.",
      "tips": [
        "开头引出健康话题",
        "用 first, second, third 分点说明",
        "每点给出具体建议",
        "结尾总结"
      ],
      "words": [
        "healthy",
        "junk food",
        "exercise",
        "sleep",
        "early"
      ],
      "q": [
        {
          "q": "What should we eat more?",
          "o": [
            "Junk food",
            "Vegetables and fruit",
            "Meat"
          ],
          "a": 1,
          "why": "文章说 Eat more vegetables and fruit。"
        },
        {
          "q": "What should we do every day?",
          "o": [
            "Exercise",
            "Watch TV",
            "Play games"
          ],
          "a": 0,
          "why": "文章说 do exercise every day。"
        },
        {
          "q": "What should we do about sleep?",
          "o": [
            "Stay up late",
            "Go to bed early",
            "Sleep all day"
          ],
          "a": 1,
          "why": "文章说 Go to bed early and get up early。"
        }
      ]
    },
    {
      "id": "w25",
      "book": 1,
      "title": "My Hometown",
      "cat": "写景",
      "body": "My hometown is a small village. It is in the south of China. There are green hills and clean rivers. The air is fresh. People in my hometown are friendly. They grow rice and vegetables. In spring, the fields are full of flowers. I love my hometown. It is a beautiful and peaceful place.",
      "tips": [
        "开头介绍家乡位置",
        "描述自然环境",
        "描述人文特色",
        "结尾表达感情"
      ],
      "words": [
        "hometown",
        "village",
        "south",
        "hill",
        "fresh",
        "peaceful"
      ],
      "q": [
        {
          "q": "Where is the hometown?",
          "o": [
            "North of China",
            "South of China",
            "East of China"
          ],
          "a": 1,
          "why": "文章说 in the south of China。"
        },
        {
          "q": "What do people grow?",
          "o": [
            "Rice and vegetables",
            "Corn and wheat",
            "Fruits only"
          ],
          "a": 0,
          "why": "文章说 grow rice and vegetables。"
        },
        {
          "q": "How is the air?",
          "o": [
            "Dirty",
            "Fresh",
            "Dry"
          ],
          "a": 1,
          "why": "文章说 The air is fresh。"
        }
      ]
    },
    {
      "id": "w26",
      "book": 2,
      "title": "My Father",
      "cat": "人物描写",
      "body": "My father is a tall man. He is a police officer. He wears a blue uniform. He is very brave and strong. He helps people every day. Sometimes he works at night. He is strict but kind to me. On weekends, he plays chess with me. I am proud of my father.",
      "tips": [
        "描写外貌和职业",
        "描述性格特点",
        "描述与我的互动",
        "结尾表达感情"
      ],
      "words": [
        "police officer",
        "uniform",
        "brave",
        "strict",
        "proud"
      ],
      "q": [
        {
          "q": "What does father do?",
          "o": [
            "Teacher",
            "Police officer",
            "Doctor"
          ],
          "a": 1,
          "why": "文章说 He is a police officer。"
        },
        {
          "q": "What does father do on weekends?",
          "o": [
            "Plays chess",
            "Plays football",
            "Reads books"
          ],
          "a": 0,
          "why": "文章说 he plays chess with me。"
        },
        {
          "q": "How does the writer feel about father?",
          "o": [
            "Proud",
            "Afraid",
            "Sad"
          ],
          "a": 0,
          "why": "文章说 I am proud of my father。"
        }
      ]
    },
    {
      "id": "w27",
      "book": 2,
      "title": "My Classmate",
      "cat": "人物描写",
      "body": "My classmate Jack is a funny boy. He sits next to me. He has curly hair and wears glasses. Jack is good at telling jokes. He often makes us laugh. But he is also smart. He gets good grades in math. We help each other with homework. We are good friends.",
      "tips": [
        "介绍同学基本信息",
        "描写外貌特征",
        "描述性格和优点",
        "结尾点明关系"
      ],
      "words": [
        "classmate",
        "funny",
        "curly",
        "glasses",
        "joke",
        "smart"
      ],
      "q": [
        {
          "q": "What does Jack look like?",
          "o": [
            "Straight hair",
            "Curly hair and glasses",
            "Long hair"
          ],
          "a": 1,
          "why": "文章说 curly hair and wears glasses。"
        },
        {
          "q": "What is Jack good at?",
          "o": [
            "Telling jokes",
            "Singing",
            "Drawing"
          ],
          "a": 0,
          "why": "文章说 good at telling jokes。"
        },
        {
          "q": "What subject is Jack smart in?",
          "o": [
            "English",
            "Math",
            "Chinese"
          ],
          "a": 1,
          "why": "文章说 good grades in math。"
        }
      ]
    },
    {
      "id": "w28",
      "book": 2,
      "title": "My Grandmother",
      "cat": "人物描写",
      "body": "My grandmother is seventy years old. She has white hair and a kind face. She lives with us. She is very gentle. She tells me stories before bed. She also teaches me to cook. Her food is the best. I love sitting with her. She always says, 'Be a good child.' I love my grandma.",
      "tips": [
        "介绍年龄和外貌",
        "描述性格和日常",
        "描述与我的互动",
        "结尾表达感情"
      ],
      "words": [
        "grandmother",
        "seventy",
        "gentle",
        "cook",
        "good child"
      ],
      "q": [
        {
          "q": "How old is grandmother?",
          "o": [
            "Sixty",
            "Seventy",
            "Eighty"
          ],
          "a": 1,
          "why": "文章说 seventy years old。"
        },
        {
          "q": "What does grandmother do before bed?",
          "o": [
            "Tells stories",
            "Sings songs",
            "Reads books"
          ],
          "a": 0,
          "why": "文章说 tells me stories before bed。"
        },
        {
          "q": "What does grandmother teach?",
          "o": [
            "To cook",
            "To draw",
            "To swim"
          ],
          "a": 0,
          "why": "文章说 teaches me to cook。"
        }
      ]
    },
    {
      "id": "w29",
      "book": 2,
      "title": "A Good Person",
      "cat": "人物描写",
      "body": "Mr. Li is a good person in our neighborhood. He is old but helpful. Every morning, he cleans the street. He helps children cross the road. He also waters plants for everyone. Mr. Li never asks for anything. He says helping others makes him happy. We all respect him.",
      "tips": [
        "介绍人物身份",
        "列举好事",
        "描述人物品质",
        "结尾表达敬意"
      ],
      "words": [
        "neighborhood",
        "helpful",
        "cross",
        "water",
        "respect"
      ],
      "q": [
        {
          "q": "What does Mr. Li do every morning?",
          "o": [
            "Cleans the street",
            "Reads books",
            "Exercises"
          ],
          "a": 0,
          "why": "文章说 he cleans the street。"
        },
        {
          "q": "What does Mr. Li say?",
          "o": [
            "Helping others makes him happy",
            "I am tired",
            "Give me money"
          ],
          "a": 0,
          "why": "文章说 helping others makes him happy。"
        },
        {
          "q": "How do people feel about Mr. Li?",
          "o": [
            "Respect him",
            "Don't like him",
            "Don't know him"
          ],
          "a": 0,
          "why": "文章说 We all respect him。"
        }
      ]
    },
    {
      "id": "w30",
      "book": 2,
      "title": "My Pen Pal",
      "cat": "人物描写",
      "body": "I have a pen pal in America. Her name is Sarah. She is eleven years old. We write letters to each other every month. Sarah tells me about her school and life in America. I tell her about China. We learn about each other's culture. Though we haven't met, we are good friends. I hope to meet her one day.",
      "tips": [
        "介绍笔友基本信息",
        "描述交流方式",
        "描述交流内容",
        "结尾表达愿望"
      ],
      "words": [
        "pen pal",
        "America",
        "letter",
        "culture",
        "meet"
      ],
      "q": [
        {
          "q": "Where does Sarah live?",
          "o": [
            "England",
            "America",
            "Australia"
          ],
          "a": 1,
          "why": "文章说 a pen pal in America。"
        },
        {
          "q": "How often do they write?",
          "o": [
            "Every week",
            "Every month",
            "Every year"
          ],
          "a": 1,
          "why": "文章说 every month。"
        },
        {
          "q": "What do they talk about?",
          "o": [
            "Only school",
            "School and life",
            "Only weather"
          ],
          "a": 1,
          "why": "文章说 her school and life in America。"
        }
      ]
    },
    {
      "id": "w31",
      "book": 2,
      "title": "An Interesting Lesson",
      "cat": "记事",
      "body": "Today we had an interesting English lesson. Miss Li brought a big box to class. Inside the box, there were many fruits. She taught us fruit names in English. We touched and smelled each fruit. Then we played a guessing game. I guessed three fruits right. It was the best lesson ever!",
      "tips": [
        "开头说明事件",
        "描述课堂过程",
        "描述互动环节",
        "结尾表达感受"
      ],
      "words": [
        "interesting",
        "lesson",
        "box",
        "fruit",
        "guess",
        "touch"
      ],
      "q": [
        {
          "q": "What did Miss Li bring?",
          "o": [
            "A book",
            "A big box",
            "A picture"
          ],
          "a": 1,
          "why": "文章说 a big box to class。"
        },
        {
          "q": "What was in the box?",
          "o": [
            "Books",
            "Fruits",
            "Toys"
          ],
          "a": 1,
          "why": "文章说 there were many fruits。"
        },
        {
          "q": "How many fruits did the writer guess right?",
          "o": [
            "Two",
            "Three",
            "Four"
          ],
          "a": 1,
          "why": "文章说 guessed three fruits right。"
        }
      ]
    },
    {
      "id": "w32",
      "book": 2,
      "title": "A Football Match",
      "cat": "记事",
      "body": "We had a football match yesterday. Our class played against Class Five. The match started at three o'clock. Everyone was excited. I was the goalkeeper. In the first half, they scored one goal. In the second half, we scored two goals. We won the match! Our classmates cheered loudly. It was an exciting game.",
      "tips": [
        "说明比赛时间对手",
        "描述比赛过程",
        "描述比分变化",
        "结尾表达感受"
      ],
      "words": [
        "match",
        "against",
        "goalkeeper",
        "goal",
        "score",
        "cheer"
      ],
      "q": [
        {
          "q": "Who did they play against?",
          "o": [
            "Class Three",
            "Class Five",
            "Class Six"
          ],
          "a": 1,
          "why": "文章说 against Class Five。"
        },
        {
          "q": "What was the writer's role?",
          "o": [
            "Goalkeeper",
            "Forward",
            "Defender"
          ],
          "a": 0,
          "why": "文章说 I was the goalkeeper。"
        },
        {
          "q": "What was the final result?",
          "o": [
            "They lost",
            "They won",
            "Tied"
          ],
          "a": 1,
          "why": "文章说 We won the match!"
        }
      ]
    },
    {
      "id": "w33",
      "book": 2,
      "title": "Shopping with Mom",
      "cat": "记事",
      "body": "I went shopping with mom this morning. We went to the supermarket. We bought many things. We got milk, bread, eggs, and some fruit. Mom also bought me a new school bag. It is blue and has many pockets. I love it very much. We came home at eleven. I helped mom carry the bags.",
      "tips": [
        "说明时间地点",
        "列举购买物品",
        "描述特别收获",
        "结尾描述回家"
      ],
      "words": [
        "shopping",
        "supermarket",
        "pocket",
        "carry",
        "bag"
      ],
      "q": [
        {
          "q": "Where did they go?",
          "o": [
            "The park",
            "The supermarket",
            "The zoo"
          ],
          "a": 1,
          "why": "文章说 went to the supermarket。"
        },
        {
          "q": "What did mom buy for the writer?",
          "o": [
            "A book",
            "A school bag",
            "A toy"
          ],
          "a": 1,
          "why": "文章说 a new school bag。"
        },
        {
          "q": "What color is the bag?",
          "o": [
            "Red",
            "Blue",
            "Green"
          ],
          "a": 1,
          "why": "文章说 It is blue。"
        }
      ]
    },
    {
      "id": "w34",
      "book": 2,
      "title": "A Visit to the Farm",
      "cat": "记事",
      "body": "Last weekend, our class visited a farm. The farm was big. There were many animals. We saw cows, sheep, and chickens. The farmer let us feed the animals. I fed a little sheep. It was so soft. We also picked apples from the trees. The apples were red and sweet. We learned a lot about farm life.",
      "tips": [
        "说明时间地点",
        "描述所见动物",
        "描述体验活动",
        "结尾总结收获"
      ],
      "words": [
        "visit",
        "farm",
        "feed",
        "sheep",
        "pick",
        "sweet"
      ],
      "q": [
        {
          "q": "What animals did they see?",
          "o": [
            "Cows, sheep, chickens",
            "Dogs and cats",
            "Pandas"
          ],
          "a": 0,
          "why": "文章说 cows, sheep, and chickens。"
        },
        {
          "q": "What did the writer feed?",
          "o": [
            "A cow",
            "A little sheep",
            "A chicken"
          ],
          "a": 1,
          "why": "文章说 I fed a little sheep。"
        },
        {
          "q": "What did they pick?",
          "o": [
            "Oranges",
            "Apples",
            "Pears"
          ],
          "a": 1,
          "why": "文章说 picked apples。"
        }
      ]
    },
    {
      "id": "w35",
      "book": 2,
      "title": "My First Day at School",
      "cat": "记事",
      "body": "I remember my first day at school. I was seven years old. I was nervous and excited. Mom took me to the classroom. The teacher was very kind. She smiled at everyone. There were many new faces. I made a friend named Tom. We played together at break time. By the end of the day, I loved school.",
      "tips": [
        "说明事件背景",
        "描述心理感受",
        "描述认识新朋友",
        "结尾表达感受变化"
      ],
      "words": [
        "first day",
        "nervous",
        "excited",
        "smile",
        "break time"
      ],
      "q": [
        {
          "q": "How old was the writer?",
          "o": [
            "Six",
            "Seven",
            "Eight"
          ],
          "a": 1,
          "why": "文章说 I was seven years old。"
        },
        {
          "q": "How did the writer feel?",
          "o": [
            "Nervous and excited",
            "Sad and scared",
            "Happy only"
          ],
          "a": 0,
          "why": "文章说 nervous and excited。"
        },
        {
          "q": "Who did the writer make friends with?",
          "o": [
            "Jack",
            "Tom",
            "Sam"
          ],
          "a": 1,
          "why": "文章说 a friend named Tom。"
        }
      ]
    },
    {
      "id": "w36",
      "book": 2,
      "title": "Our Classroom",
      "cat": "写景",
      "body": "Our classroom is on the second floor. It is big and bright. There are twenty desks and chairs. The teacher's desk is in the front. There is a blackboard on the wall. We have a computer and a TV. There are many pictures on the back wall. Our classroom is clean and tidy. We love our classroom.",
      "tips": [
        "说明位置",
        "用 There is/are 描写",
        "描述设备装饰",
        "结尾表达感情"
      ],
      "words": [
        "floor",
        "bright",
        "blackboard",
        "computer",
        "tidy"
      ],
      "q": [
        {
          "q": "Where is the classroom?",
          "o": [
            "First floor",
            "Second floor",
            "Third floor"
          ],
          "a": 1,
          "why": "文章说 on the second floor。"
        },
        {
          "q": "How many desks are there?",
          "o": [
            "Twenty",
            "Thirty",
            "Forty"
          ],
          "a": 0,
          "why": "文章说 twenty desks。"
        },
        {
          "q": "What is on the back wall?",
          "o": [
            "Maps",
            "Pictures",
            "Clocks"
          ],
          "a": 1,
          "why": "文章说 many pictures on the back wall。"
        }
      ]
    },
    {
      "id": "w37",
      "book": 2,
      "title": "A Beautiful Park",
      "cat": "写景",
      "body": "There is a beautiful park near my home. It has a big lake. There are fish in the lake. People often boat on the lake. There are many trees and flowers. In spring, flowers are everywhere. There is a small bridge over the lake. Children play on the grass. The park is a good place to relax.",
      "tips": [
        "说明位置",
        "描写主要景观",
        "描述人们活动",
        "结尾总结"
      ],
      "words": [
        "lake",
        "fish",
        "boat",
        "bridge",
        "grass",
        "relax"
      ],
      "q": [
        {
          "q": "What is in the park?",
          "o": [
            "A big lake",
            "A mountain",
            "A zoo"
          ],
          "a": 0,
          "why": "文章说 a big lake。"
        },
        {
          "q": "What do people do on the lake?",
          "o": [
            "Swim",
            "Boat",
            "Fish"
          ],
          "a": 1,
          "why": "文章说 People often boat on the lake。"
        },
        {
          "q": "When are flowers everywhere?",
          "o": [
            "Summer",
            "Spring",
            "Winter"
          ],
          "a": 1,
          "why": "文章说 In spring, flowers are everywhere。"
        }
      ]
    },
    {
      "id": "w38",
      "book": 2,
      "title": "The Sky",
      "cat": "写景",
      "body": "I like looking at the sky. In the morning, the sky is blue and clear. The sun shines brightly. In the evening, the sky turns orange and red. It is very beautiful. At night, the sky is dark. I can see many stars. Sometimes I can see the moon. The sky is like a big painting. It changes all the time.",
      "tips": [
        "开头表达喜好",
        "分时段描写",
        "描述不同景色",
        "结尾总结特点"
      ],
      "words": [
        "sky",
        "clear",
        "shine",
        "orange",
        "star",
        "painting"
      ],
      "q": [
        {
          "q": "How is the sky in the morning?",
          "o": [
            "Blue and clear",
            "Dark",
            "Orange"
          ],
          "a": 0,
          "why": "文章说 blue and clear。"
        },
        {
          "q": "What can you see at night?",
          "o": [
            "Clouds",
            "Stars and moon",
            "The sun"
          ],
          "a": 1,
          "why": "文章说 I can see many stars. Sometimes the moon。"
        },
        {
          "q": "What is the sky like?",
          "o": [
            "A big painting",
            "A book",
            "A mirror"
          ],
          "a": 0,
          "why": "文章说 like a big painting。"
        }
      ]
    },
    {
      "id": "w39",
      "book": 2,
      "title": "My Hometown in Spring",
      "cat": "写景",
      "body": "My hometown is beautiful in spring. The weather gets warm. Trees turn green. Flowers come out in the gardens. Birds build nests in the trees. Farmers begin to work in the fields. Children fly kites on the hills. The river flows quietly. Everything comes back to life. I love spring in my hometown.",
      "tips": [
        "开头总体描述",
        "描写自然变化",
        "描写人们活动",
        "结尾表达感情"
      ],
      "words": [
        "hometown",
        "nest",
        "field",
        "kite",
        "flow",
        "come back to life"
      ],
      "q": [
        {
          "q": "What do trees do in spring?",
          "o": [
            "Turn green",
            "Lose leaves",
            "Turn yellow"
          ],
          "a": 0,
          "why": "文章说 Trees turn green。"
        },
        {
          "q": "What do children do on the hills?",
          "o": [
            "Play football",
            "Fly kites",
            "Read books"
          ],
          "a": 1,
          "why": "文章说 Children fly kites on the hills。"
        },
        {
          "q": "What happens to everything?",
          "o": [
            "Goes to sleep",
            "Comes back to life",
            "Disappears"
          ],
          "a": 1,
          "why": "文章说 Everything comes back to life。"
        }
      ]
    },
    {
      "id": "w40",
      "book": 2,
      "title": "The Library",
      "cat": "写景",
      "body": "Our school library is very nice. It is on the third floor. There are many bookshelves. They are full of books. There are story books, science books, and picture books. The library is quiet. Students read books there. There are big tables and soft chairs. The librarian is very kind. I love reading in the library.",
      "tips": [
        "说明位置",
        "描写藏书",
        "描述环境氛围",
        "结尾表达感受"
      ],
      "words": [
        "library",
        "bookshelf",
        "quiet",
        "soft",
        "librarian"
      ],
      "q": [
        {
          "q": "Where is the library?",
          "o": [
            "Second floor",
            "Third floor",
            "First floor"
          ],
          "a": 1,
          "why": "文章说 on the third floor。"
        },
        {
          "q": "How is the library?",
          "o": [
            "Noisy",
            "Quiet",
            "Dirty"
          ],
          "a": 1,
          "why": "文章说 The library is quiet。"
        },
        {
          "q": "What are on the bookshelves?",
          "o": [
            "Toys",
            "Books",
            "Pictures"
          ],
          "a": 1,
          "why": "文章说 They are full of books。"
        }
      ]
    },
    {
      "id": "w41",
      "book": 2,
      "title": "My Bike",
      "cat": "状物",
      "body": "I have a new bike. It is a birthday present from my father. My bike is red and black. It has two wheels and a bell. The seat is comfortable. I ride my bike to school every day. It takes me ten minutes. On weekends, I ride it in the park with friends. My bike is my good friend.",
      "tips": [
        "介绍物品来源",
        "描写外观特征",
        "描述使用场景",
        "结尾表达感情"
      ],
      "words": [
        "bike",
        "present",
        "wheel",
        "bell",
        "seat",
        "ride"
      ],
      "q": [
        {
          "q": "Who gave the bike?",
          "o": [
            "Mother",
            "Father",
            "Grandma"
          ],
          "a": 1,
          "why": "文章说 a birthday present from my father。"
        },
        {
          "q": "What color is the bike?",
          "o": [
            "Red and black",
            "Blue and white",
            "Green"
          ],
          "a": 0,
          "why": "文章说 red and black。"
        },
        {
          "q": "How long does it take to school?",
          "o": [
            "Five minutes",
            "Ten minutes",
            "Fifteen minutes"
          ],
          "a": 1,
          "why": "文章说 ten minutes。"
        }
      ]
    },
    {
      "id": "w42",
      "book": 2,
      "title": "My Favorite Toy",
      "cat": "状物",
      "body": "My favorite toy is a teddy bear. I got it when I was three. Its name is Brownie. It is brown and soft. It has two small eyes and a big nose. I sleep with Brownie every night. When I am sad, I hug it. Brownie is my best friend. I have had it for seven years. I will keep it forever.",
      "tips": [
        "介绍玩具来源",
        "描写外观",
        "描述与玩具的互动",
        "结尾表达感情"
      ],
      "words": [
        "teddy bear",
        "soft",
        "hug",
        "keep",
        "forever"
      ],
      "q": [
        {
          "q": "What is the toy's name?",
          "o": [
            "Brownie",
            "Teddy",
            "Bear"
          ],
          "a": 0,
          "why": "文章说 Its name is Brownie。"
        },
        {
          "q": "When did the writer get it?",
          "o": [
            "Age two",
            "Age three",
            "Age five"
          ],
          "a": 1,
          "why": "文章说 when I was three。"
        },
        {
          "q": "How long has the writer had it?",
          "o": [
            "Five years",
            "Seven years",
            "Ten years"
          ],
          "a": 1,
          "why": "文章说 for seven years。"
        }
      ]
    },
    {
      "id": "w43",
      "book": 2,
      "title": "A Tree",
      "cat": "状物",
      "body": "There is a big tree in our school. It is very old. It is taller than our building. In spring, it has green leaves. In summer, it gives us shade. In autumn, its leaves turn yellow and fall. In winter, it stands in the snow. Birds make nests in it. The tree is our friend. It watches us grow up.",
      "tips": [
        "介绍基本特征",
        "分季节描写",
        "描述与鸟的关系",
        "结尾升华"
      ],
      "words": [
        "tree",
        "old",
        "shade",
        "fall",
        "nest",
        "grow up"
      ],
      "q": [
        {
          "q": "What does the tree give in summer?",
          "o": [
            "Fruit",
            "Shade",
            "Flowers"
          ],
          "a": 1,
          "why": "文章说 it gives us shade。"
        },
        {
          "q": "What happens to leaves in autumn?",
          "o": [
            "Turn green",
            "Turn yellow and fall",
            "Stay green"
          ],
          "a": 1,
          "why": "文章说 leaves turn yellow and fall。"
        },
        {
          "q": "What do birds do in the tree?",
          "o": [
            "Sing only",
            "Make nests",
            "Sleep"
          ],
          "a": 1,
          "why": "文章说 Birds make nests in it。"
        }
      ]
    },
    {
      "id": "w44",
      "book": 2,
      "title": "My School Bag",
      "cat": "状物",
      "body": "I have a school bag. It is blue and white. It has three pockets. The big pocket is for books. The small one is for pens. The other one is for my water bottle. My bag is not heavy. I put my homework in it too. I take it to school every day. It is my good helper. I like my school bag.",
      "tips": [
        "描写外观",
        "描述各部分用途",
        "描述日常使用",
        "结尾表达感情"
      ],
      "words": [
        "bag",
        "pocket",
        "water bottle",
        "heavy",
        "helper"
      ],
      "q": [
        {
          "q": "What color is the bag?",
          "o": [
            "Red and black",
            "Blue and white",
            "Green"
          ],
          "a": 1,
          "why": "文章说 blue and white。"
        },
        {
          "q": "How many pockets does it have?",
          "o": [
            "Two",
            "Three",
            "Four"
          ],
          "a": 1,
          "why": "文章说 three pockets。"
        },
        {
          "q": "What is the big pocket for?",
          "o": [
            "Pens",
            "Books",
            "Water bottle"
          ],
          "a": 1,
          "why": "文章说 The big pocket is for books。"
        }
      ]
    },
    {
      "id": "w45",
      "book": 2,
      "title": "Computer",
      "cat": "状物",
      "body": "A computer is a useful machine. We can use it to do many things. We can type and print. We can draw pictures. We can play games. We can also learn English on it. The computer has a screen, a keyboard, and a mouse. It helps us a lot. But we should not play too long. It is bad for our eyes.",
      "tips": [
        "开头总述用途",
        "列举功能",
        "描述组成部件",
        "结尾提醒注意"
      ],
      "words": [
        "computer",
        "machine",
        "type",
        "print",
        "screen",
        "keyboard"
      ],
      "q": [
        {
          "q": "What can we do with a computer?",
          "o": [
            "Only play games",
            "Type, print, draw, learn",
            "Only watch TV"
          ],
          "a": 1,
          "why": "文章说 type, print, draw, learn English。"
        },
        {
          "q": "What does a computer have?",
          "o": [
            "Screen, keyboard, mouse",
            "Wheels",
            "Wings"
          ],
          "a": 0,
          "why": "文章说 screen, keyboard, and mouse。"
        },
        {
          "q": "What should we not do?",
          "o": [
            "Play too long",
            "Use it to learn",
            "Type"
          ],
          "a": 0,
          "why": "文章说 should not play too long。"
        }
      ]
    },
    {
      "id": "w46",
      "book": 2,
      "title": "A Letter to a Friend",
      "cat": "应用文",
      "body": "Dear Amy, How are you? I am fine. I am writing to tell you about my new school. It is big and beautiful. I have many new friends. My favorite teacher is Miss Li. She teaches English. We play games in class. I miss you very much. Please write back soon. Yours, Lily",
      "tips": [
        "开头问候",
        "说明写信目的",
        "描述近况",
        "结尾期待回信"
      ],
      "words": [
        "dear",
        "write",
        "miss",
        "write back",
        "yours"
      ],
      "q": [
        {
          "q": "Who is the letter to?",
          "o": [
            "Amy",
            "Lily",
            "Miss Li"
          ],
          "a": 0,
          "why": "文章说 Dear Amy。"
        },
        {
          "q": "Who is the favorite teacher?",
          "o": [
            "Miss Wang",
            "Miss Li",
            "Miss Zhang"
          ],
          "a": 1,
          "why": "文章说 Miss Li。"
        },
        {
          "q": "Who wrote the letter?",
          "o": [
            "Amy",
            "Lily",
            "Tom"
          ],
          "a": 1,
          "why": "文章说 Yours, Lily。"
        }
      ]
    },
    {
      "id": "w47",
      "book": 2,
      "title": "A Notice",
      "cat": "应用文",
      "body": "Notice: There will be a sports meeting next Friday. It will start at 8:00 in the morning. All students should wear sports clothes. We will have running, jumping, and ball games. Parents are welcome to come. Please prepare well. Let's do our best! School Office",
      "tips": [
        "标题 Notice",
        "说明时间地点",
        "说明要求和内容",
        "落款"
      ],
      "words": [
        "notice",
        "sports meeting",
        "wear",
        "prepare",
        "office"
      ],
      "q": [
        {
          "q": "When is the sports meeting?",
          "o": [
            "Next Monday",
            "Next Friday",
            "Next Sunday"
          ],
          "a": 1,
          "why": "文章说 next Friday。"
        },
        {
          "q": "What time does it start?",
          "o": [
            "7:00",
            "8:00",
            "9:00"
          ],
          "a": 1,
          "why": "文章说 start at 8:00。"
        },
        {
          "q": "What should students wear?",
          "o": [
            "School uniform",
            "Sports clothes",
            "Casual clothes"
          ],
          "a": 1,
          "why": "文章说 wear sports clothes。"
        }
      ]
    },
    {
      "id": "w48",
      "book": 2,
      "title": "An Invitation",
      "cat": "应用文",
      "body": "Dear Tom, I am having a birthday party this Saturday. It will start at 3:00 in the afternoon. We will play games, eat cake, and sing songs. My home is at 12 Apple Street. Please come and join us! It will be fun. Hope to see you there! Best wishes, Jack",
      "tips": [
        "称呼",
        "说明活动时间地点",
        "描述活动内容",
        "期待出席"
      ],
      "words": [
        "invitation",
        "party",
        "join",
        "fun",
        "best wishes"
      ],
      "q": [
        {
          "q": "What is the event?",
          "o": [
            "A birthday party",
            "A sports meeting",
            "A picnic"
          ],
          "a": 0,
          "why": "文章说 a birthday party。"
        },
        {
          "q": "When is the party?",
          "o": [
            "This Saturday",
            "This Sunday",
            "Next Friday"
          ],
          "a": 0,
          "why": "文章说 this Saturday。"
        },
        {
          "q": "What time does it start?",
          "o": [
            "2:00",
            "3:00",
            "4:00"
          ],
          "a": 1,
          "why": "文章说 start at 3:00。"
        }
      ]
    },
    {
      "id": "w49",
      "book": 2,
      "title": "A Thank-You Note",
      "cat": "应用文",
      "body": "Dear Grandma, Thank you for the beautiful sweater you made for me. It is warm and soft. I love the color blue. I wear it every day. My friends all say it is nice. You are the best grandma in the world. Thank you for your love. I miss you. Love, Xiao Ming",
      "tips": [
        "称呼",
        "表达感谢",
        "描述礼物",
        "表达感情"
      ],
      "words": [
        "thank you",
        "sweater",
        "warm",
        "soft",
        "love"
      ],
      "q": [
        {
          "q": "What did grandma make?",
          "o": [
            "A sweater",
            "A hat",
            "A scarf"
          ],
          "a": 0,
          "why": "文章说 the beautiful sweater。"
        },
        {
          "q": "What color is it?",
          "o": [
            "Red",
            "Blue",
            "Green"
          ],
          "a": 1,
          "why": "文章说 love the color blue。"
        },
        {
          "q": "Who wrote the note?",
          "o": [
            "Tom",
            "Xiao Ming",
            "Lily"
          ],
          "a": 1,
          "why": "文章说 Love, Xiao Ming。"
        }
      ]
    },
    {
      "id": "w50",
      "book": 2,
      "title": "A Phone Message",
      "cat": "应用文",
      "body": "Message: From: Mr. Wang To: Tom Time: 3:00 PM, Friday. Mr. Wang called. He wants you to bring your homework to school on Monday. He also said the English test will be on Wednesday. Please prepare well. If you have questions, call him back at 888-1234.",
      "tips": [
        "格式：From/To/Time",
        "转述内容",
        "说明要求",
        "提供联系方式"
      ],
      "words": [
        "message",
        "from",
        "to",
        "call back",
        "prepare"
      ],
      "q": [
        {
          "q": "Who called?",
          "o": [
            "Mr. Li",
            "Mr. Wang",
            "Miss Li"
          ],
          "a": 1,
          "why": "文章说 Mr. Wang called。"
        },
        {
          "q": "When is the English test?",
          "o": [
            "Monday",
            "Tuesday",
            "Wednesday"
          ],
          "a": 2,
          "why": "文章说 the English test will be on Wednesday。"
        },
        {
          "q": "What should Tom bring on Monday?",
          "o": [
            "His book",
            "His homework",
            "His bag"
          ],
          "a": 1,
          "why": "文章说 bring your homework to school。"
        }
      ]
    },
    {
      "id": "w51",
      "book": 3,
      "title": "In the Park",
      "cat": "看图写话",
      "body": "Look at the picture. It is a sunny day. There are many people in the park. Some children are flying kites. Two boys are playing football on the grass. An old man is reading a book under a tree. A woman is walking her dog. Everyone is happy. The park is a good place to have fun.",
      "tips": [
        "开头 Look at the picture",
        "描述天气和人物",
        "用 Some/Two/An 描述不同人",
        "结尾总结"
      ],
      "words": [
        "picture",
        "sunny",
        "fly kites",
        "walk dog",
        "have fun"
      ],
      "q": [
        {
          "q": "How is the weather?",
          "o": [
            "Rainy",
            "Sunny",
            "Cloudy"
          ],
          "a": 1,
          "why": "文章说 a sunny day。"
        },
        {
          "q": "What are children doing?",
          "o": [
            "Flying kites",
            "Reading books",
            "Walking dogs"
          ],
          "a": 0,
          "why": "文章说 flying kites。"
        },
        {
          "q": "What is the old man doing?",
          "o": [
            "Playing football",
            "Reading a book",
            "Walking"
          ],
          "a": 1,
          "why": "文章说 reading a book under a tree。"
        }
      ]
    },
    {
      "id": "w52",
      "book": 3,
      "title": "In the Classroom",
      "cat": "看图写话",
      "body": "Look at the picture. This is a classroom. The teacher is standing in front. She is writing on the blackboard. The students are sitting at their desks. They are listening carefully. One boy is raising his hand. He wants to answer a question. The classroom is clean and quiet. Everyone is studying hard.",
      "tips": [
        "开头描述图片场景",
        "描写老师",
        "描写学生",
        "结尾总结氛围"
      ],
      "words": [
        "classroom",
        "blackboard",
        "listen",
        "raise hand",
        "study hard"
      ],
      "q": [
        {
          "q": "What is the teacher doing?",
          "o": [
            "Sitting",
            "Writing on the blackboard",
            "Reading"
          ],
          "a": 1,
          "why": "文章说 writing on the blackboard。"
        },
        {
          "q": "What are students doing?",
          "o": [
            "Playing",
            "Listening carefully",
            "Sleeping"
          ],
          "a": 1,
          "why": "文章说 listening carefully。"
        },
        {
          "q": "What is one boy doing?",
          "o": [
            "Raising his hand",
            "Reading a book",
            "Sleeping"
          ],
          "a": 0,
          "why": "文章说 raising his hand。"
        }
      ]
    },
    {
      "id": "w53",
      "book": 3,
      "title": "At the Zoo",
      "cat": "看图写话",
      "body": "Look at the picture. We are at the zoo. I can see many animals. There are two big elephants. They have long noses. Three monkeys are in a tree. They are eating bananas. A panda is sleeping on the grass. Some birds are flying in the sky. The zoo is interesting. I like it here.",
      "tips": [
        "开头说明地点",
        "用数字描述动物数量",
        "描述动物动作",
        "结尾表达感受"
      ],
      "words": [
        "zoo",
        "elephant",
        "nose",
        "monkey",
        "banana",
        "panda"
      ],
      "q": [
        {
          "q": "How many elephants are there?",
          "o": [
            "One",
            "Two",
            "Three"
          ],
          "a": 1,
          "why": "文章说 two big elephants。"
        },
        {
          "q": "What are monkeys eating?",
          "o": [
            "Apples",
            "Bananas",
            "Oranges"
          ],
          "a": 1,
          "why": "文章说 eating bananas。"
        },
        {
          "q": "What is the panda doing?",
          "o": [
            "Eating",
            "Sleeping",
            "Playing"
          ],
          "a": 1,
          "why": "文章说 sleeping on the grass。"
        }
      ]
    },
    {
      "id": "w54",
      "book": 3,
      "title": "At Home",
      "cat": "看图写话",
      "body": "Look at the picture. It is evening. A family is at home. Father is watching TV on the sofa. Mother is cooking in the kitchen. The sister is doing homework at the desk. The brother is playing with a toy car. A cat is sleeping on the floor. The room is warm and cozy. It is a happy family.",
      "tips": [
        "说明时间背景",
        "分别描写每个家庭成员",
        "描述宠物",
        "结尾总结"
      ],
      "words": [
        "evening",
        "sofa",
        "kitchen",
        "homework",
        "toy car",
        "cozy"
      ],
      "q": [
        {
          "q": "What is father doing?",
          "o": [
            "Watching TV",
            "Cooking",
            "Reading"
          ],
          "a": 0,
          "why": "文章说 Father is watching TV。"
        },
        {
          "q": "Where is mother?",
          "o": [
            "In the kitchen",
            "On the sofa",
            "At the desk"
          ],
          "a": 0,
          "why": "文章说 cooking in the kitchen。"
        },
        {
          "q": "What is the cat doing?",
          "o": [
            "Playing",
            "Sleeping",
            "Eating"
          ],
          "a": 1,
          "why": "文章说 sleeping on the floor。"
        }
      ]
    },
    {
      "id": "w55",
      "book": 3,
      "title": "At the Supermarket",
      "cat": "看图写话",
      "body": "Look at the picture. We are in a supermarket. There are many shelves. They are full of food and drinks. A woman is putting apples in a basket. A man is looking at milk. Two children are pointing at candy. A worker is putting things on a shelf. The supermarket is big and bright. People are shopping happily.",
      "tips": [
        "说明地点",
        "描写货架和商品",
        "描写不同人物",
        "结尾总结"
      ],
      "words": [
        "supermarket",
        "shelf",
        "basket",
        "candy",
        "worker",
        "bright"
      ],
      "q": [
        {
          "q": "What is the woman doing?",
          "o": [
            "Putting apples in a basket",
            "Looking at milk",
            "Pointing at candy"
          ],
          "a": 0,
          "why": "文章说 putting apples in a basket。"
        },
        {
          "q": "What are children pointing at?",
          "o": [
            "Apples",
            "Candy",
            "Milk"
          ],
          "a": 1,
          "why": "文章说 pointing at candy。"
        },
        {
          "q": "What is the worker doing?",
          "o": [
            "Shopping",
            "Putting things on a shelf",
            "Selling tickets"
          ],
          "a": 1,
          "why": "文章说 putting things on a shelf。"
        }
      ]
    },
    {
      "id": "w56",
      "book": 3,
      "title": "On the Playground",
      "cat": "看图写话",
      "body": "Look at the picture. It is break time. The playground is full of students. Some girls are skipping rope. Four boys are playing basketball. Two children are sitting on a bench. They are eating snacks. A teacher is watching them. Everyone is having a good time.",
      "tips": [
        "说明时间地点",
        "描写不同活动",
        "用数字增加细节",
        "结尾总结"
      ],
      "words": [
        "playground",
        "skip rope",
        "basketball",
        "bench",
        "snack"
      ],
      "q": [
        {
          "q": "What are girls doing?",
          "o": [
            "Skipping rope",
            "Playing basketball",
            "Sitting"
          ],
          "a": 0,
          "why": "文章说 skipping rope。"
        },
        {
          "q": "How many boys play basketball?",
          "o": [
            "Three",
            "Four",
            "Five"
          ],
          "a": 1,
          "why": "文章说 Four boys。"
        },
        {
          "q": "What are two children doing on the bench?",
          "o": [
            "Eating snacks",
            "Reading",
            "Talking"
          ],
          "a": 0,
          "why": "文章说 eating snacks。"
        }
      ]
    },
    {
      "id": "w57",
      "book": 3,
      "title": "In the Garden",
      "cat": "看图写话",
      "body": "Look at the picture. This is a garden. There are many beautiful flowers. A girl is watering the plants. A boy is planting a small tree. A butterfly is flying among the flowers. A bird is singing in a tree. The sun is shining. The garden is colorful and lovely.",
      "tips": [
        "说明场景",
        "描写人物活动",
        "描写动物",
        "结尾总结"
      ],
      "words": [
        "garden",
        "water",
        "plant",
        "butterfly",
        "colorful"
      ],
      "q": [
        {
          "q": "What is the girl doing?",
          "o": [
            "Watering plants",
            "Planting a tree",
            "Picking flowers"
          ],
          "a": 0,
          "why": "文章说 watering the plants。"
        },
        {
          "q": "What is flying among flowers?",
          "o": [
            "A bee",
            "A butterfly",
            "A bird"
          ],
          "a": 1,
          "why": "文章说 A butterfly is flying。"
        },
        {
          "q": "How is the garden?",
          "o": [
            "Colorful and lovely",
            "Empty",
            "Dark"
          ],
          "a": 0,
          "why": "文章说 colorful and lovely。"
        }
      ]
    },
    {
      "id": "w58",
      "book": 3,
      "title": "At the Beach",
      "cat": "看图写话",
      "body": "Look at the picture. We are at the beach. The sea is blue. The sand is yellow. Some children are building sandcastles. Two people are swimming in the sea. A boy is collecting shells. A girl is sitting under an umbrella. She is reading a book. It is a perfect summer day.",
      "tips": [
        "说明地点",
        "描写环境",
        "描写不同活动",
        "结尾总结"
      ],
      "words": [
        "beach",
        "sea",
        "sand",
        "sandcastle",
        "shell",
        "umbrella"
      ],
      "q": [
        {
          "q": "What are children building?",
          "o": [
            "Sandcastles",
            "Kites",
            "Houses"
          ],
          "a": 0,
          "why": "文章说 building sandcastles。"
        },
        {
          "q": "What is the boy collecting?",
          "o": [
            "Shells",
            "Rocks",
            "Flowers"
          ],
          "a": 0,
          "why": "文章说 collecting shells。"
        },
        {
          "q": "What is the girl doing under the umbrella?",
          "o": [
            "Reading a book",
            "Sleeping",
            "Eating"
          ],
          "a": 0,
          "why": "文章说 reading a book。"
        }
      ]
    },
    {
      "id": "w59",
      "book": 3,
      "title": "At the Bus Stop",
      "cat": "看图写话",
      "body": "Look at the picture. People are waiting at a bus stop. There are five people in line. An old woman is sitting on the bench. A young man is standing behind her. Two students are talking. A bus is coming. The line is orderly. Everyone is waiting patiently.",
      "tips": [
        "说明场景",
        "描写排队情况",
        "描述不同人物",
        "结尾总结秩序"
      ],
      "words": [
        "bus stop",
        "line",
        "bench",
        "patiently",
        "orderly"
      ],
      "q": [
        {
          "q": "How many people are in line?",
          "o": [
            "Three",
            "Four",
            "Five"
          ],
          "a": 2,
          "why": "文章说 five people in line。"
        },
        {
          "q": "Who is sitting on the bench?",
          "o": [
            "A young man",
            "An old woman",
            "A student"
          ],
          "a": 1,
          "why": "文章说 An old woman is sitting。"
        },
        {
          "q": "What is coming?",
          "o": [
            "A train",
            "A bus",
            "A taxi"
          ],
          "a": 1,
          "why": "文章说 A bus is coming。"
        }
      ]
    },
    {
      "id": "w60",
      "book": 3,
      "title": "In the Kitchen",
      "cat": "看图写话",
      "body": "Look at the picture. Mom is in the kitchen. She is making dinner. There is a big pot on the stove. Mom is stirring the soup. On the table, there are vegetables and meat. A cat is sitting on the floor. It is looking at the food. The kitchen smells good. Dinner will be ready soon.",
      "tips": [
        "说明场景",
        "描写人物动作",
        "描写物品和动物",
        "结尾总结"
      ],
      "words": [
        "kitchen",
        "pot",
        "stove",
        "stir",
        "soup",
        "smell"
      ],
      "q": [
        {
          "q": "What is mom doing?",
          "o": [
            "Making dinner",
            "Washing dishes",
            "Reading"
          ],
          "a": 0,
          "why": "文章说 making dinner。"
        },
        {
          "q": "What is on the stove?",
          "o": [
            "A pan",
            "A big pot",
            "A kettle"
          ],
          "a": 1,
          "why": "文章说 a big pot on the stove。"
        },
        {
          "q": "Where is the cat?",
          "o": [
            "On the table",
            "On the floor",
            "On the stove"
          ],
          "a": 1,
          "why": "文章说 sitting on the floor。"
        }
      ]
    },
    {
      "id": "w61",
      "book": 3,
      "title": "At the Birthday Party",
      "cat": "看图写话",
      "body": "Look at the picture. It is a birthday party. There is a big cake on the table. It has eight candles. Children are singing 'Happy Birthday.' The birthday girl is making a wish. There are balloons everywhere. Presents are on the table. Everyone is smiling. It is a fun party.",
      "tips": [
        "说明场景",
        "描写蛋糕和装饰",
        "描写人物活动",
        "结尾总结"
      ],
      "words": [
        "birthday",
        "candle",
        "balloon",
        "present",
        "wish",
        "smile"
      ],
      "q": [
        {
          "q": "How many candles are on the cake?",
          "o": [
            "Seven",
            "Eight",
            "Nine"
          ],
          "a": 1,
          "why": "文章说 eight candles。"
        },
        {
          "q": "What is the birthday girl doing?",
          "o": [
            "Making a wish",
            "Eating cake",
            "Opening presents"
          ],
          "a": 0,
          "why": "文章说 making a wish。"
        },
        {
          "q": "What are everywhere?",
          "o": [
            "Balloons",
            "Flowers",
            "Candles"
          ],
          "a": 0,
          "why": "文章说 balloons everywhere。"
        }
      ]
    },
    {
      "id": "w62",
      "book": 3,
      "title": "At the Library",
      "cat": "看图写话",
      "body": "Look at the picture. We are in a library. There are tall bookshelves. A girl is reading a book at a table. A boy is looking for a book on a shelf. The librarian is at the desk. An old man is reading a newspaper. The library is very quiet. Everyone is reading carefully.",
      "tips": [
        "说明地点",
        "描写不同人物",
        "描述氛围",
        "结尾总结"
      ],
      "words": [
        "library",
        "bookshelf",
        "librarian",
        "newspaper",
        "quiet"
      ],
      "q": [
        {
          "q": "What is the girl doing?",
          "o": [
            "Reading a book",
            "Looking for a book",
            "Reading a newspaper"
          ],
          "a": 0,
          "why": "文章说 reading a book at a table。"
        },
        {
          "q": "What is the boy doing?",
          "o": [
            "Reading",
            "Looking for a book",
            "Sitting"
          ],
          "a": 1,
          "why": "文章说 looking for a book on a shelf。"
        },
        {
          "q": "How is the library?",
          "o": [
            "Noisy",
            "Very quiet",
            "Empty"
          ],
          "a": 1,
          "why": "文章说 very quiet。"
        }
      ]
    },
    {
      "id": "w63",
      "book": 3,
      "title": "In the Morning",
      "cat": "看图写话",
      "body": "Look at the picture. It is early morning. The sun is just rising. A boy is brushing his teeth. His mother is making breakfast in the kitchen. His father is reading a newspaper. A bird is singing outside the window. The clock shows seven o'clock. It is the start of a new day.",
      "tips": [
        "说明时间",
        "描写各人活动",
        "描写环境",
        "结尾总结"
      ],
      "words": [
        "morning",
        "rise",
        "brush teeth",
        "breakfast",
        "clock"
      ],
      "q": [
        {
          "q": "What is the boy doing?",
          "o": [
            "Brushing teeth",
            "Eating breakfast",
            "Reading"
          ],
          "a": 0,
          "why": "文章说 brushing his teeth。"
        },
        {
          "q": "What is mother doing?",
          "o": [
            "Making breakfast",
            "Reading",
            "Sleeping"
          ],
          "a": 0,
          "why": "文章说 making breakfast。"
        },
        {
          "q": "What time is it?",
          "o": [
            "Six o'clock",
            "Seven o'clock",
            "Eight o'clock"
          ],
          "a": 1,
          "why": "文章说 seven o'clock。"
        }
      ]
    },
    {
      "id": "w64",
      "book": 3,
      "title": "At the Airport",
      "cat": "看图写话",
      "body": "Look at the picture. We are at the airport. A big plane is outside the window. People are carrying luggage. A family is saying goodbye. A girl is waving to her friend. Workers in uniform are helping people. The airport is busy. Everyone is going somewhere.",
      "tips": [
        "说明地点",
        "描写场景",
        "描写不同人物",
        "结尾总结"
      ],
      "words": [
        "airport",
        "plane",
        "luggage",
        "wave",
        "uniform",
        "busy"
      ],
      "q": [
        {
          "q": "What is outside the window?",
          "o": [
            "A train",
            "A big plane",
            "A bus"
          ],
          "a": 1,
          "why": "文章说 A big plane is outside。"
        },
        {
          "q": "What is the girl doing?",
          "o": [
            "Crying",
            "Waving",
            "Running"
          ],
          "a": 1,
          "why": "文章说 waving to her friend。"
        },
        {
          "q": "How is the airport?",
          "o": [
            "Quiet",
            "Busy",
            "Empty"
          ],
          "a": 1,
          "why": "文章说 The airport is busy。"
        }
      ]
    },
    {
      "id": "w65",
      "book": 3,
      "title": "At the Farm",
      "cat": "看图写话",
      "body": "Look at the picture. This is a farm. There is a red barn. A farmer is feeding chickens. A cow is eating grass. Two sheep are sleeping under a tree. A dog is running around. There are vegetables in the field. The farm is peaceful. The farmer works hard every day.",
      "tips": [
        "说明场景",
        "描写动物",
        "描写农民活动",
        "结尾总结"
      ],
      "words": [
        "farm",
        "barn",
        "chicken",
        "cow",
        "sheep",
        "peaceful"
      ],
      "q": [
        {
          "q": "What color is the barn?",
          "o": [
            "Blue",
            "Red",
            "Green"
          ],
          "a": 1,
          "why": "文章说 a red barn。"
        },
        {
          "q": "What is the cow doing?",
          "o": [
            "Sleeping",
            "Eating grass",
            "Running"
          ],
          "a": 1,
          "why": "文章说 eating grass。"
        },
        {
          "q": "How many sheep are sleeping?",
          "o": [
            "One",
            "Two",
            "Three"
          ],
          "a": 1,
          "why": "文章说 Two sheep are sleeping。"
        }
      ]
    },
    {
      "id": "w66",
      "book": 3,
      "title": "At the Hospital",
      "cat": "看图写话",
      "body": "Look at the picture. We are at a hospital. A doctor is talking to a patient. A nurse is holding medicine. A child is sitting on a bed. His mother is next to him. There are pictures on the wall. The hospital is clean. The doctors and nurses are kind.",
      "tips": [
        "说明地点",
        "描写医护人员",
        "描写病人",
        "结尾总结"
      ],
      "words": [
        "hospital",
        "doctor",
        "patient",
        "nurse",
        "medicine",
        "clean"
      ],
      "q": [
        {
          "q": "Who is talking to the patient?",
          "o": [
            "A nurse",
            "A doctor",
            "A mother"
          ],
          "a": 1,
          "why": "文章说 A doctor is talking to a patient。"
        },
        {
          "q": "What is the nurse holding?",
          "o": [
            "Medicine",
            "A book",
            "Food"
          ],
          "a": 0,
          "why": "文章说 holding medicine。"
        },
        {
          "q": "Where is the child?",
          "o": [
            "On a chair",
            "On a bed",
            "On the floor"
          ],
          "a": 1,
          "why": "文章说 sitting on a bed。"
        }
      ]
    },
    {
      "id": "w67",
      "book": 3,
      "title": "At the Train Station",
      "cat": "看图写话",
      "body": "Look at the picture. We are at a train station. A train is coming. People are standing on the platform. Some have suitcases. A boy is holding his mother's hand. A man is checking the timetable. The station is big. The train will leave soon.",
      "tips": [
        "说明地点",
        "描写场景",
        "描写人物",
        "结尾总结"
      ],
      "words": [
        "train station",
        "platform",
        "suitcase",
        "timetable",
        "leave"
      ],
      "q": [
        {
          "q": "What is coming?",
          "o": [
            "A bus",
            "A train",
            "A taxi"
          ],
          "a": 1,
          "why": "文章说 A train is coming。"
        },
        {
          "q": "What is the boy doing?",
          "o": [
            "Holding mother's hand",
            "Running",
            "Sitting"
          ],
          "a": 0,
          "why": "文章说 holding his mother's hand。"
        },
        {
          "q": "What is the man checking?",
          "o": [
            "The timetable",
            "His phone",
            "His ticket"
          ],
          "a": 0,
          "why": "文章说 checking the timetable。"
        }
      ]
    },
    {
      "id": "w68",
      "book": 3,
      "title": "At the Restaurant",
      "cat": "看图写话",
      "body": "Look at the picture. A family is at a restaurant. They are sitting at a round table. There is food on the table. Father is eating noodles. Mother is drinking soup. The children are eating rice. A waiter is bringing more food. The restaurant is nice. The food smells delicious.",
      "tips": [
        "说明场景",
        "描写人物和食物",
        "描写服务员",
        "结尾总结"
      ],
      "words": [
        "restaurant",
        "round table",
        "noodle",
        "soup",
        "waiter",
        "delicious"
      ],
      "q": [
        {
          "q": "What is father eating?",
          "o": [
            "Rice",
            "Noodles",
            "Soup"
          ],
          "a": 1,
          "why": "文章说 eating noodles。"
        },
        {
          "q": "What is the waiter doing?",
          "o": [
            "Eating",
            "Bringing more food",
            "Sitting"
          ],
          "a": 1,
          "why": "文章说 bringing more food。"
        },
        {
          "q": "How does the food smell?",
          "o": [
            "Bad",
            "Delicious",
            "Nothing"
          ],
          "a": 1,
          "why": "文章说 smells delicious。"
        }
      ]
    },
    {
      "id": "w69",
      "book": 3,
      "title": "At the Post Office",
      "cat": "看图写话",
      "body": "Look at the picture. We are at a post office. A man is buying stamps. A woman is sending a package. A girl is posting a letter. The worker is behind the counter. There are mailboxes outside. The post office is small but busy. People come and go all day.",
      "tips": [
        "说明地点",
        "描写不同人物",
        "描写设施",
        "结尾总结"
      ],
      "words": [
        "post office",
        "stamp",
        "package",
        "letter",
        "mailbox",
        "counter"
      ],
      "q": [
        {
          "q": "What is the man buying?",
          "o": [
            "Stamps",
            "Food",
            "Clothes"
          ],
          "a": 0,
          "why": "文章说 buying stamps。"
        },
        {
          "q": "What is the woman sending?",
          "o": [
            "A letter",
            "A package",
            "A card"
          ],
          "a": 1,
          "why": "文章说 sending a package。"
        },
        {
          "q": "What is outside?",
          "o": [
            "Mailboxes",
            "Trees",
            "Cars"
          ],
          "a": 0,
          "why": "文章说 mailboxes outside。"
        }
      ]
    },
    {
      "id": "w70",
      "book": 3,
      "title": "At the Music Class",
      "cat": "看图写话",
      "body": "Look at the picture. We are in a music class. The teacher is playing the piano. Some students are singing. A boy is playing the guitar. A girl is playing the violin. Two children are playing drums. The music sounds beautiful. Everyone enjoys the class.",
      "tips": [
        "说明场景",
        "描写老师",
        "描写学生乐器",
        "结尾总结"
      ],
      "words": [
        "music class",
        "piano",
        "guitar",
        "violin",
        "drum",
        "beautiful"
      ],
      "q": [
        {
          "q": "What is the teacher playing?",
          "o": [
            "Guitar",
            "Piano",
            "Violin"
          ],
          "a": 1,
          "why": "文章说 playing the piano。"
        },
        {
          "q": "What is the boy playing?",
          "o": [
            "Piano",
            "Guitar",
            "Drums"
          ],
          "a": 1,
          "why": "文章说 playing the guitar。"
        },
        {
          "q": "How does the music sound?",
          "o": [
            "Loud",
            "Beautiful",
            "Bad"
          ],
          "a": 1,
          "why": "文章说 sounds beautiful。"
        }
      ]
    },
    {
      "id": "w71",
      "book": 3,
      "title": "At the Art Class",
      "cat": "看图写话",
      "body": "Look at the picture. We are in an art class. The teacher is showing a painting. Students are drawing at their desks. A girl is painting a flower. A boy is drawing a car. There are crayons and brushes on the tables. The classroom is colorful. Everyone is creative.",
      "tips": [
        "说明场景",
        "描写老师",
        "描写学生创作",
        "结尾总结"
      ],
      "words": [
        "art class",
        "painting",
        "draw",
        "crayon",
        "brush",
        "creative"
      ],
      "q": [
        {
          "q": "What is the teacher showing?",
          "o": [
            "A painting",
            "A book",
            "A toy"
          ],
          "a": 0,
          "why": "文章说 showing a painting。"
        },
        {
          "q": "What is the girl painting?",
          "o": [
            "A car",
            "A flower",
            "A house"
          ],
          "a": 1,
          "why": "文章说 painting a flower。"
        },
        {
          "q": "What is on the tables?",
          "o": [
            "Crayons and brushes",
            "Books",
            "Food"
          ],
          "a": 0,
          "why": "文章说 crayons and brushes on the tables。"
        }
      ]
    },
    {
      "id": "w72",
      "book": 3,
      "title": "At the Swimming Pool",
      "cat": "看图写话",
      "body": "Look at the picture. We are at a swimming pool. The water is blue and clean. Some children are swimming. A boy is jumping into the water. A girl is learning to swim. A coach is teaching her. Two people are sitting by the pool. They are watching. It is a hot summer day.",
      "tips": [
        "说明地点",
        "描写环境",
        "描写人物活动",
        "结尾总结"
      ],
      "words": [
        "swimming pool",
        "water",
        "jump",
        "coach",
        "watch"
      ],
      "q": [
        {
          "q": "What color is the water?",
          "o": [
            "Green",
            "Blue",
            "Clear"
          ],
          "a": 1,
          "why": "文章说 blue and clean。"
        },
        {
          "q": "What is the boy doing?",
          "o": [
            "Swimming",
            "Jumping into the water",
            "Sitting"
          ],
          "a": 1,
          "why": "文章说 jumping into the water。"
        },
        {
          "q": "What is the coach doing?",
          "o": [
            "Swimming",
            "Teaching",
            "Watching"
          ],
          "a": 1,
          "why": "文章说 teaching her。"
        }
      ]
    },
    {
      "id": "w73",
      "book": 3,
      "title": "In the Snow",
      "cat": "看图写话",
      "body": "Look at the picture. It is snowing. The ground is white. Children are playing in the snow. Two boys are making a snowman. They give it a carrot nose. A girl is throwing a snowball. Some children are making snow angels. Everyone is wearing warm clothes. Winter is fun!",
      "tips": [
        "说明天气",
        "描写雪景",
        "描写活动",
        "结尾总结"
      ],
      "words": [
        "snow",
        "white",
        "snowman",
        "carrot",
        "snowball",
        "warm clothes"
      ],
      "q": [
        {
          "q": "What are two boys making?",
          "o": [
            "A snowman",
            "A fort",
            "A tree"
          ],
          "a": 0,
          "why": "文章说 making a snowman。"
        },
        {
          "q": "What do they give the snowman?",
          "o": [
            "A hat",
            "A carrot nose",
            "A scarf"
          ],
          "a": 1,
          "why": "文章说 a carrot nose。"
        },
        {
          "q": "What is everyone wearing?",
          "o": [
            "Swimsuits",
            "Warm clothes",
            "Raincoats"
          ],
          "a": 1,
          "why": "文章说 wearing warm clothes。"
        }
      ]
    },
    {
      "id": "w74",
      "book": 3,
      "title": "At the Market",
      "cat": "看图写话",
      "body": "Look at the picture. We are at a market. There are many stalls. One stall sells fruits. Another sells vegetables. A woman is buying fish. A man is selling flowers. Children are looking at toys. The market is noisy and busy. There are many things to buy.",
      "tips": [
        "说明地点",
        "描写摊位",
        "描写人物",
        "结尾总结"
      ],
      "words": [
        "market",
        "stall",
        "sell",
        "buy",
        "noisy",
        "busy"
      ],
      "q": [
        {
          "q": "What does one stall sell?",
          "o": [
            "Toys",
            "Fruits",
            "Fish"
          ],
          "a": 1,
          "why": "文章说 One stall sells fruits。"
        },
        {
          "q": "What is the woman buying?",
          "o": [
            "Flowers",
            "Fish",
            "Toys"
          ],
          "a": 1,
          "why": "文章说 buying fish。"
        },
        {
          "q": "How is the market?",
          "o": [
            "Quiet",
            "Noisy and busy",
            "Empty"
          ],
          "a": 1,
          "why": "文章说 noisy and busy。"
        }
      ]
    },
    {
      "id": "w75",
      "book": 3,
      "title": "At the Fire Station",
      "cat": "看图写话",
      "body": "Look at the picture. We are visiting a fire station. There is a big red fire truck. A firefighter is showing us the truck. He is wearing a uniform and a helmet. Another firefighter is sliding down a pole. There is a fire dog. The firefighters are brave. They help people.",
      "tips": [
        "说明地点",
        "描写消防车和消防员",
        "描写细节",
        "结尾总结"
      ],
      "words": [
        "fire station",
        "fire truck",
        "firefighter",
        "uniform",
        "helmet",
        "brave"
      ],
      "q": [
        {
          "q": "What color is the fire truck?",
          "o": [
            "Blue",
            "Red",
            "Yellow"
          ],
          "a": 1,
          "why": "文章说 a big red fire truck。"
        },
        {
          "q": "What is the firefighter wearing?",
          "o": [
            "A uniform and helmet",
            "Casual clothes",
            "A suit"
          ],
          "a": 0,
          "why": "文章说 wearing a uniform and a helmet。"
        },
        {
          "q": "What is another firefighter doing?",
          "o": [
            "Sleeping",
            "Sliding down a pole",
            "Eating"
          ],
          "a": 1,
          "why": "文章说 sliding down a pole。"
        }
      ]
    },
    {
      "id": "w76",
      "book": 4,
      "title": "Monday, Sunny",
      "cat": "日记",
      "body": "Monday, March 11th, Sunny. Today was a good day. I went to school as usual. We had a math test. I think I did well. After school, I played basketball with my friends. Then I went home and did my homework. Mom made my favorite dinner. I am happy today.",
      "tips": [
        "格式：星期, 日期, 天气",
        "按时间顺序记录",
        "描述主要事件",
        "结尾写感受"
      ],
      "words": [
        "Monday",
        "sunny",
        "as usual",
        "test",
        "favorite",
        "happy"
      ],
      "q": [
        {
          "q": "What day was it?",
          "o": [
            "Monday",
            "Tuesday",
            "Wednesday"
          ],
          "a": 0,
          "why": "文章说 Monday。"
        },
        {
          "q": "What test did they have?",
          "o": [
            "English",
            "Math",
            "Chinese"
          ],
          "a": 1,
          "why": "文章说 a math test。"
        },
        {
          "q": "What did the writer do after school?",
          "o": [
            "Played basketball",
            "Went home",
            "Read books"
          ],
          "a": 0,
          "why": "文章说 played basketball。"
        }
      ]
    },
    {
      "id": "w77",
      "book": 4,
      "title": "Tuesday, Cloudy",
      "cat": "日记",
      "body": "Tuesday, March 12th, Cloudy. Today was Tree Planting Day. Our class went to plant trees. We dug holes and put small trees in them. Then we watered them. I planted three trees. It was hard work but fun. I hope the trees will grow big. We should protect our earth.",
      "tips": [
        "日记格式",
        "说明特殊日子",
        "描述活动过程",
        "结尾升华"
      ],
      "words": [
        "Tree Planting Day",
        "dig",
        "hole",
        "water",
        "protect",
        "earth"
      ],
      "q": [
        {
          "q": "What day was it?",
          "o": [
            "Tuesday",
            "Thursday",
            "Friday"
          ],
          "a": 0,
          "why": "文章说 Tuesday。"
        },
        {
          "q": "What was special about today?",
          "o": [
            "Tree Planting Day",
            "Sports Day",
            "Birthday"
          ],
          "a": 0,
          "why": "文章说 Tree Planting Day。"
        },
        {
          "q": "How many trees did the writer plant?",
          "o": [
            "Two",
            "Three",
            "Four"
          ],
          "a": 1,
          "why": "文章说 I planted three trees。"
        }
      ]
    },
    {
      "id": "w78",
      "book": 4,
      "title": "Wednesday, Rainy",
      "cat": "日记",
      "body": "Wednesday, March 13th, Rainy. It rained all day. I forgot my umbrella. I got wet on the way home. Mom was worried. She made me hot soup. I changed my clothes and drank the soup. Then I stayed in bed. I hope I don't catch a cold. I should check the weather tomorrow.",
      "tips": [
        "日记格式",
        "描述意外事件",
        "描述处理过程",
        "结尾反思"
      ],
      "words": [
        "rainy",
        "umbrella",
        "wet",
        "hot soup",
        "catch a cold",
        "weather"
      ],
      "q": [
        {
          "q": "What did the writer forget?",
          "o": [
            "Homework",
            "Umbrella",
            "Lunch"
          ],
          "a": 1,
          "why": "文章说 forgot my umbrella。"
        },
        {
          "q": "What did mom make?",
          "o": [
            "Hot soup",
            "Tea",
            "Cake"
          ],
          "a": 0,
          "why": "文章说 made me hot soup。"
        },
        {
          "q": "What does the writer hope?",
          "o": [
            "To get wet again",
            "Not to catch a cold",
            "To rain more"
          ],
          "a": 1,
          "why": "文章说 hope I don't catch a cold。"
        }
      ]
    },
    {
      "id": "w79",
      "book": 4,
      "title": "Thursday, Windy",
      "cat": "日记",
      "body": "Thursday, March 14th, Windy. It was very windy today. We flew kites in PE class. My kite was a butterfly shape. It flew very high. But then the wind was too strong. My kite broke. I was sad. My friend shared his kite with me. Friends are so kind.",
      "tips": [
        "日记格式",
        "描述天气和活动",
        "描述意外",
        "结尾感恩"
      ],
      "words": [
        "windy",
        "fly kites",
        "PE class",
        "shape",
        "break",
        "share"
      ],
      "q": [
        {
          "q": "What did they do in PE class?",
          "o": [
            "Flew kites",
            "Ran",
            "Swam"
          ],
          "a": 0,
          "why": "文章说 flew kites in PE class。"
        },
        {
          "q": "What shape was the kite?",
          "o": [
            "Bird",
            "Butterfly",
            "Star"
          ],
          "a": 1,
          "why": "文章说 a butterfly shape。"
        },
        {
          "q": "What happened to the kite?",
          "o": [
            "It flew away",
            "It broke",
            "It was lost"
          ],
          "a": 1,
          "why": "文章说 My kite broke。"
        }
      ]
    },
    {
      "id": "w80",
      "book": 4,
      "title": "Friday, Sunny",
      "cat": "日记",
      "body": "Friday, March 15th, Sunny. Today was the last day of school this week. We had an English party in class. We sang English songs and played games. Miss Li gave us small gifts. I got a bookmark. After school, I went to the library with Amy. We read story books. I love Fridays!",
      "tips": [
        "日记格式",
        "描述特别活动",
        "描述课后活动",
        "结尾表达感受"
      ],
      "words": [
        "last day",
        "party",
        "gift",
        "bookmark",
        "library",
        "Friday"
      ],
      "q": [
        {
          "q": "What did they have in class?",
          "o": [
            "A test",
            "An English party",
            "A meeting"
          ],
          "a": 1,
          "why": "文章说 an English party in class。"
        },
        {
          "q": "What gift did the writer get?",
          "o": [
            "A book",
            "A bookmark",
            "A pen"
          ],
          "a": 1,
          "why": "文章说 I got a bookmark。"
        },
        {
          "q": "Where did they go after school?",
          "o": [
            "The park",
            "The library",
            "Home"
          ],
          "a": 1,
          "why": "文章说 went to the library。"
        }
      ]
    },
    {
      "id": "w81",
      "book": 4,
      "title": "Saturday, Sunny",
      "cat": "日记",
      "body": "Saturday, March 16th, Sunny. I got up late today. I had a big breakfast. Then I helped mom clean the house. I swept the floor and wiped the tables. In the afternoon, I went to the park with dad. We played badminton. In the evening, we watched a movie. It was a relaxing day.",
      "tips": [
        "日记格式",
        "按时间顺序",
        "描述家务和娱乐",
        "结尾总结"
      ],
      "words": [
        "get up late",
        "sweep",
        "wipe",
        "badminton",
        "movie",
        "relaxing"
      ],
      "q": [
        {
          "q": "What did the writer do in the morning?",
          "o": [
            "Slept all day",
            "Helped clean the house",
            "Went out"
          ],
          "a": 1,
          "why": "文章说 helped mom clean the house。"
        },
        {
          "q": "What did they play in the park?",
          "o": [
            "Football",
            "Badminton",
            "Tennis"
          ],
          "a": 1,
          "why": "文章说 played badminton。"
        },
        {
          "q": "What did they do in the evening?",
          "o": [
            "Watched a movie",
            "Read books",
            "Slept"
          ],
          "a": 0,
          "why": "文章说 watched a movie。"
        }
      ]
    },
    {
      "id": "w82",
      "book": 4,
      "title": "Sunday, Cloudy",
      "cat": "日记",
      "body": "Sunday, March 17th, Cloudy. I visited Grandma today. She lives in the countryside. Her house has a big garden. I helped her pick vegetables. We picked tomatoes and cucumbers. Grandma cooked lunch for us. The food was fresh and delicious. In the afternoon, I read books in the garden. I love visiting Grandma.",
      "tips": [
        "日记格式",
        "说明地点",
        "描述活动",
        "结尾表达感情"
      ],
      "words": [
        "visit",
        "countryside",
        "garden",
        "pick",
        "tomato",
        "cucumber"
      ],
      "q": [
        {
          "q": "Where does Grandma live?",
          "o": [
            "The city",
            "The countryside",
            "The town"
          ],
          "a": 1,
          "why": "文章说 in the countryside。"
        },
        {
          "q": "What did they pick?",
          "o": [
            "Tomatoes and cucumbers",
            "Apples",
            "Flowers"
          ],
          "a": 0,
          "why": "文章说 tomatoes and cucumbers。"
        },
        {
          "q": "What did the writer do in the afternoon?",
          "o": [
            "Slept",
            "Read books",
            "Watched TV"
          ],
          "a": 1,
          "why": "文章说 read books in the garden。"
        }
      ]
    },
    {
      "id": "w83",
      "book": 4,
      "title": "Monday, Hot",
      "cat": "日记",
      "body": "Monday, June 10th, Hot. It was very hot today. The temperature was 35 degrees. We had the fan on all day. In PE class, we stayed in the classroom. We played board games instead. After school, I bought an ice cream. It was so good. I hope tomorrow will be cooler. Summer is too hot!",
      "tips": [
        "日记格式",
        "描述天气",
        "描述因天气调整的活动",
        "结尾感受"
      ],
      "words": [
        "hot",
        "temperature",
        "degree",
        "fan",
        "board game",
        "ice cream"
      ],
      "q": [
        {
          "q": "What was the temperature?",
          "o": [
            "30 degrees",
            "35 degrees",
            "40 degrees"
          ],
          "a": 1,
          "why": "文章说 35 degrees。"
        },
        {
          "q": "What did they do in PE class?",
          "o": [
            "Ran outside",
            "Played board games",
            "Swam"
          ],
          "a": 1,
          "why": "文章说 played board games instead。"
        },
        {
          "q": "What did the writer buy after school?",
          "o": [
            "A drink",
            "An ice cream",
            "A fan"
          ],
          "a": 1,
          "why": "文章说 bought an ice cream。"
        }
      ]
    },
    {
      "id": "w84",
      "book": 4,
      "title": "Tuesday, Fine",
      "cat": "日记",
      "body": "Tuesday, May 7th, Fine. Today was Mother's Day. I made a card for mom. I drew flowers on it. I also wrote 'I love you, Mom.' In the morning, I helped mom make breakfast. In the evening, I gave mom the card. She was very happy. She hugged me tightly. Mom is the best!",
      "tips": [
        "日记格式",
        "说明特殊日子",
        "描述准备过程",
        "结尾表达感情"
      ],
      "words": [
        "Mother's Day",
        "card",
        "draw",
        "hug",
        "tightly"
      ],
      "q": [
        {
          "q": "What day was it?",
          "o": [
            "Father's Day",
            "Mother's Day",
            "Teacher's Day"
          ],
          "a": 1,
          "why": "文章说 Mother's Day。"
        },
        {
          "q": "What did the writer make?",
          "o": [
            "A cake",
            "A card",
            "A gift"
          ],
          "a": 1,
          "why": "文章说 made a card for mom。"
        },
        {
          "q": "What did the writer draw on the card?",
          "o": [
            "Flowers",
            "Animals",
            "Stars"
          ],
          "a": 0,
          "why": "文章说 drew flowers on it。"
        }
      ]
    },
    {
      "id": "w85",
      "book": 4,
      "title": "Wednesday, Snowy",
      "cat": "日记",
      "body": "Wednesday, January 15th, Snowy. It snowed last night! Everything was white this morning. I was so excited. We built a snowman at school. It had a carrot nose and a hat. We also had a snowball fight. My team won! My hands were cold but my heart was warm. I love snow days!",
      "tips": [
        "日记格式",
        "描写雪景",
        "描述活动",
        "结尾表达感受"
      ],
      "words": [
        "snowy",
        "white",
        "snowman",
        "carrot",
        "snowball",
        "heart"
      ],
      "q": [
        {
          "q": "When did it snow?",
          "o": [
            "Last night",
            "This morning",
            "Last week"
          ],
          "a": 0,
          "why": "文章说 It snowed last night!"
        },
        {
          "q": "What did the snowman have?",
          "o": [
            "A scarf",
            "A carrot nose and hat",
            "A broom"
          ],
          "a": 1,
          "why": "文章说 a carrot nose and a hat。"
        },
        {
          "q": "What did they have?",
          "o": [
            "A race",
            "A snowball fight",
            "A party"
          ],
          "a": 1,
          "why": "文章说 a snowball fight。"
        }
      ]
    },
    {
      "id": "w86",
      "book": 4,
      "title": "Thursday, Warm",
      "cat": "日记",
      "body": "Thursday, April 18th, Warm. Today was our school sports day. I ran in the 100-meter race. I came in second! I also did the long jump. I jumped 3 meters. Our class won the relay race. Everyone cheered. We got a gold medal. I was tired but very proud. It was an exciting day!",
      "tips": [
        "日记格式",
        "说明事件",
        "描述参赛项目",
        "结尾感受"
      ],
      "words": [
        "sports day",
        "race",
        "long jump",
        "relay",
        "medal",
        "proud"
      ],
      "q": [
        {
          "q": "What race did the writer run?",
          "o": [
            "100-meter",
            "200-meter",
            "400-meter"
          ],
          "a": 0,
          "why": "文章说 the 100-meter race。"
        },
        {
          "q": "What place did the writer get?",
          "o": [
            "First",
            "Second",
            "Third"
          ],
          "a": 1,
          "why": "文章说 I came in second!"
        },
        {
          "q": "What did they get?",
          "o": [
            "A trophy",
            "A gold medal",
            "A book"
          ],
          "a": 1,
          "why": "文章说 a gold medal。"
        }
      ]
    },
    {
      "id": "w87",
      "book": 4,
      "title": "Friday, Cool",
      "cat": "日记",
      "body": "Friday, October 11th, Cool. We had a science experiment today. We learned about water. We froze water to make ice. Then we melted the ice. We also boiled water to make steam. It was interesting to see water change. Science is amazing! I want to do more experiments.",
      "tips": [
        "日记格式",
        "说明学习内容",
        "描述实验过程",
        "结尾表达兴趣"
      ],
      "words": [
        "science",
        "experiment",
        "freeze",
        "melt",
        "boil",
        "steam"
      ],
      "q": [
        {
          "q": "What did they learn about?",
          "o": [
            "Air",
            "Water",
            "Fire"
          ],
          "a": 1,
          "why": "文章说 learned about water。"
        },
        {
          "q": "What did they freeze water into?",
          "o": [
            "Steam",
            "Ice",
            "Nothing"
          ],
          "a": 1,
          "why": "文章说 froze water to make ice。"
        },
        {
          "q": "How did the writer feel?",
          "o": [
            "Bored",
            "Interested",
            "Scared"
          ],
          "a": 1,
          "why": "文章说 It was interesting。"
        }
      ]
    },
    {
      "id": "w88",
      "book": 4,
      "title": "Saturday, Rainy",
      "cat": "日记",
      "body": "Saturday, July 6th, Rainy. It rained all day. I couldn't go out. I stayed home and learned to cook. Mom taught me to make eggs. First, I cracked the eggs. Then I stirred them. Finally, I fried them in the pan. The eggs tasted great! I was proud of myself. Cooking is fun!",
      "tips": [
        "日记格式",
        "说明原因",
        "描述学习过程",
        "结尾感受"
      ],
      "words": [
        "rainy",
        "crack",
        "stir",
        "fry",
        "pan",
        "proud"
      ],
      "q": [
        {
          "q": "Why couldn't the writer go out?",
          "o": [
            "It was hot",
            "It rained",
            "It was cold"
          ],
          "a": 1,
          "why": "文章说 It rained all day。"
        },
        {
          "q": "What did the writer learn to make?",
          "o": [
            "Cake",
            "Eggs",
            "Soup"
          ],
          "a": 1,
          "why": "文章说 taught me to make eggs。"
        },
        {
          "q": "How did the eggs taste?",
          "o": [
            "Bad",
            "Great",
            "OK"
          ],
          "a": 1,
          "why": "文章说 tasted great!"
        }
      ]
    },
    {
      "id": "w89",
      "book": 4,
      "title": "Sunday, Sunny",
      "cat": "日记",
      "body": "Sunday, September 22nd, Sunny. I went to the book fair today. There were many books. I saw story books, science books, and comics. I bought two books. One is about animals. The other is a story book. I also got a poster for free. I started reading on the way home. Books are wonderful!",
      "tips": [
        "日记格式",
        "说明地点",
        "描述所见所买",
        "结尾感受"
      ],
      "words": [
        "book fair",
        "comic",
        "poster",
        "free",
        "wonderful"
      ],
      "q": [
        {
          "q": "Where did the writer go?",
          "o": [
            "The library",
            "A book fair",
            "A bookstore"
          ],
          "a": 1,
          "why": "文章说 the book fair。"
        },
        {
          "q": "How many books did the writer buy?",
          "o": [
            "One",
            "Two",
            "Three"
          ],
          "a": 1,
          "why": "文章说 I bought two books。"
        },
        {
          "q": "What did the writer get for free?",
          "o": [
            "A book",
            "A poster",
            "A bookmark"
          ],
          "a": 1,
          "why": "文章说 a poster for free。"
        }
      ]
    },
    {
      "id": "w90",
      "book": 4,
      "title": "Monday, Foggy",
      "cat": "日记",
      "body": "Monday, November 4th, Foggy. It was very foggy this morning. I could not see far. Dad drove slowly to school. Our teacher told us about fog. Fog is small water drops in the air. It was interesting. In the afternoon, the fog went away. The sun came out. The weather changed a lot.",
      "tips": [
        "日记格式",
        "描写天气",
        "描述学到知识",
        "结尾总结变化"
      ],
      "words": [
        "foggy",
        "slowly",
        "water drop",
        "air",
        "change"
      ],
      "q": [
        {
          "q": "How was the morning?",
          "o": [
            "Sunny",
            "Foggy",
            "Rainy"
          ],
          "a": 1,
          "why": "文章说 very foggy this morning。"
        },
        {
          "q": "How did dad drive?",
          "o": [
            "Fast",
            "Slowly",
            "Normally"
          ],
          "a": 1,
          "why": "文章说 drove slowly。"
        },
        {
          "q": "What came out in the afternoon?",
          "o": [
            "The moon",
            "The sun",
            "More fog"
          ],
          "a": 1,
          "why": "文章说 The sun came out。"
        }
      ]
    },
    {
      "id": "w91",
      "book": 4,
      "title": "Tuesday, Fine",
      "cat": "日记",
      "body": "Tuesday, April 2nd, Fine. Today was my friend Amy's birthday. I gave her a gift. It was a notebook. She loved it! We sang 'Happy Birthday' to her. We ate cake together. The cake was chocolate flavor. We played games after. We all had fun. I hope Amy had a great birthday!",
      "tips": [
        "日记格式",
        "说明事件",
        "描述庆祝过程",
        "结尾祝福"
      ],
      "words": [
        "birthday",
        "gift",
        "notebook",
        "chocolate",
        "flavor"
      ],
      "q": [
        {
          "q": "Whose birthday was it?",
          "o": [
            "The writer's",
            "Amy's",
            "Mom's"
          ],
          "a": 1,
          "why": "文章说 my friend Amy's birthday。"
        },
        {
          "q": "What gift did the writer give?",
          "o": [
            "A book",
            "A notebook",
            "A pen"
          ],
          "a": 1,
          "why": "文章说 It was a notebook。"
        },
        {
          "q": "What flavor was the cake?",
          "o": [
            "Strawberry",
            "Chocolate",
            "Vanilla"
          ],
          "a": 1,
          "why": "文章说 chocolate flavor。"
        }
      ]
    },
    {
      "id": "w92",
      "book": 4,
      "title": "Wednesday, Warm",
      "cat": "日记",
      "body": "Wednesday, May 15th, Warm. We went on a school trip today. We went to a science museum. I saw many interesting things. There were old machines and new robots. I watched a science show. A robot could dance! I took many photos. I learned a lot. It was the best trip ever!",
      "tips": [
        "日记格式",
        "说明活动",
        "描述所见所闻",
        "结尾感受"
      ],
      "words": [
        "school trip",
        "museum",
        "machine",
        "robot",
        "dance",
        "photo"
      ],
      "q": [
        {
          "q": "Where did they go?",
          "o": [
            "A park",
            "A science museum",
            "A zoo"
          ],
          "a": 1,
          "why": "文章说 a science museum。"
        },
        {
          "q": "What could the robot do?",
          "o": [
            "Sing",
            "Dance",
            "Cook"
          ],
          "a": 1,
          "why": "文章说 A robot could dance!"
        },
        {
          "q": "How was the trip?",
          "o": [
            "Boring",
            "The best trip ever",
            "OK"
          ],
          "a": 1,
          "why": "文章说 the best trip ever!"
        }
      ]
    },
    {
      "id": "w93",
      "book": 4,
      "title": "Thursday, Hot",
      "cat": "日记",
      "body": "Thursday, August 1st, Hot. Today was Army Day. We watched a parade on TV. The soldiers were very neat. They marched in straight lines. The tanks and planes were cool. I felt proud of our country. When I grow up, I want to be a soldier too. I will protect our country.",
      "tips": [
        "日记格式",
        "说明特殊日子",
        "描述所见",
        "结尾表达愿望"
      ],
      "words": [
        "Army Day",
        "parade",
        "soldier",
        "march",
        "tank",
        "protect"
      ],
      "q": [
        {
          "q": "What day was it?",
          "o": [
            "National Day",
            "Army Day",
            "Children's Day"
          ],
          "a": 1,
          "why": "文章说 Army Day。"
        },
        {
          "q": "What did they watch?",
          "o": [
            "A movie",
            "A parade",
            "A game"
          ],
          "a": 1,
          "why": "文章说 a parade on TV。"
        },
        {
          "q": "What does the writer want to be?",
          "o": [
            "A teacher",
            "A soldier",
            "A doctor"
          ],
          "a": 1,
          "why": "文章说 I want to be a soldier。"
        }
      ]
    },
    {
      "id": "w94",
      "book": 4,
      "title": "Friday, Cool",
      "cat": "日记",
      "body": "Friday, December 20th, Cool. Christmas is coming! We decorated our classroom. We put up a Christmas tree. We hung lights and balls on it. We also made paper snowflakes. I drew a picture of Santa. Our classroom looks beautiful. I can't wait for Christmas!",
      "tips": [
        "日记格式",
        "说明节日背景",
        "描述装饰过程",
        "结尾期待"
      ],
      "words": [
        "Christmas",
        "decorate",
        "hang",
        "light",
        "snowflake",
        "Santa"
      ],
      "q": [
        {
          "q": "What is coming?",
          "o": [
            "New Year",
            "Christmas",
            "Easter"
          ],
          "a": 1,
          "why": "文章说 Christmas is coming!"
        },
        {
          "q": "What did they put up?",
          "o": [
            "A tree",
            "A flag",
            "A banner"
          ],
          "a": 0,
          "why": "文章说 a Christmas tree。"
        },
        {
          "q": "What did the writer draw?",
          "o": [
            "A tree",
            "Santa",
            "A snowman"
          ],
          "a": 1,
          "why": "文章说 drew a picture of Santa。"
        }
      ]
    },
    {
      "id": "w95",
      "book": 4,
      "title": "Saturday, Snowy",
      "cat": "日记",
      "body": "Saturday, January 20th, Snowy. It snowed heavily today. I went skiing with dad. It was my first time. I was nervous at first. Dad taught me how to stop. I fell down a few times. But I kept trying. Finally, I could ski down the small hill. I was so happy. I love skiing!",
      "tips": [
        "日记格式",
        "描述活动",
        "描述学习过程",
        "结尾感受"
      ],
      "words": [
        "heavily",
        "skiing",
        "nervous",
        "fall down",
        "keep trying",
        "hill"
      ],
      "q": [
        {
          "q": "What did the writer do?",
          "o": [
            "Skating",
            "Skiing",
            "Sledding"
          ],
          "a": 1,
          "why": "文章说 went skiing。"
        },
        {
          "q": "Was it the writer's first time?",
          "o": [
            "Yes",
            "No",
            "Not sure"
          ],
          "a": 0,
          "why": "文章说 It was my first time。"
        },
        {
          "q": "What happened finally?",
          "o": [
            "Gave up",
            "Could ski down the hill",
            "Got hurt"
          ],
          "a": 1,
          "why": "文章说 I could ski down the small hill。"
        }
      ]
    },
    {
      "id": "w96",
      "book": 4,
      "title": "Sunday, Fine",
      "cat": "日记",
      "body": "Sunday, June 16th, Fine. Today was Father's Day. I made breakfast for dad. I made toast and eggs. Dad was surprised and happy. I also gave him a tie. It was blue. He loved it. In the afternoon, we went fishing. We caught three fish. It was a great Father's Day!",
      "tips": [
        "日记格式",
        "说明特殊日子",
        "描述庆祝活动",
        "结尾总结"
      ],
      "words": [
        "Father's Day",
        "toast",
        "surprised",
        "tie",
        "fishing",
        "catch"
      ],
      "q": [
        {
          "q": "What day was it?",
          "o": [
            "Mother's Day",
            "Father's Day",
            "Teacher's Day"
          ],
          "a": 1,
          "why": "文章说 Father's Day。"
        },
        {
          "q": "What did the writer make for dad?",
          "o": [
            "Toast and eggs",
            "Cake",
            "Soup"
          ],
          "a": 0,
          "why": "文章说 toast and eggs。"
        },
        {
          "q": "What did they do in the afternoon?",
          "o": [
            "Shopping",
            "Fishing",
            "Swimming"
          ],
          "a": 1,
          "why": "文章说 went fishing。"
        }
      ]
    },
    {
      "id": "w97",
      "book": 4,
      "title": "Monday, Windy",
      "cat": "日记",
      "body": "Monday, March 25th, Windy. We had a speech contest today. I was one of the speakers. I was very nervous. My topic was 'My Dream.' I spoke about wanting to be a scientist. My voice was shaky at first. But then I relaxed. Everyone clapped. I didn't win, but I was proud of myself.",
      "tips": [
        "日记格式",
        "说明事件",
        "描述心理变化",
        "结尾感受"
      ],
      "words": [
        "speech contest",
        "speaker",
        "nervous",
        "topic",
        "shaky",
        "relax"
      ],
      "q": [
        {
          "q": "What did they have today?",
          "o": [
            "A test",
            "A speech contest",
            "A party"
          ],
          "a": 1,
          "why": "文章说 a speech contest。"
        },
        {
          "q": "What was the topic?",
          "o": [
            "My School",
            "My Dream",
            "My Family"
          ],
          "a": 1,
          "why": "文章说 My Dream。"
        },
        {
          "q": "Did the writer win?",
          "o": [
            "Yes",
            "No",
            "Almost"
          ],
          "a": 1,
          "why": "文章说 I didn't win。"
        }
      ]
    },
    {
      "id": "w98",
      "book": 4,
      "title": "Tuesday, Sunny",
      "cat": "日记",
      "body": "Tuesday, September 10th, Sunny. Today was Teacher's Day. We made a big card for our teacher. Everyone signed it. We also sang a song for her. Miss Li was moved to tears. She said we were the best class. She gave us sweets. We love our teacher. Teachers are great!",
      "tips": [
        "日记格式",
        "说明特殊日子",
        "描述庆祝过程",
        "结尾感恩"
      ],
      "words": [
        "Teacher's Day",
        "sign",
        "moved",
        "tears",
        "sweet",
        "great"
      ],
      "q": [
        {
          "q": "What day was it?",
          "o": [
            "Teacher's Day",
            "Children's Day",
            "Mother's Day"
          ],
          "a": 0,
          "why": "文章说 Teacher's Day。"
        },
        {
          "q": "What did they make?",
          "o": [
            "A cake",
            "A big card",
            "A gift"
          ],
          "a": 1,
          "why": "文章说 a big card。"
        },
        {
          "q": "How did Miss Li feel?",
          "o": [
            "Angry",
            "Moved to tears",
            "Bored"
          ],
          "a": 1,
          "why": "文章说 moved to tears。"
        }
      ]
    },
    {
      "id": "w99",
      "book": 4,
      "title": "Wednesday, Warm",
      "cat": "日记",
      "body": "Wednesday, April 10th, Warm. I started learning piano today. The teacher was nice. She taught me to sit correctly. Then she showed me the keys. I learned to play 'Do Re Mi.' It was hard at first. My fingers were clumsy. But I kept practicing. By the end, I could play it. I was so happy!",
      "tips": [
        "日记格式",
        "说明新活动",
        "描述学习过程",
        "结尾感受"
      ],
      "words": [
        "piano",
        "correctly",
        "key",
        "Do Re Mi",
        "clumsy",
        "practice"
      ],
      "q": [
        {
          "q": "What did the writer start learning?",
          "o": [
            "Guitar",
            "Piano",
            "Violin"
          ],
          "a": 1,
          "why": "文章说 learning piano。"
        },
        {
          "q": "What did the writer learn to play?",
          "o": [
            "Do Re Mi",
            "Happy Birthday",
            "A song"
          ],
          "a": 0,
          "why": "文章说 play 'Do Re Mi.'"
        },
        {
          "q": "How were the writer's fingers?",
          "o": [
            "Fast",
            "Clumsy",
            "Strong"
          ],
          "a": 1,
          "why": "文章说 My fingers were clumsy。"
        }
      ]
    }
  ]
};
