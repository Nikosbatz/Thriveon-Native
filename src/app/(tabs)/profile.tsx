import { colors } from "@/src/theme/colors";
import BottomSheet, {
  BottomSheetView,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "@gorhom/bottom-sheet";
import { StyleSheet, View } from "react-native";
import { Divider, Text, TextInput } from "react-native-paper";
import Animated from "react-native-reanimated";

export default function ProfileScreen() {
  console.log("asdasd");

  return (
    <Animated.View
      // pointerEvents={sheetOpen ? "auto" : "none"}
      pointerEvents="box-none"
      style={{
        position: "absolute",
        height: SCREEN_HEIGHT,
        bottom: 0,
        width: SCREEN_WIDTH,
        backgroundColor: "blue",
      }}
    >
      <BottomSheet
        index={0}
        backgroundStyle={{
          backgroundColor: colors.lvBackground,
          elevation: 20,
        }}
        enablePanDownToClose
      >
        <BottomSheetView style={styles.contentContainer}>
          {/* Food Name and Calories Container */}
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text variant="headlineSmall" style={{ color: "white" }}>
                {"asdasd"}
              </Text>
              <Text
                variant="headlineSmall"
                style={{ fontSize: 20, color: "rgba(162, 162, 162, 1)" }}
              >
                cal{" "}
                <Text variant="headlineSmall" style={{ color: "white" }}>
                  {123}
                </Text>
              </Text>
            </View>
            <Divider style={styles.divider} />
          </View>
          {/* Picker and TextInput Container */}
          <View style={styles.flexRowView}>
            <View>
              <Text variant="labelLarge" style={{ color: "white" }}>
                Meal Type
              </Text>
            </View>
            <View>
              <Text variant="labelLarge" style={{ color: "white" }}>
                Quantity (Grams)
              </Text>
              <TextInput
                mode="outlined"
                keyboardType="number-pad"
                placeholder="Grams"
                style={styles.textInput}
                placeholderTextColor={colors.lightGrayText}
                textColor={"white"}
              ></TextInput>
            </View>
          </View>
          <View></View>
          <Divider style={styles.divider} />
          {/* Macros Values Container */}
        </BottomSheetView>
      </BottomSheet>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(0,0,0)",
  },
  contentContainer: {
    flex: 1,
    padding: 6,
    paddingHorizontal: 10,
    minHeight: SCREEN_HEIGHT - 300,
    gap: 15,
  },
  picker: {
    height: 51,
    width: SCREEN_WIDTH / 2 - 25,
    backgroundColor: colors.lvSecondary,
    color: "white",
  },
  textInput: {
    width: SCREEN_WIDTH / 2 - 25,
    height: 53,
    backgroundColor: colors.lvSecondary,
    fontSize: 18,
  },
  divider: {
    width: SCREEN_WIDTH - 20,
    marginVertical: 5,
    height: 1,
  },
  flexRowView: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "",
    width: "100%",
    justifyContent: "space-between",
  },
  macrosContainer: {
    // backgroundColor: "red",
    width: "100%",
    justifyContent: "space-around",
  },
  macroTextContainer: {
    alignItems: "center",
    flexDirection: "row",
    padding: 5,
    borderRadius: 10,
  },
});
