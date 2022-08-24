export interface IOrderItem {
    id?: number;
    quantity?: number;
    itemId?: number;
    orderId?: number;
}

export const defaultValue: Readonly<IOrderItem> = {};
