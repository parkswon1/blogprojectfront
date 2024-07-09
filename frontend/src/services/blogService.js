import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const getBlogsList = async (accessToken, page, size, sortOrder) => {
    return axios.get(`${API_URL}/blogs`, {
        params: { page, size, sort: sortOrder },
        headers: { Authorization: `Bearer ${accessToken}` }
    });
};

export const getBlogByBlogId = async (accessToken, blogId) => {
    return axios.get(`${API_URL}/blog/${blogId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
};

export const getBlogsByUserId = async (accessToken, userId) => {
    return axios.get(`${API_URL}/blog/user/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
};

export const saveBlog = async (accessToken, title, text, file) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('text', text);
    if (file) formData.append('file', file);

    return axios.post(`${API_URL}/blog`, formData, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data'
        }
    });
};