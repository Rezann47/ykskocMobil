import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from './common';

/**
 * Kullanım:
 * <OnlineBadge isOnline={student.is_online} lastSeenAt={student.last_seen_at} />
 *
 * showLabel={false} ile sadece nokta gösterilebilir.
 */
export default function OnlineBadge({ isOnline, lastSeenAt, showLabel = true }) {
  const colors = useTheme();

  const label = isOnline
    ? 'Aktif'
    : lastSeenAt
      ? `Son: ${formatRelative(lastSeenAt)}`
      : 'Hiç giriş yapmadı';

  return (
    <View style={styles.wrap}>
      <View style={[styles.dot, { backgroundColor: isOnline ? colors.success : colors.textMuted }]} />
      {showLabel && (
        <Text style={[styles.label, { color: isOnline ? colors.success : colors.textMuted }]}>
          {label}
        </Text>
      )}
    </View>
  );
}

function formatRelative(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60)   return `${diff}sn önce`;
  if (diff < 3600) return `${Math.floor(diff / 60)}dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}sa önce`;
  return `${Math.floor(diff / 86400)}g önce`;
}

const styles = StyleSheet.create({
  wrap:  { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot:   { width: 8, height: 8, borderRadius: 4 },
  label: { fontSize: 12, fontWeight: '600' },
});
