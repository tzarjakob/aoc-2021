const path = 'input.txt'
// const path = 'example.txt'
// const path = "foo.txt";
const graphVizPath = "graph.dot";

const input: number[][] = await Deno.readTextFile(path).then((
  text,
) => text.split("\n").map((line) => line.split("").map((num) => +num)));
const dim = input.length;
console.assert(input.length === input[0].length, "Input must be square");

function saveStringInFile(str: string): void {
  Deno.writeFileSync(graphVizPath, new TextEncoder().encode(str));
}

function generateGraphGraphViz(graph: number[][]): string {
  let graphViz = `digraph G {\n`;
  for (let idim = 0; idim < dim * dim; idim++) {
    graphViz += `\tnode_${idim} [label="${idim}"]\n`;
  }
  for (let idim = 0; idim < dim * dim; idim++) {
    for (let jdim = 0; jdim < dim * dim; jdim++) {
      if (graph[idim][jdim] !== 0) {
        graphViz += `\tnode_${idim} -> node_${jdim} [label="${
          graph[idim][jdim]
        }"]\n`;
      }
    }
  }
  graphViz += "}";
  return graphViz;
}

function addEdge(
  graph: number[][],
  i: number,
  j: number,
  weight: number,
): void {
  const index = i * dim + j;
  if (index - 1 >= 0) {
    graph[index - 1][index] = weight;
  }
  if (index - (1 * dim) >= 0) {
    graph[index - 1 * dim][index] = weight;
  }
}

function dijkstra(graph: number[][], start: number): number[] {
  const distances: number[] = [];
  distances.length = graph.length;
  distances.fill(Infinity);
  distances[start] = 0;
  const visited: boolean[] = [];
  visited.length = graph.length;
  visited.fill(false);
  const queue: number[] = [];
  queue.push(start);
  while (queue.length > 0) {
    const current = queue.shift() as number;
    visited[current] = true;
    for (let i = 0; i < graph.length; i++) {
      if (graph[current][i] !== 0 && !visited[i]) {
        if (distances[current] + graph[current][i] < distances[i]) {
          distances[i] = distances[current] + graph[current][i];
          queue.push(i);
        }
      }
    }
  }
  return distances;
}

function initGraph(): number[][] {
  const graph: number[][] = [];
  graph.length = dim * dim;
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      graph[i * dim + j] = [];
      graph[i * dim + j].length = dim * dim;
      graph[i * dim + j].fill(0);
    }
  }
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      addEdge(graph, i, j, input[i][j]);
    }
  }
  return graph;
}

function partOne(): number {
  const graph = initGraph();
  // saveStringInFile(generateGraphGraphViz(graph));
  const distances = dijkstra(graph, 0);
  return distances[dim * dim - 1];
}

console.log(partOne());
