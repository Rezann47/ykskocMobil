import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { instructorApi } from '../../services/api';
import { useTheme, Loading } from '../../components/common';
import AdBanner from '../../components/ads/BannerAd';

import StudentProgressTab from './tabs/StudentProgressTab';
import StudentPomodoroTab from './tabs/StudentPomodoroTab';
import StudentExamsTab from './tabs/StudentExamsTab';
import StudentPlansTab from './tabs/StudentPlansTab';

const TABS = [
  { key: 'progress', label: '📚 İlerleme' },
  { key: 'pomodoro', label: '⏱ Pomodoro' },
  { key: 'exams', label: '📝 Denemeler' },
  { key: 'plans', label: '📅 Planlar' },
];

export default function StudentDetailScreen({ route, navigation }) {
  const { student } = route.params;
  const colors = useTheme();

  const [tab, setTab] = useState('progress');
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState([]);
  const [pomodoros, setPomodoros] = useState(null);
  const [exams, setExams] = useState([]);

  const weekAgo = new Date(Date.now() - 7 * 86400000);
  const fmt = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  useFocusEffect(
    useCallback(() => {
      load();
    }, [tab])
  );

  const load = async () => {
    // Plans tabı kendi içinde load ediyor, burada yükleme yok
    if (tab === 'plans') { setLoading(false); return; }

    setLoading(true);
    try {
      if (tab === 'progress') {
        const data = await instructorApi.studentProgress(student.id);
        setProgress(data || []);
      } else if (tab === 'pomodoro') {
        const data = await instructorApi.studentPomodoros(student.id, fmt(weekAgo), fmt(new Date()));
        setPomodoros(data);
      } else if (tab === 'exams') {
        const data = await instructorApi.studentExams(student.id, 'TYT');
        setExams(data?.data || []);
      }
    } catch (e) {
      console.log(e.message);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* ─── Tabs ─── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.tabsScroll, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}
      >
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, tab === t.key && { borderBottomColor: colors.primary }]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[styles.tabText, { color: tab === t.key ? colors.primary : colors.textSecondary }]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ─── İçerik ─── */}
      <View style={styles.content}>
        {loading && tab !== 'plans' ? <Loading /> : (
          <>
            {tab === 'progress' && <StudentProgressTab progress={progress} />}
            {tab === 'pomodoro' && <StudentPomodoroTab pomodoros={pomodoros} />}
            {tab === 'exams' && <StudentExamsTab exams={exams} />}
            {tab === 'plans' && (
              <StudentPlansTab studentId={student.id} navigation={navigation} />
            )}
          </>
        )}
        <AdBanner />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabsScroll: { borderBottomWidth: 1 },
  tab: {
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  tabText: { fontSize: 13, fontWeight: '600' },
  content: { padding: 16 },
});