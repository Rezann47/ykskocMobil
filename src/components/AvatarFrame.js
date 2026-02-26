import React, { useRef, useEffect } from 'react';
import { Animated, View } from 'react-native';
import Svg, {
    Circle, Polygon, Line, Ellipse, Path, Defs,
    LinearGradient, RadialGradient, Stop,
} from 'react-native-svg';

// ─────────────────────────────────────────────────────────
//  YARDIMCILAR
// ─────────────────────────────────────────────────────────

// Hex rengi karart/aydınlat
function shadeColor(hex, pct) {
    const n = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (n >> 16) + pct));
    const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + pct));
    const b = Math.min(255, Math.max(0, (n & 0xff) + pct));
    return `rgb(${r},${g},${b})`;
}

// ══════════════════════════════════════════════════════════
//  TIER 1 — STANDART: 3D plastik boncuk halkası
//  Teknik: her boncuk üstten ışık alan küre → radial gradient
// ══════════════════════════════════════════════════════════
function FrameStandart({ color, size }) {
    const cx = size / 2, cy = size / 2;
    const R = size * 0.44;
    const uid = `st${Math.round(size)}`;

    const beads = [];
    const N = 14;
    for (let i = 0; i < N; i++) {
        const a = (i / N) * Math.PI * 2 - Math.PI / 2;
        const big = i % 2 === 0;
        const br = size * (big ? 0.072 : 0.044);
        const bx = cx + R * Math.cos(a);
        const by = cy + R * Math.sin(a);
        const gid = `${uid}b${i}`;

        beads.push(
            <Defs key={`d${i}`}>
                {/* Her boncuk: merkezi sol-üst parlak, sağ-alt karanlık */}
                <RadialGradient id={gid} cx="35%" cy="30%" r="65%">
                    <Stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
                    <Stop offset="0.4" stopColor={color} stopOpacity="0.9" />
                    <Stop offset="1" stopColor={shadeColor(color, -60)} stopOpacity="1" />
                </RadialGradient>
            </Defs>,
            // Gölge (biraz aşağı-sağa offset)
            <Circle key={`s${i}`} cx={bx + br * 0.25} cy={by + br * 0.3}
                r={br * 0.9} fill="#000" opacity={0.18} />,
            // Boncuk
            <Circle key={`b${i}`} cx={bx} cy={by}
                r={br} fill={`url(#${gid})`} />,
        );
    }

    // Ana halka — 3D tüp efekti: iki gradient üst üste
    return (
        <Svg width={size} height={size}>
            <Defs>
                <LinearGradient id={`${uid}ra`} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
                    <Stop offset="0.4" stopColor={color} stopOpacity="0" />
                    <Stop offset="1" stopColor={shadeColor(color, -80)} stopOpacity="0.6" />
                </LinearGradient>
                <RadialGradient id={`${uid}rb`} cx="50%" cy="50%" r="50%">
                    <Stop offset="0.7" stopColor={color} stopOpacity="0" />
                    <Stop offset="1" stopColor={color} stopOpacity="0.25" />
                </RadialGradient>
            </Defs>
            {/* Gölge halkası */}
            <Circle cx={cx + 2} cy={cy + 2} r={R} fill="none"
                stroke="#000" strokeWidth={4} strokeOpacity={0.12} />
            {/* Ana halka */}
            <Circle cx={cx} cy={cy} r={R} fill="none"
                stroke={color} strokeWidth={4.5} />
            {/* Üst parlama şeridi */}
            <Circle cx={cx} cy={cy} r={R} fill="none"
                stroke={`url(#${uid}ra)`} strokeWidth={4.5} />
            {/* Dış glow */}
            <Circle cx={cx} cy={cy} r={R + 3} fill="url(#${uid}rb)" />
            {beads}
        </Svg>
    );
}

