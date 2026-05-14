import { create } from "zustand";
import {
  getUserActivities,
  postUserActivity as postUserActivityAPI,
} from "../api/requests";

type ActivityType = {
  activityType?: string;
  duration: number;
  calories: number;
};

type ActivityInputValues = {
  activityType?: string;
  duration: string;
  calories: string;
};

interface ActivityStore {
  activitiesLoading: boolean;
  userActivities: ActivityType[];
  activitiesCaloriesSum: number;
  activitiesDurationSum: number;
  fetchUserActivites: (date: string) => Promise<void>;
  postUserActivity: (
    activityValues: ActivityInputValues,
    date: string,
  ) => Promise<void>;
  calculateUserActivitiesSums: () => void;
}

export const useUserActivitiesStore = create<ActivityStore>((set, get) => ({
  activitiesLoading: false,
  userActivities: [],
  activitiesCaloriesSum: 0,
  activitiesDurationSum: 0,
  fetchUserActivites: async (date) => {
    try {
      set({ activitiesLoading: true });
      const data = await getUserActivities(date);
      set({
        userActivities: data.data,
        activitiesLoading: false,
      });
      get().calculateUserActivitiesSums();
    } catch (error) {
      throw new Error("Could not fetch user activities");
    }
  },
  postUserActivity: async (activityValues, date) => {
    set({ activitiesLoading: true });
    try {
      const activities = await postUserActivityAPI(activityValues, date);
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
