import OrderStatus from './enumerations/order-status.model';
import { IOrderItem } from './order-item.model';

export interface IOrder {
    id?: number;
    currency?: string;
    created?: string;
    paymentMethod?: string;
    status?: OrderStatus;
    totalAmount?: number;
    items?: IOrderItem[];
    customerId?: number;
}

export const defaultValue: Readonly<IOrder> = {};
