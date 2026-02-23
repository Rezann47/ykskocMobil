import { Platform } from 'react-native';

const font = Platform.OS === 'ios' ? 'System' : 'Roboto';

const fonts = {
  regular: { fontFamily: font, fontWeight: '400' },
  medium: { fontFamily: font, fontWeight: '500' },
  light: { fontFamily: font, fontWeight: '300' },
  thin: { fontFamily: font, fontWeight: '100' },
  bold: { fontFamily: font, fontWeight: '700' },
  heavy: { fontFamily: font, fontWeight: '800' },
};

export const THEMES = {

  // ── Mor (varsayılan) ─────────────────────────────────────
  violet: {
    label: 'Mor',
    emoji: '💜',
    light: {
      dark: false, fonts,
      colors: {
        primary: '#6C63FF',
        primaryLight: '#EEF0FF',
        secondary: '#FF6584',
        background: '#F8F9FE',
        surface: '#FFFFFF',
        card: '#FFFFFF',
        text: '#1A1A2E',
        textSecondary: '#6B7280',
        textMuted: '#9CA3AF',
        border: '#E5E7EB',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        tyt: '#6C63FF',
        ayt: '#FF6584',
      },
    },
    dark: {
      dark: true, fonts,
      colors: {
        primary: '#7C73FF',
        primaryLight: '#1E1B4B',
        secondary: '#FF6584',
        background: '#0F0F1A',
        surface: '#1A1A2E',
        card: '#1E1E35',
        text: '#F1F1F7',
        textSecondary: '#9CA3AF',
        textMuted: '#6B7280',
        border: '#2D2D44',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        tyt: '#7C73FF',
        ayt: '#FF6584',
      },
    },
  },

  // ── Siyah & Beyaz ────────────────────────────────────────
  mono: {
    label: 'Siyah & Beyaz',
    emoji: '🖤',
    light: {
      dark: false, fonts,
      colors: {
        primary: '#0F172A',
        primaryLight: '#F1F5F9',
        secondary: '#475569',
        background: '#FFFFFF',
        surface: '#F8FAFC',
        card: '#FFFFFF',
        text: '#0F172A',
        textSecondary: '#334155',
        textMuted: '#94A3B8',
        border: '#E2E8F0',
        success: '#059669',
        warning: '#EA580C',
        error: '#BE123C',
        tyt: '#0F172A',
        ayt: '#475569',
      },
    },
    dark: {
      dark: true, fonts,
      colors: {
        primary: '#F8FAFC',
        primaryLight: '#1E293B',
        secondary: '#94A3B8',
        background: '#020617',
        surface: '#0F172A',
        card: '#1E293B',
        text: '#F1F5F9',
        textSecondary: '#CBD5E1',
        textMuted: '#475569',
        border: '#334155',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#F43F5E',
        tyt: '#F8FAFC',
        ayt: '#94A3B8',
      },
    },
  },

  // ── Çelik ────────────────────────────────────────────────
  steel: {
    label: 'Çelik',
    emoji: '🩶',
    light: {
      dark: false, fonts,
      colors: {
        primary: '#334155',
        primaryLight: '#F1F5F9',
        secondary: '#64748B',
        background: '#FFFFFF',
        surface: '#F8FAFC',
        card: '#FFFFFF',
        text: '#0F172A',
        textSecondary: '#475569',
        textMuted: '#94A3B8',
        border: '#E2E8F0',
        success: '#059669',
        warning: '#D97706',
        error: '#E11D48',
        tyt: '#334155',
        ayt: '#64748B',
      },
    },
    dark: {
      dark: true, fonts,
      colors: {
        primary: '#CBD5E1',
        primaryLight: '#1E293B',
        secondary: '#94A3B8',
        background: '#020617',
        surface: '#0F172A',
        card: '#1E293B',
        text: '#F1F5F9',
        textSecondary: '#CBD5E1',
        textMuted: '#475569',
        border: '#334155',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#FB7185',
        tyt: '#CBD5E1',
        ayt: '#94A3B8',
      },
    },
  },

  // ── Okyanus ──────────────────────────────────────────────
  ocean: {
    label: 'Okyanus',
    emoji: '🌊',
    light: {
      dark: false, fonts,
      colors: {
        primary: '#0EA5E9',
        primaryLight: '#E0F2FE',
        secondary: '#06B6D4',
        background: '#F0F9FF',
        surface: '#FFFFFF',
        card: '#FFFFFF',
        text: '#0C4A6E',
        textSecondary: '#0369A1',
        textMuted: '#7DD3FC',
        border: '#BAE6FD',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        tyt: '#0EA5E9',
        ayt: '#06B6D4',
      },
    },
    dark: {
      dark: true, fonts,
      colors: {
        primary: '#38BDF8',
        primaryLight: '#0C4A6E',
        secondary: '#22D3EE',
        background: '#020617',
        surface: '#0C1B2E',
        card: '#0F2942',
        text: '#E0F2FE',
        textSecondary: '#7DD3FC',
        textMuted: '#0369A1',
        border: '#1E3A5F',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#F87171',
        tyt: '#38BDF8',
        ayt: '#22D3EE',
      },
    },
  },

  // ── Orman ────────────────────────────────────────────────
  forest: {
    label: 'Orman',
    emoji: '🌿',
    light: {
      dark: false, fonts,
      colors: {
        primary: '#16A34A',
        primaryLight: '#DCFCE7',
        secondary: '#65A30D',
        background: '#F0FDF4',
        surface: '#FFFFFF',
        card: '#FFFFFF',
        text: '#14532D',
        textSecondary: '#166534',
        textMuted: '#86EFAC',
        border: '#BBF7D0',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        tyt: '#16A34A',
        ayt: '#65A30D',
      },
    },
    dark: {
      dark: true, fonts,
      colors: {
        primary: '#4ADE80',
        primaryLight: '#14532D',
        secondary: '#A3E635',
        background: '#052E16',
        surface: '#0A3D20',
        card: '#0F4D28',
        text: '#DCFCE7',
        textSecondary: '#86EFAC',
        textMuted: '#166534',
        border: '#166534',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#F87171',
        tyt: '#4ADE80',
        ayt: '#A3E635',
      },
    },
  },

  // ── Sakura 🌸 ─────────────────────────────────────────────
  // Japon kiraz çiçeği — soft pembe & beyaz
  sakura: {
    label: 'Sakura',
    emoji: '🌸',
    light: {
      dark: false, fonts,
      colors: {
        primary: '#F472B6',
        primaryLight: '#FDF2F8',
        secondary: '#FB7185',
        background: '#FFF5F9',
        surface: '#FFFFFF',
        card: '#FFFFFF',
        text: '#4A1942',
        textSecondary: '#9D4E7A',
        textMuted: '#F9A8D4',
        border: '#FBCFE8',
        success: '#34D399',
        warning: '#FBBF24',
        error: '#F43F5E',
        tyt: '#F472B6',
        ayt: '#FB7185',
      },
    },
    dark: {
      dark: true, fonts,
      colors: {
        primary: '#F9A8D4',
        primaryLight: '#4A1942',
        secondary: '#FDA4AF',
        background: '#1A0A14',
        surface: '#2D1220',
        card: '#3D1A2E',
        text: '#FDF2F8',
        textSecondary: '#F9A8D4',
        textMuted: '#9D4E7A',
        border: '#5C2040',
        success: '#34D399',
        warning: '#FBBF24',
        error: '#FB7185',
        tyt: '#F9A8D4',
        ayt: '#FDA4AF',
      },
    },
  },

  // ── Kedi Patisi 🐾 ────────────────────────────────────────
  // Tatlı, sıcak ve yumuşak — sanki bir kedi temi
  paws: {
    label: 'Kedi Patisi',
    emoji: '🐾',
    light: {
      dark: false, fonts,
      colors: {
        primary: '#D97706',
        primaryLight: '#FEF3C7',
        secondary: '#92400E',
        background: '#FFFBEB',
        surface: '#FFFFFF',
        card: '#FFFFFF',
        text: '#451A03',
        textSecondary: '#78350F',
        textMuted: '#FCD34D',
        border: '#FDE68A',
        success: '#059669',
        warning: '#D97706',
        error: '#DC2626',
        tyt: '#D97706',
        ayt: '#92400E',
      },
    },
    dark: {
      dark: true, fonts,
      colors: {
        primary: '#FCD34D',
        primaryLight: '#451A03',
        secondary: '#FDE68A',
        background: '#1C1007',
        surface: '#2D1A0A',
        card: '#3D2410',
        text: '#FEF3C7',
        textSecondary: '#FCD34D',
        textMuted: '#92400E',
        border: '#5C3A18',
        success: '#34D399',
        warning: '#FCD34D',
        error: '#F87171',
        tyt: '#FCD34D',
        ayt: '#FDE68A',
      },
    },
  },

  // ── Lavanta ──────────────────────────────────────────────
  // Sakinleştirici, romantik, narin
  lavender: {
    label: 'Lavanta',
    emoji: '🪻',
    light: {
      dark: false, fonts,
      colors: {
        primary: '#A855F7',
        primaryLight: '#F5F3FF',
        secondary: '#C084FC',
        background: '#FAF5FF',
        surface: '#FFFFFF',
        card: '#FFFFFF',
        text: '#3B0764',
        textSecondary: '#7E22CE',
        textMuted: '#D8B4FE',
        border: '#E9D5FF',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        tyt: '#A855F7',
        ayt: '#C084FC',
      },
    },
    dark: {
      dark: true, fonts,
      colors: {
        primary: '#D8B4FE',
        primaryLight: '#3B0764',
        secondary: '#E879F9',
        background: '#120720',
        surface: '#1E0D35',
        card: '#2A1245',
        text: '#FAF5FF',
        textSecondary: '#D8B4FE',
        textMuted: '#7E22CE',
        border: '#4C1D7A',
        success: '#34D399',
        warning: '#FBBF24',
        error: '#FB7185',
        tyt: '#D8B4FE',
        ayt: '#E879F9',
      },
    },
  },

  // ── Şeftali ──────────────────────────────────────────────
  // Tatlı, sıcak, huzurlu — Instagram aesthetic
  peach: {
    label: 'Şeftali',
    emoji: '🍑',
    light: {
      dark: false, fonts,
      colors: {
        primary: '#F97316',
        primaryLight: '#FFF7ED',
        secondary: '#FB923C',
        background: '#FFFAF5',
        surface: '#FFFFFF',
        card: '#FFFFFF',
        text: '#431407',
        textSecondary: '#9A3412',
        textMuted: '#FDBA74',
        border: '#FED7AA',
        success: '#10B981',
        warning: '#EAB308',
        error: '#EF4444',
        tyt: '#F97316',
        ayt: '#FB923C',
      },
    },
    dark: {
      dark: true, fonts,
      colors: {
        primary: '#FDBA74',
        primaryLight: '#431407',
        secondary: '#FED7AA',
        background: '#1A0D05',
        surface: '#2C1508',
        card: '#3D1E0C',
        text: '#FFF7ED',
        textSecondary: '#FDBA74',
        textMuted: '#9A3412',
        border: '#5C2D12',
        success: '#34D399',
        warning: '#FCD34D',
        error: '#FB7185',
        tyt: '#FDBA74',
        ayt: '#FED7AA',
      },
    },
  },

  // ── Denizaltı 🐬 ──────────────────────────────────────────
  // Yunus & mercan — tatlı hayvan sevgisi teması
  dolphin: {
    label: 'Yunus',
    emoji: '🐬',
    light: {
      dark: false, fonts,
      colors: {
        primary: '#06B6D4',
        primaryLight: '#ECFEFF',
        secondary: '#F472B6',
        background: '#F0FDFF',
        surface: '#FFFFFF',
        card: '#FFFFFF',
        text: '#083344',
        textSecondary: '#0E7490',
        textMuted: '#67E8F9',
        border: '#A5F3FC',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#F43F5E',
        tyt: '#06B6D4',
        ayt: '#F472B6',
      },
    },
    dark: {
      dark: true, fonts,
      colors: {
        primary: '#67E8F9',
        primaryLight: '#083344',
        secondary: '#F9A8D4',
        background: '#020D12',
        surface: '#041D26',
        card: '#062D3D',
        text: '#ECFEFF',
        textSecondary: '#67E8F9',
        textMuted: '#0E7490',
        border: '#0E4F65',
        success: '#34D399',
        warning: '#FBBF24',
        error: '#FB7185',
        tyt: '#67E8F9',
        ayt: '#F9A8D4',
      },
    },
  },

};

// Kolay erişim — eski kod bozulmasın
export const lightTheme = THEMES.violet.light;
export const darkTheme = THEMES.violet.dark;

export function getThemeColors(themeKey, isDark) {
  const theme = THEMES[themeKey] || THEMES.violet;
  return isDark ? theme.dark.colors : theme.light.colors;
}

export function getThemeObject(themeKey, isDark) {
  const theme = THEMES[themeKey] || THEMES.violet;
  return isDark ? theme.dark : theme.light;
}