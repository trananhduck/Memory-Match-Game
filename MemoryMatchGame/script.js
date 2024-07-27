const board = document.getElementById('gameBoard');
const moveCountElement = document.getElementById('moveCount');
const timerElement = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modalMessage');
const modalClose = document.getElementById('modalClose');

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

        const back = document.createElement('div');
        back.classList.add('back');
        back.textContent = '?';
        card.appendChild(back);

        const front = document.createElement('div');
        front.classList.add('front');
        const imgElement = document.createElement('img');
        imgElement.src = img;
        front.appendChild(imgElement);
        card.appendChild(front);

        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });

    resetTimer();
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
        if (moves <= 20) {
            showModal(`Congratulations! You won in ${formatTime(timeLeft)} remaining!`);
        }
    } else if (moves >= 20) {
        clearInterval(timerInterval);
        showModal('Game Over! You exceeded 20 moves.');
        disableBoard();
    }
}

function updateTimer() {
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        showModal('Game Over! Time is up.');
        disableBoard(); // Vô hiệu hóa bảng khi thời gian hết
        return;
    }

    timeLeft--;
    timerElement.textContent = `Time: ${formatTime(timeLeft)}`;
}

function resetTimer() {
    timeLeft = 300; // Reset thời gian
    timerElement.textContent = `Time: ${formatTime(timeLeft)}`;
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
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
    matchedPairs = 0;
    moves = 0;

    createBoard();

    moveCountElement.textContent = `Moves: ${moves}`;
    resetTimer();
    startBtn.disabled = true;
    restartBtn.disabled = false;
}

function restartGame() {
    startGame();
}

function showModal(message) {
    modalMessage.textContent = message;
    modal.style.display = 'block';
}

modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
});

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
