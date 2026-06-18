import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const mainStyles = StyleSheet.create({
  dashboardCard: {
    backgroundColor: colors.lvFoodCardBg,
    // backgroundColor: "transparent",
    borderWidth: 0,
    borderColor: "rgb(40, 46, 58)",
    padding: 8,
    borderRadius: 20,
    // iOS shadow
    shadowColor: "#000000",
    shadowOffset: { width: 5, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    // Android shadow
    elevation: 10,
  },

  cardTitle: {
    marginStart: 10,
    fontSize: 20,
    color: "rgba(253, 253, 253, 1)",
  },
  cardTitleSmall: {
    marginStart: 10,
    fontSize: 15,
    color: "rgba(255, 255, 255, 1)",
  },
  headerTitleStyle: {
    color: colors.lvPrimaryLight,
    textAlign: "center",
    fontSize: 20,
  },
  stackHeaderStyle: {
    backgroundColor: colors.lvBackground,
  },
  mainContainer: {
    paddingBottom: 75,
  },
  foodCard: {
    backgroundColor: "rgba(38, 42, 59, 0.3)",
  },
  foodCardName: {
    fontSize: 14,
    color: "white",
    lineHeight: 23,
    fontFamily: "QuickSandSemiBold",
    // fontWeight: 700,
  },
  foodCardBrand: {
    fontSize: 13,
    color: "rgb(184, 184, 184)",
    lineHeight: 20,
  },
  foodCardCal: {
    color: "rgb(176, 176, 176)",
    fontSize: 12,
    fontFamily: "QuicksandRegular",
  },
});
