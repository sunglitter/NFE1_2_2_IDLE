import { Link } from 'react-router-dom'; // Link 추가
import './HeaderBeforeSignIn.css'

const HeaderBeforeSignIn = () => {
  return (
    <nav>
      <div className='logo'>Trip Track</div>
      <div className='buttons'>
        {/* Sign In / Sign Up 버튼만 표시 */}
        <Link to="/signin">
          <button >Sign In</button>
        </Link>
        <Link to="/signup">
          <button >Sign Up</button>
        </Link>
      </div>
    </nav>
  );
};


export default HeaderBeforeSignIn;
