import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "./PostCard";
import './PostLists.css'; // CSS 파일 추가

const PostLists = ({ userId, filter, searchQuery }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setPosts([]); // 기존 포스트 초기화

        let fetchedPosts = [];

        // 작성한 포스트 가져오기
        if (filter === "My Posts") {
          const response = await axios.get(
            `https://kdt.frontend.5th.programmers.co.kr:5008/posts/author/${userId}`
          );
          fetchedPosts = response.data;
        } else {
          // 사용자 정보 가져오기
          const userResponse = await axios.get(
            `https://kdt.frontend.5th.programmers.co.kr:5008/users/${userId}`
          );
          const user = userResponse.data;

          // 좋아요한 포스트 가져오기
          if (filter === "Likes") {
            fetchedPosts = await Promise.all(
              user.likes.map(async (like) => {
                const postResponse = await axios.get(
                  `https://kdt.frontend.5th.programmers.co.kr:5008/posts/${like.post}`
                );
                return postResponse.data;
              })
            );
          }
        }

        // 중복된 포스트 제거 (post._id 기준)
        const uniquePosts = fetchedPosts.filter(
          (post, index, self) =>
            index === self.findIndex((p) => p._id === post._id)
        );

        // 검색어에 따라 포스트 필터링
        let filteredPosts = uniquePosts;
        if (searchQuery) {
          filteredPosts = filteredPosts.filter((post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        setPosts(filteredPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [userId, filter, searchQuery]);

  return (
    <div className="post-grid"> {/* 그리드 컨테이너 추가 */}
      {posts.map((post) => (
        <div key={post._id}>
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
};

export default PostLists;
