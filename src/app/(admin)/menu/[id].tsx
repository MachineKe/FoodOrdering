import { useProduct } from '@/src/api/products';
import Colors from '@/src/constants/Colors';
import { PizzaSize } from '@/src/types';
import { FontAwesome } from '@expo/vector-icons';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';

const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL'];

const productDetailScreen = () => {
  const { id:idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ? idString : idString[0])


  const {data: product,error,isLoading} = useProduct(id);



  const router = useRouter()

  const [selectedSize, setSelectedSize] = useState<PizzaSize>('M');



if (isLoading){
  return <ActivityIndicator/>
}

if (error){
  return <Text>Error: {error.message}</Text>
}



  return (
    <View style={styles.container}>


      <Stack.Screen options={{
        title: product.name, headerRight: () => (
          <Link href={`/(admin)/menu/create?id=${id}`} asChild>
            <Pressable>
              {({ pressed }) => (
                <FontAwesome
                  name="pencil"
                  size={25}
                  color={Colors.light.tint}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          </Link>
        )
      }} />

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
