import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import PostCard from './PostCard'; // PostCard 컴포넌트
import './PostList.css'; // 스타일링 파일

const API_BASE_URL = 'https://kdt.frontend.5th.programmers.co.kr:5008'; // API 기본 URL

const PostList = ({ channelId, activeTab, isLoggedIn }) => {
  const [posts, setPosts] = useState([]); // 포스트 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 오류 상태

  // API 호출 함수 (특정 채널의 포스트 목록을 가져옴)
  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token'); // 로그인 토큰 가져오기

      // 토큰이 필요한 탭 (Following)에서 로그인하지 않은 경우 오류 처리
      if (activeTab === 'Following' && !isLoggedIn) {
        throw new Error('로그인이 필요합니다.');
      }

      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // API 요청
      const response = await axios.get(`${API_BASE_URL}/posts/channel/${channelId}`, {
        headers,
      });

      let sortedPosts = response.data;

      // 탭에 따른 정렬 방식 변경
      if (activeTab === 'New') {
        // 최신 포스트 먼저
        sortedPosts = sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (activeTab === 'Trending') {
        // 좋아요 수가 많은 순으로 정렬
        sortedPosts = sortedPosts.sort((a, b) => b.likes.length - a.likes.length);
      } else if (activeTab === 'Following' && isLoggedIn) {
        // 로그인된 사용자의 Following 포스트 목록만
        // 실제 구현에서는 '팔로잉한 사용자' 데이터를 추가로 받아와야 함
        sortedPosts = sortedPosts.filter(post => post.author.isFollowed);
      }

      setPosts(sortedPosts); 
      setLoading(false); // 로딩 완료
    } catch (err) {
      console.error('포스트 데이터를 가져오는 중 오류 발생:', err);
      setError(err.message); // 오류 상태 업데이트
      setLoading(false); // 로딩 완료
    }
  };

  // 컴포넌트가 처음 렌더링될 때 및 탭 변경 시 API 호출
  useEffect(() => {
    fetchPosts();
  }, [channelId, activeTab]); // 채널 ID 또는 탭이 변경될 때마다 다시 호출

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
  channelId: PropTypes.string.isRequired, // 채널 ID
  activeTab: PropTypes.string.isRequired, // 현재 선택된 탭 (New, Trending, Following)
  isLoggedIn: PropTypes.bool.isRequired,  // 로그인 여부
};

export default PostList;