import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// Library build configuration
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "JimsShaders",
      fileName: "jims-shaders",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["pixi.js"],
      output: {
        globals: {
          "pixi.js": "PIXI",
        },
      },
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      tsconfigPath: "./tsconfig.app.json",
      include: ["src"],
      exclude: ["src/stories", "src/**/*.stories.tsx", "src/**/*.test.ts"],
      outDir: "dist",
      entryRoot: "src",
      staticImport: true,
      skipDiagnostics: false,
      logDiagnostics: true,
    }),
  ],
});
