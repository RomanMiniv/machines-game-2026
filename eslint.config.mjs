import globals from "globals";
import stylistic from "@stylistic/eslint-plugin";
import tseslint from "typescript-eslint";


/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export default [
  {
    files: ["src/**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser
    },
    plugins: {
      "@stylistic": stylistic,
      "@typescript-eslint": tseslint.plugin
    },
    rules: {
      "array-callback-return": ["error", {
        allowImplicit: false,
        checkForEach: false,
        allowVoid: false
      }],
      "no-async-promise-executor": "error",
      "no-compare-neg-zero": "error",
      "no-constructor-return": "error",
      "no-debugger": "error",
      "no-dupe-else-if": "error",
      "no-duplicate-case": "error",
      "no-duplicate-imports": ["error", {
        includeExports: false
      }],
      "no-func-assign": "error",
      "no-loss-of-precision": "error",
      "no-self-assign": ["error", {
        props: true
      }],
      "no-self-compare": "error",
      "no-setter-return": "error",
      "no-sparse-arrays": "error",
      "no-template-curly-in-string": "error",
      "no-this-before-super": "error",
      "no-unsafe-optional-chaining": ["error", {
        disallowArithmeticOperators: false
      }],
      "no-unused-private-class-members": "error",
      "use-isnan": "error",
      "valid-typeof": ["error", {
        requireStringLiterals: false
      }],
      "no-case-declarations": "error",
      "no-else-return": ["error", {
        allowElseIf: true
      }],
      "no-empty": ["error", {
        allowEmptyCatch: false
      }],
      "no-empty-static-block": "error",
      "no-extra-boolean-cast": ["error", {
        enforceForInnerExpressions: false
      }],
      "no-global-assign": "error",
      "no-regex-spaces": "error",
      "no-shadow-restricted-names": "error",
      "no-unused-labels": "error",
      "no-useless-catch": "error",
      "no-useless-escape": "error",
      "prefer-const": ["error", {
        destructuring: "any",
        ignoreReadBeforeAssign: false
      }],

      "@stylistic/arrow-spacing": ["warn", {
        before: true,
        after: true
      }],
      "@stylistic/block-spacing": ["warn", "always"],
      "@stylistic/brace-style": ["warn", "1tbs", {
        allowSingleLine: false
      }],
      "@stylistic/curly-newline": ["warn", {
        consistent: true,
      }],
      "@stylistic/eol-last": ["warn", "always"],
      "@stylistic/function-call-spacing": ["warn", "never"],
      "@stylistic/member-delimiter-style": ["warn", {
        multiline: {
          delimiter: "semi",
          requireLast: true,
        },
        singleline: {
          delimiter: "semi",
          requireLast: false,
        },
        multilineDetection: "brackets"
      }],
      "@stylistic/new-parens": ["warn", "always"],
      "@stylistic/no-whitespace-before-property": "warn",
      "@stylistic/rest-spread-spacing": ["warn", "never"],
      "@stylistic/semi": ["warn", "always"],
      "@stylistic/semi-spacing": ["warn", {
        before: false,
        after: true
      }],
      "@stylistic/semi-style": ["warn", "last"]
    }
  },
];
