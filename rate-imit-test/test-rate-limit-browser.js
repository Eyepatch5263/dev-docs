
(async function testRateLimit() {
    console.clear();
    console.log('%c🚀 Rate Limit Test Starting...', 'font-size: 20px; font-weight: bold; color: #4CAF50');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #888');

    const totalRequests = 110;
    const results = {
        success: 0,
        rateLimited: 0,
        errors: 0,
        responses: []
    };

    // Make requests sequentially to see the rate limit in action
    for (let i = 1; i <= totalRequests; i++) {
        try {
            const response = await fetch('/api/docs');
            const data = await response.json();

            // Get rate limit headers
            const limit = response.headers.get('x-ratelimit-limit');
            const remaining = response.headers.get('x-ratelimit-remaining');
            const reset = response.headers.get('x-ratelimit-reset');

            if (response.status === 200) {
                results.success++;
                console.log(
                    `%c✓ Request ${i}/${totalRequests}`,
                    'color: #4CAF50; font-weight: bold',
                    `| Status: ${response.status}`,
                    `| Remaining: ${remaining}/${limit}`
                );
            } else if (response.status === 429) {
                results.rateLimited++;
                const retryAfter = data.retryAfter || 'unknown';
                console.log(
                    `%c✗ Request ${i}/${totalRequests}`,
                    'color: #FF5722; font-weight: bold',
                    `| Status: 429 RATE LIMITED`,
                    `| Retry after: ${retryAfter}s`
                );
            } else {
                results.errors++;
                console.log(
                    `%c⚠ Request ${i}/${totalRequests}`,
                    'color: #FFC107; font-weight: bold',
                    `| Status: ${response.status}`
                );
            }

            results.responses.push({
                request: i,
                status: response.status,
                limit,
                remaining,
                reset,
                data
            });

            // Small delay to avoid overwhelming the browser
            await new Promise(resolve => setTimeout(resolve, 50));

        } catch (error) {
            results.errors++;
            console.error(`%c✗ Request ${i}/${totalRequests} - Error:`, 'color: #F44336', error);
        }
    }

    // Print summary
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #888');
    console.log('%c📊 Test Summary', 'font-size: 18px; font-weight: bold; color: #2196F3');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #888');

    console.log(`%c✓ Successful requests: ${results.success}`, 'color: #4CAF50; font-weight: bold');
    console.log(`%c✗ Rate limited requests: ${results.rateLimited}`, 'color: #FF5722; font-weight: bold');
    console.log(`%c⚠ Error requests: ${results.errors}`, 'color: #FFC107; font-weight: bold');

    console.log('\n%cExpected Results:', 'font-weight: bold; text-decoration: underline');
    console.log('• First ~100 requests: ✓ Success (200)');
    console.log('• Remaining ~10 requests: ✗ Rate Limited (429)');

    console.log('\n%cActual Results:', 'font-weight: bold; text-decoration: underline');
    const percentage = ((results.success / totalRequests) * 100).toFixed(1);
    console.log(`• Success rate: ${percentage}%`);
    console.log(`• Rate limit triggered: ${results.rateLimited > 0 ? '✓ Yes' : '✗ No'}`);

    if (results.rateLimited > 0) {
        console.log('\n%c✅ Rate limiting is working correctly!', 'font-size: 16px; color: #4CAF50; font-weight: bold; background: #E8F5E9; padding: 8px; border-radius: 4px');
    } else {
        console.log('\n%c⚠️ Rate limiting may not be working as expected', 'font-size: 16px; color: #FF9800; font-weight: bold; background: #FFF3E0; padding: 8px; border-radius: 4px');
    }

    console.log('\n%c💡 Tip: Check the Network tab to see the rate limit headers on each request', 'color: #2196F3; font-style: italic');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #888');

    // Store results in window for inspection
    window.rateLimitTestResults = results;
    console.log('\n%cℹ️ Full results stored in: window.rateLimitTestResults', 'color: #9E9E9E; font-style: italic');
})();
