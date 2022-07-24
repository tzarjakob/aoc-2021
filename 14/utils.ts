// const path = "./input.txt";
const path = "./example.txt";

const input: string[][] = await Deno.readTextFile(path).then((
  text,
) => text.split("\n\n").map((line) => line.split("\n")));

const cache: Map<string, string> = new Map();

function setCacheBaseCases(rules: Map<string, string>) {
  rules.forEach((value, key) => {
    const firstCase: string = key.split("")[0] + value + key.split("")[1];
    cache.set(key, firstCase);
  });
  console.log(cache);
}

function fillLevel() {
  
}

function day14() {
  const polTemplate: string[] = input[0][0].split("");
  const insertionRules: Map<string, string> = new Map();
  const insertionRulesText = input[1].map((line) => line.split(" -> "));
  insertionRulesText.forEach(([key, value]) => insertionRules.set(key, value));
  setCacheBaseCases(insertionRules);
}

day14();