// ══════════════════════════════════════════════════════════
//  TIER 2 — MODERN: 3D metal levha + kabartma elmaslar
//  Teknik: stroke çiftleme ile kalınlık hissi, elmaslar extruded
// ══════════════════════════════════════════════════════════
function FrameModern({ color, size }) {
    const cx = size / 2, cy = size / 2;
    const uid = `mo${Math.round(size)}${color.slice(1, 4)}`;
    const R = size * 0.46;

    const light = shadeColor(color, 80);
    const dark = shadeColor(color, -70);
    const mid = color;

    const diamonds = [];
    for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 - Math.PI / 4;
        const x = cx + R * Math.cos(a);
        const y = cy + R * Math.sin(a);
        const s = size * 0.07;
        const gid = `${uid}dm${i}`;
        const big = i % 2 === 0;

        diamonds.push(
            <Defs key={`dd${i}`}>
                <LinearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
                    <Stop offset="0.4" stopColor={color} />
                    <Stop offset="1" stopColor={dark} />
                </LinearGradient>
            </Defs>,
            // Gölge (extruded depth)
            <Polygon key={`ds${i}`}
                points={`${x + 2},${y - s + 2} ${x + s * 0.6 + 2},${y + 2} ${x + 2},${y + s + 2} ${x - s * 0.6 + 2},${y + 2}`}
                fill="#000" opacity={big ? 0.22 : 0.12}
            />,
            // Elmas
            <Polygon key={`d${i}`}
                points={`${x},${y - s} ${x + s * 0.6},${y} ${x},${y + s} ${x - s * 0.6},${y}`}
                fill={big ? `url(#${gid})` : light}
                opacity={big ? 1 : 0.6}
            />,
        );
    }

    return (
        <Svg width={size} height={size}>
            <Defs>
                {/* Metal tüp gradyanı — 3D boru hissi */}
                <LinearGradient id={`${uid}mg`} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={light} stopOpacity="1" />
                    <Stop offset="0.25" stopColor={mid} stopOpacity="1" />
                    <Stop offset="0.5" stopColor={dark} stopOpacity="1" />
                    <Stop offset="0.75" stopColor={mid} stopOpacity="1" />
                    <Stop offset="1" stopColor={light} stopOpacity="0.7" />
                </LinearGradient>
                <LinearGradient id={`${uid}mg2`} x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor="#fff" stopOpacity="0.45" />
                    <Stop offset="0.3" stopColor="#fff" stopOpacity="0" />
                    <Stop offset="0.7" stopColor="#000" stopOpacity="0" />
                    <Stop offset="1" stopColor="#000" stopOpacity="0.3" />
                </LinearGradient>
            </Defs>
            {/* Gölge halkası */}
            <Circle cx={cx + 2.5} cy={cy + 3} r={R} fill="none"
                stroke="#000" strokeWidth={7} strokeOpacity={0.15} />
            {/* Metal boru — düşey gradyan */}
            <Circle cx={cx} cy={cy} r={R} fill="none"
                stroke={`url(#${uid}mg)`} strokeWidth={6.5} />
            {/* Metal boru — yatay vurgu */}
            <Circle cx={cx} cy={cy} r={R} fill="none"
                stroke={`url(#${uid}mg2)`} strokeWidth={6.5} />
            {/* İç çizgi */}
            <Circle cx={cx} cy={cy} r={R - 8} fill="none"
                stroke={mid} strokeWidth={1} strokeDasharray="4 4" opacity={0.3} />
            {diamonds}
        </Svg>
    );
}

