// board.js - logic for the game board
//
// maintains the state of the already placed pieces, logic
// for placing a new active (moving) piece on the board,
// removing rows when they become full, and some auxiliary stuff
// for displaying the paused and game over states
//
// (c) Ville Siltanen, 2015-2017. MIT License

import config from "./config.js";

class Board {
  constructor() {
    this.elems = [];
    for (let row = 0; row < config.gridHeight; row++) {
      this.elems[row] = [];
      for (let column = 0; column < config.gridWidth; column++) {
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
    return x >= 0 && y >= 0 && x < config.gridWidth && y < config.gridHeight;
  }

  checkFullRows() {
    let isFull;
    let fullRowIndexes = [];

    this.elems.forEach(function(row, idx) {
      isFull = row.every(column => column !== null);

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
      for (let j = 0; j < config.gridWidth; j++) {
        emptyRow[j] = null;
      }

      this.elems.unshift(emptyRow);
    }
  }

  placePiece(piece) {
    piece.forEachBlock(function(x, y) {
      if (this.blockAt(x, y)) {
        this.board.set(piece.x + x, piece.y + y, {
          color: piece.color,
          active: true
        });
      }
    }, piece);
  }

  clearPiece(piece) {
    piece.forEachBlock(function(x, y) {
      if (this.blockAt(x, y)) {
        this.board.set(this.x + x, this.y + y, null);
      }
    }, piece);
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

  setPieceInPlace(piece) {
    const board = this;
    piece.forEachBlock(function(x, y) {
      if (this.blockAt(x, y) !== 0) {
        board.set(this.x + x, this.y + y, {
          color: this.color,
          active: false
        });
      }
    }, piece);
  }
}

export default Board
