import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { pomodoroApi, subjectApi } from '../../services/api';
import { Card, Button, useTheme, Loading, Empty } from '../../components/common';
import AdBanner from '../../components/ads/BannerAd';
import { useInterstitial } from '../../components/ads/useInterstitial';
import { useFocusEffect } from '@react-navigation/native';

const DURATIONS = [25, 45, 60, 90];

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

  const intervalRef = useRef(null);
  useFocusEffect(
    useCallback(() => {
      loadSubjects();
      loadHistory();
    }, [])
  );





  useEffect(() => {
    setRemaining(duration * 60);
  }, [duration]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
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
    try {
      const data = await subjectApi.list();
      setSubjects(data || []);
    } catch { }
  };

  const loadHistory = async () => {
    try {
      const data = await pomodoroApi.list({ limit: 10 });
      setHistory(data?.data || []);
    } catch { }
    setLoadingHistory(false);
  };

  const handleStart = () => {
    setStartedAt(new Date().toISOString());
    setRemaining(duration * 60);
    setRunning(true);
  };

  const handleStop = () => {
    Alert.alert('Pomodoro\'yu Durdur', 'Oturumu kaydetmek ister misin?', [
      {
        text: 'Hayır',
        style: 'destructive',
        onPress: () => { setRunning(false); setRemaining(duration * 60); }
      },
      {
        text: 'Kaydet',
        onPress: () => {
          clearInterval(intervalRef.current);
          handleComplete();
        }
      },
    ]);
  };

  const handleComplete = async () => {
    setRunning(false);
    const elapsed = Math.round((duration * 60 - remaining) / 60);
    if (elapsed < 1) return;
    try {
      const res = await pomodoroApi.create({
        duration_minutes: elapsed,
        subject_id: selectedSubject?.id || undefined, // null yerine undefined
        started_at: startedAt,
      });
      console.log("test", res);
      loadHistory();
      showAd();
    } catch (e) {
      console.log("pomodoro hata:", e.message); // hatayı görmek için
    }
    setRemaining(duration * 60);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const progress = 1 - remaining / (duration * 60);
  const circumference = 2 * Math.PI * 90;
  const strokeDash = circumference * (1 - progress);

  return (
    <ScrollView style={{ flex: 1, paddingTop: '10%', backgroundColor: colors.background }}>
      <View style={styles.container}>
        {/* Timer */}
        <View style={[styles.timerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* SVG benzeri daire — basit yaklaşım */}
          <View style={styles.timerRing}>
            <View style={[styles.timerInner, { borderColor: colors.primary + '30' }]}>
              <View style={[
                styles.timerProgress,
                {
                  borderColor: running ? colors.primary : colors.border,
                  transform: [{ rotate: `${progress * 360}deg` }],
                },
              ]} />
              <Text style={[styles.timerText, { color: colors.text }]}>{formatTime(remaining)}</Text>
              <Text style={[styles.timerLabel, { color: colors.textMuted }]}>
                {running ? '⏱ Çalışıyor' : '⏸ Hazır'}
              </Text>
            </View>
          </View>

          {/* Süre seçimi */}
          {!running && (
            <View style={styles.durations}>
              {DURATIONS.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.durationBtn,
                    {
                      backgroundColor: duration === d ? colors.primary : colors.primaryLight,
                      borderColor: duration === d ? colors.primary : 'transparent',
                    },
                  ]}
                  onPress={() => setDuration(d)}
                >
                  <Text style={[styles.durationText, { color: duration === d ? '#fff' : colors.primary }]}>
                    {d} dk
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Ders seçimi */}
          {!running && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectScroll}>
              <TouchableOpacity
                style={[
                  styles.subjectChip,
                  {
                    backgroundColor: !selectedSubject ? colors.primary : colors.primaryLight,
                    borderColor: !selectedSubject ? colors.primary : 'transparent',
                  },
                ]}
                onPress={() => setSelectedSubject(null)}
              >
                <Text style={{ color: !selectedSubject ? '#fff' : colors.primary, fontSize: 13, fontWeight: '600' }}>
                  Genel
                </Text>
              </TouchableOpacity>
              {subjects.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={[
                    styles.subjectChip,
                    {
                      backgroundColor: selectedSubject?.id === s.id ? colors.primary : colors.primaryLight,
                      borderColor: selectedSubject?.id === s.id ? colors.primary : 'transparent',
                    },
                  ]}
                  onPress={() => setSelectedSubject(s)}
                >
                  <Text style={{
                    color: selectedSubject?.id === s.id ? '#fff' : colors.primary,
                    fontSize: 13, fontWeight: '600',
                  }}>
                    {s.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Buton */}
          <View style={styles.timerActions}>
            {!running ? (
              <Button title="🚀 Başlat" onPress={handleStart} style={styles.actionBtn} />
            ) : (
              <Button title="⏹ Durdur" onPress={handleStop} variant="outline" style={styles.actionBtn} />
            )}
          </View>
        </View>

        {/* Geçmiş */}
        <Card>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Son Pomodorolar</Text>
          {loadingHistory ? <Loading /> : history.length === 0 ? (
            <Empty icon="⏱️" title="Henüz pomodoro yok" subtitle="İlk pomodoronu başlat!" />
          ) : (
            history.map((item) => (
              <View key={item.id} style={[styles.historyItem, { borderBottomColor: colors.border }]}>
                <View style={[styles.historyIcon, { backgroundColor: colors.primaryLight }]}>
                  <Text style={{ fontSize: 18 }}>⏱️</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.historySubject, { color: colors.text }]}>
                    {item.subject_name || 'Genel Çalışma'}
                  </Text>
                  <Text style={[styles.historyTime, { color: colors.textMuted }]}>
                    {new Date(item.started_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <View style={[styles.durationBadge, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.durationBadgeText, { color: colors.primary }]}>
                    {item.duration_minutes} dk
                  </Text>
                </View>
              </View>
            ))
          )}
        </Card>

        <AdBanner />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  timerCard: { borderRadius: 20, padding: 20, borderWidth: 1, marginBottom: 16, alignItems: 'center' },
  timerRing: { width: 200, height: 200, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  timerInner: {
    width: 180, height: 180, borderRadius: 90, borderWidth: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  timerProgress: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    borderWidth: 8, borderLeftColor: 'transparent', borderBottomColor: 'transparent',
  },
  timerText: { fontSize: 42, fontWeight: '800', letterSpacing: 2 },
  timerLabel: { fontSize: 13, marginTop: 4 },
  durations: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  durationBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5 },
  durationText: { fontSize: 13, fontWeight: '600' },
  subjectScroll: { marginBottom: 16 },
  subjectChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1.5 },
  timerActions: { width: '100%' },
  actionBtn: { width: '100%' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  historyItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1 },
  historyIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  historySubject: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  historyTime: { fontSize: 12 },
  durationBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  durationBadgeText: { fontSize: 13, fontWeight: '700' },
});
