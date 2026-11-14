import { loadSession, clearSession, checkFirebaseBan, syncUnbanEpoch, isAdminUsername } from "/js/core.js";
export const $ = (id) => document.getElementById(id);
export const go = () => location.replace("/");
export async function sha256Hex(s) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("");
}
/* Đã đăng nhập thì chuyển thẳng về trang chính. Trả về true nếu cần hiện form. */
export async function redirectIfLoggedIn() {
  try { await syncUnbanEpoch(); } catch (e) {}
  const s = loadSession();
  if (!s) return true;
  if (s.isAdmin === true && isAdminUsername(s.username)) { go(); return false; }
  try {
    if (!(await checkFirebaseBan(s.username))) { go(); return false; }
    clearSession();
    $("err").textContent = "Tài khoản đã bị khóa.";
    return true;
  } catch (e) { go(); return false; }
}

/* Nút 👁 hiện/ẩn mật khẩu */
export function bindEyes() {
  document.querySelectorAll(".eye").forEach((b) => {
    b.onclick = () => {
      const i = b.parentElement.querySelector("input");
      const show = i.type === "password";
      i.type = show ? "text" : "password";
      b.textContent = show ? "🙈" : "👁";
    };
  });
}
/* Nút chính: hiện spinner khi đang xử lý */
export function busy(btn, on, label) {
  btn.disabled = on;
  btn.innerHTML = on ? '<span class="sp"></span> Đang xử lý…' : label;
}
