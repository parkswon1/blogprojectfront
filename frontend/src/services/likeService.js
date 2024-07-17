import axios from 'axios';

const API_URL = 'http://localhost:8080/image';

const likePost = async (accessToken, userId, postId) => {
    return axios.post(`${API_URL}/post`, null, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { userId, postId }
    });
};

const unlikePost = async (accessToken, userId, postId) => {
    return axios.delete(`${API_URL}/post`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { userId, postId }
    });
};

const likeBlog = async (accessToken, userId, blogId) => {
    return axios.post(`${API_URL}/blog`, null, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { userId, blogId }
    });
};

const unlikeBlog = async (accessToken, userId, blogId) => {
    return axios.delete(`${API_URL}/blog`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { userId, blogId }
    });
};

const getAllLikes = async (accessToken, userId) => {
    return axios.get(`${API_URL}/user/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
};

export { likePost, unlikePost, likeBlog, unlikeBlog, getAllLikes };