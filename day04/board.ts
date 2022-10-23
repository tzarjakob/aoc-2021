export interface Board {
  won: boolean;
  values: number[][];
  checkTable: boolean[][];
}

export function initBoard(): Board {
  const board: Board = { won: false, values: [], checkTable: [] };
  board.values.length = 5;
  board.checkTable.length = 5;
  for (let irow = 0; irow < 5; ++irow) {
    board.values[irow] = [];
    board.checkTable[irow] = [];
    board.values[irow].length = 5;
    board.checkTable[irow].length = 5;
    for (let icol = 0; icol < 5; ++icol) {
      board.values[irow][icol] = 0;
      board.checkTable[irow][icol] = false;
    }
  }
  return board;
}

export function clearCheckTable(boards: Board[]) {
  for (const board of boards) {
    board.won = false;
    for (let irow = 0; irow < 5; ++irow) {
      for (let icol = 0; icol < 5; ++icol) {
        board.checkTable[irow][icol] = false;
      }
    }
  }
}

export function checkVictory(board: Board): boolean {
  for (let irow = 0; irow < 5; ++irow) {
    if (
      board.checkTable[irow][0] === true && board.checkTable[irow][1] === true &&
      board.checkTable[irow][2] === true && board.checkTable[irow][3] === true &&
      board.checkTable[irow][4] === true
    ) {
      return true;
    }
  }
  for (let icol = 0; icol < 5; ++icol) {
    if (
      board.checkTable[0][icol] === true && board.checkTable[1][icol] === true &&
      board.checkTable[2][icol] === true && board.checkTable[3][icol] === true &&
      board.checkTable[4][icol] === true
    ) {
      return true;
    }
  }
  return false;
}

export function calculateSum(board: Board): number {
  let sum = 0;
  for (let irow = 0; irow < 5; ++irow) {
    for (let icol = 0; icol < 5; ++icol) {
      if (board.checkTable[irow][icol] === false) {
        sum += board.values[irow][icol];
      }
    }
  }
  return sum;
}

export function nVictories(boards: Board[]): number {
  let n = 0;
  for (const board of boards)
    if (board.won === true)
      ++n;
  return n;
}

export function nNotVictories (boards: Board[]): number {
  let n = 0;
  for (const board of boards)
    if (board.won === false)
      ++n;
  return n;
}

