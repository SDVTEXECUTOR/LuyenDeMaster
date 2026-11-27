/* sitelock.js — KHÓA WEB: màn hình "tạm khóa" dùng chung cho mọi trang (trừ adminpanel).
   Dữ liệu: Firebase config/siteLock = { locked, title, reason, until, grace, by, at }
   - Admin luôn vào được (chỉ thấy thanh nhỏ báo web đang khóa).
   - Đang mở trang mà bị khóa => đếm ngược `grace` giây rồi mới khóa.
   - Lỗi mạng/Firebase => KHÔNG khóa (fail-open). */
import { FIREBASE_CONFIG, ADMIN_LIST, SESSION_KEY, SESSION_KEY_KHTN } from "/js/config.js";

const NODE = "config/siteLock";
const CACHE = "ldm_sitelock_cache";
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export function isActive(d) { return !!(d && d.locked === true && !(d.until && Date.now() > Number(d.until))); }

function isAdmin() {
  try {
    const s = JSON.parse(localStorage.getItem(SESSION_KEY_KHTN) || localStorage.getItem(SESSION_KEY) || "null");
    if (!s || s.isAdmin !== true) return false;
    const u = String(s.username || "").toLowerCase();
    return ADMIN_LIST.some((a) => String(a.user).toLowerCase() === u || String((a.profile && a.profile.username) || "").toLowerCase() === u);
  } catch (e) { return false; }
}

let styled = false;
function addStyle() {
  if (styled) return; styled = true;
  const st = document.createElement("style");
  st.textContent = `
#ldmLock{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:20px;overflow:auto;font-family:Inter,system-ui,-apple-system,sans-serif;color:#e8edf6;background:radial-gradient(circle at 20% 15%,rgba(37,99,235,.35),transparent 55%),radial-gradient(circle at 80% 85%,rgba(168,85,247,.25),transparent 55%),#060b18;animation:ldmIn .35s ease}
@keyframes ldmIn{from{opacity:0}to{opacity:1}}
#ldmLock .lk{width:min(480px,100%);text-align:center;background:rgba(15,23,42,.72);border:1px solid rgba(148,163,184,.22);border-radius:22px;padding:34px 26px;box-shadow:0 30px 80px rgba(0,0,0,.5);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}
#ldmLock .ic{width:84px;height:84px;margin:0 auto 14px;border-radius:50%;display:grid;place-items:center;font-size:2.6rem;background:rgba(239,68,68,.16);border:2px solid rgba(239,68,68,.5);animation:ldmPulse 2.2s ease-in-out infinite}
@keyframes ldmPulse{50%{box-shadow:0 0 0 14px rgba(239,68,68,0)}0%{box-shadow:0 0 0 0 rgba(239,68,68,.45)}}
#ldmLock h1{margin:0 0 8px;font-size:1.6rem;font-weight:800;letter-spacing:-.02em;color:#fff}
#ldmLock .why{margin:14px 0;padding:14px 16px;border-radius:14px;background:rgba(245,158,11,.12);border:1px solid rgba(245,158,11,.35);text-align:left;line-height:1.6;word-break:break-word;white-space:pre-wrap}
#ldmLock .why b{display:block;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:#fbbf24;margin-bottom:4px}
#ldmLock .eta{margin:12px 0;color:#cbd5e1;font-size:.92rem}
#ldmLock .cd{font-size:1.9rem;font-weight:800;font-variant-numeric:tabular-nums;color:#60a5fa;margin-top:2px}
#ldmLock .btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:18px}
#ldmLock button,#ldmLock a.ab{font:inherit;font-weight:700;border:0;border-radius:12px;padding:11px 20px;cursor:pointer;text-decoration:none;font-size:.92rem}
#ldmLock .pri{background:#2563eb;color:#fff}
#ldmLock .gh{background:transparent;color:#94a3b8;border:1.5px solid rgba(148,163,184,.35)!important}
#ldmLock .adm{display:block;margin-top:18px;font-size:.78rem;color:#64748b;text-decoration:none}
#ldmLock .adm:hover{color:#94a3b8}
#ldmGrace{position:fixed;top:0;left:0;right:0;z-index:2147482999;padding:calc(10px + env(safe-area-inset-top,0px)) 14px 10px;background:linear-gradient(90deg,#dc2626,#ea580c);color:#fff;font:600 .9rem Inter,system-ui,sans-serif;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,.35)}
#ldmAdminPill{position:fixed;left:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:2147482990;padding:8px 14px;border-radius:99px;background:#dc2626;color:#fff;font:700 .78rem Inter,system-ui,sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.35)}
@media (prefers-reduced-motion:reduce){#ldmLock,#ldmLock .ic{animation:none}}`;
  document.head.appendChild(st);
}

function fmtCd(ms) {
  const t = Math.max(0, Math.floor(ms / 1000)), h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = t % 60;
  const p = (n) => String(n).padStart(2, "0");
  return (h ? h + ":" : "") + p(m) + ":" + p(s);
}

