/* guard.js — lớp chống ăn cắp / sao chép (răn đe, chạy sớm ở <head>) */
(function () {
  "use strict";
  var OK = ["luyendemaster.vercel.app", "localhost", "127.0.0.1"];
  var h = String(location.hostname || "").toLowerCase();
  var dev = h === "localhost" || h === "127.0.0.1";
  var dead = false;
  var MSG = '<head><meta charset="utf-8"><title>Chặn truy cập</title></head><body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0f172a;color:#fff;font-family:system-ui,sans-serif;text-align:center;padding:24px;box-sizing:border-box"><div><div style="font-size:5rem">🚨</div><h1 style="color:#f87171;font-size:2rem;margin:12px 0">ĐỪNG CÓ ĂN CẮP MÀ BROOOOO!</h1><p style="color:#cbd5e1">Trang được bảo vệ. Hãy đóng công cụ nhà phát triển rồi tải lại trang.</p></div></body>';

  function kill() {
    if (dead) return; dead = true;
    function paint() { try { document.documentElement.innerHTML = MSG; } catch (e) {} }
    paint(); setInterval(paint, 400);
    try { window.stop(); } catch (e) {}
  }

  /* 1. Bản lưu về máy (file://) / mirror sang domain lạ */
  if (OK.indexOf(h) === -1) return kill();
  if (dev) return; /* local: không chặn để bạn còn code */

  /* 2. Nhúng iframe / clone qua frame */
  if (window.top !== window.self) {
    try { window.top.location.replace(location.href); } catch (e) {}
    return kill();
  }

  /* 3. Trình duyệt tự động (bot cào web) */
  if (navigator.webdriver) return kill();

  /* 4. Phím tắt xem nguồn / DevTools / lưu / in */
  addEventListener("keydown", function (e) {
    var c = e.ctrlKey || e.metaKey, k = e.code;
    var bad = e.key === "F12" ||
      (c && e.shiftKey && (k === "KeyI" || k === "KeyJ" || k === "KeyC")) ||
      (c && e.altKey && (k === "KeyI" || k === "KeyJ" || k === "KeyC" || k === "KeyU")) ||
      (c && (k === "KeyU" || k === "KeyS" || k === "KeyP"));
    if (bad) { e.preventDefault(); e.stopPropagation(); }
  }, true);

  /* 5. Chuột phải, kéo thả, copy/cắt ngoài ô nhập */
  function editable(t) { return t && (t.isContentEditable || /^(INPUT|TEXTAREA)$/.test(t.tagName)); }
  document.addEventListener("contextmenu", function (e) { if (!editable(e.target)) e.preventDefault(); }, true);
  document.addEventListener("dragstart", function (e) { e.preventDefault(); }, true);
  ["copy", "cut"].forEach(function (ev) {
    document.addEventListener(ev, function (e) { if (!editable(e.target)) e.preventDefault(); }, true);
  });

  /* 6. Phát hiện DevTools: getter console + đo thời gian debugger */
  var probe = new Image(), seen = false;
  Object.defineProperty(probe, "id", { get: function () { seen = true; return ""; } });
  setInterval(function () {
    seen = false;
    console.log(probe); console.clear();
    if (seen) return kill();
    var t = performance.now();
    (new Function("debugger"))();
    if (performance.now() - t > 120) kill();
  }, 1000);
})();
