import React, { useRef, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store';
import { useTheme } from '../components/common';
import { getThemeObject } from '../theme';

// Auth
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Student
import HomeScreen from '../screens/student/HomeScreen';
import PomodoroScreen from '../screens/student/PomodoroScreen';
import SubjectsScreen from '../screens/student/SubjectsScreen';
import TopicsScreen from '../screens/student/TopicsScreen';
import ExamsScreen from '../screens/student/ExamsScreen';
import ProfileScreen from '../screens/student/ProfileScreen';
import StudyPlanScreen from '../screens/student/StudyPlanScreen';
import AddStudyPlanScreen from '../screens/student/AddStudyPlanScreen';

// Instructor
import InstructorScreen from '../screens/instructor/InstructorScreen';
import StudentDetailScreen from '../screens/instructor/StudentDetailScreen';

// Mesajlaşma
import ConversationsScreen from '../screens/messages/ConversationsScreen';
import ChatScreen from '../screens/messages/ChatScreen';

// Tema
import ThemePickerScreen from '../screens/tema/ThemePickerScreen';

import useActivityPing from '../hooks/useActivityPing';
import PremiumScreen from '../screens/premıum/PremiumScreen';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ─────────────────────────────────────────────────────────
//  TAB TANIMLAMALARI
// ─────────────────────────────────────────────────────────

const STUDENT_TABS = [
  { name: 'Ana Sayfa', icon: 'home', label: 'Anasayfa' },
  { name: 'Konular', icon: 'book', label: 'Konular' },
  { name: 'Plan', icon: 'calendar', label: 'Plan' },
  { name: 'Mesajlar', icon: 'chatbubble-ellipses', label: 'Mesajlar' },
  { name: 'Profil', icon: 'person', label: 'Profil' },
];

const INSTRUCTOR_TABS = [
  { name: 'Öğrencilerim', icon: 'people', label: 'Öğrenciler' },
  { name: 'Mesajlar', icon: 'chatbubble-ellipses', label: 'Mesajlar' },
  { name: 'Profil', icon: 'person', label: 'Profil' },
];

// ─────────────────────────────────────────────────────────
//  TEK TAB ITEM
// ─────────────────────────────────────────────────────────

function TabItem({ tab, index, isFocused, onPress, colors, totalCount }) {
  const scale = useRef(new Animated.Value(isFocused ? 1 : 0.9)).current;
  const rise = useRef(new Animated.Value(isFocused ? -8 : 0)).current;
  const glow = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: isFocused ? 1 : 0.9, useNativeDriver: true, speed: 22, bounciness: 10 }),
      Animated.spring(rise, { toValue: isFocused ? -8 : 0, useNativeDriver: true, speed: 22, bounciness: 12 }),
      Animated.timing(glow, { toValue: isFocused ? 1 : 0, useNativeDriver: true, duration: 200 }),
    ]).start();
  }, [isFocused]);

  // 5 tabda ortadaki (Plan) özel görünüm
  const isCenter = totalCount === 5 && index === 2;

  if (isCenter) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.tabItem}>
        <Animated.View style={{ transform: [{ translateY: rise }, { scale }] }}>
          {/* Yüzen yuvarlak buton */}
          <View style={[
            styles.centerBtn,
            {
              backgroundColor: isFocused ? colors.primary : colors.card,
              borderColor: isFocused ? colors.primary + '60' : colors.border,
              shadowColor: colors.primary,
            },
          ]}>
            <Ionicons
              name={isFocused ? tab.icon : tab.icon + '-outline'}
              size={24}
              color={isFocused ? '#fff' : colors.textMuted}
            />
          </View>
          <Text style={[styles.label, {
            color: isFocused ? colors.primary : colors.textMuted,
            fontWeight: isFocused ? '700' : '500',
            alignSelf: 'center',
            textAlign: 'center',
            width: '100%',
          }]}>{tab.label}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.tabItem}>
      <Animated.View style={[styles.tabContent, { transform: [{ translateY: rise }, { scale }] }]}>

        {/* Aktif arka plan */}
        <Animated.View style={[
          styles.pill,
          {
            backgroundColor: colors.primary,
            opacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0, 0.12] }),
          },
        ]} />

        {/* İkon kapsayıcı */}
        <View style={styles.iconBox}>
          <Ionicons
            name={isFocused ? tab.icon : tab.icon + '-outline'}
            size={22}
            color={isFocused ? colors.primary : colors.textMuted}
          />

          {/* Nokta indikatörü */}
          <Animated.View style={[
            styles.dot,
            {
              backgroundColor: colors.primary,
              transform: [{
                scaleX: glow.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
              }],
              opacity: glow,
            },
          ]} />
        </View>

        {/* Label */}
        <Text style={[styles.label, {
          color: isFocused ? colors.primary : colors.textMuted,
          fontWeight: isFocused ? '700' : '400',
        }]} numberOfLines={1}>{tab.label}</Text>

      </Animated.View>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────
