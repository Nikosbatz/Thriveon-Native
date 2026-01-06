import EditUserInfo from "@/src/components/profile/EditUserInfoScreen/EditUserInfo";
import { useAuth } from "@/src/context/authContext";

export default function EditUserInfoScreen() {
  const { user } = useAuth();

  return <EditUserInfo />;
}
