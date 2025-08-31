// Gamification system
let gameData = {
  todayXP: parseInt(localStorage.getItem('mindplace_today_xp') || '0'),
  totalXP: parseInt(localStorage.getItem('mindplace_total_xp') || '0'),
  streak: parseInt(localStorage.getItem('mindplace_streak') || '0'),
  weeklyXP: JSON.parse(localStorage.getItem('mindplace_weekly_xp') || '[0,0,0,0,0,0,0]'),
  completedToday: JSON.parse(localStorage.getItem('mindplace_completed_today') || '{}'),
  lastActiveDate: localStorage.getItem('mindplace_last_active') || '',
  currentTheme: localStorage.getItem('mindplace_current_theme') || 'default',
  unlockedThemes: localStorage.getItem('mindplace_unlocked_themes') || '["default"]',
  dailyGoal: 100
};

let weeklyChart;

const themeSystems = {
    themes: {
    'default': {
      name: 'Default',
      description: 'The starting theme.',
      unlockLevel: 0,
      unlockXP: 0,
      colors: {
        primary: '#4A90E2',
        secondary: '#fdb4e8ff',
        background: '#F0F8FF'
      }
    },
    'jungle': {
      name: 'Jungle Adventure',
      description: 'Green theme.',
      unlockLevel: 5,
      unlockXP: 500,
      colors: {
        primary: '#1a7e1aff',
        secondary: '#89fd89ff',
        background: '#d7f0d7ff'
      }
    },
    'sunset': {
      name: 'Golden Sunset',
      description: 'The warm, sunset theme.',
      unlockLevel: 10,
      unlockXP: 1000,
      colors: {
        primary: '#FF6347',
        secondary: '#FFD700',
        background: '#FFF8DC'
      }
    },
    'ocean': {
      name: 'Deep Ocean',
      description: 'The other blue theme',
      unlockLevel: 15,
      unlockXP: 1500,
      colors: {
        primary: '#0c40ecff',
        secondary: '#74b4f4ff',
        background: '#bff4f4ff'
      }
    },
    'galaxy': {
      name: 'Cosmic Galaxy',
      description: 'Reach for the stars with this theme!',
      unlockLevel: 25,
      unlockXP: 2500,
      colors: {
        primary: '#4B0082',
        secondary: '#9370DB',
        background: '#191970'
      }
    },
    'cherry': {
      name: 'Cherry Blossom',
      description: 'The soft, cute pink theme.',
      unlockLevel: 35,
      unlockXP: 3500,
      colors: {
        primary: '#FF69B4',
        secondary: '#FFB6C1',
        background: '#FFF0F5'
      }
    },
    'aurora': {
      name: 'Aurora Dreams',
      description: 'The theme that reminds you of the Northern Lights',
      unlockLevel: 50,
      unlockXP: 5000,
      colors: {
        primary: '#00FF7F',
        secondary: '#58f6c1ff',
        background: '#F0FFFF'
      }
    }
  }
}

// Check if it's a new day
function checkNewDay() {
  const today = new Date().toDateString();
  if (gameData.lastActiveDate !== today) {
    if (gameData.lastActiveDate) {
      gameData.weeklyXP.shift();
      gameData.weeklyXP.push(gameData.todayXP);
      
      // Update streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (gameData.lastActiveDate === yesterday.toDateString() && gameData.todayXP > 0) {
        gameData.streak += 1;
      } else if (gameData.todayXP === 0) {
        gameData.streak = 0;
      }
    }
    
    gameData.todayXP = 0;
    gameData.completedToday = {};
    gameData.lastActiveDate = today;
    saveGameData();
  }
}

function checkUnlockedThemes() {
    const currrentLevel = calculateLevel()
    const newlyUnlocked = [];
  Object.entries(themeSystem.themes).forEach(([themeId, theme]) => {
    if (!gameData.unlockedThemes.includes(themeId) && 
        gameData.totalXP >= theme.unlockXP) {
      gameData.unlockedThemes.push(themeId);
      newlyUnlocked.push(theme);
    }
  });
  
  if (newlyUnlocked.length > 0) {
    saveGameData();
    showThemeUnlockNotification(newlyUnlocked);
  }
}

function showThemeUnlockNotification(themes) {
  themes.forEach(theme => {
    const notification = document.createElement('div');
    notification.className = 'theme-unlock-notification';
    notification.innerHTML = `
      <div class="unlock-content">
        <span class="unlock-icon">🎨</span>
        <div class="unlock-text">
          <strong>New Theme Unlocked!</strong>
          <br>${theme.name}
          <br><small>${theme.description}</small>
        </div>
      </div>
    `;
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  });
}

