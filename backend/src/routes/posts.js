import express from 'express';
import { apiGet } from '../api/client.js';
import { endpoints } from '../api/endpoints.js';
import { getCache, setCache, clearCache } from '../cache/fileCache.js';
import { validatePost, validateUser, validateQueryParams } from '../utils/validator.js';

const router = express.Router();

/**
 * GET /api/posts
 * List posts with optional filtering
 */
router.get('/posts', async (req, res, next) => {
    try {
        // Validate and sanitize query parameters
        const params = validateQueryParams(req.query);

        // Check cache first
        const cacheKey = 'posts';
        let posts = await getCache(cacheKey, params);

        if (!posts) {
            // Fetch from API
            posts = await apiGet(endpoints.posts.list());

            // Validate posts
            posts.forEach(post => validatePost(post));

            // Cache the full list
            await setCache(cacheKey, {}, posts);
        }

        // Apply filters
        let filteredPosts = posts;

        if (params.userId) {
            filteredPosts = filteredPosts.filter(p => p.userId === params.userId);
        }

        if (params.search) {
            const searchLower = params.search.toLowerCase();
            filteredPosts = filteredPosts.filter(p =>
                p.title.toLowerCase().includes(searchLower) ||
                p.body.toLowerCase().includes(searchLower)
            );
        }

        // Apply limit (default 20)
        const limit = params.limit || 20;
        filteredPosts = filteredPosts.slice(0, limit);

        res.json({
            success: true,
            count: filteredPosts.length,
            data: filteredPosts
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/posts/:id
 * Get single post with user details
 */
router.get('/posts/:id', async (req, res, next) => {
    try {
        const postId = parseInt(req.params.id);

        if (isNaN(postId) || postId < 1) {
            const error = new Error('Invalid post ID');
            error.status = 404;
            throw error;
        }

        // Check cache first
        const cacheKey = `post_${postId}`;
        let result = await getCache(cacheKey, {});

        if (!result) {
            // Fetch post
            const post = await apiGet(endpoints.posts.single(postId));
            validatePost(post);

            // Fetch user details
            const user = await apiGet(endpoints.users.single(post.userId));
            validateUser(user);

            // Combine data
            result = {
                ...post,
                author: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    username: user.username
                }
            };

            // Cache the result
            await setCache(cacheKey, {}, result);
        }

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        if (error.message.includes('HTTP 404')) {
            error.status = 404;
            error.message = 'Post not found';
        }
        next(error);
    }
});

/**
 * DELETE /api/cache
 * Clear all cached data
 */
router.delete('/cache', async (req, res, next) => {
    try {
        const count = await clearCache();

        res.json({
            success: true,
            message: `Cleared ${count} cache files`,
            count
        });
    } catch (error) {
        next(error);
    }
});

export default router;
