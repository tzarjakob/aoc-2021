const foo: Map<string, Map<number, string>> = new Map();
foo.set("a", new Map());
foo.get("a")?.set(1, "b");