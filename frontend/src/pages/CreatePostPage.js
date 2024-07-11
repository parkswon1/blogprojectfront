import React, { useState, useEffect } from 'react';
import { createPost } from '../services/postService';
import { getAllCategories } from '../services/categoryService';

const CreatePostPage = ({ tokens, userId }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [tags, setTags] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllCategories(tokens.accessToken);
                setCategories(response.data);
            } catch (error) {
                console.error(error.response?.data?.error || error.message);
            }
        };
        fetchCategories();
    }, [tokens.accessToken]);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        const postRequest = {
            title,
            content,
            categoryId,
            tags: tags.split(',').map(tag => tag.trim())
        };
        try {
            await createPost(tokens.accessToken, userId, postRequest);
            alert('Post created successfully!');
        } catch (error) {
            alert(error.response?.data?.error || error.message);
        }
    };

    return (
        <div>
            <h2>Create New Post</h2>
            <form onSubmit={handleCreatePost}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Tags (comma separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
                <button type="submit">Create Post</button>
            </form>
        </div>
    );
};

export default CreatePostPage;