/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  extends: [
    'plugin:vue/vue3-recommended',
    '@antfu',
  ],
  parserOptions: {
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
  },
}
