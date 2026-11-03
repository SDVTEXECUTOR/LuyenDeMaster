/* ══════════════════════════════════════════════════════════════════════
   📦 CONFIG.JS — KHO DATA KIỂM DUYỆT TRUNG TÂM
   ══════════════════════════════════════════════════════════════════════
   CHỈ CHỨA DATA, KHÔNG CHỨA LOGIC.
   Sửa 1 chỗ → áp dụng cho cả 4 trang (index, khoahoctunhien, Tower, adminpanel)
   ══════════════════════════════════════════════════════════════════════ */


/* ── 1️⃣  FIREBASE CONFIG ── */
export const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyCP4hMfT_9FwQabvi2KnlvqCxpCeFMCqeo",
  authDomain:        "nightshift-51ded.firebaseapp.com",
  databaseURL:       "https://nightshift-51ded-default-rtdb.firebaseio.com",
  projectId:         "nightshift-51ded",
  storageBucket:     "nightshift-51ded.firebasestorage.app",
  messagingSenderId: "1239554748",
  appId:             "1:1239554748:web:eb24bca244c1fcd7fcceb9",
  measurementId:     "G-DCZKWE7403"
};


/* ── 2️⃣  ADMIN ── */
export const ADMIN_USER      = "phamgiabao";
export const ADMIN_PASS_HASH = "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4";
// ⚠️ Hash của mật khẩu "1234" — nên đổi thành mật khẩu mạnh
// Đổi pass: https://emn178.github.io/online-tools/sha256.html

export const ADMIN_PROFILE = {
  username: "PhamGiaBao",
  name:     "Phạm Gia Bảo",
  cls:      "Admin"
};


/* ── 3️⃣  KEY LOCALSTORAGE / FIREBASE NODE ── */
export const SESSION_KEY      = "qp_session_v2";
export const SESSION_KEY_KHTN = "qp_session_khtn_v1";
export const UNBAN_NODE       = "config/unbanEpoch";
export const UNBAN_LOCAL_KEY  = "qp_unban_epoch";
export const BAN_PREFIX       = "qpb3_";
export const MUSIC_KEY          = "qp_music";
export const MUSIC_MODE_KEY     = "qp_music_mode";
export const MUSIC_SELECTED_KEY = "qp_music_selected";


/* ── 4️⃣  BANNED WORDS — DANH SÁCH TỪ CẤM ── */
export const BAD_WORDS = [
  // Viết tắt bậy
  'dm', 'dcm', 'vcl', 'vl', 'vãi', 'cmm', 'djt', 'dkm', 'đm', 'đéo',
  // Tục tĩu / bộ phận cơ thể
  'đụ', 'đĩ', 'lồn', 'buồi', 'cặc', 'cứt', 'đít', 'đái', 'ỉa', 'địt',
  // Chửi / xúc phạm
  'ngu', 'khốn nạn', 'mất dạy', 'óc chó', 'súc vật',
  'thằng khùng', 'con điên', 'tuất dog',
  // Nhạy cảm
  'cave', 'điếm', 'phò', 'sex',
  // Khác
  'lol', 'phát'
];


/* ── 5️⃣  SONGS — DANH SÁCH BÀI HÁT NỀN ── */
export const SONGS = [
  { id: 'grateful',        title: 'Grateful',           src: '/onemore/Grateful.mp3' },
  { id: 'shapeofyou',      title: 'Shape of You',       src: '/onemore/ShapeofYou.mp3' },
  { id: 'spencerhillcool', title: 'Spencer Hill Cool',  src: '/onemore/Spencerhillcool.mp3' },
  { id: 'haruharu',        title: 'Haru Haru',          src: '/onemore/haruharu.mp3' },
  { id: 'luunien',         title: 'Lưu Niên',           src: '/onemore/luunien.mp3' },
  { id: 'nguoidung',       title: 'Người Dưng',         src: '/onemore/nguoidung.mp3' },
  { id: 'tamthaitu',       title: 'Tam Thái Tử',        src: '/onemore/tamthaitu.mp3' }
];


