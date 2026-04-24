const { execFileSync } = require("child_process");
const esbuild = require("esbuild");

execFileSync(process.execPath, [require.resolve("typescript/bin/tsc"), "--noEmit"], {
  stdio: "inherit",
});

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

esbuild.buildSync({
  entryPoints: ["src/webview-app.ts"],
  bundle: true,
  outfile: "dist/webview-app.js",
  format: "iife",
  platform: "browser",
  target: "es2020",
  sourcemap: true,
});

console.log("Extension built -> dist/extension.js, dist/webview-app.js");
