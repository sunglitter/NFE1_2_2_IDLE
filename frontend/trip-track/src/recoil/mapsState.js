import { atom } from 'recoil';

// Recoil 상태로 관리되는 지도 데이터
export const mapsDataState = atom({
  key: 'mapsDataState', // Recoil에서 사용하는 고유 키
  default: {}, // 초기 값으로 빈 객체 설정
});