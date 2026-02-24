import { Platform } from 'react-native';
import { useStore } from '../store';

// const BASE_URL = Platform.OS === 'ios' ? 'http://localhost:8080/api/v1' : 'http://10.0.2.2:8080/api/v1'; // Emülatör için
const BASE_URL = 'https://api-6o23.onrender.com/api/v1'; // Gerçek sunucu
class ApiClient {
  async request(endpoint, options = {}) {
    const { accessToken, refreshToken, updateToken, logout } = useStore.getState();

    const headers = {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    };
    console.log(BASE_URL + endpoint, options);
    let res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

    // Token süresi dolmuşsa refresh dene
    if (res.status === 401 && refreshToken) {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        updateToken(data.data.access_token);
        headers.Authorization = `Bearer ${data.data.access_token}`;
        res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
      } else {
        logout();
        throw new Error('SESSION_EXPIRED');
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
  ping: () => api.post('/users/me/ping'),

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

  // Öğrencinin koçlarını listele (öğrenci rolü kullanır)
  listMyInstructors: () => api.get('/students/my-instructors'),
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
export const messageApi = {
  send: (data) => api.post('/messages', data),
  listConversations: () => api.get('/messages/conversations'),
  getConversation: (peerId, page = 1) =>
    api.get(`/messages/conversations/${peerId}?page=${page}&limit=30`),
  markRead: (peerId) => api.post(`/messages/conversations/${peerId}/read`),
  unreadCount: () => api.get('/messages/unread'),
};

