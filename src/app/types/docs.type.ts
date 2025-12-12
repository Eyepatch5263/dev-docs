export interface DocMeta {
    slug: string;
    title: string;
    description?: string;
    image?: string;
    order?: number;
    category?: string;
}

export interface DocContent extends DocMeta {
    content: string;
}


export interface TopicMeta {
    id: string;
    title: string;
    description: string;
    icon?: string;
    color?: string;
    articles?: number;
}