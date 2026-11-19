import { createHeader } from '../components/header.js';

export function renderResults(container, navigate, data) {
  const ICONS = window.__ICONS;
  const username = sessionStorage.getItem('gu_username') || 'Pengguna';
  const { difficulty, score, correctCount, wrongCount, timeoutCount, totalQuestions } = data;
  const maxScore = totalQuestions * 10;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  let iconClass, message;
  if (percentage >= 80) {
    iconClass = 'icon-great';
    message = `Kerja bagus! Kamu berhasil menjawab ${correctCount} dari ${totalQuestions} soal dengan benar. Pemahaman kamu sangat baik!`;
  } else if (percentage >= 50) {
    iconClass = 'icon-good';
    message = `Lumayan! Kamu menjawab ${correctCount} dari ${totalQuestions} soal dengan benar. Terus tingkatkan pemahaman kamu.`;
  } else {
    iconClass = 'icon-low';
    message = `Kamu menjawab ${correctCount} dari ${totalQuestions} soal dengan benar. Jangan menyerah, pelajari kembali materinya dan coba lagi!`;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'dashboard-page page';
  wrapper.appendChild(createHeader(navigate));

  const resultsPage = document.createElement('div');
  resultsPage.className = 'results-page';
  resultsPage.innerHTML = `
    <div class="results-card">
      <div class="results-icon ${iconClass}">
        ${ICONS.trophy}
      </div>
      <h2 class="results-title">Hasil Quiz — ${escapeHtml(difficulty)}</h2>
      <p class="results-message">${escapeHtml(message)}</p>
      <div class="results-score-big">
        ${score} <span>/ ${maxScore} poin</span>
      </div>
      <div class="results-stats">
        <div class="result-stat">
          <div class="result-stat-value" style="color: var(--success);">${correctCount}</div>
          <div class="result-stat-label">Jawaban Benar</div>
        </div>
        <div class="result-stat">
          <div class="result-stat-value" style="color: var(--error);">${wrongCount}</div>
          <div class="result-stat-label">Jawaban Salah</div>
        </div>
        <div class="result-stat">
          <div class="result-stat-value" style="color: #D97706;">${timeoutCount}</div>
          <div class="result-stat-label">Tidak Dijawab</div>
        </div>
        <div class="result-stat">
          <div class="result-stat-value">${percentage}%</div>
          <div class="result-stat-label">Persentase Benar</div>
        </div>
      </div>
      <div class="results-actions">
        <button class="btn btn-primary" id="retryBtn">
          ${ICONS.refresh}
          Ulangi Quiz
        </button>
        <button class="btn btn-outline" id="homeBtn">
          ${ICONS.home}
          Dashboard
        </button>
      </div>
    </div>
  `;

  wrapper.appendChild(resultsPage);
  container.appendChild(wrapper);

  resultsPage.querySelector('#retryBtn').addEventListener('click', () => {
    navigate('quiz', { difficulty });
  });

  resultsPage.querySelector('#homeBtn').addEventListener('click', () => {
    navigate('dashboard');
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
