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
  // ─── ÜCRETSİZ / KLASİK ───
  violet: {
    category: 'Ücretsiz', label: 'Mor', emoji: '💜', premium: false,
    light: { dark: false, fonts, colors: { primary: '#6C63FF', primaryLight: '#EEF0FF', secondary: '#FF6584', background: '#F8F9FE', surface: '#FFFFFF', card: '#FFFFFF', text: '#1A1A2E', textSecondary: '#6B7280', textMuted: '#9CA3AF', border: '#E5E7EB', success: '#10B981', warning: '#F59E0B', error: '#EF4444', tyt: '#6C63FF', ayt: '#FF6584' } },
    dark: { dark: true, fonts, colors: { primary: '#7C73FF', primaryLight: '#1E1B4B', secondary: '#FF6584', background: '#0F0F1A', surface: '#1A1A2E', card: '#1E1E35', text: '#F1F1F7', textSecondary: '#9CA3AF', textMuted: '#6B7280', border: '#2D2D44', success: '#10B981', warning: '#F59E0B', error: '#EF4444', tyt: '#7C73FF', ayt: '#FF6584' } },
  },
  midnight: {
    category: 'Ücretsiz', label: 'Gece Mavisi', emoji: '🌙', premium: false,
    light: { dark: false, fonts, colors: { primary: '#2563EB', primaryLight: '#DBEAFE', secondary: '#7C3AED', background: '#F0F4FF', surface: '#FFFFFF', card: '#FFFFFF', text: '#0F172A', textSecondary: '#1E3A8A', textMuted: '#93C5FD', border: '#BFDBFE', success: '#059669', warning: '#D97706', error: '#DC2626', tyt: '#2563EB', ayt: '#7C3AED' } },
    dark: { dark: true, fonts, colors: { primary: '#60A5FA', primaryLight: '#1E3A8A', secondary: '#A78BFA', background: '#020617', surface: '#0D1B3E', card: '#162044', text: '#EFF6FF', textSecondary: '#93C5FD', textMuted: '#1E40AF', border: '#1E3A8A', success: '#10B981', warning: '#FBBF24', error: '#F87171', tyt: '#60A5FA', ayt: '#A78BFA' } },
  },
  forest: {
    category: 'Ücretsiz', label: 'Orman', emoji: '🌿', premium: false,
    light: { dark: false, fonts, colors: { primary: '#16A34A', primaryLight: '#DCFCE7', secondary: '#65A30D', background: '#F0FDF4', surface: '#FFFFFF', card: '#FFFFFF', text: '#14532D', textSecondary: '#166534', textMuted: '#86EFAC', border: '#BBF7D0', success: '#10B981', warning: '#F59E0B', error: '#EF4444', tyt: '#16A34A', ayt: '#65A30D' } },
    dark: { dark: true, fonts, colors: { primary: '#4ADE80', primaryLight: '#14532D', secondary: '#A3E635', background: '#052E16', surface: '#0A3D20', card: '#0F4D28', text: '#DCFCE7', textSecondary: '#86EFAC', textMuted: '#166534', border: '#166534', success: '#10B981', warning: '#F59E0B', error: '#F87171', tyt: '#4ADE80', ayt: '#A3E635' } },
  },
  ocean: {
    category: 'Ücretsiz', label: 'Okyanus', emoji: '🌊', premium: false,
    light: { dark: false, fonts, colors: { primary: '#0EA5E9', primaryLight: '#E0F2FE', secondary: '#06B6D4', background: '#F0F9FF', surface: '#FFFFFF', card: '#FFFFFF', text: '#0C4A6E', textSecondary: '#0369A1', textMuted: '#7DD3FC', border: '#BAE6FD', success: '#10B981', warning: '#F59E0B', error: '#EF4444', tyt: '#0EA5E9', ayt: '#06B6D4' } },
    dark: { dark: true, fonts, colors: { primary: '#38BDF8', primaryLight: '#0C4A6E', secondary: '#22D3EE', background: '#020617', surface: '#0C1B2E', card: '#0F2942', text: '#E0F2FE', textSecondary: '#7DD3FC', textMuted: '#0369A1', border: '#1E3A5F', success: '#10B981', warning: '#F59E0B', error: '#F87171', tyt: '#38BDF8', ayt: '#22D3EE' } },
  },
  /*
  mono: {
    category: 'Ücretsiz', label: 'Siyah & Beyaz', emoji: '🖤', premium: false,
    light: { dark: false, fonts, colors: { primary: '#0F172A', primaryLight: '#F1F5F9', secondary: '#475569', background: '#FFFFFF', surface: '#F8FAFC', card: '#FFFFFF', text: '#0F172A', textSecondary: '#334155', textMuted: '#94A3B8', border: '#E2E8F0', success: '#059669', warning: '#EA580C', error: '#BE123C', tyt: '#0F172A', ayt: '#475569' } },
    dark: { dark: true, fonts, colors: { primary: '#F8FAFC', primaryLight: '#1E293B', secondary: '#94A3B8', background: '#020617', surface: '#0F172A', card: '#1E293B', text: '#F1F5F9', textSecondary: '#CBD5E1', textMuted: '#475569', border: '#334155', success: '#10B981', warning: '#F59E0B', error: '#F43F5E', tyt: '#F8FAFC', ayt: '#94A3B8' } },
  },
*/
  // ─── TARAFTAR (PREMİUM) ───
  // ─── TARAFTAR (PREMİUM) ───
  lions: {
    category: 'Taraftar', label: 'Aslan Ruhu', emoji: '🦁', premium: true,
    light: { dark: false, fonts, colors: { primary: '#A90432', primaryLight: '#FDE2E2', secondary: '#FDB913', background: '#FFF9EB', surface: '#FFFFFF', card: '#FFF1D6', text: '#450A0A', textSecondary: '#A90432', textMuted: '#D1A6A6', border: '#FEE2E2', success: '#10B981', warning: '#FDB913', error: '#EF4444', tyt: '#A90432', ayt: '#FDB913' } },
    dark: { dark: true, fonts, colors: { primary: '#FDB913', primaryLight: '#450A0A', secondary: '#A90432', background: '#1A0505', surface: '#2D0A0A', card: '#3D0E0E', text: '#FFFAED', textSecondary: '#FDB913', textMuted: '#A90432', border: '#450A0A', success: '#10B981', warning: '#FDB913', error: '#F87171', tyt: '#FDB913', ayt: '#A90432' } },
  },
  canary: {
    category: 'Taraftar', label: 'Kanarya Gücü', emoji: '🐦‍🔥', premium: true,
    light: { dark: false, fonts, colors: { primary: '#002366', primaryLight: '#E0E7FF', secondary: '#FEDD00', background: '#FDFFEA', surface: '#FFFFFF', card: '#F9FBCC', text: '#001A4D', textSecondary: '#002366', textMuted: '#94A3B8', border: '#E2E8F0', success: '#059669', warning: '#FEDD00', error: '#DC2626', tyt: '#002366', ayt: '#FEDD00' } },
    dark: { dark: true, fonts, colors: { primary: '#FEDD00', primaryLight: '#001A4D', secondary: '#002366', background: '#00081A', surface: '#001233', card: '#001A4D', text: '#F8FAFC', textSecondary: '#FEDD00', textMuted: '#64748B', border: '#002366', success: '#10B981', warning: '#FEDD00', error: '#F87171', tyt: '#FEDD00', ayt: '#002366' } },
  },
  eagle: {
    category: 'Taraftar', label: 'Kara Kartal', emoji: '🦅', premium: true,
    light: { dark: false, fonts, colors: { primary: '#000000', primaryLight: '#F3F4F6', secondary: '#7F7F7F', background: '#FFFFFF', surface: '#F9FAFB', card: '#F3F4F6', text: '#000000', textSecondary: '#4B5563', textMuted: '#9CA3AF', border: '#E5E7EB', success: '#10B981', warning: '#6B7280', error: '#EF4444', tyt: '#000000', ayt: '#4B5563' } },
    dark: { dark: true, fonts, colors: { primary: '#FFFFFF', primaryLight: '#171717', secondary: '#A3A3A3', background: '#000000', surface: '#121212', card: '#1C1C1C', text: '#FFFFFF', textSecondary: '#D4D4D4', textMuted: '#525252', border: '#262626', success: '#10B981', warning: '#F59E0B', error: '#F87171', tyt: '#FFFFFF', ayt: '#A3A3A3' } },
  },

  // ─── PREMİUM RENKLER ───
  sakura: {
    category: 'Premium Renkler', label: 'Sakura', emoji: '🌸', premium: true,
    light: { dark: false, fonts, colors: { primary: '#F472B6', primaryLight: '#FDF2F8', secondary: '#FB7185', background: '#FFF5F9', surface: '#FFFFFF', card: '#FFFFFF', text: '#4A1942', textSecondary: '#9D4E7A', textMuted: '#F9A8D4', border: '#FBCFE8', success: '#34D399', warning: '#FBBF24', error: '#F43F5E', tyt: '#F472B6', ayt: '#FB7185' } },
    dark: { dark: true, fonts, colors: { primary: '#F9A8D4', primaryLight: '#4A1942', secondary: '#FDA4AF', background: '#1A0A14', surface: '#2D1220', card: '#3D1A2E', text: '#FDF2F8', textSecondary: '#F9A8D4', textMuted: '#9D4E7A', border: '#5C2040', success: '#34D399', warning: '#FBBF24', error: '#FB7185', tyt: '#F9A8D4', ayt: '#FDA4AF' } },
  },
  lavender: {
    category: 'Premium Renkler', label: 'Lavanta', emoji: '🪻', premium: true,
    light: { dark: false, fonts, colors: { primary: '#A855F7', primaryLight: '#F5F3FF', secondary: '#C084FC', background: '#FAF5FF', surface: '#FFFFFF', card: '#FFFFFF', text: '#3B0764', textSecondary: '#7E22CE', textMuted: '#D8B4FE', border: '#E9D5FF', success: '#10B981', warning: '#F59E0B', error: '#EF4444', tyt: '#A855F7', ayt: '#C084FC' } },
    dark: { dark: true, fonts, colors: { primary: '#D8B4FE', primaryLight: '#3B0764', secondary: '#E879F9', background: '#120720', surface: '#1E0D35', card: '#2A1245', text: '#FAF5FF', textSecondary: '#D8B4FE', textMuted: '#7E22CE', border: '#4C1D7A', success: '#34D399', warning: '#FBBF24', error: '#FB7185', tyt: '#D8B4FE', ayt: '#E879F9' } },
  },
  peach: {
    category: 'Premium Renkler', label: 'Şeftali', emoji: '🍑', premium: true,
    light: { dark: false, fonts, colors: { primary: '#F97316', primaryLight: '#FFF7ED', secondary: '#FB923C', background: '#FFFAF5', surface: '#FFFFFF', card: '#FFFFFF', text: '#431407', textSecondary: '#9A3412', textMuted: '#FDBA74', border: '#FED7AA', success: '#10B981', warning: '#EAB308', error: '#EF4444', tyt: '#F97316', ayt: '#FB923C' } },
    dark: { dark: true, fonts, colors: { primary: '#FDBA74', primaryLight: '#431407', secondary: '#FED7AA', background: '#1A0D05', surface: '#2C1508', card: '#3D1E0C', text: '#FFF7ED', textSecondary: '#FDBA74', textMuted: '#9A3412', border: '#5C2D12', success: '#34D399', warning: '#FCD34D', error: '#FB7185', tyt: '#FDBA74', ayt: '#FED7AA' } },
  },
  emerald: {
    category: 'Premium Renkler', label: 'Zümrüt', emoji: '💎', premium: true,
    light: { dark: false, fonts, colors: { primary: '#059669', primaryLight: '#ECFDF5', secondary: '#10B981', background: '#F0FDF7', surface: '#FFFFFF', card: '#FFFFFF', text: '#064E3B', textSecondary: '#065F46', textMuted: '#6EE7B7', border: '#A7F3D0', success: '#10B981', warning: '#F59E0B', error: '#EF4444', tyt: '#059669', ayt: '#10B981' } },
    dark: { dark: true, fonts, colors: { primary: '#34D399', primaryLight: '#064E3B', secondary: '#6EE7B7', background: '#021510', surface: '#062520', card: '#0A3328', text: '#ECFDF5', textSecondary: '#6EE7B7', textMuted: '#065F46', border: '#065F46', success: '#10B981', warning: '#FBBF24', error: '#F87171', tyt: '#34D399', ayt: '#6EE7B7' } },
  },
  inferno: {
    category: 'Premium Renkler', label: 'Gece Ateşi', emoji: '🔥', premium: true,
    light: { dark: false, fonts, colors: { primary: '#EA580C', primaryLight: '#FFF4ED', secondary: '#DC2626', background: '#FFF7F0', surface: '#FFFFFF', card: '#FFFFFF', text: '#431407', textSecondary: '#7C2D12', textMuted: '#FDBA74', border: '#FED7AA', success: '#059669', warning: '#D97706', error: '#DC2626', tyt: '#EA580C', ayt: '#DC2626' } },
    dark: { dark: true, fonts, colors: { primary: '#FB923C', primaryLight: '#431407', secondary: '#F87171', background: '#0F0500', surface: '#1E0A00', card: '#2D1200', text: '#FFF4ED', textSecondary: '#FDBA74', textMuted: '#7C2D12', border: '#5C2000', success: '#34D399', warning: '#FCD34D', error: '#F43F5E', tyt: '#FB923C', ayt: '#F87171' } },
  },
};

// ─── YARDIMCILAR ───

export const CATEGORIZED_THEMES = Object.entries(THEMES).reduce((acc, [key, theme]) => {
  const cat = theme.category || 'Diğer';
  if (!acc[cat]) acc[cat] = [];
  acc[cat].push({ key, ...theme });
  return acc;
}, {});

export const THEME_CATEGORIES = Object.keys(CATEGORIZED_THEMES);

export function canUseTheme(themeKey, isPremium) {
  const t = THEMES[themeKey];
  return t ? (!t.premium || isPremium) : false;
}

export function getThemeColors(themeKey, isDark) {
  const t = THEMES[themeKey] || THEMES.violet;
  return isDark ? t.dark.colors : t.light.colors;
}

export function getThemeObject(themeKey, isDark) {
  const t = THEMES[themeKey] || THEMES.violet;
  return isDark ? t.dark : t.light;
}