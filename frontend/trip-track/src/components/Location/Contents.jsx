import { useState } from 'react';
import { FaCrown } from 'react-icons/fa'; // 왕관 아이콘을 사용하기 위한 임포트
import PropTypes from 'prop-types';

const Contents = ({ selectedMarker, content, onSaveContent }) => {
  const [text, setText] = useState(content?.text || ''); // 텍스트 상태
  const [images, setImages] = useState(content?.images || []); // 이미지 배열 상태 (최대 10개)
  const [thumbnailIndex, setThumbnailIndex] = useState(content?.thumbnailIndex || null); // 썸네일로 지정된 이미지 인덱스

  // 이미지 업로드 처리 함수 (최대 10개까지 업로드 가능)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.slice(0, 10 - images.length); // 최대 10개의 이미지만 허용
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

   // 이미지 삭제 처리 함수
  const handleImageDelete = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);

    // 삭제된 이미지가 썸네일로 지정되어 있으면 썸네일 상태 초기화
    if (thumbnailIndex === index) {
      setThumbnailIndex(null);
    }

    setImages(updatedImages);
  };

  // 썸네일 이미지 지정 함수
  const handleSetThumbnail = (index) => {
    setThumbnailIndex(index); // 선택된 이미지를 썸네일로 지정
  };

  // 콘텐츠 저장 처리 함수
  const handleSave = () => {
    // 이미지와 텍스트를 함께 저장
    onSaveContent({
      text,
      images, // 이미지를 저장하기 위한 필드
      thumbnailIndex, // 썸네일로 지정된 이미지 인덱스
    });
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', marginTop: '20px', borderRadius: '10px' }}>
      <h3>{selectedMarker.info} - 장소 정보 추가</h3>

       {/* 이미지 업로드 */}
       <div style={{ marginTop: '20px' }}>
        <label htmlFor="image">이미지 업로드 (최대 10개):</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          disabled={images.length >= 10} // 이미지가 10개 이상이면 업로드 비활성화
        />
        {images.length >= 10 && (
          <p style={{ color: 'red', marginTop: '5px' }}>이미지는 최대 10개까지 업로드할 수 있습니다.</p>
        )}
      </div>

      {/* 업로드된 이미지 미리보기 및 삭제 버튼 */}
      {images.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4>이미지 미리보기:</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
            {images.map((image, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <img
                  src={URL.createObjectURL(image)}
                  alt="미리보기"
                  style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '5px' }}
                />
                 {/* 왕관 아이콘 (썸네일 설정) */}
                 <button
                  onClick={() => handleSetThumbnail(index)}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    left: '5px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <FaCrown
                    size={24}
                    color={thumbnailIndex === index ? 'gold' : 'gray'} // 선택된 썸네일은 금색, 나머지는 회색
                  />
                </button>
                {/* 삭제 버튼 */}
                <button
                  onClick={() => handleImageDelete(index)}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    backgroundColor: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    padding: '5px',
                    width: '25px',
                    height: '25px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 텍스트 입력 */}
      <div>
        <label htmlFor="text">장소 설명:</label>
        <textarea
          id="text"
          rows="4"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: '100%', marginTop: '10px', padding: '10px' }}
        />
      </div>

      {/* 저장 버튼 */}
      <button
        onClick={handleSave}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        저장
      </button>

    </div>
  );
};

// PropTypes로 props 검증
Contents.propTypes = {
    selectedMarker: PropTypes.shape({
      info: PropTypes.string.isRequired, // 마커 정보
    }).isRequired,
    content: PropTypes.shape({
      text: PropTypes.string, // 텍스트 콘텐츠
      images: PropTypes.arrayOf(PropTypes.any), // 이미지 배열
      thumbnailIndex: PropTypes.number, // 썸네일로 지정된 이미지 인덱스
    }),
    onSaveContent: PropTypes.func.isRequired, // 저장 함수
  };

export default Contents;
