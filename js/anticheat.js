/* ══════════════════════════════════════════════════════════════════════
   🛡️ ANTICHEAT.JS — VIP FORTRESS v4.0
   ══════════════════════════════════════════════════════════════════════
   THAY ĐỔI SO VỚI v3.0:
   ✦ Overlay chống bị remove bằng MutationObserver (re-inject tức thì)
   ✦ Console integrity check — phát hiện override console.log
   ✦ Console.table trap — bắt inspect qua bảng
   ✦ Mobile false-positive fix — skip viewport diff trên touch-primary
   ✦ Debounced viewport check (4 lần liên tiếp = 2s) — giảm false positive
   ✦ killSwitch mode "lock" — lock 3 phút kể cả F5 (sessionStorage)
   ✦ disable() cần __AC_DEV_MODE__ — không cho tắt lén
   ✦ Domain lock default TRUE + trigger killswitch
   ✦ setInterval integrity check — phát hiện override
   ✦ Redundant overlay layer — 2 lớp id khác nhau
   
   CÁCH DÙNG:
     import { installAntiCheat } from '/js/anticheat.js';
     installAntiCheat({ onDevtoolsOpen: () => {...} });
   
   Tắt tạm khi dev (browser console BEFORE page load):
     window.__AC_DEV_MODE__ = true;
   
   API giữ nguyên như v3.0:
     shield.disable() | .enable() | .getViolationCount() | .getCounts()
     shield.resetCounts() | .isActive | .config | .uptime
   ══════════════════════════════════════════════════════════════════════ */

// ══════════════════════════════════════════════════════════════════════
// OBFUSCATION & CONSTANTS
// ══════════════════════════════════════════════════════════════════════
const _cc = (...a) => String.fromCharCode(...a);
const _HOSTS = [
  _cc(108,117,121,101,110,100,101,109,97,115,116,101,114,46,118,101,114,99,101,108,46,97,112,112),
  _cc(108,111,99,97,108,104,111,115,116),
  _cc(49,50,55,46,48,46,48,46,49)
];

const _OV_ID    = "__ac_stop__";
const _OV_ID_2  = "__ac_stop2__";
const _LOCK_KEY = "__ac_lock_until__";
const _DEV_FLAG = "__AC_DEV_MODE__";

// ══════════════════════════════════════════════════════════════════════
// NATIVE API SNAPSHOT
// ══════════════════════════════════════════════════════════════════════
const _N = (function () {
  const n = {};
  const grab = (obj, key, name) => { try { n[name] = obj[key]; } catch (e) { n[name] = null; } };
  grab(Function.prototype, "toString",           "ftS");
  grab(Function.prototype, "call",               "fCall");
  grab(Function.prototype, "apply",              "fApply");
  grab(Object,             "defineProperty",     "defP");
  grab(Object,             "getOwnPropertyDescriptor", "getDesc");
  grab(Object,             "freeze",             "freeze");
  grab(EventTarget.prototype, "addEventListener",    "addEL");
  grab(EventTarget.prototype, "removeEventListener", "remEL");
  grab(Document.prototype,    "createElement",   "cElem");
  grab(Document.prototype,    "getElementById",  "gById");
  grab(Document.prototype,    "querySelectorAll","qsAll");
  grab(Node.prototype,        "appendChild",     "append");
  grab(Node.prototype,        "removeChild",     "remove");
  grab(window,                "setInterval",     "SI");
  grab(window,                "setTimeout",      "ST");
  grab(window,                "clearInterval",   "CI");
  grab(window,                "clearTimeout",    "CT");
  grab(performance,           "now",             "pNow");
  grab(Date,                  "now",             "dNow");
  grab(MutationObserver.prototype, "observe",    "moObs");
  return _N_FREEZE(n);
})();

function _N_FREEZE(o) { try { Object.freeze(o); } catch (e) {} return o; }

// Fallback nếu _N.SI null (bị hook trước import)
const _SI = _N.SI || window.setInterval;
const _ST = _N.ST || window.setTimeout;
const _CI = _N.CI || window.clearInterval;
const _CT = _N.CT || window.clearTimeout;
const _NOW = _N.pNow || performance.now.bind(performance);
const _DATE = _N.dNow || Date.now;

