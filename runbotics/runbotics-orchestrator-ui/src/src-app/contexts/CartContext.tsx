import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

import { useSnackbar } from 'notistack';

import { MarketplaceOffer } from '#contentful/common';

import { translate } from '#src-app/hooks/useTranslations';

import { useTypedLocalStorage } from '../hooks/useTypedLocalStorage';

export type CartItem = Omit<MarketplaceOffer, 'tags' | 'body' | 'description' | 'industries' | 'status'> & {
    quantity: number;
    selectedParameters?: {
        name: string;
        selectedOption: string;
    }[];
};

export interface ContactFormValue {
    name: string;
    email: string ;
    phone: string;
    additionalInfo: string;
}

interface CartContextType {
    cart: CartItem[];
    contactFormValue: ContactFormValue;
    changeFormValue: (key: keyof ContactFormValue, value: string) => void;
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    selectedCartItems: string[];
    setSelectedCartItems: Dispatch<SetStateAction<string[]>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useTypedLocalStorage<CartItem[]>('cart', []);
    const [contactFormValue, setContactFormValue] = useState<ContactFormValue>({
        name: '',
        email: '',
        phone: '',
        additionalInfo: '',
    });
    const [selectedCartItems, setSelectedCartItems] = useState<string[]>(cart.map(item => item.slug) ?? []);
    const {enqueueSnackbar} = useSnackbar();
    
    const changeFormValue = (key: keyof ContactFormValue, value: string) => {
        setContactFormValue((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

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
        enqueueSnackbar(translate('Marketplace.Cart.SuccessAdded'), {
            variant: 'success',
            autoHideDuration: 5000,
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
        <CartContext.Provider value={{ 
            cart, 
            contactFormValue,
            changeFormValue,  
            addToCart, 
            removeFromCart,
            clearCart,
            selectedCartItems,
            setSelectedCartItems
        }}>
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
