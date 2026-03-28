import { useUserActivitiesStore } from "@/src/store/userActivitiesStore";
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
      <View
        style={[
          mainStyles.card,
          {
            gap: 15,
            flex: 1,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            justifyContent: "space-between",
          }}
        >
          <Text variant="headlineSmall" style={[mainStyles.cardTitleSmall]}>
            EXERCISE
          </Text>
          <Plus
            size={26}
            color={"rgb(254, 254, 254)"}
            style={{ borderRadius: 8 }}
          ></Plus>
        </View>
        <View style={{ gap: 5 }}>
          <View style={styles.infoContainer}>
            <Flame size={26} color={"#F97316"} style={styles.infoIcon} />
            <Text variant="headlineSmall" style={styles.valueText}>
              {activitiesCaloriesSum}{" "}
              <Text style={styles.infoMetriUnitText}>cal</Text>
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Timer size={26} color={"#F97316"} style={styles.infoIcon} />
            <Text variant="headlineSmall" style={styles.valueText}>
              {activitiesDurationSum}{" "}
              <Text style={styles.infoMetriUnitText}>min</Text>{" "}
            </Text>
          </View>
        </View>
      </View>
      {/* </LinearGradient> */}
      <ExerciseFormModal visible={modalVisible} setVisible={setModalVisible} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: "row",
    gap: 8,
  },
  valueText: {
    fontSize: 19,
    //fontWeight: "bold",
    color: "rgb(255, 255, 255)",
  },
  infoIcon: {
    borderRadius: 8,
    alignSelf: "center",
  },
  infoMetriUnitText: {
    color: "rgb(211, 210, 208)",
    fontSize: 15,
    //fontWeight: "bold",
  },
});
