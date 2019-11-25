import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import htmlTemplate from "rollup-plugin-generate-html-template";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

const isProduction = process.env.NODE_ENV === "production";

export default [
  // ES module build
  {
    input: "src/index.js",
    output: {
      file: "dist/es/stick-n-slide.js",
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
      htmlTemplate({
        template: "src/demo.html",
        target: "demo.html"
      }),
      isProduction && terser()
    ]
  },

  // UMD build
  {
    input: "src/index.js",
    output: {
      file: "dist/umd/stick-n-slide.js",
      format: "umd",
      sourcemap: true,
      name: "stick-n-slide"
    },
    plugins: [
      // peerDepsExternal({
      //   includeDependencies: true
      // }),
      resolve({
        jsnext: true,
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
        template: "src/demo.html",
        target: "demo.html"
      }),
      isProduction && terser()
    ]
  }
];
