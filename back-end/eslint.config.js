const globals = require("globals");
const prettierConfig = require("eslint-config-prettier");
const pluginPrettier = require("eslint-plugin-prettier");

module.exports = [
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      // Prettier のルールを ESLint で強制
      "prettier/prettier": "error",

      // その他の ESLint ルール
      indent: ["error", 2],
      "linebreak-style": ["error", "unix"],
      quotes: ["error", "double"], // ダブルクォートを強制
      semi: ["error", "always"], // セミコロンを強制
      "no-unused-vars": ["warn", { argsIgnorePattern: "next" }],
      camelcase: ["error", { properties: "always" }], // camelCase を強制
      "id-match": [
        "error",
        "^[a-zA-Z0-9_]*$",
        {
          properties: true,
          onlyDeclarations: false,
          ignoreDestructuring: false,
        },
      ], // UPPER_SNAKE_CASE の定数を許可するための設定
    },
  },
  prettierConfig, // eslint-config-prettier を適用し、Prettier と競合する ESLint ルールを無効化
];
