import React, { useState, useEffect } from 'react';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import FilterBar from './components/FilterBar';
import ErrorDisplay from './components/ErrorDisplay';
import { getPosts, getPostById, clearCache as clearApiCache } from './services/api';
import './index.css';
import './components.css';

function App() {
    const [posts, setPosts] = useState([]);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [filters, setFilters] = useState({
        userId: '',
        limit: '',
        search: ''
    });
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch posts with filters
    const fetchPosts = async () => {
        setLoading(true);
        setError(null);

        try {
            // Build params object
            const params = {};
            if (filters.userId) params.userId = filters.userId;
            if (filters.limit) params.limit = filters.limit;
            if (filters.search) params.search = filters.search;

            const response = await getPosts(params);
            setPosts(response.data || []);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch single post
    const fetchPostDetail = async (id) => {
        setDetailLoading(true);
        setError(null);

        try {
            const response = await getPostById(id);
            setSelectedPost(response.data);
        } catch (err) {
            setError(err);
            setSelectedPostId(null);
        } finally {
            setDetailLoading(false);
        }
    };

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        if (key === 'reset') {
            setFilters({ userId: '', limit: '', search: '' });
        } else {
            setFilters(prev => ({ ...prev, [key]: value }));
        }
    };

    // Handle clear cache
    const handleClearCache = async () => {
        try {
            await clearApiCache();
            alert('Cache cleared successfully!');
            fetchPosts();
        } catch (err) {
            setError(err);
        }
    };

    // Handle post selection
    const handleSelectPost = (id) => {
        setSelectedPostId(id);
        setSelectedPost(null);
    };

    // Handle back button
    const handleBack = () => {
        setSelectedPostId(null);
        setSelectedPost(null);
    };

    // Handle clear error
    const handleClearError = () => {
        setError(null);
        setSelectedPostId(null);
        setSelectedPost(null);
    };

    // Fetch posts on mount or filter change
    useEffect(() => {
        if (!selectedPostId) {
            fetchPosts();
        }
    }, [filters]);

    // Fetch post detail when selected
    useEffect(() => {
        if (selectedPostId) {
            fetchPostDetail(selectedPostId);
        }
    }, [selectedPostId]);

    return (
        <div className="app">
            <header className="header">
                <div className="container">
                    <h1 className="logo">
                        <span className="logo-icon">📊</span>
                        API Data Fetcher
                    </h1>
                    <p className="subtitle">Browse and filter posts from JSONPlaceholder API</p>
                </div>
            </header>

            <main className="main container">
                {error ? (
                    <ErrorDisplay error={error} onRetry={selectedPostId ? () => fetchPostDetail(selectedPostId) : fetchPosts} onClearError={handleClearError} />
                ) : selectedPostId ? (
                    <PostDetail post={selectedPost} loading={detailLoading} onBack={handleBack} />
                ) : (
                    <>
                        <FilterBar
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onClearCache={handleClearCache}
                            loading={loading}
                        />
                        <PostList
                            posts={posts}
                            onSelectPost={handleSelectPost}
                            loading={loading}
                        />
                    </>
                )}
            </main>

            <footer className="footer">
                <div className="container">
                    <p>Built with React + Express | Data from JSONPlaceholder API</p>
                </div>
            </footer>
        </div>
    );
}

export default App;
