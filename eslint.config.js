const js = require('@eslint/js');
const globals = require('globals');
const noUnsanitized = require('eslint-plugin-no-unsanitized');

module.exports = [
  {
    ignores: ['.history/', '**/.history/', 'node_modules/', 'temp-firefox-extension/', 'playwright-report/', 'test-results/', '**/web-ext-artifacts/']
  },
  js.configs.recommended,
  {
    files: ['chrome-extension/**/*.js', 'firefox-extension/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: { ...globals.browser, chrome: 'readonly', browser: 'readonly' }
    },
    plugins: { 'no-unsanitized': noUnsanitized },
    rules: {
      // Security constraints from AGENTS.md
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-unsanitized/method': 'error',
      'no-unsanitized/property': 'error',
      // Style-level findings are warnings, not blockers
      'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none' }],
      'no-empty': ['error', { allowEmptyCatch: true }]
    }
  },
  {
    files: ['tests/**/*.js', 'playwright.config.js', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { ...globals.node, ...globals.browser, ...globals.jest }
    },
    rules: { 'no-empty-pattern': 'off' }
  }
];
