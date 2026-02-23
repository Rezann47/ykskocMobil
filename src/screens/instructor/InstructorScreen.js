import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Modal, Alert, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { instructorApi } from '../../services/api';
import { Button, useTheme, Loading, Empty } from '../../components/common';
import UserAvatar from '../../components/UserAvatar';
import OnlineBadge from '../../components/OnlineBadge';

export default function InstructorScreen({ navigation }) {
  const colors = useTheme();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [code, setCode] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => { load(); }, []);

  // Listeyi her 30 saniyede bir yenile — online durumları güncel kalsın
  useEffect(() => {
    const interval = setInterval(load, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  const load = async () => {
    try {
      const data = await instructorApi.listStudents();
      setStudents(data?.data || []);
    } catch { }
    setLoading(false);
  };

  const addStudent = async () => {
    if (!code.trim()) return;
    setAdding(true);
    try {
      await instructorApi.addStudent(code.trim());
      setModal(false);
      setCode('');
      load();
    } catch (e) {
      Alert.alert('Hata', e.message);
    }
    setAdding(false);
  };

  const removeStudent = (student) => {
    Alert.alert('Öğrenciyi Çıkar', `${student.name} adlı öğrenciyi listenden çıkarmak istiyor musun?`, [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Çıkar', style: 'destructive', onPress: async () => {
          await instructorApi.removeStudent(student.id);
          load();
        },
      },
    ]);
  };

  // Online öğrenciler üstte
  const sorted = [...students].sort((a, b) => {
    if (a.is_online === b.is_online) return 0;
    return a.is_online ? -1 : 1;
  });

  const onlineCount = students.filter(s => s.is_online).length;

  return (
    <View style={{ flex: 1, paddingTop: '15%', backgroundColor: colors.background }}>
      <FlatList
        data={sorted}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <Button
              title="+ Öğrenci Ekle (Kod ile)"
              onPress={() => setModal(true)}
              style={{ marginBottom: 12 }}
            />
            {students.length > 0 && (
              <View style={[styles.onlineSummary, { backgroundColor: colors.success + '18' }]}>
                <View style={[styles.onlineDot, { backgroundColor: colors.success }]} />
                <Text style={[styles.onlineText, { color: colors.success }]}>
                  {onlineCount} öğrenci şu an aktif
                </Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          loading ? <Loading /> : (
            <Empty icon="👨‍🎓" title="Henüz öğrencin yok" subtitle="Öğrenci kodu ile ekle" />
          )
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.studentCard,
              { backgroundColor: colors.card, borderColor: item.is_online ? colors.success + '50' : colors.border },
              item.is_online && { borderWidth: 1.5 },
            ]}
            onPress={() => navigation.navigate('StudentDetail', { student: item })}
            activeOpacity={0.8}
          >
            {/* Avatar */}
            <View style={styles.avatarWrap}>
              <UserAvatar avatarId={item.avatar_id} size={46} />
              {/* Online nokta — avatar üzerine */}
              <View style={[
                styles.onlineIndicator,
                { backgroundColor: item.is_online ? colors.success : colors.textMuted, borderColor: colors.card },
              ]} />
            </View>

            {/* Bilgi */}
            <View style={{ flex: 1 }}>
              <Text style={[styles.studentName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.studentCode, { color: colors.textMuted }]}>
                {item.student_code}
              </Text>
              <OnlineBadge isOnline={item.is_online} lastSeenAt={item.last_seen_at} />
            </View>

            {/* Butonlar */}
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => navigation.navigate('StudentDetail', { student: item })}
                style={[styles.actionBtn, { backgroundColor: colors.primaryLight }]}
              >
                <Ionicons name="bar-chart-outline" size={16} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => removeStudent(item)}
                style={[styles.actionBtn, { backgroundColor: colors.error + '15' }]}
              >
                <Ionicons name="person-remove-outline" size={16} color={colors.error} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Öğrenci Ekle Modal */}
      <Modal visible={modal} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Öğrenci Ekle</Text>
            <Text style={[styles.modalSub, { color: colors.textSecondary }]}>
              Öğrencinin YKS kodunu gir
            </Text>
            <TextInput
              style={[styles.codeInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="YKS12345"
              placeholderTextColor={colors.textMuted}
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters"
              autoFocus
            />
            <View style={styles.modalBtns}>
              <Button title="İptal" variant="outline" onPress={() => setModal(false)} style={{ flex: 1 }} />
              <View style={{ width: 10 }} />
              <Button title="Ekle" onPress={addStudent} loading={adding} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  onlineSummary: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 12, marginBottom: 12 },
  onlineDot: { width: 8, height: 8, borderRadius: 4 },
  onlineText: { fontSize: 13, fontWeight: '700' },
  studentCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 10 },
  avatarWrap: { position: 'relative', marginRight: 12 },
  onlineIndicator: { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, borderWidth: 2 },
  studentName: { fontSize: 15, fontWeight: '700', marginBottom: 1 },
  studentCode: { fontSize: 12, marginBottom: 3 },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modalCard: { borderRadius: 20, padding: 20, borderWidth: 1 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 6 },
  modalSub: { fontSize: 14, marginBottom: 16 },
  codeInput: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 18, fontWeight: '700', letterSpacing: 2, marginBottom: 16, textAlign: 'center' },
  modalBtns: { flexDirection: 'row' },
});
