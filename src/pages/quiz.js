import { createHeader } from '../components/header.js';

const POINTS_CORRECT = 10;
const TIME_MAP = { Mudah: 15, Sedang: 20, Sulit: 25 };

export function renderQuiz(container, navigate, data) {
  const ICONS = window.__ICONS;
  const ALL_QUESTIONS = window.__QUESTIONS;
  const { difficulty } = data;
  const TIME_PER_QUESTION = TIME_MAP[difficulty] || 20;

  const questions = ALL_QUESTIONS.filter((q) => q.difficulty === difficulty);
  const totalQuestions = questions.length;

  let currentIndex = 0;
  let score = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let timeoutCount = 0;
  let timer = null;
  let timeLeft = TIME_PER_QUESTION;
  let answered = false;

  const wrapper = document.createElement('div');
  wrapper.className = 'dashboard-page page';
  wrapper.appendChild(createHeader(navigate));

  const quizPage = document.createElement('div');
  quizPage.className = 'quiz-page';
  wrapper.appendChild(quizPage);

  container.appendChild(wrapper);

  function renderQuestion() {
    answered = false;
    timeLeft = TIME_PER_QUESTION;
    const q = questions[currentIndex];
    const progress = ((currentIndex) / totalQuestions) * 100;

    const badgeClass = difficulty === 'Mudah' ? 'badge-mudah' : difficulty === 'Sedang' ? 'badge-sedang' : 'badge-sulit';

    quizPage.innerHTML = `
      <div class="quiz-top-bar">
        <span class="quiz-counter">Soal ${currentIndex + 1} dari ${totalQuestions}</span>
        <span class="quiz-score-display">${ICONS.star} ${score} poin</span>
      </div>
      <div class="quiz-progress-track">
        <div class="quiz-progress-fill" style="width: ${progress}%"></div>
      </div>
      <div class="quiz-timer-bar">
        <div class="quiz-timer" id="timerDisplay">
          ${ICONS.clock}
          <span id="timerValue">${timeLeft}</span> detik
        </div>
        <span class="quiz-difficulty-badge ${badgeClass}">${difficulty}</span>
      </div>
      <div class="timer-track">
        <div class="timer-fill" id="timerFill" style="width: 100%"></div>
      </div>
      <div class="quiz-card">
        <p class="quiz-question">${escapeHtml(q.question)}</p>
        ${q.image ? `<img src="${q.image}" alt="Gambar soal" style="max-width:100%;border-radius:8px;margin-bottom:16px;" />` : ''}
        <div class="quiz-options" id="optionsContainer">
          ${['A', 'B', 'C', 'D'].map((letter) => `
            <button class="quiz-option" data-letter="${letter}">
              <span class="option-letter">${letter}</span>
              <span class="option-text">${escapeHtml(q.options[letter])}</span>
            </button>
          `).join('')}
        </div>
        <div id="feedbackContainer"></div>
        <div class="quiz-next-btn hidden" id="nextBtnContainer">
          <button class="btn btn-primary" id="nextBtn">
            ${currentIndex < totalQuestions - 1 ? 'Soal Berikutnya' : 'Lihat Hasil'}
            ${ICONS.arrowRight}
          </button>
        </div>
      </div>
    `;

    // bind option clicks
    const optionBtns = quizPage.querySelectorAll('.quiz-option');
    optionBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (answered) return;
        const chosen = btn.dataset.letter;
        lockAnswer(chosen);
      });
    });

    // bind next
    const nextBtn = quizPage.querySelector('#nextBtn');
    nextBtn.addEventListener('click', () => {
      if (currentIndex < totalQuestions - 1) {
        currentIndex++;
        renderQuestion();
      } else {
        finishQuiz();
      }
    });

    startTimer();
  }

  function startTimer() {
    clearInterval(timer);
    timeLeft = TIME_PER_QUESTION;
    updateTimerUI();

    timer = setInterval(() => {
      timeLeft--;
      updateTimerUI();
      if (timeLeft <= 0) {
        clearInterval(timer);
        handleTimeout();
      }
    }, 1000);
  }

  function updateTimerUI() {
    const timerDisplay = quizPage.querySelector('#timerDisplay');
    const timerValue = quizPage.querySelector('#timerValue');
    const timerFill = quizPage.querySelector('#timerFill');

    if (!timerValue) return;
    timerValue.textContent = timeLeft;

    const pct = (timeLeft / TIME_PER_QUESTION) * 100;
    if (timerFill) timerFill.style.width = pct + '%';

    // color states
    timerDisplay.classList.remove('warning', 'danger');
    if (timerFill) timerFill.classList.remove('warning', 'danger');

    if (timeLeft <= 5) {
      timerDisplay.classList.add('danger');
      if (timerFill) timerFill.classList.add('danger');
    } else if (timeLeft <= 10) {
      timerDisplay.classList.add('warning');
      if (timerFill) timerFill.classList.add('warning');
    }
  }

  function handleTimeout() {
    if (answered) return;
    answered = true;
    timeoutCount++;

    const q = questions[currentIndex];
    const correctLetter = q.answer;

    // lock all options
    const optionBtns = quizPage.querySelectorAll('.quiz-option');
    optionBtns.forEach((btn) => {
      btn.classList.add('locked');
      if (btn.dataset.letter === correctLetter) {
        btn.classList.add('reveal-correct');
      }
    });

    showFeedback('timeout', q);
    quizPage.querySelector('#nextBtnContainer').classList.remove('hidden');
  }

  function lockAnswer(chosen) {
    if (answered) return;
    answered = true;
    clearInterval(timer);

    const q = questions[currentIndex];
    const correctLetter = q.answer;
    const isCorrect = chosen === correctLetter;

    if (isCorrect) {
      score += POINTS_CORRECT;
      correctCount++;
    } else {
      wrongCount++;
    }

    // update score display
    const scoreEl = quizPage.querySelector('.quiz-score-display');
    if (scoreEl) {
      scoreEl.innerHTML = `${window.__ICONS.star} ${score} poin`;
    }

    // mark options
    const optionBtns = quizPage.querySelectorAll('.quiz-option');
    optionBtns.forEach((btn) => {
      btn.classList.add('locked');
      const letter = btn.dataset.letter;
      if (letter === chosen && isCorrect) {
        btn.classList.add('correct');
      } else if (letter === chosen && !isCorrect) {
        btn.classList.add('wrong');
      }
      if (!isCorrect && letter === correctLetter) {
        btn.classList.add('reveal-correct');
      }
    });

    showFeedback(isCorrect ? 'correct' : 'wrong', q);
    quizPage.querySelector('#nextBtnContainer').classList.remove('hidden');
  }

  function showFeedback(type, q) {
    const ICONS = window.__ICONS;
    const feedbackContainer = quizPage.querySelector('#feedbackContainer');
    let className, title, answerLine;

    if (type === 'correct') {
      className = 'feedback-correct';
      title = `${ICONS.check} Jawaban Benar!`;
      answerLine = '';
    } else if (type === 'wrong') {
      className = 'feedback-wrong';
      title = `${ICONS.x} Jawaban Kurang Tepat`;
      answerLine = `<p class="feedback-answer">Jawaban yang benar: ${q.answer}. ${escapeHtml(q.options[q.answer])}</p>`;
    } else {
      className = 'feedback-timeout';
      title = `${ICONS.clock} Waktu Habis`;
      answerLine = `<p class="feedback-answer">Jawaban yang benar: ${q.answer}. ${escapeHtml(q.options[q.answer])}</p>`;
    }

    feedbackContainer.innerHTML = `
      <div class="quiz-feedback ${className}">
        <div class="feedback-title">${title}</div>
        ${answerLine}
        <p class="feedback-explanation"><strong>Pembahasan:</strong> ${escapeHtml(q.explanation)}</p>
      </div>
    `;
  }

  function finishQuiz() {
    clearInterval(timer);
    navigate('results', {
      difficulty,
      score,
      correctCount,
      wrongCount,
      timeoutCount,
      totalQuestions,
    });
  }

  renderQuestion();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
