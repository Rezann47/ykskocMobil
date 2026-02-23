import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { studyPlanApi } from '../../services/api';
import { useStore } from '../../store';
import { Card, useTheme, Loading, Empty } from '../../components/common';
import AdBanner from '../../components/ads/BannerAd';

const WEEK_DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

function toLocalDate(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function formatDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function StudyPlanScreen({ navigation }) {
  const colors = useTheme();
  const { user } = useStore();

  const today = toLocalDate(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [calendarDate, setCalendarDate] = useState(today);
  const [plans, setPlans] = useState([]);
  const [monthPlans, setMonthPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadPlans(selectedDate);
      loadMonth(calendarDate.getFullYear(), calendarDate.getMonth() + 1);
    }, [selectedDate, calendarDate])
  );

  const loadPlans = async (date) => {
    setLoading(true);
    try {
      const data = await studyPlanApi.listByDate(formatDate(date));
      setPlans(data || []);
    } catch (e) {
      console.log(e.message);
    }
    setLoading(false);
  };

  const loadMonth = async (year, month) => {
    try {
      const data = await studyPlanApi.listByMonth(year, month);
      setMonthPlans(data || []);
    } catch { }
  };

  const handleDatePress = (date) => {
    setSelectedDate(date);
    loadPlans(date);
  };

  const prevMonth = () => {
    const d = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1);
    setCalendarDate(d);
    loadMonth(d.getFullYear(), d.getMonth() + 1);
  };

  const nextMonth = () => {
    const d = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1);
    setCalendarDate(d);
    loadMonth(d.getFullYear(), d.getMonth() + 1);
  };

  const handleDelete = (id) => {
    Alert.alert('Planı Sil', 'Bu çalışma planını silmek istiyor musun?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive', onPress: async () => {
          try {
            await studyPlanApi.delete(id);
            loadPlans(selectedDate);
          } catch (e) {
            Alert.alert('Hata', e.message);
          }
        },
      },
    ]);
  };

  const handleCompleteItem = async (planId, itemId, isCompleted) => {
    try {
      if (isCompleted) {
        await studyPlanApi.uncompleteItem(planId, itemId);
      } else {
        await studyPlanApi.completeItem(planId, itemId);
      }
      loadPlans(selectedDate);
    } catch (e) {
      Alert.alert('Hata', e.message);
    }
  };

  const buildCalendarDays = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;

    const days = [];
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  };

  const hasPlan = (date) => {
    if (!date) return false;
    const ds = formatDate(date);
    return monthPlans.some((p) => p.plan_date === ds);
  };

  const isSelected = (date) => {
    if (!date) return false;
    return formatDate(date) === formatDate(selectedDate);
  };

  const isToday = (date) => {
    if (!date) return false;
    return formatDate(date) === formatDate(today);
  };

  const calDays = buildCalendarDays();

  return (
    <ScrollView style={{ flex: 1, paddingTop: '10%', backgroundColor: colors.background }}>
      {/* ─── Takvim ─── */}
      <View style={[styles.calendar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.calHeader}>
          <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
            <Ionicons name="chevron-back" size={22} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.calMonth, { color: colors.text }]}>
            {MONTHS[calendarDate.getMonth()]} {calendarDate.getFullYear()}
          </Text>
          <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
            <Ionicons name="chevron-forward" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.weekRow}>
          {WEEK_DAYS.map((d) => (
            <Text key={d} style={[styles.weekDay, { color: colors.textMuted }]}>{d}</Text>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {calDays.map((date, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.dayCell,
                date && isSelected(date) && {
                  backgroundColor: colors.primary,
                  elevation: 4,
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                },
                date && isToday(date) && !isSelected(date) && {
                  borderWidth: 1.5,
                  borderColor: colors.primary,
                  backgroundColor: colors.primary + '15' // Hafif vurgu
                },
              ]}
              onPress={() => date && handleDatePress(toLocalDate(date))}
              disabled={!date}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.dayText,
                { color: date ? (isSelected(date) ? '#fff' : colors.text) : 'transparent' },
                date && isSelected(date) && { fontWeight: '800' }
              ]}>
                {date ? date.getDate() : ''}
              </Text>
              {date && hasPlan(date) && (
                <View style={[
                  styles.dot,
                  { backgroundColor: isSelected(date) ? '#fff' : colors.primary },
                ]} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.dateHeader}>
        <Text style={[styles.dateTitle, { color: colors.text }]}>
          {selectedDate.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Text>
        {user?.role === 'student' && (
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('AddStudyPlan', { date: formatDate(selectedDate) })}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addBtnText}>Plan Ekle</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        {loading ? <Loading /> : plans.length === 0 ? (
          <Empty
            icon="📅"
            title="Bu gün için plan yok"
            subtitle={user?.role === 'student' ? '"Plan Ekle" butonuna tıkla' : 'Koçun henüz plan eklememiş'}
          />
        ) : (
          plans.map((plan) => (
            <View key={plan.id} style={[styles.planCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.planHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.planTitle, { color: colors.text }]}>{plan.title}</Text>
                  {plan.creator_name && plan.created_by !== plan.user_id && (
                    <Text style={[styles.planCreator, { color: colors.primary }]}>
                      👨‍🏫 {plan.creator_name} tarafından
                    </Text>
                  )}
                  {plan.note && (
                    <Text style={[styles.planNote, { color: colors.textMuted }]}>{plan.note}</Text>
                  )}
                </View>
                {(plan.created_by === plan.user_id || user?.role === 'instructor') && (
                  <TouchableOpacity onPress={() => handleDelete(plan.id)} style={styles.deleteBtn}>
                    <Ionicons name="trash-outline" size={18} color={colors.error} />
                  </TouchableOpacity>
                )}
              </View>

              {plan.items?.length > 0 && (
                <View style={styles.progressRow}>
                  <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
                    <View style={[
                      styles.progressFill,
                      {
                        backgroundColor: colors.success,
                        width: `${Math.round(plan.items.filter(i => i.is_completed).length / plan.items.length * 100)}%`,
                      },
                    ]} />
                  </View>
                  <Text style={[styles.progressText, { color: colors.textMuted }]}>
                    {plan.items.filter(i => i.is_completed).length}/{plan.items.length}
                  </Text>
                </View>
              )}

              {plan.items?.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.planItem,
                    { borderBottomColor: colors.border },
                    item.is_completed && { opacity: 0.6 },
                  ]}
                  onPress={() => user?.role === 'student' && handleCompleteItem(plan.id, item.id, item.is_completed)}
                  activeOpacity={user?.role === 'student' ? 0.7 : 1}
                >
                  <View style={[
                    styles.itemCheck,
                    {
                      backgroundColor: item.is_completed ? colors.success : 'transparent',
                      borderColor: item.is_completed ? colors.success : colors.border,
                    },
                  ]}>
                    {item.is_completed && <Ionicons name="checkmark" size={12} color="#fff" />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[
                      styles.itemSubject,
                      { color: colors.text, textDecorationLine: item.is_completed ? 'line-through' : 'none' },
                    ]}>
                      {item.subject_name}
                    </Text>
                    {item.topic_name && (
                      <Text style={[styles.itemTopic, { color: colors.textMuted }]}>
                        {item.topic_name}
                      </Text>
                    )}
                  </View>
                  <View style={[styles.durationBadge, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.durationText, { color: colors.primary }]}>
                      {item.duration_minutes} dk
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))
        )}
        <AdBanner style={{ marginTop: 8 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  calendar: { margin: 16, borderRadius: 20, borderWidth: 1, padding: 12, paddingBottom: 16 },
  calHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  navBtn: { padding: 4 },
  calMonth: { fontSize: 17, fontWeight: '700' },
  weekRow: { flexDirection: 'row', marginBottom: 8 },
  weekDay: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', opacity: 0.6 },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    width: '12%', // Genişliği biraz azalttım (boşluk kalması için)
    marginHorizontal: '1.14%', // Yatayda eşit boşluk
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginVertical: 4, // Dikeyde satırlar arası boşluk artırıldı
  },
  dayText: { fontSize: 15, fontWeight: '600' },
  dot: { width: 5, height: 5, borderRadius: 2.5, position: 'absolute', bottom: 4 },
  dateHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, marginBottom: 12,
  },
  dateTitle: { fontSize: 16, fontWeight: '700' },
  addBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, gap: 4, elevation: 2 },
  addBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  content: { paddingHorizontal: 16, paddingBottom: 32 },
  planCard: { borderRadius: 16, borderWidth: 1, marginBottom: 16, overflow: 'hidden', elevation: 1 },
  planHeader: { flexDirection: 'row', alignItems: 'flex-start', padding: 16 },
  planTitle: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  planCreator: { fontSize: 12, fontWeight: '600', marginBottom: 2 },
  planNote: { fontSize: 13, marginTop: 4, fontStyle: 'italic' },
  deleteBtn: { padding: 4 },
  progressRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 8, marginBottom: 12 },
  progressTrack: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  progressText: { fontSize: 12, fontWeight: '700', minWidth: 35 },
  planItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1,
  },
  itemCheck: {
    width: 24, height: 24, borderRadius: 8, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  itemSubject: { fontSize: 15, fontWeight: '600', marginBottom: 1 },
  itemTopic: { fontSize: 12 },
  durationBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  durationText: { fontSize: 12, fontWeight: '700' },
});