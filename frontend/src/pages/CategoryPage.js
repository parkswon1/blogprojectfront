import React, { useState, useEffect } from 'react';
import { createCategory, getAllCategories, deleteCategory } from '../services/categoryService';
import '../styles/CategoryPage.css';

const CategoryPage = ({ tokens }) => {
    const [name, setName] = useState('');
    const [parentId, setParentId] = useState(null);
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

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        try {
            await createCategory(tokens.accessToken, name, parentId);
            const response = await getAllCategories(tokens.accessToken);
            setCategories(response.data);
            setName('');
            setParentId(null);
        } catch (error) {
            alert(error.response?.data?.error || error.message);
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            await deleteCategory(tokens.accessToken, id);
            const response = await getAllCategories(tokens.accessToken);
            setCategories(response.data);
        } catch (error) {
            alert(error.response?.data?.error || error.message);
        }
    };

    const renderCategoryTree = (categories) => {
        return categories.map((category) => (
            <li key={category.id}>
                <div className="category-item">
                    <span>
                        {category.name} (ID: {category.id})
                    </span>
                    <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
                </div>
                {category.subCategories && category.subCategories.length > 0 && (
                    <ul>
                        {renderCategoryTree(category.subCategories)}
                    </ul>
                )}
            </li>
        ));
    };

    return (
        <div className="category-page">
            <h2>Create Category</h2>
            <form onSubmit={handleCreateCategory} className="category-form">
                <input
                    type="text"
                    placeholder="Category Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <select value={parentId || ''} onChange={(e) => setParentId(e.target.value || null)}>
                    <option value="">No Parent</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <button type="submit">Create Category</button>
            </form>

            <h2>All Categories</h2>
            <ul className="category-tree">
                {renderCategoryTree(categories)}
            </ul>
        </div>
    );
};

export default CategoryPage;