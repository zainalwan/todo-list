/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  maxWorkers: 1,
  verbose: true,
  collectCoverage: false,
  collectCoverageFrom: [
    './src/**/*.ts',
    '!./src/migrations/*.ts',
  ]
};
