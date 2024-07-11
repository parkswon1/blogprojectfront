import React, { useState, useEffect } from 'react';
import { getAllPosts } from '../services/postService';
import { Link } from 'react-router-dom';
import defaultImage from '../assets/logo192.png';

const AllPostsPage = ({ tokens }) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await getAllPosts(tokens.accessToken);
                setPosts(response.data.content);
            } catch (error) {
                console.error(error.response?.data?.error || error.message);
            }
        };
        fetchPosts();
    }, [tokens.accessToken]);

    return (
        <div>
            <h2>All Posts</h2>
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        <Link to={`/post/${post.id}`}>
                            <img src={post.image ? `http://localhost:8080${post.image.url}` : defaultImage} alt={post.title} width="50" height="50" />
                            <span>{post.title}</span>
                            <span>Views: {post.views}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AllPostsPage;