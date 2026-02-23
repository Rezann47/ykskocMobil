import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Svg, {
    Circle, Polygon, Line, Path, Defs,
    LinearGradient, RadialGradient, Stop, G
} from 'react-native-svg';

// ── TIER 1: Çiçek yaprakları ─────────────────────────────
function FrameStandart({ color, size }) {
    const cx = size / 2, cy = size / 2, R = size * 0.44;
    const dots = [];
    for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const x = cx + R * Math.cos(a);
        const y = cy + R * Math.sin(a);
        dots.push(
            <Circle key={i} cx={x} cy={y} r={size * 0.055}
                fill={color} opacity={i % 3 === 0 ? 0.9 : 0.3} />
        );
    }
    return (
        <Svg width={size} height={size}>
            <Circle cx={cx} cy={cy} r={R} fill="none"
                stroke={color} strokeWidth={1.5}
                strokeDasharray="3 4" opacity={0.4} />
            {dots}
            <Circle cx={cx} cy={cy} r={R * 0.82} fill="none"
                stroke={color} strokeWidth={1}
                strokeDasharray="2 5" opacity={0.2} />
        </Svg>
    );
}

// ── TIER 2: Art Deco geometrik ───────────────────────────
function FrameModern({ color, size }) {
    const cx = size / 2, cy = size / 2;
    const lines = [], diamonds = [];
    for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const r1 = size * 0.46, r2 = size * 0.34;
        const x1 = cx + r1 * Math.cos(a), y1 = cy + r1 * Math.sin(a);
        const x2 = cx + r2 * Math.cos(a), y2 = cy + r2 * Math.sin(a);
        lines.push(
            <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={color} strokeWidth={i % 2 === 0 ? 2 : 1}
                opacity={i % 2 === 0 ? 0.9 : 0.3} />
        );
        if (i % 2 === 0) {
            const d = size * 0.04;
            diamonds.push(
                <Polygon key={`d${i}`}
                    points={`${x1},${y1 - d} ${x1 + d},${y1} ${x1},${y1 + d} ${x1 - d},${y1}`}
                    fill={color} opacity={0.8} />
            );
        }
    }
    return (
        <Svg width={size} height={size}>
            <Circle cx={cx} cy={cy} r={size * 0.46} fill="none"
                stroke={color} strokeWidth={2} />
            <Circle cx={cx} cy={cy} r={size * 0.33} fill="none"
                stroke={color} strokeWidth={1} opacity={0.3} />
            <Circle cx={cx} cy={cy} r={size * 0.35} fill="none"
                stroke={color} strokeWidth={1} opacity={0.15} />
            {lines}
            {diamonds}
        </Svg>
    );
}

// ── TIER 3: Elmas facet kesim ────────────────────────────
function FramePremium({ color, size }) {
    const cx = size / 2, cy = size / 2;
    const tris = [], sparks = [];
    const N = 20;
    for (let i = 0; i < N; i++) {
        const a1 = (i / N) * Math.PI * 2;
        const a2 = ((i + 1) / N) * Math.PI * 2;
        const ro = size * 0.46, ri = size * 0.33;
        const x1 = cx + ro * Math.cos(a1), y1 = cy + ro * Math.sin(a1);
        const x2 = cx + ro * Math.cos(a2), y2 = cy + ro * Math.sin(a2);
        const xm = cx + ri * Math.cos((a1 + a2) / 2);
        const ym = cy + ri * Math.sin((a1 + a2) / 2);
        tris.push(
            <Polygon key={i}
                points={`${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)} ${xm.toFixed(1)},${ym.toFixed(1)}`}
                fill={color} opacity={i % 2 === 0 ? 0.85 : 0.15}
                stroke={color} strokeWidth={0.5} />
        );
    }
    for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + Math.PI / 12;
        const x = cx + size * 0.43 * Math.cos(a);
        const y = cy + size * 0.43 * Math.sin(a);
        sparks.push(
            <Circle key={i} cx={x} cy={y} r={size * 0.022}
                fill="white" opacity={0.95} />
        );
    }
    return (
        <Svg width={size} height={size}>
            <Defs>
                <LinearGradient id="premGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor={color} stopOpacity={1} />
                    <Stop offset="40%" stopColor="white" stopOpacity={0.9} />
                    <Stop offset="70%" stopColor={color} stopOpacity={0.8} />
                    <Stop offset="100%" stopColor="white" stopOpacity={0.7} />
                </LinearGradient>
            </Defs>
            {tris}
            <Circle cx={cx} cy={cy} r={size * 0.46} fill="none"
                stroke="url(#premGrad)" strokeWidth={2.5} />
            {sparks}
        </Svg>
    );
}

