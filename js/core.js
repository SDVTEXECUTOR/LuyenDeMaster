/* ══════════════════════════════════════════════════════════════════════
   🧠 CORE.JS — LOGIC DÙNG CHUNG
   V2.7 — Fix gift code unlimited (runTransaction, atomic)
   ══════════════════════════════════════════════════════════════════════ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase, ref, get, set, remove, push, serverTimestamp, runTransaction, update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
  FIREBASE_CONFIG,
  SESSION_KEY, SESSION_KEY_KHTN,
  UNBAN_NODE, UNBAN_LOCAL_KEY, BAN_PREFIX,
  REGISTRATION_LOCK_NODE, REGISTRATION_CODES_NODE,
  ANNOUNCEMENTS_NODE,
  BAD_WORDS, ADMIN_USER, ADMIN_LIST,
  ALLOWED_HOSTS, ENFORCE_DOMAIN_CHECK
} from "./config.js";

const PROFANITY_LOCK_NODE = "config/profanityEnabled";
const GIFT_CODES_NODE = "config/giftCodes";

let _db = null;
try {
  _db = getDatabase(initializeApp(FIREBASE_CONFIG));
} catch (e) {
  console.warn("[core] Firebase init error:", e);
}
export const db = _db;

/* ══════════════════════════════════════════════════════════════════════
   SESSION
   ══════════════════════════════════════════════════════════════════════ */
let _session = null;
export function getSession() { return _session; }

export function saveSession(s) {
  if (!s) return;
  _session = s;
  const str = JSON.stringify(s);
  try {
    localStorage.setItem(SESSION_KEY, str);
    localStorage.setItem(SESSION_KEY_KHTN, str);
  } catch (e) { console.warn("[core] saveSession:", e); }
}

export function loadSession() {
  try {
    const v = localStorage.getItem(SESSION_KEY_KHTN) || localStorage.getItem(SESSION_KEY);
    return v ? JSON.parse(v) : null;
  } catch (e) { return null; }
}

export function clearSession() {
  _session = null;
  [SESSION_KEY, SESSION_KEY_KHTN].forEach(k => {
    try { localStorage.removeItem(k); } catch (e) {}
  });
}

export function isAdminSession() {
  return !!(_session && _session.isAdmin === true);
}

export function isAdminUsername(username) {
  const u = String(username || "").trim().toLowerCase();
  if (!u) return false;
  return ADMIN_LIST.some(a =>
    String(a.user || "").toLowerCase() === u ||
    String((a.profile && a.profile.username) || "").toLowerCase() === u
  );
}

/* ══════════════════════════════════════════════════════════════════════
   NORMALIZE
   ══════════════════════════════════════════════════════════════════════ */
