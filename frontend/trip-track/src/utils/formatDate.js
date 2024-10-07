export const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval;
  
    // 년도 처리 (1년 = 31536000초)
    interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} 년 전`;
  
    // 달 처리 (1달 = 2592000초)
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} 달 전`;
  
    // 일 처리 (1일 = 86400초)
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} 일 전`;
  
    // 시간 처리 (1시간 = 3600초)
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} 시간 전`;
  
    // 분 처리 (1분 = 60초)
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} 분 전`;
  
    return "방금 전";
  };

  export const formatDateRelative = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now - date;
  
    // 밀리초 단위의 시간 차이를 초, 분, 시간, 일, 주, 월, 년 단위로 계산
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30); // 평균 30일을 기준으로 계산
    const years = Math.floor(days / 365); // 평균 365일을 기준으로 계산
  
    // 상대적인 시간 계산
    if (seconds < 60) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    if (weeks < 5) return `${weeks}주 전`;
    if (months < 12) return `${months}개월 전`;
    return `${years}년 전`;
  };