import { useState, useEffect } from 'react';
import { Button, SearchBar, PostCard, Dropdown, Header } from '../components';
import { fetchPosts } from '../services/postService'; // 포스트 데이터를 가져오는 API 호출 함수
import './MainPage.css';

const MainPage = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('New'); // 기본 필터를 'New'로 설정
  const [trendingPeriod, setTrendingPeriod] = useState('이번 주'); // Trending 기간을 설정
  const [isLoading, setIsLoading] = useState(true);

  // 필터 또는 기간 변경 시 포스트 목록을 불러오는 함수
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      const fetchedPosts = await fetchPosts(filter, trendingPeriod);
      setPosts(fetchedPosts);
      setIsLoading(false);
    };

    loadPosts();
  }, [filter, trendingPeriod]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (newFilter !== 'Trending') {
      setTrendingPeriod(''); // 'New' 선택 시 기간 필터를 초기화
    }
  };

  const handleTrendingPeriodChange = (newPeriod) => {
    setTrendingPeriod(newPeriod);
  };

  return (
    <div className="main-page">
      {/* 헤더 부분 */}
      <Header>
        <Button text="Sign In" onClick={() => window.location.href = '/signin'} />
        <Button text="Sign Up" onClick={() => window.location.href = '/signup'} />
      </Header>

      {/* 검색 창 */}
      <div className="search-bar-container">
        <SearchBar value={searchTerm} onChange={handleSearchChange} placeholder="포스트, @사용자 검색" />
      </div>

      {/* 필터 탭 (New / Trending) */}
      <div className="filter-tabs">
        <Button 
          text="New" 
          onClick={() => handleFilterChange('New')} 
          isActive={filter === 'New'}
        />
        <Button 
          text="Trending" 
          onClick={() => handleFilterChange('Trending')} 
          isActive={filter === 'Trending'}
        />
      </div>

      {/* Trending 기간 선택 (Trending 탭을 선택한 경우에만 노출) */}
      {filter === 'Trending' && (
        <div className="filter-container">
          <Dropdown
            options={['이번 주', '이번 분기', '올해']}
            selectedOption={trendingPeriod}
            onOptionSelect={handleTrendingPeriodChange}
          />
        </div>
      )}

      {/* 포스트 목록 */}
      <div className="post-list">
        {isLoading ? (
          <p>로딩 중...</p>
        ) : (
          posts
            .filter(post => post.title.includes(searchTerm)) // 검색어 필터링
            .map(post => (
              <PostCard key={post._id} post={post} />
            ))
        )}
      </div>
    </div>
  );
};

export default MainPage;
