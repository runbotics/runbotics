export interface IItem {
    id?: number;
    name?: string;
    price?: number;
    description?: string;
    image?: string;
    group?: string;
}

export const defaultValue: Readonly<IItem> = {};
