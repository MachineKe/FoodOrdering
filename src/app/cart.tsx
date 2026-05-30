import CartListItem from "@/src/components/CartListItem";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Alert, FlatList, Platform, Text, TextInput, View } from "react-native";
import Button from "../components/Button";
import { usecart } from "./providers/CartProvider";

export default function CartScreen() {
  const { items, total, checkout, isProcessing } = usecart();
  const [phoneNumber, setPhoneNumber] = useState('');

  const onCheckout = () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter your M-PESA phone number.');
      return;
    }
    checkout(phoneNumber);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={items}
        renderItem={({ item }) => <CartListItem cartItem={item} />}
        contentContainerStyle={{ gap: 10, padding: 10 }}
      />
      <Text style={{ marginTop: 20, fontSize: 20, fontWeight: '500', padding: 10 }}>
        Total: ${total.toFixed(2)}
      </Text>

      <TextInput
        placeholder="M-PESA Phone (e.g. 2547XXXXXXXX)"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={{
          borderWidth: 1,
          borderColor: 'gainsboro',
          padding: 10,
          borderRadius: 5,
          marginHorizontal: 10,
          marginBottom: 10,
          backgroundColor: 'white'
        }}
      />

      <Button
        text={isProcessing ? "Processing..." : "Checkout"}
        onPress={onCheckout}
        disabled={items.length === 0 || isProcessing}
      />

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

    </View>
  );
}