/* ══════════════════════════════════════════════════════════════════════
   🛡️ ANTICHEAT.JS — CHỐNG GIAN LẬN CHUYÊN SÂU (STRICT MODE)
   ══════════════════════════════════════════════════════════════════════
   13 LỚP BẢO VỆ:
   
   ─── PHẦN 1: Chặn phím tắt nguy hiểm ───
     ✓ F12
     ✓ Ctrl+Shift+I/J/C (DevTools Windows)
     ✓ Cmd+Opt+I/J (DevTools Mac)
     ✓ Ctrl+U / Cmd+U (View Source)
     ✓ Ctrl+S / Cmd+S (Save Page)
     ✓ Ctrl+P / Cmd+P (Print)
   
   ─── PHẦN 2: Chặn menu & thao tác ───
     ✓ Chuột phải (trừ input/textarea)
     ✓ Copy/cut/paste (tùy chọn)
     ✓ Select text (tùy chọn)
     ✓ Drag & drop (tùy chọn)
   
   ─── PHẦN 3: Phát hiện nâng cao ───
     ✓ DevTools mở (viewport diff)
     ✓ Console trap (Object.defineProperty getter)
     ✓ Chuyển tab / ẩn cửa sổ (visibilitychange)
     ✓ Mất focus (blur)
     ✓ Mở nhiều tab (BroadcastChannel)
     ✓ Window resize bất thường (split-screen)
     ✓ Auto-click (isTrusted = false)
     ✓ Debugger (performance timing) — TẮT mặc định
     ✓ Iframe embedding
   
   ─── PHẦN 4: Bảo vệ bổ sung ───
     ✓ Clear console khi DevTools mở
     ✓ Obfuscate console.log (tùy chọn)
   
   CÁCH DÙNG:
     import { installAntiCheat } from '/js/anticheat.js';
     
     const shield = installAntiCheat({
       onTabSwitch: (info) => { ... },
       onDevtoolsOpen: (info) => { ... },
       onMultiTab: (info) => { ... },
       onAutoClick: (info) => { ... },
       onViolation: (type, detail) => { ... }  // general — mọi loại
     });
   
   API:
     shield.disable()            — tắt chống gian lận
     shield.enable()             — bật lại
     shield.getViolationCount()  — tổng số vi phạm
     shield.getCounts()          — chi tiết theo loại
     shield.resetCounts()        — reset bộ đếm
     shield.config               — object cấu hình
   ══════════════════════════════════════════════════════════════════════ */

