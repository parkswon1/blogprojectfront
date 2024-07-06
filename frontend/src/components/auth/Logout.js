import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // 백엔드에서 로그아웃 처리 (선택 사항)
            await api.post('/auth/logout');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/login');
        } catch (error) {
            console.error('Failed to logout', error);
        }
    };

    return (
        <div>
            <h2>Logout</h2>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Logout;