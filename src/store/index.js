import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_THEME_KEY = 'violet';
const DEFAULT_IS_DARK = false;

export const useStore = create((set, get) => ({
  // ─── Auth ───────────────────────────────────────────
  user: null,         // user.avatar_id backend'den gelir
  accessToken: null,
  refreshToken: null,

  setAuth: (user, accessToken, refreshToken) => {
    set({ user, accessToken, refreshToken });
    AsyncStorage.setItem('accessToken', accessToken);
    AsyncStorage.setItem('refreshToken', refreshToken);
    AsyncStorage.setItem('user', JSON.stringify(user));

  },

  // Avatar backend'e kaydedilince local user objesini de güncelle
  updateUser: (updatedUser) => {
    set({ user: updatedUser });
    AsyncStorage.setItem('user', JSON.stringify(updatedUser));
  },

  logout: () => {
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isDark: DEFAULT_IS_DARK,
      themeKey: DEFAULT_THEME_KEY,
    });
    AsyncStorage.multiRemove([
      'accessToken', 'refreshToken', 'user',
      'isDark', 'themeKey',
    ]);
  },

  updateToken: (accessToken) => {
    set({ accessToken });
    AsyncStorage.setItem('accessToken', accessToken);
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

  // ─── Theme ──────────────────────────────────────────
  isDark: DEFAULT_IS_DARK,
  themeKey: DEFAULT_THEME_KEY,

  toggleTheme: async () => {
    const next = !get().isDark;
    set({ isDark: next });
    AsyncStorage.setItem('isDark', next ? 'dark' : 'light');
  },

  setThemeKey: async (key) => {
    set({ themeKey: key });
    AsyncStorage.setItem('themeKey', key);
  },

  loadTheme: async () => {
    try {
      const [dark, key] = await AsyncStorage.multiGet(['isDark', 'themeKey']);
      set({
        isDark: dark[1] === 'dark',
        themeKey: key[1] || DEFAULT_THEME_KEY,
      });
    } catch { }
  },
}));
