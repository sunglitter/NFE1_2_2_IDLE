import api from '../utils/authApi.js';

// 회원가입 요청 함수
export const signUp = (userData) => {
  return api.post('/signup', userData);
};

// 로그인 요청 함수
export const signIn = async (credentials) => {
  const { data } = await api.post('/login', credentials);
  const { token, user } = data;

  // 토큰을 로컬 스토리지에 저장
  localStorage.setItem('token', token);

  return user; // 로그인 성공 시 사용자 정보 반환
};

// 로그아웃 함수
export const signOut = () => {
  localStorage.removeItem('token');
  console.log('로그아웃 완료');
};
