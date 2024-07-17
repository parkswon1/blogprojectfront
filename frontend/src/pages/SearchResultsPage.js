import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchAll } from '../services/elasticsearchService';
import defaultImage from '../assets/logo192.png';
import '../styles/SearchResultsPage.css';

const SearchResultsPage = ({ tokens }) => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const [blogResults, setBlogResults] = useState([]);
    const [postResults, setPostResults] = useState([]);

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await searchAll(tokens.accessToken, query);
                const resultItems = response.data;

                const blogs = resultItems.filter(result => result.hasOwnProperty('description'));
                const posts = resultItems.filter(result => result.hasOwnProperty('content'));

                setBlogResults(blogs);
                setPostResults(posts);
            } catch (error) {
                console.error(error.response?.data?.error || error.message);
            }
        };

        if (query) {
            fetchSearchResults();
        }
    }, [tokens.accessToken, query]);

    return (
        <div className="search-results-page">
            <h1>Search Results</h1>
            <div className="results">
                <h2>Blogs</h2>
                {blogResults.length > 0 ? (
                    blogResults.map((blog, index) => (
                        <div key={`blog-${blog.id}-${index}`} className="result-item">
                            <h3>{blog.title}</h3>
                            <p>{blog.description}</p>
                            {blog.image ? (
                                <img src={`http://localhost:8080${blog.image.url}`} alt={blog.title} />
                            ) : (
                                <img src={defaultImage} alt={blog.title} />
                            )}
                            <p>Views: {blog.views}</p>
                        </div>
                    ))
                ) : (
                    <p>No blog results found</p>
                )}

                <h2>Posts</h2>
                {postResults.length > 0 ? (
                    postResults.map((post, index) => (
                        <div key={`post-${post.id}-${index}`} className="result-item">
                            <h3>{post.title}</h3>
                            <p>{post.content}</p>
                            {post.image ? (
                                <img src={`http://localhost:8080${post.image?.url}`} alt={post.title} />
                            ) : (
                                <img src={defaultImage} alt={post.title} />
                            )}
                            <p>Views: {post.views}</p>
                        </div>
                    ))
                ) : (
                    <p>No post results found</p>
                )}
            </div>
        </div>
    );
};

export default SearchResultsPage;