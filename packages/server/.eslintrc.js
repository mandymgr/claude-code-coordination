module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    // Allow unused variables that start with underscore
    '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    // Allow console.log in server code
    'no-console': 'off',
    // Allow any type for rapid development
    '@typescript-eslint/no-explicit-any': 'warn',
    // Allow non-null assertion operator
    '@typescript-eslint/no-non-null-assertion': 'warn',
    // Allow empty functions
    '@typescript-eslint/no-empty-function': 'warn',
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '*.js',
  ],
};