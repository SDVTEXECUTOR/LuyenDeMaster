/* ══════════════════════════════════════════════════════════════════════
   📚 TOWER-POOL.JS — POOL CÂU HỎI CHO GAME TOWER
   ══════════════════════════════════════════════════════════════════════
   30 câu trộn 3 môn: Tiếng Anh + GDCD + Địa lí
   
   Format mỗi câu:
   {
     q: [đề, [A, B, C, D], [chỉ số đáp án đúng]],
     subject: "🇬🇧 Tiếng Anh" | "⚖️ GDCD" | "🌍 Địa lí"
   }
   ══════════════════════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────────────────────────────
   🇬🇧 TIẾNG ANH — 10 câu
   ────────────────────────────────────────────────────────────────────── */
const Q_ENGLISH = [
  [
    "Choose the word whose underlined part differs from the others: h<u>ou</u>se, m<u>ou</u>se, c<u>ou</u>ntry, ab<u>ou</u>t",
    ["house", "mouse", "country", "about"],
    [2]
  ],
  [
    "My hometown is _______ for handicrafts, such as paper fans and lanterns.",
    ["famously", "famous", "fame", "infamous"],
    [1]
  ],
  [
    "Tourists to Hoi An usually buy traditional _______ such as lanterns as souvenirs.",
    ["handicrafts", "festivals", "dishes", "costumes"],
    [0]
  ],
  [
    "– Ann: \"Could you show me how to install this software, please?\" – Mr Nam: \"_______\"",
    ["That would be great!", "Sure", "Here you are.", "Yes, I am"],
    [1]
  ],
  [
    "In their community, the eldest child is usually _______ for his or her parents.",
    ["responsibility", "responsibly", "responsible", "irresponsible"],
    [2]
  ],
  [
    "Our _______ help keep law and order in our community.",
    ["artisans", "police officers", "craftsmen", "electricians"],
    [1]
  ],
  [
    "The more carefully students listen, the _______ they understand the lesson.",
    ["good", "well", "better", "best"],
    [2]
  ],
  [
    "Could you tell me _______ the assignment?",
    ["when to hand in", "when hand in", "when handing in", "when handed in"],
    [0]
  ],
  [
    "The friendlier the community is, _______ people feel.",
    ["the happier", "the more happy", "happier", "the happiest"],
    [0]
  ],
  [
    "People try to save water because they sometimes _______ clean water during the dry season.",
    ["run out", "run out of", "run into", "run away"],
    [1]
  ]
];


/* ──────────────────────────────────────────────────────────────────────
   ⚖️ GDCD — 10 câu
   ────────────────────────────────────────────────────────────────────── */
const Q_GDCD = [
  [
    "Sống có lí tưởng là",
    [
      "xác định được mục đích cao đẹp và có kế hoạch hành động, quyết tâm phấn đấu để đạt được mục đích đó.",
      "xác định được mục đích cao đẹp và phấn đấu để đạt được mục đích đó.",
      "xác định được mục đích, kế hoạch hành động của bản thân.",
      "xác định được mục đích cao đẹp, kế hoạch hành động của bản thân."
    ],
    [0]
  ],
  [
    "Biểu hiện sống thiếu lí tưởng của thanh niên hiện nay là",
    [
      "vượt khó trong học tập.",
      "đấu tranh chống các hiện tượng tiêu cực.",
      "năng động, sáng tạo trong công việc.",
      "sống ỷ lại, thực dụng."
    ],
    [3]
  ],
  [
    "Người biết tha thứ cho chính mình và người khác là biểu hiện của:",
    ["Khiêm tốn", "Khoan dung", "Giản dị", "Trung thực"],
    [1]
  ],
  [
    "Biểu hiện nào sau đây thể hiện người có lòng khoan dung?",
    [
      "Phê phán tất cả những người mắc lỗi lầm.",
      "Ích kỉ, hẹp hòi với người mình không thích.",
      "Chấp nhận cá tính, sở thích của người khác.",
      "Không bỏ qua lỗi lầm của người khác."
    ],
    [2]
  ],
  [
    "Loại hoạt động cộng đồng nào tập trung vào việc cải thiện môi trường?",
    [
      "Hoạt động xã hội.",
      "Hoạt động bảo vệ môi trường.",
      "Hoạt động văn hóa.",
      "Hoạt động quyên góp tiền."
    ],
    [1]
  ],
  [
    "Ý nào sau đây là đúng khi nói về ý nghĩa của sống có lí tưởng?",
    [
      "Luôn được mọi người tôn trọng và thành công trong cuộc sống.",
      "Luôn được mọi người hâm mộ.",
      "Luôn có nhiều tiền bạc.",
      "Luôn giàu có về tâm hồn và tiền bạc."
    ],
    [0]
  ],
  [
    "Lòng khoan dung có thể giúp giảm thiểu:",
    ["Sự xung đột và căng thẳng.", "Sự đa dạng.", "Sự hiểu biết.", "Sự giao tiếp."],
    [0]
  ],
  [
    "Tại sao cần tích cực tổ chức hoạt động cộng đồng?",
    [
      "Để tăng cường sự đoàn kết và cùng nhau xây dựng đất nước giàu mạnh.",
      "Chỉ để giữ gìn truyền thống.",
      "Mang lại lợi ích cho cá nhân.",
      "Để tạo lợi nhuận."
    ],
    [0]
  ],
  [
    "Câu thành ngữ nào sau đây thể hiện người sống có lí tưởng?",
    [
      "Thắng không kiêu, bại không nản.",
      "Dễ làm, khó bỏ.",
      "Nước đến chân mới nhảy.",
      "Thân ai người đó lo."
    ],
    [0]
  ],
  [
    "Mục tiêu chính của hoạt động cộng đồng là gì?",
    [
      "Cải thiện chất lượng cuộc sống.",
      "Nâng cao danh tiếng cá nhân.",
      "Kiếm lợi nhuận.",
      "Có tiếng nói trong tổ chức."
    ],
    [0]
  ]
];


