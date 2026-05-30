import { useInsertOrderItems } from '@/src/api/order-items';
import { useInsertOrder, useInitiateMpesaPayment } from '@/src/api/orders';
import { CartItem, Tables } from '@/src/types';
import { randomUUID } from 'expo-crypto';
import { useRouter } from 'expo-router';
import React, { createContext, useContext } from 'react';
import { Alert } from 'react-native';
type Product = Tables<'products'>


type CartType = {
    items: CartItem[];
    setItems: (items: CartItem[]) => void;
    addItem: (product: Product, size: CartItem['size']) => void;
    updateQuantity: (itemId: string, amount: -1 | 1) => void;
    total: number;
    checkout: (phoneNumber: string) => void;
    isProcessing: boolean;
}


const CartContext = createContext<CartType>({
    items: [] as CartItem[],
    setItems: (items: CartItem[]) => { },
    addItem: (product: Product, size: CartItem['size']) => { },
    updateQuantity: (itemId: string, amount: -1 | 1) => { },
    total: 0,
    checkout: (phoneNumber: string) => { },
    isProcessing: false,
})


const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { mutate: insertOrder } = useInsertOrder();
    const { mutate: insertOrderItems } = useInsertOrderItems();
    const { mutate: initiatePayment } = useInitiateMpesaPayment();
    const router = useRouter();

    const [items, setItems] = React.useState<CartItem[]>([])
    const [isProcessing, setIsProcessing] = React.useState(false);

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
            product_id: product.id,
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

    const checkout = (phoneNumber: string) => {
        setIsProcessing(true);
        insertOrder(
            { total },
            {
                onSuccess: (newOrder) => saveOrderItems(newOrder, phoneNumber),
                onError: () => {
                    setIsProcessing(false);
                    Alert.alert('Error', 'Failed to create order.');
                }
            }
        );
    };

    const saveOrderItems = (newOrder: any, phoneNumber: string) => {
        if (!newOrder) {
            setIsProcessing(false);
            return;
        }

        insertOrderItems(
            {
                items,
                order_id: newOrder.id,
            },
            {
                onSuccess() {
                    initiatePayment(
                        { phoneNumber, amount: total, orderId: newOrder.id },
                        {
                            onSuccess: () => {
                                setItems([]);
                                setIsProcessing(false);
                                Alert.alert('Payment Initiated', 'Please check your phone and enter your M-PESA PIN to complete the order.');
                                router.push(`/(user)/orders/${newOrder.id}`);
                            },
                            onError: (error) => {
                                setIsProcessing(false);
                                Alert.alert('Payment Error', 'There was an issue initiating your checkout. Your items are still in the cart.');
                                console.error(error);
                            }
                        }
                    );
                },
                onError: () => {
                    setIsProcessing(false);
                    Alert.alert('Error', 'Failed to save order items.');
                }
            }
        );
    };

    return (
        <CartContext.Provider value={{ items, addItem, setItems, updateQuantity, total, checkout, isProcessing }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider

export const usecart = () => useContext(CartContext)
