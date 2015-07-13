(function () {
    "use strict";

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
    }

    Board.prototype.get = function(x, y) {
        return this.elems[x + 20 * y];
    };

    Board.prototype.set = function(x, y, value) {
        this.elems[x + 20 * y] = value;
    };


    function Piece(x, y) {
        this.x = x;
        this.y = y;
    }

    Piece.prototype.draw = function() {
        var dy = config.blockSize;
        var dx = config.blockSize;

        ctx.fillRect(this.x * config.blockSize + 1, this.y * config.blockSize + 1,
                     dx-2, dy-2);
        ctx.strokeRect(this.x * config.blockSize + 1, this.y * config.blockSize + 1,
                     dx-2, dy-2);
    };

    Piece.prototype.canMoveDown = function() {
        return this.y < 19 && !state.board.get(this.x, this.y + 1);
    };

    Piece.prototype.moveDown = function() {
        this.clearCurrentPos();
        state.board.set(this.x, this.y, false);
        this.y++;
        state.board.set(this.x, this.y, true);
        this.draw();
    };

    Piece.prototype.clearCurrentPos = function() {
        ctx.clearRect(this.x * config.blockSize, this.y * config.blockSize,
                      config.blockSize, config.blockSize);
    };


    function nextPiece() {
        var p = new Piece();
        state.currentPiece = p;

        p.x = Math.floor(Math.random() * 10);
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
