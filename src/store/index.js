import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useStore = create((set, get) => ({
  // ─── Auth ────────────────────────────────────────────
  user: null,
  accessToken: null,
  refreshToken: null,

  setAuth: (user, accessToken, refreshToken) => {
    set({ user, accessToken, refreshToken });
    AsyncStorage.setItem('accessToken', accessToken);
    AsyncStorage.setItem('refreshToken', refreshToken);
    AsyncStorage.setItem('user', JSON.stringify(user));
  },

  logout: () => {
    set({ user: null, accessToken: null, refreshToken: null, themeKey: 'violet' });
    AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user', 'themeKey']);
  },

  updateToken: (accessToken) => {
    set({ accessToken });
    AsyncStorage.setItem('accessToken', accessToken);
  },

  updateUser: (user) => {
    set({ user });
    AsyncStorage.setItem('user', JSON.stringify(user));
  },

  loadAuth: async () => {
    try {
      const [token, refresh, userStr] = await AsyncStorage.multiGet([
        'accessToken', 'refreshToken', 'user',
      ]);
      if (token[1] && userStr[1]) {
        set({
          accessToken: token[1],
          refreshToken: refresh[1],
          user: JSON.parse(userStr[1]),
        });
        return true;
      }
    } catch { }
    return false;
  },

  // ─── Theme ───────────────────────────────────────────
  isDark: false,
  themeKey: 'violet',

  toggleTheme: async () => {
    const next = !get().isDark;
    set({ isDark: next });
    AsyncStorage.setItem('theme', next ? 'dark' : 'light');
  },

  setThemeKey: async (key) => {
    set({ themeKey: key });
    AsyncStorage.setItem('themeKey', key);
  },

  loadTheme: async () => {
    const [themeMode, themeKey] = await Promise.all([
      AsyncStorage.getItem('theme'),
      AsyncStorage.getItem('themeKey'),
    ]);
    const updates = {};
    if (themeMode) updates.isDark = themeMode === 'dark';
    if (themeKey) updates.themeKey = themeKey;
    if (Object.keys(updates).length) set(updates);
  },
}));