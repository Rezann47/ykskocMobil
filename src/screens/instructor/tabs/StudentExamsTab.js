import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, useTheme, Empty } from '../../../components/common';

export default function StudentExamsTab({ exams }) {
  const colors = useTheme();

  if (exams.length === 0) {
    return <Empty icon="📝" title="Henüz deneme yok" />;
  }

  return (
    <>
      {exams.map((exam) => (
        <Card key={exam.id}>
          <View style={styles.row}>
            <View style={[styles.typeBadge, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.typeText, { color: colors.primary }]}>{exam.exam_type}</Text>
            </View>
            <Text style={[styles.date, { color: colors.textMuted }]}>
              {new Date(exam.exam_date).toLocaleDateString('tr-TR')}
            </Text>
            <Text style={[styles.net, { color: colors.primary }]}>
              {exam.total_net?.toFixed(2)} net
            </Text>
          </View>
        </Card>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  row:       { flexDirection: 'row', alignItems: 'center', gap: 10 },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  typeText:  { fontSize: 12, fontWeight: '700' },
  date:      { flex: 1, fontSize: 13 },
  net:       { fontSize: 14, fontWeight: '800' },
});
