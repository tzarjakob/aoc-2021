// This may take a while to give the result (about 40 seconds)

import { Stack } from "https://deno.land/x/datastructure@1.2.1/mod.ts";

const path = "./input.txt";
// const path = "./example.txt";

const input: string[] = await Deno.readTextFile(path).then((text) =>
  text.split("\n")
);

function isLowerCase(str: string) {
  return str === str.toLowerCase() && str !== str.toUpperCase();
}

function terminateWithPattern(str: string, pattern: string) {
  return str.substring(str.length - pattern.length) === pattern;
}

function stackToArray(s: Stack): string[] {
  const iter = s.iterator();
  const arr: string[] = [];
  let iteratorNext = iter.next();
  while (!iteratorNext.done) {
    const value: string = iteratorNext.value.value as unknown as string;
    if (terminateWithPattern(value, "tz")) {
      // push the value without the tz
      arr.push(value.substring(0, value.length - 2));
    } else {
      arr.push(value);
    }
    iteratorNext = iter.next();
  }
  return arr;
}

const lowerCaseNodes: Set<string> = new Set();
for (const line of input) {
  const [from, to] = line.split("-");
  if (isLowerCase(from)) {
    lowerCaseNodes.add(from);
  }
  if (isLowerCase(to)) {
    lowerCaseNodes.add(to);
  }
}

const allPaths: Set<string[]> = new Set();

function hash (arr: string[]) {
  return arr.join("-");
}

function presentStringInArray (str: string, arr: string[]) {
  return arr.indexOf(str) !== -1;
}

// remove all duplicates from allPaths
function removeDuplicates(paths: Set<string[]>): number {
  const arr: string[] = [];
  for (const path of paths) {
    if (! presentStringInArray(hash(path), arr)) {
      arr.push(hash(path));
    }
  }
  return arr.length;
}

let firstPartRes = 0;

class day8 {
  private graph: Map<string, string[]> = new Map();

  private duplicateNode(node: string, newNode: string) {
    const neighbors: string[] = this.graph.get(node) ?? [];
    const newNeighbors: string[] = [];
    for (const neighbor of neighbors) {
      newNeighbors.push(neighbor);
    }
    this.graph.set(newNode, newNeighbors);
    for (const elem of this.graph) {
      if (elem[1].includes(node)) {
        elem[1].push(newNode);
      }
    }
  }

  private removeNode(node: string) {
    // remove node from graph
    this.graph.delete(node);
    for (const elem of this.graph) {
      if (elem[1].includes(node)) {
        elem[1].splice(elem[1].indexOf(node), 1);
      }
    }
  }

  private initVisited(): Map<string, boolean> {
    const visited = new Map();
    for (const node of this.graph) {
      visited.set(node[0], false);
    }
    return visited;
  }

  private dfs(node: string, visited: Map<string, boolean>, paths: Stack) {
    if (node === "end") {
      paths.push({ key: "node", value: node });
      visited.set(node, true);
      // check if the path is already in allPaths
      const path = stackToArray(paths);
      if (allPaths.has(path)) {
        return;
      }
      allPaths.add(stackToArray(paths));
      firstPartRes++;
      return;
    }

    if (isLowerCase(node)) {
      visited.set(node, true);
    }
    paths.push({ key: "node", value: node });
    for (const child of this.graph.get(node) || []) {
      if (!visited.get(child)) {
        this.dfs(child, visited, paths);
        paths.pop();
        visited.set(child, false);
      }
    }
  }

  constructor() {
    for (const line of input) {
      const [from, to] = line.split("-");
      if (this.graph.get(from) === undefined) {
        this.graph.set(from, []);
      }
      if (this.graph.get(to) === undefined) {
        this.graph.set(to, []);
      }
      this.graph.get(from)?.push(to);
      this.graph.get(to)?.push(from);
    }
    this.firstPart();
    console.log(firstPartRes);
    this.secondPart();
    console.log(removeDuplicates(allPaths));
  }

  private secondPart() {
    for (const node of lowerCaseNodes) {
      const visited: Map<string, boolean> = this.initVisited();
      const paths = Stack.createStack();
      if (node !== "start" && node !== "end") {
        const dupNode: string = node + "tz";
        this.duplicateNode(node, dupNode);
        this.dfs("start", visited, paths);
        this.removeNode(dupNode);
      }
    }
  }
  private firstPart() {
    const visited: Map<string, boolean> = this.initVisited();
    const paths = Stack.createStack();
    this.dfs("start", visited, paths);
  }
}

new day8();
