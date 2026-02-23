import { useEffect, useRef } from 'react';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { useStore } from '../../store';

const INTERSTITIAL_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';

const ad = InterstitialAd.createForAdRequest(INTERSTITIAL_ID, {
  requestNonPersonalizedAdsOnly: false,
});

export function useInterstitial() {
  const loaded = useRef(false);
  const { user } = useStore();

  useEffect(() => {
    const unsubLoad = ad.addAdEventListener(AdEventType.LOADED, () => {
      loaded.current = true;
    });
    const unsubClose = ad.addAdEventListener(AdEventType.CLOSED, () => {
      loaded.current = false;
      ad.load(); // kapandıktan sonra yeni reklam yükle
    });

    ad.load();
    return () => { unsubLoad(); unsubClose(); };
  }, []);

  const show = () => {
    if (user?.is_premium) return; // premium'a gösterme
    if (loaded.current) ad.show();
  };

  return { show };
}
