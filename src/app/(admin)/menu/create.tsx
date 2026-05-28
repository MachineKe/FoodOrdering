import Button from "@/src/components/Button";
import { defaultPizzaImage } from "@/src/components/ProductListItem";
import Colors from "@/src/constants/Colors";
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, View } from "react-native";

export default function CreateProductScreen() {

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [errors, setErrors] = useState('');


  const { id } = useLocalSearchParams();

  const isUpdating = !!id;

const onUpdateCreate = () =>{
  if(!validateInputs()){
    return
  }
console.warn('Updating product: ')
//save in database
resetFields()
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
    } if (!image) {
      setErrors('Please enter a product image');
      return false;
    }
    setErrors('');
    return true;
  }

  const onSubmit = () =>{
    if (isUpdating){
      onUpdateCreate()
    }else {
      onCreate()
    }
  }

  const onCreate = () => {
    if (!validateInputs()) {
      return;
    }
    console.warn('Creating product', name);
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
  
  const onDelete = ()=>{
    console.warn('Deleting product');
  }
  
  const confirmDelete = ()=>{
Alert.alert('Confirm Delete', 'Are you sure you want to delete this product?', [
  {text: 'Cancel', style: 'cancel'},
  {text: 'Delete', style: 'destructive', onPress: onDelete}
])
  }



  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: isUpdating ? 'Edit Product' : 'Create Product' }} />
      <Image source={{ uri: image || defaultPizzaImage }} style={styles.image} />
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
