const path = "./input.txt";
// const path = "./example.txt";

const input: string[][] = await Deno.readTextFile(path).then((
  text,
) => text.split("\n\n").map((line) => line.split("\n")));

let countPairs: Map<string, number> = new Map();

function initCountPairs(
  initialPolymer: string[],
): void {
  for (let i = 0; i < initialPolymer.length - 1; i++) {
    const pair = initialPolymer[i] + initialPolymer[i + 1];
    countPairs.set(pair, countPairs.get(pair) ?? 0 + 1);
  }
}

function step(rules: Map<string, string>): void {
  const newPairs: Map<string, number> = new Map();
  for (const key of countPairs.keys()) {

    const times: number = countPairs.get(key) ?? 0;
    const value: string | undefined = rules.get(key);
    if (value === undefined) {
      throw new Error(`No value for key: ${key}`);
    }
    const ipair: string = key.charAt(0) + value.charAt(0);
    const jpair: string = value.charAt(0) + key.charAt(1);
    const tmp1 = newPairs.get(ipair) ?? 0;
    const tmp2 = newPairs.get(jpair) ?? 0;
    newPairs.set(ipair, tmp1 + times);
    newPairs.set(jpair, tmp2 + times);
  }
  countPairs = newPairs;
}

function countElems(lastLetter: string): Map<string, number> {
  const countMap: Map<string, number> = new Map();
  for (const key of countPairs.keys()) {
    const valueToAdd: number = countPairs.get(key) ?? 0;
    const exValue: number = countMap.get(key.charAt(0)) ?? 0;
    countMap.set(key.charAt(0), exValue + valueToAdd);
  }
  const lval: number = countMap.get(lastLetter) ?? 0;
  countMap.set(lastLetter, lval + 1);
  return countMap;
}

function partOne(
  steps: number,
  input: string[],
  rules: Map<string, string>,
): number {
  const lastLetter: string = input[input.length - 1];
  initCountPairs(input);
  for (let istep = 0; istep < steps; istep++) {
    step(rules);
  }
  const countMap: Map<string, number> = countElems(lastLetter);
  let maxSoFar = 0;
  let minSoFar: number = Number.MAX_VALUE;
  for (const key of countMap.keys()) {
    const count: number | undefined = countMap.get(key);
    if (count !== undefined && count > maxSoFar) {
      maxSoFar = count;
    }
    if (count !== undefined && count < minSoFar) {
      minSoFar = count;
    }
  }
  return maxSoFar - minSoFar;
}

function day14() {
  const polTemplate: string[] = input[0][0].split("");
  const insertionRules: Map<string, string> = new Map();
  const insertionRulesText = input[1].map((line) => line.split(" -> "));
  insertionRulesText.forEach(([key, value]) => insertionRules.set(key, value));
  console.log(partOne(40, polTemplate, insertionRules));
}

day14();
