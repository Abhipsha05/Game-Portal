let inputDir = { x: 0, y: 0 };
const eatsound = new Audio('assets/food.mp3');
const gameoversound = new Audio('assets/gameover2.mp3');
const movingsound = new Audio('assets/move.mp3');
let speed = 8;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
const gameLoopSound = new Audio('./assets/musicloop.mp3');
gameLoopSound.loop = true;
gameLoopSound.volume = 0.5;

const board = document.getElementById('board');
const scoreBox = document.getElementById('scoreBox');
const highscoreBox = document.getElementById('highscoreBox');
const gameOverMessage = document.getElementById('gameOverMessage');
let gameOverSoundPlayed = false;
let gameOver = false;

// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // If snake bumps into itself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // If snake bumps into the wall
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }
    return false;
}

function gameEngine() {
    // Part 1: Updating the snake array & Food
    if (isCollide(snakeArr)) {
        if (!gameOverSoundPlayed) { // Play game over sound only once
            gameoversound.play();
            gameLoopSound.pause();
            gameOverSoundPlayed = true;
        }
        inputDir = { x: 0, y: 0 };
        gameOver = true;
        gameOverMessage.classList.remove('hidden'); // Show the game over message

        document.addEventListener("keydown", restartGame);
        return;
    }

    // If you have eaten the food, increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        eatsound.play();
        score += 1;
        if (score > highscoreval) {
            highscoreval = score;
            localStorage.setItem("highscore", JSON.stringify(highscoreval));
            highscoreBox.innerHTML = "HighScore: " + highscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and Food
    // Display the snake
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });
    // Display the food
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

function restartGame() {
    if (gameOver) {
        gameOver = false;
        gameLoopSound.play();
        score = 0;
        snakeArr = [{ x: 13, y: 5 }];
        inputDir = { x: 0, y: 0 };
        food = { x: 6, y: 7 };
        gameOverSoundPlayed = false;

        gameOverMessage.classList.add('hidden'); // Hide the game over message
        scoreBox.innerHTML = "Score: " + score;

        document.removeEventListener("keydown", restartGame);
    }
}

// Main logic starts here
gameLoopSound.play();
movingsound.play();
let highscore = localStorage.getItem("highscore");
if (highscore === null) {
    highscoreval = 0;
    localStorage.setItem("highscore", JSON.stringify(highscoreval));
} else {
    highscoreval = JSON.parse(highscore);
    highscoreBox.innerHTML = "HighScore: " + highscore;
}

window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    if (!gameOver) {
        inputDir = { x: 0, y: 1 }; // Start the game
        movingsound.play();
        switch (e.key) {
            case "ArrowUp":
                inputDir.x = 0;
                inputDir.y = -1;
                break;
            case "ArrowDown":
                inputDir.x = 0;
                inputDir.y = 1;
                break;
            case "ArrowLeft":
                inputDir.x = -1;
                inputDir.y = 0;
                break;
            case "ArrowRight":
                inputDir.x = 1;
                inputDir.y = 0;
                break;
        }
    }
});

