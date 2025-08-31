const buttons = document.querySelectorAll('nav button');
const navButtons = document.querySelectorAll('nav button'); 
const sections = document.querySelectorAll('main section');

navButtons.forEach(button => {
  button.addEventListener('click', ()=>{
    const target = button.getAttribute('data-target');
    sections.forEach(section => {
      section.hidden = section.id !== target;
  })});
  });
  
  buttons.forEach(button => {
  button.addEventListener('click', () => {
    if (button.classList.contains('active')) return;
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const targetId = button.getAttribute('data-target');
    sections.forEach(section => {
      if (section.id === targetId) {
        section.classList.remove('hidden');
      } else if (section.id !== "home-screen") {
        section.classList.add('hidden');
      }
    });
  });
})


const getStartedBtn = document.getElementById('get-started-btn');
const homeScreen = document.getElementById('home-screen');
const appUI = document.getElementById('app-ui');

getStartedBtn.addEventListener('click', () => {
  homeScreen.classList.add('hidden');
  appUI.classList.remove('hidden');
});

// the stress quiz
const quizForm = document.getElementById('stress-quiz-form');
const quizContainer = document.getElementById('quiz-questions');
const quizResult = document.getElementById('quiz-result');
let stressScore = 0

// answers the user can choose
const answerOptions = [
    {label: "Never", value: 0},
    {label: "Rarely", value: 1},
    {label: "Sometimes", value: 2},
    {label: "Often", value: 3},
    {label: "Almost always", value: 4}
]

// Enhanced questions with categories for personalized tips
const quizQuestions = [
  {question: "Do you have trouble staying focused on the present moment?", category: "focus"},
  {question: "How often do you feel overwhelmed with your life?", category: "overwhelm"},
  {question: "Do you struggle to fall asleep at night?", category: "sleep"},
  {question: "On average, do you get less than 7-8 hours of sleep a night?", category: "sleep"},
  {question: "Do you experience physical symptoms, such as headaches, muscle tension, or stomach problems?", category: "physical"},
  {question: "During school hours, do you have a hard time staying focused and concentrating on the task-at-hand?", category: "school"},
  {question: "Do you feel like isolating yourself, whether from friends or family, and/or avoiding social situations?", category: "social"},
  {question: "Do you frequently feel tired or fatigued, even after getting enough sleep?", category: "physical"},
  {question: "Do you find yourself feeling irritable or easily agitated, even over minor things?", category: "emotional"},
  {question: "Have you noticed changes in your eating or sleeping patterns, such as difficulty falling or staying asleep or an increase or decrease in appetite?", category: "physical"},
  {question: "Do you feel unsure or nervous about the future?", category: "anxiety"},
  {question: "Do you feel like you don't want to do your homework, or if it's not worth trying anymore in your classes?", category: "school"},
  {question: "Do you find it hard to calm down after getting upset?", category: "emotional"}
];

// Personalized tips based on categories
const personalizedTips = {
  focus: "Try the 5-4-3-2-1 grounding technique: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
  overwhelm: "When overwhelmed, try breaking tasks into smaller steps. Use our breathing exercises to center yourself.",
  sleep: "Create a bedtime routine. Try setting a better schedule.",
  physical: "Physical symptoms often improve with regular exercise, proper hydration, and stress management techniques.",
  school: "Try better studying habits.",
  social: "Social connection is important for mental health. Try reaching out to one trusted friend or family member.",
  emotional: "Try to be kinder to yourself, and be calmer.",
  anxiety: "Remember that this type of feeling, and try to not to feel as overly anxious."
};

// how questions are rendered
quizQuestions.forEach((item, index) => {
  const questionDiv = document.createElement('div');
  questionDiv.className = 'quiz-question';

  const questionText = document.createElement('p');
  questionText.innerText = `${index + 1}. ${item.question}`;
  questionDiv.appendChild(questionText);

  answerOptions.forEach(option => {
    const label = document.createElement('label');
    label.style.display = 'block';
    label.innerHTML = `
      <input type="radio" name="q${index}" value="${option.value}" data-category="${item.category}" />
      ${option.label}
    `;
    questionDiv.appendChild(label);
  });
 quizContainer.appendChild(questionDiv);
});

