/**
 * Performance Monitoring Utility for EventX-Studio
 * Tracks API performance metrics in real-time
 */

// Performance monitoring middleware for Express
const performanceMonitor = (req, res, next) => {
    const start = Date.now();
    
    // Override res.json to capture response size
    const originalJson = res.json;
    res.json = function(data) {
        const end = Date.now();
        const responseTime = end - start;
        const dataSize = JSON.stringify(data).length;
        
        // Log performance metrics
        console.log(`📊 [${new Date().toISOString()}] ${req.method} ${req.path}`);
        console.log(`   ⏱️  Response Time: ${responseTime}ms`);
        console.log(`   📦 Data Size: ${Math.round(dataSize / 1024)}KB`);
        console.log(`   🔗 Endpoint Type: ${req.path.includes('/optimized/') ? 'OPTIMIZED' : 'STANDARD'}`);
        
        // Store metrics for analytics (could be sent to monitoring service)
        const metrics = {
            timestamp: new Date().toISOString(),
            method: req.method,
            path: req.path,
            responseTime,
            dataSize,
            isOptimized: req.path.includes('/optimized/'),
            statusCode: res.statusCode
        };
        
        // Could send to monitoring service like DataDog, New Relic, etc.
        // sendToMonitoringService(metrics);
        
        return originalJson.call(this, data);
    };
    
    next();
};

// Client-side performance tracking utility
const clientPerformanceTracker = {
    // Track API call performance
    trackApiCall: (endpoint, startTime, endTime, dataSize) => {
        const duration = endTime - startTime;
        const isOptimized = endpoint.includes('/optimized/');
        
        console.log(`🚀 API Call Performance:`);
        console.log(`   Endpoint: ${endpoint}`);
        console.log(`   Duration: ${Math.round(duration)}ms`);
        console.log(`   Data Size: ${Math.round(dataSize / 1024)}KB`);
        console.log(`   Type: ${isOptimized ? 'OPTIMIZED' : 'STANDARD'}`);
        
        // Store in localStorage for analysis
        const metrics = {
            timestamp: new Date().toISOString(),
            endpoint,
            duration: Math.round(duration),
            dataSize,
            isOptimized
        };
        
        const existingMetrics = JSON.parse(localStorage.getItem('api-performance-metrics') || '[]');
        existingMetrics.push(metrics);
        
        // Keep only last 100 metrics to prevent localStorage overflow
        if (existingMetrics.length > 100) {
            existingMetrics.splice(0, existingMetrics.length - 100);
        }
        
        localStorage.setItem('api-performance-metrics', JSON.stringify(existingMetrics));
    },
    
    // Get performance summary
    getPerformanceSummary: () => {
        const metrics = JSON.parse(localStorage.getItem('api-performance-metrics') || '[]');
        
        if (metrics.length === 0) {
            return { message: 'No performance data available' };
        }
        
        const optimized = metrics.filter(m => m.isOptimized);
        const standard = metrics.filter(m => !m.isOptimized);
        
        const avgDuration = (arr) => arr.length > 0 ? arr.reduce((sum, m) => sum + m.duration, 0) / arr.length : 0;
        const avgDataSize = (arr) => arr.length > 0 ? arr.reduce((sum, m) => sum + m.dataSize, 0) / arr.length : 0;
        
        return {
            totalApiCalls: metrics.length,
            optimizedCalls: optimized.length,
            standardCalls: standard.length,
            optimizedPerformance: {
                averageDuration: Math.round(avgDuration(optimized)),
                averageDataSize: Math.round(avgDataSize(optimized) / 1024)
            },
            standardPerformance: {
                averageDuration: Math.round(avgDuration(standard)),
                averageDataSize: Math.round(avgDataSize(standard) / 1024)
            },
            improvement: {
                durationImprovement: standard.length > 0 && optimized.length > 0 
                    ? Math.round(((avgDuration(standard) - avgDuration(optimized)) / avgDuration(standard)) * 100)
                    : 0,
                dataSizeReduction: standard.length > 0 && optimized.length > 0
                    ? Math.round(((avgDataSize(standard) - avgDataSize(optimized)) / avgDataSize(standard)) * 100)
                    : 0
            }
        };
    },
    
    // Clear stored metrics
    clearMetrics: () => {
        localStorage.removeItem('api-performance-metrics');
        console.log('📊 Performance metrics cleared');
    }
};

// Enhanced API instance with performance tracking
const createPerformanceTrackedApi = (baseApi) => {
    // Intercept requests to track performance
    baseApi.interceptors.request.use((config) => {
        config.metadata = { startTime: performance.now() };
        return config;
    });
    
    // Intercept responses to measure performance
    baseApi.interceptors.response.use(
        (response) => {
            const endTime = performance.now();
            const duration = endTime - response.config.metadata.startTime;
            const dataSize = JSON.stringify(response.data).length;
            
            clientPerformanceTracker.trackApiCall(
                response.config.url,
                response.config.metadata.startTime,
                endTime,
                dataSize
            );
            
            return response;
        },
        (error) => {
            // Track failed requests too
            if (error.config && error.config.metadata) {
                const endTime = performance.now();
                clientPerformanceTracker.trackApiCall(
                    error.config.url,
                    error.config.metadata.startTime,
                    endTime,
                    0
                );
            }
            return Promise.reject(error);
        }
    );
    
    return baseApi;
};

// Usage instructions for integration:
/*

SERVER-SIDE (Express):
1. Add to your Express app:
   app.use(performanceMonitor);

2. Place before your route definitions for comprehensive tracking

CLIENT-SIDE (React):
1. Replace your existing API instance:
   import api from '@/api/axiosInstance';
   const performanceTrackedApi = createPerformanceTrackedApi(api);

2. Use the performance tracker:
   // View performance summary
   console.log(clientPerformanceTracker.getPerformanceSummary());
   
   // Clear metrics
   clientPerformanceTracker.clearMetrics();

*/

module.exports = {
    performanceMonitor,
    clientPerformanceTracker,
    createPerformanceTrackedApi
};
