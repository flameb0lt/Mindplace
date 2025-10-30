// navigation
const navButtons = document.querySelectorAll('nav .nav-button');
const featureSections = document.querySelectorAll('.feature-section');

navButtons.forEach(button => {
  button.addEventListener('click', () => {
    navButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const target = button.getAttribute('data-target');

    featureSections.forEach(section => {
      section.classList.toggle('active', section.id === target);
    });
  });
});

const getStartedBtn = document.getElementById('get-started-btn');
const homeScreen = document.getElementById('home-screen');
const appUI = document.getElementById('app-ui');

// the stress quiz
const quizForm = document.getElementById('stress-quiz-form');
const quizContainer = document.getElementById('quiz-questions');
const quizResult = document.getElementById('quiz-result');
let stressScore = 0;

const answerOptions = [
  { label: "Never", value: 0 },
  { label: "Rarely", value: 1 },
  { label: "Sometimes", value: 2 },
  { label: "Often", value: 3 },
  { label: "Almost always", value: 4 }
];

const quizQuestions = [
  { question: "Do you have trouble staying focused on the present moment?", category: "focus" },
  { question: "How often do you feel overwhelmed with your life?", category: "overwhelm" },
  { question: "Do you struggle to fall asleep at night?", category: "sleep" },
  { question: "On average, do you get less than 7-8 hours of sleep a night?", category: "sleep" },
  { question: "Do you experience physical symptoms, such as headaches, muscle tension, or stomach problems?", category: "physical" },
  { question: "During school hours, do you have a hard time staying focused and concentrating on the task-at-hand?", category: "school" },
  { question: "Do you feel like isolating yourself, whether from friends or family, and/or avoiding social situations?", category: "social" },
  { question: "Do you frequently feel tired or fatigued, even after getting enough sleep?", category: "physical" },
  { question: "Do you find yourself feeling irritable or easily agitated, even over minor things?", category: "emotional" },
  { question: "Have you noticed changes in your eating or sleeping patterns, such as difficulty falling or staying asleep or an increase or decrease in appetite?", category: "physical" },
  { question: "Do you feel unsure or nervous about the future?", category: "anxiety" },
  { question: "Do you feel like you don't want to do your homework, or if it's not worth trying anymore in your classes?", category: "school" },
  { question: "Do you find it hard to calm down after getting upset?", category: "emotional" }
];

const personalizedTips = {
  focus: "Try the 5-4-3-2-1 grounding technique: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. Use techniques such as the Pomodoro technique and mindset tricks to get yourself to concentrate.   Many teens lose focus due to lack of sleep, stress, phone distractions, boredom, or poor study habits. To stay focused, get enough rest, eat well, and take short breaks between study sessions. Turn off notifications, study in a clean, quiet space, and use the Pomodoro method (25 minutes of work, 5 minutes of rest). Break tasks into smaller goals and reward yourself after completing each one. Mindfulness, light exercise, and remembering your purpose—like improving grades or learning something new—can also keep your mind sharp and motivated.   ",
  
  overwhelm: "When overwhelmed, try breaking tasks into smaller steps. Use our breathing exercises to center yourself.   Many students feel overwhelmed from too much work, high expectations, or poor time management. This often leads to stress, procrastination, and burnout. To manage it, start by breaking big tasks into smaller, realistic goals and focus on one thing at a time. Use a planner to organize deadlines and include breaks to rest your mind. Don’t be afraid to ask for help from teachers, friends, or parents, and remember that it’s okay not to be perfect. Taking care of your sleep, nutrition, and mental health will help you feel more in control and less pressured.  ",
  
  sleep: "Create a bedtime routine. Try setting a better schedule to make sure you go to bed exactly on time every night.     Many teens struggle with sleep because of stress, screen time, irregular schedules, or staying up late to study. Poor sleep can cause tiredness, irritability, and trouble focusing in class. To fix this, try keeping a consistent bedtime, avoiding phones and bright screens an hour before sleep, and creating a calm bedtime routine. Limit caffeine in the afternoon, and keep your room dark, cool, and quiet. If your mind races at night, try journaling or deep breathing before bed. Good sleep helps improve mood, focus, and overall school performance.    ",
  
  physical: "Physical symptoms often improve with regular exercise, proper hydration, and stress management techniques.   Teens who experience headaches, fatigue, or tension from school stress can benefit from stretching, short walks, or simple workouts to release built-up energy. Staying hydrated and eating balanced meals helps maintain energy levels and focus throughout the day. It’s also important to take breaks from screens and maintain good posture when studying to prevent strain. Consistent physical care supports both mental and emotional well-being, making it easier to stay healthy and focused.  ",
  
  school: "Try better studying habits. Find out what is going wrong, and try to improve with personalized techniques to be more productive.  Try better studying habits. Find out what is going wrong, and try to improve with personalized techniques to be more productive. For school, this might mean creating a realistic study schedule, breaking big assignments into smaller steps, and finding the times of day when you learn best. Eliminate distractions by studying in a quiet space and keeping your phone away. Use active learning methods like summarizing notes, teaching concepts to a friend, or using flashcards. Asking teachers for help and staying organized with a planner can also reduce stress and make schoolwork feel more manageable.  ",
  
  social: "Social connection is important for mental health. Try reaching out to one trusted friend or family member.   Talking about how you feel can ease stress and remind you that you’re not alone. Spending time with supportive people—whether through a quick chat, study group, or shared activity—can boost your mood and motivation. Surround yourself with positive influences who encourage you to take care of yourself and focus on what matters. Building healthy friendships and maintaining communication also strengthen confidence and emotional balance, which are key to overall well-being.  ",
  
  emotional: "Try to be kinder to yourself, and let go of any negative emotions. Try our breathing tab, and also use methods to get rid of these feelings by relaxing and calming yourself down.  Emotional balance takes time, but small actions like practicing gratitude, focusing on things you can control, and speaking to yourself with compassion can make a big difference. It helps to take breaks when you need them and remind yourself that progress is more important than perfection. As you learn to manage emotions in healthy ways, you’ll build resilience and feel more at peace with yourself.  ",
  
  anxiety: "Remember that this type of feeling is only temporary, and it too will pass as you relax and take things one step at a time.  When anxiety hits, try grounding techniques like deep breathing, focusing on your senses, or breaking tasks into small, manageable pieces. Talking to someone you trust can also help release tension and gain perspective. Regular exercise, adequate sleep, and limiting caffeine or screen time can reduce overall anxiety levels. By practicing these strategies consistently, you can calm your mind, regain control, and face challenges with greater confidence.  "
};

