import { useState } from 'react';
import PropTypes from 'prop-types';

const Contents = ({ selectedMarker, content, onSaveContent }) => {
  const [text, setText] = useState(content?.text || ''); // 텍스트 상태
  const [image, setImage] = useState(content?.image || null); // 이미지 상태

  // 이미지 업로드 처리 함수
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  // 콘텐츠 저장 처리 함수
  const handleSave = () => {
    // 이미지와 텍스트를 함께 저장
    onSaveContent({
      text,
      image, // 이미지를 저장하기 위한 필드
    });
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', marginTop: '20px', borderRadius: '10px' }}>
      <h3>{selectedMarker.info} - 장소 정보 추가</h3>
      
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

      {/* 이미지 업로드 */}
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="image">이미지 업로드:</label>
        <input type="file" id="image" accept="image/*" onChange={handleImageUpload} />
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

      {/* 업로드된 이미지 미리보기 */}
      {image && (
        <div style={{ marginTop: '20px' }}>
          <h4>이미지 미리보기:</h4>
          <img
            src={URL.createObjectURL(image)}
            alt="미리보기"
            style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
          />
        </div>
      )}
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
      image: PropTypes.string, // 이미지 URL
    }),
    onSaveContent: PropTypes.func.isRequired, // 저장 함수
  };

export default Contents;
