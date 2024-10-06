import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../components/Search/SearchBars';
import UserGrid from '../components/User/UserGrid';
import { searchUsers } from '../services/userService';

const SearchUserResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [resultsCount, setResultsCount] = useState(0);
  
  // 검색된 사용자 목록을 가져오는 함수
  const fetchUsers = async (query) => {
    if (!query.startsWith('@')) return; // '@'로 시작하지 않으면 검색하지 않음
    const searchQueryWithoutAt = query.slice(1); // '@'를 제외한 검색어 추출

    try {
      const usersData = await searchUsers(searchQueryWithoutAt); // userService의 searchUsers 함수 호출
      setUsers(usersData);
      setResultsCount(usersData.length);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
      setResultsCount(0);
    }
  };
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query') || '';

    // '@'로 시작하지 않는 경우 포스트 검색 페이지로 리디렉션
    if (!query.startsWith('@')) {
      navigate(`/search-results?query=${query}`);
      return;
    }

    setSearchQuery(query);
    fetchUsers(query); // 초기 검색어로 사용자 검색
  }, [location.search]);

  const handleSearch = (query) => {
    // '@'로 시작하지 않으면 포스트 검색 페이지로 이동
    if (!query.startsWith('@')) {
      navigate(`/search-results?query=${query}`);
      return;
    }

    setSearchQuery(query);
    fetchUsers(query);
    navigate(`?query=${query}`);
  };
  
      return (
        <div className="search-user-results-page-container">
          {/* 검색창과 정렬 섹션 */}
          <div className="search-bar-and-sort">
            <div className="search-bar-section">
              <SearchBar initialValue={searchQuery} onSearch={handleSearch} />
            </div>
          </div>
  
      {/* 검색 결과 및 사용자 목록 */}
      <div className="search-results-container">
        <div className="search-results-text">
          <h1>{`"${searchQuery}"에 대한 검색 결과`}</h1>
          <h2>사용자 {resultsCount}명을 발견했습니다</h2>
        </div>
        <UserGrid users={users} />
      </div>
    </div>
  );
};

export default SearchUserResultsPage;