import axios from 'axios';

const API_URL = 'http://localhost:8080/comment';

const createComment = async (accessToken, postId, userId, content) => {
    return axios.post(API_URL, null, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { postId, userId, content }
    });
};

const deleteComment = async (accessToken, commentId) => {
    return axios.delete(`${API_URL}/${commentId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
};

const getCommentsByPostId = async (accessToken, postId) => {
    return axios.get(`${API_URL}/post/${postId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
};

export { createComment, deleteComment, getCommentsByPostId };