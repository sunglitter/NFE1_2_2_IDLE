/**
 * 범용 드래그 핸들러
 * @param {Object} e - 마우스 다운 이벤트 객체
 * @param {Object} ref - 드래그하고자 하는 요소의 ref 객체
 * @param {Function} setDragging - 드래그 상태를 업데이트하는 함수
 */
export const handleMouseDown = (e, ref, setDragging) => {
    e.preventDefault();
  
    if (!ref) return;
  
    setDragging(false);
    const startX = e.clientX;
    const scrollLeft = ref.scrollLeft;
  
    const handleMouseMove = (moveEvent) => {
      setDragging(true);
      const dx = moveEvent.clientX - startX;
      ref.scrollLeft = scrollLeft - dx;
    };
  
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };