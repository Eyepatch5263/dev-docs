#!/bin/bash

# Test Rate Limiting - Write Endpoint
echo "Testing WRITE rate limit (20 requests/60s) on /api/subscribe"
echo "=============================================================="
echo ""

success_count=0
rate_limited_count=0
error_count=0

for i in {1..25}
do
    response=$(curl -s -i -X POST http://localhost:3000/api/subscribe \
        -H "Content-Type: application/json" \
        -d '{"email":"test@example.com"}' 2>&1)
    
    http_code=$(echo "$response" | grep "HTTP" | awk '{print $2}')
    remaining=$(echo "$response" | grep "x-ratelimit-remaining" | awk '{print $2}' | tr -d '\r')
    
    if [ "$http_code" = "200" ]; then
        ((success_count++))
        echo "Request $i: ✓ 200 OK (Remaining: $remaining)"
    elif [ "$http_code" = "429" ]; then
        ((rate_limited_count++))
        retry_after=$(echo "$response" | grep "retry-after" | awk '{print $2}' | tr -d '\r')
        echo "Request $i: ✗ 429 Rate Limited (Retry after: ${retry_after}s)"
    else
        ((error_count++))
        echo "Request $i: ⚠ $http_code (Other error)"
    fi
    
    # Small delay to avoid overwhelming the server
    sleep 0.05
done

echo ""
echo "Summary:"
echo "--------"
echo "Successful requests: $success_count"
echo "Rate limited requests: $rate_limited_count"
echo "Other errors: $error_count"
echo ""
echo "Expected: ~20 successful, ~5 rate limited"
