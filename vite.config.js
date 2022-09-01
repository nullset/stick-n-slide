import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "index.js"),
      name: "Stick-n-Slide",
      // the proper extensions will be added
      fileName: "stick-n-slide",
    },
  },
});
