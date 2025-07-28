module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: [
    '**/*.spec.ts'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/src/app/app.spec.ts',
    '/src/app/servicios/',
    '/src/app/paginas/',
    '/src/app/componentes/menu/'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.d.ts',
    '!src/main.ts'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['jest-preset-angular', {
      tsconfig: 'tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$'
    }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json']
};