// ── TIER 4: Cosmic animasyonlu ───────────────────────────
function FrameCosmic({ color, size }) {
    const rotAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotAnim, { toValue: 1, duration: 8000, useNativeDriver: true })
        ).start();
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 0, duration: 1200, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const rotate = rotAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
    const opacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

    const cx = size / 2, cy = size / 2;
    const stars = [];
    for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const x = cx + size * 0.44 * Math.cos(a);
        const y = cy + size * 0.44 * Math.sin(a);
        const s = size * 0.06;
        stars.push(
            <Polygon key={i}
                points={`${x},${y - s} ${x + s * 0.3},${y - s * 0.3} ${x + s},${y} ${x + s * 0.3},${y + s * 0.3} ${x},${y + s} ${x - s * 0.3},${y + s * 0.3} ${x - s},${y} ${x - s * 0.3},${y - s * 0.3}`}
                fill={color} opacity={0.9} />
        );
    }

    // Plasma noktalar
    const plasma = [];
    for (let i = 0; i < 32; i++) {
        const a = (i / 32) * Math.PI * 2;
        const wave = Math.sin(i * 0.6) * 0.06;
        const r = size * (0.44 + wave);
        const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
        plasma.push(
            <Circle key={i} cx={x} cy={y} r={size * 0.016}
                fill={color} opacity={0.4 + 0.5 * Math.abs(Math.sin(i * 0.4))} />
        );
    }

    return (
        <Animated.View style={{ width: size, height: size }}>
            <Svg width={size} height={size} style={{ position: 'absolute' }}>
                <Defs>
                    <LinearGradient id="cosmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor={color} />
                        <Stop offset="50%" stopColor="white" stopOpacity={0.6} />
                        <Stop offset="100%" stopColor={color} />
                    </LinearGradient>
                </Defs>
                {plasma}
                <Circle cx={cx} cy={cy} r={size * 0.46} fill="none"
                    stroke="url(#cosmGrad)" strokeWidth={2}
                    strokeDasharray="5 3" />
            </Svg>
            <Animated.View style={{ position: 'absolute', inset: 0, transform: [{ rotate }] }}>
                <Svg width={size} height={size}>
                    {stars}
                </Svg>
            </Animated.View>
        </Animated.View>
    );
}

