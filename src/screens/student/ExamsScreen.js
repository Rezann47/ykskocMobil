import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Modal, ScrollView, Alert, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { examApi } from '../../services/api';
import { Button, Card, useTheme, Loading, Empty } from '../../components/common';
import AdBanner from '../../components/ads/BannerAd';

const TYT_SUBJECTS = [
  { key: 'turkish', label: 'Türkçe', max: 40 },
  { key: 'math', label: 'Matematik', max: 40 },
  { key: 'science', label: 'Fen Bil.', max: 20 },
  { key: 'social', label: 'Sosyal', max: 20 },
];
const AYT_SUBJECTS = [
  { key: 'math_ayt', label: 'Matematik', max: 40 },
  { key: 'physics', label: 'Fizik', max: 14 },
  { key: 'chemistry', label: 'Kimya', max: 13 },
  { key: 'biology', label: 'Biyoloji', max: 13 },
];

export default function ExamsScreen() {
  const colors = useTheme();
  const [tab, setTab] = useState('TYT');
  const [exams, setExams] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, [tab]);

  const load = async () => {
    setLoading(true);
    try {
      const [list, s] = await Promise.all([
        examApi.list({ exam_type: tab, limit: 20 }),
        examApi.stats(tab),
      ]);
      console.log(list.data)
      setExams(list?.data || []);
      setStats(s);
    } catch { }
    setLoading(false);
  };

  const subjects = tab === 'TYT' ? TYT_SUBJECTS : AYT_SUBJECTS;

  const handleSave = async () => {
    setSaving(true);
    try {
      const scores = {};
      subjects.forEach((s) => {
        scores[s.key] = {
          correct: parseInt(form[s.key + '_c'] || '0'),
          wrong: parseInt(form[s.key + '_w'] || '0'),
        };
      });
      await examApi.create({
        exam_type: tab,
        exam_date: new Date().toISOString(),
        scores,
      });
      setModal(false);
      setForm({});
      load();
    } catch (e) {
      Alert.alert('Hata', e.message);
    }
    setSaving(false);
  };

  const handleDelete = (id) => {
    Alert.alert('Sil', 'Bu denemeyi silmek istiyor musun?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive', onPress: async () => {
          await examApi.delete(id);
          load();
        }
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Tab */}
      <View style={[styles.tabBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {['TYT', 'AYT'].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && { borderBottomColor: colors.primary }]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, { color: tab === t ? colors.primary : colors.textSecondary }]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* İstatistik */}
        {stats && (
          <Card>
            <Text style={[styles.statsTitle, { color: colors.text }]}>📊 {tab} İstatistikleri</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.primary }]}>{stats.total_exams}</Text>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>Deneme</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.success }]}>
                  {stats.average_total_net?.toFixed(1)}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>Ort. Net</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.warning }]}>
                  {stats.best_total_net?.toFixed(1)}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>En İyi</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Ekle Butonu */}
        <Button
          title={`+ ${tab} Denemesi Ekle`}
          onPress={() => setModal(true)}
          style={{ marginBottom: 16 }}
        />

        {/* Liste */}
        {loading ? <Loading /> : exams.length === 0 ? (
          <Empty icon="📝" title="Henüz deneme yok" subtitle="İlk deneme sonucunu ekle!" />
        ) : (
          exams.map((exam) => (
            <View key={exam.id} style={[styles.examCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.examTop}>
                <View style={[styles.typeBadge, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.typeText, { color: colors.primary }]}>{exam.exam_type}</Text>
                </View>
                <Text style={[styles.examDate, { color: colors.textMuted }]}>
                  {new Date(exam.exam_date).toLocaleDateString('tr-TR')}
                </Text>
                <TouchableOpacity onPress={() => handleDelete(exam.id)} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={18} color={colors.error} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.examNet, { color: colors.text }]}>
                Toplam Net: <Text style={{ color: colors.primary, fontWeight: '800' }}>
                  {exam.total_net?.toFixed(2)}
                </Text>
              </Text>
              <View style={styles.scoresGrid}>
                {Object.entries(exam.scores || {}).map(([key, val]) => (
                  <View key={key} style={[styles.scoreItem, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.scoreKey, { color: colors.primary }]}>{key}</Text>
                    <Text style={[styles.scoreNet, { color: colors.text }]}>{val.net?.toFixed(1)}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))
        )}

        <AdBanner />
      </ScrollView>

      {/* Modal */}
      <Modal visible={modal} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {tab} Denemesi Ekle
            </Text>
            <TouchableOpacity onPress={() => setModal(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {subjects.map((s) => (
              <View key={s.key} style={styles.scoreRow}>
                <Text style={[styles.scoreLabel, { color: colors.text }]}>{s.label}</Text>
                <View style={styles.scoreInputs}>
                  <View style={styles.scoreInputWrap}>
                    <Text style={[styles.scoreInputLabel, { color: colors.textMuted }]}>D</Text>
                    <TextInput
                      style={[styles.scoreInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                      keyboardType="number-pad"
                      placeholder="0"
                      placeholderTextColor={colors.textMuted}
                      value={form[s.key + '_c']}
                      onChangeText={(v) => setForm((f) => ({ ...f, [s.key + '_c']: v }))}
                      maxLength={2}
                    />
                  </View>
                  <View style={styles.scoreInputWrap}>
                    <Text style={[styles.scoreInputLabel, { color: colors.textMuted }]}>Y</Text>
                    <TextInput
                      style={[styles.scoreInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                      keyboardType="number-pad"
                      placeholder="0"
                      placeholderTextColor={colors.textMuted}
                      value={form[s.key + '_w']}
                      onChangeText={(v) => setForm((f) => ({ ...f, [s.key + '_w']: v }))}
                      maxLength={2}
                    />
                  </View>
                  <View style={[styles.netBox, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.netText, { color: colors.primary }]}>
                      {(
                        (parseInt(form[s.key + '_c'] || '0')) -
                        (parseInt(form[s.key + '_w'] || '0') / 4)
                      ).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            <Button title="Kaydet" onPress={handleSave} loading={saving} style={{ margin: 16 }} />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: { flexDirection: 'row', borderBottomWidth: 1 },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabText: { fontSize: 15, fontWeight: '700' },
  content: { padding: 16 },
  statsTitle: { fontSize: 15, fontWeight: '700', marginBottom: 12 },
  statsRow: { flexDirection: 'row' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 12, marginTop: 2 },
  examCard: { borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 10 },
  examTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  typeText: { fontSize: 12, fontWeight: '700' },
  examDate: { flex: 1, fontSize: 13 },
  deleteBtn: { padding: 4 },
  examNet: { fontSize: 14, marginBottom: 10 },
  scoresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  scoreItem: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, minWidth: 70 },
  scoreKey: { fontSize: 11, fontWeight: '600', marginBottom: 2 },
  scoreNet: { fontSize: 14, fontWeight: '700' },
  modal: { flex: 1 },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalContent: { flex: 1 },
  scoreRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
  },
  scoreLabel: { width: 80, fontSize: 14, fontWeight: '600' },
  scoreInputs: { flex: 1, flexDirection: 'row', gap: 8, alignItems: 'center' },
  scoreInputWrap: { alignItems: 'center' },
  scoreInputLabel: { fontSize: 11, marginBottom: 4 },
  scoreInput: { width: 48, height: 40, borderWidth: 1.5, borderRadius: 8, textAlign: 'center', fontSize: 15 },
  netBox: { flex: 1, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  netText: { fontSize: 14, fontWeight: '700' },
});
