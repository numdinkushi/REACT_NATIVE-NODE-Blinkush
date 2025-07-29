import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import Navigation from '@navigation/Navigation';
import { initializeConfig } from 'service/config';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '@utils/ThemeContext';

const App = () => {
  useEffect(() => {
    // Initialize config URLs at the start of the app
    const initialize = async () => {
      await initializeConfig();
      // Now your URLs are set up and Axios instance is ready to use
    };

    initialize();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <Navigation />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;