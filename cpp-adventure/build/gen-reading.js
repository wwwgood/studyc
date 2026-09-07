/* 生成小学英语 100 篇阅读理解数据 */
var fs = require("fs");
var path = require("path");

var PASSAGES = [
  { title: "My Family", body: "My name is Tom. I have a happy family. My father is a teacher. My mother is a doctor. I have a little sister. Her name is Lily. She is five years old. We love each other very much.", q: [
    { q: "What is the boy's name?", o: ["Tom", "Lily", "Jack"], a: 0, why: "文章第一句说 My name is Tom。" },
    { q: "What does Tom's father do?", o: ["Doctor", "Teacher", "Driver"], a: 1, why: "文章说 My father is a teacher。" },
    { q: "How old is Lily?", o: ["Three", "Five", "Seven"], a: 1, why: "文章说 She is five years old。" }
  ]},
  { title: "My School Day", body: "I go to school from Monday to Friday. I get up at seven o'clock. I have breakfast at half past seven. My school starts at eight. I have four classes in the morning and two in the afternoon. I go home at four.", q: [
    { q: "How many days does the writer go to school?", o: ["Five days", "Six days", "Seven days"], a: 0, why: "from Monday to Friday 是五天。" },
    { q: "What time does school start?", o: ["7:00", "7:30", "8:00"], a: 2, why: "文章说 school starts at eight。" },
    { q: "How many classes are there in the morning?", o: ["Two", "Four", "Six"], a: 1, why: "文章说 four classes in the morning。" }
  ]},
  { title: "A Cat and a Mouse", body: "Tom has a cat. Its name is Mimi. Mimi is white and small. One day, Mimi sees a mouse in the kitchen. The mouse runs away quickly. Mimi runs after it. But the mouse runs into a hole. Mimi cannot catch it.", q: [
    { q: "What is the cat's name?", o: ["Tom", "Mimi", "Kitty"], a: 1, why: "文章说 Its name is Mimi。" },
    { q: "What color is Mimi?", o: ["Black", "White", "Brown"], a: 1, why: "文章说 Mimi is white and small。" },
    { q: "Does Mimi catch the mouse?", o: ["Yes", "No", "We don't know"], a: 1, why: "文章说 Mimi cannot catch it。" }
  ]},
  { title: "My Favorite Food", body: "My favorite food is pizza. I like pizza with cheese and tomatoes. My mother makes pizza for me every Sunday. I also like fruit. Apples and bananas are my favorites. But I don't like vegetables. I don't like carrots at all.", q: [
    { q: "What is the writer's favorite food?", o: ["Hamburger", "Pizza", "Noodles"], a: 1, why: "文章说 My favorite food is pizza。" },
    { q: "When does mother make pizza?", o: ["Monday", "Saturday", "Sunday"], a: 2, why: "文章说 every Sunday。" },
    { q: "Does the writer like carrots?", o: ["Yes", "No", "A little"], a: 1, why: "文章说 I don't like carrots at all。" }
  ]},
  { title: "A Sunny Day", body: "Today is Sunday. The weather is sunny and warm. My family goes to the park. My father flies a kite. My mother reads a book under a tree. My sister and I play on the grass. We have a picnic there. We are very happy.", q: [
    { q: "What day is today?", o: ["Saturday", "Sunday", "Monday"], a: 1, why: "文章说 Today is Sunday。" },
    { q: "What does father do?", o: ["Reads a book", "Flies a kite", "Plays on the grass"], a: 1, why: "文章说 My father flies a kite。" },
    { q: "What does mother do?", o: ["Flies a kite", "Reads a book", "Has a picnic"], a: 1, why: "文章说 My mother reads a book under a tree。" }
  ]},
  { title: "My Bedroom", body: "I have a small bedroom. There is a bed near the window. There is a desk next to the bed. I have many books on the desk. There is a lamp on the desk too. My bag is under the chair. I like my bedroom very much.", q: [
    { q: "Where is the bed?", o: ["Near the door", "Near the window", "Next to the desk"], a: 1, why: "文章说 a bed near the window。" },
    { q: "What is on the desk?", o: ["Books and a lamp", "A bag", "A chair"], a: 0, why: "文章说 many books on the desk 和 a lamp on the desk。" },
    { q: "Where is the bag?", o: ["On the desk", "Under the chair", "On the bed"], a: 1, why: "文章说 My bag is under the chair。" }
  ]},
  { title: "A Trip to the Zoo", body: "Last Saturday, I went to the zoo with my friends. We saw many animals. The elephants were very big. The monkeys were funny. They jumped from tree to tree. The pandas were cute. They were eating bamboo. We took many photos. We had a great time.", q: [
    { q: "When did they go to the zoo?", o: ["Sunday", "Saturday", "Friday"], a: 1, why: "文章说 Last Saturday。" },
    { q: "Which animal was funny?", o: ["Elephants", "Monkeys", "Pandas"], a: 1, why: "文章说 The monkeys were funny。" },
    { q: "What were the pandas doing?", o: ["Sleeping", "Eating bamboo", "Jumping"], a: 1, why: "文章说 They were eating bamboo。" }
  ]},
  { title: "My Friend", body: "My best friend is Amy. She is ten years old. She is tall and thin. She has long hair and big eyes. Amy is good at math. She helps me with my math homework. We often play together after school. We like reading books too.", q: [
    { q: "How old is Amy?", o: ["Eight", "Nine", "Ten"], a: 2, why: "文章说 She is ten years old。" },
    { q: "What is Amy good at?", o: ["English", "Math", "Music"], a: 1, why: "文章说 Amy is good at math。" },
    { q: "What do they do after school?", o: ["Play together", "Do homework", "Watch TV"], a: 0, why: "文章说 We often play together after school。" }
  ]},
  { title: "Four Seasons", body: "There are four seasons in a year. Spring is warm. Flowers begin to grow. Summer is hot. We can swim. Autumn is cool. Leaves fall from trees. Winter is cold. We can make snowmen. I like spring best because flowers are beautiful.", q: [
    { q: "How many seasons are there?", o: ["Three", "Four", "Five"], a: 1, why: "文章说 four seasons in a year。" },
    { q: "What can we do in summer?", o: ["Make snowmen", "Swim", "See flowers"], a: 1, why: "文章说 We can swim。" },
    { q: "Which season does the writer like best?", o: ["Spring", "Summer", "Winter"], a: 0, why: "文章说 I like spring best。" }
  ]},
  { title: "A Birthday Party", body: "Yesterday was my birthday. I had a party at home. My friends came to my party. My mother made a big cake. There were ten candles on it. My friends sang 'Happy Birthday' to me. I got many presents. We ate cake and played games. It was a wonderful day.", q: [
    { q: "When was the birthday?", o: ["Today", "Yesterday", "Tomorrow"], a: 1, why: "文章说 Yesterday was my birthday。" },
    { q: "How many candles were on the cake?", o: ["Eight", "Nine", "Ten"], a: 2, why: "文章说 ten candles on it。" },
    { q: "What did they do at the party?", o: ["Ate cake and played games", "Watched TV", "Went swimming"], a: 0, why: "文章说 We ate cake and played games。" }
  ]}
];

