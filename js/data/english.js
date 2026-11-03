/* ══════════════════════════════════════════════════════════════════════
   📚 ENGLISH.JS — CÂU HỎI TIẾNG ANH 9
   ══════════════════════════════════════════════════════════════════════
   Đề cương giữa kì I · 52 câu
   
   Export:
   - questions : mảng 52 câu đã flatten (dùng để chấm điểm)
   - sections  : mảng sections có passages (dùng để render allAtOnce)
   - meta      : map câu → section (dùng để render passage đúng chỗ)
   ══════════════════════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────────────────────────────
   📖 PASSAGES — ĐOẠN VĂN ĐỌC HIỂU
   ────────────────────────────────────────────────────────────────────── */

const P_LONDON = "London is Britain's biggest city. It is a very old city and dates to the Romans. It is a city of historic buildings and churches, and it has many beautiful parks. It also has some of the (1) _______ museums in the world. London is very crowded (2) _______ summer. It is a popular city with foreign tourists and has more than eight million (3) _______ a year. The city is (4) _______ for its shopping and department stores. London has an excellent underground railway system, so it is easy for tourists to (5) _______.";

const P_HALONG = "Hạ Long Bay (Descending Dragon) is popular with both Vietnamese and international (1) _______. One of the attractions of Hạ Long is the bay's calm water with limestone mountains. The bay's water is (2) _______ during the spring and early summer. Upon arriving in Hạ Long City, visitors can (3) _______ Bãi Cháy Beach. From the beach, they can hire a boat and go out to the bay. It is heard that visitors can find some of Southeast Asia's most beautiful sites. Dấu Gỗ Cave is one of the (4) _______ beautiful caves at Hạ Long. It was the cave in which General Trần Hưng Đạo hid wooden stakes to beat the Mongols on Bạch Đằng (5) _______ in 1288.";

const P_QUATDONG = "There are many existing villages in Việt Nam, but Quất Động Village in Hà Nội is widely known for its products of high quality. Embroidery has been developing around here since the seventeenth century. In the past, local skilled artisans were chosen to make sophisticated, embroidered costumes for the Vietnamese King, Queen and other Royal family members. The first man who taught the local people how to embroider was Dr. Lê Công Hành, who lived during the Le Dynasty. He learned how to embroider while on a trip to China as an envoy and taught the villagers of Quất Động upon his return. Although these skills eventually spread across the country, the Quất Động artisans' creations are still the most appreciated. To create beautiful embroideries, an artisan must be patient, careful and have an eye for design, along with clever hands. Nowadays, Quất Động products may range from clothes, bags, pillowcases, to paintings and decorations, which are exported to many countries.";

const P_DONGHO = "Đông Hồ Folk Painting Village is the place that will surprise many art lovers. As its name suggests, the main product of the village is impressive folk paintings. The village is quite small and there are no more than two hundred households here. Villagers get their main income from making paintings. Looking at their products, you will surely get a deeper insight into the beauty of Vietnam as well as the traditional customs and Vietnamese festivals. These paintings used to be precious decorations during the Tết holiday. Đông Hồ paintings are so unique as they are printed on Poonah or Dó paper (made from the powders of Dó trees). There are 5 main colors used in paintings, including green, red, yellow, black and indigo. They are mostly created from natural materials like bricks, flowers, straw, and different trees, ...";


/* ──────────────────────────────────────────────────────────────────────
   📚 SECTIONS — CÁC PHẦN THI
   ────────────────────────────────────────────────────────────────────── */

