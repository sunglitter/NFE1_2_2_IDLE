import { useState, useEffect } from 'react';
import { FaUndo } from 'react-icons/fa';
import PropTypes from 'prop-types';
import './SearchBar.css';

const SearchBar = ({ isLoggedIn, onTabChange }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('New');
  const [selectedOption, setSelectedOption] = useState('이번 주');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
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
  isLoggedIn: PropTypes.bool.isRequired, // 로그인 여부를 받는 prop
  onTabChange: PropTypes.func.isRequired, // 탭 변경 시 호출되는 함수, 필수
};

export default SearchBar;
