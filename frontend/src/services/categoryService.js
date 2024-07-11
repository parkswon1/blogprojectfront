import axios from 'axios';

const API_URL = 'http://localhost:8080/categories';

const createCategory = async (accessToken, name, parentId = null) => {
    const params = parentId ? { name, parentId } : { name };
    return axios.post(API_URL, null, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params
    });
};

const getCategoryById = async (accessToken, id) => {
    return axios.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
};

const getAllCategories = async (accessToken) => {
    return axios.get(API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
};

const getSubCategories = async (accessToken, parentId) => {
    return axios.get(`${API_URL}/${parentId}/subcategories`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
};

const deleteCategory = async (accessToken, id) => {
    return axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
};

export { createCategory, getCategoryById, getAllCategories, getSubCategories, deleteCategory };