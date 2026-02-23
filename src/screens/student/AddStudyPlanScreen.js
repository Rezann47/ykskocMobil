import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, TextInput, Modal, FlatList, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { studyPlanApi, subjectApi } from '../../services/api';
import { Button, useTheme } from '../../components/common';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const DURATIONS = [15, 30, 45, 60, 90];

export default function AddStudyPlanScreen({ route, navigation }) {
  const { date, studentId } = route.params;
  const colors = useTheme();

  // Form State
  const [title, setTitle] = useState('Çalışma Planı');
  const [note, setNote] = useState('');
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);

  // Veri State
  const [subjects, setSubjects] = useState([]);
  const [topicsBySubject, setTopicsBySubject] = useState({});

  // UI State (Modal Kontrolü)
  const [activePicker, setActivePicker] = useState(null); // { type: 'subject' } veya { type: 'topic', index: number }

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const data = await subjectApi.list();
      setSubjects(data || []);
    } catch (e) {
      console.error("Dersler yüklenemedi", e);
    }
  };

  const loadTopics = async (subjectId) => {
    if (topicsBySubject[subjectId]) return;
    try {
      const data = await subjectApi.topics(subjectId);
      setTopicsBySubject((prev) => ({ ...prev, [subjectId]: data || [] }));
    } catch (e) {
      console.error("Konular yüklenemedi", e);
    }
  };

  const addItem = (subject) => {
    setItems((prev) => [
      ...prev,
      {
        subject_id: subject.id,
        subject_name: subject.name,
        topic_id: null,
        topic_name: null,
        duration_minutes: 45,
        display_order: prev.length,
      },
    ]);
    setActivePicker(null);
    loadTopics(subject.id);
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index, key, value) => {
    setItems((prev) => prev.map((item, i) => i === index ? { ...item, [key]: value } : item));
  };

  const selectTopic = (index, topic) => {
    updateItem(index, 'topic_id', topic?.id || null);
    updateItem(index, 'topic_name', topic?.name || null);
    setActivePicker(null);
  };

  const handleSave = async () => {
    if (items.length === 0) {
      Alert.alert('Hata', 'Lütfen en az bir ders ekleyin.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: title || 'Çalışma Planı',
        plan_date: date,
        note: note || null,
        items: items.map((it, i) => ({
          subject_id: it.subject_id,
          topic_id: it.topic_id || null,
          duration_minutes: it.duration_minutes,
          display_order: i,
        })),
      };

      if (studentId) {
        await studyPlanApi.createForStudent(studentId, payload);
      } else {
        await studyPlanApi.create(payload);
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Hata', e.message);
    } finally {
      setSaving(false);
    }
  };

  const displayDate = new Date(date + 'T12:00:00').toLocaleDateString('tr-TR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  // Modal İçeriği Render Fonksiyonu
  const renderPickerContent = () => {
    if (!activePicker) return null;

    const isSubject = activePicker.type === 'subject';
    const data = isSubject ? subjects : (topicsBySubject[items[activePicker.index]?.subject_id] || []);

    return (
      <Modal visible={activePicker !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setActivePicker(null)}
            activeOpacity={1}
          />
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {isSubject ? 'Ders Seçin' : 'Konu Seçin'}
              </Text>
              <TouchableOpacity onPress={() => setActivePicker(null)}>
                <Ionicons name="close-circle" size={28} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={data}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.pickerItem, { borderBottomColor: colors.border }]}
                  onPress={() => isSubject ? addItem(item) : selectTopic(activePicker.index, item)}
                >
                  <Text style={[styles.pickerItemText, { color: colors.text }]}>{item.name}</Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.primary} />
                </TouchableOpacity>
              )}
              ListHeaderComponent={!isSubject && (
                <TouchableOpacity
                  style={[styles.pickerItem, { borderBottomColor: colors.border }]}
                  onPress={() => selectTopic(activePicker.index, null)}
                >
                  <Text style={{ color: colors.textMuted, fontStyle: 'italic' }}>Konu Belirtmek İstemiyorum</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingBottom: 40 }}
            />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Tarih Bölümü */}
        <View style={[styles.dateHeader, { backgroundColor: colors.primary }]}>
          <Ionicons name="calendar" size={20} color="#fff" />
          <Text style={styles.dateText}>{displayDate}</Text>
        </View>

        {/* Plan Detayları */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Plan Başlığı</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            value={title}
            onChangeText={setTitle}
            placeholder="Örn: Hafta Sonu Tekrarı"
            placeholderTextColor={colors.textMuted}
          />
          <Text style={[styles.label, { color: colors.textSecondary, marginTop: 15 }]}>Not</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border, minHeight: 60 }]}
            value={note}
            onChangeText={setNote}
            placeholder="Önemli notlarını buraya yaz..."
            placeholderTextColor={colors.textMuted}
            multiline
          />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>📚 Çalışılacak Dersler</Text>

        {/* Seçilen Ders Kartları */}
        {items.map((item, index) => (
          <View key={index} style={[styles.itemCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.itemHeader}>
              <View style={[styles.subjectTag, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.subjectTagText, { color: colors.primary }]}>{item.subject_name}</Text>
              </View>
              <TouchableOpacity onPress={() => removeItem(index)}>
                <Ionicons name="trash-outline" size={22} color={colors.error} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.selectorTrigger, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={() => {
                loadTopics(item.subject_id);
                setActivePicker({ type: 'topic', index });
              }}
            >
              <Text style={{ color: item.topic_name ? colors.text : colors.textMuted, flex: 1 }}>
                {item.topic_name || 'Konu Seç (Opsiyonel)'}
              </Text>
              <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
            </TouchableOpacity>

            <View style={styles.durationRow}>
              <Text style={[styles.smallLabel, { color: colors.textSecondary }]}>Süre (dk):</Text>
              <View style={styles.durationChips}>
                {DURATIONS.map((d) => (
                  <TouchableOpacity
                    key={d}
                    onPress={() => updateItem(index, 'duration_minutes', d)}
                    style={[
                      styles.chip,
                      item.duration_minutes === d ? { backgroundColor: colors.primary } : { backgroundColor: colors.border }
                    ]}
                  >
                    <Text style={[styles.chipText, item.duration_minutes === d && { color: '#fff' }]}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ))}

        {/* Ders Ekleme Butonu */}
        <TouchableOpacity
          style={[styles.addButton, { borderColor: colors.primary }]}
          onPress={() => setActivePicker({ type: 'subject' })}
        >
          <Ionicons name="add-circle" size={24} color={colors.primary} />
          <Text style={[styles.addButtonText, { color: colors.primary }]}>Ders Ekle</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Kaydet Butonu (Sabit Alt Kısım) */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <Button title="Planı Tamamla ve Kaydet" onPress={handleSave} loading={saving} />
      </View>

      {renderPickerContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 16 },
  dateHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: 12, borderRadius: 12, marginBottom: 15, gap: 8
  },
  dateText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  card: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },

  // Ders Kartları
  itemCard: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 12, elevation: 1 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  subjectTag: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  subjectTagText: { fontWeight: '700', fontSize: 14 },
  selectorTrigger: {
    flexDirection: 'row', alignItems: 'center', padding: 12,
    borderRadius: 10, borderWidth: 1, marginBottom: 12
  },
  durationRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  smallLabel: { fontSize: 13, fontWeight: '500' },
  durationChips: { flexDirection: 'row', gap: 6 },
  chip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15, minWidth: 40, alignItems: 'center' },
  chipText: { fontSize: 12, fontWeight: '600' },

  // Ekleme Butonu
  addButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: 15, borderWidth: 2, borderStyle: 'dashed', borderRadius: 15, gap: 8, marginTop: 10
  },
  addButtonText: { fontSize: 16, fontWeight: 'bold' },

  // Modal Stilleri
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: {
    borderTopLeftRadius: 25, borderTopRightRadius: 25,
    maxHeight: SCREEN_HEIGHT * 0.7, padding: 20
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  pickerItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1
  },
  pickerItemText: { fontSize: 16, fontWeight: '500' },

  // Sabit Alt Buton
  footer: { padding: 16, borderTopWidth: 1 }
});