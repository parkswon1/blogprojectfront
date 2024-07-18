import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getBlogsList } from '../services/blogService';
import { fetchImage } from '../services/imageService';
import '../styles/AllBlogsPage.css';
import defaultImage from '../assets/logo192.png';

const AllBlogsPage = ({ tokens }) => {
    const [blogs, setBlogs] = useState([]);
    const [sortOrder, setSortOrder] = useState('createdAt');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await getBlogsList(tokens.accessToken, page, size);
                const blogsWithImages = await Promise.all(
                    response.data.content.map(async blog => {
                        if (blog.image) {
                            const imageUrl = await fetchImage(tokens.accessToken, blog.image.url);
                            return { ...blog, imageUrl };
                        }
                        return { ...blog, imageUrl: defaultImage };
                    })
                );
                setBlogs(blogsWithImages);
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchBlogs();
    }, [tokens.accessToken, page, size]);

    const sortedBlogs = useMemo(() => {
        const sorted = [...blogs];
        sorted.sort((a, b) => {
            if (sortOrder === 'title') {
                return a.title.localeCompare(b.title);
            } else if (sortOrder === 'views') {
                return b.views - a.views;
            } else if (sortOrder === 'updatedAt') {
                return new Date(b.updatedAt) - new Date(a.updatedAt);
            } else {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });
        return sorted;
    }, [blogs, sortOrder]);

    return (
        <div className="all-blogs-page">
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
                {sortedBlogs.map(blog => (
                    <div key={blog.id} className="blog-item">
                        <Link to={`/blog/${blog.id}`}>
                            <img 
                                src={blog.imageUrl} 
                                alt={blog.title} 
                            />
                            <h2>{blog.title}</h2>
                        </Link>
                        <p>{blog.description}</p>
                        <small>Views: {blog.views}</small>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllBlogsPage;