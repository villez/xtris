const basePieces = [
  // O
  {
    base: [[1, 1],
           [1, 1]],
    rotations: 1
  },
  // I
  {
    base: [[1],
           [1],
           [1],
           [1]],
    rotations: 2
  },
  // T
  {
    base: [[0, 1, 0],
           [1, 1, 1]],
    rotations: 4
  },
  // Z
  {
    base: [[1, 1, 0],
           [0, 1, 1]],
    rotations: 2
  },
  // S
  {
    base: [[0, 1, 1],
           [1, 1, 0]],
    rotations: 2
  },
  // L
  {
    base: [[1, 1],
           [0, 1],
           [0, 1]],
    rotations: 4
  },
  // J
  {
    base: [[1, 1],
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
    result[i]= result[i] || [];
    for (let j = 0; j < rows; j++) {
      result[i][j] = array[rows - j - 1][i];
    }
  }

  return result;
}

// generate the needed number of rotations for each defined piece
function calculateRotatedPieces() {
  const rotatedPieces = [];

  for (let idx = 0; idx < basePieces.length; idx++) {
    rotatedPieces[idx] = [];
    for (let rotationCount = 0; rotationCount < basePieces[idx].rotations; rotationCount++) {
      rotatedPieces[idx].push(nthRotation(basePieces[idx].base, rotationCount));
    }
  }
  return rotatedPieces;
}

const pieces = calculateRotatedPieces();

export default pieces
