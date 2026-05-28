import React, { useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  TextStyle,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import { Text } from "react-native-paper";

interface TooltipProps {
  text: string;
  children: React.ReactElement;
  tooltipStyle?: ViewStyle;
  textStyle?: TextStyle;
}

export const Tooltip: React.FC<TooltipProps> = ({
  text,
  children,
  tooltipStyle,
  textStyle,
}) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [adjustedX, setAdjustedX] = useState(0); // Track clamped horizontal position
  const [arrowOffset, setArrowOffset] = useState(0); // Keep the arrow pointing accurately

  const targetRef = useRef<View>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { width: screenWidth } = useWindowDimensions(); // Destructure actual screen width

  // ESTIMATED WIDTH: Adjust this number if your tooltips have very long paragraphs
  const ESTIMATED_TOOLTIP_WIDTH = 180;
  const SCREEN_PADDING = 16; // Safe margin from phone edges

  const showTooltip = () => {
    if (targetRef.current) {
      targetRef.current.measureInWindow((x, y, width, height) => {
        setCoords({ x, y, width, height });

        // 1. Calculate the ideal center point
        const idealX = x + width / 2;

        // 2. Define minimum and maximum allowed X coordinates
        const minX = ESTIMATED_TOOLTIP_WIDTH / 2 + SCREEN_PADDING;
        const maxX =
          screenWidth - (ESTIMATED_TOOLTIP_WIDTH / 2 + SCREEN_PADDING);

        // 3. Clamp the X coordinate so it stays perfectly on screen
        const clampedX = Math.max(minX, Math.min(idealX, maxX));
        setAdjustedX(clampedX);

        // 4. If the tooltip was pushed left or right, offset the arrow so it still points to the button
        const shiftAmount = idealX - clampedX;
        setArrowOffset(shiftAmount);

        setVisible(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const hideTooltip = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const tooltipY = coords.y - 10; // Render right above the target component

  return (
    <>
      <View ref={targetRef} collapsable={false}>
        <Pressable onPress={showTooltip}>{children}</Pressable>
      </View>

      <Modal
        transparent
        visible={visible}
        animationType="none"
        onRequestClose={hideTooltip}
      >
        <Pressable style={styles.modalOverlay} onPress={hideTooltip}>
          <Animated.View
            style={[
              styles.tooltipContainer,
              tooltipStyle,
              {
                opacity: fadeAnim,
                top: tooltipY,
                left: adjustedX, // Clamped X position
                width: ESTIMATED_TOOLTIP_WIDTH,
                transform: [{ translateX: -ESTIMATED_TOOLTIP_WIDTH / 2 }], // Horizontal centering math
              },
            ]}
          >
            <Text
              variant="labelLarge"
              style={[
                styles.tooltipText,
                textStyle,
                { lineHeight: 18, fontSize: 13, fontWeight: 600 },
              ]}
              numberOfLines={2}
            >
              {text}
            </Text>

            {/* Dynamic Arrow */}
            <View
              style={[
                styles.arrowDown,
                { transform: [{ translateX: arrowOffset }] }, // 👈 Moves arrow back over the center of the trigger button
              ]}
            />
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  tooltipContainer: {
    position: "absolute",
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
    // borderWidth: 1,
    // borderColor: "rgb(9, 186, 235)",
    alignItems: "center",
    justifyContent: "center",
  },
  tooltipText: {
    color: "#212121",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
  arrowDown: {
    position: "absolute",
    bottom: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#ffffff",
  },
});
