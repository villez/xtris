// piece.js - contains the logic for individual pieces
//
// The pieces are "live" only - a single active piece exists at any
// one time when the game is running, and after it has been placed at the
// bottom, it becomes part of the board's state and can no longer be
// manipulated individually.
//
// (c) Ville Siltanen, 2015-2017. MIT License

import config from "./config.js";
import pieces from "./pieces.js";

class Piece {
  constructor(x, y, board) {
    this.x = x;
    this.y = y;
    this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
    this.piece = pieces[Math.floor(Math.random() * pieces.length)];
    this.rotationIndex = 0;
    this.board = board;
  }

  get blocks() {
    return this.piece[this.rotationIndex];
  }

  blockAt(x, y) {
    return this.blocks[y][x];
  }

  canMove(dx, dy) {
    return this.board.canPlace(this, this.x + dx, this.y + dy);
  }

  moveDown() {
    return this.move(0, 1);
  }

  moveLeft() {
    return this.move(-1, 0);
  }

  moveRight() {
    return this.move(1, 0);
  }

  move(dx, dy) {
    if (!this.canMove(dx, dy)) {
      return false;
    }

    this.board.clearPiece(this);

    this.x += dx;
    this.y += dy;

    this.board.placePiece(this);

    return true;
  }

  rotate() {
    if (this.canRotate()) {
      this.board.clearPiece(this);
      this.rotationIndex = (this.rotationIndex + 1) % this.piece.length;
      this.board.placePiece(this);
    }
  }

  canRotate() {
    const originalRotationIndex = this.rotationIndex;
    this.rotationIndex = (this.rotationIndex + 1) % this.piece.length;

    const result = this.board.canPlace(this);

    this.rotationIndex = originalRotationIndex;

    return result;
  }

  forEachBlock(callback, thisValue) {
    for (let x = 0; x < this.blocks[0].length; x++) {
      for (let y = 0; y < this.blocks.length; y++) {
        callback.call(thisValue, x, y);
      }
    }
  }

  setInPlace() {
    this.forEachBlock(function(x, y) {
      if (this.blockAt(x, y) !== 0) {
        this.board.set(this.x + x, this.y + y, {
          color: this.color,
          active: false
        });
      }
    }, this);
  }
}

export default Piece
