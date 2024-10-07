import { useState } from 'react';
import PropTypes from 'prop-types';
import './SearchBars.css';
import searchIcon from '../../assets/search-icon.svg';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가

const SearchBars = ({ initialValue }) => {
  const [query, setQuery] = useState(initialValue || '');
  const navigate = useNavigate(); // 리디렉션을 위한 useNavigate 사용

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearchClick = () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    console.log('Navigating to:', trimmedQuery.startsWith('@') ? `/search-users?query=${trimmedQuery}` : `/search-results?query=${trimmedQuery}`); // 로그 추가

    // '@'로 시작하면 SearchUserResultsPage로 이동, 그렇지 않으면 SearchResultsPage로 이동
    if (trimmedQuery.startsWith('@')) {
      navigate(`/search-users?query=${trimmedQuery}`);
    } else {
      navigate(`/search-results?query=${trimmedQuery}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <div className='search-input-container'>
      <input
        type="text"
        className="search-bar-input"
        value={query}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="검색어를 입력하세요"
      />
      <button className="search-bar-button" onClick={handleSearchClick}>
        <img src={searchIcon} alt="Search Icon" className="search-bar-icon" />
      </button>
    </div>
  );
};

// PropTypes 정의
SearchBars.propTypes = {
  initialValue: PropTypes.string,
};

export default SearchBars;
