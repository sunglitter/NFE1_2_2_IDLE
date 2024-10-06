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

import axiosInstance from "./axiosInstance"; // axiosInstance로 변경

export const getUsers = async () => {
  const response = await axiosInstance.get("/users/get-users");
  return response.data;
};

export const getUser = async (userId) => {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data;
};

// 팔로우 API
export const followUser = async (userId) => {
  try {
    const response = await axiosInstance.post("/follow/create", {
      userId: userId, // 서버에 userId 전달
    });
    return response.data;
  } catch (error) {
    console.error("Error following user:", error);
    throw error;
  }
};

// 언팔로우 API
export const unfollowUser = async (followId) => {
  try {
    console.log("Sending unfollow request with followId:", followId); // 디버깅 로그 추가
    const response = await axiosInstance.delete("/follow/delete", {
      data: { id: followId }, // API 명세에 맞게 'id'로 전달
    });
    return response.data;
  } catch (error) {
    console.error("Error unfollowing user:", error);
    throw error;
  }
};