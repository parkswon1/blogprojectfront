import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogByBlogId, saveBlog } from '../services/blogService';
import { fetchImage } from '../services/imageService';
import '../styles/BlogEditPage.css';
import defaultImage from '../assets/logo192.png';

const BlogEditPage = ({ tokens }) => {
    const { blogId } = useParams();
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await getBlogByBlogId(tokens.accessToken, blogId);
                const blog = response.data;
                setTitle(blog.title);
                setText(blog.description);
                if (blog.image && blog.image.url) {
                    const url = await fetchImage(tokens.accessToken, blog.image.url);
                    setImageUrl(url);
                }
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
        if (e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageUrl(e.target.result);
            };
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setImageUrl(null);
        }
    };

    return (
        <div className="blog-edit-page">
            <h1>Edit Blog</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title" className="form-label">Title</label>
                <input 
                    type="text" 
                    id="title"
                    placeholder="Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    className="blog-edit-title"
                />
                <label htmlFor="description" className="form-label">Description</label>
                <textarea 
                    id="description"
                    placeholder="Text" 
                    value={text} 
                    onChange={(e) => setText(e.target.value)} 
                    className="blog-edit-text"
                ></textarea>
                <label htmlFor="file" className="form-label">Image</label>
                {imageUrl && (
                    <div className="blog-edit-image-preview">
                        <img src={imageUrl} alt="Preview" className="preview-image" />
                    </div>
                )}
                <input 
                    type="file" 
                    id="file"
                    onChange={handleFileChange} 
                    className="blog-edit-file-input"
                />
                <button type="submit" className="blog-edit-submit">Save Changes</button>
            </form>
        </div>
    );
};

export default BlogEditPage;