import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import "./SignUp.css";
import api from "../../utils/authApi.js";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 유효성 검사
    // fullName 길이 확인
    const isEnglish = /^[A-Za-z0-9\s]*$/.test(fullName); // 영문 및 숫자 체크
    if (isEnglish) {
      // 영문일 때: 16자 이하
      if (fullName.length > 16) {
        setError("Full Name은 16자 이하이어야 합니다.");
        return;
      }
    } else {
      // 한글일 때: 8자 이하
      if (fullName.length > 8) {
        setError("Full Name은 8자 이하여야 합니다.");
        return;
      }
    }

    // 이메일 입력 확인 및 형식 검증
    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("유효한 이메일 주소를 입력해주세요.");
        return;
      }
    }

    // 비밀번호 길이 확인
    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    // 비밀번호 일치 여부 확인
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // 회원가입 요청을 보냅니다.
      await api.post("/signup", {
        fullName,
        email,
        password,
      });

      // 회원가입 성공 후 로그인 페이지로 이동
      navigate("/signin");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="page-container">
      <div className="logo">
        <img src={Logo} alt="Logo" />
      </div>
      <div className="form-container">
        <h3>회원가입</h3>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              required
            />
          </div>
          <div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <div>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
          </div>
          <button type="submit">Create Account</button>
        </form>
      </div>
    </div>
    
  );
};

export default SignUp;