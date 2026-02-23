import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { messageApi } from '../../services/api';
import { useTheme, Loading, Empty } from '../../components/common';
import UserAvatar from '../../components/UserAvatar';
import OnlineBadge from '../../components/OnlineBadge';

export default function ConversationsScreen({ navigation }) {
  const colors = useTheme();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const load = async () => {
    try {
      const data = await messageApi.listConversations();
      console.log("mesaj", data)
      setConversations(data || []);
    } catch { }
    setLoading(false);
  };

  const totalUnread = conversations.reduce((s, c) => s + (c.unread_count || 0), 0);

  return (
    <View style={{ flex: 1, paddingTop: '12%', backgroundColor: colors.background }}>
      {totalUnread > 0 && (
        <View style={[styles.unreadBanner, { backgroundColor: colors.primary + '18' }]}>
          <Text style={[styles.unreadBannerText, { color: colors.primary }]}>
            {totalUnread} okunmamış mesajın var
          </Text>
        </View>
      )}

      {loading ? <Loading /> : (
        <FlatList
          data={conversations}
          keyExtractor={(i) => i.peer_id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Empty icon="💬" title="Henüz mesajın yok" subtitle="Koçun veya öğrencin ile konuşmaya başla" />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => navigation.navigate('Chat', { peer: { id: item.peer_id, name: item.peer_name, avatar_id: item.peer_avatar_id } })}
              activeOpacity={0.8}
            >
              {/* Avatar + online nokta */}
              <View style={styles.avatarWrap}>
                <UserAvatar avatarId={item.peer_avatar_id} size={50} />
                <View style={[
                  styles.onlineDot,
                  { backgroundColor: item.peer_online ? colors.success : colors.textMuted, borderColor: colors.card },
                ]} />
              </View>

              {/* Bilgi */}
              <View style={{ flex: 1 }}>
                <View style={styles.nameRow}>
                  <Text style={[styles.name, { color: colors.text }]}>{item.peer_name}</Text>
                  <Text style={[styles.time, { color: colors.textMuted }]}>
                    {formatTime(item.last_at)}
                  </Text>
                </View>
                <View style={styles.previewRow}>
                  <Text
                    style={[
                      styles.preview,
                      { color: item.unread_count > 0 ? colors.text : colors.textMuted },
                      item.unread_count > 0 && { fontWeight: '700' },
                    ]}
                    numberOfLines={1}
                  >
                    {item.last_message}
                  </Text>
                  {item.unread_count > 0 && (
                    <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                      <Text style={styles.badgeText}>
                        {item.unread_count > 99 ? '99+' : item.unread_count}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Az önce';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}dk`;
  if (diff < 86400000) return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  if (diff < 604800000) {
    const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    return days[d.getDay()];
  }
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  unreadBanner: { paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center' },
  unreadBannerText: { fontSize: 13, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, borderWidth: 1, marginBottom: 10 },
  avatarWrap: { position: 'relative', marginRight: 12 },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 13, height: 13, borderRadius: 7, borderWidth: 2 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  name: { fontSize: 15, fontWeight: '700' },
  time: { fontSize: 12 },
  previewRow: { flexDirection: 'row', alignItems: 'center' },
  preview: { flex: 1, fontSize: 13 },
  badge: { minWidth: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, marginLeft: 8 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
});
