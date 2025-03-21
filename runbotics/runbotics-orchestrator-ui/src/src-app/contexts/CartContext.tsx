import { createContext, ReactNode, useContext } from 'react';

import { MarketplaceOffer } from '#contentful/common';

import { useTypedLocalStorage } from '../hooks/useTypedLocalStorage';

export type CartItem = Omit<MarketplaceOffer, 'tags' | 'body' | 'description' | 'industries' | 'status'> & {
    quantity: number;
    selectedParameters?: string[];
};

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useTypedLocalStorage<CartItem[]>('cart', []);

    const addToCart = (item: CartItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((i) => i.slug === item.slug);
            if (existingItem) {
                return prevCart.map((i) =>
                    i.slug === item.slug ? { ...i, quantity: i.quantity + item.quantity } : i,
                );
            }
            return [...prevCart, item];
        });
    };

    const updateCartItem = (id: string, updates: Partial<CartItem>) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.slug === id
                    ? { ...item, ...updates, quantity: updates.quantity ?? item.quantity }
                    : item
            ).filter(item => item.quantity > 0)
        );
    };

    const removeFromCart = (id: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.slug !== id));
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
