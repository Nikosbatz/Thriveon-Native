import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const mainStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.lvGradientCard,
    borderRadius: 20,
    marginTop: 10,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    // Android shadow
    elevation: 8,
  },
  cardTitle: {
    marginStart: 10,
    fontSize: 20,
    color: "rgba(253, 253, 253, 1)",
  },
  cardTitleSmall: {
    marginStart: 10,
    fontSize: 17,
    color: "rgba(255, 255, 255, 1)",
  },
});
