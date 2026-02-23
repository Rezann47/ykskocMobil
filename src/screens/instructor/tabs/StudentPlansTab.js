import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { instructorApi } from '../../../services/api';
import { useTheme, Empty } from '../../../components/common';

const WEEK_DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

function toLocal(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function formatDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function StudentPlansTab({ studentId, navigation }) {
  const colors = useTheme();
  const today = toLocal(new Date());

  const [calDate, setCalDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [plans, setPlans] = useState([]);
  const [markedDates, setMarkedDates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPlans(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    loadMarked(calDate.getFullYear(), calDate.getMonth() + 1);
  }, [calDate]);

  const loadPlans = async (date) => {
    setLoading(true);
    try {
      const data = await instructorApi.studentPlans(studentId, formatDate(date));
      setPlans(data || []);
    } catch (e) {
      console.log(e.message);
    }
    setLoading(false);
  };

  const loadMarked = async (year, month) => {
    try {
      const start = formatDate(new Date(year, month - 1, 1));
      const data = await instructorApi.studentPlans(studentId, start);
      setMarkedDates((data || []).map(p => p.plan_date));
    } catch { }
  };

  const prevMonth = () => {
    const d = new Date(calDate.getFullYear(), calDate.getMonth() - 1, 1);
    setCalDate(d);
  };

  const nextMonth = () => {
    const d = new Date(calDate.getFullYear(), calDate.getMonth() + 1, 1);
    setCalDate(d);
  };

  const buildDays = () => {
    const year = calDate.getFullYear();
    const month = calDate.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    let offset = first.getDay() - 1;
    if (offset < 0) offset = 6;
    const days = [];
    for (let i = 0; i < offset; i++) days.push(null);
    for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
    return days;
  };

  const isSelected = (d) => d && formatDate(d) === formatDate(selectedDate);
  const isToday = (d) => d && formatDate(d) === formatDate(today);
  const hasMarker = (d) => d && markedDates.includes(formatDate(d));

  return (
    <>
      {/* ─── Takvim ─── */}
      <View style={[styles.calendar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.calHeader}>
          <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
            <Ionicons name="chevron-back" size={22} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.calMonth, { color: colors.text }]}>
            {MONTHS[calDate.getMonth()]} {calDate.getFullYear()}
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
          {buildDays().map((date, i) => (
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
                  backgroundColor: colors.primary + '15',
                },
              ]}
              onPress={() => date && setSelectedDate(toLocal(date))}
              disabled={!date}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.dayText,
                { color: date ? (isSelected(date) ? '#fff' : colors.text) : 'transparent' },
                date && isSelected(date) && { fontWeight: '800' },
              ]}>
                {date ? date.getDate() : ''}
              </Text>
              {date && hasMarker(date) && (
                <View style={[styles.dot, { backgroundColor: isSelected(date) ? '#fff' : colors.primary }]} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ─── Seçili Gün + Plan Ekle ─── */}
      <View style={styles.dateHeader}>
        <Text style={[styles.dateTitle, { color: colors.text }]}>
          {selectedDate.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Text>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('AddStudyPlan', {
            date: formatDate(selectedDate),
            studentId,
          })}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addBtnText}>Plan Ekle</Text>
        </TouchableOpacity>
      </View>

      {/* ─── Plan Listesi ─── */}
      {!loading && (
        plans.length === 0 ? (
          <Empty icon="📅" title="Bu gün için plan yok" subtitle="Plan ekleyebilirsin" />
        ) : (
          plans.map((plan) => (
            <View key={plan.id} style={[styles.planCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.planHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.planTitle, { color: colors.text }]}>{plan.title}</Text>
                  {plan.note && (
                    <Text style={[styles.planNote, { color: colors.textMuted }]}>{plan.note}</Text>
                  )}
                </View>
                <View style={[styles.badge, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.badgeText, { color: colors.primary }]}>
                    {plan.items?.filter(i => i.is_completed).length || 0}/{plan.items?.length || 0}
                  </Text>
                </View>
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

              {plan.items?.map((item, idx) => (
                <View
                  key={item.id}
                  style={[
                    styles.planItem,
                    {
                      borderBottomColor: colors.border,
                      borderBottomWidth: idx < plan.items.length - 1 ? 1 : 0,
                      opacity: item.is_completed ? 0.6 : 1,
                    },
                  ]}
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
                      <Text style={[styles.itemTopic, { color: colors.textMuted }]}>{item.topic_name}</Text>
                    )}
                  </View>
                  <View style={[styles.durationBadge, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.durationText, { color: colors.primary }]}>{item.duration_minutes} dk</Text>
                  </View>
                </View>
              ))}
            </View>
          ))
        )
      )}
    </>
  );
}

const styles = StyleSheet.create({
  // Takvim — StudyPlanScreen ile birebir aynı
  calendar: { borderRadius: 20, borderWidth: 1, padding: 12, paddingBottom: 16, marginBottom: 16 },
  calHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  navBtn: { padding: 4 },
  calMonth: { fontSize: 17, fontWeight: '700' },
  weekRow: { flexDirection: 'row', marginBottom: 8 },
  weekDay: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', opacity: 0.6 },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    width: '12%',
    marginHorizontal: '1.14%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginVertical: 4,
  },
  dayText: { fontSize: 15, fontWeight: '600' },
  dot: { width: 5, height: 5, borderRadius: 2.5, position: 'absolute', bottom: 4 },

  // Gün başlığı
  dateHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  dateTitle: { fontSize: 16, fontWeight: '700' },
  addBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, gap: 4, elevation: 2 },
  addBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },

  // Planlar
  planCard: { borderRadius: 16, borderWidth: 1, marginBottom: 16, overflow: 'hidden', elevation: 1 },
  planHeader: { flexDirection: 'row', alignItems: 'flex-start', padding: 16 },
  planTitle: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  planNote: { fontSize: 13, marginTop: 4, fontStyle: 'italic' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  progressRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 8, marginBottom: 12 },
  progressTrack: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  progressText: { fontSize: 12, fontWeight: '700', minWidth: 35 },
  planItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  itemCheck: { width: 24, height: 24, borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  itemSubject: { fontSize: 15, fontWeight: '600', marginBottom: 1 },
  itemTopic: { fontSize: 12 },
  durationBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  durationText: { fontSize: 12, fontWeight: '700' },
});