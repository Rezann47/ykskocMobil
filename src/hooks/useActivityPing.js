import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { userApi } from '../services/api';
import { useStore } from '../store';

const PING_INTERVAL_MS = 2 * 60 * 1000; // 2 dakika

/**
 * Uygulama açıkken her 2 dakikada bir backend'e ping atar.
 * Uygulama background'a geçince durur, foreground'a dönünce devam eder.
 *
 * App.js veya RootNavigation içinde bir kez kullan:
 * useActivityPing();
 */
export default function useActivityPing() {
  const { user, accessToken } = useStore();
  const intervalRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);


  const ping = async () => {
    if (!accessToken) return;
    try {
      console.log("aktif olma")
      await userApi.ping();
    } catch {
      // sessizce geç — token expire olmuşsa interceptor halleder
    }
  };

  const startPing = () => {
    ping(); // hemen bir ping at
    intervalRef.current = setInterval(ping, PING_INTERVAL_MS);
  };

  const stopPing = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'student') return;

    // Başlat
    startPing();

    // AppState değişimlerini dinle
    const sub = AppState.addEventListener('change', (nextState) => {
      const prev = appStateRef.current;
      appStateRef.current = nextState;

      if (nextState === 'active' && prev !== 'active') {
        startPing();
      } else if (nextState !== 'active') {
        stopPing();
      }
    });

    return () => {
      stopPing();
      sub.remove();
    };
  }, [user, accessToken]);
}
