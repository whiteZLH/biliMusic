require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@electron-toolkit',
    '@vue/eslint-config-prettier'
  ],
  rules: {
    'vue/require-default-prop': 'off',
    'vue/multi-word-component-names': 'off',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    // 将未使用变量设置为警告
    'no-unused-vars': 'warn',
    'vue/no-unused-vars': 'warn'
  }
}
