/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  testEnvironment: 'node',
  setupFiles: ['./jest-setup.js'],
  moduleNameMapper: {
    tikka$: '<rootDir>/packages/./tikka/src',
    'tikka-compile$': '<rootDir>/packages/./compile/src',
    'tikka-shared$': '<rootDir>/packages/./shared/src',
    'tikka-transform$': '<rootDir>/packages/./transform/src',
    'tikka-transform-swc$': '<rootDir>/packages/./transform-swc/src',
    'tikka-transform-less$': '<rootDir>/packages/./transform-less/src',
    'tikka-transform-sass$': '<rootDir>/packages/./transform-sass/src',
    'tikka-with-postcss$': '<rootDir>/packages/./with-postcss/src',
    'tikka-declaration$': '<rootDir>/packages/./declaration/src',
    'tikka-types/(.*)$': '<rootDir>/packages/./types/$1',
  },
}
