/* ══════════════════════════════════════════════════════════════════════
   🧠 CORE.JS — LOGIC DÙNG CHUNG
   ══════════════════════════════════════════════════════════════════════
   Import bởi: index.html, khoahoctunhien.html, Tower.html, adminpanel.html
   
   Chức năng:
   • Firebase init (export db)
   • Session: get/save/load/clear/isAdmin
   • Normalize: normText / nameHash
   • Kiểm duyệt: checkProfanity
   • Keys: keyOf / getBanKey / getViolationKey
   • Ban local: checkLocalBan / setLocalBan / clearAllLocalBans
   • Ban Firebase: checkFirebaseBan / recordFirebaseViolation / recordViolation
   • Unban: syncUnbanEpoch
   • Domain check: checkDomain / showDomainWarning
   ══════════════════════════════════════════════════════════════════════ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
  FIREBASE_CONFIG,
  SESSION_KEY, SESSION_KEY_KHTN,
  UNBAN_NODE, UNBAN_LOCAL_KEY, BAN_PREFIX,
  BAD_WORDS, ADMIN_USER,
  ALLOWED_HOSTS, ENFORCE_DOMAIN_CHECK
} from "./config.js";


/* ──────────────────────────────────────────────────────────────────────
   1️⃣  FIREBASE INIT
   ────────────────────────────────────────────────────────────────────── */
let _db = null;
try {
  _db = getDatabase(initializeApp(FIREBASE_CONFIG));
} catch (e) {
  console.warn("[core] Firebase init error:", e);
}
export const db = _db;


/* ──────────────────────────────────────────────────────────────────────
   2️⃣  SESSION — QUẢN LÝ PHIÊN ĐĂNG NHẬP
   ────────────────────────────────────────────────────────────────────── */
let _session = null;

/** Lấy session hiện tại (có thể null) */
export function getSession() {
  return _session;
}

/** Lưu session vào memory + localStorage (mirror cả key chính + key KHTN) */
export function saveSession(s) {
  if (!s) return;
  _session = s;
  const str = JSON.stringify(s);
  try {
    localStorage.setItem(SESSION_KEY, str);
    localStorage.setItem(SESSION_KEY_KHTN, str);
  } catch (e) {
    console.warn("[core] saveSession:", e);
  }
}

/** Đọc session từ localStorage — KHÔNG tự gán vào _session */
export function loadSession() {
  try {
    const v = localStorage.getItem(SESSION_KEY_KHTN)
           || localStorage.getItem(SESSION_KEY);
    return v ? JSON.parse(v) : null;
  } catch (e) {
    return null;
  }
}

/** Xoá session khỏi memory + localStorage */
export function clearSession() {
  _session = null;
  [SESSION_KEY, SESSION_KEY_KHTN].forEach(k => {
    try { localStorage.removeItem(k); } catch (e) {}
  });
}

/** Kiểm tra session hiện tại có phải admin không */
export function isAdminSession() {
  return !!(_session && _session.isAdmin === true);
}

/** Kiểm tra 1 username có phải admin không (không cần session) */
export function isAdminUsername(username) {
  return String(username || "").trim().toLowerCase() === ADMIN_USER;
}


/* ──────────────────────────────────────────────────────────────────────
   3️⃣  NORMALIZE — CHUẨN HOÁ CHUỖI
   ────────────────────────────────────────────────────────────────────── */