// ══════════════════════════════════════════════════════════
//  TIER 3 — PREMIUM: Cilalı kristal facet + shimmer
//  Teknik: üçgenler farklı parlaklıkta → faceted gem illüzyon
// ══════════════════════════════════════════════════════════
function FramePremium({ color, size, avatarId }) {
    const shimAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
                Animated.timing(shimAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
            ])
        ).start();
    }, []);
    const shimOpacity = shimAnim.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1] });

    const palettes = {
        19: ['#FFD700', '#FFA500', '#FFFACD', '#92400E'], // altın
        20: ['#E2E8F0', '#94A3B8', '#FFFFFF', '#334155'], // gümüş
        21: ['#94A3B8', '#64748B', '#F1F5F9', '#1E293B'], // gece
        22: ['#F87171', '#DC2626', '#FCA5A5', '#450A0A'], // kırmızı
    };
    const [c1, c2, c3, c4] = palettes[avatarId] || [color, shadeColor(color, -40), '#fff', shadeColor(color, -80)];

    const cx = size / 2, cy = size / 2;
    const uid = `pr${avatarId}`;
    const N = 28; // facet sayısı

    const facets = [], sparks = [];

    for (let i = 0; i < N; i++) {
        const a1 = (i / N) * Math.PI * 2 - Math.PI / 2;
        const a2 = ((i + 1) / N) * Math.PI * 2 - Math.PI / 2;
        const ro = size * 0.47;
        const ri = size * 0.32;
        const x1 = cx + ro * Math.cos(a1), y1 = cy + ro * Math.sin(a1);
        const x2 = cx + ro * Math.cos(a2), y2 = cy + ro * Math.sin(a2);
        const xm = cx + ri * Math.cos((a1 + a2) / 2), ym = cy + ri * Math.sin((a1 + a2) / 2);

        // Her facet kendi açısına göre parlaklık — 3D kesme taşı
        const lightAngle = Math.cos(a1 + Math.PI / 4);
        const brightness = 0.35 + 0.65 * Math.max(0, lightAngle);
        const isBright = brightness > 0.65;

        facets.push(
            // Derinlik gölgesi
            <Polygon key={`fs${i}`}
                points={`${x1 + 1.5},${y1 + 1.5} ${x2 + 1.5},${y2 + 1.5} ${xm + 1.5},${ym + 1.5}`}
                fill="#000" opacity={0.12}
            />,
            // Facet yüzeyi
            <Polygon key={`f${i}`}
                points={`${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)} ${xm.toFixed(1)},${ym.toFixed(1)}`}
                fill={isBright ? c3 : (i % 3 === 0 ? c1 : c2)}
                opacity={0.85 + brightness * 0.15}
                stroke={c1} strokeWidth={0.3}
            />,
        );
    }

    // Keskin ışık noktaları
    for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
        const x = cx + size * 0.445 * Math.cos(a);
        const y = cy + size * 0.445 * Math.sin(a);
        const s = size * 0.038;
        sparks.push(
            <Circle key={`sc${i}`} cx={x} cy={y} r={size * 0.022} fill="#fff" opacity={0.98} />,
            <Line key={`sh${i}`} x1={x - s} y1={y} x2={x + s} y2={y} stroke="#fff" strokeWidth={1.2} opacity={0.8} />,
            <Line key={`sv${i}`} x1={x} y1={y - s} x2={x} y2={y + s} stroke="#fff" strokeWidth={1.2} opacity={0.8} />,
        );
    }

    return (
        <Animated.View style={{ width: size, height: size, opacity: shimOpacity }}>
            <Svg width={size} height={size}>
                <Defs>
                    <LinearGradient id={`${uid}r`} x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0" stopColor={c3} />
                        <Stop offset="0.2" stopColor={c1} />
                        <Stop offset="0.5" stopColor={c3} stopOpacity="0.9" />
                        <Stop offset="0.8" stopColor={c2} />
                        <Stop offset="1" stopColor={c3} />
                    </LinearGradient>
                    <RadialGradient id={`${uid}g`} cx="50%" cy="50%" r="50%">
                        <Stop offset="0.6" stopColor={c1} stopOpacity="0" />
                        <Stop offset="1" stopColor={c1} stopOpacity="0.55" />
                    </RadialGradient>
                </Defs>
                <Circle cx={cx} cy={cy} r={size * 0.5} fill={`url(#${uid}g)`} />
                {facets}
                <Circle cx={cx} cy={cy} r={size * 0.47} fill="none"
                    stroke={`url(#${uid}r)`} strokeWidth={3.5} />
                {sparks}
            </Svg>
        </Animated.View>
    );
}

