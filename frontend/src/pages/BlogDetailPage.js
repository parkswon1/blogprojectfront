import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBlogByBlogId } from '../services/blogService';
import { likeBlog, unlikeBlog } from '../services/likeService';
import '../styles/BlogDetailPage.css';

const BlogDetailPage = ({ tokens, userId }) => {
    const { blogId } = useParams();
    const [blog, setBlog] = useState(null);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await getBlogByBlogId(tokens.accessToken, blogId);
                setBlog(response.data);
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
            {blog.imageUrl && <img src={blog.imageUrl} alt={blog.title} />}
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