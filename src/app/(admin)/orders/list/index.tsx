import { useInsertOrderSubscription, useOrderList } from '@/src/api/orders';
import OrderListItem from '@/src/components/OrderListItem';
import { ActivityIndicator, FlatList, Text } from 'react-native';

export default function OrdersScreen() {

    useInsertOrderSubscription();

    const { data: orders, isLoading, error } = useOrderList({ archived: false });
    if (isLoading) {
        return <ActivityIndicator />;
    }
    if (error) {
        return <Text>Failed to fetch</Text>;
    }


    return (
        <FlatList data={orders} renderItem={({ item }) => <OrderListItem order={item} />}
            contentContainerStyle={{ gap: 10, padding: 10 }}
        />)
}