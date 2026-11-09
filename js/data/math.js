/* ══════════════════════════════════════════════════════════════════════
   📐 MATH.JS — ĐỀ TOÁN 9 GIỮA HỌC KÌ I
   ══════════════════════════════════════════════════════════════════════
   Nguồn: De-bai-Toan.docx
   Cấu trúc:
     - MATH_PART_I  : 12 câu trắc nghiệm (Part I)
     - MATH_PART_II : 8 câu tự luận   (Câu 13 → 21)

   Format mỗi câu Part I:
     { q, options: [A,B,C,D], answer: index }

   Format mỗi câu Part II:
     {
       id: số câu trong đề,
       intro: đề bài,
       note: hướng dẫn (nếu có),
       subs: [ ...các câu con... ]
     }

   Các loại sub:
     - { type: "mcq",       q, options, answer }
     - { type: "pair",      q, labels: [x, y], answer: [xVal, yVal], tolerance? }
     - { type: "cmp",       q, answer: "<" | ">" | "=" }
     - { type: "num",       q, answer, tolerance? }
     - { type: "solutions", q, answers: [...], tolerance? }
   ══════════════════════════════════════════════════════════════════════ */


/* ══════════════════════════════════════════════════════════════════════
   PHẦN I — TRẮC NGHIỆM (12 câu)
   ══════════════════════════════════════════════════════════════════════ */
export const MATH_PART_I = [
  /* ── Câu 1 ── */
  {
    q: "Trong các phương trình sau, phương trình nào là phương trình bậc nhất hai ẩn?",
    options: [
      "4x − 3y = 2",
      "x² + 2x − 1 = 0",
      "5x² − 3 = 0",
      "2/x − x = 7"
    ],
    answer: 0
  },

  /* ── Câu 2 ── */
  {
    q: "Cặp số nào sau đây là một nghiệm của phương trình 5x + 4y = 8?",
    options: ["(−1; 2)", "(0; 2)", "(−1; 0)", "(2; −1)"],
    answer: 1
    // (0; 2): 5·0 + 4·2 = 8 ✓
  },

  /* ── Câu 3 ── */
  {
    q: "Trong các hệ phương trình sau, hệ nào <b>không phải</b> là hệ phương trình bậc nhất hai ẩn?",
    options: [
      "{ 3x − y = 5 ; x + 2y = −1 }",
      "{ −3y = 6 ; 3x + 5y = 15 }",
      "{ x² − 4y² = 0 ; 2x + 5y = 7 }",
      "{ 2x − 3y = −3 ; 3x − 15 = 0 }"
    ],
    answer: 2
    // (C) chứa x², y² → không phải bậc nhất
  },

  /* ── Câu 4 ── */
  {
    q: "Hệ phương trình { 2x − 3y = −1 ; x + 5y = 6 } có nghiệm là:",
    options: ["(−4; 2)", "(4; 3)", "(0; 1/3)", "(1; 1)"],
    answer: 3
    // (1;1): 2−3=−1 ✓ ; 1+5=6 ✓
  },

  /* ── Câu 5 ── */
  {
    q: "Cho hai số a, b được biểu diễn trên trục số: <b>a &lt; 0 &lt; 1 &lt; b</b>. Phát biểu nào sau đây là đúng?",
    options: [
      "a &lt; b và b &lt; 0",
      "0 &lt; b và b &lt; a",
      "a &lt; 0 và 0 &lt; b",
      "0 &lt; a và a &lt; b"
    ],
    answer: 2
    // a nằm bên trái 0 (âm), b nằm bên phải 1 (dương)
  },

  /* ── Câu 6 ── */
  {
    q: "Bất phương trình nào sau đây là bất phương trình bậc nhất một ẩn?",
    options: [
      "−2x² + 5 &gt; 0",
      "3x − y ≤ 0",
      "5 + 0x ≥ −7",
      "x − 2 &lt; 0"
    ],
    answer: 3
    // (D) x − 2 < 0 ⇔ x < 2
  },

  /* ── Câu 7 ── */
  {
    q: "Nghiệm của bất phương trình 3x − 6 &gt; 0 là:",
    options: ["x &gt; 2", "x = −2", "x = 2", "x &gt; −2"],
    answer: 0
    // 3x > 6 ⇔ x > 2
  },

  /* ── Câu 8 ── */
  {
    q: "Nếu 3a ≥ 3b thì:",
    options: ["a ≥ b", "a &lt; b", "a &gt; b", "a ≤ b"],
    answer: 0
    // Chia 2 vế cho 3 (>0) → giữ chiều
  },

  /* ── Câu 9 ── */
  {
    q: "Căn bậc hai số học của 144 là:",
    options: ["144 và −144", "12 và −12", "12", "−12"],
    answer: 2
    // Căn bậc hai SỐ HỌC chỉ lấy giá trị không âm → 12
  },

  /* ── Câu 10 ── */
  {
    q: "Số 1/4 và −1/4 là các căn bậc hai của số nào trong các số dưới đây?",
    options: ["1/8", "1/16", "1/2", "−1/16"],
    answer: 1
    // (1/4)² = 1/16 ; (−1/4)² = 1/16
  },

  /* ── Câu 11 ── */
  {
    q: "x = 1 là một nghiệm của bất phương trình nào dưới đây?",
    options: [
      "2x − 1 &lt; 1",
      "2x + 1 &lt; 1",
      "2x + 1 &gt; 2",
      "2x + 1 &gt; 5"
    ],
    answer: 2
    // Thay x=1: (A) 1<1 SAI; (B) 3<1 SAI; (C) 3>2 ĐÚNG; (D) 3>5 SAI
  },

  /* ── Câu 12 ── */
  {
    q: "Khẳng định nào sau đây là <b>SAI</b>?",
    options: [
      "−√36 = −6",
      "√(−0,2)² = −0,2",
      "−√(−0,5)² = −0,5",
      "√0,09 = 0,3"
    ],
    answer: 1
    // (B) sai vì √(−0,2)² = |−0,2| = 0,2 (không phải −0,2)
  }
];


