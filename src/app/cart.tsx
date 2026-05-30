import CartListItem from "@/src/components/CartListItem";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Alert, FlatList, Platform, Text, TextInput, KeyboardAvoidingView } from "react-native";
import Button from "../components/Button";
import { usecart } from "./providers/CartProvider";

export default function CartScreen() {
  const { items, total, checkout, isProcessing } = usecart();
  const [phoneNumber, setPhoneNumber] = useState('254');

  const onCheckout = () => {
    if (!phoneNumber || !phoneNumber.startsWith('254') || phoneNumber.length !== 12) {
      Alert.alert('Invalid Number', 'Please enter a valid 12-digit M-PESA phone number starting with 254 (e.g., 2547XXXXXXXX).');
      return;
    }
    checkout(phoneNumber);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={{ flex: 1 }}
    >
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
        maxLength={12}
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
    </KeyboardAvoidingView>
  );
}