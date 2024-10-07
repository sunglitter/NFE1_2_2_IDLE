import { useRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { searchQueryState, searchPostsState } from '../state/searchState';
import { searchAll } from '../services/postService';
import { sortPosts } from '../utils/filterUtils';

const useSearch = () => {
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);
  const [posts, setPosts] = useRecoilState(searchPostsState);
  const [resultsCount, setResultsCount] = useState(0);

  // 대상 채널 ID 설정
  const targetChannelId = '66ff3aae51e9a379d07c0b79';

  useEffect(() => {
    if (searchQuery) {
      fetchPosts(searchQuery);
    }
  }, [searchQuery]);

  // 검색어 업데이트 함수
  const updateSearchQuery = (query) => {
    setSearchQuery(query);
  };

  // 검색 및 정렬 조건에 따른 포스트 데이터 API 호출
  const fetchPosts = async (query = searchQuery, sortOrder = 'latest') => {
    try {
      const response = await searchAll(query); // 전체 검색 API 호출

      // 특정 채널 ID와 일치하는 포스트만 필터링
      const channelFilteredPosts = response.filter((post) => {
        // post.channel이 문자열(채널 ID)일 경우에는 post.channel 자체를 비교
        return post.channel === targetChannelId;
      });

      // 필터링된 결과를 정렬
      const sortedPosts = sortPosts(channelFilteredPosts, sortOrder);
      setPosts(sortedPosts); // 상태값에 설정
      setResultsCount(sortedPosts.length); // 필터링 결과 개수 계산 후 설정
    } catch (error) {
      console.error('Failed to fetch posts:', error.message);
    }
  };

  return { searchQuery, posts, resultsCount, updateSearchQuery, fetchPosts };
};

export default useSearch;