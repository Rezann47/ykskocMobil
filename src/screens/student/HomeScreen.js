import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store';
import { pomodoroApi, subjectApi, examApi } from '../../services/api';
import { Card, ProgressBar, useTheme, Loading } from '../../components/common';
import AdBanner from '../../components/ads/BannerAd';
import UserAvatar from '../../components/UserAvatar';
export default function HomeScreen({ navigation }) {
  const colors = useTheme();
  const { user, isDark, toggleTheme } = useStore();
  const [stats, setStats] = useState(null);
  const [progress, setProgress] = useState([]);
  const [recentExam, setRecentExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const load = async () => {
    try {
      const [s, p, e] = await Promise.all([
        pomodoroApi.stats(today, today),
        subjectApi.allProgress(),
        examApi.list({ limit: 1 }),
      ]);
      setStats(s);
      setProgress(p?.slice(0, 4) || []);
      setRecentExam(e?.data?.[0] || null);
    } catch { }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  const onRefresh = () => { setRefreshing(true); load(); };

  if (loading) return <Loading />;



  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >

      {/* Header */}
      <LinearGradient colors={[colors.primary, colors.primary + 'CC']}
        style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ width: 100, height: 100, justifyContent: 'center', alignItems: 'center', borderRadius: 1, overflow: 'hidden', marginRight: 6 }}>

            <UserAvatar avatarId={user?.avatar_id} size={80} />

          </View>

          <View>
            <Text style={styles.userName}>{user?.name}</Text>
          </View>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeBtn}>
            <Ionicons name={isDark ? 'sunny' : 'moon'} size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Bugünkü pomodoro özeti */}
        <View style={styles.todayCard}>
          <View style={styles.todayStat}>
            <Text style={styles.todayValue}>{stats?.total_sessions || 0}</Text>
            <Text style={styles.todayLabel}>Pomodoro</Text>
          </View>
          <View style={styles.todayDivider} />
          <View style={styles.todayStat}>
            <Text style={styles.todayValue}>{stats?.total_minutes || 0}</Text>
            <Text style={styles.todayLabel}>Dakika</Text>
          </View>
          <View style={styles.todayDivider} />
          <View style={styles.todayStat}>
            <Text style={styles.todayValue}>
              {progress.length > 0
                ? Math.round(progress.reduce((a, b) => a + b.percentage, 0) / progress.length)
                : 0}%
            </Text>
            <Text style={styles.todayLabel}>Genel İlerleme</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Hızlı Erişim */}
        <View style={styles.quickActions}>
          {[
            { icon: '⏱️', label: 'Pomodoro', screen: 'Pomodoro' },
            { icon: '📚', label: 'Konular', screen: 'Konular' },
            { icon: '📝', label: 'Denemeler', screen: 'Exams' },
            { icon: '📊', label: 'İstatistik', screen: 'Exams' },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.quickBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Text style={styles.quickIcon}>{item.icon}</Text>
              <Text style={[styles.quickLabel, { color: colors.text }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Ders İlerleme */}
        {progress.length > 0 && (
          <Card>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>📈 Ders İlerlemen</Text>
            {progress.map((p) => (
              <View key={p.subject_id} style={styles.progressItem}>
                <View style={styles.progressHeader}>
                  <Text style={[styles.progressLabel, { color: colors.text }]}>{p.subject_name}</Text>
                  <Text style={[styles.progressPct, { color: colors.primary }]}>
                    %{Math.round(p.percentage)}
                  </Text>
                </View>
                <ProgressBar
                  value={p.percentage}
                  color={p.subject_name?.includes('TYT') ? colors.tyt : colors.ayt}
                />
              </View>
            ))}
            <TouchableOpacity onPress={() => navigation.navigate('Konular')} style={styles.seeAll}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>Tümünü Gör →</Text>
            </TouchableOpacity>
          </Card>
        )}

        {/* Son Deneme */}
        {recentExam && (
          <Card>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>📝 Son Deneme</Text>
            <View style={styles.examRow}>
              <View style={[styles.examBadge, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.examType, { color: colors.primary }]}>{recentExam.exam_type}</Text>
              </View>
              <Text style={[styles.examNet, { color: colors.text }]}>
                Net: <Text style={{ color: colors.primary, fontWeight: '700' }}>
                  {recentExam.total_net?.toFixed(2)}
                </Text>
              </Text>
              <Text style={[styles.examDate, { color: colors.textMuted }]}>
                {new Date(recentExam.exam_date).toLocaleDateString('tr-TR')}
              </Text>
            </View>
          </Card>
        )}

        {/* Reklam */}
        <AdBanner style={{ marginBottom: 16 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 28 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  userName: { color: '#fff', fontSize: 22, fontWeight: '800' },
  themeBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12 },
  todayCard: {
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16,
    flexDirection: 'row', padding: 16,
  },
  todayStat: { flex: 1, alignItems: 'center' },
  todayValue: { color: '#fff', fontSize: 24, fontWeight: '800' },
  todayLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 },
  todayDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 8 },
  content: { padding: 16 },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  quickBtn: {
    width: '23%', aspectRatio: 1, borderRadius: 14, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  quickIcon: { fontSize: 24, marginBottom: 4 },
  quickLabel: { fontSize: 11, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 14 },
  progressItem: { marginBottom: 12 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 14, fontWeight: '500' },
  progressPct: { fontSize: 14, fontWeight: '700' },
  seeAll: { alignItems: 'flex-end', marginTop: 4 },
  seeAllText: { fontSize: 13, fontWeight: '600' },
  examRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  examBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  examType: { fontSize: 13, fontWeight: '700' },
  examNet: { flex: 1, fontSize: 14 },
  examDate: { fontSize: 13 },
});
