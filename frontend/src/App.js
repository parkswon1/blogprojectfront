import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import MyPage from './pages/MyPage';
import MainPage from './pages/MainPage';
import AllBlogsPage from './pages/AllBlogsPage';
import MyBlogPage from './pages/MyBlogPage';
import MyPostsPage from './pages/MyPostsPage';
import AllPostsPage from './pages/AllPostsPage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import BlogDetailPage from './pages/BlogDetailPage';
import BlogEditPage from './pages/BlogEditPage';
import CategoryPage from './pages/CategoryPage';
import LikedItemsPage from './pages/LikedItemsPage';
import SearchResultsPage from './pages/SearchResultsPage'; // 검색 결과 페이지 추가
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
                    <Route
                        path="/blogs"
                        element={<AllBlogsPage tokens={tokens} />}
                    />
                    <Route
                        path="/blog/:blogId"
                        element={<BlogDetailPage tokens={tokens} userId={userId} />}
                    />
                    <Route
                        path="/blog/edit/:blogId"
                        element={
                            <ProtectedRoute tokens={tokens}>
                                <BlogEditPage tokens={tokens} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/myblogs"
                        element={
                            <ProtectedRoute tokens={tokens}>
                                <MyBlogPage tokens={tokens} userId={userId} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/myposts"
                        element={
                            <ProtectedRoute tokens={tokens}>
                                <MyPostsPage tokens={tokens} userId={userId} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/posts"
                        element={<AllPostsPage tokens={tokens} />}
                    />
                    <Route
                        path="/post/:postId"
                        element={<PostDetailPage tokens={tokens} userId={userId} />}
                    />
                    <Route
                        path="/create-post"
                        element={
                            <ProtectedRoute tokens={tokens}>
                                <CreatePostPage tokens={tokens} userId={userId} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/categories"
                        element={
                            <ProtectedRoute tokens={tokens}>
                                <CategoryPage tokens={tokens} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/liked-items"
                        element={
                            <ProtectedRoute tokens={tokens}>
                                <LikedItemsPage tokens={tokens} userId={userId} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/search"
                        element={
                            <ProtectedRoute tokens={tokens}>
                                <SearchResultsPage tokens={tokens} />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;