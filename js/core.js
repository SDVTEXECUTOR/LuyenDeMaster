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
   • Domain: checkDomain / showDomainWarning
   • Đăng ký: checkRegistrationLock / setRegistrationLock
              / generateRegistrationCode / createRegistrationCode
              / getRegistrationCodes / deleteRegistrationCode
              / validateRegistrationCode / markCodeUsed
   ══════════════════════════════════════════════════════════════════════ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase, ref, get, set, remove, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
  FIREBASE_CONFIG,
  SESSION_KEY, SESSION_KEY_KHTN,
  UNBAN_NODE, UNBAN_LOCAL_KEY, BAN_PREFIX,
  REGISTRATION_LOCK_NODE, REGISTRATION_CODES_NODE,
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

export function checkLocalBan(name) {
  try { return localStorage.getItem(getBanKey(name)) === "1"; }
  catch (e) { return false; }
}

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
   7️⃣  BAN FIREBASE — LƯU TRÊN SERVER
   ────────────────────────────────────────────────────────────────────── */

export async function checkFirebaseBan(username) {
  if (!db || !username) return false;
  try {
    const banRef = ref(db, "bans/" + encodeURIComponent(String(username).toLowerCase()));
    const snap = await get(banRef);
    return snap.exists() && snap.val().isBanned === true;
  } catch (e) { return false; }
}

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
  } catch (e) {}
}


/* ──────────────────────────────────────────────────────────────────────
   9️⃣  DOMAIN CHECK — KIỂM TRA TÊN MIỀN
   ────────────────────────────────────────────────────────────────────── */

export function checkDomain() {
  if (!ENFORCE_DOMAIN_CHECK) return true;
  const cur = String(location.hostname || "").toLowerCase();
  return ALLOWED_HOSTS.map(h => h.toLowerCase()).includes(cur);
}

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
   🔟  ĐĂNG KÝ — KHÓA + MÃ ĐĂNG KÝ 1 LẦN
   ────────────────────────────────────────────────────────────────────── */

/** Kiểm tra đăng ký có đang bị khóa không */
export async function checkRegistrationLock() {
  if (!db) return false;
  try {
    const snap = await get(ref(db, REGISTRATION_LOCK_NODE));
    return snap.exists() && snap.val() === true;
  } catch (e) {
    console.warn("[core] checkRegistrationLock:", e);
    return false;
  }
}

/** Bật/tắt khóa đăng ký (admin only) */
export async function setRegistrationLock(locked) {
  if (!db || !isAdminSession()) return false;
  try {
    await set(ref(db, REGISTRATION_LOCK_NODE), !!locked);
    return true;
  } catch (e) {
    console.warn("[core] setRegistrationLock:", e);
    return false;
  }
}

/** Tạo mã đăng ký ngẫu nhiên (VD: LDM-A7K2M-9XN4Q) */
export function generateRegistrationCode() {
  // Bỏ các ký tự dễ nhầm: I, O, 0, 1
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = () => {
    let s = "";
    for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
  };
  return `LDM-${rand()}-${rand()}`;
}

/** Tạo mã mới (admin only). Trả về code hoặc null */
export async function createRegistrationCode(note = "") {
  if (!db || !isAdminSession()) return null;
  try {
    const code = generateRegistrationCode();
    await set(ref(db, REGISTRATION_CODES_NODE + "/" + code), {
      used: false,
      createdAt: Date.now(),
      usedBy: "",
      usedAt: 0,
      note: String(note).slice(0, 200)
    });
    return code;
  } catch (e) {
    console.warn("[core] createRegistrationCode:", e);
    return null;
  }
}

/** Lấy danh sách mã (admin only) */
export async function getRegistrationCodes() {
  if (!db) return [];
  try {
    const snap = await get(ref(db, REGISTRATION_CODES_NODE));
    const codes = [];
    if (snap.exists()) {
      snap.forEach(ch => codes.push({ code: ch.key, ...ch.val() }));
    }
    return codes;
  } catch (e) {
    console.warn("[core] getRegistrationCodes:", e);
    return [];
  }
}

