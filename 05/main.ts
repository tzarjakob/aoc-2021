const path = "./input.txt";

interface Point {
  x: number;
  y: number;
}

interface Segment {
  p1: Point;
  p2: Point;
}

function parsePoint(pointT: string): Point {
  const point = pointT.split(",");
  return { x: parseInt(point[0]), y: parseInt(point[1]) };
}

function parseSegment(segT: string): Segment {
  const seg = segT.split("->");
  const p1 = parsePoint(seg[0]);
  const p2 = parsePoint(seg[1]);
  return { p1, p2 };
}

function initialize(input: string[]): Segment[] {
  const segs: Segment[] = [];
  for (const segT of input) {
    const seg = parseSegment(segT);
    segs.push(seg);
  }
  return segs;
}

function initTable(table: number[][], tableSize: number) {
  for (let i = 0; i < table.length; i++) {
    table[i] = [];
    table[i].length = tableSize;
    for (let j = 0; j < table[i].length; j++) {
      table[i][j] = 0;
    }
  }
}

function clearTable(table: number[][]) {
  for (let i = 0; i < table.length; i++) {
    for (let j = 0; j < table[i].length; j++) {
      table[i][j] = 0;
    }
  }
}

function maxValue(segs: Segment[]): number {
  let max = 0;
  for (const seg of segs) {
    max = Math.max(seg.p1.x, seg.p1.y, seg.p2.x, seg.p2.y, max);
  }
  return max;
}

function diagonalSegmentToBottom(
  table: number[][],
  p1: Point,
  p2: Point,
): void {
  let j = p1.y;
  let i = p1.x;
  while(j <= p2.y && i <= p2.x) {
    table[i][j] += 1;
    j++;
    i++;
  }
}

function diagonalSegmentToTop(table: number[][], p1: Point, p2: Point): void {
  let j = p1.y;
  let i = p1.x;
  while(j >= p2.y && i <= p2.x) {
    table[i][j] += 1;
    j--;
    i++;
  }
}

function fillTable(table: number[][], segs: Segment[]) {
  for (const seg of segs) {
    if (seg.p1.x == seg.p2.x) {
      const del1 = seg.p1.y < seg.p2.y ? seg.p1.y : seg.p2.y;
      const del2 = seg.p1.y < seg.p2.y ? seg.p2.y : seg.p1.y;
      for (let i = del1; i <= del2; i++) {
        table[seg.p1.x][i] += 1;
      }
    } else if (seg.p1.y == seg.p2.y) {
      const del1 = seg.p1.x < seg.p2.x ? seg.p1.x : seg.p2.x;
      const del2 = seg.p1.x < seg.p2.x ? seg.p2.x : seg.p1.x;
      for (let i = del1; i <= del2; i++) {
        table[i][seg.p1.y] += 1;
      }
    } else {
      // diagonal segment
      const p1: Point = seg.p1;
      const p2: Point = seg.p2;
      if (p1.x < p2.x && p1.y < p2.y) {
        diagonalSegmentToBottom(table, p1, p2);
      } else if (p1.x > p2.x && p1.y > p2.y) {
        diagonalSegmentToBottom(table, p2, p1);
      } else if (p1.x < p2.x && p1.y > p2.y) {
        diagonalSegmentToTop(table, p1, p2);
      } else {
        diagonalSegmentToTop(table, p2, p1);
      }
    }
  }
}

function fillTableHorVer(table: number[][], segs: Segment[]) {
  for (const seg of segs) {
    if (seg.p1.x == seg.p2.x) {
      const del1 = seg.p1.y < seg.p2.y ? seg.p1.y : seg.p2.y;
      const del2 = seg.p1.y < seg.p2.y ? seg.p2.y : seg.p1.y;
      for (let i = del1; i <= del2; i++) {
        table[seg.p1.x][i] += 1;
      }
    } else if (seg.p1.y == seg.p2.y) {
      const del1 = seg.p1.x < seg.p2.x ? seg.p1.x : seg.p2.x;
      const del2 = seg.p1.x < seg.p2.x ? seg.p2.x : seg.p1.x;
      for (let i = del1; i <= del2; i++) {
        table[i][seg.p1.y] += 1;
      }
    }
  }
}

function solution(table: number[][]): number {
  // count the number of values in the table that are greater or equal than 2
  let count = 0;
  for (let i = 0; i < table.length; i++) {
    for (let j = 0; j < table[i].length; j++) {
      if (table[i][j] >= 2) {
        count++;
      }
    }
  }
  return count;
}

async function day5() {
  const input: string[] = await Deno.readTextFile(path).then((
    text,
  ) => text.split("\n"));
  const segs: Segment[] = initialize(input);
  const tableSize = maxValue(segs) + 1;
  const table: number[][] = [];
  table.length = tableSize;
  initTable(table, tableSize);
  fillTableHorVer(table, segs);
  console.log(solution(table));
  clearTable(table);
  fillTable(table, segs);
  console.log(solution(table));
}

day5();
