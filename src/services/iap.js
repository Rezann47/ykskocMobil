import { Platform } from 'react-native';

export const SUBSCRIPTION_ID = Platform.select({
  ios: 'com.kaya.yksrota.premium',
  android: 'premium_monthly',
});