module.exports = {
  preset: 'jest-expo',
  watchman: false,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/e2e/playwright/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
