import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Modal,
  TouchableOpacity, Animated, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AVATARS } from '../utils/avatars';
import { useTheme } from '../components/common';
import AvatarFrame from './AvatarFrame';

const NUM_COLS = 4;

const SECTION_STARTS = {
  11: { label: '✦ Modern', color: '#60A5FA' },
  19: { label: '⬡ Premium', color: '#FB923C' },
  23: { label: '✦ Cosmic', color: '#A855F7' },
  28: { label: '♛ Elite', color: '#FFD700' },
};

function getTierBadge(id) {
  if (id >= 28) return { label: 'ELİTE', color: '#FFD700', bg: '#0A0A0A' };
  if (id >= 23) return { label: 'COSMİC', color: '#A855F7', bg: '#0F172A' };
  if (id >= 19) return { label: 'PREMIUM', color: '#FB923C', bg: '#1C0A00' };
  if (id >= 11) return { label: 'MODERN', color: '#60A5FA', bg: '#0F172A' };
  return null;
}

function AvatarCard({ item, index, isSelected, onSelect, onClose, colors }) {
  const enterAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(enterAnim, {
      toValue: 1,
      delay: index * 35,
      useNativeDriver: true,
      speed: 14,
      bounciness: 9,
    }).start();
  }, []);

  const handlePressIn = () =>
    Animated.spring(pressAnim, { toValue: 0.87, useNativeDriver: true, speed: 50 }).start();
  const handlePressOut = () =>
    Animated.spring(pressAnim, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 14 }).start();

  const tier = getTierBadge(item.id);
  const frameSize = item.id >= 28 ? 70 : item.id >= 23 ? 64 : item.id >= 19 ? 58 : item.id >= 11 ? 54 : 50;
  const innerSize = frameSize * 0.70;
  const offset = (frameSize - innerSize) / 2;

  return (
    <Animated.View style={{
      flex: 1, margin: 4,
      transform: [{ scale: Animated.multiply(enterAnim, pressAnim) }],
    }}>
      <TouchableOpacity
        onPress={() => { onSelect(item.id); onClose(); }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[
          styles.cell,
          isSelected && {
            backgroundColor: colors.primaryLight,
            borderRadius: 16,
            borderWidth: 2,
            borderColor: colors.primary,
          },
        ]}
      >
        {/* Tier rozeti */}
        {tier && (
          <View style={[styles.tierBadge, { backgroundColor: tier.bg }]}>
            <Text style={[styles.tierText, { color: tier.color }]}>{tier.label}</Text>
          </View>
        )}

        {/* Çerçeve + emoji */}
        <View style={{ width: frameSize, height: frameSize }}>
          <View style={{ position: 'absolute', inset: 0 }}>
            <AvatarFrame avatarId={item.id} color={item.color} size={frameSize} />
          </View>
          <View style={{
            position: 'absolute',
            top: offset, left: offset,
            width: innerSize, height: innerSize,
            borderRadius: innerSize / 2,
            backgroundColor: item.bg,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{ fontSize: innerSize * 0.52 }}>{item.emoji}</Text>
          </View>
        </View>

        {/* İsim */}
        <Text style={[styles.name, {
          color: item.id >= 23 ? item.color : colors.textSecondary,
          fontWeight: item.id >= 28 ? '900' : item.id >= 23 ? '800' : item.id >= 11 ? '700' : '600',
          fontSize: item.id >= 28 ? 12 : 11,
          marginTop: 6,
        }]} numberOfLines={1}>
          {item.name}
        </Text>

        {/* Seçim tiki */}
        {isSelected && (
          <View style={[styles.checkBadge, { backgroundColor: colors.primary }]}>
            <Ionicons name="checkmark" size={10} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function AvatarPickerModal({ visible, currentId, onSelect, onClose }) {
  const colors = useTheme();

  // Satır + section header yapısı
  const rows = [];
  let currentRow = [];
  let idx = 0;

  AVATARS.forEach((avatar) => {
    const section = SECTION_STARTS[avatar.id];
    if (section) {
      if (currentRow.length > 0) {
        rows.push({ type: 'avatarRow', items: currentRow, key: `row-${currentRow[0].id}` });
        currentRow = [];
      }
      rows.push({ type: 'header', ...section, key: `header-${avatar.id}` });
    }
    currentRow.push({ ...avatar, _index: idx++ });
    if (currentRow.length === NUM_COLS) {
      rows.push({ type: 'avatarRow', items: currentRow, key: `row-${currentRow[0].id}` });
      currentRow = [];
    }
  });
  if (currentRow.length > 0) {
    rows.push({ type: 'avatarRow', items: currentRow, key: `row-${currentRow[0].id}` });
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Avatar Seç</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Aşağı kaydır • Daha premium çerçeveler seni bekliyor ✨
          </Text>

          <FlatList
            data={rows}
            keyExtractor={(item) => item.key}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            renderItem={({ item }) => {
              if (item.type === 'header') {
                return (
                  <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionLabel, { color: item.color }]}>{item.label}</Text>
                    <View style={[styles.sectionLine, { backgroundColor: item.color + '44' }]} />
                  </View>
                );
              }
              return (
                <View style={{ flexDirection: 'row' }}>
                  {item.items.map((avatar) => (
                    <AvatarCard
                      key={avatar.id}
                      item={avatar}
                      index={avatar._index}
                      isSelected={currentId === avatar.id}
                      onSelect={onSelect}
                      onClose={onClose}
                      colors={colors}
                    />
                  ))}
                  {Array(NUM_COLS - item.items.length).fill(null).map((_, i) => (
                    <View key={i} style={{ flex: 1, margin: 4 }} />
                  ))}
                </View>
              );
            }}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 40, maxHeight: '82%' },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  title: { fontSize: 18, fontWeight: '800' },
  subtitle: { fontSize: 12, marginBottom: 14 },
  cell: { alignItems: 'center', padding: 8, position: 'relative' },
  name: { textAlign: 'center' },
  checkBadge: {
    position: 'absolute', top: 4, right: 4,
    width: 18, height: 18, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
  },
  tierBadge: {
    position: 'absolute', top: 4, left: 4,
    paddingHorizontal: 4, paddingVertical: 1,
    borderRadius: 4, zIndex: 10,
  },
  tierText: { fontSize: 7, fontWeight: '900', letterSpacing: 0.5 },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 14, marginBottom: 6,
    paddingHorizontal: 4, paddingVertical: 6, gap: 8,
  },
  sectionLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 1.2 },
  sectionLine: { flex: 1, height: 1 },
});