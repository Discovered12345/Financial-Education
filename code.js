let currentScreen = 'menu';
let expenses = [];
let savings = 0;
let income = 2000;
let savingsGoal = 1000;
let allQuizQuestions = [];
let quizQuestions = [];
let currentQuestion = 0;
let score = 0;
let categories = ['Food', 'Transport', 'Housing', 'Entertainment', 'Utilities'];
let tips = [
  'Cook meals at home to save on food expenses',
  'Use public transportation when possible',
  'Track all your expenses in a budget',
  'Set up automatic savings transfers',
  'Always be kind to people'
];
let currentTipIndex = 0;
let lastTipChange = 0;
let showInstructions = false;
let instructionsAlpha = 0;
let scrollOffset = 0;
let buttonPressed = false;
let showCategoryDropdown = false;
let showAmountDropdown = false;
let amountOptions = [10, 20, 50, 100, 200, 500];

// Colors
let sdgColors = {
  background: '#C5192D',
  primary: '#26BDE2',
  secondary: '#FCC30B',
  accent: '#4C9F38',
  text: '#2F2F2F',
  light: '#FFFFFF',
  quizBg: '#E8F5E9',
  error: '#FF5252'
};

// Font sizes
let titleFontSize = 42;
let subtitleFontSize = 24;
let bodyFontSize = 18;
let buttonFontSize = 16;

// Game state
let addingExpense = false;
let newExpense = { amount: '', category: '' };
let inputFocus = null;
let activeInput = null;

function setup() {
  createCanvas(900, 650);
  setupQuiz();
  textAlign(CENTER, CENTER);
  
}

function draw() {
  background(245);
  
  // Rotate tip every 3 seconds
  if (millis() - lastTipChange > 3000) {
    currentTipIndex = (currentTipIndex + 1) % tips.length;
    lastTipChange = millis();
  }
  
  // Draw current screen
  switch(currentScreen) {
    case 'menu':
      drawMenu();
      break;
    case 'expenses':
      drawExpenses();
      break;
    case 'quiz':
      drawQuiz();
      break;
    case 'summary':
      drawSummary();
      break;
  }
  
  if (showInstructions) {
    drawInstructions();
  }
  
  // Help Button
  drawHelpButton();
  
  // Reset Help Button
  if (!mouseIsPressed) {
    buttonPressed = false;
  }
}

function drawHelpButton() {
  let buttonWidth = 80;
  let buttonHeight = 30;
  let x = width - 20 - buttonWidth/2;
  let y = height - 20 - buttonHeight/2;
  
  // Check if mouse is hovering
  let overButton = mouseX > x - buttonWidth/2 && mouseX < x + buttonWidth/2 &&
                   mouseY > y - buttonHeight/2 && mouseY < y + buttonHeight/2;
  
  if (overButton) {
    fill(255, 150, 150);
  } else {
    fill(255, 200, 200); 
  }
  
  // button
  rect(x - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight, 15);
  
  fill(sdgColors.text);
  textSize(buttonFontSize);
  textStyle(NORMAL);
  text('Help', x, y);
  
  // When pressed
  if (overButton && mouseIsPressed && !buttonPressed) {
    showInstructions = true;
    buttonPressed = true;
  }
}

function drawMenu() {

  background(sdgColors.background);
  
  // Title
  fill(sdgColors.light);
  textSize(titleFontSize);
  textStyle(BOLD);
  text('Financial Education', width/2, 100);
  
  // SDG Goal
  drawSDGLogo(width - 120, 120, 150);
  
  // Menu buttons
  drawButton('Manage Expenses', width/2, 250, () => currentScreen = 'expenses', sdgColors.primary);
  drawButton('Take Quiz', width/2, 320, () => {
    currentScreen = 'quiz';
    currentQuestion = 0;
    score = 0;
    // 5 random questions
    quizQuestions = randomize(allQuizQuestions).slice(0, 5);
  }, sdgColors.secondary);
  drawButton('View Summary', width/2, 390, () => {
    currentScreen = 'summary';
    scrollOffset = 0;
  }, sdgColors.accent);
  
  textSize(bodyFontSize);
  textStyle(NORMAL);
  fill(sdgColors.light);
}

