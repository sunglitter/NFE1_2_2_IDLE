import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 추가
import './PostCard.css';
import { formatDateRelative } from '../../utils/formatDate';
import { getUserDetail } from '../../services/postService'; // 사용자 정보를 가져오는 API 요청 함수

const PostCards = ({ post }) => {
  const navigate = useNavigate();
  const [postAuthor, setPostAuthor] = useState(null); // postAuthor 상태 추가
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  let postData;
  try {
    // postData.title이 JSON 객체의 문자열 형태이므로 이를 파싱하여 사용
    postData = JSON.parse(post.title);
  } catch {
    console.error("Failed to parse post title:", post.title);
    postData = null; // 파싱 실패 시 postData를 null로 설정
  }

  // post.dailyLocations가 존재하지 않는 경우 빈 배열을 사용
  const dailyLocations = postData ? postData.dailyLocations || [] : [];

  // 포스트의 좋아요 수를 post 자체의 likes 배열로 변경
  const likesCount = post.likes ? post.likes.length : 0;

  // post.author가 ID인지 객체인지 확인하여 적절한 값을 할당
  const postAuthorId = post.author && typeof post.author === 'string' ? post.author : post.author?._id;

  // PostCard 클릭 시 해당 포스트의 상세 페이지로 이동
  const handleCardClick = () => {
    navigate(`/posts/${post._id}`); // 예시: /posts/1 경로로 이동
  };

  // 항상 useEffect가 호출되도록 수정 (최상위 레벨에서 호출)
  useEffect(() => {
    const fetchAuthorDetails = async () => {
      try {
        // postAuthorId가 존재할 때만 사용자 정보를 불러옴
        if (postAuthorId) {
          const userDetails = await getUserDetail(postAuthorId);
          setPostAuthor(userDetails);
        } else {
          // post.author가 객체 형태로 제공되었거나 없는 경우 그대로 상태를 설정
          setPostAuthor(post.author || { fullName: 'Unknown Author' });
        }
      } catch (error) {
        console.error("Failed to fetch author details:", error.message);
      } finally {
        setLoading(false); // 로딩이 완료되면 loading 상태 false로 설정
      }
    };

    // fetchAuthorDetails 함수 호출
    fetchAuthorDetails();
  }, [postAuthorId]); // 의존성 배열에 postAuthorId를 추가하여 postAuthorId가 변경될 때마다 실행

  // 로딩 중이거나 postData가 null인 경우 로딩 표시 또는 빈 반환
  if (loading || !postData) {
    return <div>Loading...</div>; // 로딩 중일 때 표시할 내용을 설정 (로딩 UI를 사용할 수 있음)
  }

  return (
    <div className="post-card" onClick={handleCardClick}>
      {/* 썸네일 이미지 */}
      {postData.thumbnail && <img src={postData.thumbnail} alt={`${postData.title} thumbnail`} className="post-thumbnail" />}

      {/* 포스트 제목 */}
      <h3 className="post-title">{postData.title}</h3>

      {/* 여행 지역 및 기간 */}
      <div className="post-details">
        <p className="post-locations">
        {dailyLocations
            .flatMap((daily) => (daily.locations ? daily.locations.map((location) => location.name) : []))
            .join(', ')
            .slice(0, 50)} {/* 여행 장소를 한 줄로 연결하여 표시 */}
          {dailyLocations
            .flatMap((daily) => (daily.locations ? daily.locations.map((location) => location.name) : []))
            .join(', ').length > 50 && '...'} {/* 여행 장소가 길어지면 ...으로 표시 */}
        </p>
        <p className="post-dates">
          {postData.dates ? new Date(postData.dates[0]).toLocaleDateString() : ''} ~{' '}
          {postData.dates ? new Date(postData.dates[1]).toLocaleDateString() : ''}
        </p>
      </div>

      {/* 작성일 및 작성자 */}
      <div className="post-meta">
        <p className="post-created">{formatDateRelative(post.createdAt)}</p>
        {/* postAuthor.fullName이 올바르게 표시되도록 수정 */}
        <div className="post-author-likes">
        <p className="post-author">{postAuthor && postAuthor.fullName ? postAuthor.fullName : 'Unknown Author'}</p>
          <div className="post-likes">
            <span role="img" aria-label="likes">
              ❤️
            </span>
            {likesCount}
          </div>
        </div>
      </div>
    </div>
  );
};

// PropTypes 정의
PostCards.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired, // JSON 형식의 문자열로 수정
    thumbnail: PropTypes.string,
    likes: PropTypes.arrayOf(PropTypes.string), // likes 배열 추가
    createdAt: PropTypes.string.isRequired,
    author: PropTypes.oneOfType([ // author가 ID이거나 객체일 수 있음
      PropTypes.string, // ID일 때
      PropTypes.shape({ // 객체일 때
        fullName: PropTypes.string,
      }),
    ]),
  }).isRequired,
};

export default PostCards;