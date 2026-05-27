import CartListItem from "@/src/components/CartListItem";
import { StatusBar } from "expo-status-bar";
import { FlatList, Platform, Text, View } from "react-native";
import { usecart } from "./providers/CartProvider";
import Button from "../components/Button";

export default function CartScreen() {
  const { items, total } = usecart();

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

      <Button text="Checkout" />

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

    </View>
  );
}