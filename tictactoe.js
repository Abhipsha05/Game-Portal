let board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
let player = 'X';
let gameEnded = false;
const movingsound = new Audio('assets/move.mp3');
const winsound = new Audio('assets/win.wav');


function displayBoard() {
    board.forEach((cell, index) => {
        document.getElementById(`cell-${index}`).innerText = cell;
    });
}

function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return board[a] === player && board[b] === player && board[c] === player;
    });
}

function checkDraw() {
    return board.every(cell => cell !== ' ');
}

function showConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    confettiContainer.style.display = 'block';

    const confettiVideo = document.getElementById('confetti-video');
    winsound.play();
    confettiVideo.play();
    

    // Hide confetti after 5 seconds (or the duration of your video)
    setTimeout(() => {
        confettiContainer.style.display = 'none';
    }, 5000); // Adjust this duration to match your confetti animation
}

function makeMove(index) {
    if (gameEnded || board[index] !== ' ') {
        return;
    }

    board[index] = player;
    displayBoard();
    movingsound.play(); 

    if (checkWin()) {
        document.getElementById('message').innerText = `Player ${player} has won!`;
        gameEnded = true;
        showConfetti();
    } else if (checkDraw()) {
        document.getElementById('message').innerText = "It's a tie!";
        gameEnded = true;
    } else {
        player = (player === 'X') ? 'O' : 'X';
    }
}

function resetGame() {
    board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
    player = 'X';
    gameEnded = false;
    document.getElementById('message').innerText = '';
    displayBoard();
}

// Initialize the game
displayBoard();