function unlockTheme(themeID) {
    const theme = themeSystems.theme[themeID]
    if (!theme) return;

    const root = document.documentElement
    root.style.setProperty('primary-color', theme.colors.primary)
}

function updateInsights() {
  const weekData = gameData.weeklyXP.slice(0, 6).filter(xp => xp > 0);
  const avgDaily = weekData.length > 0 ? Math.round(weekData.reduce((a, b) => a + b, 0) / weekData.length) : 0;
  document.getElementById('avg-daily').textContent = avgDaily;

  const bestDay = Math.max(...gameData.weeklyXP);
  document.getElementById('best-day').textContent = bestDay;

  const activitiesCount = Object.keys(gameData.completedToday).length;
  document.getElementById('activities-done').textContent = activitiesCount;

  const weeklyTotal = gameData.weeklyXP.reduce((a, b) => a + b, 0);
  const weeklyGoal = gameData.dailyGoal * 7;
  const completionRate = Math.round((weeklyTotal / weeklyGoal) * 100);

  document.getElementById('completion-rate').textContent = `${completionRate}%`;
  
  const nextThemeToUnlock = Object.entries(themeSystem.themes)
    .find(([themeId, theme]) => !gameData.unlockedThemes.includes(themeId));
  
  if (nextThemeToUnlock && document.getElementById('next-theme-unlock')) {
    const [themeId, theme] = nextThemeToUnlock;
    const progress = Math.min((gameData.totalXP / theme.unlockXP) * 100, 100);
    document.getElementById('next-theme-unlock').innerHTML = `
      Next theme: ${theme.name} (${gameData.totalXP}/${theme.unlockXP} XP - ${Math.round(progress)}%)
    `;
  }
}

function applyTheme(themeId) {
  const theme = themeSystem.themes[themeId];
  if (!theme) return;
  
  const root = document.documentElement;
  root.style.setProperty('--primary-color', theme.colors.primary);
  root.style.setProperty('--secondary-color', theme.colors.secondary);
  root.style.setProperty('--background-color', theme.colors.background);
  
  gameData.currentTheme = themeId;
  saveGameData();
}
function createThemeSelector() {
  const currentLevel = calculateLevel(gameData.totalXP);
  const themeSelector = document.getElementById('theme-selector');
  
  if (!themeSelector) return;
  
  themeSelector.innerHTML = '<h3>Themes</h3>';
  
  Object.entries(themeSystem.themes).forEach(([themeId, theme]) => {
    const isUnlocked = gameData.unlockedThemes.includes(themeId);
    const isActive = gameData.currentTheme === themeId;
    
    const themeOption = document.createElement('div');
    themeOption.className = `theme-option ${isActive ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}`;
    
    themeOption.innerHTML = `
      <div class="theme-preview" style="background: ${theme.colors.background}; border: 3px solid ${theme.colors.primary};">
        <div class="theme-colors">
          <div class="color-dot" style="background: ${theme.colors.primary}"></div>
          <div class="color-dot" style="background: ${theme.colors.secondary}"></div>
        </div>
      </div>
      <div class="theme-info">
        <div class="theme-name">${theme.name}</div>
        <div class="theme-description">${theme.description}</div>
        ${!isUnlocked ? `<div class="unlock-requirement">Unlock at Level ${theme.unlockLevel} (${theme.unlockXP} XP)</div>` : ''}
        ${isActive ? '<div class="active-indicator">✓ Active</div>' : ''}
      </div>
    `;
    
    if (isUnlocked) {
      themeOption.addEventListener('click', () => applyTheme(themeId));
      themeOption.style.cursor = 'pointer';
    }
    themeSelector.appendChild(themeOption);
  });
}

function saveGameData() {
  localStorage.setItem('mindplace_today_xp', gameData.todayXP.toString());
  localStorage.setItem('mindplace_total_xp', gameData.totalXP.toString());
  localStorage.setItem('mindplace_streak', gameData.streak.toString());
  localStorage.setItem('mindplace_weekly_xp', JSON.stringify(gameData.weeklyXP));
  localStorage.setItem('mindplace_completed_today', JSON.stringify(gameData.completedToday));
  localStorage.setItem('mindplace_last_active', gameData.lastActiveDate);
}

function awardXP(activity, xpAmount, notificationElementId) {
  if (gameData.completedToday[activity]) return false; // Already completed today
  
  gameData.completedToday[activity] = true;
  gameData.todayXP += xpAmount;
  gameData.totalXP += xpAmount;
  gameData.weeklyXP[6] = gameData.todayXP;
  
  saveGameData();
  updateStats();
  updateDailyProgress();
  updateChart();
  updateInsights();
  
  showXPNotification(xpAmount, notificationElementId);
  checkUnlockedThemes();
  createThemeSelector();
  
  // Check if daily goal is reached
  if (gameData.todayXP >= gameData.dailyGoal && !document.getElementById('daily-complete-message').innerHTML) {
    showDailyCompletion();
  }
  
  return true;
}

