const question = document.querySelector(".quizbox p");
const btnBox = document.querySelector(".ansbox");
const questionIndex = document.querySelector("#questionIdx");
const score = document.querySelector("#score");
const next = document.querySelector(".nextbtn button");
const quizBox = document.querySelector(".quizbox");
const resultBox = document.querySelector(".result");
const finalScoreDisplay = document.querySelector("#finalScore");
const restartBtn = document.querySelector("#restartBtn");
const loader = document.querySelector("#loader");

let k = 0; // Current question index
let currentScore = 0; // Track score
let data = []; // Store fetched questions

// Fetch questions from the API
const getQuestions = async function () {
  try {
    loader.style.display = "flex"; // Show loader
    quizBox.style.display = "none"; // Hide quiz box

    const response = await fetch(
      `${CONFIG.BASE_URL}?apiKey=${CONFIG.API_KEY}&category=${CONFIG.QUIZ_SETTINGS.category}&limit=${CONFIG.QUIZ_SETTINGS.limit}&tags=${CONFIG.QUIZ_SETTINGS.tags}`
    );
    data = await response.json();
    
    loader.style.display = "none"; // Hide loader
    quizBox.style.display = "block"; // Show quiz box
    displayQuestion(data[k]); // Display the first question
  } catch (error) {
    console.error("Error fetching questions:", error);
    loader.innerHTML = "Failed to load questions. Please try again.";
  }
};



// Display a question and options
function displayQuestion(que) {
  // Display question
  question.textContent = que.question;
  questionIndex.innerHTML = `${k + 1} of 10 questions`;

  // Extract answers into an array
  let answers = que.answers;
  const answerArr = Object.keys(answers).map((key) => answers[key]);

  // Populate answer options
  btnBox.innerHTML = "";
  answerArr.forEach((value) => {
    if (value) {
      const option = document.createElement("button");
      option.textContent = value;
      option.className = "btn";
      btnBox.appendChild(option);
    }
  });

  // Get the correct answer key
  const correctAnswerObj = que.correct_answers;
  let correctAnswer = "";
  Object.keys(correctAnswerObj).forEach((key) => {
    if (correctAnswerObj[key] === "true") {
      correctAnswer = key.slice(0, 8); // Extract "answer_x"
    }
  });

  chooseAnswer(answers, correctAnswer);
}

// Handle answer selection
function chooseAnswer(answers, correctAnswer) {
  document.querySelectorAll(".btn").forEach((option) => {
    option.addEventListener("click", function handleClick() {
      // console.log("Option clicked:", option.innerHTML);

      // Disable all buttons after one click
      document.querySelectorAll(".btn").forEach((btn) => (btn.disabled = true));

      // Check if the clicked option is correct
      if (option.innerHTML === answers[correctAnswer]) {
        option.style.backgroundColor = "green";
        option.style.color = "white";
        currentScore++; // Increase score for correct answer
        score.innerHTML = `Score: ${currentScore}/10`;
      } else {
        option.style.backgroundColor = "red";
        option.style.color = "white";
      }

      // Remove event listener after click to prevent duplicate handling
      option.removeEventListener("click", handleClick);
    });
  });
}

// Reset options for the next question
function resetOptions() {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.style.backgroundColor = "white";
    btn.style.color = "black";
    btn.disabled = false;
    btn.innerHTML=" ";
    question.innerHTML= " ";

  });
}

// End the quiz
function endQuiz() {
  quizBox.style.display = "none";
  resultBox.style.display = "block";
  finalScoreDisplay.textContent = currentScore;

  // Restart Button Functionality
  restartBtn.addEventListener("click", playAgain);
}

// Restart the quiz
function playAgain() {
  quizBox.style.display = "block";
  resultBox.style.display = "none";

  // Reset score and question index
  currentScore = 0;
  k = 0;
  score.innerHTML = `Score: 0/10`;

  // Fetch questions again after restart
  // displayQuestion(data[k]); // Display the first question again
  resetOptions();
  getQuestions();
}

// Handle the "Next" button click
next.addEventListener("click", function () {
  if (k < data.length - 1) {
    k++; // Move to the next question
    resetOptions(); // Reset option styles and states
    displayQuestion(data[k]); // Display the next question
  } else {
    endQuiz(); // End the quiz if no more questions
  }
});

// Start the quiz
getQuestions();
