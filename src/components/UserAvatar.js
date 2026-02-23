import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getAvatar } from '../utils/avatars';

/**
 * Kullanım:
 * <UserAvatar avatarId={user.avatar_id} size={60} />
 *
 * avatarId backend'den gelir (user.avatar_id).
 * 1-20 arası geçerli değer, dışındaysa 1 (kedi) gösterilir.
 */
export default function UserAvatar({ avatarId, size = 48 }) {
  const avatar = getAvatar(avatarId || 1);
  const borderRadius = size * 0.28;
  const fontSize = size * 0.52;

  return (
    <View style={[
      styles.wrap,
      { width: size, height: size, borderRadius, backgroundColor: avatar.bg },
    ]}>
      <Text style={{ fontSize }}>{avatar.emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
});
