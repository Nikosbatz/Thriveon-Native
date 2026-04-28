import { useBarcodeFoodStore } from "@/src/store/useBarcodeFoodStore";
import { useIsFocused } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Linking, View } from "react-native";
import { Text } from "react-native-paper";
import Toast from "react-native-toast-message";

export default function BarcodeScanner() {
  const [scanned, setScanned] = useState(false);
  const isFocused = useIsFocused(); // Returns true when tab is active
  const [scannerCounter, setScannerCounter] = useState(0);
  const [dataFreq, setDataFreq] = useState<Record<string, number>>({});
  const [permission, requestPermission] = useCameraPermissions();
  const barcodeStoreFetchFood = useBarcodeFoodStore((state) => state.fetchFood);
  const router = useRouter();

  useEffect(() => {
    if (isFocused) {
      setScanned(false);
      setScannerCounter(0);
      setDataFreq({});
    }
  }, [isFocused]);

  useEffect(() => {
    if (!permission) return; // Wait until permission object is loaded

    if (!permission.granted) {
      if (permission.canAskAgain) {
        requestPermission();
      } else {
        // The user denied it and we can't ask anymore
        Alert.alert(
          "Permission Required",
          "Camera access is required to scan barcodes. Please enable it in settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ],
        );
      }
    }
  }, [permission]);

  async function handlebarcodeScanned(data: { data: string }) {
    setScannerCounter((prev) => prev + 1);
    const value = data["data"];
    setDataFreq({
      ...dataFreq,
      [value]: dataFreq[value] ? dataFreq[value] + 1 : 1,
    });

    // Find the value with the maximum frequency
    if (scannerCounter > 5) {
      const maxKey = Object.entries(dataFreq).reduce((max, curr) =>
        curr[1] < max[1] ? curr : max,
      );
      const code = maxKey[0];
      setScanned(true);
      setDataFreq({});
      setScannerCounter(0);
      try {
        await barcodeStoreFetchFood(code);
        router.replace("/calorieTracker/barcodeFoodScreen");
        setScanned(false);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Could not find food!",
          text2: "Seems like this food does not exist in our database...",
        });
        router.back();
        setScanned(false);
      }
    }
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: "black", justifyContent: "center" }}
    >
      {scanned ? null : (
        <CameraView
          facing={"back"}
          style={{ backgroundColor: "red", flex: 1 }}
          onBarcodeScanned={({ data }) => handlebarcodeScanned({ data })}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "ean13", "upc_a"],
          }}
        />
      )}

      {/* Frame and hint text */}
      {scanned ? null : (
        <View
          style={{
            position: "absolute",
            alignSelf: "center",
            borderWidth: 8,
            borderColor: "rgb(224, 224, 224)",
            borderRadius: 15,
            width: "75%",
            height: "22%",
          }}
        >
          <Text
            style={{
              top: "-100%",
              alignSelf: "center",
              backgroundColor: "rgba(24, 24, 24, 0.55)",
              color: "rgba(255, 255, 255, 0.8)",
              padding: 5,
              borderRadius: 10,
            }}
          >
            Place the barcode within the frame
          </Text>
        </View>
      )}

      {/* Text for testing purposes */}
      {/* {scanned ? null : (
        <Text
          style={{ backgroundColor: "red", position: "absolute", top: 100 }}
          onPress={() => handlebarcodeScanned({ data: "100000006535" })}
        >
          {" "}
          100000006535
        </Text>
      )} */}
    </View>
  );
}