export function installAntiCheat(opts = {}) {
  /* ────────────────────────────────────────────────────────────────
     CẤU HÌNH — mặc định đã STRICT
     ──────────────────────────────────────────────────────────────── */
  const cfg = {
    // ─── Chặn phím / menu ───
    blockF12:          true,
    blockDevtoolsKeys: true,
    blockViewSource:   true,
    blockSavePage:     true,
    blockPrint:        true,
    blockContextMenu:  true,
    blockCopyPaste:    false,   // bật nếu chặn copy ngoài input
    blockSelection:    false,   // bật nếu chặn bôi đen
    blockDragDrop:     false,   // bật nếu chặn kéo thả

    // ─── Phát hiện nâng cao ───
    detectDevtools:         true,
    detectDevtoolsInterval: 1000,
    detectTabSwitch:        true,
    detectWindowBlur:       true,
    detectMultiTab:         true,
    detectWindowResize:     false,  // tắt: nhầm với xoay mobile
    detectAutoClick:        true,
    detectConsole:          true,
    detectDebugger:         false,  // ⚠️ có thể freeze browser
    detectIframe:           true,

    // ─── Bảo vệ bổ sung ───
    clearConsoleOnOpen: true,
    obfuscateConsole:   false,

    // ─── Callbacks ───
    onDevtoolsOpen:   null,
    onTabSwitch:      null,
    onWindowBlur:     null,
    onMultiTab:       null,
    onWindowResize:   null,
    onAutoClick:      null,
    onViolation:      null,   // (type, detail) — mọi vi phạm

    ...opts
  };

  /* ────────────────────────────────────────────────────────────────
     STATE
     ──────────────────────────────────────────────────────────────── */
  let enabled = true;
  let counts = {};
  let totalCount = 0;

  const bumpCount = (type) => {
    counts[type] = (counts[type] || 0) + 1;
    totalCount++;
    return { [type]: counts[type], total: totalCount };
  };

  /* ────────────────────────────────────────────────────────────────
     EMIT — Gọi callback
     ──────────────────────────────────────────────────────────────── */
  const emit = (type, detail = {}) => {
    if (!enabled) return;

    const meta = bumpCount(type);
    const payload = { ...detail, ...meta };

    // General callback (luôn gọi)
    if (typeof cfg.onViolation === "function") {
      try { cfg.onViolation(type, payload); } catch(e) {
        console.warn("[anticheat] onViolation error:", e);
      }
    }

    // Specific callback theo type
    const map = {
      DevtoolsOpen: "onDevtoolsOpen",
      TabSwitch:    "onTabSwitch",
      WindowBlur:   "onWindowBlur",
      MultiTab:     "onMultiTab",
      WindowResize: "onWindowResize",
      AutoClick:    "onAutoClick"
    };
    const cbName = map[type];
    if (cbName && typeof cfg[cbName] === "function") {
      try { cfg[cbName](payload); } catch(e) {
        console.warn("[anticheat] " + cbName + " error:", e);
      }
    }
  };

  /* ════════════════════════════════════════════════════════════════
     PHẦN 1: CHẶN PHÍM TẮT NGUY HIỂM
     ════════════════════════════════════════════════════════════════ */
  const handleKeydown = (e) => {
    if (!enabled) return;

    const k = (e.key || "").toLowerCase();
    const kCode = e.keyCode || e.which;
    const isWin = e.ctrlKey && !e.metaKey;
    const isMac = e.metaKey && !e.ctrlKey;

    let blocked = false;
    let reason = "";

    if (cfg.blockF12 && (k === "f12" || kCode === 123)) {
      blocked = true; reason = "f12";
    } else if (cfg.blockDevtoolsKeys && isWin && e.shiftKey && /^[ijc]$/.test(k)) {
      blocked = true; reason = "devtools-keys";
    } else if (cfg.blockDevtoolsKeys && isMac && e.altKey && /^[ij]$/.test(k)) {
      blocked = true; reason = "devtools-keys";
    } else if (cfg.blockViewSource && (isWin || isMac) && k === "u") {
      blocked = true; reason = "view-source";
    } else if (cfg.blockSavePage && (isWin || isMac) && k === "s") {
      blocked = true; reason = "save-page";
    } else if (cfg.blockPrint && (isWin || isMac) && k === "p") {
      blocked = true; reason = "print";
    }

    if (blocked) {
      e.preventDefault();
      e.stopPropagation();
      emit("Violation", { type: reason, key: e.key });
      return false;
    }
  };

  document.addEventListener("keydown", handleKeydown, true);

  /* ════════════════════════════════════════════════════════════════
     PHẦN 2: CHẶN MENU & THAO TÁC
     ════════════════════════════════════════════════════════════════ */
  document.addEventListener("contextmenu", (e) => {
    if (!enabled || !cfg.blockContextMenu) return;
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
    e.preventDefault();
  });

  if (cfg.blockCopyPaste) {
    ["copy", "cut", "paste"].forEach(evt => {
      document.addEventListener(evt, (e) => {
        if (!enabled) return;
        const t = e.target;
        if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
        e.preventDefault();
      });
    });
  }

  if (cfg.blockSelection) {
    document.addEventListener("selectstart", (e) => {
      if (!enabled) return;
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      e.preventDefault();
    });
  }

  if (cfg.blockDragDrop) {
    ["dragstart", "drop", "dragover"].forEach(evt => {
      document.addEventListener(evt, (e) => {
        if (!enabled) return;
        e.preventDefault();
      });
    });
  }

  /* ════════════════════════════════════════════════════════════════
     PHẦN 3: PHÁT HIỆN DEVTOOLS QUA VIEWPORT DIFF
     ════════════════════════════════════════════════════════════════ */
  let devtoolsIntervalId = null;
  if (cfg.detectDevtools) {
    let lastState = false;
    devtoolsIntervalId = setInterval(() => {
      if (!enabled) return;

      const wDiff = Math.abs(window.outerWidth - window.innerWidth);
      const hDiff = Math.abs(window.outerHeight - window.innerHeight);
      const isOpen = (window.outerWidth > 0 && wDiff > 160) ||
                     (window.outerHeight > 0 && hDiff > 160);

      if (isOpen && !lastState) {
        emit("DevtoolsOpen", { wDiff, hDiff });
        if (cfg.clearConsoleOnOpen) {
          try { console.clear(); } catch(e) {}
        }
      }
      lastState = isOpen;
    }, cfg.detectDevtoolsInterval);
  }

  /* ════════════════════════════════════════════════════════════════
     PHẦN 4: PHÁT HIỆN CHUYỂN TAB
     ════════════════════════════════════════════════════════════════ */
  document.addEventListener("visibilitychange", () => {
    if (!enabled || !cfg.detectTabSwitch) return;
    if (document.hidden) emit("TabSwitch", { at: Date.now() });
  });

  /* ════════════════════════════════════════════════════════════════
     PHẦN 5: PHÁT HIỆN WINDOW BLUR
     ════════════════════════════════════════════════════════════════ */
  let lastBlurAt = 0;
  window.addEventListener("blur", () => {
    if (!enabled || !cfg.detectWindowBlur) return;
    const now = Date.now();
    if (now - lastBlurAt < 500) return;
    lastBlurAt = now;
    emit("WindowBlur", { at: now });
  });

  /* ════════════════════════════════════════════════════════════════
     PHẦN 6: PHÁT HIỆN NHIỀU TAB (BroadcastChannel)
     ════════════════════════════════════════════════════════════════ */
  let bcChannel = null;
  const myTabId = "tab_" + Math.random().toString(36).slice(2) + "_" + Date.now();
  const otherTabs = new Set();
  let lastMultiTabEmit = 0;

  if (cfg.detectMultiTab && typeof BroadcastChannel !== "undefined") {
    try {
      bcChannel = new BroadcastChannel("anticheat_luyende_master");
      bcChannel.postMessage({ type: "hello", id: myTabId });

      bcChannel.onmessage = (ev) => {
        if (!enabled) return;
        const { type, id } = ev.data || {};
        if (!id || id === myTabId) return;

        if (type === "hello") {
          otherTabs.add(id);
          bcChannel.postMessage({ type: "ack", id: myTabId });
        } else if (type === "ack") {
          otherTabs.add(id);
        } else if (type === "bye") {
          otherTabs.delete(id);
          return;
        }

        // Throttle emit — tránh spam khi nhiều tab mở cùng lúc
        const now = Date.now();
        if (now - lastMultiTabEmit > 2000) {
          lastMultiTabEmit = now;
          emit("MultiTab", { count: otherTabs.size + 1, otherIds: [...otherTabs] });
        }
      };

      window.addEventListener("beforeunload", () => {
        try { bcChannel.postMessage({ type: "bye", id: myTabId }); } catch(e) {}
      });
    } catch(e) {
      console.warn("[anticheat] BroadcastChannel unavailable:", e);
    }
  }

  /* ════════════════════════════════════════════════════════════════
     PHẦN 7: PHÁT HIỆN WINDOW RESIZE BẤT THƯỜNG
     ════════════════════════════════════════════════════════════════ */
  if (cfg.detectWindowResize) {
    let lastW = window.innerWidth, lastH = window.innerHeight;
    let resizeTimer = null;
    window.addEventListener("resize", () => {
      if (!enabled) return;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const dw = Math.abs(window.innerWidth - lastW);
        const dh = Math.abs(window.innerHeight - lastH);
        if (dw > 50 || dh > 50) {
          emit("WindowResize", { dw, dh, w: window.innerWidth, h: window.innerHeight });
        }
        lastW = window.innerWidth;
        lastH = window.innerHeight;
      }, 300);
    });
  }

  /* ════════════════════════════════════════════════════════════════
     PHẦN 8: PHÁT HIỆN AUTO-CLICK (isTrusted = false)
     ════════════════════════════════════════════════════════════════ */
  if (cfg.detectAutoClick) {
    document.addEventListener("click", (e) => {
      if (!enabled) return;
      if (!e.isTrusted) {
        e.preventDefault();
        e.stopPropagation();
        emit("AutoClick", {
          kind: "click",
          x: e.clientX,
          y: e.clientY,
          target: e.target?.tagName || "?"
        });
        return false;
      }
    }, true);

    document.addEventListener("change", (e) => {
      if (!enabled) return;
      if (!e.isTrusted) {
        e.preventDefault();
        e.stopPropagation();
        emit("AutoClick", {
          kind: "change",
          target: e.target?.tagName || "?"
        });
        return false;
      }
    }, true);
  }

  /* ════════════════════════════════════════════════════════════════
     PHẦN 9: CONSOLE TRAP (getter fire khi DevTools mở)
     ════════════════════════════════════════════════════════════════ */
  let consoleTrapInterval = null;
  if (cfg.detectConsole) {
    try {
      const trap = new Image();
      let lastConsoleTrapAt = 0;
      Object.defineProperty(trap, "id", {
        get() {
          const now = Date.now();
          if (enabled && now - lastConsoleTrapAt > 5000) {
            lastConsoleTrapAt = now;
            emit("Violation", { type: "console-access" });
          }
          return "";
        }
      });

      consoleTrapInterval = setInterval(() => {
        if (!enabled) return;
        try { console.log(trap); } catch(e) {}
      }, 2000);
    } catch(e) {
      console.warn("[anticheat] Console trap failed:", e);
    }
  }

  /* ════════════════════════════════════════════════════════════════
     PHẦN 10: OBFUSCATE CONSOLE
     ════════════════════════════════════════════════════════════════ */
  let originalLog = null;
  if (cfg.obfuscateConsole) {
    try {
      originalLog = console.log;
      console.log = function() {
        originalLog.apply(console, [
          "%c⚠️ STOP!", "color:#ef4444;font-size:24px;font-weight:900"
        ]);
        originalLog.apply(console, [
          "Đây là vùng cấm. Mọi hành vi can thiệp đều bị ghi nhận.",
          "color:#f59e0b;font-size:14px"
        ]);
      };
    } catch(e) {}
  }

  /* ════════════════════════════════════════════════════════════════
     PHẦN 11: PHÁT HIỆN DEBUGGER (tùy chọn — CẨN THẬN)
     ════════════════════════════════════════════════════════════════ */
  let debuggerInterval = null;
  if (cfg.detectDebugger) {
    debuggerInterval = setInterval(() => {
      if (!enabled) return;
      const t0 = performance.now();
      // eslint-disable-next-line no-debugger
      try { debugger; } catch(e) {}
      const dt = performance.now() - t0;
      if (dt > 100) {
        emit("Violation", { type: "debugger", dt: Math.round(dt) });
      }
    }, 5000);
  }

  /* ════════════════════════════════════════════════════════════════
     PHẦN 12: PHÁT HIỆN IFRAME EMBED
     ════════════════════════════════════════════════════════════════ */
  if (cfg.detectIframe) {
    try {
      if (window.top !== window.self) {
        emit("Violation", { type: "iframe-embed" });
      }
    } catch(e) {
      // Cross-origin iframe → chắc chắn đang bị nhúng
      emit("Violation", { type: "iframe-embed-crossorigin" });
    }
  }

  /* ════════════════════════════════════════════════════════════════
     PHẦN 13: RETURN API
     ════════════════════════════════════════════════════════════════ */
  return {
    disable() {
      enabled = false;
      if (devtoolsIntervalId) { clearInterval(devtoolsIntervalId); devtoolsIntervalId = null; }
      if (consoleTrapInterval) { clearInterval(consoleTrapInterval); consoleTrapInterval = null; }
      if (debuggerInterval) { clearInterval(debuggerInterval); debuggerInterval = null; }
      if (bcChannel) { try { bcChannel.close(); } catch(e) {} bcChannel = null; }
      if (originalLog) { console.log = originalLog; originalLog = null; }
    },
    enable() { enabled = true; },
    getViolationCount() { return totalCount; },
    getCounts() { return { ...counts }; },
    resetCounts() { counts = {}; totalCount = 0; },
    config: cfg
  };
}
