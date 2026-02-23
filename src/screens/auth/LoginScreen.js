import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../store';
import { authApi } from '../../services/api';
import { Button, Input, useTheme } from '../../components/common';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const colors = useTheme();
  const setAuth = useStore((s) => s.setAuth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isDark, toggleTheme } = useStore();

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError('Tüm alanları doldurun');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await authApi.login(form);
      console.log("deneme", data)
      setAuth(data.user, data.token.access_token, data.token.refresh_token);
    } catch (e) {
      console.log(e.message)
      setError(e.message);
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
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingBottom: 12 }}>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeBtn}>
            <Ionicons name={isDark ? 'sunny' : 'moon'} size={22} color={isDark ? "#ffd500" : "#090d6d"} />
          </TouchableOpacity>
        </View>


        {/* Logo */}
        <LinearGradient colors={['#6C63FF', '#9C88FF']} style={styles.logo}>
          <Text style={styles.logoText}>YKS</Text>
          <Text style={styles.logoSub}>ROTA</Text>
        </LinearGradient>




        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Input
            label="E-posta"
            placeholder="ornek@mail.com"
            value={form.email}
            onChangeText={(v) => setForm({ ...form, email: v })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Şifre"
            placeholder="••••••••"
            value={form.password}
            onChangeText={(v) => setForm({ ...form, password: v })}
            secureTextEntry
          />

          {error ? (
            <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
          ) : null}

          <Button title="Giriş Yap" onPress={handleLogin} loading={loading} />
        </View>

        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={[styles.linkText, { color: colors.textSecondary }]}>
            Hesabın yok mu?{' '}
            <Text style={{ color: colors.primary, fontWeight: '700' }}>Kayıt Ol</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, paddingTop: 80 },
  logo: {
    width: 90, height: 90, borderRadius: 24,
    alignSelf: 'center', alignItems: 'center', justifyContent: 'center',
    marginBottom: 28, elevation: 8, shadowColor: '#6C63FF', shadowOpacity: 0.4,
    shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
  },
  logoText: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  logoSub: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '600', letterSpacing: 3 },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 15, textAlign: 'center', marginBottom: 28 },
  card: { borderRadius: 20, padding: 20, borderWidth: 1, marginBottom: 20 },
  error: { fontSize: 13, marginBottom: 12, textAlign: 'center' },
  link: { alignItems: 'center', marginTop: 8 },
  linkText: { fontSize: 14 },
  themeBtn: { padding: 8, width: '12%', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12 },

});
