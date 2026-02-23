import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, useTheme, Empty } from '../../../components/common';

export default function StudentPomodoroTab({ pomodoros }) {
  const colors = useTheme();

  return (
    <>
      {/* Özet */}
      <Card>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Son 7 Gün Özeti</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statVal, { color: colors.primary }]}>
              {pomodoros?.total_sessions || 0}
            </Text>
            <Text style={[styles.statLbl, { color: colors.textMuted }]}>Oturum</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statVal, { color: colors.success }]}>
              {pomodoros?.total_minutes || 0}
            </Text>
            <Text style={[styles.statLbl, { color: colors.textMuted }]}>Dakika</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statVal, { color: colors.warning }]}>
              {pomodoros?.total_minutes > 0 ? Math.round(pomodoros.total_minutes / 60) : 0}
            </Text>
            <Text style={[styles.statLbl, { color: colors.textMuted }]}>Saat</Text>
          </View>
        </View>
      </Card>

      {/* Günlük dağılım */}
      {pomodoros?.daily_breakdown?.length > 0 ? (
        <Card>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Günlük Dağılım</Text>
          {pomodoros.daily_breakdown.map((day, i) => (
            <View
              key={day.date}
              style={[
                styles.dayRow,
                {
                  borderBottomColor: colors.border,
                  borderBottomWidth: i < pomodoros.daily_breakdown.length - 1 ? 1 : 0,
                },
              ]}
            >
              <View style={[styles.dayIcon, { backgroundColor: colors.primaryLight }]}>
                <Text style={{ fontSize: 18 }}>📅</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.dayDate, { color: colors.text }]}>
                  {new Date(day.date).toLocaleDateString('tr-TR', {
                    weekday: 'short', day: 'numeric', month: 'long',
                  })}
                </Text>
                <Text style={[styles.daySessions, { color: colors.textMuted }]}>
                  {day.sessions} oturum
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.badgeText, { color: colors.primary }]}>
                  {day.total_minutes} dk
                </Text>
              </View>
            </View>
          ))}
        </Card>
      ) : (
        <Empty icon="⏱️" title="Bu haftaya ait pomodoro yok" />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 12 },
  statsRow:     { flexDirection: 'row' },
  statItem:     { flex: 1, alignItems: 'center' },
  statVal:      { fontSize: 24, fontWeight: '800' },
  statLbl:      { fontSize: 12, marginTop: 2 },
  dayRow:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  dayIcon:      { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  dayDate:      { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  daySessions:  { fontSize: 12 },
  badge:        { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  badgeText:    { fontSize: 13, fontWeight: '700' },
});
