import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import Toast from "react-native-toast-message";
import { setLogoutHandler } from "../api/authBridge";
import { getUserInfo, login, postUserInfo, register } from "../api/requests";

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
};

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserInterface | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [loadingUserInfo, setLoadingUserInfo] = useState<boolean>(false);

  // Auto Log in user if he has a token
  useEffect(() => {
    const token = SecureStore.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Set the logoutHandler to the logOut() function's reference
  // And keep the reference updated at all times through the [logOut] dependency
  useEffect(() => {
    setLogoutHandler(logOut);
  }, [logOut]);

  async function fetchUserInfo() {
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
  }

  async function updateUserInfo(info: UserInterface) {
    setLoadingUserInfo(true);

    try {
      const newUser = await postUserInfo(info);
      setUser(newUser);
      setLoadingUserInfo(false);
      return;
    } catch (error) {
      setLoadingUserInfo(false);
      throw new Error("Could not update user information!");
    }
  }

  async function signUp(email: string, password: string) {
    try {
      await register(email, password);
      //setIsLoggedIn(true);
      router.replace("/(tabs)");
    } catch (error: any) {
      throw new Error(error.message);
    }
    return;
  }

  async function signIn(email: string, password: string) {
    try {
      const data = await login(email, password);
      setIsLoggedIn(true);

      // if user is verified re-direct to main screen
      // else re-direct to verification screen
      Toast.show({ type: "success", text1: data });
      if (data.isVerified) {
        router.replace("/(tabs)");
      } else {
        setUserEmail(email);
        router.replace("/(auth)/verifyUser");
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async function logOut() {
    await SecureStore.deleteItemAsync("token");
    setIsLoggedIn(false);
  }

  return (
    <AuthContext.Provider
      value={{
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
      }}
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
