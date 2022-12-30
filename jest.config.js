/** @type {import('jest').Config} */
module.exports = {
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  testEnvironment: 'jsdom',
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^[@|./a-zA-Z0-9$_-]+\\.(svg|png|jpg|jpeg|gif|webp|ttf|otf)$':
      '<rootDir>/staticAssetsStub.js',
    '^@\\/(.*)': '<rootDir>/src/$1',
    '^pages\\/(.*)': '<rootDir>/src/pages/$1',
    '^router\\/(.*)': '<rootDir>/src/router/$1',
    '^assets\\/(.*)': '<rootDir>/src/assets/$1',
    '^dexie': '<rootDir>/node_modules/dexie/dist/dexie.js',
  },
  coverageDirectory: 'coverage',
  collectCoverage: true,
  coverageProvider: 'v8',
};
