export interface Category {
    _id: string;
    name: string;
    parentId?: string | null;
}