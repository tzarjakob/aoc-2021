const test: string = await Deno.readTextFile("./input.txt");
const list: number[] = test.split(",").map(Number);

function calculateSummation(target: number): number {
  if (target % 2 === 0) {
    return (1 + target) * target / 2;
  } else {
    return ((1 + target) * Math.floor(target / 2)) + ((target + 1) / 2);
  }
}

function calculateFuelSecond(list: number[], target: number): number {
  let res = 0;
  for (let i = 0; i < list.length; i++) {
    res += calculateSummation(Math.abs(list[i]- target));
  }
  return res;
}

function calculateFuelFirst(list: number[], target: number): number {
  let res = 0;
  for (let i = 0; i < list.length; i++) {
    res += Math.abs(list[i] - target);
  }
  return res;
}

// function that returns the mean of a list of numbers
function mean(list: number[]) {
  return list.reduce((a, b) => a + b, 0) / list.length;
}
// function that returns the median of a list of numbers
function median(list: number[]) {
  list.sort((a, b) => a - b);
  const half = Math.floor(list.length / 2);
  if (list.length % 2 !== 0) {
    return list[half];
  } else {
    return (list[half - 1] + list[half]) / 2.0;
  }
}

const meanList = Math.floor(mean(list));
const medianList = Math.floor(median(list));
/* console.log(meanList);
console.log(medianList);
console.log(calculateFuel(list, meanList)); */

var minSoFar = Infinity;
for (let i = 0; i < 2000; ++i) {
  const fuel = calculateFuelSecond(list, i);
  if (fuel < minSoFar) {
    minSoFar = fuel;
  }
}

console.log(minSoFar);
