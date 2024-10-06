import { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Autocomplete, Marker, InfoWindow } from '@react-google-maps/api'; // 구글 맵 관련 컴포넌트
import PropTypes from 'prop-types'; // PropTypes로 props 검증
import { DndProvider, useDrag, useDrop } from 'react-dnd'; // 드래그 앤 드롭 라이브러리
import { HTML5Backend } from 'react-dnd-html5-backend'; // 드래그 앤 드롭 백엔드
import './Map.css';
import { RiDraggable } from "react-icons/ri";

// 마커 드래그 앤 드롭 타입 정의
const ItemType = 'MARKER';

// 지도 컨테이너 스타일 정의
const containerStyle = {
  width: 'calc(100% - 4rem)',
  height: '400px',
  margin: '1rem 2rem'
};

// 지도 기본 위치 (샌프란시스코)
const center = {
  lat: 37.7749,
  lng: -122.4194,
};

// 구글 맵 라이브러리 목록
const libraries = ['places', 'marker'];

// 드래그 가능한 마커 컴포넌트 정의
const DraggableMarker = ({ marker, index, moveMarker }) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index }, // 마커의 인덱스 정보
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item) => {
      if (item.index !== index) {
        moveMarker(item.index, index); // 드래그된 마커의 순서를 변경
        item.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} style={{ margin: '0 10px', textAlign: 'center', cursor: 'move' }}>
      <div>
        <span style={{ cursor: 'grab' }}><RiDraggable /> </span> {/* 드래그 가능한 아이콘 */}
        <strong>{marker.order}. {marker.info}</strong> {/* 마커의 순서와 정보를 표시 */}
      </div>
    </div>
  );
};

// PropTypes로 마커 속성 검증
DraggableMarker.propTypes = {
  marker: PropTypes.shape({
    order: PropTypes.number.isRequired, // 마커의 순서는 숫자형 필수값
    info: PropTypes.string.isRequired,  // 마커의 정보는 문자열 필수값
    lat: PropTypes.number.isRequired,   // 마커의 위도는 숫자형 필수값
    lng: PropTypes.number.isRequired,   // 마커의 경도는 숫자형 필수값
  }).isRequired,
  index: PropTypes.number.isRequired,     // 마커의 인덱스는 숫자형 필수값
  moveMarker: PropTypes.func.isRequired,  // 마커 이동 함수는 함수형 필수값
};

// 지도 컴포넌트 정의
const Map = ({ onAddLocation, markers = [], onMarkerClick, onUpdateMarkers }) => {
  const [localMarkers, setLocalMarkers] = useState([]); // 전달된 마커를 로컬 상태로 관리
  const [selectedMarker, setSelectedMarker] = useState(null); // 선택된 마커 상태
  const mapRef = useRef(null); // 지도 객체를 저장할 참조
  const [autocomplete, setAutocomplete] = useState(null); // Autocomplete 상태
  const markerOrder = useRef(1); // 마커 순서를 추적하는 변수

  // 전달된 마커가 변경될 때마다 로컬 상태에 반영
  useEffect(() => {
    if (markers && markers.length > 0) {
      setLocalMarkers([...markers]); // 전달된 마커를 로컬 상태로 설정
      markerOrder.current = markers.length + 1; // 마커 순서 업데이트
    } else {
      setLocalMarkers([]); // 마커가 없을 경우 상태 초기화
    }
  }, [markers]);

  // 마커가 추가/변경될 때마다 지도 범위를 조정
  useEffect(() => {
    if (mapRef.current && localMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      localMarkers.forEach((marker) => bounds.extend({ lat: marker.lat, lng: marker.lng }));
      mapRef.current.fitBounds(bounds);
    }
  }, [localMarkers]);

  // 마커 사이를 연결하는 경로(Polyline)를 업데이트하는 함수
  const updatePolyline = () => {
    if (mapRef.current && localMarkers.length > 1) {
      const path = localMarkers.map((marker) => ({ lat: marker.lat, lng: marker.lng }));

      const newPolyline = new window.google.maps.Polyline({
        path,
        map: mapRef.current,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        icons: [
          {
            icon: {
              path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW, // 화살표 아이콘
            },
            offset: '100%', // 화살표가 선 끝에 위치
            repeat: '100px', // 100px마다 화살표 반복
          },
        ],
      });

      return newPolyline;
    }
  };

  // 마커 변경 시 경로(Polyline)를 다시 그리기
  useEffect(() => {
    const polyline = updatePolyline(); // 새로운 Polyline 그리기

    // 컴포넌트가 언마운트되거나 마커가 변경될 때 기존 Polyline 제거
    return () => {
      if (polyline) {
        polyline.setMap(null); // 기존 Polyline 제거
      }
    };
  }, [localMarkers]);

  // 장소 검색 후 선택된 장소에 마커 추가하는 함수
  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          info: place.name || `검색된 장소명`, // 장소명
          order: markerOrder.current, // 마커 순서
        };
        markerOrder.current += 1; // 마커 순서 증가

        // 마커 추가 시 순서 재설정
        setLocalMarkers((prevMarkers) => {
          const updatedMarkers = [...prevMarkers, location];
          return updatedMarkers.map((marker, index) => ({
            ...marker,
            order: index + 1, // 마커 순서 재정렬
          }));
        });

        // 지도 중심을 선택된 장소로 이동
        if (mapRef.current) {
          mapRef.current.panTo(location);
        }

        // 외부에서 전달된 마커 추가 함수 호출
        onAddLocation(location);
      } else {
        console.warn('선택된 장소에 대한 위치 정보가 없습니다.');
      }
    }
  };

  // Autocomplete 인스턴스가 로드될 때 호출
  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance); // Autocomplete 인스턴스 저장
  };

  // 마커 삭제 함수
