module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
    // 这里因为没有用babel 所以不支持export
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
  },
};
