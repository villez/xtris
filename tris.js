(function () {
    "use strict";

    var config = {
        blockSize: 30
    };

    var state = {
        moveTimer: null
    };

    var c = document.getElementById("c");
    var ctx = c.getContext("2d");

    ctx.fillStyle = "green";
    ctx.strokeStyle = "black";

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
                     dx-2, dy-1);
    };

    Piece.prototype.moveDown = function() {
        if (this.y < 19) {
            this.clearCurrentPos();
            this.y++;
            this.draw();
        } else {
            clearInterval(state.moveTimer);
            next();
        }

    };

    Piece.prototype.clearCurrentPos = function() {
        ctx.clearRect(this.x * config.blockSize, this.y * config.blockSize,
                      config.blockSize, config.blockSize);
    };


    function next() {
        var a = new Piece();

        a.x = Math.floor(Math.random() * 10);
        a.y = 0;
        a.draw();
        state.moveTimer = setInterval(a.moveDown.bind(a), 200);
    }

    next();

}());
