/* ══════════════════════════════════════════════════════════════════════
   🔧 UTILS.JS — HELPER THUẦN
   ══════════════════════════════════════════════════════════════════════
   Import bởi: index.html, khoahoctunhien.html, Tower.html, adminpanel.html
   
   Chức năng:
   • esc()              — escape HTML
   • fmtMs()            — format mm:ss.mmm
   • fmtMsShort()       — format mm:ss,cc
   • fmtDate()          — format ngày giờ VN
   • shuffle()          — xáo trộn mảng (Fisher-Yates)
   • levenshtein()      — khoảng cách chỉnh sửa
   • checkTextAnswer()  — so khớp câu trả lời tự luận
   
   ⚠️ FILE NÀY KHÔNG IMPORT GÌ CẢ — độc lập hoàn toàn.
      Tự định nghĩa _norm() riêng để tránh circular dependency với core.js
   ══════════════════════════════════════════════════════════════════════ */


/* ──────────────────────────────────────────────────────────────────────
   1️⃣  ESCAPE HTML — CHỐNG XSS
   ──────────────────────────────────────────────────────────────────────
   Chuyển ký tự đặc biệt thành HTML entity để render an toàn.
   
   Ví dụ:
     esc('<script>')  → '&lt;script&gt;'
     esc('A & B')     → 'A &amp; B'
   ────────────────────────────────────────────────────────────────────── */
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g,
  c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c])
);


/* ──────────────────────────────────────────────────────────────────────
   2️⃣  FORMAT THỜI GIAN
   ────────────────────────────────────────────────────────────────────── */

/**
 * Format thời gian dạng mm:ss.mmm (dùng cho đồng hồ đếm quiz)
 * Ví dụ: 65432ms → "01:05.432"
 */
export function fmtMs(ms) {
  const total = Math.max(0, Number(ms) || 0);
  const m  = Math.floor(total / 60000);
  const s  = Math.floor((total % 60000) / 1000);
  const cs = Math.floor(total % 1000);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(3, "0")}`;
}

/**
 * Format thời gian dạng mm:ss,cc (dùng cho bảng xếp hạng)
 * Ví dụ: 65432ms → "01:05,43"
 */
export function fmtMsShort(ms) {
  const total = Math.max(0, Number(ms) || 0);
  const m  = Math.floor(total / 60000);
  const s  = Math.floor((total % 60000) / 1000);
  const cs = Math.floor((total % 1000) / 10);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(cs).padStart(2, "0")}`;
}

/**
 * Format ngày giờ VN từ Firebase Timestamp / Date / number.
 * Firebase Timestamp có dạng { seconds, nanoseconds }.
 * Firestore có hàm .toDate().
 * 
 * Ví dụ:
 *   fmtDate({seconds: 1700000000})  → "15/11/2023, 09:13"
 *   fmtDate(1700000000000)          → "15/11/2023, 09:13"
 *   fmtDate(new Date())             → "..." (ngày hiện tại)
 *   fmtDate(null)                   → "—"
 */
export function fmtDate(d) {
  if (!d) return "—";

  let dt;
  if (typeof d === "object" && typeof d.toDate === "function") {
    dt = d.toDate();                     // Firestore Timestamp
  } else if (typeof d === "object" && typeof d.seconds === "number") {
    dt = new Date(d.seconds * 1000);     // Realtime DB Timestamp
  } else if (typeof d === "number") {
    dt = new Date(d);                    // Epoch ms
  } else {
    dt = new Date(d);
  }

  if (isNaN(dt.getTime())) return "—";

  return dt.toLocaleString("vi-VN", {
    day:    "2-digit",
    month:  "2-digit",
    year:   "2-digit",
    hour:   "2-digit",
    minute: "2-digit"
  });
}


/* ──────────────────────────────────────────────────────────────────────
   3️⃣  SHUFFLE — XÁO TRỘN MẢNG
   ──────────────────────────────────────────────────────────────────────
   Thuật toán Fisher-Yates — phân phối đều, không thiên vị.
   Xáo trộn trực tiếp mảng gốc và trả về chính mảng đó.
   
   Ví dụ:
     shuffle([1,2,3,4,5])  → [3,1,5,2,4] (ngẫu nhiên)
   ────────────────────────────────────────────────────────────────────── */
export function shuffle(arr) {
  if (!Array.isArray(arr)) return arr;
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}


/* ──────────────────────────────────────────────────────────────────────
   4️⃣  LEVENSHTEIN — KHOẢNG CÁCH CHỈNH SỬA
   ──────────────────────────────────────────────────────────────────────
   Đo số phép biến đổi tối thiểu (thêm/xoá/thay ký tự) để biến chuỗi a → b.
   Dùng để so khớp câu trả lời tự luận có lỗi chính tả nhỏ.
   
   Ví dụ:
     levenshtein("kitten", "sitting")  → 3
     levenshtein("hello", "helo")      → 1
   ────────────────────────────────────────────────────────────────────── */
export function levenshtein(a, b) {
  const A = String(a || "");
  const B = String(b || "");

  if (!A.length) return B.length;
  if (!B.length) return A.length;

  // Tối ưu: dùng 1 mảng 2 hàng thay vì matrix đầy đủ
  let prev = new Array(B.length + 1);
  let curr = new Array(B.length + 1);

  for (let j = 0; j <= B.length; j++) prev[j] = j;

  for (let i = 1; i <= A.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= B.length; j++) {
      const cost = A[i - 1] === B[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,        // xoá
        curr[j - 1] + 1,    // thêm
        prev[j - 1] + cost  // thay
      );
    }
    [prev, curr] = [curr, prev];
  }

  return prev[B.length];
}


