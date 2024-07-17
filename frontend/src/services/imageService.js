import axios from 'axios';

export const fetchImage = async (accessToken, imageUrl) => {
    const fullImageUrl = `http://localhost:8080${imageUrl}`;
    const imgBlob = await axios.get(fullImageUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: 'blob'
    });
    return URL.createObjectURL(imgBlob.data);
};