/* ──────────────────────────────────────────────────────────────────────
   🌍 ĐỊA LÍ — 10 câu
   ────────────────────────────────────────────────────────────────────── */
const Q_DIALI = [
  [
    "Các dân tộc thiểu số ở Việt Nam sinh sống chủ yếu ở",
    ["đồng bằng châu thổ", "vùng đồi núi và cao nguyên", "vùng ven biển", "các đô thị lớn"],
    [1]
  ],
  [
    "Người Kinh (Việt) ở nước ta sinh sống chủ yếu ở khu vực nào?",
    ["Vùng núi cao phía Bắc", "Vùng cao nguyên Tây Nguyên", "Đồng bằng, ven biển và trung du", "Vùng biên giới"],
    [2]
  ],
  [
    "Cơ cấu dân số theo nhóm tuổi ở nước ta hiện nay đang chuyển dịch theo hướng nào?",
    [
      "Tỉ lệ nhóm 0–14 tuổi tăng, tỉ lệ nhóm từ 65 tuổi trở lên giảm",
      "Tỉ lệ nhóm 0–14 tuổi giảm, tỉ lệ nhóm từ 65 tuổi trở lên tăng",
      "Tỉ lệ cả hai nhóm tuổi đều tăng",
      "Tỉ lệ cả hai nhóm tuổi đều giảm"
    ],
    [1]
  ],
  [
    "Đặc điểm nào sau đây đúng với quần cư thành thị ở nước ta?",
    [
      "Dân cư thưa thớt, sống phân tán",
      "Hoạt động kinh tế chủ yếu là nông nghiệp",
      "Dân cư tập trung mật độ cao, hoạt động kinh tế chủ yếu là công nghiệp, dịch vụ",
      "Nhà ở chủ yếu là nhà sàn"
    ],
    [2]
  ],
  [
    "Ở nước ta, tình trạng thiếu việc làm diễn ra gay gắt nhất ở khu vực nào?",
    ["Thành thị", "Miền núi", "Ven biển", "Nông thôn"],
    [3]
  ],
  [
    "Hạn chế lớn nhất của nguồn lao động nước ta hiện nay là",
    [
      "thiếu kinh nghiệm sản xuất nông nghiệp",
      "số lượng lao động ít",
      "tỉ lệ lao động đã qua đào tạo còn thấp, thiếu lao động tay nghề cao",
      "lao động không cần cù"
    ],
    [2]
  ],
  [
    "Thế mạnh nổi bật của nguồn lao động nước ta là",
    [
      "có trình độ chuyên môn cao hoàn toàn",
      "số lượng ít nhưng chất lượng cao",
      "chủ yếu làm việc trong ngành công nghệ cao",
      "dồi dào, cần cù, tỉ lệ lao động qua đào tạo ngày càng được nâng cao"
    ],
    [3]
  ],
  [
    "Hai vùng trồng lúa trọng điểm lớn nhất nước ta là",
    [
      "Trung du và miền núi phía Bắc và Tây Nguyên",
      "Đồng bằng sông Hồng và Đồng bằng sông Cửu Long",
      "Bắc Trung Bộ và Duyên hải Nam Trung Bộ",
      "Đông Nam Bộ và Tây Nguyên"
    ],
    [1]
  ],
  [
    "Các cây công nghiệp lâu năm như cà phê, cao su, hồ tiêu ở nước ta được trồng tập trung nhiều nhất ở",
    [
      "Tây Nguyên và Đông Nam Bộ",
      "Đồng bằng sông Hồng",
      "Đồng bằng sông Cửu Long",
      "Trung du và miền núi phía Bắc"
    ],
    [0]
  ],
  [
    "Vùng có sản lượng nuôi trồng thủy sản lớn nhất cả nước là",
    ["Đồng bằng sông Hồng", "Duyên hải Nam Trung Bộ", "Đồng bằng sông Cửu Long", "Bắc Trung Bộ"],
    [2]
  ]
];


/* ──────────────────────────────────────────────────────────────────────
   📤 EXPORT — GỘP THÀNH POOL CÓ SUBJECT
   ────────────────────────────────────────────────────────────────────── */
export default {
  pool: [
    ...Q_ENGLISH.map(q => ({ q, subject: "🇬🇧 Tiếng Anh" })),
    ...Q_GDCD.map(q => ({ q, subject: "⚖️ GDCD" })),
    ...Q_DIALI.map(q => ({ q, subject: "🌍 Địa lí" }))
  ]
};
