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
        dropTime: 300,  // milliseconds
        font: "40px sans-serif",
        textColor: "black",
        pausedText: "PAUSED",
        pausedOverlayColor: "#f0f0f0",
        gameOverText: "GAME OVER",
        gameOverOverlayColor: "rgba(200, 200, 200, 0.5)"
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
            for (j = 0; j < config.gridWidth; j++) {
                emptyRow[j] = null;
            }

            this.elems.unshift(emptyRow);
        }
    };

    Board.prototype.placePiece = function(piece) {
        if (!this.canPlace(piece.blocks, piece.x, piece.y)) {
            return false;
        }

        piece.forEachBlock(function(x, y) {
            if (this.getBlock(x, y)) {
                this.board.set(piece.x + x, piece.y + y, {
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
                this.board.set(this.x + x, this.y + y, null);
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
                if (!blocks[y][x]) {
                    continue;
                }

                if (!this.insideBoard(px + x, py + y)) {
                    ret = false;
                } else {
                    gridBlock = this.get(px + x, py + y);
                    if (gridBlock && !gridBlock.active) {
                        ret = false;
                    }
                }
            }
        }

        return ret;
    };

    Board.prototype.drawPauseOverlay = function() {
        ctx.fillStyle = config.pausedOverlayColor;
        ctx.fillRect(0, 0, c.width, c.height);

        this.drawCenteredText(config.pausedText);
    };

    Board.prototype.clearPauseOverlay = function() {
        ctx.clearRect(0, 0, c.width, c.height);
        this.draw();
    };

    Board.prototype.drawGameOver = function() {
        ctx.fillStyle = config.gameOverOverlayColor;
        ctx.fillRect(0, 0, c.width, c.height);
        this.drawCenteredText(config.gameOverText);
    };

    Board.prototype.drawCenteredText = function(text) {
        var textX, textY;

        ctx.fillStyle = config.textColor;
        ctx.font = config.font;
        // centering the text horizontally based on its actual size
        textX = (c.width - ctx.measureText(text).width) / 2;
        textY = (c.height / 2);  // vertically just approximately centered
        ctx.fillText(text, textX, textY);
    };

    function Piece(x, y, color, board) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.piece = PIECES[Math.floor(Math.random() * PIECES.length)];
        this.rotationIndex = 0;
        this.blocks = this.piece[this.rotationIndex];
        this.board = board;
    }

    Piece.prototype.getBlock = function(x, y) {
        return this.blocks[y][x];
    };

    Piece.prototype.canMove = function(dx, dy) {
        return this.board.canPlace(this.blocks, this.x + dx, this.y + dy);
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
        if (!this.canRotate()) {
            return false;
        }

        this.board.clearPiece(this);

        this.rotationIndex = (this.rotationIndex + 1) % this.piece.length;
        this.blocks = this.piece[this.rotationIndex];

        this.board.placePiece(this);
    };

    Piece.prototype.canRotate = function() {
        var newRotationIndex = (this.rotationIndex + 1) % this.piece.length;
        var rotatedBlocks = this.piece[newRotationIndex];

        return this.board.canPlace(rotatedBlocks, this.x, this.y);
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
                this.board.set(this.x + x, this.y + y, {
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
        status: "stopped",
        score: 0
    };

    game.nextPiece = function() {
        var p = new Piece(4, 0,
                          config.colors[Math.floor(Math.random() * config.colors.length)],
                         game.board);
        game.currentPiece = p;

        if (game.board.placePiece(p)) {
            game.board.draw();
            game.moveTimer = setInterval(game.dropPiece, game.dropTime);
        } else {
            // cannot place the new piece -> game over
            game.status = "stopped";
            clearInterval(game.moveTimer);
            game.currentPiece = null;
            game.board.drawGameOver();
        }
    };

    game.draw = function() {
        // safeguard to make sure the board is not drawn if the game
        // is not running
        if (game.status === "running") {
            game.board.draw();
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
        var rowsCleared;

        clearInterval(game.moveTimer);
        game.currentPiece.setInPlace();
        game.score += 10;
        rowsCleared = game.board.checkFullRows();
        game.score += (rowsCleared * 100);
        if (rowsCleared > 0) {
            game.dropTime -= 3;
        }
        game.updateScore();
        game.board.draw();
        game.nextPiece();
    };

    game.arrowKeyPress = function(event) {
        if (game.status === "running") {
            switch(event.keyCode) {
            case 37: // left
                game.currentPiece.moveLeft();
                game.board.draw();
                break;
            case 38: // up
                game.currentPiece.rotate();
                game.board.draw();
                break;
            case 39: // right
                game.currentPiece.moveRight();
                game.board.draw();
                break;
            case 40: // down
                game.dropPieceAllTheWay();
                game.board.draw();
                break;
            default:
                // no other keys handled here - pause in its own function
            }
        }
    };

    game.togglePause = function(event) {
        if (event.key === "p" ||
            event.keyCode === 112 ||
            event.keyCode === 80) {

            // note: if game.status === "stopped", do nothing

            if (game.status === "paused") {
                game.status = "running";
                game.moveTimer = setInterval(game.dropPiece, game.dropTime);
                game.board.clearPauseOverlay();
            } else if (game.status === "running") {
                game.status = "paused";
                clearInterval(game.moveTimer);
                game.board.drawPauseOverlay();
            }
        }
    };

    game.updateScore = function() {
        document.getElementsByClassName("game-score")[0].innerHTML = game.score;
    };

    game.restart = function() {
        clearInterval(game.moveTimer);
        game.board = new Board();
        game.status = "running";
        game.dropTime = config.dropTime;
        game.score = 0;
        game.updateScore();
        game.nextPiece();
    };

    window.addEventListener("keydown", game.arrowKeyPress);
    window.addEventListener("keypress", game.togglePause);
    document.getElementById("restart").addEventListener("click", game.restart);

}());
