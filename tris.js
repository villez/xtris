// Tetris clone in JavaScript, using HTML5 canvas
//
// (c) Ville Siltanen, 2015. MIT License

(function () {
    "use strict";

    var pieces = [
        [[1, 1], [1, 1]],
        [[1], [1], [1], [1]],
        [[1, 1]],
        [[1], [1]]
    ];

    var config = {
        blockSize: 30
    };

    var state = {
        board: null,
        moveTimer: null
    };

    var c = document.getElementById("c");
    var ctx = c.getContext("2d");

    ctx.fillStyle = "green";
    ctx.strokeStyle = "black";

    function Board() {
        this.elems = new Array(10 * 20);
        for (var x = 0; x < 10; x++) {
            for (var y = 0; y < 20; y++) {
                this.set(x, y, false);
            }
        }
    }

    Board.prototype.get = function(x, y) {
        return this.elems[x + 20 * y];
    };

    Board.prototype.set = function(x, y, value) {
        this.elems[x + 20 * y] = value;
    };

    Board.prototype.insideBoard = function(x, y) {
        return x < 10 && y < 20;
    };


    function Piece(x, y) {
        this.x = x;
        this.y = y;
        this.blocks = pieces[Math.floor(Math.random() * pieces.length)];
    }

    Piece.prototype.draw = function() {
        var sz = config.blockSize;

        this.forEachBlock(function(x, y) {
            ctx.fillRect(x * sz + 1, y * sz + 1, sz - 2, sz - 2);
        });
    };

    Piece.prototype.canMoveDown = function() {
        return this.eachBlockCanMoveDown();
    };

    Piece.prototype.eachBlockCanMoveDown = function() {
        var ret = true;
        for (var x = 0; x < this.blocks[0].length; x++) {
            for (var y = 0; y < this.blocks.length; y++) {
                if (!this.blockInsidePiece(x, y + 1) && (
                    !state.board.insideBoard(this.x + x, this.y + y + 1) ||
                    state.board.get(this.x + x, this.y + y + 1))) {
                    ret = false;
                }
            }
        }
        return ret;
    };

    Piece.prototype.blockInsidePiece = function(x, y) {
        return x < this.blocks[0].length && y < this.blocks.length;
    };

    Piece.prototype.moveDown = function() {
        this.clearCurrentPos();

        this.forEachBlock(function(x, y) {
            state.board.set(x, y, false);
        }, this);

        this.y++;

        this.forEachBlock(function(x, y) {
            state.board.set(x, y, true);
        }, this);

        this.draw();
    };

    Piece.prototype.forEachBlock = function(callback, thisValue) {
        for (var x = 0; x < this.blocks[0].length; x++) {
            for (var y = 0; y < this.blocks.length; y++) {
                callback.call(this, this.x + x, this.y + y);
            }
        }
    };

    Piece.prototype.clearCurrentPos = function() {
        var sz = config.blockSize;
        this.forEachBlock(function(x, y) {
            ctx.clearRect(x * sz, y * sz, sz, sz);
        }, this);
    };


    function nextPiece() {
        var p = new Piece();
        state.currentPiece = p;

        p.x = Math.floor(Math.random() * 9);
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
