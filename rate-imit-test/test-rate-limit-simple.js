/**
 * SIMPLE VERSION - Quick Rate Limit Test
 * 
 * Copy and paste this into your browser console for a quick test.
 */

// Make 110 requests to /api/docs
let success = 0, rateLimited = 0;

for (let i = 1; i <= 110; i++) {
    fetch('/api/docs')
        .then(r => {
            if (r.status === 200) success++;
            else if (r.status === 429) rateLimited++;

            const remaining = r.headers.get('x-ratelimit-remaining');
            console.log(`Request ${i}: ${r.status} | Remaining: ${remaining}`);

            if (i === 110) {
                console.log(`\n✅ Success: ${success} | ❌ Rate Limited: ${rateLimited}`);
            }
        });
}
