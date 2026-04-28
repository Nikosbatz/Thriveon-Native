import { colors } from "@/src/theme/colors";
import { Image, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HEADER_HEIGHT = 100;
type Props = {
  scrollY: SharedValue<number>;
};

export default function CustomHeader({ scrollY }: Props) {
  const insets = useSafeAreaInsets();
  // 2. Map scroll position to header Y-translation
  const headerAnimatedStyle = useAnimatedStyle(() => {
    // const translateY = interpolate(
    //   scrollY.value,
    //   [0, 0 + HEADER_HEIGHT - insets.top], // Start at 100, end at 170
    //   [0, -HEADER_HEIGHT], // Start at 0, end at -70
    //   Extrapolation.CLAMP,
    // );
    const opacity = interpolate(
      scrollY.value,
      [0, 0 + HEADER_HEIGHT - insets.top - 10],
      [1, 0], // Start solid, end invisible
      Extrapolation.CLAMP,
    );

    return {
      // transform: [{ translateY }],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.header,
        { paddingTop: insets.top + 5 },
        headerAnimatedStyle,
      ]}
    >
      <View>
        <View style={styles.headerContent}>
          <Image
            source={require("@/assets/images/logo_transparent.png")}
            style={{
              width: 50,
              height: 50,
            }}
          ></Image>
          <View>
            <Text variant="labelLarge" style={{ color: "white", fontSize: 21 }}>
              Thrive
              <Text
                variant="labelLarge"
                style={{ color: colors.lvPrimary, fontSize: 21 }}
              >
                on
              </Text>
            </Text>
            <Text style={{ color: "rgb(157, 157, 157)", fontSize: 12 }}>
              Track. Grow. Thriveon.
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    zIndex: 1000,
    justifyContent: "flex-end",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
    gap: 10,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});
