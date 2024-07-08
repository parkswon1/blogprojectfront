import React from 'react';
import AuthForm from '../components/AuthForm';

const LoginPage = ({ setTokens }) => {
    return (
        <div>
            <h1>Login Page</h1>
            <AuthForm setTokens={setTokens} />
        </div>
    );
};

export default LoginPage;