function drawSDGLogo(x, y, size) {
  push();
  translate(x, y);
  
  fill(sdgColors.light);
  noStroke();
  ellipse(0, 7, size, size);
  
  // 4
  fill(sdgColors.primary);
  textSize(size * 0.4);
  textStyle(BOLD);
  text('4', 0, size * 0.05);
  

  fill(sdgColors.text);
  textSize(size * 0.12);
  text('QUALITY', 0, -size * 0.2);
  text('EDUCATION', 0, size * 0.3);
  pop();
}

function drawExpenses() {
  background(240);
  
  fill(sdgColors.text);
  textSize(titleFontSize - 10);
  textStyle(BOLD);
  text('Expense Manager', width/2, 50);
  
  drawExpenseTable();
  
  if (addingExpense) {
    drawExpenseForm();
  } else {
    drawButton('Add Expense', width/2, 400, () => {
      addingExpense = true;
      newExpense = { amount: '', category: '' };
      inputFocus = 'category';
      activeInput = 'category';
    }, sdgColors.accent);
  }
  
  drawButton('Back to Menu', width/2, 500, () => {
    currentScreen = 'menu';
    addingExpense = false;
    activeInput = null;
    showCategoryDropdown = false;
    showAmountDropdown = false;
  }, sdgColors.primary);
}

function drawExpenseTable() {
  fill(sdgColors.primary);
  textSize(bodyFontSize);
  textStyle(BOLD);
  textAlign(LEFT);
  
  text('Category', 200, 120);
  text('Amount', 400, 120);
  
  textStyle(NORMAL);
  let y = 150;
  for(let i = 0; i < expenses.length; i++) {
    let exp = expenses[i];
    fill(sdgColors.text);
    text(exp.category, 200, y);
    text(`$${exp.amount}`, 400, y);
    y += 30;
  }
  
  textAlign(CENTER);
}

function drawExpenseForm() {
  // Blue Border
  fill(230);
  stroke(sdgColors.primary);
  strokeWeight(1);
  rect(width/2 - 200, 250, 400, 150, 10);
  noStroke();
  
  fill(sdgColors.text);
  textSize(subtitleFontSize);
  text('Add New Expense', width/2, 270);
  
  // Dropdown input
  drawInputField('Category:', newExpense.category, width/2, 310, 'category');
  
if (showCategoryDropdown) {
    fill(255);
    stroke(200);
    rect(width/2 + 250, 300, 150, categories.length * 30 + 10);
    
    for (let i = 0; i < categories.length; i++) {
      if (mouseY > 300 + i * 30 && mouseY < 330 + i * 30 && 
          mouseX > width/2 + 250 && mouseX < width/2 + 400) {
        fill(220);
        rect(width/2 + 250, 300 + i * 30, 150, 30);
      }
      
      fill(sdgColors.text);
      textAlign(LEFT);
      text(categories[i], width/2 + 260, 320 + i * 30); 
      textAlign(CENTER);
    }
}
  
drawInputField('Amount:', newExpense.amount ? `$${newExpense.amount}` : '', width/2, 350, 'amount');

if (showAmountDropdown) {
    fill(255);
    stroke(200);
    rect(width/2 + 250, 350, 150, amountOptions.length * 30 + 10);
    
    for (let i = 0; i < amountOptions.length; i++) {
        if (mouseY > 350 + i * 30 && mouseY < 380 + i * 30 && 
            mouseX > width/2 + 250 && mouseX < width/2 + 400) {
            fill(220);
            rect(width/2 + 250, 350 + i * 30, 150, 30);
        }
        
        fill(sdgColors.text);
        textAlign(LEFT);
        text(`$${amountOptions[i]}`, width/2 + 260, 370 + i * 30);
        textAlign(CENTER);
    }
}
  
  // Form the buttons
  drawButton('Cancel', width/2 - 80, 430, () => {
    addingExpense = false;
    activeInput = null;
    showCategoryDropdown = false;
    showAmountDropdown = false;
  }, sdgColors.background);
  
  drawButton('Save', width/2 + 80, 430, () => {
    if (newExpense.category && newExpense.amount) {
      addExpense(parseFloat(newExpense.amount), newExpense.category);
      addingExpense = false;
      activeInput = null;
      showCategoryDropdown = false;
      showAmountDropdown = false;
    }
  }, sdgColors.accent);
}

function drawInputField(label, value, x, y, fieldName) {

  textSize(bodyFontSize);
  textAlign(RIGHT);
  fill(sdgColors.text);
  text(label, x - 120, y);
  

  fill(sdgColors.light);
  stroke(activeInput === fieldName ? sdgColors.primary : 180);
  strokeWeight(activeInput === fieldName ? 2 : 1);
  rect(x - 50, y - 15, 200, 30, 5);
  

  textAlign(LEFT);
  fill(sdgColors.text);
  text(value, x - 40, y);

  textAlign(CENTER);
  noStroke();
}

