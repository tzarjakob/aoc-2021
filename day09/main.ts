// I don't know why but there is something wrong with boolean[][] here...

function nearPoints(input: number[][], x: number, y: number): number[][] {
  const res: number[][] = [];
  // add the point to right, down, left, up
  if (x + 1 < input.length) {
    res.push([x + 1, y]);
  }
  if (y + 1 < input[0].length) {
    res.push([x, y + 1]);
  }
  if (x - 1 >= 0) {
    res.push([x - 1, y]);
  }
  if (y - 1 >= 0) {
    res.push([x, y - 1]);
  }
  return res;
}

function isLowPoint(input: number[][], x: number, y: number): boolean {
  // check if all the nearestPoints are lower then the current point
  const nearestPoints: number[][] = nearPoints(input, x, y);
  for (let i = 0; i < nearestPoints.length; i++) {
    const [x1, y1] = nearestPoints[i];
    if (input[x][y] >= input[x1][y1]) {
      return false;
    }
  }
  return true;
}

function bay(
  input: number[][],
  i: number | undefined,
  j: number | undefined,
  visited: Set<number>,
  startHeight: number,
): number {
  if (i === undefined || j === undefined) {
    return 0;
  }
  // if the point is already visited
  if (visited.has(i * input[0].length + j)) {
    return 0;
  }
  if (input[i][j] > startHeight) {
    // mark as visited
    // visited[i * input[0].length + j] = 1;
    return 0;
  }
  // mark as visited
  visited.add(i * input[0].length + j);
  const nearestPoints: number[][] = nearPoints(input, i, j);
  return 1 +
    bay(
      input,
      nearestPoints.at(0)?.at(0),
      nearestPoints.at(0)?.at(1),
      visited,
      startHeight,
    ) +
    bay(
      input,
      nearestPoints.at(1)?.at(0),
      nearestPoints.at(1)?.at(1),
      visited,
      startHeight,
    ) +
    bay(
      input,
      nearestPoints.at(2)?.at(0),
      nearestPoints.at(2)?.at(1),
      visited,
      startHeight,
    ) +
    bay(
      input,
      nearestPoints.at(3)?.at(0),
      nearestPoints.at(3)?.at(1),
      visited,
      startHeight,
    );
}

function partTwo(input: number[][]): number {
  const basins: number[] = [];
  const generalVisited: Set<number>[] = [];
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      // find the largest bay in the current area
      const visited: Set<number> = new Set();
      const bayDim: number = input[i][j] === 9
        ? 0
        : bay(input, i, j, visited, input[i][j]);
      if (
        !generalVisited.some((visited) => {
          return visited.has(i * input[0].length + j);
        })
      ) {
        generalVisited.push(visited);
        basins.push(bayDim);
      }
    }
  }
  // sort basins decreasingly
  // find the three largest basins
  basins.sort((a, b) => b - a);
  return basins[0] * basins[1] * basins[2];
}

function partOne(input: number[][]): number {
  let res = 0;
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (isLowPoint(input, i, j)) {
        res += input[i][j] + 1;
      }
    }
  }
  return res;
}

async function day8() {
  // const path = "./example.txt";
  const path = "./input.txt";
  const input: number[][] = await Deno.readTextFile(path).then((text) =>
    text.split("\n").map((line) => line.split("").map((num) => +num))
  );
  console.debug(partOne(input));
  console.debug(partTwo(input));
}

await day8();
