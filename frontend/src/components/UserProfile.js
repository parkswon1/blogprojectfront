import React, { useState } from 'react';
import { updateUser, updatePassword, updateProfileImage } from '../services/userService';

const UserProfile = ({ tokens, userId }) => {
    const [name, setName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');
    const [imageFile, setImageFile] = useState(null);

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await updateUser(tokens.accessToken, { name });
            alert('사용자 정보가 업데이트 되었습니다.');
        } catch (error) {
            alert(error.response.data.error);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            await updatePassword(tokens.accessToken, { newPassword, checkPassword });
            alert('사용자 비밀번호가 변경되었습니다.');
        } catch (error) {
            alert(error.response.data.error);
        }
    };

    const handleUpdateProfileImage = async (e) => {
        e.preventDefault();
        try {
            await updateProfileImage(tokens.accessToken, imageFile);
            alert('사용자 프로필이 업데이트 되었습니다.');
        } catch (error) {
            alert(error.response.data.error);
        }
    };

    return (
        <div>
            <h2>Update User Information</h2>
            <form onSubmit={handleUpdateUser}>
                <input 
                    type="text" 
                    placeholder="Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                />
                <button type="submit">Update Name</button>
            </form>

            <h2>Change Password</h2>
            <form onSubmit={handleChangePassword}>
                <input 
                    type="password" 
                    placeholder="New Password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Check Password" 
                    value={checkPassword} 
                    onChange={(e) => setCheckPassword(e.target.value)} 
                />
                <button type="submit">Change Password</button>
            </form>

            <h2>Update Profile Image</h2>
            <form onSubmit={handleUpdateProfileImage}>
                <input 
                    type="file" 
                    onChange={(e) => setImageFile(e.target.files[0])} 
                />
                <button type="submit">Update Profile Image</button>
            </form>
        </div>
    );
};

export default UserProfile;