// src/components/NavBar.jsx
import { FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'; 

const NavBar = ({onCreatePost, onSignOut }) => {
    const navigate = useNavigate(); // useNavigate 훅 사용

    // 페이지를 /create-edit 경로로 리다이렉트하고 상태를 초기화
    const handleCreatePost = () => {
        if (onCreatePost) {
          onCreatePost();  // 전달된 콜백 호출하여 페이지 상태 초기화
        }
        navigate('/create-edit', { replace: true }); // 새로고침 없이 리다이렉트
      };

      // 로그아웃 후 메인 페이지로 리다이렉트
    const handleSignOut = () => {
        if (onSignOut) {
          onSignOut(); // 로그아웃 처리
        }
        navigate('/main-before-sign-in', { replace: true }); // 메인 페이지로 이동
      };
    
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>Trip Track</div>
      <div style={styles.actions}>
        {/* 알림 아이콘 */}
        <FaBell style={styles.icon} />

        {/* Create Post 버튼 */}
        <button style={styles.button} onClick={handleCreatePost}>
          Create Post
        </button>

        {/* Sign Out 버튼 */}
        <button style={{ ...styles.button, backgroundColor: 'black' }} onClick={handleSignOut}>
          Sign Out
        </button>
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

NavBar.propTypes = {
    onCreatePost: PropTypes.func.isRequired, // 필수 함수 prop
    onSignOut: PropTypes.func.isRequired,    // 필수 함수 prop
  };

export default NavBar;
