import { Alert } from 'react-native';
import { useStore } from '../store';
import { Platform } from 'react-native';


// const BASE_URL = Platform.OS === 'ios' ? 'http://localhost:8080/api/v1' : 'http://10.0.2.2:8080/api/v1'; // Emülatör için
const BASE_URL = 'https://api-6o23.onrender.com/api/v1'; // Gerçek sunucu

class ApiClient {
  constructor() {
    this._isRefreshing = false;
    this._refreshQueue = [];
  }

  async request(endpoint, options = {}) {
    const { accessToken, refreshToken, updateToken, logout } = useStore.getState();

    const headers = {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    };

    let res;
    try {
      console.log("istek:", BASE_URL, endpoint)
      res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
    } catch {
      // Network hatası (sunucu kapalı, internet yok) → logout YAPMA
      throw new Error('Bağlantı hatası, lütfen tekrar dene');
    }

    // ─── 401 → refresh dene ───────────────────────────────
    if (res.status === 401 && refreshToken) {
      console.log("res", res.status)


      // Zaten refresh yapılıyorsa kuyruğa gir, bitince tekrar dene
      if (this._isRefreshing) {
        return new Promise((resolve, reject) => {
          this._refreshQueue.push({ resolve, reject, endpoint, options });
        });
      }

      this._isRefreshing = true;

      try {

        const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });


        if (refreshRes.ok) {
          const data = await refreshRes.json();
          const newToken = data.data.access_token;

          updateToken(newToken);

          // Kuyruktaki bekleyen istekleri yeni token ile tekrar gönder
          this._refreshQueue.forEach(({ resolve, reject, endpoint: ep, options: op }) => {
            const retryHeaders = {
              ...op.headers,
              'Content-Type': 'application/json',
              Authorization: `Bearer ${newToken}`,
            };
            fetch(`${BASE_URL}${ep}`, { ...op, headers: retryHeaders })
              .then(r => r.json().then(j => r.ok ? resolve(j.data) : reject(new Error(j.message))))
              .catch(reject);
          });
          this._refreshQueue = [];

          // Asıl isteği yeni token ile tekrar yap
          headers.Authorization = `Bearer ${newToken}`;
          res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

        } else {
          console.log("full cıkıs")
          // Refresh token da geçersiz — sadece O ZAMAN logout
          this._refreshQueue.forEach(({ reject }) => reject(new Error('SESSION_EXPIRED')));
          this._refreshQueue = [];

          Alert.alert(
            'Oturum Süresi Doldu',
            'Güvenliğin için tekrar giriş yapman gerekiyor.',
            [{ text: 'Tamam', onPress: () => logout() }],
          );
          throw new Error('SESSION_EXPIRED');
        }

      } catch (err) {
        // Network hatası refresh sırasında → logout YAPMA
        if (err.message !== 'SESSION_EXPIRED') {
          this._refreshQueue.forEach(({ reject }) => reject(err));
          this._refreshQueue = [];
          throw new Error('Bağlantı hatası, lütfen tekrar dene');
        }
        throw err;
      } finally {
        this._isRefreshing = false;
      }
    }

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Bir hata oluştu');
    return json.data;
  }

  get(endpoint) { return this.request(endpoint, { method: 'GET' }); }
  post(endpoint, body) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) }); }
  patch(endpoint, body) { return this.request(endpoint, { method: 'PATCH', body: JSON.stringify(body) }); }
  delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }
}

export const api = new ApiClient();

// ─── Auth ────────────────────────────────────────────────
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  refresh: (token) => api.post('/auth/refresh', { refresh_token: token }),
  logout: (token) => api.post('/auth/logout', { refresh_token: token }),
};

// ─── User ────────────────────────────────────────────────
export const userApi = {
  getMe: () => api.get('/users/me'),
  updateProfile: (data) => api.patch('/users/me', data),
  getPremium: () => api.get('/users/me/premium'),
  activatePremium: () => api.post('/users/me/premium/activate'),
  ping: () => api.post('/users/me/ping', {}),
  saveFCMToken: (token) => api.post('/users/me/fcm-token', { fcm_token: token }),
  verifyPurchase: (data) => api.post('/purchases/verify', data),

};

// ─── Subjects ────────────────────────────────────────────
export const subjectApi = {
  list: (examType) => api.get(`/subjects${examType ? `?exam_type=${examType}` : ''}`),
  topics: (subjectId) => api.get(`/subjects/${subjectId}/topics`),
  markTopic: (id, val) => api.patch(`/topics/${id}/mark`, { is_completed: val }),
  progress: (subjectId) => api.get(`/subjects/${subjectId}/progress`),
  allProgress: () => api.get('/subjects/progress'),
};

// ─── Pomodoro ────────────────────────────────────────────
export const pomodoroApi = {
  create: (data) => api.post('/pomodoros', data),
  list: (params) => api.get(`/pomodoros?${new URLSearchParams(params)}`),
  stats: (from, to) => api.get(`/pomodoros/stats?from=${from}&to=${to}`),
  delete: (id) => api.delete(`/pomodoros/${id}`),
};

// ─── Exam Results ────────────────────────────────────────
export const examApi = {
  create: (data) => api.post('/exam-results', data),
  list: (params) => api.get(`/exam-results?${new URLSearchParams(params)}`),
  stats: (examType) => api.get(`/exam-results/stats?exam_type=${examType}`),
  delete: (id) => api.delete(`/exam-results/${id}`),
};

// ─── Instructor ──────────────────────────────────────────
export const instructorApi = {
  addStudent: (code) => api.post('/instructor/students', { student_code: code }),
  listStudents: () => api.get('/instructor/students'),
  removeStudent: (id) => api.delete(`/instructor/students/${id}`),
  studentPomodoros: (id, f, t) => api.get(`/instructor/students/${id}/pomodoros?from=${f}&to=${t}`),
  studentProgress: (id) => api.get(`/instructor/students/${id}/progress`),
  studentExams: (id, type) => api.get(`/instructor/students/${id}/exam-results?exam_type=${type}`),
  studentPlans: (id, date) => api.get(`/instructor/students/${id}/study-plans?date=${date}`),
  createPlanForStudent: (id, data) => api.post(`/instructor/students/${id}/study-plans`, data),
  listMyInstructors: () => api.get('/students/my-instructors'),
};

// ─── Messages ────────────────────────────────────────────
export const messageApi = {
  send: (data) => api.post('/messages', data),
  listConversations: () => api.get('/messages/conversations'),
  getConversation: (peerId, page) => api.get(`/messages/conversations/${peerId}?page=${page || 1}`),
  markRead: (peerId) => api.post(`/messages/conversations/${peerId}/read`, {}),
  unreadCount: () => api.get('/messages/unread'),
};

// ─── Study Plans ─────────────────────────────────────────
export const studyPlanApi = {
  create: (data) => api.post('/study-plans', data),
  listByDate: (date) => api.get(`/study-plans?date=${date}`),
  listByMonth: (year, month) => api.get(`/study-plans/month?year=${year}&month=${month}`),
  delete: (id) => api.delete(`/study-plans/${id}`),
  completeItem: (planId, itemId) => api.patch(`/study-plans/${planId}/items/${itemId}/complete`, {}),
  uncompleteItem: (planId, itemId) => api.patch(`/study-plans/${planId}/items/${itemId}/uncomplete`, {}),
  createForStudent: (studentId, data) => api.post(`/instructor/students/${studentId}/study-plans`, data),
};