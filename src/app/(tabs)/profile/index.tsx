import MacroHealthGoalsCard from "@/src/components/profile/MacroHealthGoalsCard";
import MainCardGoal from "@/src/components/profile/MainGoalCard";
import { profileStyles } from "@/src/components/profile/profile.styles";
import { useAuth } from "@/src/context/authContext";
import { colors } from "@/src/theme/colors";
import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";

export default function ProfileScreen() {
  const { user } = useAuth();

  console.log(user);

  const mainInfo: mainInfoType[] = [
    { label: "Age", value: user?.age },
    { label: "Height", value: user?.height, unit: "cm" },
    { label: "Gender", value: user?.gender },
  ];

  return (
    <View style={profileStyles.container}>
      <ScrollView contentContainerStyle={profileStyles.mainScrollView}>
        {/* Image and Name Container */}
        <View style={profileStyles.imageContainer}>
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
              style={[
                profileStyles.card,
                { flexBasis: 0, flexGrow: 1, gap: 10 },
              ]}
            >
              <Text style={profileStyles.cardTitle}>{obj.label}</Text>
              <Text variant="labelLarge" style={profileStyles.smallCardValue}>
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
        {/* Main Goal Card  */}
        <MainCardGoal />
        {/* Macros and Health Goals Card */}
        <MacroHealthGoalsCard />
      </ScrollView>
    </View>
  );
}

type mainInfoType = {
  label: string;
  unit?: string;
  value: any;
};
