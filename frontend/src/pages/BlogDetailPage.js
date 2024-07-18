import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogByBlogId } from '../services/blogService';
import { getPostsByBlogId } from '../services/postService';
import { likeBlog, unlikeBlog, getAllLikes } from '../services/likeService';
import { fetchImage } from '../services/imageService'; 
import '../styles/BlogDetailPage.css';
import defaultImage from '../assets/logo192.png';

const BlogDetailPage = ({ tokens, userId }) => {
    const { blogId } = useParams();
    const [blog, setBlog] = useState(null);
    const [posts, setPosts] = useState([]);
    const [liked, setLiked] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await getBlogByBlogId(tokens.accessToken, blogId);
                setBlog(response.data);
                if (response.data.image && response.data.image.url) {
                    const url = await fetchImage(tokens.accessToken, response.data.image.url);
                    setImageUrl(url);
                }
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchBlog();
    }, [tokens.accessToken, blogId]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await getPostsByBlogId(tokens.accessToken, blogId);
                setPosts(response.data.content);
            } catch (error) {
                console.error(error.response?.data?.error || error.message);
            }
        };
        fetchPosts();
    }, [tokens.accessToken, blogId]);

    useEffect(() => {
        const checkIfLiked = async () => {
            try {
                const response = await getAllLikes(tokens.accessToken, userId);
                const likes = response.data;
                const likedBlog = likes.some(like => like.blog && like.blog.id === parseInt(blogId, 10));
                setLiked(likedBlog);
            } catch (error) {
                console.error(error.response?.data?.error || error.message);
            }
        };
        checkIfLiked();
    }, [tokens.accessToken, userId, blogId]);

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
        <div className="blog-detail-page">
            <h1>{blog.title}</h1>
            <p>{blog.description}</p>
            {imageUrl ? (
                <img src={imageUrl} alt={blog.title} className="blog-image" />
            ) : (
                <img src={defaultImage} alt="default" className="blog-image" />
            )}
            <small>Views: {blog.views}</small>
            <div className="like-button">
                {liked ? (
                    <button onClick={handleUnlike}>Unlike</button>
                ) : (
                    <button onClick={handleLike}>Like</button>
                )}
            </div>
            <h2>Posts</h2>
            <ul className="posts-list">
                {posts.map(post => (
                    <li key={post.id} className="post-item">
                        <Link to={`/post/${post.id}`} className="post-link">
                            <span>{post.title}</span>
                            <small>Views: {post.views}</small>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BlogDetailPage;