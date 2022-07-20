const path = "./input.txt";
// const path = './example.txt';

const input: string[] = await Deno.readTextFile(path).then((text) =>
  text.split("\n")
);
console.log(input);
