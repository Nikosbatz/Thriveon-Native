import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Toast from "react-native-toast-message";
import { setLogoutHandler } from "../api/authBridge";
import {
  authToken,
  getUserInfo,
  googleLogin,
  login,
  postEmailVerificationToken,
  postUserInfo,
  register,
} from "../api/requests";
import { useUserLogsStore } from "../store/userLogsStore";
import { useUserStore } from "../store/userStore";
import { UserInterface } from "../types";

type AuthContextType = {
  user: UserInterface | null;
  setUser: Dispatch<SetStateAction<UserInterface | null>>;
  userEmail: string;
  setUserEmail: Dispatch<SetStateAction<string>>;
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  signIn: (email: string, password: string) => Promise<void | null>;
  signUp: (email: string, password: string) => Promise<void | null>;
  logOut: () => Promise<void | null>;
  fetchUserInfo: () => Promise<void | null>;
  loadingUserInfo: boolean;
  updateUserInfo: (info: UserInterface) => void;
  verifyUserEmail: (verificationCode: string) => void;
  googleSignIn: (googleData: any) => void;
  splashScreenActive: boolean;
  autoLoginEnabled: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // States are set to false | null because
  const [user, setUser] = useState<UserInterface | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [loadingUserInfo, setLoadingUserInfo] = useState<boolean>(false);
  const [splashScreenActive, setSplashScreenActive] = useState<boolean>(false);
  const [autoLoginEnabled, setAutoLogiEnabled] = useState<boolean>(true);
  const resetLogsStore = useUserLogsStore((state) => state.resetLogs);
  const resetUserStore = useUserStore((state) => state.resetUser);

  // Auto Log in user if he has a token and fetchUserInfo
  // else do not do anything
  useEffect(() => {
    (async () => {
      setLoadingUserInfo(true);
      try {
        setSplashScreenActive(true);
        const accessToken = await SecureStore.getItemAsync("accessToken");
        if (accessToken) {
          await authToken();
          await fetchUserInfo();
          setIsLoggedIn(true);
        }

        // setTimeout(() => {
        //   setSplashScreenActive(false);
        // }, 700);
        setSplashScreenActive(false);
      } catch (err) {
        // ignore errors retrieving token
        setSplashScreenActive(false);
      } finally {
        setLoadingUserInfo(false);
      }
    })();
  }, []);

  // Set the logoutHandler to the logOut() function's reference
  // And keep the reference updated at all times through the [logOut] dependency
  // keep logout handler reference stable
  const logOut = useCallback(async () => {
    await SecureStore.deleteItemAsync("accessToken");
    resetLogsStore();
    resetUserStore();
    GoogleSignin.signOut();
    setIsLoggedIn(false);
  }, []);

  useEffect(() => {
    setLogoutHandler(logOut);
  }, [logOut]);

  const fetchUserInfo = useCallback(async () => {
    try {
      setLoadingUserInfo(true);
      const userData = await getUserInfo();
      setUser(userData);
      setLoadingUserInfo(false);
    } catch (error: any) {
      // Acts as Safeguard, if servers returns error then logOut
      setLoadingUserInfo(false);
      await logOut();
      Toast.show({
        type: "error",
        text1: error.message,
      });
    }
  }, [logOut]);

  const verifyUserEmail = useCallback(async (verificationCode: string) => {
    try {
      await postEmailVerificationToken(verificationCode);
      await fetchUserInfo();
      setIsLoggedIn(true);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }, []);

  const updateUserInfo = useCallback(async (info: Partial<UserInterface>) => {
    setLoadingUserInfo(true);

    try {
      const newUser = await postUserInfo(info);
      setUser(newUser);
      setLoadingUserInfo(false);
      return;
    } catch (error: any) {
      setLoadingUserInfo(false);
      // console.log(error.message);
      throw new Error(error.message);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      await register(email, password);
      //setIsLoggedIn(true);
      return;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const data = await login(email, password);
      setIsLoggedIn(true);
      setUser(data.user);
      // if user is verified re-direct to main screen
      // else re-direct to verification screen
      if (data.isVerified) {
        router.replace("/(tabs)");
      } else {
        setUserEmail(email);
        router.replace("/(auth)/verifyUser");
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }, []);

  const googleSignIn = useCallback(async (googleData: any) => {
    try {
      const data = await googleLogin(googleData);
      console.log(data);
      setIsLoggedIn(true);
      setUser(data.user);
      router.replace("/(tabs)");
    } catch (error: any) {
      throw new Error(error.message);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({
          signIn,
          signUp,
          user,
          isLoggedIn,
          setIsLoggedIn,
          logOut,
          setUser,
          userEmail,
          setUserEmail,
          fetchUserInfo,
          loadingUserInfo,
          updateUserInfo,
          verifyUserEmail,
          googleSignIn,
          splashScreenActive,
          autoLoginEnabled,
        }),
        [
          signIn,
          signUp,
          user,
          isLoggedIn,
          setIsLoggedIn,
          logOut,
          setUser,
          userEmail,
          setUserEmail,
          fetchUserInfo,
          loadingUserInfo,
          updateUserInfo,
          verifyUserEmail,
          googleSignIn,
          splashScreenActive,
          autoLoginEnabled,
        ],
      )}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthContextProvider");
  }
  return context;
}
