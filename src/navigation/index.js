
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

// Student - Study Plan
import StudyPlanScreen from '../screens/student/StudyPlanScreen';
import AddStudyPlanScreen from '../screens/student/AddStudyPlanScreen';

// Instructor
import InstructorScreen from '../screens/instructor/InstructorScreen';
import StudentDetailScreen from '../screens/instructor/StudentDetailScreen';

import useActivityPing from '../hooks/useActivityPing'; // ← IMPORT EKLE


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function StudentTabs() {
  const colors = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: 8,
          height: 60,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, size, focused }) => {
          const icons = {
            "Ana Sayfa": focused ? 'home' : 'home-outline',
            "Pomodoro": focused ? 'timer' : 'timer-outline',
            "Konular": focused ? 'book' : 'book-outline',
            "Denemeler": focused ? 'document-text' : 'document-text-outline',
            "Profil": focused ? 'person' : 'person-outline', // 🔥 EKLE

          }
          return <Ionicons name={icons[route.name] || 'ellipse'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Ana Sayfa" component={HomeScreen} />
      <Tab.Screen name="Pomodoro" component={PomodoroScreen} />
      <Tab.Screen name="Konular" component={SubjectsScreen} />
      <Tab.Screen name="Plan" component={StudyPlanScreen} />
      <Tab.Screen name="Denemeler" component={ExamsScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function InstructorTabs() {
  const colors = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: 8,
          height: 60,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, size, focused }) => {
          const icons = {
            Öğrencilerim: focused ? 'people' : 'people-outline',
            Profil: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name] || 'ellipse'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Öğrencilerim" component={InstructorScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user } = useStore();
  const colors = useTheme();
  const isInstructor = user?.role === 'instructor';

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
      }}
    >
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
          <Stack.Screen name="Subjects" component={SubjectsScreen} options={{ title: 'Dersler' }} />
          <Stack.Screen name="Exams" component={ExamsScreen} options={{ title: 'Denemeler' }} />
          <Stack.Screen name="AddStudyPlan" component={AddStudyPlanScreen} options={{ title: 'Plan Ekle' }} />
        </>
      )}
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
  const { user, isDark } = useStore();
  const theme = isDark ? darkTheme : lightTheme;

  useActivityPing();


  return (
    <NavigationContainer theme={theme}>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