// ══════════════════════════════════════════════════════════════════════
// VIP FORTRESS DEFAULTS
// ══════════════════════════════════════════════════════════════════════
const VIP_DEFAULTS = {
  // Keyboard
  blockF12: true,
  blockDevtoolsKeys: true,
  blockViewSource: true,
  blockSavePage: true,
  blockPrint: true,

  // Mouse / clipboard
  blockContextMenu: true,
  blockCopyPaste: true,
  blockSelection: true,
  blockDragDrop: true,

  // Detection
  detectDevtools: true,
  detectDevtoolsInterval: 500,
  detectTabSwitch: true,
  detectWindowBlur: true,
  detectMultiTab: true,
  detectAutoClick: true,
  detectConsole: true,
  detectConsoleIntegrity: true,
  detectFunctionTamper: true,
  detectIntervalTamper: true,
  detectIframe: true,
  detectDomain: true,

  // Kill switch: "off" | "warn" | "lock" | "nuke"
  killSwitch: "warn",
  lockDurationMs: 3 * 60 * 1000,

  // Misc
  clearConsoleOnOpen: true,
  autoReinstall: true,
  freezeApis: true,

  // Callbacks
  onDevtoolsOpen: null,
  onTabSwitch: null,
  onWindowBlur: null,
  onMultiTab: null,
  onAutoClick: null,
  onTamper: null,
  onDomainMismatch: null,
  onViolation: null,
  onKillSwitch: null,
};

