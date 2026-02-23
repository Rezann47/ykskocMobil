# YKS Koçum — React Native (Expo 54)

## Kurulum

```bash
npm install
```

## Başlatma

```bash
npx expo start
```

## API URL Ayarı

`src/services/api.js` içindeki `BASE_URL`'i güncelle:

```js
// Local geliştirme
const BASE_URL = 'http://localhost:8080/api/v1';

// Production (Render)
const BASE_URL = 'https://your-app.onrender.com/api/v1';
```

## AdMob Ayarı

`app.json` içindeki `ca-app-pub-XXXXXXXX` değerlerini gerçek AdMob ID'lerinle değiştir.

`src/components/ads/BannerAd.js` ve `useInterstitial.js` içindeki unit ID'leri de güncelle.

## Proje Yapısı

```
src/
  screens/
    auth/         → Login, Register
    student/      → Home, Pomodoro, Subjects, Topics, Exams, Profile
    instructor/   → InstructorScreen, StudentDetail
  components/
    common/       → Button, Input, Card, Badge, ProgressBar, Empty, Loading
    ads/          → BannerAd, useInterstitial
  navigation/     → Stack + Tab navigators
  services/       → API client + tüm endpoint'ler
  store/          → Zustand (auth + theme)
  theme/          → Light/Dark renkler
```

## Özellikler

- ✅ Auth (kayıt/giriş/çıkış + token yenileme)
- ✅ Pomodoro timer (25/45/60/90 dk, ders seçimi, geçmiş)
- ✅ Konu takibi (TYT/AYT, tik/untik)
- ✅ Deneme sonuçları (TYT/AYT, net hesaplama, istatistik)
- ✅ Eğitmen paneli (öğrenci ekleme, ilerleme/pomodoro/deneme görüntüleme)
- ✅ Light/Dark tema toggle
- ✅ Banner + Interstitial reklam (premium kullanıcılara gösterilmez)
- ✅ Token auto-refresh
