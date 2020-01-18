module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: "eslint:recommended",
  parserOptions: {
    sourceType: "module"
  },
  rules: {
    "comma-dangle": ["error", "always-multiline"],
    indent: ["warn", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["warn", "single"],
    semi: ["warn", "always"],
    "no-unused-vars": ["warn"],
    "no-console": 0,
    "no-debugger": 0
  }
};
