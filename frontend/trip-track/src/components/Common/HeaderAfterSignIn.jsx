import { FaBell } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom'; // Link 추가
import PropTypes from 'prop-types';
import SignOutButton from '../Auth/SignOutButton'; // SignOutButton 컴포넌트 가져오기

const HeaderAfterSignIn = ({ onCreatePost }) => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  // 페이지를 /create-edit 경로로 리다이렉트하고 상태를 초기화
  const handleCreatePost = () => {
    if (onCreatePost) {
      onCreatePost(); // 전달된 콜백 호출하여 페이지 상태 초기화
    }
    navigate('/create-edit', { replace: true }); // 새로고침 없이 리다이렉트
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>Trip Track</div>
      <div style={styles.actions}>
        {/* 알림 아이콘 */}
        <FaBell style={styles.icon} />

        {/* Edit Profile 버튼 */}
        <Link to="/edit-profile">
          <button style={styles.button}>Edit Profile</button>
        </Link>

        {/* Create Post 버튼 */}
        <button style={styles.button} onClick={handleCreatePost}>
          Create Post
        </button>

        {/* Sign Out 버튼 (기존의 handleSignOut 대신 SignOutButton 사용) */}
        <SignOutButton /> {/* SignOutButton 컴포넌트를 그대로 사용 */}
      </div>
    </nav>
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
