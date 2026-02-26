import React from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, Switch, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../store';
import { useTheme } from '../../components/common';
import { THEMES, CATEGORIZED_THEMES, THEME_CATEGORIES, canUseTheme } from '../../theme';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 48 - 24) / 3; // 3 sütun için boşluklarla hesaplanmış boyut

export default function ThemePickerScreen({ navigation }) {
    const colors = useTheme();
    const { user, isDark, themeKey, toggleTheme, setThemeKey } = useStore();
    const isPremium = user?.is_premium || false;

    const handleSelect = (key) => {
        if (!canUseTheme(key, isPremium)) {
            navigation.navigate('Premium');
            return;
        }
        setThemeKey(key);
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

                {/* ── Başlık ── */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: colors.text }]}>Tema Seç</Text>
                    <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                        Uygulamanın renklerini kişiselleştir
                    </Text>
                </View>

                {/* ── Karanlık mod toggle ── */}
                <View style={[styles.darkRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.darkLeft}>
                        <View style={[styles.darkIcon, { backgroundColor: isDark ? '#1E1B4B' : '#FEF9C3' }]}>
                            <Ionicons
                                name={isDark ? 'moon' : 'sunny'}
                                size={18}
                                color={isDark ? '#818CF8' : '#F59E0B'}
                            />
                        </View>
                        <View>
                            <Text style={[styles.darkLabel, { color: colors.text }]}>
                                {isDark ? 'Karanlık Mod' : 'Aydınlık Mod'}
                            </Text>
                            <Text style={[styles.darkSub, { color: colors.textMuted }]}>
                                {isDark ? 'Gözlerin dinleniyor 🌙' : 'Parlak ve enerjik ☀️'}
                            </Text>
                        </View>
                    </View>
                    <Switch
                        value={isDark}
                        onValueChange={toggleTheme}
                        trackColor={{ false: colors.border, true: colors.primary + '80' }}
                        thumbColor={isDark ? colors.primary : '#fff'}
                    />
                </View>

                {/* ── Dinamik Kategorize Edilmiş Temalar ── */}
                {THEME_CATEGORIES.map((category) => (
                    <View key={category} style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                                {category.toUpperCase()}
                            </Text>
                            {/* Kategori içindeki ilk öğe premium ise rozet göster */}
                            {CATEGORIZED_THEMES[category][0].premium && (
                                <View style={[styles.premiumBadge, { backgroundColor: '#F59E0B20' }]}>
                                    <Ionicons name="star" size={10} color="#F59E0B" />
                                    <Text style={[styles.premiumBadgeText, { color: '#F59E0B' }]}>PREMİUM</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.grid}>
                            {CATEGORIZED_THEMES[category].map((item) => (
                                <ThemeCard
                                    key={item.key}
                                    themeKey={item.key}
                                    isDark={isDark}
                                    isSelected={themeKey === item.key}
                                    isLocked={!canUseTheme(item.key, isPremium)}
                                    onPress={() => handleSelect(item.key)}
                                />
                            ))}
                        </View>
                    </View>
                ))}

                {/* Premium CTA kartı (Sadece premium olmayanlara) */}
                {!isPremium && (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Premium')}
                        activeOpacity={0.9}
                        style={styles.ctaWrap}
                    >
                        <LinearGradient
                            colors={['#6C63FF', '#A855F7', '#EC4899']}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                            style={styles.ctaCard}
                        >
                            <Text style={styles.ctaEmoji}>✨</Text>
                            <Text style={styles.ctaTitle}>Premium'a Geç</Text>
                            <Text style={styles.ctaSub}>
                                Tüm taraftar temaları ve özel renk paketlerini hemen aç!
                            </Text>
                            <View style={styles.ctaBtn}>
                                <Text style={styles.ctaBtnText}>Şimdi Keşfet →</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                )}

            </ScrollView>
        </View>
    );
}

// ─── Tema Kartı Bileşeni ───────────────────────────────────────────