/** Chuẩn hoá chuỗi: lowercase + bỏ dấu + bỏ ký tự đặc biệt + gộp space */
export function normText(s) {
  return String(s || "").toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[.,!?;:'"()\-–—]/g, " ")
    .replace(/\s+/g, " ").trim();
}

/** Hash tên để làm key localStorage (bỏ dấu + thay space bằng _) */
export function nameHash(name) {
  return normText(name || "").replace(/\s+/g, "_");
}


/* ──────────────────────────────────────────────────────────────────────
   4️⃣  KIỂM DUYỆT — CHỬI TỤC / TỪ CẤM
   ────────────────────────────────────────────────────────────────────── */

// Regex kiểm tra có dấu tiếng Việt
const _ACCENT_RE = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;

/**
 * Kiểm tra chuỗi có chứa từ cấm không.
 * - Từ có dấu (à, á, đ...) → so sánh nguyên văn lowercase
 * - Từ không dấu (dm, vcl...) → so sánh cả có dấu lẫn không dấu
 */
export function checkProfanity(str) {
  if (!str) return false;
  const low = String(str).toLowerCase();
  const noA = normText(str);
  return BAD_WORDS.some(w =>
    _ACCENT_RE.test(w)
      ? low.includes(w)
      : (noA.includes(w) || low.includes(w))
  );
}


/* ──────────────────────────────────────────────────────────────────────
   5️⃣  KEY HELPERS
   ────────────────────────────────────────────────────────────────────── */

/** Chuẩn hoá username thành key Firebase (loại bỏ ký tự cấm: . # $ [ ]) */
export function keyOf(u) {
  return encodeURIComponent(String(u).trim().toLowerCase())
    .replace(/[.#$\[\]]/g, "_");
}

/** Key localStorage cho ban */
export function getBanKey(name) {
  return BAN_PREFIX + "ban_" + nameHash(name);
}

/** Key localStorage cho số lần vi phạm */
export function getViolationKey(name) {
  return BAN_PREFIX + "vio_" + nameHash(name);
}


/* ──────────────────────────────────────────────────────────────────────
   6️⃣  BAN LOCAL — LƯU TRÊN MÁY NGƯỜI DÙNG
   ────────────────────────────────────────────────────────────────────── */

/** Kiểm tra tên có bị ban trên máy này không */
export function checkLocalBan(name) {
  try {
    return localStorage.getItem(getBanKey(name)) === "1";
  } catch (e) {
    return false;
  }
}

/** Đánh dấu ban trên máy này + tăng vi phạm */
export function setLocalBan(name) {
  try {
    localStorage.setItem(getBanKey(name), "1");
    const vk = getViolationKey(name);
    const cur = parseInt(localStorage.getItem(vk) || "0", 10);
    localStorage.setItem(vk, String(cur + 1));
  } catch (e) {}
}

/**
 * Xoá TOÀN BỘ ban cũ trong localStorage.
 * Bao gồm: qpb3_*, banned_ip_sim, ban_*, banned_*, violations_*
 * @returns {number} Số key đã xoá
 */
export function clearAllLocalBans() {
  const ks = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (k.startsWith(BAN_PREFIX) ||
          k === "banned_ip_sim" ||
          k.startsWith("ban_") ||
          k.startsWith("banned_") ||
          k.startsWith("violations_")) {
        ks.push(k);
      }
    }
    ks.forEach(x => { try { localStorage.removeItem(x); } catch (e) {} });
  } catch (e) {}
  return ks.length;
}


/* ──────────────────────────────────────────────────────────────────────
   7️⃣  BAN FIREBASE — LƯU TRÊN SERVER (áp dụng mọi máy)
   ────────────────────────────────────────────────────────────────────── */

/** Kiểm tra username có đang bị ban trên Firebase không */
export async function checkFirebaseBan(username) {
  if (!db || !username) return false;
  try {
    const banRef = ref(db, "bans/" + encodeURIComponent(String(username).toLowerCase()));
    const snap = await get(banRef);
    return snap.exists() && snap.val().isBanned === true;
  } catch (e) {
    return false;
  }
}

/** Ghi nhận vi phạm lên Firebase (tăng counter + set isBanned = true) */
export async function recordFirebaseViolation(username) {
  if (!db || !username || isAdminSession()) return false;
  try {
    const banRef = ref(db, "bans/" + encodeURIComponent(String(username).toLowerCase()));
    const snap = await get(banRef);
    const cur = snap.exists() ? (snap.val().violations || 0) : 0;
    await set(banRef, {
      isBanned: true,
      violations: cur + 1,
      timestamp: serverTimestamp()
    });
    return true;
  } catch (e) {
    console.warn("[core] recordFirebaseViolation:", e);
    return false;
  }
}

/**
 * Ghi nhận vi phạm: cả local + Firebase.
 * @param {string} nameOrUsername — tên để lưu local ban key
 * @param {string} [username]    — username để lưu Firebase (nếu khác name)
 */
export function recordViolation(nameOrUsername, username) {
  setLocalBan(nameOrUsername);
  const u = username || (_session && _session.username);
  if (u) recordFirebaseViolation(u);
}


/* ──────────────────────────────────────────────────────────────────────
   8️⃣  UNBAN SYNC — ĐỒNG BỘ MỐC UNBAN TỪ FIREBASE
   ──────────────────────────────────────────────────────────────────────
   Admin bấm "Unban All" ở 1 máy → server lưu timestamp.
   Máy khác mở app → đọc timestamp → nếu mới hơn local → xoá hết ban.
   ────────────────────────────────────────────────────────────────────── */
export async function syncUnbanEpoch() {
  if (!db) return;
  try {
    const snap = await Promise.race([
      get(ref(db, UNBAN_NODE)),
      new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 3000))
    ]);
    if (!snap.exists()) return;

    const remote = Number(snap.val()) || 0;
    const local  = Number(localStorage.getItem(UNBAN_LOCAL_KEY) || 0);

    if (remote > local) {
      clearAllLocalBans();
      localStorage.setItem(UNBAN_LOCAL_KEY, String(remote));
    }
  } catch (e) {
    // Timeout hoặc lỗi mạng → bỏ qua, không làm hỏng app
  }
}


