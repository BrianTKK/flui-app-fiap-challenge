// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    // `.expo` guarda tipos gerados pelo expo-router (nao versionados).
    ignores: ['dist/*', '.expo/*', 'node_modules/*'],
  },
]);
