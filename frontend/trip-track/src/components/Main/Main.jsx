import { useEffect, useState } from 'react';
import HeaderAfterSignIn from '../Common/HeaderAfterSignIn.jsx';
import HeaderBeforeSignIn from '../Common/HeaderBeforeSignIn.jsx'
import SearchBar from '../Common/SearchBar.jsx'
import PostList from '../Post/PostList.jsx';

const channelId = '66ff441851e9a379d07c0c08'; 

const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그인 여부 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // 토큰이 있으면 true, 없으면 false
  }, []);
    
    return (
      <div>
      {/* 로그인 여부에 따라 헤더를 조건부로 렌더링 */}
      {isLoggedIn ? <HeaderAfterSignIn /> : <HeaderBeforeSignIn />}
      <SearchBar/>
      <h1>포스트 목록</h1>
      <PostList channelId={channelId} />
    </div>
    
       );
     };
    
     export default Main
    