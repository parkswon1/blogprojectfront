import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import { fetchProfileImage } from '../services/userService';
import defaultProfilePic from '../assets/favicon.ico';

const Navbar = ({ isLoggedIn, handleLogout, tokens, userId }) => {
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchImage = async () => {
            if (isLoggedIn) {
                try {
                    const imageUrl = await fetchProfileImage(tokens.accessToken, userId);
                    setProfileImageUrl(imageUrl);
                } catch (error) {
                    console.error(error.message);
                }
            }
        };
        fetchImage();
    }, [isLoggedIn, tokens.accessToken, userId]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src="/logo192.png" alt="React Logo" />
                <Link to="/">MyBlog</Link>
            </div>
            <ul className="navbar-links">
                {isLoggedIn ? (
                    <>
                        <li><Link to="/main">Home</Link></li>
                        <li><Link to="/blogs">Blogs</Link></li>
                        <li><Link to="/posts">Posts</Link></li>
                        <li><Link to="/categories">Categories</Link></li>
                        <li className="profile-dropdown" ref={dropdownRef}>
                            <img
                                src={profileImageUrl || defaultProfilePic}
                                alt="Profile"
                                className="profile-pic"
                                onClick={toggleDropdown}
                            />
                            {dropdownOpen && (
                                <div className="dropdown-menu">
                                    <Link to="/mypage">My Page</Link>
                                    <li><Link to="/myposts">My Posts</Link></li>
                                    <li><Link to="/myblogs">My Blogs</Link></li>
                                    <button onClick={handleLogout}>Logout</button>
                                </div>
                            )}
                        </li>
                    </>
                ) : (
                    <li><Link to="/">Login</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;