export function normText(s) {
  return String(s || "").toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[.,!?;:'"()\-–—]/g, " ")
    .replace(/\s+/g, " ").trim();
}

export function nameHash(name) {
  return normText(name || "").replace(/\s+/g, "_");
}

const _ACCENT_RE = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;

export function checkProfanity(str) {
  if (!str) return false;
  const low = String(str).toLowerCase();
  const noA = normText(str);
  return BAD_WORDS.some(w =>
    _ACCENT_RE.test(w) ? low.includes(w) : (noA.includes(w) || low.includes(w))
  );
}

/* ══════════════════════════════════════════════════════════════════════
   KEY
   ══════════════════════════════════════════════════════════════════════ */
export function keyOf(u) {
  return encodeURIComponent(String(u).trim().toLowerCase()).replace(/[.#$\[\]]/g, "_");
}

export function getBanKey(name)       { return BAN_PREFIX + "ban_" + nameHash(name); }
export function getViolationKey(name) { return BAN_PREFIX + "vio_" + nameHash(name); }

/* ══════════════════════════════════════════════════════════════════════
   BAN LOCAL
   ══════════════════════════════════════════════════════════════════════ */
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

export function clearAllLocalBans() {
  const ks = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (k.startsWith(BAN_PREFIX) || k === "banned_ip_sim" ||
          k.startsWith("ban_") || k.startsWith("banned_") ||
          k.startsWith("violations_")) ks.push(k);
    }
    ks.forEach(x => { try { localStorage.removeItem(x); } catch (e) {} });
  } catch (e) {}
  return ks.length;
}

/* ══════════════════════════════════════════════════════════════════════
   BAN FIREBASE
   ══════════════════════════════════════════════════════════════════════ */
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

export function recordViolation(nameOrUsername, username) {
  setLocalBan(nameOrUsername);
  const u = username || (_session && _session.username);
  if (u) recordFirebaseViolation(u);
}

/* ══════════════════════════════════════════════════════════════════════
   UNBAN SYNC
   ══════════════════════════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════════════════════════
   DOMAIN GUARD
   ══════════════════════════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════════════════════════
   ĐĂNG KÝ: KHÓA + MÃ 1 LẦN
   ══════════════════════════════════════════════════════════════════════ */
export async function checkRegistrationLock() {
  if (!db) return false;
  try {
    const snap = await get(ref(db, REGISTRATION_LOCK_NODE));
    return snap.exists() && snap.val() === true;
  } catch (e) { return false; }
}

export async function setRegistrationLock(locked) {
  if (!db || !isAdminSession()) return false;
  try {
    await set(ref(db, REGISTRATION_LOCK_NODE), !!locked);
    return true;
  } catch (e) { return false; }
}

export function generateRegistrationCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = () => {
    let s = "";
    for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
  };
  return `LDM-${rand()}-${rand()}`;
}

export async function createRegistrationCode(note = "") {
  if (!db || !isAdminSession()) return null;
  try {
    const code = generateRegistrationCode();
    await set(ref(db, REGISTRATION_CODES_NODE + "/" + code), {
      used: false, createdAt: Date.now(),
      usedBy: "", usedAt: 0, note: String(note).slice(0, 200)
    });
    return code;
  } catch (e) { return null; }
}

export async function getRegistrationCodes() {
  if (!db) return [];
  try {
    const snap = await get(ref(db, REGISTRATION_CODES_NODE));
    const codes = [];
    if (snap.exists()) snap.forEach(ch => codes.push({ code: ch.key, ...ch.val() }));
    return codes;
  } catch (e) { return []; }
}

export async function deleteRegistrationCode(code) {
  if (!db || !isAdminSession()) return false;
  try {
    await remove(ref(db, REGISTRATION_CODES_NODE + "/" + code));
    return true;
  } catch (e) { return false; }
}

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

export async function markCodeUsed(code, username) {
  if (!db) return false;
  try {
    const cRef = ref(db, REGISTRATION_CODES_NODE + "/" + code);
    const snap = await get(cRef);
    if (!snap.exists()) return false;
    const v = snap.val();
    if (v.used) return false;
    await set(cRef, {
      used: true, createdAt: v.createdAt || Date.now(),
      usedBy: String(username || "").slice(0, 100),
      usedAt: Date.now(), note: v.note || ""
    });
    return true;
  } catch (e) { return false; }
}

/* ══════════════════════════════════════════════════════════════════════
   KIỂM DUYỆT TỪ NGỮ
   ══════════════════════════════════════════════════════════════════════ */
export async function checkProfanitySetting() {
  if (!db) return false;
  try {
    const snap = await get(ref(db, PROFANITY_LOCK_NODE));
    return snap.exists() && snap.val() === true;
  } catch (e) { return false; }
}

export async function setProfanitySetting(enabled) {
  if (!db || !isAdminSession()) return false;
  try {
    await set(ref(db, PROFANITY_LOCK_NODE), !!enabled);
    return true;
  } catch (e) { return false; }
}

