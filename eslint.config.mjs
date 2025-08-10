import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import globals from "globals";

export default [
  { ignores: ["**/*.test.js"] },
  js.configs.recommended,
  stylistic.configs["recommended"],
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2024,
      sourceType: "module",
    },
    rules: {
      // Add any custom overrides here
      "@stylistic/indent": ["error", 2],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/semi": ["error", "always"],
    },
  },
];
