import React from 'react';
import AuthForm from '../components/AuthForm';
import '../styles/LoginPage.css';

const LoginPage = ({ setTokens }) => {
    return (
        <div className="login-page">
            <div className="login-container">
                <h1>Login Page</h1>
                <AuthForm setTokens={setTokens} />
            </div>
        </div>
    );
};

export default LoginPage;