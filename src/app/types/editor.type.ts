export interface Document {
    id: string;
    document_id: string;
    title: string | null;
    description: string | null;
    topic: string | null;
    category: string | null;
    status: string;
    updated_at: string;
    created_at?: string;
    owner_id?: string;
    content?: string;
    reviewed_by?: string;
    reviewed_at?: string;
}

export interface DocumentWithUser extends Document {
    owner: {
        id: string;
        name: string;
        email: string;
        avatar_url?: string;
    };
}

export interface DocumentsGridProps {
    initialDocuments: Document[];
}