/* ──────────────────────────────────────────────────────────────────────
   9️⃣  DOMAIN CHECK — KIỂM TRA TÊN MIỀN
   ────────────────────────────────────────────────────────────────────── */

/** Trả về true nếu domain hiện tại được phép chạy app */
export function checkDomain() {
  if (!ENFORCE_DOMAIN_CHECK) return true;
  const cur = String(location.hostname || "").toLowerCase();
  return ALLOWED_HOSTS.map(h => h.toLowerCase()).includes(cur);
}

/** Hiện cảnh báo ăn cắp domain (thay toàn bộ body) */
export function showDomainWarning() {
  document.body.innerHTML =
    '<div style="position:fixed;inset:0;z-index:2147483647;background:linear-gradient(135deg,#0f172a,#1e1b4b);' +
    'color:#fff;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;' +
    'text-align:center;padding:24px;box-sizing:border-box">' +
    '<div style="max-width:640px">' +
    '<div style="font-size:5.5rem;line-height:1;margin-bottom:16px">🚨</div>' +
    '<h1 style="font-size:clamp(1.8rem,5vw,2.6rem);margin:0 0 16px;font-weight:900;color:#f87171">' +
    'ĐỪNG CÓ ĂN CẮP MÀ BROOOOO!</h1>' +
    '<p style="color:#cbd5e1;font-size:clamp(0.95rem,2.5vw,1.15rem);line-height:1.7;margin:16px 0">' +
    'Trang web này chỉ được phép hoạt động tại:<br>' +
    '<b style="color:#60a5fa;font-size:1.15em;display:inline-block;margin-top:8px;word-break:break-all">' +
    'https://luyendemaster.vercel.app</b></p>' +
    '<p style="color:#64748b;margin-top:32px;font-size:0.85rem;line-height:1.6">' +
    '⚠️ Hành vi sao chép &amp; triển khai trái phép mã nguồn là vi phạm bản quyền.</p>' +
    '</div></div>';
}


/* ──────────────────────────────────────────────────────────────────────
   🔟  LEGACY CLEANUP — DỌN DẸP KEY CŨ (chạy 1 lần khi import)
   ──────────────────────────────────────────────────────────────────────
   Xoá các key ban từ các phiên bản cũ (trước khi có BAN_PREFIX).
   Chạy tự động khi module này được import lần đầu.
   ────────────────────────────────────────────────────────────────────── */
(function _cleanupLegacyStorage() {
  try {
    // Bước 1: xoá các key ban cũ (không có prefix qpb3_)
    const oldKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (k === "banned_ip_sim" ||
          (k.startsWith("ban_") && !k.startsWith(BAN_PREFIX)) ||
          (k.startsWith("banned_") && !k.startsWith(BAN_PREFIX)) ||
          (k.startsWith("violations_") && !k.startsWith(BAN_PREFIX))) {
        oldKeys.push(k);
      }
    }
    oldKeys.forEach(x => { try { localStorage.removeItem(x); } catch (e) {} });

    // Bước 2: migration lần đầu — xoá hết qpb3_* khi chưa có flag qp_unban_v1
    if (localStorage.getItem("qp_unban_v1") !== "done") {
      const banKeys = [];
      for (let a = 0; a < localStorage.length; a++) {
        const kk = localStorage.key(a);
        if (kk && kk.startsWith(BAN_PREFIX)) banKeys.push(kk);
      }
      banKeys.forEach(x => { try { localStorage.removeItem(x); } catch (e) {} });
      localStorage.setItem("qp_unban_v1", "done");
    }
  } catch (e) {
    // Không làm gì nếu localStorage bị chặn
  }
})();


/* ══════════════════════════════════════════════════════════════════════
   ✅ HẾT CORE.JS
   
   📌 DANH SÁCH EXPORT:
   
   Firebase:
     • db
   
   Session:
     • getSession()  → object | null
     • saveSession(s)
     • loadSession() → object | null
     • clearSession()
     • isAdminSession() → boolean
     • isAdminUsername(username) → boolean
   
   Normalize:
     • normText(s) → string
     • nameHash(name) → string
     • checkProfanity(s) → boolean
   
   Keys:
     • keyOf(u) → string
     • getBanKey(name) → string
     • getViolationKey(name) → string
   
   Ban local:
     • checkLocalBan(name) → boolean
     • setLocalBan(name)
     • clearAllLocalBans() → number
   
   Ban Firebase:
     • checkFirebaseBan(username) → Promise<boolean>
     • recordFirebaseViolation(username) → Promise<boolean>
     • recordViolation(nameOrUsername, [username])
   
   Unban:
     • syncUnbanEpoch() → Promise<void>
   
   Domain:
     • checkDomain() → boolean
     • showDomainWarning()
   ══════════════════════════════════════════════════════════════════════ */
