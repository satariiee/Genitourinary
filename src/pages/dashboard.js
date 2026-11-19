import { createHeader } from '../components/header.js';

export function renderDashboard(container, navigate) {
  const ICONS = window.__ICONS;
  const username = sessionStorage.getItem('gu_username') || 'Pengguna';

  const wrapper = document.createElement('div');
  wrapper.className = 'dashboard-page page';

  wrapper.appendChild(createHeader(navigate));

  const hero = document.createElement('div');
  hero.className = 'dashboard-hero';
  hero.innerHTML = `
    <h1 class="dashboard-greeting">Halo, ${escapeHtml(username)}!</h1>
    <p class="dashboard-welcome">Selamat Datang di Genitourinary Quiz</p>
    <p class="dashboard-desc">
      Platform latihan soal kedokteran untuk mengasah pengetahuan klinis kamu.
      Pilih tingkat kesulitan dan kerjakan soal-soal yang sudah disiapkan.
    </p>
    <div class="dashboard-stats">
      <div class="stat-chip">
        ${ICONS.layers}
        <span>45 Soal Tersedia</span>
      </div>
      <div class="stat-chip">
        ${ICONS.barChart}
        <span>3 Tingkat Kesulitan</span>
      </div>
      <div class="stat-chip">
        ${ICONS.clock}
        <span>15–25 Detik per Soal</span>
      </div>
    </div>
    <div class="dashboard-cta">
      <button class="btn btn-primary" id="startQuizBtn">
        Mulai Quiz
        ${ICONS.arrowRight}
      </button>
    </div>
  `;

  wrapper.appendChild(hero);
  container.appendChild(wrapper);

  wrapper.querySelector('#startQuizBtn').addEventListener('click', () => {
    navigate('select');
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
