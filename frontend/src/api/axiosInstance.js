import axios from "axios";

const apiCache = new Map();
const CACHE_DURATION = 30 * 1000;

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    // Add authorization header if token exists
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Adding Authorization header:', config.headers.Authorization);
    } else {
        console.log('No token found in localStorage');
    }
    
    if (config.method === 'get' && config.url === '/auth/me') {
        const cacheKey = config.url;
        const cached = apiCache.get(cacheKey);

        if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
            return Promise.reject({
                isCache: true,
                data: cached.data
            });
        }
    }

    return config;
});

api.interceptors.response.use(
    (response) => {
        if (response.config.method === 'get' && response.config.url === '/auth/me') {
            const cacheKey = response.config.url;
            apiCache.set(cacheKey, {
                data: response.data,
                timestamp: Date.now()
            });
        }
        return response;
    },
    (error) => {
        if (error.isCache) {
            return Promise.resolve({ data: error.data });
        }
        return Promise.reject(error);
    }
);

api.clearCache = () => {
    apiCache.clear();
};

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            api.clearCache();
        }
        return Promise.reject(error);
    }
);

export default api;
