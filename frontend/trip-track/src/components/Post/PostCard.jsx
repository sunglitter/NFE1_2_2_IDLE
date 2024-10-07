import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getCountryName } from '../../utils/postApi.js'; // getCountryName 함수 임포트

const PostCard = ({ post }) => {
  const parsedTitle = JSON.parse(post.title); // title을 JSON 파싱

  const thumbnailImage = post.image || null;
  const firstLocation = parsedTitle?.dailyLocations?.[0]?.locations?.[0]?.description || '장소 설명이 없습니다';

  const [countries, setCountries] = useState([]); // 국가 목록을 저장할 배열

  const fetchCountries = async () => {
    const countrySet = new Set();

    if (parsedTitle?.dailyLocations?.length > 0) {
      for (const day of parsedTitle.dailyLocations) {
        for (const location of day.locations) {
          const country = await getCountryName(location.lat, location.lng);
          countrySet.add(country);
        }
      }
    }
    setCountries(Array.from(countrySet)); 
  };

  useEffect(() => {
    fetchCountries(); 
  }, [post]);

  // 날짜 포맷팅 함수 (xxxx.xx.xx 형식)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 필요
    const day = String(date.getDate()).padStart(2, '0'); // 일도 2자리로 맞춤
    return `${year}.${month}.${day}`;
  };

  // 상대 시간 포맷팅 함수
  const formatRelativeDate = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMs = now - postDate;
    
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}초 전`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    } else if (diffInWeeks < 5) {
      return `${diffInWeeks}주 전`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths}개월 전`;
    } else {
      return `${diffInYears}년 전`;
    }
  };

  return (
    <div className="post-card">
      <div className="thumbnail">
        {thumbnailImage ? (
          <img src={thumbnailImage} alt="Post Thumbnail" className="thumbnail-image" />
        ) : (
          <div className="thumbnail-placeholder">
            <p>{firstLocation.substring(0, 20)}...</p> 
          </div>
        )}
      </div>

      <div className="post-info">
        <h2 className="post-title">{parsedTitle?.title || '제목 없음'}</h2>
        <div className="post-details">
          <p>여행 장소: {countries.length > 0 ? countries.join(', ') : '장소 정보 없음'}</p>
          <p>
            여행 기간: {parsedTitle?.dates?.[0] ? formatDate(parsedTitle.dates[0]) : '기간 정보 없음'} ~{' '}
            {parsedTitle?.dates?.[1] ? formatDate(parsedTitle.dates[1]) : '기간 정보 없음'}
          </p>
          <p>작성일: {formatRelativeDate(post.createdAt)}</p> {/* 상대 시간으로 작성일 표시 */}
          <p>작성자: {post.author?.fullName || '작성자 정보 없음'}</p>
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
