import axios from "axios";

const api = axios.create({
  baseURL: "https://kdt.frontend.5th.programmers.co.kr:5008", // 백엔드 서버의 기본 URL
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 시 JWT 토큰 자동 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 사용자 회원가입
export const signup = async (fullName, email, password) => {
  const response = await api.post('/signup', { fullName, email, password });
  return response.data;
};

// 사용자 로그인
export const login = async (email, password) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

// 특정 사용자 정보 불러오기
export const getUserProfile = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

// 나의 프로필 이미지 변경
export const uploadPhoto = async (image, isCover) => {
  const response = await api.post('/users/upload-photo', { image, isCover });
  return response.data;
};

// 나의 정보를 변경
export const updateUserProfile = async (fullName, email) => {
  const response = await api.put('/settings/update-user', { fullName, email });
  return response.data;
};

// 내 계정 비밀번호 변경
export const updatePassword = async (password, newPassword) => {
  const response = await api.put('/settings/update-password', { password, newPassword });
  return response.data;
};

export default api;