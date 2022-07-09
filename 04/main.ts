const input: number[] = await Deno.readTextFile("./example.txt").then((text) =>
  text.split("\n").map(Number)
);
console.log(input)