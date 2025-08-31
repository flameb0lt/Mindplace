
let breathingTimer;
let breathingPhase = 'ready';
let breathingCycles = 0;
let sessionCycles = 0;
let isBreathingActive = false;

const breathingCircle = document.getElementById('breathing-circle');
const breathingText = document.getElementById('breathing-text');
const counter = document.getElementById('counter');
const startBtn = document.getElementById('start-breathing');
const pauseBtn = document.getElementById('pause-breathing');
const resetBtn = document.getElementById('reset-breathing');
const sessionInfo = document.getElementById('session-info');
const progressFill = document.getElementById('progress-fill');
const particlesContainer = document.getElementById('particles');

function updateBreathing(phase, count) {
  breathingCircle.className = 'breathing-circle';
  
  switch (phase) {
    case 'ready':
      counter.textContent = 'Ready';
      breathingText.textContent = 'Click "Start" to begin your breathing exercise';
      break;
    case 'inhale':
      breathingCircle.classList.add('inhale');
      counter.textContent = count;
      breathingText.textContent = 'Breathe in slowly...';
      createParticles();
      break;
    case 'hold':
      counter.textContent = count;
      breathingText.textContent = 'Hold your breath...';
      break;
    case 'exhale':
      breathingCircle.classList.add('exhale');
      counter.textContent = count;
      breathingText.textContent = 'Breathe out slowly...';
      break;
    case 'paused':
      breathingText.textContent = 'Breathing paused - click "Start" to continue';
      break;
  }
}

function createParticles() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 40;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      
      particle.style.left = `calc(50% + ${x}px)`;
      particle.style.top = `calc(50% + ${y}px)`;
      
      particlesContainer.appendChild(particle);
      
      setTimeout(() => particle.classList.add('animate'), 10);
      
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 3000);
    }, i * 100);
  }
}

function runBreathingCycle() {
  let phaseCount = 4;
  
  function nextPhase(phase) {
    breathingPhase = phase;
    let countdown = phaseCount;
    updateBreathing(phase, countdown);
    
    const phaseTimer = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        updateBreathing(phase, countdown);
      } else {
        clearInterval(phaseTimer);
        
        if (!isBreathingActive) return;
        
        switch(phase) {
          case 'inhale':
            nextPhase('hold');
            break;
          case 'hold':
            nextPhase('exhale');
            break;
          case 'exhale':
            breathingCycles++;
            sessionCycles++;
            updateSessionInfo();
            updateProgressBar();
            
            if (isBreathingActive) {
              setTimeout(() => nextPhase('inhale'), 1000);
            }
            break;
        }
      }
    }, 1000);
    
    breathingTimer = phaseTimer;
  }
  
  nextPhase('inhale');
}

function updateSessionInfo() {
  sessionInfo.textContent = `Total sessions: ${sessionCycles} cycles completed`;
}

function updateProgressBar() {
  const progress = (breathingCycles % 5) / 5 * 100;
  progressFill.style.width = `${progress}%`;
}

startBtn.addEventListener('click', () => {
  if (!isBreathingActive) {
    isBreathingActive = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    runBreathingCycle();
  }
});

pauseBtn.addEventListener('click', () => {
  isBreathingActive = false;
  clearInterval(breathingTimer);
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  updateBreathing('paused');
});

resetBtn.addEventListener('click', () => {
  isBreathingActive = false;
  clearInterval(breathingTimer);
  breathingCycles = 0;
  breathingPhase = 'ready';
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  updateBreathing('ready');
  progressFill.style.width = '0%';
  particlesContainer.innerHTML = '';
});