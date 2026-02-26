import React from 'react';
import { View, Text } from 'react-native';
import { getAvatar } from '../utils/avatars';
import AvatarFrame from './AvatarFrame';

export default function UserAvatar({ avatarId, size = 64 }) {
  const avatar = getAvatar(avatarId || 1);
  const id = avatar.id;

  // Çerçeve kalınlığına göre iç daire oranı
  const innerRatio = id >= 28 ? 0.58 : id >= 23 ? 0.60 : id >= 19 ? 0.62 : id >= 11 ? 0.65 : 0.68;
  const innerSize = size * innerRatio;

  // Elite/Cosmic dışa taşan glow için dış container büyütülür
  const overflow = id >= 28 ? size * 0.14 : id >= 23 ? size * 0.07 : 0;
  const totalSize = size + overflow * 2;

  // Emoji dairesinin rengi — Elite/Cosmic arka plan kutusu görünmesin
  // Tamamen şeffaf yapmak yerine çok düşük opacity kullan (emoji görünsün)
  const bgColor = id >= 23 ? 'transparent' : avatar.bg;

  return (
    <View style={{ width: totalSize, height: totalSize }}>
      {/* Çerçeve — overflow kadar içe yerleşir */}
      <View style={{ position: 'absolute', top: overflow, left: overflow }}>
        <AvatarFrame avatarId={id} color={avatar.color} size={size} />
      </View>

      {/* Emoji dairesi — tam ortada */}
      <View style={{
        position: 'absolute',
        top: overflow + (size - innerSize) / 2,
        left: overflow + (size - innerSize) / 2,
        width: innerSize,
        height: innerSize,
        borderRadius: innerSize / 2,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <Text style={{ fontSize: innerSize * 0.52 }}>{avatar.emoji}</Text>
      </View>
    </View>
  );
}