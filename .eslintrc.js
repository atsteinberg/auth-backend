module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'unused-imports',],
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'import/prefer-default-export': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      // Allow camelCase variables (23.2), PascalCase variables (23.8), and UPPER_CASE variables (23.10)
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
      },
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'require',
        modifiers: ['unused']
      },
      // Allow camelCase functions (23.2), and PascalCase functions (23.8)
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase'],
      },
      // Airbnb recommends PascalCase for classes (23.3), and although Airbnb does not make TypeScript recommendations, we are assuming this rule would similarly apply to anything "type like", including interfaces, type aliases, and enums
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
    ],
    'max-len': [
      2,
      140,
    ],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
      },
    ],
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
    'no-restricted-exports': [
      'off',
    ],
    indent: 'off',
    '@typescript-eslint/indent': [
      'error',
      2,
      {
        SwitchCase: 1,
      },
    ],
    '@typescript-eslint/comma-dangle': [
      'error',
      'always-multiline',
    ],
    '@typescript-eslint/consistent-type-definitions': [
      'error',
      'type',
    ],
    '@typescript-eslint/member-delimiter-style': [
      'error',
    ],
    '@typescript-eslint/no-explicit-any': [
      'error',
      {
        ignoreRestArgs: true,
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        args: 'after-used',
        argsIgnorePattern: '^_',
        vars: 'all',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/semi': [
      'error',
    ],
    '@typescript-eslint/space-infix-ops': [
      'error',
      {
        int32Hint: false,
      },
    ],
    '@typescript-eslint/type-annotation-spacing': [
      'error',
      {
        after: true,
        before: true,
        overrides: {
          colon: {
            before: false,
          },
        },
      },
    ],
    // nestjs rules
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'class-methods-use-this': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['.'],
      },
    },
  },
};
