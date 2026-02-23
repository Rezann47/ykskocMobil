import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { subjectApi } from '../../services/api';
import { useTheme, Loading, Empty } from '../../components/common';

export default function TopicsScreen({ route }) {
  const { subject } = route.params;
  const colors = useTheme();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const data = await subjectApi.topics(subject.id);
      setTopics(data || []);
    } catch { }
    setLoading(false);
  };

  const toggle = async (topic) => {
    setUpdating(topic.id);
    const newVal = !topic.is_completed;
    setTopics((prev) =>
      prev.map((t) => t.id === topic.id ? { ...t, is_completed: newVal } : t)
    );
    try {
      await subjectApi.markTopic(topic.id, newVal);
    } catch {
      // Hata durumunda geri al
      setTopics((prev) =>
        prev.map((t) => t.id === topic.id ? { ...t, is_completed: topic.is_completed } : t)
      );
    }
    setUpdating(null);
  };

  const completed = topics.filter((t) => t.is_completed).length;

  if (loading) return <Loading />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Özet */}
      <View style={[styles.summary, { backgroundColor: colors.primary }]}>
        <Text style={styles.summaryTitle}>{subject.name}</Text>
        <Text style={styles.summaryCount}>{completed}/{topics.length} konu tamamlandı</Text>
        <View style={styles.progressBg}>
          <View style={[
            styles.progressFg,
            { width: `${topics.length > 0 ? (completed / topics.length) * 100 : 0}%` },
          ]} />
        </View>
      </View>

      <FlatList
        data={topics}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.topicRow,
              {
                backgroundColor: item.is_completed ? colors.success + '12' : colors.card,
                borderColor: item.is_completed ? colors.success + '40' : colors.border,
              },
            ]}
            onPress={() => toggle(item)}
            disabled={updating === item.id}
            activeOpacity={0.7}
          >
            <View style={[
              styles.checkbox,
              {
                backgroundColor: item.is_completed ? colors.success : 'transparent',
                borderColor: item.is_completed ? colors.success : colors.border,
              },
            ]}>
              {item.is_completed && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <Text style={[
              styles.topicName,
              {
                color: item.is_completed ? colors.textSecondary : colors.text,
                textDecorationLine: item.is_completed ? 'line-through' : 'none',
              },
            ]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Empty icon="📖" title="Konu bulunamadı" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  summary: { padding: 20, paddingTop: 24 },
  summaryTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 4 },
  summaryCount: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 12 },
  progressBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 3, overflow: 'hidden' },
  progressFg: { height: '100%', backgroundColor: '#fff', borderRadius: 3 },
  list: { padding: 12 },
  topicRow: {
    flexDirection: 'row', alignItems: 'center', padding: 14,
    borderRadius: 12, borderWidth: 1, marginBottom: 8,
  },
  checkbox: {
    width: 24, height: 24, borderRadius: 7, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  topicName: { fontSize: 14, fontWeight: '500', flex: 1 },
});