quizForm?.addEventListener('submit', function (e) {
  e.preventDefault();
  let stressScore = 0;
  let incomplete = false;
  let categoryScores = {};

  for (let i = 0; i < quizQuestions.length; i++) {
    const selected = quizForm.querySelector(`input[name="q${i}"]:checked`);
    if (selected) {
      const value = parseInt(selected.value);
      const category = selected.getAttribute('data-category');
      
      stressScore += value;
      
      if (!categoryScores[category]) {
        categoryScores[category] = 0;
      }
      categoryScores[category] += value;
    } else {
      incomplete = true;
    }
  }

  if (incomplete) {
    quizResult.innerText = 'Please answer all questions before submitting.';
    quizResult.style.color = 'red';
    return;
  }  let message = '';
  let tips = [];
  
  if (stressScore <= 12) {
    message = "You seem to have very low stress. Keep up the healthy habits!";
  } else if (stressScore <= 26) {
    message = "You have some signs of stress. Consider using our breathing or journaling tools!";
  } else if (stressScore <= 39) {
    message = "You're showing moderate signs of stress. It's a good idea to take regular breaks and practice self-care.";
  } else {
    message = "You appear to be highly stressed. Please prioritize rest, reach out to someone you trust, and try using our tools daily.";
  }

  const sortedCategories = Object.entries(categoryScores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 2);

  sortedCategories.forEach(([category]) => {
    if (personalizedTips[category]) {
      tips.push(personalizedTips[category]);
    }
  });

  let resultHTML = `<p style="font-weight: bold; margin-bottom: 1rem;">${message}</p>`;
  if (tips.length > 0) {
    resultHTML += `<div style="background: #f0f5fb; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
      <h4 style="margin-top: 0; color: #4275e3;">Personalized Tips for You:</h4>
      ${tips.map(tip => `<p style="margin: 0.5rem 0;">${tip}</p>`).join('')}
    </div>`;
  }

  quizResult.innerHTML = resultHTML;
  quizResult.style.color = '#2a4a8f';
});

// the journal feature
const journalInput = document.getElementById("journal-entry");
const saveJournal = document.getElementById("save-journal");
const clearJournal = document.getElementById("clear-journal");
const newJournal = document.getElementById("new");
const statusText = document.getElementById("journal-status");
const entriesContainer = document.getElementById("entries-container");

window.addEventListener('load', () => {
    const saved = localStorage.getItem('journal-entry');
    if (saved) {
        journalInput.value = saved;
    }
    loadPreviousEntries();
});

let saveTimeout;
journalInput.addEventListener('input', () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        localStorage.setItem('journal-entry', journalInput.value);
    }, 1000);
});

saveJournal.addEventListener('click', () => {
    const entryText = journalInput.value.trim();
    
    if (!entryText) {
        statusText.innerText = 'Please write something before saving.';
        statusText.style.color = 'red';
        setTimeout(() => statusText.innerText = '', 3000);
        return;
    }
    
    // Check for duplicates
    const existingEntries = getAllSavedEntries();
    const isDuplicate = existingEntries.some(entry => 
        entry.text === entryText && 
        (Date.now() - new Date(entry.created).getTime()) < 60000
    );
    
    if (isDuplicate) {
        statusText.innerText = 'This entry was already saved recently.';
        statusText.style.color = 'orange';
        setTimeout(() => statusText.innerText = '', 3000);
        return;
    }
    
    const saveSuccess = createAndSaveEntry(entryText);
    
    if (saveSuccess) {
        localStorage.setItem('journal-entry', entryText);
        const wordCount = entryText.split(/\s+/).length;
        statusText.innerHTML = `✓ Entry saved! (${wordCount} words)`;
        statusText.style.color = 'green';
    } else {
        statusText.innerText = 'Failed to save entry. Please try again.';
        statusText.style.color = 'red';
    }
    
    setTimeout(() => statusText.innerText = '', 4000);
});

// Clear journal functionality
clearJournal.addEventListener('click', () => {
    journalInput.value = '';
    localStorage.removeItem('journal-entry');
    statusText.innerText = 'Entry cleared';
    statusText.style.color = 'red';
    setTimeout(() => statusText.innerText = '', 3000);
});

