import ProgressBar from "@/src/components/UI/ProgressBar";
import { useAuth } from "@/src/context/authContext";
import { colors } from "@/src/theme/colors";
import { TrendingDown } from "lucide-react-native";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function ProfileScreen() {
  const { user } = useAuth();

  console.log(user);

  const mainInfo: mainInfoType[] = [
    { label: "Age", value: user?.age },
    { label: "Height", value: user?.height, unit: "cm" },
    { label: "Gender", value: user?.gender },
  ];

  let filledColor = colors.lvPrimary;
  if (user) {
    if (user?.weight > user?.healthGoals.weight) {
      filledColor = "rgba(255, 149, 0, 1)";
    } else if (user?.weight === user?.healthGoals.weight) {
      filledColor = "rgba(93, 236, 45, 1)";
    } else {
      filledColor = colors.lvPrimary;
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.mainScrollView}>
        {/* Image and Name Container */}
        <View style={styles.imageContainer}>
          {/* <Image
            source={require("@/assets/images/react-logo.png")}
            style={{
              width: "80%",
              height: "80%",
              backgroundColor: "black",
              borderRadius: 100,
              alignSelf: "center",
            }} // or .jpg
          /> */}
          <Text
            variant="headlineSmall"
            style={{ color: "white", textAlign: "center", fontSize: 20 }}
          >
            {user?.email}
          </Text>
        </View>
        {/* Main User Info (3-card Layout) */}
        <View
          style={{
            flexDirection: "row",
            gap: 10,
          }}
        >
          {mainInfo.map((obj, index) => (
            <View
              key={index}
              style={[styles.card, { flexBasis: 0, flexGrow: 1, gap: 10 }]}
            >
              <Text style={styles.cardTitle}>{obj.label}</Text>
              <Text variant="labelLarge" style={styles.smallCardValue}>
                {obj.value}
                {obj.unit ? (
                  <Text
                    style={{
                      color: colors.lightGrayText,
                      fontSize: 18,
                    }}
                  >
                    {" "}
                    {obj.unit}
                  </Text>
                ) : null}
              </Text>
            </View>
          ))}
        </View>
        {/* Current User Goal */}
        <View style={[styles.card, { borderColor: colors.lvPrimary50 }]}>
          <Text
            variant="headlineSmall"
            style={{ color: colors.lvPrimaryLight, fontSize: 18 }}
          >
            Main Goal
          </Text>
          <Text variant="headlineSmall" style={{ color: "white" }}>
            {goals[Number(user?.goal)]}
          </Text>
          {/* Texts above ProgressBar */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
              marginTop: 8,
            }}
          >
            <Text variant="labelLarge" style={{ color: colors.lightGrayText }}>
              Weight:{" "}
              <Text style={{ color: colors.lvPrimary, fontSize: 20 }}>
                {user?.weight}
              </Text>
              kg
            </Text>
            <Text
              variant="labelLarge"
              style={{ color: colors.lightGrayText, lineHeight: 22 }}
            >
              Goal:
              <Text
                style={{
                  color: colors.lvPrimary,
                  fontSize: 20,
                }}
              >
                {" "}
                {user?.healthGoals.weight}
              </Text>
              Kg
            </Text>
          </View>
          <ProgressBar
            width={SCREEN_WIDTH - 50}
            height={5}
            unfilledColor={colors.primary20}
            filledColor={filledColor}
            currentValue={user?.weight ?? 0}
            targetValue={user ? user.healthGoals.weight : 0}
          />

          <View
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              width: 50, // Define a fixed size
              height: 50,
              borderRadius: 25, // Half of width/height for a perfect circle
              borderWidth: 1,
              borderColor: colors.lvPrimary,
              backgroundColor: colors.lvPrimary20,
              justifyContent: "center", // Centers the icon vertically
              alignItems: "center", // Centers the icon horizontally
            }}
          >
            <TrendingDown size={30} color={colors.lvPrimary} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const goals = ["Lose Weight", "Gain Mass", "Maintain Weight"];

type mainInfoType = {
  label: string;
  unit?: string;
  value: any;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lvBackground,
  },
  mainScrollView: {
    gap: 10,
    paddingHorizontal: 10,
  },
  imageContainer: {
    // backgroundColor: "rgba(67, 67, 67, 1)",
    alignSelf: "center",
    width: "100%",
    gap: 10,
    marginTop: 20,
  },
  card: {
    borderRadius: 20,
    backgroundColor: colors.lvGradientCard,
    borderWidth: 1,
    borderColor: "rgba(74, 74, 74, 1)",
    padding: 15,
  },
  cardTitle: {
    color: colors.lvPrimaryLight,
  },
  smallCardValue: {
    color: "white",
    fontSize: 22,
    lineHeight: 25,
  },
});
