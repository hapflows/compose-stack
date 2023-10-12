/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/*.test.(ts|tsx)'],
  testPathIgnorePatterns: ['node_modules/'],
  testEnvironment: 'jsdom',
  moduleDirectories: ['src', 'node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['./src/setupTests.ts'],
  coverageReporters: ['text', 'html', 'lcov'],
  // coverageThreshold: {
  //     global: {
  //         branches: 80,
  //         functions: 90,
  //         lines: 90,
  //         statements: 80,
  //     },
  // },
  collectCoverageFrom: [
    'src/**/*.{js,ts,tsx}',
    '!dist/*',
    '!src/index.ts',
    '!src/**/*.types.ts',
    '!src/**/*.types.d.ts',
    '!src/utils/propTypes.js',
    '!src/utils/sharedTypes.ts',
    '!src/**/forms/index.ts',
    '!src/**/forms/constants.ts',
  ],
};
