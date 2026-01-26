import axios from 'axios';
const API_BASE = '/api/v1';
const client = axios.create({
    baseURL: API_BASE,
    timeout: 60000, // 60 second timeout for analysis
});
/**
 * Analyze a GitHub user and get roasts
 */
export async function analyzeUser(username, options = {}) {
    try {
        const params = new URLSearchParams();
        if (options.force) {
            params.set('force', 'true');
        }
        const response = await client.post(`/analyze/${username}`, {}, { params });
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            const apiError = error.response?.data;
            if (apiError?.message) {
                throw new Error(apiError.message);
            }
            if (error.response?.status === 404) {
                throw new Error('GitHub user not found or profile is private');
            }
            if (error.response?.status === 429) {
                throw new Error('Too many requests. Please wait a moment and try again.');
            }
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timed out. User might have too many repositories.');
            }
        }
        throw error;
    }
}
/**
 * Check API health
 */
export async function checkHealth() {
    try {
        const response = await client.get('/health');
        return response.data;
    }
    catch (error) {
        return { status: 'unavailable' };
    }
}
//# sourceMappingURL=api.js.map