import React from 'react';
import UserProfile from '../components/UserProfile';

const MyPage = ({ tokens, userId, handleLogout, handleRefresh }) => {
    return (
        <div>
            <h2>My Page</h2>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleRefresh}>Refresh Token</button>
            <UserProfile tokens={tokens} userId={userId} />
        </div>
    );
};

export default MyPage;