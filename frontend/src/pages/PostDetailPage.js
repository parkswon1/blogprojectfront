import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPostById } from '../services/postService';
import { fetchImage } from '../services/imageService';
import { getCommentsByPostId, createComment, deleteComment } from '../services/commentService'; // 댓글 서비스 추가
import { likePost, unlikePost } from '../services/likeService';
import defaultImage from '../assets/logo192.png';

const PostDetailPage = ({ tokens, userId }) => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await getPostById(tokens.accessToken, postId);
                setPost(response.data);
                if (response.data.image && response.data.image.url) {
                    const url = await fetchImage(tokens.accessToken, response.data.image.url); // 이미지 URL 설정
                    setImageUrl(url);
                }
            } catch (error) {
                console.error(error.response?.data?.error || error.message);
            }
        };
        fetchPost();
    }, [tokens.accessToken, postId]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await getCommentsByPostId(tokens.accessToken, postId);
                setComments(response.data);
            } catch (error) {
                console.error(error.response?.data?.error || error.message);
            }
        };
        fetchComments();
    }, [tokens.accessToken, postId]);

    const handleCreateComment = async () => {
        try {
            const response = await createComment(tokens.accessToken, postId, userId, newComment);
            setComments([...comments, response.data]);
            setNewComment('');
        } catch (error) {
            console.error(error.response?.data?.error || error.message);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(tokens.accessToken, commentId);
            setComments(comments.filter(comment => comment.id !== commentId));
        } catch (error) {
            console.error(error.response?.data?.error || error.message);
        }
    };

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
            <img src={imageUrl || defaultImage} alt={post.title} />
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

            {/* 댓글 작성 폼 */}
            <div>
                <h3>Comments</h3>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                />
                <button onClick={handleCreateComment}>Submit</button>
            </div>

{/* 댓글 목록 */}
<ul>
    {comments.map(comment => (
        <li key={comment.id}>
            <p>{comment.content}</p>
            <small>By {comment.user.name} at {new Date(comment.createdAt).toLocaleString()}</small>
            {comment.user.id == userId ? (
                <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
            ) : null}
        </li>
    ))}
</ul>
        </div>
    );
};

export default PostDetailPage;