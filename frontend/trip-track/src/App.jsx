import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { RecoilRoot } from 'recoil'; // RecoilRoot import
import CreateAndEditPostPage from './pages/CreateAndEditPostPage';

const App = () => {
  return (
    <RecoilRoot>
      {/* RecoilRoot로 감싸줍니다 */}
      <Router>
        <nav>
          <Link to="/create-edit">Create and Edit Post Page</Link>
        </nav>
        <Routes>
          <Route path="/create-edit" element={<CreateAndEditPostPage />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
};

export default App;