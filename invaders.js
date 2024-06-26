const gameLoopSound = new Audio('./assets/musicloop.mp3');
gameLoopSound.loop = true;
gameLoopSound.volume = 0.5; 

// board
let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tileSize * columns; // 32 * 16
let boardHeight = tileSize * rows; // 32 * 16
let context;

// ship
let shipWidth = tileSize * 2;
let shipHeight = tileSize;
let shipX = tileSize * columns / 2 - tileSize;
let shipY = tileSize * rows - tileSize * 2;

let ship = {
    x: shipX,
    y: shipY,
    width: shipWidth,
    height: shipHeight
}

let shipVelocityX = tileSize;

// aliens
let alienArray = [];
let alienWidth = tileSize * 2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;

let alienRows = 2;
let alienColumns = 3;
let alienCount = 0;
let alienVelocityX = 4;

// bullets
let bulletArray = [];
let bulletVelocityY = -10; // bullet moving speed
let gameOverSoundPlayed = false;
const gameoversound = new Audio('assets/gameover2.mp3');

let score = 0;
let gameOver = false;
const shootingsound = new Audio('./assets/shootsound.mp3');
shootingsound.playbackRate = 1.5;

window.onload = function () {
    alert(`Press SPACE to start shooting the aliens. Use the arrow keys to move left or right!`);
    gameLoopSound.play(); 

    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d"); 

    drawShip();

    alienImg = new Image();
    alienImg.src = "./assets/alien.png";
    createAliens();

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);
    document.addEventListener("keydown", restartGame);
}

function drawShip() {
    // body
    context.fillStyle = "orange";
    context.fillRect(ship.x, ship.y, ship.width, ship.height);

    // shooter
    let shooterWidth = ship.width / 4;
    let shooterHeight = ship.height / 2;
    let shooterX = ship.x + ship.width / 2 - shooterWidth / 2;
    let shooterY = ship.y - shooterHeight; 

    context.fillStyle = "orange";
    context.fillRect(shooterX, shooterY, shooterWidth, shooterHeight);
}

function update() {
    requestAnimationFrame(update);

    if (gameOver) {
        if (!gameOverSoundPlayed) {
            gameLoopSound.pause();
            gameoversound.play();
            gameOverSoundPlayed = true;
        }

        gameOverMessage.classList.remove('hidden'); 

        document.addEventListener("keydown", restartGame);
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    // Draw the ship with the shooter structure
    drawShip();

    // aliens
    for (let i = 0; i < alienArray.length; i++) {
        let alien = alienArray[i];
        if (alien.alive) {
            alien.x += alienVelocityX;

            // if alien touches the borders
            if (alien.x + alien.width >= board.width || alien.x <= 0) {
                alienVelocityX *= -1;
                alien.x += alienVelocityX * 2;

                // move all aliens up by one row
                for (let j = 0; j < alienArray.length; j++) {
                    alienArray[j].y += alienHeight;
                }
            }
            context.drawImage(alien.img, alien.x, alien.y, alien.width, alien.height);

            if (alien.y >= ship.y) {
                gameOver = true;
            }
        }
    }

    // bullets
    for (let i = 0; i < bulletArray.length; i++) {
        let bullet = bulletArray[i];
        bullet.y += bulletVelocityY;
        context.fillStyle = "white";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // bullet collision with aliens
        for (let j = 0; j < alienArray.length; j++) {
            let alien = alienArray[j];
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
                bullet.used = true;
                alien.alive = false;
                alienCount--;
                score += 100;
                shootingsound.currentTime = 0; 
                shootingsound.play();
            }
        }
    }

    // clear bullets
    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
        bulletArray.shift(); // removes the first element of the array
    }

    // next level
    if (alienCount == 0) {
        // increase the number of aliens in columns and rows by 1
        score += alienColumns * alienRows * 100; // bonus points :)
        alienColumns = Math.min(alienColumns + 1, columns / 2 - 2); // cap at 16/2 -2 = 6
        alienRows = Math.min(alienRows + 1, rows - 4);  // cap at 16-4 = 12
        if (alienVelocityX > 0) {
            alienVelocityX += 0.2; 
        } else {
            alienVelocityX -= 0.2; 
        }
        alienArray = [];
        bulletArray = [];
        createAliens();
    }

    // score
    context.fillStyle = "white";
    context.font = "16px courier";
    context.fillText(score, 5, 20);
}

function moveShip(e) {
    if (gameOver) {
        return;
    }

    if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
        ship.x -= shipVelocityX; // move left one tile
    } else if (e.code == "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width) {
        ship.x += shipVelocityX; 
    }
}

function createAliens() {
    for (let c = 0; c < alienColumns; c++) {
        for (let r = 0; r < alienRows; r++) {
            let alien = {
                img: alienImg,
                x: alienX + c * alienWidth,
                y: alienY + r * alienHeight,
                width: alienWidth,
                height: alienHeight,
                alive: true
            }
            alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
}

function shoot(e) {
    if (gameOver) {
        return;
    }

    if (e.code == "Space") {
        // shoot
        let bullet = {
            x: ship.x + shipWidth * 15 / 32,
            y: ship.y,
            width: tileSize / 8,
            height: tileSize / 2,
            used: false
        }
        bulletArray.push(bullet);
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   // a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x &&   // a's top right corner passes b's top left corner
        a.y < b.y + b.height &&  // a's top left corner doesn't reach b's bottom left corner
        a.y + a.height > b.y;    // a's bottom left corner passes b's top left corner
}

function restartGame() {
    if (gameOver) {
        gameOver = false;
        score = 0;
        alienArray = [];
        bulletArray = [];
        alienRows = 2; 
        alienColumns = 3; 
        alienVelocityX = 4; 
        createAliens();
        gameOverSoundPlayed = false;
        gameOverMessage.classList.add('hidden');
        gameLoopSound.play();
    }
}

  

