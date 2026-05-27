import products from '@/assets/data/products';
import Colors from '@/src/constants/Colors';
import { Image, StyleSheet, Text, View } from 'react-native';

const product = products[1];

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: Colors.light.tint,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
