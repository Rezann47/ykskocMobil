import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import mobileAds from 'react-native-google-mobile-ads';
import { initConnection, endConnection } from 'react-native-iap'; // ← YENİ
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
        initConnection().catch(e => console.log('IAP init:', e.message)), // ← YENİ
      ]);

      await NavigationBar.setVisibilityAsync('hidden');
      await NavigationBar.setBehaviorAsync('overlay-swipe');
      setReady(true);
      SplashScreen.hideAsync();
    }
    init();

    // Uygulama kapanınca bağlantıyı kes
    return () => { endConnection().catch(() => { }); };
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