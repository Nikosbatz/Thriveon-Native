import { useUserLogsStore } from "@/src/store/userLogsStore";
import { colors } from "@/src/theme/colors";
import moment from "moment";
import { Dimensions, View } from "react-native";
import CalendarStrip from "react-native-calendar-strip";
const screenWidthDp = Dimensions.get("screen").width;

type Props = {};

export default function CalendarView({}: Props) {
  const selectedDate = useUserLogsStore((s) => s.selectedDate);
  const setSelectedDate = useUserLogsStore((s) => s.setSelectedDate);

  return (
    <View
      style={{
        backgroundColor: colors.lvFoodCardBg,
        marginTop: 20,
        borderRadius: 20,
        padding: 5,
        width: screenWidthDp - 20,
        maxWidth: 450,
        alignSelf: "center",
      }}
    >
      <CalendarStrip
        style={{
          height: 80,
          maxWidth: 450,
        }}
        calendarColor={"#6d739e00"}
        calendarHeaderStyle={{ color: "white" }}
        dateNumberStyle={{ color: "rgb(255, 255, 255)" }}
        dateNameStyle={{ color: "rgb(255, 255, 255)" }}
        calendarAnimation={{ type: "parallel", duration: 500 }}
        iconLeftStyle={{ tintColor: "white" }}
        iconRightStyle={{ tintColor: "white" }}
        maxDate={moment().endOf("day")}
        datesWhitelist={[
          {
            start: moment().subtract(1, "year"), // user can scroll 1 year ago
            end: moment(), // today is the last available date
          },
        ]}
        disabledDateOpacity={0.4}
        highlightDateNumberStyle={{
          color: "orange",
        }}
        highlightDateNameStyle={{
          color: "orange",
        }}
        highlightDateContainerStyle={{
          backgroundColor: colors.lvPrimary20,
          width: 45,
          height: 45,
          borderRadius: 50,
        }}
        daySelectionAnimation={{
          type: "background",
          duration: 500,
          highlightColor: "white",
        }}
        onDateSelected={(date) => {
          // 'date' is a moment object
          const formattedDate = date.format("YYYY-MM-DD");
          setSelectedDate(formattedDate);
        }}
        selectedDate={moment(selectedDate, "YYYY-MM-DD")}
      />
    </View>
  );
}
