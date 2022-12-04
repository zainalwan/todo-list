/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  maxWorkers: 1,
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    './src/**/*.ts',
    '!./src/index.ts',
    '!./src/settings.ts',
    '!./src/migrations/*.ts',
  ]
};
