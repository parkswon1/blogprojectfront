import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import MyPage from './pages/MyPage';
import MainPage from './pages/MainPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { logout, refreshAccessToken } from './services/authService';
import './styles/App.css';

const App = () => {
    const [tokens, setTokens] = useState({
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken')
    });
    const [userId, setUserId] = useState(localStorage.getItem('userId'));

    const handleLogout = useCallback(async () => {
        try {
            await logout(tokens.accessToken);
        } catch (error) {
            console.error(error.response?.data?.error || error.message);
        } finally {
            setTokens({ accessToken: null, refreshToken: null });
            setUserId(null);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userId');
        }
    }, [tokens.accessToken]);

    const handleRefresh = useCallback(async () => {
        try {
            const response = await refreshAccessToken(tokens.refreshToken);
            setTokens({
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken
            });
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
        } catch (error) {
            console.error(error.response?.data?.error || error.message);
            handleLogout();
        }
    }, [tokens.refreshToken, handleLogout]);

    useEffect(() => {
        const checkAndRefreshToken = async () => {
            if (tokens.accessToken && tokens.refreshToken) {
                try {
                    const response = await refreshAccessToken(tokens.refreshToken);
                    setTokens({
                        accessToken: response.data.accessToken,
                        refreshToken: response.data.refreshToken
                    });
                    localStorage.setItem('accessToken', response.data.accessToken);
                    localStorage.setItem('refreshToken', response.data.refreshToken);
                } catch (error) {
                    console.error(error.response?.data?.error || error.message);
                    handleLogout();
                }
            }
        };
        checkAndRefreshToken();
    }, [tokens.accessToken, tokens.refreshToken, handleLogout]);

    const handleLoginSuccess = (data) => {
        setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
        setUserId(data.userId);
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('userId', data.userId);
    };

    return (
        <Router>
            <div>
                <Navbar isLoggedIn={!!tokens.accessToken} handleLogout={handleLogout} tokens={tokens} userId={userId} />
                <Routes>
                    <Route
                        path="/"
                        element={!tokens.accessToken ? <AuthForm setTokens={handleLoginSuccess} /> : <Navigate to="/main" />}
                    />
                    <Route
                        path="/main"
                        element={
                            <ProtectedRoute tokens={tokens}>
                                <MainPage handleLogout={handleLogout} handleRefresh={handleRefresh} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/mypage"
                        element={
                            <ProtectedRoute tokens={tokens}>
                                <MyPage tokens={tokens} userId={userId} handleLogout={handleLogout} handleRefresh={handleRefresh} />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;