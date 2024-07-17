import axios from 'axios';

const API_URL = 'http://localhost:8080/search';

const searchAll = async (accessToken, query) => {
    return axios.get(API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { query }
    });
};

export { searchAll };