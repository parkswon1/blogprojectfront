import axios from 'axios';

const API_URL = 'http://localhost:8080/user'; // 서버의 실제 URL로 변경하세요

const updateUser = async (accessToken, requestData) => {
    return axios.post(`${API_URL}/profile`, requestData, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
};

const getUser = async (userId) => {
    return axios.get(`${API_URL}/${userId}`);
};

const updatePassword = async (accessToken, requestData) => {
    return axios.post(`${API_URL}/password`, requestData, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
};

const updateProfileImage = async (accessToken, imageFile) => {
    const formData = new FormData();
    formData.append('imageFile', imageFile);
    return axios.post(`${API_URL}/image`, formData, {
        headers: { 
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data'
        }
    });
};

const getProfileImage = async (userId) => {
    return axios.get(`${API_URL}/image/${userId}`);
};

export { updateUser, getUser, updatePassword, updateProfileImage, getProfileImage };