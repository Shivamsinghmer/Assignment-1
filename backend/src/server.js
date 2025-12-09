import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import postsRouter from './routes/posts.js';
import errorHandler from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API Data Fetcher Backend',
        version: '1.0.0',
        endpoints: {
            'GET /api/posts': 'List posts with optional filters (userId, limit, search)',
            'GET /api/posts/:id': 'Get single post with user details',
            'DELETE /api/cache': 'Clear all cached data'
        }
    });
});

app.use('/api', postsRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'The requested endpoint does not exist'
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Cache TTL: ${process.env.CACHE_TTL_MINUTES || 5} minutes`);
});

export default app;
