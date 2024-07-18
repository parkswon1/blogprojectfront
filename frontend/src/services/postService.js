import axios from 'axios';

const API_URL = 'http://localhost:8080/posts';

const createPost = async (accessToken, userId, postData) => {
    return axios.post(`${API_URL}/${userId}`, postData, {
        headers: { 
            Authorization: `Bearer ${accessToken}`
        }
    });
};

const getPostById = async (accessToken, postId) => {
    return axios.get(`${API_URL}/${postId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
};

const updatePost = async (accessToken, postId, postRequest) => {
    return axios.put(`${API_URL}/${postId}`, postRequest, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
};

const deletePost = async (accessToken, postId) => {
    return axios.delete(`${API_URL}/${postId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
};

const getAllPosts = async (accessToken, page = 0, size = 10) => {
    return axios.get(API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { page, size }
    });
};

const getPostsByBlogId = async (accessToken, blogId, page = 0, size = 10) => {
    return axios.get(`${API_URL}/blog/${blogId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { page, size }
    });
};

export { createPost, getPostById, updatePost, deletePost, getAllPosts, getPostsByBlogId };