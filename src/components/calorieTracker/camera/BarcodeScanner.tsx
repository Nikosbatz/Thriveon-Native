import { useBarcodeFoodStore } from "@/src/store/useBarcodeFoodStore";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function BarcodeScanner() {
  const [scanned, setScanned] = useState(false);
  const [scannerCounter, setScannerCounter] = useState(0);
  const [dataFreq, setDataFreq] = useState<Record<string, number>>({});
  const [permission, requestPermission] = useCameraPermissions();
  const barcodeStoreFetchFood = useBarcodeFoodStore((state) => state.fetchFood);
  const barcodeStoreFood = useBarcodeFoodStore((state) => state.food);
  const router = useRouter();

  const overlayColor = "rgba(0, 0, 0, 0.3)";

  if (!permission?.granted) {
    requestPermission();
  }

  async function handlebarcodeScanned(data: { data: string }) {
    setScannerCounter((prev) => prev + 1);
    const value = data["data"];
    setDataFreq({
      ...dataFreq,
      [value]: dataFreq[value] ? dataFreq[value] + 1 : 1,
    });

    // Find the value with the maximum frequency
    if (scannerCounter > 2) {
      const maxKey = Object.entries(dataFreq).reduce((max, curr) =>
        curr[1] < max[1] ? curr : max,
      );
      const code = maxKey[0];
      await barcodeStoreFetchFood(code);
      setScanned(true);
      setDataFreq({});
      setScannerCounter(0);
      router.navigate("/calorieTracker/barcodeFoodScreen");
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

      {/* Overlay Appearing after a barcode is scanned */}
      {/* {barcodeStoreLoadingFood ? <LoadingOverlay /> : null} */}

      {/* Text for testing purposes */}
      <Text
        style={{ backgroundColor: "red" }}
        onPress={() => handlebarcodeScanned({ data: "100000006535" })}
      >
        {" "}
        100000006535
      </Text>

      {/* Food data */}
      {scanned ? (
        <View>
          <Text
            variant="labelLarge"
            style={{ color: "white", fontSize: 30, lineHeight: 50 }}
          >
            {barcodeStoreFood?.name}|{barcodeStoreFood?.brands}|protein:
            {barcodeStoreFood?.protein}|calories: {barcodeStoreFood?.calories}|
          </Text>
        </View>
      ) : null}
    </View>
  );
}
