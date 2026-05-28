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


  const router = useRouter()

  const [selectedSize, setSelectedSize] = useState<PizzaSize>('M');


const product = products.find((p) => p.id.toString() === id);

if (!product) {
  return <Text>Product not found</Text>;
}


  return (
    <View style={styles.container}>
    <Stack.Screen options={{ title:product.name}} />

<Image source={{ uri: product.image }} style={styles.image} />
      
      
      <Text>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
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
  },

});
