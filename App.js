import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { LanguageProvider } from './src/contexts/LanguageContext';
import i18n from './src/i18n';
import { I18nextProvider } from 'react-i18next';

// Define the theme
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1976D2',
    accent: '#FFC107',
    background: '#f5f5f5',
    surface: '#FFFFFF',
    text: '#212121',
    error: '#B00020',
  },
};

const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </PaperProvider>
      </LanguageProvider>
    </I18nextProvider>
  );
};

export default App;
