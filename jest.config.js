module.exports = {
  globals: {
    __TS_CONFIG__: {
      module: 'commonjs',
      jsx: 'react',
      inlineSourceMap: true,
      allowSyntheticDefaultImports: true,
    },
  },
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '.(ts|tsx)': '<rootDir>/node_modules/ts-jest/dist/preprocessor.js',
  },
  cacheDirectory: './jest-cache',
  setupTestFrameworkScriptFile: '<rootDir>/beforeTest.js',
  testMatch: [
    '**/typescript/__tests__/*.test.ts',
    '**/flow/__tests__/*.test.js',
  ],
  testPathIgnorePatterns: [
    '/build/',
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'json',
  ],
  coverageReporters: [
    'html',
    'json',
    'text',
  ],
  coverageDirectory: 'build/coverage',
  collectCoverageFrom: [
    'src/jest-examples/typescript/**/*.ts',
    'src/jest-examples/flow/**/*.js',
    '!src/**/*.d.ts',
    '!src/**/*{view,View}.{js,ts}',
  ],
  coverageThreshold: {
    global: {
      statements: 95,
    },
  },
  mapCoverage: true,
  verbose: false,
};
