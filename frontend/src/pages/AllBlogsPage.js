import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogsList } from '../services/blogService';
import '../styles/AllBlogsPage.css';

const AllBlogsPage = ({ tokens }) => {
    const [blogs, setBlogs] = useState([]);
    const [sortOrder, setSortOrder] = useState('createdAt');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await getBlogsList(tokens.accessToken, page, size, sortOrder);
                setBlogs(response.data.content);
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchBlogs();
    }, [tokens.accessToken, page, size, sortOrder]);

    return (
        <div>
            <h1>All Blogs</h1>
            <div className="sort-options">
                <label>Sort By: </label>
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="createdAt">Creation Time</option>
                    <option value="updatedAt">Update Time</option>
                    <option value="title">Title</option>
                    <option value="views">Views</option>
                </select>
            </div>
            <div className="blogs-list">
                {blogs.map(blog => (
                    <div key={blog.id} className="blog-item">
                        <Link to={`/blog/${blog.id}`}>
                            <h2>{blog.title}</h2>
                        </Link>
                        <p>{blog.text}</p>
                        <small>Views: {blog.views}</small>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllBlogsPage;