import './PostContent.css';
import { useState, useEffect } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import PropTypes from 'prop-types';
import axios from 'axios';

const PostContent = ({ location, postId }) => {
    const [likes, setLikes] = useState(location.likes || 0);
    const [hasLiked, setHasLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [showComments, setShowComments] = useState(false);
    const token = localStorage.getItem('token'); // 토큰 가져오기

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(
                    `https://kdt.frontend.5th.programmers.co.kr:5008/comments/${postId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setComments(response.data);
            } catch (error) {
                console.error('Failed to fetch comments', error);
            }
        };
        fetchComments();
    }, [postId, token]);

    const handleLike = async () => {
        try {
            if (!hasLiked) {
                await axios.post(
                    `https://kdt.frontend.5th.programmers.co.kr:5008/likes/create`,
                    { postId },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setLikes(likes + 1);
            } else {
                await axios.delete(
                    `https://kdt.frontend.5th.programmers.co.kr:5008/likes/delete`,
                    {
                        data: { postId },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setLikes(likes - 1);
            }
            setHasLiked(!hasLiked);
        } catch (error) {
            console.error('Failed to toggle like', error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim().length > 300) {
            alert('Comment must be 300 characters or less');
            return;
        }
        try {
            const response = await axios.post(
                `https://kdt.frontend.5th.programmers.co.kr:5008/comments/create`,
                {
                    comment: newComment,
                    postId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setComments([...comments, response.data]);
            setNewComment('');
        } catch (error) {
            console.error('Failed to post comment', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(
                `https://kdt.frontend.5th.programmers.co.kr:5008/comments/delete`,
                {
                    data: { id: commentId },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setComments(comments.filter((comment) => comment._id !== commentId));
        } catch (error) {
            console.error('Failed to delete comment', error);
        }
    };

    return (
        <div className="post-content">
            <div className="content-header">
                <h2>{location.name}</h2>
                <h3>{location.description}</h3>
            </div>
            {location.photos.length > 0 ? (
                <Splide>
                    {location.photos.map((photo) => (
                        <SplideSlide key={photo._id}>
                            <img src={photo.url} alt={location.name} />
                        </SplideSlide>
                    ))}
                </Splide>
            ) : (
                <div className="content-desc">
                    <p>{location.description}</p>
                </div>
            )}
            <div className="content-community">
                <button onClick={handleLike}>
                    {hasLiked ? '❤️' : '♡'} {likes}
                </button>
                <button onClick={() => setShowComments(!showComments)}>
                    💬 {comments.length}
                </button>
            </div>

            {showComments && (
                <div className="comments-section">
                    {comments.map((comment) => (
                        <div key={comment._id} className="comment">
                            <img src={comment.author.profileImage} alt={comment.author.fullName} />
                            <div>
                                <p>{comment.author.fullName}</p>
                                <p>{comment.comment}</p>
                            </div>
                            {localStorage.getItem('userId') === comment.author._id && (
                                <button onClick={() => handleDeleteComment(comment._id)}>🗑️</button>
                            )}
                        </div>
                    ))}
                    <form onSubmit={handleCommentSubmit}>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            maxLength={300}
                        />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            )}
        </div>
    );
};

PostContent.propTypes = {
    location: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        likes: PropTypes.number,
        photos: PropTypes.arrayOf(
            PropTypes.shape({
                _id: PropTypes.string.isRequired,
                url: PropTypes.string.isRequired,
            })
        ).isRequired,
    }).isRequired,
    postId: PropTypes.string.isRequired,
};

export default PostContent;