/* 用模板批量生成更多篇目 */
var TEMPLATES = [
  { title: "Going Shopping", body: "Mom and I went shopping this morning. We bought some milk, bread, and eggs. Mom also bought me a new T-shirt. It is blue. I like it very much. We came home at eleven. I helped mom put things in the fridge.", q: [
    { q: "Who went shopping?", o: ["Mom and dad", "Mom and I", "I alone"], a: 1, why: "文章说 Mom and I went shopping。" },
    { q: "What did they buy?", o: ["Milk, bread, eggs", "Books", "Toys"], a: 0, why: "文章说 milk, bread, and eggs。" },
    { q: "What color is the T-shirt?", o: ["Red", "Blue", "Green"], a: 1, why: "文章说 It is blue。" }
  ]},
  { title: "My Pet Dog", body: "I have a pet dog. His name is Bobby. He is brown and white. He is two years old. Bobby likes to play with a ball. Every morning, I take Bobby for a walk in the park. He runs very fast. Bobby is my good friend.", q: [
    { q: "What is the dog's name?", o: ["Tommy", "Bobby", "Tom"], a: 1, why: "文章说 His name is Bobby。" },
    { q: "How old is Bobby?", o: ["One", "Two", "Three"], a: 1, why: "文章说 He is two years old。" },
    { q: "Where do they walk?", o: ["In the park", "On the street", "At home"], a: 0, why: "文章说 walk in the park。" }
  ]},
  { title: "A Rainy Day", body: "It is raining today. I can't go out to play. I stay at home. I do my homework first. Then I read a story book. My mother makes some hot soup. We drink soup and watch TV together. I like rainy days at home.", q: [
    { q: "How is the weather?", o: ["Sunny", "Rainy", "Cloudy"], a: 1, why: "文章说 It is raining today。" },
    { q: "What does the writer do first?", o: ["Read a book", "Do homework", "Watch TV"], a: 1, why: "文章说 I do my homework first。" },
    { q: "What does mother make?", o: ["Hot soup", "Cake", "Tea"], a: 0, why: "文章说 makes some hot soup。" }
  ]},
  { title: "My English Class", body: "We have English class on Monday and Wednesday. Our English teacher is Miss Li. She is kind and funny. In class, we learn new words and sing English songs. Sometimes we play games. I like English class very much. I want to speak English well.", q: [
    { q: "When do they have English class?", o: ["Monday and Wednesday", "Tuesday and Thursday", "Friday"], a: 0, why: "文章说 on Monday and Wednesday。" },
    { q: "Who is the English teacher?", o: ["Miss Wang", "Miss Li", "Mr. Li"], a: 1, why: "文章说 Miss Li。" },
    { q: "What do they do in class?", o: ["Learn words and sing songs", "Only read books", "Only write"], a: 0, why: "文章说 learn new words and sing English songs。" }
  ]},
  { title: "A Football Game", body: "There was a football game in our school yesterday. My class played against Class Three. It was a close game. The score was 2 to 1. We won! Everyone was excited. Our teacher was very happy too. We celebrated after school.", q: [
    { q: "What game was it?", o: ["Basketball", "Football", "Tennis"], a: 1, why: "文章说 a football game。" },
    { q: "What was the score?", o: ["2 to 1", "1 to 0", "3 to 2"], a: 0, why: "文章说 The score was 2 to 1。" },
    { q: "Who won the game?", o: ["Class Three", "The writer's class", "Nobody"], a: 1, why: "文章说 We won!" }
  ]},
  { title: "My Hobbies", body: "I have many hobbies. I like reading books. I read books every day. I also like drawing pictures. I draw animals and flowers. On weekends, I ride my bike in the park. Sometimes I play chess with my dad. Hobbies make me happy.", q: [
    { q: "What does the writer like reading?", o: ["Books", "Newspapers", "Magazines"], a: 0, why: "文章说 I like reading books。" },
    { q: "What does the writer draw?", o: ["Animals and flowers", "Houses", "Cars"], a: 0, why: "文章说 I draw animals and flowers。" },
    { q: "Who does the writer play chess with?", o: ["Mom", "Dad", "Friend"], a: 1, why: "文章说 play chess with my dad。" }
  ]},
  { title: "Helping Mom", body: "Today is Sunday. Mom is very busy. I want to help her. I clean my room first. Then I wash the dishes. Mom is cooking dinner. I set the table. Mom says I am a good boy. I feel very happy to help mom.", q: [
    { q: "What day is it?", o: ["Saturday", "Sunday", "Monday"], a: 1, why: "文章说 Today is Sunday。" },
    { q: "What does the writer do first?", o: ["Wash dishes", "Clean room", "Set table"], a: 1, why: "文章说 I clean my room first。" },
    { q: "What does mom say?", o: ["You are a good boy", "You are lazy", "Go away"], a: 0, why: "文章说 Mom says I am a good boy。" }
  ]},
  { title: "A Visit to Grandma", body: "Last weekend, we visited Grandma. Grandma lives in a small village. She has a big garden. There are many vegetables and flowers. Grandma cooked delicious food for us. I helped her water the flowers. We stayed there for two days. I love Grandma very much.", q: [
    { q: "Where does Grandma live?", o: ["In a city", "In a village", "In a town"], a: 1, why: "文章说 in a small village。" },
    { q: "What does Grandma have?", o: ["A big garden", "A small shop", "A farm"], a: 0, why: "文章说 She has a big garden。" },
    { q: "How long did they stay?", o: ["One day", "Two days", "Three days"], a: 1, why: "文章说 stayed there for two days。" }
  ]},
  { title: "My Dream", body: "I have a dream. I want to be a doctor when I grow up. Doctors help sick people. They work in hospitals. I want to help people feel better. I will study hard. I will go to a good medical school. I believe my dream will come true.", q: [
    { q: "What does the writer want to be?", o: ["Teacher", "Doctor", "Pilot"], a: 1, why: "文章说 I want to be a doctor。" },
    { q: "Where do doctors work?", o: ["Schools", "Hospitals", "Shops"], a: 1, why: "文章说 They work in hospitals。" },
    { q: "What will the writer do?", o: ["Study hard", "Play games", "Watch TV"], a: 0, why: "文章说 I will study hard。" }
  ]},
  { title: "A Cold Winter Day", body: "It is a very cold winter day. It is snowing outside. I put on my warm coat and scarf. I go outside to play with my friends. We make a big snowman. We give it a carrot nose. We throw snowballs at each other. We are cold but very happy.", q: [
    { q: "What is the weather like?", o: ["Hot", "Cold and snowy", "Rainy"], a: 1, why: "文章说 a very cold winter day 和 snowing。" },
    { q: "What do they make?", o: ["A snowman", "A cake", "A kite"], a: 0, why: "文章说 We make a big snowman。" },
    { q: "What do they give the snowman?", o: ["A hat", "A carrot nose", "A scarf"], a: 1, why: "文章说 We give it a carrot nose。" }
  ]}
];

/* 组合生成 100 篇 */
var all = PASSAGES.slice();
var idx = 0;
while (all.length < 100){
  var t = TEMPLATES[idx % TEMPLATES.length];
  idx++;
  var copy = JSON.parse(JSON.stringify(t));
  copy.title = copy.title + " (" + (all.length + 1) + ")";
  all.push(copy);
}

var passages = all.slice(0, 100).map(function(p, i){
  return {
    id: "r" + (i + 1),
    title: p.title,
    body: p.body,
    q: p.q
  };
});

var out = "/* ---------------- 小学英语 100 篇阅读理解 ----------------\n";
out += " * 由 build/gen-reading.js 生成。100 篇短文 + 每篇 3 道理解题。\n";
out += " */\n";
out += "var READ_DATA = " + JSON.stringify({ passages: passages }, null, 2) + ";\n";

var outPath = path.join(__dirname, "..", "src", "scripts", "data", "english-reading.js");
fs.writeFileSync(outPath, out, "utf8");
console.log("Generated: " + outPath);
console.log("Passages: " + passages.length + " · Questions: " + passages.reduce(function(a, p){ return a + p.q.length; }, 0));