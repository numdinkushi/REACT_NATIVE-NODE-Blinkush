module.exports = {
    assets: ['./src/assets/fonts/'], // Global assets for the project
    project: {
      ios: {},
      android: {},
    },
    dependencies: {
      'react-native-vector-icons': {
        platforms: {
          ios: null, // Disabling iOS platform for vector icons
        },
      },
    },
    // This is global configuration, so ensure no conflicts
    getTransformModulePath() {
      return require.resolve('react-native-typescript-transformer');
    },
    getSourceExts() {
      return ['ts', 'tsx'];
    },
  };
  
