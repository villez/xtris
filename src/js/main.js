// Tetris clone in JavaScript, using HTML5 canvas
//
// main.js - contains the logic and configuration for running the game
//
// (c) Ville Siltanen, 2015-2017. MIT License

import css from "../css/style.css";
import { config, pieces } from "./config.js";
import Board from "./board.js";
import Piece from "./piece.js";
import display from "./display.js";

const game = {
  board: null,
  moveTimer: null,
  currentPiece: null,
  status: "stopped",
  score: 0
};

game.nextPiece = function() {
  const p = new Piece(4, 0, game.board, config.colors, pieces);
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
    display.drawGameOver();
    game.saveHighScore();
  }
};

game.draw = function() {
  // safeguard to make sure the board is not drawn if the game
  // is not running
  if (game.status === "running") {
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
  game.currentPiece.setInPlace();
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
      display.clearPauseOverlay();
      game.draw();
    } else if (game.status === "running") {
      game.status = "paused";
      clearInterval(game.moveTimer);
      display.drawPauseOverlay();
    }
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
