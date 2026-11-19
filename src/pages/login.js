export function renderLogin(container, navigate) {
  const ICONS = window.__ICONS;

  const page = document.createElement('div');
  page.className = 'login-page page';
  page.innerHTML = `
    <div class="login-card">
      <div class="login-logo"><img src="/logo.png" alt="Genitourinary" /></div>
      <h1 class="login-title">Genitourinary</h1>
      <p class="login-subtitle">Medical Learning Platform</p>
      <form class="login-form" id="loginForm">
        <div class="input-group">
          <label for="username">Username</label>
          <input type="text" id="username" placeholder="Masukkan username kamu" autocomplete="off" maxlength="30" />
          <p class="input-error" id="usernameError">Username tidak boleh kosong</p>
        </div>
        <button type="submit" class="btn btn-primary btn-full">
          Mulai
          ${ICONS.arrowRight}
        </button>
      </form>
    </div>
  `;

  container.appendChild(page);

  const form = page.querySelector('#loginForm');
  const input = page.querySelector('#username');
  const error = page.querySelector('#usernameError');

  input.focus();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = input.value.trim();
    if (!username) {
      error.classList.add('visible');
      input.focus();
      return;
    }
    error.classList.remove('visible');
    sessionStorage.setItem('gu_username', username);
    navigate('dashboard');
  });

  input.addEventListener('input', () => {
    if (input.value.trim()) {
      error.classList.remove('visible');
    }
  });
}
