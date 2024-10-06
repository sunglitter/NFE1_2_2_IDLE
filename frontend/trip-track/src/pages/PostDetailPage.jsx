import './PostDetailPage.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PostHeader from '../components/Post/PostHeader.jsx';
import Contents from '../components/Location/Contents.jsx';
import Map from '../components/Location/Map.jsx'; // 지도 컴포넌트 가져오기
import { useParams } from 'react-router-dom';

const PostDetailPage = () => {
  const { postId } = useParams(); // URL에서 postId 가져오기
  const [post, setPost] = useState(null);
  const [mapsData, setMapsData] = useState({}); // 지도 데이터 상태
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null); // 선택된 날짜 상태
  const [selectedMarker, setSelectedMarker] = useState(null); // 선택된 마커 상태
  const [markers, setMarkers] = useState([]); // 선택된 날짜의 마커들
  const [content, setContent] = useState({ title: '', text: '', images: [] }); // 선택된 마커의 콘텐츠 상태

   // 로그인 상태 확인
   useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');

    if (token && storedUserId) {
      setIsLoggedIn(true);
      setUser({ _id: storedUserId });
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  // 포스트 데이터 가져오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get(`https://kdt.frontend.5th.programmers.co.kr:5008/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let postData = response.data;

        // title이 문자열일 경우 JSON으로 파싱
        if (typeof postData.title === 'string') {
          postData.title = JSON.parse(postData.title);
        }

        // title.dailyLocations가 있는지 확인하고, 없으면 빈 배열 처리
        const dailyLocations = postData?.title?.dailyLocations || [];

        // dailyLocations 변환해서 지도 데이터로 저장
        const transformedMapsData = dailyLocations.reduce((acc, day) => {
          acc[day.date] = day.locations;
          return acc;
        }, {});

        setPost(postData);
        setMapsData(transformedMapsData);

        // 첫 번째 날짜와 그 마커들을 기본 선택
        const firstDate = Object.keys(transformedMapsData)[0];
        setSelectedDay(firstDate);
        setMarkers(transformedMapsData[firstDate]);

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch post', error);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  // 선택된 날짜가 변경될 때 해당 마커들을 업데이트
  useEffect(() => {
    if (selectedDay && mapsData[selectedDay]) {
      setMarkers(mapsData[selectedDay]);
      setSelectedMarker(null); // 선택된 마커 초기화
    }
  }, [selectedDay, mapsData]);

  // 마커 클릭 시 해당 마커의 콘텐츠를 표시
  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker); // 마커 선택
    setContent({
      title: marker.subtitle,
      text: marker.description,
      images: marker.photos || [],
    });
  };

  // 로딩 중일 때 표시
  if (loading) {
    return <div>Loading...</div>;
  }

  // 데이터가 없을 때 표시
  if (!post || !mapsData || Object.keys(mapsData).length === 0) {
    return <div>No post data available.</div>;
  }

  return (
    <div>
      {/* 포스트 헤더 */}
      {post && (
        <PostHeader
          post={{
            ...post,
            title: post.title.title, // 제목만 표시
          }}
          user={user}
          isLoggedIn={isLoggedIn}
        />
      )}

      {/* 지도 및 마커 UI */}
      {selectedDay && (
        <div className='map-and-contents'>
          <div>
            <Map
              onAddLocation={() => {}} // PostDetailPage에서는 추가 기능이 없음
              markers={markers} // 선택된 날짜의 마커들
              selectedDate={selectedDay}
              onMarkerClick={handleMarkerClick} // 마커 클릭 시 콘텐츠 표시
              onUpdateMarkers={() => {}} // PostDetailPage에서는 마커 수정 기능이 없음
            />
          </div>

          {/* 선택된 마커의 콘텐츠 표시 */}
          {selectedMarker && (
            <Contents
              selectedMarker={selectedMarker}
              content={content}
              onSaveContent={() => {}} // PostDetailPage에서는 수정 기능 없음
            />
          )}
        </div>
      )}

      {/* 날짜 변경 버튼 */}
      <div className="navigation-buttons">
        <button
          onClick={() => setSelectedDay(Object.keys(mapsData)[Object.keys(mapsData).indexOf(selectedDay) - 1])}
          disabled={Object.keys(mapsData).indexOf(selectedDay) === 0}>
          &lt; 이전 날짜
        </button>
        <button
          onClick={() => setSelectedDay(Object.keys(mapsData)[Object.keys(mapsData).indexOf(selectedDay) + 1])}
          disabled={Object.keys(mapsData).indexOf(selectedDay) === Object.keys(mapsData).length - 1}>
          다음 날짜 &gt;
        </button>
      </div>
    </div>
  );
};

export default PostDetailPage;
