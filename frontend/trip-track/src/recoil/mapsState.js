import { atom } from 'recoil';

export const mapsDataState = atom({
  key: 'mapsDataState', // 고유한 key
  default: {}, // 기본값으로 빈 객체
});
