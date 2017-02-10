const basePieces = [{
    base: [[1, 1],     // O
           [1, 1]],
    rotations: 1
  }, {
    base: [[1],        // I
           [1],
           [1],
           [1]],
    rotations: 2
  }, {
    base: [[0, 1, 0],  // T
           [1, 1, 1]],
    rotations: 4
  }, {
    base: [[1, 1, 0],  // Z
           [0, 1, 1]],
    rotations: 2
  }, {
    base: [[0, 1, 1],  // S
           [1, 1, 0]],
    rotations: 2
  }, {
    base: [[1, 1],    // L
           [0, 1],
           [0, 1]],
    rotations: 4
  }, {
    base: [[1, 1],    // J
           [1, 0],
           [1, 0]],
    rotations: 4
  }
];


// return the nth rotation of the given piece array
function nthRotation(piece, n) {
  if (n === 0) return piece;

  return nthRotation(rotation(piece), n - 1);
}

// rotate a two-dimensional array 90 degrees (i.e. transpose the matrix)
function rotation(array) {
  const rows = array.length;
  const cols = array[0].length;
  const result = [];

  for (let i = 0; i < cols; i++) {
    result[i] = result[i] || [];
    for (let j = 0; j < rows; j++) {
      result[i][j] = array[rows - j - 1][i];
    }
  }

  return result;
}

// generate the needed number of rotations for each defined piece
function calculateRotatedPieces() {
  const rotatedPieces = [];

  for (const [idx, piece] of basePieces.entries()) {
    rotatedPieces[idx] = [];
    for (let rotationCount = 0; rotationCount < piece.rotations; rotationCount++) {
      rotatedPieces[idx].push(nthRotation(piece.base, rotationCount));
    }
  }
  return rotatedPieces;
}

const pieces = calculateRotatedPieces();

export default pieces
