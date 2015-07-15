// Tetris clone in JavaScript, using HTML5 canvas
//
// (c) Ville Siltanen, 2015. MIT License

(function () {
    "use strict";

    var c = document.getElementById("c");
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
        colors: ["green", "blue", "red", "orange"],
        dropTimer: 250  // milliseconds
    };

    function Board() {
        this.elems = [];
        for (var row = 0; row < config.gridHeight; row++) {
            this.elems[row] = [];
            for (var column = 0; column < config.gridWidth; column++) {
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
        return x >= 0 && y >= 0 && x < config.gridWidth && y < config.gridHeight;
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
    };

    // Removes the rows with the given indexes, and adds equally
    // many empty rows at the top; Note that the indexes need to be
    // order *from higher to lower*
    Board.prototype.removeRows = function(indexes) {
        var i, j, emptyRow;

        for (i = 0; i < indexes.length; i++) {
            game.board.elems.splice(indexes[i], 1);
        }

        for (i = 0; i < indexes.length; i++) {
            emptyRow = [];
            for (j = 0; j < config.gridWidth; j++) {
                emptyRow[j] = null;
            }

            game.board.elems.unshift(emptyRow);
        }
    };

    Board.prototype.placePiece = function(piece) {
        if (!this.canPlace(piece.blocks, piece.x, piece.y)) {
            return false;
        }

        piece.forEachBlock(function(x, y) {
            if (this.getBlock(x, y)) {
                game.board.set(piece.x + x, piece.y + y, {
                    color: piece.color,
                    active: true
                });
            }
        }, piece);

        return true;
    };

    Board.prototype.clearPiece = function(piece) {
        piece.forEachBlock(function(x, y) {
            if (this.getBlock(x, y)) {
                game.board.set(this.x + x, this.y + y, null);
            }
        }, piece);
    };

    Board.prototype.draw = function() {
        var gridBlock;
        var sz = config.blockSize;

        for (var x = 0; x < config.gridWidth; x++) {
            for (var y = 0; y < config.gridHeight; y++) {
                gridBlock = this.get(x, y);
                if (gridBlock !== null) {
                    ctx.fillStyle = gridBlock.color;
                    ctx.fillRect(x * sz + 1, y * sz + 1, sz - 2, sz - 2);
                } else {
                    ctx.clearRect(x * sz, y * sz, sz, sz);
                }
            }
        }
    };

    Board.prototype.canPlace = function(blocks, px, py) {
        var gridBlock;
        var ret = true;
        for (var x = 0; x < blocks[0].length; x++) {
            for (var y = 0; y < blocks.length; y++) {
                if (blocks[y][x]) {
                    if (!game.board.insideBoard(px + x, py + y)) {
                        ret = false;
                    } else {
                        gridBlock = game.board.get(px + x, py + y);
                        if (gridBlock && !gridBlock.active) {
                            ret = false;
                        }
                    }
                }
            }
        }

        return ret;
    };

    function Piece(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.piece = PIECES[Math.floor(Math.random() * PIECES.length)];
        this.rotationIndex = 0;
        this.blocks = this.piece[this.rotationIndex];
    }

    Piece.prototype.getBlock = function(x, y) {
        return this.blocks[y][x];
    };

    Piece.prototype.canMove = function(dx, dy) {
        return game.board.canPlace(this.blocks, this.x + dx, this.y + dy);
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

        game.board.clearPiece(this);

        this.x += dx;
        this.y += dy;

        game.board.placePiece(this);

        return true;
    };

    Piece.prototype.rotate = function() {
        if (!this.canRotate()) {
            return false;
        }

        game.board.clearPiece(this);

        this.rotationIndex = (this.rotationIndex + 1) % this.piece.length;
        this.blocks = this.piece[this.rotationIndex];

        game.board.placePiece(this);
    };

    Piece.prototype.canRotate = function() {
        var newRotationIndex = (this.rotationIndex + 1) % this.piece.length;
        var rotatedBlocks = this.piece[newRotationIndex];

        return game.board.canPlace(rotatedBlocks, this.x, this.y);
    };

    Piece.prototype.forEachBlock = function(callback, thisValue) {
        var T;

        if (arguments.length > 1) {
            T = thisValue;
        }

        for (var x = 0; x < this.blocks[0].length; x++) {
            for (var y = 0; y < this.blocks.length; y++) {
                callback.call(T, x, y);
            }
        }
    };

    Piece.prototype.setInPlace = function() {
        this.forEachBlock(function(x, y) {
            if (this.getBlock(x, y) !== 0) {
                game.board.set(this.x + x, this.y + y, {
                    color: this.color,
                    active: false
                });
            }
        }, this);
    };


    var game = {
        board: null,
        moveTimer: null,
        currentPiece: null,
        running: false
    };

    game.nextPiece = function() {
        var p = new Piece(4, 0, config.colors[Math.floor(Math.random() * config.colors.length)]);
        game.currentPiece = p;

        if (game.board.placePiece(p)) {
            game.board.draw();
            game.moveTimer = setInterval(game.dropPiece, config.dropTimer);
        } else {
            game.running = false;
            clearInterval(game.moveTimer);
            game.currentPiece = null;
        }
    };

    game.dropPiece = function() {
        if (!game.currentPiece.moveDown()) {
            game.pieceFinished();
        }
        game.board.draw();
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
        game.board.checkFullRows();
        game.board.draw();
        game.nextPiece();
    };

    game.keyPress = function(event) {
        if (!game.running) {
            return;
        }

        switch(event.keyCode) {
        case 37:
            game.currentPiece.moveLeft();
            game.board.draw();
            break;
        case 38:
            game.currentPiece.rotate();
            game.board.draw();
            break;
        case 39:
            game.currentPiece.moveRight();
            game.board.draw();
            break;
        case 40:
            game.dropPieceAllTheWay();
            game.board.draw();
            break;
        default:
            // no other keys handled at the moment
        }
    };

    game.restart = function() {
        document.getElementById("restart").innerHTML = "Restart";
        clearInterval(game.moveTimer);
        game.board = new Board();
        game.running = true;
        game.nextPiece();
    };

    window.addEventListener("keydown", game.keyPress);
    document.getElementById("restart").addEventListener("click", game.restart);


}());
