/* ══════════════════════════════════════════════════════════════════════
   📦 CONFIG.JS — KHO DATA KIỂM DUYỆT TRUNG TÂM
   ══════════════════════════════════════════════════════════════════════
   ⚠️ FILE NÀY EXPORT NHIỀU THỨ — KHÔNG XOÁ KEY NÀO KHI CHƯA RÕ!
   ══════════════════════════════════════════════════════════════════════ */

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

/* ══ ADMIN ══ */
export const ADMIN_USER      = "phamgiabao";
export const ADMIN_PASS_HASH = "7fd23dbecef914f709fc8be1271cd604d0b808b6e877ab694658b904ab94734d";
export const ADMIN_PROFILE   = { username: "PhamGiaBao", name: "Phạm Gia Bảo", cls: "Admin" };

// ⭐ MỚI — danh sách admin (hỗ trợ nhiều tài khoản admin cùng lúc)
export const ADMIN_LIST = [
  { user: ADMIN_USER, passHash: ADMIN_PASS_HASH, profile: ADMIN_PROFILE },
  {
    user:     "announce-ai",
    passHash: "895f82b0a04402dd1e2cbd0d907938a2f79be70b690d09d4584d42736c9bd8da",
    profile:  { username: "Announce-AI", name: "QUẢN TRỊ", cls: "Admin" }
  }
];

export function findAdmin(username) {
  const u = String(username || "").trim().toLowerCase();
  return ADMIN_LIST.find(a => a.user === u) || null;
}

/* ══ SESSION KEYS ══ */
export const SESSION_KEY      = "qp_session_v2";
export const SESSION_KEY_KHTN = "qp_session_khtn_v1";

/* ══ UNBAN / BAN ══ */
export const UNBAN_NODE       = "config/unbanEpoch";
export const UNBAN_LOCAL_KEY  = "qp_unban_epoch";
export const BAN_PREFIX       = "qpb3_";

/* ══ MUSIC ══ */
export const MUSIC_KEY          = "qp_music";
export const MUSIC_MODE_KEY     = "qp_music_mode";
export const MUSIC_SELECTED_KEY = "qp_music_selected";

/* ══ ĐĂNG KÝ: KHÓA + MÃ + THÔNG BÁO ══ */
export const REGISTRATION_LOCK_NODE  = "config/registrationLock";
export const REGISTRATION_CODES_NODE = "config/codes";
export const ANNOUNCEMENTS_NODE      = "config/announcements";   // ⭐ MỚI

/* ══ TIN NHẮN / THÔNG BÁO — storage key ══ */
export const NEWS_LAST_SEEN_KEY      = "qp_news_last_seen";      // ⭐ MỚI

/* ══ BAD WORDS ══ */
export const BAD_WORDS = [
  'dm','dcm','vcl','đm','đéo','đụ','đĩ','lồn','buồi','cặc','cứt','đít','đái','ỉa',
  'ngu','khốn nạn','mất dạy','cave','điếm','phò','óc chó','súc vật','thằng khùng',
  'con điên','sex','lol','cmm','vl','vãi','địt','djt','dkm','phát','tuất dog'
];

/* ══ MUSIC SONGS ══ */
export const SONGS = [
  { id: 'grateful',        title: 'Grateful',          src: '/onemore/Grateful.mp3' },
  { id: 'shapeofyou',      title: 'Shape of You',      src: '/onemore/ShapeofYou.mp3' },
  { id: 'spencerhillcool', title: 'Spencer Hill Cool', src: '/onemore/Spencerhillcool.mp3' },
  { id: 'haruharu',        title: 'Haru Haru',         src: '/onemore/haruharu.mp3' },
  { id: 'luunien',         title: 'Lưu Niên',          src: '/onemore/luunien.mp3' },
  { id: 'nguoidung',       title: 'Người Dưng',        src: '/onemore/nguoidung.mp3' },
  { id: 'tamthaitu',       title: 'Tam Thái Tử',       src: '/onemore/tamthaitu.mp3' }
];

/* ══ NGƯỠNG CHỐNG GIAN LẬN ══ */
export const MAX_VIOLATIONS      = 100;
export const TAB_SWITCH_WARN     = 2;
export const SUSPICIOUS_TIME_MS  = 15000;
export const MIN_REACTION_MS     = 80;
export const MIN_REACTION_HOVER  = 250;

/* ══ METADATA MÔN HỌC ══ */
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

/* ══ FIREBASE NODE NAMES ══ */
export const LEADERBOARD_LIMIT   = 20;
export const RESULTS_NODE        = "results";
export const RESULTS_KHTN_NODE   = "results_khtn";
export const TOWER_NODE          = "tower";
export const ACCOUNTS_NODE       = "accounts";
export const BANS_NODE           = "bans";
export const TOWER_ACTIVE_NODE   = "tower_active";

/* ══ CUTSCENE / UI ══ */
export const CUTSCENE_DURATION_MS = 5200;
export const SHAKE_VIDEO = "/cutscene/AQMI7DIxFk7q9lxI2gnd1m8Y0pmQCfuMn5qoVlbgxDMGDRaWxYDKGAkC90r4u6TKOa41UY9OHomNh_4qIO2aeUIHG6K70vDNkO0uH5TzdA.mp4";
export const CUTSCENE_HTML = "/cutscene/hieuung1.html";

/* ══ DOMAIN GUARD ══ */
export const ALLOWED_HOSTS = [
  "luyendemaster.vercel.app",
  "localhost",
  "127.0.0.1"
];
export const ENFORCE_DOMAIN_CHECK = true;

/* ══ ADMIN UI ══ */
export const ADMIN_PAGE_SIZE            = 50;
export const ADMIN_SHOW_CREATED_AT      = true;
export const ADMIN_ALLOW_DELETE         = true;
export const ADMIN_SHOW_STUDENT_RESULTS = true;

/* ══ TEXT / BRANDING ══ */
export const SCHOOL_NAME            = "Trường TH&THCS Tân Trụ";
export const SCHOOL_YEAR            = "2026–2027";
export const CUTSCENE_QUOTE         = "Mỗi câu đúng là một bước gần hơn tới điểm 10";
export const TOAST_DURATION         = 4000;
export const CUTSCENE_MIN_DURATION  = 1000;