const SECTIONS = [
  /* ═══ READING – London ═══ */
  {
    title: "II. READING – A. London",
    passage: P_LONDON,
    questions: [
      ["Question 1: Choose the best word for blank (1).",
        ["good", "well", "better", "best"],
        [3]],
      ["Question 2: Choose the best word for blank (2).",
        ["on", "in", "at", "for"],
        [1]],
      ["Question 3: Choose the best word for blank (3).",
        ["visitors", "villagers", "artisans", "workers"],
        [0]],
      ["Question 4: Choose the best word for blank (4).",
        ["good", "amazing", "well-known", "interesting"],
        [2]],
      ["Question 5: Choose the best word for blank (5).",
        ["go out", "take care of", "hand down", "get around"],
        [3]]
    ]
  },

  /* ═══ READING – Hạ Long Bay ═══ */
  {
    title: "II. READING – A. Hạ Long Bay",
    passage: P_HALONG,
    questions: [
      ["Question 1: Choose the best word for blank (1).",
        ["tourists", "leaders", "famous people", "festival goers"],
        [0]],
      ["Question 2: Choose the best word for blank (2).",
        ["blue", "white", "clear", "liquid"],
        [2]],
      ["Question 3: Choose the best word for blank (3).",
        ["go along", "hand down", "go out", "come back"],
        [0]],
      ["Question 4: Choose the best word for blank (4).",
        ["more", "best", "most", "better"],
        [2]],
      ["Question 5: Choose the best word for blank (5).",
        ["Mountain", "Village", "Cave", "River"],
        [3]]
    ]
  },

  /* ═══ READING – Quất Động Village ═══ */
  {
    title: "II. READING – B. Quất Động Village",
    passage: P_QUATDONG,
    questions: [
      ["Question 1: What is the main topic of the passage?",
        ["The history and development of embroidery in Quất Động Village",
         "The life of Vietnamese kings and queens",
         "How to travel to Quất Động Village",
         "The history of villages in Việt Nam"],
        [0]],
      ["Question 2: When did embroidery begin developing in Quất Động village?",
        ["In the 15th century", "In the 16th century", "In the 17th century", "In the 18th century"],
        [2]],
      ["Question 3: The word \"He\" refers to _______.",
        ["the Vietnamese King", "Dr. Lê Công Hành", "a local artisan", "a member of the Royal family"],
        [1]],
      ["Question 4: Answer in full:<br><b>What qualities must an artisan have to create beautiful embroideries?</b>",
        ["patient", "careful", "design", "clever hands"],
        "keys",
        "To create beautiful embroideries, an artisan must be patient, careful and have an eye for design, along with clever hands."],
      ["Question 5: Answer in full:<br><b>What products are made in Quất Động Village nowadays?</b>",
        ["clothes", "bags", "pillowcases", "paintings", "decorations"],
        "keys",
        "Nowadays, Quất Động products may range from clothes, bags, pillowcases, to paintings and decorations, which are exported to many countries."]
    ]
  },

  /* ═══ READING – Đông Hồ Folk Painting Village ═══ */
  {
    title: "II. READING – B. Đông Hồ Folk Painting Village",
    passage: P_DONGHO,
    questions: [
      ["Question 1: What is the main topic of the passage?",
        ["The history of Vietnamese festivals",
         "Đông Hồ Folk Painting Village and its traditional paintings",
         "The life of people in Vietnamese villages",
         "Different types of paper in Việt Nam"],
        [1]],
      ["Question 2: How many households are there in Đông Hồ Village?",
        ["More than 100 households", "Exactly 200 households", "No more than 200 households", "About 500 households"],
        [2]],
      ["Question 3: The word \"their\" in the passage refers to _______.",
        ["paintings'", "villagers'", "the main colors'", "products'"],
        [1]],
      ["Question 4: Answer in full:<br><b>Why are Đông Hồ Paintings so unique?</b>",
        ["poonah", "paper"],
        "keys",
        "Đông Hồ paintings are so unique as they are printed on Poonah or Dó paper (made from the powders of Dó trees)."],
      ["Question 5: Answer in full:<br><b>What are the main colors used in Đông Hồ Paintings mostly created from?</b>",
        ["natural", "bricks", "flowers", "straw", "trees"],
        "keys",
        "They are mostly created from natural materials like bricks, flowers, straw, and different trees, ..."]
    ]
  },

  /* ═══ LANGUAGE FOCUS – Pronunciation ═══ */
  {
    title: "III. LANGUAGE FOCUS – A. Pronunciation",
    questions: [
      ["Choose the word whose underlined part differs from the others. (1) house / mouse / country / about",
        ["house", "mouse", "country", "about"],
        [2]],
      ["Choose the word whose underlined part differs from the others. (2) walk / talk / calm / water",
        ["walk", "talk", "calm", "water"],
        [2]]
    ]
  },

  /* ═══ LANGUAGE FOCUS – Word Stress ═══ */
  {
    title: "III. LANGUAGE FOCUS – B. Word Stress",
    questions: [
      ["Choose the word that differs from the other three in the position of stress. (1)",
        ["suburb", "neighbor", "useful", "remind"],
        [3]],
      ["Choose the word that differs from the other three in the position of stress. (2)",
        ["traffic", "protect", "plumber", "lifeguard"],
        [1]]
    ]
  },

  /* ═══ LANGUAGE FOCUS – Multiple Choice ═══ */
  {
    title: "III. LANGUAGE FOCUS – C. Multiple Choice",
    questions: [
      ["My hometown is _______ for handicrafts, such as paper fans and lanterns.",
        ["famously", "famous", "fame", "infamous"],
        [1]],
      ["Tourists to Hoi An usually buy traditional _______ such as lanterns as souvenirs.",
        ["handicrafts", "festivals", "dishes", "costumes"],
        [0]],
      ["– Ann: \"Could you show me how to install this software, please?\" – Mr Nam: \"_______\"",
        ["That would be great!", "Sure", "Here you are.", "Yes, I am"],
        [1]],
      ["– Ann: \"Do you mind if I borrow your pencil?\" – Lisa: \"_______\"",
        ["Not at all", "Yes, I do", "I'm sorry", "Yes, I would"],
        [0]],
      ["In their community, the eldest child is usually _______ for his or her parents.",
        ["responsibility", "responsibly", "responsible", "irresponsible"],
        [2]],
      ["Our _______ help keep law and order in our community.",
        ["artisans", "police officers", "craftsmen", "electricians"],
        [1]],
      ["– Tom: \"I can show you how to open this smart door if you want.\" – Anna: \"_______\"",
        ["That would be great, thanks!", "So do I", "The card? Why's that?", "I don't think so."],
        [0]],
      ["– Tim: \"Thanks a lot for lending me an interesting book.\" – Mary: \"_______\"",
        ["Sure, here you are.", "You're welcome.", "The book? OK.", "OK, I'll think about that."],
        [1]]
    ]
  },

  /* ═══ WRITING – Find the error ═══ */
  {
    title: "IV. WRITING – A. Find the error",
    questions: [
      ["The more carefully students listen, the good they understand the lesson.",
        ["carefully", "good", "understand", "lesson"],
        [1]],
      ["Can you decide where to start the project: on Monday or on Tuesday?",
        ["decide", "where", "on Monday", "on Tuesday"],
        [1]],
      ["The more trees we plant, the more green the environment will become.",
        ["more trees", "plant", "more green", "will become"],
        [2]],
      ["Do you know who to choose for the school competition: a song or a dance?",
        ["know", "who", "for", "a song or a dance"],
        [1]]
    ]
  },

  /* ═══ WRITING – Sentence Arrangement ═══ */
  {
    title: "IV. WRITING – B. Sentence Arrangement",
    questions: [
      ["Arrange the sentences to make a meaningful letter:<br>Dear Lan,<br>a. We can discuss our ideas for the science project and divide the tasks together.<br>b. I'm writing to invite you to a group meeting this Saturday afternoon.<br>c. Please let me know if you can come.<br>d. Sorry I haven't contacted you for a few days because I was busy preparing for exams.<br>e. The meeting will start at 2 p.m. at my house.<br>Best wishes!",
        ["b - e - d - a - c", "b - d - e - a - c", "d - a - b - e - c", "d - b - e - a - c"],
        [3]],
      ["Arrange the sentences to make a meaningful paragraph:<br>a. Finally, it makes our planet a better place to live for future generations.<br>b. Moreover, by saving the environment, we are protecting our ecosystem and other natural resources.<br>c. Firstly, when we protect the environment, we are saving ourselves from the problems that will arise in the future. Also, the effects of climate change can also be reduced greatly.<br>d. It is important to save the environment for the survival of the planet and the living beings in it.<br>e. In conclusion, it is vital to preserve and protect life on Earth.",
        ["d - c - b - e - a", "d - c - b - a - e", "d - b - c - a - e", "d - c - e - b - a"],
        [1]],
      ["Arrange the sentences to make a meaningful letter:<br>Dear Anna,<br>a. We are going to prepare some traditional dishes and enjoy music together.<br>b. Please reply soon and tell me if you can join us. I'm looking forward to seeing you!<br>c. I'm very happy to invite you to our school camping trip next Sunday at Green Park.<br>d. Besides outdoor games, we will also have a talent show in the evening.<br>e. Don't forget to bring a hat and some comfortable clothes for outdoor activities.<br>Best,<br>Linda",
        ["a - e - c - d - b", "b - d - a - e - c", "c - d - e - b - a", "c - a - d - e - b"],
        [3]],
      ["Arrange the sentences to make a meaningful paragraph:<br>a. Furthermore, online learning allows students to access lessons and materials anytime and anywhere with an Internet connection.<br>b. In short, online learning offers many advantages and has become an important part of modern education.<br>c. Online learning is becoming increasingly popular among students around the world.<br>d. First of all, it provides flexibility, helping learners study at their own pace and manage their time effectively.<br>e. Last but not least, students can join virtual classes and interact with teachers and classmates easily through online platforms.",
        ["c - d - a - e - b", "d - c - a - e - b", "c - a - d - e - b", "c - d - e - b - a"],
        [0]]
    ]
  },

  /* ═══ WRITING – Rewrite sentences ═══ */
  {
    title: "IV. WRITING – C. Rewrite sentences",
    questions: [
      ["Rewrite the sentence so that it has the same meaning:<br><i>Young people are discussing how they can help the poor and the elderly in their local community.</i><br>→ Young people are discussing ___",
        ["how to help the poor and the elderly in their local community"],
        "text"],
      ["Rewrite the sentence so that it has the same meaning:<br><i>Could you tell me when I should hand in the assignment?</i><br>→ Could you tell me ___",
        ["when to hand in the assignment"],
        "text"],
      ["Rewrite the sentence so that it has the same meaning:<br><i>The community is friendly. People feel happy.</i><br>→ The friendlier ___",
        ["the community is, the happier people feel"],
        "text"],
      ["Rewrite the sentence so that it has the same meaning:<br><i>The city becomes crowded. Traffic is bad.</i><br>→ The more ___",
        ["crowded the city becomes, the worse the traffic is", "crowded the city becomes, the worse traffic is"],
        "text"],
      ["Rewrite the sentence using the word in brackets:<br><i>The city government is making efforts to reduce the amount of rubbish.</i> (cut down on)<br>→ The city government ___",
        ["is making efforts to cut down on the amount of rubbish"],
        "text"],
      ["Rewrite the sentence using the word in brackets:<br><i>Whenever teenagers have free time, they enjoy spending time exploring the city centre.</i> (look around)<br>→ Whenever teenagers have free time, they enjoy ___",
        ["looking around the city centre", "spending time looking around the city centre"],
        "text"],
      ["Rewrite the sentence so that it has the same meaning:<br><i>The students are wondering how they can make their neighbourhood a better place.</i><br>→ The students are wondering ___",
        ["how to make their neighbourhood a better place"],
        "text"],
      ["Rewrite the sentence so that it has the same meaning:<br><i>Could you tell me where I can buy fresh food in the local market?</i><br>→ Could you tell me ___",
        ["where to buy fresh food in the local market"],
        "text"],
      ["Rewrite the sentence so that it has the same meaning:<br><i>The streets are busy. It is difficult to travel around the city.</i><br>→ The busier ___",
        ["the streets are, the more difficult it is to travel around the city"],
        "text"],
      ["Rewrite the sentence so that it has the same meaning:<br><i>Teenagers exercise regularly. They are strong.</i><br>→ The more ___",
        ["regularly teenagers exercise, the stronger they are"],
        "text"],
      ["Rewrite the sentence using the word in brackets:<br><i>People try to save water because they sometimes have no clean water left during the dry season.</i> (run out of)<br>→ People try to save water because ___",
        ["they sometimes run out of clean water during the dry season",
         "they sometimes run out of clean water in the dry season",
         "they sometimes run out of clean water left during the dry season",
         "they sometimes run out of clean water left in the dry season"],
        "text"],
      ["Rewrite the sentence using the word in brackets:<br><i>Many traditional crafts and customs in our local community have been passed from older generations to younger ones.</i> (hand down)<br>→ Many traditional crafts and customs in our local community ___",
        ["have been handed down from older generations to younger ones",
         "have been handed down from older to younger generations"],
        "text"]
    ]
  }
];


/* ──────────────────────────────────────────────────────────────────────
   🔄 FLATTEN — GỘP SECTIONS THÀNH MẢNG CÂU HỎI + META
   ────────────────────────────────────────────────────────────────────── */
const QUESTIONS = [];
const META = [];

SECTIONS.forEach((section, blockIdx) => {
  section.startIdx = QUESTIONS.length;
  section.questions.forEach((q, qIdx) => {
    QUESTIONS.push(q);
    META.push({ blockIdx, qIdx });
  });
});


export default {
  questions: QUESTIONS,
  sections: SECTIONS,
  meta: META
};
