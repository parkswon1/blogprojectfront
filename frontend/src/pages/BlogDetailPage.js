import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBlogByBlogId } from '../services/blogService';
import { likeBlog, unlikeBlog } from '../services/likeService';
import { fetchImage } from '../services/imageService'; 
import '../styles/BlogDetailPage.css';

const BlogDetailPage = ({ tokens, userId }) => {
    const { blogId } = useParams();
    const [blog, setBlog] = useState(null);
    const [liked, setLiked] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await getBlogByBlogId(tokens.accessToken, blogId);
                setBlog(response.data);
                if (response.data.image && response.data.image.url) {
                    const url = await fetchImage(tokens.accessToken, response.data.image.url); // 이미지 URL 설정
                    setImageUrl(url);
                }
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchBlog();
    }, [tokens.accessToken, blogId]);

    const handleLike = async () => {
        try {
            await likeBlog(tokens.accessToken, userId, blogId);
            setLiked(true);
        } catch (error) {
            console.error(error.response?.data?.error || error.message);
        }
    };

    const handleUnlike = async () => {
        try {
            await unlikeBlog(tokens.accessToken, userId, blogId);
            setLiked(false);
        } catch (error) {
            console.error(error.response?.data?.error || error.message);
        }
    };

    if (!blog) return <div>Loading...</div>;

    return (
        <div>
            <h1>{blog.title}</h1>
            <p>{blog.text}</p>
            {imageUrl && <img src={imageUrl} alt={blog.title} />} {/* 이미지 URL 사용 */}
            <small>Views: {blog.views}</small>
            {liked ? (
                <button onClick={handleUnlike}>Unlike</button>
            ) : (
                <button onClick={handleLike}>Like</button>
            )}
        </div>
    );
};

export default BlogDetailPage;