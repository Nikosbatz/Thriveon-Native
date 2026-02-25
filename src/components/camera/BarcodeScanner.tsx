import { CameraView, useCameraPermissions } from "expo-camera";
import { TouchableOpacity, View } from "react-native";

export default function BarcodeScanner() {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission?.granted) {
    requestPermission();
  }

  console.log("adsada");
  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <CameraView facing={"back"} style={{ backgroundColor: "red", flex: 1 }} />
      <View>
        <TouchableOpacity></TouchableOpacity>
      </View>
    </View>
  );
}
