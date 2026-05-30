import { useOrderList } from '@/src/api/orders';
import OrderListItem from '@/src/components/OrderListItem';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Text } from 'react-native';

export default function OrdersScreen() {
    const { data: orders, isLoading, error, refetch } = useOrderList({ archived: true });
    const [refreshing, setRefreshing] = useState(false);

    if (isLoading) {
        return <ActivityIndicator />;
    }
    if (error) {
        return <Text>Failed to fetch</Text>;
    }

    const onRefresh = async () => {
        setRefreshing(true);
        if (refetch) await refetch();
        setRefreshing(false);
    };

    return (
        <FlatList data={orders} renderItem={({ item }) => <OrderListItem order={item} />}
            contentContainerStyle={{ gap: 10, padding: 10 }}
            refreshing={refreshing}
            onRefresh={onRefresh}
        />)
}