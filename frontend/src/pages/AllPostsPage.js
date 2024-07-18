import React, { useState, useEffect, useMemo } from 'react';
import { getAllPosts } from '../services/postService';
import { fetchImage } from '../services/imageService';
import { Link } from 'react-router-dom';
import defaultImage from '../assets/logo192.png';
import '../styles/AllPostsPage.css';

const AllPostsPage = ({ tokens }) => {
    const [posts, setPosts] = useState([]);
    const [sortOrder, setSortOrder] = useState('createdAt');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await getAllPosts(tokens.accessToken);
                const postsWithImages = await Promise.all(
                    response.data.content.map(async post => {
                        if (post.image) {
                            const imageUrl = await fetchImage(tokens.accessToken, post.image.url);
                            return { ...post, imageUrl };
                        }
                        return { ...post, imageUrl: defaultImage };
                    })
                );
                setPosts(postsWithImages);
            } catch (error) {
                console.error(error.response?.data?.error || error.message);
            }
        };
        fetchPosts();
    }, [tokens.accessToken]);

    const sortedPosts = useMemo(() => {
        const sorted = [...posts];
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
    }, [posts, sortOrder]);

    return (
        <div className="all-posts-page">
            <h2>All Posts</h2>
            <div className="sort-options">
                <label>Sort By: </label>
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="createdAt">Creation Time</option>
                    <option value="updatedAt">Update Time</option>
                    <option value="title">Title</option>
                    <option value="views">Views</option>
                </select>
            </div>
            <ul className="posts-list">
                {sortedPosts.map((post) => (
                    <li key={post.id} className="post-item">
                        <Link to={`/post/${post.id}`} className="post-link">
                            <img src={post.imageUrl} alt={post.title} className="post-image" />
                            <div className="post-info">
                                <span className="post-title">{post.title}</span>
                                <span className="post-views">Views: {post.views}</span>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AllPostsPage;