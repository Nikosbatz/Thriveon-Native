import { colors } from "@/src/theme/colors";
import { Search, Soup, Sparkles } from "lucide-react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableRipple } from "react-native-paper";

// Define the structure for our button items
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
  // Track which button is currently selected
  const [activeTab, setActiveTab] = useState<string>("search");

  const navItems: NavItem[] = [
    // { id: "barcode", label: "Barcode", icon: ScanBarcode },
    { id: "search", label: "Search", icon: Search },
    { id: "myFoods", label: "My foods", icon: Soup },
    { id: "quickadd", label: "Coming Soon", icon: Sparkles },
    // { id: "photo", label: "Photo", icon: Camera },
  ];

  return (
    <View style={styles.tabContainer}>
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = selectedTabId === item.id;

        return (
          <TouchableRipple
            key={item.id}
            style={styles.buttonWrapper}
            rippleColor={"#66c2b12a"}
            borderless
            onPress={() => setSelectedTabId(item.id)}
          >
            <View style={{ alignItems: "center" }}>
              {/* Icon Container with dynamic background */}
              <View
                style={[
                  styles.iconContainer,
                  isActive && styles.activeIconContainer,
                ]}
              >
                <IconComponent
                  size={22}
                  color={isActive ? colors.lvPrimaryLight : "#e0e0e0"}
                  strokeWidth={2}
                />
              </View>

              {/* Label text */}
              <Text style={[styles.label, isActive && styles.activeLabel]}>
                {item.label}
              </Text>
            </View>
          </TouchableRipple>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#66C2B1", // Matches the teal background color from your image
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // borderTopLeftRadius: 28,
    // borderTopRightRadius: 28,
    borderRadius: 20,
    // backgroundColor: "rgba(6, 29, 66, 0.32)",
    marginHorizontal: 5,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderColor: "#66c2b13b",
  },
  buttonWrapper: {
    justifyContent: "center",
    minWidth: 100,
    borderRadius: 30,
  },
  iconContainer: {
    width: 70,
    height: 35,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#333333", // Subtle grey border for inactive states
    marginBottom: 4,
    // backgroundColor: colors.lvGradientCard,
  },
  activeIconContainer: {
    backgroundColor: "#03576900", // Soft teal/green background tint for the active tab
    borderColor: colors.lvPrimary80,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4B5563", // Soft charcoal grey for inactive text
  },
  activeLabel: {
    color: "#ffffff", // Darker text for active tab
    fontWeight: "700",
  },
});
