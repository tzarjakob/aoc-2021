// DATA STRUCTURES ARE NOT RELIABLE

const path = './input.txt';
// const path = "./example.txt";

const DEPTH = 100;

const input: number[][] = await Deno.readTextFile(path).then((
  text,
) =>
  text.split("\n").map(Number).map((n) => n.toString().split("").map(Number))
);
const fpData: number[][] = [];
const flashed: Set<number> = new Set();

function getAdjacent(x: number, y: number): number[][] {
  // returns all adjacent cells
  const adjacent: number[][] = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      if (x + i < 0 || x + i >= fpData.length) continue;
      if (y + j < 0 || y + j >= fpData[0].length) continue;
      adjacent.push([x + i, y + j]);
    }
  }
  return adjacent;
}

function addOne(): void {
  for (let i = 0; i < fpData.length; i++) {
    for (let j = 0; j < fpData[0].length; j++) {
      fpData[i][j] += 1;
    }
  }
}

function addOneToAdjacent(i: number, j: number): void {
  for (const [x, y] of getAdjacent(i, j)) {
    fpData[x][y] += 1;
  }
}

function hash(x: number, y: number): number {
  return x * 100 + y;
}
function getFromHash(hash: number): [number, number] {
  return [Math.floor(hash / 100), hash % 100];
}

function checkAdjacent(bool: boolean): void {
  for (let i = 0; i < fpData.length; i++) {
    for (let j = 0; j < fpData[0].length; j++) {
      const adjacent = getAdjacent(i, j);
      if (
        adjacent.length === 9 &&
        adjacent.every(([x, y]) => fpData[x][y] > 9) && !flashed.has(hash(i, j))
      ) {
        flashed.add(hash(i, j));
        if (bool) {
          addOneToAdjacent(i, j);
        }
      }
    }
  }
}

function checkFlash(bool: boolean): void {
  for (let i = 0; i < fpData.length; i++) {
    for (let j = 0; j < fpData[0].length; j++) {
      if (fpData[i][j] > 9 && !flashed.has(hash(i, j))) {
        flashed.add(hash(i, j));
        if (bool) {
          addOneToAdjacent(i, j);
        }
      }
    }
  }
}

function setZeroFlashed() {
  for (const val of flashed) {
    const [x, y] = getFromHash(val);
    fpData[x][y] = 0;
  }
}

function step() {
  flashed.clear();
  addOne();

  for (let i = 0; i < DEPTH; i++) {
    checkAdjacent(true);
    checkFlash(true);
  }
  checkAdjacent(false);
  checkFlash(false);

  // set all flashed cells to 0
  setZeroFlashed();
  return flashed.size;
}

function partOne(limit: number): number {
  let result = 0;
  for (let i = 0; i < limit; i++) {
    const tmp = step();
    result += tmp;
    if (tmp === 100) {
      console.log(`All flashed at step number: ${i}`);
      return i + 1;
    }
    const numberOfZeros = fpData.reduce(
      (acc, row) => acc + row.filter((n) => n === 0).length,
      0,
    );
    console.assert(
      numberOfZeros === flashed.size,
      "Zeros don't match",
      numberOfZeros,
      flashed.size,
    );
  }
  return result;
}

function reset() {
  // reset fpData to input
  fpData.length = input.length;
  for (let i = 0; i < fpData.length; i++) {
    fpData[i] = [];
    fpData[i].length = input[0].length;
    for (let j = 0; j < fpData[0].length; j++) {
      fpData[i][j] = input[i][j];
    }
  }
}

reset();
console.log("First part, result:", partOne(100));
reset();
console.log("Second part, result:", partOne(1000));
