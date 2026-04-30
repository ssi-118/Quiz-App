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

// Fetch Questions
fetch("https://opentdb.com/api.php?amount=10&type=multiple")
    .then(res => res.json())
    .then(data => {
        questions = data.results.map(q => {
            const formatted = { question: q.question, options: [] };
            const correctAns = q.correct_answer;
            const options = [...q.incorrect_answers];
            formatted.answer = Math.floor(Math.random() * 4) + 1;
            options.splice(formatted.answer - 1, 0, correctAns);
            formatted.options = options;
            return formatted;
        });
        playBtn.innerText = "Begin Assessment";
        playBtn.addEventListener('click', startGame);
    });

const startGame = () => {
    questionCounter = 0;
    score = 0;
    quizHistory = [];
    availableQuestions = [...questions];
    home.classList.add('hidden');
    game.classList.remove('hidden');
    getNewQuestion();
};

const getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= 10) {
        clearInterval(timer);
        return showResults();
    }

    clearInterval(timer);
    progressBar.style.transition = 'none'; 
    progressBar.style.width = '100%';
    
    setTimeout(() => {
        progressBar.style.transition = 'width 10s linear';
        progressBar.style.width = '0%';
        startTimer();
    }, 100);

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

const startTimer = () => {
    timeLeft = 10;
    timer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timer);
            if (acceptingAnswers) {
                acceptingAnswers = false;
                handleChoice(null);
            }
        }
    }, 1000);
};

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

choices.forEach((choice, index) => {
    choice.addEventListener('click', () => {
        if (!acceptingAnswers) return;
        acceptingAnswers = false;
        clearInterval(timer);
        handleChoice(index);
    });
});

const showResults = () => {
    game.classList.add('hidden');
    end.classList.remove('hidden');
    document.getElementById('finalScoreText').innerText = `Performance Score: ${score}/100`;

    reviewContainer.innerHTML = quizHistory.map((item) => {
        const optionsHtml = item.options.map((opt, i) => {
            let stateClass = "";
            if (i === item.correctIdx) stateClass = "correct";
            else if (i === item.userIdx && !item.status) stateClass = "incorrect";
            return `<div class="r-opt ${stateClass}">${opt}</div>`;
        }).join('');

        let statusText = item.status ? "CORRECT" : (item.userIdx === null ? "TIMEOUT" : "INCORRECT");
        let statusColor = item.status ? "var(--success)" : "var(--error)";

        return `
            <div class="review-item">
                <span class="r-status-tag" style="color:${statusColor}">${statusText}</span>
                <div class="review-q">${item.q}</div>
                <div class="review-options-grid">${optionsHtml}</div>
            </div>
        `;
    }).join('');
};