/* ──────────────────────────────────────────────────────────────────────
   5️⃣  CHECK TEXT ANSWER — SO KHỚP CÂU TRẢ LỜI TỰ LUẬN
   ──────────────────────────────────────────────────────────────────────
   Chấm điểm câu tự luận với 3 tầng ưu tiên:
   
   Tầng 1: Nếu có keywords → user phải chứa ĐỦ tất cả keyword
   Tầng 2: So khớp chính xác (sau khi normalize)
   Tầng 3: So khớp mờ (Levenshtein, ngưỡng 80%)
   
   Ví dụ:
     checkTextAnswer("Con mèo", ["con mèo"])                       → true
     checkTextAnswer("Con meo", ["con mèo"])                       → true (bỏ dấu)
     checkTextAnswer("The cat", ["con mèo"])                       → false
     checkTextAnswer("mèo đen", ["đen", "mèo"])                    → true (keywords)
     checkTextAnswer("mèo", ["đen", "mèo"])                        → false (thiếu "đen")
   
   @param {string} userStr     — câu trả lời của user
   @param {string[]} correctList — danh sách đáp án đúng
   @param {string[]} [keywords] — nếu có, user phải chứa ĐỦ tất cả
   @returns {boolean}
   ────────────────────────────────────────────────────────────────────── */

// Hàm normalize nội bộ — KHÔNG import từ core.js để giữ file độc lập
function _norm(s) {
  return String(s || "").toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[.,!?;:'"()\-–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function checkTextAnswer(userStr, correctList, keywords = null) {
  if (!userStr) return false;

  const u = _norm(userStr);
  if (!u) return false;

  // Tầng 1: keyword matching (chặt)
  if (keywords && keywords.length) {
    return keywords.every(k => u.includes(_norm(k)));
  }

  // Tầng 2: so khớp chính xác (sau normalize)
  const normedList = (correctList || []).map(_norm);

  for (const a of normedList) {
    if (!a) continue;
    if (u === a) return true;          // bằng nhau
    if (u.includes(a)) return true;    // user dài hơn đáp án
    if (a.includes(u)) return true;    // user ngắn hơn đáp án
  }

  // Tầng 3: so khớp mờ (chịu được lỗi chính tả nhỏ)
  for (const a of normedList) {
    if (!a) continue;
    const dist = levenshtein(u, a);
    const maxLen = Math.max(u.length, a.length);
    if (maxLen > 0 && (1 - dist / maxLen) >= 0.8) {
      return true;
    }
  }

  return false;
}


/* ──────────────────────────────────────────────────────────────────────
   6️⃣  BONUS — CÁC HELPER TIỆN DỤNG KHÁC
   ────────────────────────────────────────────────────────────────────── */

/**
 * Debounce — trì hoãn gọi hàm cho đến khi ngừng kích hoạt đủ lâu.
 * Rất hữu ích cho search box.
 * 
 * Ví dụ:
 *   const search = debounce(fn, 300);
 *   input.oninput = e => search(e.target.value);
 */
export function debounce(fn, wait = 300) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

/**
 * Tạo ID ngẫu nhiên ngắn (dùng cho tracking).
 * Không dùng làm ID bảo mật!
 */
export function shortId(len = 8) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

/**
 * Đếm số câu đã làm trong mảng answers.
 * answers[i] = [] hoặc [0] hoặc [0,2] — mảng đáp án đã chọn.
 */
export function countDone(answers) {
  if (!Array.isArray(answers)) return 0;
  return answers.filter(a => Array.isArray(a) ? a.length > 0 : a != null && a !== -1).length;
}

/**
 * Format điểm số: bỏ ".0" thừa, đổi "." → "," theo chuẩn VN.
 * 
 * Ví dụ:
 *   fmtScore(10)     → "10"
 *   fmtScore(7.5)    → "7,5"
 *   fmtScore(8.25)   → "8,25"
 */
export function fmtScore(x) {
  const n = Number(x);
  if (isNaN(n)) return "0";
  return String(n).replace(".", ",");
}

/**
 * Sleep — chờ n milliseconds (dùng trong async).
 */
export function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}


/* ══════════════════════════════════════════════════════════════════════
   ✅ HẾT UTILS.JS
   
   📌 DANH SÁCH EXPORT:
   
   Core helpers:
     • esc(s)                                → string
     • fmtMs(ms)                             → "mm:ss.mmm"
     • fmtMsShort(ms)                        → "mm:ss,cc"
     • fmtDate(d)                            → "dd/mm/yy, hh:mm"
     • shuffle(arr)                          → arr (xáo trộn)
     • levenshtein(a, b)                     → number
     • checkTextAnswer(user, correct, kw)    → boolean
   
   Bonus helpers:
     • debounce(fn, wait)                    → function
     • shortId(len)                          → string
     • countDone(answers)                    → number
     • fmtScore(x)                           → string
     • sleep(ms)                             → Promise
   ══════════════════════════════════════════════════════════════════════ */
