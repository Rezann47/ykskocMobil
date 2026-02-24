import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store';
import { useTheme } from '../components/common';
import { lightTheme, darkTheme } from '../theme';

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

// Mesajlaşma (her iki rol)
import ConversationsScreen from '../screens/messages/ConversationsScreen';
import ChatScreen from '../screens/messages/ChatScreen';


import useActivityPing from '../hooks/useActivityPing';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ─── Tab ikonları ─────────────────────────────────────────

const STUDENT_ICONS = {
  'Ana Sayfa': ['home', 'home-outline'],
  'Pomodoro': ['timer', 'timer-outline'],
  'Konular': ['book', 'book-outline'],
  'Plan': ['calendar', 'calendar-outline'],
  'Denemeler': ['document-text', 'document-text-outline'],
  'Mesajlar': ['chatbubble-ellipses', 'chatbubble-ellipses-outline'],
  'Profil': ['person', 'person-outline'],
};

const INSTRUCTOR_ICONS = {
  'Öğrencilerim': ['people', 'people-outline'],
  'Mesajlar': ['chatbubble-ellipses', 'chatbubble-ellipses-outline'],
  'Profil': ['person', 'person-outline'],
};

// ─── Tab Bar ortak ayarları ───────────────────────────────

function tabScreenOptions(icons) {
  return ({ route }) => ({
    headerShown: false,
    tabBarIcon: ({ color, size, focused }) => {
      const [active, inactive] = icons[route.name] || ['ellipse', 'ellipse-outline'];
      return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
    },
  });
}

// ─── Student Tabs ─────────────────────────────────────────

function StudentTabs() {
  const colors = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...tabScreenOptions(STUDENT_ICONS)({ route }),
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: 8, height: 60 },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      })}
    >
      <Tab.Screen name="Ana Sayfa" component={HomeScreen} />
      <Tab.Screen name="Konular" component={SubjectsScreen} />
      <Tab.Screen name="Plan" component={StudyPlanScreen} />
      <Tab.Screen name="Mesajlar" component={ConversationsScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ─── Instructor Tabs ──────────────────────────────────────

function InstructorTabs() {
  const colors = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...tabScreenOptions(INSTRUCTOR_ICONS)({ route }),
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: 8, height: 60 },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      })}
    >
      <Tab.Screen name="Öğrencilerim" component={InstructorScreen} />
      <Tab.Screen name="Mesajlar" component={ConversationsScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ─── App Navigator ────────────────────────────────────────

function AppNavigator() {
  const { user } = useStore();
  const colors = useTheme();
  const isInstructor = user?.role === 'instructor';

  const sharedHeaderStyle = {
    headerStyle: { backgroundColor: colors.surface },
    headerTintColor: colors.text,
    headerTitleStyle: { fontWeight: '700' },
    headerShadowVisible: false,
  };

  return (
    <Stack.Navigator screenOptions={sharedHeaderStyle}>
      {isInstructor ? (
        <>
          <Stack.Screen name="InstructorMain" component={InstructorTabs} options={{ headerShown: false }} />
          <Stack.Screen
            name="StudentDetail"
            component={StudentDetailScreen}
            options={({ route }) => ({ title: route.params?.student?.name || 'Öğrenci Detayı' })}
          />
          <Stack.Screen name="AddStudyPlan" component={AddStudyPlanScreen} options={{ title: 'Plan Ekle' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="StudentMain" component={StudentTabs} options={{ headerShown: false }} />
          <Stack.Screen
            name="Topics"
            component={TopicsScreen}
            options={({ route }) => ({ title: route.params?.subject?.name || 'Konular' })}
          />
          <Stack.Screen name="AddStudyPlan" component={AddStudyPlanScreen} options={{ title: 'Plan Ekle' }} />
          <Stack.Screen name="Pomodoro" component={PomodoroScreen} options={{ title: 'Pomodoro' }} />


          <Stack.Screen name="Denemeler" component={ExamsScreen} options={{ title: 'Denemeler' }} />


        </>
      )}

      {/* Chat — her iki rol için ortak */}
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({
          title: route.params?.peer?.name || 'Mesaj',
          headerBackTitle: 'Geri',
        })}
      />
    </Stack.Navigator>
  );
}

// ─── Auth Navigator ───────────────────────────────────────

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// ─── Root ─────────────────────────────────────────────────

export default function RootNavigation() {
  const { user, isDark } = useStore();
  const theme = isDark ? darkTheme : lightTheme;

  useActivityPing();

  return (
    <NavigationContainer theme={theme}>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}