// ── TIER 5: Elite altın taç + pırlanta ──────────────────
function FrameElite({ color, size }) {
    const pulseAnim = useRef(new Animated.Value(0)).current;
    const shimAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
            ])
        ).start();
        Animated.loop(
            Animated.timing(shimAnim, { toValue: 1, duration: 3000, useNativeDriver: true })
        ).start();
    }, []);

    const glowOpacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });

    const cx = size / 2, cy = size / 2;
    const diamonds = [], spikes = [], sparkles = [];

    // Pırlanta facetler
    for (let i = 0; i < 24; i++) {
        const a1 = (i / 24) * Math.PI * 2;
        const a2 = ((i + 1) / 24) * Math.PI * 2;
        const ro = size * 0.46, ri = size * 0.35;
        const x1 = cx + ro * Math.cos(a1), y1 = cy + ro * Math.sin(a1);
        const x2 = cx + ro * Math.cos(a2), y2 = cy + ro * Math.sin(a2);
        const xm = cx + ri * Math.cos((a1 + a2) / 2);
        const ym = cy + ri * Math.sin((a1 + a2) / 2);
        diamonds.push(
            <Polygon key={i}
                points={`${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)} ${xm.toFixed(1)},${ym.toFixed(1)}`}
                fill={i % 2 === 0 ? color : '#fffff0'}
                opacity={i % 2 === 0 ? 0.9 : 0.3}
                stroke="rgba(255,255,200,0.3)" strokeWidth={0.4} />
        );
    }

    // Taç dişleri
    for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const r1 = size * 0.46, r2 = size * 0.535;
        const al = a - 0.13, ar = a + 0.13;
        const xl = cx + r1 * Math.cos(al), yl = cy + r1 * Math.sin(al);
        const xr = cx + r1 * Math.cos(ar), yr = cy + r1 * Math.sin(ar);
        const xt = cx + r2 * Math.cos(a), yt = cy + r2 * Math.sin(a);
        spikes.push(
            <Polygon key={i}
                points={`${xl.toFixed(1)},${yl.toFixed(1)} ${xt.toFixed(1)},${yt.toFixed(1)} ${xr.toFixed(1)},${yr.toFixed(1)}`}
                fill={i % 3 === 0 ? color : '#fffff0'}
                opacity={i % 3 === 0 ? 1 : 0.5}
                stroke="rgba(255,255,200,0.4)" strokeWidth={0.5} />
        );
    }

    // Parlayan noktalar
    for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const x = cx + size * 0.44 * Math.cos(a);
        const y = cy + size * 0.44 * Math.sin(a);
        sparkles.push(
            <Circle key={i} cx={x} cy={y} r={size * 0.022}
                fill="rgba(255,255,220,0.9)" />
        );
    }

    return (
        <Animated.View style={{ width: size, height: size, opacity: glowOpacity }}>
            <Svg width={size} height={size}>
                <Defs>
                    <LinearGradient id="eliteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor="#ffffc8" stopOpacity={1} />
                        <Stop offset="25%" stopColor={color} stopOpacity={1} />
                        <Stop offset="50%" stopColor="#fffff0" stopOpacity={0.9} />
                        <Stop offset="75%" stopColor={color} stopOpacity={1} />
                        <Stop offset="100%" stopColor="#ffffc8" stopOpacity={1} />
                    </LinearGradient>
                </Defs>
                {diamonds}
                {spikes}
                {sparkles}
                <Circle cx={cx} cy={cy} r={size * 0.46} fill="none"
                    stroke="url(#eliteGrad)" strokeWidth={3} />
                <Circle cx={cx} cy={cy} r={size * 0.34} fill="none"
                    stroke={color} strokeWidth={1} opacity={0.4} />
            </Svg>
        </Animated.View>
    );
}

// ── ANA BİLEŞEN ─────────────────────────────────────────
export default function AvatarFrame({ avatarId, color, size = 80 }) {
    const id = avatarId || 1;

    const shadowStyle = id >= 28
        ? { shadowColor: color, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 20, elevation: 22 }
        : id >= 23
            ? { shadowColor: color, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 14, elevation: 16 }
            : id >= 19
                ? { shadowColor: color, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.7, shadowRadius: 9, elevation: 10 }
                : id >= 11
                    ? { shadowColor: color, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 }
                    : {};

    return (
        <Animated.View style={[{ width: size, height: size }, shadowStyle]}>
            {id >= 28 && <FrameElite color={color} size={size} />}
            {id >= 23 && id < 28 && <FrameCosmic color={color} size={size} />}
            {id >= 19 && id < 23 && <FramePremium color={color} size={size} />}
            {id >= 11 && id < 19 && <FrameModern color={color} size={size} />}
            {id < 11 && <FrameStandart color={color} size={size} />}
        </Animated.View>
    );
}