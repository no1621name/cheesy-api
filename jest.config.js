const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  collectCoverageFrom: ['src/**/*.{ts,}'],
  moduleNameMapper: {
    '@t/(.*)$': '<rootDir>/src/test/$1',
    '@/(.*)$': '<rootDir>/src/$1',
  },
  testTimeout: 10000,
};

module.exports = config;
