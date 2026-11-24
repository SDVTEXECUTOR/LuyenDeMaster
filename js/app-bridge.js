/* app-bridge.js — cầu nối giữa web và app Android "Luyện đề master".
   Chỉ được nạp khi chạy trong app (xem guard.js). Trên trình duyệt thường: không làm gì. */
(function () {
  "use strict";

  /* ⚙️ SỬA DÒNG NÀY: repo GitHub chứa project APK (phải để Public) */
  var GITHUB_REPO = "SDVTEXECUTOR/luyen-de-master-app";
  /* Đổi thành true SAU KHI đã thêm google-services.json và build lại APK (nếu không app có thể bị đóng đột ngột) */
  var PUSH_ENABLED = false;

  var C = window.Capacitor;
  if (!C || typeof C.registerPlugin !== "function") return;
  function plugin(name) { try { return C.registerPlugin(name); } catch (e) { return null; } }
  var App = plugin("App");
  var Push = plugin("PushNotifications");
  var Secure = plugin("ScreenSecure");

  var root = document.documentElement;
  root.classList.add("is-app");

  /* ── 0. Hiệu ứng mở app: "Luyện Đề Master · ON APP!" (chỉ 1 lần mỗi lần mở app) ── */
  (function intro() {
    try { if (sessionStorage.getItem("ldm_intro")) return; sessionStorage.setItem("ldm_intro", "1"); } catch (e) {}
    var css = document.createElement("style");
    css.textContent =
      "#ldmIntro{position:fixed;inset:0;z-index:2147483647;display:flex;flex-direction:column;align-items:center;justify-content:center;" +
      "background:radial-gradient(circle at 50% 38%,#312e81 0%,#0f172a 62%);color:#fff;font-family:Inter,system-ui,sans-serif;" +
      "transition:opacity .45s ease,transform .45s ease}" +
      "#ldmIntro.out{opacity:0;transform:scale(1.04);pointer-events:none}" +
      "#ldmIntro .lg{width:112px;height:112px;border-radius:28px;background:linear-gradient(135deg,#2563eb,#7c3aed);" +
      "display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 0 rgba(124,58,237,.6),0 18px 50px rgba(37,99,235,.45);" +
      "animation:ldmPop .7s cubic-bezier(.2,1.4,.4,1) both,ldmRing 1.6s ease-out .5s infinite}" +
      "#ldmIntro .t{margin-top:22px;font-size:1.9rem;font-weight:900;letter-spacing:-.02em;animation:ldmUp .6s ease .3s both}" +
      "#ldmIntro .bd{margin-top:14px;padding:7px 18px;border-radius:999px;font-weight:900;letter-spacing:.12em;font-size:.95rem;color:#052e16;" +
      "background:linear-gradient(90deg,#22c55e,#a3e635);box-shadow:0 0 24px rgba(34,197,94,.55);animation:ldmBadge .55s cubic-bezier(.2,1.5,.4,1) .75s both}" +
      "#ldmIntro .bar{margin-top:34px;width:150px;height:5px;border-radius:9px;background:rgba(255,255,255,.14);overflow:hidden}" +
      "#ldmIntro .bar i{display:block;height:100%;width:0;border-radius:9px;background:linear-gradient(90deg,#60a5fa,#a78bfa);animation:ldmBar 1.8s ease-in-out forwards}" +
      "@keyframes ldmPop{from{opacity:0;transform:scale(.55) rotate(-8deg)}to{opacity:1;transform:none}}" +
      "@keyframes ldmRing{to{box-shadow:0 0 0 34px rgba(124,58,237,0),0 18px 50px rgba(37,99,235,.45)}}" +
      "@keyframes ldmUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}" +
      "@keyframes ldmBadge{from{opacity:0;transform:scale(.3)}to{opacity:1;transform:none}}" +
      "@keyframes ldmBar{to{width:100%}}" +
      "@media (prefers-reduced-motion:reduce){#ldmIntro *{animation-duration:.01s!important;animation-delay:0s!important}}";
    var el = document.createElement("div");
    el.id = "ldmIntro";
    el.innerHTML =
      '<div class="lg"><svg width="68" height="68" viewBox="0 0 68 68" aria-hidden="true">' +
      '<path d="M4 25 34 13 64 25 34 37Z" fill="#fff"/>' +
      '<path d="M17 35v11c0 8 34 8 34 0V35L34 42Z" fill="#fff" opacity=".92"/>' +
      '<rect x="59" y="25" width="3" height="24" fill="#fbbf24"/><circle cx="60.5" cy="51" r="4" fill="#fbbf24"/></svg></div>' +
      '<div class="t">Luyện Đề Master</div><div class="bd">ON APP!</div><div class="bar"><i></i></div>';
    root.appendChild(css);
    root.appendChild(el);
    var t0 = Date.now(), gone = false;
    function hide() {
      if (gone) return; gone = true;
      el.classList.add("out");
      setTimeout(function () { el.remove(); css.remove(); }, 600);
    }
    function ready() { setTimeout(hide, Math.max(0, 1900 - (Date.now() - t0))); }
    if (document.readyState === "complete") ready(); else window.addEventListener("load", ready);
    setTimeout(hide, 5000); /* an toàn: tối đa 5 giây */
  })();

  /* ── 1. Giao diện: tránh tai thỏ / thanh điều hướng, bỏ kéo-giãn khi cuộn ── */
  var st = document.createElement("style");
  st.textContent =
    "html.is-app{overscroll-behavior:none;-webkit-text-size-adjust:100%}" +
    "html.is-app body{padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}" +
    "#ldmBanner{position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:99999;" +
    "background:#1e293b;color:#fff;border-radius:14px;padding:12px 14px;display:flex;gap:10px;align-items:center;" +
    "box-shadow:0 8px 30px rgba(0,0,0,.35);font:600 14px/1.4 Inter,system-ui,sans-serif}" +
    "#ldmBanner button{border:0;border-radius:10px;padding:9px 14px;font:700 14px Inter,system-ui,sans-serif;cursor:pointer}" +
    "#ldmBanner .go{background:#22c55e;color:#052e16}#ldmBanner .x{background:transparent;color:#94a3b8}";
  (document.head || root).appendChild(st);

  function toast(msg) {
    var t = document.createElement("div");
    t.textContent = msg;
    t.style.cssText = "position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#0f172a;color:#fff;" +
      "padding:10px 16px;border-radius:999px;z-index:99999;font:600 13px Inter,system-ui,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.3)";
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 1800);
  }

  function $(id) { return document.getElementById(id); }
  function visible(el) { return el && !el.classList.contains("hide") && el.offsetParent !== null; }

  var path = (location.pathname || "/").toLowerCase();
  var isQuizPage = /^\/(maths|mathematicmaster|khoahoctunhien)/.test(path);

  /* ── 2. Nút Back của Android ── */
  var lastBack = 0;
  if (App) {
    App.addListener("backButton", function () {
      var mk = $("mk");
      if (mk && mk.classList.contains("on")) { var no = $("no"); if (no) no.click(); return; }   /* đang hỏi nộp/thoát → Hủy */
      if (visible($("quiz"))) { var ex = $("exitQuiz"); if (ex) ex.click(); return; }              /* đang làm bài → hỏi thoát */
      if (isQuizPage && !confirm("Thoát bài làm? Tiến trình hiện tại sẽ không được lưu.")) return;
      if (path !== "/" && path !== "/index.html") {
        if (history.length > 1) history.back(); else location.href = "/";
        return;
      }
      var now = Date.now();
      if (now - lastBack < 2000) { App.exitApp(); return; }
      lastBack = now;
      toast("Bấm Back lần nữa để thoát");
    });
  }

  /* ── 3. Chặn chụp/quay màn hình khi đang làm bài ── */
  var secureOn = false;
  function syncSecure() {
    if (!Secure) return;
    var want = isQuizPage || visible($("quiz"));
    if (want === secureOn) return;
    secureOn = want;
    try { (want ? Secure.enable() : Secure.disable()).catch(function () {}); } catch (e) {}
  }
  setInterval(syncSecure, 700);
  document.addEventListener("DOMContentLoaded", syncSecure);

  /* ── 4. Tự báo có bản mới (đọc bản phát hành mới nhất trên GitHub) ── */
  function checkUpdate() {
    if (!App || !/\//.test(GITHUB_REPO) || /^TEN_/.test(GITHUB_REPO)) return;
    try { if (sessionStorage.getItem("ldm_upd_checked")) return; sessionStorage.setItem("ldm_upd_checked", "1"); } catch (e) {}
    Promise.all([
      App.getInfo(),
      fetch("https://api.github.com/repos/" + GITHUB_REPO + "/releases/latest").then(function (r) { return r.json(); })
    ]).then(function (r) {
      var cur = parseInt(r[0].build, 10) || 0;
      var latest = parseInt(String(r[1].tag_name || "").replace(/\D/g, ""), 10) || 0;
      if (latest <= cur) return;
      var b = document.createElement("div");
      b.id = "ldmBanner";
      b.innerHTML = '<div style="flex:1">🚀 Có bản mới của Luyện đề master!</div>' +
        '<button class="go">Cập nhật</button><button class="x">Để sau</button>';
      b.querySelector(".go").onclick = function () {
        location.href = "https://github.com/" + GITHUB_REPO + "/releases/latest/download/LuyenDeMaster.apk";
      };
      b.querySelector(".x").onclick = function () { b.remove(); };
      document.body.appendChild(b);
    }).catch(function () {});
  }
  document.addEventListener("DOMContentLoaded", function () { setTimeout(checkUpdate, 2500); });

  /* ── 5. Thông báo đẩy: đăng ký token sau khi học sinh đăng nhập ── */
  function sessionUser() {
    try {
      var v = localStorage.getItem("qp_session_khtn_v1") || localStorage.getItem("qp_session_v2");
      var s = v && JSON.parse(v);
      return s && s.username ? String(s.username) : null;
    } catch (e) { return null; }
  }
  var pushDone = false;
  function saveToken(token) {
    var u = sessionUser();
    if (!u) return;
    Promise.all([
      import("/js/core.js"),
      import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js"),
      App ? App.getInfo() : Promise.resolve({})
    ]).then(function (m) {
      var core = m[0], fb = m[1], info = m[2] || {};
      return fb.set(fb.ref(core.db, "fcmTokens/" + core.keyOf(u) + "/" + token),
        { at: Date.now(), app: "android", build: info.build || "" });
    }).catch(function (e) { console.warn("[app] lưu token lỗi", e); });
  }
  function setupPush() {
    if (!PUSH_ENABLED || pushDone || !Push || !sessionUser()) return;
    pushDone = true;
    Push.addListener("registration", function (t) { saveToken(t.value); });
    Push.addListener("registrationError", function (e) { console.warn("[app] push lỗi", e); });
    Push.requestPermissions().then(function (r) {
      if (r.receive === "granted") Push.register();
    }).catch(function () {});
  }
  document.addEventListener("DOMContentLoaded", function () {
    setupPush();
    var n = 0, iv = setInterval(function () { setupPush(); if (pushDone || ++n > 30) clearInterval(iv); }, 2000);
  });
})();