// ══════════════════════════════════════════════════════════════════════
// BUILD SHIELD
// ══════════════════════════════════════════════════════════════════════
function _buildShield(userOpts) {
  const cfg = Object.assign({}, VIP_DEFAULTS, userOpts || {});
  const counts = {};
  const startedAt = _DATE();
  const devMode = !!window[_DEV_FLAG];

  let enabled = true;
  let killActive = false;
  let ov1 = null, ov2 = null;
  let moBody = null, moTimer = null;

  // ── Emit ──
  const emit = (type, detail) => {
    if (!enabled) return;
    counts[type] = (counts[type] || 0) + 1;
    const payload = Object.assign({ type, count: counts[type], at: _DATE() }, detail || {});
    const map = {
      DevtoolsOpen: "onDevtoolsOpen", TabSwitch: "onTabSwitch",
      WindowBlur: "onWindowBlur", MultiTab: "onMultiTab",
      AutoClick: "onAutoClick", Tamper: "onTamper",
      DomainMismatch: "onDomainMismatch", KillSwitch: "onKillSwitch"
    };
    const cbName = map[type];
    try {
      if (cbName && typeof cfg[cbName] === "function") cfg[cbName](payload);
      if (typeof cfg.onViolation === "function") cfg.onViolation(type, payload);
    } catch (e) {}
  };

  // ── Build overlay ──
  const _makeOverlay = (id, reason) => {
    const ov = _N.cElem.call(document, "div");
    ov.id = id;
    ov.setAttribute("style", [
      "position:fixed","top:0","left:0","right:0","bottom:0",
      "width:100vw","height:100vh",
      "z-index:2147483647",
      "background:linear-gradient(135deg,#0a0a0a,#1a0505)",
      "color:#fff","font-family:system-ui,sans-serif",
      "display:flex","align-items:center","justify-content:center",
      "text-align:center","padding:24px","box-sizing:border-box",
      "user-select:none","-webkit-user-select:none",
      "pointer-events:all !important",
      "touch-action:none"
    ].join(";"));
    ov.innerHTML = `
      <div style="max-width:520px;pointer-events:auto">
        <div style="font-size:5rem;line-height:1;margin-bottom:16px;animation:_acPulse 1s ease-in-out infinite">🚫</div>
        <h1 style="font-size:clamp(1.6rem,5vw,2.2rem);margin:0 0 16px;font-weight:900;color:#ef4444;letter-spacing:-0.02em">DỪNG LẠI NGAY</h1>
        <p style="color:#94a3b8;font-size:1rem;line-height:1.7;margin:0 0 24px">
          Hệ thống phát hiện hành vi can thiệp trái phép.<br>
          Vui lòng đóng <b style="color:#f87171">DevTools</b> và <b style="color:#f87171">không sao chép</b> mã nguồn.
        </p>
        <div style="font-family:'JetBrains Mono',monospace;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);border-radius:8px;padding:12px;font-size:.8rem;color:#f87171;text-align:left;word-break:break-all">
          &gt; ${String(reason || "unknown").replace(/[<>&"]/g, "")}
        </div>
      </div>
      <style>@keyframes _acPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.05);opacity:.8}}</style>
    `;
    return ov;
  };

  // ── Kill switch ──
  const activateKillSwitch = (reason) => {
    if (killActive) return;
    if (cfg.killSwitch === "off") { emit("KillSwitch", { reason, mode: "off" }); return; }
    killActive = true;
    emit("KillSwitch", { reason, mode: cfg.killSwitch });

    if (cfg.killSwitch === "nuke") {
      try { localStorage.clear(); } catch (e) {}
      try { sessionStorage.clear(); } catch (e) {}
    }
    if (cfg.killSwitch === "lock") {
      try { sessionStorage.setItem(_LOCK_KEY, String(_DATE() + cfg.lockDurationMs)); } catch (e) {}
    }

    try {
      if (!_N.gById.call(document, _OV_ID)) {
        ov1 = _makeOverlay(_OV_ID, reason);
        (_N.append || Node.prototype.appendChild).call(document.body || document.documentElement, ov1);
      }
      if (!_N.gById.call(document, _OV_ID_2)) {
        ov2 = _makeOverlay(_OV_ID_2, reason);
        ov2.style.background = "transparent";
        ov2.style.pointerEvents = "all";
        ov2.style.zIndex = "2147483646";
        ov2.innerHTML = "";
        (_N.append || Node.prototype.appendChild).call(document.body || document.documentElement, ov2);
      }
    } catch (e) {}

    // MutationObserver: instant re-inject
    if (cfg.autoReinstall && !moBody && typeof MutationObserver !== "undefined") {
      try {
        moBody = new MutationObserver(() => {
          if (!killActive) return;
          if (!_N.gById.call(document, _OV_ID) && ov1) {
            try { (document.body || document.documentElement).appendChild(ov1); } catch (e) {}
          }
          if (!_N.gById.call(document, _OV_ID_2) && ov2) {
            try { (document.body || document.documentElement).appendChild(ov2); } catch (e) {}
          }
        });
        moBody.observe(document.body || document.documentElement, { childList: true, subtree: false });
      } catch (e) {}
    }
    // Backup: poll
    if (cfg.autoReinstall && !moTimer) {
      moTimer = _SI.call(window, () => {
        if (!killActive) return;
        if (!_N.gById.call(document, _OV_ID) && ov1) {
          try { (document.body || document.documentElement).appendChild(ov1); } catch (e) {}
        }
      }, 500);
    }
  };

  const deactivateKillSwitch = () => {
    if (!killActive) return;
    killActive = false;
    try {
      [ov1, ov2].forEach(ov => {
        if (ov && ov.parentNode) ov.parentNode.removeChild(ov);
      });
      if (moBody) { moBody.disconnect(); moBody = null; }
      if (moTimer) { _CI.call(window, moTimer); moTimer = null; }
    } catch (e) {}
  };

  // ══════════════════════════════════════════════════════════════════
  // KEYBOARD BLOCKER
  // ══════════════════════════════════════════════════════════════════
  const onKeydown = (e) => {
    if (!enabled) return;
    const k = String(e.key || "").toLowerCase();
    const kc = e.keyCode || e.which;
    const win = e.ctrlKey && !e.metaKey;
    const mac = e.metaKey && !e.ctrlKey;
    let blocked = false, reason = "";

    if (cfg.blockF12 && (k === "f12" || kc === 123)) {
      blocked = true; reason = "f12";
    } else if (cfg.blockDevtoolsKeys && win && e.shiftKey && /^[ijc]$/.test(k)) {
      blocked = true; reason = "devtools-win";
    } else if (cfg.blockDevtoolsKeys && mac && e.altKey && /^[ij]$/.test(k)) {
      blocked = true; reason = "devtools-mac";
    } else if (cfg.blockViewSource && (win || mac) && k === "u") {
      blocked = true; reason = "view-source";
    } else if (cfg.blockSavePage && (win || mac) && k === "s") {
      blocked = true; reason = "save-page";
    } else if (cfg.blockPrint && (win || mac) && k === "p") {
      blocked = true; reason = "print";
    }

    if (blocked) {
      try { e.preventDefault(); e.stopPropagation(); } catch (er) {}
      emit("Violation", { reason, key: e.key });
      return false;
    }
  };
  _N.addEL.call(document, "keydown", onKeydown, true);

  // ══════════════════════════════════════════════════════════════════
  // MOUSE / CLIPBOARD
  // ══════════════════════════════════════════════════════════════════
  _N.addEL.call(document, "contextmenu", (e) => {
    if (!enabled || !cfg.blockContextMenu) return;
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
    try { e.preventDefault(); } catch (er) {}
  });

  ["copy", "cut", "paste"].forEach(evt => {
    _N.addEL.call(document, evt, (e) => {
      if (!enabled || !cfg.blockCopyPaste) return;
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      try { e.preventDefault(); } catch (er) {}
    });
  });

  _N.addEL.call(document, "selectstart", (e) => {
    if (!enabled || !cfg.blockSelection) return;
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
    try { e.preventDefault(); } catch (er) {}
  });

  ["dragstart", "drop", "dragover"].forEach(evt => {
    _N.addEL.call(document, evt, (e) => {
      if (!enabled || !cfg.blockDragDrop) return;
      try { e.preventDefault(); } catch (er) {}
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // CONSOLE TRAP (layer 1 — image getter)
  // ══════════════════════════════════════════════════════════════════
  if (cfg.detectConsole) {
    try {
      const img = new Image();
      let last = 0;
      _N.defP.call(Object, img, "id", {
        get() {
          const n = _DATE();
          if (enabled && n - last > 5000) { last = n; emit("Violation", { reason: "console-inspect" }); }
          return "";
        }
      });
      _SI.call(window, () => { try { console.log(img); } catch (e) {} }, 2500);
    } catch (e) {}
  }

  // ══════════════════════════════════════════════════════════════════
  // CONSOLE.TABLE TRAP (layer 2 — bảng getter)
  // ══════════════════════════════════════════════════════════════════
  if (cfg.detectConsole) {
    try {
      const trapRow = {};
      let last2 = 0;
      _N.defP.call(Object, trapRow, "x", {
        get() {
          const n = _DATE();
          if (enabled && n - last2 > 5000) { last2 = n; emit("Violation", { reason: "console-table-inspect" }); }
          return 0;
        }
      });
      _SI.call(window, () => { try { console.table([trapRow]); } catch (e) {} }, 3500);
    } catch (e) {}
  }

  // ══════════════════════════════════════════════════════════════════
  // TAB / BLUR
  // ══════════════════════════════════════════════════════════════════
  _N.addEL.call(document, "visibilitychange", () => {
    if (!enabled || !cfg.detectTabSwitch) return;
    if (document.hidden) emit("TabSwitch", { at: _DATE() });
  });

  let lastBlur = 0;
  _N.addEL.call(window, "blur", () => {
    if (!enabled || !cfg.detectWindowBlur) return;
    const n = _DATE();
    if (n - lastBlur < 500) return;
    lastBlur = n;
    emit("WindowBlur", { at: n });
  });

  // ══════════════════════════════════════════════════════════════════
  // MULTI-TAB
  // ══════════════════════════════════════════════════════════════════
  let bc = null;
  const myId = "tab_" + Math.random().toString(36).slice(2) + "_" + _DATE();
  const others = new Set();
  let lastMulti = 0;
  if (cfg.detectMultiTab && typeof BroadcastChannel !== "undefined") {
    try {
      bc = new BroadcastChannel("ac_vip_bus");
      bc.postMessage({ type: "hello", id: myId });
      bc.onmessage = (ev) => {
        if (!enabled) return;
        const d = ev.data || {};
        if (!d.id || d.id === myId) return;
        if (d.type === "hello") { others.add(d.id); bc.postMessage({ type: "ack", id: myId }); }
        else if (d.type === "ack") others.add(d.id);
        else if (d.type === "bye") { others.delete(d.id); return; }
        const n = _DATE();
        if (n - lastMulti > 2000) { lastMulti = n; emit("MultiTab", { count: others.size + 1 }); }
      };
      _N.addEL.call(window, "beforeunload", () => {
        try { bc.postMessage({ type: "bye", id: myId }); } catch (e) {}
      });
    } catch (e) {}
  }

  // ══════════════════════════════════════════════════════════════════
  // AUTO-CLICK
  // ══════════════════════════════════════════════════════════════════
  if (cfg.detectAutoClick) {
    _N.addEL.call(document, "click", (e) => {
      if (!enabled) return;
      if (!e.isTrusted) {
        try { e.preventDefault(); e.stopPropagation(); } catch (er) {}
        emit("AutoClick", { kind: "click" });
        return false;
      }
    }, true);
    _N.addEL.call(document, "change", (e) => {
      if (!enabled) return;
      if (!e.isTrusted) {
        try { e.preventDefault(); e.stopPropagation(); } catch (er) {}
        emit("AutoClick", { kind: "change" });
        return false;
      }
    }, true);
  }

  // ══════════════════════════════════════════════════════════════════
  // IFRAME / DOMAIN
  // ══════════════════════════════════════════════════════════════════
  if (cfg.detectIframe) {
    try {
      if (window.top !== window.self) emit("Violation", { reason: "iframe-embed" });
    } catch (e) { emit("Violation", { reason: "iframe-embed-cross" }); }
  }

  if (cfg.detectDomain) {
    try {
      const host = String(location.hostname || "").toLowerCase();
      if (!_HOSTS.includes(host)) {
        emit("DomainMismatch", { host });
        activateKillSwitch("Domain not allowed: " + host);
      }
    } catch (e) {}
  }

  // ══════════════════════════════════════════════════════════════════
  // LOCK RESTORE (từ sessionStorage nếu bị F5 khi đang lock)
  // ══════════════════════════════════════════════════════════════════
  if (cfg.killSwitch === "lock") {
    try {
      const lockUntil = parseInt(sessionStorage.getItem(_LOCK_KEY) || "0", 10);
      if (lockUntil && _DATE() < lockUntil) {
        activateKillSwitch("Locked from previous detection");
        _ST.call(window, () => {
          try { sessionStorage.removeItem(_LOCK_KEY); } catch (e) {}
          deactivateKillSwitch();
        }, lockUntil - _DATE());
      } else if (lockUntil) {
        try { sessionStorage.removeItem(_LOCK_KEY); } catch (e) {}
      }
    } catch (e) {}
  }

  // ══════════════════════════════════════════════════════════════════
  // UNIFIED CHECK LOOP (gộp tất cả setInterval vào 1)
  // ══════════════════════════════════════════════════════════════════
  const isTouchPrimary = (() => {
    try { return window.matchMedia && window.matchMedia("(pointer: coarse)").matches; }
    catch (e) { return false; }
  })();

  let devCount = 0;
  let tickCounter = 0;

  _SI.call(window, () => {
    if (!enabled) return;
    tickCounter++;

    // ── Every 500ms: viewport diff (chỉ khi không phải mobile) ──
    if (cfg.detectDevtools && !isTouchPrimary) {
      try {
        const wDiff = Math.abs(window.outerWidth - window.innerWidth);
        const hDiff = Math.abs(window.outerHeight - window.innerHeight);
        const threshold = 160;
        const isOpen = (window.outerWidth > 0 && wDiff > threshold) ||
                       (window.outerHeight > 0 && hDiff > threshold);
        if (isOpen) {
          devCount++;
          // 4 lần liên tiếp (2s) mới kết luận — filter false positive
          if (devCount >= 4 && !killActive) {
            if (cfg.clearConsoleOnOpen) { try { console.clear(); } catch (e) {} }
            emit("DevtoolsOpen", { method: "viewport", wDiff, hDiff });
            activateKillSwitch("DevTools detected (diff " + wDiff + "x" + hDiff + ")");
          }
        } else {
          if (devCount > 0 && killActive) {
            devCount = 0;
            deactivateKillSwitch();
          } else {
            devCount = 0;
          }
        }
      } catch (e) {}
    }

    // ── Every 1s (2 ticks): console integrity ──
    if (cfg.detectConsoleIntegrity && tickCounter % 2 === 0) {
      try {
        const cLogStr = _N.ftS.call(console.log);
        if (cLogStr.indexOf("[native code]") === -1) {
          emit("Tamper", { target: "console.log" });
        }
      } catch (e) {}
    }

    // ── Every 2s (4 ticks): function tamper ──
    if (cfg.detectFunctionTamper && tickCounter % 4 === 0) {
      try {
        const ftsStr = _N.ftS.call(Function.prototype.toString);
        if (ftsStr.indexOf("[native code]") === -1) {
          emit("Tamper", { target: "Function.prototype.toString" });
        }
        const addELStr = _N.ftS.call(EventTarget.prototype.addEventListener);
        if (addELStr.indexOf("[native code]") === -1) {
          emit("Tamper", { target: "EventTarget.addEventListener" });
        }
      } catch (e) {}
    }

    // ── Every 3s (6 ticks): setInterval tamper ──
    if (cfg.detectIntervalTamper && tickCounter % 6 === 0) {
      try {
        const siDesc = _N.getDesc.call(Object, window, "setInterval");
        if (siDesc && siDesc.value) {
          const siStr = _N.ftS.call(siDesc.value);
          if (siStr.indexOf("[native code]") === -1) {
            emit("Tamper", { target: "window.setInterval" });
          }
        }
      } catch (e) {}
    }
  }, cfg.detectDevtoolsInterval);

  // ══════════════════════════════════════════════════════════════════
  // FREEZE CRITICAL APIS (opt-in, có thể gây lỗi nếu lib khác override)
  // ══════════════════════════════════════════════════════════════════
  if (cfg.freezeApis && !devMode) {
    try {
      // Freeze console object — không cho override
      Object.freeze(console);
    } catch (e) {}
    try {
      // Freeze shield API callers (không cho gọi disable)
      // Không freeze window để tránh break
    } catch (e) {}
  }

  // ══════════════════════════════════════════════════════════════════
  // PUBLIC API
  // ══════════════════════════════════════════════════════════════════
  return {
    disable() {
      if (!devMode) {
        emit("Tamper", { reason: "unauthorized-disable" });
        console.warn("[anticheat] disable() từ chối — cần window.__AC_DEV_MODE__ = true trước khi load trang.");
        return false;
      }
      enabled = false;
      deactivateKillSwitch();
      return true;
    },
    enable() { enabled = true; return true; },
    getViolationCount() {
      let n = 0;
      for (const k in counts) n += counts[k];
      return n;
    },
    getCounts() { return Object.assign({}, counts); },
    resetCounts() { for (const k in counts) delete counts[k]; },
    get isActive() { return enabled; },
    get isDevMode() { return devMode; },
    get config() { return cfg; },
    get uptime() { return _DATE() - startedAt; }
  };
}

// ══════════════════════════════════════════════════════════════════════
// SINGLETON
// ══════════════════════════════════════════════════════════════════════
let SHIELD = null;
let MANUAL = false;

// ══════════════════════════════════════════════════════════════════════
// PUBLIC: installAntiCheat()
// ══════════════════════════════════════════════════════════════════════
export function installAntiCheat(opts = {}) {
  MANUAL = true;
  if (!SHIELD) {
    SHIELD = _buildShield(opts);
  } else {
    Object.assign(SHIELD.config, opts);
  }
  return SHIELD;
}

// ══════════════════════════════════════════════════════════════════════
// AUTO-INSTALL
// ══════════════════════════════════════════════════════════════════════
(function _autoSchedule() {
  const go = () => {
    _ST.call(window, () => {
      if (!MANUAL && !SHIELD) SHIELD = _buildShield({});
    }, 100);
  };
  try {
    if (document.readyState === "complete" || document.readyState === "interactive") {
      go();
    } else {
      _N.addEL.call(window, "load", go, { once: true });
    }
  } catch (e) {
    go();
  }
})();

// ══════════════════════════════════════════════════════════════════════
// GLOBAL EXPOSURE
// ══════════════════════════════════════════════════════════════════════
try {
  Object.defineProperty(window, "__AC_VIP__", {
    value: () => SHIELD,
    writable: false,
    configurable: false,
    enumerable: false
  });
} catch (e) {}
