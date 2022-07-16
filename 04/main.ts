// died in parsing pain ^_^
const path = "./input.txt";

const input: string = await Deno.readTextFile(path);
const chosenNumbers: number[] | undefined = input.split("\n").at(0)?.split(",")
  .map(Number);

interface Board {
  won: boolean;
  l: number[][];
  r: number[];
  checkL: boolean[][];
  checkR: boolean[];
}
const boards: Board[] = [];

function initBoard(): Board {
  const board: Board = { won: false, l: [], r: [], checkL: [], checkR: [] };
  board.l.length = 5;
  board.checkL.length = 5;
  board.r.length = 25;
  board.checkR.length = 25;
  for (let irow = 0; irow < 5; ++irow) {
    board.l[irow] = [];
    board.checkL[irow] = [];
    board.l[irow].length = 5;
    board.checkL[irow].length = 5;
    for (let icol = 0; icol < 5; ++icol) {
      board.l[irow][icol] = 0;
      board.checkL[irow][icol] = false;
    }
  }
  for (let i = 0; i < 25; ++i) {
    board.r[i] = 0;
    board.checkR[i] = false;
  }
  return board;
}

const boardNumbers: number[] = input.split("\n").splice(1).join(" ").replace(
  /\s+/g,
  " ",
).trim().split(" ").map(Number);
const boardNum = boardNumbers.length / 25;
for (let i = 0; i < boardNum; ++i) {
  const board: Board = initBoard();
  for (let irow = 0; irow < 5; ++irow) {
    for (let icol = 0; icol < 5; ++icol) {
      const readNum = boardNumbers[i * 25 + irow * 5 + icol];
      board.r[irow * 5 + icol] = readNum;
      board.l[irow][icol] = readNum;
    }
  }
  boards.push(board);
}

function checkVictory(board: Board): boolean {
  for (let irow = 0; irow < 5; ++irow) {
    if (
      board.checkL[irow][0] === true && board.checkL[irow][1] === true &&
      board.checkL[irow][2] === true && board.checkL[irow][3] === true &&
      board.checkL[irow][4] === true
    ) {
      return true;
    }
  }
  for (let icol = 0; icol < 5; ++icol) {
    if (
      board.checkL[0][icol] === true && board.checkL[1][icol] === true &&
      board.checkL[2][icol] === true && board.checkL[3][icol] === true &&
      board.checkL[4][icol] === true
    ) {
      return true;
    }
  }
  return false;
}

function calculateSum(board: Board): number {
  let sum = 0;
  for (let i = 0; i < 25; ++i) {
    if (!board.checkR[i]) {
      sum += board.r[i];
    }
  }
  return sum;
}

function turn(it: number): boolean {
  for (const board of boards) {
    if (!board.won) {
      for (let i = 0; i < 25; ++i) {
        if (board.r[i] === it) {
          board.checkR[i] = true;
        }
      }
      for (let irow = 0; irow < 5; ++irow) {
        for (let icol = 0; icol < 5; ++icol) {
          if (board.l[irow][icol] === it) {
            board.checkL[irow][icol] = true;
          }
        }
      }
    }
  }

  // check victory
  for (const board of boards) {
    if (!board.won) {
      if (checkVictory(board)) {
        board.won = true;
        const index = boards.indexOf(board);
        boards.splice(index, 1);
        console.log(calculateSum(board) * it);
        return true;
      }
    }
  }
  return false;
}

/* function firstTask(): void {
  console.log("boards.length", boards.length);
  const numLen = chosenNumbers?.length ?? 0;
  for (let it = 0; it < numLen; ++it) {
    const turnNum: number | undefined = chosenNumbers === undefined
      ? 0
      : chosenNumbers[it];
    if (turn(turnNum)) {
      // one victory
      break;
    }
  }
} */

function nVictories(): void {
  let n = 0; let x = 0;
  for (const board of boards) {
    if (board.won) {
      ++x;
    }
    if (checkVictory(board)) {
      ++n;
    }
  }
  console.log("Vittorie calcolate controllando ogni scheda", n);
  console.log("Vittorie calcolate controllando solo il flag won", x);
}

function secondTask(): void {
  console.log("boards.length", boards.length);
  const numLen = chosenNumbers?.length ?? 0;
  for (let it = 0; it < numLen; ++it) {
    nVictories();
    const turnNum: number | undefined = chosenNumbers === undefined
      ? -1
      : chosenNumbers[it];
    if (turnNum === -1) {
      console.error("Parsing error");
    }
    if (turn(turnNum)) {
      console.log("Vittoria trovata");
      // break;
    }
  }
}

// firstTask();
secondTask();
