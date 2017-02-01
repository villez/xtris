/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _board = __webpack_require__(1);

	var _board2 = _interopRequireDefault(_board);

	var _piece = __webpack_require__(2);

	var _piece2 = _interopRequireDefault(_piece);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// Tetris clone in JavaScript, using HTML5 canvas
	//
	// main.js - contains the logic and configuration for running the game
	//
	// (c) Ville Siltanen, 2015-2016. MIT License

	var c = document.querySelector("canvas");
	var ctx = c.getContext("2d");
	ctx.strokeStyle = "black";

	var PIECES = [[[[1, 1], [1, 1]]], [[[1], [1], [1], [1]], [[1, 1, 1, 1]]], [[[0, 1, 0], [1, 1, 1]], [[1, 0], [1, 1], [1, 0]], [[1, 1, 1], [0, 1, 0]], [[0, 1], [1, 1], [0, 1]]], [[[1, 1, 0], [0, 1, 1]], [[0, 1], [1, 1], [1, 0]]], [[[0, 1, 1], [1, 1, 0]], [[1, 0], [1, 1], [0, 1]]], [[[1, 1], [0, 1], [0, 1]], [[0, 0, 1], [1, 1, 1]], [[1, 0], [1, 0], [1, 1]], [[1, 1, 1], [1, 0, 0]]], [[[1, 1], [1, 0], [1, 0]], [[1, 1, 1], [0, 0, 1]], [[0, 1], [0, 1], [1, 1]], [[1, 0, 0], [1, 1, 1]]]];

	var config = {
	  blockSize: 30,
	  gridWidth: 10,
	  gridHeight: 20,
	  colors: ["#15d600", "#000bd6", "#d60e00", "#d68b00", "#00c4d6", "#d600d6"],
	  dropTime: 300, // milliseconds
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

	game.nextPiece = function () {
	  var p = new _piece2.default(4, 0, game.board, config.colors, PIECES);
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

	game.draw = function () {
	  // safeguard to make sure the board is not drawn if the game
	  // is not running
	  if (game.status === "running") {
	    game.board.draw();
	  }
	};

	game.dropPiece = function () {
	  if (!game.currentPiece.moveDown()) {
	    game.pieceFinished();
	  }
	  game.draw();
	};

	game.dropPieceAllTheWay = function () {
	  while (game.currentPiece.moveDown()) {
	    // empty on purpose - just keep calling moveDown() on
	    // the piece until it returns false
	  }

	  game.pieceFinished();
	};

	game.pieceFinished = function () {
	  var rowsCleared;

	  clearInterval(game.moveTimer);
	  game.currentPiece.setInPlace();
	  game.score += 10;
	  rowsCleared = game.board.checkFullRows();
	  game.score += rowsCleared * 100;
	  if (rowsCleared > 0) {
	    game.dropTime -= 3;
	  }
	  game.updateScore();
	  game.draw();
	  game.nextPiece();
	};

	game.arrowKeyPress = function (event) {
	  if (game.status === "running") {
	    switch (event.keyCode) {
	      case 37:
	        // left
	        game.currentPiece.moveLeft();
	        game.draw();
	        break;
	      case 38:
	        // up
	        game.currentPiece.rotate();
	        game.draw();
	        break;
	      case 39:
	        // right
	        game.currentPiece.moveRight();
	        game.draw();
	        break;
	      case 40:
	        // down
	        game.dropPieceAllTheWay();
	        game.draw();
	        break;
	      default:
	      // no other keys handled here - pause in its own function
	    }
	  }
	};

	game.togglePause = function (event) {
	  if (event.key === "p" || event.keyCode === 112 || event.keyCode === 80) {

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

	game.updateScore = function () {
	  document.querySelector(".game-score").innerHTML = game.score;
	};

	game.showHighScore = function () {
	  game.highScore = localStorage.getItem(config.highScoreItem) || 0;
	  document.querySelector(".highscore").innerHTML = game.highScore;
	};

	game.saveHighScore = function () {
	  if (game.score > game.highScore) {
	    game.highScore = game.score;
	    localStorage.setItem(config.highScoreItem, game.score);
	    game.showHighScore();
	  }
	};

	game.restart = function () {
	  clearInterval(game.moveTimer);
	  game.board = new _board2.default(config, c, ctx);
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

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// board.js - logic for the game board
	//
	// maintains the state of the already placed pieces, logic
	// for placing a new active (moving) piece on the board,
	// removing rows when they become full, and some auxiliary stuff
	// for displaying the paused and game over states
	//
	// (c) Ville Siltanen, 2015-2016. MIT License

	function Board(config, canvasRef, ctx) {
	  this.config = config;
	  this.c = canvasRef;
	  this.ctx = ctx;

	  this.elems = [];
	  for (var row = 0; row < this.config.gridHeight; row++) {
	    this.elems[row] = [];
	    for (var column = 0; column < this.config.gridWidth; column++) {
	      this.elems[row].push(null);
	    }
	  }
	}

	Board.prototype.get = function (x, y) {
	  return this.elems[y][x];
	};

	Board.prototype.set = function (x, y, value) {
	  this.elems[y][x] = value;
	};

	Board.prototype.insideBoard = function (x, y) {
	  return x >= 0 && y >= 0 && x < this.config.gridWidth && y < this.config.gridHeight;
	};

	Board.prototype.checkFullRows = function () {
	  var isFull;
	  var fullRowIndexes = [];

	  this.elems.forEach(function (row, idx) {
	    isFull = row.every(function (column) {
	      return column !== null;
	    });
	    if (isFull) {
	      fullRowIndexes.unshift(idx);
	    }
	  });

	  this.removeRows(fullRowIndexes);

	  return fullRowIndexes.length;
	};

	// Removes the rows with the given indexes, and adds equally
	// many empty rows at the top; Note that the indexes need to be
	// order *from higher to lower*
	Board.prototype.removeRows = function (indexes) {
	  var i, j, emptyRow;

	  for (i = 0; i < indexes.length; i++) {
	    this.elems.splice(indexes[i], 1);
	  }

	  for (i = 0; i < indexes.length; i++) {
	    emptyRow = [];
	    for (j = 0; j < this.config.gridWidth; j++) {
	      emptyRow[j] = null;
	    }

	    this.elems.unshift(emptyRow);
	  }
	};

	Board.prototype.placePiece = function (piece) {
	  piece.forEachBlock(function (x, y) {
	    if (this.getBlock(x, y)) {
	      this.board.set(piece.x + x, piece.y + y, {
	        color: piece.color,
	        active: true
	      });
	    }
	  }, piece);
	};

	Board.prototype.clearPiece = function (piece) {
	  piece.forEachBlock(function (x, y) {
	    if (this.getBlock(x, y)) {
	      this.board.set(this.x + x, this.y + y, null);
	    }
	  }, piece);
	};

	Board.prototype.draw = function () {
	  var gridBlock;
	  var sz = this.config.blockSize;

	  for (var x = 0; x < this.config.gridWidth; x++) {
	    for (var y = 0; y < this.config.gridHeight; y++) {
	      gridBlock = this.get(x, y);
	      if (gridBlock !== null) {
	        this.ctx.fillStyle = gridBlock.color;
	        this.ctx.fillRect(x * sz + 1, y * sz + 1, sz - 2, sz - 2);
	      } else {
	        this.ctx.clearRect(x * sz, y * sz, sz, sz);
	      }
	    }
	  }
	};

	Board.prototype.canPlace = function (piece, px, py) {
	  var gridBlock;
	  var ret = true;
	  px = px || piece.x;
	  py = py || piece.y;

	  piece.forEachBlock(function (x, y) {
	    if (!this.blocks[y][x]) {
	      return;
	    }

	    if (!this.board.insideBoard(px + x, py + y)) {
	      ret = false;
	    } else {
	      gridBlock = this.board.get(px + x, py + y);
	      if (gridBlock && !gridBlock.active) {
	        ret = false;
	      }
	    }
	  }, piece);

	  return ret;
	};

	Board.prototype.drawPauseOverlay = function () {
	  this.ctx.fillStyle = this.config.pausedOverlayColor;
	  this.ctx.fillRect(0, 0, this.c.width, this.c.height);

	  this.drawCenteredText(this.config.pausedText);
	};

	Board.prototype.clearPauseOverlay = function () {
	  this.ctx.clearRect(0, 0, this.c.width, this.c.height);
	  this.draw();
	};

	Board.prototype.drawGameOver = function () {
	  this.ctx.fillStyle = this.config.gameOverOverlayColor;
	  this.ctx.fillRect(0, 0, this.c.width, this.c.height);
	  this.drawCenteredText(this.config.gameOverText);
	};

	Board.prototype.drawCenteredText = function (text) {
	  var textX, textY;

	  this.ctx.fillStyle = this.config.textColor;
	  this.ctx.font = this.config.font;
	  // centering the text horizontally based on its actual size
	  textX = (this.c.width - this.ctx.measureText(text).width) / 2;
	  textY = this.c.height / 2; // vertically just approximately centered
	  this.ctx.fillText(text, textX, textY);
	};

	exports.default = Board;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// piece.js - contains the logic for individual pieces
	//
	// The pieces are "live" only - a single active piece exists at any
	// one time when the game is running, and after it has been placed at the
	// bottom, it becomes part of the board's state and can no longer be
	// manipulated individually.
	//
	// (c) Ville Siltanen, 2015-2016. MIT License

	function Piece(x, y, board, colors, pieces) {
	  this.x = x;
	  this.y = y;
	  this.colors = colors;
	  this.pieces = pieces;
	  this.color = colors[Math.floor(Math.random() * colors.length)];
	  this.piece = pieces[Math.floor(Math.random() * pieces.length)];
	  this.rotationIndex = 0;
	  this.blocks = this.piece[this.rotationIndex];
	  this.board = board;
	}

	Piece.prototype.getBlock = function (x, y) {
	  return this.blocks[y][x];
	};

	Piece.prototype.canMove = function (dx, dy) {
	  return this.board.canPlace(this, this.x + dx, this.y + dy);
	};

	Piece.prototype.moveDown = function () {
	  return this.move(0, 1);
	};

	Piece.prototype.moveLeft = function () {
	  return this.move(-1, 0);
	};

	Piece.prototype.moveRight = function () {
	  return this.move(1, 0);
	};

	Piece.prototype.move = function (dx, dy) {
	  if (!this.canMove(dx, dy)) {
	    return false;
	  }

	  this.board.clearPiece(this);

	  this.x += dx;
	  this.y += dy;

	  this.board.placePiece(this);

	  return true;
	};

	Piece.prototype.rotate = function () {
	  if (this.canRotate()) {
	    this.board.clearPiece(this);
	    this.rotationIndex = (this.rotationIndex + 1) % this.piece.length;
	    this.blocks = this.piece[this.rotationIndex];
	    this.board.placePiece(this);
	  }
	};

	Piece.prototype.canRotate = function () {
	  var rotatedPiece = new Piece(this.x, this.y, this.board, this.colors, this.pieces);
	  rotatedPiece.piece = this.piece;
	  rotatedPiece.blocks = rotatedPiece.piece[rotatedPiece.rotationIndex];
	  rotatedPiece.rotationIndex = (this.rotationIndex + 1) % this.piece.length;
	  rotatedPiece.blocks = rotatedPiece.piece[rotatedPiece.rotationIndex];

	  return this.board.canPlace(rotatedPiece);
	};

	Piece.prototype.forEachBlock = function (callback, thisValue) {
	  for (var x = 0; x < this.blocks[0].length; x++) {
	    for (var y = 0; y < this.blocks.length; y++) {
	      callback.call(thisValue, x, y);
	    }
	  }
	};

	Piece.prototype.setInPlace = function () {
	  this.forEachBlock(function (x, y) {
	    if (this.getBlock(x, y) !== 0) {
	      this.board.set(this.x + x, this.y + y, {
	        color: this.color,
	        active: false
	      });
	    }
	  }, this);
	};

	exports.default = Piece;

/***/ }
/******/ ]);