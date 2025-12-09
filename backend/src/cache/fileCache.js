import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Cache directory path
const CACHE_DIR = path.join(__dirname, '../../cache');
const CACHE_TTL = parseInt(process.env.CACHE_TTL_MINUTES) * 60 * 1000 || 5 * 60 * 1000; // 5 minutes default

/**
 * Ensure cache directory exists
 */
async function ensureCacheDir() {
    try {
        await fs.access(CACHE_DIR);
    } catch {
        await fs.mkdir(CACHE_DIR, { recursive: true });
    }
}

/**
 * Generate cache key from parameters
 */
function getCacheKey(endpoint, params = {}) {
    const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('&');

    const key = sortedParams ? `${endpoint}_${sortedParams}` : endpoint;
    return key.replace(/[^a-z0-9_-]/gi, '_');
}

/**
 * Get cached data if valid
 */
export async function getCache(endpoint, params = {}) {
    await ensureCacheDir();

    const cacheKey = getCacheKey(endpoint, params);
    const cacheFile = path.join(CACHE_DIR, `${cacheKey}.json`);

    try {
        const data = await fs.readFile(cacheFile, 'utf-8');
        const cached = JSON.parse(data);

        // Check if cache is still valid
        const now = Date.now();
        if (now - cached.timestamp < CACHE_TTL) {
            console.log(`Cache hit: ${cacheKey}`);
            return cached.data;
        }

        // Cache expired, delete it
        console.log(`Cache expired: ${cacheKey}`);
        await fs.unlink(cacheFile);
        return null;
    } catch (error) {
        // Cache miss or error reading cache
        return null;
    }
}

/**
 * Set cache data
 */
export async function setCache(endpoint, params = {}, data) {
    await ensureCacheDir();

    const cacheKey = getCacheKey(endpoint, params);
    const cacheFile = path.join(CACHE_DIR, `${cacheKey}.json`);

    const cacheData = {
        timestamp: Date.now(),
        data: data
    };

    try {
        await fs.writeFile(cacheFile, JSON.stringify(cacheData, null, 2));
        console.log(`Cache set: ${cacheKey}`);
    } catch (error) {
        console.error(`Failed to write cache: ${error.message}`);
    }
}

/**
 * Clear all cache
 */
export async function clearCache() {
    await ensureCacheDir();

    try {
        const files = await fs.readdir(CACHE_DIR);

        for (const file of files) {
            if (file.endsWith('.json')) {
                await fs.unlink(path.join(CACHE_DIR, file));
            }
        }

        console.log(`Cleared ${files.length} cache files`);
        return files.length;
    } catch (error) {
        console.error(`Failed to clear cache: ${error.message}`);
        return 0;
    }
}

export default { getCache, setCache, clearCache };
