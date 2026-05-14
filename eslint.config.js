// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    settings: {
      'import/resolver': {
        node: {
          extensions: [
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.ios.ts',
            '.ios.tsx',
            '.android.ts',
            '.android.tsx',
            '.native.ts',
            '.native.tsx',
            '.web.ts',
            '.web.tsx',
          ],
        },
      },
    },
    rules: {
      'import/no-unresolved': [
        'error',
        {
          ignore: ['^@/components/motion-view$'],
        },
      ],
    },
  },
]);
