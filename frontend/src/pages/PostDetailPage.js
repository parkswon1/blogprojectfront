import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPostById } from '../services/postService';
import { likePost, unlikePost } from '../services/likeService';
import defaultImage from '../assets/logo192.png';

const PostDetailPage = ({ tokens, userId }) => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await getPostById(tokens.accessToken, postId);
                setPost(response.data);
            } catch (error) {
                console.error(error.response?.data?.error || error.message);
            }
        };
        fetchPost();
    }, [tokens.accessToken, postId]);

    const handleLike = async () => {
        try {
            await likePost(tokens.accessToken, userId, postId);
            setLiked(true);
        } catch (error) {
            console.error(error.response?.data?.error || error.message);
        }
    };

    const handleUnlike = async () => {
        try {
            await unlikePost(tokens.accessToken, userId, postId);
            setLiked(false);
        } catch (error) {
            console.error(error.response?.data?.error || error.message);
        }
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{post.title}</h2>
            <img src={post.image ? `http://localhost:8080${post.image.url}` : defaultImage} alt={post.title} />
            <p>{post.content}</p>
            <p>Views: {post.views}</p>
            <p>Category: {post.category.name}</p>
            <p>Tags: {post.postTags.map(tag => tag.name).join(', ')}</p>
            <p>Created at: {new Date(post.createdAt).toLocaleString()}</p>
            <p>Updated at: {new Date(post.updatedAt).toLocaleString()}</p>
            {liked ? (
                <button onClick={handleUnlike}>Unlike</button>
            ) : (
                <button onClick={handleLike}>Like</button>
            )}
        </div>
    );
};

export default PostDetailPage;