// ══════════════════════════════════════════════════════════
//  TIER 4 — COSMIC: 3D küre + 2 ters dönen orbital halka
//  Teknik: Elipsis = perspektife düşmüş daire (3D orbit)
// ══════════════════════════════════════════════════════════
function FrameCosmic({ color, size, avatarId }) {
    const rot1 = useRef(new Animated.Value(0)).current;
    const rot2 = useRef(new Animated.Value(0)).current;
    const pulse = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(Animated.timing(rot1, { toValue: 1, duration: 6000, useNativeDriver: true })).start();
        Animated.loop(Animated.timing(rot2, { toValue: 1, duration: 9000, useNativeDriver: true })).start();
        Animated.loop(Animated.sequence([
            Animated.timing(pulse, { toValue: 1, duration: 1200, useNativeDriver: true }),
            Animated.timing(pulse, { toValue: 0, duration: 1200, useNativeDriver: true }),
        ])).start();
    }, []);

    const spin1 = rot1.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
    const spinRev = rot2.interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });
    const glowOp = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.9] });

    const palettes = {
        23: ['#A855F7', '#7C3AED', '#E879F9', '#4C1D95'],
        24: ['#FCD34D', '#F59E0B', '#FFFBEB', '#78350F'],
        25: ['#38BDF8', '#0EA5E9', '#E0F2FE', '#0C4A6E'],
        26: ['#C084FC', '#9333EA', '#F3E8FF', '#3B0764'],
        27: ['#FB923C', '#EA580C', '#FFF7ED', '#431407'],
    };
    const [c1, c2, c3] = palettes[avatarId] || [color, shadeColor(color, -40), '#fff'];

    const cx = size / 2, cy = size / 2;
    const uid = `co${avatarId}`;
    const R = size * 0.44;

    // Orbital parçacıklar — orbit üzerinde ışık noktaları
    const orb1 = Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) * 0.3, r: i % 3 === 0 ? size * 0.04 : size * 0.022 };
    });
    const orb2 = Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
        return { x: cx + R * 0.92 * Math.cos(a) * 0.35, y: cy + R * 0.92 * Math.sin(a), r: i % 2 === 0 ? size * 0.038 : size * 0.02 };
    });

    return (
        <View style={{ width: size, height: size }}>
            {/* Dış nabız glow */}
            <Animated.View style={{
                position: 'absolute', inset: -size * 0.05,
                borderRadius: size, backgroundColor: c1, opacity: glowOp,
                transform: [{ scale: 1.1 }]
            }} />

            {/* Statik arka plan: küre efekti */}
            <Svg width={size} height={size} style={{ position: 'absolute' }}>
                <Defs>
                    <RadialGradient id={`${uid}sphere`} cx="38%" cy="32%" r="62%">
                        <Stop offset="0" stopColor="#fff" stopOpacity="0.12" />
                        <Stop offset="0.5" stopColor={c1} stopOpacity="0.07" />
                        <Stop offset="1" stopColor={c2} stopOpacity="0.18" />
                    </RadialGradient>
                    <LinearGradient id={`${uid}ring`} x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0" stopColor={c3} stopOpacity="0.95" />
                        <Stop offset="0.3" stopColor={c1} />
                        <Stop offset="0.6" stopColor={c3} stopOpacity="0.7" />
                        <Stop offset="1" stopColor={c1} />
                    </LinearGradient>
                </Defs>
                <Circle cx={cx} cy={cy} r={size * 0.49} fill={`url(#${uid}sphere)`} />
                {/* Dış kesik plazma halkası */}
                <Circle cx={cx} cy={cy} r={R + 2} fill="none"
                    stroke={`url(#${uid}ring)`} strokeWidth={2} strokeDasharray="5 3" opacity={0.55} />
                {/* Ana parlak halka */}
                <Circle cx={cx} cy={cy} r={R} fill="none"
                    stroke={`url(#${uid}ring)`} strokeWidth={5.5} />
                {/* İç speküler vurgu (3D küre hissi) */}
                <Ellipse cx={cx - R * 0.15} cy={cy - R * 0.3}
                    rx={R * 0.28} ry={R * 0.12}
                    fill="#fff" opacity={0.18} />
            </Svg>

            {/* 1. Orbit: Perspektif elipsis (yatık düzlem) — ileri döner */}
            <Animated.View style={{ position: 'absolute', inset: 0, transform: [{ rotate: spin1 }] }}>
                <Svg width={size} height={size}>
                    <Defs>
                        <LinearGradient id={`${uid}o1`} x1="0" y1="0" x2="1" y2="0">
                            <Stop offset="0" stopColor={c1} stopOpacity="0" />
                            <Stop offset="0.3" stopColor={c3} stopOpacity="0.9" />
                            <Stop offset="0.7" stopColor={c1} stopOpacity="0.6" />
                            <Stop offset="1" stopColor={c1} stopOpacity="0" />
                        </LinearGradient>
                    </Defs>
                    {/* Perspektife düşmüş orbit elipsis */}
                    <Ellipse cx={cx} cy={cy} rx={R} ry={R * 0.28}
                        fill="none" stroke={`url(#${uid}o1)`} strokeWidth={3.5} />
                    {/* Orbit parçacıkları */}
                    {orb1.map((p, i) => (
                        <Circle key={i} cx={p.x} cy={p.y} r={p.r}
                            fill={i % 3 === 0 ? '#fff' : c1} opacity={i % 3 === 0 ? 0.95 : 0.7} />
                    ))}
                </Svg>
            </Animated.View>

            {/* 2. Orbit: Dikey düzlem — geri döner */}
            <Animated.View style={{ position: 'absolute', inset: 0, transform: [{ rotate: spinRev }] }}>
                <Svg width={size} height={size}>
                    <Defs>
                        <LinearGradient id={`${uid}o2`} x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor={c2} stopOpacity="0" />
                            <Stop offset="0.4" stopColor={c3} stopOpacity="0.85" />
                            <Stop offset="0.6" stopColor={c1} stopOpacity="0.5" />
                            <Stop offset="1" stopColor={c2} stopOpacity="0" />
                        </LinearGradient>
                    </Defs>
                    <Ellipse cx={cx} cy={cy} rx={R * 0.3} ry={R}
                        fill="none" stroke={`url(#${uid}o2)`} strokeWidth={3} />
                    {orb2.map((p, i) => (
                        <Circle key={i} cx={p.x} cy={p.y} r={p.r}
                            fill={i % 2 === 0 ? c3 : c1} opacity={0.85} />
                    ))}
                </Svg>
            </Animated.View>
        </View>
    );
}

