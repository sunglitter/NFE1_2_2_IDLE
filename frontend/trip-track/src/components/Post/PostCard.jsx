import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getCountryName } from '../../utils/postApi.js'; // getCountryName 함수 임포트

const PostCard = ({ post }) => {
  // title을 JSON 파싱
  const parsedTitle = JSON.parse(post.title); // title을 JSON 문자열에서 객체로 변환

  // 이미지가 있는지 확인하고, 없으면 첫 번째 방문 장소의 설명을 대체 텍스트로 사용
  const thumbnailImage = post.image || null;
  const firstLocation = parsedTitle?.dailyLocations?.[0]?.locations?.[0]?.description || '장소 설명이 없습니다';

  // 날짜 포맷을 사용자에게 보기 쉽게 변환하는 함수
  const formatDate = (dateString) => {
    if (!dateString) return '날짜 정보 없음'; // dateString이 없을 경우 기본값 반환
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const [countries, setCountries] = useState([]); // 국가 목록을 저장할 배열

  // 모든 장소의 좌표를 바탕으로 국가명을 가져오는 함수
  const fetchCountries = async () => {
    const countrySet = new Set();

    // dailyLocations의 모든 장소에 대해 국가명 요청
    if (parsedTitle?.dailyLocations?.length > 0) {
      for (const day of parsedTitle.dailyLocations) {
        for (const location of day.locations) {
            console.log(`위도: ${location.lat}, 경도: ${location.lng}`); // 좌표 디버깅
          const country = await getCountryName(location.lat, location.lng);
          console.log('가져온 국가:', country); // 가져온 국가 이름 확인
          countrySet.add(country); // 중복되지 않도록 Set에 국가명 추가
        }
      }
    }
    setCountries(Array.from(countrySet)); // Set을 배열로 변환하여 상태 업데이트
  };

  useEffect(() => {
    console.log('Post data:', post); // post 데이터를 확인하는 디버깅 로그
    fetchCountries(); // 국가 목록 가져오기
  }, [post]);

  return (
    <div className="post-card">
      {/* 썸네일 이미지 영역 */}
      <div className="thumbnail">
        {thumbnailImage ? (
          <img src={thumbnailImage} alt="Post Thumbnail" className="thumbnail-image" />
        ) : (
          <div className="thumbnail-placeholder">
            <p>{firstLocation.substring(0, 20)}...</p> {/* 장소 설명 텍스트 일부 */}
          </div>
        )}
      </div>

      {/* 포스트 정보 영역 */}
      <div className="post-info">
        <h2 className="post-title">{parsedTitle?.title || '제목 없음'}</h2>
        <div className="post-details">
          <p>
            여행 기간: {parsedTitle?.dates?.[0] ? formatDate(parsedTitle.dates[0]) : '기간 정보 없음'} ~{' '}
            {parsedTitle?.dates?.[1] ? formatDate(parsedTitle.dates[1]) : '기간 정보 없음'}
          </p>
          <p>작성일: {formatDate(post.createdAt)}</p>
          <p>작성자: {post.author?.fullName || '작성자 정보 없음'}</p>
          
          {/* 방문한 국가 목록 표시 */}
          <p>방문한 국가: {countries.length > 0 ? countries.join(', ') : '국가 정보 없음'}</p>
        </div>
        <div className="post-footer">
          <span>❤️ {post.likes?.length || 0} Likes</span>
        </div>
      </div>
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    image: PropTypes.string,
    title: PropTypes.string.isRequired, // title은 JSON 문자열로 전달되기 때문에 문자열로 처리
    createdAt: PropTypes.string.isRequired,
    author: PropTypes.shape({
      fullName: PropTypes.string.isRequired,
    }).isRequired,
    likes: PropTypes.array.isRequired,
  }).isRequired,
};

export default PostCard;
