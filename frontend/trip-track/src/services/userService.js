import api from '../utils/authApi'; // API 요청을 처리하는 api 인스턴스를 가져옴

/**
 * 사용자 검색 함수
 * @param {string} query - 검색할 사용자명 (이름)
 * @returns {Promise<Array>} - 검색된 사용자 목록 반환
 */
export const searchUsers = async (query) => {
  if (!query) return [];

  try {
    const response = await api.get(`/search/users/${query}`);
    return response.data; // 사용자 데이터 반환
  } catch (error) {
    console.error('Failed to search users:', error.message);
    return [];
  }
};