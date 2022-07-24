const path = './input.txt';
// const path = './example.txt';

const input: string[][] = await Deno.readTextFile(path).then((
  text,
) => text.split("\n\n").map((line) => line.split("\n")));

function step(input: string[], rules: Map<string, string>): string[] {
  const result: string[] = [];
  for (let ipos = 0; ipos<input.length - 1; ipos++) {
    const iletter: string = input[ipos];
    const jletter: string = input[ipos + 1];
    const res: string | undefined = rules.get(iletter + jletter);
    console.assert(res !== undefined);
    result.push(iletter);
    result.push(res ?? "$$$ ERROR $$$");
    if (ipos == input.length - 2) {
      result.push(jletter);
    }
  }
  return result;
}

function countElems(input: string[]): Map<string, number> {
  const counts: Map<string, number> = new Map();
  input.forEach((letter) => {
    const count: number = counts.get(letter) ?? 0;
    counts.set(letter, count + 1);
  }
  );
  return counts;
}

function partOne(steps: number, input: string[], rules: Map<string, string>): number {
  let polymer: string[] = input.map((letter) => letter);
  // console.debug(polymer.join(""));
  for (let istep = 0; istep < steps; istep++) {
    polymer = step(polymer, rules);
    // console.debug(polymer.join(""));
  }
  const countMap: Map<string, number> = countElems(polymer);
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
  console.log(partOne(10, polTemplate, insertionRules));
}

day14();
