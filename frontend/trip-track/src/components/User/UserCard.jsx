import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import defaultProfileImage from '../../assets/images/default-profile-image.png';
import './UserCard.css';
import api from '../../utils/authApi'; // api 유틸리티 사용

const UserCard = ({ user }) => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // 로그인 상태에 따라 팔로우 여부 결정
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setCurrentUserId(storedUserId);

    if (storedUserId && user.following && user.following.some((f) => f._id === user._id)) {
      setIsFollowing(true); // 로그인 사용자와 일치하면 팔로우 상태로 설정
    }
  }, [user]);

  // 팔로우 요청
  const handleFollow = async () => {
    if (!currentUserId) {
      navigate('/signin'); // 로그인하지 않은 상태면 로그인 페이지로 이동
      return;
    }

    try {
      await api.post('/follow/create', { userId: user._id });
      setIsFollowing(true); // 팔로우 상태로 변경
    } catch (error) {
      console.error('Failed to follow user:', error.message);
    }
  };

  // 언팔로우 요청
  const handleUnfollow = async () => {
    if (!currentUserId) return;

    try {
      await api.delete('/follow/delete', { data: { id: user._id } });
      setIsFollowing(false); // 언팔로우 상태로 변경
    } catch (error) {
      console.error('Failed to unfollow user:', error.message);
    }
  };

  // 프로필 이미지가 없으면 기본 이미지로 설정
  const profileImage = user.image || defaultProfileImage;

  return (
    <div className="user-card">
      <img src={profileImage} alt={`${user.fullName}'s profile`} className="user-profile-image" />
      <span className="user-name">{user.fullName}</span>
      <button
        className={`follow-button ${isFollowing ? 'unfollow' : 'follow'}`}
        onClick={isFollowing ? handleUnfollow : handleFollow}
      >
        {isFollowing ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  );
};

UserCard.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    image: PropTypes.string,
    following: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default UserCard;