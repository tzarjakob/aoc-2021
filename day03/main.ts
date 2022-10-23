let input: string[] = await Deno.readTextFile("./input.txt").then((text) =>
  text.split("\n")
);
const size = input[0].length;
// console.log(input)

function firstTask(): void {
  let gammaRate = 0;
  let epsilonRate = 0;
  for (let isize = 0; isize < size; isize++) {
    let countZero = 0;
    let countOne = 0;
    for (let ilen = 0; ilen < input.length; ilen++) {
      if (input[ilen][isize] === "0") {
        countZero++;
      } else {
        countOne++;
      }
    }
    if (countZero > countOne) {
      gammaRate = gammaRate * 10 + 0;
      epsilonRate = epsilonRate * 10 + 1;
    } else {
      gammaRate = gammaRate * 10 + 1;
      epsilonRate = epsilonRate * 10 + 0;
    }
  }
  gammaRate = parseInt(gammaRate.toString(), 2);
  epsilonRate = parseInt(epsilonRate.toString(), 2);
  console.log(gammaRate);
  console.log(epsilonRate);
  const powerConsumption = gammaRate * epsilonRate;
  console.log(powerConsumption);
}

function countZeros(input: string[], isize: number): number {
  let countZero = 0;
  for (let ilen = 0; ilen < input.length; ilen++) {
    if (input[ilen][isize] === "0") {
      countZero++;
    }
  }
  return countZero;
}

function secondTask(): void {
  let oxList: string[] = input;
  let co2List: string[] = input;
  let oxRating = -1;
  let co2Rating = -1;
  for (let isize = 0; isize < size; isize++) {
    let co2CountZero = countZeros(co2List, isize);
    let co2CountOne = co2List.length - co2CountZero;
    let oxCountZero = countZeros(oxList, isize);
    let oxCountOne = oxList.length - oxCountZero;
    oxList = oxList.filter((line) =>
      line[isize] === ((oxCountZero > oxCountOne) ? "0" : "1")
    );
    co2List = co2List.filter((line) =>
      line[isize] === ((co2CountZero > co2CountOne) ? "1" : "0")
    );
    // input = input.filter((line) => line[isize] === "0");
    if (oxList.length === 1) {
      oxRating = parseInt(oxList[0], 2);
    }
    if (co2List.length === 1) {
      co2Rating = parseInt(co2List[0], 2);
    }
  }
  console.log(oxRating);
  console.log(co2Rating);
  console.log(oxRating * co2Rating);
}

secondTask();
