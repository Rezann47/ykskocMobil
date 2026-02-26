// hooks/useIAP.js
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import {
  connectIAP, disconnectIAP,
  fetchSubscription, buyPremium,
  restorePurchases, setupPurchaseListeners,
} from '../services/iap';
import { useStore } from '../store';
import { userApi } from '../services/api';

export default function useIAP() {
  const { updateUser } = useStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [connected, setConnected] = useState(false);

  // ─── Bağlan ve ürünü getir ───────────────────────────
  useEffect(() => {
    let cleanup;

    async function init() {
      setLoading(true);
      const ok = await connectIAP();
      setConnected(ok);

      if (ok) {
        const sub = await fetchSubscription();
        setProduct(sub);

        // Purchase listener'ları kur
        cleanup = setupPurchaseListeners({
          onSuccess: async () => {
            setPurchasing(false);
            // Kullanıcı bilgisini güncelle
            try {
              const me = await userApi.getMe();
              updateUser(me);
            } catch { }
            Alert.alert(
              '🎉 Premium Aktif!',
              'Tebrikler! Premium üyeliğin başarıyla aktifleşti.',
            );
          },
          onError: (err) => {
            setPurchasing(false);
            Alert.alert('Hata', 'Satın alma tamamlanamadı. Lütfen tekrar dene.');
          },
        });
      }

      setLoading(false);
    }

    init();

    return () => {
      cleanup?.();
      disconnectIAP();
    };
  }, []);

  // ─── Satın al ────────────────────────────────────────
  const purchase = useCallback(async () => {
    if (!connected || purchasing) return;
    setPurchasing(true);
    try {
      await buyPremium();
      // Sonuç listener'dan gelecek, burada bekleme
    } catch (err) {
      setPurchasing(false);
      Alert.alert('Hata', err.message || 'Satın alma başlatılamadı.');
    }
  }, [connected, purchasing]);

  // ─── Restore (App Store zorunlu kılar) ───────────────
  const restore = useCallback(async () => {
    setRestoring(true);
    try {
      const hasPremium = await restorePurchases();
      if (hasPremium) {
        const me = await userApi.getMe();
        updateUser(me);
        Alert.alert('✅ Geri Yüklendi', 'Premium üyeliğin geri yüklendi!');
      } else {
        Alert.alert('Bulunamadı', 'Aktif bir premium abonelik bulunamadı.');
      }
    } catch {
      Alert.alert('Hata', 'Geri yükleme başarısız. Lütfen tekrar dene.');
    }
    setRestoring(false);
  }, []);

  // ─── Fiyat formatla ──────────────────────────────────
  const priceText = product?.localizedPrice || '₺80';

  return { product, priceText, loading, purchasing, restoring, purchase, restore };
}
