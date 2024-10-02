import { useState, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker'; // 날짜 선택 컴포넌트
import 'react-datepicker/dist/react-datepicker.css'; // DatePicker의 스타일을 불러옴
import Map from '../components/Location/Map.jsx'; // 지도 컴포넌트
import Contents from '../components/Location/Contents.jsx'; // 장소에 대한 콘텐츠 컴포넌트
import { useRecoilState } from 'recoil'; // Recoil 상태 관리 라이브러리
import { mapsDataState } from '../recoil/mapsState.js'; // 지도 데이터에 대한 Recoil 상태
import { FaUndo } from 'react-icons/fa'; // 아이콘 라이브러리 (초기화 아이콘)

// 포스트 생성 및 수정 페이지 컴포넌트
const CreateAndEditPostPage = () => {
  // 날짜 선택 상태
  const [startDate, setStartDate] = useState(null); // 여행 시작 날짜
  const [endDate, setEndDate] = useState(null); // 여행 종료 날짜
  const [dateRange, setDateRange] = useState([]); // 선택된 날짜 범위 (여행의 각 날짜)
  const [selectedDate, setSelectedDate] = useState(null); // 현재 선택된 날짜

  // 지도와 마커 관련 상태
  const [selectedMarker, setSelectedMarker] = useState(null); // 선택된 마커
  const [mapsData, setMapsData] = useRecoilState(mapsDataState); // Recoil로 관리되는 지도 데이터
  const [markers, setMarkers] = useState([]); // 현재 선택된 날짜에 해당하는 마커

  // 콘텐츠 관련 상태 (텍스트 및 이미지)
  const [content, setContent] = useState({ text: '', images: [], thumbnailIndex: null }); // 장소에 대한 콘텐츠 상태

  // 옵션 선택 상태 (목적, 인원 등)
  const [selectedOptions, setSelectedOptions] = useState([]); // 선택된 옵션들 (예: 여행 목적, 인원)
  const [isOptionsOpen, setIsOptionsOpen] = useState(false); // 옵션 창이 열렸는지 여부

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
    // 선택된 날짜가 변경되면 모든 상태 초기화
    if (selectedDate && Array.isArray(mapsData[selectedDate])) {
      setMarkers(mapsData[selectedDate]); // 선택된 날짜에 해당하는 마커들을 로드
      setSelectedMarker(null); // 날짜 변경 시 선택된 마커 초기화
      setContent({ text: '', images: [], thumbnailIndex: null }); // 콘텐츠 초기화
    } else {
      setMarkers([]); // 선택된 날짜에 마커가 없을 경우 초기화
      setSelectedMarker(null); // 선택된 마커도 초기화
      setContent({ text: '', images: [], thumbnailIndex: null }); // 콘텐츠 초기화
    }
  }, [selectedDate, mapsData]);
  
  // 마커 클릭 시, 해당 마커의 콘텐츠를 정확하게 로드
  useEffect(() => {
    if (selectedMarker && selectedDate && Array.isArray(mapsData[selectedDate])) {
      const selectedMarkerContent = mapsData[selectedDate].find(
        marker => marker.lat === selectedMarker.lat && marker.lng === selectedMarker.lng
      );
  
      if (selectedMarkerContent) {
        setContent(selectedMarkerContent.content || { text: '', images: [], thumbnailIndex: null });
      } else {
        setContent({ text: '', images: [], thumbnailIndex: null });
      }
    }
  }, [selectedMarker, selectedDate, mapsData]);

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
      const updatedData = {
        ...prevMapsData,
        [date]: [...(prevMapsData[date] || []), { ...newLocation, content: { text: '', image: null } }], // 새로운 마커 추가
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
        m => m.lat === marker.lat && m.lng === marker.lng
      );

      if (foundMarker) {
        setSelectedMarker(foundMarker); // 선택된 마커를 업데이트
      }
    }
  }
}, [selectedDate, mapsData]);

  useEffect(() => {
    // 선택된 마커와 선택된 날짜가 유효한 경우에만 로드
    if (selectedMarker && selectedDate && mapsData[selectedDate]?.length > 0) {
      // 선택된 마커의 콘텐츠 찾기
      const selectedMarkerContent = mapsData[selectedDate].find(
        marker => marker.lat === selectedMarker.lat && marker.lng === selectedMarker.lng
      );
      
      // 콘텐츠를 정확히 로드하고 상태 초기화
      if (selectedMarkerContent) {
        setContent(selectedMarkerContent.content || { text: '', images: [], thumbnailIndex: null });
      } else {
        setContent({ text: '', images: [], thumbnailIndex: null }); // 마커가 없을 경우 초기화
      }
    } else {
      // 선택된 마커나 날짜가 없으면 상태 초기화
      setContent({ text: '', images: [], thumbnailIndex: null });
    }
  }, [selectedMarker, selectedDate, mapsData]);
  
  // 마커에 대한 콘텐츠 저장 함수
  const handleSaveContent = (newContent) => {
    if (!selectedMarker) return;

    setMapsData((prevMapsData) => {
      const updatedMarkers = prevMapsData[selectedDate].map((marker) =>
        marker.info === selectedMarker.info ? { ...marker, content: newContent } : marker // 마커 정보에 따라 업데이트
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

  return (
    <div>
      <h2>Create or Edit Post</h2>

      {/* 날짜 선택 UI와 Done 버튼 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <DatePicker
          selected={startDate} // 선택된 시작 날짜
          onChange={(date) => setStartDate(date)} // 시작 날짜 선택 시 상태 업데이트
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="yyyy-MM-dd"
          placeholderText="여행 시작일"
        />
        <DatePicker
          selected={endDate} // 선택된 종료 날짜
          onChange={(date) => setEndDate(date)} // 종료 날짜 선택 시 상태 업데이트
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          dateFormat="yyyy-MM-dd"
          placeholderText="여행 종료일"
        />
        <button onClick={handleDoneClick} style={{ padding: '5px 10px' }}>
          Done
        </button>
        {/* 여행 요소 선택 버튼 */}
        <button onClick={toggleOptions} style={{ padding: '5px 10px' }}>
          여행 요소
        </button>
      </div>

      {/* 옵션 선택 창 */}
      {isOptionsOpen && (
        <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
          {Object.keys(categories).map((category) => (
            <div key={category} style={{ marginBottom: '10px' }}>
              <h5>{category}</h5>
              <div style={{ display: 'flex', gap: '10px' }}>
                {categories[category].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionClick(option)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: selectedOptions.includes(option) ? 'black' : 'lightgrey',
                      color: selectedOptions.includes(option) ? 'white' : 'black',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 선택된 항목 표시 및 초기화 */}
      {selectedOptions.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {selectedOptions.map((option) => (
              <div
                key={option}
                style={{
                  padding: '10px',
                  backgroundColor: 'black',
                  color: 'white',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onClick={() => handleOptionClick(option)} // 옵션 클릭 시 해제 처리
              >
                {option}
                <span style={{ marginLeft: '5px', cursor: 'pointer' }}>✕</span>
              </div>
            ))}
          </div>
          <button onClick={handleResetClick} style={{ padding: '5px 10px', backgroundColor: 'transparent', border: 'none' }}>
            <FaUndo size={24} color="black" />
          </button>
        </div>
      )}

      {/* 날짜별 버튼 생성 */}
      {dateRange.length > 0 && (
        <div className="parent-container">
          {dateRange.map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)} // 클릭 시 해당 날짜 선택
              className="date-button"
              style={{
                padding: '10px',
                backgroundColor: selectedDate === date ? 'black' : 'lightgrey',
                color: selectedDate === date ? 'white' : 'black',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              {new Date(date).toDateString()} {/* 날짜를 문자열 형식으로 표시 */}
            </button>
          ))}
        </div>
      )}

      {/* 지도와 마커 관리 UI */}
      {selectedDate && (
        <div style={{ display: 'flex', marginTop: '20px' }}>
          <div style={{ flex: 1, marginRight: '20px' }}>
            <h3>{selectedDate}</h3>
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
            <div style={{ flexBasis: '300px' }}>
              <Contents selectedMarker={selectedMarker} content={content} onSaveContent={handleSaveContent} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateAndEditPostPage;