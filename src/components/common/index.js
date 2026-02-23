import React from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator,
  StyleSheet, TextInput,
} from 'react-native';
import { useStore } from '../../store';
import { getThemeColors } from '../../theme';

export function useTheme() {
  const isDark = useStore((s) => s.isDark);
  const themeKey = useStore((s) => s.themeKey);
  return getThemeColors(themeKey, isDark);
}

// ─── Button ───────────────────────────────────────────────
export function Button({ title, onPress, loading, variant = 'primary', style }) {
  const colors = useTheme();
  const bg = variant === 'outline' ? 'transparent' : colors.primary;
  const border = variant === 'outline' ? { borderWidth: 1.5, borderColor: colors.primary } : {};
  const textColor = variant === 'outline' ? colors.primary : '#fff';

  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: bg }, border, style]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading
        ? <ActivityIndicator color={textColor} />
        : <Text style={[styles.btnText, { color: textColor }]}>{title}</Text>
      }
    </TouchableOpacity>
  );
}

// ─── Input ────────────────────────────────────────────────
export function Input({ label, error, style, ...props }) {
  const colors = useTheme();
  return (
    <View style={[styles.inputWrap, style]}>
      {label && <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : colors.border,
            color: colors.text,
          },
        ]}
        placeholderTextColor={colors.textMuted}
        {...props}
      />
      {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
    </View>
  );
}

// ─── Card ─────────────────────────────────────────────────
export function Card({ children, style }) {
  const colors = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, style]}>
      {children}
    </View>
  );
}

// ─── Badge ────────────────────────────────────────────────
export function Badge({ label, color }) {
  return (
    <View style={[styles.badge, { backgroundColor: color + '20' }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

// ─── ProgressBar ──────────────────────────────────────────
export function ProgressBar({ value, color, style }) {
  const colors = useTheme();
  const pct = Math.min(Math.max(value || 0, 0), 100);
  return (
    <View style={[styles.progressTrack, { backgroundColor: colors.border }, style]}>
      <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: color || colors.primary }]} />
    </View>
  );
}

// ─── Section Header ───────────────────────────────────────
export function SectionHeader({ title, action, onAction }) {
  const colors = useTheme();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={onAction}>
          <Text style={[styles.sectionAction, { color: colors.primary }]}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Empty State ──────────────────────────────────────────
export function Empty({ icon, title, subtitle }) {
  const colors = useTheme();
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>{icon || '📭'}</Text>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>{title}</Text>
      {subtitle && <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>{subtitle}</Text>}
    </View>
  );
}

// ─── Loading ──────────────────────────────────────────────
export function Loading() {
  const colors = useTheme();
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  btn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 16, fontWeight: '600' },
  inputWrap: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '500', marginBottom: 6 },
  input: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  errorText: { fontSize: 12, marginTop: 4 },
  card: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 12 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700' },
  sectionAction: { fontSize: 14, fontWeight: '500' },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 17, fontWeight: '600', marginBottom: 6 },
  emptySubtitle: { fontSize: 14, textAlign: 'center' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 48 },
});