import NavBar from '../Common/HeaderBeforeSignIn.jsx'

const MainBeforeSignIn = () => {
    //   const [posts, setPosts] = useState([]);
    //   const [searchTerm, setSearchTerm] = useState('');
    //   const [filter, setFilter] = useState('New'); // 기본 필터를 'New'로 설정
    //   const [trendingPeriod, setTrendingPeriod] = useState('이번 주'); // Trending 기간을 설정
    //   const [isLoading, setIsLoading] = useState(true);
    
    //   // 필터 또는 기간 변경 시 포스트 목록을 불러오는 함수
    //   useEffect(() => {
    //     const loadPosts = async () => {
    //       setIsLoading(true);
    //       const fetchedPosts = await fetchPosts(filter, trendingPeriod);
    //       setPosts(fetchedPosts);
    //       setIsLoading(false);
    //     };
    
    //     loadPosts();
    //   }, [filter, trendingPeriod]);
    
    //   const handleSearchChange = (e) => {
    //     setSearchTerm(e.target.value);
    //   };
    
    //   const handleFilterChange = (newFilter) => {
    //     setFilter(newFilter);
    //     if (newFilter !== 'Trending') {
    //       setTrendingPeriod(''); // 'New' 선택 시 기간 필터를 초기화
    //     }
    //   };
    
    //   const handleTrendingPeriodChange = (newPeriod) => {
    //     setTrendingPeriod(newPeriod);
    //   };
    
    return (
      <div>
      {/* Header를 가장 상단에 배치 */}
      <NavBar />
      
      <main>
      
        {/* 추가적인 콘텐츠를 여기에 배치 */}
      </main>
    </div>
    
       );
     };
    
    export default MainBeforeSignIn
    