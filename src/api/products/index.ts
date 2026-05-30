import { supabase } from '@/src/lib/supabase';
import { useMutation, useQuery } from '@tanstack/react-query';


export const useProductList = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const { data, error } = await supabase.from('products').select('*');
            if (error) {
                throw new Error(error.message);
            }
            return data;
        }
    });

}

export const useProduct = (id: number) => {
    return useQuery({
        queryKey: ['products', id],
        queryFn: async () => {
            const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
            if (error) {
                throw new Error(error.message);
            }
            return data;
        },
        enabled: !isNaN(id),
    });
}

export const useInsertProduct = () => {
    return useMutation({
        async mutationFn(data: any) {
            const { error, data: newProduct } = await supabase.from('products').insert({
                name: data.name,
                image: data.image,
                price: data.price,
            }).single()
            if (error) {
                throw new Error(error.message);
            }
            return newProduct
        }
    })
}

export const useUpdateProduct = () => {
    return useMutation({
        async mutationFn(data: any) {
            const { error, data: updatedProduct } = await supabase.from('products').update({
                name: data.name,
                image: data.image,
                price: data.price,
            }).eq('id', data.id).select().single()
            if (error) {
                throw new Error(error.message);
            }
            return updatedProduct
        }
    })
}

export const useDeleteProduct = () => {
    return useMutation({
        async mutationFn(id: number) {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) {
                throw new Error(error.message);
            }
        }
    })
}