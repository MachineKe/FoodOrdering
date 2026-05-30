import { useProduct } from '@/src/api/products';
import { usecart } from '@/src/app/providers/CartProvider';
import Button from '@/src/components/Button';
import RemoteImage from '@/src/components/RemoteImage';
import { PizzaSize } from '@/src/types';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';


const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL'];
export const defaultPizzaImage = 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

const productDetailScreen = () => {


  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ? idString : idString[0])


  const { data: product, error, isLoading } = useProduct(id);

  const { addItem } = usecart();

  const router = useRouter()

  const [selectedSize, setSelectedSize] = useState<PizzaSize>('M');




  if (isLoading) {
    return <ActivityIndicator />
  }

  if (error) {
    return <Text>Error: {error.message}</Text>
  }

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, selectedSize);
    router.push('/cart');
  }
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product.name }} />

      <RemoteImage path={product.image} fallback={defaultPizzaImage} style={styles.image} />

      <Text>Select Size:</Text>
      <View style={styles.sizeOption}>
        {sizes.map((size) => (
          <Pressable
            onPress={() => setSelectedSize(size)}
            key={size} style={[styles.sizeOptionContainer, { backgroundColor: selectedSize === size ? 'gainsboro' : 'white' }]}>
            <Text style={[styles.sizeOption, { color: selectedSize === size ? 'black' : 'grey' }]}>{size}</Text>
          </Pressable>
        ))}
      </View>
      <Text>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
      <Button text="Add to Cart" onPress={handleAddToCart} />
    </View>
  )
}

export default productDetailScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 10,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 'auto',
  },
  sizeOption: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  sizeOptionContainer: {
    backgroundColor: 'gainsboro',
    borderRadius: 25,
    alignItems: 'center',
    width: 50,
    justifyContent: 'center',
    aspectRatio: 1,
  },
});
