import './PostHeader.css'
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostHeader = ({ post, user, isLoggedIn }) => {
    const navigate = useNavigate();

    console.log("User ID:", user._id);
  console.log("Post author ID:", post.author._id);


    // userId와 post.author._id를 비교하여 작성자인지 확인
    const isAuthor = isLoggedIn && user._id === post.author._id;

    const handleEdit = () => {
        navigate(`/edit-post/${post._id}`);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/posts/delete`, {
                    data: { id: post._id },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                navigate('/'); // 삭제 후 메인 페이지로 이동
            } catch (error) {
                console.error('Failed to delete post', error);
            }
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard');
    };

    return (
        <div className="post-header">
            <h1>{post.title}</h1>
            {isAuthor ? (
                <div className="author-controls">
                    <button onClick={handleEdit}>Edit</button>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            ) : (
                <button onClick={handleShare}>Share</button>
            )}
        </div>
    );
};

PostHeader.propTypes = {
    post: PropTypes.shape({
        _id: PropTypes.string.isRequired, 
        title: PropTypes.string.isRequired,
        author: PropTypes.shape({
            _id: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    user: PropTypes.shape({  // user 객체가 전달되는지 검증
        _id: PropTypes.string.isRequired,  // user 객체 안의 _id가 있는지 확인
        fullName: PropTypes.string,  // 선택적 필드, 필요에 따라 추가
        email: PropTypes.string,  // 선택적 필드, 필요에 따라 추가
    }).isRequired,  // user 자체는 필수
    isLoggedIn: PropTypes.bool.isRequired,  // 로그인 여부를 boolean으로 확인
};


export default PostHeader;
