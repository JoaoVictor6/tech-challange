import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";
import onlyWarn from "eslint-plugin-only-warn";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    rules: {
      indent: ["error", 2, { SwitchCase: 1 }], // 2 spaces for indentation, handles switch cases
      "object-curly-spacing": ["error", "always"], // Enforce spaces inside object curly braces
      "array-bracket-spacing": ["error", "always"], // Enforce spaces inside array brackets
      "computed-property-spacing": ["error", "always"], // Enforce spaces inside computed property brackets
      quotes: ["error", "single", { avoidEscape: true }],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "after-used", // Don't warn about unused function arguments before the last used one
          vars: "all", // Check all variables
          ignoreRestSiblings: true, // Ignore unused properties when using object rest/spread
          argsIgnorePattern: "^_", // Allow unused arguments if they start with an underscore (e.g., `_event`)
          varsIgnorePattern: "^_", // Allow unused variables if they start with an underscore (e.g., `_`)
        },
      ],
    },
  },
  {
    ignores: ["dist/**"],
  },
];
