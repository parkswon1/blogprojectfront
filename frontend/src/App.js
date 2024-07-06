import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Main from './components/Main';
import Logout from './components/auth/Logout';
import axios from 'axios';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const refreshAccessToken = async () => {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await axios.post('http://localhost:8080/auth/refresh', null, {
                        headers: {
                            'Authorization': `Bearer ${refreshToken}`,
                        },
                    });
                    localStorage.setItem('accessToken', response.data.accessToken);
                    localStorage.setItem('refreshToken', response.data.refreshToken); // 새로운 refresh token 저장
                    setIsAuthenticated(true);
                    navigate('/main'); // 토큰이 유효하면 메인 페이지로 리디렉션
                } catch (error) {
                    console.error('Failed to refresh access token', error.response.data);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    setIsAuthenticated(false);
                    navigate('/login');
                }
            } else {
                setIsAuthenticated(false);
                navigate('/login');
            }
            setLoading(false);
        };

        refreshAccessToken();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/*"
                element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                        <Routes>
                            <Route path="/main" element={<Main />} />
                            <Route path="/logout" element={<Logout />} />
                            <Route path="*" element={<Navigate to="/main" />} />
                        </Routes>
                    </PrivateRoute>
                }
            />
        </Routes>
    );
};

export default App;