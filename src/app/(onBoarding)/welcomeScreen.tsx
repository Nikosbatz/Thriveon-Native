import WelcomeScreen from "@/src/components/onBoarding/WelcomeScreen";
import { useRouter } from "expo-router";

export default function OnBoardingScreen() {
  const router = useRouter();
  return <WelcomeScreen />;
}
