import { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Autocomplete, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import PropTypes from 'prop-types';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// 마커를 드래그 앤 드롭할 때 사용할 아이템 타입
const ItemType = 'MARKER';

// 지도 컨테이너 스타일
const containerStyle = {
  width: '100%',
  height: '400px',
};

// 지도 기본 위치 (샌프란시스코)
const center = {
  lat: 37.7749,
  lng: -122.4194,
};

// 라이브러리 목록
const libraries = ['places', 'marker'];

// 드래그 가능한 마커 컴포넌트
const DraggableMarker = ({ marker, index, moveMarker }) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index },
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
        {/* 동그라미 아이콘 */}
        <span style={{ fontSize: '24px', cursor: 'grab' }}>⚪</span> {/* 드래그 가능한 아이콘 */}
        <strong>{marker.order}. {marker.info}</strong> {/* 마커 순서와 정보를 표시 */}
      </div>
    </div>
  );
};

// PropTypes 추가
DraggableMarker.propTypes = {
  marker: PropTypes.shape({
    order: PropTypes.number.isRequired, // marker의 order는 숫자형 필수값
    info: PropTypes.string.isRequired,  // marker의 info는 문자열 필수값
    lat: PropTypes.number.isRequired,   // marker의 위도는 숫자형 필수값
    lng: PropTypes.number.isRequired,   // marker의 경도는 숫자형 필수값
  }).isRequired,
  index: PropTypes.number.isRequired,     // index는 숫자형 필수값
  moveMarker: PropTypes.func.isRequired,  // moveMarker는 함수형 필수값
};

const Map = ({ onAddLocation, markers = [] }) => {
  const [localMarkers, setLocalMarkers] = useState([]); // 전달된 마커를 로컬 상태로 관리
  const [selectedMarker, setSelectedMarker] = useState(null); // 선택된 마커 상태
  const mapRef = useRef(null);
  const [autocomplete, setAutocomplete] = useState(null); // Autocomplete 상태
  const markerOrder = useRef(1); // 마커 순서를 추적하는 변수 (Ref로 관리)

  // 전달된 markers가 변경될 때 한 번만 localMarkers에 설정
  useEffect(() => {
    setLocalMarkers(markers || []);
    markerOrder.current = markers.length + 1; // 마커 순서를 유지
  }, [markers]);

  // 장소 검색 후 선택된 장소에 마커 추가하는 함수
  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          info: place.name || `검색된 장소명`, // 장소명 추가
          order: markerOrder.current, // 마커 생성 순서
        };
        markerOrder.current += 1; // 마커 순서 증가

        // 마커 추가 시 항상 순서를 다시 설정
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

        // 외부로부터 전달된 마커 추가 함수 호출
        onAddLocation(location);
      } else {
        console.warn('선택된 장소에 대한 위치 정보가 없습니다.');
      }
    }
  };

  // Autocomplete 인스턴스가 로드될 때 호출되는 함수
  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance); // 로드된 인스턴스를 상태에 저장
  };

  // 마커 삭제 함수
  const deleteMarker = (markerIndex) => {
    // 마커 삭제 후 순서 재정렬
    setLocalMarkers((prevMarkers) => {
      const updatedMarkers = prevMarkers.filter((_, index) => index !== markerIndex);
      return updatedMarkers.map((marker, index) => ({
        ...marker,
        order: index + 1, // 순서를 다시 설정
      }));
    });
    setSelectedMarker(null); // InfoWindow를 닫기 위해 selectedMarker 초기화
  };

  // 마커 순서 변경 함수
  const moveMarker = (fromIndex, toIndex) => {
    const updatedMarkers = [...localMarkers];
    const [movedMarker] = updatedMarkers.splice(fromIndex, 1); // 드래그된 마커를 배열에서 제거
    updatedMarkers.splice(toIndex, 0, movedMarker); // 새 위치에 삽입

    // 마커 순서를 다시 설정
    setLocalMarkers(
      updatedMarkers.map((marker, index) => ({
        ...marker,
        order: index + 1,
      }))
    );
  };

  // 동일한 장소에 대한 중복 마커를 관리하는 함수
  const getMarkersAtSamePosition = (lat, lng) => {
    return localMarkers.filter((marker) => marker.lat === lat && marker.lng === lng);
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <input
          type="text"
          placeholder="장소 검색"
          style={{ width: '300px', height: '40px', marginBottom: '10px' }}
        />
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={(map) => (mapRef.current = map)} // 지도 로드 시 mapRef에 지도 객체 저장
      >
        {/* 마커들 렌더링 */}
        {localMarkers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => setSelectedMarker({ lat: marker.lat, lng: marker.lng })} // 마커 클릭 시 InfoWindow에 마커 정보 표시
          />
        ))}

        {/* 마커들을 순서대로 연결하는 Polyline */}
        {localMarkers.length > 1 && (
          <Polyline
            path={localMarkers.map((marker) => ({ lat: marker.lat, lng: marker.lng }))} // 마커들의 위치를 순서대로 연결
            options={{
              strokeColor: '#FF0000', // 선 색상
              strokeOpacity: 1.0, // 선 투명도
              strokeWeight: 2, // 선 굵기
            }}
          />
        )}

        {/* 선택된 마커에 대한 InfoWindow */}
        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={() => setSelectedMarker(null)} // 창 닫기
          >
            <div style={{ minWidth: '120px', fontSize: '14px' }}>
              {/* 동일한 위치의 마커들을 순서대로 표시 */}
              {getMarkersAtSamePosition(selectedMarker.lat, selectedMarker.lng).map((marker, idx) => (
                <div key={idx} style={{ marginBottom: '10px' }}>
                  <p>{`${marker.order}. ${marker.info}`}</p> {/* 장소명과 순서를 표시 */}
                  <button
                    style={{ backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
                    onClick={() => deleteMarker(localMarkers.indexOf(marker))} // 마커 삭제 버튼
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* 타임라인 UI */}
      <div style={{ marginTop: '20px', padding: '10px' }}>
        <h3>경로 타임라인</h3>
        <DndProvider backend={HTML5Backend}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {localMarkers.map((marker, index) => (
              <DraggableMarker key={index} marker={marker} index={index} moveMarker={moveMarker} />
            ))}
          </div>
        </DndProvider>
      </div>
    </LoadScript>
  );
};

Map.propTypes = {
  onAddLocation: PropTypes.func.isRequired,
  markers: PropTypes.array.isRequired, // 추가된 props
};

export default Map;