/** Xoá mã (admin only) */
export async function deleteRegistrationCode(code) {
  if (!db || !isAdminSession()) return false;
  try {
    await remove(ref(db, REGISTRATION_CODES_NODE + "/" + code));
    return true;
  } catch (e) {
    console.warn("[core] deleteRegistrationCode:", e);
    return false;
  }
}

/** Kiểm tra mã có hợp lệ không (dùng trước khi register) */
export async function validateRegistrationCode(code) {
  if (!db || !code) return { valid: false, reason: "Mã không hợp lệ" };
  try {
    const c = String(code).trim().toUpperCase();
    if (!/^LDM-[A-Z0-9]{5}-[A-Z0-9]{5}$/.test(c)) {
      return { valid: false, reason: "Mã không đúng định dạng (VD: LDM-A7K2M-9XN4Q)" };
    }
    const snap = await get(ref(db, REGISTRATION_CODES_NODE + "/" + c));
    if (!snap.exists()) return { valid: false, reason: "Mã không tồn tại" };
    const v = snap.val();
    if (v.used) return { valid: false, reason: "Mã đã được sử dụng" };
    return { valid: true, code: c };
  } catch (e) {
    return { valid: false, reason: "Lỗi kiểm tra mã: " + e.message };
  }
}

/** Đánh dấu mã đã dùng (gọi sau khi register thành công) */
export async function markCodeUsed(code, username) {
  if (!db) return false;
  try {
    const cRef = ref(db, REGISTRATION_CODES_NODE + "/" + code);
    const snap = await get(cRef);
    if (!snap.exists()) return false;
    const v = snap.val();
    if (v.used) return false;
    await set(cRef, {
      used: true,
      createdAt: v.createdAt || Date.now(),
      usedBy: String(username || "").slice(0, 100),
      usedAt: Date.now(),
      note: v.note || ""
    });
    return true;
  } catch (e) {
    console.warn("[core] markCodeUsed:", e);
    return false;
  }
}


/* ──────────────────────────────────────────────────────────────────────
   1️⃣1️⃣  LEGACY CLEANUP — DỌN DẸP KEY CŨ (chạy 1 lần khi import)
   ────────────────────────────────────────────────────────────────────── */
(function _cleanupLegacyStorage() {
  try {
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

    if (localStorage.getItem("qp_unban_v1") !== "done") {
      const banKeys = [];
      for (let a = 0; a < localStorage.length; a++) {
        const kk = localStorage.key(a);
        if (kk && kk.startsWith(BAN_PREFIX)) banKeys.push(kk);
      }
      banKeys.forEach(x => { try { localStorage.removeItem(x); } catch (e) {} });
      localStorage.setItem("qp_unban_v1", "done");
    }
  } catch (e) {}
})();


/* ══════════════════════════════════════════════════════════════════════
   ✅ HẾT CORE.JS
   
   📌 DANH SÁCH EXPORT (tổng cộng 32 hàm/const):
   
   Firebase:
     • db
   
   Session:
     • getSession() / saveSession(s) / loadSession() / clearSession()
     • isAdminSession() / isAdminUsername(username)
   
   Normalize:
     • normText(s) / nameHash(name) / checkProfanity(s)
   
   Keys:
     • keyOf(u) / getBanKey(name) / getViolationKey(name)
   
   Ban local:
     • checkLocalBan(name) / setLocalBan(name) / clearAllLocalBans()
   
   Ban Firebase:
     • checkFirebaseBan(username) / recordFirebaseViolation(username)
     • recordViolation(nameOrUsername, [username])
   
   Unban:
     • syncUnbanEpoch()
   
   Domain:
     • checkDomain() / showDomainWarning()
   
   Đăng ký:
     • checkRegistrationLock() / setRegistrationLock(locked)
     • generateRegistrationCode() / createRegistrationCode(note)
     • getRegistrationCodes() / deleteRegistrationCode(code)
     • validateRegistrationCode(code) / markCodeUsed(code, username)
   ══════════════════════════════════════════════════════════════════════ */
