import { colors } from "@/src/theme/colors";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.87)",
        borderWidth: 0,
        borderColor: "rgb(25, 28, 31)",
        position: "absolute",
        bottom: insets.bottom + 5,
        width: "90%",
        alignSelf: "center",
        padding: 5,
        paddingVertical: 5,
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
              style={{
                borderRadius: 30,
                paddingTop: 4,
                paddingBottom: 0,
                flex: 1,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "flex-end",
                  flex: 1,
                  backgroundColor: "transparent",
                }}
              >
                <TabIndicator isFocused={isFocused} />

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

interface IndicatorProps {
  isFocused: boolean;
}

export function TabIndicator({ isFocused }: IndicatorProps) {
  const widthValue = useSharedValue(0);

  useEffect(() => {
    // Grows to 20 when focused, shrinks to 0 when blurred
    widthValue.value = withTiming(isFocused ? 25 : 0, {
      duration: 250,
    });
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: widthValue.value,
    };
  });

  return <Animated.View style={[styles.indicator, animatedStyle]} />;
}

const styles = StyleSheet.create({
  indicator: {
    position: "absolute",
    top: -3,
    backgroundColor: colors.lvPrimary,
    height: 3,
    borderRadius: 10,
    alignSelf: "center", // Keeps the growing animation perfectly centered
  },
});
