import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Alert, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../store';
import { authApi, userApi } from '../../services/api';
import { Card, useTheme } from '../../components/common';
import { THEMES } from '../../theme';
import UserAvatar from '../../components/UserAvatar';
import AvatarPickerModal from '../../components/AvatarPickerModal';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const colors = useTheme();
  const {
    user, refreshToken, logout, updateUser,
    isDark, toggleTheme, themeKey, setThemeKey,
  } = useStore();

  const [themeModal, setThemeModal] = useState(false);
  const [avatarModal, setAvatarModal] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const navigation = useNavigation();
  const handleSelectAvatar = async (avatarId) => {
    setSavingAvatar(true);
    try {
      // Backend'e kaydet
      const updated = await userApi.updateProfile({ avatar_id: avatarId });
      // Local user objesini güncelle
      updateUser(updated);
    } catch (e) {
      console.log(e.message)
      Alert.alert('Hata', 'Avatar kaydedilemedi: ' + e.message);
    }
    setSavingAvatar(false);
  };

  const handleLogout = () => {
    Alert.alert('Çıkış Yap', 'Hesabından çıkmak istiyor musun?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Çıkış Yap', style: 'destructive', onPress: async () => {
          try { await authApi.logout(refreshToken); } catch { }
          logout();
        },
      },
    ]);
  };

  const MenuItem = ({ icon, label, value, onPress, danger }) => (
    <TouchableOpacity
      style={[styles.menuItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIcon, { backgroundColor: danger ? colors.error + '15' : colors.primaryLight }]}>
        <Ionicons name={icon} size={18} color={danger ? colors.error : colors.primary} />
      </View>
      <Text style={[styles.menuLabel, { color: danger ? colors.error : colors.text }]}>{label}</Text>
      {value && <Text style={[styles.menuValue, { color: colors.textMuted }]}>{value}</Text>}
      {!danger && <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />}
    </TouchableOpacity>
  );

  const currentTheme = THEMES[themeKey] || THEMES.violet;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* ─── Header ─── */}
      <LinearGradient
        colors={[colors.primary, colors.primary + 'CC']}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => setAvatarModal(true)}
          activeOpacity={0.8}
          disabled={savingAvatar}
        >
          <View style={styles.avatarWrap}>
            <UserAvatar avatarId={user?.avatar_id} size={100} />
            <View style={[styles.editBadge, { backgroundColor: colors.primary, borderColor: '#fff' }]}>
              <Ionicons name={savingAvatar ? 'sync' : 'pencil'} size={11} color="#fff" />
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.roleWrap}>
          <Text style={styles.roleText}>
            {user?.role === 'student' ? '👨‍🎓 Öğrenci' : '👨‍🏫 Eğitmen'}
          </Text>
          {user?.student_code && (
            <Text style={styles.codeText}>Kod: {user.student_code}</Text>
          )}
        </View>
        {user?.is_premium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>⭐ Premium</Text>
          </View>
        )}
      </LinearGradient>

      {/* ─── Görünüm ─── */}
      <Card style={{ marginHorizontal: 16, marginTop: 16 }}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>GÖRÜNÜM</Text>

        <MenuItem
          icon={isDark ? 'sunny-outline' : 'moon-outline'}
          label={isDark ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
          onPress={toggleTheme}
        />

        {/* Renk Teması */}


        <TouchableOpacity
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
          onPress={() => navigation.navigate('ThemePicker')} // Modal yerine navigasyon
          activeOpacity={0.7}
        >
          <View style={[styles.menuIcon, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="color-palette-outline" size={18} color={colors.primary} />
          </View>
          <Text style={[styles.menuLabel, { color: colors.text }]}>Renk Teması</Text>
          <View style={styles.themePreview}>
            <Text>{currentTheme.emoji}</Text>
            <Text style={[styles.themePreviewLabel, { color: colors.textMuted }]}>
              {currentTheme.label}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Avatar */}
        <TouchableOpacity
          style={[styles.menuItem, { borderBottomColor: 'transparent' }]}
          onPress={() => setAvatarModal(true)}
          activeOpacity={0.7}
        >
          <View style={[styles.menuIcon, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="happy-outline" size={18} color={colors.primary} />
          </View>
          <Text style={[styles.menuLabel, { color: colors.text }]}>Avatar</Text>
          <View style={{ marginRight: 8 }}>
            <UserAvatar avatarId={user?.avatar_id} size={48} />
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </Card>

      {/* ─── Hesap ─── */}
      <Card style={{ marginHorizontal: 16, marginTop: 8 }}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>HESAP</Text>
        {!user?.is_premium && (
          <MenuItem
            icon="star-outline"
            label="Premium'a Geç"
            value="Reklamları kaldır"
            onPress={() => Alert.alert('Premium', 'Yakında!')}
          />
        )}
        <MenuItem
          icon="lock-closed-outline"
          label="Şifre Değiştir"
          onPress={() => Alert.alert('Bilgi', 'Yakında!')}
        />
        <MenuItem
          icon="help-circle-outline"
          label="Yardım"
          onPress={() => Alert.alert('Bilgi', 'Yakında!')}
        />
      </Card>

      <Card style={{ marginHorizontal: 16, marginTop: 8 }}>
        <MenuItem icon="log-out-outline" label="Çıkış Yap" onPress={handleLogout} danger />
      </Card>

      <Text style={[styles.version, { color: colors.textMuted }]}>YKS Koçum v1.0.0</Text>

      {/* ─── Avatar Picker ─── */}
      <AvatarPickerModal
        visible={avatarModal}
        currentId={user?.avatar_id}
        onSelect={(id) => { handleSelectAvatar(id); setAvatarModal(false); }}
        onClose={() => setAvatarModal(false)}
      />

      {/* ─── Tema Modal ─── */}
      <Modal visible={themeModal} animationType="slide" transparent onRequestClose={() => setThemeModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setThemeModal(false)}>
          <View style={[styles.modalSheet, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>Renk Teması</Text>
            {Object.entries(THEMES).map(([key, theme]) => {
              const isActive = themeKey === key;
              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.themeRow,
                    { borderColor: isActive ? colors.primary : colors.border },
                    isActive && { backgroundColor: colors.primaryLight },
                  ]}
                  onPress={() => { setThemeKey(key); setThemeModal(false); }}
                  activeOpacity={0.7}
                >
                  <View style={styles.themeSwatches}>
                    <View style={[styles.swatch, { backgroundColor: theme.light.colors.primary }]} />
                    <View style={[styles.swatch, { backgroundColor: theme.dark.colors.background }]} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.themeRowLabel, { color: colors.text }]}>
                      {theme.emoji} {theme.label}
                    </Text>
                    <Text style={[styles.themeRowSub, { color: colors.textMuted }]}>Açık & koyu varyant</Text>
                  </View>
                  {isActive && <Ionicons name="checkmark-circle" size={22} color={colors.primary} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', paddingVertical: 36, paddingHorizontal: 20, paddingTop: '15%' },
  avatarWrap: { position: 'relative', marginBottom: 12 },
  editBadge: {
    position: 'absolute', bottom: -2, right: -2,
    width: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2,
  },
  name: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 4 },
  email: { color: 'rgba(255,255,255,0.75)', fontSize: 14, marginBottom: 10 },
  roleWrap: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  roleText: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '600' },
  codeText: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  premiumBadge: { marginTop: 10, backgroundColor: 'rgba(255,215,0,0.25)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  premiumText: { color: '#FFD700', fontWeight: '700', fontSize: 14 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  menuIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  menuValue: { fontSize: 13, marginRight: 6 },
  themePreview: { flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 6 },
  themePreviewLabel: { fontSize: 13 },
  version: { textAlign: 'center', fontSize: 12, marginVertical: 24 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  themeRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 14, borderWidth: 1.5, marginBottom: 10, gap: 12 },
  themeSwatches: { flexDirection: 'row', gap: 4 },
  swatch: { width: 24, height: 24, borderRadius: 8 },
  themeRowLabel: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  themeRowSub: { fontSize: 12 },
});