/* ══════════════════════════════════════════════════════════════════════
   PHẦN II — TỰ LUẬN (Câu 13 → Câu 21)
   ══════════════════════════════════════════════════════════════════════ */
export const MATH_PART_II = [

  /* ═══════════ Câu 13 ═══════════ */
  {
    id: 13,
    intro: "Trong các phương trình:<br>a) −x + 2y = 5&nbsp;&nbsp;&nbsp;&nbsp;b) 2x² + 3y = 0&nbsp;&nbsp;&nbsp;&nbsp;c) −2x + y = 5&nbsp;&nbsp;&nbsp;&nbsp;d) 2x² − 3y = 0",
    note: "Phương trình nào là phương trình bậc nhất hai ẩn? Tìm hệ số a, b, c của phương trình bậc nhất hai ẩn đó.",
    subs: [
      {
        type: "mcq",
        q: "Phương trình nào là phương trình bậc nhất hai ẩn?",
        options: ["a) và c)", "b) và a)", "b) và d)", "c) và d)"],
        answer: 0
      },
      {
        type: "pair",
        q: "Hệ số (a; b; c) của phương trình a) −x + 2y = 5:",
        labels: ["a", "b", "c"],
        answer: [-1, 2, 5]
      },
      {
        type: "pair",
        q: "Hệ số (a; b; c) của phương trình c) −2x + y = 5:",
        labels: ["a", "b", "c"],
        answer: [-2, 1, 5]
      }
    ]
  },

  /* ═══════════ Câu 14 ═══════════ */
  {
    id: 14,
    intro: "Cho <b>a &gt; b</b>, so sánh:",
    note: "Chọn dấu thích hợp: <, >, =",
    subs: [
      { type: "cmp", q: "a) a + 2026 ___ b + 2026", answer: ">" },
      { type: "cmp", q: "b) a + b + 5 ___ 2b + 5", answer: ">" },
      { type: "cmp", q: "c) −2 + 3a ___ −2 + 3b", answer: ">" }
    ]
    // a>b ⇒ a+2026 > b+2026 ✓
    // a>b ⇒ a+b > b+b = 2b ⇒ a+b+5 > 2b+5 ✓
    // a>b ⇒ 3a>3b ⇒ −2+3a > −2+3b ✓
  },

  /* ═══════════ Câu 15 ═══════════ */
  {
    id: 15,
    intro: "Dùng máy tính cầm tay tính căn bậc hai, căn bậc ba (làm tròn đến chữ số thập phân thứ hai):",
    note: "Nhập số thập phân, dùng dấu chấm (VD: 0.80, -3.04)",
    subs: [
      { type: "num", q: "a) √(7/11) ≈", answer: 0.80, tolerance: 0.005 },
      { type: "num", q: "b) ∛(−28) ≈", answer: -3.04, tolerance: 0.005 },
      { type: "num", q: "c) √(7/13) ≈", answer: 0.73, tolerance: 0.005 },
      { type: "num", q: "d) ∛(−18) ≈", answer: -2.62, tolerance: 0.005 }
    ]
    // √(7/11) = 0.79772... → 0.80
    // ∛(−28) = −3.03658... → −3.04
    // √(7/13) = 0.73380... → 0.73
    // ∛(−18) = −2.62074... → −2.62
  },

  /* ═══════════ Câu 16 ═══════════ */
  {
    id: 16,
    intro: "Dùng máy tính cầm tay, tìm nghiệm các hệ phương trình sau:",
    note: "Nhập giá trị x và y (có thể ghi phân số VD: 20/9)",
    subs: [
      {
        type: "pair",
        q: "a) { 2x − 11y = −7 ; 10x + 11y = 31 }",
        labels: ["x", "y"],
        answer: [2, 1]
        // Cộng 2 pt: 12x = 24 → x=2 → y=1
      },
      {
        type: "pair",
        q: "b) { x − 5y = 2 ; −2x + 5y = 1 }",
        labels: ["x", "y"],
        answer: [-3, -1]
        // Cộng 2 pt: −x = 3 → x=−3 → y=−1
      },
      {
        type: "pair",
        q: "c) { x + 3y = −2 ; 5x + 8y = 11 }",
        labels: ["x", "y"],
        answer: [7, -3]
        // x=−2−3y → 5(−2−3y)+8y=11 → −10−15y+8y=11 → −7y=21 → y=−3 → x=7
      }
    ]
  },

  /* ═══════════ Câu 17 ═══════════ */
  {
    id: 17,
    intro: "Giải phương trình:",
    note: "Nếu có nhiều nghiệm, cách nhau bằng dấu chấm phẩy (VD: 4; -6). Có thể ghi phân số (VD: 20/9).",
    subs: [
      { type: "solutions", q: "a) (5x − 20)(x + 6) = 0", answers: [4, -6] },
      { type: "solutions", q: "b) 1/x = 5 / [3(x + 2)]", answers: [3] },
      { type: "solutions", q: "c) (6x − 30)(x + 7) = 0", answers: [5, -7] },
      { type: "solutions", q: "d) 2/x = 1 / [5(x − 2)]", answers: [20 / 9], tolerance: 0.01 }
    ]
    // a) x = 4 hoặc x = −6
    // b) 3(x+2) = 5x → 3x+6=5x → x=3 (ĐK x≠0, x≠−2, thoả)
    // c) x = 5 hoặc x = −7
    // d) 10(x−2) = x → 10x−20=x → 9x=20 → x=20/9 (ĐK x≠0, x≠2, thoả)
  },

  /* ═══════════ Câu 18 ═══════════ */
  {
    id: 18,
    intro: "Rút gọn biểu thức:",
    note: "",
    subs: [
      {
        type: "num",
        q: "A = √[(1 − √2)²] − √2",
        answer: -1,
        tolerance: 0.01
        // |1−√2| − √2 = (√2−1) − √2 = −1 (vì 1<√2)
      },
      {
        type: "mcq",
        q: "B = (x − y)/(5√x − 5√y) với x &gt; 0, y &gt; 0, x ≠ y",
        options: [
          "(√x + √y)/5",
          "(√x − √y)/5",
          "(x − y)/5",
          "(x + y)/5"
        ],
        answer: 0
        // (√x−√y)(√x+√y) / [5(√x−√y)] = (√x+√y)/5
      },
      {
        type: "num",
        q: "C = √[(1 − √3)²] − √3",
        answer: -1,
        tolerance: 0.01
        // |1−√3| − √3 = (√3−1) − √3 = −1 (vì 1<√3)
      },
      {
        type: "mcq",
        q: "D = (a − b)/(7√a + 7√b) với a &gt; 0, b &gt; 0, a ≠ b",
        options: [
          "(√a + √b)/7",
          "(√a − √b)/7",
          "(a − b)/7",
          "(a + b)/7"
        ],
        answer: 1
        // (√a−√b)(√a+√b) / [7(√a+√b)] = (√a−√b)/7
      }
    ]
  },

  /* ═══════════ Câu 19 ═══════════ */
  {
    id: 19,
    intro: "Một hợp tác xã vận tải có <b>15 xe ô tô nhỏ</b> và <b>10 xe ô tô lớn</b> thì vận chuyển được <b>900 khách</b>. Nếu hợp tác xã rút bớt <b>5 xe ô tô nhỏ</b> và tăng thêm <b>4 xe ô tô lớn</b> thì số khách chở được <b>tăng thêm 30 người</b>. Hỏi mỗi loại xe chở được bao nhiêu người?",
    note: "Gọi x = số khách xe nhỏ, y = số khách xe lớn",
    subs: [
      {
        type: "pair",
        q: "Số khách mỗi xe nhỏ (x) và mỗi xe lớn (y):",
        labels: ["x (xe nhỏ)", "y (xe lớn)"],
        answer: [30, 45]
        // 15x + 10y = 900 ; 10x + 14y = 930
        // → 3x+2y=180 ; 5x+7y=465 → x=30, y=45
      }
    ]
  },

  /* ═══════════ Câu 20 ═══════════ */
  {
    id: 20,
    intro: "Cho <b>m &lt; n</b>, so sánh:",
    note: "Chọn dấu thích hợp: <, >, =",
    subs: [
      { type: "cmp", q: "a) m + 2026 ___ n + 2026", answer: "<" },
      { type: "cmp", q: "b) m + n + 1 ___ 2n + 1", answer: "<" },
      { type: "cmp", q: "c) 2 − 3m ___ 2 − 3n", answer: ">" }
    ]
    // m<n ⇒ m+2026 < n+2026 ✓
    // m<n ⇒ m+n < n+n = 2n ⇒ m+n+1 < 2n+1 ✓
    // m<n ⇒ 3m<3n ⇒ −3m>−3n ⇒ 2−3m > 2−3n ✓
  },

  /* ═══════════ Câu 21 ═══════════ */
  {
    id: 21,
    intro: "Một hợp tác xã vận tải có <b>15 xe ô tô nhỏ</b> và <b>10 xe ô tô lớn</b> thì vận chuyển được <b>690 khách</b>. Nếu hợp tác xã rút bớt <b>10 xe ô tô nhỏ</b> và tăng thêm <b>4 xe ô tô lớn</b> thì số khách chở được <b>tăng thêm 20 người</b>. Hỏi mỗi loại xe chở được bao nhiêu người?",
    note: "Gọi x = số khách xe nhỏ, y = số khách xe lớn",
    subs: [
      {
        type: "pair",
        q: "Số khách mỗi xe nhỏ (x) và mỗi xe lớn (y):",
        labels: ["x (xe nhỏ)", "y (xe lớn)"],
        answer: [16, 45]
        // 15x + 10y = 690 ; 5x + 14y = 710
        // → 3x+2y=138 ; 5x+14y=710 → x=16, y=45
      }
    ]
  }
];


