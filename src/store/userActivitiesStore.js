import { create } from "zustand";
import { getUserActivities, postUserActivity } from "../api/requests";

export const useUserActivitiesStore = create((set, get) => ({
  activitiesLoading: false,
  userActivities: [],
  fetchUserActivites: async () => {
    try {
      set({ activitiesLoading: true });
      const data = await getUserActivities();
      console.log(data);
      set({
        userActivities: data.data,
        activitiesLoading: false,
      });
    } catch (error) {
      console.log("Could not fetch user activities");
    }
  },
  postUserActivity: async (activityValues) => {
    set({ activitiesLoading: true });
    try {
      const activities = await postUserActivity(activityValues);
      console.log(activities);
      set({ activitiesLoading: false, userActivities: activities });
    } catch (error) {
      set({ activitiesLoading: false });
    }
  },
}));
