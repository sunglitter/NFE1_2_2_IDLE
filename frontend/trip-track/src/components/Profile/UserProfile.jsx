import React from "react";
import PropTypes from "prop-types";
import { FiEdit } from "react-icons/fi";
import './UserProfile.css';

const UserProfile = ({
  userData,
  isCurrentUser,
  onEditProfile,
  onFollow,
  isFollowing,
  isLoggedIn,  // isLoggedIn 사용
  setModalActiveTab,
}) => {
  return (
    <div className="profile-container">
      <div className="profile-row">
        {/* 프로필 이미지 */}
        <div className="profile-image">
          <img
            src={
              userData.image ||
              `${import.meta.env.BASE_URL}images/defaultProfile.png`
            }
            alt="Profile"
          />
        </div>

        <div className="profile-info">
          <div className="profile-name">
            <div className="fw-bold fs-5">
              {userData.fullName || "Unknown User"}
            </div>

            {/* 수정 버튼 또는 팔로우/언팔로우 버튼 */}
            {isCurrentUser ? (
              <FiEdit
                className="edit-icon"
                onClick={onEditProfile}
              />
            ) : (
              isLoggedIn && ( // 로그인된 사용자만 팔로우/언팔로우 버튼을 볼 수 있음
                <button
                  className="follow-button"
                  onClick={onFollow}
                  style={{
                    backgroundColor: isFollowing ? "#002050" : "#0066ff",
                    color: "white",
                  }}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              )
            )}
          </div>

          {/* 포스트 수, 팔로워 수, 팔로잉 수 */}
          <div className="profile-stats">
            <span>{userData.posts?.length || 0} posts</span>
            <button
              type="button"
              className="btn btn-link"
              onClick={() => setModalActiveTab("followers")}
            >
              {userData.followers?.length || 0} followers
            </button>
            <button
              type="button"
              className="btn btn-link"
              onClick={() => setModalActiveTab("following")}
            >
              {userData.following?.length || 0} followings
            </button>
          </div>

          {/* 사용자 bio */}
          <div className="profile-bio">
            {userData.coverImage || "No bio available"}
          </div>
        </div>
      </div>
    </div>
  );
};

UserProfile.propTypes = {
  userData: PropTypes.shape({
    image: PropTypes.string,
    fullName: PropTypes.string,
    posts: PropTypes.arrayOf(PropTypes.object),
    followers: PropTypes.arrayOf(PropTypes.object),
    following: PropTypes.arrayOf(PropTypes.object),
    coverImage: PropTypes.string,
  }).isRequired,
  isCurrentUser: PropTypes.bool.isRequired,
  onEditProfile: PropTypes.func.isRequired,
  onFollow: PropTypes.func.isRequired,
  isFollowing: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired, // isLoggedIn을 필수로 설정
  setModalActiveTab: PropTypes.func.isRequired,
};

export default UserProfile;
