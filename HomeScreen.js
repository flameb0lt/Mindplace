const buttons = document.querySelectorAll('nav button');
const sections = document.querySelectorAll('main section');

// Main app switching
buttons.forEach(button => {
  button.addEventListener('click', () => {
    if (button.classList.contains('active')) return;

    navButtons.forEach(btn => btn.classList.remove('active'));
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
});

// get started button logic
const getStartedBtn = document.getElementById('get-started-btn');
const homeScreen = document.getElementById('home-screen');
const appUI = document.getElementById('app-ui');

getStartedBtn.addEventListener('click', () => {
  homeScreen.classList.add('hidden');
  appUI.classList.remove('hidden');
});