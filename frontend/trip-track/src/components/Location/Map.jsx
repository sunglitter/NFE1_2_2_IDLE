import { useState, useRef } from 'react';
import { GoogleMap, LoadScript, Autocomplete, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import PropTypes from 'prop-types';

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

const Map = ({ onAddLocation }) => {
  const [markers, setMarkers] = useState([]); // 마커 리스트
  const [selectedMarker, setSelectedMarker] = useState(null); // 선택된 마커 상태
  const mapRef = useRef(null);
  const [autocomplete, setAutocomplete] = useState(null); // Autocomplete 상태
  const markerOrder = useRef(1); // 마커 순서를 추적하는 변수 (Ref로 관리)

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
        setMarkers((prevMarkers) => {
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
    setMarkers((prevMarkers) => {
      const updatedMarkers = prevMarkers.filter((_, index) => index !== markerIndex);
      return updatedMarkers.map((marker, index) => ({
        ...marker,
        order: index + 1, // 순서를 다시 설정
      }));
    });
    setSelectedMarker(null); // InfoWindow를 닫기 위해 selectedMarker 초기화
  };

  // 동일한 장소에 대한 중복 마커를 관리하는 함수
  const getMarkersAtSamePosition = (lat, lng) => {
    return markers.filter((marker) => marker.lat === lat && marker.lng === lng);
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
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
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => setSelectedMarker({ lat: marker.lat, lng: marker.lng })} // 마커 클릭 시 InfoWindow에 마커 정보 표시
          />
        ))}

        {/* 마커들을 순서대로 연결하는 Polyline */}
        {markers.length > 1 && (
          <Polyline
            path={markers.map((marker) => ({ lat: marker.lat, lng: marker.lng }))} // 마커들의 위치를 순서대로 연결
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
                    onClick={() => deleteMarker(markers.indexOf(marker))} // 마커 삭제 버튼
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
  <div style={{ display: 'flex', alignItems: 'center' }}>
    {markers.map((marker, index) => (
      <div key={index} style={{ margin: '0 10px', textAlign: 'center' }}>
        <div>
          <strong>{marker.order}. {marker.info}</strong>
        </div>
        <button
          style={{
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            padding: '5px',
            cursor: 'pointer',
            marginTop: '5px',
          }}
          onClick={() => deleteMarker(index)}
        >
          X
        </button>
      </div>
    ))}
  </div>
</div>

    </LoadScript>
  );
};

Map.propTypes = {
  onAddLocation: PropTypes.func.isRequired,
};

export default Map;
