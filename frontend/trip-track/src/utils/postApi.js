import axios from 'axios';

const API_BASE_URL = 'https://kdt.frontend.5th.programmers.co.kr:5008'

// 토큰을 localStorage에서 가져오는 함수
const getToken = () => localStorage.getItem('token');

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

    // 토큰 가져오기
    const token = getToken();
    
    // 토큰이 없는 경우 처리
    if (!token) {
      throw new Error('로그인 정보가 없습니다. 다시 로그인 해주세요.');
    }

    // Axios POST 요청 (form-data 전송)
    const response = await axios.post(`${API_BASE_URL}/posts/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // 파일 업로드를 위해 multipart 사용
        Authorization: `Bearer ${token}` // localStorage에서 가져온 JWT 토큰 사용
      }
    });

    return response.data; // 성공적으로 생성된 포스트 데이터 반환
  } catch (error) {
    handleError(error); // 오류 처리
  }
};

// 좌표(위도, 경도)로부터 국가명을 가져오는 함수
export const getCountryName = async (lat, lng) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        latlng: `${lat},${lng}`,
        key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Vite 환경 변수로 변경
      },
    });

    // Google Maps API 응답 전체 확인 (디버깅)
    console.log('Google Maps API 응답:', response.data);

    // results 배열이 비어있는 경우 처리
    const results = response.data.results;
    if (!results || results.length === 0) {
      console.warn(`국가 데이터를 가져오지 못했습니다: 위도: ${lat}, 경도: ${lng}`);
      return 'Unknown'; // 결과가 없으면 'Unknown' 반환
    }

    const addressComponents = results[0]?.address_components;
    
    if (addressComponents) {
      // 국가명 필터링
      const country = addressComponents.find(component => component.types.includes('country'));
      const administrativeArea = addressComponents.find(component => component.types.includes('administrative_area_level_1'));

      // 대한민국인 경우 광역시 또는 도 정보를 함께 표시
      if (country?.long_name === '대한민국' && administrativeArea) {
        return `${country.long_name}: ${administrativeArea.long_name}`; // 대한민국: (광역시 또는 도) 형태로 반환
      }
      
      // 대한민국이 아닌 경우 국가명만 반환
      return country ? country.long_name : 'Unknown';
    } else {
      console.warn('address_components를 찾을 수 없습니다.');
      return 'Unknown';
    }
  } catch (error) {
    console.error('국가를 가져오는 중 오류 발생:', error);
    return 'Unknown'; // 오류 발생 시 'Unknown' 반환
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
