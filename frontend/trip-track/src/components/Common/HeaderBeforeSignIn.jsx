import { Link } from 'react-router-dom'; // Link 추가

const HeaderBeforeSignIn = () => {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>Trip Track</div>
      <div style={styles.actions}>
        {/* Sign In / Sign Up 버튼만 표시 */}
        <Link to="/signin">
          <button style={styles.button}>Sign In</button>
        </Link>
        <Link to="/signup">
          <button style={styles.button}>Sign Up</button>
        </Link>
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
  button: {
    marginLeft: '10px',
    padding: '5px 15px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default HeaderBeforeSignIn;
