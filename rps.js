var you; // Your choice
var yourScore = 0;
var opponent; // Opponent's choice
var opponentScore = 0;
const winsound = new Audio('assets/win.wav');

var choices = ["rockk", "paperr", "scissorr"];

// When the page loads, populate the choices div with images
window.onload = function() { 
    var choicesDiv = document.getElementById("choices");
    for (let i = 0; i < choices.length; i++) {
        let choice = document.createElement("img");
        choice.id = choices[i];
        choice.src = "./assets/" + choices[i] + ".jpg";
        choice.addEventListener("click", selectChoice);
        choicesDiv.appendChild(choice);
    }
}

function selectChoice() {
    you = this.id;
    document.getElementById("your-choice-img").src = "./assets/" + you + ".jpg"; // Choosing option for you

    // Random choice for opponent
    opponent = choices[Math.floor(Math.random() * 3)]; // 0 - 2
    document.getElementById("opponent-choice-img").src = "./assets/" + opponent + ".jpg";

    // Check for winner
    if (you == opponent) {
        // Tie
        yourScore += 1;
        opponentScore += 1;
    } else {
        if (you == "rockk") {
            if (opponent == "scissorr") {
                yourScore += 1;
                winsound.play();
            } else if (opponent == "paperr") {
                opponentScore += 1;
            }
        } else if (you == "scissorr") {
            if (opponent == "paperr") {
                yourScore += 1;
                winsound.play();
            } else if (opponent == "rockk") {
                opponentScore += 1;
            }
        } else if (you == "paperr") {
            if (opponent == "rockk") {
                yourScore += 1;
                winsound.play();
            } else if (opponent == "scissorr") {
                opponentScore += 1;
            }
        }
    }

    document.getElementById("your-score").innerText = yourScore;
    document.getElementById("opponent-score").innerText = opponentScore;
}
