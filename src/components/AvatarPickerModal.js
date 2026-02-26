import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Modal,
  TouchableOpacity, Animated, FlatList, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AVATARS } from '../utils/avatars';
import { useTheme } from '../components/common';
import AvatarFrame from './AvatarFrame';
import UserAvatar from './UserAvatar';

const { width: SW } = Dimensions.get('window');
const NUM_COLS = 4;

// Tier bilgileri
const TIER = {
  elite: { min: 28, label: '♛ ELİTE', color: '#FFD700', bg: ['#0A0A0A', '#1A1200', '#0A0A0A'], desc: 'Altın taç • Dönen çerçeve • Nabız glow' },
  cosmic: { min: 23, label: '✦ COSMİC', color: '#A855F7', bg: ['#0F0520', '#1a0535', '#0F0520'], desc: 'Neon plazma • Dönen yıldızlar • Uzay parıltısı' },
  premium: { min: 19, label: '⬡ PREMİUM', color: '#FB923C', bg: ['#1C0800', '#2A1200', '#1C0800'], desc: 'Elmas facet • Shimmer animasyon • Parlak ışıklar' },
  modern: { min: 11, label: '✦ MODERN', color: '#60A5FA', bg: ['#0F172A', '#1E2E4A', '#0F172A'], desc: 'Art Deco geometri • Keskin elmaslar' },
};

function getTierInfo(id) {
  if (id >= 28) return TIER.elite;
  if (id >= 23) return TIER.cosmic;
  if (id >= 19) return TIER.premium;
  if (id >= 11) return TIER.modern;
  return null;
}

const SECTION_STARTS = {
  11: { label: '✦ Modern', color: '#60A5FA', tier: 'modern' },
  19: { label: '⬡ Premium', color: '#FB923C', tier: 'premium' },
  23: { label: '✦ Cosmic', color: '#A855F7', tier: 'cosmic' },
  28: { label: '♛ Elite', color: '#FFD700', tier: 'elite' },
};

