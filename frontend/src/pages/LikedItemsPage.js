import React, { useState, useEffect } from 'react';
import { getAllLikes } from '../services/likeService';
import { fetchImage } from '../services/imageService';
import { Link } from 'react-router-dom';
import defaultImage from '../assets/logo192.png';
import '../styles/LikedItemsPage.css';

const LikedItemsPage = ({ tokens, userId }) => {
    const [likes, setLikes] = useState([]);
    const [postImages, setPostImages] = useState({});
    const [blogImages, setBlogImages] = useState({});

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

    useEffect(() => {
        const fetchPostImages = async () => {
            const images = {};
            for (const like of likes.filter(like => like.post && like.post.image)) {
                try {
                    const imageUrl = await fetchImage(tokens.accessToken, like.post.image.url);
                    images[like.post.id] = imageUrl;
                } catch (error) {
                    console.error(error.message);
                }
            }
            setPostImages(images);
        };

        const fetchBlogImages = async () => {
            const images = {};
            for (const like of likes.filter(like => like.blog && like.blog.image)) {
                try {
                    const imageUrl = await fetchImage(tokens.accessToken, like.blog.image.url);
                    images[like.blog.id] = imageUrl;
                } catch (error) {
                    console.error(error.message);
                }
            }
            setBlogImages(images);
        };

        fetchPostImages();
        fetchBlogImages();
    }, [likes, tokens.accessToken]);

    const likedPosts = likes.filter(like => like.post);
    const likedBlogs = likes.filter(like => like.blog);

    return (
        <div className="liked-items-page">
            <h2>Liked Items</h2>
            <h3>Liked Posts</h3>
            <ul className="liked-items-list">
                {likedPosts.map(like => (
                    <li key={like.id}>
                        <Link to={`/post/${like.post.id}`}>
                            <img
                                src={postImages[like.post.id] || defaultImage}
                                alt={like.post.title}
                                width="50"
                                height="50"
                            />
                            <span>{like.post.title}</span>
                        </Link>
                    </li>
                ))}
            </ul>
            <h3>Liked Blogs</h3>
            <ul className="liked-items-list">
                {likedBlogs.map(like => (
                    <li key={like.id}>
                        <Link to={`/blog/${like.blog.id}`}>
                            <img
                                src={blogImages[like.blog.id] || defaultImage}
                                alt={like.blog.title}
                                width="50"
                                height="50"
                            />
                            <span>{like.blog.title}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LikedItemsPage;