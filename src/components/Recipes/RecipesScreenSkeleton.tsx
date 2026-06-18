import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.65;

interface SkeletonSharedProps {
  style: ViewStyle | ViewStyle[];
}

// --- REUSABLE SHIMMER COMPONENT ---
const SkeletonShared: React.FC<SkeletonSharedProps> = ({ style }) => {
  const shimmerProgress = useSharedValue<number>(0);

  useEffect(() => {
    shimmerProgress.value = withRepeat(
      withTiming(1, { duration: 800 }),
      0, // how many loops
      false, // Do not reverse; restart from 0 each time for a sweeping effect
    );
  }, [shimmerProgress]);

  const animatedStyle = useAnimatedStyle(() => {
    // Dynamically translates the gradient shine across the item based on layout width
    const translateX = interpolate(
      shimmerProgress.value,
      [0, 1],
      [-width, width],
    );
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View style={[styles.baseSkeleton, style]}>
      <Animated.View style={[StyleSheet.absoluteFillObject, animatedStyle]}>
        <LinearGradient
          colors={["transparent", "rgba(255, 255, 255, 0.08)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
    </View>
  );
};

// --- MAIN SCREEN SKELETON ---
export default function RecipesSkeleton(): React.JSX.Element {
  const pills: number[] = [1, 2, 3, 4];
  const cards: number[] = [1, 2];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Title & Subtitle Skeleton */}
      <View style={styles.headerContainer}>
        <SkeletonShared style={styles.titleSkeleton} />
        <SkeletonShared style={styles.subtitleSkeleton} />
      </View>

      {/* Search Bar Skeleton */}
      <SkeletonShared style={styles.searchSkeleton} />

      {/* Filter Pills Skeleton */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.pillsContainer}
      >
        {pills.map((p) => (
          <SkeletonShared key={p} style={styles.pillSkeleton} />
        ))}
      </ScrollView>

      {/* Section 1: High Protein */}
      <SkeletonShared style={styles.sectionHeaderSkeleton} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalList}
      >
        {cards.map((c) => (
          <View key={c} style={styles.cardSkeleton}>
            <SkeletonShared style={styles.imageSkeleton} />
            <SkeletonShared style={styles.cardTextSkeleton1} />
            <SkeletonShared style={styles.cardTextSkeleton2} />
            <View style={styles.macrosSkeletonContainer}>
              <SkeletonShared style={styles.macroLine} />
              <SkeletonShared style={styles.macroLine} />
              <SkeletonShared style={styles.macroLine} />
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Section 2: Low Carbs */}
      <SkeletonShared style={styles.sectionHeaderSkeleton} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalList}
      >
        {cards.map((c) => (
          <View key={c} style={styles.cardSkeleton}>
            <SkeletonShared style={styles.imageSkeleton} />
            <SkeletonShared style={styles.cardTextSkeleton1} />
            <SkeletonShared style={styles.cardTextSkeleton2} />
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090F1D",
    paddingTop: 40,
  },
  baseSkeleton: {
    backgroundColor: "#1E293B", // Dark block background matching your UI element shapes
    overflow: "hidden", // Masks the sweeping animation to stay within the borders
  },
  headerContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  titleSkeleton: {
    width: "75%",
    height: 32,
    borderRadius: 8,
    marginBottom: 8,
  },
  subtitleSkeleton: {
    width: "60%",
    height: 16,
    borderRadius: 4,
  },
  searchSkeleton: {
    height: 50,
    borderRadius: 25,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  pillsContainer: {
    paddingLeft: 16,
    marginBottom: 30,
    flexDirection: "row",
  },
  pillSkeleton: {
    width: 90,
    height: 38,
    borderRadius: 20,
    marginRight: 10,
  },
  sectionHeaderSkeleton: {
    width: 140,
    height: 24,
    borderRadius: 4,
    marginLeft: 16,
    marginBottom: 16,
  },
  horizontalList: {
    paddingLeft: 16,
    marginBottom: 30,
  },
  cardSkeleton: {
    width: CARD_WIDTH,
    height: 280,
    backgroundColor: "#131C2E", // Slightly darker surface for the behind-card layout
    borderRadius: 24,
    marginRight: 16,
    padding: 12,
    overflow: "hidden",
  },
  imageSkeleton: {
    width: "100%",
    height: 140,
    borderRadius: 16,
    marginBottom: 12,
  },
  cardTextSkeleton1: {
    width: "85%",
    height: 18,
    borderRadius: 4,
    marginBottom: 8,
  },
  cardTextSkeleton2: {
    width: "50%",
    height: 14,
    borderRadius: 4,
    marginBottom: 20,
  },
  macrosSkeletonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    paddingBottom: 8,
  },
  macroLine: {
    width: "28%",
    height: 6,
    borderRadius: 3,
  },
});