// ─── Avatar Kartı ─────────────────────────────────────────
function AvatarCard({ item, isSelected, onSelect, onClose, colors }) {
  const enterAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(enterAnim, {
      toValue: 1, delay: item._index * 30,
      useNativeDriver: true, speed: 14, bounciness: 10,
    }).start();
  }, []);

  const onPressIn = () => Animated.spring(pressAnim, { toValue: 0.85, useNativeDriver: true, speed: 50 }).start();
  const onPressOut = () => Animated.spring(pressAnim, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 14 }).start();

  const tier = getTierInfo(item.id);
  const frameSize = item.id >= 28 ? 72 : item.id >= 23 ? 66 : item.id >= 19 ? 60 : item.id >= 11 ? 54 : 50;
  const innerSize = frameSize * 0.68;
  const offset = (frameSize - innerSize) / 2;

  const cellBg = isSelected
    ? (tier ? tier.bg[1] + '60' : colors.primaryLight)
    : (tier && item.id >= 23 ? '#00000040' : 'transparent');

  return (
    <Animated.View style={{
      flex: 1, margin: 3,
      transform: [{ scale: Animated.multiply(enterAnim, pressAnim) }],
    }}>
      <TouchableOpacity
        onPress={() => { onSelect(item.id); onClose(); }}
        onPressIn={onPressIn} onPressOut={onPressOut}
        activeOpacity={1}
        style={[
          styles.cell,
          { backgroundColor: cellBg, borderRadius: 14 },
          isSelected && {
            borderWidth: 2,
            borderColor: tier ? tier.color : colors.primary,
          },
        ]}
      >
        {/* Çerçeve + Emoji */}
        <View style={{ width: frameSize, height: frameSize }}>
          <View style={{ position: 'absolute', inset: 0 }}>
            <AvatarFrame avatarId={item.id} color={item.color} size={frameSize} />
          </View>
          <View style={{
            position: 'absolute', top: offset, left: offset,
            width: innerSize, height: innerSize,
            borderRadius: innerSize / 2,
            backgroundColor: item.bg,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ fontSize: innerSize * 0.52 }}>{item.emoji}</Text>
          </View>
        </View>

        {/* İsim */}
        <Text style={{
          color: tier && item.id >= 23 ? tier.color : (isSelected ? tier?.color || colors.primary : colors.textSecondary),
          fontWeight: item.id >= 28 ? '900' : item.id >= 23 ? '800' : item.id >= 11 ? '700' : '600',
          fontSize: item.id >= 28 ? 11 : 10,
          marginTop: 5, textAlign: 'center',
        }} numberOfLines={1}>
          {item.name}
        </Text>

        {/* Seçim tiki */}
        {isSelected && (
          <View style={[styles.checkBadge, { backgroundColor: tier?.color || colors.primary }]}>
            <Ionicons name="checkmark" size={10} color="#000" />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Tier Başlık Kartı ────────────────────────────────────
function TierHeader({ label, color, tier: tierKey }) {
  const info = TIER[tierKey];
  if (!info) return null;

  return (
    <LinearGradient colors={info.bg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
      style={styles.tierHeader}
    >
      <View style={styles.tierHeaderLeft}>
        <Text style={[styles.tierLabel, { color: info.color }]}>{label}</Text>
        <Text style={[styles.tierDesc, { color: info.color + 'AA' }]}>{info.desc}</Text>
      </View>
      <View style={[styles.tierDot, { backgroundColor: info.color }]} />
    </LinearGradient>
  );
}

// ─── Ana Modal ────────────────────────────────────────────
export default function AvatarPickerModal({ visible, currentId, onSelect, onClose }) {
  const colors = useTheme();

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

  const currentAvatar = AVATARS.find(a => a.id === currentId) || AVATARS[0];
  const currentTier = getTierInfo(currentId || 1);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={[styles.sheet, { backgroundColor: colors.surface }]} onStartShouldSetResponder={() => true}>

          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          {/* Başlık */}
          <View style={styles.topRow}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>Avatar Seç</Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                Aşağı kaydır • Elite çerçeveler seni bekliyor ♛
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.border }]}>
              <Ionicons name="close" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Seçili avatar önizleme */}
          <LinearGradient
            colors={currentTier ? currentTier.bg : [colors.card, colors.card]}
            style={styles.previewRow}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          >
            <UserAvatar avatarId={currentId || 1} size={56} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ color: currentTier ? currentTier.color : colors.text, fontWeight: '800', fontSize: 15 }}>
                {currentAvatar.name}
              </Text>
              <Text style={{ color: currentTier ? currentTier.color + '99' : colors.textMuted, fontSize: 12, marginTop: 2 }}>
                {currentTier ? currentTier.label : '● Standart'}
              </Text>
            </View>
            {currentTier && (
              <View style={[styles.activeBadge, { borderColor: currentTier.color }]}>
                <Text style={{ color: currentTier.color, fontSize: 10, fontWeight: '800' }}>AKTİF</Text>
              </View>
            )}
          </LinearGradient>

          {/* Liste */}
          <FlatList
            data={rows}
            keyExtractor={(item) => item.key}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 32 }}
            renderItem={({ item }) => {
              if (item.type === 'header') {
                return <TierHeader label={item.label} color={item.color} tier={item.tier} />;
              }
              return (
                <View style={{ flexDirection: 'row' }}>
                  {item.items.map((avatar) => (
                    <AvatarCard
                      key={avatar.id}
                      item={avatar}
                      isSelected={currentId === avatar.id}
                      onSelect={onSelect}
                      onClose={onClose}
                      colors={colors}
                    />
                  ))}
                  {Array(NUM_COLS - item.items.length).fill(null).map((_, i) => (
                    <View key={i} style={{ flex: 1, margin: 3 }} />
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
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 0, maxHeight: '88%' },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  title: { fontSize: 20, fontWeight: '900' },
  subtitle: { fontSize: 12, marginTop: 2 },
  closeBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  previewRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, marginBottom: 16 },
  activeBadge: { borderWidth: 1.5, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  // Tier header
  tierHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, marginTop: 10, marginBottom: 6 },
  tierHeaderLeft: { flex: 1 },
  tierLabel: { fontSize: 13, fontWeight: '900', letterSpacing: 1.5 },
  tierDesc: { fontSize: 10, marginTop: 2, letterSpacing: 0.3 },
  tierDot: { width: 8, height: 8, borderRadius: 4 },
  // Kart
  cell: { alignItems: 'center', padding: 8, position: 'relative', minHeight: 90 },
  checkBadge: { position: 'absolute', top: 4, right: 4, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
});