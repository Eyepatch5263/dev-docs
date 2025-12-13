import { NextRequest, NextResponse } from 'next/server';
import { searchTerms } from '@/lib/elasticsearch';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    try {
        const result = await searchTerms(query);

        return NextResponse.json({
            success: true,
            terms: result.terms,
            total: result.total,
            source: result.source,
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
            { status: 500 }
        );
    }
}