function drawQuiz() {

  background(sdgColors.quizBg);
  
  if (currentQuestion >= quizQuestions.length) {

    textSize(titleFontSize - 10);
    textStyle(BOLD);
    fill(sdgColors.text);
    text(`Quiz Complete!`, width/2, height/2 - 50);
    
    // Display Score
    textSize(subtitleFontSize);
    text(`You scored ${score} out of ${quizQuestions.length}`, width/2, height/2);
    
    // Feedback
    textSize(bodyFontSize + 4);
    if (score === quizQuestions.length) {
      fill(sdgColors.accent);
      text('Perfect! You\'re a financial expert!', width/2, height/2 + 50);
    } else if (score >= quizQuestions.length/2) {
      fill(sdgColors.primary);
      text('Good job! Keep learning!', width/2, height/2 + 50);
    } else {
      fill(sdgColors.background);
      text('Keep practicing financial literacy!', width/2, height/2 + 50);
    }
    
    // End quiz
    drawButton('End Quiz', width/2, height/2 + 100, () => {
      currentScreen = 'menu';
    }, sdgColors.error);
    
    return;
  }
  
  let question = quizQuestions[currentQuestion];
  
  // Question
  textSize(subtitleFontSize);
  textStyle(BOLD);
  fill(sdgColors.text);
  text(question.question, width/2, 150);
  
  // Options
  for(let i = 0; i < question.options.length; i++) {
    drawButton(question.options[i], width/2, 250 + i * 70, () => {
      if (!buttonPressed) {
        if(i === question.correct) score++;
        currentQuestion++;
        buttonPressed = true;
      }
    }, sdgColors.secondary);
  }
  
  // End quiz button
  drawButton('End Quiz', width/2, 550, () => {
    currentScreen = 'menu';
  }, sdgColors.error);
}

function drawSummary() {
  background(240);
  
  fill(sdgColors.text);
  textSize(titleFontSize - 10);
  textStyle(BOLD);
  text('Financial Summary', width/2, 50);
  
  // Pie chart
  drawPieChart(150, 200, 120);
  
  // Calculate Total 
  let totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  textSize(bodyFontSize);
  textStyle(NORMAL);
  textAlign(LEFT);
  
  let y = 150;
  for(let category of categories) {
    let categoryTotal = getTotalByCategory(category);
    let percentage = totalExpenses > 0 ? (categoryTotal / totalExpenses * 100).toFixed(1) : 0;
    
    fill(sdgColors.text);
    text(category + ":", 350, y);
    
    // Amount and percentage
    text(`$${categoryTotal} (${percentage}%)`, 500, y);
    
    y += 30;
  }
  
  // Current Savings
  textAlign(CENTER);
  textSize(subtitleFontSize);
  fill(sdgColors.text);
  text('Current Savings:', width/2, y + 50);
  textSize(titleFontSize - 10);
  fill(sdgColors.accent);
  text(`$${savings}`, width/2, y + 90);
  
  text('Tips: ', width/5, y + 130)
  textSize(bodyFontSize);
  fill('#4C9F38');
  text(tips[currentTipIndex], width/2, y + 130);
  

  drawButton('Back to Menu', width/2, 550, () => currentScreen = 'menu', sdgColors.primary);
}

function drawPieChart(x, y, diameter) {
  let totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  if (totalExpenses === 0) return;
  
  let lastAngle = 0;
  let colors = [
    color(255, 99, 132),  
    color(54, 162, 235), 
    color(255, 206, 86), 
    color(75, 192, 192),
    color(153, 102, 255)
  ];
  

  for (let i = 0; i < categories.length; i++) {
    let categoryTotal = getTotalByCategory(categories[i]);
    if (categoryTotal === 0) continue;
    
    let angle = TWO_PI * categoryTotal / totalExpenses;
    fill(colors[i % colors.length]);
    arc(x, y, diameter, diameter, lastAngle, lastAngle + angle, PIE);
    lastAngle += angle;
  }
  

  fill(240);
  noStroke();
  ellipse(x, y, diameter * 0.6, diameter * 0.6);
  
  // Total in center
  fill(sdgColors.text);
  textSize(bodyFontSize);
  text(`$${totalExpenses}`, x, y);
  
  textSize(bodyFontSize - 2);
  textAlign(LEFT);
  
  lastAngle = 0;
  let legendY = y + diameter/2 + 20;
  
  for (let i = 0; i < categories.length; i++) {
    let categoryTotal = getTotalByCategory(categories[i]);
    if (categoryTotal === 0) continue;
    
    let percentage = (categoryTotal / totalExpenses * 100).toFixed(1);
    fill(colors[i % colors.length]);
    rect(x - diameter/2, legendY - 10, 15, 15);
    
    fill(sdgColors.text);
    text(`${categories[i]}: ${percentage}%`, x - diameter/2 + 20, legendY);
    legendY += 20;
  }
  
  textAlign(CENTER);
}


