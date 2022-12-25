export class Category {
    id?: string;
    name?: string;
    icon?: string;
    color?: string;
}

export interface GetCategoriesServerResponse {
    success: boolean;
    categories: Category[];
}