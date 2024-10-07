// axiosInstance.js

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://kdt.frontend.5th.programmers.co.kr:5008', // 서버의 baseURL
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${token}`, // 필요 시 토큰 추가
  },
});

// 요청 인터셉터를 통해 Authorization 헤더 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // 토큰 저장 방식에 맞게 수정
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;