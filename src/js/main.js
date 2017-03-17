// Tetris clone in JavaScript, using HTML5 canvas
//
// main.js - contains the logic and configuration for running the game
//
// (c) Ville Siltanen, 2015-2017. MIT License

import css from "../css/style.css";
import config from "./config.js";
import Board from "./Board.js";
import Piece from "./Piece.js";
import display from "./display.js";

const states = {
  STOPPED: "stopped",
  RUNNING: "running",
  PAUSED: "paused"
};

const game = {
  board: null,
  moveTimer: null,
  currentPiece: null,
  score: 0,
  state: states.STOPPED
};

game.nextPiece = function() {
  const p = new Piece(4, 0, game.board);

  if (game.board.canPlace(p)) {
    game.board.placePiece(p);
    game.currentPiece = p;
    game.draw();
    game.moveTimer = setInterval(game.dropPiece, game.dropTime);
  } else {
    // cannot place the new piece -> game over
    game.state = states.STOPPED;
    clearInterval(game.moveTimer);
    game.currentPiece = null;
    display.drawGameOver();
    game.saveHighScore();
  }
};

game.draw = function() {
  // safeguard to make sure the board is not drawn if the game
  // is not running
  if (game.state === states.RUNNING) {
    display.drawBoard(game.board);
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
  clearInterval(game.moveTimer);
  game.board.setPieceInPlace(game.currentPiece);
  game.score += 10;
  const rowsCleared = game.board.checkFullRows();
  game.score += (rowsCleared * 100);
  if (rowsCleared > 0) {
    game.dropTime -= 3;
  }
  game.updateScore();
  game.draw();
  game.nextPiece();
};

game.keyPress = function(event) {
  // arrow keys = 37-40
  if (event.keyCode >= 37 && event.keyCode <= 40) {
    game.arrowKeyPress(event.keyCode);
  } else if (event.keyCode === 80) { // "p"
    game.togglePause();
  }
  // no functionality for other keys
};

game.arrowKeyPress = function(keyCode) {
  if (game.state === states.RUNNING) {
    switch(keyCode) {
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
    switch (game.state) {
    case states.PAUSED:
      display.clearPauseOverlay();
      game.state = states.RUNNING;
      game.draw();
      game.moveTimer = setInterval(game.dropPiece, game.dropTime);
      break;
    case states.RUNNING:
      game.state = states.PAUSED;
      clearInterval(game.moveTimer);
      display.drawPauseOverlay();
      break;
    case states.STOPPED:
      // pause does nothing if game not running
      break;
    default:
      break;
    }
};

game.updateScore = function() {
  document.querySelector(".game-score").innerHTML = game.score;
};

game.showHighScore = function() {
  game.highScore = localStorage.getItem(config.highScoreLocalStorageKey) || 0;
  document.querySelector(".highscore").innerHTML = game.highScore;
};

game.saveHighScore = function() {
  if (game.score > game.highScore) {
    game.highScore = game.score;
    localStorage.setItem(config.highScoreLocalStorageKey, game.score);
    game.showHighScore();
  }
};

game.restart = function() {
  clearInterval(game.moveTimer);
  game.board = new Board();
  game.state = states.RUNNING;
  game.dropTime = config.dropTime;
  game.score = 0;
  game.updateScore();
  game.nextPiece();
};

window.addEventListener("keydown", game.keyPress);
document.querySelector("#restart").addEventListener("click", game.restart);
game.showHighScore();
