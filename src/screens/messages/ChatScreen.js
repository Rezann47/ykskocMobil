import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  ActivityIndicator, SafeAreaView, StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { messageApi } from '../../services/api';
import { useStore } from '../../store';
import { useTheme } from '../../components/common';
import UserAvatar from '../../components/UserAvatar';

const POLL_INTERVAL = 4000;

export default function ChatScreen({ route, navigation }) {
  const { peer } = route.params;
  const colors = useTheme();
  const { user } = useStore();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const listRef = useRef(null);
  const pollRef = useRef(null);
  const newestRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({ title: peer.name });
  }, [peer]);

  useFocusEffect(
    useCallback(() => {
      loadInitial();
      startPolling();
      return () => stopPolling();
    }, [])
  );

  const loadInitial = async () => {
    setLoading(true);
    try {
      const data = await messageApi.getConversation(peer.id, 1);
      const msgs = (data?.data || []).reverse();
      setMessages(msgs);
      setHasMore((data?.data?.length || 0) >= 30);
      if (msgs.length > 0) newestRef.current = msgs[msgs.length - 1].id;
      await messageApi.markRead(peer.id);
    } catch (e) { }
    setLoading(false);
  };

  const poll = async () => {
    try {
      const data = await messageApi.getConversation(peer.id, 1);
      const fresh = (data?.data || []).reverse();
      if (fresh.length === 0) return;

      const latestId = fresh[fresh.length - 1].id;
      if (latestId === newestRef.current) return;

      setMessages(prev => {
        const existing = new Set(prev.map(m => m.id));
        const newOnes = fresh.filter(m => !existing.has(m.id));
        if (newOnes.length === 0) return prev;
        newestRef.current = latestId;
        return [...prev, ...newOnes];
      });
      await messageApi.markRead(peer.id);
    } catch (e) { }
  };

  const startPolling = () => { pollRef.current = setInterval(poll, POLL_INTERVAL); };
  const stopPolling = () => { if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; } };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const data = await messageApi.getConversation(peer.id, nextPage);
      const older = (data?.data || []).reverse();
      setMessages(prev => [...older, ...prev]);
      setHasMore(older.length >= 30);
      setPage(nextPage);
    } catch (e) { }
    setLoadingMore(false);
  };

  const send = async () => {
    const content = text.trim();
    if (!content || sending) return;
    setText('');
    setSending(true);

    const tempMsg = {
      id: `temp-${Date.now()}`,
      sender_id: user.id,
      receiver_id: peer.id,
      content,
      is_read: false,
      created_at: new Date().toISOString(),
      is_mine: true,
      _temp: true,
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      const real = await messageApi.send({ receiver_id: peer.id, content });
      setMessages(prev => prev.map(m => m.id === tempMsg.id ? real : m));
      newestRef.current = real.id;
    } catch (e) {
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
      setText(content);
    }
    setSending(false);
  };

  const renderMessage = ({ item, index }) => {
    const isMine = item.is_mine || item.sender_id === user?.id;
    const prevMsg = index > 0 ? messages[index - 1] : null;
    const showAvatar = !isMine && (!prevMsg || prevMsg.sender_id !== item.sender_id);
    const showTime = shouldShowTime(item, prevMsg);

    return (
      <View>
        {showTime && <Text style={[styles.timeLabel, { color: colors.textMuted }]}>{formatFullTime(item.created_at)}</Text>}
        <View style={[styles.msgRow, isMine ? styles.msgRowMine : styles.msgRowTheirs]}>
          {!isMine && (
            <View style={styles.avatarSpace}>
              {showAvatar ? <UserAvatar avatarId={peer.avatar_id} size={28} /> : <View style={{ width: 28 }} />}
            </View>
          )}
          <View style={[styles.bubble, isMine ? { backgroundColor: colors.primary, borderBottomRightRadius: 4 } : { backgroundColor: colors.card, borderColor: colors.border, borderBottomLeftRadius: 4, borderWidth: 1 }, item._temp && { opacity: 0.7 }]}>
            <Text style={[styles.bubbleText, { color: isMine ? '#fff' : colors.text }]}>{item.content}</Text>
            <View style={styles.bubbleMeta}>
              <Text style={[styles.bubbleTime, { color: isMine ? 'rgba(255,255,255,0.7)' : colors.textMuted }]}>{formatShortTime(item.created_at)}</Text>
              {isMine && <Ionicons name={item.is_read ? 'checkmark-done' : 'checkmark'} size={12} color={item.is_read ? '#fff' : 'rgba(255,255,255,0.5)'} style={{ marginLeft: 3 }} />}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={colors.dark ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {loading ? (
          <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => m.id.toString()}
            contentContainerStyle={styles.list}
            onEndReached={loadMore}
            onEndReachedThreshold={0.2}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => listRef.current?.scrollToEnd({ animated: true })}
            ListHeaderComponent={loadingMore ? <ActivityIndicator style={{ marginVertical: 10 }} color={colors.primary} /> : null}
            renderItem={renderMessage}
          />
        )}

        <View style={[styles.inputBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
            placeholder="Mesaj yaz..."
            placeholderTextColor={colors.textMuted}
            value={text}
            onChangeText={setText}
            multiline
            maxLength={2000}
          />
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: text.trim() ? colors.primary : colors.border }]}
            onPress={send}
            disabled={!text.trim() || sending}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Yardımcı Fonksiyonlar
function shouldShowTime(msg, prev) {
  if (!prev) return true;
  return new Date(msg.created_at) - new Date(prev.created_at) > 5 * 60 * 1000;
}
function formatShortTime(dateStr) {
  const d = new Date(dateStr);
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}
function formatFullTime(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return `Bugün ${formatShortTime(dateStr)}`;
  return `${d.getDate()}/${d.getMonth() + 1} ${formatShortTime(dateStr)}`;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: 12, paddingBottom: 20, paddingTop: 10 },
  timeLabel: { textAlign: 'center', fontSize: 11, marginVertical: 12, fontWeight: '500' },
  msgRow: { flexDirection: 'row', marginBottom: 6, alignItems: 'flex-end' },
  msgRowMine: { justifyContent: 'flex-end' },
  msgRowTheirs: { justifyContent: 'flex-start' },
  avatarSpace: { marginRight: 6, width: 28 },
  bubble: { maxWidth: '80%', borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8 },
  bubbleText: { fontSize: 16, lineHeight: 22 },
  bubbleMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 2 },
  bubbleTime: { fontSize: 10 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 0.5,
    paddingBottom: Platform.OS === 'ios' ? 5 : 8
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 16,
    maxHeight: 100
  },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
});