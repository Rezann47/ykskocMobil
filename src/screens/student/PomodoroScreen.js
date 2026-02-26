import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, Animated, Dimensions, Easing
} from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { pomodoroApi, subjectApi } from '../../services/api';
import { useTheme, Loading, Empty } from '../../components/common';
import AdBanner from '../../components/ads/BannerAd';
import { useInterstitial } from '../../components/ads/useInterstitial';
import { useFocusEffect } from '@react-navigation/native';

const { width: SCREEN_W } = Dimensions.get('window');
const RING_SIZE = Math.min(SCREEN_W - 80, 260);
const RADIUS = (RING_SIZE - 20) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const DURATIONS = [
  { value: 15, label: '15 dk', emoji: '🎯' },
  { value: 30, label: '30 dk', emoji: '⚡' },

  { value: 45, label: '45 dk', emoji: '🔥' },

  { value: 60, label: '60 dk', emoji: '⚡' },

];

export default function PomodoroScreen() {
  const colors = useTheme();
  const { show: showAd } = useInterstitial();

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [duration, setDuration] = useState(25);
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(25 * 60);
  const [startedAt, setStartedAt] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sessionCount, setSessionCount] = useState(0);

  const intervalRef = useRef(null);
  const mountAnim = useRef(new Animated.Value(0)).current;

  // Sadece sayfa ilk açıldığında yukarı doğru süzülme efekti
  useEffect(() => {
    Animated.timing(mountAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }).start();
  }, []);

  useFocusEffect(useCallback(() => {
    loadSubjects();
    loadHistory();
  }, []));

  useEffect(() => {
    if (!running) setRemaining(duration * 60);
  }, [duration, running]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            clearInterval(intervalRef.current);
            handleComplete();
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const loadSubjects = async () => {
    try { const d = await subjectApi.list(); setSubjects(d || []); } catch { }
  };
  const loadHistory = async () => {
    try { const d = await pomodoroApi.list({ limit: 5 }); setHistory(d?.data || []); } catch { }
    setLoadingHistory(false);
  };

  const handleStart = () => {
    setStartedAt(new Date().toISOString());
    setRunning(true);
  };

  const handleStop = () => {
    Alert.alert('Oturumu Durdur', 'Çalışmanı kaydetmek istiyor musun?', [
      { text: 'Hayır, Sıfırla', style: 'destructive', onPress: () => { setRunning(false); setRemaining(duration * 60); } },
      { text: 'Kaydet ve Bitir', onPress: () => handleComplete() },
      { text: 'Devam Et', style: 'cancel' },
    ]);
  };

  const handleComplete = async () => {
    const elapsed = Math.round((duration * 60 - remaining) / 60);
    setRunning(false);
    setRemaining(duration * 60);

    if (elapsed < 1) return;

    try {
      await pomodoroApi.create({
        duration_minutes: elapsed,
        subject_id: selectedSubject?.id || undefined,
        started_at: startedAt,
      });
      setSessionCount(c => c + 1);
      loadHistory();
      showAd();
    } catch (e) { console.log(e); }
  };

  const formatTime = s => {
    const m = Math.floor(s / 60), sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const progress = 1 - (remaining / (duration * 60));
  const strokeOffset = CIRCUMFERENCE * (1 - progress);
  const isWarning = remaining <= 300 && running;
  const accent = colors.primary || '#6C63FF';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={[styles.container, {
        opacity: mountAnim,
        transform: [{ translateY: mountAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }]
      }]}>

        {/* Üst Bilgi */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Odaklanma</Text>
          <View style={[styles.badge, { backgroundColor: accent + '15' }]}>
            <Text style={[styles.badgeText, { color: accent }]}>Bugün: {sessionCount}</Text>
          </View>
        </View>

        {/* Ana Timer Alanı */}
        <View style={[styles.timerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.svgContainer}>
            <Svg width={RING_SIZE} height={RING_SIZE} style={{ transform: [{ rotate: '-90deg' }] }}>
              <Circle
                cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS}
                stroke={colors.border} strokeWidth={8} fill="none" opacity={0.2}
              />
              <Circle
                cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS}
                stroke={isWarning ? '#FF6B6B' : accent}
                strokeWidth={8} fill="none"
                strokeDasharray={`${CIRCUMFERENCE}`}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
              />
            </Svg>

            <View style={styles.timerContent}>
              <Text style={[styles.timerText, { color: colors.text }]}>{formatTime(remaining)}</Text>
              <Text style={[styles.timerSubText, { color: colors.textMuted }]}>
                {running ? (selectedSubject?.name || 'Çalışılıyor...') : 'Hazır'}
              </Text>
            </View>
          </View>

          {/* Seçenekler (Sadece dururken gözükür) */}
          {!running && (
            <View style={{ width: '100%', marginTop: 20 }}>
              <View style={styles.durationRow}>
                {DURATIONS.map(d => (
                  <TouchableOpacity
                    key={d.value}
                    onPress={() => setDuration(d.value)}
                    style={[styles.chip, {
                      backgroundColor: duration === d.value ? accent : 'transparent',
                      borderColor: duration === d.value ? accent : colors.border
                    }]}
                  >
                    <Text style={[styles.chipText, { color: duration === d.value ? '#fff' : colors.text }]}>{d.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjList}>
                {[{ id: null, name: '📚 Genel' }, ...subjects].map(s => (
                  <TouchableOpacity
                    key={String(s.id)}
                    onPress={() => setSelectedSubject(s.id ? s : null)}
                    style={[styles.subjChip, { backgroundColor: selectedSubject?.id === s.id ? accent + '20' : 'transparent', borderColor: selectedSubject?.id === s.id ? accent : colors.border }]}
                  >
                    <Text style={{ color: selectedSubject?.id === s.id ? accent : colors.textMuted }}>{s.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <TouchableOpacity
            onPress={running ? handleStop : handleStart}
            style={[styles.actionBtn, { backgroundColor: running ? '#FF6B6B' : accent }]}
            activeOpacity={0.8}
          >
            <Text style={styles.actionBtnText}>{running ? 'Durdur' : 'Başlat'}</Text>
          </TouchableOpacity>
        </View>

        {/* Geçmiş Listesi */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Son Oturumlar</Text>
        </View>

        <View style={[styles.listCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {loadingHistory ? <Loading /> : history.length === 0 ? (
            <Text style={{ color: colors.textMuted, textAlign: 'center', padding: 10 }}>Henüz kayıt yok.</Text>
          ) : history.map((item, idx) => (
            <View key={item.id} style={[styles.historyItem, idx !== history.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.historyName, { color: colors.text }]}>{item.subject_name || 'Genel Çalışma'}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>{new Date(item.started_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</Text>
              </View>
              <Text style={{ color: accent, fontWeight: '700' }}>{item.duration_minutes} dk</Text>
            </View>
          ))}
        </View>

        <AdBanner />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 30 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: '800' },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  badgeText: { fontWeight: '700', fontSize: 13 },

  timerCard: { padding: 25, borderRadius: 24, alignItems: 'center', borderWidth: 1 },
  svgContainer: { width: RING_SIZE, height: RING_SIZE, justifyContent: 'center', alignItems: 'center' },
  timerContent: { position: 'absolute', alignItems: 'center' },
  timerText: { fontSize: 52, fontWeight: '900', fontVariant: ['tabular-nums'] },
  timerSubText: { fontSize: 14, fontWeight: '600', marginTop: 4 },

  durationRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 15 },
  chip: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12, borderWidth: 1.5 },
  chipText: { fontWeight: '700', fontSize: 14 },

  subjList: { marginBottom: 15 },
  subjChip: { paddingHorizontal: 15, paddingVertical: 7, borderRadius: 10, marginRight: 8, borderWidth: 1 },

  actionBtn: { width: '100%', padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  actionBtnText: { color: '#fff', fontSize: 18, fontWeight: '800' },

  sectionHeader: { marginTop: 25, marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  listCard: { borderRadius: 20, padding: 15, borderWidth: 1 },
  historyItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  historyName: { fontWeight: '600', fontSize: 15, marginBottom: 2 }
});