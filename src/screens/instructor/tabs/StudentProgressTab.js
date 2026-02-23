import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, ProgressBar, useTheme, Empty } from '../../../components/common';

export default function StudentProgressTab({ progress }) {
  const colors = useTheme();

  if (progress.length === 0) {
    return <Empty icon="📚" title="Henüz ilerleme yok" />;
  }

  return (
    <>
      {progress.map((p) => (
        <Card key={p.subject_id}>
          <View style={styles.row}>
            <Text style={[styles.name, { color: colors.text }]}>{p.subject_name}</Text>
            <Text style={[styles.pct, { color: colors.primary }]}>%{Math.round(p.percentage)}</Text>
          </View>
          <ProgressBar value={p.percentage} color={colors.primary} style={{ marginVertical: 6 }} />
          <Text style={[styles.count, { color: colors.textMuted }]}>
            {p.completed_topics}/{p.total_topics} konu
          </Text>
        </Card>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  row:   { flexDirection: 'row', justifyContent: 'space-between' },
  name:  { fontSize: 14, fontWeight: '700' },
  pct:   { fontSize: 14, fontWeight: '700' },
  count: { fontSize: 12 },
});
