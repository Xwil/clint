
// @ts-check
const {defineConfig} =  require('eslint-define-config')

module.exports = defineConfig({
  root: true,
  extends: ['alloy', 'alloy/typescript'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
  overrides: [
    {
      files: '*.json',
      rules: {
        '@typescript-eslint/no-unused-expressions': 'off',
      },
    },
  ],
});
