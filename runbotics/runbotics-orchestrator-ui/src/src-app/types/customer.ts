export interface Customer {
    id: string;
    address1?: string;
    address2?: string;
    avatar?: string;
    balance?: number;
    city?: string;
    country?: string;
    creditCard?: string;
    currency?: string;
    email: string;
    hasAcceptedMarketing?: boolean;
    hasDiscountedPrices?: boolean;
    isProspect?: boolean;
    isReturning?: boolean;
    isVerified?: boolean;
    name: string;
    phone?: string;
    state?: string;
    totalAmountSpent?: number;
    totalOrders?: number;
    updatedAt?: number;
    vatRate?: number;
    zipCode?: string;
}

export interface CustomerLog {
    id: string;
    createdAt: number;
    description: string;
    ip: string;
    method: string;
    route: string;
    status: number;
}

export interface CustomerEmail {
    id: string;
    description: string;
    createdAt: number;
}

export interface Invoice {
    id: string;
    currency: string;
    description: string;
    issueDate: number;
    paymentMethod: string;
    status: string;
    value: number;
}
