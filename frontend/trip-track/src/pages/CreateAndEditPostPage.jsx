import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Map from '../components/Location/Map.jsx';
import Contents from '../components/Location/Contents.jsx';
import { useRecoilState } from 'recoil';
import { mapsDataState } from '../recoil/mapsState.js'; // Recoil 상태 가져오기
import { FaUndo } from 'react-icons/fa'; // 초기화 아이콘 (react-icons 사용)

const CreateAndEditPostPage = () => {
  const [startDate, setStartDate] = useState(null); // 시작 날짜 상태
  const [endDate, setEndDate] = useState(null); // 종료 날짜 상태
  const [dateRange, setDateRange] = useState([]); // 선택된 날짜 범위
  const [selectedDate, setSelectedDate] = useState(null); // 현재 선택된 날짜
  const [selectedMarker, setSelectedMarker] = useState(null); // 현재 선택된 마커
  const [mapsData, setMapsData] = useRecoilState(mapsDataState); // Recoil 상태로 관리
  const [content, setContent] = useState({ text: '', image: null }); // 콘텐츠 상태 추가
  const [selectedOptions, setSelectedOptions] = useState([]); // 선택된 세부 항목 상태
  const [isOptionsOpen, setIsOptionsOpen] = useState(false); // 옵션 선택 항목 열고 닫기 상태
   // 마커 상태 추가
   const [markers, setMarkers] = useState([]); // 현재 날짜에 해당하는 마커 상태

     // 카테고리 및 세부 선택 항목 설정
  const categories = {
    '목적': ['휴식', '레저', '비즈니스', '학습'],
    '인원': ['혼자', '연인', '가족'],
    '계절': ['봄', '여름', '가을', '겨울'],
  };

  useEffect(() => {
    // Recoil 상태를 콘솔로 확인하여 문제 디버깅
    console.log('현재 mapsData 상태:', mapsData);
  }, [mapsData]);

  useEffect(() => {
    console.log('선택된 날짜:', selectedDate);
    console.log('선택된 날짜의 마커:', mapsData[selectedDate]); // 선택된 날짜의 마커 상태 확인

    // 선택된 날짜에 해당하는 마커를 불러와서 상태로 설정
    if (selectedDate && mapsData[selectedDate]) {
      setMarkers(mapsData[selectedDate]); // 해당 날짜에 해당하는 마커를 로컬 상태로 저장
    } else {
      setMarkers([]); // 선택된 날짜에 마커가 없으면 빈 배열로 설정
    }
  }, [selectedDate, mapsData]);

  const handleDoneClick = () => {
    if (!startDate || !endDate) {
      alert('여행 시작일과 종료일을 선택하세요.');
      return;
    }

    const range = [];
    let currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0);

    const finalDate = new Date(endDate);
    finalDate.setHours(0, 0, 0, 0);

    while (currentDate <= finalDate) {
      range.push(new Date(currentDate).toISOString().split('T')[0]); // YYYY-MM-DD 형식으로 저장
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setDateRange(range);
    setSelectedDate(range[0]);

    const initialMapsData = {...mapsData};
    range.forEach((date) => {
      if (!mapsData[date]) {
        initialMapsData[date] = []; // 해당 날짜에 대한 마커 데이터 초기화
      }
    });
    console.log("업데이트된 mapsData (초기화 후):", initialMapsData);
    setMapsData(initialMapsData); // Recoil 상태 업데이트
  };

  // 특정 날짜에 마커를 추가하는 함수
  const handleAddLocation = (date, newLocation) => {
    setMapsData((prevMapsData) => {
      const updatedData = {
        ...prevMapsData,
        [date]: [...(prevMapsData[date] || []), { ...newLocation, content: { text: '', image: null } }], // 기존 마커에 새 마커 추가
      };
      console.log('업데이트된 mapsData:', updatedData); // 업데이트된 상태 확인
      return updatedData;
    });
  };

   // 마커가 업데이트되었을 때 호출되는 함수
   const handleUpdateMarkers = (updatedMarkers) => {
    setMapsData((prevMapsData) => {
      // 선택된 날짜의 마커를 갱신
      const updatedData = {
        ...prevMapsData,
        [selectedDate]: updatedMarkers,
      };
      
      return updatedData;
    });
  };

   // 마커 클릭 시 호출되는 함수
   const handleMarkerClick = (marker) => {
    setSelectedMarker(marker); // 선택된 마커를 상태로 저장
    setContent(marker.content || { text: '', image: null }); // 선택한 마커의 콘텐츠 로드
  }

   // 콘텐츠 저장 처리 함수
  const handleSaveContent = (newContent) => {
    if (!selectedMarker) return;

    setMapsData((prevMapsData) => {
      const updatedMarkers = prevMapsData[selectedDate].map((marker) =>
        marker.info === selectedMarker.info ? { ...marker, content: newContent } : marker
      );

      return {
        ...prevMapsData,
        [selectedDate]: updatedMarkers,
      };
    });

    console.log('콘텐츠 저장 완료:', newContent);
  };

   // 여행 요소 버튼을 눌렀을 때 항목 열고 닫기
   const toggleOptions = () => {
    setIsOptionsOpen((prev) => !prev); // 옵션 열고 닫기 상태 토글
  };


  // 세부 항목 클릭 시 선택/해제 처리
  const handleOptionClick = (option) => {
    if (selectedOptions.includes(option)) {
      // 이미 선택된 항목이면 해제
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      // 선택되지 않은 항목이면 추가
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  // 모든 선택을 초기화하는 함수
  const handleResetClick = () => {
    setSelectedOptions([]); // 선택된 항목 초기화
  };


  return (
    <div>
      <h2>Create or Edit Post</h2>

      {/* 날짜 선택과 Done 버튼, 그리고 옵션 열기 버튼을 가로로 배치 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="yyyy-MM-dd"
          placeholderText="여행 시작일"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          dateFormat="yyyy-MM-dd"
          placeholderText="여행 종료일"
        />
        <button onClick={handleDoneClick} style={{ padding: '5px 10px' }}>
          Done
        </button>
        {/* 여행 요소 버튼 */}
        <button onClick={toggleOptions} style={{ padding: '5px 10px' }}>
          여행 요소
        </button>
      </div>

 {/* 옵션 선택 항목 토글 */}
 {isOptionsOpen && (
        <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
          <h4>옵션 항목들</h4>
          {/* 카테고리 목록 세로 배치 */}
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

      {/* 선택된 항목들 표시 및 개별 삭제 */}
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
                onClick={() => handleOptionClick(option)} // 선택 항목 클릭 시 해제
              >
                {option}
                <span style={{ marginLeft: '5px', cursor: 'pointer' }}>✕</span>
              </div>
            ))}
          </div>
          {/* 초기화 아이콘 버튼 */}
          <button onClick={handleResetClick} style={{ padding: '5px 10px', backgroundColor: 'transparent', border: 'none' }}>
            <FaUndo size={24} color="black" />
          </button>
          {/* 적용 버튼 */}
          <button style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#d3d3d3', border: 'none', borderRadius: '5px' }}>
            적용
          </button>
        </div>
      )}

      <style>
        {`
        .parent-container {
          width: 100%;
          overflow-x: auto;
          white-space: nowrap;
        }
        .date-button {
      width: calc(20% - 10px); /* 5개 버튼이 표시되도록 각 버튼 크기 설정 */
      margin: 0 5px;
      display: inline-block;
    }
          .date-button:focus {
  outline: none; /* 포커스시 외곽선 제거 */
  box-shadow: none; /* 포커스시 그림자 제거 */
}
        `}
      </style>
      {dateRange.length > 0 && (
        <div className="parent-container">
          {dateRange.map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
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
              {new Date(date).toDateString()}
            </button>
          ))}
        </div>
      )}

      {selectedDate && (
        <div style={{ display: 'flex', marginTop: '20px' }}>
          <div style={{ flex: 1, marginRight: '20px' }}>
            <h3>{selectedDate}</h3>
            <Map
              onAddLocation={(newLocation) => handleAddLocation(selectedDate, newLocation)}
              markers={markers} // 현재 날짜에 맞는 마커를 넘겨줌
              selectedDate={selectedDate}
              onMarkerClick={handleMarkerClick} // 마커 클릭 시 호출
              onUpdateMarkers={handleUpdateMarkers} // 마커 갱신 함수 전달
            />
          </div>

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