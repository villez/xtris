export const config =  {
  blockSize: 30,
  gridWidth: 10,
  gridHeight: 20,
  colors: ["#15d600", "#000bd6", "#d60e00", "#d68b00", "#00c4d6", "#d600d6"],
  dropTime: 300,  // milliseconds
  font: "40px sans-serif",
  textColor: "black",
  pausedText: "PAUSED",
  pausedOverlayColor: "#f0f0f0",
  gameOverText: "GAME OVER",
  gameOverOverlayColor: "rgba(200, 200, 200, 0.5)",
  highScoreItem: "xytrizHighScore"
};

export const pieces = [
  // O
  [
    [[1, 1], [1, 1]]
  ],
  // I
  [
    [[1], [1], [1], [1]],
    [[1, 1, 1, 1]]
  ],
  // T
  [
    [[0, 1, 0], [1, 1, 1]],
    [[1, 0], [1, 1], [1, 0]],
    [[1, 1, 1], [0, 1, 0]],
    [[0, 1], [1, 1], [0, 1]]
  ],
  // Z
  [
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1], [1, 1], [1, 0]]
  ],
  // S
  [
    [[0, 1, 1], [1, 1, 0]],
    [[1, 0], [1, 1], [0, 1]]
  ],
  // L
  [
    [[1, 1], [0, 1], [0, 1]],
    [[0, 0, 1], [1, 1, 1]],
    [[1, 0], [1, 0], [1, 1]],
    [[1, 1, 1], [1, 0, 0]]
  ],
  // J
  [
    [[1, 1], [1, 0], [1, 0]],
    [[1, 1, 1], [0, 0, 1]],
    [[0, 1], [0, 1], [1, 1]],
    [[1, 0, 0], [1, 1, 1]]
  ]
];
