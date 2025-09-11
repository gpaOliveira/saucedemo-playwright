import tseslint from "typescript-eslint";
import typescript from "@typescript-eslint/eslint-plugin";
import playwright from "eslint-plugin-playwright";
const { configs: typescriptConfigs } = typescript;

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: [
        "node_modules/",
        "/test-results/",
        "/tests-out/",
        "/playwright-report/",
        "/playwright/.cache/"
    ],
    plugins: {
      "@typescript-eslint": typescript,
      "playwright": playwright
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      }
    },
    rules: {
      ...typescriptConfigs.recommended.rules,
      ...playwright.configs['flat/recommended'].rules,
      "no-console": "warn",
    }
  }
];