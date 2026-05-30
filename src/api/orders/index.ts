import { useAuth } from '@/src/app/providers/AuthProvider';
import { supabase } from '@/src/lib/supabase';
import { Order, OrderStatus } from '@/src/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export const useMyOrders = () => {
    const { session } = useAuth();
    const id = session?.user?.id;

    return useQuery<Order[]>({
        queryKey: ['orders', { userId: id }],
        queryFn: async () => {
            if (!id) return [];

            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', id)
                .order('created_at', { ascending: false });
            if (error) {
                throw new Error(error.message);
            }
            return data as Order[];
        },
    });
};

export const useInsertOrderSubscription = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const ordersSubscription = supabase
            .channel('custom-insert-channel')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'orders' },
                () => {
                    queryClient.invalidateQueries({ queryKey: ['orders'] });
                }
            )
            .subscribe();

        return () => {
            ordersSubscription.unsubscribe();
        };
    }, []);
};

export const useUpdateOrderSubscription = (id: number) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (isNaN(id)) return;

        const ordersSubscription = supabase
            .channel(`orders-filter-${id}`)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${id}` },
                () => {
                    queryClient.invalidateQueries({ queryKey: ['order', id] });
                    queryClient.invalidateQueries({ queryKey: ['orders'] });
                }
            )
            .subscribe();

        return () => {
            ordersSubscription.unsubscribe();
        };
    }, [id]);
};

export const useOrderList = ({ archived = false }: { archived: boolean }) => {
    const statuses: OrderStatus[] = archived
        ? ['Delivered']
        : ['New', 'Cooking', 'Delivering'];

    return useQuery<Order[]>({
        queryKey: ['orders', { archived }],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .in('status', statuses)
                .order('created_at', { ascending: false });
            if (error) {
                throw new Error(error.message);
            }
            return data as Order[];
        },
    });
};

export const useOrderDetails = (id: number) => {
    return useQuery<Order>({
        queryKey: ['order', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('*, order_items(*, products(*))')
                .eq('id', id)
                .single();
            if (error) {
                throw new Error(error.message);
            }
            return data as Order;
        },
        enabled: !isNaN(id)
    });
};

export const useInsertOrder = () => {
    const queryClient = useQueryClient();
    const { session } = useAuth();
    const userId = session?.user?.id;

    return useMutation({
        async mutationFn({ total }: Pick<Order, 'total'>) {
            if (!userId) return null;

            const { error, data } = await supabase
                .from('orders')
                .insert({
                    total,
                    user_id: userId,
                })
                .select();

            if (error) {
                throw error;
            }
            return data[0];
        },
        async onSuccess() {
            await queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
        onError(error) {
            console.log(error);
        },
    });
};

export const useUpdateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        async mutationFn({ id, status }: Pick<Order, 'id' | 'status'>) {
            const { data, error } = await supabase
                .from('orders')
                .update({ status })
                .eq('id', id)
                .select();

            if (error) {
                throw error;
            }
            return data;
        },
        async onSuccess(_, { id }) {
            await queryClient.invalidateQueries({ queryKey: ['orders'] });
            await queryClient.invalidateQueries({ queryKey: ['order', id] });
        },
        onError(error) {
            console.log(error);
        },
    });
};