//  CUSTOM TAB BAR
// ─────────────────────────────────────────────────────────

function CustomTabBar({ state, navigation, tabs, colors }) {
  return (
    <View style={styles.barOuter}>
      <View style={[
        styles.barCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border + '70',
          shadowColor: colors.isDark ? '#000' : '#64748B',
        },
      ]}>
        {state.routes.map((route, index) => (
          <TabItem
            key={route.key}
            tab={tabs[index]}
            index={index}
            isFocused={state.index === index}
            colors={colors}
            totalCount={tabs.length}
            onPress={() => {
              if (state.index !== index) navigation.navigate(route.name);
            }}
          />
        ))}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────
//  NAVIGATORLAR
// ─────────────────────────────────────────────────────────

function StudentTabs() {
  const colors = useTheme();
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} tabs={STUDENT_TABS} colors={colors} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Ana Sayfa" component={HomeScreen} />
      <Tab.Screen name="Konular" component={SubjectsScreen} />
      <Tab.Screen name="Plan" component={StudyPlanScreen} />
      <Tab.Screen name="Mesajlar" component={ConversationsScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function InstructorTabs() {
  const colors = useTheme();
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} tabs={INSTRUCTOR_TABS} colors={colors} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Öğrencilerim" component={InstructorScreen} />
      <Tab.Screen name="Mesajlar" component={ConversationsScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user } = useStore();
  const colors = useTheme();
  const isInstructor = user?.role === 'instructor';

  const headerStyle = {
    headerStyle: { backgroundColor: colors.surface },
    headerTintColor: colors.text,
    headerTitleStyle: { fontWeight: '700' },
    headerShadowVisible: false,
  };

  return (
    <Stack.Navigator screenOptions={headerStyle}>
      {isInstructor ? (
        <>
          <Stack.Screen name="InstructorMain" component={InstructorTabs} options={{ headerShown: false }} />
          <Stack.Screen name="StudentDetail" component={StudentDetailScreen}
            options={({ route }) => ({ title: route.params?.student?.name || 'Öğrenci Detayı' })} />
          <Stack.Screen name="AddStudyPlan" component={AddStudyPlanScreen} options={{ title: 'Plan Ekle' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="StudentMain" component={StudentTabs} options={{ headerShown: false, headerBackTitle: 'Geri' }} />
          <Stack.Screen name="Topics" component={TopicsScreen}
            options={({ route }) => ({ title: route.params?.subject?.name || 'Konular', headerBackTitle: 'Geri' })} />
          <Stack.Screen name="AddStudyPlan" component={AddStudyPlanScreen} options={{ title: 'Plan Ekle', headerBackTitle: 'Geri' }} />
          <Stack.Screen name="Pomodoro" component={PomodoroScreen} options={{ title: 'Pomodoro', headerBackTitle: 'Geri' }} />
          <Stack.Screen name="Exams" component={ExamsScreen} options={{ title: 'Denemeler', headerBackTitle: 'Geri' }} />
        </>
      )}
      <Stack.Screen name="Chat" component={ChatScreen}
        options={({ route }) => ({ title: route.params?.peer?.name || 'Mesaj', headerBackTitle: 'Geri' })} />
      <Stack.Screen name="ThemePicker" component={ThemePickerScreen}
        options={{ title: 'Tema Seç', headerBackTitle: 'Geri' }} />
      <Stack.Screen name="Premium" component={PremiumScreen}
        options={{ title: 'Premium Ol', headerBackTitle: 'Geri' }} />
    </Stack.Navigator>
  );
}

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default function RootNavigation() {
  const { user, isDark, themeKey } = useStore();
  const theme = getThemeObject(themeKey, isDark);
  useActivityPing();

  return (
    <NavigationContainer theme={theme}>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

// ─────────────────────────────────────────────────────────
//  STİLLER
// ─────────────────────────────────────────────────────────

const BOTTOM = Platform.OS === 'ios' ? 32 : 14;

const styles = StyleSheet.create({
  // ── Dış wrapper ──────────────────────────────────────
  barOuter: {
    position: 'absolute',
    bottom: BOTTOM,
    left: 16,
    right: 16,
  },

  // ── Yüzen kart ───────────────────────────────────────
  barCard: {
    flexDirection: 'row',
    height: 68,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
    // Gölge
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 22,
  },

  // ── Tab item ─────────────────────────────────────────
  tabItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  // ── Arka plan pill ───────────────────────────────────
  pill: {
    position: 'absolute',
    top: -10, bottom: -6,
    left: '10%', right: '10%',
    borderRadius: 28,
  },

  // ── İkon + nokta ─────────────────────────────────────
  iconBox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
  },
  dot: {
    width: 20,
    height: 3,
    borderRadius: 2,
    marginTop: 2,
  },

  // ── Orta özel buton ──────────────────────────────────
  centerBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
    marginBottom: 1,
  },

  // ── Label ─────────────────────────────────────────────
  label: {
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 0.1,
  },
});