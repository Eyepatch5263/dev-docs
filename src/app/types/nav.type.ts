export interface NavItem {
    title: string;
    slug: string;
    order: number;
}

export interface NavCategory {
    name: string;
    items: NavItem[];
}
