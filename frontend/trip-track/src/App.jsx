import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateAndEditPostPage from './pages/CreateAndEditPostPage';

const App = () => {
  return (
    <Router>
      <nav>
        <Link to="/create-edit">create and edit post page</Link>
      </nav>
      <Routes>
        <Route path="/create-edit" element={<CreateAndEditPostPage />} />
      </Routes>
    </Router>
  );
};

export default App;
