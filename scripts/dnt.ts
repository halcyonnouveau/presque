import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./npm");

const cmd = new Deno.Command("git", {
  args: ["describe", "--tags", "--abbrev=0"],
});
const { stdout } = await cmd.output();
const tag = new TextDecoder().decode(stdout);

await build({
  entryPoints: [
    "./mod.ts",
    { name: "./result", path: "./lib/result.ts" },
    { name: "./immutable", path: "./lib/immutable.ts" },
  ],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: "presque",
    version: tag.trim().replace("v", ""),
    description:
      "An attempt to make TypeScript less bad by just adding features and utilities from more good languages.",
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
