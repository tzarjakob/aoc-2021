// deno-lint-ignore-file no-inferrable-types
import { Stack } from "https://deno.land/x/datastructure@1.2.1/mod.ts";

const penality_round = 3;
const penality_squared = 57;
const penality_curly = 1197;
const penality_major = 25137;

const com_round = 1;
const com_squared = 2;
const com_curly = 3;
const com_major = 4;

// const path: string = "./example.txt";
const path: string = "./input.txt";
const input: string[] = await Deno.readTextFile(path).then((data) =>
  data.split("\n")
);

function completeLine(symStack: Stack): number {
  const iterator = symStack.iterator();
  let iteratorNext = iterator.next();
  let result = 0;
  while (iteratorNext.done === false) {
    const sym: string = iteratorNext.value.value;
    switch (sym) {
      case "(":
        result = (result * 5) + com_round;
        break;
      case "[":
        result = (result * 5) + com_squared;
        break;
      case "{":
        result = (result * 5) + com_curly;
        break;
      case "<":
        result = (result * 5) + com_major;
        break;
      default:
        console.error("Unexpected symbol", sym);
        break;
    }
    iteratorNext = iterator.next();
  }
  return result;
}

function evaluateLine(line: string): number[] | undefined {
  const symStack: Stack = Stack.createStack();
  const dummy = 0;
  for (const sym of line) {
    if (sym === "(" || sym === "[" || sym === "{" || sym === "<") {
      symStack.push({ key: dummy, value: sym });
    } else {
      // deno-lint-ignore no-explicit-any
      const top: any = symStack.pop();
      console.assert(top !== undefined);
      const topSym: string = top.value;
      if (
        (topSym === "(" && sym !== ")") || (topSym === "[" && sym !== "]") ||
        (topSym === "{" && sym !== "}") || (topSym === "<" && sym !== ">")
      ) {
        switch (sym) {
          case ")":
            return [penality_round, 0];
          case "]":
            return [penality_squared, 0];
          case "}":
            return [penality_curly, 0];
          case ">":
            return [penality_major, 0];
        }
      }
    }
  }
  if (symStack.size !== 0) {
    return [0, completeLine(symStack)];
  }
  return undefined;
}

function partOne(): number {
  let result = 0;
  for (const line of input) {
    const res: number = evaluateLine(line)?.at(0) ?? 0;
    result += res;
  }
  return result;
}

function median(pool: number[]): number {
  const sorted = pool.sort((a, b) => a - b);
  const len = sorted.length;
  if (len % 2 === 0) {
    return (sorted[len / 2 - 1] + sorted[len / 2]) / 2;
  }
  return sorted[(len - 1) / 2];
}

function partTwo(): number {
  const result: number[] = [];
  for (const line of input) {
    const res: number = evaluateLine(line)?.at(1) ?? 0;
    result.push(res);
  }
  const resultWithoutZeros = result.filter((x) => x !== 0);
  return median(resultWithoutZeros);
}

console.log(partOne());
console.log(partTwo());