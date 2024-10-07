import axios from 'axios';

const API_BASE_URL = 'https://kdt.frontend.5th.programmers.co.kr:5008';

// 1. 댓글 작성 API
export const createComment = async (postId, commentData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/posts/${postId}/comments`, commentData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// 2. 댓글 삭제 API
export const deleteComment = async (postId, commentId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/posts/${postId}/comments/${commentId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const handleError = (error) => {
  if (error.response) {
    throw new Error(`API 요청 실패: ${error.response.data.message}`);
  } else if (error.request) {
    throw new Error('서버로부터 응답이 없습니다.');
  } else {
    throw new Error(`API 요청 중 오류 발생: ${error.message}`);
  }
};
