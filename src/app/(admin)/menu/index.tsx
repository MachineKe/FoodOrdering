import { useProductList } from '@/src/api/products';
import ProductListItem from '@/src/components/ProductListItem';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Text } from 'react-native';


export default function MenuScreen() {
  const { data: products, error, isLoading, refetch } = useProductList();
  const [refreshing, setRefreshing] = useState(false);

  if (isLoading) {
    return <ActivityIndicator />
  }

  if (error) {
    return <Text>Error: {error.message}</Text>
  }

  const onRefresh = async () => {
    setRefreshing(true);
    if (refetch) await refetch();
    setRefreshing(false);
  };

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductListItem product={item} />}
      numColumns={2}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      columnWrapperStyle={{ gap: 10 }}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}
