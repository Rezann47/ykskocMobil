import React from 'react';
import { View, Text } from 'react-native';
import { getAvatar } from '../utils/avatars';
import AvatarFrame from './AvatarFrame';

/**
 * Kullanım:
 * <UserAvatar avatarId={user.avatar_id} size={64} />
 */
export default function UserAvatar({ avatarId, size = 64 }) {
  const avatar = getAvatar(avatarId || 1);
  const innerSize = size * 0.70;
  const offset = (size - innerSize) / 2;

  return (
    <View style={{ width: size, height: size }}>
      {/* Desenli çerçeve */}
      <View style={{ position: 'absolute', inset: 0 }}>
        <AvatarFrame avatarId={avatar.id} color={avatar.color} size={size} />
      </View>
      {/* Emoji */}
      <View style={{
        position: 'absolute',
        top: offset, left: offset,
        width: innerSize, height: innerSize,
        borderRadius: innerSize / 2,
        backgroundColor: avatar.bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text style={{ fontSize: innerSize * 0.52 }}>{avatar.emoji}</Text>
      </View>
    </View>
  );
}