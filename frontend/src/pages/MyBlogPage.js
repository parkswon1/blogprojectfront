import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBlogsByUserId, saveBlog } from '../services/blogService';
import '../styles/MyBlogPage.css';

const MyBlogPage = ({ tokens, userId }) => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserBlogs = async () => {
            try {
                const response = await getBlogsByUserId(tokens.accessToken, userId);
                const blogsData = Array.isArray(response.data) ? response.data : [response.data];
                if (blogsData.length > 0) {
                    navigate(`/blog/edit/${blogsData[0].id}`);
                }
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchUserBlogs();
    }, [tokens.accessToken, userId, navigate]); // navigate 추가

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await saveBlog(tokens.accessToken, title, text, file);
            alert('Blog saved successfully');
            navigate('/myblogs');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="my-blog-page">
            <h1>Create New Blog</h1>
            <form onSubmit={handleSubmit} className="create-blog-form">
                <input 
                    type="text" 
                    placeholder="Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                />
                <textarea 
                    placeholder="Text" 
                    value={text} 
                    onChange={(e) => setText(e.target.value)} 
                ></textarea>
                <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files[0])} 
                />
                <button type="submit">Save Blog</button>
            </form>
        </div>
    );
};

export default MyBlogPage;