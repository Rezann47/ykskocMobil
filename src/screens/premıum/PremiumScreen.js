// screens/PremiumScreen.js
import React from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, ActivityIndicator, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useStore } from '../../store';
import { useTheme } from '../../components/common';

import useIAP from '../../hooks/useIAP';
const FEATURES = [
    { icon: 'color-palette-outline', title: '10 Premium Tema', desc: 'Sakura, Cosmic, Elite ve daha fazlası' },
    { icon: 'ban-outline', title: 'Reklamsız Deneyim', desc: 'Hiç reklam görmeden çalış' },
    { icon: 'star-outline', title: 'Premium Avatar', desc: 'Exclusive çerçeve ve avatarlar' },
    { icon: 'flash-outline', title: 'Öncelikli Destek', desc: 'Koçunla daha hızlı iletişim' },
];

export default function PremiumScreen({ navigation }) {
    const colors = useTheme();
    const { user } = useStore();
    const { priceText, loading, purchasing, restoring, purchase, restore } = useIAP();

    if (user?.is_premium) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <Text style={{ fontSize: 64 }}>⭐</Text>
                <Text style={[styles.alreadyTitle, { color: colors.text }]}>
                    Zaten Premium'sun!
                </Text>
                <Text style={[styles.alreadySub, { color: colors.textMuted }]}>
                    Tüm özelliklerin açık.
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: colors.background }}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
        >
            {/* ── Hero ── */}
            <LinearGradient
                colors={[colors.primary, colors.primary + '99', colors.background]}
                style={styles.hero}
            >
                <Text style={styles.heroEmoji}>✨</Text>
                <Text style={styles.heroTitle}>YKS Koçum Premium</Text>
                <Text style={styles.heroSub}>Tüm özelliklerin kilidini aç</Text>
            </LinearGradient>

            {/* ── Özellikler ── */}
            <View style={{ paddingHorizontal: 20, marginTop: 8 }}>
                {FEATURES.map((f, i) => (
                    <View key={i} style={[styles.featureRow, { borderColor: colors.border }]}>
                        <View style={[styles.featureIcon, { backgroundColor: colors.primaryLight }]}>
                            <Ionicons name={f.icon} size={20} color={colors.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.featureTitle, { color: colors.text }]}>{f.title}</Text>
                            <Text style={[styles.featureDesc, { color: colors.textMuted }]}>{f.desc}</Text>
                        </View>
                        <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                    </View>
                ))}
            </View>

            {/* ── Fiyat kartı ── */}
            <View style={[styles.priceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.priceRow}>
                    <Text style={[styles.priceAmount, { color: colors.text }]}>
                        {loading ? '...' : priceText}
                    </Text>
                    <Text style={[styles.pricePer, { color: colors.textMuted }]}> / ay</Text>
                </View>
                <Text style={[styles.priceSub, { color: colors.textMuted }]}>
                    İstediğin zaman iptal edebilirsin
                </Text>
            </View>

            {/* ── Satın Al butonu ── */}
            <View style={{ paddingHorizontal: 20, gap: 12 }}>
                <TouchableOpacity
                    onPress={purchase}
                    disabled={loading || purchasing}
                    activeOpacity={0.85}
                    style={[styles.buyBtn, { backgroundColor: colors.primary }]}
                >
                    {purchasing
                        ? <ActivityIndicator color="#fff" />
                        : <Text style={styles.buyBtnText}>Premium'a Geç — {priceText}/ay</Text>
                    }
                </TouchableOpacity>

                {/* Restore — App Store şart koşuyor */}
                <TouchableOpacity
                    onPress={restore}
                    disabled={restoring}
                    activeOpacity={0.7}
                    style={styles.restoreBtn}
                >
                    {restoring
                        ? <ActivityIndicator color={colors.textMuted} size="small" />
                        : <Text style={[styles.restoreText, { color: colors.textMuted }]}>
                            Satın almayı geri yükle
                        </Text>
                    }
                </TouchableOpacity>

                {/* Yasal uyarı */}
                <Text style={[styles.legal, { color: colors.textMuted }]}>
                    {Platform.OS === 'ios'
                        ? 'Ödeme iTunes hesabına yapılır. Abonelik, mevcut dönemin bitiminden en az 24 saat önce iptal edilmezse otomatik olarak yenilenir.'
                        : 'Ödeme Google Play hesabına yapılır. Bir sonraki fatura döneminden önce iptal edebilirsin.'
                    }
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
    alreadyTitle: { fontSize: 22, fontWeight: '800' },
    alreadySub: { fontSize: 15 },

    hero: { alignItems: 'center', paddingTop: 60, paddingBottom: 40, paddingHorizontal: 20 },
    heroEmoji: { fontSize: 64, marginBottom: 12 },
    heroTitle: { color: '#fff', fontSize: 28, fontWeight: '900', textAlign: 'center' },
    heroSub: { color: 'rgba(255,255,255,0.8)', fontSize: 16, marginTop: 6 },

    featureRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, gap: 14 },
    featureIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    featureTitle: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
    featureDesc: { fontSize: 13 },

    priceCard: { margin: 20, borderRadius: 20, borderWidth: 1, padding: 20, alignItems: 'center' },
    priceRow: { flexDirection: 'row', alignItems: 'flex-end' },
    priceAmount: { fontSize: 42, fontWeight: '900' },
    pricePer: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
    priceSub: { fontSize: 13, marginTop: 4 },

    buyBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    buyBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
    restoreBtn: { alignItems: 'center', paddingVertical: 12 },
    restoreText: { fontSize: 14 },
    legal: { fontSize: 11, textAlign: 'center', lineHeight: 16, marginTop: 4 },
});
