import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogByBlogId, saveBlog } from '../services/blogService';
import '../styles/BlogEditPage.css';

const BlogEditPage = ({ tokens }) => {
    const { blogId } = useParams();
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await getBlogByBlogId(tokens.accessToken, blogId);
                const blog = response.data;
                setTitle(blog.title);
                setText(blog.description);
                // 이미지 URL은 수정 시 표시만 하고 서버에 저장할 파일로 사용하지 않음
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchBlog();
    }, [tokens.accessToken, blogId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await saveBlog(tokens.accessToken, title, text, file);
            alert('Blog updated successfully');
            navigate('/myblogs');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <div>
            <h1>Edit Blog</h1>
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
                    onChange={handleFileChange} 
                />
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default BlogEditPage;