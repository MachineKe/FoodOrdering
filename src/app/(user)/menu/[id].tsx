import { View, Text, StyleSheet, Image,Pressable} from 'react-native'
import React, { useContext } from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import  products  from '@assets/data/products';
import { useState } from 'react';
import Button from '@/src/components/Button';
import { usecart } from '@/src/app/providers/CartProvider';
import { PizzaSize } from '@/src/types';


const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL'];

const productDetailScreen = () => {


  const { id } = useLocalSearchParams();

  const { addItem } = usecart();

  const router = useRouter()

  const [selectedSize, setSelectedSize] = useState<PizzaSize>('M');


const product = products.find((p) => p.id.toString() === id);

if (!product) {
  return <Text>Product not found</Text>;
}

const handleAddToCart = () => {
  if (!product) return;
  addItem(product, selectedSize);
  router.push('/cart');
}
  return (
    <View style={styles.container}>
    <Stack.Screen options={{ title:product.name}} />

<Image source={{ uri: product.image }} style={styles.image} />
      
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
    width:50,
    justifyContent: 'center',
    aspectRatio:1,
  },
});
