import { colors } from "@/src/theme/colors";
import { CameraView, useCameraPermissions } from "expo-camera";
import { CheckCircle } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

export default function BarcodeScanner() {
  const [scanned, setScanned] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [fetchingFood, setFetchingFood] = useState(false);
  const [scannerCounter, setScannerCounter] = useState(0);
  const [dataFreq, setDataFreq] = useState<Record<string, number>>({});
  const [permission, requestPermission] = useCameraPermissions();

  const overlayColor = "rgba(0, 0, 0, 0.3)";

  if (!permission?.granted) {
    requestPermission();
  }

  function handlebarcodeScanned(data: { data: string }) {
    setScannerCounter((prev) => prev + 1);
    const value = data["data"];
    setDataFreq({
      ...dataFreq,
      [value]: dataFreq[value] ? dataFreq[value] + 1 : 1,
    });

    // Find the value with the maximum frequency
    if (scannerCounter > 20) {
      const maxKey = Object.entries(dataFreq).reduce((max, curr) =>
        curr[1] < max[1] ? curr : max,
      );
      console.log(maxKey[0]);
      setScannedBarcode(maxKey[0]);
      setFetchingFood(true);
    }
  }

  console.log("adsada");
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

      <View
        style={{
          position: "absolute",
          width: "80%",
          height: "10%",
          backgroundColor: "transparent",
          alignSelf: "center",
          borderWidth: 0,
          borderRadius: 10,
          borderColor: "rgb(27, 20, 20)",
        }}
      ></View>
      <View
        style={{
          backgroundColor: overlayColor,
          position: "absolute",
          width: "100%",
          top: 0,
          height: "45%",
        }}
      ></View>
      <View
        style={{
          backgroundColor: overlayColor,
          position: "absolute",
          width: "100%",
          bottom: 0,
          height: "45%",
        }}
      ></View>
      <View
        style={{
          backgroundColor: overlayColor,
          position: "absolute",
          width: "10%",
          left: 0,
          height: "10%",
        }}
      ></View>
      <View
        style={{
          backgroundColor: overlayColor,
          position: "absolute",
          width: "10%",
          right: 0,
          height: "10%",
        }}
      ></View>
      {/* Overlay Appearing after a barcode is scanned */}
      {fetchingFood ? (
        <View
          style={{
            position: "absolute",
            alignSelf: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: colors.lvBackground,
            gap: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Text
              variant="labelLarge"
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 25,
                lineHeight: 25,
              }}
            >
              Barcode scanned
            </Text>
            <CheckCircle size={35} color={"green"} />
          </View>
          <ActivityIndicator
            style={{}}
            size={50}
            color={colors.lvPrimaryLight}
          />
          <Text
            variant="labelLarge"
            style={{
              color: "rgba(250, 250, 250, 0.74)",
              alignSelf: "center",
              fontSize: 20,
              lineHeight: 22,
            }}
          >
            Loading your food...{scannedBarcode}
          </Text>
        </View>
      ) : null}
      <Text
        style={{ backgroundColor: "red" }}
        onPress={() => handlebarcodeScanned({ data: "123123123123" })}
      >
        adasdas
      </Text>
    </View>
  );
}
