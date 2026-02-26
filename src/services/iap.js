// services/iap.js
import {
  initConnection,
  endConnection,
  getSubscriptions,
  requestSubscription,
  purchaseUpdatedListener,
  purchaseErrorListener,
  finishTransaction,
  getAvailablePurchases,
  clearTransactionIOS,
} from 'react-native-iap';
import { Platform } from 'react-native';
import { userApi } from './api';

// ─── Ürün ID'leri ─────────────────────────────────────────
export const SUBSCRIPTION_ID = Platform.select({
  ios: 'com.kaya.yksrota.premium',
  android: 'premium_monthly',
});

// ─── Bağlantı ─────────────────────────────────────────────
export async function connectIAP() {
  try {
    await initConnection();
    if (Platform.OS === 'ios') {
      await clearTransactionIOS();
    }
    return true;
  } catch (err) {
    console.log('IAP bağlantı hatası:', err);
    return false;
  }
}

export async function disconnectIAP() {
  await endConnection();
}

// ─── Ürün bilgisi getir ───────────────────────────────────
export async function fetchSubscription() {
  try {
    const subs = await getSubscriptions({ skus: [SUBSCRIPTION_ID] });
    return subs?.[0] || null;
  } catch (err) {
    console.log('Ürün getirme hatası:', err);
    return null;
  }
}

// ─── Satın alma ───────────────────────────────────────────
export async function buyPremium() {
  try {
    await requestSubscription({ sku: SUBSCRIPTION_ID });
  } catch (err) {
    if (err.code !== 'E_USER_CANCELLED') {
      throw err;
    }
  }
}

// ─── Mevcut satın almaları kontrol et (restore) ───────────
export async function restorePurchases() {
  try {
    const purchases = await getAvailablePurchases();
    const hasPremium = purchases.some(p => p.productId === SUBSCRIPTION_ID);
    return hasPremium;
  } catch (err) {
    console.log('Restore hatası:', err);
    return false;
  }
}

// ─── Purchase listener'ları kur ───────────────────────────
export function setupPurchaseListeners({ onSuccess, onError }) {
  const successSub = purchaseUpdatedListener(async (purchase) => {
    const receipt = purchase.transactionReceipt;
    if (!receipt) return;
    try {
      await userApi.verifyPurchase({
        platform: Platform.OS,
        product_id: purchase.productId,
        transaction_id: purchase.transactionId,
        receipt: receipt,
        package_name: purchase.packageNameAndroid,
        subscription_id: purchase.productId,
        purchase_token: purchase.purchaseToken,
      });
      await finishTransaction({ purchase, isConsumable: false });
      onSuccess?.();
    } catch (err) {
      console.log('Satın alma doğrulama hatası:', err);
      onError?.(err);
    }
  });

  const errorSub = purchaseErrorListener((err) => {
    if (err.code !== 'E_USER_CANCELLED') {
      console.log('Satın alma hatası:', err);
      onError?.(err);
    }
  });

  return () => {
    successSub.remove();
    errorSub.remove();
  };
}