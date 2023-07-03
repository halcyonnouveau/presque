import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: [
    { name: "./result", path: "./src/result.ts" },
    { name: "./immutable", path: "./src/immutable.ts" },
  ],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: "presque",
    version: Deno.args[0],
    description: "An attempt to make TypeScript less bad by just adding features and utilities from more good languages.",
    license: "MIT",
    author: "Justin Duch <justin@duch.me>",
    repository: {
      type: "git",
      url: "git+https://github.com/halcyonnouveau/presque.git",
    },
    bugs: {
      url: "https://github.com/halcyonnouveau/presque/issues",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
