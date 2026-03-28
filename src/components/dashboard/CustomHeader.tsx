import { colors } from "@/src/theme/colors";
import { Image, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

const HEADER_HEIGHT = 100;
type Props = {
  scrollY: SharedValue<number>;
};

export default function CustomHeader({ scrollY }: Props) {
  // 2. Map scroll position to header Y-translation
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [50, 50 + HEADER_HEIGHT], // Start at 100, end at 170
      [0, -HEADER_HEIGHT], // Start at 0, end at -70
      Extrapolation.CLAMP,
    );
    // const opacity = interpolate(
    //   scrollY.value,
    //   [0, 100 + HEADER_HEIGHT],
    //   [1, 0], // Start solid, end invisible
    //   Extrapolation.CLAMP,
    // );

    return {
      transform: [{ translateY }],
      //   opacity,
    };
  });
  return (
    <Animated.View style={[styles.header, headerAnimatedStyle]}>
      <View>
        <View style={styles.headerContent}>
          <Image
            source={require("@/assets/images/logo_chat.png")}
            style={{
              width: 63,
              height: 37,
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
    height: HEADER_HEIGHT,
    backgroundColor: colors.lvBackground,
    zIndex: 1000,
    justifyContent: "flex-end",
    paddingBottom: 15,
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
