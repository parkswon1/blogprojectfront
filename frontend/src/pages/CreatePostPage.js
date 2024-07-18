import React, { useState, useEffect } from 'react';
import { getAllCategories } from '../services/categoryService';
import { createPost } from '../services/postService';
import '../styles/CreatePostPage.css';

const CreatePostPage = ({ tokens, userId }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllCategories(tokens.accessToken);
                setCategories(response.data);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchCategories();
    }, [tokens.accessToken]);

    const handleCreatePost = async (e) => {
        e.preventDefault();

        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('categoryId', category);
        tags.split(',').forEach(tag => postData.append('tagNames', tag.trim())); // 각 태그를 개별적으로 추가
        if (image) {
            postData.append('imageFile', image);
        }

        try {
            await createPost(tokens.accessToken, userId, postData);
            alert('Post created successfully');
        } catch (error) {
            console.error(error.response?.data || error.message);
            alert('Failed to create post');
        }
    };

    return (
        <div className="create-post-page">
            <h1>Create Post</h1>
            <form onSubmit={handleCreatePost} className="create-post-form">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    required
                    className="form-input"
                />
                <label htmlFor="content" className="form-label">Content</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Content"
                    required
                    className="form-textarea"
                />
                <label htmlFor="category" className="form-label">Category</label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="form-select"
                >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                <label htmlFor="tags" className="form-label">Tags</label>
                <input
                    type="text"
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Tags (comma separated)"
                    className="form-input"
                />
                <label htmlFor="image" className="form-label">Image</label>
                <input
                    type="file"
                    id="image"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="form-file-input"
                />
                <button type="submit" className="form-button">Create Post</button>
            </form>
        </div>
    );
};

export default CreatePostPage;