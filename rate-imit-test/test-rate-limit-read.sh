#!/bin/bash

# Test Rate Limiting - Read Endpoint
echo "Testing READ rate limit (100 requests/60s) on /api/docs"
echo "=========================================================="
echo ""

success_count=0
rate_limited_count=0

for i in {1..110}
do
    response=$(curl -s -i http://localhost:3000/api/docs 2>&1)
    http_code=$(echo "$response" | grep "HTTP" | awk '{print $2}')
    remaining=$(echo "$response" | grep "x-ratelimit-remaining" | awk '{print $2}' | tr -d '\r')
    
    if [ "$http_code" = "200" ]; then
        ((success_count++))
        echo "Request $i: ✓ 200 OK (Remaining: $remaining)"
    elif [ "$http_code" = "429" ]; then
        ((rate_limited_count++))
        retry_after=$(echo "$response" | grep "retry-after" | awk '{print $2}' | tr -d '\r')
        echo "Request $i: ✗ 429 Rate Limited (Retry after: ${retry_after}s)"
    fi
    
    # Small delay to avoid overwhelming the server
    sleep 0.05
done

echo ""
echo "Summary:"
echo "--------"
echo "Successful requests: $success_count"
echo "Rate limited requests: $rate_limited_count"
echo ""
echo "Expected: ~100 successful, ~10 rate limited"
