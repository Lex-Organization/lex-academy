const esbuild = require("esbuild");
esbuild.buildSync({
  entryPoints: ["src/extension.ts"],
  bundle: true,
  outfile: "dist/extension.js",
  external: ["vscode"],
  format: "cjs",
  platform: "node",
  target: "node18",
  sourcemap: true,
});
console.log("Extension built → dist/extension.js");
