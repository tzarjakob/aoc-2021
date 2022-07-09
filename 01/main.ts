const input: number[] = await Deno.readTextFile("./example.txt").then((text) =>
  text.split("\n").map(Number)
);
// console.log(input)

function firstPart(): number {
  let increasing = 0;
  for (let i = 1; i < input.length; i++) {
    if (input[i] > input[i - 1]) {
      increasing++;
    }
  }
  return increasing;
}

function secondPart(): number {
  let increasing = 0;
  let sumThreeA = input[0] + input[1] + input[2];
  let sumThreeB = sumThreeA;

  for (let i = 3; i < input.length; i++) {
    sumThreeB -= input[i - 3];
    sumThreeB += input[i];
    if (sumThreeB > sumThreeA) {
      increasing++;
    }
    sumThreeA = sumThreeB;
  }
  return increasing;
}

// console.log(firstPart());
console.log(secondPart());
