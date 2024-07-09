import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBlogByBlogId } from '../services/blogService';
import '../styles/BlogDetailPage.css';

const BlogDetailPage = ({ tokens }) => {
    const { blogId } = useParams();
    const [blog, setBlog] = useState(null);

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

    if (!blog) return <div>Loading...</div>;

    return (
        <div>
            <h1>{blog.title}</h1>
            <p>{blog.text}</p>
            {blog.imageUrl && <img src={blog.imageUrl} alt={blog.title} />}
            <small>Views: {blog.views}</small>
        </div>
    );
};

export default BlogDetailPage;