import PropTypes from 'prop-types';
import UserCard from './UserCard';
import './UserGrid.css'; // 스타일 시트

const UserGrid = ({ users }) => {
  return (
    <div className="user-grid-container">
      {users.map((user) => (
        <UserCard key={user._id} user={user} />
      ))}
    </div>
  );
};

UserGrid.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default UserGrid;