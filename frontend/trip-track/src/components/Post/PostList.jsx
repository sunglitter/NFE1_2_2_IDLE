import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import PostCard from './PostCard'; // PostCard 컴포넌트
import './PostList.css'; // 스타일링 파일

const API_BASE_URL = 'https://kdt.frontend.5th.programmers.co.kr:5008'; // API 기본 URL

const PostList = ({ channelId }) => {
  const [posts, setPosts] = useState([]); // 포스트 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 오류 상태

  // API 호출 함수 (특정 채널의 포스트 목록을 가져옴)
  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token'); // 로그인 토큰 가져오기

      // 토큰이 없는 경우 처리
      if (!token) {
        throw new Error('로그인 정보가 없습니다. 다시 로그인 해주세요.');
      }

      // API 요청
      const response = await axios.get(`${API_BASE_URL}/posts/channel/${channelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 응답 데이터로 상태 업데이트
      setPosts(response.data); 
      setLoading(false); // 로딩 완료
    } catch (err) {
      console.error('포스트 데이터를 가져오는 중 오류 발생:', err);
      setError(err.message); // 오류 상태 업데이트
      setLoading(false); // 로딩 완료
    }
  };

  // 컴포넌트가 처음 렌더링될 때 API 호출
  useEffect(() => {
    fetchPosts();
  }, [channelId]); // 채널 ID가 변경될 때마다 다시 호출

  // 로딩 상태 처리
  if (loading) {
    return <div>로딩 중...</div>;
  }

  // 오류 상태 처리
  if (error) {
    return <div>오류 발생: {error}</div>;
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} /> 
      ))}
    </div>
  );
};

PostList.propTypes = {
    channelId: PropTypes.string.isRequired, // channelId는 필수로, 문자열이어야 함
  };

export default PostList;