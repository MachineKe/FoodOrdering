import products from '@/assets/data/products';
import { View } from 'react-native';
import ProductListItem from '@/src/components/ProductListItem';



export default function MenuScreen() {
  return (
    <View>
      <ProductListItem product={products[0]} />
      <ProductListItem product={products[1]} />
    </View>
  );
}

