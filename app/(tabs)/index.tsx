import { Text, View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import ImageViewer from "@/Components/ImageViewer";
import Button from "@/Components/Button";
import { FooterComponent } from "react-native-screens/lib/typescript/components/ScreenFooter";
const PlaceholderImage = require("../../assets/images/icon.png");

export default function Index() {
  return (
    <View style={{ flex:1, justifyContent: "center", alignItems:"center" }}>
      <Text>Home</Text>
    </View>
  );
}
