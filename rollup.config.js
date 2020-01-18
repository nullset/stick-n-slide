import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import htmlTemplate from "rollup-plugin-generate-html-template";
import multiEntry from "rollup-plugin-multi-entry";

const isProduction = process.env.NODE_ENV === "production";

export default [
  // ES module build
  {
    input: "src/index.js",
    output: {
      file: "dist/stick-n-slide.esm.js",
      format: "es",
      sourcemap: true
    },
    external: ["normalize-wheel"],
    plugins: [
      resolve({ include: "node_modules/**" }),
      commonjs({ include: "node_modules/**" }),
      babel(),
      postcss({
        plugins: [autoprefixer]
      }),
      isProduction
    ]
  },

  // UMD build
  {
    input: "src/index.js",
    output: {
      file: "dist/stick-n-slide.umd.js",
      format: "umd",
      sourcemap: true,
      name: "stick-n-slide"
    },
    plugins: [
      resolve({
        // jsnext: true,
        browser: true,
        include: "node_modules/**"
      }),
      commonjs({
        include: "node_modules/**"
      }),
      babel(),
      postcss({
        plugins: [autoprefixer]
      }),
      isProduction && terser()
    ]
  },

  // Demo code
  {
    input: "src/demo/demo.js",
    output: {
      file: "dist/demo/demo.js",
      format: "umd",
      sourcemap: true,
      name: "demo",
      globals: ["$", "jQuery"]
    },
    external: ["jQuery", "$"],
    plugins: [
      resolve({
        browser: true,
        include: "node_modules/**"
      }),
      commonjs({
        include: "node_modules/**"
      }),
      babel(),
      postcss({
        plugins: [autoprefixer]
      }),
      htmlTemplate({
        template: "src/demo/demo.html",
        target: "demo.html"
      }),
      isProduction && terser()
    ]
  }
];
