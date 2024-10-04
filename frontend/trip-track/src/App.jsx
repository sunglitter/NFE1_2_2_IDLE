import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { RecoilRoot } from 'recoil'; 
import CreateAndEditPostPage from './pages/CreateAndEditPostPage.jsx';
import MainPageBeforeSignIn from './pages/MainPageBeforeSignIn.jsx'; // MainPage 추가

const App = () => {
  return (
    <RecoilRoot>
      <Router>
        <nav>
          <Link to="/create-edit">Create and Edit Post Page</Link>
          <Link to="/main-before-sign-in">Main Page</Link> {/* Main 페이지로 이동하는 링크 */}
        </nav>
        <Routes>
          <Route path="/create-edit" element={<CreateAndEditPostPage />} />
          <Route path="/main-before-sign-in" element={<MainPageBeforeSignIn />} /> {/* MainPage 라우트 추가 */}
        </Routes>
      </Router>
    </RecoilRoot>
  );
};

export default App;
