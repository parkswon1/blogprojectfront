import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, tokens }) => {
    return tokens.accessToken ? children : <Navigate to="/" />;
};

export default ProtectedRoute;