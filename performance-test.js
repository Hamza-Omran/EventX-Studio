/**
 * Performance Testing Script for EventX-Studio API Optimization
 * Compares old vs optimized endpoints for load times and data transfer
 */

const axios = require('axios');
const { performance } = require('perf_hooks');

const BASE_URL = 'http://localhost:5000/api';

// Test configuration
const TEST_ITERATIONS = 3;
const endpoints = {
    old: {
        adminDashboard: [
            '/auth/me',
            '/users',
            '/events',
            '/tickets/all'
        ],
        eventsList: ['/events'],
        analytics: ['/analytics/overall'],
        ticketsManagement: [
            '/tickets/all',
            '/events', 
            '/users',
            '/auth/me'
        ],
        peopleManagement: [
            '/users',
            '/admins'
        ]
    },
    optimized: {
        adminDashboard: ['/optimized/admin/dashboard-data'],
        eventsList: ['/optimized/events/list'],
        analytics: ['/optimized/analytics/raw-data'],
        ticketsManagement: ['/optimized/tickets/management'],
        peopleManagement: ['/optimized/people/list']
    }
};

async function measureEndpoint(urls, label) {
    const results = [];
    
    for (let i = 0; i < TEST_ITERATIONS; i++) {
        const start = performance.now();
        let totalDataSize = 0;
        
        try {
            const promises = urls.map(url => axios.get(BASE_URL + url, { withCredentials: true }));
            const responses = await Promise.all(promises);
            
            responses.forEach(response => {
                totalDataSize += JSON.stringify(response.data).length;
            });
            
            const end = performance.now();
            const loadTime = end - start;
            
            results.push({
                iteration: i + 1,
                loadTime: Math.round(loadTime),
                dataSize: totalDataSize,
                requestCount: urls.length
            });
            
            console.log(`${label} - Iteration ${i + 1}: ${Math.round(loadTime)}ms, ${Math.round(totalDataSize / 1024)}KB, ${urls.length} requests`);
            
        } catch (error) {
            console.error(`${label} - Iteration ${i + 1} failed:`, error.message);
            results.push({
                iteration: i + 1,
                loadTime: null,
                dataSize: null,
                requestCount: urls.length,
                error: error.message
            });
        }
    }
    
    // Calculate averages
    const successfulResults = results.filter(r => r.loadTime !== null);
    if (successfulResults.length > 0) {
        const avgLoadTime = successfulResults.reduce((sum, r) => sum + r.loadTime, 0) / successfulResults.length;
        const avgDataSize = successfulResults.reduce((sum, r) => sum + r.dataSize, 0) / successfulResults.length;
        
        return {
            label,
            averageLoadTime: Math.round(avgLoadTime),
            averageDataSize: Math.round(avgDataSize),
            averageRequestCount: successfulResults[0].requestCount,
            successfulTests: successfulResults.length,
            totalTests: TEST_ITERATIONS
        };
    }
    
    return {
        label,
        averageLoadTime: null,
        averageDataSize: null,
        averageRequestCount: urls.length,
        successfulTests: 0,
        totalTests: TEST_ITERATIONS
    };
}

async function runPerformanceTests() {
    console.log('🚀 Starting EventX-Studio API Performance Tests...\n');
    console.log(`Running ${TEST_ITERATIONS} iterations per endpoint group\n`);
    
    const testGroups = [
        'adminDashboard',
        'eventsList', 
        'analytics',
        'ticketsManagement',
        'peopleManagement'
    ];
    
    const results = {};
    
    for (const group of testGroups) {
        console.log(`\n📊 Testing ${group.toUpperCase()}:`);
        console.log('='.repeat(50));
        
        // Test old endpoints
        const oldResult = await measureEndpoint(
            endpoints.old[group], 
            `OLD ${group}`
        );
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Test optimized endpoints  
        const optimizedResult = await measureEndpoint(
            endpoints.optimized[group],
            `OPTIMIZED ${group}`
        );
        
        results[group] = {
            old: oldResult,
            optimized: optimizedResult
        };
    }
    
    // Generate summary report
    console.log('\n📈 PERFORMANCE SUMMARY REPORT');
    console.log('='.repeat(80));
    
    testGroups.forEach(group => {
        const old = results[group].old;
        const opt = results[group].optimized;
        
        console.log(`\n${group.toUpperCase()}:`);
        
        if (old.averageLoadTime && opt.averageLoadTime) {
            const loadTimeImprovement = ((old.averageLoadTime - opt.averageLoadTime) / old.averageLoadTime * 100).toFixed(1);
            const dataSizeReduction = ((old.averageDataSize - opt.averageDataSize) / old.averageDataSize * 100).toFixed(1);
            const requestReduction = ((old.averageRequestCount - opt.averageRequestCount) / old.averageRequestCount * 100).toFixed(1);
            
            console.log(`  Load Time: ${old.averageLoadTime}ms → ${opt.averageLoadTime}ms (${loadTimeImprovement > 0 ? '-' : '+'}${Math.abs(loadTimeImprovement)}%)`);
            console.log(`  Data Size: ${Math.round(old.averageDataSize/1024)}KB → ${Math.round(opt.averageDataSize/1024)}KB (${dataSizeReduction > 0 ? '-' : '+'}${Math.abs(dataSizeReduction)}%)`);
            console.log(`  Requests: ${old.averageRequestCount} → ${opt.averageRequestCount} (${requestReduction > 0 ? '-' : '+'}${Math.abs(requestReduction)}%)`);
        } else {
            console.log(`  ⚠️  Could not complete comparison - Old: ${old.successfulTests}/${old.totalTests}, Optimized: ${opt.successfulTests}/${opt.totalTests}`);
        }
    });
    
    console.log('\n✅ Performance testing completed!');
}

// Run the tests
runPerformanceTests().catch(console.error);
