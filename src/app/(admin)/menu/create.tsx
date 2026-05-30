import { useDeleteProduct, useInsertProduct, useProduct, useUpdateProduct } from "@/src/api/products";
import Button from "@/src/components/Button";
import { defaultPizzaImage } from "@/src/components/ProductListItem";
import RemoteImage from "@/src/components/RemoteImage";
import Colors from "@/src/constants/Colors";
import { supabase } from '@/src/lib/supabase';
import { useQueryClient } from "@tanstack/react-query";
import { decode } from 'base64-arraybuffer';
import { randomUUID } from 'expo-crypto';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

export default function CreateProductScreen() {

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [errors, setErrors] = useState('');


  const { id } = useLocalSearchParams();
  const router = useRouter();

  const isUpdating = !!id;

  const parsedId = parseFloat(typeof id === 'string' ? id : id?.[0]);
  const { data: updatingProduct } = useProduct(parsedId);

  useEffect(() => {
    if (updatingProduct) {
      setName(updatingProduct.name);
      setPrice(updatingProduct.price.toString());
      setImage(updatingProduct.image);
    }
  }, [updatingProduct]);

  const { mutate: InsertProduct } = useInsertProduct()
  const { mutate: updateProduct } = useUpdateProduct()
  const { mutate: deleteProduct } = useDeleteProduct()
  const queryClient = useQueryClient();

  const uploadImage = async () => {
    if (!image?.startsWith('file://')) {
      return null;
    }

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: 'base64',
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = 'image/png';
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, decode(base64), { contentType });

    if (data) {
      return data.path;
    }
  };

  const onUpdateCreate = async () => {
    if (!validateInputs()) {
      return
    }

    const imagePath = await uploadImage();

    updateProduct(
      { id, name, price: parseFloat(price), image: imagePath || image },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['products'] });
          const parsedId = parseFloat(typeof id === 'string' ? id : id?.[0]);
          queryClient.invalidateQueries({ queryKey: ['products', parsedId] });
          Alert.alert('Success', 'Product updated successfully');
          resetFields();
          router.back();
        },
        onError: () => {
          Alert.alert('Error', 'Failed to update product');
        },
      }
    )
  }

  const resetFields = () => {
    setName('');
    setPrice('');
    setImage(null);
  }

  const validateInputs = () => {
    if (!name) {
      setErrors('Please enter a product name');
      return false;
    } if (!price) {
      setErrors('Please enter a product price');
      return false;
    }
    setErrors('');
    return true;
  }

  const onSubmit = () => {
    if (isUpdating) {
      onUpdateCreate()
    } else {
      onCreate()
    }
  }

  const onCreate = async () => {
    if (!validateInputs()) {
      return;
    }

    const imagePath = await uploadImage();

    InsertProduct(
      { name, price: parseFloat(price), image: imagePath || image },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['products'] });
          Alert.alert('Success', 'Product created successfully');
          resetFields();
          router.push('/(admin)/menu');
        },
        onError: () => {
          Alert.alert('Error', 'Failed to create product');
        },
      }
    )
  }

  const pickImage = async () => {
    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onDelete = () => {
    if (!id) return;
    const parsedId = parseFloat(typeof id === 'string' ? id : id?.[0]);

    deleteProduct(parsedId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        Alert.alert('Success', 'Product deleted successfully');
        resetFields();
        router.replace('/(admin)/menu');
      },
      onError: () => {
        Alert.alert('Error', 'Failed to delete product');
      }
    });
  }

  const confirmDelete = () => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete }
    ])
  }



  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: isUpdating ? 'Edit Product' : 'Create Product' }} />
      <RemoteImage path={image} fallback={defaultPizzaImage} style={styles.image} />
      <Text style={styles.textButton} onPress={pickImage}>Select Image</Text>
      <Text style={styles.title}>{isUpdating ? 'Edit Product' : 'Create Product'}</Text>
      <Text style={styles.label}>Product Name</Text>
      <TextInput style={styles.input} placeholder="Product Name" onChangeText={setName} value={name} />
      <Text style={styles.label}>Product Price</Text>
      <TextInput style={styles.input} placeholder="Product Price" keyboardType="numeric" onChangeText={setPrice} value={price} />
      <Text style={styles.label}>Product Image</Text>
      <TextInput style={styles.input} placeholder="Product Image" onChangeText={setImage} value={image} />
      <Text style={{ color: 'red' }}>{errors}</Text>
      <Button text={isUpdating ? 'Update Product' : 'Create Product'} onPress={onSubmit} />
      {isUpdating && <Text onPress={confirmDelete} style={styles.textButton}>Delete</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  title: {
    color: 'gray',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    color: 'gray',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
  },
  image: {
    width: '50%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginVertical: 10,
  }
});
