import { FaBell } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import SignOutButton from '../Auth/SignOutButton';
import { useEffect, useState } from 'react';
import NotificationList from '../Notification/NotificationList'; // NotificationList 컴포넌트 가져오기
import './HeaderAfterSignIn.css';
<<<<<<< HEAD

=======
>>>>>>> origin/feature/design

const HeaderAfterSignIn = () => {
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
    navigate('/create-edit', { replace: true });
  };

  const handleNotificationClick = () => {
    setShowModal(true); // 알림 아이콘 클릭 시 모달을 표시
  };

  return (
    <>
      <nav>
        <h1>Trip Track</h1>
        <div className='header-buttons' >
          {/* 알림 아이콘 */}
          <div className="icon-noti">
            <FaBell  id='fa-noti' onClick={handleNotificationClick} />
          </div>

          {/* Edit Profile 버튼 */}
          <Link to="/edit-profile">
            <button>Edit Profile</button>
          </Link>

          {/* My Page 버튼 (동적으로 userId 사용) */}
          {userId && (
            <Link to={`/my-page/${userId}`}>
              <button>My Page</button>
            </Link>
          )}

          {/* Create Post 버튼 */}
          <button onClick={handleCreatePost}>
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

export default HeaderAfterSignIn;
