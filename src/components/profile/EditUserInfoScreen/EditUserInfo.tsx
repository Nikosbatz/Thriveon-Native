import { useAuth } from "@/src/context/authContext";
import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";

export default function EditUserInfo() {
  const { user } = useAuth();

  return (
    <View>
      <TextInput mode="outlined" placeholder="Email" />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {},
});