function mousePressed() {
  if (addingExpense) {
    // Check
    if (mouseY > 295 && mouseY < 325) {
      if (mouseX > width/2 - 50 && mouseX < width/2 + 150) {
        activeInput = 'category';
        showCategoryDropdown = !showCategoryDropdown;
        showAmountDropdown = false;
        return false;
      }
    } else if (mouseY > 335 && mouseY < 365) {
      if (mouseX > width/2 - 50 && mouseX < width/2 + 150) {
        activeInput = 'amount';
        showAmountDropdown = !showAmountDropdown;
        showCategoryDropdown = false;
        return false;
      }
    } else if (showCategoryDropdown) {
      for (let i = 0; i < categories.length; i++) {
        if (mouseY > 300 + i * 30 && mouseY < 330 + i * 30 && 
            mouseX > width/2 + 250 && mouseX < width/2 + 400) {
          newExpense.category = categories[i];
          showCategoryDropdown = false;
          return false;
        }
      }
      showCategoryDropdown = false;
    } else if (showAmountDropdown) {

      for (let i = 0; i < amountOptions.length; i++) {
        if (mouseY > 350 + i * 30 && mouseY < 380 + i * 30 && 
            mouseX > width/2 + 250 && mouseX < width/2 + 400) {
          newExpense.amount = amountOptions[i];
          showAmountDropdown = false;
          return false;
        }
      }
      showAmountDropdown = false;
    } else {
      activeInput = null;
    }
  }
  return false;
}

function addExpense(amount, category) {

  if (isNaN(amount) || amount <= 0 || !categories.includes(category)) {
    return false;
  }
  
  expenses.push({
    amount: amount,
    category: category,
    id: expenses.length
  });
  
  calculateSavings();
  return true;
}

function getTotalByCategory(category) {
  return expenses
    .filter(exp => exp.category === category)
    .reduce((sum, exp) => sum + exp.amount, 0);
}

function calculateSavings() {
  let totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  savings = income - totalExpenses;
}

