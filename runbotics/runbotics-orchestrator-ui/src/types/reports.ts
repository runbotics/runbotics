export interface CustomerActivity {
    id: string;
    createdAt: number;
    customer: {
        id: string;
        avatar: string | null;
        name: string;
    };
    description: string;
    type: string;
}

export type OrderStatus = 'complete' | 'pending' | 'rejected';

export interface Order {
    id: string;
    createdAt: number;
    currency: string;
    customer: {
        email: string;
        name: string;
    };
    items: number;
    number: string;
    status: OrderStatus;
    totalAmount: number;
}

export interface Product {
    id: string;
    conversionRate: number;
    currency: string;
    image: string;
    name: string;
    price: number;
    subscriptions: number;
}

export interface Project {
    id: string;
    author: {
        avatar: string | null;
        name: string;
    };
    budget: number;
    createdAt: number;
    currency: string;
    technologies: string[];
    title: string;
}

export interface Referral {
    color: string;
    initials: string;
    name: string;
    value: number;
}

interface TaskMember {
    avatar: string | null;
    name: string;
}

export interface Task {
    id: string;
    deadline: number | null;
    members: TaskMember[];
    title: string;
}
