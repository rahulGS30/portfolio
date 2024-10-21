const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const message = document.getElementById("message");
const restartButton = document.getElementById("restart");
const startGameButton = document.getElementById("startGame");
const playerNameInput = document.getElementById("playerName");
const player1NameDisplay = document.getElementById("player1Name");
const player2NameDisplay = document.getElementById("player2Name");
const setupContainer = document.querySelector(".setup");
const gameContainer = document.querySelector(".game-container");

let currentPlayer = "X";
let gameActive = true;
let boardState = ["", "", "", "", "", "", "", "", ""];
let playerName = "";

// Winning combinations
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Start game
startGameButton.addEventListener("click", () => {
    playerName = playerNameInput.value || "Player 1";
    player1NameDisplay.textContent = playerName;
    setupContainer.style.display = "none";
    gameContainer.style.display = "block";
    updateMessage();
});

// Event listeners for each cell
cells.forEach(cell => {
    cell.addEventListener("click", handleCellClick);
});

// Handle cell click
function handleCellClick(event) {
    const clickedCell = event.target;
    const cellIndex = clickedCell.getAttribute("data-index");

    if (boardState[cellIndex] !== "" || !gameActive) {
        return;
    }

    updateCell(clickedCell, cellIndex);
    checkResult();

    if (gameActive) {
        setTimeout(computerMove, 500);
    }
}

// Update the clicked cell
function updateCell(cell, index) {
    boardState[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add("taken");
}

// AI (computer) makes a move using Minimax algorithm
function computerMove() {
    if (!gameActive) return;

    let bestScore = -Infinity;
    let move;

    // Find the best move
    for (let i = 0; i < boardState.length; i++) {
        if (boardState[i] === "") {
            boardState[i] = "O";
            let score = minimax(boardState, 0, false);
            boardState[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    if (move !== undefined) {
        const cell = document.querySelector(`.cell[data-index="${move}"]`);
        updateCell(cell, move);
        checkResult();
    }
}

// Minimax algorithm
function minimax(newBoard, depth, isMaximizing) {
    const scores = { X: -10, O: 10, tie: 0 };
    let result = checkWinner();

    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === "") {
                newBoard[i] = "O";
                let score = minimax(newBoard, depth + 1, false);
                newBoard[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === "") {
                newBoard[i] = "X";
                let score = minimax(newBoard, depth + 1, true);
                newBoard[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Check if there's a winner or a draw
function checkWinner() {
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            return boardState[a];
        }
    }

    if (!boardState.includes("")) {
        return "tie";
    }

    return null;
}

// Check the result of the game
function checkResult() {
    let result = checkWinner();

    if (result === "X" || result === "O") {
        gameActive = false;
        message.textContent = `${currentPlayer === "X" ? playerName : "Rahul"} wins!`;
    } else if (result === "tie") {
        gameActive = false;
        message.textContent = "It's a draw!";
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        updateMessage();
    }
}

// Update the turn message
function updateMessage() {
    message.textContent = `${currentPlayer === "X" ? playerName : "Rahul"}'s turn`;
}

// Restart the game
restartButton.addEventListener("click", restartGame);

function restartGame() {
    currentPlayer = "X";
    gameActive = true;
    boardState = ["", "", "", "", "", "", "", "", ""];
    message.textContent = `${playerName}'s turn`;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("taken");
    });
}
