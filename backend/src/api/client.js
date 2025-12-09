import fetch from 'node-fetch';

// Custom error classes
export class NetworkError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NetworkError';
    }
}

export class TimeoutError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TimeoutError';
    }
}

export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

/**
 * Fetch with timeout support
 */
async function fetchWithTimeout(url, options = {}) {
    const timeout = options.timeout || 10000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new TimeoutError(`Request timeout after ${timeout}ms`);
        }
        throw new NetworkError(`Network request failed: ${error.message}`);
    }
}

/**
 * Retry logic with exponential backoff
 */
async function retryFetch(url, options = {}, maxRetries = 3) {
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetchWithTimeout(url, options);

            if (!response.ok) {
                throw new NetworkError(`HTTP ${response.status}: ${response.statusText}`);
            }

            return response;
        } catch (error) {
            lastError = error;

            // Don't retry on timeout or validation errors
            if (error instanceof TimeoutError || error instanceof ValidationError) {
                throw error;
            }

            // Wait before retrying (exponential backoff)
            if (attempt < maxRetries - 1) {
                const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    throw lastError;
}

/**
 * Main API client
 */
export async function apiGet(url, options = {}) {
    try {
        const response = await retryFetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            timeout: parseInt(process.env.API_TIMEOUT_MS) || 10000
        });

        const data = await response.json();
        return data;
    } catch (error) {
        // Re-throw with more context
        if (error instanceof NetworkError || error instanceof TimeoutError) {
            throw error;
        }
        throw new NetworkError(`Failed to fetch from ${url}: ${error.message}`);
    }
}

export default { apiGet, NetworkError, TimeoutError, ValidationError };
