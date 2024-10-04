import axios from 'axios';

const API_BASE_URL = 'https://kdt.frontend.5th.programmers.co.kr:5008';

// 하드코딩된 JWT 토큰
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY2ZmY0NzIwNTFlOWEzNzlkMDdjMGMzNSIsImVtYWlsIjoiYWJjQGdtYWlsLmNvbSJ9LCJpYXQiOjE3MjgwMDU5MjF9.HHv9_EvCenDPp0pQcUAge_K54Vo4y2xkzzhCmBCkLkI'; // 하드코딩된 토큰

export const createPost = async (postData) => {
  try {
    const formData = new FormData();

    // title을 JSON.stringify로 변환하여 formData에 추가
    formData.append('title', JSON.stringify(postData.title));

    // 이미지 파일이 있을 경우 추가
    if (postData.image) {
      formData.append('image', postData.image); // 파일 객체
    }

    // channelId 추가
    formData.append('channelId', postData.channelId);

    // Axios POST 요청 (form-data 전송)
    const response = await axios.post(`${API_BASE_URL}/posts/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // 파일 업로드를 위해 multipart 사용
        Authorization: `Bearer ${token}` // 하드코딩된 JWT 토큰 사용
      }
    });

    return response.data; // 성공적으로 생성된 포스트 데이터 반환
  } catch (error) {
    handleError(error); // 오류 처리
  }
};


// 공통 에러 처리 함수
const handleError = (error) => {
  if (error.response) {
    // 서버 응답이 있는 경우
    throw new Error(`API 요청 실패: ${error.response.data.message}`);
  } else if (error.request) {
    // 요청이 전송되었으나 응답이 없는 경우
    throw new Error('서버로부터 응답이 없습니다.');
  } else {
    // 다른 에러
    throw new Error(`API 요청 중 오류 발생: ${error.message}`);
  }
};
