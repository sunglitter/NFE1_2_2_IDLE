import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { getUser, followUser, unfollowUser } from "../../services/authService";
import { sendNotification } from "../../services/notificationService";  // 알림 서비스 import
import { useRecoilValue, useSetRecoilState } from "recoil";
import { currentUserState } from "../../recoil/atom";

const FollowListModal = ({ followers, following, modalActiveTab }) => {
  const [followersFullNames, setFollowersFullNames] = useState([]);
  const [followingFullNames, setFollowingFullNames] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const [processingUsers, setProcessingUsers] = useState({}); // per-user processing state
  const navigate = useNavigate();
  const currentUser = useRecoilValue(currentUserState);  // 로그인한 사용자 정보 가져오기
  const setCurrentUser = useSetRecoilState(currentUserState);  // 상태 업데이트
  const [modalActiveTabState, setModalActiveTabState] = useState("followers"); // 모달 내 별도 activeTab 상태

  // A 사용자의 팔로우 관계 맵 (userId -> followId)
  const aFollowingMap = useMemo(() => {
    return (currentUser.following || []).reduce((map, follow) => {
      map[follow.user] = follow._id;
      return map;
    }, {});
  }, [currentUser.following]);

  useEffect(() => {
    const fetchUserNames = async () => {
      try {
        setLoading(true);
        // 팔로워 리스트 불러오기
        const fetchedFollowers = await Promise.all(
          followers.map(async (relation) => {
            const userData = await getUser(relation.follower);
            return {
              _id: relation._id,
              fullName: userData?.fullName || "Unknown",
              image: userData?.image || "/public/images/defaultProfile.png",
              userId: relation.follower,
            };
          })
        );
        setFollowersFullNames(fetchedFollowers);

        // 팔로잉 리스트 불러오기
        const fetchedFollowing = await Promise.all(
          following.map(async (relation) => {
            const userData = await getUser(relation.user);
            return {
              _id: relation._id,
              fullName: userData?.fullName || "Unknown",
              image: userData?.image || "/public/images/defaultProfile.png",
              userId: relation.user,
            };
          })
        );
        setFollowingFullNames(fetchedFollowing);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserNames();
  }, [followers, following]);

  // 모달이 열릴 때마다 modalActiveTab을 설정
  useEffect(() => {
    setModalActiveTabState(modalActiveTab);
  }, [modalActiveTab]);

  // 팔로우 버튼 클릭 시
  const handleFollow = async (userId) => {
    if (processingUsers[userId]) return; // prevent multiple requests for same user
    setProcessingUsers((prev) => ({ ...prev, [userId]: true }));
    try {
      // 팔로우 요청
      const newFollow = await followUser(userId);
      // 사용자 데이터 가져오기
      const userData = await getUser(userId);

      const newFollowing = {
        _id: newFollow._id,
        user: userId,
        follower: currentUser._id,
        fullName: userData?.fullName || "Unknown",
        image: userData?.image || "/public/images/defaultProfile.png",
      };

      // 현재 사용자 상태 업데이트
      setCurrentUser((prevUser) => ({
        ...prevUser,
        following: [...prevUser.following, newFollowing],
      }));

      // 팔로우 알림 보내기
      await sendNotification({
        notificationType: "FOLLOW",
        notificationTypeId: newFollow._id,  // 생성된 팔로우 ID
        userId: userId,  // B 사용자 ID (팔로우 당하는 사람)
        postId: null,  // 팔로우이므로 postId는 null
      });

      console.log("Notification sent!");
    } catch (error) {
      console.error("Failed to follow user:", error);
    } finally {
      setProcessingUsers((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // 언팔로우 버튼 클릭 시
  const handleUnfollow = async (userId) => {
    const followId = aFollowingMap[userId];
    if (!followId) {
      console.error("A is not following user:", userId);
      return;
    }

    if (processingUsers[userId]) return; // prevent multiple requests for same user
    setProcessingUsers((prev) => ({ ...prev, [userId]: true }));
    try {
      console.log("Unfollowing user:", userId, "with followId:", followId);
      await unfollowUser(followId);

      // 현재 사용자 상태 업데이트
      setCurrentUser((prevUser) => ({
        ...prevUser,
        following: prevUser.following.filter((follow) => follow.user !== userId),
      }));

      console.log("Unfollowed successfully!");
    } catch (error) {
      console.error("Failed to unfollow user:", error);
    } finally {
      setProcessingUsers((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // 유저 프로필로 이동
  const handleUserClick = (userId) => {
    const modal = document.getElementById("followListModal");
    if (modal) {
      const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
    }
    navigate(`/users/${userId}`);
  };

  // 로그인한 사용자가 해당 유저를 팔로우하고 있는지 확인하는 함수
const isFollowingUser = (userId) => {
    return userId && Object.prototype.hasOwnProperty.call(aFollowingMap, userId);
  };

  // 팔로워 및 팔로잉 리스트 필터링
  const filteredFollowers = followersFullNames.filter((user) =>
    (user.fullName || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFollowing = followingFullNames.filter((user) =>
    (user.fullName || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="modal fade" id="followListModal" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            {loading ? (
              <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <ul className="nav nav-underline justify-content-center">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${modalActiveTabState === "followers" ? "active" : ""}`}
                      onClick={() => setModalActiveTabState("followers")}
                    >
                      Followers
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${modalActiveTabState === "following" ? "active" : ""}`}
                      onClick={() => setModalActiveTabState("following")}
                    >
                      Following
                    </button>
                  </li>
                </ul>

                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder={`${modalActiveTabState} 사용자 검색`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                {modalActiveTabState === "followers" && (
                  <FollowerList
                    followers={filteredFollowers}
                    handleUserClick={handleUserClick}
                    handleFollow={handleFollow}
                    handleUnfollow={handleUnfollow}
                    currentUser={currentUser}
                    isFollowingUser={isFollowingUser}
                    processingUsers={processingUsers}
                  />
                )}

                {modalActiveTabState === "following" && (
                  <FollowingList
                    following={filteredFollowing}
                    handleUserClick={handleUserClick}
                    handleFollow={handleFollow}
                    handleUnfollow={handleUnfollow}
                    currentUser={currentUser}
                    isFollowingUser={isFollowingUser}
                    processingUsers={processingUsers}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 팔로워 리스트 컴포넌트
const FollowerList = ({ followers, handleUserClick, handleFollow, handleUnfollow, currentUser, isFollowingUser, processingUsers }) => (
  <ul>
    {followers.map((user) => (
      <li
        key={user._id}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          border: "2px solid #0066ff",
          borderRadius: "5px",
          padding: "10px",
          marginTop: "10px",
        }}
        onClick={() => handleUserClick(user.userId)}
      >
        <img
          src={user.image}
          alt={user.fullName}
          style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 10 }}
        />
        {user.fullName}

        {currentUser._id !== user.userId && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isFollowingUser(user.userId)) {
                handleUnfollow(user.userId);
              } else {
                handleFollow(user.userId);
              }
            }}
            style={{
              marginLeft: "auto",
              backgroundColor: isFollowingUser(user.userId) ? "#002050" : "#0066ff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "5px 10px",
            }}
            disabled={processingUsers[user.userId]}
          >
            {isFollowingUser(user.userId) ? "Unfollow" : "Follow"}
          </button>
        )}
      </li>
    ))}
  </ul>
);

// 팔로잉 리스트 컴포넌트
const FollowingList = ({ following, handleUserClick, handleFollow, handleUnfollow, currentUser, isFollowingUser, processingUsers }) => (
  <ul>
    {following.map((user) => (
      <li
        key={user._id}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          border: "2px solid #0066ff",
          borderRadius: "5px",
          padding: "10px",
          marginTop: "10px",
        }}
        onClick={() => handleUserClick(user.userId)}
      >
        <img
          src={user.image}
          alt={user.fullName}
          style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 10 }}
        />
        {user.fullName}

        {currentUser._id !== user.userId && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isFollowingUser(user.userId)) {
                handleUnfollow(user.userId);
              } else {
                handleFollow(user.userId);
              }
            }}
            style={{
              marginLeft: "auto",
              backgroundColor: isFollowingUser(user.userId) ? "#002050" : "#0066ff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "5px 10px",
            }}
            disabled={processingUsers[user.userId]}
          >
            {isFollowingUser(user.userId) ? "Unfollow" : "Follow"}
          </button>
        )}
      </li>
    ))}
  </ul>
);

FollowListModal.propTypes = {
    followers: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      follower: PropTypes.string.isRequired,
    })).isRequired,
    following: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      user: PropTypes.string.isRequired,
    })).isRequired,
    modalActiveTab: PropTypes.string.isRequired,
  };
  
  FollowerList.propTypes = {
    followers: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      fullName: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
    })).isRequired,
    handleUserClick: PropTypes.func.isRequired,
    handleFollow: PropTypes.func.isRequired,
    handleUnfollow: PropTypes.func.isRequired,
    currentUser: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      following: PropTypes.array.isRequired,
    }).isRequired,
    isFollowingUser: PropTypes.func.isRequired,
    processingUsers: PropTypes.objectOf(PropTypes.bool).isRequired,
  };
  
  FollowingList.propTypes = {
    following: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      fullName: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
    })).isRequired,
    handleUserClick: PropTypes.func.isRequired,
    handleFollow: PropTypes.func.isRequired,
    handleUnfollow: PropTypes.func.isRequired,
    currentUser: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      following: PropTypes.array.isRequired,
    }).isRequired,
    isFollowingUser: PropTypes.func.isRequired,
    processingUsers: PropTypes.objectOf(PropTypes.bool).isRequired,
  };

export default FollowListModal;