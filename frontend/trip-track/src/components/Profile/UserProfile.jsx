import PropTypes from "prop-types";
import { FiEdit } from "react-icons/fi";

const UserProfile = ({
  userData,
  isCurrentUser,
  onEditProfile, // 프로필 수정으로 이동하는 함수
  onFollow, // 팔로우/언팔로우 함수
  isFollowing,
  isLoggedIn,
  setModalActiveTab, // setModalActiveTab prop 추가
}) => {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ padding: "30px" }}
    >
      <div className="d-flex w-100 align-items-center">
        <div className="flex-shrink-0">
          <img
            src={
              userData.image ||
              `${import.meta.env.BASE_URL}images/defaultProfile.png`
            }
            alt="Profile"
            className="profile-image"
            style={{ width: "160px", height: "160px" }}
          />
        </div>
        <div className="flex-grow-1 ms-3 d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center">
            <div className="fw-bold fs-5">
              {userData.fullName || "Unknown User"}
            </div>

            {isCurrentUser ? (
              // 프로필 수정 버튼
              <FiEdit
                style={{
                  cursor: "pointer",
                  fontSize: "24px",
                  color: "#0066ff",
                }}
                onClick={onEditProfile} // 프로필 수정 페이지로 이동
              />
            ) : (
              // Follow/Unfollow 버튼
              <button
                className="btn"
                onClick={onFollow}
                style={{
                  backgroundColor: isLoggedIn
                    ? isFollowing
                      ? "#002050"
                      : "#0066ff"
                    : "#0066ff",
                  color: "white",
                  border: "none",
                }}
              >
                {isLoggedIn ? (isFollowing ? "Unfollow" : "Follow") : "Follow"}
              </button>
            )}
          </div>

          <div className="mt-2 d-flex align-items-center">
            <span className="me-4">{userData.posts?.length || 0} posts</span>
            {/* 팔로워 수와 팔로잉 수를 별도의 버튼으로 분리 */}
            <div className="d-flex">
              <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#followListModal"
                className="btn btn-link text-reset me-4 p-0"
                style={{ border: "none", outline: "none", textDecoration: "none" }}
                onClick={() => setModalActiveTab("followers")}
              >
                <span>{userData.followers?.length || 0} followers</span>
              </button>
              <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#followListModal"
                className="btn btn-link text-reset p-0"
                style={{ border: "none", outline: "none", textDecoration: "none" }}
                onClick={() => setModalActiveTab("following")}
              >
                <span>{userData.following?.length || 0} followings</span>
              </button>
            </div>
          </div>

          <div
            className="mt-2"
            style={{ maxWidth: "50%", minHeight: "50px", overflow: "hidden" }}
          >
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
      posts: PropTypes.arrayOf(PropTypes.object), // 게시물 목록
      followers: PropTypes.arrayOf(PropTypes.object), // 팔로워 목록
      following: PropTypes.arrayOf(PropTypes.object), // 팔로잉 목록
      coverImage: PropTypes.string, // 사용자 커버 이미지
    }).isRequired, // userData는 필수
    isCurrentUser: PropTypes.bool.isRequired, // 현재 사용자 여부
    onEditProfile: PropTypes.func.isRequired, // 프로필 수정 함수
    onFollow: PropTypes.func.isRequired, // 팔로우/언팔로우 함수
    isFollowing: PropTypes.bool.isRequired, // 팔로우 여부
    isLoggedIn: PropTypes.bool.isRequired, // 로그인 여부
    setModalActiveTab: PropTypes.func.isRequired, // 모달 활성화 탭 설정 함수
  };
  
export default UserProfile;