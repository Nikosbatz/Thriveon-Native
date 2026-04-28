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
        backgroundColor: "rgba(0, 0, 0, 0.86)",
        borderWidth: 0,
        borderColor: "rgb(25, 28, 31)",
        position: "absolute",
        bottom: 5,
        width: "90%",
        alignSelf: "center",
        padding: 5,
        paddingVertical: 8,
        borderRadius: 30,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 0,
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
              rippleColor="rgba(164, 165, 165, 0.36)"
              borderless
              style={{ borderRadius: 30, padding: 0, flex: 1 }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "flex-end",
                  flex: 1,
                  // backgroundColor: isFocused
                  //   ? colors.lvPrimaryLight
                  //   : "transparent",
                  backgroundColor: "transparent",
                }}
              >
                {renderIcon &&
                  renderIcon({
                    focused: isFocused,
                    color: isFocused ? "white" : "gray",
                    size: 23,
                  })}

                <Text
                  variant="labelLarge"
                  style={{
                    color: isFocused ? "white" : "#666",
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
