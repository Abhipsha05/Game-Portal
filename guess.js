document.addEventListener('DOMContentLoaded', () => {
    const wordElement = document.getElementById('word');
    const guessesElement = document.getElementById('guesses');
    const keyboardElement = document.getElementById('keyboard');

    const words = [
        { word: 'STRAWBERRY', hint: 'A sweet red fruit often used in desserts.' },
        { word: 'CHOCOLAVA', hint: 'A type of cake with a gooey chocolate center.' },
        { word: 'TART', hint: 'A small pastry dish with a sweet or savory filling.' },
        { word: 'WAFFLE', hint: 'A Belgian sweet treat which is not at all "awful".' }
    ];

    const wordData = words[Math.floor(Math.random() * words.length)];
    const word = wordData.word;
    const hint = wordData.hint;
    const guessedLetters = new Set();
    let guesses = 9;
    const winsound = new Audio('assets/win.wav');
    const gameoversound = new Audio('assets/gameover.mp3');
    const gameLoopSound = new Audio('./assets/musicloop.mp3');
    gameLoopSound.loop = true;
    gameLoopSound.volume = 0.5;
    gameLoopSound.play();

    // Display hint at the start of the game
    alert(`Hint: ${hint}`);

    function displayWord() {
        wordElement.innerHTML = word.split('').map(letter => guessedLetters.has(letter) ? letter : '_').join(' ');
    }

    function displayKeyboard() {
        keyboardElement.innerHTML = '';
        for (let i = 65; i <= 90; i++) {
            const button = document.createElement('button');
            button.textContent = String.fromCharCode(i);
            button.disabled = guessedLetters.has(button.textContent);
            button.onclick = () => {
                guessedLetters.add(button.textContent);
                button.disabled = true;
                if (!word.includes(button.textContent)) {
                    guesses--;
                    gameoversound.play(); 
                }
                if (guesses === 0) {
                    alert(`Game Over! The word was: ${word}`);
                    document.location.reload();
                } else if (word.split('').every(letter => guessedLetters.has(letter))) {
                    alert('Congratulations! You guessed correctly!');
                    winsound.play(); 
                    wordElement.textContent = word; // Display the complete word
                    guessesElement.textContent = ''; // Clear guesses count
                    keyboardElement.innerHTML = ''; // Clear keyboard
                } else {
                    displayWord();
                    guessesElement.textContent = guesses;
                }
            };
            keyboardElement.appendChild(button);
        }
    }

    displayWord();
    displayKeyboard();
    guessesElement.textContent = guesses;
});
