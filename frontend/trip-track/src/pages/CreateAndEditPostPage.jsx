import { useState } from 'react'; // React와 useState가 올바르게 import되었는지 확인

import Map from '../components/Location/Map.jsx'; // Map 컴포넌트 경로에 맞게 import

const CreateAndEditPostPage = () => {
  const [locations, setLocations] = useState([]);

  const handleAddLocation = (newLocation) => {
    setLocations([...locations, newLocation]);
  };

  return (
    <div>
      <h2>Create or Edit Post</h2>
      <Map onAddLocation={handleAddLocation} />
    </div>
  );
};

export default CreateAndEditPostPage;
