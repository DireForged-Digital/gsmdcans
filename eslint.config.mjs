// Flat config for Expo SDK 57 + typed linting. Run: pnpm lint
// ES module (.mjs) so the config itself passes the no-require-imports rule it enables.
import eslintComments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import tanstackQuery from '@tanstack/eslint-plugin-query';
import expoConfig from 'eslint-config-expo/flat.js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import testingLibrary from 'eslint-plugin-testing-library';
import { defineConfig, globalIgnores } from 'eslint/config';
import { configs as tseslintConfigs } from 'typescript-eslint';

export default defineConfig([
  globalIgnores([
    'dist/**',
    'ios/**',
    'android/**',
    '.expo/**',
    'coverage/**',
    'functions/lib/**',
    'node_modules/**',
  ]),
  expoConfig,
  ...tseslintConfigs.strictTypeChecked,
  ...tseslintConfigs.stylisticTypeChecked,
  reactHooks.configs.flat.recommended,
  ...tanstackQuery.configs['flat/recommended'],
  eslintComments.recommended,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      'import/no-default-export': 'error',
      'no-nested-ternary': 'error',
      'react/jsx-no-leaked-render': ['error', { validStrategies: ['ternary', 'coerce'] }],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react-native', importNames: ['Text', 'Image'], message: 'Use ThemedText / expo-image.' },
            { name: 'react', importNames: ['default'], message: 'Import hooks and types by name.' },
          ],
          patterns: [
            {
              group: ['@react-native-firebase/*', 'firebase/*'],
              message: 'Go through src/services/firebase.',
            },
          ],
        },
      ],
      // Silencing a hooks rule hides real bugs (stale values, infinite loops); fix the cause instead.
      '@eslint-community/eslint-comments/no-restricted-disable': ['error', 'react-hooks/*'],
      // Every remaining eslint-disable must say why: `// eslint-disable-next-line rule -- reason`.
      '@eslint-community/eslint-comments/require-description': 'error',
    },
  },
  {
    // Routes, config and services may default-export / import Firebase directly
    files: [
      'src/app/**/*.{ts,tsx}',
      'app.config.ts',
      'src/services/firebase/**/*.ts',
      'functions/src/**/*.ts',
      '*.config.{js,mjs,ts}',
    ],
    rules: { 'import/no-default-export': 'off', 'no-restricted-imports': 'off' },
  },
  {
    files: ['**/__tests__/**/*.{ts,tsx}', '**/*.test.{ts,tsx}', 'src/test/**/*.{ts,tsx}'],
    ...testingLibrary.configs['flat/react'],
    rules: {
      ...testingLibrary.configs['flat/react'].rules,
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-restricted-imports': 'off',
    },
  },
  {
    files: ['**/*.{js,cjs,mjs}'],
    ...tseslintConfigs.disableTypeChecked,
  },
  prettier,
]);
