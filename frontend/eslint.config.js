import js from '@eslint/js';
import globals from 'globals';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import eslintConfigPrettier from 'eslint-config-prettier';

// Configuración común para TypeScript
const typescriptConfig = {
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    parser: typescriptParser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      project: './tsconfig.json',
    },
  },
  plugins: {
    '@typescript-eslint': typescriptEslint,
  },
  rules: {
    ...typescriptEslint.configs.recommended.rules,
    ...(typescriptEslint.configs['strict-type-checked']?.rules || {}),
    ...(typescriptEslint.configs['stylistic-type-checked']?.rules || {}),
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-var-requires': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
  },
};

// Configuración de React
const reactConfig = {
  files: ['**/*.{jsx,tsx}'],
  ...reactRecommended,
  settings: {
    react: {
      version: 'detect',
    },
  },
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  plugins: {
    'react-hooks': reactHooks,
    'jsx-a11y': jsxA11y,
  },
  rules: {
    ...(reactHooks.configs.recommended?.rules || {}),
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'react/display-name': 'off',
    'react/no-unescaped-entities': 'warn',
  },
};

// Configuración de import/export
const importConfig = {
  plugins: {
    import: importPlugin,
  },
  settings: {
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    ...(importPlugin.configs?.recommended?.rules || {}),
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
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
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/no-unresolved': 'error',
    'import/no-extraneous-dependencies': 'error',
  },
};

// Configuración de accesibilidad
const a11yConfig = {
  files: ['**/*.{jsx,tsx}'],
  plugins: {
    'jsx-a11y': jsxA11y,
  },
  rules: {
    ...(jsxA11y.configs?.recommended?.rules || {}),
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': [
      'warn',
      {
        handlers: [
          'onClick',
          'onMouseDown',
          'onMouseUp',
          'onKeyPress',
          'onKeyDown',
          'onKeyUp',
        ],
      },
    ],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to'],
        aspects: ['noHref', 'invalidHref', 'preferButton'],
      },
    ],
  },
};

// Configuración base
const baseConfig = {
  ignores: [
    'dist/**',
    'node_modules/**',
    'build/**',
    'coverage/**',
    '**/*.config.js',
  ],
};

// Configuración de JavaScript
const javascriptConfig = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
      ...globals.browser,
      ...globals.es2021,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};

export default [
  baseConfig,
  javascriptConfig,
  typescriptConfig,
  reactConfig,
  importConfig,
  a11yConfig,
  eslintConfigPrettier, // Debe ir al final para sobrescribir configuraciones
];
