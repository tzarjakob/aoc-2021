export const segsNeeded: Record<number, string[]> = {
  0: ["a", "b", "c", "e", "f", "g"],
  1: ["c", "f"],
  2: ["a", "c", "d", "e", "g"],
  3: ["a", "c", "d", "f", "g"],
  4: ["b", "c", "d", "f"],
  5: ["a", "b", "d", "f", "g"],
  6: ["a", "b", "d", "e", "f", "g"],
  7: ["a", "c", "f"],
  8: ["a", "b", "c", "d", "e", "f", "g"],
  9: ["a", "b", "c", "d", "f", "g"],
};

export const segsNForDigit: Record<number, number[]> = {
  2: [1],
  3: [7],
  4: [4],
  5: [2, 3, 5],
  6: [0, 6, 9],
  7: [8],
};

// function that checks if 2 sets of number are the same
// use generics
export function isSameSet<T>(set1: Set<T>, set2: Set<T>): boolean {
  if (set1.size !== set2.size) {
    return false;
  }
  for (const elem of set1) {
    if (!set2.has(elem)) {
      return false;
    }
  }
  return true;
}


export function initMap() {
  // create a map with key from "a" to "g" and value a list from "a" to "g"
  const map = new Map<string, Set<string>>();
  for (let i = 0; i < 7; i++) {
    const key = String.fromCharCode(97 + i);
    const value: Set<string> = new Set();
    for (let j = 0; j < 7; j++) {
      value.add(String.fromCharCode(97 + j));
    }
    map.set(key, value);
  }
  return map;
}

// function that generates all the possible permutations as string[] for a given set
export function permutations(set: Set<string>): string[][] {
  const result: string[][] = [];
  if (set.size === 0) {
    return [[]];
  }
  for (const elem of set) {
    const rest = new Set(set);
    rest.delete(elem);
    const restPermutations = permutations(rest);
    for (const restPermutation of restPermutations) {
      result.push([elem, ...restPermutation]);
    }
  }
  return result;
}


export function segToNumber(input: string): number {
  return input.charCodeAt(0) - 97;
}
export function numberToSeg(input: number): string {
  return String.fromCharCode(97 + input);
}

export function toRealSeg(map: Map<string, string>, line: string): string[] {
  const res: string[] = [];
  for (const seg of line) {
    const val = map.get(seg);
    if (val === undefined) {
      return [];
    } else if (val !== undefined) {
      res.push(val);
    }
  }
  return res;
}

export function createMap(permutation: string[]) {
  const map = new Map<string, string>();
  for (let i = 0; i < permutation.length; i++) {
    map.set(permutation[i], numberToSeg(i));
  }
  return map;
}

export function errorSet(): Set<string> {
  throw new Error("does not find the set");
  // deno-lint-ignore no-unreachable
  return new Set();
}

export function intersection(a: Set<string>, b: Set<string>) {
  return new Set([...a].filter((x) => b.has(x)));
}

export function union(a: Set<string>, b: Set<string>) {
  return new Set([...a, ...b]);
}

// same function createSet but with generics
export function createSet<T>(input: T[]): Set<T> {
  const result = new Set<T>();
  for (const line of input) {
    result.add(line);
  }
  return result;
}
