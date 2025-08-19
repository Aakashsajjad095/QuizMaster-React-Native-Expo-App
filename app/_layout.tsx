import React from 'react';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';

import { store } from '../src/redux/store';
import { ThemeProvider } from '../src/contexts/ThemeContext';




export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
          }}
        >
          <Stack.Screen name="SplashScreen" options={{ gestureEnabled: false }} />
          <Stack.Screen name="LoginScreen" options={{ gestureEnabled: false }} />
          <Stack.Screen name="RegisterScreen" />
          <Stack.Screen name="Home" />
          <Stack.Screen name="QuizList" />
          <Stack.Screen name="QuizGame" />
          <Stack.Screen name="QuizResults" />
          <Stack.Screen name="Leaderboard" />
          <Stack.Screen name="Profile" />
          <Stack.Screen name="Achievements" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </Provider>
  );
}
