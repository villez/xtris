// Tetris clone in JavaScript, using HTML5 canvas
//
// (c) Ville Siltanen, 2015. MIT License

(function () {
    "use strict";

    var c = document.getElementById("c");
    var ctx = c.getContext("2d");
    ctx.strokeStyle = "black";

    var pieces = [
        [[1, 1], [1, 1]],
        [[1], [1], [1], [1]],
        [[0, 1, 0], [1, 1, 1]],
        [[1, 1, 0], [0, 1, 1]],
        [[0, 1, 1], [1, 1, 0]],
        [[1, 1], [0, 1], [0, 1]],
        [[1, 1], [1, 0], [1, 0]]
    ];

    var config = {
        blockSize: 30,
        gridWidth: 10,
        gridHeight: 20,
        colors: ["green", "blue", "red", "orange"],
        dropTimer: 250  // milliseconds
    };

    var state = {
        board: null,
        currentPiece: null,
        moveTimer: null
    };


    function Board() {
        this.elems = new Array(config.gridWidth * config.gridHeight);
        for (var x = 0; x < config.gridWidth; x++) {
            for (var y = 0; y < config.gridHeight; y++) {
                this.set(x, y, null);
            }
        }
    }

    Board.prototype.get = function(x, y) {
        return this.elems[x + config.gridHeight * y];
    };

    Board.prototype.set = function(x, y, value) {
        this.elems[x + config.gridHeight * y] = value;
    };

    Board.prototype.insideBoard = function(x, y) {
        return x >= 0 && y >= 0 && x < config.gridWidth && y < config.gridHeight;
    };

    Board.prototype.placePiece = function(piece) {
        var status = true;

        for (var x = 0; x < piece.blocks[0].length; x++) {
            for (var y = 0; y < piece.blocks.length; y++) {
                if (piece.getBlock(x, y)) {
                    if (state.board.get(piece.x + x, piece.y + y) !== null) {
                        status = false;
                    } else {
                        state.board.set(piece.x + x, piece.y + y, this.color);
                    }
                }
            }
        }

        return status;
    };

    Board.prototype.draw = function() {
        var block;
        var sz = config.blockSize;

        for (var x = 0; x < config.gridWidth; x++) {
            for (var y = 0; y < config.gridHeight; y++) {
                block = this.get(x, y);
                if (block !== null) {
                    ctx.fillStyle = block;
                    ctx.fillRect(x * sz + 1, y * sz + 1, sz - 2, sz - 2);
                } else {
                    ctx.clearRect(x * sz, y * sz, sz, sz);
                }
            }
        }
    }


    function Piece(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.blocks = pieces[Math.floor(Math.random() * pieces.length)];
    }

    Piece.prototype.getBlock = function(x, y) {
        return this.blocks[y][x];
    };

    Piece.prototype.blockInsidePiece = function(x, y) {
        return x < this.blocks[0].length
            && y < this.blocks.length
            && this.getBlock(x, y);
    };

    Piece.prototype.canMove = function(dx, dy) {
        var ret = true;
        for (var x = 0; x < this.blocks[0].length; x++) {
            for (var y = 0; y < this.blocks.length; y++) {
                if (!this.blockInsidePiece(x + dx, y + dy) &&
                    this.getBlock(x, y) &&
                    (!state.board.insideBoard(this.x + x + dx, this.y + y + dy) ||
                     state.board.get(this.x + x + dx, this.y + y + dy))) {
                    ret = false;
                }
            }
        }
        return ret;
    };

    Piece.prototype.moveDown = function() {
        return this.move(0, 1);
    };

    Piece.prototype.moveLeft = function() {
        return this.move(-1, 0);
    };

    Piece.prototype.moveRight = function() {
        return this.move(1, 0);
    }

    Piece.prototype.move = function(dx, dy) {
        if (!this.canMove(dx, dy)) {
            return false;
        }

        this.forEachBlock(function(x, y) {
            if (this.getBlock(x, y)) {
                state.board.set(this.x + x, this.y + y, null);
            }
        }, this);

        this.x += dx;
        this.y += dy

        this.forEachBlock(function(x, y) {
            if (this.getBlock(x, y)) {
                state.board.set(this.x + x, this.y + y, this.color);
            }
        }, this);

        return true;
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


    var game = {};
    game.running = false,

    game.nextPiece = function() {
        var p = new Piece(4, 0, config.colors[Math.floor(Math.random() * config.colors.length)]);
        state.currentPiece = p;

        if (state.board.placePiece(p)) {
            state.board.draw();
            state.moveTimer = setInterval(game.dropPiece, config.dropTimer);
        } else {
            game.running = false;
            clearInterval(state.moveTimer);
            game.currentPiece = null;
        }
    };

    game.dropPiece = function() {
        if (!state.currentPiece.moveDown()) {
            clearInterval(state.moveTimer);
            game.nextPiece();
        }
        state.board.draw();
    }

    game.keyPress = function(event) {
        if (!game.running) {
            return;
        }

        if (event.keyCode === 37) {
            state.currentPiece.moveLeft();
            state.board.draw();
        } else if (event.keyCode === 39) {
            state.currentPiece.moveRight();
            state.board.draw();
        }
    }

    window.addEventListener("keydown", game.keyPress);

    state.board = new Board();
    game.running = true;
    game.nextPiece();

}());
