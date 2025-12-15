import { Header } from '@/components/Header';
import { EngineeringTermsClient } from './EngineeringTermsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Engineering Terms - Explainbytes',
    description: 'A fast, searchable dictionary of core software engineering concepts. Search for any engineering term like Latency, Deadlock, Quorum, and more.',
    keywords: [
        'engineering terms',
        'software engineering glossary',
        'developer dictionary',
        'system design terms',
        'database terms',
        'networking concepts',
    ],
};

export default function EngineeringTermsPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header githubHidden={true} />
            <EngineeringTermsClient />
        </div>
    );
}
