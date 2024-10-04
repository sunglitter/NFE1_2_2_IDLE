import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './SearchBar.css';

const SearchBar = ({ onSearch, onFilter, onTabChange }) => {
    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState('New');
    const [selectedOption, setSelectedOption] = useState('이번 주');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부 상태 추가

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

    const handleFilterClick = () => {
        if (onFilter) {
            onFilter();
        }
    };

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

                <button onClick={handleFilterClick} className="filter-btn">
                    조건 설정
                </button>
            </div>

            {/* 오른쪽: 드롭다운 + 탭 버튼들 */}
            <div className="tab-container">
                {/* 드롭다운 (New 탭에서만 활성화) */}
                {activeTab === 'New' && (
                    <div className="dropdown">
                        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="dropdown-button">
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
                    className={`tab-button ${activeTab === 'New' ? 'active' : ''}`}
                    onClick={() => handleTabClick('New')}
                >
                    New
                </button>
                <button
                    className={`tab-button ${activeTab === 'Trending' ? 'active' : ''}`}
                    onClick={() => handleTabClick('Trending')}
                >
                    Trending
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
    onSearch: PropTypes.func.isRequired,   // 검색어가 변경될 때 호출되는 함수, 필수
    onFilter: PropTypes.func.isRequired,   // 필터 버튼 클릭 시 호출되는 함수, 필수
    onTabChange: PropTypes.func.isRequired // 탭 변경 시 호출되는 함수, 필수
};

export default SearchBar;
