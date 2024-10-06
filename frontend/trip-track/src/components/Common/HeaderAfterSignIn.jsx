import { FaBell } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import SignOutButton from '../Auth/SignOutButton';
import { useEffect, useState } from 'react';
import NotificationList from '../Notification/NotificationList'; // NotificationList 컴포넌트 가져오기

const HeaderAfterSignIn = ({ onCreatePost }) => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false); // 모달 상태 추가

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleCreatePost = () => {
    if (onCreatePost) {
      onCreatePost();
    }
    navigate('/create-edit', { replace: true });
  };

  const handleNotificationClick = () => {
    setShowModal(true); // 알림 아이콘 클릭 시 모달을 표시
  };

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.logo}>Trip Track</div>
        <div style={styles.actions}>
          {/* 알림 아이콘 */}
          <FaBell style={styles.icon} onClick={handleNotificationClick} />

          {/* Edit Profile 버튼 */}
          <Link to="/edit-profile">
            <button style={styles.button}>Edit Profile</button>
          </Link>

          {/* My Page 버튼 (동적으로 userId 사용) */}
          {userId && (
            <Link to={`/users/${userId}`}>
              <button style={styles.button}>My Page</button>
            </Link>
          )}

          {/* Create Post 버튼 */}
          <button style={styles.button} onClick={handleCreatePost}>
            Create Post
          </button>

          {/* Sign Out 버튼 */}
          <SignOutButton />
        </div>
      </nav>

      {/* NotificationList 모달 */}
      {showModal && <NotificationList setShowModal={setShowModal} />}
    </>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    fontSize: '24px',
    marginRight: '20px',
    cursor: 'pointer',
  },
  button: {
    marginLeft: '10px',
    padding: '5px 15px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

HeaderAfterSignIn.propTypes = {
  onCreatePost: PropTypes.func.isRequired, // 필수 함수 prop
};

export default HeaderAfterSignIn;
