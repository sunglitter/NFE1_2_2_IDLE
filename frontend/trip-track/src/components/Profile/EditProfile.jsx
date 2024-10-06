import { useState, useEffect } from "react";
import api from "../../utils/authApi.js";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";
import axios from "axios";
import HeaderAfterSignIn from "../Common/HeaderAfterSignIn.jsx";

// 기본 프로필 이미지 URL
const defaultProfileImage = "https://via.placeholder.com/150";

const EditProfile = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(defaultProfileImage);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const loginToken = localStorage.getItem("token"); // 토큰 가져오기

  // 사용자 데이터 불러오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${loginToken}` },
        });
        const userData = response.data;
        setFullName(userData.fullName || "");
        console.log(fullName);
        setEmail(userData.email || "");
        console.log(email);
        setImage(userData.image || defaultProfileImage);
        console.log(image);
      } catch (error) {
        setError("사용자 정보를 불러오는 데 오류가 발생했습니다.");
        console.log(error.message);
      }
    };

    fetchUserData();
  }, [userId, loginToken]);

  // 입력값 유효성 검사
  const validateFields = () => {
    const isEnglish = /^[A-Za-z0-9\s]*$/.test(fullName); // 영문 및 숫자 체크

    if (isEnglish) {
      if (fullName.length > 16) {
        setError("Full Name은 16자 이하이어야 합니다.");
        return false;
      }
    } else {
      if (fullName.length > 8) {
        setError("Full Name은 8자 이하여야 합니다.");
        return false;
      }
    }

    if (password.length > 0 && password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return false;
    }

    if (password && password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return false;
    }

    setError("");
    return true; // 모든 검사가 통과하면 true 반환
  };

  // 프로필 업데이트
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      await updateUser(); // 사용자 정보 업데이트
      if (password) {
        await updatePassword(); // 비밀번호 변경
      }
      setMessage("정보가 성공적으로 업데이트되었습니다.");
      navigate("/profile"); // 프로필 페이지로 리다이렉션
    } catch (err) {
      console.error("프로필 수정 중 오류 발생:", err);
      setError("프로필 수정 중 오류가 발생했습니다.");
    }
  };

  // 사용자 정보 업데이트
  const updateUser = async () => {
    const requestBody = {
      fullName: fullName || undefined, // 변경하지 않은 경우에는 undefined로 설정
      email,
    };

    try {
      await api.put("/settings/update-user", requestBody, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });
      console.log("사용자 정보가 성공적으로 업데이트되었습니다.");
    } catch (err) {
      console.error("사용자 정보 업데이트 실패:", err.response?.data || err.message);
      setError("사용자 정보 업데이트 실패");
    }
  };

  // 비밀번호 변경
  const updatePassword = async () => {
    const requestBody = { password };

    try {
      await api.put("/settings/update-password", requestBody, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });
      console.log("비밀번호가 성공적으로 변경되었습니다.");
    } catch (err) {
      console.error("비밀번호 변경 실패:", err.response?.data || err.message);
      setError("비밀번호 변경 실패");
    }
  };

  // 프로필 이미지 변경 핸들러
  const handleProfileImageChange = () => {
    const newImageUrl = prompt("새 프로필 이미지 URL을 입력하세요:", image);
    if (newImageUrl) {
      setImage(newImageUrl); // 새로운 이미지 URL로 업데이트
    }
  };

  return (
    <div className="edit-profile">
      <div className="header-after-signin">
        <HeaderAfterSignIn />
      </div>

        <div className="left-container">
          <div className="profile-image-container">
            <img src={image} alt="Profile" className="profile-image" />
            <button className="edit-button" onClick={handleProfileImageChange}>
              Edit
            </button>
          </div>
        </div>
        <div className="profile-details">
          {error && <p className="error">{error}</p>}
          {message && <p className="message">{message}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <h3>프로필 수정</h3>
              <input
                type="text"
                value={fullName} // fullName 값이 없으면 빈 문자열로 설정
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
              />
            </div>
            <div>
              <input type="email" value={email} readOnly placeholder="Email" />
            </div>
            <div>
              <input
                type="password"
                value={password} // password 값이 없으면 빈 문자열로 설정
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            <div>
              <input
                type="password"
                value={confirmPassword} // confirmPassword 값이 없으면 빈 문자열로 설정
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
              />
            </div>
            <button className="save-button" type="submit">
              저장
            </button>
          </form>
        </div>

    </div>
  );
};

export default EditProfile;