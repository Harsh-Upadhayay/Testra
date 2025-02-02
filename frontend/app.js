const backend = "http://localhost:8000";
let currentExam = null;
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 60 * 60;
let timerInterval;
let sessionId = null;
let questionProgress = {};
let questionStartTime = null;

// Rest of the JavaScript code from the original file
// (keep all the functions but update the toggleFlag and updateNavPane as below)

function toggleFlag() {
  const progress = questionProgress[currentQuestionIndex];
  if (!progress) return;
  
  progress.flagged = !progress.flagged;
  updateQuestionProgress(currentQuestionIndex, progress);
  saveProgress();
}

function updateNavPane() {
  const navItems = document.querySelectorAll('#question-nav li');
  navItems.forEach((li, index) => {
    li.className = '';
    const progress = questionProgress[index] || {};
    
    // Update question state
    if (progress.submitted) {
      li.classList.add(progress.correct ? 'nav-correct' : 'nav-wrong');
    } else if (progress.answer !== null && progress.answer !== undefined) {
      li.classList.add('nav-attempted');
    } else {
      li.classList.add('nav-not-attempted');
    }

    // Update flag display
    li.innerHTML = (index + 1).toString();
    if (progress.flagged) {
      li.innerHTML += ' <span class="flag-icon">🚩</span>';
    }
  });
}

// Keep all other functions the same as original but now in separate file