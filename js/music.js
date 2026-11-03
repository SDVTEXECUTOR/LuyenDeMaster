/* ══════════════════════════════════════════════════════════════════════
   🎵 MUSIC.JS — MUSIC PLAYER DÙNG CHUNG
   ══════════════════════════════════════════════════════════════════════
   Import bởi: index.html, khoahoctunhien.html, Tower.html
   
   Danh sách bài hát + key localStorage nằm trong config.js.
   Muốn thêm/bớt bài → sửa SONGS trong config.js.
   
   Cách dùng:
     import { createMusicPlayer } from '/js/music.js';
     
     const music = createMusicPlayer({
       audio: document.getElementById("bgMusic"),
       onLabelChange: (html) => { ... },
       onToggle: (isOn) => { ... }
     });
   
   API:
     music.isOn          → boolean
     music.mode          → "random" | "playlist"
     music.sel           → string[] (id các bài đã chọn)
     music.SONGS         → array (từ config.js)
     music.setOn(bool)   → bật/tắt
     music.setMode(m,ids)→ đổi chế độ + danh sách
     music.playCurrent() → phát bài hiện tại
     music.playNext()    → chuyển bài
     music.build()       → tạo playlist mới (chưa phát)
   ══════════════════════════════════════════════════════════════════════ */

import { SONGS, MUSIC_KEY, MUSIC_MODE_KEY, MUSIC_SELECTED_KEY } from "./config.js";


/* ──────────────────────────────────────────────────────────────────────
   🎼 CREATE MUSIC PLAYER
   ────────────────────────────────────────────────────────────────────── */
export function createMusicPlayer(opts = {}) {
  const {
    audio,
    onLabelChange = null,
    onToggle = null,
    skipOnError = true,
    resumeOnInteraction = true
  } = opts;

  if (!audio || typeof audio.play !== "function") {
    throw new Error("[music] Cần truyền { audio: HTMLAudioElement }");
  }

  // ─── State ───
  let isOn = localStorage.getItem(MUSIC_KEY) === "on";
  let mode = localStorage.getItem(MUSIC_MODE_KEY) || "random";

  let sel;
  try {
    sel = JSON.parse(localStorage.getItem(MUSIC_SELECTED_KEY));
    if (!Array.isArray(sel) || sel.length === 0) sel = SONGS.map(s => s.id);
  } catch (e) {
    sel = SONGS.map(s => s.id);
  }

  let playlist = [];
  let playIndex = 0;

  // ─── Helpers ───
  const build = () => {
    if (mode === "random") return [...SONGS].sort(() => Math.random() - 0.5);
    const filtered = SONGS.filter(s => sel.includes(s.id));
    return filtered.length > 0 ? filtered : [SONGS[0]];
  };

  const emitLabel = () => {
    if (!onLabelChange) return;
    if (mode === "random") {
      onLabelChange('🎵 Đang phát: <b>Ngẫu nhiên</b>');
      return;
    }
    const selected = SONGS.filter(s => sel.includes(s.id));
    if (selected.length === 0) onLabelChange('🎵 Đang phát: <b>Chưa chọn bài</b>');
    else if (selected.length === 1) onLabelChange(`🎵 Đang phát: <b>${selected[0].title}</b>`);
    else onLabelChange(`🎵 Đang phát: <b>Danh sách (${selected.length} bài)</b>`);
  };

  const playCurrent = () => {
    if (!isOn || playlist.length === 0) return;
    const song = playlist[playIndex];
    if (!song) return;
    if (!audio.src || !audio.src.endsWith(song.src)) audio.src = song.src;
    audio.play().catch(() => {});
    emitLabel();
  };

  const playNext = () => {
    if (!isOn) return;
    if (playlist.length === 0) playlist = build();
    playIndex++;
    if (playIndex >= playlist.length) {
      playIndex = 0;
      if (mode === "random") playlist = build();
    }
    playCurrent();
  };

  // ─── Audio events ───
  audio.addEventListener("ended", playNext);
  if (skipOnError) {
    audio.addEventListener("error", () => {
      if (isOn && playlist.length > 1) playNext();
    });
  }

  // ─── Public API ───
  const setOn = (v) => {
    isOn = !!v;
    localStorage.setItem(MUSIC_KEY, isOn ? "on" : "off");
    if (onToggle) onToggle(isOn);
    if (isOn) {
      if (playlist.length === 0) { playlist = build(); playIndex = 0; }
      playCurrent();
    } else {
      audio.pause();
    }
  };

  const setMode = (m, ids) => {
    mode = m === "playlist" ? "playlist" : "random";
    sel = Array.isArray(ids) ? ids.slice() : SONGS.map(s => s.id);
    localStorage.setItem(MUSIC_MODE_KEY, mode);
    localStorage.setItem(MUSIC_SELECTED_KEY, JSON.stringify(sel));
    playlist = build();
    playIndex = 0;
    if (isOn) playCurrent();
    else emitLabel();
  };

  // ─── Resume khi user tương tác (vượt autoplay policy) ───
  if (resumeOnInteraction) {
    const kick = () => {
      if (isOn && audio.paused && playlist.length > 0) playCurrent();
    };
    document.body.addEventListener("click", kick);
    document.body.addEventListener("touchstart", kick, { passive: true });
    document.body.addEventListener("keydown", kick);
  }

  // ─── Init ───
  if (isOn) {
    playlist = build();
    playIndex = 0;
    emitLabel();
  } else {
    emitLabel();
  }

  return {
    get isOn()  { return isOn; },
    get mode()  { return mode; },
    get sel()   { return sel.slice(); },
    get SONGS() { return SONGS; },
    setOn,
    setMode,
    playCurrent,
    playNext,
    build: () => build()
  };
}
