import './PostDetailPage.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PostHeader from '../components/Post/PostHeader.jsx';
import PostContent from '../components/Post/PostContent.jsx';
import Map from '../components/Location/Map'; // 지도 컴포넌트 가져오기
import { useParams } from 'react-router-dom';
import HeaderAfterSignIn from '../components/Common/HeaderAfterSignIn.jsx';
import HeaderBeforeSignIn from '../components/Common/HeaderBeforeSignIn.jsx';

const PostDetailPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [mapsData, setMapsData] = useState({}); // 지도 데이터 상태
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(0); // 선택된 장소의 인덱스
  const [markers, setMarkers] = useState([]); // 선택된 날짜의 마커

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

        const postData = response.data;

        // title이 JSON 문자열인 경우 파싱
        if (typeof postData.title === 'string') {
          postData.title = JSON.parse(postData.title);
        }

        setPost(postData);

        // mapsData 설정: dailyLocations를 mapsData로 변환
        const transformedMapsData = postData.title.dailyLocations.reduce((acc, day) => {
          acc[day.date] = day.locations;
          return acc;
        }, {});

        setMapsData(transformedMapsData);

        // 첫 번째 날짜를 기본 선택
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

  // 날짜 변경 시 해당 날짜의 마커 업데이트
  useEffect(() => {
    if (selectedDay && mapsData[selectedDay]) {
      setMarkers(mapsData[selectedDay]);
      setSelectedLocation(0); // 날짜 변경 시 첫 번째 장소로 초기화
    }
  }, [selectedDay, mapsData]);

  const handlePrevDay = () => {
    const dates = Object.keys(mapsData);
    const currentIndex = dates.indexOf(selectedDay);
    if (currentIndex > 0) {
      setSelectedDay(dates[currentIndex - 1]);
    }
  };

  const handleNextDay = () => {
    const dates = Object.keys(mapsData);
    const currentIndex = dates.indexOf(selectedDay);
    if (currentIndex < dates.length - 1) {
      setSelectedDay(dates[currentIndex + 1]);
    }
  };

  const handlePrevLocation = () => {
    if (selectedLocation > 0) {
      setSelectedLocation(selectedLocation - 1);
    }
  };

  const handleNextLocation = () => {
    if (selectedLocation < markers.length - 1) {
      setSelectedLocation(selectedLocation + 1);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post || !mapsData || Object.keys(mapsData).length === 0) {
    return <div>No post data available.</div>;
  }

  const currentLocation = markers[selectedLocation];

  return (
    <div>
      {/* 포스트 헤더 */}
      {post && (
        <PostHeader
          post={{
            ...post,
            title: typeof post.title === 'object' && post.title.title ? post.title.title : post.title,
          }}
          user={user}
          isLoggedIn={isLoggedIn}
        />
      )}

      <div className="post-map">
        <div className="navigation-buttons">
          <button onClick={handlePrevDay} disabled={Object.keys(mapsData).indexOf(selectedDay) === 0}>
            &lt; The day before
          </button>
          <button
            onClick={handleNextDay}
            disabled={Object.keys(mapsData).indexOf(selectedDay) === Object.keys(mapsData).length - 1}
          >
            The day after &gt;
          </button>
        </div>

        <div className="place-navigation">
          <button onClick={handlePrevLocation} disabled={selectedLocation === 0}>
            &lt; Previous Location
          </button>
          <span>
            {selectedLocation + 1} / {markers.length}
          </span>
          <button onClick={handleNextLocation} disabled={selectedLocation === markers.length - 1}>
            Next Location &gt;
          </button>
        </div>
      </div>

      {/* 지도 컴포넌트 추가: 마커와 선택된 날짜의 장소 표시 */}
      <div className="map-container">
        <Map markers={markers} selectedLocation={selectedLocation} />
      </div>

      {/* 선택된 장소 정보 및 방문 순서 표시 */}
      {currentLocation && (
        <div className='location-order'>
          <p>방문한 장소: {currentLocation.name}</p>
          <p>방문 순서: {currentLocation.visitedOrder}</p> {/* 방문 순서 표시 */}
        </div>
      )}

      {/* PostContent로 장소 정보 및 포스트 ID 전달 */}
      <div className="loca-info">
      {currentLocation && <PostContent location={currentLocation} postId={post._id} />}
      </div>
    </div>
  );
};

export default PostDetailPage;
