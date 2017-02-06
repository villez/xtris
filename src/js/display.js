import { config } from "./config.js";

const display = {
  get canvas() {
    return (this._canvas = this._canvas || document.querySelector("canvas"));
  },

  get context() {
    return (this._ctx = this._ctx || this.canvas.getContext("2d"));
  },

  drawBoard(board) {
    for (let x = 0; x < config.gridWidth; x++) {
      for (let y = 0; y < config.gridHeight; y++) {
        const gridBlock = board.get(x, y);
        if (gridBlock !== null) {
          this.fillBlock(x, y, gridBlock.color);
        } else {
          this.clearBlock(x, y);
        }
      }
    }
  },

  fillBlock(x, y, color) {
    const size = config.blockSize;
    this.context.fillStyle = color;
    this.context.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
  },

  clearBlock(x, y) {
    const size = config.blockSize;
    this.context.clearRect(x * size, y * size, size, size);
  },

  drawPauseOverlay() {
    this.context.fillStyle = config.pausedOverlayColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawCenteredText(config.pausedText);
  },

  clearPauseOverlay() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  drawGameOver() {
    this.context.fillStyle = config.gameOverOverlayColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawCenteredText(config.gameOverText);
  },

  drawCenteredText(text) {
    this.context.fillStyle = config.textColor;
    this.context.font = config.font;

    // centering the text horizontally based on its actual size;
    // Note! font needs to be set before the measurement to get valid
    // result, as text size obviously depends on font size and style
    const textX = (this.canvas.width - this.context.measureText(text).width) / 2;
    const textY = (this.canvas.height / 2);  // vertically just approximately centered

    this.context.fillText(text, textX, textY);
  }
};

export default display