// ══════════════════════════════════════════════════════════
//  TIER 5 — ELİTE: 3D altın taç / mücevher krown
//  Teknik: dönen facet ring + nabız glow + speküler highlight
// ══════════════════════════════════════════════════════════
function FrameElite({ color, size, avatarId }) {
    const rotAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(0)).current;
    const shimAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const speed = avatarId === 30 ? 5000 : avatarId === 28 ? 7000 : 9000;
        Animated.loop(Animated.timing(rotAnim, { toValue: 1, duration: speed, useNativeDriver: true })).start();
        Animated.loop(Animated.sequence([
            Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 0.7, duration: 700, useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 0.6, duration: 1500, useNativeDriver: true }),
        ])).start();
        Animated.loop(Animated.sequence([
            Animated.timing(shimAnim, { toValue: 1, duration: 2500, useNativeDriver: true }),
            Animated.timing(shimAnim, { toValue: 0, duration: 2500, useNativeDriver: true }),
        ])).start();
    }, []);

    const spin = rotAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
    const glowOp = pulseAnim.interpolate({ inputRange: [0.6, 1], outputRange: [0.4, 0.9] });
    const shimOp = shimAnim.interpolate({ inputRange: [0, 1], outputRange: [0.75, 1] });

    const palettes = {
        28: ['#FFD700', '#FFA500', '#FFFACD', '#B45309'],
        29: ['#F472B6', '#9333EA', '#FDF4FF', '#4C1D95'],
        30: ['#FFD700', '#FFD700', '#FFFFF0', '#78350F'],
    };
    const [c1, c2, c3, c4] = palettes[avatarId] || ['#FFD700', '#FFA500', '#FFFACD', '#92400E'];

    const cx = size / 2, cy = size / 2;
    const uid = `el${avatarId}`;
    const N = 30; // facet sayısı

    // Dönen facet çemberi
    const facets = [];
    for (let i = 0; i < N; i++) {
        const a1 = (i / N) * Math.PI * 2 - Math.PI / 2;
        const a2 = ((i + 1) / N) * Math.PI * 2 - Math.PI / 2;
        const ro = size * 0.47, ri = size * 0.345;
        const x1 = cx + ro * Math.cos(a1), y1 = cy + ro * Math.sin(a1);
        const x2 = cx + ro * Math.cos(a2), y2 = cy + ro * Math.sin(a2);
        const xm = cx + ri * Math.cos((a1 + a2) / 2), ym = cy + ri * Math.sin((a1 + a2) / 2);

        // 3D: açıya göre parlaklık
        const angle = Math.cos(a1 - Math.PI * 0.25);
        const bright = angle > 0.4;

        facets.push(
            // Gölge (derinlik)
            <Polygon key={`s${i}`}
                points={`${x1 + 2},${y1 + 2} ${x2 + 2},${y2 + 2} ${xm + 2},${ym + 2}`}
                fill="#000" opacity={0.2}
            />,
            <Polygon key={`f${i}`}
                points={`${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)} ${xm.toFixed(1)},${ym.toFixed(1)}`}
                fill={bright ? c3 : (i % 3 === 0 ? c1 : c2)}
                opacity={bright ? 1 : (i % 3 === 0 ? 0.95 : 0.7)}
                stroke="rgba(255,220,0,0.35)" strokeWidth={0.4}
            />,
        );
    }

    // Dış taç dişleri — perspektif için elips üzerinde
    const crown = [];
    const CROWN = 12;
    for (let i = 0; i < CROWN; i++) {
        const a = (i / CROWN) * Math.PI * 2 - Math.PI / 2;
        const rb = size * 0.47, rt = size * 0.56;
        const al = a - 0.12, ar = a + 0.12;
        const xl = cx + rb * Math.cos(al), yl = cy + rb * Math.sin(al);
        const xr = cx + rb * Math.cos(ar), yr = cy + rb * Math.sin(ar);
        const xt = cx + rt * Math.cos(a), yt = cy + rt * Math.sin(a);
        const isTall = i % 3 === 0;
        crown.push(
            // Diş gölgesi
            <Polygon key={`cs${i}`}
                points={`${xl + 2},${yl + 2} ${xt + 2},${yt + 2} ${xr + 2},${yr + 2}`}
                fill="#000" opacity={0.2}
            />,
            // Diş
            <Polygon key={`c${i}`}
                points={`${xl.toFixed(1)},${yl.toFixed(1)} ${xt.toFixed(1)},${yt.toFixed(1)} ${xr.toFixed(1)},${yr.toFixed(1)}`}
                fill={isTall ? c3 : c1}
                stroke="rgba(255,220,0,0.5)" strokeWidth={0.8}
                opacity={isTall ? 1 : 0.8}
            />,
        );
    }

    // Köşe büyük elmaslar
    const bigGems = [];
    for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 - Math.PI / 4;
        const x = cx + size * 0.455 * Math.cos(a);
        const y = cy + size * 0.455 * Math.sin(a);
        const s = size * 0.095;
        bigGems.push(
            // Derinlik gölgesi
            <Polygon key={`gs${i}`}
                points={`${x + 3},${y - s + 3} ${x + s * 0.6 + 3},${y + 3} ${x + 3},${y + s + 3} ${x - s * 0.6 + 3},${y + 3}`}
                fill="#000" opacity={0.25}
            />,
            // Elmas gövdesi
            <Polygon key={`g${i}`}
                points={`${x},${y - s} ${x + s * 0.6},${y} ${x},${y + s} ${x - s * 0.6},${y}`}
                fill={c3} stroke={c1} strokeWidth={1}
            />,
            // Speküler vurgu
            <Polygon key={`gh${i}`}
                points={`${x - s * 0.1},${y - s * 0.7} ${x + s * 0.25},${y - s * 0.1} ${x - s * 0.15},${y - s * 0.1}`}
                fill="#fff" opacity={0.8}
            />,
            // Işık çarpı
            <Line key={`gh2${i}`} x1={x - s * 0.3} y1={y} x2={x + s * 0.3} y2={y}
                stroke="#fff" strokeWidth={1} opacity={0.9} />,
            <Line key={`gv2${i}`} x1={x} y1={y - s * 0.3} x2={x} y2={y + s * 0.3}
                stroke="#fff" strokeWidth={1} opacity={0.9} />,
        );
    }

    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            {/* Büyük dış altın glow — nabız */}
            <Animated.View style={{
                position: 'absolute',
                width: size * 1.22, height: size * 1.22,
                borderRadius: size,
                backgroundColor: c1,
                opacity: glowOp,
                transform: [{ scale: 1 }],
            }} />

            {/* Shimmer: facet + büyük elmaslar döner */}
            <Animated.View style={{ position: 'absolute', inset: 0, transform: [{ rotate: spin }], opacity: shimOp }}>
                <Svg width={size} height={size}>
                    <Defs>
                        <LinearGradient id={`${uid}fl`} x1="0" y1="0" x2="1" y2="1">
                            <Stop offset="0" stopColor={c3} />
                            <Stop offset="0.25" stopColor={c1} />
                            <Stop offset="0.5" stopColor={c3} stopOpacity="0.9" />
                            <Stop offset="0.75" stopColor={c2} />
                            <Stop offset="1" stopColor={c3} />
                        </LinearGradient>
                    </Defs>
                    {facets}
                    <Circle cx={cx} cy={cy} r={size * 0.47} fill="none"
                        stroke={`url(#${uid}fl)`} strokeWidth={3.5} />
                    {bigGems}
                </Svg>
            </Animated.View>

            {/* Sabit: taç dişleri + iç speküler */}
            <Svg width={size} height={size} style={{ position: 'absolute' }}>
                <Defs>
                    <LinearGradient id={`${uid}cl`} x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0" stopColor={c3} />
                        <Stop offset="0.33" stopColor={c1} />
                        <Stop offset="0.66" stopColor={c3} stopOpacity="0.8" />
                        <Stop offset="1" stopColor={c2} />
                    </LinearGradient>
                    <RadialGradient id={`${uid}spec`} cx="38%" cy="30%" r="50%">
                        <Stop offset="0" stopColor="#fff" stopOpacity="0.2" />
                        <Stop offset="1" stopColor="#fff" stopOpacity="0" />
                    </RadialGradient>
                </Defs>
                {crown}
                {/* İç halka */}
                <Circle cx={cx} cy={cy} r={size * 0.33} fill="none"
                    stroke={c1} strokeWidth={1.2} opacity={0.4} />
                {/* Küresel speküler vurgu (üst-sol) */}
                <Ellipse cx={cx - size * 0.1} cy={cy - size * 0.18}
                    rx={size * 0.22} ry={size * 0.09}
                    fill="url(#${uid}spec)" />
            </Svg>
        </View>
    );
}

// ══════════════════════════════════════════════════════════
//  ANA BİLEŞEN
// ══════════════════════════════════════════════════════════
export default function AvatarFrame({ avatarId, color, size = 80 }) {
    const id = avatarId || 1;

    const shadow =
        id >= 28 ? { shadowColor: color, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.9, shadowRadius: 20, elevation: 24 } :
            id >= 23 ? { shadowColor: color, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.8, shadowRadius: 14, elevation: 18 } :
                id >= 19 ? { shadowColor: color, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.65, shadowRadius: 10, elevation: 12 } :
                    id >= 11 ? { shadowColor: color, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.35, shadowRadius: 6, elevation: 6 } :
                        { shadowColor: color, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 };

    return (
        <Animated.View style={[{ width: size, height: size, },]}>
            {id >= 28 && <FrameElite color={color} size={size} avatarId={id} />}
            {id >= 23 && id < 28 && <FrameCosmic color={color} size={size} avatarId={id} />}
            {id >= 19 && id < 23 && <FramePremium color={color} size={size} avatarId={id} />}
            {id >= 11 && id < 19 && <FrameModern color={color} size={size} />}
            {id < 11 && <FrameStandart color={color} size={size} />}
        </Animated.View>
    );
}