/* ══════════════════════════════════════════════════════════════════════
   📢 ANNOUNCEMENTS
   ══════════════════════════════════════════════════════════════════════ */
export async function getAnnouncements() {
  if (!db) return [];
  try {
    const snap = await get(ref(db, ANNOUNCEMENTS_NODE));
    const items = [];
    if (snap.exists()) snap.forEach(ch => {
      const v = ch.val();
      if (v && v.title) items.push({ id: ch.key, ...v });
    });
    items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return items;
  } catch (e) { return []; }
}

export async function createAnnouncement(title, content, author = "Admin") {
  if (!db || !isAdminSession()) return null;
  const t = String(title || "").trim();
  const c = String(content || "").trim();
  if (!t || t.length > 200) return null;
  if (!c || c.length > 5000) return null;
  try {
    const newRef = push(ref(db, ANNOUNCEMENTS_NODE));
    await set(newRef, {
      title: t, content: c,
      author: String(author || "Admin").slice(0, 100),
      createdAt: Date.now()
    });
    return newRef.key;
  } catch (e) { return null; }
}

export async function deleteAnnouncement(id) {
  if (!db || !isAdminSession() || !id) return false;
  try {
    await remove(ref(db, ANNOUNCEMENTS_NODE + "/" + id));
    return true;
  } catch (e) { return false; }
}

export async function getLatestAnnouncementTime() {
  if (!db) return 0;
  try {
    const snap = await get(ref(db, ANNOUNCEMENTS_NODE));
    if (!snap.exists()) return 0;
    let latest = 0;
    snap.forEach(ch => {
      const v = ch.val();
      if (v && typeof v.createdAt === "number" && v.createdAt > latest) latest = v.createdAt;
    });
    return latest;
  } catch (e) { return 0; }
}

/* ══════════════════════════════════════════════════════════════════════
   💰 LDM CURRENCY & SHOP SYSTEM
   ══════════════════════════════════════════════════════════════════════ */
export const SHOP_ITEMS = {
  pack_fire: {
    id: "pack_fire",
    name: "PACK FIRE",
    description: "Trang bị nền lửa rực cháy cho hồ sơ của bạn.",
    price: 499,
    icon: "🔥"
  }
};

async function ensureProfile(username) {
  if (!db || !username) return false;
  try {
    const k = keyOf(username);
    const snap = await get(ref(db, `profiles/${k}`));
    if (snap.exists()) return true;
    await set(ref(db, `profiles/${k}`), {
      avatar: "🐱", avatarImg: "", bio: "", coins: 0,
      totalQuizzes: 0, loginCount: 1, streak: 1, lastLogin: Date.now(),
      bestScores: {}, achievements: {}, achievementDates: {}, recentActivity: [],
      createdAt: Date.now()
    });
    return true;
  } catch (e) { return false; }
}

export async function getUserCoins(username) {
  if (!db || !username) return 0;
  try {
    const k = keyOf(username);
    const snap = await get(ref(db, `profiles/${k}/coins`));
    return snap.exists() ? Number(snap.val()) || 0 : 0;
  } catch (e) { return 0; }
}

export async function addCoins(username, amount) {
  if (!db || !username || !amount) return 0;
  await ensureProfile(username);
  try {
    const k = keyOf(username);
    let newVal = 0;
    await runTransaction(ref(db, `profiles/${k}/coins`), (cur) => {
      const c = Number(cur) || 0;
      newVal = c + Number(amount);
      if (newVal > 1000000) newVal = 1000000;
      if (newVal < 0) newVal = 0;
      return newVal;
    });
    return newVal;
  } catch (e) { return 0; }
}

export async function getOwnedPacks(username) {
  if (!db || !username) return [];
  try {
    const k = keyOf(username);
    const snap = await get(ref(db, `profiles/${k}/ownedPacks`));
    if (!snap.exists()) return [];
    const v = snap.val();
    if (Array.isArray(v)) return v.filter(Boolean);
    if (typeof v === "object") return Object.values(v).filter(Boolean);
    return [];
  } catch (e) { return []; }
}

