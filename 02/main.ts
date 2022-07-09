// deno-lint-ignore-file no-unused-vars
const input: string[] = await Deno.readTextFile("./input.txt").then((text) =>
  text.split("\n")
);

function firstTask(): void {
  let forward = 0;
  let upDown = 0;
  for (const line of input) {
    const x: string[] = line.split(" ");
    switch (x[0]) {
      case "up":
        upDown -= parseInt(x[1]);
        break;
      case "down":
        upDown += parseInt(x[1]);
        break;
      case "forward":
        forward += parseInt(x[1]);
        break;
      default:
        console.error("bad input");
        break;
    }
  }
  console.log(forward * upDown);
}

function secondTask(): void {
  let forward = 0;
  let depth = 0;
  let aim = 0;
  for (const line of input) {
    const x: string[] = line.split(" ");
    switch (x[0]) {
      case "up":
        // depth -= parseInt(x[1]);
        aim -= parseInt(x[1]);
        break;
      case "down":
        // depth += parseInt(x[1]);
        aim += parseInt(x[1]);
        break;
      case "forward":
        forward += parseInt(x[1]);
        depth += aim * parseInt(x[1]);
        // aim = 0;
        break;
      default:
        console.error("bad input");
        break;
    }
    console.log("\tforward:", forward, "\tdepth:", depth, "\taim:", aim);
  }
  console.log(input);
  console.log(forward);
  console.log(depth);
  console.log(forward * depth);
}

secondTask();
