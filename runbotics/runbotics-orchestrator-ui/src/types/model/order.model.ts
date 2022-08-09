import { IOrderItem } from './order-item.model';
import OrderStatus from './enumerations/order-status.model';

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
