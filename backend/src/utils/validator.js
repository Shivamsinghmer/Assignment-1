import { ValidationError } from '../api/client.js';

/**
 * Validate post object
 */
export function validatePost(post) {
    if (!post || typeof post !== 'object') {
        throw new ValidationError('Invalid post object');
    }

    const requiredFields = ['id', 'userId', 'title', 'body'];
    const missingFields = requiredFields.filter(field => !(field in post));

    if (missingFields.length > 0) {
        throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return true;
}

/**
 * Validate user object
 */
export function validateUser(user) {
    if (!user || typeof user !== 'object') {
        throw new ValidationError('Invalid user object');
    }

    const requiredFields = ['id', 'name', 'email'];
    const missingFields = requiredFields.filter(field => !(field in user));

    if (missingFields.length > 0) {
        throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return true;
}

/**
 * Validate and sanitize query parameters
 */
export function validateQueryParams(query) {
    const params = {};

    if (query.userId) {
        const userId = parseInt(query.userId);
        if (isNaN(userId) || userId < 1) {
            throw new ValidationError('userId must be a positive integer');
        }
        params.userId = userId;
    }

    if (query.limit) {
        const limit = parseInt(query.limit);
        if (isNaN(limit) || limit < 1 || limit > 100) {
            throw new ValidationError('limit must be between 1 and 100');
        }
        params.limit = limit;
    }

    if (query.search) {
        params.search = query.search.trim();
    }

    return params;
}

export default { validatePost, validateUser, validateQueryParams };
