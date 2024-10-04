import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // PropTypes로 props 검증

// 장소별 콘텐츠 추가 컴포넌트
const Contents = ({ selectedMarker, content, onSaveContent }) => {
  const [title, setTitle] = useState(content?.title || ''); // 소제목 상태
  const [text, setText] = useState(content?.text || ''); // 장소 설명 텍스트 상태
  const [images, setImages] = useState(content?.images || []); // 이미지 배열 상태

  console.log('Contents에 전달된 selectedMarker:', selectedMarker);
  console.log('Contents에 전달된 content:', content)

  // 마커의 order 값이 변경될 때마다 콘텐츠 상태를 초기화
  useEffect(() => {
    if (selectedMarker) {
      setTitle(content.title || ''); // 소제목 초기화
      setText(content.text || '');
      setImages(content.images || []);
    }
  }, [content, selectedMarker]); // content, selectedMarker, thumbnailIndex에 따라 상태 업데이트

  // 이미지 업로드 처리 함수
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.slice(0, 10 - images.length); // 최대 10개의 이미지만 허용
    setImages((prevImages) => [...prevImages, ...newImages]); // 새 이미지를 기존 이미지에 추가
  };

  // 이미지 삭제 처리 함수
  const handleImageDelete = (index) => {
    const updatedImages = images.filter((_, i) => i !== index); // 선택한 이미지 삭제
    setImages(updatedImages);
  };

  // 콘텐츠 저장 함수 (텍스트와 이미지 저장)
  const handleSave = () => {
    onSaveContent({
      title,
      text,
      images,
    });
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', marginTop: '20px', borderRadius: '10px' }}>
      <h3>{selectedMarker.info} - 장소 정보 추가</h3>

      {/* 소제목 입력 UI */}
      <div>
        <label htmlFor="title">소제목:</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="소제목을 입력하세요"
          style={{ width: '100%', marginTop: '10px', padding: '10px' }}
        />
      </div>

      {/* 이미지 업로드 UI */}
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="image">이미지 업로드 (최대 10개):</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          disabled={images.length >= 10} // 이미지가 10개 이상이면 비활성화
        />
        {images.length >= 10 && (
          <p style={{ color: 'red', marginTop: '5px' }}>이미지는 최대 10개까지 업로드할 수 있습니다.</p>
        )}
      </div>

      {/* 업로드된 이미지 미리보기 및 삭제 */}
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

      {/* 장소 설명 입력 */}
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
      title: PropTypes.string, // 소제목
      text: PropTypes.string, // 텍스트 콘텐츠
      images: PropTypes.arrayOf(PropTypes.any), // 이미지 배열
    }),
    onSaveContent: PropTypes.func.isRequired, // 콘텐츠 저장 함수
};

export default Contents;