function showXPNotification(xpAmount, elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = `<div class="xp-notification">+${xpAmount} XP earned!</div>`;
    setTimeout(() => {
      element.innerHTML = '';
    }, 3000);
  }
}

function updateStats() {
  document.getElementById('today-xp').textContent = gameData.todayXP;
  document.getElementById('total-xp').textContent = gameData.totalXP;
  document.getElementById('streak').textContent = gameData.streak;
}

function updateDailyProgress() {
  const progress = Math.min((gameData.todayXP / gameData.dailyGoal) * 100, 100);
  document.getElementById('daily-progress-bar').style.width = `${progress}%`;
  document.getElementById('daily-percentage').textContent = `${Math.round(progress)}%`;
  document.getElementById('daily-progress-text').textContent = `${gameData.todayXP} / ${gameData.dailyGoal} XP`;
}

function initChart() {
  const ctx = document.getElementById('weekly-chart').getContext('2d');
  weeklyChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'],
      datasets: [{
        label: 'Daily XP',
        data: gameData.weeklyXP,
        backgroundColor: [
          'rgba(240, 37, 162, 0.7)',
          'rgba(240, 37, 162, 0.7)',
          'rgba(240, 37, 162, 0.7)',
          'rgba(240, 37, 162, 0.7)',
          'rgba(240, 37, 162, 0.7)',
          'rgba(240, 37, 162, 0.7)',
          'rgba(76, 175, 80, 0.8)'
        ],
        borderColor: [
          '#f025a2',
          '#f025a2',
          '#f025a2',
          '#f025a2',
          '#f025a2',
          '#f025a2',
          '#4CAF50'
        ],
        borderWidth: 2,
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 120
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

function showDailyCompletion() {
  const message = document.createElement('div');
  message.className = 'completion-message';
  message.innerHTML = 'Daily goal achieved! Great job!';
  document.getElementById('daily-complete-message').appendChild(message);
}

function updateChart() {
  if (weeklyChart) {
    weeklyChart.data.datasets[0].data = gameData.weeklyXP;
    weeklyChart.update();
  }
}

function updateInsights() {
  // average daily XP (e
  const weekData = gameData.weeklyXP.slice(0, 6).filter(xp => xp > 0);
  const avgDaily = weekData.length > 0 ? Math.round(weekData.reduce((a, b) => a + b, 0) / weekData.length) : 0;
  document.getElementById('avg-daily').textContent = avgDaily;
// Best day XP
  const bestDay = Math.max(...gameData.weeklyXP);
  document.getElementById('best-day').textContent = bestDay;

  // Activities completed today
  const activitiesCount = Object.keys(gameData.completedToday).length;
  document.getElementById('activities-done').textContent = activitiesCount;

  // Weekly completion rate
  const weeklyTotal = gameData.weeklyXP.reduce((a, b) => a + b, 0);
  const weeklyGoal = gameData.dailyGoal * 7;
  const completionRate = Math.round((weeklyTotal / weeklyGoal) * 100);
  document.getElementById('completion-rate').textContent = `${completionRate}%`;
}

function showDailyCompletion() {
  const message = document.createElement('div');
  message.className = 'completion-message';
  message.innerHTML = '🎉 Daily goal achieved! Great job on your wellness journey!';
  document.getElementById('daily-complete-message').appendChild(message);
}



// Initialize gamification
function initGamification() {
  checkNewDay();
  updateStats();
  updateDailyProgress();
    const progressNavButton = document.querySelector('[data-target="progress-section"]');
  progressNavButton.addEventListener('click', () => {
    if (!weeklyChart) {
      setTimeout(() => {
        initChart();
        updateInsights();
      }, 100);
    }
  });
}

function initGamification() {
  checkNewDay();
  updateStats();
  updateDailyProgress();
  applyTheme(gameData.currentTheme);

}

const progressNavButton = document.querySelector('[data-target="progress-section"]');
  if (progressNavButton) {
    progressNavButton.addEventListener('click', () => {
      if (!weeklyChart) {
        setTimeout(() => {
          initChart();
          updateInsights();
        }, 100);
      }
    });
  }

const themesNavButton = document.querySelector('[data-target="themes-section"]');
  if (themesNavButton) {
    themesNavButton.addEventListener('click', () => {
      setTimeout(() => {
        createThemeSelector();
      }, 100);
    });
  }

window.MindPlaceGamification = {
  awardXP,
  applyTheme,
  createThemeSelector,
  calculateLevel,
  initGamification
};