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
        [[0, 1, 1], [1, 1, 0]]
    ];

    var config = {
        blockSize: 30,
        gridWidth: 10,
        gridHeight: 20,
        colors: ["green", "blue", "red", "orange"]
    };

    var state = {
        board: null,
        moveTimer: null
    };


    function Board() {
        this.elems = new Array(config.gridWidth * config.gridHeight);
        for (var x = 0; x < config.gridWidth; x++) {
            for (var y = 0; y < config.gridHeight; y++) {
                this.set(x, y, false);
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
        return x < config.gridWidth && y < config.gridHeight;
    };


    function Piece(x, y) {
        this.x = x;
        this.y = y;
        this.blocks = pieces[Math.floor(Math.random() * pieces.length)];
    }

    Piece.prototype.getBlock = function(x, y) {
        return this.blocks[y][x];
    };

    Piece.prototype.draw = function() {
        var sz = config.blockSize;

        this.forEachBlock(function(x, y) {
            if (this.getBlock(x, y)) {
                ctx.fillRect((this.x + x) * sz + 1, (this.y + y) * sz + 1, sz - 2, sz - 2);
            }
        }, this);
    };

    Piece.prototype.canMoveDown = function() {
        var ret = true;
        for (var x = 0; x < this.blocks[0].length; x++) {
            for (var y = 0; y < this.blocks.length; y++) {
                if (!this.blockInsidePiece(x, y + 1) &&
                    this.getBlock(x, y) &&
                    (!state.board.insideBoard(this.x + x, this.y + y + 1) ||
                     state.board.get(this.x + x, this.y + y + 1))) {
                    ret = false;
                }
            }
        }
        return ret;
    };

    Piece.prototype.blockInsidePiece = function(x, y) {
        return x < this.blocks[0].length
            && y < this.blocks.length
            && this.getBlock(x, y);
    };

    Piece.prototype.moveDown = function() {
        this.clearCurrentPos();

        this.forEachBlock(function(x, y) {
            if (this.getBlock(x, y)) {
                state.board.set(this.x + x, this.y + y, false);
            }
        }, this);

        this.y++;

        this.forEachBlock(function(x, y) {
            if (this.getBlock(x, y)) {
                state.board.set(this.x + x, this.y + y, true);
            }
        }, this);

        this.draw();
    };

    Piece.prototype.forEachBlock = function(callback, thisValue) {
        for (var x = 0; x < this.blocks[0].length; x++) {
            for (var y = 0; y < this.blocks.length; y++) {
                callback.call(this, x, y);
            }
        }
    };

    Piece.prototype.clearCurrentPos = function() {
        var sz = config.blockSize;
        this.forEachBlock(function(x, y) {
            ctx.clearRect((this.x + x) * sz, (this.y + y) * sz, sz, sz);
        }, this);
    };


    function nextPiece() {
        var p = new Piece();
        state.currentPiece = p;
        ctx.fillStyle = config.colors[Math.floor(Math.random() * config.colors.length)];

        p.x = Math.floor(Math.random() * 7);
        p.y = 0;
        p.draw();
        state.moveTimer = setInterval(dropPiece, 100);
    }

    function dropPiece() {
        if (state.currentPiece.canMoveDown()) {
            state.currentPiece.moveDown();
        } else {
            clearInterval(state.moveTimer);
            nextPiece();
        }
    }

    state.board = new Board();
    nextPiece();

}());
