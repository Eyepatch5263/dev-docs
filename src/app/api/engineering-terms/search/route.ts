import { NextRequest, NextResponse } from 'next/server';
import { searchTerms } from '@/lib/elasticsearch';
import { rateLimitMiddleware } from '@/app/middleware/rateLimit';
import { READ_RATE_LIMIT } from '@/lib/rate-limit-config';

export async function GET(request: NextRequest) {
    // Apply rate limiting
    const rateLimitResult = await rateLimitMiddleware(request, READ_RATE_LIMIT)
    if (!rateLimitResult.allowed) {
        return NextResponse.json(
            {
                error: 'Too many requests',
                retryAfter: rateLimitResult.retryAfter
            },
            {
                status: 429,
                headers: rateLimitResult.headers
            }
        )
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    try {
        const result = await searchTerms(query);

        return NextResponse.json({
            success: true,
            terms: result.terms,
            total: result.total,
            source: result.source,
        }, {
            headers: rateLimitResult.headers
        });
    } catch (error) {
        console.error('Search API error:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Search failed. Please try again.',
                terms: [],
                total: 0,
            },
            {
                status: 500,
                headers: rateLimitResult.headers
            }
        );
    }
}
