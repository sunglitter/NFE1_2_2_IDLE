import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import './PostHeaders.css'; // 필요한 CSS 추가

const PostHeaders = ({ activeTab, onFilterChange, isCurrentUser, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="post-header d-flex justify-content-between mx-3 align-items-center">
      {/* 검색 폼 */}
      <form className="search-form d-flex" role="search" onSubmit={handleSearch}>
        <input
          className="form-control search-input"
          type="search"
          placeholder="포스트 검색"
          aria-label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn btn-search" type="submit">
          <CiSearch />
        </button>
      </form>

      {/* 탭 */}
      <ul className="nav post-nav">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "My Posts" ? "active" : ""}`}
            onClick={() => onFilterChange("My Posts")}
          >
            My Posts
          </button>
        </li>
        {isCurrentUser && (
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "Likes" ? "active" : ""}`}
              onClick={() => onFilterChange("Likes")}
            >
              Likes
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default PostHeaders;
