/**
 * Simple Performance Testing Script for EventX-Studio API Optimization
 * Tests public endpoints and provides browser-based auth testing
 */

const axios = require('axios');
const { performance } = require('perf_hooks');

const BASE_URL = 'http://localhost:5000/api';

// Test basic server response first
async function testServerConnection() {
    try {
        console.log('🔍 Testing server connection...');
        const response = await axios.get('http://localhost:5000/');
        console.log('✅ Server is responding');
        return true;
    } catch (error) {
        console.log('❌ Server connection failed:', error.message);
        return false;
    }
}

// Test public endpoints (if any)
async function testPublicEndpoints() {
    console.log('\n🌐 Testing Public Endpoints:');
    console.log('='.repeat(40));
    
    const publicEndpoints = [
        // Add any public endpoints here
        // For now, we'll test the optimized routes exist
    ];
    
    console.log('ℹ️  Most endpoints require authentication');
    console.log('ℹ️  Use browser-based testing for authenticated endpoints');
}

// Generate browser-based performance test
function generateBrowserTest() {
    const browserTestCode = `
// EventX-Studio Browser Performance Test
// Copy and paste this into the browser console when logged in as admin

(async function performanceTest() {
    console.log('🚀 Starting Browser-Based Performance Test...');
    
    const testEndpoints = {
        old: {
            adminDashboard: ['/auth/me', '/users', '/events', '/tickets/all'],
            eventsList: ['/events'],
            analytics: ['/analytics/overall']
        },
        optimized: {
            adminDashboard: ['/optimized/admin/dashboard-data'],
            eventsList: ['/optimized/events/list'], 
            analytics: ['/optimized/analytics/raw-data']
        }
    };
    
    async function measureEndpoints(urls, label) {
        const start = performance.now();
        let totalSize = 0;
        
        try {
            const promises = urls.map(url => 
                fetch('/api' + url, { credentials: 'include' })
                    .then(res => res.json())
            );
            
            const results = await Promise.all(promises);
            results.forEach(data => {
                totalSize += JSON.stringify(data).length;
            });
            
            const end = performance.now();
            const duration = Math.round(end - start);
            
            return {
                label,
                duration,
                dataSize: Math.round(totalSize / 1024),
                requestCount: urls.length,
                success: true
            };
        } catch (error) {
            console.error(label + ' failed:', error);
            return { label, success: false, error: error.message };
        }
    }
    
    console.log('\\n📊 Testing Admin Dashboard:');
    const oldDashboard = await measureEndpoints(testEndpoints.old.adminDashboard, 'OLD Dashboard');
    const newDashboard = await measureEndpoints(testEndpoints.optimized.adminDashboard, 'OPTIMIZED Dashboard');
    
    console.log('\\n📊 Testing Events List:');  
    const oldEvents = await measureEndpoints(testEndpoints.old.eventsList, 'OLD Events');
    const newEvents = await measureEndpoints(testEndpoints.optimized.eventsList, 'OPTIMIZED Events');
    
    console.log('\\n📊 Testing Analytics:');
    const oldAnalytics = await measureEndpoints(testEndpoints.old.analytics, 'OLD Analytics');
    const newAnalytics = await measureEndpoints(testEndpoints.optimized.analytics, 'OPTIMIZED Analytics');
    
    // Generate report
    console.log('\\n📈 PERFORMANCE COMPARISON REPORT');
    console.log('='.repeat(60));
    
    function compareResults(oldResult, newResult, category) {
        console.log('\\n' + category + ':');
        if (oldResult.success && newResult.success) {
            const timeImprovement = ((oldResult.duration - newResult.duration) / oldResult.duration * 100).toFixed(1);
            const sizeImprovement = ((oldResult.dataSize - newResult.dataSize) / oldResult.dataSize * 100).toFixed(1);
            const requestImprovement = ((oldResult.requestCount - newResult.requestCount) / oldResult.requestCount * 100).toFixed(1);
            
            console.log('  Load Time: ' + oldResult.duration + 'ms → ' + newResult.duration + 'ms (' + (timeImprovement > 0 ? '-' : '+') + Math.abs(timeImprovement) + '%)');
            console.log('  Data Size: ' + oldResult.dataSize + 'KB → ' + newResult.dataSize + 'KB (' + (sizeImprovement > 0 ? '-' : '+') + Math.abs(sizeImprovement) + '%)');
            console.log('  Requests: ' + oldResult.requestCount + ' → ' + newResult.requestCount + ' (' + (requestImprovement > 0 ? '-' : '+') + Math.abs(requestImprovement) + '%)');
        } else {
            console.log('  ⚠️ Test failed - Old: ' + (oldResult.success ? 'OK' : 'FAIL') + ', New: ' + (newResult.success ? 'OK' : 'FAIL'));
        }
    }
    
    compareResults(oldDashboard, newDashboard, 'ADMIN DASHBOARD');
    compareResults(oldEvents, newEvents, 'EVENTS LIST');
    compareResults(oldAnalytics, newAnalytics, 'ANALYTICS');
    
    console.log('\\n✅ Browser performance test completed!');
    console.log('ℹ️ Check Network tab in DevTools for detailed timing');
})();`;

    return browserTestCode;
}

async function main() {
    console.log('🚀 EventX-Studio Performance Testing\n');
    
    // Test server connection
    const serverRunning = await testServerConnection();
    if (!serverRunning) {
        console.log('\n❌ Cannot proceed without server running');
        console.log('💡 Make sure to run: npm start (in backend folder)');
        return;
    }
    
    // Test public endpoints
    await testPublicEndpoints();
    
    // Generate browser test
    console.log('\n📱 Browser-Based Performance Test:');
    console.log('='.repeat(50));
    console.log('1. Open browser and login as admin to EventX-Studio');
    console.log('2. Go to Admin Dashboard');
    console.log('3. Open Developer Tools (F12) > Console');
    console.log('4. Copy and paste this code:');
    console.log('\n' + '='.repeat(60));
    console.log(generateBrowserTest());
    console.log('='.repeat(60));
    
    console.log('\n🎯 Expected Results:');
    console.log('• Admin Dashboard: ~75% fewer API calls (4→1 requests)');
    console.log('• Events List: ~70-80% smaller data transfer');
    console.log('• Analytics: Faster client-side calculations');
    console.log('• Overall: Significant improvement in load times\n');
}

main().catch(console.error);
