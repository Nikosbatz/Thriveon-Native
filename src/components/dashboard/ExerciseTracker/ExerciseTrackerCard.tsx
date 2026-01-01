import { useUserActivitiesStore } from "@/src/store/userActivitiesStore";
import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
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
    (s) => s.activitiesDurationSum
  );
  const activitiesCaloriesSum = useUserActivitiesStore(
    (s) => s.activitiesCaloriesSum
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
      <View
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
          <Text
            variant="headlineSmall"
            style={[mainStyles.cardTitleSmall, { color: colors.lvBackground }]}
          >
            Exercise
          </Text>
          <Plus
            size={26}
            color={"white"}
            style={{ backgroundColor: "rgba(231, 158, 0, 1)", borderRadius: 8 }}
          ></Plus>
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
      </View>
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
    color: "rgba(57, 40, 0, 1)",
  },
  infoIcon: {
    backgroundColor: "rgba(231, 158, 0, 1)",
    borderRadius: 8,
  },
  infoMetriUnitText: {
    color: "rgba(183, 143, 0, 1)",
    fontSize: 16,
    //fontWeight: "bold",
  },
});
