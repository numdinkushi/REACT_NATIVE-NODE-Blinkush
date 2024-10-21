module.exports = {
  parser: 'babel-eslint',
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  plugins: ['react'],
  settings: {
      react: {
          version: 'detect',
      },
  },
  env: {
      browser: true,
      es6: true,
      node: true,
  },
  parserOptions: {
      ecmaFeatures: {
          jsx: true,
      },
      ecmaVersion: 2020,
      sourceType: 'module',
  },
  rules: {
      // Add your custom rules here
  },
};

// module.exports = {
//   root: true,
//   extends: '@react-native',
// };
