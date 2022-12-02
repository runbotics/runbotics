export type InventoryType = 'in_stock' | 'limited' | 'out_of_stock';

export interface Product {
    id: string;
    attributes: string[];
    category: string;
    createdAt: number;
    currency: string;
    image: string | null;
    inventoryType: InventoryType;
    isAvailable: boolean;
    isShippable: boolean;
    name: string;
    price: number;
    quantity: number;
    updatedAt: number;
    variants: number;
}
