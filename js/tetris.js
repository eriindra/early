// Canvas setup
const canvas = document.getElementById('tetris-canvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('next-canvas');
const nextCtx = nextCanvas.getContext('2d');

// Game constants
const COLS = 10;
const ROWS = 14;
const BLOCK_SIZE = 16;
const COLORS = [
  null,
  '#FF0D72', // I
  '#0DC2FF', // J
  '#0DFF72', // L
  '#F538FF', // O
  '#FF8E0D', // S
  '#FFE138', // T
  '#3877FF'  // Z
];

// Tetromino shapes
const SHAPES = [
  [],
  [[1,1,1,1]], // I
  [[1,0,0],[1,1,1]], // J
  [[0,0,1],[1,1,1]], // L
  [[1,1],[1,1]], // O
  [[0,1,1],[1,1,0]], // S
  [[0,1,0],[1,1,1]], // T
  [[1,1,0],[0,1,1]]  // Z
];

// Game state
let board = [];
let currentPiece = null;
let nextPiece = null;
let score = 0;
let level = 1;
let linesCleared = 0;
let gameRunning = false;
let isPaused = false;
let gameLoop = null;
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

// DOM elements
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const startScreen = document.getElementById('start-screen');
const gameOverPopup = document.getElementById('game-over-popup');
const finalScoreEl = document.getElementById('final-score');
const finalLevelEl = document.getElementById('final-level');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const restartBtn = document.getElementById('restart-btn');
const backBtn = document.getElementById('back-btn');
const rotateBtn = document.getElementById('rotate-btn');
const dpadUp = document.getElementById('dpad-up');
const dpadDown = document.getElementById('dpad-down');
const dpadLeft = document.getElementById('dpad-left');
const dpadRight = document.getElementById('dpad-right');

// Initialize board
function createBoard() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

// Create random piece
function createPiece() {
  const type = Math.floor(Math.random() * (SHAPES.length - 1)) + 1;
  return {
    shape: SHAPES[type],
    color: type,
    x: Math.floor(COLS / 2) - Math.floor(SHAPES[type][0].length / 2),
    y: 0
  };
}

// Draw a block
function drawBlock(x, y, color, context = ctx) {
  context.fillStyle = COLORS[color];
  context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  
  // Add border
  context.strokeStyle = 'rgba(0, 0, 0, 0.5)';
  context.lineWidth = 1;
  context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  
  // Add shine effect
  context.fillStyle = 'rgba(255, 255, 255, 0.2)';
  context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE / 2, BLOCK_SIZE / 2);
}

// Draw board
function drawBoard() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value > 0) {
        drawBlock(x, y, value);
      }
    });
  });
}

// Draw piece
function drawPiece(piece, context = ctx, offsetX = 0, offsetY = 0) {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value > 0) {
        drawBlock(piece.x + x + offsetX, piece.y + y + offsetY, piece.color, context);
      }
    });
  });
}

// Draw next piece
function drawNextPiece() {
  nextCtx.fillStyle = '#000';
  nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
  
  if (nextPiece) {
    const offsetX = Math.floor((4 - nextPiece.shape[0].length) / 2);
    const offsetY = Math.floor((4 - nextPiece.shape.length) / 2);
    
    nextPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          drawBlock(x + offsetX, y + offsetY, nextPiece.color, nextCtx);
        }
      });
    });
  }
}

// Check collision
function collide(piece, board, offsetX = 0, offsetY = 0) {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] > 0) {
        const newX = piece.x + x + offsetX;
        const newY = piece.y + y + offsetY;
        
        if (newX < 0 || newX >= COLS || newY >= ROWS) {
          return true;
        }
        if (newY >= 0 && board[newY][newX] > 0) {
          return true;
        }
      }
    }
  }
  return false;
}

// Merge piece to board
function merge(piece, board) {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value > 0) {
        const boardY = piece.y + y;
        const boardX = piece.x + x;
        if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
          board[boardY][boardX] = piece.color;
        }
      }
    });
  });
}

// Rotate piece
function rotate(piece) {
  const rotated = piece.shape[0].map((_, i) =>
    piece.shape.map(row => row[i]).reverse()
  );
  
  const tempPiece = { ...piece, shape: rotated };
  
  if (!collide(tempPiece, board)) {
    piece.shape = rotated;
  }
}

// Move piece
function move(direction) {
  if (!gameRunning || isPaused) return;
  
  const offset = direction === 'left' ? -1 : direction === 'right' ? 1 : 0;
  
  if (!collide(currentPiece, board, offset, 0)) {
    currentPiece.x += offset;
  }
}

// Drop piece
function drop() {
  if (!gameRunning || isPaused) return;
  
  if (!collide(currentPiece, board, 0, 1)) {
    currentPiece.y++;
    dropCounter = 0;
  } else {
    merge(currentPiece, board);
    clearLines();
    currentPiece = nextPiece;
    nextPiece = createPiece();
    drawNextPiece();
    
    if (collide(currentPiece, board)) {
      gameOver();
    }
  }
}

// Hard drop
function hardDrop() {
  if (!gameRunning || isPaused) return;
  
  while (!collide(currentPiece, board, 0, 1)) {
    currentPiece.y++;
    score += 2;
  }
  drop();
  updateScore();
}

