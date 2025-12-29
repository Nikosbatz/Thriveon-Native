import { create } from "zustand";
import {
  getUserActivities,
  postUserActivity as postUserActivityAPI,
} from "../api/requests";

export const useUserActivitiesStore = create((set, get) => ({
  activitiesLoading: false,
  userActivities: [],
  activitiesCaloriesSum: 0,
  fetchUserActivites: async () => {
    try {
      set({ activitiesLoading: true });
      const data = await getUserActivities();
      set({
        userActivities: data.data,
        activitiesLoading: false,
      });
      get().calculateUserActivitiesCalories();
    } catch (error) {
      throw new Error("Could not fetch user activities");
    }
  },
  postUserActivity: async (activityValues) => {
    set({ activitiesLoading: true });
    try {
      const activities = await postUserActivityAPI(activityValues);
      console.log(activities);
      set({ activitiesLoading: false, userActivities: activities });
    } catch (error) {
      set({ activitiesLoading: false });
    }
  },
  calculateUserActivitiesCalories: () => {
    const { userActivities } = get();
    let calories = 0;
    for (let activity of userActivities) {
      calories += activity.calories;
    }
    set({ activitiesCaloriesSum: calories });
  },
}));
