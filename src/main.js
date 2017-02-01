// Tetris clone in JavaScript, using HTML5 canvas
//
// main.js - contains the logic and configuration for running the game
//
// (c) Ville Siltanen, 2015-2016. MIT License

import Board from "./board.js";
import Piece from "./piece.js";

var c = document.querySelector("canvas");
var ctx = c.getContext("2d");
ctx.strokeStyle = "black";

var PIECES = [
  [
    [[1, 1], [1, 1]]
  ],
  [
    [[1], [1], [1], [1]],
    [[1, 1, 1, 1]]
  ],
  [
    [[0, 1, 0], [1, 1, 1]],
    [[1, 0], [1, 1], [1, 0]],
    [[1, 1, 1], [0, 1, 0]],
    [[0, 1], [1, 1], [0, 1]]
  ],
  [
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1], [1, 1], [1, 0]]
  ],
  [
    [[0, 1, 1], [1, 1, 0]],
    [[1, 0], [1, 1], [0, 1]]
  ],
  [
    [[1, 1], [0, 1], [0, 1]],
    [[0, 0, 1], [1, 1, 1]],
    [[1, 0], [1, 0], [1, 1]],
    [[1, 1, 1], [1, 0, 0]]
  ],
  [
    [[1, 1], [1, 0], [1, 0]],
    [[1, 1, 1], [0, 0, 1]],
    [[0, 1], [0, 1], [1, 1]],
    [[1, 0, 0], [1, 1, 1]]
  ]
];

var config = {
  blockSize: 30,
  gridWidth: 10,
  gridHeight: 20,
  colors: ["#15d600", "#000bd6", "#d60e00", "#d68b00", "#00c4d6", "#d600d6"],
  dropTime: 300,  // milliseconds
  font: "40px sans-serif",
  textColor: "black",
  pausedText: "PAUSED",
  pausedOverlayColor: "#f0f0f0",
  gameOverText: "GAME OVER",
  gameOverOverlayColor: "rgba(200, 200, 200, 0.5)",
  highScoreItem: "xytrizHighScore"
};

var game = {
  board: null,
  moveTimer: null,
  currentPiece: null,
  status: "stopped",
  score: 0
};

game.nextPiece = function() {
  var p = new Piece(4, 0, game.board, config.colors, PIECES);
  game.currentPiece = p;

  if (game.board.canPlace(p)) {
    game.board.placePiece(p);
    game.draw();
    game.moveTimer = setInterval(game.dropPiece, game.dropTime);
  } else {
    // cannot place the new piece -> game over
    game.status = "stopped";
    clearInterval(game.moveTimer);
    game.currentPiece = null;
    game.board.drawGameOver();
    game.saveHighScore();
  }
};

game.draw = function() {
  // safeguard to make sure the board is not drawn if the game
  // is not running
  if (game.status === "running") {
    game.board.draw();
  }
};

game.dropPiece = function() {
  if (!game.currentPiece.moveDown()) {
    game.pieceFinished();
  }
  game.draw();
};

game.dropPieceAllTheWay = function() {
  while (game.currentPiece.moveDown()) {
    // empty on purpose - just keep calling moveDown() on
    // the piece until it returns false
  }

  game.pieceFinished();
};

game.pieceFinished = function() {
  var rowsCleared;

  clearInterval(game.moveTimer);
  game.currentPiece.setInPlace();
  game.score += 10;
  rowsCleared = game.board.checkFullRows();
  game.score += (rowsCleared * 100);
  if (rowsCleared > 0) {
    game.dropTime -= 3;
  }
  game.updateScore();
  game.draw();
  game.nextPiece();
};

game.arrowKeyPress = function(event) {
  if (game.status === "running") {
    switch(event.keyCode) {
    case 37: // left
      game.currentPiece.moveLeft();
      game.draw();
      break;
    case 38: // up
      game.currentPiece.rotate();
      game.draw();
      break;
    case 39: // right
      game.currentPiece.moveRight();
      game.draw();
      break;
    case 40: // down
      game.dropPieceAllTheWay();
      game.draw();
      break;
    default:
      // no other keys handled here - pause in its own function
    }
  }
};

game.togglePause = function(event) {
  if (event.key === "p" ||
      event.keyCode === 112 ||
      event.keyCode === 80) {

    // note: if game.status === "stopped", do nothing

    if (game.status === "paused") {
      game.status = "running";
      game.moveTimer = setInterval(game.dropPiece, game.dropTime);
      game.board.clearPauseOverlay();
    } else if (game.status === "running") {
      game.status = "paused";
      clearInterval(game.moveTimer);
      game.board.drawPauseOverlay();
    }
  }
};

game.updateScore = function() {
  document.querySelector(".game-score").innerHTML = game.score;
};

game.showHighScore = function() {
  game.highScore = localStorage.getItem(config.highScoreItem) || 0;
  document.querySelector(".highscore").innerHTML = game.highScore;
};

game.saveHighScore = function() {
  if (game.score > game.highScore) {
    game.highScore = game.score;
    localStorage.setItem(config.highScoreItem, game.score);
    game.showHighScore();
  }
};

game.restart = function() {
  clearInterval(game.moveTimer);
  game.board = new Board(config, c, ctx);
  game.status = "running";
  game.dropTime = config.dropTime;
  game.score = 0;
  game.updateScore();
  game.nextPiece();
};

window.addEventListener("keydown", game.arrowKeyPress);
window.addEventListener("keypress", game.togglePause);
document.querySelector("#restart").addEventListener("click", game.restart);
game.showHighScore();
