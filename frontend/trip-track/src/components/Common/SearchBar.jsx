import { useState, useEffect } from 'react';
import { FaUndo } from 'react-icons/fa';
import PropTypes from 'prop-types';
import './SearchBar.css';

const SearchBar = ({ onSearch, onFilter, onTabChange, postCount }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('New');
  const [selectedOption, setSelectedOption] = useState('이번 주');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부 상태 추가
  const [isFiltersOpen, setIsFiltersOpen] = useState(false); // 필터창 열림 상태
  const [selectedFilters, setSelectedFilters] = useState([]); // 선택된 필터들

  const categories = {
    '국내': ['경기도', '서울', '부산'],
    '해외': ['일본', '프랑스', '미국'],
    '목적': ['휴양, 힐링', '문화, 역사', '액티비티'],
    '인원': ['혼자', '친구', '연인', '가족'],
    '계절': ['봄', '여름', '가을', '겨울'],
    '기간': ['당일치기', '1박 2일', '2박 3일'],
  };

  // 로그인 여부 확인 (localStorage에서 토큰 확인)
  useEffect(() => {
    const token = localStorage.getItem('token'); // 토큰 확인
    setIsLoggedIn(!!token); // 토큰이 있으면 로그인 상태로 간주
  }, []);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query);
    }
  };

  // 필터창 토글 핸들러
  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  // 필터 선택 핸들러
  const handleFilterClick = (filter) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(filter)
        ? prevFilters.filter((f) => f !== filter) // 이미 선택된 경우 해제
        : [...prevFilters, filter] // 선택되지 않은 경우 추가
    );
  };

  // 선택된 필터 초기화 핸들러
  const handleResetClick = () => {
    setSelectedFilters([]);
  };

  // 필터가 변경될 때마다 onFilter 함수 호출
  useEffect(() => {
    if (onFilter) {
      onFilter(selectedFilters); // 선택된 필터를 onFilter 함수에 전달
    }
  }, [selectedFilters, onFilter]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    if (onTabChange) {
      onTabChange(tabName);
    }
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  return (
    <div className="search-bar-container">
      {/* 왼쪽: 검색창과 조건 설정 버튼 */}
{/* 
      <div className="search-bar-wrap">
        <div className="search-input">
          <div className="search-bar">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="포스트 또는 @사용자 검색"
              className="search-input"
            />
            <button onClick={handleSearch} className="search-btn">
              🔍
            </button>
          </div>
        </div>


        <button onClick={toggleFilters} >
          조건 설정
        </button>


        {isFiltersOpen && (
          <div>
            {Object.keys(categories).map((category) => (
              <div key={category} >
                <h5>{category}</h5>
                <div>
                  {categories[category].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => handleFilterClick(filter)}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}


        {selectedFilters.length > 0 && (
          <div>
            <div>
              {selectedFilters.map((filter) => (
                <div
                  key={filter}
                  onClick={() => handleFilterClick(filter)} // 필터 클릭 시 해제 처리
                >
                  {filter}
                  <span>✕</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleResetClick}
            >
              <FaUndo size={24} color="black" />
            </button>
          </div>
        )}


        {selectedFilters.length > 0 && (
          <div>
            <button
              onClick={handleSearch} // 클릭 시 검색 실행
            >
              {`${postCount}개의 결과 보기`} 
            </button>
          </div>
        )}
      </div>
       */}

      {/* 오른쪽: 드롭다운 + 탭 버튼들 */}
      <div className="tab-container">
        {/* 드롭다운 (New 탭에서만 활성화) */}
        {activeTab === 'Trending' && (
          <div className="dropdown">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="dropdown-button"
            >
              {selectedOption} 🔽
            </button>
            {isDropdownOpen && (
              <ul className="dropdown-menu">
                <li onClick={() => handleOptionClick('이번 주')}>이번 주</li>
                <li onClick={() => handleOptionClick('이번 분기')}>이번 분기</li>
                <li onClick={() => handleOptionClick('올해')}>올해</li>
              </ul>
            )}
          </div>
        )}

        {/* 탭 버튼 */}
        <button
          className={`tab-button ${activeTab === 'Trending' ? 'active' : ''}`}
          onClick={() => handleTabClick('Trending')}
        >
          Trending
        </button>
        <button
          className={`tab-button ${activeTab === 'New' ? 'active' : ''}`}
          onClick={() => handleTabClick('New')}
        >
          New
        </button>

        {/* Following 탭: 로그인된 경우에만 렌더링 */}
        {isLoggedIn && (
          <button
            className={`tab-button ${activeTab === 'Following' ? 'active' : ''}`}
            onClick={() => handleTabClick('Following')}
          >
            Following
          </button>
        )}
      </div>
    </div>
  );
};

// Props validation 추가
SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired, // 검색어가 변경될 때 호출되는 함수, 필수
  onFilter: PropTypes.func.isRequired, // 필터 버튼 클릭 시 호출되는 함수, 필수
  onTabChange: PropTypes.func.isRequired, // 탭 변경 시 호출되는 함수, 필수
  postCount: PropTypes.number.isRequired, // 필터링된 포스트 개수
};

export default SearchBar;
