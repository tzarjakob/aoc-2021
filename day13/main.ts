const path = "./input.txt";
// const path = "./example.txt";

const input: string[][] = await Deno.readTextFile(path).then((text) =>
  text.split("\n\n").map((line) => line.split("\n"))
);

interface fi_t {
  coo: string;
  loc: number;
}

let xDim = 0;
let yDim = 0;

const foldInstructions: fi_t[] = [];
for (const line of input[1]) {
  const text: string[] = line.split(" ");
  const content: string[] = text[2].split("=");
  foldInstructions.push({ coo: content[0], loc: Number(content[1]) });
}

const paperTable: number[][] = [];
const paperPoints: number[][] = [];
for (const line of input[0]) {
  const [x, y]: string[] = line.split(",");
  if (xDim < Number(y)) {
    xDim = Number(y);
  }
  if (yDim < Number(x)) {
    yDim = Number(x);
  }
  paperPoints.push([Number(y), Number(x)]);
}
paperTable.length = xDim + 1;
for (let i = 0; i < paperTable.length; i++) {
  paperTable[i] = [];
  paperTable[i].length = yDim + 1;
  for (let j = 0; j < paperTable[i].length; j++) {
    paperTable[i][j] = 0;
  }
}
for (const point of paperPoints) {
  // console.log(point);
  paperTable[point[0]][point[1]] = 1;
}

function foldX(coo: number, ipaper: number[][]): number[][] {
  const ncol: number = Math.floor(ipaper[0].length / 2);
  console.assert(ncol === coo, "coo is NOT the middle point");
  const npaper: number[][] = [];
  npaper.length = ipaper.length;
  for (let i = 0; i < ipaper.length; i++) {
    npaper[i] = [];
    npaper[i].length = ncol;
    for (let j = 0; j < ncol; j++) {
      npaper[i][j] = ipaper[i][j];
    }
  }
  for (let i = 0; i < npaper.length; i++) {
    for (let j = 0; j < npaper[0].length; j++) {
      const ival1 = npaper[i][j];
      const ival2 = ipaper[i][ncol + ncol - j];
      npaper[i][j] = (ival1 === 1 || ival2 === 1) ? 1 : 0;
    }
  }

  return npaper;
}

function foldY(coo: number, ipaper: number[][]): number[][] {
  const nrow = Math.floor(ipaper.length / 2);
  console.assert(nrow === coo, "coo is NOT the middle point");
  const npaper: number[][] = [];
  npaper.length = nrow;
  for (let i = 0; i < nrow; i++) {
    npaper[i] = [];
    npaper[i].length = ipaper[0].length;
    for (let j = 0; j < ipaper[0].length; j++) {
      npaper[i][j] = ipaper[i][j];
    }
  }
  for (let i = 0; i < npaper.length; i++) {
    for (let j = 0; j < npaper[0].length; j++) {
      const ival1 = npaper[i][j];
      const ival2 = ipaper[nrow + nrow - i][j];
      npaper[i][j] = (ival1 === 1 || ival2 === 1) ? 1 : 0;
    }
  }

  return npaper;
}

function copyPaper(ipaper: number[][]): number[][] {
  const npaper: number[][] = [];
  npaper.length = ipaper.length;
  for (let i = 0; i < ipaper.length; i++) {
    npaper[i] = [];
    npaper[i].length = ipaper[0].length;
    for (let j = 0; j < ipaper[0].length; j++) {
      npaper[i][j] = ipaper[i][j];
    }
  }
  return npaper;
}

function countOne(ipaper: number[][]): number {
  let count = 0;
  for (let i = 0; i < ipaper.length; i++) {
    for (let j = 0; j < ipaper[0].length; j++) {
      if (ipaper[i][j] === 1) {
        count++;
      }
    }
  }
  return count;
}

function saveAsPPM(ipaper: number[][]) {
  const npaper: number[][] = copyPaper(ipaper);
  const ncol = npaper[0].length;
  const nrow = npaper.length;
  let ppm: string = "P3\n" + (ncol * 10) + " " + (nrow * 10) + "\n255\n";
  for (let i = 0; i < nrow; i++) {
    for (let xscale = 0; xscale < 10; xscale++) {
      for (let j = 0; j < ncol; j++) {
        const val = npaper[i][j];
        const r = val * 255;
        const g = val * 255;
        const b = val * 255;
        for (let yscale = 0; yscale < 10; yscale++) {
          ppm += r + " " + g + " " + b + " ";
        }
      }
      ppm += "\n";
    }
  }
  Deno.writeFileSync("./output.ppm", new TextEncoder().encode(ppm));
  console.log("Generated output.ppm");
}

function partOne(): number {
  const singIns: fi_t | undefined = foldInstructions.at(0);
  console.assert(singIns !== undefined);
  // console.log(xDim, yDim);
  if (singIns?.coo === "x") {
    const npaper = foldX(singIns?.loc, paperTable);
    return countOne(npaper);
  }
  if (singIns?.coo === "y") {
    const npaper = foldY(singIns?.loc, paperTable);
    return countOne(npaper);
  }
  return 0;
}

function partTwo(): void {
  let ipaper = copyPaper(paperTable);
  for (const singIns of foldInstructions) {
    if (singIns.coo === "x") {
      ipaper = foldX(singIns.loc, ipaper);
    }
    if (singIns.coo === "y") {
      ipaper = foldY(singIns.loc, ipaper);
    }
  }
  saveAsPPM(ipaper);
}

console.log("Result part one", partOne());
partTwo();