newJournal.addEventListener('click', () => {
    const currentEntry = journalInput.value.trim();
    
    if (currentEntry) {
        const saveBeforeNew = confirm('You have unsaved content. Would you like to save it before starting a new entry?');
        if (saveBeforeNew) {
            createAndSaveEntry(currentEntry);
            statusText.innerText = 'Previous entry saved, started new entry';
            statusText.style.color = 'green';
        } else {
            statusText.innerText = 'Started new entry (previous content discarded)';
            statusText.style.color = 'orange';
        }
    } else {
        statusText.innerText = 'Started new entry';
        statusText.style.color = 'blue';
    }
    
    journalInput.value = '';
    localStorage.removeItem('journal-entry');
    journalInput.focus();
    
    setTimeout(() => statusText.innerText = '', 3000);
});

function createAndSaveEntry(entryText) {
    if (!entryText || entryText.trim() === '') {
        return false;
    }
    
    const entries = getAllSavedEntries();
    const now = new Date();
    
    const newEntry = {
        id: now.getTime(),
        text: entryText.trim(),
        date: now.toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        }),
        time: now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        }),
        wordCount: entryText.trim().split(/\s+/).length,
        created: now.toISOString()
    };
    
    entries.unshift(newEntry);
    
    if (entries.length > 25) {
        entries.splice(25);
    }
    
    try {
        localStorage.setItem('journal-entries', JSON.stringify(entries));
        loadPreviousEntries();
        return true;
    } catch (error) {
        console.error('Failed to save entry:', error);
        statusText.innerText = 'Error saving entry - storage might be full';
        statusText.style.color = 'red';
        return false;
    }
}

function getAllSavedEntries() {
    try {
        const entriesData = localStorage.getItem('journal-entries');
        if (!entriesData) {
            return [];
        }
        const entries = JSON.parse(entriesData);
        
        if (Array.isArray(entries)) {
            return entries.filter(entry => 
                entry && 
                entry.id && 
                entry.text && 
                entry.text.trim() !== ''
            );
        }
        
        return [];
    } catch (error) {
        console.error('Error loading entries:', error);
        return [];
    }
}

function loadPreviousEntries() {
    const entries = getAllSavedEntries();
    entriesContainer.innerHTML = '';
    
    if (entries.length === 0) {
        entriesContainer.innerHTML = '<p style="color: #666; font-style: italic;">No previous entries yet. Start writing!</p>';
        return;
    }
    
    entries.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.style.cssText = `
            background: #f8f9fa;
            border-left: 4px solid #4275e3;
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 8px;
            position: relative;
        `;
        
        entryDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <small style="color: #666; font-weight: bold;">${entry.date} at ${entry.time}</small>
                <button onclick="deleteEntry(${entry.id})" style="background: #ff4757; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">Delete</button>
            </div>
            <p style="margin: 0; line-height: 1.5; color: #333;">${entry.text.length > 200 ? entry.text.substring(0, 200) + '...' : entry.text}</p>
            ${entry.text.length > 200 ? `<button onclick="toggleExpand(this, ${entry.id})" style="background: none; border: none; color: #4275e3; cursor: pointer; padding: 0; margin-top: 0.5rem;">Read more</button>` : ''}
        `;
        
        entriesContainer.appendChild(entryDiv);
    });
}

// Global functions for entry management
window.deleteEntry = function(entryId) {
    if (confirm('Are you sure you want to delete this entry?')) {
        let entries = getAllSavedEntries();
        entries = entries.filter(entry => entry.id !== entryId);
        localStorage.setItem('journal-entries', JSON.stringify(entries));
        loadPreviousEntries();
    }
};

window.toggleExpand = function(button, entryId) {
    const entries = getAllSavedEntries();
    const entry = entries.find(e => e.id === entryId);
    const textP = button.previousElementSibling;
    
    if (button.textContent === 'Read more') {
        textP.textContent = entry.text;
        button.textContent = 'Read less';
    } else {
        textP.textContent = entry.text.substring(0, 200) + '...';
        button.textContent = 'Read more';
    }
};

// the breathing feature 

// breathing section

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
