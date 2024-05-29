var arr = [[], [], [], [], [], [], [], [], []];

for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
        arr[i][j] = document.getElementById(i * 9 + j);
    }
}

var board = [[], [], [], [], [], [], [], [], []];
var solution = [[], [], [], [], [], [], [], [], []];

function FillBoard(board) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] != 0) {
                arr[i][j].innerText = board[i][j];
            } else {
                arr[i][j].innerText = '';
                arr[i][j].contentEditable = true; // Allow user input
                arr[i][j].style.backgroundColor = "lightyellow"; // Highlight editable cells
            }
        }
    }
}

let GetPuzzle = document.getElementById('GetPuzzle');
let SolvePuzzle = document.getElementById('SolvePuzzle');
let CheckSolution = document.getElementById('CheckSolution');

GetPuzzle.onclick = function () {
    var xhrRequest = new XMLHttpRequest();
    xhrRequest.onload = function () {
        var response = JSON.parse(xhrRequest.response);
        console.log(response);
        board = response.board;
        FillBoard(board);

        // Store the correct solution for validation
        xhrRequest.open('get', 'https://sugoku.onrender.com/solve');
        xhrRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhrRequest.onload = function () {
            var solveResponse = JSON.parse(xhrRequest.response);
            solution = solveResponse.solution;
        };
        xhrRequest.send(`board=${encodeURIComponent(JSON.stringify(board))}`);
    };
    xhrRequest.open('get', 'https://sugoku.onrender.com/board?difficulty=easy');
    xhrRequest.send();
};

Solution.onclick = () => {
    sudokusolver(board, 0, 0, 9);
};

CheckSolution.onclick = () => {
    var userSolution = getUserInput();
    if (validateUserSolution(userSolution, solution)) {
        alert("Congratulations! Your solution is correct.");
    } else {
        alert("Sorry, your solution is incorrect. Please try again.");
    }
};

function getUserInput() {
    var userSolution = [[], [], [], [], [], [], [], [], []];
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            userSolution[i][j] = arr[i][j].innerText ? parseInt(arr[i][j].innerText) : 0;
        }
    }
    return userSolution;
}

function validateUserSolution(userSolution, correctSolution) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (userSolution[i][j] !== correctSolution[i][j]) {
                return false;
            }
        }
    }
    return true;
}

function isValid(board, i, j, num, n) {
    for (let x = 0; x < n; x++) {
        if (board[i][x] == num || board[x][j] == num)
            return false;
    }

    let rtn = Math.sqrt(n);
    let si = i - i % rtn;
    let sj = j - j % rtn;
    for (let x = si; x < si + rtn; x++) {
        for (let y = sj; y < sj + rtn; y++) {
            if (board[x][y] == num) {
                return false;
            }
        }
    }
    return true;
}

function sudokusolver(board, i, j, n) {
    if (i == n) {
        FillBoard(board);
        return true;
    }
    if (j == n) {
        return sudokusolver(board, i + 1, 0, n);
    }
    if (board[i][j] != 0) {
        return sudokusolver(board, i, j + 1, n);
    }
    for (let num = 1; num <= 9; num++) {
        if (isValid(board, i, j, num, n)) {
            board[i][j] = num;
            let subAns = sudokusolver(board, i, j + 1, n);
            if (subAns) {
                return true;
            }
            board[i][j] = 0;
        }
    }
    return false;
}
