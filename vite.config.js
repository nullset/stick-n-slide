import { resolve } from "path";
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [cssInjectedByJsPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    lib: {
      entry: resolve(__dirname, "index.js"),
      name: "Stick-n-Slide",
      // the proper extensions will be added
      fileName: "stick-n-slide",
    },
  },
});
