const board = document.getElementById("game-board");
const boardSizeSelector = document.getElementById("board-size");
let boardSize = parseInt(boardSizeSelector.value);

let knightPosition = { row: 0, col: 0 };
let moveCount = 1;
let visited;

let startTime = null;
let timerInterval = null;
let gameStarted = false;

function initVisited() {
  visited = Array.from({ length: boardSize }, () => Array(boardSize).fill(-1));
  visited[0][0] = 1; 
  moveCount = 1;
  knightPosition = { row: 0, col: 0 };
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById("timer").textContent = `⏱ Time: ${elapsed}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function resetTimer() {
  stopTimer();
  document.getElementById("timer").textContent = "⏱ Time: 0s";
}

function drawBoard() {
    board.innerHTML = "";
    board.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;
    board.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
  
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const cell = document.createElement("div");
        cell.className = "cell";

      
      if ((row + col) % 2 === 0) {
        cell.classList.add("light");
      } else {
        cell.classList.add("dark");
      }

      
      if (visited[row][col] !== -1) {
        cell.textContent = visited[row][col];
        cell.style.color = "black";
      }

      
      if (isValidMove(row, col)) {
        cell.classList.add("highlight");
      }

      
      if (knightPosition.row === row && knightPosition.col === col) {
        cell.textContent = "♞";
        cell.classList.add("current");
        cell.style.color = "red";
      }

      cell.dataset.row = row;
      cell.dataset.col = col;
      board.appendChild(cell);
    }
  }
}

function isKnightMove(r1, c1, r2, c2) {
  const dr = Math.abs(r1 - r2);
  const dc = Math.abs(c1 - c2);
  return (dr === 2 && dc === 1) || (dr === 1 && dc === 2);
}

function isValidMove(row, col) {
  return isKnightMove(knightPosition.row, knightPosition.col, row, col) && visited[row][col] === -1;
}

function hasValidMoves() {
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      if (isValidMove(r, c)) return true;
    }
  }
  return false;
}

board.addEventListener("click", (event) => {
  const cell = event.target.closest(".cell");
  if (!cell) return;

  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  if (isValidMove(row, col)) {
    if (!gameStarted) {
      startTimer();
      gameStarted = true;
    }

    moveCount++;
    visited[row][col] = moveCount;
    knightPosition = { row, col };

    drawBoard();

    if (moveCount === boardSize * boardSize) {
      stopTimer();
      showGameOver("🎉 Success! Can you beat your time?");
      return;
    }

    setTimeout(() => {
      if (!hasValidMoves()) {
        showGameOver();
      }
    }, 100);
  }
});

const gameOverBanner = document.getElementById("game-over-banner");
const restartBtn = document.getElementById("restart-btn");

function showGameOver(message = "♞ Game Over! No more valid moves.") {
  stopTimer();
  gameOverBanner.querySelector("p").textContent = message;
  gameOverBanner.classList.add("show");
}

function hideGameOver() {
  gameOverBanner.classList.remove("show");
}

restartBtn.addEventListener("click", () => {
  hideGameOver();
  resetGame();
});

boardSizeSelector.addEventListener("change", () => {
  resetGame();
});

function resetGame() {
  boardSize = parseInt(boardSizeSelector.value);
  initVisited();
  drawBoard();
  resetTimer();
  gameStarted = false;
}

resetGame();
