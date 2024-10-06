import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 text-center">
      <h2>404 - Page Not Found</h2>
      <p>
        The page you are looking for might have been removed, or is temporarily
        unavailable.
      </p>
      <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
        Go to Home
      </button>
    </div>
  );
};

export default NotFoundPage;