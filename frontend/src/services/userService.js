import axios from 'axios';

const API_URL = 'http://localhost:8080/user'; // 서버의 실제 URL로 변경하세요

const updateUser = async (accessToken, requestData) => {
    return axios.post(`${API_URL}/profile`, requestData, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
};

const getUser = async (accessToken, userId) => {
    return axios.get(`${API_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
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

const getProfileImage = async (accessToken, userId) => {
    return axios.get(`${API_URL}/image/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
};

const fetchProfileImage = async (accessToken, userId) => {
    try {
        const imageResponse = await getProfileImage(accessToken, userId);
        const fullImageUrl = `http://localhost:8080${imageResponse.data}`;
        const imgBlob = await axios.get(fullImageUrl, {
            headers: { Authorization: `Bearer ${accessToken}` },
            responseType: 'blob'
        });
        return URL.createObjectURL(imgBlob.data);
    } catch (error) {
        throw new Error(error.response?.data?.error || error.message);
    }
};

export { updateUser, getUser, updatePassword, updateProfileImage, getProfileImage, fetchProfileImage };