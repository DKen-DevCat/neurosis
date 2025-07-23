module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
    jest: true,
    "react-native/react-native": true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react-native/all",
    "plugin:jest/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: "module",
  },
  plugins: [
    "react",
    "react-hooks",
    "react-native",
    "@typescript-eslint",
    "jest",
    "prettier",
  ],
  rules: {
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "double"], // ダブルクォートを強制
    "semi": ["error", "always"], // セミコロンを強制
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // 未使用変数を警告、_で始まる変数は無視
    "camelcase": ["error", { "properties": "always" }], // camelCase を強制
    "id-match": ["error", "^[a-zA-Z0-9_]*$", {
      "properties": true,
      "onlyDeclarations": false,
      "ignoreDestructuring": false
    }], // UPPER_SNAKE_CASE の定数を許可するための設定
    "react/react-in-jsx-scope": "off", // React 17+ では不要
    "react/no-unstable-nested-components": ["error", { "allowAsProps": true }], // NativeWind の className prop を許可
    "@typescript-eslint/explicit-module-boundary-types": "off", // 関数の戻り値の型推論を許可
    "@typescript-eslint/no-explicit-any": "off", // any の使用を許可

    // react-hooks のルール
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // react-native のルール
    "react-native/no-inline-styles": "warn",

    // jest のルール
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/valid-expect": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      files: ["metro.config.js", "tailwind.config.js"],
      rules: {
        "@typescript-eslint/no-require-imports": "off",
      },
    },
  ],
};