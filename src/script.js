const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-container'));
const progressText = document.getElementById('questionCounter');
const scoreText = document.getElementById('score');
const progressBar = document.getElementById('timer-progress');
const game = document.getElementById('game');
const home = document.getElementById('home');
const end = document.getElementById('end');
const playBtn = document.getElementById('play-btn');
const reviewContainer = document.getElementById('review-container');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];
let quizHistory = [];
let timer;
let timeLeft = 10;

// VIEW TOGGLING (IMPROVED)
const views = [home, game, end];

const showView = (viewToShow) => {
    views.forEach(view => view.classList.add('hidden'));
    viewToShow.classList.remove('hidden');
};

//PROGRESS BAR RESET
const resetProgressBar = () => {
    progressBar.style.transition = 'none';
    progressBar.style.width = '100%';

    // Force reflow (removes need for setTimeout)
    progressBar.offsetWidth;

    progressBar.style.transition = 'width 10s linear';
    progressBar.style.width = '0%';
};

//FETCH QUESTIONS
fetch("https://opentdb.com/api.php?amount=10&type=multiple")
    .then(res => res.json())
    .then(data => {
        questions = data.results.map(q => {
            const formatted = { question: q.question, options: [] };
            const correctAns = q.correct_answer;
            const options = [...q.incorrect_answers]
            formatted.answer = Math.floor(Math.random() * 4) + 1;
            options.splice(formatted.answer - 1, 0, correctAns);
            formatted.options = options;

            return formatted;
        });

        playBtn.innerText = "Begin Assessment";
        playBtn.addEventListener('click', startGame);
    });

//START GAME
const startGame = () => {
    questionCounter = 0;
    score = 0;
    quizHistory = [];
    availableQuestions = [...questions];

    showView(game);
    getNewQuestion();
};

//LOAD QUESTION
const getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= 10) {
        clearInterval(timer);
        return showResults();
    }

    clearInterval(timer);

    // Reset + start progress bar cleanly
    resetProgressBar();
    startTimer();

    questionCounter++;
    progressText.innerText = `${questionCounter}/10`;

    const index = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[index];

    question.innerHTML = currentQuestion.question;

    choices.forEach((choice, i) => {
        choice.querySelector('.choice-text').innerHTML = currentQuestion.options[i];
    });

    availableQuestions.splice(index, 1);
    acceptingAnswers = true;
};

//TIMER
const startTimer = () => {
    timeLeft = 10;

    timer = setInterval(() => {
        timeLeft--;

        if (timeLeft <= 0) {
            clearInterval(timer);

            if (acceptingAnswers) {
                acceptingAnswers = false;
                handleChoice(null); // timeout case
            }
        }
    }, 1000);
};

//HANDLE ANSWER
const handleChoice = (selectedIndex) => {
    const correctIndex = currentQuestion.answer - 1;
    const isCorrect = selectedIndex === correctIndex;

    if (isCorrect) {
        score += 10;
        scoreText.innerText = score;
    }

    quizHistory.push({
        q: currentQuestion.question,
        options: currentQuestion.options,
        correctIdx: correctIndex,
        userIdx: selectedIndex,
        status: isCorrect
    });

    getNewQuestion();
};

//CLICK EVENTS
choices.forEach((choice, index) => {
    choice.addEventListener('click', () => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        clearInterval(timer);
        handleChoice(index);
    });
});

//SHOW RESULTS
const showResults = () => {
    showView(end);

    document.getElementById('finalScoreText').innerText =
        `Performance Score: ${score}/100`;

    reviewContainer.innerHTML = quizHistory.map((item) => {
        const optionsHtml = item.options.map((opt, i) => {
            let stateClass = "";

            if (i === item.correctIdx) stateClass = "correct";
            else if (i === item.userIdx && !item.status) stateClass = "incorrect";

            return `<div class="r-opt ${stateClass}">${opt}</div>`;
        }).join('');

        let statusText = item.status
            ? "CORRECT"
            : (item.userIdx === null ? "TIMEOUT" : "INCORRECT");

        let statusColor = item.status
            ? "var(--success)"
            : "var(--error)";

        return `
            <div class="review-item">
                <span class="r-status-tag" style="color:${statusColor}">
                    ${statusText}
                </span>
                <div class="review-q">${item.q}</div>
                <div class="review-options-grid">${optionsHtml}</div>
            </div>
        `;
    }).join('');
};