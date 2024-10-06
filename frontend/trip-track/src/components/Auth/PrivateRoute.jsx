import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { currentUserState } from "../../recoil/atom";
import PropTypes from "prop-types"; 

const PrivateRoute = ({ children }) => {
  const currentUser = useRecoilValue(currentUserState);

  // 인증된 사용자가 없으면 로그인 페이지로 리디렉션
  return currentUser ? children : <Navigate to="/signin" />;
};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired, // children은 JSX 요소 혹은 컴포넌트이므로 node로 설정
};

export default PrivateRoute;