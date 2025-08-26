import { FlatCompat } from '@eslint/eslintrc'
import importPlugin from 'eslint-plugin-import'
import sortKeysFix from 'eslint-plugin-sort-keys-fix'
import unusedImports from 'eslint-plugin-unused-imports'
import { dirname } from 'path'
import typescriptSortKeys from 'typescript-sort-keys'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  recommendedConfig: { extends: [] },
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ),

  {
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
  },

  {
    files: ['**/*.ts', '**/*.js'],
    plugins: {
      'sort-keys-fix': sortKeysFix,
      'typescript-sort-keys': typescriptSortKeys,
      'unused-imports': unusedImports,
      import: importPlugin,
    },
    rules: {
      'sort-keys-fix/sort-keys-fix': 'error',
      'unused-imports/no-unused-imports': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc' },
        },
      ],
      'import/no-duplicates': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'object-shorthand': 'error',
    },
  },

  {
    files: [
      'src/**/*.module.ts',
      'src/**/*.service.ts',
      'src/**/*.controller.ts',
      'src/**/*.strategy.ts',
    ],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },
]

export default eslintConfig
