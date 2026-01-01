import { create } from "zustand";
import {
  getUserActivities,
  postUserActivity as postUserActivityAPI,
} from "../api/requests";

export const useUserActivitiesStore = create((set, get) => ({
  activitiesLoading: false,
  userActivities: [],
  activitiesCaloriesSum: 0,
  activitiesDurationSum: 0,
  fetchUserActivites: async () => {
    try {
      set({ activitiesLoading: true });
      const data = await getUserActivities();
      set({
        userActivities: data.data,
        activitiesLoading: false,
      });
      get().calculateUserActivitiesSums();
    } catch (error) {
      console.log(error);
      throw new Error("Could not fetch user activities");
    }
  },
  postUserActivity: async (activityValues) => {
    set({ activitiesLoading: true });
    try {
      const activities = await postUserActivityAPI(activityValues);
      console.log(activities);
      set({ activitiesLoading: false, userActivities: activities });
      get().calculateUserActivitiesSums();
    } catch (error) {
      set({ activitiesLoading: false });
      throw new Error("Could not log the activity!");
    }
  },
  calculateUserActivitiesSums: () => {
    const { userActivities } = get();
    let caloriesSum = 0;
    let durationSum = 0;
    for (let activity of userActivities) {
      caloriesSum += activity.calories;
      durationSum += activity.duration;
    }
    set({
      activitiesCaloriesSum: caloriesSum,
      activitiesDurationSum: durationSum,
    });
  },
}));