// Clear lines
function clearLines() {
  let linesCleared = 0;
  
  for (let y = ROWS - 1; y >= 0; y--) {
    if (board[y].every(cell => cell > 0)) {
      board.splice(y, 1);
      board.unshift(Array(COLS).fill(0));
      linesCleared++;
      y++;
    }
  }
  
  if (linesCleared > 0) {
    score += linesCleared * 100 * level;
    updateScore();
    
    // Level up every 10 lines
    if (Math.floor(score / 1000) > level - 1) {
      level++;
      levelEl.textContent = level;
      dropInterval = Math.max(100, 1000 - (level - 1) * 100);
    }
  }
}

// Update score
function updateScore() {
  scoreEl.textContent = score;
}

// Game loop
function update(time = 0) {
  if (!gameRunning || isPaused) return;
  
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  
  if (dropCounter > dropInterval) {
    drop();
  }
  
  draw();
  gameLoop = requestAnimationFrame(update);
}

// Draw everything
function draw() {
  drawBoard();
  drawPiece(currentPiece);
}

// Start game
function startGame() {
  createBoard();
  score = 0;
  level = 1;
  linesCleared = 0;
  dropInterval = 1000;
  updateScore();
  levelEl.textContent = level;
  
  currentPiece = createPiece();
  nextPiece = createPiece();
  drawNextPiece();
  
  gameRunning = true;
  isPaused = false;
  startScreen.classList.add('hidden');
  pauseBtn.textContent = '⏸ PAUSE';
  
  lastTime = 0;
  dropCounter = 0;
  gameLoop = requestAnimationFrame(update);
}

// Pause game
function togglePause() {
  if (!gameRunning || startScreen.classList.contains('show')) return;
  
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? '▶ RESUME' : '⏸ PAUSE';
  
  if (!isPaused) {
    lastTime = 0;
    dropCounter = 0;
    gameLoop = requestAnimationFrame(update);
  }
}

// Game over
function gameOver() {
  gameRunning = false;
  if (gameLoop) {
    cancelAnimationFrame(gameLoop);
  }
  
  finalScoreEl.textContent = score;
  finalLevelEl.textContent = level;
  
  setTimeout(() => {
    gameOverPopup.classList.add('show');
  }, 500);
}

// Restart game
function restartGame() {
  gameOverPopup.classList.remove('show');
  setTimeout(() => {
    startGame();
  }, 300);
}

// Reset game
function resetGame() {
  if (gameRunning) {
    gameRunning = false;
    if (gameLoop) {
      cancelAnimationFrame(gameLoop);
    }
  }
  
  gameOverPopup.classList.remove('show');
  startScreen.classList.remove('hidden');
  createBoard();
  drawBoard();
  
  score = 0;
  level = 1;
  updateScore();
  levelEl.textContent = level;
  pauseBtn.textContent = '⏸ PAUSE';
}

// Back to menu
function backToMenu() {
  if (gameLoop) {
    cancelAnimationFrame(gameLoop);
  }
  document.body.style.transition = 'opacity 0.5s ease';
  document.body.style.opacity = '0';
  
  setTimeout(() => {
    window.location.href = 'menu.html';
  }, 500);
}

// Event Listeners
startBtn.addEventListener('click', () => {
  if (!gameRunning && !startScreen.classList.contains('hidden')) {
    startGame();
  }
});

pauseBtn.addEventListener('click', togglePause);
resetBtn.addEventListener('click', resetGame);
restartBtn.addEventListener('click', restartGame);
backBtn.addEventListener('click', backToMenu);
rotateBtn.addEventListener('click', () => {
  if (gameRunning && !isPaused) rotate(currentPiece);
});

// D-pad controls
dpadLeft.addEventListener('click', () => move('left'));
dpadRight.addEventListener('click', () => move('right'));
dpadDown.addEventListener('click', drop);
dpadUp.addEventListener('click', () => {
  if (gameRunning && !isPaused) rotate(currentPiece);
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
  if (!gameRunning && e.key === 'Enter' && !startScreen.classList.contains('hidden')) {
    startGame();
    return;
  }
  
  if (!gameRunning || isPaused) return;
  
  switch(e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      move('left');
      break;
    case 'ArrowRight':
      e.preventDefault();
      move('right');
      break;
    case 'ArrowDown':
      e.preventDefault();
      drop();
      break;
    case 'ArrowUp':
    case ' ':
      e.preventDefault();
      rotate(currentPiece);
      break;
    case 'Enter':
      e.preventDefault();
      hardDrop();
      break;
    case 'p':
    case 'P':
      togglePause();
      break;
    case 'Escape':
      backToMenu();
      break;
  }
});

// Initialize
window.addEventListener('load', () => {
  // Fade in effect
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
  
  createBoard();
  drawBoard();
  
  // Show start screen
  setTimeout(() => {
    startScreen.classList.remove('hidden');
  }, 500);
});

// Console log
console.log('🎮 Tetris Game Loaded');
console.log('Controls:');
console.log('- Arrow Keys: Move/Rotate');
console.log('- Enter: Hard Drop');
console.log('- Space/Up: Rotate');
console.log('- P: Pause');
console.log('- D-pad: Alternative controls');
console.log('- A button: Rotate');
console.log('- START: Begin game');
console.log('- ESC/B: Back to menu');