import React, { useState, useEffect } from 'react';
import { getUser, updateUser, updatePassword, updateProfileImage, fetchProfileImage } from '../services/userService';

const UserProfile = ({ tokens, userId }) => {
    const [newName, setNewName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userResponse = await getUser(tokens.accessToken, userId);
                setNewName(userResponse.data.name); // 폼 필드에 사용자 정보 미리 채우기

                const imageUrl = await fetchProfileImage(tokens.accessToken, userId);
                setProfileImageUrl(imageUrl); // 사용자 프로필 이미지 설정
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchUserInfo();
    }, [tokens.accessToken, userId]);

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await updateUser(tokens.accessToken, { name: newName });
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
        } else {
            alert('이미지 파일만 업로드할 수 있습니다.');
        }
    };

    const handleUpdateProfileImage = async (e) => {
        e.preventDefault();
        try {
            await updateProfileImage(tokens.accessToken, imageFile);
            const imageUrl = await fetchProfileImage(tokens.accessToken, userId); // 업데이트된 이미지 가져오기
            setProfileImageUrl(imageUrl);
            alert('사용자 프로필이 업데이트 되었습니다.');
        } catch (error) {
            alert(error.response.data.error);
        }
    };

    return (
        <div>
            <h2>Update User Information</h2>
            {profileImageUrl && <img src={profileImageUrl} alt="Profile" style={{ width: '150px', height: '150px' }} />}
            <form onSubmit={handleUpdateUser}>
                <input 
                    type="text" 
                    placeholder="Name" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)} 
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
                    onChange={handleFileChange} 
                />
                <button type="submit">Update Profile Image</button>
            </form>
        </div>
    );
};

export default UserProfile;