function setupQuiz() {
  allQuizQuestions = [
    {
      question: 'What percentage of income is recommended for savings?',
      options: ['5%', '10%', '20%', '50%'],
      correct: 2
    },
    {
      question: 'Which is a good budgeting practice?',
      options: ['Spend first, save later', 'Save first, spend later', "Don't track expenses", 'Use credit cards freely'],
      correct: 1
    },
    {
      question: "What's an emergency fund?",
      options: ['Vacation money', 'Shopping fund', '3-6 months expenses', 'Investment account'],
      correct: 2
    },
    {
      question: "Which SDG focuses on Quality Education?",
      options: ['SDG 1', 'SDG 3', 'SDG 4', 'SDG 8'],
      correct: 2
    },
    {
      question: "What's the first step in financial planning?",
      options: ['Investing in stocks', 'Tracking income and expenses', 'Taking out a loan', 'Buying a house'],
      correct: 1
    },
    {
      question: "What's the 50/30/20 budget rule?",
      options: ['50% needs, 30% wants, 20% savings', '50% savings, 30% needs, 20% wants', '50% wants, 30% needs, 20% savings', '50% taxes, 30% needs, 20% wants'],
      correct: 0
    },
    {
      question: "What's compound interest?",
      options: ['Interest on the principal only', 'Interest on both principal and accumulated interest', 'A type of loan', 'Interest that decreases over time'],
      correct: 1
    },
    {
      question: "What's a good debt-to-income ratio?",
      options: ['Below 20%', 'Below 36%', 'Below 50%', 'Below 75%'],
      correct: 1
    },
    {
      question: "Which is NOT a good savings strategy?",
      options: ['Pay yourself first', 'Save windfalls', 'Spend all your income', 'Automate savings'],
      correct: 2
    },
    {
      question: "What's the purpose of a budget?",
      options: ['To restrict spending', 'To track and plan finances', 'To impress your friends', 'To make more money'],
      correct: 1
    },
    {
      question: "What's the best way to pay off credit card debt?",
      options: ['Pay minimum payments', 'Pay highest interest cards first', 'Pay smallest balances first', 'Ignore it and hope it goes away'],
      correct: 1
    },
    {
      question: "How often should you review your budget?",
      options: ['Never', 'Once a year', 'Monthly', 'Weekly'],
      correct: 2
    },
    {
      question: "What's a good credit score range?",
      options: ['300-500', '500-600', '600-750', '750-850'],
      correct: 3
    },
    {
      question: "What's the biggest factor in your credit score?",
      options: ['Payment history', 'Credit utilization', 'Length of credit history', 'Types of credit'],
      correct: 0
    },
    {
      question: "What's the best way to build credit?",
      options: ['Open many credit cards', 'Pay bills on time', 'Max out credit cards', 'Avoid all debt'],
      correct: 1
    },
    {
      question: "What's the first thing you should do with extra money?",
      options: ['Invest in stocks', 'Build an emergency fund', 'Buy luxury items', 'Put it in a checking account'],
      correct: 1
    },
    {
      question: "What's the rule for retirement savings?",
      options: ['Save 5% of income', 'Save 15% of income', 'Save 30% of income', "Don't save for retirement"],
      correct: 1
    },
    {
      question: "What's the best way to save for a big purchase?",
      options: ['Use credit cards', 'Take out a loan', 'Save in advance', 'Ask family for money'],
      correct: 2
    },
    {
      question: "What's the biggest financial mistake young people make?",
      options: ['Not saving early', 'Spending too much on housing', 'Not investing', 'All of the above'],
      correct: 3
    },
    {
      question: "What's the best way to track expenses?",
      options: ['Memory', 'Spreadsheet or app', 'Receipts in a shoebox', "Don't track expenses"],
      correct: 1
    }
  ];
}

// Helper Function
function randomize(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function drawInstructions() {

  if (instructionsAlpha < 255) {
    instructionsAlpha = min(instructionsAlpha + 15, 255);
  }
  
  fill(0, instructionsAlpha * 0.7);
  rect(0, 0, width, height);

  fill('sdgColors.text, instructionsAlpha');
  textSize(titleFontSize - 10);
  textStyle(BOLD);
  text('Instructions', width/2, height/2 - 150);

  textSize(bodyFontSize);
  textStyle(NORMAL);
  textAlign(LEFT);
  
  let instructions = [
    "",
    "Welcome to the Instructions Tab!",
    "",
    "• Manage Expenses: Track and add your expenses",
    "  - Click 'Add Expense' to add new expenses",
    "  - Select category from dropdown",
    "  - Enter amount of that category",
    "",
    "• Take Quiz: Test your financial knowledge",
    "  - Answer 5 random questions",
    "  - Click 'End Quiz' to finish early",
    "",
    "• View Summary: See spending breakdown",
    "  - View category percentages",
    "  - See all expenses listed",
    ""
  ];
  
  let y = height/2 - 110;
  for (let line of instructions) {
    text(line, width/2 - 230, y);
    y += 25;
  }
  
  textAlign(CENTER);
  
  drawButton('Continue', width/1.1, height/2 + 230, () => {
    showInstructions = false;
    instructionsAlpha = 0;
  }, sdgColors.primary);
}

function drawButton(label, x, y, onClick, bgColor) {
  let buttonWidth = max(textWidth(label) + 40, 150);
  let buttonHeight = 40;

  let overButton = mouseX > x - buttonWidth/2 && mouseX < x + buttonWidth/2 &&
                   mouseY > y - buttonHeight/2 && mouseY < y + buttonHeight/2;
  
  if (overButton) {
    fill(red(bgColor) * 0.8, green(bgColor) * 0.8, blue(bgColor) * 0.8);
    cursor(HAND);
  } else {
    fill(bgColor);
    cursor(ARROW);
  }

  rect(x - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight, 20);
  

  fill(sdgColors.light);
  textSize(buttonFontSize);
  textStyle(NORMAL);
  text(label, x, y);

  if (overButton && mouseIsPressed && !buttonPressed) {
    onClick();
    buttonPressed = true;
  }
}
