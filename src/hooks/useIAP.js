// hooks/useIAP.js — react-native-iap v14 düzeltilmiş
import { useState, useEffect, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import {
  useIAP,
  fetchProducts,
  requestPurchase,
  finishTransaction,
  restorePurchases,
  purchaseUpdatedListener,
  purchaseErrorListener,
} from 'react-native-iap';
import { useStore } from '../store';
import { SUBSCRIPTION_ID } from '../services/iap';

export default function usePremium() {
  const { updateUser } = useStore();
  const [product, setProduct] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const { connected } = useIAP();

  // ─── Bağlanınca ürünü getir ───────────────────────────
  useEffect(() => {
    if (!connected) return;

    // v14: fetchProducts skus array alıyor
    fetchProducts({ skus: [SUBSCRIPTION_ID] })
      .then(products => {
        console.log('Ürün sayısı:', products?.length);
        console.log('Ürün detay:', JSON.stringify(products?.[0]));
        setProduct(products?.[0] || null);
      })
      .catch(err => console.log('fetchProducts hatası:', err.message));
  }, [connected]);

  // ─── Purchase listener'ları kur ──────────────────────
  useEffect(() => {
    const successListener = purchaseUpdatedListener(async (purchase) => {
      console.log('Purchase geldi:', purchase.productId);
      if (!purchase.transactionReceipt) return;

      try {
        await finishTransaction({ purchase, isConsumable: false });
      } catch (err) {
        console.log('finishTransaction:', err.message);
      }

      setPurchasing(false);
      updateUser({ is_premium: true });
      Alert.alert('🎉 Premium Aktif!', 'Tebrikler! Premium üyeliğin aktifleşti.');
    });

    const errorListener = purchaseErrorListener((err) => {
      console.log('Purchase error:', err.code, err.message);
      setPurchasing(false);
      if (err.code !== 'E_USER_CANCELLED') {
        Alert.alert('Hata', 'Satın alma tamamlanamadı.');
      }
    });

    return () => {
      successListener.remove();
      errorListener.remove();
    };
  }, []);

  // ─── Satın al ────────────────────────────────────────
  const purchase = useCallback(async () => {
    if (!connected || purchasing) return;
    setPurchasing(true);
    try {
      // v14: requestPurchase skus array ile çağrılıyor
      await requestPurchase({
        skus: [SUBSCRIPTION_ID],   // ← array!
      });
    } catch (err) {
      setPurchasing(false);
      if (err.code !== 'E_USER_CANCELLED') {
        Alert.alert('Hata', err.message || 'Satın alma başlatılamadı.');
      }
    }
  }, [connected, purchasing]);

  // ─── Restore ────────────────────────────────────────
  const restore = useCallback(async () => {
    setRestoring(true);
    try {
      const purchases = await restorePurchases();
      const hasPremium = purchases?.some(p => p.productId === SUBSCRIPTION_ID);
      if (hasPremium) {
        updateUser({ is_premium: true });
        Alert.alert('✅ Geri Yüklendi', 'Premium üyeliğin geri yüklendi!');
      } else {
        Alert.alert('Bulunamadı', 'Aktif bir premium abonelik bulunamadı.');
      }
    } catch (err) {
      Alert.alert('Hata', 'Geri yükleme başarısız.');
    }
    setRestoring(false);
  }, []);

  const priceText = product?.localizedPrice || '₺99';
  const loading = !connected;

  return { product, priceText, loading, purchasing, restoring, purchase, restore };
}