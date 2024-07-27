const board = document.getElementById('gameBoard');
const moveCountElement = document.getElementById('moveCount');
const timerElement = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

const images = [
    './image/img1.png', './image/img1.png',
    './image/img2.png', './image/img2.png',
    './image/img3.png', './image/img3.png',
    './image/img4.png', './image/img4.png',
    './image/img5.png', './image/img5.png',
    './image/img6.png', './image/img6.png',
    './image/img7.png', './image/img7.png',
    './image/img8.png', './image/img8.png',
    './image/img9.png', './image/img9.png',
    './image/img10.png', './image/img10.png'
];

let cardValues = [];
let cardIds = [];
let cardsFlipped = 0;
let matchedPairs = 0;
let moves = 0;
let timeLeft = 300;
let timerInterval;

function createBoard() {
    const shuffledImages = shuffle(images);

    shuffledImages.forEach((img, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.id = index;

        const imgElement = document.createElement('img');
        imgElement.src = img;

        card.appendChild(imgElement);
        card.addEventListener('click', flipCard);

        board.appendChild(card);
    });

    timerInterval = setInterval(updateTimer, 1000);
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function flipCard() {
    const clickedCard = this;
    if (clickedCard.classList.contains('flipped') || cardValues.length === 2) return;

    clickedCard.classList.add('flipped');
    cardValues.push(clickedCard.querySelector('img').src);
    cardIds.push(clickedCard.dataset.id);

    if (cardValues.length === 2) {
        moves++;
        moveCountElement.textContent = `Moves: ${moves}`;
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    const cards = document.querySelectorAll('.card');
    const [firstCard, secondCard] = cardIds.map(id => cards[id]);

    if (cardValues[0] === cardValues[1]) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        matchedPairs++;
    } else {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
    }

    cardValues = [];
    cardIds = [];

    if (matchedPairs === images.length / 2) {
        clearInterval(timerInterval);
        if (moves <= 25) {
            setTimeout(() => alert(`Congratulations! You won in ${formatTime(timeLeft)} remaining!`), 100);
        }
    } else if (moves >= 25) {
        clearInterval(timerInterval);
        setTimeout(() => alert('Game Over! You exceeded 25 moves.'), 100);
        disableBoard();
    }
}

function updateTimer() {
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        setTimeout(() => alert('Game Over! Time is up.'), 100);
        disableBoard(); // Vô hiệu hóa bảng khi thời gian hết
        return;
    }

    timeLeft--;
    timerElement.textContent = `Time: ${formatTime(timeLeft)}`;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function disableBoard() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.removeEventListener('click', flipCard));
}

function startGame() {
    board.innerHTML = ''; // Xóa các thẻ cũ nếu có
    cardValues = [];
    cardIds = [];
    cardsFlipped = 0;
    matchedPairs = 0;
    moves = 0;
    timeLeft = 300; // Reset thời gian

    createBoard();

    moveCountElement.textContent = `Moves: ${moves}`;
    timerElement.textContent = `Time: ${formatTime(timeLeft)}`;
    startBtn.disabled = true;
    restartBtn.disabled = false;
}

function restartGame() {
    startGame();
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
