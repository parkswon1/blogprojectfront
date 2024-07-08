import axios from 'axios';

const API_URL = 'http://localhost:8080/auth'; // 서버의 실제 URL로 변경하세요

const register = async (registerRequest) => {
    return axios.post(`${API_URL}/register`, registerRequest);
};

const login = async (loginRequest) => {
    return axios.post(`${API_URL}/login`, loginRequest);
};

const logout = async (accessToken) => {
    return axios.post(`${API_URL}/logout`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
};

const refreshAccessToken = async (refreshToken) => {
    return axios.post(`${API_URL}/refresh`, {}, {
        headers: { Authorization: `Bearer ${refreshToken}` }
    });
};

export { register, login, logout, refreshAccessToken };