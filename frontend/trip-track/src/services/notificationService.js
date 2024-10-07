import axiosInstance from "./axiosInstance";  // axios 인스턴스 사용

// 알림 생성 함수
export const sendNotification = async (notificationData) => {
  try {
    const response = await axiosInstance.post("/notifications/create", notificationData);
    return response.data;
  } catch (error) {
    console.error("Failed to send notification:", error);
    throw error;
  }
};

// 알림 목록 불러오기
export const getNotifications = async () => {
  try {
    const response = await axiosInstance.get("/notifications");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    throw error;
  }
};

// 알림 읽음 처리
export const markNotificationAsSeen = async (notificationId) => {
  try {
    const response = await axiosInstance.put("/notifications/seen", { id: notificationId });
    return response.data;
  } catch (error) {
    console.error("Failed to mark notification as seen:", error);
    throw error;
  }
};