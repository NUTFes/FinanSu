import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import nextVitals from 'eslint-config-next/core-web-vitals';
import eslintConfigPrettier from 'eslint-config-prettier';
//import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';
import _import from 'eslint-plugin-import';
import storybook from 'eslint-plugin-storybook';
import unusedImports from 'eslint-plugin-unused-imports';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  ...nextVitals,
  ...storybook.configs['flat/recommended'],

  //  {
  //    extends: [eslintPluginBetterTailwindcss.configs['recommended-warn']],
  //    settings: {
  //      'better-tailwindcss': {
  //        // Tailwind CSS v4: CSS-based configuration entry file
  //        entryPoint: 'src/styles/globals.css',
  //      },
  //    },
  //  },

  globalIgnores([
    // Default ignores of eslint-config-next
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',

    // Project specific
    'src/generated',
    '**/*.config.js',
    '**/*.config.ts',
  ]),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'unused-imports': unusedImports,
      import: _import,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },

        project: ['./tsconfig.json', './tsconfig.stories.json'],
        tsconfigRootDir: __dirname,
      },
    },

    settings: {
      'import/resolver': {
        node: {
          extensions: ['.ts', '.tsx'],
        },

        typescript: {},
      },

      react: {
        version: 'detect',
      },
    },

    rules: {
      'unused-imports/no-unused-imports': 'error',

      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
            'object',
            'type',
          ],

          'newlines-between': 'always',

          alphabetize: {
            caseInsensitive: true,
            order: 'asc',
          },
        },
      ],

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Next.js (React 19) upgrade can introduce new react-hooks rules that are
      // too noisy for the current codebase. Keep them as warnings for now.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/immutability': 'warn',

      // Storybook plugin currently flags existing stories that import
      // '@storybook/react'. Keep as warning until stories are migrated.
      'storybook/no-renderer-packages': 'warn',

      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  eslintConfigPrettier,
]);
