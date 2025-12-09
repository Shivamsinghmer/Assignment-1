import { NetworkError, TimeoutError, ValidationError } from '../api/client.js';

/**
 * Global error handling middleware
 */
export function errorHandler(err, req, res, next) {
    console.error('Error:', err);

    // Handle specific error types
    if (err instanceof ValidationError) {
        return res.status(400).json({
            success: false,
            error: 'Validation Error',
            message: err.message
        });
    }

    if (err instanceof TimeoutError) {
        return res.status(504).json({
            success: false,
            error: 'Gateway Timeout',
            message: 'The external API request timed out. Please try again.'
        });
    }

    if (err instanceof NetworkError) {
        return res.status(502).json({
            success: false,
            error: 'Bad Gateway',
            message: 'Failed to fetch data from external API. Please try again later.'
        });
    }

    // Handle not found errors
    if (err.status === 404) {
        return res.status(404).json({
            success: false,
            error: 'Not Found',
            message: err.message || 'Resource not found'
        });
    }

    // Default server error
    res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development'
            ? err.message
            : 'An unexpected error occurred'
    });
}

export default errorHandler;
