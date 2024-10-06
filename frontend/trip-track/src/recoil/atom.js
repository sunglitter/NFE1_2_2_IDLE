import { atom } from "recoil";

export const currentUserState = atom({
  key: "currentUserState",
  default: null, // 로그인한 사용자 정보 저장
});

export const notificationListState = atom({
  key: "notificationListState",
  default: [], // 알림 목록 상태 저장
});