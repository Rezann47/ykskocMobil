// Avatar sistemi — her numara bir hayvan/emoji karaktere karşılık gelir
// Kullanıcı numara seçer, uygulama o avatarı gösterir

export const AVATARS = [
  // --- STANDART (SEVİMLİ & RENKLİ) ---
  { id: 1, emoji: '🐱', name: 'Kedi', bg: '#FFE4E1', color: '#FF6B6B' },
  { id: 2, emoji: '🐶', name: 'Köpek', bg: '#FFF3CD', color: '#F59E0B' },
  { id: 3, emoji: '🐼', name: 'Panda', bg: '#F0F0F0', color: '#374151' },
  { id: 4, emoji: '🐰', name: 'Tavşan', bg: '#FFF0F3', color: '#F43F5E' },
  { id: 5, emoji: '🐨', name: 'Koala', bg: '#E8F4F8', color: '#60A5FA' },
  { id: 6, emoji: '🐸', name: 'Kurbağa', bg: '#DCFCE7', color: '#16A34A' },
  { id: 7, emoji: '🐧', name: 'Penguen', bg: '#DBEAFE', color: '#1D4ED8' },
  { id: 8, emoji: '🐻', name: 'Ayı', bg: '#FEF3C7', color: '#92400E' },
  { id: 9, emoji: '🦉', name: 'Baykuş', bg: '#EEF2FF', color: '#4338CA' },
  { id: 10, emoji: '🐬', name: 'Yunus', bg: '#ECFEFF', color: '#0891B2' },

  // --- MODERN & DOĞAL ---
  { id: 11, emoji: '🦋', name: 'Kelebek', bg: '#F5F3FF', color: '#7C3AED' },
  { id: 12, emoji: '🦊', name: 'Tilki', bg: '#FFF7ED', color: '#EA580C' },
  { id: 13, emoji: '🐙', name: 'Ahtapot', bg: '#FAF5FF', color: '#9333EA' },
  { id: 14, emoji: '🐳', name: 'Balina', bg: '#EFF6FF', color: '#3B82F6' },
  { id: 15, emoji: '🌸', name: 'Sakura', bg: '#FDF2F8', color: '#EC4899' },
  { id: 16, emoji: '🌊', name: 'Dalga', bg: '#F0FDFA', color: '#0D9488' },
  { id: 17, emoji: '🍃', name: 'Yaprak', bg: '#F0FDF4', color: '#16A34A' },
  { id: 18, emoji: '🌙', name: 'Hilal', bg: '#1E1E2E', color: '#FCD34D' },

  // --- PREMIUM (KOYU TEMA & LÜKS) ---
  { id: 19, emoji: '🐆', name: 'Leopar', bg: '#FEF3C7', color: '#B45309' },
  { id: 20, emoji: '🦅', name: 'Kartal', bg: '#F8FAFC', color: '#64748B' },
  { id: 21, emoji: '🐺', name: 'Kurt', bg: '#334155', color: '#F1F5F9' }, // Gece Grisi
  { id: 22, emoji: '🐉', name: 'Ejderha', bg: '#450A0A', color: '#F87171' }, // Koyu Kırmızı
  { id: 23, emoji: '🪐', name: 'Satürn', bg: '#0F172A', color: '#A855F7' }, // Galaksi
  { id: 24, emoji: '💎', name: 'Elmas', bg: '#E0F7FA', color: '#00ACC1' },
  { id: 25, emoji: '🚀', name: 'Roket', bg: '#1E293B', color: '#38BDF8' },
  { id: 26, emoji: '🎭', name: 'Maske', bg: '#2E1065', color: '#C084FC' },
  { id: 27, emoji: '🔥', name: 'Alev', bg: '#450A0A', color: '#FB923C' },

  // --- ELITE (ALTIN & SİYAH SERİSİ) ---
  { id: 28, emoji: '🦁', name: 'Aslan Kral', bg: '#171717', color: '#FACC15' }, // Altın sarısı detaylar
  { id: 29, emoji: '🦄', name: 'Unicorn', bg: '#2D0631', color: '#F472B6' }, // Koyu mor/pembe
  { id: 30, emoji: '👑', name: 'Majeste', bg: '#0A0A0A', color: '#FFD700' }, // Tam Siyah & Gerçek Altın


];

export function getAvatar(id) {
  return AVATARS.find(a => a.id === id) || AVATARS[0];
}

// Kullanıcı ID'sinden deterministik avatar seç (avatar seçmemişse)
export function getDefaultAvatar(userId) {
  if (!userId) return AVATARS[0];
  // UUID'nin son karakterini sayıya çevir
  const last = parseInt(userId.replace(/-/g, '').slice(-2), 16);
  return AVATARS[last % AVATARS.length];
}
