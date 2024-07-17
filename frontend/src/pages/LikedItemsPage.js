import React, { useState, useEffect } from 'react';
import { getAllLikes } from '../services/likeService';
import { Link } from 'react-router-dom';
import defaultImage from '../assets/logo192.png';

const LikedItemsPage = ({ tokens, userId }) => {
    const [likes, setLikes] = useState([]);

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const response = await getAllLikes(tokens.accessToken, userId);
                setLikes(response.data);
            } catch (error) {
                console.error(error.response?.data?.error || error.message);
            }
        };
        fetchLikes();
    }, [tokens.accessToken, userId]);

    const likedPosts = likes.filter(like => like.post);
    const likedBlogs = likes.filter(like => like.blog);

    return (
        <div>
            <h2>Liked Items</h2>
            <h3>Liked Posts</h3>
            <ul>
                {likedPosts.map(like => (
                    <li key={like.id}>
                        <Link to={`/post/${like.post.id}`}>
                            <img src={like.post.image ? `http://localhost:8080${like.post.image.url}` : defaultImage} alt={like.post.title} width="50" height="50" />
                            <span>{like.post.title}</span>
                        </Link>
                    </li>
                ))}
            </ul>
            <h3>Liked Blogs</h3>
            <ul>
                {likedBlogs.map(like => (
                    <li key={like.id}>
                        <Link to={`/blog/${like.blog.id}`}>
                            <img src={like.blog.image ? `http://localhost:8080${like.blog.image.url}` : defaultImage} alt={like.blog.title} width="50" height="50" />
                            <span>{like.blog.title}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LikedItemsPage;