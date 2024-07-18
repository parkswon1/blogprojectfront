import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchAll } from '../services/elasticsearchService';
import { fetchImage } from '../services/imageService'; 
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

                const blogs = await Promise.all(
                    resultItems
                        .filter(result => result.hasOwnProperty('description'))
                        .map(async (blog) => {
                            if (blog.image && blog.image.url) {
                                blog.image.url = await fetchImage(tokens.accessToken, blog.image.url);
                            }
                            return blog;
                        })
                );

                const posts = await Promise.all(
                    resultItems
                        .filter(result => result.hasOwnProperty('content'))
                        .map(async (post) => {
                            if (post.image && post.image.url) {
                                post.image.url = await fetchImage(tokens.accessToken, post.image.url);
                            }
                            return post;
                        })
                );

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
                <div className="results-grid">
                    {blogResults.length > 0 ? (
                        blogResults.map((blog, index) => (
                            <div key={`blog-${blog.id}-${index}`} className="result-item">
                                <Link to={`/blog/${blog.id}`}>
                                    <h3>{blog.title}</h3>
                                    <p>{blog.description}</p>
                                    {blog.image ? (
                                        <img src={blog.image.url} alt={blog.title} />
                                    ) : (
                                        <img src={defaultImage} alt={blog.title} />
                                    )}
                                    <p>Views: {blog.views}</p>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>No blog results found</p>
                    )}
                </div>

                <h2>Posts</h2>
                <div className="results-grid">
                    {postResults.length > 0 ? (
                        postResults.map((post, index) => (
                            <div key={`post-${post.id}-${index}`} className="result-item">
                                <Link to={`/post/${post.id}`}>
                                    <h3>{post.title}</h3>
                                    <p>{post.content}</p>
                                    {post.image ? (
                                        <img src={post.image.url} alt={post.title} />
                                    ) : (
                                        <img src={defaultImage} alt={post.title} />
                                    )}
                                    <p>Views: {post.views}</p>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>No post results found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchResultsPage;