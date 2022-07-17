import {
  Board,
  calculateSum,
  checkVictory,
  clearCheckTable,
  initBoard,
  nNotVictories,
  nVictories,
} from "./board.ts";

function initialize(input: string, boards: Board[]) {
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
        board.values[irow][icol] = readNum;
      }
    }
    boards.push(board);
  }
}

function firstTask(
  boards: Board[],
  chosenNumbers: number[],
): number {
  for (const it of chosenNumbers) {
    for (const board of boards) {
      // check if the number is in the board
      // if so, set the checkTable[irow][icol] to true
      for (let irow = 0; irow < 5; ++irow) {
        for (let icol = 0; icol < 5; ++icol) {
          if (board.values[irow][icol] === it) {
            board.checkTable[irow][icol] = true;
          }
        }
      }
    }
    // check victory
    for (const board of boards) {
      if (checkVictory(board)) {
        return calculateSum(board) * it;
      }
    }
  }
  return -1;
}

function secondTask(boards: Board[], chosenNumbers: number[]): number {
  for (const it of chosenNumbers) {
    for (const board of boards) {
      // check if the number is in the board
      // if so, set the checkTable[irow][icol] to true
      for (let irow = 0; irow < 5; ++irow) {
        for (let icol = 0; icol < 5; ++icol) {
          if (board.values[irow][icol] === it) {
            board.checkTable[irow][icol] = true;
          }
        }
      }
    }
    // check victory
    for (const board of boards) {
      if (checkVictory(board)) {
        board.won = true;
        if (nNotVictories(boards) === 0) {
          // console.log(boards)
          // console.log(it)
          return calculateSum(board) * it;
        }
      }
    }
  }
  return -1;
}

async function day4() {
  const path = "./input.txt";
  const input: string = await Deno.readTextFile(path);
  const chosenNumbers: number[] | undefined = input.split("\n").at(0)?.split(
    ",",
  )
    .map(Number);
  const boards: Board[] = [];
  initialize(input, boards);
  console.log(firstTask(boards, chosenNumbers ?? []));
  clearCheckTable(boards);
  console.log(secondTask(boards, chosenNumbers ?? []));
}

day4();