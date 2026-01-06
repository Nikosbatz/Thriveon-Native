import { colors } from "@/src/theme/colors";
import { StyleSheet } from "react-native";

export const profileStyles = StyleSheet.create({
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
    fontSize: 18,
  },
  smallCardValue: {
    color: "white",
    fontSize: 22,
    lineHeight: 25,
  },
});
