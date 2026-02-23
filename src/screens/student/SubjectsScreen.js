import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, SectionList,
} from 'react-native';
import { subjectApi } from '../../services/api';
import { Card, ProgressBar, useTheme, Loading, Empty, Badge } from '../../components/common';
import AdBanner from '../../components/ads/BannerAd';

export default function SubjectsScreen({ navigation }) {
  const colors = useTheme();
  const [tab, setTab] = useState('TYT');
  const [subjects, setSubjects] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, [tab]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await subjectApi.list(tab);

      setSubjects(data || []);

      const progMap = {};
      await Promise.all((data || []).map(async (s) => {
        try {
          const p = await subjectApi.progress(s.id);
          progMap[s.id] = p;
        } catch { }
      }));
      setProgress(progMap);
    } catch { }
    setLoading(false);
  };

  const renderSubject = ({ item }) => {
    const p = progress[item.id];
    const pct = p?.percentage || 0;
    const completed = p?.completed_topics || 0;
    const total = p?.total_topics || 0;

    return (
      <TouchableOpacity
        style={[styles.subjectCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => navigation.navigate('Topics', { subject: item })}
        activeOpacity={0.8}
      >
        <View style={styles.subjectHeader}>
          <Text style={[styles.subjectName, { color: colors.text }]}>{item.name}</Text>
          <Badge
            label={`${completed}/${total}`}
            color={pct === 100 ? colors.success : colors.primary}
          />
        </View>
        <ProgressBar
          value={pct}
          color={tab === 'TYT' ? colors.tyt : colors.ayt}
          style={{ marginTop: 10 }}
        />
        <Text style={[styles.pctText, { color: colors.textMuted }]}>
          %{Math.round(pct)} tamamlandı
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, }}>

      {/* Tab */}

      <View style={[styles.tabBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {['TYT', 'AYT'].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && { borderBottomColor: colors.primary }]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, { color: tab === t ? colors.primary : colors.textSecondary }]}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {
        loading ? <Loading /> : subjects.length === 0 ? (
          <Empty icon="📚" title="Ders bulunamadı" />
        ) : (
          <FlatList
            data={subjects}
            keyExtractor={(i) => i.id}
            renderItem={renderSubject}
            contentContainerStyle={styles.list}
            ListFooterComponent={<AdBanner style={{ marginTop: 8 }} />}
          />
        )
      }
    </View >
  );
}

const styles = StyleSheet.create({
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabText: { fontSize: 15, fontWeight: '700' },
  list: { padding: 16 },
  subjectCard: { borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 10 },
  subjectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subjectName: { fontSize: 15, fontWeight: '700', flex: 1 },
  pctText: { fontSize: 12, marginTop: 6 },
});
