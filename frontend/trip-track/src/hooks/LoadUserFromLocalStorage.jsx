import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import axios from "axios";
import { currentUserState } from "../recoil/atom";

const LoadUserFromLocalStorage = () => {
  const setCurrentUser = useSetRecoilState(currentUserState);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // 로그인 시 저장한 userId 가져오기

    if (token && userId) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(
            `https://kdt.frontend.5th.programmers.co.kr:5008/users/${userId}`, // userId 사용
            {
              headers: { Authorization: `Bearer ${token}` }, // 토큰 추가
            }
          );
          setCurrentUser(response.data); // 사용자 정보를 Recoil 상태에 저장
        } catch (error) {
          console.error("Failed to fetch user:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("userId"); // userId도 제거
          setCurrentUser(null); // 로그아웃 상태로 전환
        }
      };
      fetchUser();
    }
  }, [setCurrentUser]);

  return null; // 화면에 렌더링하지 않음
};

export default LoadUserFromLocalStorage;