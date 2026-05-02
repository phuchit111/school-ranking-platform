import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const match = document.cookie.match(/accessToken=([^;]+)/);
    if (match) config.headers.Authorization = `Bearer ${match[1]}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      try {
        const match = document.cookie.match(/refreshToken=([^;]+)/);
        if (match && err.config) {
          const { data } = await axios.post('/api/auth/refresh', {
            refreshToken: match[1],
          });
          document.cookie = `accessToken=${data.accessToken}; path=/`;
          err.config.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(err.config);
        }
      } catch {
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(err);
  }
);

export default api;