export async function buyPack(username, packId) {
  const item = SHOP_ITEMS[packId];
  if (!item) return { ok: false, reason: "Pack không tồn tại" };
  if (!db || !username) return { ok: false, reason: "Chưa đăng nhập" };
  await ensureProfile(username);
  try {
    const k = keyOf(username);
    const owned = await getOwnedPacks(username);
    if (owned.includes(packId)) {
      return { ok: false, reason: "Bạn đã sở hữu pack này rồi" };
    }
    let paid = false, reason = "";
    await runTransaction(ref(db, `profiles/${k}/coins`), (cur) => {
      const c = Number(cur) || 0;
      if (c < item.price) {
        reason = `Bạn cần thêm ${item.price - c} LDM nữa (hiện có ${c} LDM)`;
        return c;
      }
      paid = true;
      return c - item.price;
    });
    if (!paid) return { ok: false, reason: reason || "Không đủ LDM" };
    const newOwned = [...owned, packId];
    await set(ref(db, `profiles/${k}/ownedPacks`), newOwned);
    return { ok: true };
  } catch(e) {
    return { ok: false, reason: "Lỗi: " + e.message };
  }
}

export async function getActiveBackground(username) {
  if (!db || !username) return "default";
  try {
    const k = keyOf(username);
    const snap = await get(ref(db, `profiles/${k}/activeBg`));
    return snap.exists() ? String(snap.val()) : "default";
  } catch(e) { return "default"; }
}

export async function setActiveBackground(username, bgId) {
  if (!db || !username) return false;
  await ensureProfile(username);
  try {
    const k = keyOf(username);
    await set(ref(db, `profiles/${k}/activeBg`), bgId || "default");
    return true;
  } catch(e) { return false; }
}

export async function checkAndAwardDaily(username, amount = 15) {
  if (!db || !username) return false;
  await ensureProfile(username);
  try {
    const k = keyOf(username);
    const today = new Date().toISOString().slice(0, 10);
    const ref_ = ref(db, `profiles/${k}/lastDailyBonus`);
    const snap = await get(ref_);
    const last = snap.exists() ? String(snap.val()) : "";
    if (last === today) return false;
    await set(ref_, today);
    await addCoins(username, amount);
    return true;
  } catch(e) { return false; }
}

/* ══════════════════════════════════════════════════════════════════════
   🎁 GIFT CODES SYSTEM
   ══════════════════════════════════════════════════════════════════════
   - maxUses = 0   → KHÔNG GIỚI HẠN số người (mỗi người vẫn 1 lần)
   - maxUses > 0   → Giới hạn N người (mỗi người vẫn 1 lần)
   ══════════════════════════════════════════════════════════════════════ */
