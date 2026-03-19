import { useUserActivitiesStore } from "@/src/store/userActivitiesStore";
import { mainStyles } from "@/src/theme/styles";
import { LinearGradient } from "expo-linear-gradient";
import { Flame, Plus, Timer } from "lucide-react-native";
import { useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import ExerciseFormModal from "./ExerciseFormModal";

const SCREEN_WIDTH = Dimensions.get("window").width;
//TODO: Must subscribe to zustand store and take real data
export default function ExerciseTrackerCard() {
  const [modalVisible, setModalVisible] = useState(false);
  const activitiesDurationSum = useUserActivitiesStore(
    (s) => s.activitiesDurationSum,
  );
  const activitiesCaloriesSum = useUserActivitiesStore(
    (s) => s.activitiesCaloriesSum,
  );

  function handlePress() {
    setModalVisible(true);
  }
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{ flex: 1 }}
      onPress={handlePress}
    >
      <LinearGradient
        start={{ x: 0, y: 0.1 }}
        end={{ x: 1, y: 0.5 }}
        colors={["#ed4f1a", "#f6af7c"]}
        style={{
          padding: 7,
          gap: 15,
          backgroundColor: "rgba(244, 196, 107, 1)",
          borderRadius: 20,
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            justifyContent: "space-between",
          }}
        >
          <Text variant="headlineSmall" style={[mainStyles.cardTitleSmall]}>
            Exercise
          </Text>
          <Plus size={26} color={"white"} style={{ borderRadius: 8 }}></Plus>
        </View>
        <View style={{ gap: 5 }}>
          <View style={styles.infoContainer}>
            <Flame size={30} color={"white"} style={styles.infoIcon} />
            <Text variant="headlineSmall" style={styles.valueText}>
              {activitiesCaloriesSum}{" "}
              <Text style={styles.infoMetriUnitText}>cal</Text>
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Timer
              size={30}
              color={"rgba(255, 255, 255, 1)"}
              style={styles.infoIcon}
            />
            <Text variant="headlineSmall" style={styles.valueText}>
              {activitiesDurationSum}{" "}
              <Text style={styles.infoMetriUnitText}>min</Text>{" "}
            </Text>
          </View>
        </View>
      </LinearGradient>
      <ExerciseFormModal visible={modalVisible} setVisible={setModalVisible} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: "row",
    gap: 15,
  },
  valueText: {
    fontSize: 20,
    //fontWeight: "bold",
    color: "rgb(255, 255, 255)",
  },
  infoIcon: {
    // backgroundColor: "rgba(231, 158, 0, 1)",
    borderRadius: 8,
  },
  infoMetriUnitText: {
    color: "rgb(211, 210, 208)",
    fontSize: 16,
    //fontWeight: "bold",
  },
});
