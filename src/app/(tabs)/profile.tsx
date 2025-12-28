import { ScrollView, View } from "react-native";

export default function ProfileScreen() {
  console.log("asdasd");

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{ backgroundColor: "red", width: "100%", height: 100 }}
      ></View>
      <View
        style={{ backgroundColor: "purple", width: "100%", height: 100 }}
      ></View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 2, paddingBottom: 0 }}
        style={{ backgroundColor: "blue", flex: 0 }}
      ></ScrollView>
      <View
        style={{ backgroundColor: "purple", width: "100%", flex: 1 }}
      ></View>
    </View>
  );
}
