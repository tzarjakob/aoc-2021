const path = "./input.txt";

/* 
"NOT OPTIMAL" CODE USED FOR PART ONE

function newFishes(lanternFish: number[]) : number{
  let newFishes = 0;
  for (let i = 0; i < lanternFish.length; i++) {
    if (lanternFish[i] === 0) {
      newFishes++;
      lanternFish[i] = 6;
    } else {
      lanternFish[i]--;
    }
  }
  return newFishes;
}


function goToDay(day:number, lanternFish: number[]) : void {
  while (day > 0) {
    day--;
    const NEW_FISHES = newFishes(lanternFish);
    for (let i=0; i<NEW_FISHES; ++i) {
      lanternFish.push(8);
    }
  }
}
 */


function step(lanternFish: number[]): void {
  const newFishes = lanternFish[0];
  for (let i = 0; i < 8; i++) {
    lanternFish[i] = lanternFish[i + 1];
  }
  lanternFish[6] += newFishes;
  lanternFish[8] = newFishes;
}

function goToDay(day: number, lanternFish: number[]): void {
  while (day > 0) {
    day--;
    step(lanternFish);
  }
}

function parseInput(input: number[], lanternFish: number[]): void {
  for (const val of input) {
    lanternFish[val]++;
  }
}

async function day6(): Promise<void> {
  const input: number[] = await Deno.readTextFile(path).then((
    text,
  ) => text.split(",").map(Number));

  // part 1
  const lanternFish: number[] = Array(9).fill(0);
  parseInput(input, lanternFish);
  goToDay(80, lanternFish);
  console.log(lanternFish.reduce((acc, curr) => acc + curr, 0));

  // part 2
  lanternFish.fill(0);
  parseInput(input, lanternFish);
  goToDay(256, lanternFish);
  console.log(lanternFish.reduce((acc, curr) => acc + curr, 0));
}

day6();