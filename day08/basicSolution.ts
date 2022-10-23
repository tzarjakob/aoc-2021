function partOne(input: string[][], uniqueLens: Set<number>): number {
  let sum = 0;
  for (const line of input) {
    for (let i = 10; i < line.length; i++) {
      if (uniqueLens.has(line[i].length)) {
        sum++;
      }
    }
  }
  return sum;
}

async function getInput() {
  const input: string[][] = await Deno.readTextFile("./input.txt").then((
    text,
  ) => text.split("|\n").join("").split("\n").map((line) => line.split(" ")));
  return input;
}

async function day8() {
  const uniqueLens: Set<number> = new Set();
  uniqueLens.add(2);
  uniqueLens.add(3);
  uniqueLens.add(4);
  uniqueLens.add(7);
  // generate segs To Num
  // const stn = segsToNum(); // needed segs associated with every digit
  // console.log(stn);
  const input: string[][] = await getInput();
  console.log(partOne(input, uniqueLens));
}

day8();
