import { create } from "zustand";
import { getUserInfo, postUserInfo } from "../api/requests";

const initialState = {
  userProfile: null,
  loadingUser: true,
  isVerified: false,
  onBoardingCompleted: false,
  isUserNull: true,
};

export const useUserStore = create((set) => ({
  resetUser: () => {
    set(initialState);
  },
  loadUser: async () => {
    set({ loadingUser: true });
    try {
      const user = await getUserInfo();
      set({
        userProfile: user,
        loadingUser: false,
        isVerified: user.isVerified,
        onBoardingCompleted: user.onBoardingCompleted,
        isUserNull: false,
      });
    } catch (error) {
      set({
        loadingUser: false,
        userProfile: null,
        isVerified: false,
        onBoardingCompleted: false,
      });
    }
  },

  updateInfo: async (info) => {
    try {
      const newUser = await postUserInfo(info);
      set({
        userProfile: newUser,
      });
      return;
    } catch (error) {
      throw new Error("Could not update user information!");
    }
  },
}));
