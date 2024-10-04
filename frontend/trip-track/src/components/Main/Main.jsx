import { useEffect, useState } from 'react';
import HeaderAfterSignIn from '../Common/HeaderAfterSignIn.jsx';
import HeaderBeforeSignIn from '../Common/HeaderBeforeSignIn.jsx'
import SearchBar from '../Common/SearchBar.jsx'


const MainBeforeSignIn = () => {
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
      
    </div>
    
       );
     };
    
     export default MainBeforeSignIn
    