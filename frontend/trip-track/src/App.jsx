import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { RecoilRoot } from 'recoil'; 
import CreateAndEditPostPage from './pages/CreateAndEditPostPage.jsx';
import MainPageBeforeSignIn from './pages/MainPageBeforeSignIn.jsx'; 
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import EditProfilePage from "./pages/EditProfilePage";

const App = () => {
  return (
    <RecoilRoot>
      <Router>
        <nav>
          <Link to="/create-edit">Create and Edit Post Page</Link>
          <Link to="/main-before-sign-in">Main Page</Link> {/* Main 페이지로 이동하는 링크 */}
        </nav>
        <Routes>
          {/* 기본 경로에 MainPageBeforeSignIn를 매핑 */}
          <Route path="/" element={<MainPageBeforeSignIn />} />
          <Route path="/create-edit" element={<CreateAndEditPostPage />} />
          <Route path="/main-before-sign-in" element={<MainPageBeforeSignIn />} /> 
          <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path='/edit-profile' element={<EditProfilePage />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
};

export default App;
