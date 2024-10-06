import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil'; 
import CreateAndEditPostPage from './pages/CreateAndEditPostPage.jsx';
import PostDetailPage from './pages/PostDetailPage.jsx';
import MainPage from './pages/MainPage.jsx'; 
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import EditProfilePage from "./pages/EditProfilePage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx"; // UserProfilePage 추가
import SearchResultsPage from './pages/SearchResultsPage';
import SearchUserResultsPage from './pages/SearchUserResultsPage';
import PrivateRoute from "./components/Auth/PrivateRoute"; // PrivateRoute 추가
import LoadUserFromLocalStorage from "./hooks/LoadUserFromLocalStorage"; // 로그인 상태 유지 로직 추가

const App = () => {
  return (
    <RecoilRoot>
      <LoadUserFromLocalStorage /> {/* 로그인 상태 복원 */}
      <Router>
        <Routes>
          {/* 기본 경로에 MainPage를 매핑 */}
          <Route path="/" element={<MainPage />} />
          <Route path="/create-edit" element={<CreateAndEditPostPage />} />
          <Route path="/main" element={<MainPage />} /> 
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path='/edit-post/:postId' element={<PostDetailPage />} />
          <Route path='/edit-profile' element={<EditProfilePage />} />
          <Route path="/my-page/:userId" element={<UserProfilePage />} />
          <Route path="/search-results" element={<SearchResultsPage />} />
          <Route path="/search-users" element={<SearchUserResultsPage />} />

          {/* PrivateRoute로 UserProfilePage를 보호 */}
          <Route 
            path="/users/:userId" 
            element={
              <PrivateRoute>
                <UserProfilePage />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </RecoilRoot>
  );
};

export default App;
