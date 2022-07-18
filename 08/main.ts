import {
  createMap,
  createSet,
  isSameSet,
  permutations,
  segsNeeded,
  toRealSeg,
} from "./utils.ts";

const path = "./input.txt";

function isADigit(segToEvaluate: string[]): number | undefined {
  for (const digit in segsNeeded) {
    if (
      isSameSet(createSet<string>(segsNeeded[digit]), createSet(segToEvaluate))
    ) {
      return Number(digit);
    }
  }
  return undefined;
}

function verifyPermutation(line: string[], permutation: string[]): boolean {
  const map: Map<string, string> = createMap(permutation);
  const digits: Set<number> = new Set();
  for (const seg of line) {
    const realSeg: string[] = toRealSeg(map, seg);
    const digit = isADigit(realSeg);
    if (digit === undefined) {
      return false;
    } else {
      digits.add(digit);
    }
  }
  if (digits.size !== 10) {
    return false;
  }
  return true;
}

/**
 * @param input line to evaluate
 * @returns the exact corrispondence segment in this case to real segment
 */
function bruteForceSolution(
  input: string[],
  permutations: string[][],
): string[] | undefined {
  for (const permutation of permutations) {
    if (verifyPermutation(input, permutation)) {
      return permutation;
    }
  }
  return undefined;
}

function partOne(input: string[][]): number {
  let result = 0;
  let tmpRes = 0;
  const ALL_PERMUTATION: string[][] = permutations(
    createSet<string>(["a", "b", "c", "d", "e", "f", "g"]),
  );
  for (const line of input) {
    const permutation: string[][] = ALL_PERMUTATION;
    const allDigits = line.slice(0, 10);
    const solution: string[] | undefined = bruteForceSolution(
      allDigits,
      permutation,
    );
    console.assert(solution !== undefined, "No solution found");
    for (let i = 10; i < line.length; i++) {
      if (line[i] === "|"){
        continue;
      }
      const digit = isADigit(toRealSeg(createMap(solution), line[i]));
      tmpRes *= 10;
      tmpRes += digit!;
    }
    result += tmpRes;
    tmpRes = 0;
  }
  return result;
}

async function getInput() {
  const input: string[][] = await Deno.readTextFile(path).then((
    text,
  ) => text.split("|\n").join("").split("\n").map((line) => line.split(" ")));
  return input;
}

async function day8() {
  const input: string[][] = await getInput();
  console.log(partOne(input));
}

day8();
