import { useEffect, useState } from 'react';
import HeaderAfterSignIn from '../Common/HeaderAfterSignIn.jsx';
import HeaderBeforeSignIn from '../Common/HeaderBeforeSignIn.jsx';
import SearchBar from '../Common/SearchBar.jsx';
import PostList from '../Post/PostList.jsx';

const channelId = '66ff441851e9a379d07c0c08'; 

const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('New'); // 탭 선택 상태 관리

  // 로그인 여부 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // 토큰이 있으면 true, 없으면 false
  }, []);

  // 탭 변경 핸들러
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      {/* 로그인 여부에 따라 헤더를 조건부로 렌더링 */}
      {isLoggedIn ? <HeaderAfterSignIn /> : <HeaderBeforeSignIn />}
      
      {/* SearchBar에 로그인 상태와 탭 변경 핸들러 전달 */}
      <SearchBar isLoggedIn={isLoggedIn} onTabChange={handleTabChange} activeTab={activeTab} />
      
      <h1>포스트 목록</h1>

      {/* 선택된 탭에 따라 포스트 목록 정렬 */}
      <PostList channelId={channelId} activeTab={activeTab} isLoggedIn={isLoggedIn} />
    </div>
  );
};

export default Main;

    