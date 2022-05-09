module.exports = {
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    semi: ['off', 'always'],
    quotes: ['warn', 'single'],
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: 'next',
        varsIgnorePattern: 'ResponsefulError',
      },
    ],
  },
}
