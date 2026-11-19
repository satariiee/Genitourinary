export function createHeader(navigate) {
  const ICONS = window.__ICONS;
  const username = sessionStorage.getItem('gu_username') || 'Pengguna';
  const initial = username.charAt(0).toUpperCase();

  const header = document.createElement('header');
  header.className = 'app-header';
  header.innerHTML = `
    <div class="header-brand">
      <div class="header-logo"><img src="/logo.png" alt="Genitourinary" /></div>
      <span class="header-brand-name">Genitourinary</span>
    </div>
    <div class="header-user">
      <div class="header-avatar">${initial}</div>
      <span class="header-username">${escapeHtml(username)}</span>
      <button class="btn btn-ghost btn-logout" id="logoutBtn">Keluar</button>
    </div>
  `;

  header.querySelector('#logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('gu_username');
    navigate('login');
  });

  return header;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