quizContainer.innerHTML = "";
quizQuestions.forEach((item, index) => {
  const qDiv = document.createElement('div');
  qDiv.className = 'quiz-question';
  const qText = document.createElement('p');
  qText.textContent = `${index + 1}. ${item.question}`;
  qDiv.appendChild(qText);

  answerOptions.forEach(option => {
    const label = document.createElement('label');
    label.style.display = 'block';
    label.innerHTML = `<input type="radio" name="q${index}" value="${option.value}" data-category="${item.category}" /> ${option.label}`;
    qDiv.appendChild(label);
  });

  quizContainer.appendChild(qDiv);
});

quizForm.addEventListener('submit', e => {
  e.preventDefault();
  let stressScore = 0;
  let incomplete = false;
  let categoryScores = {};

  quizQuestions.forEach((q, i) => {
    const selected = quizForm.querySelector(`input[name="q${i}"]:checked`);
    if (!selected) {
      incomplete = true;
      return;
    }
    const value = parseInt(selected.value);
    const category = selected.getAttribute('data-category');
    stressScore += value;
    categoryScores[category] = (categoryScores[category] || 0) + value;
  });

  if (incomplete) {
    quizResult.textContent = "Please answer all questions before submitting.";
    quizResult.style.color = 'red';
    return;
  }

  let message = "";
  if (stressScore <= 12) message = "You seem to have very low stress. Keep up the healthy habits!";
  else if (stressScore <= 26) message = "You have some signs of stress. Consider using our breathing or journaling tools on this app.";
  else if (stressScore <= 39) message = "You're showing moderate signs of stress. It's a good idea to take regular breaks and practice self-care.";
  else message = "You appear to be highly stressed. Please prioritize rest, reach out to someone you trust, and try using our tools daily.";

  const sortedCategories = Object.entries(categoryScores).sort(([, a], [, b]) => b - a).slice(0, 2);
  const tips = sortedCategories.map(([cat]) => personalizedTips[cat]).filter(Boolean);

  let html = `<p style="font-weight:bold; margin-bottom:1rem;">${message}</p>`;
  if (tips.length) html += `<div style="background:#f0f5fb; padding:1rem; border-radius:8px; margin-top:1rem;">
    <h4 style="margin-top:0; color:#42e398ff;">Personalized Tips for You:</h4>${tips.map(t => `<p style="margin:0.5rem 0;">${t}</p>`).join('')}
  </div>`;

  quizResult.innerHTML = html;
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

window.deleteEntry = function (entryId) {
  if (confirm('Are you sure you want to delete this entry?')) {
    let entries = getAllSavedEntries();
    entries = entries.filter(entry => entry.id !== entryId);
    localStorage.setItem('journal-entries', JSON.stringify(entries));
    loadPreviousEntries();
  }
};

window.toggleExpand = function (button, entryId) {
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
// breathing section
let breathingTimer;
let breathingPhase = 'ready';
let breathingCycles = 0;
let sessionCycles = 0;
let isBreathingActive = false;

const breathingCircle = document.getElementById('breathing-circle');
const counter = document.getElementById('counter');
const startBtn = document.getElementById('start-breathing');
const pauseBtn = document.getElementById('pause-breathing');
const resetBtn = document.getElementById('reset-breathing');

function updateBreathing(phase, count) {
  breathingCircle.className = 'breathing-circle';
  switch (phase) {
    case 'ready':
      counter.textContent = 'Ready';
      break;
    case 'inhale':
      breathingCircle.style.transform = `scale(1.3)`;
      counter.textContent = count;
      break;
    case 'exhale':
      breathingCircle.style.transform = `scale(1)`;
      counter.textContent = count;
      break;
    case 'paused':
      counter.textContent = 'Paused';
      break;
  }
}

function runBreathingCycle() {
  let phase = 'inhale';
  let count = 4;

  function next() {
    if (!isBreathingActive) return;
    updateBreathing(phase, count);
    breathingTimer = setInterval(() => {
      count--;
      if (count > 0) {
        updateBreathing(phase, count);
      } else {
        clearInterval(breathingTimer);
        if (!isBreathingActive) return;
        if (phase === 'inhale') {
          phase = 'exhale';
          count = 2;
          next();
        } else if (phase === 'exhale') {
          breathingCycles++;
          sessionCycles++;
          phase = 'inhale';
          count = 4;
          next();
        }
      }
    }, 1000);
  }

  next();
}

startBtn.addEventListener('click', () => {
  if (!isBreathingActive) {
    isBreathingActive = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    pauseBtn.textContent = 'Pause';
    runBreathingCycle();
  }
});

pauseBtn.addEventListener('click', () => {
  if (isBreathingActive) {
    isBreathingActive = false;
    clearInterval(breathingTimer);
    startBtn.disabled = false;
    pauseBtn.textContent = 'Resume';
    updateBreathing('paused');
  } else {
    isBreathingActive = true;
    startBtn.disabled = true;
    pauseBtn.textContent = 'Pause';
    runBreathingCycle();
  }
});

resetBtn.addEventListener('click', () => {
  isBreathingActive = false;
  clearInterval(breathingTimer);
  breathingCycles = 0;
  breathingPhase = 'ready';
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  pauseBtn.textContent = 'Pause';
  updateBreathing('ready');
  progressFill.style.width = '0%';
  if (particlesContainer) particlesContainer.innerHTML = '';
  addXP(15);
});

// Homework and test tracker for students
document.addEventListener("DOMContentLoaded", () => {
  const suggestionText = document.getElementById("suggestion-text");
  const taskNameInput = document.getElementById("task-name");
  const taskSubjectInput = document.getElementById("task-subject");
  const taskDateInput = document.getElementById("task-date");
  const addTaskBtn = document.getElementById("add-task");
  const taskList = document.getElementById("task-list");
  const sortSelect = document.getElementById("sort-select");
  const filterSelect = document.getElementById("filter-select");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function renderTasks() {
    taskList.innerHTML = "";
    if (tasks.length === 0) {
      taskList.innerHTML = '<p style="text-align:center; color:#666;">No tasks yet</p>';
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    let filteredTasks = [...tasks];

    const sortBy = sortSelect.value;
    if (sortBy === "due-date") filteredTasks.sort((a, b) => new Date(a.due) - new Date(b.due));
    if (sortBy === "subject") filteredTasks.sort((a, b) => a.subject.localeCompare(b.subject));
    if (sortBy === "name") filteredTasks.sort((a, b) => a.name.localeCompare(b.name));

    const filter = filterSelect.value;
    if (filter !== "all") {
      filteredTasks = filteredTasks.filter(task => {
        if (filter === "completed") return task.done;
        if (filter === "overdue") return !task.done && task.due < today;
        if (filter === "pending") return !task.done && task.due >= today;
      });
    }

    const statusColors = {
      complete: "#4CAF50",
      overdue: "#F44336",
      pending: "#FFC107"
    };

    filteredTasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.classList.add("task-item");

      if (task.done) {
        task.status = "complete";
        li.classList.add("done");
      } else if (!task.done && task.due < today) {
        task.status = "overdue";
        li.classList.add("overdue");
      } else {
        task.status = "pending";
      }

      li.innerHTML = `
        <div class="task-info">
          <strong>${task.name}</strong>
          <span>${task.subject}</span>
          <span class="task-date">Due: ${task.due}</span>
          <span class="status" style="color:${statusColors[task.status]}">${task.status}</span>
        </div>
        <div>
          <button class="complete-btn">✓</button>
          <button class="delete-btn">✕</button>
        </div>
      `;

      li.querySelector(".complete-btn").addEventListener("click", () => {
        tasks[index].done = !tasks[index].done;
        saveTasks();
        renderTasks();
      });

      li.querySelector(".delete-btn").addEventListener("click", () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      });

      taskList.appendChild(li);
    });
  }

  addTaskBtn.addEventListener("click", () => {
    const name = taskNameInput.value.trim();
    const subject = taskSubjectInput.value.trim();
    const due = taskDateInput.value;

    if (!name || !subject || !due) {
      alert("Please fill out all fields!");
      return;
    }

    tasks.push({ name, subject, due, done: false });
    saveTasks();
    renderTasks();

    taskNameInput.value = "";
    taskSubjectInput.value = "";
    taskDateInput.value = "";
  });

  sortSelect.addEventListener("change", renderTasks);
  filterSelect.addEventListener("change", renderTasks);

  renderTasks();
});