const deleteMarker = (markerIndex) => {
  setLocalMarkers((prevMarkers) => {
    // 선택된 마커 삭제
    const updatedMarkers = prevMarkers.filter((_, index) => index !== markerIndex);
    
    // 마커 순서 재설정
    const reorderedMarkers = updatedMarkers.map((marker, index) => ({
      ...marker,
      order: index + 1, // 마커 순서를 1부터 다시 설정
    }));

    // 외부 상태 갱신 함수 호출
    onUpdateMarkers(reorderedMarkers);

    return reorderedMarkers;
  });
  
  // 선택된 마커 초기화 (InfoWindow 닫기)
  setSelectedMarker(null);
};


  // 마커 순서 변경 함수
  const moveMarker = (fromIndex, toIndex) => {
    const updatedMarkers = [...localMarkers];
    const [movedMarker] = updatedMarkers.splice(fromIndex, 1); // 드래그된 마커를 배열에서 제거
    updatedMarkers.splice(toIndex, 0, movedMarker); // 새로운 위치에 삽입

    // 마커 순서 재설정
    const reorderedMarkers = updatedMarkers.map((marker, index) => ({
      ...marker,
      order: index + 1, // 순서 업데이트
    }));

    // `mapsData`에 업데이트된 순서 저장
    onUpdateMarkers(reorderedMarkers); // 이 함수가 `mapsData` 상태를 업데이트함

    // `localMarkers`에도 업데이트된 순서 반영
    setLocalMarkers(reorderedMarkers);
  };

  // 동일한 위치에 있는 마커들을 관리하는 함수
  const getMarkersAtSamePosition = (lat, lng) => {
    return localMarkers.filter((marker) => marker.lat === lat && marker.lng === lng);
  };

  return (
    <LoadScript className='map-container' googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <Autocomplete className='map-search' onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <input
          type="text"
          placeholder="장소 검색"
          className='map-search'
        />
      </Autocomplete>

      {/* GoogleMap 컴포넌트 */}
      <GoogleMap
        className='map-google'
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={(map) => (mapRef.current = map)} // 지도 로드 시 mapRef에 저장
      >
        {/* 마커 렌더링 */}
        {localMarkers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => {
              setSelectedMarker({ lat: marker.lat, lng: marker.lng, order: marker.order });
              onMarkerClick && onMarkerClick(marker); // 마커 클릭 시 외부 함수 호출
            }}
          />
        ))}

        {/* 선택된 마커에 대한 InfoWindow */}
        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={() => setSelectedMarker(null)} // 창 닫기
          >
            <div style={{ minWidth: '200px', fontSize: '14px' }}>
              <h4>방문 기록</h4>
              {/* 동일한 위치에 있는 마커들 표시 */}
              {getMarkersAtSamePosition(selectedMarker.lat, selectedMarker.lng).map((marker, idx) => (
                <div
                  key={idx}
                  style={{ marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px', cursor: 'pointer' }}
                  onClick={() => {
                    console.log(`Clicked marker with order: ${marker.order}`);
                    onMarkerClick(marker); // 클릭 시 해당 마커의 콘텐츠 로드
                  }}
                >
                  <p>
                    <strong>방문 순서: {marker.order}</strong>
                  </p>
                  <p>{marker.info}</p>
                  <button
                    style={{ backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
                    onClick={() => deleteMarker(localMarkers.indexOf(marker))} // 마커 삭제
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* 타임라인 UI (드래그 앤 드롭으로 마커 순서 변경 가능) */}
      <div className='route-timeline'>
        <h3>경로 타임라인</h3>
        <DndProvider backend={HTML5Backend} >
          <div className="route-lists">
            {localMarkers.map((marker, index) => (
              <DraggableMarker key={index} marker={marker} index={index} moveMarker={moveMarker} />
            ))}

          </div>
        </DndProvider>
      </div>
    </LoadScript>
  );
};

// Map 컴포넌트 PropTypes 검증
Map.propTypes = {
  onAddLocation: PropTypes.func.isRequired, // 장소 추가 함수
  markers: PropTypes.array.isRequired,      // 마커 배열
  selectedDate: PropTypes.string.isRequired, // 선택된 날짜
  onMarkerClick: PropTypes.func,            // 마커 클릭 함수
  onUpdateMarkers: PropTypes.func.isRequired, // 마커 업데이트 함수
};

export default Map;