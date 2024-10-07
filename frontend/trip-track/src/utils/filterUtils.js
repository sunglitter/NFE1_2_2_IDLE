// 여행 기간을 계산하는 함수
export const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // 여행 기간 일수 계산
  
    if (duration === 0) return '당일치기';
    if (duration === 1) return '1박 2일';
    if (duration === 2) return '2박 3일';
    if (duration === 3) return '3박 4일';
    if (duration === 4) return '4박 5일';
    if (duration === 5) return '5박 6일';
    if (duration === 6) return '6박 7일';
    if (duration >= 7 && duration < 30) return '일주일 이상';
    if (duration >= 30 && duration < 365) return '한 달 이상';
    return '일 년 이상';
  };
  
// 필터링 함수 정의
export const filterPosts = (posts, query, filterOptions) => {
    const lowerCaseQuery = query ? query.toLowerCase() : ''; // query가 비어있을 경우 빈 문자열 사용
  
    return posts.filter((post) => {
        let postData;
        try {
          // post.title이 JSON 객체의 문자열 형태이므로 이를 파싱하여 사용
          postData = JSON.parse(post.title);
        } catch {
          console.error("Failed to parse post title:", post.title);
          return false; // 파싱 실패 시 해당 포스트를 필터링에서 제외
        }

        const matchesQuery =
        postData.title.toLowerCase().includes(lowerCaseQuery) ||
        (post.description ? post.description.toLowerCase().includes(lowerCaseQuery) : '');

        // 여행 위치를 dailyLocations에서 추출
        const postLocations = postData.dailyLocations
          ? postData.dailyLocations.flatMap((daily) => (daily.locations ? daily.locations.map((location) => location.name) : []))
          : [];
  
        // 각 필터 조건 일치 여부 확인
        const matchesRegion =
          (filterOptions['국내'].length === 0 && filterOptions['해외'].length === 0) ||
          filterOptions['국내'].some((region) => postLocations.includes(region)) ||
          filterOptions['해외'].some((region) => postLocations.includes(region));
  
        const matchesPurpose = filterOptions['목적'].length === 0 || filterOptions['목적'].includes(postData.tripPurpose);
        const matchesGroupType = filterOptions['인원'].length === 0 || filterOptions['인원'].includes(postData.tripGroupType);
        const matchesSeason = filterOptions['계절'].length === 0 || filterOptions['계절'].includes(postData.season);
        const matchesDuration =
          filterOptions['기간'].length === 0 ||
          filterOptions['기간'].includes(calculateDuration(postData.dates[0], postData.dates[1]));
  
        // 검색어와 필터 조건을 모두 만족해야 포스트를 포함
        return matchesQuery && matchesRegion && matchesPurpose && matchesGroupType && matchesSeason && matchesDuration;
    });
};
  
// 필터 결과 개수만을 계산하는 함수 정의
export const calculateResultsCount = (posts, query, filterOptions) => {
    const filteredPosts = filterPosts(posts, query, filterOptions);
    return filteredPosts.length; // 필터링된 포스트 개수 반환
  };
  
// 정렬 함수: 최신순과 좋아요 순으로 정렬
export const sortPosts = (posts, sortOrder) => {
    return posts.slice().sort((a, b) => {
      if (sortOrder === 'latest') {
        return new Date(b.createdAt) - new Date(a.createdAt); // 최신순 정렬
      } else if (sortOrder === 'likes') {
        return b.likes.length - a.likes.length; // 좋아요 순 정렬
      }
      return 0; // 정렬 조건이 없을 경우 기본값 반환
    });
  };