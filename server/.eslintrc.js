// const devDependencies = Object.keys(require('./package.json').devDependencies) || {};

module.exports = {
  env: {
    node: true,
    es2020: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['prettier', 'promise', 'security', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:promise/recommended',
    'google',
    'plugin:security/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    'brace-style': ['error', '1tbs', {allowSingleLine: true}],
    curly: ['error', 'multi-or-nest', 'consistent'],
    eqeqeq: ['error', 'always'],
    'new-cap': ['off'],
    'no-debugger': ['warn'],
    'no-template-curly-in-string': ['error'],
    'prefer-template': ['warn'],
    'prettier/prettier': ['warn'],
    'require-jsdoc': ['off'],
    'vars-on-top': ['warn'],
    'no-invalid-this': ['off'],
    'no-unused-vars': ['off'],
    'security/detect-object-injection': ['off'],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {argsIgnorePattern: '^_*', ignoreRestSiblings: true},
    ],
  },
};
