module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-native/all',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', 'react-native', '@typescript-eslint', 'prettier'],
  env: {
    es6: true,
    node: true,
    browser: true,
    jest: true, // Add Jest environment if using Jest for testing
  },
  rules: {
    'unused-imports/no-unused-vars': 'error',
    'max-lines': ['warn', { max: 500, skipBlankLines: true, skipComments: true }], // Maximum lines in a file
    'prettier/prettier': 'error', // Ensures Prettier formatting as an error
    'no-console': 'warn', // Warns about console logs
    'no-debugger': 'warn', // Warns about debugger statements
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Allows unused variables if prefixed with _
    'react/prop-types': 'off', // Off if using TypeScript (TypeScript handles types)
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // TypeScript-specific rule
    'react-native/no-inline-styles': 'warn', // Warns about inline styles in React Native
    'react-native/split-platform-components': 'warn', // Warns about platform-specific imports in React Native
    'react/react-in-jsx-scope': 'off', // React 17+ no longer requires React in scope
    'react/jsx-uses-react': 'off', // React 17+ no longer requires this rule
    'react/jsx-uses-vars': 'warn', // Ensures JSX variables are used
    'no-empty-function': 'warn', // Warns about empty functions
    eqeqeq: ['error', 'smart'], // Enforce strict equality (except for type coercion when reasonable)
    'consistent-return': 'warn', // Ensures functions have consistent return values
    'array-callback-return': 'warn', // Ensures array functions return a value
    'no-magic-numbers': ['warn', { ignoreArrayIndexes: true, ignore: [-1, 0, 1] }], // Avoid magic numbers like 0, -1, 1 in code
    'max-len': ['warn', { code: 100, ignoreComments: true, ignoreUrls: true }], // Maximum line length of 100 characters
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Disable the rule requiring return types for functions
  },
  settings: {
    react: {
      version: 'detect', // Automatically detect React version
    },
  },
};
