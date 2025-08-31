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
