import { atom } from 'recoil';

// 검색어 상태를 관리하는 atom
export const searchQueryState = atom({
  key: 'searchQueryState',
  default: '', // 초기값은 빈 문자열
});

// 검색된 포스트 상태를 관리하는 atom
export const searchPostsState = atom({
  key: 'searchPostsState',
  default: [], // 초기값은 빈 배열
});

// 필터링 조건 상태를 관리하는 atom
export const filtersState = atom({
  key: 'filtersState',
  default: { // 초기 필터링 상태는 각 카테고리의 빈 배열로 설정
    국내: [],
    해외: [],
    목적: [],
    기간: [],
    인원: [],
    계절: [],
  },
});