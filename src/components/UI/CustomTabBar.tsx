import { colors } from "@/src/theme/colors";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { StyleSheet, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View
      style={{
        backgroundColor: "rgba(30, 40, 52, 0.95)",
        borderWidth: 0,
        borderColor: "rgb(25, 28, 31)",
        position: "absolute",
        bottom: 10,
        width: "90%",
        alignSelf: "center",
        padding: 3,
        borderRadius: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const Icon = options.tabBarIcon;

          // Resolve label and icon
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const renderIcon = options.tabBarIcon;
          const CustomButton = options.tabBarButton;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          if (CustomButton) {
            return (
              <View key={route.key} style={{ flex: 1 }}>
                <CustomButton
                  onPress={onPress}
                  {...options} // Pass down options like focused, etc.
                />
              </View>
            );
          }

          return (
            <TouchableRipple
              key={index}
              onPress={onPress}
              // Use a dynamic ripple color based on your theme
              rippleColor="rgba(84, 98, 103, 0.52)"
              borderless
              style={{ borderRadius: 50, padding: 3, flex: 1 }}
            >
              <View style={{ alignItems: "center" }}>
                {renderIcon &&
                  renderIcon({
                    focused: isFocused,
                    color: isFocused ? colors.lvPrimary : "gray",
                    size: 23,
                  })}

                <Text
                  variant="labelLarge"
                  style={{
                    color: isFocused ? "#fff" : "#666",
                    fontWeight: isFocused ? "600" : "400",
                    fontSize: 11,
                  }}
                >
                  {typeof label === "string" ? label : route.name}
                </Text>
              </View>
            </TouchableRipple>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
