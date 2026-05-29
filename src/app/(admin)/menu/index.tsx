import { FlatList } from 'react-native';
import ProductListItem from '@/src/components/ProductListItem';
import { useProductList } from '@/src/api/products';
import { ActivityIndicator, Text } from 'react-native';


export default function MenuScreen() {
  const {data:products,error,isLoading} = useProductList();
  
  if (isLoading){
    return <ActivityIndicator/>
  }
  
  if (error){
    return <Text>Error: {error.message}</Text>
  }
  
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductListItem product={item} />}
      numColumns={2}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      columnWrapperStyle={{ gap: 10 }}
    />
  );
}