function ThemeCard({ themeKey, isDark, isSelected, isLocked, onPress }) {
    const theme = THEMES[themeKey];
    const targetTheme = isDark ? theme.dark : theme.light;
    const colors = targetTheme.colors;

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={[
                styles.card,
                {
                    width: CARD_SIZE,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderWidth: isSelected ? 2.5 : 1,
                    opacity: isLocked ? 0.75 : 1,
                },
            ]}
        >
            {/* Mini Önizleme */}
            <View style={[styles.preview, { backgroundColor: colors.background }]}>
                <View style={[styles.previewBar, { backgroundColor: colors.surface }]}>
                    <View style={[styles.previewDot, { backgroundColor: colors.primary }]} />
                    <View style={[styles.previewLine, { backgroundColor: colors.border, width: '50%' }]} />
                </View>
                <View style={styles.previewBody}>
                    <View style={[styles.previewCard, { backgroundColor: colors.card }]}>
                        <View style={[styles.previewAccent, { backgroundColor: colors.primary }]} />
                        <View style={{ flex: 1 }}>
                            <View style={[styles.previewLineShort, { backgroundColor: colors.text, width: '70%' }]} />
                            <View style={[styles.previewLineShort, { backgroundColor: colors.border, width: '40%', marginTop: 3 }]} />
                        </View>
                    </View>
                </View>
            </View>

            {/* Alt Bilgi */}
            <View style={[styles.cardBottom, { backgroundColor: isSelected ? colors.primary : colors.surface }]}>
                <Text style={styles.cardEmoji}>{theme.emoji}</Text>
                <Text style={[styles.cardLabel, { color: isSelected ? '#fff' : colors.text }]} numberOfLines={1}>
                    {theme.label}
                </Text>
            </View>

            {/* Kilit ve Check Rozetleri */}
            {isLocked && (
                <View style={styles.lockOverlay}>
                    <View style={styles.lockBadge}>
                        <Ionicons name="lock-closed" size={12} color="#fff" />
                    </View>
                </View>
            )}
            {isSelected && (
                <View style={[styles.checkBadge, { backgroundColor: colors.primary }]}>
                    <Ionicons name="checkmark" size={10} color="#fff" />
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16, paddingBottom: 40 },
    backBtn: { marginBottom: 10, marginLeft: -5 },
    header: { marginBottom: 20 },
    title: { fontSize: 26, fontWeight: '800', marginBottom: 4 },
    subtitle: { fontSize: 14 },
    darkRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 24 },
    darkLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    darkIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    darkLabel: { fontSize: 15, fontWeight: '700' },
    darkSub: { fontSize: 12, marginTop: 1 },
    section: { marginBottom: 24 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    premiumBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    premiumBadgeText: { fontSize: 9, fontWeight: '900' },
    card: { borderRadius: 16, overflow: 'hidden', backgroundColor: '#fff' },
    preview: { height: CARD_SIZE * 0.75, padding: 8 },
    previewBar: { flexDirection: 'row', alignItems: 'center', gap: 5, padding: 4, borderRadius: 6, marginBottom: 6 },
    previewDot: { width: 6, height: 6, borderRadius: 3 },
    previewLine: { height: 3, borderRadius: 1.5 },
    previewBody: { flex: 1 },
    previewCard: { flexDirection: 'row', alignItems: 'center', gap: 5, padding: 5, borderRadius: 6 },
    previewAccent: { width: 3, height: 15, borderRadius: 1.5 },
    previewLineShort: { height: 2.5, borderRadius: 1 },
    cardBottom: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 8 },
    cardEmoji: { fontSize: 13 },
    cardLabel: { fontSize: 10, fontWeight: '700', flex: 1 },
    lockOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'flex-end', padding: 6 },
    lockBadge: { backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 10, padding: 4 },
    checkBadge: { position: 'absolute', top: 6, left: 6, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', borderWeight: 1, borderColor: '#fff' },
    ctaWrap: { marginTop: 8, borderRadius: 20, overflow: 'hidden', elevation: 4 },
    ctaCard: { padding: 20, alignItems: 'center' },
    ctaEmoji: { fontSize: 32, marginBottom: 8 },
    ctaTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 6 },
    ctaSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 20, marginBottom: 16 },
    ctaBtn: { backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
    ctaBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
});