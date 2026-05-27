import { CartItem, Product } from '@/types';
import { randomUUID } from 'expo-crypto';
import React, { createContext, useContext } from 'react';

type CartType = {
    items: CartItem[];
    setItems: (items: CartItem[]) => void;
    addItem: (product: Product, size: CartItem['size']) => void;
    updateQuantity: (itemId: string, amount: -1 | 1) => void;
    total: number;
}


const CartContext = createContext<CartType>({
    items: [] as CartItem[],
    setItems: (items: CartItem[]) => { },
    addItem: (product: Product, size: CartItem['size']) => { },
    updateQuantity: (itemId: string, amount: -1 | 1) => { },
    total: 0,
})


const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = React.useState<CartItem[]>([])

    const addItem = (product: Product, size: CartItem['size']) => {
        const existingItem = items.find(
            (item) => item.product.id === product.id && item.size === size
        );

        if (existingItem) {
            updateQuantity(existingItem.id, 1);
            return;
        }

        const newCartItem: CartItem = {
            id: randomUUID(),
            product,
            quantity: 1,
            size
        } as CartItem;
        setItems([...items, newCartItem])
    }

    const updateQuantity = (itemId: string, amount: -1 | 1) => {
        setItems(
            items.map((item) =>
                item.id === itemId ? { ...item, quantity: item.quantity + amount } : item
            ).filter((item) => item.quantity > 0)
        );
    };

    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, setItems, updateQuantity, total }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider

export const usecart = () => useContext(CartContext)
