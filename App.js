import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import mobileAds from 'react-native-google-mobile-ads';
import { useStore } from './src/store';
import RootNavigation from './src/navigation';
import * as NavigationBar from 'expo-navigation-bar';
SplashScreen.preventAutoHideAsync();

export default function App() {
  const { loadAuth, loadTheme, isDark } = useStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      await Promise.all([
        loadAuth(),
        loadTheme(),
        mobileAds().initialize(),
      ]);

      // Android navigation bar gizle
      await NavigationBar.setVisibilityAsync('hidden');
      await NavigationBar.setBehaviorAsync('overlay-swipe');
      // swipe yapınca geçici gözüksün

      setReady(true);
      SplashScreen.hideAsync();
    }
    init();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#6C63FF' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigation />
    </SafeAreaProvider>
  );
}