/* ── 6️⃣  THRESHOLDS — NGƯỠNG ANTI-CHEAT ── */
export const MAX_VIOLATIONS      = 100;    // KHTN: quá số lần → tự nộp
export const TAB_SWITCH_WARN     = 2;      // index: chuyển tab lần mấy thì cảnh báo
export const SUSPICIOUS_TIME_MS  = 15000;  // < 15s mà 10 điểm → nghi auto
export const MIN_REACTION_MS     = 80;     // Tower: click < 80ms → nghi tool
export const MIN_REACTION_HOVER  = 250;    // Tower: click < 250ms không hover → nghi tool


/* ── 7️⃣  SUBJECTS META — METADATA MÔN HỌC ── */
export const SUBJECTS_META = {
  tinhoc:  { label: "Tin học 9",   icon: "💻", allAtOnce: false },
  gdcd:    { label: "GDCD 9",      icon: "⚖️", allAtOnce: false },
  english: { label: "Tiếng Anh 9", icon: "🇬🇧", allAtOnce: true  },
  diali:   { label: "Địa lí 9",    icon: "🌍", allAtOnce: false }
};

export const LEADERBOARD_SUBJECTS_META = {
  ...SUBJECTS_META,
  diali_choice:   { label: "Địa lí 9 (Khoanh)",  icon: "🌍", allAtOnce: false },
  diali_manual:   { label: "Địa lí 9 (Ghi)",     icon: "✍️", allAtOnce: false },
  diali_memory:   { label: "Địa lí 9 (Ghi nhớ)", icon: "🧠", allAtOnce: false },
  khoahoctunhien: { label: "KHTN 9",             icon: "🧪", allAtOnce: false }
};


/* ── 8️⃣  LEADERBOARD & FIREBASE NODES ── */
export const LEADERBOARD_LIMIT   = 20;
export const RESULTS_NODE        = "results";
export const RESULTS_KHTN_NODE   = "results_khtn";
export const TOWER_NODE          = "tower";
export const ACCOUNTS_NODE       = "accounts";
export const BANS_NODE           = "bans";
export const TOWER_ACTIVE_NODE   = "tower_active";


/* ── 9️⃣  CUTSCENE ── */
export const CUTSCENE_DURATION_MS = 5200;
export const SHAKE_VIDEO = "/cutscene/AQMI7DIxFk7q9lxI2gnd1m8Y0pmQCfuMn5qoVlbgxDMGDRaWxYDKGAkC90r4u6TKOa41UY9OHomNh_4qIO2aeUIHG6K70vDNkO0uH5TzdA.mp4";
export const CUTSCENE_HTML = "/cutscene/hieuung1.html";


/* ── 🔟  DOMAIN ALLOWLIST ── */
export const ALLOWED_HOSTS = [
  "luyendemaster.vercel.app",
  "localhost",
  "127.0.0.1"
];
export const ENFORCE_DOMAIN_CHECK = true;


/* ── 1️⃣1️⃣  ADMIN PANEL ── */
export const ADMIN_PAGE_SIZE            = 50;
export const ADMIN_SHOW_CREATED_AT      = true;
export const ADMIN_ALLOW_DELETE         = true;
export const ADMIN_SHOW_STUDENT_RESULTS = true;


/* ── 1️⃣2️⃣  MISC ── */
export const SCHOOL_NAME            = "Trường TH&THCS Tân Trụ";
export const SCHOOL_YEAR            = "2026–2027";
export const CUTSCENE_QUOTE         = "Mỗi câu đúng là một bước gần hơn tới điểm 10";
export const TOAST_DURATION         = 4000;
export const CUTSCENE_MIN_DURATION  = 1000;


/* ══════════════════════════════════════════════════════════════════════
   ✅ HẾT — Không cần sửa gì bên dưới
   ══════════════════════════════════════════════════════════════════════ */
