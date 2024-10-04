import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil'; 
import CreateAndEditPostPage from './pages/CreateAndEditPostPage.jsx';
import MainPage from './pages/MainPage.jsx'; 
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import EditProfilePage from "./pages/EditProfilePage";

const App = () => {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          {/* 기본 경로에 MainPageBeforeSignIn를 매핑 */}
          <Route path="/" element={<MainPage />} />
          <Route path="/create-edit" element={<CreateAndEditPostPage />} />
          <Route path="/main" element={<MainPage />} /> 
          <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path='/edit-profile' element={<EditProfilePage />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
};

export default App;
