module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['airbnb-typescript/base', 'prettier'],
  ignorePatterns: ['.eslintrc.js'],
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    project: ['./tsconfig.json', './packages/*/tsconfig.json'],
  },
  rules: {
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-param-reassign': 'off',
    'no-await-in-loop': 'off',
    '@typescript-eslint/no-shadow': 'off',
  },
}
