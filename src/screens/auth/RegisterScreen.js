import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useStore } from '../../store';
import { authApi } from '../../services/api';
import { Button, Input, useTheme } from '../../components/common';

export default function RegisterScreen({ navigation }) {
  const colors = useTheme();
  const setAuth = useStore((s) => s.setAuth);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      setError('Tüm alanları doldurun');
      return;
    }
    if (form.password.length < 8) {
      setError('Şifre en az 8 karakter olmalı');
      return;
    }
    setLoading(true);
    setError('');
    try {
      console.log("form", form)
      const data = await authApi.register(form);
      console.log(data)
      setAuth(data.user, data.token.access_token, data.token.refresh_token);
    } catch (e) {
      setError(e.message);
      console.log(e.message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: colors.text }]}>Hesap Oluştur </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          YKS yolculuğuna başla
        </Text>

        {/* Rol Seçimi */}
        <View style={[styles.roleContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {['student', 'instructor'].map((r) => (
            <TouchableOpacity
              key={r}
              style={[
                styles.roleBtn,
                form.role === r && { backgroundColor: colors.primary },
              ]}
              onPress={() => set('role', r)}
            >
              <Text style={[
                styles.roleText,
                { color: form.role === r ? '#fff' : colors.textSecondary },
              ]}>
                {r === 'student' ? '👨‍🎓 Öğrenci' : '👨‍🏫 Eğitmen'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Input label="Ad Soyad" placeholder="Adın Soyadın" value={form.name}
            onChangeText={(v) => set('name', v)} />
          <Input label="E-posta" placeholder="ornek@mail.com" value={form.email}
            onChangeText={(v) => set('email', v)} keyboardType="email-address" autoCapitalize="none" />
          <Input label="Şifre" placeholder="En az 8 karakter" value={form.password}
            onChangeText={(v) => set('password', v)} secureTextEntry />

          {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}

          <Button title="Kayıt Ol" onPress={handleRegister} loading={loading} />
        </View>

        <TouchableOpacity style={styles.link} onPress={() => navigation.goBack()}>
          <Text style={[styles.linkText, { color: colors.textSecondary }]}>
            Hesabın var mı?{' '}
            <Text style={{ color: colors.primary, fontWeight: '700' }}>Giriş Yap</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 15, textAlign: 'center', marginBottom: 24 },
  roleContainer: {
    flexDirection: 'row', borderRadius: 14, borderWidth: 1,
    padding: 4, marginBottom: 20,
  },
  roleBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  roleText: { fontSize: 14, fontWeight: '600' },
  card: { borderRadius: 20, padding: 20, borderWidth: 1, marginBottom: 20 },
  error: { fontSize: 13, marginBottom: 12, textAlign: 'center' },
  link: { alignItems: 'center' },
  linkText: { fontSize: 14 },
});
