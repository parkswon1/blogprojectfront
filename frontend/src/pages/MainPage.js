import React from 'react';
import { Link } from 'react-router-dom';

const MainPage = ({ handleLogout, handleRefresh }) => {
    return (
        <div>
            <h2>Main Page</h2>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleRefresh}>Refresh Token</button>
            <p>Welcome to the main page!</p>
            <Link to="/mypage">Go to My Page</Link>
        </div>
    );
};

export default MainPage;