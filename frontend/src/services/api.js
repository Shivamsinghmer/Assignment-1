import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Get posts with optional filters
 */
export async function getPosts(params = {}) {
    try {
        const response = await api.get('/posts', { params });
        return response.data;
    } catch (error) {
        throw handleError(error);
    }
}

/**
 * Get single post by ID
 */
export async function getPostById(id) {
    try {
        const response = await api.get(`/posts/${id}`);
        return response.data;
    } catch (error) {
        throw handleError(error);
    }
}

/**
 * Clear cache
 */
export async function clearCache() {
    try {
        const response = await api.delete('/cache');
        return response.data;
    } catch (error) {
        throw handleError(error);
    }
}

/**
 * Handle API errors
 */
function handleError(error) {
    if (error.response) {
        // Server responded with error
        return {
            message: error.response.data.message || 'An error occurred',
            type: error.response.data.error || 'Error',
            status: error.response.status
        };
    } else if (error.request) {
        // No response received
        return {
            message: 'Unable to connect to the server. Please check if the backend is running.',
            type: 'Connection Error',
            status: 0
        };
    } else {
        // Request setup error
        return {
            message: error.message || 'An unexpected error occurred',
            type: 'Error',
            status: 0
        };
    }
}

export default { getPosts, getPostById, clearCache };
