import { colors } from "@/src/theme/colors";
import { router } from "expo-router";
import { Barcode, Search, Soup } from "lucide-react-native";
import React, { Dispatch, SetStateAction } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableRipple } from "react-native-paper";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

type Props = {
  selectedTabId: string;
  setSelectedTabId: Dispatch<SetStateAction<string>>;
};

export default function ActionSelectionBar({
  selectedTabId,
  setSelectedTabId,
}: Props) {
  const navItems: NavItem[] = [
    { id: "search", label: "Search", icon: Search },
    { id: "myFoods", label: "My Foods", icon: Soup },
    { id: "barcodeScanner", label: "Barcode", icon: Barcode },
  ];

  function handleTabPress(itemId: string) {
    if (itemId === "barcodeScanner") {
      router.navigate("/calorieTracker/cameraScreen");
      return;
    }

    setSelectedTabId(itemId);
  }

  return (
    <View style={styles.tabContainer}>
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = selectedTabId === item.id;

        return (
          <View key={item.id} style={styles.buttonOuterContainer}>
            <TouchableRipple
              borderless
              rippleColor="rgba(102,194,177,0.15)"
              style={styles.buttonWrapper}
              onPress={() => handleTabPress(item.id)}
            >
              <View style={styles.innerContent}>
                <View
                  style={[
                    styles.iconContainer,
                    isActive && styles.activeIconContainer,
                  ]}
                >
                  <IconComponent
                    size={22}
                    strokeWidth={isActive ? 2.5 : 2}
                    color={
                      isActive
                        ? colors.lvPrimary80
                        : "rgba(231, 231, 231, 0.65)"
                    }
                  />
                </View>

                <Text style={[styles.label, isActive && styles.activeLabel]}>
                  {item.label}
                </Text>
              </View>
            </TouchableRipple>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#040c1d",
    borderRadius: 24,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginHorizontal: 16,
    borderWidth: 0,
    borderColor: "rgba(255,255,255,0.06)",
    shadowColor: "rgba(0, 191, 239, 0.29)",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 10,
  },

  buttonOuterContainer: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 18,
  },

  buttonWrapper: {
    paddingVertical: 2,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  innerContent: {
    alignItems: "center",
    justifyContent: "center",
  },

  iconContainer: {
    width: 60,
    padding: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 1,
  },

  activeIconContainer: {
    borderRadius: 20,
    backgroundColor: "rgba(15, 33, 42, 0.73)",
    borderWidth: 1,
    borderColor: "rgba(102, 142, 194, 0.25)",
    shadowColor: "rgb(159, 178, 251)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  label: {
    fontSize: 12,
    color: "rgba(255,255,255,0.55)",
    fontFamily: "QuickSandBold",
    letterSpacing: 0.3,
  },

  activeLabel: {
    color: "#FFFFFF",
    fontFamily: "QuickSandBold",
  },
});