let tick = null;
export function hideLockScreen() {
  const el = document.getElementById("ldmLock"); if (el) el.remove();
  if (tick) { clearInterval(tick); tick = null; }
  document.documentElement.style.overflow = "";
}

export function showLockScreen(d, opts) {
  opts = opts || {}; addStyle(); hideLockScreen();
  d = d || {};
  const el = document.createElement("div"); el.id = "ldmLock"; el.setAttribute("role", "alertdialog");
  const until = d.until ? Number(d.until) : 0;
  el.innerHTML = `<div class="lk"><div class="ic">🔒</div>
<h1>${esc(d.title || "Web đang tạm khóa")}</h1>
<div style="color:#94a3b8;font-size:.95rem">Luyện Đề Master hiện chưa thể truy cập.</div>
<div class="why"><b>Lý do</b>${esc(d.reason || "Quản trị viên đang bảo trì hệ thống.")}</div>
${until ? `<div class="eta">Dự kiến mở lại: <b>${esc(new Date(until).toLocaleString("vi-VN"))}</b><div class="cd" id="ldmCd">--:--</div></div>` : `<div class="eta">Chưa có giờ mở lại cụ thể. Trang sẽ tự mở khi hệ thống sẵn sàng.</div>`}
<div class="btns">${opts.preview ? `<button class="pri" id="ldmClose">Đóng xem trước</button>` : `<button class="pri" id="ldmRetry">↻ Thử lại</button>`}</div>
${opts.preview ? "" : `<a class="adm" href="/login?admin=1">🔑 Dành cho quản trị viên</a>`}</div>`;
  document.body.appendChild(el);
  document.documentElement.style.overflow = "hidden";
  const r = el.querySelector("#ldmRetry"); if (r) r.onclick = () => location.reload();
  const c = el.querySelector("#ldmClose"); if (c) c.onclick = hideLockScreen;
  if (until) {
    const cd = el.querySelector("#ldmCd");
    const upd = () => { const left = until - Date.now(); cd.textContent = fmtCd(left); if (left <= 0 && !opts.preview) { clearInterval(tick); location.reload(); } };
    upd(); tick = setInterval(upd, 1000);
  }
}

function setGrace(sec, d) {
  addStyle(); let b = document.getElementById("ldmGrace");
  if (!b) { b = document.createElement("div"); b.id = "ldmGrace"; document.body.appendChild(b); }
  b.innerHTML = `⚠️ Web sẽ khóa sau <b>${sec}s</b> — ${esc(d.reason || "bảo trì")}. Hãy lưu hoặc nộp bài ngay!`;
}
function clearGrace() { const b = document.getElementById("ldmGrace"); if (b) b.remove(); }
function adminPill(on) {
  let p = document.getElementById("ldmAdminPill");
  if (!on) { if (p) p.remove(); return; }
  addStyle(); if (!p) { p = document.createElement("div"); p.id = "ldmAdminPill"; document.body.appendChild(p); }
  p.textContent = "🛑 Web đang KHÓA — chỉ admin thấy trang này";
}

async function run() {
  const onLoginAdminMode = /^\/login/.test(location.pathname) && new URLSearchParams(location.search).get("admin") === "1";
  const admin = isAdmin();
  if (onLoginAdminMode) return;
  let first = true, graceTimer = null;

  /* hiện ngay từ cache để khỏi nháy nội dung trước khi Firebase trả lời */
  try { const c = JSON.parse(localStorage.getItem(CACHE) || "null"); if (c && !admin && isActive(c)) { if (document.body) showLockScreen(c); else addEventListener("DOMContentLoaded", () => showLockScreen(c)); } } catch (e) {}

  let app, onValue, ref, getDatabase;
  try {
    const A = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
    const D = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js");
    ({ onValue, ref, getDatabase } = D);
    app = A.getApps().length ? A.getApp() : A.initializeApp(FIREBASE_CONFIG);
  } catch (e) { hideLockScreen(); return; } /* fail-open */
  const db = getDatabase(app);

  onValue(ref(db, NODE), (snap) => {
    const d = snap.val(), on = isActive(d);
    try { localStorage.setItem(CACHE, JSON.stringify(d || {})); } catch (e) {}
    if (admin) { adminPill(on); first = false; return; }
    if (!on) { clearInterval(graceTimer); graceTimer = null; clearGrace(); hideLockScreen(); first = false; return; }
    if (first) { showLockScreen(d); }
    else if (!document.getElementById("ldmLock") && !graceTimer) {
      let left = Math.max(0, Number(d.grace) || 0);
      if (!left) showLockScreen(d);
      else { setGrace(left, d); graceTimer = setInterval(() => { left--; if (left <= 0) { clearInterval(graceTimer); graceTimer = null; clearGrace(); showLockScreen(d); } else setGrace(left, d); }, 1000); }
    }
    first = false;
  }, () => { /* lỗi đọc => không khóa */ });
}

if (!window.__LDM_NO_LOCK_AUTORUN) run();
