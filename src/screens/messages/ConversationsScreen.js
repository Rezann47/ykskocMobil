import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { messageApi, instructorApi } from '../../services/api';
import { useStore } from '../../store';
import { useTheme, Loading, Empty } from '../../components/common';
import UserAvatar from '../../components/UserAvatar';
import OnlineBadge from '../../components/OnlineBadge';

export default function ConversationsScreen({ navigation }) {
  const colors = useTheme();
  const { user } = useStore();
  const isStudent = user?.role === 'student';

  const [conversations, setConversations] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => { load(); }, []),
  );

  const load = async () => {
    try {
      const [convData, instrData] = await Promise.all([
        messageApi.listConversations(),
        isStudent ? instructorApi.listMyInstructors() : Promise.resolve([]),
      ]);
      setConversations(convData || []);
      setInstructors(instrData || []);
    } catch { }
    setLoading(false);
  };

  const openChat = (peer) => navigation.navigate('Chat', { peer });

  const totalUnread = conversations.reduce((s, c) => s + (c.unread_count || 0), 0);

  if (loading) return <Loading />;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
    >
      {/* ─── Koçlarım (sadece öğrenci) ─────────────── */}
      {isStudent && (
        <View style={{ marginBottom: 24 }}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>KOÇLARIM</Text>

          {instructors.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                Henüz seni takip eden bir koç yok.{'\n'}
                Kodunu paylaş:{' '}
                <Text style={{ color: colors.primary, fontWeight: '800' }}>
                  {user?.student_code}
                </Text>
              </Text>
            </View>
          ) : (
            instructors.map((inst) => (
              <TouchableOpacity
                key={inst.id}
                style={[
                  styles.peerCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: inst.is_online ? colors.success + '60' : colors.border,
                    borderWidth: inst.is_online ? 1.5 : 1,
                  },
                ]}
                onPress={() => openChat({
                  id: inst.id, name: inst.name,
                  avatar_id: inst.avatar_id,
                  is_online: inst.is_online,
                  last_seen_at: inst.last_seen_at,
                })}
                activeOpacity={0.8}
              >
                <View style={styles.avatarWrap}>
                  <UserAvatar avatarId={inst.avatar_id} size={48} />
                  <View style={[
                    styles.onlineDot,
                    { backgroundColor: inst.is_online ? colors.success : colors.textMuted, borderColor: colors.card },
                  ]} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.peerName, { color: colors.text }]}>{inst.name}</Text>

                </View>
                <View style={[styles.msgBtn, { backgroundColor: colors.primary }]}>
                  <Ionicons name="chatbubble" size={14} color="#fff" />
                  <Text style={styles.msgBtnText}>Mesaj</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

      {/* ─── Konuşmalar ─────────────────────────────── */}
      <View>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>KONUŞMALAR</Text>
          {totalUnread > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.unreadBadgeText}>{totalUnread}</Text>
            </View>
          )}
        </View>

        {conversations.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="chatbubble-ellipses-outline" size={30} color={colors.textMuted} style={{ marginBottom: 8 }} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              {isStudent
                ? 'Koçuna yukarıdan mesaj gönder!'
                : 'Öğrenci kartındaki 💬 butonuna bas!'}
            </Text>
          </View>
        ) : (
          conversations.map((item) => (
            <TouchableOpacity
              key={item.peer_id}
              style={[styles.peerCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}
              onPress={() => openChat({
                id: item.peer_id, name: item.peer_name,
                avatar_id: item.peer_avatar_id,
                is_online: item.peer_online,
                last_seen_at: item.peer_last_seen_at,
              })}
              activeOpacity={0.8}
            >
              <View style={styles.avatarWrap}>
                <UserAvatar avatarId={item.peer_avatar_id} size={48} />
                <View style={[
                  styles.onlineDot,
                  { backgroundColor: item.peer_online ? colors.success : colors.textMuted, borderColor: colors.card },
                ]} />
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.convNameRow}>
                  <Text style={[styles.peerName, { color: colors.text }]}>{item.peer_name}</Text>
                  <Text style={[styles.timeText, { color: colors.textMuted }]}>{formatTime(item.last_at)}</Text>
                </View>
                <Text
                  style={[
                    styles.lastMsg,
                    { color: item.unread_count > 0 ? colors.text : colors.textMuted },
                    item.unread_count > 0 && { fontWeight: '700' },
                  ]}
                  numberOfLines={1}
                >
                  {item.last_message}
                </Text>
              </View>

              {item.unread_count > 0 && (
                <View style={[styles.unreadPill, { backgroundColor: colors.primary }]}>
                  <Text style={styles.unreadPillText}>
                    {item.unread_count > 99 ? '99+' : item.unread_count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const diff = Date.now() - d.getTime();
  if (diff < 60_000) return 'Az önce';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}dk`;
  if (diff < 86_400_000) return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  if (diff < 604_800_000) return days[d.getDay()];
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: '15%', paddingBottom: 32 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  sectionTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 10 },
  emptyCard: { borderWidth: 1, borderRadius: 16, padding: 20, alignItems: 'center', borderStyle: 'dashed' },
  emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
  peerCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 14, marginBottom: 10 },
  avatarWrap: { position: 'relative', marginRight: 12 },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, borderWidth: 2 },
  peerName: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  msgBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  msgBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  convNameRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  timeText: { fontSize: 12 },
  lastMsg: { fontSize: 13 },
  unreadBadge: { minWidth: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  unreadBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  unreadPill: { minWidth: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, marginLeft: 8 },
  unreadPillText: { color: '#fff', fontSize: 11, fontWeight: '800' },
});