export async function createGiftCode(code, amount, maxUses = 1, note = "") {
  if (!db || !isAdminSession()) return { ok: false, reason: "Chưa đăng nhập admin" };

  const c = String(code || "").trim().toUpperCase();
  if (!c) return { ok: false, reason: "Mã không được rỗng" };
  if (!/^[A-Z0-9_-]{3,30}$/.test(c)) {
    return { ok: false, reason: "Mã chỉ gồm A-Z, 0-9, gạch dưới, 3-30 ký tự" };
  }

  const amt = Number(amount);
  if (!amt || amt <= 0) return { ok: false, reason: "Số LDM phải > 0" };
  if (amt > 100000) return { ok: false, reason: "Tối đa 100.000 LDM/mã" };

  // maxUses = 0 → KHÔNG GIỚI HẠN số người (mỗi người vẫn 1 lần)
  const mx = Math.max(0, Math.floor(Number(maxUses) || 0));
  if (mx > 1000) return { ok: false, reason: "Tối đa 1000 người/mã" };

  try {
    const codeRef = ref(db, `${GIFT_CODES_NODE}/${c}`);
    const snap = await get(codeRef);
    if (snap.exists()) return { ok: false, reason: "Mã đã tồn tại" };

    await set(codeRef, {
      amount: amt, maxUses: mx, useCount: 0, used: false,
      createdAt: Date.now(),
      createdBy: (_session && _session.username) || "admin",
      note: String(note || "").slice(0, 200),
      redeemedBy: {}
    });

    return { ok: true, code: c };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

export async function getGiftCodes() {
  if (!db) return [];
  try {
    const snap = await get(ref(db, GIFT_CODES_NODE));
    if (!snap.exists()) return [];
    const codes = [];
    snap.forEach(ch => {
      const v = ch.val() || {};
      codes.push({ code: ch.key, ...v });
    });
    codes.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return codes;
  } catch (e) { return []; }
}

export async function deleteGiftCode(code) {
  if (!db || !isAdminSession()) return false;
  const c = String(code || "").trim().toUpperCase();
  if (!c) return false;
  try {
    await remove(ref(db, `${GIFT_CODES_NODE}/${c}`));
    return true;
  } catch (e) { return false; }
}

/* ──────────────────────────────────────────────────────────────────────
   ✅ FIX #1: redeemGiftCode dùng runTransaction (atomic)
   ──────────────────────────────────────────────────────────────────────
   Trước đây: get + update riêng → race condition khi nhiều user cùng nhập
   Bây giờ:  toàn bộ check + update diễn ra trong 1 transaction duy nhất
   
   Logic:
     - Mã unlimited (maxUses = 0): useCount tăng vô hạn, used = false mãi mãi
     - Mã giới hạn (maxUses > 0):  useCount >= maxUses thì báo hết lượt
     - Mỗi user chỉ nhập được 1 lần (check trong redeemedBy)
   ────────────────────────────────────────────────────────────────────── */
export async function redeemGiftCode(code, username) {
  if (!db || !username) return { ok: false, reason: "Chưa đăng nhập" };

  const c = String(code || "").trim().toUpperCase();
  if (!c) return { ok: false, reason: "Vui lòng nhập mã" };

  await ensureProfile(username);

  try {
    const codeRef = ref(db, `${GIFT_CODES_NODE}/${c}`);
    let result = { ok: false, reason: "Lỗi không xác định" };
    let amount = 0;

    await runTransaction(codeRef, (current) => {
      if (current === null) {
        result = { ok: false, reason: "Mã không tồn tại" };
        return current; // abort — trả nguyên giá trị null
      }

      const v = current || {};
      const useCount = Number(v.useCount) || 0;
      const maxUses  = Number(v.maxUses)  || 0;
      const isUnlimited = maxUses === 0;

      // Chỉ chặn khi mã có giới hạn VÀ đã đủ người
      if (!isUnlimited && useCount >= maxUses) {
        result = { ok: false, reason: "Mã đã hết lượt sử dụng" };
        return current; // abort — không đổi gì
      }

      const k = keyOf(username);
      const redeemedBy = v.redeemedBy || {};
      if (redeemedBy[k]) {
        result = { ok: false, reason: "Bạn đã sử dụng mã này rồi" };
        return current; // abort
      }

      const newUseCount = useCount + 1;
      amount = Number(v.amount) || 0;
      result = { ok: true, amount };

      return {
        ...v,
        useCount: newUseCount,
        used: !isUnlimited && newUseCount >= maxUses,
        redeemedBy: { ...redeemedBy, [k]: Date.now() }
      };
    });

    // Cộng LDM SAU KHI transaction commit thành công
    if (result.ok && amount > 0) {
      await addCoins(username, amount);
    }
    return result;
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

/* ══════════════════════════════════════════════════════════════════════
   CLEANUP LEGACY STORAGE
   ══════════════════════════════════════════════════════════════════════ */
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
