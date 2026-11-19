import { createHeader } from '../components/header.js';

export function renderSelectDifficulty(container, navigate) {
  const ICONS = window.__ICONS;

  const wrapper = document.createElement('div');
  wrapper.className = 'dashboard-page page';

  wrapper.appendChild(createHeader(navigate));

  const content = document.createElement('div');
  content.className = 'select-page';
  content.innerHTML = `
    <a class="back-link" id="backToDashboard">
      ${ICONS.arrowLeft}
      Kembali ke Dashboard
    </a>
    <h2>Pilih Tingkat Kesulitan</h2>
    <p class="select-subtitle">Setiap tingkatan berisi 15 soal dengan batas waktu yang berbeda</p>
    <div class="difficulty-grid">
      <div class="difficulty-card" data-level="Mudah">
        <div class="difficulty-icon">
          ${ICONS.heartPulse}
        </div>
        <h3 class="difficulty-name">Mudah</h3>
        <p class="difficulty-count">15 Soal · 15 detik/soal</p>
        <p class="difficulty-desc">Uji pemahaman dasar anatomi dan fisiologi sistem genitourinaria</p>
        <button class="btn btn-primary" data-start="Mudah">Pilih Tingkat</button>
      </div>
      <div class="difficulty-card" data-level="Sedang">
        <div class="difficulty-icon">
          ${ICONS.stethoscope}
        </div>
        <h3 class="difficulty-name">Sedang</h3>
        <p class="difficulty-count">15 Soal · 20 detik/soal</p>
        <p class="difficulty-desc">Uji pemahaman lanjutan tentang patofisiologi dan diagnosis klinis</p>
        <button class="btn btn-primary" data-start="Sedang">Pilih Tingkat</button>
      </div>
      <div class="difficulty-card" data-level="Sulit">
        <div class="difficulty-icon">
          ${ICONS.brain}
        </div>
        <h3 class="difficulty-name">Sulit</h3>
        <p class="difficulty-count">15 Soal · 25 detik/soal</p>
        <p class="difficulty-desc">Uji kemampuan analisis klinis dan tata laksana kasus kompleks</p>
        <button class="btn btn-primary" data-start="Sulit">Pilih Tingkat</button>
      </div>
    </div>
  `;

  wrapper.appendChild(content);
  container.appendChild(wrapper);

  content.querySelector('#backToDashboard').addEventListener('click', () => {
    navigate('dashboard');
  });

  content.querySelectorAll('[data-start]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const level = btn.dataset.start;
      navigate('quiz', { difficulty: level });
    });
  });
}