/* ══════════════════════════════════════════════════════════════════════
   DEFAULT EXPORT — gói gọn 2 phần
   ══════════════════════════════════════════════════════════════════════
   Cách dùng trong HTML:
     import mathData from '/js/data/math.js';
     const PART_I  = mathData.part1;
     const PART_II = mathData.part2;

   Hoặc:
     import { MATH_PART_I, MATH_PART_II } from '/js/data/math.js';
   ══════════════════════════════════════════════════════════════════════ */
export default {
  part1: MATH_PART_I,
  part2: MATH_PART_II
};


/* ══════════════════════════════════════════════════════════════════════
   📋 BẢNG ĐÁP ÁN NHANH (để đối chiếu khi test)
   ══════════════════════════════════════════════════════════════════════

   PART I — TRẮC NGHIỆM (12 câu):
     1.A   2.B   3.C   4.D   5.C   6.D
     7.A   8.A   9.C  10.B  11.C  12.B

   PART II — TỰ LUẬN:

     Câu 13:
       - Pt bậc nhất 2 ẩn: a) và c)
       - a) −x + 2y = 5   → (a;b;c) = (−1; 2; 5)
       - c) −2x + y = 5   → (a;b;c) = (−2; 1; 5)

     Câu 14 (a > b):
       a) a + 2026  >  b + 2026
       b) a + b + 5 >  2b + 5
       c) −2 + 3a   >  −2 + 3b

     Câu 15 (làm tròn 2 chữ số TP):
       a) √(7/11) ≈ 0.80
       b) ∛(−28)  ≈ −3.04
       c) √(7/13) ≈ 0.73
       d) ∛(−18)  ≈ −2.62

     Câu 16:
       a) (x; y) = (2; 1)
       b) (x; y) = (−3; −1)
       c) (x; y) = (7; −3)

     Câu 17:
       a) x = 4  hoặc  x = −6
       b) x = 3
       c) x = 5  hoặc  x = −7
       d) x = 20/9

     Câu 18:
       A = −1
       B = (√x + √y)/5
       C = −1
       D = (√a − √b)/7

     Câu 19: xe nhỏ = 30 khách, xe lớn = 45 khách
     Câu 20 (m < n):
       a) m + 2026  <  n + 2026
       b) m + n + 1 <  2n + 1
       c) 2 − 3m    >  2 − 3n
     Câu 21: xe nhỏ = 16 khách, xe lớn = 45 khách

   ══════════════════════════════════════════════════════════════════════ */
