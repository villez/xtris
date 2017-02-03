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

Piece.prototype.getBlock = function(x, y) {
  return this.blocks[y][x];
};

Piece.prototype.canMove = function(dx, dy) {
  return this.board.canPlace(this, this.x + dx, this.y + dy);
};

Piece.prototype.moveDown = function() {
  return this.move(0, 1);
};

Piece.prototype.moveLeft = function() {
  return this.move(-1, 0);
};

Piece.prototype.moveRight = function() {
  return this.move(1, 0);
};

Piece.prototype.move = function(dx, dy) {
  if (!this.canMove(dx, dy)) {
    return false;
  }

  this.board.clearPiece(this);

  this.x += dx;
  this.y += dy;

  this.board.placePiece(this);

  return true;
};

Piece.prototype.rotate = function() {
  if (this.canRotate()) {
    this.board.clearPiece(this);
    this.rotationIndex = (this.rotationIndex + 1) % this.piece.length;
    this.blocks = this.piece[this.rotationIndex];
    this.board.placePiece(this);
  }
};

Piece.prototype.canRotate = function() {
  let rotatedPiece = new Piece(this.x, this.y, this.board, this.colors, this.pieces);
  rotatedPiece.piece = this.piece;
  rotatedPiece.blocks = rotatedPiece.piece[rotatedPiece.rotationIndex];
  rotatedPiece.rotationIndex = (this.rotationIndex + 1) % this.piece.length;
  rotatedPiece.blocks = rotatedPiece.piece[rotatedPiece.rotationIndex];

  return this.board.canPlace(rotatedPiece);
};

Piece.prototype.forEachBlock = function(callback, thisValue) {
  for (let x = 0; x < this.blocks[0].length; x++) {
    for (let y = 0; y < this.blocks.length; y++) {
      callback.call(thisValue, x, y);
    }
  }
};

Piece.prototype.setInPlace = function() {
  this.forEachBlock(function(x, y) {
    if (this.getBlock(x, y) !== 0) {
      this.board.set(this.x + x, this.y + y, {
        color: this.color,
        active: false
      });
    }
  }, this);
};

export default Piece;
