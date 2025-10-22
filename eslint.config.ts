import tseslint from 'typescript-eslint';
import typescript from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import playwright from 'eslint-plugin-playwright';
const { configs: typescriptConfigs } = typescript;

export default [
  {
    ignores: [
      'node_modules/',
      'test-results/',
      'tests-out/',
      'playwright-report/',
      'playwright/.cache/',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': typescript,
      prettier: prettier,
      playwright: playwright,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      ...typescriptConfigs.recommended.rules,
      ...playwright.configs['flat/recommended'].rules,
      'prettier/prettier': 'error',
      'no-console': 'warn',
      'playwright/expect-expect': [
        'error',
        {
          // https://github.com/mskelton/eslint-plugin-playwright/blob/main/docs/rules/expect-expect.md
          assertFunctionNames: [
            'expectVisible',
            'expectError',
            'expectProductAt',
            'expectListProducts',
          ],
        },
      ],
    },
  },
];
