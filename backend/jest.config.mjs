export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testTimeout: 20000,
  moduleFileExtensions: ['ts', 'js', 'json'],
  roots: ['<rootDir>/tests'],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
