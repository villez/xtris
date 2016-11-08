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

Board.prototype.get = function(x, y) {
  return this.elems[y][x];
};

Board.prototype.set = function(x, y, value) {
  this.elems[y][x] = value;
};

Board.prototype.insideBoard = function(x, y) {
  return x >= 0 && y >= 0 && x < this.config.gridWidth && y < this.config.gridHeight;
};

Board.prototype.checkFullRows = function() {
  var isFull;
  var fullRowIndexes = [];

  this.elems.forEach(function(row, idx) {
    isFull = row.every(function(column) {
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
Board.prototype.removeRows = function(indexes) {
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

Board.prototype.placePiece = function(piece) {
  piece.forEachBlock(function(x, y) {
    if (this.getBlock(x, y)) {
      this.board.set(piece.x + x, piece.y + y, {
        color: piece.color,
        active: true
      });
    }
  }, piece);
};

Board.prototype.clearPiece = function(piece) {
  piece.forEachBlock(function(x, y) {
    if (this.getBlock(x, y)) {
      this.board.set(this.x + x, this.y + y, null);
    }
  }, piece);
};

Board.prototype.draw = function() {
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

Board.prototype.canPlace = function(piece, px, py) {
  var gridBlock;
  var ret = true;
  px = px || piece.x;
  py = py || piece.y;

  piece.forEachBlock(function(x, y) {
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

Board.prototype.drawPauseOverlay = function() {
  this.ctx.fillStyle = this.config.pausedOverlayColor;
  this.ctx.fillRect(0, 0, this.c.width, this.c.height);

  this.drawCenteredText(this.config.pausedText);
};

Board.prototype.clearPauseOverlay = function() {
  this.ctx.clearRect(0, 0, this.c.width, this.c.height);
  this.draw();
};

Board.prototype.drawGameOver = function() {
  this.ctx.fillStyle = this.config.gameOverOverlayColor;
  this.ctx.fillRect(0, 0, this.c.width, this.c.height);
  this.drawCenteredText(this.config.gameOverText);
};

Board.prototype.drawCenteredText = function(text) {
  var textX, textY;

  this.ctx.fillStyle = this.config.textColor;
  this.ctx.font = this.config.font;
  // centering the text horizontally based on its actual size
  textX = (this.c.width - this.ctx.measureText(text).width) / 2;
  textY = (this.c.height / 2);  // vertically just approximately centered
  this.ctx.fillText(text, textX, textY);
};

export default Board;
