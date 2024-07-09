import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBlogsByUserId, saveBlog } from '../services/blogService';
import '../styles/MyBlogPage.css';

const MyBlogPage = ({ tokens, userId }) => {
    const [blogs, setBlogs] = useState([]);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserBlogs = async () => {
            try {
                const response = await getBlogsByUserId(tokens.accessToken, userId);
                const blogsData = Array.isArray(response.data) ? response.data : [response.data];
                setBlogs(blogsData);
                console.log(blogsData); // 블로그 데이터 확인
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchUserBlogs();
    }, [tokens.accessToken, userId]); // 의존성 배열 확인

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
        <div>
            <h1>My Blogs</h1>
            {blogs.length > 0 ? (
                <div className="blogs-list">
                    {blogs.map(blog => (
                        <div key={blog.id} className="blog-item">
                            <h2>{blog.title}</h2>
                            <p>{blog.description}</p>
                            <button onClick={() => navigate(`/blog/edit/${blog.id}`)}>Edit</button>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <p>You have no blogs. Create one below.</p>
                    <h2>Create New Blog</h2>
                    <form onSubmit={handleSubmit}>
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
                </>
            )}
        </div>
    );
};

export default MyBlogPage;