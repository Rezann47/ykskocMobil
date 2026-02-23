import React from 'react';
import {
  View, Text, StyleSheet, Modal,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AVATARS } from '../utils/avatars';
import { useTheme } from '../components/common';

export default function AvatarPickerModal({ visible, currentId, onSelect, onClose }) {
  const colors = useTheme();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          {/* Başlık */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Avatar Seç</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Grid */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.grid}>
              {AVATARS.map((avatar) => {
                const isSelected = currentId === avatar.id;
                return (
                  <TouchableOpacity
                    key={avatar.id}
                    style={[
                      styles.avatarCell,
                      { borderColor: isSelected ? colors.primary : 'transparent' },
                      isSelected && { backgroundColor: colors.primaryLight },
                    ]}
                    onPress={() => { onSelect(avatar.id); onClose(); }}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.avatarCircle, { backgroundColor: avatar.bg }]}>
                      <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
                    </View>
                    <Text style={[styles.avatarName, { color: colors.textSecondary }]}>
                      {avatar.name}
                    </Text>
                    {isSelected && (
                      <View style={[styles.checkBadge, { backgroundColor: colors.primary }]}>
                        <Ionicons name="checkmark" size={10} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40, maxHeight: '75%' },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '800' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  avatarCell: {
    width: '22%',
    alignItems: 'center',
    padding: 8,
    borderRadius: 14,
    borderWidth: 2,
    position: 'relative',
  },
  avatarCircle: { width: 54, height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  avatarEmoji: { fontSize: 30 },
  avatarName: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  checkBadge: {
    position: 'absolute', top: 4, right: 4,
    width: 18, height: 18, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
  },
});
