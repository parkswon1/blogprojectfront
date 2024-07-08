import React from 'react';
import AuthForm from '../components/AuthForm';

const RegisterPage = ({ setTokens }) => {
    return (
        <div>
            <h1>Register Page</h1>
            <AuthForm setTokens={setTokens} />
        </div>
    );
};

export default RegisterPage;