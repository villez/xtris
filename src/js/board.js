// board.js - logic for the game board
//
// maintains the state of the already placed pieces, logic
// for placing a new active (moving) piece on the board,
// removing rows when they become full, and some auxiliary stuff
// for displaying the paused and game over states
//
// (c) Ville Siltanen, 2015-2017. MIT License

class Board {
  constructor(config, canvasRef, ctx) {
    this.config = config;
    this.c = canvasRef;
    this.ctx = ctx;

    this.elems = [];
    for (let row = 0; row < this.config.gridHeight; row++) {
      this.elems[row] = [];
      for (let column = 0; column < this.config.gridWidth; column++) {
        this.elems[row].push(null);
      }
    }
  }

  get(x, y) {
    return this.elems[y][x];
  }

  set(x, y, value) {
    this.elems[y][x] = value;
  }

  insideBoard(x, y) {
    return x >= 0 && y >= 0 && x < this.config.gridWidth && y < this.config.gridHeight;
  }

  checkFullRows() {
    let isFull;
    let fullRowIndexes = [];

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
  }

  // Removes the rows with the given indexes, and adds equally
  // many empty rows at the top; Note that the indexes need to be
  // order *from higher to lower*
  removeRows(indexes) {
    for (let i = 0; i < indexes.length; i++) {
      this.elems.splice(indexes[i], 1);
    }

    for (let i = 0; i < indexes.length; i++) {
      let emptyRow = [];
      for (let j = 0; j < this.config.gridWidth; j++) {
        emptyRow[j] = null;
      }

      this.elems.unshift(emptyRow);
    }
  }

  placePiece(piece) {
    piece.forEachBlock(function(x, y) {
      if (this.getBlock(x, y)) {
        this.board.set(piece.x + x, piece.y + y, {
          color: piece.color,
          active: true
        });
      }
    }, piece);
  }

  clearPiece(piece) {
    piece.forEachBlock(function(x, y) {
      if (this.getBlock(x, y)) {
        this.board.set(this.x + x, this.y + y, null);
      }
    }, piece);
  }

  draw() {
    const sz = this.config.blockSize;

    for (let x = 0; x < this.config.gridWidth; x++) {
      for (let y = 0; y < this.config.gridHeight; y++) {
        const gridBlock = this.get(x, y);
        if (gridBlock !== null) {
          this.ctx.fillStyle = gridBlock.color;
          this.ctx.fillRect(x * sz + 1, y * sz + 1, sz - 2, sz - 2);
        } else {
          this.ctx.clearRect(x * sz, y * sz, sz, sz);
        }
      }
    }
  }

  canPlace(piece, px, py) {
    let ret = true;
    px = px || piece.x;
    py = py || piece.y;

    piece.forEachBlock(function(x, y) {
      if (!this.blocks[y][x]) {
        return;
      }

      if (!this.board.insideBoard(px + x, py + y)) {
        ret = false;
      } else {
        const gridBlock = this.board.get(px + x, py + y);
        if (gridBlock && !gridBlock.active) {
          ret = false;
        }
      }
    }, piece);

    return ret;
  }

  drawPauseOverlay() {
    this.ctx.fillStyle = this.config.pausedOverlayColor;
    this.ctx.fillRect(0, 0, this.c.width, this.c.height);

    this.drawCenteredText(this.config.pausedText);
  }

  clearPauseOverlay() {
    this.ctx.clearRect(0, 0, this.c.width, this.c.height);
    this.draw();
  }

  drawGameOver() {
    this.ctx.fillStyle = this.config.gameOverOverlayColor;
    this.ctx.fillRect(0, 0, this.c.width, this.c.height);
    this.drawCenteredText(this.config.gameOverText);
  }

  drawCenteredText(text) {
    this.ctx.fillStyle = this.config.textColor;
    this.ctx.font = this.config.font;

    // centering the text horizontally based on its actual size;
    // Note! font needs to be set before the measurement to get valid
    // result, as text size obviously depends on font size and style
    const textX = (this.c.width - this.ctx.measureText(text).width) / 2;
    const textY = (this.c.height / 2);  // vertically just approximately centered

    this.ctx.fillText(text, textX, textY);
  }
}

export default Board
