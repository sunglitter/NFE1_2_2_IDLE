import { useState, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker'; // 날짜 선택 컴포넌트
import 'react-datepicker/dist/react-datepicker.css'; // DatePicker의 스타일을 불러옴
import Map from '../components/Location/Map.jsx'; // 지도 컴포넌트
import Contents from '../components/Location/Contents.jsx'; // 장소에 대한 콘텐츠 컴포넌트
import { useRecoilState } from 'recoil'; // Recoil 상태 관리 라이브러리
import { mapsDataState } from '../recoil/mapsState.js'; // 지도 데이터에 대한 Recoil 상태
import HeaderAfterSignIn from '../components/Common/HeaderAfterSignIn.jsx';
import { FaUndo } from 'react-icons/fa'; // 아이콘 라이브러리 (초기화 아이콘)
import { createPost } from '../utils/postApi.js'; // 포스트 생성 및 수정 API 가져오기
import './CreateAndEditPostPage.css';
import { useNavigate } from 'react-router-dom';

// 포스트 생성 및 수정 페이지 컴포넌트
const CreateAndEditPostPage = () => {
  const [postTitle, setPostTitle] = useState(''); // 포스트 제목 상태
  // 날짜 선택 상태
  const [startDate, setStartDate] = useState(null); // 여행 시작 날짜
  const [endDate, setEndDate] = useState(null); // 여행 종료 날짜
  const [dateRange, setDateRange] = useState([]); // 선택된 날짜 범위 (여행의 각 날짜)
  const [selectedDate, setSelectedDate] = useState(null); // 현재 선택된 날짜

  // 지도와 마커 관련 상태
  const [selectedMarker, setSelectedMarker] = useState(null); // 선택된 마커
  const [mapsData, setMapsData] = useRecoilState(mapsDataState); // Recoil로 관리되는 지도 데이터
  const [markers, setMarkers] = useState([]); // 현재 선택된 날짜에 해당하는 마커
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const itemsPerPage = 1; // 페이지당 보여줄 마커 수

  // 콘텐츠 관련 상태 (소제목, 텍스트 및 이미지)
  const [content, setContent] = useState({ title: '', text: '', images: [], thumbnailIndex: null }); // 장소에 대한 콘텐츠 상태

  // 옵션 선택 상태 (목적, 인원 등)
  const [selectedOptions, setSelectedOptions] = useState([]); // 선택된 옵션들 (예: 여행 목적, 인원)
  const [isOptionsOpen, setIsOptionsOpen] = useState(false); // 옵션 창이 열렸는지 여부
  const navigate = useNavigate();

  // 카테고리별 선택 옵션 정의
  const categories = {
    '목적': ['휴식', '레저', '비즈니스', '학습'], // 여행 목적
    '인원': ['혼자', '연인', '가족'], // 인원 구성
    '계절': ['봄', '여름', '가을', '겨울'], // 여행 계절
  };

  // mapsData 상태 변화 감시 (디버깅을 위한 로그 출력)
  useEffect(() => {
    console.log('현재 mapsData 상태:', mapsData);
  }, [mapsData]);

  useEffect(() => {
    console.log('현재 selectedDate:', selectedDate);
    console.log('현재 selectedMarker:', selectedMarker);
    console.log('현재 content 상태:', content);
  }, [selectedDate, selectedMarker, content]);

  useEffect(() => {
    // 선택된 날짜가 변경될 때 마커 순서를 다시 설정
    if (selectedDate && mapsData[selectedDate]?.length > 0) {
      const updatedMarkers = mapsData[selectedDate].map((marker, index) => ({
        ...marker,
        order: index + 1, // 날짜별 마커 순서를 다시 설정
      }));

      setMarkers(updatedMarkers); // 마커 상태를 업데이트
    } else {
      setMarkers([]); // 마커가 없을 경우 초기화
    }
  }, [selectedDate, mapsData]);

  useEffect(() => {
    // 선택된 날짜가 변경되면 모든 상태 초기화
    if (selectedDate && Array.isArray(mapsData[selectedDate])) {
      setMarkers(mapsData[selectedDate]); // 선택된 날짜에 해당하는 마커들을 로드
      setSelectedMarker(null); // 날짜 변경 시 선택된 마커 초기화
      setContent({ title: '', text: '', images: [] }); // 콘텐츠 초기화
    } else {
      setMarkers([]); // 선택된 날짜에 마커가 없을 경우 초기화
      setSelectedMarker(null); // 선택된 마커도 초기화
      setContent({ title: '', text: '', images: [] }); // 콘텐츠 초기화
    }
  }, [selectedDate, mapsData]);

  // selectedMarker가 변경될 때마다 콘텐츠를 로드
  useEffect(() => {
    if (selectedMarker && selectedDate) {
      const selectedMarkerContent = mapsData[selectedDate]?.find(
        marker => marker.lat === selectedMarker.lat && marker.lng === selectedMarker.lng && marker.order === selectedMarker.order
      );
      if (selectedMarkerContent && selectedMarkerContent.content) {
        setContent({
          title: selectedMarkerContent.content.title || '', // 소제목 추가
          text: selectedMarkerContent.content.text || '',
          images: selectedMarkerContent.content.images || [],
        });
      } else {
        setContent({ title: '', text: '', images: [] });
      }
    } else {
      setContent({ title: '', text: '', images: [] });
    }
  }, [selectedMarker, selectedDate, mapsData]);

  // 포스트 제목 입력 핸들러
  const handleTitleChange = (e) => {
    setPostTitle(e.target.value);
  };


  // 저장 버튼 클릭 핸들러
  const handleSave = async () => {
    // 1. 기본 입력 항목 검증 (제목, 날짜, 지도 데이터)
    if (!postTitle || !startDate || !endDate || !Object.keys(mapsData).length) {
      alert('필수 입력 항목이 누락되었습니다.');
      return;
    }

    // 선택된 항목들에서 각각의 카테고리별로 값을 가져오기 위한 함수
    const getCategoryValue = (categoryName) => {
      const categoryOptions = categories[categoryName];
      const selectedOption = selectedOptions.find(option => categoryOptions.includes(option));
      return selectedOption || '기타'; // 해당 카테고리에서 선택된 옵션이 없으면 '기타' 반환
    };

    // 2. 각 날짜별로 적어도 하나 이상의 장소에 사진 또는 글이 입력되었는지 확인
    const hasContent = Object.values(mapsData).some((locations = []) =>
      locations.some(location => {
        const description = location?.content?.text?.trim() || ''; // description이 undefined일 경우 빈 문자열
        const photos = location?.content?.images || []; // photos가 undefined일 경우 빈 배열로 설정
        return (description !== '') || photos.length > 0;
      })
    );


    if (!hasContent) {
      alert('적어도 하나 이상의 날짜에 사진 또는 글이 포함되어야 합니다.');
      return;
    }

    // 가장 빠른 날짜의 가장 순서가 빠른 장소의 첫 번째 이미지를 썸네일로 선택하는 로직
    let thumbnailImage = null;

    Object.keys(mapsData).sort().some(date => {
      const locations = mapsData[date];
      return locations.some(location => {
        if (location.content.images && location.content.images.length > 0) {
          thumbnailImage = location.content.images[0];
          return true;
        }
        return false;
      });
    });

    // 포스트 데이터를 생성
    const postData = {
      title: {
        title: postTitle,
        dates: [startDate.toISOString(), endDate.toISOString()],
        dailyLocations: Object.keys(mapsData).map(date => ({
          date,
          locations: mapsData[date].map(marker => ({
            subtitle: marker.content.title, // 소제목
            name: marker.info, // 장소 이름
            lat: marker.lat,   // 위도
            lng: marker.lng,   // 경도
            description: marker.content.text || '', // 장소 설명
            photos: marker.content.images || [],  // 사진
            visitedOrder: marker.order  // 방문 순서
          }))
        })),
        tripPurpose: getCategoryValue('목적'), // 선택된 목적 옵션
        tripGroupType: getCategoryValue('인원'), // 선택된 인원 옵션
        season: getCategoryValue('계절'), // 선택된 계절 옵션
      },
      channelId: '66ff441851e9a379d07c0c08', // 실제 채널 ID를 입력
      image: thumbnailImage || null // 선택된 썸네일 이미지 또는 null
    };

    try {
      const result = await createPost(postData);
      alert('포스트가 성공적으로 저장되었습니다!');
      navigate(`/posts/${result._id}`);
    } catch (error) {
      alert(`포스트 저장에 실패했습니다: ${error.message}`);
    }
  };

  // 나가기 버튼 클릭 핸들러
  const handleExit = () => {

    // 메인 페이지로 이동
    navigate('/main');
  };

  // 페이지 상태를 초기화하는 함수
  const resetPage = () => {
    setStartDate(null);
    setEndDate(null);
    setDateRange([]);
    setSelectedDate(null);
    setSelectedMarker(null);
    setMapsData({});
    setMarkers([]);
    setContent({ title: '', text: '', images: [] });
  };

  // 페이지 초기화 후 다시 로드하는 함수
  const handleCreatePost = () => {
    console.log('Create Post clicked.')
    resetPage(); // 상태 초기화
    navigate('/create-edit'); // 다시 현재 페이지로 리다이렉트
  };

  // 로그아웃 처리 함수
  const handleSignOut = () => {
    console.log('Sign Out clicked');
    // 로그아웃 로직
  };

  // 페이지 변경 함수
  const handlePageChange = (page) => {
    setCurrentPage(page);
    const startIndex = (page - 1) * itemsPerPage;
    const selectedMarkerOnPage = markers[startIndex];
    setSelectedMarker(selectedMarkerOnPage); // 페이지에 맞는 마커를 선택
  };

  // 'Done' 버튼 클릭 시 여행 기간 내 모든 날짜 설정
  const handleDoneClick = () => {
    if (!startDate || !endDate) {
      alert('여행 시작일과 종료일을 선택하세요.');
      return;
    }

    const range = [];
    let currentDate = new Date(startDate); // 시작 날짜 복사
    currentDate.setHours(0, 0, 0, 0); // 시간 초기화

    const finalDate = new Date(endDate); // 종료 날짜 복사
    finalDate.setHours(0, 0, 0, 0); // 시간 초기화

    // 시작일부터 종료일까지의 날짜 범위를 배열로 생성
    while (currentDate <= finalDate) {
      range.push(new Date(currentDate).toISOString().split('T')[0]); // 'YYYY-MM-DD' 형식으로 날짜 추가
      currentDate.setDate(currentDate.getDate() + 1); // 하루씩 증가
    }

    setDateRange(range); // 날짜 범위 상태 설정
    setSelectedDate(range[0]); // 첫 번째 날짜를 기본 선택

    const initialMapsData = { ...mapsData };
    range.forEach((date) => {
      if (!mapsData[date]) {
        initialMapsData[date] = []; // 날짜에 해당하는 마커가 없을 경우 빈 배열로 초기화
      }
    });
    setMapsData(initialMapsData); // 초기화된 mapsData를 Recoil 상태에 저장
  };

  // 특정 날짜에 마커 추가하는 함수
  const handleAddLocation = (date, newLocation) => {
    setMapsData((prevMapsData) => {
      const updatedMarkersForDate = prevMapsData[date] || [];
      const newOrder = updatedMarkersForDate.length + 1; // 해당 날짜에 맞는 순서 계산

      const updatedData = {
        ...prevMapsData,
        [date]: [...updatedMarkersForDate, { ...newLocation, order: newOrder, content: { text: '', image: null } }],
      };

      return updatedData;
    });
  };

  // 마커 업데이트 처리 함수
  const handleUpdateMarkers = (updatedMarkers) => {
    setMapsData((prevMapsData) => {
      const updatedData = {
        ...prevMapsData,
        [selectedDate]: updatedMarkers, // 선택된 날짜의 마커를 업데이트
      };
      return updatedData;
    });
  };

  // 마커 클릭 시 호출되는 함수
  const handleMarkerClick = useCallback((marker) => {
    if (selectedDate) {
      const currentMarkers = mapsData[selectedDate];

      if (currentMarkers && Array.isArray(currentMarkers)) {
        const foundMarker = currentMarkers.find(
          m => m.lat === marker.lat && m.lng === marker.lng && m.order === marker.order // 마커의 order 값을 기준으로 찾음
        );

        if (foundMarker) {
          console.log('Found marker:', foundMarker);
          setSelectedMarker(foundMarker); // 선택된 마커를 업데이트

          // 해당 마커의 order를 기반으로 페이지 설정
          setCurrentPage(foundMarker.order); // 현재 페이지를 마커의 순서에 맞게 설정
        }
      }
    }
  }, [selectedDate, mapsData]);

  // 마커에 대한 콘텐츠 저장 함수
  const handleSaveContent = (newContent) => {
    if (!selectedMarker) return;

    setMapsData((prevMapsData) => {
      const updatedMarkers = prevMapsData[selectedDate].map((marker) =>
        marker.order === selectedMarker.order ? { ...marker, content: newContent } : marker // 마커의 content를 newContent로 업데이트
      );

      return {
        ...prevMapsData,
        [selectedDate]: updatedMarkers, // 선택된 날짜에 대한 마커 업데이트
      };
    });
  };

  // 여행 요소 선택 토글 (옵션 창 열기/닫기)
  const toggleOptions = () => {
    setIsOptionsOpen((prev) => !prev);
  };

  // 옵션 선택 및 해제 처리 함수
  const handleOptionClick = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option)); // 선택 해제
    } else {
      setSelectedOptions([...selectedOptions, option]); // 선택 추가
    }
  };

  // 선택된 항목 초기화
  const handleResetClick = () => {
    setSelectedOptions([]); // 선택된 항목 모두 초기화
  };

  const totalPages = Math.ceil(markers.length / itemsPerPage);

  return (
    <div className='create-post-page'>
      {/* 상단 네비게이션 바 */}
      <HeaderAfterSignIn onCreatePost={handleCreatePost} onSignOut={handleSignOut} />

      <div className="create-post-header">
        <input
          type="text"
          value={postTitle}
          onChange={handleTitleChange}
          placeholder="포스트 제목을 입력하세요"
        />

        <div className="create-post-buttons">
          {/* 나가기 버튼 */}
          <button
            onClick={handleExit}
          >
            나가기
          </button>

          {/* 저장 버튼 */}
          <button
            onClick={handleSave}
          >
            저장
          </button>
        </div>
      </div>


      {/* 날짜 선택 UI와 Done 버튼 */}
      <div className='datepicker-and-options'>
        <DatePicker
          className='datepicker start'
          selected={startDate} // 선택된 시작 날짜
          onChange={(date) => setStartDate(date)} // 시작 날짜 선택 시 상태 업데이트
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="yyyy-MM-dd"
          placeholderText="여행 시작일"
        />
        <DatePicker
          className='datepicker finish'
          selected={endDate} // 선택된 종료 날짜
          onChange={(date) => setEndDate(date)} // 종료 날짜 선택 시 상태 업데이트
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          dateFormat="yyyy-MM-dd"
          placeholderText="여행 종료일"
        />
        <button onClick={handleDoneClick}
        //  style={{ padding: '5px 10px' }}
        >
          여행 기간 선택 완료
        </button>
        {/* 여행 요소 선택 버튼 */}
        <button onClick={toggleOptions}
        // style={{ padding: '5px 10px' }}
        >
          여행 요소
        </button>
        {/* 선택된 항목 표시 및 초기화 */}
        {selectedOptions.length > 0 && (
          <div className='selected-options'>
            <div className='selected-option'>
              {selectedOptions.map((option) => (
                <button
                  key={option}
                  // style={{
                  //   padding: '10px',
                  //   backgroundColor: 'black',
                  //   color: 'white',
                  //   borderRadius: '5px',
                  //   cursor: 'pointer',
                  //   display: 'flex',
                  //   alignItems: 'center',
                  // }}
                  onClick={() => handleOptionClick(option)} // 옵션 클릭 시 해제 처리
                >
                  {option}
                  <span
                  // style={{ marginLeft: '5px', cursor: 'pointer' }}
                  > ✕</span>
                </button>
              ))}
            </div>
            <button onClick={handleResetClick}
            // style={{ padding: '5px 10px', backgroundColor: 'transparent', border: 'none' }}
            >
              <FaUndo className='option-undo' />
            </button>
          </div>
        )}
      </div>

      {/* 옵션 선택 창 */}
      {isOptionsOpen && (
        <div className='options'
        // style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}
        >
          {Object.keys(categories).map((category) => (
            <div key={category}
            // style={{ marginBottom: '10px' }}
            >
              <h5 className='cat-title'>{category}</h5>
              <div className='cats'>
                {categories[category].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionClick(option)}
                  // style={{
                  //   padding: '5px 10px',
                  //   backgroundColor: selectedOptions.includes(option) ? 'black' : 'lightgrey',
                  //   color: selectedOptions.includes(option) ? 'white' : 'black',
                  //   border: 'none',
                  //   borderRadius: '5px',
                  //   cursor: 'pointer',
                  // }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}


        </div>
      )}



      {/* 날짜별 버튼 생성 */}
      {dateRange.length > 0 && (
        <div className="parent-container">
          {dateRange.map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)} // 클릭 시 해당 날짜 선택
              className={`date-button ${selectedDate === date ? 'selected' : ''}`} // 선택된 날짜에 selected 클래스 추가
            >
              {new Date(date).toDateString()} {/* 날짜를 문자열 형식으로 표시 */}
            </button>
          ))}
        </div>
      )}

      {/* 지도와 마커 관리 UI */}
      {selectedDate && (
        <div className='map-and-contents'>
          <div>
            {/* <h3>{selectedDate}</h3> */}
            <Map
              onAddLocation={(newLocation) => handleAddLocation(selectedDate, newLocation)} // 장소 추가 함수
              markers={markers} // 선택된 날짜의 마커들
              selectedDate={selectedDate}
              onMarkerClick={handleMarkerClick} // 마커 클릭 시 호출
              onUpdateMarkers={handleUpdateMarkers} // 마커 업데이트 처리
            />
          </div>

          {/* 선택된 마커가 있을 경우 콘텐츠 표시 */}
          {selectedMarker && (
            <div>
              <Contents className='post-contents' selectedMarker={selectedMarker} content={content} onSaveContent={handleSaveContent}
              />
            </div>
          )}
        </div>
      )}

      {/* 마커가 있을 때만 페이지 넘기기 버튼을 렌더링 */}
      {markers.length > 0 && (
        <div className='location-pagination'>
          {/* 이전 버튼 */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}>이전</button>

          {/* 페이지 번호 버튼 */}
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? 'selected' : ''}>
              {index + 1}
            </button>
          ))}

          {/* 다음 버튼 */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}>다음</button>
        </div>
      )}
    </div>
  );
};

export default CreateAndEditPostPage;