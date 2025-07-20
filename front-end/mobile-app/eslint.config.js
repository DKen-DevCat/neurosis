const globals = require("globals");
const prettierConfig = require("eslint-config-prettier");
const pluginPrettier = require("eslint-plugin-prettier");
const tsEslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const pluginReact = require("eslint-plugin-react");
const pluginReactHooks = require("eslint-plugin-react-hooks");
const pluginReactNative = require("eslint-plugin-react-native");
const pluginJest = require("eslint-plugin-jest");
const eslintJs = require("@eslint/js");

module.exports = [
  // ESLint Recommended
  eslintJs.configs.recommended,

  // TypeScript ESLint Recommended
  tsEslint.configs.recommended,

  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2021,
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.jest,
        __DEV__: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsEslint,
      prettier: pluginPrettier,
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "react-native": pluginReactNative,
      jest: pluginJest,
    },
    rules: {
      // Prettier のルールを ESLint で強制
      "prettier/prettier": "error",

      // その他の ESLint ルール
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
  },
  prettierConfig,
];
